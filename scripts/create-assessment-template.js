
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, TableLayoutType } = require("docx");
const fs = require("fs");
const path = require("path");

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 26; // 13pt
const FONT_SIZE_TITLE = 32; // 16pt

function createText(text, options = {}) {
    return new TextRun({
        text,
        font: FONT_NAME,
        size: options.size || FONT_SIZE,
        bold: options.bold,
        italics: options.italics,
    });
}

async function createAssessmentTemplate() {
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
                        children: [createText("KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [createText("Môn: Hoạt động trải nghiệm, hướng nghiệp - Lớp: {{khoi}}", { bold: true })],
                    }),

                    new Paragraph({ children: [createText("1. Tên kế hoạch: ", { bold: true }), createText("{{ten_ke_hoach}}")] }),
                    new Paragraph({ children: [createText("2. Học kỳ: ", { bold: true }), createText("{{hoc_ky}}")] }),

                    new Paragraph({ spacing: { before: 300, after: 120 }, children: [createText("I. MỤC TIÊU ĐÁNH GIÁ", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{muc_tieu}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("II. NỘI DUNG VÀ NHIỆM VỤ", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{noi_dung_nhiem_vu}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("III. HÌNH THỨC TỔ CHỨC", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{hinh_thuc_to_chuc}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("IV. MA TRẬN ĐẶC TẢ", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{ma_tran_dac_ta}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("V. BẢNG KIỂM / RUBRIC ĐÁNH GIÁ", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{bang_kiem_rubric}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("VI. LỜI KHUYÊN / GHI CHÚ", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{loi_khuyen}}")] }),

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
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("PHÊ DUYỆT CỦA BGH", { bold: true })] }),
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
    const outputPath = path.join(process.cwd(), "public", "templates", "Assessment_Template.docx");
    fs.writeFileSync(outputPath, buffer);
    console.log("✅ Professional Assessment Template Created");
}

createAssessmentTemplate().catch(console.error);
