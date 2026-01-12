const fs = require('fs');
const path = require('path');

const xmlPath = path.join(process.cwd(), 'temp_docx_extract', 'word', 'document.xml');
let xml = fs.readFileSync(xmlPath, 'utf8');

// Helper to replace text in cell after a header
function replaceInActivity(xml, activityTitle, col1Var, col2Var) {
    // Find the table that contains the activity title
    // This is a bit tricky with regex on XML, but we can try to find blocks
    // In the template, each activity is in its own <w:tbl>

    const tables = xml.split('</w:tbl>');
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].includes(activityTitle)) {
            // This is the table. It has 2 rows (title row and content row)
            // Or maybe 1 title row and then cells

            // We want to replace the content cell in Column 1 and Column 2
            // Column 1 cell starts after <w:tc> following "THÃ”NG TIN HOáº T Äá»˜NG"
            // Actually, simpler: just replace the specific markers if they exist, 
            // or replace the content after the sub-headers.

            let table = tables[i];

            // Replace Column 1 content
            // Look for a) Má»¥c tiÃªu: ... c) Sáº£n pháº©m: ... (Ná»™i dung...)
            // We'll replace everything from "a) Má»¥c tiÃªu:" to before the next cell
            const col1Header = "THÃ”NG TIN HOáº T Äá»˜NG";
            const col2Header = "Tá»” CHá»¨C THá»°C HIá»†N";

            if (table.includes(col1Header) && table.includes(col2Header)) {
                console.log(`Updating ${activityTitle}...`);

                // Find cell 1: it's the one with "THÃ”NG TIN HOáº T Äá»˜NG"
                // Find cell 2: it's the one with "Tá»” CHá»¨C THá»°C HIá»†N"

                // We will replace the entire internal content of cell 1 with our variable
                // and keep the header if possible, or just replace the "fill" part.

                // Better: find "(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)" and replace it?
                // No, the user might have changed that.

                // Let's replace the whole cell text content for simplicity and reliability
                // We'll look for the <w:tc> block.

                const tcBlocks = table.split('</w:tc>');
                // Typically: 
                // tc0 is the title row (merged)
                // tc1 is Column 1 header? No, in KHBD_Template_2Cot.docx:
                // Tr 1: Tc 1 (merged) - Title
                // Tr 2: Tc 1 - ThÃ´ng tin, Tc 2 - Tá»• chá»©c

                // Let's just do a string replacement on the whole table string for specific markers

                // Col 1 replacement: search for common text in col 1 and replace everything after header
                table = table.replace(/<w:t>a\) Má»¥c tiÃªu:<\/w:t>.*?<w:t>c\) Sáº£n pháº©m:<\/w:t>.*?<w:t>.*?<\/w:t>/sg,
                    (match) => match.split('<w:t>').slice(0, -1).join('<w:t>') + `<w:t>{{${col1Var}}}</w:t>`);

                // If the above is too complex, let's just do a broad replace of the "fill" text
                table = table.replace(/\(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y\)/g, `{{${col1Var}}}`);

                // For Col 2, it's the 4 steps. Replace the steps content.
                // It has "BÆ°á»›c 1: ... BÆ°á»›c 4: ..."
                // We'll replace the whole thing or the specific markers.
                // The current template has "â€¢ GV: ..." "â€¢ HS: ..."

                // Let's just find the first "BÆ°á»›c 1" and replace from there to the end of the cell
                if (table.includes("BÆ°á»›c 1:")) {
                    // We'll replace the whole block from "BÆ°á»›c 1" with {{col2Var}}
                    // but we need to stay within the <w:tc>
                }

                // Given the user wants ME to fix it, I'll just use a very safe replacement:
                // Replace "(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)" -> {{col1Var}}
                // Replace "â€¢ GV: ... â€¢ HS: ..." block -> {{col2Var}}

                tables[i] = table;
            }
        }
    }
    return tables.join('</w:tbl>');
}

// Simple but effective replacements for the specific template structure
xml = xml.replace(/{{hoat_dong_khoi_dong}}/g, '{{hoat_dong_khoi_dong_cot_1}}'); // Fix if they used old
xml = xml.replace(/{{hoat_dong_kham_pha}}/g, '{{hoat_dong_kham_pha_cot_1}}');
xml = xml.replace(/{{hoat_dong_luyen_tap}}/g, '{{hoat_dong_luyen_tap_cot_1}}');
xml = xml.replace(/{{hoat_dong_van_dung}}/g, '{{hoat_dong_van_dung_cot_1}}');

// Find activity tables and inject markers
// Khá»Ÿi Ä‘á»™ng
const kdoiIdx = xml.indexOf("KHá»žI Äá»˜NG");
if (kdoiIdx !== -1) {
    let nextCot1 = xml.indexOf("(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)", kdoiIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_khoi_dong_cot_1}}" + xml.substring(nextCot1 + "(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)".length);
    }
    let nextCot2 = xml.indexOf("BÆ°á»›c 1: CHUYá»‚N GIAO NHIá»†M Vá»¤", kdoiIdx);
    if (nextCot2 !== -1) {
        // Find end of cell
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_khoi_dong_cot_2}}" + xml.substring(endTc);
    }
}

// KhÃ¡m phÃ¡
const kphaIdx = xml.indexOf("KHÃM PHÃ");
if (kphaIdx !== -1) {
    let nextCot1 = xml.indexOf("(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)", kphaIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_kham_pha_cot_1}}" + xml.substring(nextCot1 + "(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)".length);
    }
    let nextCot2 = xml.indexOf("BÆ°á»›c 1: CHUYá»‚N GIAO NHIá»†M Vá»¤", kphaIdx);
    if (nextCot2 !== -1) {
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_kham_pha_cot_2}}" + xml.substring(endTc);
    }
}

// Luyá»‡n táº­p
const ltapIdx = xml.indexOf("LUYá»†N Táº¬P");
if (ltapIdx !== -1) {
    let nextCot1 = xml.indexOf("(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)", ltapIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_luyen_tap_cot_1}}" + xml.substring(nextCot1 + "(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)".length);
    }
    let nextCot2 = xml.indexOf("BÆ°á»›c 1: CHUYá»‚N GIAO NHIá»†M Vá»¤", ltapIdx);
    if (nextCot2 !== -1) {
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_luyen_tap_cot_2}}" + xml.substring(endTc);
    }
}

// Váº­n dá»¥ng
const vdungIdx = xml.indexOf("Váº¬N Dá»¤NG");
if (vdungIdx !== -1) {
    let nextCot1 = xml.indexOf("(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)", vdungIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_van_dung_cot_1}}" + xml.substring(nextCot1 + "(Ná»™i dung tá»« AI sáº½ Ä‘iá»n vÃ o Ä‘Ã¢y)".length);
    }
    let nextCot2 = xml.indexOf("BÆ°á»›c 1: CHUYá»‚N GIAO NHIá»†M Vá»¤", vdungIdx);
    if (nextCot2 !== -1) {
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_van_dung_cot_2}}" + xml.substring(endTc);
    }
}

fs.writeFileSync(xmlPath, xml);
console.log("Successfully updated placeholders in document.xml");
