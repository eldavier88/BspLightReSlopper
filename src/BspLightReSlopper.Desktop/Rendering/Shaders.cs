namespace BspLightReSlopper.Desktop.Rendering
{
    /// <summary>
    /// GLSL source for the BSP viewer shaders. We keep them as plain strings so they
    /// live alongside the C# code and can be tweaked without an asset pipeline.
    /// </summary>
    internal static class Shaders
    {
        // ---- Solid (Phase 3 baseline) ----
        // Lambert with headlight + ambient. Used when render mode is "shaded".
        public const string SolidVert = @"#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aLmUv;
layout(location = 3) in float aLayer;
uniform mat4 uViewProj;
out vec3 vWorldNormal;
out vec3 vWorldPos;
void main() {
    vWorldNormal = aNormal;
    vWorldPos = aPos;
    gl_Position = uViewProj * vec4(aPos, 1.0);
}";

        public const string SolidFrag = @"#version 330 core
in vec3 vWorldNormal;
in vec3 vWorldPos;
uniform vec3 uCameraPos;
out vec4 oColor;
void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 toCam = normalize(uCameraPos - vWorldPos);
    float headlight = max(0.0, dot(N, toCam));
    vec3 base = vec3(0.65, 0.66, 0.7);
    vec3 lit = base * (0.30 + 0.70 * headlight);
    oColor = vec4(lit, 1.0);
}";

        // ---- Lightmap-textured (Phase 4) ----
        // Samples the lightmap atlas array (one layer per BSP atlas) and applies a
        // user-controllable overbright multiplier + Reinhard tone mapping.
        public const string LightmapVert = @"#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aLmUv;
layout(location = 3) in float aLayer;
uniform mat4 uViewProj;
out vec3 vWorldNormal;
out vec3 vWorldPos;
out vec2 vLmUv;
flat out int vLayer;
void main() {
    vWorldNormal = aNormal;
    vWorldPos = aPos;
    vLmUv = aLmUv;
    vLayer = int(aLayer + 0.5);
    gl_Position = uViewProj * vec4(aPos, 1.0);
}";

        public const string LightmapFrag = @"#version 330 core
in vec3 vWorldNormal;
in vec3 vWorldPos;
in vec2 vLmUv;
flat in int vLayer;
uniform vec3 uCameraPos;
uniform sampler2DArray uLightmaps;
uniform float uOverbright;
uniform int uHasLightmaps;
uniform int uGammaEncode;
out vec4 oColor;
void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 toCam = normalize(uCameraPos - vWorldPos);
    float headlight = max(0.0, dot(N, toCam));
    vec3 fallback = vec3(0.65, 0.66, 0.7) * (0.25 + 0.75 * headlight);
    if (uHasLightmaps == 0 || vLayer < 0) {
        oColor = vec4(fallback, 1.0);
        return;
    }
    vec3 lm = texture(uLightmaps, vec3(vLmUv, float(vLayer))).rgb;
    // Lightmap atlas bytes are stored gamma-encoded (q3map2 default). De-gamma so the
    // overbright multiplier behaves linearly, then tone-map with Reinhard so very bright
    // lights don't clip to flat white in the preview.
    if (uGammaEncode == 1) lm = pow(lm, vec3(2.2));
    vec3 lit = lm * uOverbright;
    lit = lit / (1.0 + lit);
    if (uGammaEncode == 1) lit = pow(lit, vec3(1.0 / 2.2));
    oColor = vec4(lit, 1.0);
}";

        // ---- Wireframe / normals helpers ----
        public const string FlatVert = @"#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aLmUv;
layout(location = 3) in float aLayer;
uniform mat4 uViewProj;
out vec3 vNormal;
void main() {
    vNormal = aNormal;
    gl_Position = uViewProj * vec4(aPos, 1.0);
}";

        public const string WireframeFrag = @"#version 330 core
out vec4 oColor;
void main() { oColor = vec4(0.7, 0.85, 1.0, 1.0); }";

        public const string NormalsFrag = @"#version 330 core
in vec3 vNormal;
out vec4 oColor;
void main() {
    vec3 c = normalize(vNormal) * 0.5 + 0.5;
    oColor = vec4(c, 1.0);
}";

        // ---- Light gizmo (Phase 5) ----
        // Billboarded screen-aligned quad per light. Instance attributes encode origin,
        // color, and a normalised intensity-derived radius.
        public const string GizmoVert = @"#version 330 core
layout(location = 0) in vec2 aQuad;       // [-1..1] quad corner
layout(location = 1) in vec3 iOrigin;     // instance: world origin
layout(location = 2) in vec3 iColor;      // instance: rgb
layout(location = 3) in float iRadius;    // instance: world-space sphere radius
uniform mat4 uViewProj;
uniform vec3 uCameraRight;
uniform vec3 uCameraUp;
out vec3 vColor;
out vec2 vQuad;
void main() {
    vec3 world = iOrigin + uCameraRight * aQuad.x * iRadius + uCameraUp * aQuad.y * iRadius;
    gl_Position = uViewProj * vec4(world, 1.0);
    vColor = iColor;
    vQuad = aQuad;
}";

        public const string GizmoFrag = @"#version 330 core
in vec3 vColor;
in vec2 vQuad;
out vec4 oColor;
void main() {
    float r = length(vQuad);
    if (r > 1.0) discard;
    float core = smoothstep(1.0, 0.0, r);
    float halo = exp(-2.0 * r * r);
    vec3 c = vColor * (core + 0.4 * halo);
    oColor = vec4(c, max(core, halo * 0.7));
}";

        public const string LineVert = @"#version 330 core
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aColor;
uniform mat4 uViewProj;
out vec3 vColor;
void main() {
    vColor = aColor;
    gl_Position = uViewProj * vec4(aPos, 1.0);
}";

        public const string LineFrag = @"#version 330 core
in vec3 vColor;
out vec4 oColor;
void main() { oColor = vec4(vColor, 1.0); }";
    }
}
