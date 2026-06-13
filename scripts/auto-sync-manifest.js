require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@libsql/client');
const { MODEL, callWithRetry } = require('./gemini-utils');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const dbPath = path.join(__dirname, '../server/database/data.db');
const db = createClient({ url: `file:${dbPath}` });
const manifestPath = path.join(__dirname, 'project-manifest.json');

// Directories to monitor (start from root)
const dirsToScan = ['.'];
const ignoredDirs = ['node_modules', '.git', '.vercel', '.gemini', '.opencode', '.antigravitycli'];
const whitelistedJson = ['package.json', 'vercel.json'];
const whitelistedExts = ['.js', '.mjs', '.css', '.html', '.md', '.svg'];

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const name = path.join(dir, f);
    const stat = fs.statSync(name);
    if (stat.isDirectory()) {
      if (!ignoredDirs.includes(f)) getFiles(name, allFiles);
    } else {
      // Whitelist logic
      const ext = path.extname(f);
      const isWhitelistedJson = whitelistedJson.includes(f);
      const isWhitelistedExt = whitelistedExts.includes(ext);
      
      // Blacklist sensitive/temp files
      const isBlacklisted = f.startsWith('.env') || f === 'package-lock.json' || f === 'data.db' || f === 'describe.txt';

      if ((isWhitelistedExt || isWhitelistedJson) && !isBlacklisted) {
        allFiles.push({ name, mtime: stat.mtimeMs });
      }
    }
  }
  return allFiles;
}

async function run() {
  console.log('--- Scanning for System Changes ---');

  // Ensure 'type' column exists on updates table
  try { await db.execute("ALTER TABLE updates ADD COLUMN type TEXT DEFAULT 'system'"); } catch (e) {}
  const currentFiles = getFiles(path.join(__dirname, '..'));

  let oldManifest = {};
  if (fs.existsSync(manifestPath)) {
    oldManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  }

  const changedFiles = [];
  currentFiles.forEach(f => {
    if (!oldManifest[f.name] || oldManifest[f.name] < f.mtime) {
      changedFiles.push(path.relative(path.join(__dirname, '..'), f.name));
    }
  });

  if (changedFiles.length === 0) {
    console.log('No changes detected.');
    return;
  }

  console.log('Changes detected in:', changedFiles.join(', '));

  // 1. Always prepare to save the new manifest so we don't get stuck in a loop if AI fails
  const saveManifest = () => {
    const newManifest = {};
    currentFiles.forEach(f => newManifest[f.name] = f.mtime);
    fs.writeFileSync(manifestPath, JSON.stringify(newManifest, null, 2));
    console.log('Manifest updated successfully.');
  };

  // 2. Attempt AI auto-logging (Optional/Non-blocking)
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `I am an AI developer. I just modified the following files in this science video website project:
${changedFiles.join('\n')}

Based on the filenames, what kind of system-level updates or new features were likely implemented?
CRITICAL: Generate a TECHNICAL summary for the website's "Updates" section.

REQUIREMENTS:
1. Identify the core system component being updated (Infrastructure, Documentation, Watchdog, AI, etc.)
2. You MUST include a concise bullet-point list of the specific files changed in the "body" and "bodyVi".
3. Use a professional, technical tone.

Examples of system-level updates:
- AI engine improvements, automation mechanisms, rating mechanisms
- UI/UX redesign, responsive layout changes, theme updates
- Database optimization, performance upgrades, caching strategies
- Security updates, authentication changes
- Deployment configuration changes (vercel.json, package.json)
- Documentation updates (AGENTS.md, GEMINI.md, handover guides)
- Content management system improvements or new automation scripts

DO NOT generate updates about:
- Adding new videos, projects, or individual science experiments
- Translating content for specific projects
- Personal notes or announcements about specific videos

Create a professional "Technical Update" entry.
Return ONLY a JSON object with: 
{ "title": "...", "body": "...", "titleVi": "...", "bodyVi": "...", "isSystem": true }
If the changes appear to be ONLY about adding project-specific content (not system-level), set "isSystem": false.`;

  try {
    const result = await callWithRetry(() => model.generateContent(prompt, { timeout: 15000 }));
    const text = result.response.text().trim().replace(/```json|```/g, '');
    const news = JSON.parse(text);

    console.log('AI Generated News:', news.title);

    // Guard: reject non-system updates
    if (news.isSystem === false) {
      console.log('Skipped — generated content is project-specific, not a system update.');
      return;
    }

    // Guard: skip if an identical title exists from today
    const recent = await db.execute({
      sql: "SELECT id, title FROM updates WHERE postedAt > datetime('now', '-1 day') AND title = ? LIMIT 1",
      args: [news.title]
    });
    
    if (recent.rows.length > 0) {
      console.log(`Skipped — identical entry exists from today: "${recent.rows[0].title}"`);
    } else {
      await db.execute({
        sql: "INSERT INTO updates (title, body, postedAt, titleVi, bodyVi, type) VALUES (?, ?, ?, ?, ?, 'system')",
        args: [news.title, news.body, new Date().toISOString(), news.titleVi, news.bodyVi]
      });
      console.log('System update auto-logged to database.');
    }
  } catch (err) {
    console.error('AI auto-log failed:', err.message);
    // Fallback: insert generic update entry directly (bypass AI)
    const changedSummary = changedFiles.slice(0, 5).join(', ') + (changedFiles.length > 5 ? '...' : '');
    const fallbackTitle = 'System files updated';
    const fallbackBody = `Automatically detected changes in: ${changedSummary}`;
    const fallbackTitleVi = 'Cập nhật file hệ thống';
    const fallbackBodyVi = `Tự động phát hiện thay đổi trong: ${changedSummary}`;
    try {
      const recent = await db.execute({
        sql: "SELECT id, title FROM updates WHERE postedAt > datetime('now', '-1 day') AND title = ? LIMIT 1",
        args: [fallbackTitle]
      });
      if (recent.rows.length > 0) {
        console.log(`Fallback skipped — identical entry exists from today: "${recent.rows[0].title}"`);
      } else {
        await db.execute({
          sql: "INSERT INTO updates (title, body, postedAt, titleVi, bodyVi, type) VALUES (?, ?, ?, ?, ?, 'system')",
          args: [fallbackTitle, fallbackBody, new Date().toISOString(), fallbackTitleVi, fallbackBodyVi]
        });
        console.log('Fallback system update logged directly to database.');
      }
    } catch (dbErr) {
      console.error('Fallback insert also failed:', dbErr.message);
    }
  } finally {
    // 3. Finalize manifest sync regardless of AI success
    saveManifest();
  }
}

run();
