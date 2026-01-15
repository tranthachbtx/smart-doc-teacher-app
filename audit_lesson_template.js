const PizZip = require("pizzip");
const fs = require("fs");

const filePath = "public/templates/mau-ke-hoach-day-hoc.docx";

try {
    const content = fs.readFileSync(filePath);
    const zip = new PizZip(content);
    const xml = zip.file("word/document.xml").asText();
    const text = xml.replace(/<[^>]+>/g, "");

    console.log("--- START TAG AUDIT: LESSON ---");
    const allTags = text.match(/\{+[^\{\}]+\}+/g) || [];
    [...new Set(allTags)].forEach(t => console.log(t));
    console.log("--- END TAG AUDIT ---");
} catch (e) {
    console.error("Error auditing template:", e.message);
}
