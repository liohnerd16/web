const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

function validateFeedback(body) {
  const errors = [];
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const message = (body.message || '').trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || name.length > 120) errors.push('Name must be 1–120 characters');
  if (!emailOk) errors.push('Valid email required');
  if (!message || message.length > 5000) errors.push('Message must be 1–5000 characters');

  return { errors, name, email, message };
}

/** POST /api/feedback */
router.post('/', async (req, res) => {
  try {
    const { errors, name, email, message } = validateFeedback(req.body);
    if (errors.length) {
      return res.status(400).json({ ok: false, errors });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.FEEDBACK_TO_EMAIL || email;

    if (!host || !user || !pass) {
      console.warn('Feedback: SMTP not configured — logging only.');
      console.log({ name, email, message });
      return res.json({
        ok: true,
        mode: 'logged',
        message: 'Feedback recorded (SMTP not configured).'
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Science Videos" <${user}>`,
      to,
      replyTo: email,
      subject: `Site feedback from ${name}`,
      text: `${name} <${email}>\n\n${message}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(
        message
      ).replace(/\n/g, '<br/>')}</p>`
    });

    res.json({ ok: true, mode: 'email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not send feedback' });
  }
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = router;
