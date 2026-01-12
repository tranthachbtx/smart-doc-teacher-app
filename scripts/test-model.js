const fs = require('fs');
const path = require('path');

async function testFlashModel() {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const key = envContent.match(/GEMINI_API_KEY=([^\s]+)/)[1];

    const modelsToTry = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash-exp"];

    for (const model of modelsToTry) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
            });
            if (res.ok) {
                console.log(`âœ… Model ${model} is WORKING.`);
                return;
            } else {
                const data = await res.json();
                console.log(`âŒ Model ${model} FAILED: ${data.error?.message}`);
            }
        } catch (e) {
            console.log(`âŒ Model ${model} ERROR: ${e.message}`);
        }
    }
}

testFlashModel();
