
const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs");

const dir = "d:\\smart-doc-teacher-app\\HUANLUYEN_AI";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".docx"));

async function extract() {
    for (const file of files) {
        if (file.includes("cc d 456")) continue;
        const fullPath = path.join(dir, file);
        try {
            const result = await mammoth.extractRawText({ path: fullPath });
            console.log(`--- FILE: ${file} ---`);
            // Look for specific sections like "Chủ đề", "Mục tiêu", "Tổ chức thực hiện"
            const content = result.value;
            console.log(content.substring(0, 5000));
            console.log(`\n--- END FILE ---\n`);
        } catch (err) {
            console.error(`Error reading ${file}:`, err);
        }
    }
}

extract();
