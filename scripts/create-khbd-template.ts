/**
 * Script tạo Template Word KHBD với định dạng Bảng 2 Cột
 * Chạy: npx ts-node scripts/create-khbd-template.ts
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
                                children: [createText("THÔNG TIN HOẠT ĐỘNG", { bold: true, size: FONT_SIZE_HEADER })],
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
                                children: [createText("TỔ CHỨC THỰC HIỆN", { bold: true, size: FONT_SIZE_HEADER })],
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
                                                children: [createText("TRƯỜNG THPT BÙI THỊ XUÂN - MŨI NÉ", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("TỔ: HĐTN, HN & GDĐP", { bold: true, size: FONT_SIZE_HEADER })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
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
                        spacing: { after: 200 },
                        children: [createText("KẾ HOẠCH BÀI DẠY", { bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [createText("(Kế hoạch giáo dục chủ đề)", { italics: true, size: FONT_SIZE })],
                    }),

                    // Info
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [
                            createText("Chủ đề {chu_de}: ", { bold: true }),
                            createText("{ten_chu_de}"),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [
                            createText("Thời lượng: ", { bold: true }),
                            createText("{so_tiet} tiết"),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [
                            createText("Ngày soạn: ", { bold: true }),
                            createText("{ngay_soan}"),
                        ],
                    }),

                    // I. MỤC TIÊU
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("I. MỤC TIÊU", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    // Mục tiêu table
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
                                    createCell("THÀNH PHẦN", { bold: true, width: 30, shading: "E8F4FD" }),
                                    createCell("NỘI DUNG", { bold: true, width: 70, shading: "E8F4FD" }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("1. Yêu cầu cần đạt", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{muc_tieu_kien_thuc}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("2. Năng lực", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{muc_tieu_nang_luc}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("3. Phẩm chất", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{muc_tieu_pham_chat}")] })],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // II. THIẾT BỊ DẠY HỌC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU", { bold: true, size: FONT_SIZE_TITLE })],
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
                                    createCell("ĐỐI TƯỢNG", { bold: true, width: 30, shading: "FFF3E0" }),
                                    createCell("CHUẨN BỊ", { bold: true, width: 70, shading: "FFF3E0" }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("1. Giáo viên", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{gv_chuan_bi}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("2. Học sinh", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{hs_chuan_bi}")] })],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // III. TIẾN TRÌNH DẠY HỌC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("III. TIẾN TRÌNH DẠY HỌC", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    // A. SINH HOẠT DƯỚI CỜ
                    new Paragraph({
                        spacing: { before: 120, after: 80 },
                        children: [createText("A. SINH HOẠT DƯỚI CỜ (SHDC)", { bold: true })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{shdc}")],
                    }),

                    new Paragraph({ text: "" }),

                    // B. HOẠT ĐỘNG GIÁO DỤC
                    new Paragraph({
                        spacing: { before: 120, after: 80 },
                        children: [createText("B. HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ (HĐGD)", { bold: true })],
                    }),

                    // Hoạt động 1: Khởi động
                    createActivityTable("HOẠT ĐỘNG 1: KHỞI ĐỘNG", "hoat_dong_khoi_dong"),
                    new Paragraph({ text: "" }),

                    // Hoạt động 2: Khám phá
                    createActivityTable("HOẠT ĐỘNG 2: KHÁM PHÁ", "hoat_dong_kham_pha"),
                    new Paragraph({ text: "" }),

                    // Hoạt động 3: Luyện tập
                    createActivityTable("HOẠT ĐỘNG 3: LUYỆN TẬP", "hoat_dong_luyen_tap"),
                    new Paragraph({ text: "" }),

                    // Hoạt động 4: Vận dụng
                    createActivityTable("HOẠT ĐỘNG 4: VẬN DỤNG", "hoat_dong_van_dung"),
                    new Paragraph({ text: "" }),

                    // C. SINH HOẠT LỚP
                    new Paragraph({
                        spacing: { before: 120, after: 80 },
                        children: [createText("C. SINH HOẠT LỚP (SHL)", { bold: true })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{shl}")],
                    }),

                    new Paragraph({ text: "" }),

                    // IV. HỒ SƠ DẠY HỌC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("IV. HỒ SƠ DẠY HỌC", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{ho_so_day_hoc}")],
                    }),

                    new Paragraph({ text: "" }),

                    // V. HƯỚNG DẪN VỀ NHÀ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("V. HƯỚNG DẪN VỀ NHÀ", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        spacing: { after: 120 },
                        children: [createText("{huong_dan_ve_nha}")],
                    }),

                    new Paragraph({ text: "" }),

                    // PHỤ LỤC
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("PHỤ LỤC: TỔNG HỢP TÍCH HỢP", { bold: true, size: FONT_SIZE_TITLE })],
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
                                    createCell("NỘI DUNG TÍCH HỢP", { bold: true, width: 30, shading: "E8F5E9" }),
                                    createCell("CHI TIẾT", { bold: true, width: 70, shading: "E8F5E9" }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("Năng lực số (NLS)", { bold: true, width: 30 }),
                                    new TableCell({
                                        width: { size: 70, type: WidthType.PERCENTAGE },
                                        children: [new Paragraph({ children: [createText("{tich_hop_nls}")] })],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createCell("Giáo dục đạo đức", { bold: true, width: 30 }),
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
                                                children: [createText("TỔ TRƯỞNG CHUYÊN MÔN", { bold: true })],
                                            }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: FONT_SIZE_HEADER })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("NGƯỜI SOẠN", { bold: true })],
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
    const outputPath = path.join(__dirname, "..", "public", "templates", "KHBD_Template_2Cot.docx");

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Template created: ${outputPath}`);
}

createTemplate().catch(console.error);
