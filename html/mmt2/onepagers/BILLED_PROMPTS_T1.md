# Billed-prompts — MMT2 T-1 (Støbning)

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

## T-1 · Støbning (5 figurer)

### `images/t1_fig01_stoebeform.png` — Tværsnit af sandstøbeform (sektion 3, hoveddiagram)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Cup", "Sprue", "Well", "Runner", "Gate", "Emne (kavitet)", "Stiger (riser)", "Bob", "Chill".
**Prompt:**
> [Fælles stilramme]. A cross-section of a typical sand casting mold, side view, gray mold block.
> From left to right show the gating system: a funnel at top labelled "Cup", a vertical channel down
> labelled "Sprue", a small pool at its base labelled "Well", a horizontal channel labelled "Runner",
> a narrow entry into the cavity labelled "Gate", and the central rectangular part cavity labelled
> "Emne (kavitet)". On the right side a tall reservoir labelled "Stiger (riser)" with an extension on
> top labelled "Bob". Below the part a metal insert labelled "Chill". Use orange for the gating
> channels, blue for the riser/bob, cyan for the chill, red for the gate. Add small flow arrows from
> cup down through the system. Clean labelled engineering cross-section.

### `images/t1_fig02_direktionel_stoerknen.png` — Direktionel størknen (sektion 4)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Chill (størkner først)", "Stiger (størkner sidst)", "Størkningsretning".
**Prompt:**
> [Fælles stilramme]. A schematic showing directional solidification in a casting. A horizontal part
> with a thin section on the left and a thick section on the right. A chill at the thin/left end
> labelled "Chill (størkner først)"; a riser above the thick/right end labelled "Stiger (størkner
> sidst)". Show a gradient of solidified zones progressing from the chill toward the riser, with a
> bold arrow labelled "Størkningsretning" pointing from chill to riser. Clean labelled process
> diagram, side view.

### `images/t1_fig03_sandstoebning.png` — Sandstøbning, permanent mønster (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Skal-labels:** "Permanent mønster (genbruges)", "Sandform (forbrugbar)".
**Prompt:**
> [Fælles stilramme]. A schematic of sand casting with a permanent pattern. Show a reusable wooden/
> metal pattern (solid object) labelled "Permanent mønster (genbruges)" next to a two-part sand mold
> (cope and drag) labelled "Sandform (forbrugbar)" with the cavity left after the pattern is removed.
> A small recycle arrow on the pattern to indicate reuse. Clean schematic, square crop.

### `images/t1_fig04_investeringsstoebning.png` — Investeringsstøbning / lost-wax (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Skal-labels:** "Voksmønster (smeltes ud)", "Keramisk form (forbrugbar)".
**Prompt:**
> [Fælles stilramme]. A schematic of investment (lost-wax) casting. Show a wax pattern labelled
> "Voksmønster (smeltes ud)" being dipped/coated to form a ceramic shell, then the shell labelled
> "Keramisk form (forbrugbar)" with the wax melting out (small droplets and a heat/arrow symbol).
> Emphasize that both pattern and mold are single-use. Clean schematic, square crop. Make it clearly
> distinct from the reusable-pattern sand casting figure.

### `images/t1_fig05_lunker_kontrol.png` — Lunker-kontrol med stiger + chill (sektion 7)
**Format:** liggende, ca. 4:3.
**Skal-labels:** "Tyk sektion", "Stiger feder", "Chill", "Lunke i stiger (ikke i emne)".
**Prompt:**
> [Fælles stilramme]. A before/idea diagram showing shrinkage-defect control. A casting with a thick
> section labelled "Tyk sektion". A riser placed directly above it labelled "Stiger feder", with a
> small shrinkage void shown inside the riser labelled "Lunke i stiger (ikke i emne)". A chill placed
> under the thick section labelled "Chill" with small cooling arrows. Show a feeding arrow from the
> riser into the part. The point: the void ends up in the riser, leaving the part sound. Clean
> labelled diagram, side view.
