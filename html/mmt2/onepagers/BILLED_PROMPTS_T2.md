# Billed-prompts — MMT2 One-pager T-2 · Pulvermetallurgi

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

## T-2 · Pulvermetallurgi (5 figurer)

### `images/t2_fig01_procesforloeb.png` — PM-procesforløb (sektion 3, hoveddiagram)
**Format:** liggende, ca. 4:3 (helst bredt 16:9).
**Labels der SKAL med:** "Pulverproduktion", "Blanding (binders)", "Presning (compaction)", "Grøn kompakt", "Sintring (ovn)", "Færdigt emne", samt "Porøst, skrøbeligt" under grøn kompakt og "Stærkt, tæt" under færdigt emne.
**Prompt:**
> [Fælles stilramme]. A horizontal process-flow diagram of the powder metallurgy process: six
> rounded rectangular boxes connected left-to-right by blue arrows, labelled in order
> "Pulverproduktion", "Blanding (binders)", "Presning (compaction)", "Grøn kompakt", "Sintring (ovn)",
> "Færdigt emne". Below the "Grøn kompakt" box add a small gray caption "Porøst, skrøbeligt"; below
> "Færdigt emne" add "Stærkt, tæt". Use small icons inside each box (powder particles, mixer, press,
> a porous puck, a furnace, a dense finished gear). Clean flat infographic style.

### `images/t2_fig02_green_compact.png` — Grøn kompakt mikrostruktur (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Metalpartikler", "Porer (10–20 %)", "Mekanisk sammenfiltring".
**Prompt:**
> [Fælles stilramme]. Cross-section schematic of a green compact microstructure: irregular rounded
> metal powder particles pressed together with visible voids/pores between them. Label the particles
> "Metalpartikler", the gaps "Porer (10–20 %)", and add a leader line "Mekanisk sammenfiltring"
> pointing to a contact point between two particles. The particles touch but are not fully fused.
> Loose, porous appearance. Clean textbook cross-section illustration.

### `images/t2_fig03_pm.png` — PM standard sintret del (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "PM (standard)", "80–95 % densitet", "Restporøsitet", "Isotrop kornstruktur".
**Prompt:**
> [Fælles stilramme]. Schematic cross-section of a standard sintered PM part: equiaxed (isotropic)
> grains with some small rounded residual pores scattered between grains. Title it "PM (standard)".
> Add labels "80–95 % densitet", "Restporøsitet" (leader line to a pore), and "Isotrop kornstruktur".
> Slightly porous but mostly dense appearance. Square crop, clean textbook micrograph style.

### `images/t2_fig04_pf.png` — Pulversmedet del (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "PF (pulversmedning)", ">99 % densitet", "Orienteret korn (smederetning)".
**Prompt:**
> [Fælles stilramme]. Schematic cross-section of a powder-forged (PF) part: elongated grains aligned
> in one direction (forging flow lines), essentially no pores — fully dense. Title it
> "PF (pulversmedning)". Add labels ">99 % densitet" and "Orienteret korn (smederetning)" with a
> directional flow-line arrow. Make it visually distinct from the isotropic porous PM version. Square
> crop, clean textbook micrograph style.

### `images/t2_fig05_oekonomi.png` — Stykpris vs. seriestørrelse (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** x-akse "Seriestørrelse (stk.)", y-akse "Pris pr. styk (kr.)", kurve "PM (presning + sintring)", lodret guide ">10.000 stk. — break-even".
**Prompt:**
> [Fælles stilramme]. A clean line graph: x-axis "Seriestørrelse (stk.)", y-axis "Pris pr. styk (kr.)".
> One steeply decreasing curve labelled "PM (presning + sintring)" that drops sharply then flattens at
> high volume (tooling cost amortised). Add a vertical dashed guide line labelled ">10.000 stk. —
> break-even". Simple, legible chart with light grid and labelled axes.
