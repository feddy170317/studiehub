# Billed-prompts — MMT2 M-6 (Polymerer og kompositmaterialer)

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

## M-6 · Polymerer og kompositmaterialer (5 figurer)

### `images/m6_fig01_polymerkaede.png` — Polymerkæde / repeterende enhed (sektion 3, hoveddiagram)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Monomer", "Repeterende enhed", "[–CH₂–CH₂–]ₙ", "Polyethylen (PE)".
**Prompt:**
> [Fælles stilramme]. A diagram explaining polymer structure. Top: a single small monomer unit
> (two bonded carbon circles with hydrogens) labelled "Monomer". A bold arrow pointing right labelled
> "n ·" to a long horizontal chain of repeating identical units labelled "Repeterende enhed", with a
> bracket around one unit and subscript n. Below the chain, the formula "[–CH₂–CH₂–]ₙ" and the name
> "Polyethylen (PE)". Show the chain as a continuous zig-zag backbone. Clean educational chemistry
> diagram, horizontal layout.

### `images/m6_fig02_termo_vs_haerde.png` — Termoplast vs. hærdeplast (sektion 4)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Termoplast: lineære kæder", "Hærdeplast: krydsbundet netværk", "van der Waals", "Kovalente krydsbindinger".
**Prompt:**
> [Fælles stilramme]. A side-by-side comparison of two polymer structures. Left panel labelled
> "Termoplast: lineære kæder": several separate wavy spaghetti-like chains lying loosely next to each
> other (blue), with a small note "van der Waals" between them. Right panel labelled "Hærdeplast:
> krydsbundet netværk": chains connected by short rigid cross-links forming a fixed mesh (orange),
> with a note "Kovalente krydsbindinger". A thin divider line between the two panels. Clean schematic,
> horizontal layout.

### `images/m6_fig03_ud_laminat.png` — Unidirektionelt laminat (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Skal-labels:** "Unidirektionel (UD)", "Fibre", "Matrix", "0°".
**Prompt:**
> [Fælles stilramme]. A schematic of a unidirectional (UD) fiber composite laminate, slightly
> isometric. Several stacked layers; within each layer all fibers run parallel in the same direction
> (thin blue lines) embedded in a gray matrix. Label "Unidirektionel (UD)" as title, "Fibre" pointing
> to the parallel lines, "Matrix" pointing to the gray surrounding material, and a small "0°"
> direction arrow. Clean technical layered illustration, square crop.

### `images/m6_fig04_woven_laminat.png` — Woven laminat (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Skal-labels:** "Woven (0°/90°)", "Fibre 0°", "Fibre 90°".
**Prompt:**
> [Fælles stilramme]. A schematic of a woven (0°/90°) fiber composite layer: fibers interlaced in a
> plain-weave checkerboard pattern, horizontal bundles labelled "Fibre 0°" and vertical bundles
> labelled "Fibre 90°" crossing over and under each other (green). Title "Woven (0°/90°)". Clean
> top-down technical weave illustration, square crop. Make it clearly distinct from the parallel UD
> version.

### `images/m6_fig05_styrke_vaegt.png` — Styrke/vægt-sammenligning (sektion 7)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Densitet (g/cm³)", "Specifik styrke", "Stål", "Aluminium", "CFRP (komposit)".
**Prompt:**
> [Fælles stilramme]. A simple scatter/bar chart comparing materials on specific strength vs weight.
> X-axis "Densitet (g/cm³)", y-axis "Specifik styrke". Plot three labelled points/bars: "Stål" (high
> density, moderate specific strength, gray), "Aluminium" (low density, moderate, blue), "CFRP
> (komposit)" (low density, very high specific strength, green) positioned clearly highest-left to
> show its advantage. Light grid, small legend. Clean chart.
