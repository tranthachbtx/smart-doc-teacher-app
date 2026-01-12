/**
 * Script táº¡o Template Word KHBD vá»›i Ä‘á»‹nh dáº¡ng Báº£ng 2 Cá»™t
 * Cháº¡y: npx ts-node scripts/create-khbd-template.ts
 */

import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    WidthType,
    AlignmentType,
    BorderStyle,
    HeadingLevel,
    TableLayoutType,
} from "docx";
import * as fs from "fs";
import * as path from "path";

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 26; // 13pt = 26 half-points
const FONT_SIZE_TITLE = 28; // 14pt
const FONT_SIZE_HEADER = 24; // 12pt

// Helper function to create a text run
function createText(text: string, options: { bold?: boolean; size?: number; italics?: boolean } = {}): TextRun {
    return new TextRun({
        text,
        font: FONT_NAME,
        size: options.size || FONT_SIZE,
        bold: options.bold,
        italics: options.italics,
    });
}

// Helper function to create a paragraph
function createPara(text: string, options: { bold?: boolean; alignment?: typeof AlignmentType[keyof typeof AlignmentType]; size?: number } = {}): Paragraph {
    return new Paragraph({
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        spacing: { line: 360, after: 120 },
        children: [createText(text, { bold: options.bold, size: options.size })],
    });
}

// Helper to create table cell with paragraph
function createCell(content: string, options: { bold?: boolean; width?: number; shading?: string } = {}): TableCell {
    return new TableCell({
        width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
        shading: options.shading ? { fill: options.shading } : undefined,
        children: [
            new Paragraph({
                spacing: { line: 276, after: 60 },
                children: [createText(content, { bold: options.bold, size: FONT_SIZE_HEADER })],
            }),
        ],
    });
}

// Create 2-column table for activity
function createActivityTable(activityName: string, placeholder: string): Table {
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
            // Header row
            new TableRow({
                children: [
                    createCell(activityName, { bold: true, width: 100, shading: "E8F4FD" }),
                ],
            }),
            // Content row with 2 columns
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        shading: { fill: "F8F9FA" },
                        children: [
                            new Paragraph({
                                spacing: { line: 276, after: 60 },
                                children: [createText("THÃ”NG TIN HOáº T Äá»˜NG", { bold: true, size: FONT_SIZE_HEADER })],
                            }),
                            new Paragraph({
                                spacing: { line: 276, after: 60 },
                                children: [createText(`{${placeholder}_cot_1}`)],
                            }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                spacing: { line: 276, after: 60 },
                                children: [createText("Tá»” CHá»¨C THá»°C HIá»†N", { bold: true, size: FONT_SIZE_HEADER })],
                            }),
                            new Paragraph({
                                spacing: { line: 276, after: 60 },
                                children: [createText(`{${placeholder}_cot_2}`)],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });
}

async function createTemplate() {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: FONT_NAME,
                        size: FONT_SIZE,
                    },
                    paragraph: {
                        spacing: { line: 360 },
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1134, // 2cm
                            bottom: 1134,
                            left: 1701, // 3cm
                            right: 1134, // 2cm
                        },
                    },
                },
                children: [
                    // Header
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
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("TRÆ¯á»œNG THPT BÃ™I THá»Š XUÃ‚N - MÅ¨I NÃ‰", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Tá»”: HÄTN, HN & GDÄP", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Cá»˜NG HÃ’A XÃƒ Há»˜I CHá»¦ NGHÄ¨A VIá»†T NAM", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Äá»™c láº­p - Tá»± do - Háº¡nh phÃºc", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€", { size: FONT_SIZE_HEADER })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [createText("Káº¾ HOáº CH BÃ€I Dáº Y", { bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [createText("(Káº¿ hoáº¡ch giÃ¡o dá»¥c chá»§ Ä‘á»)", { italics: true, size: FONT_SIZE })],
                    }),

                    // Info
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [
                            createText("Chá»§ Ä‘á» {chu_de}: ", { bold: true }),
                            createText("{ten_chu_de}"),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [
                            createText("Thá»i lÆ°á»£ng: ", { bold: true }),
                            createText("{so_tiet} tiáº¿t"),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [
                            createText("NgÃ y soáº¡n: ", { bold: true }),
                            createText("{ngay_soan}"),
                        ],
                    }),

                    // I. Má»¤C TIÃŠU
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("I. Má»¤C TIÃŠU", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    // Má»¥c tiÃªu table
                    new Table({
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
                            new TableRow({
                                children: [
                                    createCell("THÃ€NH PHáº¦N", { bold: true, width: 30, shading: "E8F4FD" }),
                                    createCell("Ná»˜I DUNG", { bold: true, width: 70, shading: "E8F4FD" }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("1. YÃªu cáº§u cáº§n Ä‘áº¡t", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{muc_tieu_kien_thuc}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("2. NÄƒng lá»±c", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{muc_tieu_nang_luc}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("3. Pháº©m cháº¥t", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{muc_tieu_pham_chat}")] })],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // II. THIáº¾T Bá»Š Dáº Y Há»ŒC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("II. THIáº¾T Bá»Š Dáº Y Há»ŒC VÃ€ Há»ŒC LIá»†U", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    new Table({
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
                            new TableRow({
                                children: [
                                    createCell("Äá»I TÆ¯á»¢NG", { bold: true, width: 30, shading: "FFF3E0" }),
                                    createCell("CHUáº¨N Bá»Š", { bold: true, width: 70, shading: "FFF3E0" }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("1. GiÃ¡o viÃªn", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{gv_chuan_bi}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("2. Há»c sinh", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{hs_chuan_bi}")] })],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // III. TIáº¾N TRÃŒNH Dáº Y Há»ŒC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("III. TIáº¾N TRÃŒNH Dáº Y Há»ŒC", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    // A. SINH HOáº T DÆ¯á»šI Cá»œ
                    new Paragraph({
                        spacing: { before: 120, after: 80 },
                        children: [createText("A. SINH HOáº T DÆ¯á»šI Cá»œ (SHDC)", { bold: true })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{shdc}")],
                    }),

                    new Paragraph({ text: "" }),

                    // B. HOáº T Äá»˜NG GIÃO Dá»¤C
                    new Paragraph({
                        spacing: { before: 120, after: 80 },
                        children: [createText("B. HOáº T Äá»˜NG GIÃO Dá»¤C THEO CHá»¦ Äá»€ (HÄGD)", { bold: true })],
                    }),

                    // Hoáº¡t Ä‘á»™ng 1: Khá»Ÿi Ä‘á»™ng
                    createActivityTable("HOáº T Äá»˜NG 1: KHá»žI Äá»˜NG", "hoat_dong_khoi_dong"),
                    new Paragraph({ text: "" }),

                    // Hoáº¡t Ä‘á»™ng 2: KhÃ¡m phÃ¡
                    createActivityTable("HOáº T Äá»˜NG 2: KHÃM PHÃ", "hoat_dong_kham_pha"),
                    new Paragraph({ text: "" }),

                    // Hoáº¡t Ä‘á»™ng 3: Luyá»‡n táº­p
                    createActivityTable("HOáº T Äá»˜NG 3: LUYá»†N Táº¬P", "hoat_dong_luyen_tap"),
                    new Paragraph({ text: "" }),

                    // Hoáº¡t Ä‘á»™ng 4: Váº­n dá»¥ng
                    createActivityTable("HOáº T Äá»˜NG 4: Váº¬N Dá»¤NG", "hoat_dong_van_dung"),
                    new Paragraph({ text: "" }),

                    // C. SINH HOáº T Lá»šP
                    new Paragraph({
                        spacing: { before: 120, after: 80 },
                        children: [createText("C. SINH HOáº T Lá»šP (SHL)", { bold: true })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{shl}")],
                    }),

                    new Paragraph({ text: "" }),

                    // IV. Há»’ SÆ  Dáº Y Há»ŒC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("IV. Há»’ SÆ  Dáº Y Há»ŒC", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{ho_so_day_hoc}")],
                    }),

                    new Paragraph({ text: "" }),

                    // V. HÆ¯á»šNG DáºªN Vá»€ NHÃ€
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("V. HÆ¯á»šNG DáºªN Vá»€ NHÃ€", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{huong_dan_ve_nha}")],
                    }),

                    new Paragraph({ text: "" }),

                    // PHá»¤ Lá»¤C
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("PHá»¤ Lá»¤C: Tá»”NG Há»¢P TÃCH Há»¢P", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    new Table({
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
                            new TableRow({
                                children: [
                                    createCell("Ná»˜I DUNG TÃCH Há»¢P", { bold: true, width: 30, shading: "E8F5E9" }),
                                    createCell("CHI TIáº¾T", { bold: true, width: 70, shading: "E8F5E9" }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("NÄƒng lá»±c sá»‘ (NLS)", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{tich_hop_nls}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("GiÃ¡o dá»¥c Ä‘áº¡o Ä‘á»©c", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{tich_hop_dao_duc}")] })],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),

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
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Tá»” TRÆ¯á»žNG CHUYÃŠN MÃ”N", { bold: true })],
                                            }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(KÃ½ vÃ  ghi rÃµ há» tÃªn)", { italics: true, size: FONT_SIZE_HEADER })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("NGÆ¯á»œI SOáº N", { bold: true })],
                                            }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(KÃ½ vÃ  ghi rÃµ há» tÃªn)", { italics: true, size: FONT_SIZE_HEADER })] }),
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

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`âœ… Template created: ${outputPath}`);
}

createTemplate().catch(console.error);
