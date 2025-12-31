
import { type Document as DocxDocument } from "docx";

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
        sections: [
            {
                properties: {},
                children: [
                    // Header - 2 columns layout simulation
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
                                                children: [
                                                    new TextRun({
                                                        text: "TRƯỜNG THPT",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{ten_truong}}",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "TỔ {{to_chuyen_mon}}",
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Độc lập - Tự do - Hạnh phúc",
                                                        bold: true,
                                                        size: 24,
                                                        underline: {},
                                                    }),
                                                ],
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
                        children: [
                            new TextRun({ text: "BIÊN BẢN", bold: true, size: 32 }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Sinh hoạt định kỳ của tổ/nhóm chuyên môn tháng: {{thang}}/{{nam}}",
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Lần: {{lan_hop}}", size: 24 })],
                    }),
                    new Paragraph({
                        text: "----------",
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "" }),
                    // Section I
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "I. Thời gian và địa điểm:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Thời gian: Vào lúc......giờ........ phút, ngày .......tháng ...... năm {{nam}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tại trường THPT {{ten_truong}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section II
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. Thành phần:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Chủ trì: {{chu_tri}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Thư ký: {{thu_ky}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Thành viên: {{thanh_vien}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Vắng: ........ Lí do...................................",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section III
                    new Paragraph({
                        children: [
                            new TextRun({ text: "III. Nội dung:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tổ trưởng thông qua mục đích, yêu cầu và nội dung của buổi họp và tiến hành từng nội dung cụ thể như sau:",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Đánh giá hoạt động tuần – tháng qua",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Nội dung chính: {{noi_dung_chinh}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "a) Ưu điểm: {{uu_diem}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "b) Hạn chế: {{han_che}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Triển khai kế hoạch tuần – tháng tới",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{ke_hoach_thang_toi}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Ý kiến thảo luận",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{y_kien_dong_gop}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4. Kết luận của chủ trì cuộc họp",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Các thành viên đồng ý hoàn toàn với ý kiến thảo luận và đóng góp trên.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Biên bản kết thúc lúc......giờ......phút cùng ngày.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    // Signatures
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
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{chu_tri}}", size: 24 }),
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
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{thu_ky}}", size: 24 }),
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
    const { Document, Packer, Paragraph, TextRun, AlignmentType } =
        await import("docx");

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "KẾ HOẠCH GIÁO DỤC CHỦ ĐỀ",
                                bold: true,
                                size: 32,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Trường: THPT {{ten_truong}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Tổ: {{to_chuyen_mon}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Họ và tên giáo viên: {{ten_giao_vien}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Ngày soạn: {{ngay_soan}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Chủ đề {{chu_de}}: {{ten_chu_de}}",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Môn học: Hoạt động trải nghiệm, hướng nghiệp; lớp: {{lop}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Thời gian thực hiện: ({{so_tiet}})",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section I - Mục tiêu
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Yêu cầu cần đạt:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_tieu_kien_thuc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Năng lực", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_tieu_nang_luc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "3. Phẩm chất", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_tieu_pham_chat}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section II - Thiết bị
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. THIẾT BỊ DẠY HỌC",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Đối với giáo viên",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{gv_chuanbi}}", size: 24 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Đối với học sinh",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{hs_chuanbi}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    // Section III - Hoạt động
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "III. CÁC HOẠT ĐỘNG DẠY HỌC",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "GỢI Ý NỘI DUNG SINH HOẠT DƯỚI CỜ VÀ SINH HOẠT LỚP",
                                bold: true,
                                size: 24,
                                underline: {},
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{hoat_dong_duoi_co}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ",
                                bold: true,
                                size: 24,
                                underline: {},
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "A. HOẠT ĐỘNG KHỞI ĐỘNG",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{hoat_dong_khoi_dong}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "B. HOẠT ĐỘNG KHÁM PHÁ",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{hoat_dong_kham_pha}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "C. HOẠT ĐỘNG LUYỆN TẬP",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{hoat_dong_luyen_tap}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "D. HOẠT ĐỘNG VẬN DỤNG",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{hoat_dong_van_dung}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "E. Tích hợp và hồ sơ:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{tich_hop_nls}}", size: 24 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{tich_hop_dao_duc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{ho_so_day_hoc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "HƯỚNG DẪN VỀ NHÀ",
                                bold: true,
                                size: 24,
                                underline: {},
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{huong_dan_on_tap}}", size: 24 }),
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
        sections: [
            {
                properties: {},
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
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "TRƯỜNG THPT {{ten_truong}}", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "TỔ: {{to_chuyen_mon}}", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 13, font: "Times New Roman", underline: {} })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ", bold: true, size: 16, font: "Times New Roman" })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "{{hoc_ky}} - NĂM HỌC 20... - 20...", bold: true, size: 14, font: "Times New Roman" })],
                    }),
                    new Paragraph({ text: "" }),

                    // Info
                    new Paragraph({ children: [new TextRun({ text: "Môn học/HĐGD: Hoạt động trải nghiệm, Hướng nghiệp", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Khối lớp: {{khoi}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Thời điểm đánh giá: {{ky_danh_gia}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Chủ đề/Nội dung: {{ten_chu_de}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // I. Objectives
                    new Paragraph({ children: [new TextRun({ text: "I. MỤC TIÊU ĐÁNH GIÁ", bold: true, size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{{muc_tieu}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // II. Forms & Products
                    new Paragraph({ children: [new TextRun({ text: "II. HÌNH THỨC VÀ SẢN PHẨM", bold: true, size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "- Hình thức tổ chức: {{hinh_thuc_to_chuc}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "- Sản phẩm yêu cầu: {{san_pham}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ children: [new TextRun({ text: "Nội dung nhiệm vụ cụ thể:", bold: true, italics: true, size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{{noi_dung_nhiem_vu}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),


                    // III. Matrix
                    new Paragraph({ children: [new TextRun({ text: "III. MA TRẬN ĐẶC TẢ", bold: true, size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{{ma_tran_dac_ta}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),


                    // IV. Rubric
                    new Paragraph({ children: [new TextRun({ text: "IV. TIÊU CHÍ ĐÁNH GIÁ (RUBRIC)", bold: true, size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{{bang_kiem_rubric}}", size: 13, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    new Paragraph({ text: "" }),
                    // Footer/Signatures
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
                                                children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 13, font: "Times New Roman" })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "GIÁO VIÊN RA ĐỀ", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 13, font: "Times New Roman" })],
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
        sections: [
            {
                properties: {},
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
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "TRƯỜNG THPT {{ten_truong}}",
                                                        bold: true,
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "TỔ {{to_chuyen_mon}}",
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Số: {{so_ke_hoach}}/KHNK-HĐTN-HN",
                                                        size: 20,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Độc lập – Tự do – Hạnh phúc",
                                                        bold: true,
                                                        size: 24,
                                                        underline: {},
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{dia_diem}}, ngày ... tháng {{thang}} năm {{nam}}",
                                                        italics: true,
                                                        size: 22,
                                                    }),
                                                ],
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
                        children: [
                            new TextRun({ text: "KẾ HOẠCH", bold: true, size: 32 }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Ngoại khoá khối {{khoi_lop}} - Chủ đề {{chu_de}} "{{ten_chu_de}}"',
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section I - Mục tiêu
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Yêu cầu cần đạt:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_dich_yeu_cau}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Năng lực:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nang_luc}}", size: 24 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "3. Phẩm chất:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{pham_chat}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    // Section II - Thời gian địa điểm
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. THỜI GIAN – ĐỊA ĐIỂM",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Thời gian: {{thoi_gian}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Địa điểm: {{dia_diem}}", size: 24 }),
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
                    // Section III - Kinh phí
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "III. KINH PHÍ THỰC HIỆN",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{kinh_phi}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    // Thành phần tham dự
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "THÀNH PHẦN THAM DỰ",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Toàn thể cán bộ, giáo viên, nhân viên.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Giáo viên phụ trách chính (Giảng dạy môn HĐTN, HN): {{giao_vien_phu_trach}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Học sinh: Học sinh khối {{khoi_lop}}.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4. Trang phục: Đồng phục trường.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Tổ chức thực hiện
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "TỔ CHỨC THỰC HIỆN:",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Chuẩn bị:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{chuan_bi}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Nội dung, hình thức thực hiện:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{kich_ban_chi_tiet}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{thong_diep_ket_thuc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'Trên đây là Kế hoạch tổ chức chương trình ngoại khóa chủ đề "{{ten_chu_de}}" của tổ hoạt động trải nghiệm, hướng nghiệp. Giáo viên và học sinh khối {{khoi_lop}} tham gia nghiêm túc, nhiệt tình để kế hoạch được thực hiện thành công tốt đẹp./.',
                                italics: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    // Signatures
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
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{to_truong}}", size: 24 }),
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
                                                        text: "HIỆU TRƯỞNG",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{hieu_truong}}",
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
                    new Paragraph({ text: "" }),
                    // Nơi nhận
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "* Nơi nhận:",
                                bold: true,
                                italics: true,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "- BGH (Chỉ đạo)", size: 22 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "- Tổ HĐTN-HN (thực hiện)", size: 22 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "- Lớp ....... (Thực hiện)", size: 22 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "- Lưu", size: 22 })],
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};

