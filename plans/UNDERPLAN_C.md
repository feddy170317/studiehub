# Underplan C — Indholds-population for Maskiningeniør v1

## Mål
Fyld alt rigtig indhold: MMT1/2, MEK2, DYN1, Mat1 osv. med korrekte lektions-titler, pensum, links. Kopier/link eksisterende quizzer.

## Workflow

### Phase 1: Kør `/katalog` skill
```
/katalog scan
→ bruges input fra Underplan B
→ output: `content.json` udkast med alle fag/lektioner
```

### Phase 2: Kuratér lektions-metadata
For hver lektion i output-JSON:
1. **Lektions-titel:** Skal være deskriptiv (ikke bare "Lektion 1")
   - Eksempel: "Introduktion til Materialevidenskab"
   - Fund i: mappenavn, PDF-titler, README fra fag-folder
2. **Summary:** 1-2 sætninger om hvad lektionen handler
   - Hent fra lærebog-indholdsfortegnelse, vejleder-noter, eller skriv selv

### Phase 3: Link eksisterende quizzer
**Find quiz-mapper:**
- `Kurser/MMT_Eksamen_Svar/Laering_MMT_Quiz/` → link til `quiz/mmt2/index.html`
- `Kurser/Mek/MEK 2 opagver/Eksamens sæt/Laering_MEK2_Quiz/` → `quiz/mek2/index.html`
- `Kurser/Mek/MEK 2 opagver/Eksamens sæt/Laering_MEK2_Opg7/` → `quiz/mek2/opg7.html`

**Kopier quiz-struktur til Studiehub:**
```
Studiehub/
└── quiz/
    ├── mmt2/
    │   ├── index.html
    │   └── assets/...
    └── mek2/
        ├── index.html
        ├── opg7.html
        └── assets/...
```

(Brug `cp -r` eller Windows Explorer til at kopiere originalerne fra `Kurser/`.)

### Phase 4: Tilføj YouTube/podcast-links
For hver lektion, find/opret:
- **YouTube:** søg efter "MMT2 lektion 3 korrosion" eller lign., find relevante videos
- **NotebookLM-podcasts:** hvis vedledere har dikteret eller skabt (hvis ja, indsæt link)
- **Links:** samling af relevante ressourcer fra Terma-projekt, andre kilder

Opdatér `content.json` med `materials[]` af type `video` og `podcast`.

### Phase 5: Bog- og slide-referencer
For hver lektion, indsæt `ref`-materiale:
```json
{
  "type": "reading",
  "title": "Bog: Korrosion",
  "ref": "Callister, kap. 16-17"
},
{
  "type": "slides",
  "title": "Lektion 3 slides",
  "ref": "itslearning → MMT2 → Lektion 3"
}
```

Kilder:
- Bog-kapitler: Lærebog-PDF struktur i Kurser-mapper
- Slides: Vejledere (spørg eller læs fra itslearning-indhold hvis hostet)

### Phase 6: Øvelser/opgaver
Indsæt øvelses-links eller referencer:
```json
{
  "type": "exercise",
  "title": "Opgaver 3.1-3.5",
  "ref": "Callister opgavebog eller Kurser/MMT2/Opgaver/..."
}
```

## Struktur af færdig content.json
```json
{
  "version": 1,
  "educations": [{
    "id": "maskiningenioer",
    "name": "Maskiningeniør",
    "institution": "VIA Horsens",
    "semesters": [
      {
        "id": "sem1",
        "number": 1,
        "courses": [
          { "id": "mat1", "code": "MAT1", "name": "Matematik 1", ... },
          ...
        ]
      },
      {
        "id": "sem2",
        "number": 2,
        "courses": [
          {
            "id": "mmt2",
            "code": "MMT2",
            "name": "Materialevidenskab 2",
            "description": "Dybdegående studie af materialers egenskaber.",
            "lessons": [
              {
                "id": "l01",
                "number": 1,
                "title": "Introduktion til Materialevidenskab",
                "summary": "Grundlæggende definitioner og materiale-kategorier.",
                "materials": [
                  {
                    "type": "quiz",
                    "title": "MMT2 Smedje-Quiz",
                    "url": "quiz/mmt2/index.html"
                  },
                  {
                    "type": "reading",
                    "title": "Bog: Introduktion",
                    "ref": "Callister, kap. 1-2"
                  },
                  {
                    "type": "slides",
                    "title": "Lektion 1 slides",
                    "ref": "itslearning → MMT2 → Lektion 1"
                  },
                  {
                    "type": "exercise",
                    "title": "Opgaver 1.1-1.5",
                    "ref": "Callister opgavebog"
                  }
                ]
              },
              ...
            ]
          },
          { "id": "mek2", "code": "MEK2", ... },
          { "id": "dyn1", "code": "DYN1", ... }
        ]
      }
    ]
  }]
}
```

## Fag at inkludere (v1 target)
- **Sem 1:** MAT1
- **Sem 2:** MMT2, MEK2
- **Sem 3+:** DYN1, (andre hvis data findes)

## Verifikation
1. Tæl lektioner per fag (matcher README/originalfag-struktur)
2. Åbn hver quiz-link i browser (skal loade uden fejl)
3. Check at alle `ref`-tekster giver mening (læger skal forstå hvor materialerne ligger)
4. Kør `content.json` gennem validator (f.eks. JSONLint)

## Notater
- **Quizzer:** Kun hvis allerede eksisterer i Kurser/. Nye quizzer skabes via Underplan E.
- **YouTube:** Vær kritisk — kun seriøse sources (universiteters kanaler, fagfolks tutorials)
- **Offline:** Seed-data caches af SW; nye quizzer/links kræver netværk
