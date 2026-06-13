const express = require('express');
const { db } = require('../database/db');
const router = express.Router();

// GET average rating for a video
router.get('/', async (req, res) => {
  const { videoId } = req.query;
  try {
    const result = await db.execute({
      sql: 'SELECT AVG(score) as avg, COUNT(*) as count FROM ratings WHERE videoId = ?',
      args: [videoId]
    });
    res.json({ ok: true, rating: result.rows[0].avg || 0, count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST a new rating
router.post('/', async (req, res) => {
  const { videoId, score } = req.body;
  if (!videoId || !score || score < 1 || score > 5) {
    return res.status(400).json({ ok: false, error: 'Invalid rating' });
  }
  try {
    await db.execute({
      sql: 'INSERT INTO ratings (videoId, score, timestamp) VALUES (?, ?, ?)',
      args: [videoId, score, new Date().toISOString()]
    });

    // Update denormalized fields in videos table
    try {
      const stats = await db.execute({
        sql: 'SELECT AVG(score) as avg, COUNT(*) as count FROM ratings WHERE videoId = ?',
        args: [videoId]
      });
      if (stats.rows.length > 0) {
        await db.execute({
          sql: 'UPDATE videos SET avgRating = ?, ratingCount = ? WHERE id = ?',
          args: [stats.rows[0].avg, stats.rows[0].count, videoId]
        });
      }
    } catch (dbErr) {
      console.error('Failed to update denormalized ratings:', dbErr.message);
    }

    // Notify video owner (without revealing rater name)
    try {
      const video = await db.execute({
        sql: 'SELECT submittedBy FROM videos WHERE id = ?',
        args: [videoId]
      });
      const ownerId = video.rows[0]?.submittedBy;
      if (ownerId) {
        const existing = await db.execute({
          sql: 'SELECT id FROM notifications WHERE userId = ? AND videoId = ? AND type = ? AND isRead = 0',
          args: [ownerId, videoId, 'rating']
        });
        if (existing.rows.length > 0) {
          await db.execute({
            sql: 'UPDATE notifications SET count = count + 1, createdAt = ? WHERE id = ?',
            args: [new Date().toISOString(), existing.rows[0].id]
          });
        } else {
          await db.execute({
            sql: 'INSERT INTO notifications (userId, title, titleVi, message, messageVi, type, isRead, createdAt, videoId, count) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 1)',
            args: [ownerId, 'New rating', 'Đánh giá mới', 'Someone rated your post', 'Có người vừa đánh giá bài đăng của bạn', 'rating', new Date().toISOString(), videoId]
          });
        }
      }
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr.message);
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
