/**
 * Script tạo Template Word KHBD với định dạng Bảng 2 Cột chuẩn (đã fix placeholder)
 * Chạy: node scripts/create-template.js
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
                            new Paragraph({ children: [createText("THÔNG TIN HOẠT ĐỘNG", { bold: true, size: FONT_SIZE_HEADER })] }),
                        ],
                    }),
                    new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        shading: { fill: "F8F9FA" },
                        children: [
                            new Paragraph({ children: [createText("TỔ CHỨC THỰC HIỆN", { bold: true, size: FONT_SIZE_HEADER })] }),
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
                        children: [createText("TRƯỜNG THPT {{ten_truong}}", { bold: true })]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [createText("TỔ: {{to_chuyen_mon}}", { bold: true })]
                    }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("─────────────────")] }),

                    new Paragraph({ spacing: { before: 400 } }),

                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        children: [createText("KẾ HOẠCH BÀI DẠY", { bold: true, size: 36 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [createText("Chủ đề {{chu_de}}: {{ten_chu_de}}", { bold: true, size: 28 })],
                    }),

                    // General Info
                    new Paragraph({ children: [createText("Giáo viên: ", { bold: true }), createText("{{ten_giao_vien}}")] }),
                    new Paragraph({ children: [createText("Môn học: ", { bold: true }), createText("HĐTN, HN; Lớp: {{lop}}")] }),
                    new Paragraph({ children: [createText("Thời lượng: ", { bold: true }), createText("{{so_tiet}} tiết")] }),
                    new Paragraph({ spacing: { after: 200 }, children: [createText("Ngày soạn: ", { bold: true }), createText("{{ngay_soan}}")] }),

                    // I. MỤC TIÊU
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("I. MỤC TIÊU", { bold: true, size: 28 })] }),

                    new Paragraph({ children: [createText("1. Yêu cầu cần đạt:", { bold: true })] }),
                    new Paragraph({ children: [createText("{{muc_tieu_kien_thuc}}")] }),

                    new Paragraph({ children: [createText("2. Năng lực:", { bold: true })], spacing: { before: 100 } }),
                    new Paragraph({ children: [createText("{{muc_tieu_nang_luc}}")] }),

                    new Paragraph({ children: [createText("3. Phẩm chất:", { bold: true })], spacing: { before: 100 } }),
                    new Paragraph({ children: [createText("{{muc_tieu_pham_chat}}")] }),

                    // II. THIẾT BỊ
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU", { bold: true, size: 28 })] }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ children: [createText("ĐỐI TƯỢNG", { bold: true })] })], shading: { fill: "FFF3E0" } }),
                                    new TableCell({ children: [new Paragraph({ children: [createText("CHUẨN BỊ", { bold: true })] })], shading: { fill: "FFF3E0" } }),
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "Giáo viên" })] }),
                                    new TableCell({ children: [new Paragraph({ text: "{{gv_chuan_bi}}" })] }),
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph({ text: "Học sinh" })] }),
                                    new TableCell({ children: [new Paragraph({ text: "{{hs_chuan_bi}}" })] }),
                                ]
                            }),
                        ]
                    }),

                    // III. TIẾN TRÌNH
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("III. TIẾN TRÌNH DẠY HỌC", { bold: true, size: 28 })] }),

                    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createText("A. SINH HOẠT DƯỚI CỜ (SHDC)", { bold: true })] }),
                    new Paragraph({ children: [createText("{{shdc}}")] }),

                    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createText("B. HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ (HĐGD)", { bold: true })] }),

                    createActivityTable("HOẠT ĐỘNG 1: KHỞI ĐỘNG", "hoat_dong_khoi_dong_cot_1", "hoat_dong_khoi_dong_cot_2"),
                    new Paragraph({ text: "" }),

                    createActivityTable("HOẠT ĐỘNG 2: KHÁM PHÁ", "hoat_dong_kham_pha_cot_1", "hoat_dong_kham_pha_cot_2"),
                    new Paragraph({ text: "" }),

                    createActivityTable("HOẠT ĐỘNG 3: LUYỆN TẬP", "hoat_dong_luyen_tap_cot_1", "hoat_dong_luyen_tap_cot_2"),
                    new Paragraph({ text: "" }),

                    createActivityTable("HOẠT ĐỘNG 4: VẬN DỤNG", "hoat_dong_van_dung_cot_1", "hoat_dong_van_dung_cot_2"),
                    new Paragraph({ text: "" }),

                    new Paragraph({ spacing: { before: 120, after: 80 }, children: [createText("C. SINH HOẠT LỚP (SHL)", { bold: true })] }),
                    new Paragraph({ children: [createText("{{shl}}")] }),

                    // IV & V
                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("IV. HỒ SƠ DẠY HỌC", { bold: true, size: 28 })] }),
                    new Paragraph({ children: [createText("{{ho_so_day_hoc}}")] }),

                    new Paragraph({ spacing: { before: 200, after: 120 }, children: [createText("V. HƯỚNG DẪN VỀ NHÀ", { bold: true, size: 28 })] }),
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
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("TỔ TRƯỞNG CHUYÊN MÔN", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("NGƯỜI SOẠN", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true })] }),
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
    console.log("✅ New Template with 2-column activites created: " + outputPath);
}

createTemplate().catch(console.error);
