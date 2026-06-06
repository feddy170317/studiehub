# Sådan tilføjer du en ny uddannelse til Studiehub

Studiehub er designet til at være **data-drevet**, ikke kode-drevet. Du kan tilføje hele uddannelser blot ved at opdatere `content.json` — ingen programmering nødvendig.

## Oversigt

```
Uddannelse
└── Semester
    └── Fag (Kursus)
        └── Lektion
            └── Materialer (quiz, video, læsning, osv.)
```

## Step 1: Forbered `content.json`

Åbn `content.json` og tilføj en ny uddannelse under `educations[]`:

```json
{
  "educations": [
    {
      "id": "datamatiker",
      "name": "Datamatiker",
      "institution": "VIA Horsens",
      "semesters": [
        {
          "id": "sem1",
          "number": 1,
          "courses": [
            {
              "id": "prog1",
              "code": "PROG1",
              "name": "Programmering 1",
              "description": "Introduktion til programmering med Python",
              "lessons": [
                {
                  "id": "l01",
                  "number": 1,
                  "title": "Variabler og datatyper",
                  "summary": "Grundlæggende variable og primitive datatyper i Python",
                  "materials": [
                    {
                      "type": "video",
                      "title": "Introduktion til Python",
                      "url": "https://youtube.com/watch?v=..."
                    },
                    {
                      "type": "reading",
                      "title": "Bog: Python Basics",
                      "ref": "Real Python Handbook, kap. 2-3"
                    },
                    {
                      "type": "quiz",
                      "title": "Python Quiz",
                      "url": "quiz/datamatiker/prog1/index.html"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Step 2: Regler for ID'er

- **Education ID:** snake_case, kort (fx `datamatiker`, `elektroteknik`).
- **Semester ID:** `sem1`, `sem2`, osv. + `number` felt.
- **Course ID:** UPPER + nummer (fx `PROG1`, `DB2`, `WEBDEV1`).
- **Lesson ID:** `l01`, `l02`, osv. (fuld katalog starter fra 1).
- **Material type:** enum = `quiz | video | podcast | reading | slides | exercise | link | note`.

## Step 3: Materiale-felter

Hvert materiale har ét af disse to layouts:

### A. Online (har `url`)
```json
{
  "type": "video",
  "title": "Mit YouTube-klip",
  "url": "https://youtube.com/watch?v=..."
}
```

### B. Reference (har `ref`)
```json
{
  "type": "reading",
  "title": "Læs det fra bogen",
  "ref": "Titel, kap. 5-7"
}
```

`url` og `ref` er mutually exclusive — brug **kun én**.

## Step 4: Quiz-mapper

Hvis du har quiz til faget, placer det under `Studiehub/quiz/<uddannelse>/<fag>/index.html`:

```
Studiehub/
  quiz/
    datamatiker/
      prog1/
        index.html       ← Din quiz
        assets/
```

Derefter link den i `content.json`:

```json
{
  "type": "quiz",
  "title": "PROG1 Quiz",
  "url": "quiz/datamatiker/prog1/index.html"
}
```

## Step 5: Deploy

```bash
cd Studiehub
git add content.json
git commit -m "Add Datamatiker uddannelse med PROG1 + DB2"
git push
```

Cloudflare Pages auto-deployer på commit til `main`.

## Eksempel: Fuld uddannelse

```json
{
  "id": "datalogi",
  "name": "Datalogi",
  "institution": "AU",
  "semesters": [
    {
      "id": "sem1",
      "number": 1,
      "courses": [
        {
          "id": "prog1",
          "code": "PROG1",
          "name": "Programmering",
          "description": "...",
          "lessons": [
            {
              "id": "l01",
              "number": 1,
              "title": "Funktioner",
              "summary": "Hvorfor og hvordan vi skriver funktioner",
              "materials": [
                { "type": "video", "title": "...", "url": "..." },
                { "type": "reading", "title": "...", "ref": "..." }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Validering

Efter opdatering, check:
1. **Syntax:** `content.json` er valid JSON (brug validator online).
2. **Linkene:** Alle quiz-URL'er peger på eksisterende filer.
3. **IDs:** Alle `id` felter er unikke og lowercase.

## FAQ

**Q: Kan jeg lave delvis uddannelse (kun 2 fag)?**
A: Ja! `semesters[]` og `courses[]` kan være så store eller små som nødvendigt.

**Q: Skal jeg ændre kode?**
A: Nej. Alt er data (`content.json`). Hvis det ikke kan gøres i JSON, er det ikke Studiehub-compatible.

**Q: Kan jeg skjule uddannelser?**
A: Ja — sæt et `hidden: true` felt (ikke standard, men appen respekterer det).

**Q: Hvor mange uddannelser kan Studiehub holde?**
A: Ubegrænset. Performance afhænger af cache-strategi (PWA cacher `content.json`).

---

## Scripts (valgfrit)

Hvis du har mange fag/lektioner, kan du auto-generere `content.json`-skeletter fra mappe-struktur med `/katalog`-skillen. Ellers — editer JSON'en manuelt. Ingen build-step, ingen dependencies.

---

**Spørgsmål?** Se `UNDERPLAN_C.md` for hvordan MMT2+MEK2 blev sat op.
