# Billed-prompts — MMT2 M-5 (Stål, rustfrit stål, støbejern og aluminium)

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

## M-5 · Stål, rustfrit stål, støbejern og aluminium (5 figurer)

### `images/m5_fig01_staaltyper.png` — Rustfri ståltyper (sektion 3, hoveddiagram)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Ferritisk (BCC)", "Austenitisk (FCC)", "Martensitisk (BCT)", "Duplex (FCC+BCC)".
**Prompt:**
> [Fælles stilramme]. A four-panel comparison chart of the four stainless steel families, one cell
> per family arranged in a 2×2 grid. Each cell shows a small simplified crystal-lattice cube and the
> family name: top-left "Ferritisk (BCC)" with a body-centered cubic cell (blue); top-right
> "Austenitisk (FCC)" with a face-centered cubic cell (green); bottom-left "Martensitisk (BCT)" with
> a slightly elongated body-centered tetragonal cell (orange); bottom-right "Duplex (FCC+BCC)" with
> two intertwined cells (navy). Below each, one short Danish keyword: "billig/magnetisk",
> "sej/ikke-magnetisk", "hård", "stærk/chloridfast". Clean technical comparison layout.

### `images/m5_fig02_passivfilm.png` — Cr₂O₃-passivfilm (sektion 4)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Stål (Fe-Cr)", "Cr₂O₃ passivfilm (2–3 nm)", "Selvhelende".
**Prompt:**
> [Fælles stilramme]. A schematic cross-section of a stainless steel surface showing a thin
> self-healing passive layer. Bottom thick gray block labelled "Stål (Fe-Cr)"; a very thin bright
> green top layer labelled "Cr₂O₃ passivfilm (2–3 nm)". Include one small inset showing a scratch in
> the film that re-forms, with a curved arrow labelled "Selvhelende". Add small dots representing Cr
> atoms migrating to the surface. Clean labelled cross-section, side view.

### `images/m5_fig03_graat_stoebejern.png` — Gråt støbejern (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Skal-labels:** "Grafitflager", "Perlitmatrix".
**Prompt:**
> [Fælles stilramme]. Schematic micrograph of grey cast iron: dark, elongated, randomly oriented
> graphite flakes ("Grafitflager") scattered through a lighter matrix ("Perlitmatrix"). The flakes
> look like thin curved dark slivers. Thin leader lines point to one flake and to the matrix. Brittle
> appearance. Clean textbook micrograph style, square crop.

### `images/m5_fig04_sg_jern.png` — S-G-jern (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Skal-labels:** "Grafitnodler (kugler)", "Ferrit/perlit-matrix".
**Prompt:**
> [Fælles stilramme]. Schematic micrograph of spheroidal graphite (ductile/SG) cast iron: round,
> dark, evenly distributed graphite nodules ("Grafitnodler (kugler)") embedded in a lighter matrix
> ("Ferrit/perlit-matrix"). Nodules are clearly spherical, contrasting with sharp flakes. Thin leader
> lines label one nodule and the matrix. Tough, ductile appearance. Clean textbook micrograph style,
> square crop. Make it visually distinct from the grey-iron flake version.

### `images/m5_fig05_modningshaerdning.png` — Modningshærdning (sektion 7)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Temperatur", "Tid", "Opløsningsglødning (~500 °C)", "Vandafkøling (quench)", "Modning".
**Prompt:**
> [Fælles stilramme]. A temperature–time process curve for precipitation (age) hardening of an
> aluminium alloy. X-axis "Tid", y-axis "Temperatur". The curve: rises and holds at a high plateau
> labelled "Opløsningsglødning (~500 °C)", then drops steeply (vertical) labelled "Vandafkøling
> (quench)", then holds at a low plateau labelled "Modning (100–200 °C)". Add three tiny inset
> circles along the curve showing: dissolved atoms, supersaturated solution, fine precipitates
> blocking dislocations. Clean labelled process diagram, light grid.
