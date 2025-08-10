// This agent reads notices.json, sends the data to Gemini AI SDK, and formats the output in a fixed JSON format.

const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/genai');

// Load your Gemini API key from environment or config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

// Read the scraped data
const rawData = fs.readFileSync('notices.json', 'utf-8');
const notices = JSON.parse(rawData);

// Define the fixed output format
const formatPrompt = `Format the following array of arrays into a JSON array of objects with keys: date, subject, published_by.\nInput: ${JSON.stringify(notices)}\nOutput format: [ { "date": "...", "subject": "...", "published_by": "..." }, ... ]`;

async function formatNotices() {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(formatPrompt);
    const text = result.response.text();
    let formatted;
    try {
        formatted = JSON.parse(text);
    } catch (_e) {
        formatted = text;
    }
    fs.writeFileSync('notices_formatted.json', typeof formatted === 'string' ? formatted : JSON.stringify(formatted, null, 2), 'utf-8');
    console.log('Formatted notices saved to notices_formatted.json');
}

formatNotices();
