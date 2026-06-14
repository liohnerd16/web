# Project Memory: Green Night Zero (GNZ)

## Status of Features & Optimizations

- **Rebranded & Renamed**: Site officially **Green Night Zero (GNZ)**. Project renamed to `greennightzero` with production URL: [https://greennightzero.vercel.app](https://greennightzero.vercel.app).
- **Contact Info & Donation**:
  - Email: `greennight0@protonmail.com`
  - Donation: `https://zypage.com/greennight0`
  - Social: Bluesky, Reddit, StackExchange, Quora.
- **Affiliate Links**: Dynamic row-based UI integrated into Submit/Edit workflows.
- **LaTeX Storage**: Content is in `latex-content.json` and `videos` table.
- **Visual Assets**: URL-based gallery in Edit modal; Google Drive proxy active.
- **Guide Page**: Bilingual instructions for YouTube, Drive, and LaTeX.
- **Database**: 23 columns in `videos` table.
- **Documentation Audit (COMPLETED June 10, 2026)**:
  - `GEMINI.md`, `AGENTS.md`, `docs/DEVELOPER_HANDOVER.md`, `docs/AUTOMATION_RULES.md`, and `SKILL.md` updated to reflect the latest project state.
  - Added explicit mandates for Google Drive proxying, Smart Topic Clustering, and client-side caching logic.
- **Performance Optimizations**:
  - **Client-Side Caching**: Cache-First for instant search/filtering/language-toggles.
  - **Parallel & Preload Dashboard Fetching**: Preloads dashboard data (profile, notifications, projects) on startup/login and fetches in parallel.
  - **Minification & Edge Caching**: Automated build pipeline for minified CSS/JS and Vercel Edge caching enabled.
  - **Updates Stale-While-Revalidate**: Cache-first with 60s TTL, full re-render on language toggle using `titleVi`/`bodyVi` fields for Vietnamese display.
  - **Updates Language Toggle Fix (June 13, 2026)**: Removed incremental `data-id` tracking in `renderUpdates()` that prevented DOM updates on language switch. Now clears and re-renders all items from cache, ensuring bilingual content displays correctly.
- **Vercel Migration & DB Fix (June 14, 2026)**:
  - Migrated from local Vercel CLI deploy to GitHub-based deploy (user's own Vercel account).
  - Fixed `server/database/db.js` to detect `process.env.VERCEL` and use `/tmp/data.db` (writable path in serverless functions).
  - Moved proxy route (`/api/proxy-image`) before DB middleware in `server/server.js` so logo and favicons load even if DB initialization fails.
  - Replaced Google Drive proxy logo with local `public/assets/images/ui/gnz-logo.png` (downloaded from original Drive file).
  - Updated `index.html` logo + favicon to reference local PNG file directly.
