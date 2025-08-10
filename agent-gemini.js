import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Load your Gemini API key from environment or config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyC8nH8h04EFA8uyK-BfPIHowCJA2uZHly8";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Read the scraped data
const rawData = fs.readFileSync('notices.json', 'utf-8');
const notices = JSON.parse(rawData);

// Define the fixed output format
const formatPrompt = `Format the following array of arrays into a JSON array of objects with keys: date, subject, published_by.\nInput: ${JSON.stringify(notices)}\nOutput format: [ { "date": "...", "subject": "...", "published_by": "..." }, ... ]`;

async function formatNotices() {
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formatPrompt,
    });
    const text = result.text;
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
