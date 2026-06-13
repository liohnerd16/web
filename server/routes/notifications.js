const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db } = require('../database/db');

// Get all notifications for a user
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.execute({
      sql: `SELECT n.*, v.title as videoTitle, v.titleVi as videoTitleVi
            FROM notifications n
            LEFT JOIN videos v ON n.videoId = v.id
            WHERE n.userId = ? ORDER BY n.createdAt DESC`,
      args: [req.user.id]
    });

    res.json({ ok: true, notifications: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    await db.execute({
      sql: 'UPDATE notifications SET isRead = 1 WHERE id = ? AND userId = ?',
      args: [req.params.id, req.user.id]
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await db.execute({
      sql: 'UPDATE notifications SET isRead = 1 WHERE userId = ?',
      args: [req.user.id]
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
