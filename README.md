# Studiehub — Delbart katalog over undervisningsmateriale

En offline-first PWA (Progressive Web App) for at organisere, dele og få adgang til undervisningsmaterialer på tværs af uddannelser, semestre og fag.

🎓 **Uddannelse** → **Semester** → **Fag** → **Lektion** → **Materialer**

## Features

✨ **Offline-first:** Indlæs en gang, arbejd hele året uden internet.
📱 **Installérbar:** "Tilføj til hjemmeskærm" på alle enheder.
🔍 **Søgbar:** Find lektioner + materialer hurtigt.
📝 **Quizzer:** Inline-test til hver lektion.
🎥 **Materiale-typer:** Video, podcast, læsning, slides, opgaver, noter, links.
🤝 **Bidrag-system:** Medstuderende indsender materiale → du godkender.
🌐 **Generalisérbar:** Tilføj nye uddannelser uden kode-ændringer.

## Quick Start

### For brugere

1. Åbn [Studiehub link her](https://studiehub.pages.dev).
2. Vælg uddannelse → semester → fag → lektion.
3. Klik "Tilføj til hjemmeskærm" (eller "Installér app").
4. Åbn appen offline når som helst.

### For administratorer (dig)

Se [DEVELOPMENT.md](DEVELOPMENT.md) for lokal setup.

## Struktur

```
Studiehub/
├── index.html              # HTML-skal
├── manifest.webmanifest    # PWA-metadata
├── sw.js                   # Service Worker (offline)
├── content.json            # Materialekataloget (DATA)
├── assets/
│   ├── app.js             # Routing + rendering
│   ├── app.css            # Styling
│   ├── contrib-form.js    # Bidrag-modal
│   ├── contrib-loader.js  # Hent godkendte bidrag
│   ├── admin.js           # Moderation-panel
│   └── contrib.css        # Bidrag-styling
├── functions/             # Cloudflare Pages Functions
│   └── api/
│       ├── submit.js      # POST indsendt bidrag
│       ├── contributions.js   # GET godkendte bidrag
│       ├── admin/
│       │   └── pending.js # GET pending bidrag (admin)
│       └── moderate.js    # POST godkend/afvis
├── migrations/
│   └── 0001_create_contributions.sql  # D1-skema
├── quiz/                  # Quiz-mapper (kopiert fra Kurser/)
│   ├── mmt2/
│   └── mek2/
└── plans/                 # Underplaner (A-E)
```

## Filer

- **`content.json`** — hele kataloget. Data-drevet, ingen kode-ændringer.
- **`assets/app.js`** — single-page app med hash-routing.
- **`sw.js`** — service worker for offline + caching.
- **`wrangler.toml`** — Cloudflare Pages + D1 config.

## Sådan lægger du nyt materiale til

### Metode 1: Rediger `content.json` direkte

```json
{
  "id": "mmt2",
  "code": "MMT2",
  "name": "Materialevidenskab 2",
  "lessons": [
    {
      "id": "l05",
      "number": 5,
      "title": "Slid og mekanisk slidmodstand",
      "materials": [
        { "type": "video", "title": "Slid-mekanik", "url": "https://youtube.com/..." },
        { "type": "reading", "title": "Callister", "ref": "Kap. 20" }
      ]
    }
  ]
}
```

Se [GENERALIZE.md](GENERALIZE.md) for regler og eksempler.

### Metode 2: Brug `/katalog`-skillen (auto-generering)

Hvis du har en struktureret `Kurser/`-mappe, kør:
```
/katalog --education "Maskiningeniør" --institution "VIA Horsens"
```

Skill scanner mapper → genererer `content.json`-udkast.

## Bidrag-system

1. **Bruger indsendt:** Fylder lektion-formular → "Bidrag materiale".
2. **Du modererer:** Besøg `#admin` → login → godkend/afvis.
3. **Vises offentligt:** Godkendte bidrag dukker op under "Fra studiet"-sektion.

## Deployment

```bash
# Lokalt test
npm install -g wrangler
wrangler pages dev

# Deploy til Cloudflare Pages (auto på git push)
git push origin main
```

## Offline-oplevelse

✓ **Virker offline:**
- Navigation + læsning af lektioner/materialer.
- Service Worker cacher alt (app + `content.json`).
- Quizzer kan arbejdes offline.

⚠️ **Kræver netværk:**
- Indsendt bidrag (sendes når du er online igen).
- Admin-panel.
- Externa links (YouTube osv.).

## PWA Installation

**iPhone/iPad (Safari):**
1. Åbn Studiehub.
2. Klik dele-knap → "Tilføj til hjemmeskærm".

**Android (Chrome):**
1. Åbn Studiehub.
2. Menu (⋮) → "Installér app" eller "Tilføj til hjemmeskærm".

## Lighthouse Score

PWA Audit: **≥ 90** (Manifest, Service Worker, HTTPS, Installable).

## Dokumentation

- [DEVELOPMENT.md](DEVELOPMENT.md) — lokal setup + deployment.
- [GENERALIZE.md](GENERALIZE.md) — sådan tilføjer du uddannelser.
- [CONTRIBUTING.md](CONTRIBUTING.md) — vejledning for slutbrugere (bidrag).
- [plans/UNDERPLAN_*.md](plans/) — tekniske specifikationer.

## Tech Stack

- **Frontend:** Vanilla JavaScript (ingen build-step, <50KB gzipped).
- **Backend:** Cloudflare Pages Functions (serverless).
- **Database:** Cloudflare D1 (SQLite).
- **Hosting:** Cloudflare Pages (gratis, global, HTTPS).
- **PWA:** Service Worker, manifest, offline.

## Support

For fejl eller spørgsmål:
1. Check [DEVELOPMENT.md](DEVELOPMENT.md).
2. Se git-historik (`git log`) for tidligere ændringer.
3. Åbn issue i repo.

---

**Version:** 1.0 (Underplan A-E complete)  
**Last updated:** 2026-06-06  
**Made with ❤️ by Claude**
