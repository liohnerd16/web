/**
 * Firestore Database Seeder
 * Migrates data from SQLite to Firestore or seeds initial data
 */
require('dotenv').config();
const { initializeFirebase, getDb, initDb } = require('./database/db-firestore');
const sqliteDb = require('./database/db.js');
const latexFallback = require('./database/latex-content.json');

async function seedFirestore() {
  try {
    console.log('Initializing Firestore...');
    await initDb();
    const db = getDb();
    
    // Check if videos collection already has data
    const existingVideos = await db.collection('videos').limit(1).get();
    if (!existingVideos.empty) {
      console.log('Firestore already contains data. Skipping seed.');
      return;
    }
    
    console.log('Seeding Firestore with sample data...');
    
    // Get data from SQLite
    const sqliteResult = await sqliteDb.execute('SELECT * FROM videos');
    const videos = sqliteResult.rows;
    
    if (videos.length === 0) {
      console.log('No data found in SQLite. Using fallback sample data.');
      // Use fallback data from db.js seed function
      // This would need to be extracted or recreated
    }
    
    // Batch write for efficiency
    const batch = db.batch();
    let count = 0;
    
    for (const video of videos) {
      const docRef = db.collection('videos').doc();
      batch.set(docRef, {
        id: video.id,
        title: video.title,
        description: video.description,
        embedUrl: video.embedUrl,
        category: video.category,
        explanation: video.explanation,
        imageUrls: JSON.parse(video.imageUrls || '[]'),
        referenceLinks: JSON.parse(video.referenceLinks || '[]'),
        affiliateLinks: JSON.parse(video.affiliateLinks || '[]'),
        seriesTitle: video.seriesTitle,
        partNumber: video.partNumber,
        titleVi: video.titleVi,
        descriptionVi: video.descriptionVi,
        explanationVi: video.explanationVi,
        topic: video.topic,
        topicVi: video.topicVi,
        explanationRaw: video.explanationRaw,
        explanationViRaw: video.explanationViRaw,
        categoryVi: video.categoryVi,
        seriesTitleVi: video.seriesTitleVi,
        avgRating: video.avgRating || 0,
        ratingCount: video.ratingCount || 0,
        submittedBy: video.submittedBy
      });
      count++;
      
      // Firestore batch limit is 500 operations
      if (count % 500 === 0) {
        await batch.commit();
        console.log(`Committed ${count} videos...`);
      }
    }
    
    if (count % 500 !== 0) {
      await batch.commit();
    }
    
    console.log(`Successfully seeded ${count} videos to Firestore.`);
    
    // Seed users
    const usersResult = await sqliteDb.execute('SELECT * FROM users');
    const users = usersResult.rows;
    
    if (users.length > 0) {
      const userBatch = db.batch();
      let userCount = 0;
      
      for (const user of users) {
        const docRef = db.collection('users').doc();
        userBatch.set(docRef, {
          id: user.id,
          email: user.email,
          password: user.password,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          resetToken: user.resetToken,
          resetExpires: user.resetExpires
        });
        userCount++;
        
        if (userCount % 500 === 0) {
          await userBatch.commit();
          console.log(`Committed ${userCount} users...`);
        }
      }
      
      if (userCount % 500 !== 0) {
        await userBatch.commit();
      }
      
      console.log(`Successfully seeded ${userCount} users to Firestore.`);
    }
    
    console.log('Firestore seeding complete!');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedFirestore();
}

module.exports = { seedFirestore };
