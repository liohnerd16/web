require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./database/db');

const videosRouter = require('./routes/videos');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const notificationsRouter = require('./routes/notifications');
const aiRouter = require('./routes/ai');
const commentsRouter = require('./routes/comments');
const feedbackRouter = require('./routes/feedback');
const updatesRouter = require('./routes/updates');
const ratingsRouter = require('./routes/ratings');
const proxyRouter = require('./routes/proxy');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Proxy — does NOT need DB (runs before DB middleware)
app.use('/api', proxyRouter);

// DB readiness middleware — ensures tables exist before any route handler
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await initDb();
      dbReady = true;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/videos', videosRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/updates', updatesRouter);
app.use('/api/ratings', ratingsRouter);

app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: '1y',
  immutable: true,
  etag: true
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT}`);
  });
}

module.exports = app;
