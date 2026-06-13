const { onRequest } = require("firebase-functions/v2/https");
const app = require("./server/server");

// Export the Express server as a Firebase Cloud Function
exports.api = onRequest({ cors: true }, app);
