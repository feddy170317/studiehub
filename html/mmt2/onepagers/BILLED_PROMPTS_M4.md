# Billed-prompts — MMT2 M-4 · Korrosion og materialenedbrydning (5 figurer)

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

### `images/M4_fig01_galvanisk.png` — Hoveddiagram: elektrokemisk korrosionscelle (sektion 3)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Anode (Fe)", "Katode (Cu)", "Elektrolyt (vand + ioner)",
"Elektroner (e⁻)", "Fe → Fe²⁺ + 2e⁻", "O₂ + 2H₂O + 4e⁻ → 4OH⁻", "Ioner".
**Prompt:**
> [Fælles stilramme]. A schematic electrochemical corrosion cell. A light-blue tank labelled
> "Elektrolyt (vand + ioner)" holds two metal electrodes: a grey one on the left "Anode (Fe)" with
> reaction text "Fe → Fe²⁺ + 2e⁻", and a copper/golden one on the right "Katode (Cu)" with reaction
> text "O₂ + 2H₂O + 4e⁻ → 4OH⁻". A red arrow across the top labelled "Elektroner (e⁻)" runs from
> anode to cathode. A grey dashed arrow in the liquid labelled "Ioner". Clean technical schematic.

### `images/M4_fig02_rust.png` — Rustdannelse (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Fe", "O₂", "H₂O", "Rust (Fe₂O₃·xH₂O)", "porøst lag".
**Prompt:**
> [Fælles stilramme]. A cross-section of an iron surface "Fe" with water droplets "H₂O" and oxygen
> "O₂" arrows reaching it, forming a flaky, porous reddish-brown rust layer labelled
> "Rust (Fe₂O₃·xH₂O)" and "porøst lag" that does not protect, with corrosion progressing inward
> beneath it (small arrows pointing into the metal). Clean educational cross-section illustration.

### `images/M4_fig03_offeranode.png` — Katodisk beskyttelse / offeranode (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL være med:** "Offeranode (Zn)", "Stålkonstruktion", "korroderer i stedet",
"beskyttet".
**Prompt:**
> [Fælles stilramme]. A cathodic-protection schematic: a steel structure "Stålkonstruktion"
> (e.g. a pipeline or ship hull section) in seawater, connected to a sacrificial zinc block
> "Offeranode (Zn)". Show the zinc block corroding with a note "korroderer i stedet" while the
> steel is marked "beskyttet". A small arrow shows electron flow from anode to the protected steel.
> Clean technical schematic.

### `images/M4_fig04_pitting.png` — Pittingkorrosion (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL være med:** "Pittingkorrosion", "Cl⁻", "Passivfilm brudt", "dybt hul".
**Prompt:**
> [Fælles stilramme]. A square cross-section of a stainless steel surface with a thin protective
> "Passivfilm" on top. A chloride ion "Cl⁻" breaks through the film at one point, creating a narrow,
> deep pit "dybt hul" eating into the metal. Title "Pittingkorrosion". Clean educational
> cross-section, square crop.

### `images/M4_fig05_spalte.png` — Spaltekorrosion (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL være med:** "Spaltekorrosion", "Pakning", "ilt udtømt", "anodisk", "metal opløses".
**Prompt:**
> [Fælles stilramme]. A square cross-section showing two overlapping metal plates with a gasket
> "Pakning" forming a narrow crevice between them. Inside the crevice mark "ilt udtømt" and
> "anodisk" where the metal dissolves "metal opløses"; outside the crevice is oxygen-rich
> (cathodic). Title "Spaltekorrosion". Make it visually distinct from the pitting panel. Clean
> educational cross-section, square crop.
