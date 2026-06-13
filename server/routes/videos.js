const express = require('express');
const { db, initDb } = require('../database/db');
const auth = require('../middleware/auth');

const router = express.Router();

const latexFallback = require('../database/latex-content.json');

function resolveContent(row, lang) {
  const raw = lang === 'vi' ? row.explanationViRaw : row.explanationRaw;
  if (raw && raw.endsWith('.tex') && latexFallback[row.title]) {
    const entry = latexFallback[row.title];
    return lang === 'vi' ? (entry.vi || entry.en) : (entry.en || entry.vi);
  }
  return raw || null;
}

function parseVideoRow(row, includeExplanation = false) {
  const result = {
    ...row,
    imageUrls: row.imageUrls ? JSON.parse(row.imageUrls) : [],
    referenceLinks: row.referenceLinks ? JSON.parse(row.referenceLinks) : [],
    affiliateLinks: row.affiliateLinks ? JSON.parse(row.affiliateLinks) : []
  };
  if (includeExplanation) {
    result.explanationContent = resolveContent(row, 'en');
    result.explanationViContent = resolveContent(row, 'vi');
  }
  // Always include raw fields for detail view
  if (!includeExplanation) {
    delete result.explanationRaw;
    delete result.explanationViRaw;
  }
  return result;
}

/** GET /api/videos — optional ?q= &category= &sort= */
router.get('/', async (req, res) => {
  try {
    await initDb(); // Ensure DB is ready
    const q = (req.query.q || '').trim().toLowerCase();
    const cat = (req.query.category || '').trim();
    const topic = (req.query.topic || '').trim();
    const sort = (req.query.sort || 'newest').trim();
    const limit = req.query.limit !== undefined ? (parseInt(req.query.limit) || 0) : 12;
    const offset = parseInt(req.query.offset) || 0;

    let sql = `
      SELECT v.*
      FROM videos v WHERE 1=1
    `;
    const params = [];

    if (cat) {
      sql += ' AND v.category = ?';
      params.push(cat);
    }
    if (topic) {
      sql += ' AND v.topic = ?';
      params.push(topic);
    }
    if (q) {
      sql += ' AND (LOWER(v.title) LIKE ? OR LOWER(v.description) LIKE ? OR LOWER(v.titleVi) LIKE ? OR LOWER(v.descriptionVi) LIKE ?)';
      const like = `%${q}%`;
      params.push(like, like, like, like);
    }

    if (sort === 'oldest') {
      sql += ' ORDER BY v.id ASC';
    } else if (sort === 'title') {
      sql += ' ORDER BY v.title COLLATE NOCASE ASC';
    } else if (sort === 'top-rated') {
      sql += ' ORDER BY v.avgRating DESC, v.ratingCount DESC, v.id DESC';
    } else {
      sql += ' ORDER BY v.id DESC';
    }

    if (limit > 0) {
      sql += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const result = await db.execute({ sql, args: params });
    const rows = result.rows.map(r => parseVideoRow(r, false));

    // Get total count for pagination info
    let countSql = 'SELECT COUNT(*) as total FROM videos WHERE 1=1';
    const countParams = [];
    if (cat) { countSql += ' AND category = ?'; countParams.push(cat); }
    if (topic) { countSql += ' AND topic = ?'; countParams.push(topic); }
    if (q) { 
      countSql += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(titleVi) LIKE ? OR LOWER(descriptionVi) LIKE ?)';
      const like = `%${q}%`;
      countParams.push(like, like, like, like);
    }
    const countResult = await db.execute({ sql: countSql, args: countParams });
    const total = countResult.rows[0].total;

    res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json({ ok: true, videos: rows, total, limit, offset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load videos' });
  }
});

/** GET /api/videos/manage — user's videos (admin: all) */
router.get('/manage', auth, async (req, res) => {
  try {
    await initDb();
    const isAdmin = req.user.role === 'admin';
    let rows;
    if (isAdmin) {
      const r = await db.execute({ sql: 'SELECT v.*, u.username as submittedByName FROM videos v LEFT JOIN users u ON v.submittedBy = u.id ORDER BY v.id DESC', args: [] });
      rows = r.rows;
    } else {
      const r = await db.execute({ sql: 'SELECT * FROM videos WHERE submittedBy = ? ORDER BY id DESC', args: [req.user.id] });
      rows = r.rows;
    }
    res.json({ ok: true, videos: rows.map(r => parseVideoRow(r, true)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load manage list' });
  }
});

/** PUT /api/videos/:id — edit video */
router.put('/:id', auth, async (req, res) => {
  try {
    await initDb();
    const { title, titleVi, description, descriptionVi, category, categoryVi, topic, topicVi, explanation, explanationVi, explanationRaw, explanationViRaw, seriesTitle, seriesTitleVi, partNumber, imageUrls } = req.body;
    const check = await db.execute({ sql: 'SELECT * FROM videos WHERE id = ?', args: [req.params.id] });
    if (check.rows.length === 0) return res.status(404).json({ ok: false, error: 'Not found' });
    const video = check.rows[0];
    if (req.user.role !== 'admin' && Number(video.submittedBy) !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    await db.execute({
      sql: 'UPDATE videos SET title=?, titleVi=?, description=?, descriptionVi=?, category=?, categoryVi=?, topic=?, topicVi=?, explanation=?, explanationVi=?, explanationRaw=?, explanationViRaw=?, seriesTitle=?, seriesTitleVi=?, partNumber=?, imageUrls=? WHERE id=?',
      args: [title, titleVi, description, descriptionVi, category, categoryVi, topic, topicVi, explanation, explanationVi, explanationRaw, explanationViRaw, seriesTitle, seriesTitleVi, partNumber, JSON.stringify(imageUrls || []), req.params.id]
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to update' });
  }
});

/** GET /api/videos/:id — single video with full details */
router.get('/:id', async (req, res) => {
  try {
    await initDb();
    const result = await db.execute({ sql: 'SELECT * FROM videos WHERE id = ?', args: [req.params.id] });
    if (result.rows.length === 0) return res.status(404).json({ ok: false, error: 'Not found' });
    res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json({ ok: true, video: parseVideoRow(result.rows[0], true) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load video' });
  }
});

/** DELETE /api/videos/:id — delete video */
router.delete('/:id', auth, async (req, res) => {
  try {
    await initDb();
    const check = await db.execute({ sql: 'SELECT * FROM videos WHERE id = ?', args: [req.params.id] });
    if (check.rows.length === 0) return res.status(404).json({ ok: false, error: 'Not found' });
    const video = check.rows[0];
    if (req.user.role !== 'admin' && Number(video.submittedBy) !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    await db.execute({ sql: 'DELETE FROM videos WHERE id = ?', args: [req.params.id] });
    await db.execute({ sql: 'DELETE FROM comments WHERE videoId = ?', args: [req.params.id] });
    await db.execute({ sql: 'DELETE FROM ratings WHERE videoId = ?', args: [req.params.id] });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to delete' });
  }
});

module.exports = router;
