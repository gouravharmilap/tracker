# InstaTrack — Instagram Account Rate & Growth Tracker

An Instagram-themed web app: enter any public Instagram username and get an AI-rated audit with meaningful, actionable growth suggestions.

## Run

```bash
cd account-tracker
npm install
cp .env.example .env
# (optional) add a free AI API key to .env (Groq recommended)
npm start
```

Open http://localhost:3000

## Features
- Instagram-themed UI (gradient, story rings, stats).
- Username-only input for end users — no API key needed.
- Scrapes public profile (followers, following, posts, bio, link, avatar, category) via multiple strategies.
- Falls back to manual metric entry if Instagram blocks scraping.
- AI audit (score 0-100, 5-dimension breakdown, strengths, red flags, suggestions, bio rewrite, hashtags, best post time, content ideas) using owner-configured free AI key (Groq/Gemini/OpenAI/OpenRouter).
- Works offline/heuristic mode if no AI key is configured.
- Local history tracking per username (lowdb JSON).

## Notes
Scraping public Instagram data is best-effort and may be blocked by Meta; the manual-entry fallback keeps the app useful.

## Make auto-fetch work (optional)

Instagram blocks anonymous scraping. To fetch accounts automatically, give the server your own
Instagram session cookie:

1. Log in to instagram.com in your browser.
2. DevTools → Application/Storage → Cookies → `https://www.instagram.com` → copy the value of `sessionid`.
3. Add to `.env`:
   ```env
   IG_COOKIE=sessionid=YOUR_VALUE;
   ```
4. Restart `npm start`.

The cookie stays server-side. Use a throwaway/secondary account if you prefer.

## Deploy

The app is a single Node/Express service. It needs only environment variables (no build step).

### Render / Railway / Heroku (recommended)
1. Push the repo (exclude `.env`; keep `.env.example`).
2. Set these env vars in the host dashboard:
   - `GEMINI_API_KEY` or `GROQ_API_KEY` (optional but recommended for AI)
   - `PORT` (host usually injects this)
   - `IG_COOKIE` (optional, for auto-fetch)
3. Start command: `node server.js` (Procfile already included).
4. Health check path: `/api/health`.

### Docker
```bash
docker build -t insta-tracker .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key insta-tracker
```

### Notes
- `data/history.json` is runtime state; persist the `data/` directory (volume) if you want history to survive restarts on ephemeral platforms.
` server holds API keys; they are never shipped to the browser.
