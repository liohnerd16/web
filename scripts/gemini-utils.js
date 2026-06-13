/**
 * Shared Gemini utility: retry wrapper + model name
 */
const MODEL = 'gemini-3.5-flash';

async function callWithRetry(fn, retries = 2, delay = 2000) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = err.message?.includes('503') || err.message?.includes('429') || err.message?.includes('500');
      if (i < retries && isRetryable) {
        console.log(`Gemini call failed (${err.message}), retrying in ${delay}ms... (attempt ${i + 1}/${retries})`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
}

module.exports = { MODEL, callWithRetry };
