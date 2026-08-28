# studybot-web

Frontend for [Study Buddy](https://github.com/Naveen-Data/flashcard-telegram-bot) — talks to the Oracle-hosted backend over CORS. Deployed on Vercel; the backend and its data stay on the VM.

## Local dev

```bash
npm install
npm run dev
```

Talks to the production backend by default. To point at a local backend instead:

```js
localStorage.setItem('api', 'http://127.0.0.1:8811')
```

## Deploy setup (one-time)

GitHub Actions (`.github/workflows/deploy.yml`) deploys on every push to `main`. It needs three repo secrets:

1. `vercel login`, then `vercel link` in this directory — creates `.vercel/project.json`
2. Copy `orgId` → **`VERCEL_ORG_ID`**, `projectId` → **`VERCEL_PROJECT_ID`**
3. Generate a token at [vercel.com/account/tokens](https://vercel.com/account/tokens) → **`VERCEL_TOKEN`**
4. Add all three under repo → Settings → Secrets and variables → Actions

## Backend CORS

The backend allows this app's origin via `WEB_ALLOWED_ORIGINS` (comma-separated) in its `.env`. After the first Vercel deploy, add the assigned `*.vercel.app` URL there and restart `studybot-mcp`.
