import { saveAs } from "file-saver";
import { IntegrityService } from './integrity-service';
import { TextCleaningService } from './text-cleaning-service';
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle
} from "docx";
import type {
    LessonResult,
    AssessmentResult,
    MeetingResult,
    EventResult,
    NCBHResult
} from "@/lib/types";

/**
 * ARCHITECTURE 26.0 - UNIFIED HIGH-FIDELITY EXPORT SYSTEM
 * A professional export engine that supports recursive data rendering
 * for multi-dimensional AI outputs.
 */
export class DocumentExportSystem {
    private static instance: DocumentExportSystem;

    private constructor() { }

    public static getInstance(): DocumentExportSystem {
        if (!DocumentExportSystem.instance) {
            DocumentExportSystem.instance = new DocumentExportSystem();
        }
        return DocumentExportSystem.instance;
    }

    // ========================================
    // 🚀 CORE EXPORT METHODS
    // ========================================

    async exportLesson(result: LessonResult, options: { onProgress?: (p: number) => void } = {}): Promise<boolean> {
        console.log("[ExportSystem] Generating high-fidelity MoET 5512 Document...");
        options.onProgress?.(10);

        try {
            const children: any[] = [
                this.createHeader("KẾ HOẠCH BÀI DẠY (CHƯƠNG TRÌNH GDPT 2018)"),
                this.createSectionTitle("I. TÊN BÀI HỌC/CHỦ ĐỀ"),
                this.createField("", result.ten_bai || result.title || "..."),

                this.createSectionTitle("II. MỤC TIÊU"),
                new Paragraph({ children: [new TextRun({ text: "1. Kiến thức:", bold: true, size: 24 })] }),
                ...this.renderData(result.muc_tieu_kien_thuc),
                new Paragraph({ children: [new TextRun({ text: "2. Năng lực:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.muc_tieu_nang_luc),
                new Paragraph({ children: [new TextRun({ text: "3. Phẩm chất:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.muc_tieu_pham_chat),
                new Paragraph({ children: [new TextRun({ text: "4. Tích hợp Năng lực số:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.tich_hop_nls),

                this.createSectionTitle("III. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU"),
                new Paragraph({ children: [new TextRun({ text: "1. GV chuẩn bị:", bold: true, size: 24 })] }),
                ...this.renderData(result.gv_chuan_bi || result.thiet_bi_day_hoc),
                new Paragraph({ children: [new TextRun({ text: "2. HS chuẩn bị:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.hs_chuan_bi),

                this.createSectionTitle("IV. TIẾN TRÌNH DẠY HỌC"),
            ];

            options.onProgress?.(30);

            if (result.shdc) {
                children.push(...this.createTwoColumnActivity("SINH HOẠT DƯỚI CỜ", result.shdc));
            }

            children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 1: KHỞI ĐỘNG (5-7 phút)", result.hoat_dong_khoi_dong || ""));
            children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 2: KHÁM PHÁ (15-20 phút)", (result.hoat_dong_kham_pha || result.hoat_dong_kham_pha_1) || ""));
            children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 3: LUYỆN TẬP (10-15 phút)", (result.hoat_dong_luyen_tap || result.hoat_dong_luyen_tap_1) || ""));
            children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 4: VẬN DỤNG (5-10 phút)", result.hoat_dong_van_dung || ""));

            if (result.shl) {
                children.push(...this.createTwoColumnActivity("SINH HOẠT LỚP", result.shl));
            }

            options.onProgress?.(70);

            children.push(
                this.createSectionTitle("V. HỒ SƠ DẠY HỌC (PHỤ LỤC)"),
                ...this.renderData(result.ho_so_day_hoc || result.materials || "..."),
                this.createSectionTitle("VI. HƯỚNG DẪN VỀ NHÀ"),
                ...this.renderData(result.huong_dan_ve_nha || result.homework || "...")
            );

            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            this.triggerDownload(blob, `Giao_an_${result.ten_bai || "5512"}.docx`);
            return true;
        } catch (error) {
            console.error("[ExportSystem] Lesson export failed:", error);
            return false;
        }
    }

    async exportMeeting(result: MeetingResult, month: string): Promise<boolean> {
        console.log(`[ExportSystem] Generating Meeting Minutes for Month ${month}...`);
        try {
            const children = [
                this.createHeader(`BIÊN BẢN HỌP TỔ CHUYÊN MÔN - THÁNG ${month}`),
                this.createField("Nội dung:", result.noi_dung_chinh || result.title || "..."),
                this.createSectionTitle("I. ĐÁNH GIÁ CÔNG TÁC THÁNG QUA"),
                ...this.renderData(result.uu_diem || "Chưa có dữ liệu ưu điểm"),
                ...this.renderData(result.han_che || "Chưa có dữ liệu hạn chế"),
                this.createSectionTitle("II. TRIỂN KHAI CÔNG TÁC THÁNG TỚI"),
                ...this.renderData(result.ke_hoach_thang_toi || result.content || "..."),
                this.createSectionTitle("III. THỐNG NHẤT CHUYÊN MÔN"),
                ...this.renderData(result.ket_luan_cuoc_hop || result.conclusion || "...")
            ];
            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            this.triggerDownload(blob, `Bien_ban_Hop_To_${month}.docx`);
            return true;
        } catch (error) {
            console.error("[ExportSystem] Meeting export failed:", error);
            return false;
        }
    }

    async exportEvent(result: EventResult, metadata: { grade: string; month: string }): Promise<boolean> {
        console.log(`[ExportSystem] Generating Event Script for ${result.ten_chu_de || "New Event"}...`);
        try {
            const children = [
                this.createHeader(`KỊCH BẢN HOẠT ĐỘNG NGOẠI KHÓA/SỰ KIỆN`),
                this.createField("Chủ đề:", result.ten_chu_de || result.title),
                this.createField("Khối:", metadata.grade),
                this.createField("Tháng:", metadata.month),

                this.createSectionTitle("I. MỤC ĐÍCH & YÊU CẦU"),
                ...this.renderData(result.muc_tieu || result.muc_dich_yeu_cau),

                this.createSectionTitle("II. KỊCH BẢN CHI TIẾT"),
                ...this.renderData(result.kich_ban_chi_tiet || result.noi_dung || result.content),

                this.createSectionTitle("III. THÔNG ĐIỆP KẾT THÚC"),
                ...this.renderData(result.thong_diep_ket_thuc || result.conclusion)
            ];

            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            this.triggerDownload(blob, `Kich_ban_Ngoai_khoa_${result.ten_chu_de || "Script"}.docx`);
            return true;
        } catch (error) {
            console.error("[ExportSystem] Event export failed:", error);
            return false;
        }
    }

    async exportNCBH(result: NCBHResult, metadata: { grade: string; month: string }): Promise<boolean> {
        console.log(`[ExportSystem] Generating NCBH Profile for Month ${metadata.month}...`);
        try {
            const children = [
                this.createHeader(`HỒ SƠ NGHIÊN CỨU BÀI HỌC - THÁNG ${metadata.month}`),
                this.createField("Khối:", metadata.grade),
                this.createField("Tên bài học nghiên cứu:", result.ten_bai || result.title),

                this.createSectionTitle("I. LÝ DO CHỌN BÀI"),
                ...this.renderData(result.ly_do_chon),

                this.createSectionTitle("II. MỤC TIÊU NGHIÊN CỨU"),
                ...this.renderData(result.muc_tieu || result.objectives),

                this.createSectionTitle("III. CHUỖI HOẠT ĐỘNG THIẾT KẾ"),
                ...this.renderData(result.chuoi_hoat_dong || result.methodology),

                this.createSectionTitle("IV. PHƯƠNG ÁN HỖ TRỢ"),
                ...this.renderData(result.phuong_an_ho_tro || result.observationFocus),

                this.createSectionTitle("V. CHIA SẺ CỦA NGƯỜI DẠY"),
                ...this.renderData(result.chia_se_nguoi_day),

                this.createSectionTitle("VI. NHẬN XÉT CỦA NGƯỜI DỰ"),
                ...this.renderData(result.nhan_xet_nguoi_du || result.analysisPoints),

                this.createSectionTitle("VII. NGUYÊN NHÂN & GIẢI PHÁP"),
                ...this.renderData(result.nguyen_nhan_giai_phap),

                this.createSectionTitle("VIII. BÀI HỌC KINH NGHIỆM"),
                ...this.renderData(result.bai_hoc_kinh_nghiem)
            ];
            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            this.triggerDownload(blob, `Ho_so_NCBH_${result.ten_bai || "T" + metadata.month}.docx`);
            return true;
        } catch (error) {
            console.error("[ExportSystem] NCBH export failed:", error);
            return false;
        }
    }

    async exportAssessmentPlan(result: AssessmentResult, metadata: { grade: string; term: string }): Promise<boolean> {
        console.log(`[ExportSystem] Generating Assessment Plan for ${metadata.term}...`);
        try {
            const children = [
                this.createHeader(`KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ - ${metadata.term}`),
                this.createField("Khối:", metadata.grade),
                this.createField("Trọng tâm:", result.title || result.ten_ke_hoach || metadata.term),

                this.createSectionTitle("I. MỤC ĐÍCH"),
                ...this.renderData(result.purpose || result.muc_tieu),

                this.createSectionTitle("II. MA TRẬN ĐỀ KIỂM TRA"),
                ...this.renderData(result.matrix || "..."),

                this.createSectionTitle("III. CẤU TRÚC / ĐỀ MINH HỌA"),
                ...this.renderData(result.structure || result.noi_dung_nhiem_vu),

                this.createSectionTitle("IV. HƯỚNG DẪN CHẤM (RUBRIC)"),
                ...this.renderData(result.rubric_text || result.bang_kiem_rubric || result.cong_cu_danh_gia)
            ];
            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            this.triggerDownload(blob, `Ke_hoach_Danh_gia_${metadata.term}.docx`);
            return true;
        } catch (error) {
            console.error("[ExportSystem] Assessment export failed:", error);
            return false;
        }
    }

    // ========================================
    // 🛠️ INTERNAL FORMATTING HELPERS
    // ========================================

    private createHeader(text: string): Paragraph {
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
                new TextRun({ text, bold: true, size: 32, color: "2E59A7" })
            ],
        });
    }

    private createSectionTitle(text: string): Paragraph {
        return new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
                new TextRun({ text, bold: true, size: 28, underline: { type: "single" } })
            ],
        });
    }

    private createField(label: string, value: any): Paragraph {
        const cleaner = TextCleaningService.getInstance();
        const textValue = typeof value === "string" ? cleaner.cleanFinalOutput(value) : "...";
        return new Paragraph({
            spacing: { after: 100 },
            children: [
                new TextRun({ text: label, bold: true, size: 24 }),
                new TextRun({ text: ` ${textValue}`, size: 24 })
            ],
        });
    }

    private createTwoColumnActivity(title: string, content: any): any[] {
        const textContent = typeof content === "string" ? content : JSON.stringify(content);
        const { cot1, cot2 } = this.parseColumns(textContent);
        return [
            new Paragraph({
                spacing: { before: 200, after: 100 },
                children: [new TextRun({ text: title, bold: true, size: 26, color: "444444" })]
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                                children: [
                                    new Paragraph({ children: [new TextRun({ text: "HOẠT ĐỘNG CỦA GV & HS", bold: true, size: 22 })], alignment: AlignmentType.CENTER }),
                                    ...this.renderData(cot1)
                                ]
                            }),
                            new TableCell({
                                width: { size: 50, type: WidthType.PERCENTAGE },
                                borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } },
                                children: [
                                    new Paragraph({ children: [new TextRun({ text: "SẢN PHẨM DỰ KIẾN", bold: true, size: 22 })], alignment: AlignmentType.CENTER }),
                                    ...this.renderData(cot2)
                                ]
                            })
                        ]
                    })
                ]
            })
        ];
    }

    private renderText(text: string): Paragraph[] {
        if (!text) return [new Paragraph({ text: "..." })];
        const cleaner = TextCleaningService.getInstance();
        const cleanedText = cleaner.cleanFinalOutput(text);

        return cleanedText.split("\n").map(line => {
            const trimmedLine = line.trim();
            const isQuote = trimmedLine.startsWith("> ");
            const content = isQuote ? trimmedLine.substring(2) : line;

            return new Paragraph({
                children: this.parseMarkdownLine(content, isQuote),
                spacing: { before: isQuote ? 100 : 0, after: 80 },
                indent: isQuote ? { left: 720 } : undefined // Indent quotes
            });
        });
    }

    private parseMarkdownLine(line: string, isQuote: boolean): TextRun[] {
        const parts: TextRun[] = [];
        const boldRegex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(line)) !== null) {
            // Add text before match
            if (match.index > lastIndex) {
                parts.push(new TextRun({
                    text: line.substring(lastIndex, match.index),
                    size: 22,
                    italics: isQuote
                }));
            }
            // Add bold part
            parts.push(new TextRun({
                text: match[1],
                bold: true,
                size: 22,
                italics: isQuote
            }));
            lastIndex = boldRegex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < line.length) {
            parts.push(new TextRun({
                text: line.substring(lastIndex),
                size: 22,
                italics: isQuote
            }));
        }

        if (parts.length === 0 && line.length > 0) {
            parts.push(new TextRun({ text: line, size: 22, italics: isQuote }));
        }

        return parts.length > 0 ? parts : [new TextRun({ text: " ", size: 22 })];
    }

    /**
     * Advanced Recursive Rendering
     * Handles nested objects/arrays for Rubrics, Matrices, etc.
     */
    private renderData(data: any): Paragraph[] {
        if (!data) return [new Paragraph({ text: "..." })];
        if (typeof data === "string") return this.renderText(data);

        const paragraphs: Paragraph[] = [];

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                if (typeof item === "string") {
                    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `- ${item}`, size: 22 })], spacing: { after: 50 } }));
                } else if (typeof item === "object") {
                    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Mục ${index + 1}:`, bold: true, size: 22 })], spacing: { before: 100 } }));
                    paragraphs.push(...this.renderData(item));
                }
            });
        } else if (typeof data === "object" && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
                if (key === "metadata") return; // Skip internal metadata
                const label = key.replace(/_/g, " ").toUpperCase();
                paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${label}:`, bold: true, size: 22 })], spacing: { before: 50 } }));
                if (typeof value === "object") {
                    paragraphs.push(...this.renderData(value));
                } else {
                    paragraphs.push(new Paragraph({ children: [new TextRun({ text: String(value), size: 22 })], spacing: { after: 50 } }));
                }
            });
        }

        return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: "..." })];
    }

    private parseColumns(content: string): { cot1: string; cot2: string } {
        // High-precision isolation
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const json = JSON.parse(jsonMatch[0]);
                if (json.steps && Array.isArray(json.steps)) {
                    return {
                        cot1: json.steps.map((s: any) => s.teacher_action || s.instruction || s.action || "").join("\n\n"),
                        cot2: json.steps.map((s: any) => s.student_action || s.product || s.result || "").join("\n\n")
                    };
                }
                if (json.to_chuc) {
                    const tc = String(json.to_chuc);
                    const cot2M = tc.match(/\{\{cot_2\}\}/i);
                    if (cot2M) {
                        const split = tc.split(/\{\{cot_2\}\}/i);
                        return {
                            cot1: (json.muc_tieu ? `MỤC TIÊU: ${json.muc_tieu}\n\n` : "") + (split[0]?.replace(/\{\{cot_1\}\}/i, "")?.trim() || tc),
                            cot2: split[1]?.trim() || "..."
                        };
                    }
                }
            }
        } catch (e) { }

        // Regex Fallback
        const cot2Match = content.match(/\{\{cot_2\}\}/i);
        if (cot2Match) {
            const split = content.split(/\{\{cot_2\}\}/i);
            return {
                cot1: split[0]?.replace(/\{\{cot_1\}\}/i, "")?.trim() || content,
                cot2: split[1]?.trim() || "..."
            };
        }

        // Section Search Fallback
        const splitWord = content && content.includes("SẢN PHẨM") ? "SẢN PHẨM" : "HS CHUẨN BỊ";
        const split = content.split(splitWord);
        if (split.length > 1) {
            return { cot1: split[0].trim(), cot2: split[1].trim() };
        }

        return { cot1: content, cot2: "..." };
    }

    private async triggerDownload(blob: Blob, fileName: string) {
        // 1. Sanitize Filename (Critical for Windows/Download)
        // Remove special chars like / \ : * ? " < > |
        const safeName = fileName.replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, "_");

        // 2. Force MIME Type
        const docxBlob = new Blob([blob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

        // 3. Native Download (More robust than file-saver)
        const url = window.URL.createObjectURL(docxBlob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = safeName;

        // Append to body to ensure click works in all browsers (Firefox requirement)
        document.body.appendChild(anchor);
        anchor.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);
        }, 100);

        // 💎 INTEGRITY LOG
        const seal = await IntegrityService.seal(docxBlob, safeName);
        console.log(`[Integrity] 🛡️ DOCUMENT SEALED: ${seal.checksum} at ${seal.timestamp}`);
    }
}
