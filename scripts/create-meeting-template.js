
const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, TableLayoutType, VerticalAlign } = require("docx");
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

async function createMeetingTemplate() {
    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1134, bottom: 1134, left: 1701, right: 1134 },
                    },
                },
                children: [
                    // TOP HEADER TABLE (Standard Decree 30)
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
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("{{upper_agency}}", { size: 24 })]
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("{{ten_truong}}", { bold: true, size: 24 })]
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("TỔ: {{to_chuyen_mon}}", { bold: true, size: 24 })]
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("─────────", { size: 12 })]
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", { bold: true, size: 24 })]
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Độc lập - Tự do - Hạnh phúc", { bold: true, size: 26 })]
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("─────────", { size: 12 })]
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [createText("Mũi Né, ngày {{ngay}} tháng {{thang}} năm {{nam}}", { italics: true, size: 24 })]
                                            }),
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
                        children: [createText("BIÊN BẢN HỌP TỔ CHUYÊN MÔN", { bold: true, size: FONT_SIZE_TITLE })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                        children: [createText("{{lan_hop}}", { bold: true })],
                    }),

                    // MEETING INFO
                    new Paragraph({ children: [createText("1. Thời gian: ", { bold: true }), createText("... giờ ... ngày {{ngay}} tháng {{thang}} năm {{nam}}")] }),
                    new Paragraph({ children: [createText("2. Địa điểm: ", { bold: true }), createText("Phòng họp Tổ chuyên môn")] }),
                    new Paragraph({ children: [createText("3. Chủ trì: ", { bold: true }), createText("{{chu_tri}}")] }),
                    new Paragraph({ children: [createText("4. Thư ký: ", { bold: true }), createText("{{thu_ky}}")] }),
                    new Paragraph({ children: [createText("5. Thành phần tham dự: ", { bold: true }), createText("{{thanh_vien}}")] }),
                    new Paragraph({ children: [createText("6. Vắng: ", { bold: true }), createText("{{vang}} (Lý do: {{ly_do}})")] }),

                    new Paragraph({ spacing: { before: 300, after: 120 }, children: [createText("NỘI DUNG CUỘC HỌP", { bold: true, size: 28 })] }),

                    // I. ĐÁNH GIÁ CÔNG TÁC THÁNG
                    new Paragraph({ spacing: { before: 200 }, children: [createText("I. ĐÁNH GIÁ CÔNG TÁC THÁNG QUA", { bold: true })] }),
                    new Paragraph({ children: [createText("{{noi_dung_chinh}}")] }),

                    new Paragraph({ spacing: { before: 100 }, children: [createText("1. Ưu điểm:", { bold: true, italics: true })] }),
                    new Paragraph({ children: [createText("{{uu_diem}}")] }),

                    new Paragraph({ spacing: { before: 100 }, children: [createText("2. Hạn chế và biện pháp khắc phục:", { bold: true, italics: true })] }),
                    new Paragraph({ children: [createText("{{han_che}}")] }),

                    // II. Ý KIẾN THẢO LUẬN
                    new Paragraph({ spacing: { before: 200 }, children: [createText("II. Ý KIẾN THẢO LUẬN VÀ ĐÓNG GÓP", { bold: true })] }),
                    new Paragraph({ children: [createText("{{y_kien_dong_gop}}")] }),

                    // III. KẾ HOẠCH THÁNG TỚI
                    new Paragraph({ spacing: { before: 200 }, children: [createText("III. KẾ HOẠCH CÔNG TÁC THÁNG TỚI", { bold: true })] }),
                    new Paragraph({ children: [createText("{{ke_hoach_thang_toi}}")] }),

                    new Paragraph({ spacing: { before: 400, after: 200 }, children: [createText("Cuộc họp kết thúc vào lúc ... giờ cùng ngày. Biên bản đã được thông qua tổ chuyên môn.", { italics: true })] }),

                    new Paragraph({ spacing: { before: 600 } }),

                    // SIGNATURE BLOCK
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
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("THƯ KÝ", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: 22 })] }),
                                            new Paragraph({ spacing: { before: 1200 } }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("{{thu_ky}}", { bold: true })] }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("CHỦ TRÌ/TỔ TRƯỞNG", { bold: true })] }),
                                            new Paragraph({ alignment: AlignmentType.CENTER, children: [createText("(Ký và ghi rõ họ tên)", { italics: true, size: 22 })] }),
                                            new Paragraph({ spacing: { before: 1200 } }),
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
    const outputPath = path.join(process.cwd(), "public", "templates", "mau-bien-ban-hop-to.docx");

    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    fs.writeFileSync(outputPath, buffer);
    console.log("✅ Professional Meeting Template Created: " + outputPath);
}

createMeetingTemplate().catch(console.error);
