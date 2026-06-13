# Automation & Synchronization Rules

This project uses an AI-powered manifest system to track changes and auto-generate "What's New" updates.

## Mandatory Workflow for AI Agents
Whenever you modify files in `public/`, `server/`, or `scripts/`, you **MUST** execute the following command as your final "Validation" step:

```bash
npm run sync-manifest
```

## Why?
- It maintains the `scripts/project-manifest.json` file.
- It uses Gemini AI to summarize your changes and log them into the `updates` table in the database with `type='system'`.
- It ensures the "News & Updates" section of the website stays current without manual intervention.

## Type-Based Filtering
The `updates` table has a `type` column. Only entries with `type='system'` are shown in the public Updates section:
- **System-level updates** (allowed): AI engines, automation tools, rating mechanisms, UI/UX redesign, database performance, security, deployment config, rebranding.
- **Project-specific content** (rejected): Adding new videos, translating specific projects, personal announcements.

The `GET /api/updates` endpoint filters `WHERE type = 'system'`. Both `auto-sync-manifest.js` and `add-update.js` validate content and enforce this type.

## AI Submit Behavior & Smart Clustering
When a user submits content via AI Auto-Complete:
1. The server strips inline base64 SVGs from the LaTeX and replaces them with an encourage label.
2. The frontend shows a suggest dialog prompting manual image addition via Edit modal.
3. Users paste image URLs directly in the Edit modal (gallery with add/delete/reorder). The first URL auto-replaces the encourage label on save.
4. After editing and saving, the detail page auto-refreshes — no F5 needed.
5. Gallery display below video has been removed — images show inline only via `\includegraphics` in LaTeX.
6. The system queries existing categories/topics from the DB, includes them in the AI prompt as hints, and normalizes the AI output via `fuzzyMatch()` (case-insensitive, partial match) to avoid duplicate/typo categories.
7. **Smart Topic Clustering**: If AI generates a project without a topic, the backend automatically compares it with other "lonely" projects in the same category. If a match is found, it creates a shared Topic (EN/VI) and retroactively groups the older projects under it. This maintains a clean, searchable hierarchy.

## Local Development
If you want continuous automation during a session, you can run:
```bash
node scripts/watchdog.js
```
The watchdog monitors `public/`, `server/`, `scripts/` and auto-triggers `sync-manifest` on every change — no manual steps needed.
