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
            // Column 1 cell starts after <w:tc> following "THÔNG TIN HOẠT ĐỘNG"
            // Actually, simpler: just replace the specific markers if they exist, 
            // or replace the content after the sub-headers.

            let table = tables[i];

            // Replace Column 1 content
            // Look for a) Mục tiêu: ... c) Sản phẩm: ... (Nội dung...)
            // We'll replace everything from "a) Mục tiêu:" to before the next cell
            const col1Header = "THÔNG TIN HOẠT ĐỘNG";
            const col2Header = "TỔ CHỨC THỰC HIỆN";

            if (table.includes(col1Header) && table.includes(col2Header)) {
                console.log(`Updating ${activityTitle}...`);

                // Find cell 1: it's the one with "THÔNG TIN HOẠT ĐỘNG"
                // Find cell 2: it's the one with "TỔ CHỨC THỰC HIỆN"

                // We will replace the entire internal content of cell 1 with our variable
                // and keep the header if possible, or just replace the "fill" part.

                // Better: find "(Nội dung từ AI sẽ điền vào đây)" and replace it?
                // No, the user might have changed that.

                // Let's replace the whole cell text content for simplicity and reliability
                // We'll look for the <w:tc> block.

                const tcBlocks = table.split('</w:tc>');
                // Typically: 
                // tc0 is the title row (merged)
                // tc1 is Column 1 header? No, in KHBD_Template_2Cot.docx:
                // Tr 1: Tc 1 (merged) - Title
                // Tr 2: Tc 1 - Thông tin, Tc 2 - Tổ chức

                // Let's just do a string replacement on the whole table string for specific markers

                // Col 1 replacement: search for common text in col 1 and replace everything after header
                table = table.replace(/<w:t>a\) Mục tiêu:<\/w:t>.*?<w:t>c\) Sản phẩm:<\/w:t>.*?<w:t>.*?<\/w:t>/sg,
                    (match) => match.split('<w:t>').slice(0, -1).join('<w:t>') + `<w:t>{{${col1Var}}}</w:t>`);

                // If the above is too complex, let's just do a broad replace of the "fill" text
                table = table.replace(/\(Nội dung từ AI sẽ điền vào đây\)/g, `{{${col1Var}}}`);

                // For Col 2, it's the 4 steps. Replace the steps content.
                // It has "Bước 1: ... Bước 4: ..."
                // We'll replace the whole thing or the specific markers.
                // The current template has "• GV: ..." "• HS: ..."

                // Let's just find the first "Bước 1" and replace from there to the end of the cell
                if (table.includes("Bước 1:")) {
                    // We'll replace the whole block from "Bước 1" with {{col2Var}}
                    // but we need to stay within the <w:tc>
                }

                // Given the user wants ME to fix it, I'll just use a very safe replacement:
                // Replace "(Nội dung từ AI sẽ điền vào đây)" -> {{col1Var}}
                // Replace "• GV: ... • HS: ..." block -> {{col2Var}}

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
// Khởi động
const kdoiIdx = xml.indexOf("KHỞI ĐỘNG");
if (kdoiIdx !== -1) {
    let nextCot1 = xml.indexOf("(Nội dung từ AI sẽ điền vào đây)", kdoiIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_khoi_dong_cot_1}}" + xml.substring(nextCot1 + "(Nội dung từ AI sẽ điền vào đây)".length);
    }
    let nextCot2 = xml.indexOf("Bước 1: CHUYỂN GIAO NHIỆM VỤ", kdoiIdx);
    if (nextCot2 !== -1) {
        // Find end of cell
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_khoi_dong_cot_2}}" + xml.substring(endTc);
    }
}

// Khám phá
const kphaIdx = xml.indexOf("KHÁM PHÁ");
if (kphaIdx !== -1) {
    let nextCot1 = xml.indexOf("(Nội dung từ AI sẽ điền vào đây)", kphaIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_kham_pha_cot_1}}" + xml.substring(nextCot1 + "(Nội dung từ AI sẽ điền vào đây)".length);
    }
    let nextCot2 = xml.indexOf("Bước 1: CHUYỂN GIAO NHIỆM VỤ", kphaIdx);
    if (nextCot2 !== -1) {
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_kham_pha_cot_2}}" + xml.substring(endTc);
    }
}

// Luyện tập
const ltapIdx = xml.indexOf("LUYỆN TẬP");
if (ltapIdx !== -1) {
    let nextCot1 = xml.indexOf("(Nội dung từ AI sẽ điền vào đây)", ltapIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_luyen_tap_cot_1}}" + xml.substring(nextCot1 + "(Nội dung từ AI sẽ điền vào đây)".length);
    }
    let nextCot2 = xml.indexOf("Bước 1: CHUYỂN GIAO NHIỆM VỤ", ltapIdx);
    if (nextCot2 !== -1) {
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_luyen_tap_cot_2}}" + xml.substring(endTc);
    }
}

// Vận dụng
const vdungIdx = xml.indexOf("VẬN DỤNG");
if (vdungIdx !== -1) {
    let nextCot1 = xml.indexOf("(Nội dung từ AI sẽ điền vào đây)", vdungIdx);
    if (nextCot1 !== -1) {
        xml = xml.substring(0, nextCot1) + "{{hoat_dong_van_dung_cot_1}}" + xml.substring(nextCot1 + "(Nội dung từ AI sẽ điền vào đây)".length);
    }
    let nextCot2 = xml.indexOf("Bước 1: CHUYỂN GIAO NHIỆM VỤ", vdungIdx);
    if (nextCot2 !== -1) {
        let endTc = xml.indexOf("</w:tc>", nextCot2);
        xml = xml.substring(0, nextCot2) + "{{hoat_dong_van_dung_cot_2}}" + xml.substring(endTc);
    }
}

fs.writeFileSync(xmlPath, xml);
console.log("Successfully updated placeholders in document.xml");
