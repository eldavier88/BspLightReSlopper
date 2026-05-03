# BspLightReSlopper

Reverse-engineer the original `light` entity positions, colors and intensities from a baked
Quake III / Jedi Outcast / Jedi Academy `.bsp` file by inspecting its lightmaps and
draw-surface geometry, and emit them as a Quake-style `.ent` file.

CPU-only, .NET 5.0, single CLI binary `bsplrs`. No GPU / CUDA / OpenCL.

## Quick start

```
bsplrs estimate --bsp foo.bsp
```

That's the entire user-facing workflow. Every other flag is optional tuning. Sophisticated
defaults run automatically:

- Half-Lambert vs Lambert is auto-detected from the lightmap byte distribution.
- Light count is auto-derived from BSP room flood-fill (`RoomDetector`).
- Greedy L0 light-count minimisation runs by default (override with `--no-minimize-lights`).
- Photometric coordinate-descent refinement runs by default (override with `--no-refine-lights`).
- Bounce-fit false positives are dropped by default (override with `--no-bounce-suppress`).
- Sun detection runs by default (override with `--no-sun`).

No recompilation is performed in the normal workflow — `bsplrs` is a pure-analysis tool.
You do **not** need q3map2, `BSPLRS_*` env vars, an SDK, or any other companion binary.

## All `estimate` flags

```
bsplrs estimate --bsp <path | path.pk3!maps/foo.bsp>
                [--assets <asset-dir>]                    optional, improves bounce suppression
                [-o <out.ent>] [--log <log>]
                [--max-samples N] [--pivots N] [--max-lights N] [--seed N]
                [--minimize-lights-tolerance F] [--refine-passes N] [--refine-step U]
                [--no-half-lambert] [--no-minimize-lights] [--no-refine-lights]
                [--no-vis] [--no-bounce-suppress] [--no-classify] [--no-sun]
                [--emit-sky-shader]
```

Developer-only flags (NOT REQUIRED for normal use):

```
                [--dev-validate N --map <src.map> --q3map2 <exe> --base-path <dir>
                 [--game jk2|ja|quake3] [--refine-timeout-mins N]]
```

The `--dev-validate` path is used by the algorithm author during development to score
iterations against ground-truth recompiles. It is irrelevant to normal users — see
[docs/metrics.md](docs/metrics.md#recompilerefiner-closed-loop-look-the-same) for what
it does and why you almost certainly don't want to run it.

Inputs:
- `--bsp` — either a loose `.bsp` file path, or `archive.pk3!maps/foo.bsp` to read from inside
  a `.pk3`. **This is the only required argument.**
- `--assets` — *(optional)* folder containing the game's `.pk3` archives (and/or loose `maps/`,
  `scripts/`, `textures/` folders). Used to improve bounce-suppression accuracy by resolving
  material albedo. When omitted, the estimator falls back to a curated shader-name keyword
  table that still drops blatant bounce-fit false positives (e.g. magenta light on a
  magenta-named surface) — see `BounceSuppressor.ShaderNameAlbedoGuess`.
- All other flags are optional; sensible defaults are auto-detected from the BSP geometry.

Outputs:
- `<bsp>.ent` — Quake-style `.map` entity blocks for every estimated `light`, with the standard
  `classname / origin / _color / light` keys plus debug keys
  `_method / _confidence / _supportingTexels / _residualEnergyExplainedFraction`. A leading
  block of `// ...` comments carries the inferred compile settings the estimator detected
  (gamma, overbright, lightmap scale, sample size, bounce on/off).
- `<bsp>.log` — verbatim mirror of every line printed to the console during processing
  (status messages, per-round acceptance/rejection, statistics, runtime).

Example end-to-end on a Jedi Outcast base map:

```
bsplrs estimate --assets E:\jk2-assets --bsp E:\jk2-assets\maps\kejim_post.bsp
```

## Other commands

```
bsplrs verify       --assets <asset-dir> [--maps a,b,c] [--no-vis]
                    [--match-tolerance U] [--out <dir>]
                    Runs the estimator across many BSPs, scores against ground-truth
                    lights, prints a per-map + aggregate accuracy table.

bsplrs inspect-bsp  --assets <asset-dir> --bsp <path>
                    [--dump-surfaces] [--dump-lightmap]
                    Prints lump statistics, surface-type breakdown, ground-truth count.

bsplrs scatter      --map <src.map> --bsp <src.bsp> --out <scatter.map>
                    [--count N] [--seed N] [--clearance U]
                    [--min-intensity I] [--max-intensity I]
                    [--colored-fraction F] [--linear-fraction F] [--spot-fraction F]
                    Strips lights from a .map and re-populates with N validated random
                    lights of varied colour/falloff. Used by `train`.

bsplrs train        --source-map <src.map> --base-path <fs_basepath>
                    --q3map2 <q3map2.exe> --out <dir>
                    [--rounds N] [--seed N] [--lights N]
                    [--match-tolerance U] [--timeout SECS] [--game jk2|ja|quake3]
                    Phase B refinement loop: scatter → recompile → estimate → score
                    against the recompiled BSP's preserved ground truth → CSV per
                    round. Used to tune the estimator across compile-setting matrices.

bsplrs converge     --assets <dir> --base-path <fs_basepath> --q3map2 <q3map2.exe>
                    [--resources <dir>] [--maps-index jk2-sdk-maps.txt] [--out <dir>]
                    [--iterate N] [--iterate-step U]
                    Estimate from each reference BSP, inject lights into SDK .maps,
                    recompile with inferred settings, write convergence.md (perceptual loss).
                    With --iterate, runs RecompileRefiner: closed-loop intensity/position
                    nudges minimising perceptual MSE across N recompiles per map (the
                    "match the look" optimisation; keeps best iteration's lights).

bsplrs estimate ...  Default pipeline runs minimise-lights + photometric refine
                     automatically. See "Quick start" above for the user-facing workflow;
                     all `--no-*` opt-out flags and the developer-only `--dev-validate`
                     are documented in the "All `estimate` flags" section.

bsplrs dump-samples / build-synthetic-map — see bsplrs help
```

**Metrics:** recall, precision, perceptual MSE, and related terms are explained for non-specialists in [docs/metrics.md](docs/metrics.md).

## Crucial rule: no light entities ⇒ unusable for verification

A BSP whose entity lump contains **zero `light` entities** (and no `_sun_*` worldspawn keys)
is treated by `verify` and `train` as **ground-truth-unusable**, *not* as "the right answer is
0 lights". Many compilers — notably stock q3a release maps — strip `light` entities post-
compile, and a lights-removed map is indistinguishable from a genuinely lightless one.
`verify` skips such maps with a clear reason; if every discovered map turns out unusable, it
exits non-zero rather than silently reporting 100% recall on an empty set.

`estimate` will still happily run on such a BSP — it just can't compare against ground truth.

## Supported BSP formats

| Format     | Game                                                          | Stages | Verification |
|------------|---------------------------------------------------------------|--------|--------------|
| `IBSP` v46 | Quake 3 Arena, q3-engine games                                | 1      | not used     |
| `RBSP` v1  | Jedi Outcast, Jedi Academy, Soldier of Fortune 2              | 4      | **primary**  |

Adding another `(magic, version)` is a one-class change in
`src/BspLightReSlopper/Bsp/Formats/`. Q3A maps are read-only because they typically ship with
their `light` entities stripped at compile time, so they can't validate the estimator. **Jedi
Outcast base maps preserve their light entities and are the verification dataset.**

## Pre-release downloads

Automated pre-release builds are published to [GitHub Releases](https://github.com/eldavier88/BspLightReSlopper/releases)
on every push to `main`, tagged `v<version>-alpha.<run_number>`. Older pre-releases are
preserved (never deleted) so you can pick any commit's binary.

Each release includes framework-dependent single-file binaries (a few MB each) for:

| RID | OS / arch |
|---|---|
| `bsplrs-…-win-x64.exe`   | Windows x64 |
| `bsplrs-…-win-arm64.exe` | Windows ARM64 |
| `bsplrs-…-linux-x64`     | Linux x64 |
| `bsplrs-…-linux-arm64`   | Linux ARM64 (Raspberry Pi 4+, AWS Graviton, etc.) |
| `bsplrs-…-osx-x64`       | macOS x64 (and Apple Silicon via Rosetta 2) |

**Requirement:** the [.NET 5 runtime](https://dotnet.microsoft.com/download/dotnet/5.0) must
be installed on the host. The bsplrs binaries are slim because they reuse the system runtime
rather than bundling it. Apple Silicon users: download the `osx-x64` build — macOS will run
it transparently under Rosetta 2 (the workload is CPU-only and a CLI tool, so the Rosetta
perf hit is irrelevant).

## Algorithm sketch

```
loose .bsp / archive.pk3!maps/foo.bsp
            │
            ▼
   Pk3Stack ──► BspLoader ──► (planes, nodes, leafs, surfaces, vis, lightmaps, entities)
                                                          │
                                                          ▼
                                       BspCollision (point-in-solid + raycast,
                                       ported from Q3 cm_*.c)
                                                          │
            ┌─────────────────────────────────────────────┤
            ▼                                             ▼
       SurfaceUnpacker                                  BspVis
       (planar / tri-soup / patches)                    (PVS bit-lookup)
            │
            ▼
       TexelSampler ──► [TexelSample{World,Normal,Observed,Cluster,...}, ...]
            │
            ├──────► TexelFetchAuditor (diagnostic: atlas round-trip,
            │                            barycentric inversion, planar lmVec check)
            │
            ├──────► BlowoutDetector
            │        (channel-aware saturation → dilate mask → multi-distance
            │         candidates from centroid; blown texels excluded from LSQ)
            │
            ▼
       LightEstimator
       │   ┌─ GeometricTriangulator ──► triangulated seeds from surface-bright
       │   │   peaks (skipping blown texels) + blown-boundary ray-pair peaks
       │   │
       │   └─ Bright-pivot RANSAC seeded from top-quantile residual luma,
       │       localized per-channel non-negative LSQ inside 256u support
       │       radius, pattern-search refinement, PVS-gated visibility,
       │       residual-peeling iteration, joint Gauss-Seidel refit.
       │
       ├─► Default: MinimizeLightCountGreedy (L0 budget, SSE tolerance)
       ├─► Default: PerceptualRefiner (photometric coordinate descent, no compile)
       ├─► Developer-only: RecompileRefiner (inject → q3map2 recompile → pair texels
       │   in world space → residual-driven per-light intensity+position adjustment,
       │   iterate, keep best-iteration lights). NEVER runs in the default pipeline;
       │   only triggered by --dev-validate / --iterate. Used during algorithm
       │   development to validate iteration quality against ground-truth recompiles.
       │
       ▼
       EntFileWriter  ──►  <bsp>.ent
       Logger         ──►  <bsp>.log + stdout

(Phase B training loop: MapFileParser → RandomLightScatterer →
 Q3Map2Wrapper(-bsp/-vis/-light with randomized settings matrix) →
 estimator → GreedyMatcher → train.csv)
```

## Compile-setting heuristic

`estimate` runs `CompileSettingsInferer` on each BSP and emits the inferred
`gamma / overbrightBits / lightmapScale / samplesize / bounce` as `// inferred compile: ...`
comments at the top of the `.ent` and as `_compile_*` debug keys per light. These are derived
**only from BSP geometry and lightmap pixel statistics** — never from the q3map2 cmdline lump
the compiler may or may not embed. Many third-party compilers don't write that lump, and we
want the same heuristic to apply uniformly.

The current heuristic uses lightmap pixel-distance per surface area (lightmap-scale), the
shape of the lightmap-value histogram (gamma), the saturation distribution at the high end
(overbright), and the variance pattern (samplesize, bounce on/off). It's intentionally simple
and the right place to iterate as the estimator gets stronger.

## External resources

Third-party source / binaries (netradiant-custom, Quake III Arena source, JK2/JKA SDKs, JK2
assets) are **not** committed. They live in a sibling folder
`../BspLightReSlopper-resources/` populated by `scripts/fetch-resources.ps1`:

```
.\scripts\fetch-resources.ps1
```

The script is idempotent — re-running it skips anything already present. Layout it produces:

```
../BspLightReSlopper-resources/
├── netradiant-custom-bin/         # extracted from the local nrc.zip; q3map2.exe + gamepacks
├── netradiant-custom-src/         # git clone, reference for shader/lightmap conventions
├── quake3-src/                    # git clone, reference for cm_*.c collision port
├── jk2-assets/                    # JK2 game directory; not auto-fetched (manual)
├── jk2-sdk/                       # JK2 SDK with example .map files (manual; JKHub login)
├── jka-sdk/                       # JKA SDK with example .map files (manual; JKHub login)
└── env-paths.ps1                  # convenience: dot-source to set BSPLRS_* env vars
```

Tests that depend on JK2 assets self-skip with a clear message when
`BSPLRS_JK2_ASSETS` is unset, so a fresh clone builds and tests green
(`dotnet test`) without any external data.

| Env var               | Purpose                                                        |
|-----------------------|----------------------------------------------------------------|
| `BSPLRS_JK2_ASSETS`   | path to a JK2 asset directory with `*.pk3` and/or `maps/`      |
| `BSPLRS_RESOURCES`    | path to the sibling resources root (advisory)                  |
| `BSPLRS_Q3MAP2`       | path to `q3map2.exe` (advisory)                                |

## Build

```
dotnet build
dotnet test
dotnet run --project src/BspLightReSlopper -- help
```

Release build:

```
dotnet build -c Release
```

## Status

| Phase | Done | Tag | Headline                                                       |
|-------|------|-----|----------------------------------------------------------------|
| A     | yes  | `phase-a` | Initial estimator + verify harness on JK2 base maps      |
| B     | yes  | `phase-b` | Refinement loop: scatter → recompile → estimate → score  |
| C     | yes  | — | Visibility-aware (PVS) estimator + polish work              |
| D     | yes  | — | Blowout-aware estimation, recompile-refine loop, texel audit  |

**Phase D highlights (H2–H4):**

- **BlowoutDetector** — channel-aware saturation (any channel ≥ 254), 1-ring dilation to
clean contaminated neighbours, multi-distance candidates (0.6× / 1.0× / 1.6× offset sweep).
Blown texels are excluded from the LSQ residual buffer, triangulation peak-finding, and all
perceptual-loss scoring.
- **GeometricTriangulator** — now excludes saturated texels from peak detection and
*includes* blown-cluster boundary peaks (brightest non-saturated neighbour, projected in the
outward normal direction) as additional intersection rays. This recovers directional signal
from clipped regions without trusting their intensities.
- **RecompileRefiner** *(developer-only)* — closed-loop `inject → q3map2 recompile → pair texels
in world space (27-cell voxel hash) → residual-driven intensity + position adjustment → keep
best iteration`. Used by the development team to refine the algorithm itself. Normal workflow does
NOT require q3map2. Runs from `converge --iterate N` and `estimate --dev-validate N`.
- **TexelFetchAuditor** — three independent correctness checks on every emitted sample:
atlas round-trip, barycentric inversion round-trip, and planar `lightmapVecs` forward-map
cross-check (skipped when vectors are inconsistent with vertex lmUVs, common on synthetic
BSPs). Duplicate detection and per-surface coverage stats included.
- **Tightened `FindContaining`** — "deepest-inside" triangle selection instead of
first-match-wins, fixing overlap artefacts on tessellated patches and tri-soup.

End-to-end benchmark on 7 Jedi Outcast base maps, 256u match tolerance:

```
map                          truth   est match  recall precision  errMed (u)
kejim_post.bsp                 301    56    29    9.6%    51.8%     219
kejim_base.bsp                 385    31    17    4.4%    54.8%     196
artus_topside.bsp              207    92    64   30.9%    69.6%     197
doom_shields.bsp               926    72    56    6.0%    77.8%     163
bespin_platform.bsp            190   119    20   10.5%    16.8%     193
duel_bay.bsp                    61    37    17   27.9%    45.9%     234
duel_pit.bsp                     6    38     0    0.0%     0.0%       0
                              ─────────────────────────────────────────────
aggregate (used 7/7 maps)             recall=12.8% precision=45.2% err=172u
```

On clean synthetic single-room scenes (Phase B training loop, a few dozen rounds with
randomized compile settings spanning bounce 0..8, samplesize 16..64, gamma 1..2.2, etc.):

```
mean recall:    43.8%
mean precision: 17.6%
posErrMedian:   211 u
```

The synthetic vs real gap is mostly driven by:

1. patches (skipped — many JK2 surfaces are `patchDef2`),
2. bounce-light contamination on indoor maps,
3. multiple overlapping lights per room (greedy peel underestimates),
4. uncalibrated gamma/overbright (output `light` values are heuristically scaled).

Phase C polish work targets these in order. None are hard blockers — the pipeline runs
reliably end-to-end on every JK2 base map.

## License

MIT — see `LICENSE`.
