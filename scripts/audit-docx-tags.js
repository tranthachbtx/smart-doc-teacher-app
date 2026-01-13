const fs = require("fs");
const PizZip = require("pizzip");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../public/templates/mau-ke-hoach-ngoai-khoa.docx"
);

try {
  const content = fs.readFileSync(filePath);
  const zip = new PizZip(content);
  const docXml = zip.file("word/document.xml").asText();

  // Simple regex to find content that looks like tags
  // docxtemplater tags are {{tag_name}}
  // XML might split them like <w:t>{</w:t><w:t>{tag</w:t>... so text extraction is safer first if we want pure tags,
  // BUT we want to see the XML structure to confirm exact keys.
  // However, for a quick check, let's extract all text and then look for curly braces.

  // Rudimentary text extraction from XML (removing tags)
  const text = docXml.replace(/<[^>]+>/g, "");

  // Find all {{...}}
  const matches = text.match(/{{[^}]+}}/g);

  if (matches) {
    console.log("Found tags:");
    const uniqueTags = [...new Set(matches)];
    uniqueTags.forEach((t) => console.log(t));
  } else {
    console.log("No {{tag}} patterns found in text content.");
    // Fallback: check raw XML for fragmented tags which might be a problem
    console.log("Checking for potentially fragmented tags in XML...");
    // This is harder to regex perfectly but let's see if we see "ten_ke_hoach" at least
    const keywords = [
      "ten_ke_hoach",
      "thoi_gian",
      "dia_diem",
      "kinh_phi",
      "muc_tieu",
      "noi_dung",
    ];
    keywords.forEach((kw) => {
      if (docXml.includes(kw)) {
        console.log(`Found keyword '${kw}' in XML.`);
      } else {
        console.log(`WARNING: Keyword '${kw}' NOT found in XML.`);
      }
    });
  }
} catch (e) {
  console.error("Error reading file:", e);
}
