using System;
using System.Numerics;
using Avalonia;
using Avalonia.Input;
using Avalonia.OpenGL;
using Avalonia.OpenGL.Controls;
using Avalonia.Threading;
using BspLightReSlopper.Bsp;
using BspLightReSlopper.Desktop.Services;
using BspLightReSlopper.Surfaces;
using Silk.NET.OpenGL;

namespace BspLightReSlopper.Desktop.Rendering
{
    public enum ViewerRenderMode
    {
        Lightmap,
        Shaded,
        Wireframe,
        Normals,
    }

    /// <summary>
    /// 3D BSP viewer hosted as an Avalonia OpenGL control. Renders the loaded BSP with
    /// lightmap textures, plus light gizmos for the most-recent estimator result.
    ///
    /// <para>Lifecycle:</para>
    /// <list type="bullet">
    ///   <item><c>OnOpenGlInit</c>: create Silk.NET GL, compile shaders.</item>
    ///   <item><c>OnOpenGlRender</c>: lazy-upload pending mesh / lightmaps, draw frame.</item>
    ///   <item><c>OnOpenGlDeinit</c>: release every GL handle.</item>
    /// </list>
    /// </summary>
    public sealed class BspViewerControl : OpenGlControlBase
    {
        // ---- GL state ----
        private GL? _gl;
        private ShaderProgram? _lightmapProgram;
        private ShaderProgram? _solidProgram;
        private ShaderProgram? _wireframeProgram;
        private ShaderProgram? _normalsProgram;
        private ShaderProgram? _gizmoProgram;
        private ShaderProgram? _lineProgram;
        private readonly GpuMesh _mesh = new();
        private readonly LightmapAtlasTexture _lightmaps = new();
        private readonly LightGizmos _gizmos = new();

        // ---- Pending uploads (set from UI thread; consumed on render thread) ----
        private BspFile? _pendingBsp;
        private bool _bspPending;
        private RunResult? _pendingRun;
        private bool _runPending;

        // ---- View state ----
        private readonly OrbitCamera _camera = new();
        private Point? _lastPointer;
        private bool _rotating, _panning;

        // ---- Public state ----
        public ViewerRenderMode RenderMode { get; set; } = ViewerRenderMode.Lightmap;
        public bool ShowLights { get; set; } = true;
        public bool ShowSpotCones { get; set; } = true;
        public bool ShowGroundTruth { get; set; } = true;
        public float LightmapOverbright { get; set; } = 2.0f;
        public bool LightmapGammaEncode { get; set; } = true;

        public BspViewerControl()
        {
            Focusable = true;
            ClipToBounds = true;
            PointerPressed += OnPointerPressed;
            PointerReleased += OnPointerReleased;
            PointerMoved += OnPointerMoved;
            PointerWheelChanged += OnPointerWheel;
        }

        public void SetBsp(BspFile bsp)
        {
            _pendingBsp = bsp;
            _bspPending = true;
            RequestNextFrameRendering();
        }

        public void SetRunResult(RunResult? result)
        {
            _pendingRun = result;
            _runPending = true;
            RequestNextFrameRendering();
        }

        public void RequestRedraw() => RequestNextFrameRendering();

        protected override void OnOpenGlInit(GlInterface glInterface)
        {
            _gl = GlBridge.Create(glInterface);
            _lightmapProgram = ShaderProgram.Compile(_gl, Shaders.LightmapVert, Shaders.LightmapFrag);
            _solidProgram = ShaderProgram.Compile(_gl, Shaders.SolidVert, Shaders.SolidFrag);
            _wireframeProgram = ShaderProgram.Compile(_gl, Shaders.FlatVert, Shaders.WireframeFrag);
            _normalsProgram = ShaderProgram.Compile(_gl, Shaders.FlatVert, Shaders.NormalsFrag);
            _gizmoProgram = ShaderProgram.Compile(_gl, Shaders.GizmoVert, Shaders.GizmoFrag);
            _lineProgram = ShaderProgram.Compile(_gl, Shaders.LineVert, Shaders.LineFrag);

            _gl.Enable(EnableCap.DepthTest);
            _gl.Enable(EnableCap.CullFace);
            _gl.CullFace(TriangleFace.Back);
            _gl.FrontFace(FrontFaceDirection.CW); // Q3 BSPs are CW.
        }

        protected override void OnOpenGlDeinit(GlInterface glInterface)
        {
            if (_gl == null) return;
            _mesh.Clear(_gl);
            _lightmaps.Delete(_gl);
            _gizmos.Delete(_gl);
            _lightmapProgram?.Delete(_gl);
            _solidProgram?.Delete(_gl);
            _wireframeProgram?.Delete(_gl);
            _normalsProgram?.Delete(_gl);
            _gizmoProgram?.Delete(_gl);
            _lineProgram?.Delete(_gl);
            _gl = null;
        }

        protected override unsafe void OnOpenGlRender(GlInterface glInterface, int fb)
        {
            if (_gl == null) return;
            var gl = _gl;

            // ---- Process pending uploads (BSP, run result) ----
            if (_bspPending && _pendingBsp != null)
            {
                _bspPending = false;
                var bsp = _pendingBsp;
                try
                {
                    var unpacked = SurfaceUnpacker.Unpack(bsp);
                    var mesh = BspMesh.Build(bsp, unpacked);
                    _mesh.Upload(gl, mesh);
                    _lightmaps.Delete(gl);
                    _lightmaps.Upload(gl, bsp);
                    _camera.Frame(mesh.BoundsMin, mesh.BoundsMax);
                }
                catch
                {
                    _mesh.Clear(gl);
                }
            }

            if (_runPending)
            {
                _runPending = false;
                if (_pendingRun != null)
                {
                    _gizmos.UpdateLights(gl, _pendingRun.Lights, _pendingRun.ScaleToQ3);
                    _gizmos.UpdateGroundTruth(gl, _pendingRun.GroundTruthOrigins, _pendingRun.GroundTruthColors);
                }
                else
                {
                    _gizmos.UpdateLights(gl, Array.Empty<ClassifiedLight>(), 1f);
                    _gizmos.UpdateGroundTruth(gl, Array.Empty<Vector3>(), Array.Empty<Vector3>());
                }
            }

            // ---- Frame setup ----
            int pxW = (int)(Bounds.Width * VisualRoot!.RenderScaling);
            int pxH = (int)(Bounds.Height * VisualRoot!.RenderScaling);
            if (pxW < 1) pxW = 1;
            if (pxH < 1) pxH = 1;
            float aspect = (float)pxW / pxH;

            gl.Viewport(0, 0, (uint)pxW, (uint)pxH);
            gl.ClearColor(0.10f, 0.10f, 0.11f, 1.0f);
            gl.Clear((uint)(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit));
            gl.Enable(EnableCap.DepthTest);
            gl.DepthFunc(DepthFunction.Less);
            gl.DepthMask(true);
            gl.Disable(EnableCap.Blend);

            var view = _camera.GetView();
            var proj = _camera.GetProjection(aspect);
            var vp = view * proj;
            var camPos = _camera.ComputePosition();

            // ---- Solid pass ----
            gl.PolygonMode(TriangleFace.FrontAndBack, RenderMode == ViewerRenderMode.Wireframe ? PolygonMode.Line : PolygonMode.Fill);

            ShaderProgram? prog = RenderMode switch
            {
                ViewerRenderMode.Lightmap => _lightmapProgram,
                ViewerRenderMode.Shaded => _solidProgram,
                ViewerRenderMode.Wireframe => _wireframeProgram,
                ViewerRenderMode.Normals => _normalsProgram,
                _ => _lightmapProgram,
            };

            if (prog != null && _mesh.TotalTriangles > 0)
            {
                prog.Use(gl);
                SetUniformMatrix4(gl, prog.U(gl, "uViewProj"), vp);
                if (RenderMode == ViewerRenderMode.Lightmap)
                {
                    _lightmaps.Bind(gl, 0);
                    gl.Uniform1(prog.U(gl, "uLightmaps"), 0);
                    gl.Uniform1(prog.U(gl, "uOverbright"), LightmapOverbright);
                    gl.Uniform1(prog.U(gl, "uHasLightmaps"), _lightmaps.LayerCount > 0 ? 1 : 0);
                    gl.Uniform1(prog.U(gl, "uGammaEncode"), LightmapGammaEncode ? 1 : 0);
                    gl.Uniform3(prog.U(gl, "uCameraPos"), camPos.X, camPos.Y, camPos.Z);
                }
                else if (RenderMode == ViewerRenderMode.Shaded)
                {
                    gl.Uniform3(prog.U(gl, "uCameraPos"), camPos.X, camPos.Y, camPos.Z);
                }
                _mesh.DrawAll(gl);
            }

            // Reset polygon mode for gizmos.
            gl.PolygonMode(TriangleFace.FrontAndBack, PolygonMode.Fill);

            // ---- Light gizmos (additive billboards) ----
            if (ShowLights && _gizmoProgram != null)
            {
                gl.Enable(EnableCap.Blend);
                gl.BlendFunc(BlendingFactor.SrcAlpha, BlendingFactor.OneMinusSrcAlpha);
                gl.DepthMask(false);
                _gizmoProgram.Use(gl);
                SetUniformMatrix4(gl, _gizmoProgram.U(gl, "uViewProj"), vp);
                Vector3 right = new(view.M11, view.M21, view.M31);
                Vector3 up = new(view.M12, view.M22, view.M32);
                gl.Uniform3(_gizmoProgram.U(gl, "uCameraRight"), right.X, right.Y, right.Z);
                gl.Uniform3(_gizmoProgram.U(gl, "uCameraUp"), up.X, up.Y, up.Z);
                _gizmos.DrawLights(gl);
                if (ShowGroundTruth) _gizmos.DrawGroundTruth(gl);
                gl.DepthMask(true);
                gl.Disable(EnableCap.Blend);
            }

            // ---- Spot cones ----
            if (ShowSpotCones && _lineProgram != null)
            {
                _lineProgram.Use(gl);
                SetUniformMatrix4(gl, _lineProgram.U(gl, "uViewProj"), vp);
                _gizmos.DrawCones(gl);
            }
        }

        private static unsafe void SetUniformMatrix4(GL gl, int loc, Matrix4x4 m)
        {
            float* mp = stackalloc float[16];
            mp[0] = m.M11; mp[1] = m.M12; mp[2] = m.M13; mp[3] = m.M14;
            mp[4] = m.M21; mp[5] = m.M22; mp[6] = m.M23; mp[7] = m.M24;
            mp[8] = m.M31; mp[9] = m.M32; mp[10] = m.M33; mp[11] = m.M34;
            mp[12] = m.M41; mp[13] = m.M42; mp[14] = m.M43; mp[15] = m.M44;
            gl.UniformMatrix4(loc, 1, false, mp);
        }

        // ---- Mouse / keyboard ----
        private void OnPointerPressed(object? sender, PointerPressedEventArgs e)
        {
            Focus();
            var pt = e.GetCurrentPoint(this);
            _lastPointer = pt.Position;
            _rotating = pt.Properties.IsLeftButtonPressed;
            _panning = pt.Properties.IsRightButtonPressed || pt.Properties.IsMiddleButtonPressed;
            e.Handled = true;
        }

        private void OnPointerReleased(object? sender, PointerReleasedEventArgs e)
        {
            _rotating = false;
            _panning = false;
            _lastPointer = null;
        }

        private void OnPointerMoved(object? sender, PointerEventArgs e)
        {
            if (!_rotating && !_panning) return;
            var p = e.GetPosition(this);
            if (_lastPointer is { } last)
            {
                float dx = (float)(p.X - last.X);
                float dy = (float)(p.Y - last.Y);
                if (_rotating)
                {
                    _camera.Rotate(dx * 0.005f, -dy * 0.005f);
                    RequestNextFrameRendering();
                }
                else if (_panning)
                {
                    _camera.Pan(dx, dy);
                    RequestNextFrameRendering();
                }
            }
            _lastPointer = p;
        }

        private void OnPointerWheel(object? sender, PointerWheelEventArgs e)
        {
            _camera.Zoom((float)e.Delta.Y);
            RequestNextFrameRendering();
            e.Handled = true;
        }
    }
}
