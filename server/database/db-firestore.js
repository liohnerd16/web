/**
 * Firebase Firestore Database Layer
 * Replaces Turso/LibSQL with Firestore for cloud deployment
 */
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
let db = null;
let isInitialized = false;

function initializeFirebase() {
  if (isInitialized) return db;
  
  try {
    // Check if running in Cloud Functions environment
    if (process.env.FUNCTIONS_RUNTIME) {
      admin.initializeApp();
    } else {
      // Local development - use service account key
      const serviceAccount = require('./firebase-service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    
    db = admin.firestore();
    isInitialized = true;
    console.log('Firebase Firestore initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    return initializeFirebase();
  }
  return db;
}

let initPromise = null;

/**
 * Initialize Firestore Collections and Indexes
 * Creates necessary collections if they don't exist
 */
async function initDb() {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    console.log('Initializing Firestore Collections...');
    try {
      const database = getDb();
      
      // Firestore creates collections automatically on first write
      // We just need to ensure the structure is correct
      
      // Create initial documents to establish collections
      const collections = [
        'videos',
        'comments',
        'updates',
        'users',
        'notifications',
        'ratings'
      ];
      
      // Verify collections are accessible
      for (const collection of collections) {
        const snapshot = await database.collection(collection).limit(1).get();
        console.log(`Collection '${collection}' is ready`);
      }
      
      console.log('Firestore Database Ready.');
      return db;
    } catch (err) {
      console.error('Firestore Initialization Error:', err);
      initPromise = null;
      throw err;
    }
  })();
  
  return initPromise;
}

/**
 * Helper function to convert Firestore document to plain object with ID
 */
function docToObj(doc) {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * Helper function to query with limit and offset
 * Firestore doesn't support offset directly, so we use startAfter
 */
async function queryWithPagination(collection, queryFn, limitCount, offsetCount) {
  const database = getDb();
  let query = database.collection(collection);
  
  if (queryFn) {
    query = queryFn(query);
  }
  
  // Handle offset by skipping documents
  if (offsetCount > 0) {
    const snapshot = await query.limit(offsetCount).get();
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }
  }
  
  return query.limit(limitCount).get();
}

module.exports = {
  db: null, // Will be set by getDb()
  getDb,
  initDb,
  initializeFirebase,
  docToObj,
  queryWithPagination
};
