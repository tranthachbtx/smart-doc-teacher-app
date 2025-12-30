
const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs");

const dir = "d:\\smart-doc-teacher-app\\HUANLUYEN_AI";
const files = [
    "Xây dựng Prompt Hoạt động Trải nghiệm.docx",
    "Báo cáo Dữ liệu & Prompt Engineering_ HĐTN Hướng n....docx",
    "Xây dựng kế hoạch dạy học HĐTN, HN.docx"
];

const outputFile = "d:\\smart-doc-teacher-app\\extracted_prompts_content.txt";

async function extract() {
    let allContent = "";
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (!fs.existsSync(fullPath)) continue;
        try {
            const result = await mammoth.extractRawText({ path: fullPath });
            allContent += `--- FILE: ${file} ---\n`;
            allContent += result.value;
            allContent += `\n--- END FILE ---\n\n`;
        } catch (err) {
            allContent += `Error reading ${file}: ${err}\n`;
        }
    }
    fs.writeFileSync(outputFile, allContent);
    console.log("Extraction complete. Written to " + outputFile);
}

extract();
