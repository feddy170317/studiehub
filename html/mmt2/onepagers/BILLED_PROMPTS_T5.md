# Billed-prompts — T-5 Kompositmaterialer — produktion

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

## T-5 · Kompositmaterialer — produktion (5 figurer)

### `images/t5_fig01_tre_metoder.png` — Tre opstillinger (sektion 3)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Hand lay-up", "RTM", "Autoclave".
**Prompt:**
> [Fælles stilramme]. A three-panel comparison diagram of composite production methods, side by side,
> each in its own labelled box. Panel 1 "Hand lay-up": an open mould with stacked fibre layers and a
> worker's hand-roller applying resin. Panel 2 "RTM": a closed two-part mould with an injection nozzle
> pumping resin into dry fibre preform inside. Panel 3 "Autoclave": a part sealed in a vacuum bag inside
> a cylindrical pressure vessel, with small arrows for "tryk" and "varme". Thin technical cross-section
> style, each panel clearly separated.

### `images/t5_fig02_hand_layup.png` — Hand lay-up trin (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Form", "Fiberlag", "Harpiks (rulle)".
**Prompt:**
> [Fælles stilramme]. A cross-section schematic of the hand lay-up process: an open concave mould
> ("Form") at the bottom, several stacked fibre fabric layers ("Fiberlag") on top of it, and a hand-held
> roller applying liquid resin ("Harpiks (rulle)") onto the top layer. Show 3–4 layers building up.
> Simple, instructional, labelled with thin leader lines.

### `images/t5_fig03_laminat.png` — Kontinuert laminat (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "0°", "45°", "90°".
**Prompt:**
> [Fælles stilramme]. Exploded schematic of a continuous-fibre laminate: several flat stacked plies,
> each ply showing straight parallel fibres at a different orientation — label the plies "0°", "45°"
> and "90°". Ordered, engineered, layered appearance. Steel-blue tones. Clean cross-section, square crop.

### `images/t5_fig04_kortfiber.png` — Kortfiber-komposit (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Random fibre", "Matrix".
**Prompt:**
> [Fælles stilramme]. Schematic of a short-fibre composite: a solid green-tinted matrix block ("Matrix")
> filled with many short straight fibres scattered in random orientations ("Random fibre"). Disordered,
> isotropic appearance — visually clearly distinct from the ordered laminate. Clean square crop.

### `images/t5_fig05_bulk_vs_fiber.png` — Bulk vs. fiber (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Bulk", "Fiberforstærket", "Trækstyrke (MPa)".
**Prompt:**
> [Fælles stilramme]. A simple two-bar comparison chart. Y-axis "Trækstyrke (MPa)" on a broken/log feel.
> Bar 1 "Bulk" short (~40–80 MPa, gray). Bar 2 "Fiberforstærket" tall (~300–2000 MPa, steel blue).
> Add a small note under each: "isotrop, sprødt" under Bulk and "anisotrop" under Fiberforstærket.
> Clean, legible bar chart, light grid.
