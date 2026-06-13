const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { db, initDb } = require('../database/db');
const fs = require('fs').promises;
const path = require('path');
const { checkUrlSafety, checkScienceContent, hybridGenerate, fallbackGenerateAll, geminiGenerateJSON, suggestCommonTopic } = require('../../scripts/ai-providers');

const CAT_VI_MAP = {
  'Physics': 'Vật lý', 'Chemistry': 'Hóa học', 'Biology': 'Sinh học',
  'Environmental Science': 'Khoa học Môi trường', 'Physics & Engineering': 'Vật lý & Kỹ thuật',
  'Robotics & Coding': 'Robot & Lập trình', 'Aviation & Craft': 'Hàng không & Thủ công',
  'Electronics': 'Điện tử', 'Thermodynamics': 'Nhiệt động lực học'
};

function fuzzyMatch(value, list) {
  if (!value || !list || !list.length) return null;
  const vl = value.toLowerCase().trim();
  const exact = list.find(e => e && e.toLowerCase().trim() === vl);
  if (exact) return exact;
  const partial = list.find(e => e && (e.toLowerCase().includes(vl) || vl.includes(e.toLowerCase())));
  if (partial) return partial;
  return null;
}




router.post('/add-content', auth, async (req, res) => {
  const { videoUrl, texContent, texContentVi, seriesTitle, partNumber, submissionMode, title, titleVi, description, descriptionVi, category, affiliateLinksRaw } = req.body;

  if (!videoUrl || !videoUrl.startsWith('http')) {
    return res.status(400).json({ ok: false, error: 'Valid URL is required' });
  }

  try {
    await initDb();
    const existingCats = (await db.execute('SELECT DISTINCT category FROM videos WHERE category IS NOT NULL AND category != ?', [''])).rows.map(r => r.category);
    const existingTopics = (await db.execute('SELECT DISTINCT topic FROM videos WHERE topic IS NOT NULL AND topic != ?', [''])).rows.map(r => r.topic);

    const safety = await checkUrlSafety(videoUrl);
    if (!safety.isSafe || !safety.isRelevant) {
      return res.status(400).json({ ok: false, error: 'Submission rejected: ' + (safety.reason || 'URL is not safe or not science-related.') });
    }

    let projectData = {};
    let imageUrls = [];
    let matchedLonelyIds = [];

    if (submissionMode === 'manual') {
      let finalTitle = title;
      let finalTitleVi = titleVi;
      let finalDesc = description;
      let finalDescVi = descriptionVi;
      let finalTopic = req.body.topic;
      let finalTopicVi = req.body.topicVi;
      let finalTex = texContent;
      let finalTexVi = texContentVi;

      const needsTranslation = (!finalTitle || !finalTitleVi || !finalDesc || !finalDescVi || (finalTopic && !finalTopicVi) || (!finalTopic && finalTopicVi) || (finalTex && !finalTexVi) || (!finalTex && finalTexVi));
      
      if (needsTranslation && process.env.GOOGLE_API_KEY) {
        try {
          const translatePrompt = `Translate science project metadata and LaTeX explanation. 
If a field is provided, keep it. If missing, translate from the other language.
For LaTeX, keep ALL commands (\\subsection, \\item, etc.) unchanged.

Inputs:
- title: ${finalTitle || ''}
- titleVi: ${finalTitleVi || ''}
- description: ${finalDesc || ''}
- descriptionVi: ${finalDescVi || ''}
- category: ${req.body.category || ''}
- categoryVi: (will be translated if missing)
- seriesTitle: ${req.body.seriesTitle || ''}
- seriesTitleVi: (will be translated if missing)
- topic: ${finalTopic || ''}
- topicVi: ${finalTopicVi || ''}
- tex: ${finalTex || ''}
- texVi: ${finalTexVi || ''}

Return ONLY JSON: { "title": "...", "titleVi": "...", "description": "...", "descriptionVi": "...", "category": "...", "categoryVi": "...", "seriesTitle": "...", "seriesTitleVi": "...", "topic": "...", "topicVi": "...", "tex": "...", "texVi": "..." }`;
          
          const translated = await geminiGenerateJSON(translatePrompt);
          finalTitle = translated.title || finalTitle;
          finalTitleVi = translated.titleVi || finalTitleVi;
          finalDesc = translated.description || finalDesc;
          finalDescVi = translated.descriptionVi || finalDescVi;
          finalTopic = translated.topic || finalTopic;
          finalTopicVi = translated.topicVi || finalTopicVi;
          finalTex = translated.tex || finalTex;
          finalTexVi = translated.texVi || finalTexVi;
        } catch (e) { console.error('Manual translate error:', e.message); }
      }

      finalTexVi = finalTexVi || finalTex;
      finalTex = finalTex || finalTexVi;

      if (!finalTitle || !finalTitleVi || !finalDesc || !finalDescVi || !category || !finalTex) {
        return res.status(400).json({ ok: false, error: 'Missing required content even after translation attempt.' });
      }

      const manualAffiliates = (affiliateLinksRaw || '').split('\n').filter(line => line.includes('|')).map(line => {
        const [name, url] = line.split('|').map(s => s.trim());
        return { name, links: [{ label: 'Buy Now', url }] };
      });

      projectData = {
        title: finalTitle, titleVi: finalTitleVi,
        description: finalDesc, descriptionVi: finalDescVi,
        category, topic: finalTopic || null, topicVi: finalTopicVi || null,
        explanation: finalTex, explanationVi: finalTexVi,
        affiliateLinks: manualAffiliates,
        referenceLinks: []
      };
      // Normalize manual input to existing DB values
      const normCat = fuzzyMatch(category, existingCats);
      if (normCat) projectData.category = normCat;
    } else {
      projectData = await hybridGenerate(videoUrl, texContent, existingCats, existingTopics);
      // Normalize AI output to existing DB values
      const normCat = fuzzyMatch(projectData.category, existingCats);
      if (normCat) projectData.category = normCat;
      
      // Parse affiliate links (same as manual mode)
      const aiAffiliates = (affiliateLinksRaw || '').split('\n').filter(line => line.includes('|')).map(line => {
        const [name, url] = line.split('|').map(s => s.trim());
        return { name, links: [{ label: 'Buy Now', url }] };
      });
      if (aiAffiliates.length > 0) projectData.affiliateLinks = aiAffiliates;
    }

    // --- SHARED NORMALIZATION & SMART TOPIC CLUSTERING ---
    const normTopic = fuzzyMatch(projectData.topic || req.body.topic, existingTopics);
    if (normTopic) projectData.topic = normTopic;

    if (!projectData.topic) {
      try {
        const lonelyVideos = (await db.execute({
          sql: 'SELECT id, title, description FROM videos WHERE category = ? AND (topic IS NULL OR topic = "") LIMIT 10',
          args: [projectData.category]
        })).rows;

        if (lonelyVideos.length > 0) {
          const suggestion = await suggestCommonTopic(projectData, lonelyVideos);
          if (suggestion && suggestion.matchFound && suggestion.topic) {
            projectData.topic = suggestion.topic;
            projectData.topicVi = suggestion.topicVi || suggestion.topic;
            matchedLonelyIds = suggestion.matchedIds || [];
            console.log(`Smart Topic: Grouping project with existing IDs [${matchedLonelyIds.join(', ')}] under topic "${projectData.topic}"`);
          }
        }
      } catch (e) { console.error('Smart Clustering Error:', e.message); }
    }
    // -----------------------------------------------------

    // Science/tech content validation for both modes
    const relevanceCheck = await checkScienceContent(
      projectData.title,
      projectData.description,
      projectData.category
    );
    if (!relevanceCheck.isRelevant) {
      return res.status(400).json({
        ok: false,
        error: 'Submission rejected: Only science and technology projects are allowed. ' + (relevanceCheck.reason || '')
      });
    }

    let processedTex = projectData.explanation;
    let processedTexVi = projectData.explanationVi || projectData.explanation;

    // Strip inline base64 SVG diagrams — replaced with encourage label
    const b64SvgRe = /\\includegraphics(?:\s*\[[^\]]*\])?\s*\{data:image\/svg\+xml;base64,[^}]+\}/g;
    const encLabel = '{\\textit{[Replace with your own diagram — use Edit to add images.]}}';
    const encLabelVi = '{\\textit{[Thay thế bằng hình ảnh của bạn — dùng Chỉnh sửa để tải lên.]}}';
    processedTex = processedTex.replace(b64SvgRe, encLabel);
    processedTexVi = processedTexVi.replace(b64SvgRe, encLabelVi);

    if (!projectData.categoryVi && projectData.category) {
      projectData.categoryVi = CAT_VI_MAP[projectData.category] || projectData.category;
    }
    if (!projectData.seriesTitleVi && projectData.seriesTitle) {
      projectData.seriesTitleVi = projectData.seriesTitle;
    }
    const catVi = projectData.categoryVi || (projectData.category ? CAT_VI_MAP[projectData.category] : null) || null;
    const seriesVi = req.body.seriesTitleVi || projectData.seriesTitleVi || null;

    const baseFileName = projectData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);
    const enTexPath = path.join(__dirname, '..', '..', 'public', 'explanations', `${baseFileName}-en.tex`);
    const viTexPath = path.join(__dirname, '..', '..', 'public', 'explanations', `${baseFileName}.tex`);

    try { await fs.writeFile(enTexPath, processedTex); } catch (e) { console.log('Cannot write EN tex (Vercel readonly):', e.message); }
    try { await fs.writeFile(viTexPath, processedTexVi); } catch (e) { console.log('Cannot write VI tex (Vercel readonly):', e.message); }

    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      embedUrl = videoUrl.replace('watch?v=', 'embed/').split('&')[0];
    } else if (videoUrl.includes('vimeo.com')) {
      const vimeoId = videoUrl.split('/').pop();
      embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
    }

    const insertResult = await db.execute({
      sql: `INSERT INTO videos
            (title, description, embedUrl, category, categoryVi, topic, topicVi, explanation, imageUrls, referenceLinks, affiliateLinks, seriesTitle, seriesTitleVi, partNumber, titleVi, descriptionVi, explanationVi, explanationRaw, explanationViRaw, submittedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        projectData.title, projectData.description, embedUrl, projectData.category,
        catVi,
        projectData.topic || null, projectData.topicVi || null,
        `${baseFileName}-en.tex`, JSON.stringify(imageUrls),
        JSON.stringify(projectData.referenceLinks || []), JSON.stringify(projectData.affiliateLinks || []),
        seriesTitle || null, seriesVi, partNumber || null,
        projectData.titleVi, projectData.descriptionVi, `${baseFileName}.tex`,
        processedTex, processedTexVi,
        req.user.id
      ]
    });

    // Retroactive update for lonely projects
    if (matchedLonelyIds && matchedLonelyIds.length > 0) {
      for (const oldId of matchedLonelyIds) {
        await db.execute({
          sql: 'UPDATE videos SET topic = ?, topicVi = ? WHERE id = ?',
          args: [projectData.topic, projectData.topicVi, oldId]
        });
      }
    }

    const notifTitle = submissionMode === 'manual' ? 'Project Posted' : 'Content Added Successfully';
    const notifTitleVi = submissionMode === 'manual' ? 'Dự án đã được đăng' : 'Nội dung đã được thêm thành công';
    const notifMessage = `Your project "${projectData.title}" has been added.`;
    const notifMessageVi = `Dự án "${projectData.title}" của bạn đã được thêm.`;
    await db.execute({
      sql: 'INSERT INTO notifications (userId, title, titleVi, message, messageVi, type, createdAt, videoId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        req.user.id,
        notifTitle, notifTitleVi, notifMessage, notifMessageVi,
        'success', new Date().toISOString(),
        Number(insertResult.lastInsertRowid) || null
      ]
    });

    res.json({ ok: true, message: 'Content added successfully', videoId: Number(insertResult.lastInsertRowid) });

  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('SAFETY')) {
      res.status(500).json({ ok: false, error: 'Noi dung bi tu choi boi bo loc an toan AI. Vui long thu lai.' });
    } else if (msg.includes('API_KEY') || msg.includes('API key') || msg.includes('not found') || msg.includes('401') || msg.includes('403')) {
      console.error('AI Auth Error:', err);
      res.status(500).json({ ok: false, error: 'Loi xac thuc AI: ' + msg.slice(0, 150) });
    } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('quota') || msg.includes('429') || msg.includes('503')) {
      console.error('AI Network/Quota Error:', err);
      res.status(500).json({ ok: false, error: 'Loi mang hoac vuot quota AI: ' + msg.slice(0, 150) });
    } else {
      console.error(err);
      res.status(500).json({ ok: false, error: 'Xu ly that bai: ' + msg.slice(0, 200) });
    }
  }
});

/** POST /api/ai/translate-fields — translate missing bilingual fields for edit form */
router.post('/translate-fields', auth, async (req, res) => {
  const { title, titleVi, description, descriptionVi, topic, topicVi, explanation, explanationVi, category, categoryVi, seriesTitle, seriesTitleVi } = req.body;

  const hasMissing = !title || !titleVi || !description || !descriptionVi ||
    (category && !categoryVi) || (!category && categoryVi) ||
    (seriesTitle && !seriesTitleVi) || (!seriesTitle && seriesTitleVi) ||
    (topic && !topicVi) || (!topic && topicVi) ||
    (explanation && !explanationVi) || (!explanation && explanationVi);

  if (!hasMissing || !process.env.GOOGLE_API_KEY) {
    return res.json({ ok: true, fields: { title, titleVi, description, descriptionVi, topic, topicVi, category, categoryVi, seriesTitle, seriesTitleVi, explanation, explanationVi } });
  }

  try {
    const translatePrompt = `Translate science project metadata and LaTeX explanation.
If a field is provided, keep it. If missing, translate from the other language.
For LaTeX, keep ALL commands (\\subsection, \\item, etc.) unchanged.

Inputs:
- title: ${title || ''}
- titleVi: ${titleVi || ''}
- description: ${description || ''}
- descriptionVi: ${descriptionVi || ''}
- category: ${category || ''}
- categoryVi: ${categoryVi || ''}
- seriesTitle: ${seriesTitle || ''}
- seriesTitleVi: ${seriesTitleVi || ''}
- topic: ${topic || ''}
- topicVi: ${topicVi || ''}
- tex: ${explanation || ''}
- texVi: ${explanationVi || ''}

Return ONLY JSON: { "title": "...", "titleVi": "...", "description": "...", "descriptionVi": "...", "category": "...", "categoryVi": "...", "seriesTitle": "...", "seriesTitleVi": "...", "topic": "...", "topicVi": "...", "tex": "...", "texVi": "..." }`;

    const translated = await geminiGenerateJSON(translatePrompt);
    const fields = {
      title: translated.title || title,
      titleVi: translated.titleVi || titleVi,
      description: translated.description || description,
      descriptionVi: translated.descriptionVi || descriptionVi,
      category: translated.category || category,
      categoryVi: translated.categoryVi || categoryVi,
      seriesTitle: translated.seriesTitle || seriesTitle,
      seriesTitleVi: translated.seriesTitleVi || seriesTitleVi,
      topic: translated.topic || topic,
      topicVi: translated.topicVi || topicVi,
      explanation: translated.tex || explanation,
      explanationVi: translated.texVi || explanationVi
    };
    Object.keys(fields).forEach(k => { if (!fields[k]) fields[k] = req.body[k]; });
    if (!fields.explanationVi) fields.explanationVi = fields.explanation;
    if (!fields.explanation) fields.explanation = fields.explanationVi;
    if (!fields.categoryVi && fields.category) fields.categoryVi = CAT_VI_MAP[fields.category] || fields.category;
    if (!fields.seriesTitleVi && fields.seriesTitle) fields.seriesTitleVi = fields.seriesTitle;

    res.json({ ok: true, fields });
  } catch (e) {
    console.error('translate-fields error:', e.message);
    const fields = { title, titleVi, description, descriptionVi, topic, topicVi, category, categoryVi, seriesTitle, seriesTitleVi, explanation, explanationVi };
    if (!fields.categoryVi && fields.category) fields.categoryVi = CAT_VI_MAP[fields.category] || fields.category;
    if (!fields.seriesTitleVi && fields.seriesTitle) fields.seriesTitleVi = fields.seriesTitle;
    res.json({ ok: true, fields });
  }
});

module.exports = router;
