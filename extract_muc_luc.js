
const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs");

const filePath = "d:\\smart-doc-teacher-app\\HUANLUYEN_AI\\TÃ¬m má»¥c lá»¥c sÃ¡ch Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m.docx";
const outputFile = "d:\\smart-doc-teacher-app\\muc_luc_raw.txt";

async function extract() {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        fs.writeFileSync(outputFile, result.value);
        console.log("Extraction complete. Written to " + outputFile);
    } catch (err) {
        console.error("Error reading file:", err);
    }
}

extract();
