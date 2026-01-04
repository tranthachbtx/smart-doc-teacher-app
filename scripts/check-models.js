const fs = require('fs');
const path = require('path');

async function checkModels() {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const key = envContent.match(/GEMINI_API_KEY=([^\s]+)/)[1];

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
            const flashModel = data.models.find(m => m.name.includes("1.5-flash"));
            console.log("Found Flash Model:", flashModel ? flashModel.name : "NONE");
            console.log("First 10 models:");
            data.models.slice(0, 10).forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("Error:", data);
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}

checkModels();
