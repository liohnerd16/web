require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@libsql/client');
const path = require('path');
const { MODEL, callWithRetry } = require('./gemini-utils');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const dbPath = path.join(__dirname, '../server/database/data.db');
const db = createClient({ url: `file:${dbPath}` });

async function isSystemUpdate(title, body) {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `Classify whether the following website update is a SYSTEM-level update or PROJECT-specific content.

SYSTEM-level updates are about the website infrastructure itself:
- AI engine improvements, automation mechanisms, rating mechanisms
- UI/UX redesign, responsive layout changes
- Database optimization, performance upgrades
- Security updates, authentication changes
- Deployment configuration changes
- Content management system improvements

PROJECT-specific content is about:
- Adding new videos, projects, or experiments
- Translating content for specific projects
- Personal announcements about specific videos

Title: "${title}"
Body: "${body}"

Return ONLY a JSON object: { "isSystem": boolean, "reason": "..." }`;

  try {
    const result = await callWithRetry(() => model.generateContent(prompt));
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { isSystem: false, reason: 'Failed to parse AI response' };
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error(`AI validation error: ${err.message}`);
    return { isSystem: false, reason: 'AI validation failed' };
  }
}

async function translateText(text, targetLang = 'Vietnamese') {
  if (!text) return '';
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `Translate this technical scientific update for a website to ${targetLang}. Return ONLY the translated text:\n\n${text}`;
  try {
    const result = await callWithRetry(() => model.generateContent(prompt));
    return result.response.text().trim();
  } catch (err) {
    console.error(`Translation error: ${err.message}`);
    return text;
  }
}

async function addUpdate(title, body) {
  console.log(`--- Validating Update: ${title} ---`);

  // Ensure 'type' column exists
  try { await db.execute("ALTER TABLE updates ADD COLUMN type TEXT DEFAULT 'system'"); } catch (e) {}

  // AI validation: only system-level updates allowed
  const validation = await isSystemUpdate(title, body);
  if (!validation.isSystem) {
    console.log(`REJECTED — Not a system-level update. Reason: ${validation.reason}`);
    console.log('Only system-level updates are allowed (AI, automation, rating, UI, DB, security, deploy, etc).');
    process.exit(1);
  }

  console.log('Validated as system update.');

  // Check for similar recent entries within 7 days
  const recent = await db.execute({
    sql: "SELECT id, title FROM updates WHERE postedAt > datetime('now', '-7 days') AND title LIKE ? LIMIT 1",
    args: [`%${title.split(' ').slice(0, 3).join('%')}%`]
  });
  if (recent.rows.length > 0) {
    console.log(`Skipped — similar entry exists (ID ${recent.rows[0].id}): "${recent.rows[0].title}"`);
    return;
  }

  const titleVi = await translateText(title, 'Vietnamese');
  const bodyVi = await translateText(body, 'Vietnamese');

  await db.execute({
    sql: "INSERT INTO updates (title, body, postedAt, titleVi, bodyVi, type) VALUES (?, ?, ?, ?, ?, 'system')",
    args: [title, body, new Date().toISOString(), titleVi, bodyVi]
  });

  console.log('--- System Update Logged Successfully ---');
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node scripts/add-update.js "Title" "Body"');
  process.exit(1);
}

addUpdate(args[0], args[1]).catch(console.error);
