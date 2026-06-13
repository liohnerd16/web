const express = require('express');
const { db, initDb } = require('../database/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await initDb();
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const result = await db.execute({
      sql: "SELECT * FROM updates WHERE type = 'system' ORDER BY id DESC LIMIT ? OFFSET ?",
      args: [limit, offset]
    });
    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400');
    res.json({ ok: true, updates: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load updates' });
  }
});

module.exports = router;
