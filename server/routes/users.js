const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db, initDb } = require('../database/db');
const bcrypt = require('bcryptjs');

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    await initDb();
    const result = await db.execute({
      sql: 'SELECT id, email, username, role, createdAt FROM users WHERE id = ? LIMIT 1',
      args: [req.user.id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Change Password
router.post('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await db.execute({
      sql: 'SELECT password FROM users WHERE id = ? LIMIT 1',
      args: [req.user.id]
    });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, error: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.execute({
      sql: 'UPDATE users SET password = ? WHERE id = ?',
      args: [hashedPassword, req.user.id]
    });

    res.json({ ok: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Change Email
router.post('/change-email', auth, async (req, res) => {
  const { newEmail, password } = req.body;

  try {
    // 1. Verify password
    const userResult = await db.execute({
      sql: 'SELECT password FROM users WHERE id = ? LIMIT 1',
      args: [req.user.id]
    });
    const isMatch = await bcrypt.compare(password, userResult.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, error: 'Incorrect password' });
    }

    // 2. Check if new email is already taken
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ? LIMIT 1',
      args: [newEmail]
    });
    if (existing.rows.length > 0) {
      return res.status(400).json({ ok: false, error: 'Email already in use' });
    }

    // 3. Update email
    await db.execute({
      sql: 'UPDATE users SET email = ? WHERE id = ?',
      args: [newEmail, req.user.id]
    });

    res.json({ ok: true, message: 'Email updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});
module.exports = router;
