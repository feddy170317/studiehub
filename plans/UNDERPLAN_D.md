# Underplan D — Bidrag-system (Cloudflare Functions + D1 + moderation)

## Mål
Medstuderende kan indsende materiale (YouTube-link, note, opgave osv.); du godkender før det vises offentligt (moderation). Dynamisk lag på top af statisk content.json.

## Arkitektur

### Backend (Cloudflare Pages Functions)
Placering: Studiehub/functions/

**Endpoints:**

1. **POST /api/submit** — Indsend materiale
   `
   Body:
   {
     "education_id": "maskiningenioer",
     "semester_id": "sem2",
     "course_id": "mmt2",
     "lesson_id": "l03",
     "type": "video|reading|link|note",
     "title": "...",
     "url": "https://...",
     "author": "Dit navn",
     "note": "Kort beskrivelse (valgfrit)"
   }
   
   Respons:
   { "status": "pending", "id": "contrib_xyz" }
   `
   - Indsætter i D1 med status = 'pending'

2. **GET /api/contributions?lesson=l03** — Hent godkendt materiale
   `
   Respons:
   {
     "approved": [
       {
         "id": "contrib_abc",
         "type": "video",
         "title": "...",
         "url": "...",
         "author": "...",
         "approved_at": "2026-06-10T12:00:00Z"
       }
     ]
   }
   `
   - Filtrerer kun status = 'approved'

3. **POST /api/moderate** — Godkend/afvis (password-beskyttet)
   `
   Body:
   {
     "id": "contrib_xyz",
     "action": "approve|reject"
   }
   
   Header:
   Authorization: "Bearer $ADMIN_SECRET"
   `

### Database (Cloudflare D1 — SQLite)
**Tabel: contributions**
`sql
CREATE TABLE contributions (
  id TEXT PRIMARY KEY,
  education_id TEXT,
  semester_id TEXT,
  course_id TEXT,
  lesson_id TEXT,
  type TEXT,
  title TEXT,
  url TEXT,
  author TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT
);
`

### Frontend

**A. Bidrag-formular (lektion-detalje)**
- Formular med type, titel, URL, navn
- POST til /api/submit
- Feedback: "Tak! Moderatoren gennemgår det snart."

**B. Admin-side (#admin, password-beskyttet)**
- Login-prompt
- List pending bidrag
- Godkend/afvis-knapper
- Arkiv af godkendte

**C. Lektion-detalje (bruger-side)**
- Ny "Fra studiet" sektion med godkendte bidrag

## Implementation
- Step 1: D1 database
- Step 2: Backend Functions
- Step 3: Frontend UI
- Step 4: Environment-vars

## Verifikation
1. Indsend bidrag
2. Godkend på /admin
3. Bidrag vises for andre brugere
4. Offline-test af caching

## v1 scope
- Kun navn-felt (ingen bruger-login)
- Admin-password
- Moderation påkrævet
