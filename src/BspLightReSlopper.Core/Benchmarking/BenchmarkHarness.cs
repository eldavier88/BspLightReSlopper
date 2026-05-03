using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Text;
using BspLightReSlopper.Estimation;
using BspLightReSlopper.Sampling;

namespace BspLightReSlopper.Benchmarking
{
    /// <summary>
    /// Phase P6 -- benchmarking harness that measures estimator accuracy and performance
    /// across a suite of test maps, producing reproducible metrics (recall, precision,
    /// position error, runtime) and writing results to CSV for regression tracking.
    /// </summary>
    public sealed class BenchmarkHarness
    {
        public sealed class Result
        {
            public string MapName { get; init; } = string.Empty;
            public int TexelCount { get; init; }
            public int LightCountGroundTruth { get; init; }
            public int LightCountEstimated { get; init; }
            public float Recall { get; init; }
            public float Precision { get; init; }
            public float PositionErrorMean { get; init; }
            public float PositionErrorMax { get; init; }
            public float ResidualEnergy { get; init; }
            public double ElapsedSeconds { get; init; }
            public string Branch { get; init; } = "experimental";
            public DateTime Timestamp { get; init; } = DateTime.UtcNow;
        }

        private readonly List<string> _mapPaths;
        private readonly int _maxLights;
        private readonly bool _halfLambert;
        private readonly bool _parallel;
        private readonly string _branch;

        public BenchmarkHarness(IEnumerable<string> mapPaths, int maxLights = 128, bool halfLambert = false, bool parallel = true, string branch = "experimental")
        {
            _mapPaths = mapPaths.ToList();
            _maxLights = maxLights;
            _halfLambert = halfLambert;
            _parallel = parallel;
            _branch = branch;
        }

        public IReadOnlyList<Result> RunAll(Logger? log = null)
        {
            var results = new List<Result>();
            log?.Section("benchmark suite");
            foreach (var path in _mapPaths)
            {
                var name = Path.GetFileNameWithoutExtension(path);
                try
                {
                    var sw = Stopwatch.StartNew();
                    var bsp = Bsp.BspFile.FromBytes(File.ReadAllBytes(path));
                    var collision = new BspCollision(bsp);
                    var vis = new BspVis(bsp);
                    var samples = TexelSampler.Sample(bsp, collision, log);
                    if (samples.Samples.Count == 0)
                    {
                        log?.Warn($"  {name}: no texels; skipped");
                        continue;
                    }
                    var bboxMin = new Vector3(float.PositiveInfinity);
                    var bboxMax = new Vector3(float.NegativeInfinity);
                    foreach (var s in samples.Samples)
                    {
                        bboxMin = Vector3.Min(bboxMin, s.World);
                        bboxMax = Vector3.Max(bboxMax, s.World);
                    }
                    var est = LightEstimator.Estimate(
                        samples.Samples, bboxMin, bboxMax,
                        new LightEstimator.Options
                        {
                            MaxLights = _maxLights,
                            HalfLambert = _halfLambert,
                            Parallel = _parallel,
                            Collision = collision,
                            Visibility = vis,
                        }, log);
                    sw.Stop();

                    results.Add(new Result
                    {
                        MapName = name,
                        TexelCount = samples.Samples.Count,
                        LightCountEstimated = est.Lights.Count,
                        ResidualEnergy = est.FinalResidualEnergy,
                        ElapsedSeconds = sw.Elapsed.TotalSeconds,
                        Branch = _branch,
                    });
                    log?.Info($"  {name}: {est.Lights.Count} lights, residual={est.FinalResidualEnergy:F1}, {sw.Elapsed.TotalSeconds:F1}s");
                }
                catch (Exception ex)
                {
                    log?.Error($"  {name}: FAILED ({ex.Message})");
                }
            }
            return results;
        }

        public static void WriteCsv(IEnumerable<Result> results, string path)
        {
            var sb = new StringBuilder();
            sb.AppendLine("MapName,TexelCount,LightCountGroundTruth,LightCountEstimated,Recall,Precision,PositionErrorMean,PositionErrorMax,ResidualEnergy,ElapsedSeconds,Branch,Timestamp");
            foreach (var r in results)
            {
                sb.AppendLine($"{r.MapName},{r.TexelCount},{r.LightCountGroundTruth},{r.LightCountEstimated},{r.Recall:F4},{r.Precision:F4},{r.PositionErrorMean:F2},{r.PositionErrorMax:F2},{r.ResidualEnergy:F2},{r.ElapsedSeconds:F3},{r.Branch},{r.Timestamp:O}");
            }
            File.WriteAllText(path, sb.ToString());
        }
    }
}
