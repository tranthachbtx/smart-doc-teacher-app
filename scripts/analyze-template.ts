
import * as fs from 'fs';
import PizZip from 'pizzip';

const analyzeTemplate = () => {
    try {
        const content = fs.readFileSync("D:/smart-doc-teacher-app/public/templates/KHBD_Template_2Cot.docx");
        const zip = new PizZip(content);
        const docXml = zip.file("word/document.xml")?.asText();

        if (!docXml) {
            console.error("Could not read word/document.xml");
            return;
        }

        console.log("Template Length:", docXml.length);

        // Find all placeholders {{...}}
        const regex = /\{\{(.*?)\}\}/g;
        let match;
        const placeholders = new Set<string>();

        while ((match = regex.exec(docXml)) !== null) {
            placeholders.add(match[1]);
        }

        console.log("Found Placeholders:");
        placeholders.forEach(p => console.log(`- {{${p}}}`));

    } catch (error) {
        console.error("Error analyzing template:", error);
    }
};

analyzeTemplate();
