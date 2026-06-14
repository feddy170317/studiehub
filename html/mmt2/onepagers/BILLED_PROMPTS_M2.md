# Billed-prompts — MMT2 M-2 · TTT- og CCT-diagrammer (5 figurer)

Generér billederne i en billed-AI (fx Midjourney, DALL·E, Nano Banana, Imagen) og gem dem med
**præcis det filnavn** der står under hver prompt, i mappen `images/`. Så snart filen ligger der,
forsvinder pladsholderen automatisk i HTML'en.

**Fælles stilramme (skriv den med hver gang, så alle one-pagers matcher):**
> Clean, modern educational textbook diagram. Flat vector illustration, white background,
> crisp thin lines, restrained color palette (navy #16385f, steel blue #1d5096, green #277847,
> warm orange #b45a14, neutral grays). Labels in **Danish**, sans-serif, perfectly legible.
> No clutter, no watermark, no drop shadows. High resolution, sharp.

> ⚠️ Billed-AI'er staver ofte labels forkert. Tjek alle tekster i det færdige billede — eller bed
> AI'en lave billedet **uden tekst**, så lægger vi labels på bagefter hvis nødvendigt.

---

### `images/M2_fig01_ttt_diagram.png` — Hoveddiagram: TTT-diagram (sektion 3)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Temp. (°C)", "log(tid)", "Austenit (ustabil)", "Perlit-region",
"Bainit-region", "Martensit", "A₁ 727 °C", "Mₛ ≈ 230 °C", "Mf", "Start", "Slut".
**Prompt:**
> [Fælles stilramme]. A schematic isothermal Time–Temperature–Transformation (TTT) diagram for
> eutectoid steel (0,76 % C). Y-axis "Temp. (°C)", x-axis "log(tid)". Two C-shaped (nose) curves
> in blue: an inner "Start" curve and an outer dashed "Slut" curve. Shade horizontal bands: top
> light-yellow "Austenit (ustabil)", upper-right light-green "Perlit-region", middle light-cyan
> "Bainit-region", bottom light-red "Martensit". Horizontal dashed orange line near top labelled
> "A₁ 727 °C". Two horizontal dashed red lines at the bottom labelled "Mₛ ≈ 230 °C" and "Mf".
> Clean technical diagram, educational style.

### `images/M2_fig02_koelekurver.png` — Kølekurver i TTT (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Langsom → Perlit", "Middel → Bainit", "Kritisk → Martensit",
"Næse", "Mₛ".
**Prompt:**
> [Fælles stilramme]. The same C-shaped TTT nose curve (light blue) on a "Temp. (°C)" vs "log(tid)"
> chart, with three descending cooling curves drawn over it: a slow curve crossing the upper part
> labelled "Langsom → Perlit" (green), a medium curve labelled "Middel → Bainit" (cyan), and a
> steep curve passing to the left of the nose labelled "Kritisk → Martensit" (red). Mark the nose
> of the curve with a small label "Næse" and a dashed horizontal line "Mₛ" near the bottom.
> Clean schematic, educational.

### `images/M2_fig03_sfaeroidit.png` — Sfæroidit & martensit (sektion 7)
**Format:** liggende, ca. 4:3 (to-panels, side om side).
**Labels der SKAL være med:** "Sfæroidit", "Cementit (Fe₃C)", "Ferrit (α)", "Martensit",
"BCT-gitter".
**Prompt:**
> [Fælles stilramme]. A two-panel microstructure comparison. Left panel "Sfæroidit": rounded
> spherical cementite particles ("Cementit (Fe₃C)") dispersed in a light ferrite matrix ("Ferrit
> (α)"), soft appearance. Right panel "Martensit": fine needle/lath-like acicular structure with
> an inset of a tetragonal "BCT-gitter" unit cell showing a trapped carbon atom. Thin leader lines
> to all labels. Clean textbook micrograph style.

### `images/M2_fig04_ttt.png` — TTT isotermt (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL være med:** "TTT (isotermt)", "Temp.", "log(tid)", "holdes konstant".
**Prompt:**
> [Fælles stilramme]. A small square schematic titled "TTT (isotermt)": a single C-shaped nose
> curve (blue) on a "Temp." vs "log(tid)" chart, with one cooling path that drops vertically and
> then runs perfectly horizontal (a flat dashed line) labelled "holdes konstant", illustrating an
> isothermal hold at one fixed temperature. Square crop, clean.

### `images/M2_fig05_cct.png` — CCT kontinuerlig (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL være med:** "CCT (kontinuerlig)", "Temp.", "log(tid)", "ned og til højre".
**Prompt:**
> [Fælles stilramme]. A small square schematic titled "CCT (kontinuerlig)": a C-shaped nose curve
> (blue) on a "Temp." vs "log(tid)" chart, plus a faint dashed grey copy of the curve shifted
> "ned og til højre" (down and to the right) with a small arrow showing the shift. One smooth
> continuously descending cooling curve crosses the diagram. Square crop, clean, visually distinct
> from the TTT panel.
