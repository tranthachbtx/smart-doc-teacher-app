/**
 * Script táº¡o Template Word KHBD vá»›i Ä‘á»‹nh dáº¡ng Báº£ng 2 Cá»™t chuáº©n (Ä‘Ã£ fix placeholder)
 * Cháº¡y: node scripts/create-template.js
 */

const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, TableLayoutType } = require("docx");
const fs = require("fs");
const path = require("path");

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 26; // 13pt
const FONT_SIZE_TITLE = 32; // 16pt
const FONT_SIZE_HEADER = 26;

function createText(text, options = {}) {
    return new TextRun({
        text,
        font: FONT_NAME,
        size: options.size || FONT_SIZE,
        bold: options.bold,
        italics: options.italics,
    });
}

function createActivityTable(activityName, cot1Var, cot2Var) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        },
        rows: [
            // Title Row
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 2,
                        shading: { fill: "E8F4FD" },
                        children: [
                            new Paragraph({
                                children: [createText(activityName, { bold: true, size: FONT_SIZE_HEADER })],
                            }),
                        ],
                    }),
                ],
            }),
            // Header Row
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        shading: { fill: "F8F9FA" },
                        children: [
                            new Paragraph({ children: [createText("THÃ”NG TIN HOáº T Äá»˜NG", { bold: true, size: FONT_SIZE_HEADER })] }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        shading: { fill: "F8F9FA" },
                        children: [
                            new Paragraph({ children: [createText("Tá»” CHá»¨C THá»°C HIá»†N", { bold: true, size: FONT_SIZE_HEADER })] }),
                        ],
                    }),
                ],
            }),
            // Content Row
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({ children: [createText(`{{${cot1Var}}}`)] }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({ children: [createText(`{{${cot2Var}}}`)] }),
                        ],
                    }),
                ],
            }),
        ],
    });
}

async function createTemplate() {
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 },
                    },
                },
                children: [
                    // TOP Header
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [createText("TRÆ¯á»œNG THPT {{ten_truong}}", { bold: true })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [createText("Tá»”: {{to_chuyen_mon}}", { bold: true })]
                    }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€")] }),

                    new Paragraph({ spacing: { before: 400 } }),

                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [createText("Káº¾ HOáº CH BÃ€I Dáº Y", { bold: true, size: 36 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [createText("Chá»§ Ä‘á» {{chu_de}}: {{ten_chu_de}}", { bold: true, size: 28 })],
                    }),

                    // General Info
                    new Paragraph({ children: [createText("GiÃ¡o viÃªn: ", { bold: true }), createText("{{ten_giao_vien}}")] }),
                    new Paragraph({ children: [createText("MÃ´n há»c: ", { bold: true }), createText("HÄTN, HN; Lá»›p: {{lop}}")] }),
                    new Paragraph({ children: [createText("Thá»i lÆ°á»£ng: ", { bold: true }), createText("{{so_tiet}} tiáº¿t")] }),
                    new Paragraph({ spacing: { after: 200 }, children: [createText("NgÃ y soáº¡n: ", { bold: true }), createText("{{ngay_soan}}")] }),

                    // I. Má»¤C TIÃŠU
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("I. Má»¤C TIÃŠU", { bold: true, size: 28 })] }),

                    new Paragraph({ children: [createText("1. YÃªu cáº§u cáº§n Ä‘áº¡t:", { bold: true })] }),
                    new Paragraph({ children: [createText("{{muc_tieu_kien_thuc}}")] }),

                    new Paragraph({ children: [createText("2. NÄƒng lá»±c:", { bold: true })], spacing: { before: 100 } }),
                    new Paragraph({ children: [createText("{{muc_tieu_nang_luc}}")] }),

                    new Paragraph({ children: [createText("3. Pháº©m cháº¥t:", { bold: true })], spacing: { before: 100 } }),
                    new Paragraph({ children: [createText("{{muc_tieu_pham_chat}}")] }),

                    // II. THIáº¾T Bá»Š
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("II. THIáº¾T Bá»Š Dáº Y Há»ŒC VÃ€ Há»ŒC LIá»†U", { bold: true, size: 28 })] }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ children: [createText("Äá»I TÆ¯á»¢NG", { bold: true })] })], shading: { fill: "FFF3E0" } }),
                                    new TableCell({ children: [new Paragraph({ children: [createText("CHUáº¨N Bá»Š", { bold: true })] })], shading: { fill: "FFF3E0" } }),
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "GiÃ¡o viÃªn" })] }),
                                    new TableCell({ children: [new Paragraph({ text: "{{gv_chuan_bi}}" })] }),
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "Há»c sinh" })] }),
                                    new TableCell({ children: [new Paragraph({ text: "{{hs_chuan_bi}}" })] }),
                                ]
                            }),
                        ]
                    }),

                    // III. TIáº¾N TRÃŒNH
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("III. TIáº¾N TRÃŒNH Dáº Y Há»ŒC", { bold: true, size: 28 })] }),

                    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createText("A. SINH HOáº T DÆ¯á»šI Cá»œ (SHDC)", { bold: true })] }),
                    new Paragraph({ children: [createText("{{shdc}}")] }),

                    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createText("B. HOáº T Äá»˜NG GIÃO Dá»¤C THEO CHá»¦ Äá»€ (HÄGD)", { bold: true })] }),

                    createActivityTable("HOáº T Äá»˜NG 1: KHá»žI Äá»˜NG", "hoat_dong_khoi_dong_cot_1", "hoat_dong_khoi_dong_cot_2"),
                    new Paragraph({ text: "" }),

                    createActivityTable("HOáº T Äá»˜NG 2: KHÃM PHÃ", "hoat_dong_kham_pha_cot_1", "hoat_dong_kham_pha_cot_2"),
                    new Paragraph({ text: "" }),

                    createActivityTable("HOáº T Äá»˜NG 3: LUYá»†N Táº¬P", "hoat_dong_luyen_tap_cot_1", "hoat_dong_luyen_tap_cot_2"),
                    new Paragraph({ text: "" }),

                    createActivityTable("HOáº T Äá»˜NG 4: Váº¬N Dá»¤NG", "hoat_dong_van_dung_cot_1", "hoat_dong_van_dung_cot_2"),
                    new Paragraph({ text: "" }),

                    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createText("C. SINH HOáº T Lá»šP (SHL)", { bold: true })] }),
                    new Paragraph({ children: [createText("{{shl}}")] }),

                    // IV & V
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("IV. Há»’ SÆ  Dáº Y Há»ŒC", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{ho_so_day_hoc}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("V. HÆ¯á»šNG DáºªN Vá»€ NHÃ€", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{huong_dan_ve_nha}}")] }),

                    new Paragraph({ spacing: { before: 400 } }),

                    // Signature
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE },
                            insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("Tá»” TRÆ¯á»žNG CHUYÃŠN MÃ”N", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(KÃ½ vÃ  ghi rÃµ há» tÃªn)", { italics: true })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("NGÆ¯á»œI SOáº N", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(KÃ½ vÃ  ghi rÃµ há» tÃªn)", { italics: true })] }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, "..", "public", "templates", "KHBD_Template_2Cot.docx");

    fs.writeFileSync(outputPath, buffer);
    console.log("âœ… New Template with 2-column activites created: " + outputPath);
}

createTemplate().catch(console.error);
