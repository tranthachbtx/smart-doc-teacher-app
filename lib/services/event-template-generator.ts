import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    BorderStyle,
    VerticalAlign,
} from "docx";
import { WORD_STANDARDS, NO_BORDER, createStandardHeader } from "./word-style-helper";

export const generateEventDocx = async (data: any): Promise<Blob> => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: WORD_STANDARDS.font,
                        size: WORD_STANDARDS.fontSize, // 13pt
                    },
                    paragraph: {
                        spacing: {
                            line: WORD_STANDARDS.lineSpacing,
                            before: 120,
                            after: 120,
                        },
                        alignment: AlignmentType.JUSTIFIED,
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: WORD_STANDARDS.margins,
                    },
                },
                children: [
                    // --- HEADER CHUẨN NGHỊ ĐỊNH 30 ---
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: createStandardHeader(
                            ["SỞ GD&ĐT LÂM ĐỒNG", "Trường THPT Bùi Thị Xuân", "Tổ HĐTN, HN & GDĐP"]
                        ),
                    }),

                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: `Mũi Né, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
                                italics: true,
                            }),
                        ],
                        spacing: { before: 240, after: 240 },
                    }),
                    new Paragraph({ text: "", spacing: { before: 240 } }),

                    // --- TIÊU ĐỀ ---
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "KẾ HOẠCH", bold: true, size: 28 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `Tổ chức hoạt động ngoại khóa khối ${data.khoi_lop || ""}`, bold: true, size: 28 })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `Chủ đề: "${data.ten_chu_de || ""}"`, bold: true, size: 28, italics: true })],
                        spacing: { after: 300 },
                    }),

                    // --- MỤC TIÊU ---
                    new Paragraph({
                        children: [new TextRun({ text: "I. MỤC ĐÍCH - YÊU CẦU", bold: true })],
                    }),
                    ...formatContent(data.muc_dich_yeu_cau),

                    new Paragraph({
                        children: [new TextRun({ text: "II. THỜI GIAN - ĐỊA ĐIỂM", bold: true })],
                        spacing: { before: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Thời gian: ", bold: true }),
                            new TextRun({ text: data.thoi_gian || "..." }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Địa điểm: ", bold: true }),
                            new TextRun({ text: data.dia_diem || "..." }),
                        ],
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "III. NỘI DUNG VÀ HÌNH THỨC TỔ CHỨC", bold: true })],
                        spacing: { before: 200 },
                    }),
                    ...formatContent(data.noi_dung),

                    new Paragraph({
                        children: [new TextRun({ text: "IV. KỊCH BẢN CHI TIẾT", bold: true })],
                        spacing: { before: 200 },
                    }),
                    ...formatContent(data.kich_ban_chi_tiet),

                    new Paragraph({
                        children: [new TextRun({ text: "V. DỰ TOÁN KINH PHÍ", bold: true })],
                        spacing: { before: 200 },
                    }),
                    ...formatContent(data.kinh_phi),

                    new Paragraph({
                        children: [new TextRun({ text: "VI. TỔ CHỨC THỰC HIỆN", bold: true })],
                        spacing: { before: 200 },
                    }),
                    ...formatContent(data.to_chuc_thuc_hien_chuan_bi),

                    new Paragraph({ text: "", spacing: { before: 400 } }),

                    // --- CHỮ KÝ ---
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
                                        verticalAlign: VerticalAlign.TOP,
                                        children: [
                                            new Paragraph({
                                                children: [new TextRun({ text: "Nơi nhận:", bold: true, italics: true, size: 22 })],
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "- BGH (để báo cáo);", size: 22 })],
                                                spacing: { before: 0, after: 0 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "- Tổ CM, GV thực hiện;", size: 22 })],
                                                spacing: { before: 0, after: 0 },
                                            }),
                                            new Paragraph({
                                                children: [new TextRun({ text: "- Lưu: VT, Tổ CM.", size: 22 })],
                                                spacing: { before: 0, after: 0 },
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN", bold: true, size: 26 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 })],
                                                spacing: { after: 1200 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: data.to_truong || "...", bold: true, size: 26 })],
                                            }),
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

    return await Packer.toBlob(doc);
};

function formatContent(val: any): Paragraph[] {
    if (val === null || val === undefined) return [new Paragraph({ text: "..." })];

    // Thử parse nếu là chuỗi chứa JSON (AI thường trả về stringified JSON trong field)
    if (typeof val === "string" && (val.trim().startsWith("[") || val.trim().startsWith("{"))) {
        try {
            const parsed = JSON.parse(val.trim());
            return formatContent(parsed);
        } catch (e) {
            // Không phải JSON chuẩn, tiếp tục xử lý như string thường
        }
    }

    // Xử lý mảng (ví dụ: danh sách mục tiêu hoặc danh sách kinh phí)
    if (Array.isArray(val)) {
        return val.flatMap((item, index) => {
            if (typeof item === "object") {
                // Định dạng đối tượng trong mảng thành 1 dòng gạch đầu dòng dễ đọc
                const summary = Object.entries(item)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" | ");
                return [
                    new Paragraph({
                        children: [new TextRun({ text: `- ${summary}` })],
                        spacing: { before: 40, after: 40 },
                        alignment: AlignmentType.JUSTIFIED
                    })
                ];
            }
            return formatContent(item);
        });
    }

    // Xử lý đối tượng đơn lẻ
    if (typeof val === "object") {
        return Object.entries(val).flatMap(([key, value]) => {
            return [
                new Paragraph({
                    children: [
                        new TextRun({ text: `${key}: `, bold: true }),
                        new TextRun({ text: typeof value === "string" ? value : JSON.stringify(value) })
                    ],
                    spacing: { before: 80, after: 80 }
                })
            ];
        });
    }

    const text = String(val);
    return text.split("\n").map(line => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        return new Paragraph({
            children: [new TextRun({ text: trimmed })],
            spacing: { before: 80, after: 80 },
            alignment: AlignmentType.JUSTIFIED
        });
    }).filter(Boolean) as Paragraph[];
}
