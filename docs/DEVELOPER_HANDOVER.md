# DEVELOPER & AI AGENT HANDOVER GUIDE / HƯỚNG DẪN BÀN GIAO KỸ THUẬT
## (Project: Green Night Zero / Dự án: Green Night Zero - GNZ)

Production URL: [https://greennightzero.vercel.app](https://greennightzero.vercel.app)
Project Name: `greennightzero`

This document describes the automated systems built for this project to ensure seamless continuity when switching to other AI agents.
Tài liệu này mô tả các hệ thống tự động hóa được xây dựng cho dự án để đảm bảo tính liên tục khi chuyển đổi sang các AI Agent khác.

---

## 1. Core Automation Workflow (10 Steps) / Chu trình Tự động hóa Cốt lõi (10 Bước)
Every time a new video is added, the following cycle should be maintained:
Mỗi khi thêm video mới, chu trình sau đây cần được duy trì:

1. **Search**: Find high-quality science videos.
2. **AI Vision (OCR)**: Scan video thumbnails for hidden labels.
3. **Authoring**: Add/update entries in `server/database/latex-content.json` with bilingual LaTeX.
4. **Visuals**: Paste image URLs in Edit modal or add SVG.
5. **LaTeX images**: Use `\includegraphics[Descriptive Label]{path}`.
6. **Validate**: Manual image check via Edit modal gallery.
7. **Affiliate**: Enter links in submit form (`Name | URL`).
8. **DB Integration**: Add 20-column row to `samples` in `db.js`.
9. **Auto-Logging**: Run `npm run sync-manifest` to log news.
10. **AI Translation**: Run `npm run translate` for missing `Vi` fields.
11. **Deployment**: Run `npx vercel --prod` to push updates.

---

## 2. Visual Assets & Image Display / Tài sản hình ảnh & Cách hiển thị

**Image sources / Nguồn hình ảnh:**
1. **Paste image URLs in Edit modal (recommended)** — Gallery display in `public/script.js`.
2. **Local SVG files** in `public/assets/images/projects/`.
3. **Google Drive Image Proxy**: Uses `GET /api/proxy-image?url=...` to bypass raw byte restrictions. Frontend uses `proxyImageUrl(url)` helper.

---

## 3. Performance & Optimization Architecture / Kiến trúc Hiệu suất & Tối ưu hóa

### Client-Side Caching & Preloading (SPA)
The application uses a "Cache-First, Then-Fetch" strategy with smart preloading:
- **Global Caches**: `allVideos`, `allNotifications`, `userProfileCache`, `allManageProjects`.
- **Render vs. Fetch**: Logic is split into `render...()` (instant UI) and `load...()` (network sync) functions.
- **Language Switch**: Triggers `render...()` functions only — **0 API calls** during language toggling.
- **Data Mutation**: Actions like Add/Edit/Delete call `load... (true)` to force refresh the cache.
- **Parallel Fetching**: `loadDashboard()` fetches the profile, notifications, and manage list concurrently via `Promise.all` instead of sequentially.
- **Background Preloading**: The application automatically preloads dashboard data (`loadDashboard(true)`) and updates feed (`loadUpdates()`) in the background upon page initialization.
- **Persistent Updates Cache**: The Updates feed stores the last 40 entries in `localStorage` (`gnz_updates_cache`), enabling instant display for returning users while syncing in the background.
- **Updates Stale-While-Revalidate**: `loadUpdates()` uses a 60-second TTL — renders cached data instantly, only fetches API if cache is stale. Language toggling calls `renderUpdates(allUpdates)` directly with **zero network requests**.
- **Updates Re-render on Language Toggle**: `renderUpdates()` clears the entire DOM and re-renders all items from cache on language switch, using `titleVi`/`bodyVi` fields for Vietnamese display. This ensures the EN/VI toggle correctly reflects the selected language.
- **Pagination**: Both Videos and Updates feeds use `limit` and `offset` for optimized payload size.

### Edge Caching (Vercel)
- **Video API**: `GET /api/videos` returns `Cache-Control: public, s-maxage=3600`.
- **Updates API**: `GET /api/updates` returns `Cache-Control: public, s-maxage=60` for near-real-time visibility of system changes.
- **Result**: Sub-50ms API response time from Vercel's global edge network.

### Loading Speed (LCP)
- **Critical CSS**: Essential variables (`:root`) and theme background styles are embedded in `index.html` `<head>`.
- **Resource Hints**: `preconnect` and `dns-prefetch` for Google Fonts and CDNs.
- **Async Loading**: JS and full CSS are preloaded and loaded via `defer`/`link`.

---

## 4. Smart Content Submission / Gửi nội dung thông minh

### AI Auto-Complete Mode
- **Smart Topic Clustering**: Automatically groups related projects under shared topics (EN/VI). Retroactively updates "lonely" projects when a common theme is found.
- **Normalization**: Uses `fuzzyMatch()` to align AI output with existing DB categories/topics.

---

## 5. Deployment & Build Pipeline / Triển khai & Quy trình Build

- **Vercel**: `vercel.json` manages explicit asset routing and SPA catch-all.
- **Minification**: `npm run build` runs `scripts/build.mjs` (terser + clean-css + SVG optimizer).
- **Static Cache**: 1-year immutable cache for all public assets.
