const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(__dirname, '../server/database/data.db');
const db = createClient({ url: `file:${dbPath}` });

async function checkEmbed(v) {
  const ytMatch = v.embedUrl.match(/(?:embed\/|v=)([^&?/\s]+)/);
  if (ytMatch) {
    const videoId = ytMatch[1];
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(url);
    return response.status === 200 ? { ok: true } : { ok: false, error: 'YouTube video not found or restricted' };
  }

  const vimeoMatch = v.embedUrl.match(/vimeo\.com\/video\/(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const url = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/video/${videoId}`;
    const response = await fetch(url);
    return response.status === 200 ? { ok: true } : { ok: false, error: 'Vimeo video not found or restricted' };
  }

  return { ok: true, warning: 'Unknown video provider' };
}

async function validateAllVideos() {
  console.log('--- Checking all video links ---');
  const res = await db.execute('SELECT id, title, embedUrl FROM videos');
  for (const v of res.rows) {
    const status = await checkEmbed(v);
    if (!status.ok) {
      console.warn(`[WARNING] Video "${v.title}" might be broken: ${status.error}`);
    } else if (status.warning) {
      console.log(`[INFO] Video "${v.title}": ${status.warning}`);
    } else {
      console.log(`[OK] Video "${v.title}" is valid.`);
    }
  }
}

validateAllVideos().catch(console.error);
