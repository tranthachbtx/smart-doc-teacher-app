
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, TableLayoutType } = require("docx");
const fs = require("fs");
const path = require("path");

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 26; // 13pt

function createText(text, options = {}) {
    return new TextRun({
        text,
        font: FONT_NAME,
        size: options.size || FONT_SIZE,
        bold: options.bold,
        italics: options.italics,
    });
}

async function createNCBHTemplate() {
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 },
                    },
                },
                children: [
                    // TOP HEADER TABLE
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
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("{{upper_agency}}", { size: 22 })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("{{ten_truong}}", { bold: true, size: 22 })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("TỔ: {{to_chuyen_mon}}", { bold: true, size: 22 })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("─────────", { size: 12 })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { bold: true, size: 22 })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("Độc lập - Tự do - Hạnh phúc", { bold: true, size: 24 })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("─────────", { size: 12 })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("..., ngày {{ngay}} tháng {{thang}} năm {{nam}}", { italics: true, size: 22 })] }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ spacing: { before: 400 } }),

                    // TITLE
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [createText("HỒ SƠ NGHIÊN CỨU BÀI HỌC", { bold: true, size: 32 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [createText("Tên bài: {{ten_bai}}", { bold: true, size: 26 })],
                    }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("I. LÝ DO CHỌN BÀI HỌC NGHIÊN CỨU", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{ly_do_chon}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("II. MỤC TIÊU BÀI HỌC NGHIÊN CỨU", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{muc_tieu}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("III. THIẾT KẾ CHI TIẾT VÀ PHẢN BIỆN", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{chuoi_hoat_dong}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("IV. PHƯƠNG ÁN HỖ TRỢ HỌC SINH (SCAFFOLDING)", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{phuong_an_ho_tro}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("V. PHÂN TÍCH DIỄN BIẾN VIỆC HỌC (MINH CHỨNG)", { bold: true, size: 28 })] }),
                    new Paragraph({ spacing: { before: 100 }, children: [createText("1. Chia sẻ của giáo viên dạy:", { bold: true, italics: true })] }),
                    new Paragraph({ children: [createText("{{chia_se_nguoi_day}}")] }),

                    new Paragraph({ spacing: { before: 100 }, children: [createText("2. Nhận xét của người dự giờ (Lát cắt minh chứng):", { bold: true, italics: true })] }),
                    new Paragraph({ children: [createText("{{nhan_xet_nguoi_du}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("VI. PHÂN TÍCH NGUYÊN NHÂN VÀ GIẢI PHÁP", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{nguyen_nhan_giai_phap}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("VII. BÀI HỌC KINH NGHIỆM CHO TỔ CHUYÊN MÔN", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{bai_hoc_kin_nghiem}}")] }),

                    new Paragraph({ spacing: { before: 600 } }),

                    // SIGNATURE
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
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("NGƯỜI DẠY / ĐẠI DIỆN NHÓM", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: 22 })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("TỔ TRƯỞNG CHUYÊN MÔN", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: 22 })] }),
                                            new Paragraph({ spacing: { before: 1000 } }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("{{chu_tri}}", { bold: true })] }),
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
    const outputPath = path.join(process.cwd(), "public", "templates", "mau-ncbh.docx");
    fs.writeFileSync(outputPath, buffer);
    console.log("✅ Professional NCBH Template Created");
}

createNCBHTemplate().catch(console.error);
