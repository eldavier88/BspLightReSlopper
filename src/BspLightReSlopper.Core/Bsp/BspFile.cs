using System.Collections.Generic;
using BspLightReSlopper.Bsp.Formats;

namespace BspLightReSlopper.Bsp
{
    /// <summary>
    /// In-memory representation of a parsed BSP. Field-arrays are populated by
    /// <see cref="BspLoader"/> using the format descriptor in <see cref="Format"/>.
    /// </summary>
    public sealed class BspFile
    {
        public string SourcePath { get; init; } = string.Empty;
        public IBspFormat Format { get; init; } = null!;
        public string Magic => Format.Magic;
        public int Version { get; init; }

        /// <summary>Either 1 (IBSP46) or 4 (RBSP1).</summary>
        public int LightmapStageCount => Format.LightmapStageCount;

        public IReadOnlyList<BspShader>      Shaders      { get; init; } = System.Array.Empty<BspShader>();
        public IReadOnlyList<BspPlane>       Planes       { get; init; } = System.Array.Empty<BspPlane>();
        public IReadOnlyList<BspNode>        Nodes        { get; init; } = System.Array.Empty<BspNode>();
        public IReadOnlyList<BspLeaf>        Leafs        { get; init; } = System.Array.Empty<BspLeaf>();
        public IReadOnlyList<int>            LeafSurfaces { get; init; } = System.Array.Empty<int>();
        public IReadOnlyList<int>            LeafBrushes  { get; init; } = System.Array.Empty<int>();
        public IReadOnlyList<BspModel>       Models       { get; init; } = System.Array.Empty<BspModel>();
        public IReadOnlyList<BspBrush>       Brushes      { get; init; } = System.Array.Empty<BspBrush>();
        public IReadOnlyList<BspBrushSide>   BrushSides   { get; init; } = System.Array.Empty<BspBrushSide>();
        public IReadOnlyList<BspDrawVert>    DrawVerts    { get; init; } = System.Array.Empty<BspDrawVert>();
        public IReadOnlyList<int>            DrawIndexes  { get; init; } = System.Array.Empty<int>();
        public IReadOnlyList<BspFog>         Fogs         { get; init; } = System.Array.Empty<BspFog>();
        public IReadOnlyList<BspDrawSurface> Surfaces     { get; init; } = System.Array.Empty<BspDrawSurface>();

        /// <summary>
        /// Raw lightmap bytes (RGB triplets, stored back-to-back as 128*128*3 atlases).
        /// </summary>
        public byte[] Lightmaps { get; init; } = System.Array.Empty<byte>();

        /// <summary>Plain text of the entity lump, including the trailing null byte.</summary>
        public string EntitiesText { get; init; } = string.Empty;

        public byte[] Visibility { get; init; } = System.Array.Empty<byte>();

        /// <summary>Number of 128x128 RGB lightmap atlases packed in <see cref="Lightmaps"/>.</summary>
        public int LightmapAtlasCount => Lightmaps.Length / (LightmapWidth * LightmapHeight * 3);

        public const int LightmapWidth = 128;
        public const int LightmapHeight = 128;
    }
}
