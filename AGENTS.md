# Agent Startup Instructions

<!-- Last documentation audit: June 14, 2026 -->

This file is the first place coding agents should read when entering this workspace.

## Startup Instructions & Project Health

Before editing files, read these documents in order:

1. `docs/SESSION_AUTOMATION_HANDOFF.md`
2. `docs/DEVELOPER_HANDOVER.md`
3. `package.json`

**SECURITY**: Do not print, summarize, or expose secret values from `.env` or any sensitive files.

## Optimization & UI Mandates

- **Instant Language Toggle**: The language switch (EN/VI) re-renders the UI using client-side data (`allVideos`, `allNotifications`, `userProfileCache`, `allManageProjects`). Do NOT introduce network calls during language switching. Use `.lang-en`/`.lang-vi` classes for static content.
- **Dashboard Caching**: Notifications, Profile, and Project Management data are cached client-side. Render logic is separated into `render...()` functions. Data-modifying actions must call `load... (true)` to force refresh the cache.
- **Smart Topic Clustering**: AI automatically groups related projects under shared topics (EN/VI) to prevent topic inflation.
- **Instant Updates Loading**: The Updates feed uses `localStorage` (`gnz_updates_cache`) with stale-while-revalidate (60s TTL). On language toggle, `renderUpdates()` re-renders all items from cache using `titleVi`/`bodyVi` fields for Vietnamese display.
- **API-Based Pagination**: Both the video grid and updates feed use `limit` and `offset`. Always use the `total` count from the API.
- **Edge Caching**: `GET /api/videos` uses Vercel Edge Caching (`s-maxage=3600`). `GET /api/updates` uses a 60-second cache.
- **Network Compression**: Gzip compression is enabled via the `compression` middleware.
- **API Payload Optimization**: List endpoint (`GET /api/videos`) strips `explanationRaw`/`explanationViRaw`. Detail endpoint `GET /api/videos/:id` returns full video.
- **Client-Side Filtering**: `renderVideoGrid()` switches to cache-only mode when `allVideos.length >= totalVideos`.
- **Background Cache Preload**: `init()` fetches all videos (`limit=0`) after first render.
- **Build Pipeline (Minify)**: Run `npm run build` to minify JS/CSS and optimize SVGs. HTML references `.min` variants.
- **Critical CSS**: Essential theme variables and base styles are embedded in `index.html` `<head>`.
- **Resource Hints**: `<head>` includes `preconnect`, `dns-prefetch`, and `preload` for Google Fonts and CDN assets.
- **DB Readiness Cache**: `initDb()` result is cached in `server.js` to reduce latency.
- **Vercel SQLite Path**: On Vercel, DB is stored at `/tmp/data.db` (writable in serverless). Use `process.env.VERCEL` detection in `server/database/db.js`. The `seed()` function runs on every cold start.
- **Proxy Route Order**: `/api/proxy-image` runs BEFORE the DB middleware in `server.js` — logo and favicon work even if DB init fails.
- **Local Logo Assets**: Logo is stored locally at `public/assets/images/ui/gnz-logo.png`. Do NOT use Google Drive proxy URLs for the logo or favicon.

## Automation Rules

- **Git-Based Deployment**: Project is deployed via GitHub → Vercel. Commit & push to trigger auto-deploy.
- **Mandatory Manifest Sync**: Run `npm run sync-manifest` before finishing.
- **JavaScript Integrity**: Run `node --check` on changed JS files.

## Current Known State

- **Rebranded & Renamed**: Site is officially **Green Night Zero (GNZ)**. Project name: `greennightzero`.
- **Production URL**: [https://greennightzero.vercel.app](https://greennightzero.vercel.app)
- **Contact & Donation**: Email: `greennight0@protonmail.com`, Donation: `https://zypage.com/greennight0`.
- **Performance Optimized**: Dashboard caching, Edge caching, Critical CSS, Gzip, API payload optimizations, and Updates stale-while-revalidate are fully implemented.
- **Vercel DB Fix (June 14, 2026)**: `db.js` detects `process.env.VERCEL` and uses `/tmp/data.db`. Proxy route runs before DB middleware so logo/assets load independently.
- **Affiliate Links**: Dynamic row-based UI integrated into Submit/Edit workflows.
- **LaTeX Storage**: Content is in `latex-content.json` and `videos` table.
- **Visual Assets**: URL-based gallery in Edit modal; Google Drive proxy active.
- **Guide Page**: Bilingual instructions for YouTube, Drive, and LaTeX.
- **Database**: 23 columns in `videos` table.
- **Legacy Scripts**: `npm run check-images` and `npm run check-style` are deprecated and should not be used. Use the Edit modal gallery for visual verification.
