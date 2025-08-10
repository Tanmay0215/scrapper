// index.js
// This file provides a simple CLI to run either ims-scrapper.js or agent-gemini.js

import { scrapeNotices } from './ims-scrapper.js';
import { formatNotices } from './agent-gemini.js';

async function main() {
    console.log('Starting IMS scrapper...');
    const notices = await scrapeNotices();
    console.log(`Scraped ${notices.length} notices.`);

    console.log('Starting Gemini formatter...');
    const formatted = await formatNotices(notices);
    if (Array.isArray(formatted)) {
        console.log(`Formatted ${formatted.length} notices.`);
    } else {
        console.log('Formatted notices (raw):', formatted);
    }

    console.log('Final output JSON:');
    console.log(JSON.stringify(formatted, null, 2));
}

main();
