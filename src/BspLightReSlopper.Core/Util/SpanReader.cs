using System;
using System.Buffers.Binary;
using System.Numerics;
using System.Text;

namespace BspLightReSlopper.Util
{
    /// <summary>
    /// Tiny little-endian binary reader over a <see cref="ReadOnlySpan{T}"/>. All BSP
    /// formats we deal with are little-endian on disk regardless of host architecture.
    /// </summary>
    public ref struct SpanReader
    {
        private readonly ReadOnlySpan<byte> _data;
        public int Offset;

        public SpanReader(ReadOnlySpan<byte> data, int offset = 0)
        {
            _data = data;
            Offset = offset;
        }

        public int Length => _data.Length;
        public int Remaining => _data.Length - Offset;

        public byte ReadByte()
        {
            byte b = _data[Offset];
            Offset += 1;
            return b;
        }

        public short ReadInt16()
        {
            short v = BinaryPrimitives.ReadInt16LittleEndian(_data.Slice(Offset, 2));
            Offset += 2;
            return v;
        }

        public ushort ReadUInt16()
        {
            ushort v = BinaryPrimitives.ReadUInt16LittleEndian(_data.Slice(Offset, 2));
            Offset += 2;
            return v;
        }

        public int ReadInt32()
        {
            int v = BinaryPrimitives.ReadInt32LittleEndian(_data.Slice(Offset, 4));
            Offset += 4;
            return v;
        }

        public uint ReadUInt32()
        {
            uint v = BinaryPrimitives.ReadUInt32LittleEndian(_data.Slice(Offset, 4));
            Offset += 4;
            return v;
        }

        public float ReadSingle()
        {
            float v = BinaryPrimitives.ReadSingleLittleEndian(_data.Slice(Offset, 4));
            Offset += 4;
            return v;
        }

        public Vector2 ReadVector2()
        {
            float x = ReadSingle();
            float y = ReadSingle();
            return new Vector2(x, y);
        }

        public Vector3 ReadVector3()
        {
            float x = ReadSingle();
            float y = ReadSingle();
            float z = ReadSingle();
            return new Vector3(x, y, z);
        }

        public void ReadInt32Array(Span<int> dst)
        {
            for (int i = 0; i < dst.Length; i++) dst[i] = ReadInt32();
        }

        public void ReadByteArray(Span<byte> dst)
        {
            _data.Slice(Offset, dst.Length).CopyTo(dst);
            Offset += dst.Length;
        }

        /// <summary>
        /// Reads a fixed-length, null-terminated ASCII string. Trailing bytes after the first
        /// null are ignored. Used for shader path fields (MAX_QPATH = 64).
        /// </summary>
        public string ReadFixedAscii(int length)
        {
            ReadOnlySpan<byte> raw = _data.Slice(Offset, length);
            Offset += length;
            int n = raw.IndexOf((byte)0);
            if (n < 0) n = raw.Length;
            return Encoding.ASCII.GetString(raw.Slice(0, n));
        }
    }
}
