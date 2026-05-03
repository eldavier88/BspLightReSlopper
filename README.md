# BspLightReSlopper

Reverse-engineer the original `light` entity positions, colors and intensities from a baked
Quake III / Jedi Outcast / Jedi Academy `.bsp` file by inspecting its lightmaps and
draw-surface geometry, and emit them as a Quake-style `.ent` file.

CPU-only, .NET 5.0, single CLI binary `bsplrs`. No GPU / CUDA / OpenCL.

## Final user-facing workflow

```
bsplrs estimate --assets <asset-dir> --bsp <path | path.pk3!maps/foo.bsp>
                [-o <out.ent>] [--log <log>] [--no-vis]
                [--max-samples N] [--pivots N] [--max-lights N] [--seed N]
                [--half-lambert] [--infer-angle-model]
                [--minimize-lights] [--minimize-lights-tolerance F]
                [--refine-lights] [--refine-passes N] [--refine-step U]
                [--recompile-refine N --map <src.map> --q3map2 <exe> --base-path <dir>]
```

Inputs:
- `--assets` — folder containing the game's `.pk3` archives (and/or loose `maps/`,
  `scripts/`, `textures/` folders). Used only to resolve shaders/textures referenced by the
  BSP; the estimator itself works directly on the BSP.
- `--bsp` — either a loose `.bsp` file path, or `archive.pk3!maps/foo.bsp` to read from inside
  a `.pk3`.

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

bsplrs estimate ... [--minimize-lights] [--refine-lights]
                    [--recompile-refine N --map <src.map> --q3map2 <exe> --base-path <dir>]
                    Single-map variant of the converge loop: minimise light count
                    (L0 greedy with SSE budget), photometric refine, and optionally
                    do N actual q3map2 recompiles to converge on the reference look.

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
       ├─► Optional: MinimizeLightCountGreedy (L0 budget, SSE tolerance)
       ├─► Optional: PerceptualRefiner (photometric coordinate descent, no compile)
       ├─► Optional: RecompileRefiner (inject → q3map2 recompile → pair texels in
       │   world space → residual-driven per-light intensity+position adjustment,
       │   iterate, keep best-iteration lights; "match the look" priority)
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
- **RecompileRefiner** — closed-loop `inject → q3map2 recompile → pair texels in world space
(27-cell voxel hash) → residual-driven intensity + position adjustment → keep best iteration`.
The objective is **perceptual MSE** (not entity-list match), so "map looks the same after
recompile" is the priority. Runs from `converge --iterate N` and `estimate --recompile-refine N`.
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
