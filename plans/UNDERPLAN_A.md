# Underplan A — Statisk PWA-skelet + datamodel + Cloudflare-deploy

## Mål
Et live link på Cloudflare Pages der viser PWA-navigation: Uddannelse → Semester → Fag → Lektion → Lektion-detalje. Seed-data med MMT2 + MEK2, offline-capable.

## Hvad der er gjort (komplet)

### Repo-struktur scaffoldet
```
Studiehub/
├── index.html                  (app-skal, PWA-setup)
├── assets/
│   ├── app.css                (mobil-først dark theme)
│   └── app.js                 (hash-routing, vanilla)
├── content.json               (seed: MMT2 + MEK2 l.1)
├── manifest.webmanifest       (PWA metadata + emoji-ikoner)
├── sw.js                      (offline caching, cache-first)
├── .gitignore
└── plans/                     (denne mappe)
```

### Datamodel (`content.json`) låst
```jsonc
educations[
  {
    id, name, institution,
    semesters[ { number, courses[ { id, code, name, description, lessons[] } ] } ]
  }
]
```
Hver `lesson` indeholder `materials[]` med type (`quiz`, `video`, `podcast`, `reading`, `slides`, `exercise`) og enten `url` eller `ref`.

**Generalitet:** ny uddannelse = nyt element i `educations[]`.

### Frontend (`app.js`)
- **Hash-routing:** `#home`, `#edu/:id/sem:n`, `#edu/:id/sem:n/:courseId`, `#edu/:id/sem:n/:courseId/:lessonId`
- **Views:** uddannelse-liste → semester-liste → fag-liste → lektions-liste → lektion-detalje
- **Materiale-rendering:** 
  - `url` → clickable link (quizzer, YouTube osv.)
  - `ref` → reference-tekst (bog-kapitler, itslearning-links osv.)
- **Telefon-først:** mobil nav og touch-friendly buttons

### PWA-setup
- `manifest.webmanifest`: app-navn, icon (emoji SVG), standalone display
- `sw.js`: cache-first for app-skal, network-first for eksterne links
- Service worker registration i `index.html`

### Git-repo initialiseret
```
git config user.email/name
git add .
git commit (36f45bd) — "Initial commit: PWA skeleton with seed data and offline support"
```

## Næste step: Cloudflare Pages deploy

1. **Opret Cloudflare Pages-projekt:**
   - Log ind på https://dash.cloudflare.com
   - Pages → "Create a project" → "Connect to Git"
   - Connect dit GitHub-account (opret GitHub-repo fra denne Studiehub-folder, eller push den første gang her)
   - Vælg `Studiehub` repo
   - Build setting: **Build command:** (blank), **Build output:** (blank), **Root directory:** (blank)
   - Deploy

2. **Test på telefon:**
   - Åbn Cloudflare-linket (fx `studiehub.pages.dev`) på iPhone/Android
   - Naviger: Uddannelse → Semester 2 → MMT2/MEK2 → Lektion → Materialeliste
   - Check at eksterne links (quizzer) kan åbnes
   - Check at "Tilføj til hjemmeskærm" viser app-ikon

3. **Verificer offline:**
   - Åbn app fra hjemmeskærm
   - Sluk wifi
   - App-skal + seed-data skal vises (content.json cachesat af SW)

## Notater
- **Seed-data:** Kun l.1 (Introduktion) + l.3 (Korrosion) for MMT2; l.1 (Kinematik) for MEK2. Underplan C fylder alt
- **Ikonogram:** Bruger emoji direkte i materiale-rendering (📝, ▶, 🎙 osv.)
- **Styling:** Dark theme (`#0f172a`), gradients på buttons, transitions
- **Offline:** SW cacher kun app-skal; bidrag + nye quizzer kræver netværk
- **Åbent:** produktnavn, endeligt domæne (TBD)
