# Billed-prompts — MMT2 One-pager T-3 · Plademetalsformning

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

## T-3 · Plademetalsformning (5 figurer)

### `images/t3_fig01_fld.png` — Forming Limit Diagram (sektion 3, hoveddiagram)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** x-akse "Minor strain ε₂", y-akse "Major strain ε₁", "FLC", "Brud/lunke-zone", "Sikker formningszone", "Rynkefare", "Kompression", "Stræk", punkter "Dybt træk", "Plan strain", "Stræk".
**Prompt:**
> [Fælles stilramme]. A Forming Limit Diagram (FLD): x-axis labelled "Minor strain ε₂" (negative on
> the left marked "Kompression", positive on the right marked "Stræk"), y-axis labelled
> "Major strain ε₁". Draw a red curved Forming Limit Curve (FLC) that dips to a minimum near ε₂=0 and
> rises on both sides; label it "FLC". Shade the area above the curve light red and label it
> "Brud/lunke-zone"; shade below light green and label "Sikker formningszone"; add a narrow orange band
> on the far left labelled "Rynkefare". Mark three blue dots on/near the curve: "Dybt træk" (left),
> "Plan strain" (bottom centre), "Stræk" (right). Clean technical chart.

### `images/t3_fig02_springback.png` — Spring-back ved bøjning (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Under tryk (ønsket vinkel)", "Efter aflastning (fjedrer tilbage)", "Spring-back Δθ".
**Prompt:**
> [Fælles stilramme]. A two-state diagram of sheet-metal bending spring-back: on the left a sheet bent
> tightly in a V-die labelled "Under tryk (ønsket vinkel)"; on the right the same sheet after the load
> is removed, opened slightly to a wider angle, labelled "Efter aflastning (fjedrer tilbage)". Show the
> small angular difference between them with a curved arrow labelled "Spring-back Δθ". Side-view
> technical illustration, clean lines.

### `images/t3_fig03_blanking.png` — Blanking (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Blanking", "Stempel", "Matrice", "Blank = produkt", "Plade = skrot".
**Prompt:**
> [Fælles stilramme]. Cross-section of a blanking operation: a punch ("Stempel") pressing down through
> a sheet into a die ("Matrice"), cutting out a disc. Highlight the cut-out piece in green labelled
> "Blank = produkt", and the surrounding remaining sheet in gray labelled "Plade = skrot". Title the
> figure "Blanking". Side-view die-cutting illustration, square crop.

### `images/t3_fig04_punching.png` — Punching (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Punching", "Stempel", "Matrice", "Hul = produkt", "Slug = skrot".
**Prompt:**
> [Fælles stilramme]. Cross-section of a punching operation: a punch ("Stempel") pressing down through
> a sheet into a die ("Matrice"), making a hole. Highlight the remaining perforated sheet in green with
> the hole labelled "Hul = produkt", and the small punched-out slug in gray labelled "Slug = skrot".
> Title the figure "Punching". Make it visually mirror the blanking figure (same style, opposite
> product/scrap colouring). Side-view illustration, square crop.

### `images/t3_fig05_fine_blanking.png` — Fine blanking m. V-ring (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Stempel", "V-ring (låsering)", "Matrice", "Hydrostatisk tryk", "Glat skærekant".
**Prompt:**
> [Fælles stilramme]. Cross-section of a fine-blanking setup: a punch ("Stempel") above a sheet, a
> V-shaped stinger ring ("V-ring (låsering)") pressing into the sheet around the cut to clamp it, and a
> counter-pressure die ("Matrice") below. Add an arrow/label "Hydrostatisk tryk" indicating compression
> in the cut zone, and a callout "Glat skærekant" pointing at a clean, smooth sheared edge through the
> full thickness. Side-view technical illustration, clean lines.
