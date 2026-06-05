# Underplan B — `/katalog`-skill (auto-scan `Kurser/` → content.json)

## Mål
Skill der læser `Kurser/`-struktur, udleder fag/lektioner/quizzer, skriver `content.json`-udkast. Frederik finpudser (titler, pensum-summaries, links).

## Workflow

### Phase 1: Scan + Detect
1. Læs alle mapper under `Kurser/`
2. For hver fagmappe (DYN 1, MMT1, MMT2, Mek osv.):
   - **Detektér lektions-struktur:**
     - Type A: `Lektion N/` undermapper (DYN 1, Mek) → læs navn fra mappenavn
     - Type B: Flade `Lektion_NN_*.pdf` filer (MMT1/2) → udled nummer + titel fra filnavn
   - **Find quiz-mapper** (`Laering_*_Quiz/`) → link til `quiz/[fag]/index.html`
   - **Scan opgaver/kapitler** (registrér stier, men host ikke)

### Phase 2: Prompt bruger
```
Du har scanned disse fag:
  ✓ MMT2 (18 lektioner, 1 quiz)
  ✓ MEK2 (8 lektioner, 1 quiz)
  ✓ DYN 1 (7 lektioner, 0 quizzer)
  ...

For hver lektion, indtast:
  1. Pensum-summary (1-2 sætninger)
  2. YouTube-video-links (komma-adskilt URL'er, eller skip)
  3. NotebookLM-podcast-link (eller skip)
  4. Læsbare referencer (bog-kapitler osv.)

Eller acceptér auto-genereret (generisk) version og redigér JSON senere.
```

### Phase 3: Output
Skriver `content.json` med struktur:
```json
{
  "version": 1,
  "educations": [{
    "id": "maskiningenioer",
    "name": "Maskiningeniør",
    "institution": "VIA Horsens",
    "semesters": [{
      "id": "sem2",
      "number": 2,
      "courses": [{
        "id": "mmt2",
        "code": "MMT2",
        "name": "Materialevidenskab 2",
        "description": "...",
        "lessons": [
          {
            "id": "l01",
            "number": 1,
            "title": "Introduktion til Materialevidenskab",
            "summary": "...",
            "materials": [
              { "type": "quiz", "title": "...", "url": "quiz/mmt2/index.html" },
              { "type": "reading", "title": "Bog", "ref": "Callister kap. 1" },
              { "type": "video", "title": "...", "url": "https://youtube.com/..." },
              ...
            ]
          },
          ...
        ]
      }]
    }]
  }]
}
```

## Implementation Notes

### Skill-struktur
- Plats: `c:\Users\pif-m\OneDrive\Desktop\AI\Plugins\skills\katalog.md`
- Baseret på eksisterende skill-template (`/quiz-da`, `/projekt`)
- Brugeropdelt i phases (scan → prompt → output)

### Håndtering af blandet lektions-paradigmer
**Type A (Mappebaseret):**
```
Kurser/DYN 1/
├── Lektion 1/
│   ├── Opgave_*.pdf
│   └── Opgave_*.mcdx
├── Lektion 2/
```
→ Læs mappenavn direkte som lektions-nummer, søg efter titel i README/filer

**Type B (Flat-file):**
```
Kurser/MMT2/
├── Lektion_01_Introduktion_til_materialelære.pdf
├── Lektion_02_Atomstruktur_bindinger_og_metalstruktur.pdf
```
→ Udled nummer fra `Lektion_NN_`, udled titel fra resten af filnavn (replace `_` med space)

### Quiz-detection
Søg efter `Laering_*_Quiz/` eller `Laering_*_Gennemgang/` mapper i fagmapper eller undersektioner. Link til relative sti `quiz/[fag]/index.html` (kopieres under Underplan C).

### API-hints (hvis noteret)
Hvis fag-README/metadata har struktur som:
```yaml
# Lektion 1 — Introduktion
pensum: "Callister kap. 1-2"
youtube: https://youtube.com/watch?v=...
```
Parse og indsæt direkte. Ellers prompt bruger.

## Verifikation
- Output `content.json` skal være gyldig JSON (valider i browser DevTools)
- Alle `url`-felter skal være absolute eller relative (quiz/ stier skal matche faktisk filstruktur fra Underplan C)
- Alle `ref`-felter skal være læsbare tekst, ikke dårlige file-paths

## Åbent
- Hvordan håndteres fag uden lektions-inddeling (bare løse PDF'er)? → Defaulter til "Materialer" uden lektion-nummer
- Skal vi også detektere eksamens-sæt og fremhæve dem særskilt? → v1: nej (bare add som materiale med type `exercise`)
