const express = require('express');
const { getDb, initDb } = require('../database/db-firestore');
const auth = require('../middleware/auth');

const router = express.Router();

const latexFallback = require('../database/latex-content.json');

function resolveContent(row, lang) {
  const raw = lang === 'vi' ? row.explanationViRaw : row.explanationRaw;
  if (raw && raw.endsWith('.tex') && latexFallback[row.title]) {
    const entry = latexFallback[row.title];
    return lang === 'vi' ? (entry.vi || entry.en) : (entry.en || entry.vi);
  }
  return raw || null;
}

function parseVideoDoc(docData, docId, includeExplanation = false) {
  const row = { id: docId, ...docData };
  const result = {
    ...row,
    imageUrls: row.imageUrls || [],
    referenceLinks: row.referenceLinks || [],
    affiliateLinks: row.affiliateLinks || []
  };
  if (includeExplanation) {
    result.explanationContent = resolveContent(row, 'en');
    result.explanationViContent = resolveContent(row, 'vi');
  }
  // Always include raw fields for detail view
  if (!includeExplanation) {
    delete result.explanationRaw;
    delete result.explanationViRaw;
  }
  return result;
}

/** GET /api/videos — optional ?q= &category= &sort= */
router.get('/', async (req, res) => {
  try {
    await initDb();
    const db = getDb();
    
    const q = (req.query.q || '').trim().toLowerCase();
    const cat = (req.query.category || '').trim();
    const topic = (req.query.topic || '').trim();
    const sort = (req.query.sort || 'newest').trim();
    const limit = req.query.limit !== undefined ? (parseInt(req.query.limit) || 0) : 12;
    const offset = parseInt(req.query.offset) || 0;

    let query = db.collection('videos');

    // Apply filters
    if (cat) {
      query = query.where('category', '==', cat);
    }
    if (topic) {
      query = query.where('topic', '==', topic);
    }
    
    // Apply sorting
    if (sort === 'oldest') {
      query = query.orderBy('id', 'asc');
    } else if (sort === 'title') {
      query = query.orderBy('title', 'asc');
    } else if (sort === 'top-rated') {
      query = query.orderBy('avgRating', 'desc').orderBy('ratingCount', 'desc');
    } else {
      query = query.orderBy('id', 'desc');
    }

    // Handle pagination
    let snapshot;
    if (offset > 0 && limit > 0) {
      // Get documents to skip
      const skipQuery = db.collection('videos');
      // Note: For complex queries with offset, we need to replicate the same filters
      let skipQ = skipQuery;
      if (cat) skipQ = skipQ.where('category', '==', cat);
      if (topic) skipQ = skipQ.where('topic', '==', topic);
      if (sort === 'oldest') skipQ = skipQ.orderBy('id', 'asc');
      else if (sort === 'title') skipQ = skipQ.orderBy('title', 'asc');
      else if (sort === 'top-rated') skipQ = skipQ.orderBy('avgRating', 'desc').orderBy('ratingCount', 'desc');
      else skipQ = skipQ.orderBy('id', 'desc');
      
      const skipSnapshot = await skipQuery.limit(offset).get();
      if (!skipSnapshot.empty) {
        const lastDoc = skipSnapshot.docs[skipSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
      snapshot = await query.limit(limit).get();
    } else if (limit > 0) {
      snapshot = await query.limit(limit).get();
    } else {
      snapshot = await query.get();
    }

    const videos = snapshot.docs.map(doc => parseVideoDoc(doc.data(), doc.id, false));

    // Get total count for pagination info
    let countQuery = db.collection('videos');
    if (cat) countQuery = countQuery.where('category', '==', cat);
    if (topic) countQuery = countQuery.where('topic', '==', topic);
    
    const countSnapshot = await countQuery.get();
    const total = countSnapshot.size;

    res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json({ ok: true, videos, total, limit, offset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load videos' });
  }
});

/** GET /api/videos/manage — user's videos (admin: all) */
router.get('/manage', auth, async (req, res) => {
  try {
    await initDb();
    const db = getDb();
    const isAdmin = req.user.role === 'admin';
    
    let query;
    if (isAdmin) {
      query = db.collection('videos').orderBy('id', 'desc');
    } else {
      query = db.collection('videos')
        .where('submittedBy', '==', req.user.id)
        .orderBy('id', 'desc');
    }
    
    const snapshot = await query.get();
    const videos = snapshot.docs.map(doc => parseVideoDoc(doc.data(), doc.id, true));
    
    res.json({ ok: true, videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load manage list' });
  }
});

/** PUT /api/videos/:id — edit video */
router.put('/:id', auth, async (req, res) => {
  try {
    await initDb();
    const db = getDb();
    const { title, titleVi, description, descriptionVi, category, categoryVi, topic, topicVi, explanation, explanationVi, explanationRaw, explanationViRaw, seriesTitle, seriesTitleVi, partNumber, imageUrls } = req.body;
    
    const docRef = db.collection('videos').doc(req.params.id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }
    
    const video = { id: docSnap.id, ...docSnap.data() };
    
    if (req.user.role !== 'admin' && Number(video.submittedBy) !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    
    await docRef.update({
      title,
      titleVi,
      description,
      descriptionVi,
      category,
      categoryVi,
      topic,
      topicVi,
      explanation,
      explanationVi,
      explanationRaw,
      explanationViRaw,
      seriesTitle,
      seriesTitleVi,
      partNumber,
      imageUrls: imageUrls || []
    });
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to update' });
  }
});

/** GET /api/videos/:id — single video with full details */
router.get('/:id', async (req, res) => {
  try {
    await initDb();
    const db = getDb();
    const docRef = db.collection('videos').doc(req.params.id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }
    
    res.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.json({ ok: true, video: parseVideoDoc(docSnap.data(), docSnap.id, true) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to load video' });
  }
});

/** DELETE /api/videos/:id — delete video */
router.delete('/:id', auth, async (req, res) => {
  try {
    await initDb();
    const db = getDb();
    const docRef = db.collection('videos').doc(req.params.id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }
    
    const video = { id: docSnap.id, ...docSnap.data() };
    
    if (req.user.role !== 'admin' && Number(video.submittedBy) !== req.user.id) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    
    // Delete video
    await docRef.delete();
    
    // Delete related comments
    const commentsSnapshot = await db.collection('comments')
      .where('videoId', '==', Number(req.params.id))
      .get();
    
    const batch = db.batch();
    commentsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    // Delete related ratings
    const ratingsSnapshot = await db.collection('ratings')
      .where('videoId', '==', Number(req.params.id))
      .get();
    
    const ratingsBatch = db.batch();
    ratingsSnapshot.docs.forEach(doc => ratingsBatch.delete(doc.ref));
    await ratingsBatch.commit();
    
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to delete' });
  }
});

module.exports = router;
