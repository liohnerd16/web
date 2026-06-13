const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { callWithRetry } = require('./gemini-utils');

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GEMINI_MODEL = 'gemini-3.5-flash';

let groq = null;
let genAI = null;

function getGroq() {
  if (!groq) {
    groq = new OpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

function getGemini() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return genAI;
}

async function groqGenerate(prompt, json = true) {
  const client = getGroq();
  const messages = [{ role: 'user', content: prompt }];
  const opts = { model: GROQ_MODEL, messages, temperature: 0.3 };
  if (json) opts.response_format = { type: 'json_object' };
  const completion = await callWithRetry(() => client.chat.completions.create(opts));
  const text = completion.choices[0].message.content;
  if (json) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Groq: khong the parse JSON.\n' + text.slice(0, 200));
    return JSON.parse(match[0]);
  }
  return text;
}

async function geminiGenerate(prompt) {
  const model = getGemini().getGenerativeModel({ model: GEMINI_MODEL });
  const result = await callWithRetry(() => model.generateContent(prompt));
  return (await result.response).text();
}

async function geminiGenerateJSON(prompt) {
  const text = await geminiGenerate(prompt);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Gemini: khong the parse JSON.\n' + text.slice(0, 200));
  return JSON.parse(match[0]);
}

async function fetchYoutubeMetadata(url) {
  try {
    const u = new URL(url);
    let videoId = null;
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      if (u.hostname.includes('youtu.be')) videoId = u.pathname.slice(1).split('?')[0];
      else if (u.pathname.startsWith('/embed/')) videoId = u.pathname.split('/')[2];
      else videoId = u.searchParams.get('v');
    }
    if (!videoId) return null;

    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;
    const data = await res.json();

    return {
      title: data.title || null,
      author: data.author_name || null,
      thumbnail: data.thumbnail_url || null
    };
  } catch (err) {
    console.error('oEmbed error:', err.message);
    return null;
  }
}

async function checkUrlSafety(url) {
  const prompt = `Analyze the URL: ${url}
Is this URL safe (no phishing, malware, scams, adult content)?
Is it related to science experiments, DIY, engineering, or education?
Respond JSON only: { "isSafe": boolean, "isRelevant": boolean, "reason": "string" }`;
  try {
    return await groqGenerate(prompt);
  } catch (err) {
    console.error('Groq safety check error:', err.message);
    return { isSafe: true, isRelevant: true, reason: 'Groq unavailable, bypassed' };
  }
}

async function checkScienceContent(title, description, category) {
  const prompt = `Analyze if the following project is related to SCIENCE, TECHNOLOGY, ENGINEERING, or EDUCATION.

Title: "${title}"
Description: "${description}"
Category: "${category}"

Is this a legitimate science project, technology project, DIY engineering project, or educational experiment?
Reject if it is: entertainment only, politics/religion, e-commerce, social media, or completely unrelated content.

Return ONLY JSON: { "isRelevant": boolean, "reason": "string" }`;
  try {
    return await groqGenerate(prompt);
  } catch (err) {
    console.error('Groq science check error:', err.message);
    try {
      return await geminiGenerateJSON(prompt);
    } catch (e) {
      console.error('Gemini fallback also failed:', e.message);
      return { isRelevant: true, reason: 'Validation unavailable, bypassed' };
    }
  }
}

const LATEX_TEMPLATE_EXAMPLE = `\\subsection*{Safety Warning}
Wear safety goggles and gloves when handling materials. Work in a well-ventilated area.

\\subsection*{Scientific Principle}
This project demonstrates the conversion of electrical energy into mechanical motion through electromagnetic induction. When current flows through a coil placed in a magnetic field, a force is generated according to $F = BIL$, causing rotation.

\\subsection*{Diagram}
\\\\includegraphics{data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+PC9zdmc+}

\\subsection*{Materials}
\\\\begin{itemize}
\\\\item Copper wire (22 AWG), 5 meters
\\\\item Neodymium magnet, 10mm diameter
\\\\item 1.5V AA battery
\\\\item Cardboard base, 10x10 cm
\\\\end{itemize}

\\subsection*{Build Steps}
1. Wind the copper wire into a coil of 20 turns around the cardboard.
2. Attach the magnet to the center of the cardboard base.
3. Connect the wire ends to the battery terminals.
4. Observe the coil rotation due to the magnetic force.`;

async function generateContentWithMetadata(meta, url, texContent, existingCats, existingTopics) {
  const realTitle = meta?.title || 'Unknown Project';
  const realAuthor = meta?.author || '';

  const catList = ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Physics & Engineering', 'Robotics & Coding', 'Aviation & Craft', 'Electronics'];
  const allCats = [...new Set([...catList, ...(existingCats || [])])];
  const topicHint = existingTopics?.length ? ` If the project fits one of these existing topics, use it: [${existingTopics.join(', ')}]. If it does not fit any existing topic, set topic to null.` : ' Set topic to null (do not create a new one unless it is part of a very well-known broad series).';

  const prompt = `You are a science education expert. Based on the REAL video metadata below, create accurate project documentation.

Video URL: ${url}
Real Title: "${realTitle}"
Channel: "${realAuthor}"
${texContent ? `User-provided LaTeX base: ${texContent}` : ''}

Create a JSON object with these EXACT fields:
- title: English title (use the real title, adapt to be descriptive for a science project)
- description: 1-2 sentence English summary of what this project does
- category: ONE from [${allCats.join(', ')}]
- topic: ${topicHint}
- topicVi: same topic in Vietnamese (null if topic is null)
- explanation: complete English LaTeX with these 5 sections
- explanationVi: complete Vietnamese LaTeX (translate explanation faithfully)
- referenceLinks: array of {label, url} with 1-2 relevant science references

LATEX FORMAT RULES (CRITICAL - follow exactly):
- Each section starts with \\\\subsection*{Title} on its own line
- Use \\\\begin{itemize} and \\\\end{itemize} for material lists
- Each list item: \\\\item Text here
- Use $$...$$ for display math, $...$ for inline math
- Diagram: \\\\includegraphics{data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJyZWQiIC8+PC9zdmc+}
- Simple paragraph text between sections (no \\\\ needed for paragraphs)

REQUIRED SECTIONS in order:
1. Safety Warning
2. Scientific Principle  
3. Diagram
4. Materials
5. Build Steps

EXAMPLE of correct format:
${LATEX_TEMPLATE_EXAMPLE}

CRITICAL: Base ALL content on the REAL video title "${realTitle}". Do not invent projects or use unrelated content. If the title describes a specific project, document THAT project.`;

  return await groqGenerate(prompt);
}

async function translateToVietnamese(data) {
  const prompt = `Translate the following science project from English to Vietnamese.
Keep ALL LaTeX commands unchanged (do NOT translate \\\\subsection*, \\\\item, \\\\includegraphics, $$, $, etc).
Only translate the human-readable text between LaTeX commands.

Input:
${JSON.stringify(data, null, 2)}

Return ONLY JSON:
{ "titleVi": "...", "descriptionVi": "...", "explanationVi": "...", "topicVi": "..." }`;
  try {
    return await geminiGenerateJSON(prompt);
  } catch (err) {
    console.error('Gemini translate error:', err.message);
    return {
      titleVi: data.title || '',
      descriptionVi: data.description || '',
      explanationVi: data.explanation || '',
      topicVi: data.topic || ''
    };
  }
}

async function fallbackGenerateAll(url, texContent, existingCats, existingTopics) {
  const meta = await fetchYoutubeMetadata(url);
  const realTitle = meta?.title || 'Unknown';

  const catHint = existingCats?.length ? ` Prefer from existing categories if applicable: [${existingCats.join(', ')}].` : '';
  const topicHint = existingTopics?.length ? ` Prefer from existing topics if applicable: [${existingTopics.join(', ')}]. Create a new topic only if none fits.` : '';

  const prompt = `You are a science education expert. Based on the video URL and real title, create project documentation.

Video URL: ${url}
Real Title: "${realTitle}"
${texContent ? `Base LaTeX: ${texContent}` : ''}

Create a JSON:
- title (English), titleVi (Vietnamese)
- description (English), descriptionVi (Vietnamese)
- category${catHint}
- topic${topicHint}
- topicVi (same as topic in Vietnamese)
- explanation (English LaTeX), explanationVi (Vietnamese LaTeX)
- referenceLinks (array of {label, url})

LaTeX sections: Safety Warning, Scientific Principle, Diagram, Materials, Build Steps
Use \\\\subsection*{...} for sections, \\\\begin{itemize}/\\\\end{itemize} for lists

CRITICAL: Base content on the real title "${realTitle}". DO NOT affiliateLinks.`;

  try {
    return await geminiGenerateJSON(prompt);
  } catch (err) {
    throw new Error('Fallback AI cung that bai: ' + err.message);
  }
}

async function hybridGenerate(url, texContent, existingCats, existingTopics) {
  const meta = await fetchYoutubeMetadata(url);
  if (meta) console.log('oEmbed title:', meta.title);

  let groqOk = true;
  let content;

  try {
    content = await generateContentWithMetadata(meta, url, texContent, existingCats, existingTopics);
  } catch (err) {
    console.error('Groq generation failed, falling back to Gemini:', err.message);
    groqOk = false;
    content = await fallbackGenerateAll(url, texContent, existingCats, existingTopics);
    content.affiliateLinks = [];
    return content;
  }

  if (groqOk) {
    try {
      const vi = await translateToVietnamese(content);
      content.titleVi = vi.titleVi || content.title;
      content.descriptionVi = vi.descriptionVi || content.description;
      content.explanationVi = vi.explanationVi || content.explanation;
      content.topicVi = vi.topicVi || content.topic || null;
    } catch (err) {
      console.error('Gemini translate failed:', err.message);
    }
  }

  content.affiliateLinks = [];
  return content;
}

async function suggestCommonTopic(newProject, lonelyProjects) {
  if (!lonelyProjects || lonelyProjects.length === 0) return null;

  const projectsStr = lonelyProjects.map(p => `- ID ${p.id}: "${p.title}" (${p.description})`).join('\n');
  const prompt = `You are a science taxonomist. I have a new project and a list of existing projects that currently have NO topic. 
Check if the new project should share a common scientific topic with ANY of the existing projects.

New Project: "${newProject.title}" (${newProject.description})

Existing Projects (without topics):
${projectsStr}

If the new project matches one or more existing projects under a shared scientific principle or series (e.g., "Electromagnetic Induction", "Acid-Base Reactions"), provide a concise Topic name.
Return ONLY JSON: { "matchFound": boolean, "matchedIds": [number], "topic": "English Topic", "topicVi": "Vietnamese Topic" }
If no clear match, set matchFound to false and topic to null.`;

  try {
    return await geminiGenerateJSON(prompt);
  } catch (err) {
    console.error('Topic suggestion failed:', err.message);
    return null;
  }
}

module.exports = { checkUrlSafety, checkScienceContent, hybridGenerate, fallbackGenerateAll, groqGenerate, geminiGenerateJSON, geminiGenerate, fetchYoutubeMetadata, suggestCommonTopic };