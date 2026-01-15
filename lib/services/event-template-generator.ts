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
import { DEPT_INFO, getAllMembers } from "@/lib/config/department";

/**
 * 🧹 TEXT CLEANER UTILS (v65.5)
 */
function cleanGradeName(input: string): string {
    if (!input) return "";
    return input.replace(/Học sinh khối|Khối|Lớp/gi, "").trim();
}

function cleanObjectiveLabel(content: string, label: string): string {
    if (!content) return "";
    // Xử lý linh hoạt cả trường hợp có hoặc không có dấu gạch ngang/đầu dòng
    const regex = new RegExp(`^([-*\\s]*)${label}[:\\s-]*`, 'i');
    return content.replace(regex, "").trim();
}

/**
 * 🛠️ DECREE 30 TABLE ENGINE (v65.0)
 * Chuyển đổi Markdown Table từ AI sang Table Word chính xác.
 */
function parseMarkdownTable(text: string): Table | null {
    if (!text.includes("|") || !text.includes("---")) return null;

    const lines = text.trim().split("\n");
    const tableLines = lines.filter(l => l.includes("|") && !l.includes("---"));
    if (tableLines.length < 2) return null;

    try {
        const rows = tableLines.map(line => {
            const cells = line.split("|").filter(c => c.trim().length >= 0);
            // Bỏ cell đầu/cuối nếu line bắt đầu/kết thúc bằng |
            const cleanCells = line.startsWith("|") ? cells.slice(0, cells.length) : cells;
            const finalCells = cleanCells.map(c => c.trim()).filter((c, i) => i < 10); // Giới hạn cột tránh lỗi

            if (finalCells.length < 2) return null;

            return new TableRow({
                children: finalCells.map(cellText => new TableCell({
                    width: { size: 100 / finalCells.length, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                        children: [new TextRun({ text: cellText, size: 24 })], // 12pt cho bảng
                        spacing: { before: 80, after: 80 }
                    })],
                    verticalAlign: VerticalAlign.CENTER,
                }))
            });
        }).filter(Boolean) as TableRow[];

        if (rows.length === 0) return null;

        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: rows,
        });
    } catch (e) {
        console.error("Table parse error:", e);
        return null;
    }
}

export const generateEventDocx = async (data: any): Promise<Blob> => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: WORD_STANDARDS.font,
                        size: WORD_STANDARDS.fontSize,
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
                            [DEPT_INFO.upperAgency, DEPT_INFO.school, DEPT_INFO.name]
                        ),
                    }),


                    // --- TIÊU ĐỀ ---
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "KẾ HOẠCH", bold: true, size: WORD_STANDARDS.fontSizeTitle })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `Tổ chức hoạt động ngoại khóa khối ${cleanGradeName(data.khoi_lop || data.doi_tuong || "")}`, bold: true, size: WORD_STANDARDS.fontSizeLarge })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `Chủ đề: "${data.ten_chu_de || data.title || ""}"`, bold: true, size: WORD_STANDARDS.fontSizeLarge, italics: true })],
                        spacing: { after: 300 },
                    }),

                    // --- I. MỤC TIÊU ---
                    new Paragraph({
                        children: [new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 28 })],
                        spacing: { before: 200, after: 120 },
                    }),
                    new Paragraph({
                        indent: { firstLine: WORD_STANDARDS.indent },
                        children: [new TextRun({ text: "1. Yêu cầu cần đạt:", bold: true })],
                    }),
                    ...formatContent(data.muc_dich_yeu_cau, "Yêu cầu"),

                    new Paragraph({
                        indent: { firstLine: WORD_STANDARDS.indent },
                        children: [new TextRun({ text: "2. Năng lực và Phẩm chất:", bold: true })],
                        spacing: { before: 120 },
                    }),
                    ...formatContent(data.nang_luc, "Năng lực"),
                    ...(data.pham_chat
                        ? formatContent(data.pham_chat, "Phẩm chất")
                        : formatContent("Trách nhiệm, trung thực, nhân ái.", "Phẩm chất")
                    ),

                    // --- II. THỜI GIAN - ĐỊA ĐIỂM ---
                    new Paragraph({
                        children: [new TextRun({ text: "II. THỜI GIAN – ĐỊA ĐIỂM", bold: true, size: 28 })],
                        spacing: { before: 240, after: 120 },
                    }),
                    new Paragraph({
                        indent: { firstLine: WORD_STANDARDS.indent },
                        children: [
                            new TextRun({ text: "- Thời gian: ", bold: true }),
                            new TextRun({ text: data.thoi_gian || "Trong tiết Sinh hoạt dưới cờ (45 phút)" }),
                        ],
                    }),
                    new Paragraph({
                        indent: { firstLine: WORD_STANDARDS.indent },
                        children: [
                            new TextRun({ text: "- Địa điểm: ", bold: true }),
                            new TextRun({ text: data.dia_diem || "Sân trường THPT Bùi Thị Xuân" }),
                        ],
                    }),

                    // --- III. NỘI DUNG VÀ TIẾN TRÌNH ---
                    new Paragraph({
                        children: [new TextRun({ text: "III. NỘI DUNG VÀ TIẾN TRÌNH", bold: true, size: 28 })],
                        spacing: { before: 240, after: 120 },
                    }),
                    ...formatEventContent(data.interaction),
                    ...formatEventContent(data.kich_ban_chi_tiet),

                    // --- IV. KINH PHÍ DỰ KIẾN ---
                    new Paragraph({
                        children: [new TextRun({ text: "IV. KINH PHÍ DỰ KIẾN", bold: true, size: 28 })],
                        spacing: { before: 240, after: 120 },
                    }),
                    ...formatEventContent(data.kinh_phi),

                    // --- V. CHUẨN BỊ VÀ TỔ CHỨC THỰC HIỆN ---
                    new Paragraph({
                        children: [new TextRun({ text: "V. CHUẨN BỊ VÀ TỔ CHỨC THỰC HIỆN", bold: true, size: 28 })],
                        spacing: { before: 240, after: 120 },
                    }),
                    new Paragraph({
                        indent: { firstLine: WORD_STANDARDS.indent },
                        children: [new TextRun({ text: "1. Công tác chuẩn bị:", bold: true })],
                    }),
                    ...formatEventContent(data.chuan_bi),

                    new Paragraph({
                        indent: { firstLine: WORD_STANDARDS.indent },
                        children: [new TextRun({ text: "2. Tổ chức thực hiện:", bold: true })],
                        spacing: { before: 120 },
                    }),
                    ...formatEventContent(data.footer_admin),

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: `* Thông điệp: ${data.thong_diep_ket_thuc || ""}`, italics: true, bold: true, color: "2E7D32" })],
                        spacing: { before: 300, after: 400 },
                    }),

                    // --- CHỮ KÝ ---
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: NO_BORDER,
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN", bold: true, size: 26 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 22 })],
                                                spacing: { after: 1200 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: data.to_truong || "Trần Hoàng Thạch", bold: true, size: 26 })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "BAN GIÁM HIỆU", bold: true, size: 26 })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(Ký và đóng dấu)", italics: true, size: 22 })],
                                                spacing: { after: 1200 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: " ", bold: true, size: 26 })],
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

function formatEventContent(val: any): (Paragraph | Table)[] {
    if (!val || val === "...") return [];
    const text = String(val);

    // 1. Kiểm tra xem có bảng Markdown không
    const table = parseMarkdownTable(text);
    if (table) return [table];

    // 2. Định dạng paragraph thông thườn
    return text.split("\n").map(line => {
        let trimmed = line.trim();
        if (!trimmed || trimmed === "Năng lực:" || trimmed === "Phẩm chất:") return null;

        // Xóa các tiêu đề trùng lặp
        trimmed = trimmed.replace(/^(I|II|III|IV|V)\..*$/g, "").trim();
        if (!trimmed) return null;

        const hasBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed);
        const bullet = hasBullet ? "" : "- ";

        return new Paragraph({
            indent: { firstLine: WORD_STANDARDS.indent },
            children: [new TextRun({ text: `${bullet}${trimmed}` })],
            spacing: { before: 100, after: 100 },
        });
    }).filter(Boolean) as Paragraph[];
}

function formatContent(val: any, label?: string): Paragraph[] {
    if (val === null || val === undefined || val === "" || val === "...") return [];

    const text = String(val);
    return text.split("\n").map(line => {
        let trimmed = line.trim();
        if (!trimmed) return null;

        // Làm sạch các dấu ba chấm hoặc ký tự rác còn sót lại
        trimmed = trimmed.replace(/\.{2,}/g, "").trim();
        if (!trimmed) return null;

        // Khử nhãn nếu có (VD: Năng lực: Tự chủ -> Tự chủ)
        if (label) {
            trimmed = cleanObjectiveLabel(trimmed, label);
        }
        if (!trimmed) return null;

        // Không chèn gạch đầu dòng nếu đã có hoặc là số thứ tự
        const hasBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed);
        const bullet = hasBullet ? "" : "- ";

        return new Paragraph({
            indent: { firstLine: WORD_STANDARDS.indent },
            children: [new TextRun({ text: `${bullet}${trimmed}` })],
            spacing: { before: 80, after: 80 },
            alignment: AlignmentType.JUSTIFIED
        });
    }).filter(Boolean) as Paragraph[];
}
