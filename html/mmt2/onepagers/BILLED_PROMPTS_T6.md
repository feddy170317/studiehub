# Billed-prompts — T-6 Slibning og overfladebehandling

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

## T-6 · Slibning og overfladebehandling (5 figurer)

### `images/t6_fig01_dressing.png` — Dressing af slibeskive (sektion 3)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Slibeskive", "Diamantdresser", "Skarpe korn".
**Prompt:**
> [Fælles stilramme]. A cross-section schematic of grinding-wheel dressing: a large rotating grinding
> wheel ("Slibeskive") with a rotation arrow, and a pointed diamond dressing tool ("Diamantdresser")
> moving across its rim, scraping away a thin worn layer to expose fresh sharp abrasive grains
> ("Skarpe korn"). Show abrasive grains as small embedded particles on the wheel surface. Thin
> technical lines, instructional.

### `images/t6_fig02_tolerance_pris.png` — Tolerance/pris-kurve (sektion 4)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Tolerance (IT-klasse)", "Relativ fremstillingspris", "IT14", "IT6".
**Prompt:**
> [Fælles stilramme]. A clean line chart. X-axis "Tolerance (IT-klasse)" with ticks from "IT14" on the
> left (loose) to "IT6" on the right (tight), with an arrow noting "← tightere". Y-axis "Relativ
> fremstillingspris". One steel-blue curve rising exponentially as tolerance gets tighter (low and flat
> on the left, steep on the right). Light grid, simple, legible.

### `images/t6_fig03_galvanisering.png` — Galvanisering / katodisk (sektion 5, venstre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Zink (Zn)", "Stål", "Katodisk beskyttelse".
**Prompt:**
> [Fælles stilramme]. Cross-section of galvanised steel: a gray steel base layer ("Stål") covered by a
> bright zinc coating layer ("Zink (Zn)"). Show small arrows/electrons indicating the zinc sacrificing
> itself to protect the steel, with a label "Katodisk beskyttelse". Layered cross-section, clean,
> square crop.

### `images/t6_fig04_barriere.png` — Barrierebelægning (sektion 5, højre)
**Format:** kvadratisk, 1:1.
**Labels der SKAL med:** "Maling/coating", "Stål", "Barriere".
**Prompt:**
> [Fælles stilramme]. Cross-section of a barrier-protected steel surface: a gray steel base ("Stål")
> with a smooth paint/plating top layer ("Maling/coating") blocking water and oxygen droplets shown as
> small symbols bouncing off the surface, labelled "Barriere". Clean layered cross-section, square crop.
> Make it visually distinct from the sacrificial-zinc version.

### `images/t6_fig05_anodisering.png` — Anodisering af aluminium (sektion 7)
**Format:** liggende, ca. 4:3.
**Labels der SKAL med:** "Aluminium", "Al₂O₃ (5–25 µm)", "Anodisering".
**Prompt:**
> [Fælles stilramme]. Cross-section schematic of anodised aluminium: an aluminium base ("Aluminium")
> topped by a thick porous oxide layer ("Al₂O₃ (5–25 µm)") with small vertical pores. A label
> "Anodisering" with an arrow pointing to the thickened oxide layer. Optionally show a tiny inset of the
> natural ~4 nm film vs. the thick anodised layer. Clean cross-section, labelled.
