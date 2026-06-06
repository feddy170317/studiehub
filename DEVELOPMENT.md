# Development Guide — Studiehub

Local setup, testing, and deployment instructions.

## Prerequisites

- Node.js ≥ 18
- Git
- Wrangler CLI (`npm install -g @cloudflare/wrangler`)
- Cloudflare account (free Pages + D1)

## Local Development

### 1. Clone & Install

```bash
cd Studiehub
npm install  # if package.json exists
# or skip if using vanilla JS (no dependencies)
```

### 2. Run Dev Server

```bash
wrangler pages dev
```

Opens http://localhost:3000. Service Worker works locally.

### 3. Edit Files

- **Content:** Edit `content.json` directly. Changes reload on F5.
- **Frontend:** Edit `assets/app.js`, `assets/app.css`. Changes reload instantly.
- **Functions:** Edit `functions/api/*.js`. Restart Wrangler for changes to take effect.

### 4. Test Offline

1. Open DevTools (F12) → Application tab.
2. Check "Offline" checkbox.
3. Navigate app — should work without network.
4. Uncheck "Offline" — should sync.

### 5. Test Bidrag-system (Locally)

To test contributions locally, you need to:

#### Set up local D1 database:

```bash
wrangler d1 create studiehub --local
# Creates .wrangler/state/d1/studiehub.sqlite
```

#### Apply migration:

```bash
wrangler d1 execute studiehub --local --file=migrations/0001_create_contributions.sql
```

#### Set ADMIN_SECRET for local dev:

```bash
wrangler secret put ADMIN_SECRET --local
# Enter: dev-secret-123
```

#### Start dev server with D1:

```bash
wrangler pages dev --env development
```

Now `/api/submit` and `/api/admin` endpoints work locally.

#### Test endpoints:

```bash
# Submit contribution
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

# Fetch pending (as admin)
curl http://localhost:3000/api/admin/pending \
  -H "X-Admin-Secret: dev-secret-123"

# Approve
curl -X POST http://localhost:3000/api/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "admin_secret": "dev-secret-123",
    "contribution_id": "abc123",
    "action": "approve"
  }'
```

## Testing Checklist

- [ ] **Navigation:** Uddannelse → semester → fag → lektion → materiale.
- [ ] **Quizzer:** Søg + åbn quiz fra lektion, test offline.
- [ ] **Søgning:** Søg på fag-navn, skal finde korrekt lektion.
- [ ] **Offline:** Slå netværk fra → app stadig virker.
- [ ] **Installer:** "Tilføj til hjemmeskærm" → app starter fra ikonet.
- [ ] **Bidrag:** Indsend via formular → admin godkender → vises i lektion.

## Deployment to Cloudflare Pages

### 1. Create Cloudflare Project

If not already done:

```bash
wrangler pages publish --project-name studiehub .
```

This creates a git integration.

### 2. Create D1 Database

```bash
wrangler d1 create studiehub
```

Note the database ID from output.

### 3. Update `wrangler.toml`

Replace placeholders with your actual database IDs:

```toml
[[d1_databases]]
binding = "DB"
database_name = "studiehub"
database_id = "YOUR_ACTUAL_ID"
```

### 4. Apply Migration to Production

```bash
wrangler d1 execute studiehub --remote --file=migrations/0001_create_contributions.sql
```

### 5. Set Production Secret

```bash
wrangler secret put ADMIN_SECRET
# Enter a secure password for production
```

### 6. Deploy

```bash
git add -A
git commit -m "Deploy Studiehub v1.0"
git push origin main
```

Cloudflare Pages auto-deploys on git push.

### 7. Verify Deployment

Visit `https://your-project.pages.dev` and test:
- Navigation + offline mode.
- Contribution form (POST /api/submit).
- Admin panel (/#admin, login + moderation).

## Environment Variables

### Local (`.env.local` or `wrangler.toml`)

```
ADMIN_SECRET=dev-secret-123
```

### Production (via `wrangler secret`)

```bash
wrangler secret put ADMIN_SECRET
```

## Troubleshooting

### Service Worker not working

1. Check DevTools → Application → Service Workers.
2. Verify `sw.js` is cached.
3. Try: DevTools → Network → disable cache → reload.
4. If stuck: Clear cache → Application → Storage → Clear site data.

### D1 database errors

1. Check migration ran: `wrangler d1 execute studiehub --local --query "SELECT * FROM contributions"`
2. Verify `ADMIN_SECRET` is set: `wrangler secret list`
3. Check Functions logs: `wrangler tail`

### Content.json not loading offline

1. Check manifest `start_url` matches your deploy URL.
2. Verify `sw.js` is caching (`/content.json`).
3. Clear service worker cache + reload.

### Quizzes not found

1. Ensure quiz folders are under `quiz/<education>/<course>/`.
2. Verify `content.json` references correct URLs (e.g., `quiz/mmt2/index.html`).
3. Check file paths in repo (case-sensitive on Cloudflare).

## Performance Tips

- **Keep `content.json` < 500KB** — if larger, split by education.
- **Compress images** — use format for quiz/icons.
- **Lazy-load quizzes** — don't load all at once.
- **Cache aggressively** — SW caches all static assets.

## File Size Targets

- `app.js` + `app.css`: < 30KB gzipped.
- `content.json`: < 200KB.
- Service Worker bundle: < 10KB.
- Total app shell: < 50KB.

## Git Workflow

```bash
# Feature branch
git checkout -b feature/add-new-education
# ... edit content.json
git add content.json
git commit -m "Add Datamatiker uddannelse"
git push origin feature/add-new-education
# Create PR, merge when ready
# Auto-deploy on merge to main
```

## Monitoring

Check deployment status:

```bash
wrangler pages deployment list
```

View live logs:

```bash
wrangler tail
```

## Further Reading

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [PWA Checklist](https://web.dev/pwa-checklist)
- [Service Worker Guide](https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps)

---

**Questions?** Check [README.md](README.md) or [GENERALIZE.md](GENERALIZE.md).
