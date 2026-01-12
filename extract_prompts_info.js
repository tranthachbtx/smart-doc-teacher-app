
const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs");

const dir = "d:\\smart-doc-teacher-app\\HUANLUYEN_AI";
const files = [
    "XÃ¢y dá»±ng Prompt Hoáº¡t Ä‘á»™ng Tráº£i nghiá»‡m.docx",
    "BÃ¡o cÃ¡o Dá»¯ liá»‡u & Prompt Engineering_ HÄTN HÆ°á»›ng n....docx",
    "XÃ¢y dá»±ng káº¿ hoáº¡ch dáº¡y há»c HÄTN, HN.docx"
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
