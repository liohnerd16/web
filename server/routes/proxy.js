const express = require('express');
const router = express.Router();

function extractGoogleDriveId(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('drive.google.com') && !u.hostname.includes('docs.google.com')) return null;
    const idParam = u.searchParams.get('id');
    if (idParam) return idParam;
    const match = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (match) return match[1];
    return null;
  } catch {
    return null;
  }
}

function buildFetchUrl(url) {
  const driveId = extractGoogleDriveId(url);
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}&confirm=t`;
  }
  return url;
}

router.get('/proxy-image', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl) {
    return res.status(400).json({ ok: false, error: 'Missing url parameter' });
  }
  const fetchUrl = buildFetchUrl(rawUrl);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(fetchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);
    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: `Upstream ${response.status}` });
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return res.status(502).json({ ok: false, error: 'Response is not an image' });
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err) {
    if (err.name === 'AbortError') {
      res.status(504).json({ ok: false, error: 'Upstream timeout' });
    } else {
      res.status(502).json({ ok: false, error: err.message });
    }
  }
});

module.exports = router;
