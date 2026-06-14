# Billed-prompts — MMT2 One-pager T-4 · Plast og sprøjtestøbning

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

## T-4 · Plast og sprøjtestøbning (5 figurer)

### `images/t4_fig01_sproejtestoebning.png` — Sprøjtestøbemaskine (sektion 3, hoveddiagram)
**Format:** liggende, ca. 16:9 (bredt).
**Labels der SKAL med:** "Hopper", "Tønde (barrel)", "Skrue (screw)", "Varmeelementer", "Nozzle", "Sprue", "Runner/Gate", "Støbeform (mold)", "Emne", "Motor/tryk".
**Prompt:**
> [Fælles stilramme]. A schematic side-view cross-section of an injection molding machine, left to
> right: a "Hopper" funnel feeding granules into a horizontal heated barrel labelled "Tønde (barrel)"
> containing a long rotating "Skrue (screw)"; red heater bands under the barrel labelled
> "Varmeelementer"; a "Motor/tryk" arrow pushing the screw from the left; a "Nozzle" at the right end;
> then "Sprue", "Runner/Gate" channels leading into a closed two-half mould "Støbeform (mold)" with a
> cavity labelled "Emne". Clean labelled engineering schematic.

### `images/t4_fig02_emner.png` — Typiske sprøjtestøbte emner (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Legoklods", "Kabinet", "Gear", "Mobilcover".
**Prompt:**
> [Fælles stilramme]. A neat grid of four typical injection-moulded plastic products, each labelled:
> a toy brick "Legoklods", an electronics housing "Kabinet", a small plastic "Gear", and a phone case
> "Mobilcover". Simple flat product icons, consistent style, evenly spaced on white background.

### `images/t4_fig03_injection.png` — Sprøjtestøbning (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Sprøjtestøbning", "Lukket form", "Diskontinuerlig (cyklus)", "Højt tryk 100–200 MPa".
**Prompt:**
> [Fælles stilramme]. A simple icon-style illustration of injection molding: a closed two-half mould
> with molten plastic being injected into a 3D cavity. Title it "Sprøjtestøbning". Add labels
> "Lukket form", "Diskontinuerlig (cyklus)", and "Højt tryk 100–200 MPa". Clean flat process icon,
> square crop.

### `images/t4_fig04_extrusion.png` — Ekstrudering (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Ekstrudering", "Die", "Kontinuerligt profil", "Moderat tryk 10–100 MPa".
**Prompt:**
> [Fælles stilramme]. A simple icon-style illustration of plastic extrusion: a screw pushing melt
> through a shaped die producing a continuous profile (e.g. a tube/pipe) coming out the right side.
> Title it "Ekstrudering". Add labels "Die", "Kontinuerligt profil", and "Moderat tryk 10–100 MPa".
> Make it visually distinct from the injection-molding icon. Clean flat process icon, square crop.

### `images/t4_fig05_warpage.png` — Glasfiberorientering og warpage (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Glasfibre", "Flowretning", "Lav krympning (langs flow)", "Høj krympning (på tværs)", "Warpage (vridning)".
**Prompt:**
> [Fælles stilramme]. A diagram of fiber-reinforced polymer shrinkage: a thin-walled part with many
> short glass fibers ("Glasfibre") aligned along a "Flowretning" arrow. Use two arrows to show
> "Lav krympning (langs flow)" (small) along the flow and "Høj krympning (på tværs)" (large)
> perpendicular to it. On the right show the resulting warped part with a curved-edge silhouette
> labelled "Warpage (vridning)". Clean technical illustration.
