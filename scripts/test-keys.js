const fs = require('fs');
const path = require('path');

async function testKeys() {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const keys = envContent.match(/GEMINI_API_KEY(_\d+)?=([^\s]+)/g)
        .map(line => line.split('=')[1]);

    console.log(`Checking ${keys.length} keys...`);

    for (const key of keys) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`âœ… Key ${key.slice(0, 8)}... is WORKING.`);
            } else {
                console.log(`âŒ Key ${key.slice(0, 8)}... FAILED: ${data.error?.message || JSON.stringify(data)}`);
            }
        } catch (e) {
            console.log(`âŒ Key ${key.slice(0, 8)}... ERROR: ${e.message}`);
        }
    }
}

testKeys();
