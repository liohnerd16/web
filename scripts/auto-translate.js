require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@libsql/client');
const path = require('path');
const fs = require('fs');
const { MODEL, callWithRetry } = require('./gemini-utils');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const dbPath = path.join(__dirname, '../server/database/data.db');
const db = createClient({ url: `file:${dbPath}` });

async function translateText(text, targetLang = 'Vietnamese') {
  if (!text) return '';
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `Translate the following educational science content to ${targetLang}. Keep scientific terms accurate. Only return the translated text without explanations:\n\n${text}`;

  try {
    const result = await callWithRetry(() => model.generateContent(prompt));
    const response = await result.response;
    return response.text().trim();
  } catch (err) {
    console.error(`Translation error for "${text.substring(0, 20)}...": ${err.message}`);
    return '';
  }
}

async function scanThumbnailForSequence(v) {
  const vidMatch = v.embedUrl.match(/(?:embed\/|v=)([^&?/\s]+)/);
  if (!vidMatch) return null;
  const videoId = vidMatch[1];
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  console.log(`AI Vision: Scanning thumbnail for ${v.title}...`);
  const model = genAI.getGenerativeModel({ model: MODEL });

  try {
    const response = await fetch(thumbUrl);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();

    const prompt = "Look at this video thumbnail. Does it contain text indicating it is part of a series? Look for 'Part 1', 'Part 2', '#1', '#2', 'Lesson 1', etc. Return ONLY the number found, or 'null' if none.";

    const result = await callWithRetry(() => model.generateContent([
      prompt,
      { inlineData: { data: Buffer.from(buffer).toString('base64'), mimeType: 'image/jpeg' } }
    ]));
    const text = (await result.response).text().trim();
    const num = parseInt(text);
    return isNaN(num) ? null : num;
  } catch (err) {
    console.error(`Vision error for ${v.title}: ${err.message}`);
    return null;
  }
}

async function run() {
  console.log('--- Starting AI Auto-Translation & Vision Scan ---');

  // 1. Translate & Vision Scan for Videos
  const vRes = await db.execute('SELECT id, title, description, embedUrl, titleVi, descriptionVi, partNumber FROM videos');
  for (const v of vRes.rows) {
    let updateFields = {};

    // AI Vision: Scan for missing part numbers
    if (v.partNumber === null) {
      const partNum = await scanThumbnailForSequence(v);
      if (partNum !== null) {
        console.log(`   >> Detected Part ${partNum} from thumbnail!`);
        updateFields.partNumber = partNum;
      }
    }

    if (!v.titleVi || v.titleVi === v.title) {

      console.log(`Translating title: ${v.title}`);
      const translated = await translateText(v.title);
      if (translated) updateFields.titleVi = translated;
    }
    if (!v.descriptionVi || v.descriptionVi === v.description) {
      console.log(`Translating description for video ID ${v.id}`);
      const translated = await translateText(v.description);
      if (translated) updateFields.descriptionVi = translated;
    }

    if (Object.keys(updateFields).length > 0) {
      await db.execute({
        sql: 'UPDATE videos SET titleVi = COALESCE(?, titleVi), descriptionVi = COALESCE(?, descriptionVi) WHERE id = ?',
        args: [updateFields.titleVi || null, updateFields.descriptionVi || null, v.id]
      });
    }
  }

  // 2. Translate Updates
  const uRes = await db.execute('SELECT id, title, body, titleVi, bodyVi FROM updates');
  for (const u of uRes.rows) {
    let updateFields = {};
    if (!u.titleVi || u.titleVi === u.title) {
      console.log(`Translating update title: ${u.title}`);
      const translated = await translateText(u.title);
      if (translated) updateFields.titleVi = translated;
    }
    if (!u.bodyVi || u.bodyVi === u.body) {
      console.log(`Translating update body for ID ${u.id}`);
      const translated = await translateText(u.body);
      if (translated) updateFields.bodyVi = translated;
    }

    if (Object.keys(updateFields).length > 0) {
      await db.execute({
        sql: 'UPDATE updates SET titleVi = COALESCE(?, titleVi), bodyVi = COALESCE(?, bodyVi) WHERE id = ?',
        args: [updateFields.titleVi || null, updateFields.bodyVi || null, u.id]
      });
    }
  }

  // 3. Handle Category Translations in script.js
  const catsRes = await db.execute('SELECT DISTINCT category FROM videos');
  const scriptPath = path.join(__dirname, '../public/script.js');
  let scriptContent = fs.readFileSync(scriptPath, 'utf8');
  let scriptModified = false;

  for (const row of catsRes.rows) {
    const cat = row.category;
    const catKey = 'cat_' + String(cat).toLowerCase().replace(/\s+/g, '');
    
    // Check if the key exists (quoted or unquoted)
    const keyRegex = new RegExp(`['"]?${catKey}['"]?\\s*:`, 'i');
    
    if (!keyRegex.test(scriptContent)) {
      console.log(`New category detected: ${cat}. Translating...`);
      const catVi = await translateText(cat);
      if (!catVi) continue;
      
      // Inject into EN section
      scriptContent = scriptContent.replace(
        /(en: \{[\s\S]*?)([\n\s]+)\},(\s+vi:)/,
        `$1,\n    ${catKey}: '${cat}'$2},$3`
      );

      // Inject into VI section
      scriptContent = scriptContent.replace(
        /(vi: \{[\s\S]*?)([\n\s]+)\}(\s+\};)/,
        `$1,\n    ${catKey}: '${catVi}'$2}$3`
      );
      
      scriptModified = true;
    }
  }

  if (scriptModified) {
    fs.writeFileSync(scriptPath, scriptContent, 'utf8');
    console.log('Updated public/script.js with new category translations.');
  }

  console.log('--- AI Auto-Translation Complete ---');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
