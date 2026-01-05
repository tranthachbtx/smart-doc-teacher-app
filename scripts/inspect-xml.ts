
import PizZip from "pizzip";
import * as fs from "fs";

const inspect = () => {
    const content = fs.readFileSync("D:/smart-doc-teacher-app/public/templates/KHBD_Template_2Cot.docx");
    const zip = new PizZip(content);
    const docXml = zip.file("word/document.xml")?.asText() || "";

    // Find context around "huong_dan_ve_nha"
    const index = docXml.indexOf("huong_dan_ve_nha");
    if (index !== -1) {
        console.log("Context around 'huong_dan_ve_nha':");
        console.log(docXml.substring(index - 200, index + 200));
    } else {
        console.log("Could not find 'huong_dan_ve_nha'");
    }

    // Inspect other tags if needed
    const index2 = docXml.indexOf("{{huong_dan_ve_nha}}");
    if (index2 === -1) console.log("Exact tag {{huong_dan_ve_nha}} not found (it is fragmented).");
};

inspect();
