
const mammoth = require("mammoth");
const path = require("path");
const fs = require("fs");

const filePath = "d:\\smart-doc-teacher-app\\HUANLUYEN_AI\\TÃ­ch há»£p GiÃ¡o dá»¥c Äáº¡o Ä‘á»©c vÃ o Hoáº¡t Ä‘á»™ng Tráº£i nghiá»‡m ccd 456.docx";
const outputFile = "d:\\smart-doc-teacher-app\\moral_integration_raw.txt";

async function extract() {
    console.log("Starting extraction of large file...");
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        fs.writeFileSync(outputFile, result.value);
        console.log("Extraction complete. Written to " + outputFile);
    } catch (err) {
        console.error("Error reading file:", err);
    }
}

extract();
