/**
 * Script tạo Template Word Nghiên cứu bài học (NCBH)
 * Chạy: npx ts-node scripts/create-ncbh-template.ts
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
                            top: 1134,
                            bottom: 1134,
                            left: 1701,
                            right: 850,
                        },
                    },
                },
                children: [
                    // Header
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [createText("HỒ SƠ SINH HOẠT CHUYÊN MÔN THEO NGHIÊN CỨU BÀI HỌC", { bold: true, size: 30 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [createText("{{ten_bai}}", { bold: true, size: FONT_SIZE_TITLE })],
                    }),

                    new Paragraph({ text: "" }),

                    // I. LÝ DO CHỌN BÀI
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("I. LÝ DO CHỌN BÀI HỌC NGHIÊN CỨU", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{ly_do_chon}}")],
                    }),

                    // II. MỤC TIÊU
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("II. MỤC TIÊU BÀI HỌC (THEO HÀNH VI)", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{muc_tieu}}")],
                    }),

                    // III. CHUỖI HOẠT ĐỘNG VÀ PHẢN BIỆN THIẾT KẾ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("III. CHUỖI HOẠT ĐỘNG VÀ PHẢN BIỆN THIẾT KẾ", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{chuoi_hoat_dong}}")],
                    }),

                    // IV. PHƯƠNG ÁN HỖ TRỢ (SCAFFOLDING)
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("IV. PHƯƠNG ÁN HỖ TRỢ HỌC SINH (SCAFFOLDING)", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{phu_ong_an_ho_tro}}")],
                    }),

                    // V. CHIA SẺ CỦA NGƯỜI DẠY
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("V. CHIA SẺ VÀ TỰ PHÂN TÍCH CỦA NGƯỜI DẠY", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{chia_se_nguoi_day}}")],
                    }),

                    // VI. NHẬN XÉT CỦA NGƯỜI DỰ (MINH CHỨNG VIỆC HỌC)
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("VI. NHẬN XÉT CỦA NGƯỜI DỰ (LÁT CẮT MINH CHỨNG)", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{nhan_xet_nguoi_du}}")],
                    }),

                    // VII. NGUYÊN NHÂN VÀ GIẢI PHÁP
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("VII. PHÂN TÍCH NGUYÊN NHÂN VÀ GIẢI PHÁP SỬA ĐỔI", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{nguyen_nhan_giai_phap}}")],
                    }),

                    // VIII. BÀI HỌC KINH NGHIỆM CHO TỔ
                    new Paragraph({
                        spacing: { before: 200, after: 120 },
                        children: [createText("VIII. BÀI HỌC KINH NGHIỆM CHO TỔ CHUYÊN MÔN", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        children: [createText("{{bai_hoc_kinh_nghiem}}")],
                    }),

                ],
            },
        ],
    });

    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(process.cwd(), "public", "templates", "mau-ncbh.docx");

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ NCBH Template created: ${outputPath}`);
}

createTemplate().catch(console.error);
