# Session Automation Handoff

Tai lieu nay dung de copy sang session AI khac, giup agent moi nap dung cac co che tu dong va quy trinh cua du an.

## Prompt Khoi Dong Cho Session Khac

Copy doan nay vao dau session moi:

```text
Ban dang lam viec trong du an Science Video Aggregator tai D:\project\web.

Viec bat buoc truoc khi sua code:
1. Doc docs/AGENTS.md, docs/DEVELOPER_HANDOVER.md.
2. Doc package.json de nam cac lenh automation (chu y: check-images va check-style da bi xoa).
3. Doc server/database/db.js (schema 23 cot) va server/database/latex-content.json.
4. Doc public/script.js: hieu co che **Client-side Caching** de render/filter/lang-toggle tuc thi.
5. Du an **KHONG dung Git**. Khong chay lenh git.
6. Neu sua file trong public/, server/, hoac scripts/, phai chay: `npm run sync-manifest`.
7. **Affiliate Links**: Dung giao dien dong (rows) trong Dashboard, tu dong serialize.
 8. Khi post A.I, inline base64 SVGs bi strip, hien dialog goi y them anh sau submit.
 9. Category/topic tu dong duoc normalize qua `fuzzyMatch()` o Backend.
 10. Detail page tu dong refresh sau edit save (goi lai openDetail), khong can F5.
 11. **Guide Page**: `#page-guide` co huong dan YouTube/Google Drive/LaTeX cho users. LaTeX guide da chuyen tu Dashboard vao day.
 12. **Static bilingual content**: Dung `.lang-en`/`.lang-vi` class, `applyLang()` tu dong toggle.

 13. Google Drive image URLs duoc auto-proxy qua `/api/proxy-image` (`server/routes/proxy.js`) de hien thi trong `<img>`.
 12. Khong xoa server/database/data.db vi co du lieu runtime.
 13. Bao cao ro lenh nao da chay, lenh nao fail.
 14. Notification system: count-based, ho tro song ngu qua videoId.
 15. **Smart Topic Clustering**: AI tu dong group cac project lien quan vao Topic chung (EN/VI) de tranh lam phat topic. He thong quet cac project "lonely" va retroactively update chung.
  16. **API Pagination**: Trang Videos dung `limit` va `offset`. Dung global cache `allVideos` de ho tro re-render nhanh.
  17. **API V2 (Payload Optimization)**: List endpoint `GET /api/videos` tra ve thieu explanationRaw/ViRaw. Detail endpoint `GET /api/videos/:id` tra ve day du explanation. Frontend tu dong fetch detail khi mo detail page.
  18. **Client-Side Filter/Sort**: Khi `allVideos.length >= totalVideos`, `renderVideoGrid()` loc tu cache — 0 API calls.
  19. **limit=0**: Server xu ly `limit=0` la khong gioi han (bo WHERE LIMIT). Dung trong background preload.
  20. **Background Cache Preload**: `init()` goi `fetchVideos({ limit: 0 })` sau render lan dau de nap toan bo videos vao `allVideos`. Nhe nho stripped explanation.
 17. **Affiliate Links UI**: Dung `createAffiliateRow` va `serializeAffiliateLinks` (global functions) cho ca form Add va form Edit.
 18. **Build Pipeline**: Truoc khi deploy, chay `npm run build` de minify JS (terser) + CSS (clean-css) + SVG. Output: `script.min.js`, `styles.min.css`. Vercel tu dong chay `vercel-build` khi deploy.
 19. **Static Cache 1 nam**: `express.static()` duoc cau hinh `maxAge: '1y', immutable: true`. Static assets chi tai 1 lan, khong revalidate.
 20. **DB Readiness Cache**: `initDb()` chi chay 1 lan (request dau tien), bo qua cac request sau — giam latency API.
 21. **Defer Script**: `<script defer src="/script.min.js">` — JS khong block HTML parsing.
 22. **Resource Hints**: preconnect (jsDelivr), preload (CSS/JS), dns-prefetch trong HTML head.
> 23. **Updates Stale-While-Revalidate**: `loadUpdates()` dùng TTL 60s. Render tu cache truoc, chi fetch API neu cache qua han. Khi chuyen ngon ngu, goi `renderUpdates(allUpdates)` — 0 API calls.
> 24. **Updates Incremental Rendering**: `renderUpdates()` dung `data-id` de chi append items moi vao DOM, khong re-render lai toan bo list.

 ## Co Che Tu Dong Hien Co

 - `npm run sync-manifest`: Quet thay doi, dung Gemini tao ban tin update. Co fallback insert SQL truc tiep.
 - **Client-side Lang Toggle**: Su dung `allVideos` cache de re-render tuc thi, khong goi network.
 - **Updates Stale-While-Revalidate**: `loadUpdates()` kiem tra `lastUpdatesFetch` + `UPDATES_CACHE_TTL` (60s). Neu con moi, render tu cache va bo qua fetch. Khi append (Load More), dung `renderUpdates()` incremental.
 - **Updates Incremental Rendering**: `renderUpdates()` dung `data-id` de chi tao DOM cho items chua render. Dung `DocumentFragment` de batch append, giam reflow.
 - **Detail Endpoint**: `GET /api/videos/:id` tra ve 1 video voi day du explanation fields. Chi goi khi mo detail view.
 - **Client-side Filtering**: `renderVideoGrid()` co 2 mode: cache (khi da co toan bo data) va API fallback (khi cache chua day).
 - **Background Cache Preload**: `init()` goi `fetchVideos({ limit: 0 })` sau render lan dau de nap day `allVideos` (nhe nho stripped explanation).
 - **API Pagination**: `renderVideoGrid()` goi API voi `limit` va `offset`, dung nut "Load More" de tai them.
 - `fuzzyMatch()` trong `server/routes/ai.js`: Normalize category/topic.
 - **Smart Topic Clustering**: Logic trong `server/routes/ai.js` dung `suggestCommonTopic` de nhom cac du an co cung nguyen ly khoa hoc.
 - `npm run translate`: Dich song ngu video/update.
 - **Response Compression**: Server dung `compression` middleware (Gzip) de giam bandwidth JSON.
 - `npm run translate`: Dich song ngu video/update.
 - `npm run build` / `npm run vercel-build`: Minify JS (terser) + CSS (clean-css) + SVG optimization. Tao `script.min.js` va `styles.min.css`.
 - `npm run watchdog`: Watch file change va auto sync.
 - `npm run status`: In automation manifest.

## Canh Bao Hien Trang

- **KHONG CO GIT**: Thư mục `.git` và file `.gitignore` đã bị xóa. Đây là dự án quản lý thủ công (no-version-control).
- **Affiliate Links UI**: Giao diện nhập link tiếp thị dạng dòng động (Dynamic Rows) giúp người dùng nhập Name và URL riêng biệt, tránh lỗi định dạng `|`.
- **Performance Fix**: Mọi thao tác lọc, tìm kiếm và chuyển ngôn ngữ đều diễn ra tức thì nhờ bộ nhớ đệm (caching) tại trình duyệt.
- **Cleanup Completed**: Toàn bộ file rác, script cũ (`validate-images`, `migrate-tex`), và log tạm đã bị xóa sạch.
- **Bilingual Submission**: Hỗ trợ đầy đủ 2 ngôn ngữ, tự động dịch nếu thiếu 1 bên.
- **LaTeX Storage**: Lưu trong JSON và DB, không còn file `.tex`.
- **Render Fixes**: Tự động xử lý `\{`, `\}` và line-breaks trong LaTeX.
- **Google Drive Image Proxy**: `server/routes/proxy.js` tự động proxy ảnh từ Google Drive qua `/api/proxy-image`. Frontend `proxyImageUrl()` tự transform URL khi render.
- **Lang Toggle Blocks**: Dùng `.lang-en`/`.lang-vi` class cho nội dung tĩnh song ngữ, `applyLang()` tự động toggle `display`. Các class cũ (`.latex-guide-en`/`.latex-guide-vi`) đã deprecated.
- **Guide Page**: `#page-guide` có 4 section hướng dẫn (YouTube, Google Drive, LaTeX images, LaTeX commands). LaTeX command reference đã chuyển từ Dashboard vào đây.
- **Build Pipeline**: HTML reference `/script.min.js` va `/styles.min.css`. Cac file nay duoc sinh ra boi `npm run build`. Neu sua `script.js` hoac `styles.css`, phai chay lai `npm run build` truoc khi deploy.
- **Static Cache**: Server set `Cache-Control: public, max-age=31536000, immutable` cho static assets. Trinh duyet se khong bao gio revalidate.
- **DB Readiness**: `initDb()` chay 1 lan. Khoi dong lai server (deploy moi) de reset.
- Database `videos` có 23 cột.

## Checklist Truoc Khi Ket Thuc Mot Task

- Da doc dung file lien quan truoc khi sua.
- Khong ghi de thay doi khong lien quan cua nguoi dung.
- Neu sua JS, chay `node --check` cho file da sua hoac toan bo JS.
- Neu sua SVG/asset hinh anh, kiem tra duong dan thu cong (khong co automated check — `check-images` va `check-style` la legacy).
- Neu sua `public/`, `server/`, `scripts/`, chay `npm run sync-manifest`.
- Detail page tu dong refresh sau edit save — dam bao khong can F5.
- Neu lenh can network bi fail do sandbox, yeu cau approval dung cach.
- Bao cao ngan gon: file da sua, lenh da chay, ket qua pass/fail.
