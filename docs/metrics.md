# Metrics glossary (plain language)

This document explains the numbers BspLightReSlopper prints — **recall**, **precision**, position errors, **perceptual loss**, and a few related terms. If you are not used to information-retrieval vocabulary, percentages like “recall = 0.73” can feel meaningless; here is what they actually mean in this project.

---

## Lights, “truth”, and “estimates”

- **Ground truth (“truth”) lights** — `light` entities still stored inside a shipped `.bsp` (mainly Jedi Outcast base maps). The tool treats those positions, colors, and intensities as the reference.
- **Estimated lights** — positions (and colors, intensities) inferred from baked lightmaps and geometry.

We compare the two sets as **pairs**: each estimated light can match **at most one** truth light, and each truth light at most one estimate (“greedy” one-to-one matching within a distance tolerance).

---

## Recall (what fraction of real lights did we find?)

**Question:** Of all the *real* lights in the map, how many did we recover at least approximately?

- **Formula (conceptually):** `matched truth lights ÷ total truth lights`
- **Example:** The map has **100** real lights. We place **80** estimates that each pair up with a distinct real light within tolerance. Recall = **80 / 100 = 0.80**, often written **80%**.

**Interpretation:**  
High recall means you are **not missing** many real fixtures. If recall is **50%**, about half of the true lights have *no* estimated counterpart within the tolerance — the map may look darker or wrong in those areas after a relight.

Recall says **nothing** about whether you invented extra fake lights; that is **precision**.

---

## Precision (what fraction of our guesses are real?)

**Question:** Of all the lights *we* output, how many correspond to an actual light?

- **Formula (conceptually):** `matched estimates ÷ total estimates`
- **Example:** We output **50** estimated lights; **40** match a truth light. Precision = **40 / 50 = 0.80** (**80%**). The other **10** are **false positives** (extra guesses).

**Interpretation:**  
High precision means you are **not spamming** meaningless lights. Low precision with high recall can still happen if the algorithm Places many duplicates near each real lamp.

---

## Why a “percentage” of recall or precision is not like exam grades

- **100% recall** does not mean the map is perfect — you might have **500** estimates for **50** real lights (low precision).
- **100% precision** does not mean complete coverage — you might find **5** of **100** lights (low recall).

**F1** (when reported) is the harmonic mean of recall and precision: it penalizes **only** doing well on one of them.

---

## Position error (median / mean, in Quake units)

After matching a truth light to an estimate, the **position error** is the 3D distance between the two origins (same unit system as the map, typically **1 unit ≈ 1 inch** in Q3-family games).

- **Median position error** — half the matched pairs are closer than this value, half are farther. Robust to a few awful outliers.
- **Mean position error** — average distance; more sensitive to outliers.

A median of **64** means “typically within about **64** units”; whether that is acceptable depends on fixture size and light falloff.

---

## Color error (e.g. CIE ΔE, or per-channel)

When we compare matched lights, we may report **color distance** between truth and estimate. Smaller is closer. Exact definition depends on the matcher (e.g. simple RGB distance or a perceptual ΔE-style metric).

---

## Supporting texels, confidence, explained energy

These come from the **inverse lightmap** fit:

- **Supporting texels** — how many baked texels were strongly consistent with that light’s fit.
- **Confidence / explained fraction** — how much of the local residual brightness this light accounts for after the iterative “peel”.

They are **diagnostics**, not proof the light exists in the entity lump — a bounce or material artifact can still get a high score.

---

## Perceptual loss (lightmap MSE / pairing)

For **look matching**, we care less about **exact entity agreement** and more about whether **recompiled lightmaps** resemble the **original** at the same places in the world.

**Perceptual loss** here means:

1. Sample many **texels** from the **reference** BSP and from a **candidate** BSP (after recompile).
2. For each candidate texel, find a **nearby** reference texel in world space (nearest-neighbour in a coarse 3D grid).
3. Sum **squared differences** of linear **RGB** (and derive **RMSE** = root mean square error).

**Lower is better.** It is a **proxy** for visible lighting difference; it does not model human vision perfectly, but it tracks “does this wall look about as bright/colored as before?”

**Unmatched texels** — candidate samples with no reference neighbour within the max distance; large counts mean geometry/lightmap layout shifted or sampling mismatched.

---

## Forward RGB SSE (internal photometric fit)

The **estimator** uses a simple Lambert / optional half-Lambert falloff model. **Forward SSE** is the sum of squared **RGB** errors between:

- observed texel colors from the reference BSP, and  
- the sum of predicted contributions from all **estimated** lights.

Used for **refinement** and **light-count minimization** without recompiling every trial. It is **not** identical to in-game q3map2 (no full radiosity, no exact compiler flags), but it aligns the optimizer with the same assumptions as the rest of the tool.

---

## Blowout handling (saturation → mask → exclusion)

Lightmaps store **byte** values (0–255). When a real light is very close to a surface or very bright, one or more RGB channels clip at **255**. Those clipped texels carry **no usable intensity signal** — the true radiance could be 1×, 2×, or 10× higher than 255 and the byte looks identical. Guessing intensity from saturated pixels is dangerous.

**Three-tier handling:**

1. **Saturated** — any channel ≥ 254. The raw intensity is *probably* clipped. Flagged but still considered by the estimator if not part of a flat block.
2. **Blown** — a 4-connected cluster of saturated texels whose **border contrast is not steep enough** to be a single bright pixel (the "flat flash" pattern). These are almost certainly clipped and their neighbours are contaminated. The estimator **excludes blown texels from the LSQ residual buffer**, from triangulation peak detection, and from all perceptual-loss scoring. They are replaced by the forward model during refinement.
3. **Dilation** — a 1-ring neighbourhood around every blown cluster is also masked out, because the light bleed from an over-bright source contaminates nearby non-saturated pixels too.

When a blown cluster is detected, the tool emits **multiple light candidates** at different distances from the surface (0.6×, 1.0×, 1.6× the normal-offset heuristic). The estimator's downstream joint refit and merge steps pick whichever distance best explains the *non*-blown surrounding pixels, rather than being anchored to one potentially-wrong offset.

---

## Geometric triangulation with blown-boundary peaks

`GeometricTriangulator` uses ray-pair intersections from bright surface peaks to find light directions. Saturated texels are **skipped** during peak detection (their apparent brightness is ceiling-limited, not real). However, the **boundary** of a blown cluster — the brightest non-saturated texel just outside the dilation ring — retains a *directional* signal: the surface normal and the vector from that texel toward the cluster centroid point toward the real light source. These boundary peaks are added as **extra rays** to the triangulation pool, weighted by their (non-clipped) observed brightness. This recovers geometric hints from blown areas without trusting their intensities.

---

## Heuristic compile inference (gamma, `-fast`, etc.)

Values like **“fast: likely-on”** are **educated guesses** from BSP/lightmap statistics (e.g. hard shadow edges vs soft penumbra). They guide **envelope discard** and **recompile** defaults — not cryptographic proof of how the map was originally built.

---

## Where numbers appear

| Location | Typical metrics |
|----------|-----------------|
| `bsplrs verify` | recall, precision, position errors per map + aggregate |
| `bsplrs estimate` log | comparison vs entity lump when present |
| `bsplrs converge` → `convergence.md` | perceptual MSE/RMSE after recompile, forward SSE |
| Training CSV | recall, precision, compile-axis flags, inferred heuristics |
| `bsplrs estimate --dev-validate N` log | per-iteration MSE trace, best iteration |
| `bsplrs converge --iterate N` row | iterated? cell + final MSE/lights after RecompileRefiner |

## RecompileRefiner (closed-loop “look the same”)

> **Not part of the default `bsplrs estimate` pipeline.** Skip this section unless you're
> modifying the estimator algorithm itself. Normal users never invoke q3map2 — see the
> README's "Quick start" for the actual user-facing workflow. This section documents an
> internal validation harness used only by the developer of the algorithm.

The RecompileRefiner (`Metrics/RecompileRefiner.cs`, used internally by `converge --iterate` and
`estimate --dev-validate`) is a **developer-only** tool for algorithm validation. It does the
following per iteration:

1. **Inject** the current candidate lights into the reference `.map`.
2. **Recompile** via `q3map2` with heuristically inferred settings.
3. **Pair** every candidate texel to its nearest reference texel in world space (robust to lightmap layout / atlas-packing differences between compiles), excluding **blown** reference texels (no useful signal).
4. **Compute** perceptual MSE; if better than the best-so-far, snapshot.
5. **Update** per-light **intensity** (residual ratio) and **position** (residual-weighted centroid pull); add lights for un-owned residual clusters; drop lights with empty domain.
6. **Loop** until iteration budget exhausted or improvement plateaus.

The objective is **lightmap MSE**, not entity-list match, so the “look the same” target dominates. Best-iteration snapshot is returned (not the last iteration), guarding against late-iteration regressions.

## Texel-fetch audit (`TexelFetchAuditor`)

A separate diagnostic runs three independent correctness checks per emitted sample:

- **Atlas round-trip** — `(AtlasIndex, AtlasX, AtlasY)` re-read must match `Observed` byte-for-byte.
- **Barycentric inversion round-trip** — the triangle whose `lmUV`-barycentric inversion produced `World` must, when forward-mapped, land at the sample’s atlas-pixel centre within tolerance.
- **Planar forward cross-check** — for planar surfaces with self-consistent `lightmapVecs`, the lmVec forward map must agree with the barycentric path within ~one texel.

Plus duplicate-pixel and per-surface coverage stats. Used in unit tests and on real maps via `bsplrs estimate --dump-audit` (when wired) / `RealJk2Map_AuditorReportsNoAtlasMismatches` test.

If something is unclear in a log line, search this file for the capitalized term or open an issue with the exact log excerpt.
