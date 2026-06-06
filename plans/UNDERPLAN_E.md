# Underplan E — Polish, branding, PWA-finish, generalisering

**Mål:** Færdig følelse + klar til at kopiere til andre uddannelser.

**Afhænger af:** A, B, C, D (alle færdige).

## Arbejdsliste

### 1. Tema + Branding
- [ ] **Farvepalette:** Genbruge blueprint/forge-tema fra quizzerne (primær: `#0066cc` eller `#1f51b6`).
- [ ] **Typografi:** Konsistent med quiz-styling (Nunito + Anton for headers).
- [ ] **App ikoner:** Generér `icons/` folder med:
  - [ ] `icon-192.png` (PWA installeret på hjemmeskærm)
  - [ ] `icon-512.png` (splash screen + store ikoner)
  - Kan være simpel badge med uddannelsesnavn eller ikonisk symbol.
- [ ] **Manifest theme:** Sæt `theme_color` + `background_color` i `manifest.webmanifest`.

### 2. Offline + Fejlhåndtering
- [ ] **Service Worker polish:**
  - [ ] Cache-versioning (evt. bygge script: `cache v1.0.1`).
  - [ ] Stale-while-revalidate for `content.json` (viser gammel, fetcher ny).
  - [ ] Graceful offline fallback for API-fejl (formularer, bidrag-hentning).
  
- [ ] **Frontend feedback:**
  - [ ] "Du er offline" banner (hvis netværk går ned).
  - [ ] Toast-notifikationer for submit-status (success/error).
  - [ ] Spinners under loading af lektions-detaljer.
  - [ ] Tom-tilstande: "Ingen materialer endnu" i en lektion.

### 3. Søge-finpudsning
- [ ] **Fuzzy search:** Sørg for at søgning på tværs (uddannelse→semester→fag→lektion) er responsiv.
- [ ] **Highlight matches:** Vis hvor søgeord matche (navn/beskrivelse).
- [ ] **No results:** Smuk tom-tilstand hvis ingen match.

### 4. Admin-dashboard polish
- [ ] **Responsive tabel:** Bedre mobile-view for `/admin` (stakkede kort i stedet for tabel på små skærme).
- [ ] **Bulk actions:** Optionelt: select-alle pending → godkend multiple på én gang.
- [ ] **Historik:** Vis godkendte/afviste (ikke bare pending) med timestamps.
- [ ] **Search/filter:** Find contribution by title/author quickly.

### 5. PWA-finish
- [ ] **Lighthouse PWA audit:**
  - [ ] Service Worker registeret og aktiv.
  - [ ] Manifest fuldstændig (name, icons, start_url, display: standalone).
  - [ ] HTTPS (Cloudflare Pages = automatisk).
  - [ ] Installable: "Add to Home Screen" prompt/banner.
  
- [ ] **Offline page:** Hvis `/` ikke kan loades offline, viser fallback.

- [ ] **Meta tags:**
  - [ ] `viewport` for mobile.
  - [ ] `apple-mobile-web-app-capable` (iOS add-to-home).
  - [ ] `apple-mobile-web-app-status-bar-style`.

### 6. Generalisering — "Sådan tilføjer du en ny uddannelse"-guide

Skrive `GENERALIZE.md` som forklarer:

```markdown
# Sådan tilføjer du en ny uddannelse til Studiehub

## Krav
- Uddannelse navn (fx "Datamatiker", "Elektroteknik").
- Institution (fx "VIA Horsens", "KEA Copenhagen").
- Fag struktur (semester → fag → lektioner).

## Steps

### 1. Kør `/katalog` skill
Hvis du har fag-mapper under `Kurser/NyUddannelse/`, kør:
\`\`\`bash
/katalog --education "Datamatiker" --institution "VIA Horsens"
\`\`\`
Dette scanner mapper og genererer `content.json`-udkast.

### 2. Rediger `content.json`
Finpudser lektions-titler, beskrivelser, link til quiz/YouTube/podcasts.
**Ingen kode-ændringer nødvendige** — rent data-update.

### 3. Kopier quiz-mapper
Hvis uddannelsen har quiz, kopier `Laering_*_Quiz/` under `Studiehub/quiz/<uddannelse>/`.

### 4. Deployer
\`\`\`bash
git add content.json
git commit -m "Add Datamatiker uddannelse"
wrangler pages deploy
\`\`\`

## Format-regler
- Education ID: snake_case (fx `datamatiker`, `elektroteknik`).
- Course ID: uppercase + number (fx `PROG1`, `EL2`).
- Lesson ID: `l01`, `l02`, ... (numerisk).
- Material types: enum = `quiz | video | podcast | reading | slides | exercise | link | note`.

Intet kode-ændring — alt drevet af `content.json`.
```

### 7. QA-checklist (Real Phone Testing)

- [ ] **iOS Safari (iPhone/iPad):**
  - [ ] Navigation virker (swipe back).
  - [ ] Quiz + materiale-links åbner.
  - [ ] "Add to Home Screen" → app åbner offline.
  - [ ] Service Worker aktivt (DevTools → App tab).
  
- [ ] **Android Chrome:**
  - [ ] Same som iOS.
  - [ ] "Install app" prompt dukker op.
  - [ ] Push-notifikationer (valgfrit v1).

- [ ] **Desktop (Chrome/Firefox):**
  - [ ] Responsive på 768px breakpoint.
  - [ ] Lighthouse score: ≥ 90 PWA.

- [ ] **Bidrag-flow:**
  - [ ] Submit form åbner uden fejl.
  - [ ] Admin-panel login/logout virker.
  - [ ] Godkendt bidrag vises 5 min efter (cache expiry).

### 8. Documentation
- [ ] **README.md:** kort intro + "hvor starter jeg?".
- [ ] **DEVELOPMENT.md:** Local setup med Wrangler, D1, miljøvariable.
- [ ] **GENERALIZE.md:** "hvordan tilføjer jeg uddannelse".
- [ ] **CONTRIBUTING.md:** vejledning til bidrag-flow for slutbrugere.

---

## Implementation Order

1. **Tema + ikoner** (visuelt færdigt).
2. **Offline + fejlhåndtering** (stable førlelse).
3. **PWA + Lighthouse audit** (teknisk færdigt).
4. **Søge-polish** (UX refinement).
5. **Admin-polish** (dit workflow).
6. **Dokumentation + generalisering** (delt viden).
7. **Real phone QA** (godkendelse).

---

## Verifikation (end-to-end)

1. **Installér på iPhone:** "Add to Home Screen" → app starter offline med alle materialer synlige.
2. **Søg:** "DYN1" → alle DYN1-lektioner dukker op.
3. **Bidrag:** Indsend video → admin godkender → vises i lektion.
4. **Lighthouse:** PWA score ≥ 90.
5. **Generalisering:** Tørkør guide til at tilføje Datamatiker-uddannelse til `content.json`.

---

**Næste efter E:** Deployment til Cloudflare Pages + live link til medstuderende.
