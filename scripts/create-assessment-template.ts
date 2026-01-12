/**
 * Script táº¡o Template Word Káº¿ hoáº¡ch Kiá»ƒm tra ÄÃ¡nh giÃ¡ Ä‘Ãºng chuáº©n bá»™ GD&ÄT
 * Cháº¡y: npx ts-node scripts/create-assessment-template.ts
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
    TableLayoutType,
} from "docx";
import * as fs from "fs";
import * as path from "path";

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 26; // 13pt
const FONT_SIZE_TITLE = 28; // 14pt
const FONT_SIZE_HEADER = 24; // 12pt

function createText(text: string, options: { bold?: boolean; size?: number; italics?: boolean } = {}): TextRun {
    return new TextRun({
        text,
        font: FONT_NAME,
        size: options.size || FONT_SIZE,
        bold: options.bold,
        italics: options.italics,
    });
}

function createPara(text: string, options: { bold?: boolean; alignment?: typeof AlignmentType[keyof typeof AlignmentType]; size?: number; italics?: boolean } = {}): Paragraph {
    return new Paragraph({
        alignment: options.alignment || AlignmentType.JUSTIFIED,
        spacing: { line: 360, after: 120 },
        children: [createText(text, { bold: options.bold, size: options.size, italics: options.italics })],
    });
}

function createCell(content: string, options: { bold?: boolean; width?: number; shading?: string; alignment?: typeof AlignmentType[keyof typeof AlignmentType] } = {}): TableCell {
    return new TableCell({
        width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined,
        shading: options.shading ? { fill: options.shading } : undefined,
        children: [
            new Paragraph({
                alignment: options.alignment || AlignmentType.LEFT,
                spacing: { line: 276, after: 60 },
                children: [createText(content, { bold: options.bold, size: FONT_SIZE_HEADER })],
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
                            right: 850, // 1.5cm
                        },
                    },
                },
                children: [
                    // Header (School & Motto)
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Sá»ž GD&ÄT BÃŒNH THUáº¬N", { size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("TRÆ¯á»œNG THPT BÃ™I THá»Š XUÃ‚N", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Tá»”: {to_chuyen_mon}", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("â”€â”€â”€â”€â”€â”€â”€â”€â”€", { size: FONT_SIZE_HEADER })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
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
                        spacing: { before: 200, after: 200 },
                        children: [createText("Káº¾ HOáº CH KIá»‚M TRA ÄÃNH GIÃ Äá»ŠNH Ká»²", { bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [createText("{ten_ke_hoach}", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    // General Info
                    new Paragraph({
                        children: [
                            createText("Há»c ká»³: ", { bold: true }),
                            createText("{hoc_ky}"),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            createText("Khá»‘i lá»›p: ", { bold: true }),
                            createText("{khoi}"),
                        ],
                    }),

                    // I. Má»¤C TIÃŠU
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("I. Má»¤C TIÃŠU ÄÃNH GIÃ", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{muc_tieu}")],
                    }),

                    // II. Ná»˜I DUNG & NHIá»†M Vá»¤
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("II. Ná»˜I DUNG VÃ€ NHIá»†M Vá»¤ KIá»‚M TRA", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{noi_dung_nhiem_vu}")],
                    }),

                    // III. HÃŒNH THá»¨C Tá»” CHá»¨C
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("III. HÃŒNH THá»¨C Tá»” CHá»¨C", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{hinh_thuc_to_chuc}")],
                    }),

                    // IV. MA TRáº¬N Äáº¶C Táº¢
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("IV. MA TRáº¬N Äáº¶C Táº¢", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{ma_tran_dac_ta}")],
                    }),

                    // V. RUBRIC ÄÃNH GIÃ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("V. RUBRIC ÄÃNH GIÃ CHI TIáº¾T", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{bang_kiem_rubric}")],
                    }),

                    new Paragraph({ text: "" }),

                    // VI. Lá»œI KHUYÃŠN CHO GIÃO VIÃŠN
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("VI. GHI CHÃš VÃ€ Lá»œI KHUYÃŠN TRIá»‚N KHAI", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{loi_khuyen}")],
                    }),

                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),

                    // Signature block
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("DUYá»†T Cá»¦A BGH/Tá»” TRÆ¯á»žNG", { bold: true })],
                                            }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(KÃ½ vÃ  ghi rÃµ há» tÃªn)", { italics: true, size: FONT_SIZE_HEADER })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Phan Thiáº¿t, ngÃ y .... thÃ¡ng .... nÄƒm 202...", { italics: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("NGÆ¯á»œI Láº¬P Káº¾ HOáº CH", { bold: true })],
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
    const outputPath = path.join(__dirname, "..", "public", "templates", "Assessment_Template.docx");

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(outputPath, buffer);
    console.log(`âœ… Assessment Template created: ${outputPath}`);
}

createTemplate().catch(console.error);
