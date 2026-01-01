/**
 * Script tạo Template Word Kế hoạch Kiểm tra Đánh giá đúng chuẩn bộ GD&ĐT
 * Chạy: npx ts-node scripts/create-assessment-template.ts
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
                                                children: [createText("SỞ GD&ĐT BÌNH THUẬN", { size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("TRƯỜNG THPT BÙI THỊ XUÂN", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("TỔ: {to_chuyen_mon}", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("─────────", { size: FONT_SIZE_HEADER })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Độc lập - Tự do - Hạnh phúc", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("─────────────────", { size: FONT_SIZE_HEADER })],
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
                        children: [createText("KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ", { bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                        children: [createText("{ten_ke_hoach}", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    // General Info
                    new Paragraph({
                        children: [
                            createText("Học kỳ: ", { bold: true }),
                            createText("{hoc_ky}"),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            createText("Khối lớp: ", { bold: true }),
                            createText("{khoi}"),
                        ],
                    }),

                    // I. MỤC TIÊU
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("I. MỤC TIÊU ĐÁNH GIÁ", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{muc_tieu}")],
                    }),

                    // II. NỘI DUNG & NHIỆM VỤ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("II. NỘI DUNG VÀ NHIỆM VỤ KIỂM TRA", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{noi_dung_nhiem_vu}")],
                    }),

                    // III. HÌNH THỨC TỔ CHỨC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("III. HÌNH THỨC TỔ CHỨC", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{hinh_thuc_to_chuc}")],
                    }),

                    // IV. MA TRẬN ĐẶC TẢ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("IV. MA TRẬN ĐẶC TẢ", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{ma_tran_dac_ta}")],
                    }),

                    // V. RUBRIC ĐÁNH GIÁ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("V. RUBRIC ĐÁNH GIÁ CHI TIẾT", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{bang_kiem_rubric}")],
                    }),

                    new Paragraph({ text: "" }),

                    // VI. LỜI KHUYÊN CHO GIÁO VIÊN
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("VI. GHI CHÚ VÀ LỜI KHUYÊN TRIỂN KHAI", { bold: true, size: FONT_SIZE_TITLE })],
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
                                                children: [createText("DUYỆT CỦA BGH/TỔ TRƯỞNG", { bold: true })],
                                            }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: FONT_SIZE_HEADER })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Phan Thiết, ngày .... tháng .... năm 202...", { italics: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("NGƯỜI LẬP KẾ HOẠCH", { bold: true })],
                                            }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: FONT_SIZE_HEADER })] }),
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
    console.log(`✅ Assessment Template created: ${outputPath}`);
}

createTemplate().catch(console.error);
