const express = require('express');
const { db } = require('../database/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const videoId = req.query.videoId;
    if (!videoId) return res.status(400).json({ ok: false, error: 'Missing videoId' });

    const result = await db.execute({
      sql: 'SELECT * FROM comments WHERE videoId = ? ORDER BY id DESC',
      args: [videoId]
    });
    res.json({ ok: true, comments: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load comments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { videoId, username, content } = req.body;
    if (!videoId || !username || !content) {
      return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    await db.execute({
      sql: 'INSERT INTO comments (videoId, username, content, timestamp, isRead) VALUES (?, ?, ?, ?, 0)',
      args: [videoId, username, content, new Date().toISOString()]
    });

    // Notify video owner (without revealing commenter name)
    try {
      const video = await db.execute({
        sql: 'SELECT submittedBy FROM videos WHERE id = ?',
        args: [videoId]
      });
      const ownerId = video.rows[0]?.submittedBy;
      if (ownerId) {
        const existing = await db.execute({
          sql: 'SELECT id FROM notifications WHERE userId = ? AND videoId = ? AND type = ? AND isRead = 0',
          args: [ownerId, videoId, 'comment']
        });
        if (existing.rows.length > 0) {
          await db.execute({
            sql: 'UPDATE notifications SET count = count + 1, createdAt = ? WHERE id = ?',
            args: [new Date().toISOString(), existing.rows[0].id]
          });
        } else {
          await db.execute({
            sql: 'INSERT INTO notifications (userId, title, titleVi, message, messageVi, type, isRead, createdAt, videoId, count) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, 1)',
            args: [ownerId, 'New comment', 'Bình luận mới', 'Someone commented on your post', 'Có người vừa bình luận về bài đăng của bạn', 'comment', new Date().toISOString(), videoId]
          });
        }
      }
    } catch (notifErr) {
      console.error('Failed to create notification:', notifErr.message);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to post comment' });
  }
});

router.patch('/:id/toggle-read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    await db.execute({
      sql: 'UPDATE comments SET isRead = ? WHERE id = ?',
      args: [isRead ? 1 : 0, id]
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to update status' });
  }
});

module.exports = router;
