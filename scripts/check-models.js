require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
  try {
    const modelList = await genAI.getGenerativeModel({ model: "gemini-3.5-flash" }).listModels();
    console.log(modelList);
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}
listModels();
