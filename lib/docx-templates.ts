import { type Document as DocxDocument } from "docx";
import { WORD_STANDARDS, NO_BORDER, createStandardHeader } from "./services/word-style-helper";

export const createMeetingTemplate = async (): Promise<Blob> => {
    const {
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
    } = await import("docx");

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
                            before: 80,
                            after: 80,
                        },
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
                    // Header - 2 columns layout
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: createStandardHeader(
                            ["SỞ GD&ĐT LÂM ĐỒNG", "TRƯỜNG THPT {{ten_truong}}", "TỔ {{to_chuyen_mon}}"]
                        ),
                    }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),

                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "BIÊN BẢN", bold: true, size: WORD_STANDARDS.fontSizeTitle }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Sinh hoạt định kỳ của tổ/nhóm chuyên môn tháng {{thang}}/{{nam}}",
                                bold: true,
                                size: WORD_STANDARDS.fontSize,
                            }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Lần: {{lan_hop}}", italics: true, size: WORD_STANDARDS.fontSizeSmall })],
                        spacing: { after: 240 },
                    }),

                    // I. Time & Location
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. Thời gian và địa điểm:", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Thời gian: Vào lúc......giờ........ phút, ngày .......tháng ...... năm {{nam}}",
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tại trường THPT {{ten_truong}}",
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // II. Participants
                    new Paragraph({
                        children: [
                            new TextRun({ text: "II. Thành phần:", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Chủ trì: ", bold: true }),
                            new TextRun({ text: "{{chu_tri}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Thư ký: ", bold: true }),
                            new TextRun({ text: "{{thu_ky}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Thành viên: ", bold: true }),
                            new TextRun({ text: "{{thanh_vien}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Vắng: ........ Lí do...................................",
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // III. Contents
                    new Paragraph({
                        children: [
                            new TextRun({ text: "III. Nội dung:", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tổ trưởng thông qua mục đích, yêu cầu và nội dung của buổi họp và tiến hành từng nội dung cụ thể như sau:",
                                italics: true,
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Đánh giá hoạt động tuần – tháng qua",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Nội dung chính: ", bold: true }),
                            new TextRun({ text: "{{noi_dung_chinh}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "+ Ưu điểm: ", bold: true }),
                            new TextRun({ text: "{{uu_diem}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "+ Hạn chế: ", bold: true }),
                            new TextRun({ text: "{{han_che}}" }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Triển khai kế hoạch tuần – tháng tới",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ke_hoach_thang_toi}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Ý kiến thảo luận",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{y_kien_dong_gop}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4. Kết luận của chủ trì cuộc họp",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ket_luan_cuoc_hop}}" })],
                    }),

                    new Paragraph({ text: "", spacing: { before: 240 } }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Các thành viên đồng ý hoàn toàn với ý kiến thảo luận và đóng góp trên.",
                                italics: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Biên bản kết thúc lúc......giờ......phút cùng ngày.",
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { before: 480 } }),

                    // Signatures Section
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
                                                children: [
                                                    new TextRun({
                                                        text: "CHỦ TRÌ CUỘC HỌP",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{chu_tri}}", bold: true, size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "THƯ KÝ",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{thu_ky}}", bold: true, size: 24 }),
                                                ],
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

export const createLessonTemplate = async (): Promise<Blob> => {
    const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        AlignmentType,
        Table,
        TableRow,
        TableCell,
        WidthType,
        BorderStyle,
    } = await import("docx");

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
                            before: 80,
                            after: 80,
                        },
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
                    // Header chuẩn
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: createStandardHeader(
                            ["SỞ GD&ĐT LÂM ĐỒNG", "TRƯỜNG THPT {{ten_truong}}", "TỔ {{to_chuyen_mon}}"]
                        ),
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "KẾ HOẠCH GIÁO DỤC CHỦ ĐỀ",
                                bold: true,
                                size: WORD_STANDARDS.fontSizeTitle,
                            }),
                        ],
                        spacing: { before: 240, after: 240 },
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "Trường: ", bold: true }),
                            new TextRun({ text: "THPT {{ten_truong}}" }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Tổ: ", bold: true }),
                            new TextRun({ text: "{{to_chuyen_mon}}" }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Họ và tên giáo viên: ", bold: true }),
                            new TextRun({ text: "{{ten_giao_vien}}" }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Ngày soạn: ", bold: true }),
                            new TextRun({ text: "{{ngay_soan}}" }),
                        ],
                        spacing: { after: 120 },
                    }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Chủ đề {{chu_de}}: "{{ten_chu_de}}"',
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { after: 120 },
                    }),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "Môn học: ", bold: true }),
                            new TextRun({
                                text: "Hoạt động trải nghiệm, hướng nghiệp; lớp: {{lop}}",
                            }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Thời gian thực hiện: ", bold: true }),
                            new TextRun({ text: "{{so_tiet}} tiết" }),
                        ],
                        spacing: { after: 240 },
                    }),

                    // Section I - Mục tiêu
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Yêu cầu cần đạt/Kiến thức:", bold: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_tieu_kien_thuc}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "2. Năng lực hình thành:", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_tieu_nang_luc}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "3. Phẩm chất chủ yếu:", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_tieu_pham_chat}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // Section II - Thiết bị
                    new Paragraph({
                        children: [
                            new TextRun({ text: "II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "1. Đối với giáo viên:", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{gv_chuan_bi}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "2. Đối with học sinh:", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{hs_chuan_bi}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // Section III - Tiến trình
                    new Paragraph({
                        children: [
                            new TextRun({ text: "III. TIẾN TRÌNH DẠY HỌC", bold: true, size: 28 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "A. SINH HOẠT ĐẦU TUẦN / SINH HOẠT LỚP", bold: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{shdc}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{shl}}" })],
                    }),

                    new Paragraph({ text: "", spacing: { before: 240 } }),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "B. HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ", bold: true }),
                        ],
                        spacing: { after: 120 },
                    }),

                    ...(["khoi_dong", "kham_pha", "luyen_tap", "van_dung"].flatMap((actKey) => {
                        const actNames: Record<string, string> = {
                            khoi_dong: "KHỞI ĐỘNG (WARM-UP)",
                            kham_pha: "KHÁM PHÁ (EXPLORATION)",
                            luyen_tap: "LUYỆN TẬP (PRACTICE)",
                            van_dung: "VẬN DỤNG (APPLICATION)",
                        };
                        return [
                            new Paragraph({
                                children: [
                                    new TextRun({ text: `HOẠT ĐỘNG: ${actNames[actKey]}`, bold: true, size: 24 }),
                                ],
                                spacing: { before: 240, after: 120 },
                            }),
                            new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                width: { size: 40, type: WidthType.PERCENTAGE },
                                                children: [
                                                    new Paragraph({
                                                        alignment: AlignmentType.CENTER,
                                                        children: [
                                                            new TextRun({ text: "THÔNG TIN HOẠT ĐỘNG", bold: true, size: 22 }),
                                                        ],
                                                    }),
                                                ],
                                                shading: { fill: "EEEEEE" },
                                            }),
                                            new TableCell({
                                                width: { size: 60, type: WidthType.PERCENTAGE },
                                                children: [
                                                    new Paragraph({
                                                        alignment: AlignmentType.CENTER,
                                                        children: [
                                                            new TextRun({ text: "TỔ CHỨC THỰC HIỆN", bold: true, size: 22 }),
                                                        ],
                                                    }),
                                                ],
                                                shading: { fill: "EEEEEE" },
                                            }),
                                        ],
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [
                                                    new Paragraph({ children: [new TextRun({ text: `{{hoat_dong_${actKey}_cot_1}}`, size: 24 })] }),
                                                ],
                                            }),
                                            new TableCell({
                                                children: [
                                                    new Paragraph({ children: [new TextRun({ text: `{{hoat_dong_${actKey}_cot_2}}`, size: 24 })] }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ];
                    })),

                    new Paragraph({ text: "", spacing: { before: 480 } }),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "IV. HỒ SƠ DẠY HỌC & PHỤ LỤC", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ho_so_day_hoc}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    new Paragraph({
                        children: [
                            new TextRun({ text: "V. HƯỚNG DẪN VỀ NHÀ", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{huong_dan_ve_nha}}" })],
                    }),

                    new Paragraph({ text: "", spacing: { before: 480 } }),

                    // Signatures Section
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
                                                children: [
                                                    new TextRun({
                                                        text: "TỔ TRƯỞNG CHUYÊN MÔN",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{to_truong}}", bold: true, size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "BAN GIÁM HIỆU",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký tên, đóng dấu)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{hieu_truong}}", bold: true, size: 24 }),
                                                ],
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

export const createAssessmentTemplate = async (): Promise<Blob> => {
    const {
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
    } = await import("docx");

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
                            before: 80,
                            after: 80,
                        },
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
                    // Header chuẩn
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: createStandardHeader(
                            ["SỞ GD&ĐT LÂM ĐỒNG", "TRƯỜNG THPT {{ten_truong}}", "TỔ {{to_chuyen_mon}}"]
                        ),
                    }),
                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),

                    // Title Section
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "KẾ HOẠCH KIỂM TRA, ĐÁNH GIÁ ĐỊNH KỲ", bold: true, size: 30 }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Học phần/Chủ đề: "{{ten_ke_hoach}}"',
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { after: 240 },
                    }),

                    // I. Objectives
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. MỤC TIÊU ĐÁNH GIÁ", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_tieu}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // II. Content/Tasks
                    new Paragraph({
                        children: [
                            new TextRun({ text: "II. NỘI DUNG VÀ NHIỆM VỤ TIÊU BIỂU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{noi_dung_nhiem_vu}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // III. Matrix
                    new Paragraph({
                        children: [
                            new TextRun({ text: "III. MA TRẬN ĐẶC TẢ ĐỀ KIỂM TRA", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ma_tran_dac_ta}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // IV. Rubric
                    new Paragraph({
                        children: [
                            new TextRun({ text: "IV. BẢNG KIỂM / RUBRIC ĐÁNH GIÁ CHI TIẾT", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{rubric}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // V. Advice
                    new Paragraph({
                        children: [
                            new TextRun({ text: "V. GHI CHÚ VÀ LỜI KHUYÊN DÀNH CHO HỌC SINH", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{loi_khuyen}}", italics: true })],
                    }),

                    new Paragraph({ text: "", spacing: { before: 480 } }),

                    // Signatures Section
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
                                                children: [
                                                    new TextRun({
                                                        text: "TỔ TRƯỞNG CHUYÊN MÔN",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{to_truong}}", bold: true, size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "BAN GIÁM HIỆU",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký tên, đóng dấu)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{hieu_truong}}", bold: true, size: 24 }),
                                                ],
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

export const createEventTemplate = async (): Promise<Blob> => {
    const {
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
    } = await import("docx");

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
                            before: 80,
                            after: 80,
                        },
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
                    // Header chuẩn
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: createStandardHeader(
                            ["SỞ GD&ĐT LÂM ĐỒNG", "TRƯỜNG THPT {{ten_truong}}", "TỔ {{to_chuyen_mon}}"],
                            undefined,
                            "Số: {{so_ke_hoach}}/KHNK-HĐTN-HN"
                        ),
                    }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),

                    // Title Section
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "KẾ HOẠCH", bold: true, size: 30 }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Ngoại khoá khối {{khoi_lop}} - Chủ đề "{{ten_chu_de}}"',
                                bold: true,
                                size: 28,
                            }),
                        ],
                        spacing: { after: 240 },
                    }),

                    // I. Objectives
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Yêu cầu cần đạt/Mục đích yêu cầu", bold: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_dich_yeu_cau}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "2. Năng lực hình thành", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nang_luc}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "3. Phẩm chất chủ yếu", bold: true })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{pham_chat}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // II. Time & Location
                    new Paragraph({
                        children: [
                            new TextRun({ text: "II. THỜI GIAN – ĐỊA ĐIỂM", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Thời gian: ", bold: true }),
                            new TextRun({ text: "{{thoi_gian}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Địa điểm: ", bold: true }),
                            new TextRun({ text: "{{dia_diem}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Yêu cầu: Nghiêm túc thực hiện, giáo viên đánh giá tiết dạy theo quy định nhà trường.",
                                size: 24,
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // III. Funding
                    new Paragraph({
                        children: [
                            new TextRun({ text: "III. KINH PHÍ THỰC HIỆN", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Tổng ngân sách dự kiến: {{kinh_phi}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Chi tiết: {{du_toan_kinh_phi}}" })],
                    }),

                    new Paragraph({ text: "" }),

                    // IV. Participants
                    new Paragraph({
                        children: [
                            new TextRun({ text: "IV. THÀNH PHẦN THAM DỰ", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "1. Toàn thể cán bộ, giáo viên, nhân viên." })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Giáo viên phụ trách chính: ", bold: true }),
                            new TextRun({ text: "{{giao_vien_phu_trach}}" }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "3. Học sinh: ", bold: true }),
                            new TextRun({ text: "Toàn bộ học sinh khối {{khoi_lop}}." }),
                        ],
                    }),

                    new Paragraph({ text: "" }),

                    // V. Implementation
                    new Paragraph({
                        children: [
                            new TextRun({ text: "V. TỔ CHỨC THỰC HIỆN", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Công tác chuẩn bị:", bold: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{to_chuc_thuc_hien_chuan_bi}}" })],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Checklist: {{chuan_bi}}" })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Nội dung, hình thức thực hiện chi tiết:", bold: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{kich_ban_chi_tiet}}" })],
                    }),

                    new Paragraph({ text: "", spacing: { before: 240 } }),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Thông điệp: "{{thong_diep_ket_thuc}}"',
                                bold: true,
                                italics: true,
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { after: 240 } }),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Trên đây là Kế hoạch tổ chức chương trình ngoại khóa chủ đề "{{ten_chu_de}}" của tổ hoạt động trải nghiệm, hướng nghiệp. Đề nghị các bộ phận liên quan và học sinh khối {{khoi_lop}} nghiêm túc triển khai thực hiện./.',
                                italics: true,
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { before: 480 } }),

                    // Signatures Section
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
                                                children: [
                                                    new TextRun({
                                                        text: "TỔ TRƯỞNG CHUYÊN MÔN",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{to_truong}}", bold: true, size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "BAN GIÁM HIỆU",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "(Ký tên, đóng dấu)", italics: true, size: 20 }),
                                                ],
                                                spacing: { after: 1000 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{hieu_truong}}",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { before: 480 } }),

                    // Nơi nhận
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nơi nhận:",
                                bold: true,
                                italics: true,
                                size: 22,
                            }),
                        ],
                        spacing: { after: 0 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "- BGH (để báo cáo);", size: 22 })],
                        spacing: { before: 0, after: 0 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "- Tổ CM, GV thực hiện;", size: 22 }),
                        ],
                        spacing: { before: 0, after: 0 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "- Lưu: VT, Tổ CM.", size: 22 }),
                        ],
                        spacing: { before: 0, after: 0 },
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};
export const createNCBHTemplate = async (): Promise<Blob> => {
    const {
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
    } = await import("docx");

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
                            before: 60,
                            after: 60,
                        },
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
                    // Header Section
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: createStandardHeader(
                            ["{{ten_truong}}", "TỔ: {{to_chuyen_mon}}"]
                        ),
                    }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "HỒ SƠ VÀ BIÊN BẢN", bold: true, size: 32 }),
                        ],
                        spacing: { before: 0, after: 0, line: 240 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "SINH HOẠT CHUYÊN MÔN THEO NGHIÊN CỨU BÀI HỌC", bold: true, size: 28 }),
                        ],
                        spacing: { before: 0, after: 120, line: 240 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Bài dạy nghiên cứu: {{ten_bai}}", italics: true, size: 26, bold: true }),
                        ],
                        spacing: { before: 0, after: 360, line: 240 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "I. GIAI ĐOẠN 1: THIẾT KẾ BÀI DẠY (TẬP THỂ TỔ XÂY DỰNG)", bold: true, size: 28 })],
                        spacing: { before: 240, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "1. Lý do chọn bài dạy nghiên cứu:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ly_do_chon}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "2. Mục tiêu bài học (Yêu cầu cần đạt):", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_tieu}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "3. Chuỗi các hoạt động học dự kiến:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{chuoi_hoat_dong}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "4. Các phương án hỗ trợ học sinh gặp khó khăn:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{phuong_an_ho_tro}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),
                    new Paragraph({
                        children: [new TextRun({ text: "II. GIAI ĐOẠN 2 & 3: DẠY MINH HỌA - QUAN SÁT VÀ PHÂN TÍCH BÀI HỌC", bold: true, size: 28 })],
                        spacing: { before: 240, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "(Thời gian: {{ngay_thuc_hien}} - Khối: {{khoi}})", italics: true, size: 24 })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "1. Chia sẻ của giáo viên dạy minh họa:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{chia_se_nguoi_day}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "2. Thảo luận của đồng nghiệp (Tập trung minh chứng về việc học của HS):", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nhan_xet_nguoi_du}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "3. Phân tích nguyên nhân và giải pháp điều chỉnh:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nguyen_nhan_giai_phap}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "4. Bài học kinh nghiệm rút ra cho các bài học sau:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{bai_hoc_kinh_nghiem}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({ text: "", spacing: { before: 360, after: 360 } }),
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
                                                children: [new TextRun({ text: "NGƯỜI GHI BIÊN BẢN", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 60, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 })],
                                                spacing: { before: 0, after: 840, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "................................", size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 60, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 20 })],
                                                spacing: { before: 0, after: 840, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "................................", size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
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
