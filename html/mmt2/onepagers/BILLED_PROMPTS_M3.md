# Billed-prompts — MMT2 M-3 · Varmebehandling af metaller (5 figurer)

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

### `images/M3_fig01_forloeb.png` — Hoveddiagram: varmebehandlingsforløb (sektion 3)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Temp. (°C)", "Tid", "Austenitregion", "A₃", "A₁", "Mₛ",
"Normalisering (luft)", "Blødglødning (ovn)", "Hærdning (vand/olie)", "Martensit", "Anlasning".
**Prompt:**
> [Fælles stilramme]. A schematic temperature-vs-time heat-treatment diagram. Y-axis
> "Temp. (°C)", x-axis "Tid". Light-yellow shaded band at top labelled "Austenitregion" with two
> dashed orange horizontal lines "A₃" and "A₁". A dashed red horizontal line near the bottom
> "Mₛ" with a light-red band "Martensit" below it. Three descending cooling curves starting in the
> austenite region: a medium green one "Normalisering (luft)", a slow blue one "Blødglødning (ovn)",
> and a steep red one "Hærdning (vand/olie)". A purple stepped arrow from the martensite region
> rising to ~300 °C and running horizontally labelled "Anlasning". Clean technical diagram.

### `images/M3_fig02_haerdning.png` — Hærdning + anlasning, 3 trin (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "1 Austenitisering", "2 Hærdning → Martensit", "3 Anlasning",
"BCT-gitter", "hårdhed ↓ sejhed ↑".
**Prompt:**
> [Fælles stilramme]. A three-step horizontal flow diagram of quench-and-temper. Step 1
> "1 Austenitisering": a heated cube glowing red-orange above an "A₃" line. Step 2
> "2 Hærdning → Martensit": the cube being quenched (water/oil droplets) with a small inset
> "BCT-gitter" unit cell containing a trapped carbon atom. Step 3 "3 Anlasning": the cube being
> reheated moderately with a small note "hårdhed ↓ sejhed ↑". Connect steps with arrows.
> Clean educational flow illustration.

### `images/M3_fig03_jominy.png` — Jominy-endeafkølingstest (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Jominy-test", "Vandstråle", "Austenitiseret stang", "Afstand fra
køleende", "Hårdhed (HRC)", "høj hærdeevne", "lav hærdeevne".
**Prompt:**
> [Fælles stilramme]. A Jominy end-quench test illustration. Left: a vertical cylindrical bar
> "Austenitiseret stang" with a water jet "Vandstråle" hitting its lower end. Right: a small graph
> with x-axis "Afstand fra køleende" and y-axis "Hårdhed (HRC)", showing two curves — one staying
> high labelled "høj hærdeevne" and one dropping quickly labelled "lav hærdeevne". Title "Jominy-test".
> Clean technical schematic.

### `images/M3_fig04_normalisering.png` — Normalisering, luftafkøling (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL være med:** "Normalisering", "Luftafkøling", "Fin perlit", "jævne korn".
**Prompt:**
> [Fælles stilramme]. A square microstructure schematic titled "Normalisering". Show a uniform
> fine-grained microstructure of small even grains "jævne korn" filled with fine lamellar pearlite
> "Fin perlit". A small icon of a part cooling in still air with the note "Luftafkøling". Clean
> textbook micrograph style, square crop.

### `images/M3_fig05_bloedgloedning.png` — Blødglødning, ovnafkøling (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL være med:** "Blødglødning", "Ovnafkøling", "Grov perlit", "blødest (HB 150–200)".
**Prompt:**
> [Fælles stilramme]. A square microstructure schematic titled "Blødglødning". Show a coarse-grained
> microstructure with large grains and coarse, widely-spaced lamellar pearlite "Grov perlit",
> softer appearance, with a note "blødest (HB 150–200)". A small icon of a part cooling inside a
> furnace with the note "Ovnafkøling". Make it visually distinct from the fine-grained normalisering
> version. Clean textbook micrograph style, square crop.
