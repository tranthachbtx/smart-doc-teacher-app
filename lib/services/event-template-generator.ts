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

export const generateEventDocx = async (data: any): Promise<Blob> => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Times New Roman",
                        size: 26, // 13pt
                    },
                    paragraph: {
                        spacing: {
                            line: 276, // 1.15 line spacing
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
                        margin: {
                            top: 1134, // 2cm
                            right: 1134, // 2cm
                            bottom: 1134, // 2cm
                            left: 1701, // 3cm
                        },
                    },
                },
                children: [
                    // --- HEADER CHUẨN NGHỊ ĐỊNH 30 ---
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
                                                children: [new TextRun({ text: data.upper_agency || "SỞ GD&ĐT LÂM ĐỒNG", size: 24 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: `TRƯỜNG THPT ${data.ten_truong || "BÙI THỊ XUÂN"}`, bold: true, size: 24 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: `TỔ ${data.to_chuyen_mon || "HĐTN&GDĐP"}`, bold: true, size: 24 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "────────────────", size: 24 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: `Số: ${data.so_ke_hoach || "..../KH-BTX"}`, size: 24 })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "CỘNG HÀA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 26 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "───────────────", size: 24 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: data.ngay_thang || "Mũi Né, ngày ... tháng ... năm ...", italics: true, size: 26 })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
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

function formatContent(text: string): Paragraph[] {
    if (!text) return [new Paragraph({ text: "..." })];
    return text.split("\n").map(line => new Paragraph({
        children: [new TextRun({ text: line.trim() })],
        spacing: { before: 80, after: 80 },
        alignment: AlignmentType.JUSTIFIED
    }));
}
