# BspLightReSlopper

Reverse-engineer the original `light` entity positions, colors and intensities from a baked
`.bsp` file by inspecting its lightmaps + draw-surface data, and emit them as a Quake-style
`.ent` file.

CPU-only, .NET 5.0, single CLI binary `bsplrs`.

Supported BSP formats:

- `IBSP` v46 — Quake 3 Arena (read-only; not used for verification because Q3A maps usually
  ship with their `light` entities stripped at compile time).
- `RBSP` v1 — Jedi Outcast / Jedi Academy / Soldier of Fortune 2. Multi-stage lightmaps (up
  to 4) and per-vertex 4-style arrays. **Jedi Outcast base maps preserve their light entities
  and are the verification dataset.**

The format registry in `src/BspLightReSlopper/Bsp/Formats/` is built so adding another
`(magic, version)` is a one-class change.

## Workflow

```
   .pk3 / loose .bsp                       light entities (.ent)
          │                                       ▲
          ▼                                       │
   PK3 stack ──► BSP loader ──► surfaces ──► texel samples ──► estimator
                                                                │
                                              compile-settings  │
                                              heuristics        ▼
                                                              clusters
                                                                │
                                                                ▼
                                                            type classifier
                                                            (point/spot/linear/sun)
```

Final output is a `<input>.ent` file in standard `.map` entity syntax (no worldspawn) plus a
`<input>.log` mirroring everything the tool printed to the console.

## CLI

```
bsplrs estimate    --assets <asset-dir> --bsp <path | path.pk3!maps/foo.bsp>
                   [-o <out.ent>] [--log <log>] [--debug-dir <dir>]
                   [--emit-sky-shader]
bsplrs verify      --assets <asset-dir> [--maps <bsp,bsp,...>]
bsplrs inspect-bsp --assets <asset-dir> --bsp <path>
bsplrs train       --sdk-map <map> --rounds <N> --out <dir>          (Phase B)
bsplrs analyze-training <train.csv>                                  (Phase B)
bsplrs help
```

A BSP whose entity lump contains zero `light` entities (and no `_sun_*` keys) is treated as
**ground-truth-unusable** by `verify` and `train` — it is *not* assumed that "the right answer
is 0 lights". `estimate` will still happily run on such a BSP.

## External resources

Third-party source/binaries (netradiant-custom, Quake III Arena source, JK2/JKA SDKs, JK2
assets) are **not** committed. They live in a sibling folder
`../BspLightReSlopper-resources/` populated by `scripts/fetch-resources.ps1`. The CLI never
hard-codes paths to them; tests and training scripts read them via env vars:

| Env var                  | Purpose                                                        |
|--------------------------|----------------------------------------------------------------|
| `BSPLRS_RESOURCES`       | path to the sibling resources root                             |
| `BSPLRS_JK2_ASSETS`      | path to a JK2 asset directory containing `*.pk3` and/or `maps/`|
| `BSPLRS_Q3MAP2`          | path to `q3map2.exe` (defaults to the netradiant-custom-bin)   |
| `BSPLRS_JK2_SDK`         | path to extracted JK2 SDK with example `.map` files            |
| `BSPLRS_JKA_SDK`         | path to extracted JKA SDK with example `.map` files            |
| `BSPLRS_QUAKE3_SRC`      | path to a Quake III Arena source checkout (cm_*.c reference)   |

Tests that require any of these env vars **skip** themselves with a clear message when the
variable is unset, so a fresh clone builds and tests green without external data.

## Build

```sh
dotnet build
dotnet test
dotnet run --project src/BspLightReSlopper -- help
```

## Status

Phase A — initial estimator + verification harness. See
`docs/architecture.md`, `docs/bsp-formats.md`, `docs/light-estimation.md`,
`docs/compile-settings-heuristics.md`, `docs/refinement-loop.md`.

## License

MIT — see `LICENSE`.
