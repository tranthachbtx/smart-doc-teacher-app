const fs = require('fs');
const PizZip = require('pizzip');

function readDocx(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        const zip = new PizZip(content);
        const xml = zip.file("word/document.xml").asText();

        const paragraphs = xml.match(/<w:p[^>]*>.*?<\/w:p>/g) || [];
        const fullText = paragraphs.map(p => {
            const texts = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
            return texts.map(t => t.replace(/<[^>]+>/g, '')).join('');
        }).join('\n');

        fs.writeFileSync('extracted_content.txt', fullText);
        console.log("Extracted to extracted_content.txt");
    } catch (error) {
        console.error("Error reading docx:", error);
    }
}

readDocx("D:/smart-doc-teacher-app/CĐ7_Xu hướng phát triển nghề nghiệp và TTLĐ.docx");
