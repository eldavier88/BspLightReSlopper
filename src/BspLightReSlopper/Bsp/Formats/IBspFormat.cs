using System.Collections.Generic;

namespace BspLightReSlopper.Bsp.Formats
{
    /// <summary>
    /// Format descriptor for a particular (magic, version) pair. The <see cref="BspLoader"/>
    /// looks up the right descriptor in <see cref="BspFormatRegistry"/> and lets it parse
    /// each lump.
    ///
    /// To add a new format: implement this interface, register an instance in
    /// <see cref="BspFormatRegistry.Default"/>.
    /// </summary>
    public interface IBspFormat
    {
        /// <summary>4-byte ASCII magic, e.g. "IBSP" or "RBSP".</summary>
        string Magic { get; }

        /// <summary>BSP version int, e.g. 46 (Q3) or 1 (RBSP).</summary>
        int Version { get; }

        /// <summary>Human-readable name, e.g. "Quake 3 Arena (IBSP v46)".</summary>
        string DisplayName { get; }

        /// <summary>Total number of lumps in the header.</summary>
        int HeaderLumpCount { get; }

        /// <summary>
        /// Map of <see cref="BspLumpKind"/> string to lump index in the header. Lumps that
        /// don't exist in this format return -1.
        /// </summary>
        IReadOnlyDictionary<string, int> LumpIndex { get; }

        /// <summary>
        /// Stages of lightmap UVs and per-vertex colors. 1 for IBSP, 4 for RBSP.
        /// </summary>
        int LightmapStageCount { get; }

        // Per-element strides on disk (sizeof the C struct). Used to divide a lump's byte
        // length by the stride to get the element count and to iterate.
        int VertexStride { get; }
        int SurfaceStride { get; }
        int BrushSideStride { get; }
        int NodeStride => 36;       // shared: int + 2*int + 3*int + 3*int = 36
        int LeafStride { get; }     // IBSP46 = 36, RBSP1 = 36 (same shape, conservative)
        int PlaneStride => 16;
        int BrushStride => 12;
        int ModelStride => 40;
        int FogStride => 72;
        int ShaderStride => 72;

        // Format-specific lump readers. Each gets the raw lump bytes (already sliced).
        BspDrawVert ReadDrawVert(System.ReadOnlySpan<byte> data, int offset);
        BspDrawSurface ReadDrawSurface(System.ReadOnlySpan<byte> data, int offset);
        BspBrushSide ReadBrushSide(System.ReadOnlySpan<byte> data, int offset);
        BspLeaf ReadLeaf(System.ReadOnlySpan<byte> data, int offset);
    }
}
