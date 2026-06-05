# Underplan D Setup — Contribution System

## Overview

Underplan D adds a user-submitted contribution system backed by Cloudflare D1 (SQLite) and Pages Functions. Users can submit materials (videos, links, readings, etc.) for lessons; you approve/reject them in an admin panel before they appear.

## Files Created

### Backend (Functions)
- `functions/api/submit.js` — POST /api/submit (user submission)
- `functions/api/contributions.js` — GET /api/contributions?lesson=X (fetch approved)
- `functions/api/admin/pending.js` — GET /api/admin/pending (fetch pending, admin-only)
- `functions/api/moderate.js` — POST /api/moderate (approve/reject, admin-only)

### Database
- `migrations/0001_create_contributions.sql` — D1 schema (contributions table + indexes)

### Frontend
- `assets/contrib-form.js` — Modal form component (submit new material)
- `assets/contrib-loader.js` — Helper to fetch + render approved contributions
- `assets/admin.js` — Admin panel (/admin) for moderation
- `assets/contrib.css` — Styling for form + admin + contributions display

### Config
- `wrangler.toml` — Cloudflare Pages + D1 binding
- `plans/UNDERPLAN_D.md` — Full technical specification

## Local Development (Before Deploy)

### 1. Install Wrangler
```bash
npm install -g @cloudflare/wrangler
# or: npm install -D wrangler
```

### 2. Create Local D1 Database
```bash
wrangler d1 create studiehub --local
```
This creates `.wrangler/state/d1/studiehub.sqlite`.

### 3. Run Migration Locally
```bash
wrangler d1 execute studiehub --local --file=migrations/0001_create_contributions.sql
```

### 4. Set Local ADMIN_SECRET
```bash
wrangler secret put ADMIN_SECRET --local
# Enter: (any dev secret, e.g. "dev-secret-123")
```

### 5. Test Functions Locally
```bash
wrangler pages dev
```
This starts a local dev server (usually http://localhost:3000). Functions are available at `/api/*`.

### Test Endpoints

**Submit a contribution:**
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "education_id": "maskiningenioer",
    "semester_id": "sem2",
    "course_id": "mmt2",
    "lesson_id": "l01",
    "type": "video",
    "title": "Test Video",
    "url": "https://youtube.com/watch?v=...",
    "author": "Test User"
  }'
```

**Fetch approved contributions:**
```bash
curl http://localhost:3000/api/contributions?lesson=l01
```

**Fetch pending (as admin):**
```bash
curl http://localhost:3000/api/admin/pending \
  -H "X-Admin-Secret: dev-secret-123"
```

**Approve a contribution:**
```bash
curl -X POST http://localhost:3000/api/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "admin_secret": "dev-secret-123",
    "contribution_id": "abc123def456",
    "action": "approve"
  }'
```

## Integration with Main App

### In `assets/app.js` (from Underplan A)

1. **Import contrib modules:**
```javascript
import { createContribForm } from './contrib-form.js';
import { appendContributionsToLesson } from './contrib-loader.js';
```

2. **Add "Submit material" button in lesson-detail view:**
```javascript
const submitBtn = document.createElement('button');
submitBtn.textContent = '➕ Bidrag materiale';
submitBtn.addEventListener('click', () => {
  const lessonContext = {
    education_id: currentEducation.id,
    semester_id: currentSemester.id,
    course_id: currentCourse.id,
    lesson_id: currentLesson.id,
  };
  const form = createContribForm(lessonContext);
  document.body.appendChild(form);
});
lessonHeader.appendChild(submitBtn);
```

3. **Append approved contributions after materials:**
```javascript
const lessonEl = document.querySelector('.lesson-detail');
appendContributionsToLesson(lessonEl, currentLesson.id);
```

### In `index.html`

1. **Link contrib CSS:**
```html
<link rel="stylesheet" href="assets/contrib.css">
```

2. **Create admin page:**
```html
<!-- route: /#admin -->
<div id="admin-app"></div>
<script type="module" src="assets/admin.js"></script>
```

## Deployment to Cloudflare

### 1. Create Cloudflare Project
```bash
wrangler pages publish --project-name studiehub .
```

### 2. Create D1 Database on Cloudflare
```bash
wrangler d1 create studiehub
```
Note the database ID (output: `database_id = "..."`)

### 3. Update `wrangler.toml`
Replace `YOUR_DB_ID_HERE` with actual ID from step 2.

### 4. Apply Migration to Production
```bash
wrangler d1 execute studiehub --remote --file=migrations/0001_create_contributions.sql
```

### 5. Set ADMIN_SECRET on Cloudflare
```bash
wrangler secret put ADMIN_SECRET
# Enter: (use secure password)
```

### 6. Deploy
```bash
wrangler pages deploy
```

## Admin Panel Access

Once deployed, visit: `https://your-studiehub.pages.dev/#admin`

1. Enter ADMIN_SECRET.
2. See pending submissions.
3. Approve/reject with optional reason.

## Moderation Flow

1. **User submits** via lesson form → POST /api/submit → DB status = `pending`
2. **You review** at /admin → fetches pending via GET /api/admin/pending
3. **You approve/reject** → POST /api/moderate → DB status = `approved` | `rejected`
4. **User's friends see** approved materials via GET /api/contributions (auto-fetched in lesson)

## Notes

- **Offline handling:** Submission form queues offline (if supported by PWA); requires network to submit. Admin panel requires network.
- **CORS:** Functions run on same domain, no CORS issues.
- **Rate limiting:** Consider adding per-IP rate limit to /api/submit if spam becomes issue.
- **Search:** Future enhancement: index contributions in main search.

---

**Next:** Once deployed, test via lesson form + admin panel. Then proceed to Underplan E (polish).
