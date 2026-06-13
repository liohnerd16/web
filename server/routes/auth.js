const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDb } = require('../database/db');
const crypto = require('crypto');

const nodemailer = require('nodemailer');

// Configure Mail Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    await initDb();
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ? LIMIT 1',
      args: [email]
    });

    if (existing.rows.length > 0) {
      return res.status(400).json({ ok: false, error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute({
      sql: 'INSERT INTO users (email, password, username, createdAt) VALUES (?, ?, ?, ?)',
      args: [email, hashedPassword, username, new Date().toISOString()]
    });

    res.json({ ok: true, message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await db.execute({
      sql: 'SELECT id, username FROM users WHERE email = ? LIMIT 1',
      args: [email]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const user = result.rows[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await db.execute({
      sql: 'UPDATE users SET resetToken = ?, resetExpires = ? WHERE email = ?',
      args: [token, expires, email]
    });

    // Send Real Email
    const mailOptions = {
      from: `"SciVid Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request / Yêu cầu đặt lại mật khẩu',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #2563eb;">SciVid</h2>
          <p>Hi <strong>${user.username}</strong>,</p>
          <p>You requested to reset your password. Use the token below to complete the process:</p>
          <div style="background: #f3f4f6; padding: 15px; font-size: 1.2rem; font-weight: bold; text-align: center; letter-spacing: 2px;">
            ${token}
          </div>
          <p style="margin-top: 20px;"><em>Vietnamese:</em></p>
          <p>Chào bạn, bạn đã yêu cầu đặt lại mật khẩu. Hãy sử dụng mã xác nhận bên trên để hoàn tất quá trình này.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8rem; color: #666;">If you didn't request this, please ignore this email. / Nếu bạn không yêu cầu, vui lòng bỏ qua thư này.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ ok: true, message: 'Reset token sent to your email.' }); 
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ ok: false, error: 'Failed to send email. Please try again later.' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await db.execute({
      sql: 'SELECT id, resetExpires FROM users WHERE resetToken = ? LIMIT 1',
      args: [token]
    });

    if (result.rows.length === 0) {
      return res.status(400).json({ ok: false, error: 'Invalid or expired token' });
    }

    const user = result.rows[0];
    if (new Date() > new Date(user.resetExpires)) {
      return res.status(400).json({ ok: false, error: 'Token has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.execute({
      sql: 'UPDATE users SET password = ?, resetToken = NULL, resetExpires = NULL WHERE id = ?',
      args: [hashedPassword, user.id]
    });

    res.json({ ok: true, message: 'Password has been reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for: ${email}`);

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ? LIMIT 1',
      args: [email]
    });

    if (result.rows.length === 0) {
      console.log(`User not found: ${email}`);
      return res.status(400).json({ ok: false, error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ ok: false, error: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
