# Project Instructions: Green Night Zero (GNZ)

## Core Mandates
- **Bilingual Content**: All user-facing strings must have English and Vietnamese versions.
- **Bilingual Grouping**: Every new Category or Topic must be added to the `I18N` object in `public/script.js` for both English and Vietnamese.
- **LaTeX Explanations**: LaTeX content is stored in `server/database/latex-content.json` (keyed by title) and the `videos` table (`explanationRaw`, `explanationViRaw`).
- **Visual Assets**: Use SVG or external image URLs for diagrams. Google Drive URLs MUST be auto-proxied via `/api/proxy-image?url=` to bypass raw byte restrictions. Frontend uses `proxyImageUrl(url)` helper.
- **Smart Topic Clustering**: The system automatically clusters related projects under shared topics (EN/VI) using AI to prevent topic inflation and ensure logical grouping.
- **Performance First**: 
    - **API Optimization**: List endpoint (`/api/videos`) is lightweight (no explanations). Use detail endpoint (`/api/videos/:id`) for full content.
    - **Client Caching**: Use the `allVideos`, `allNotifications`, `userProfileCache`, and `allManageProjects` caches for instant filtering, sorting, and language switching. 
    - **Updates Cache**: `allUpdates` is persisted in `localStorage` (`gnz_updates_cache`) and uses stale-while-revalidate (60s TTL) — renders cached data instantly, fetches only when stale. Language toggle calls `renderUpdates(allUpdates)` with **zero API calls**.
    - **Edge Optimization**: The `GET /api/videos` endpoint uses Vercel Edge Caching (`s-maxage=3600`). The `GET /api/updates` endpoint uses a shorter 60-second cache.
- **System Monitoring**: `npm run watchdog` and `npm run sync-manifest` monitor the root directory and require detailed technical summaries of system changes.

## Agent Onboarding (MANDATORY SETUP)
Upon entering this workspace, any AI agent **MUST** immediately perform the following setup steps:

1. **Verify Skill**: Ensure the `science-content-auto-adder` skill exists in `.gemini/skills/`.
2. **Reload Skills**: Run `/skills reload` if necessary to ensure the skill is active.
3. **Check Health**: Run `npm run status` to verify all automation engines are ready.

## Automation Workflow (MANDATORY)
After making ANY changes to the codebase (HTML, CSS, JS, etc.), you **MUST** run the synchronization command:

```bash
npm run sync-manifest
```

**Note**: `npm run check-images` and `npm run check-style` are **LEGACY** scripts that scan `.tex` files. They are no longer relevant for the current JSON/DB-based content system and should NOT be run.

### Feature Documentation Rule
Whenever a new feature is implemented, you **MUST** immediately:
1. Update `docs/DEVELOPER_HANDOVER.md` with technical details, usage instructions, and safety considerations.
2. Update the private project memory (`MEMORY.md`) and Agent guides (`AGENTS.md`, `GEMINI.md`) with the latest implementation status.
3. Inform the user about the documentation update.

Reference: [docs/AUTOMATION_RULES.md](./docs/AUTOMATION_RULES.md)
