// index.js
// This file provides a simple CLI to run either ims-scrapper.js or agent-gemini.js

import { execSync } from 'child_process';

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node index.js <ims|gemini>');
    process.exit(1);
}

const scriptMap = {
    ims: 'ims-scrapper.js',
    gemini: 'agent-gemini.js',
};

const script = scriptMap[args[0]];
if (!script) {
    console.log('Invalid argument. Use "ims" or "gemini".');
    process.exit(1);
}

try {
    execSync(`node ${script}`, { stdio: 'inherit' });
} catch (e) {
    console.error(`Error running ${script}:`, e.message);
    process.exit(1);
}
