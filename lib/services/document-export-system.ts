import { PHIEU_HOC_TAP_RUBRIC_DATABASE, getPhieuHocTapTheoHoatDong, getRubricTheoHoatDong, getPhieuHocTapTheoTuKhoa, getRubricTheoTuKhoa } from "@/lib/data/phieu-hoc-tap-rubric-database";
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
    BorderStyle,
    HeadingLevel,
    ShadingType,
    VerticalAlign
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
    // ðŸš€ CORE EXPORT METHODS
    // ========================================

    async exportLesson(result: LessonResult, options: { onProgress?: (p: number) => void } = {}): Promise<boolean> {
        console.log("[ExportSystem] Generating high-fidelity MoET 5512 Document...");
        options.onProgress?.(10);

        try {
            const children: any[] = [
                this.createHeader("Káº¾ HOáº CH BÃ€I Dáº Y (CHÆ¯Æ NG TRÃŒNH GDPT 2018)"),
                this.createSectionTitle("I. TÃŠN BÃ€I Há»ŒC/CHá»¦ Äá»€"),
                this.createField("", result.ten_bai || result.title || "..."),

                this.createSectionTitle("II. Má»¤C TIÃŠU"),
                new Paragraph({ children: [new TextRun({ text: "1. Kiáº¿n thá»©c:", bold: true, size: 24 })] }),
                ...this.renderData(result.muc_tieu_kien_thuc),
                new Paragraph({ children: [new TextRun({ text: "2. NÄƒng lá»±c:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.muc_tieu_nang_luc),
                new Paragraph({ children: [new TextRun({ text: "3. Pháº©m cháº¥t:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.muc_tieu_pham_chat),
                new Paragraph({ children: [new TextRun({ text: "4. TÃ­ch há»£p NÄƒng lá»±c sá»‘:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.tich_hop_nls),

                this.createSectionTitle("III. THIáº¾T Bá»Š Dáº Y Há»ŒC VÃ€ Há»ŒC LIá»†U"),
                new Paragraph({ children: [new TextRun({ text: "1. GV chuáº©n bá»‹:", bold: true, size: 24 })] }),
                ...this.renderData(result.gv_chuan_bi || result.thiet_bi_day_hoc),
                new Paragraph({ children: [new TextRun({ text: "2. HS chuáº©n bá»‹:", bold: true, size: 24 })], spacing: { before: 100 } }),
                ...this.renderData(result.hs_chuan_bi),

                this.createSectionTitle("IV. TIáº¾N TRÃŒNH Dáº Y Há»ŒC"),
            ];

            options.onProgress?.(30);

            if (result.shdc) {
                children.push(...this.createTwoColumnActivity("SINH HOáº T DÆ¯á»šI Cá»œ", result.shdc));
            }

            children.push(...this.createTwoColumnActivity("HOáº T Äá»˜NG 1: KHá»žI Äá»˜NG (5-7 phÃºt)", result.hoat_dong_khoi_dong || ""));
            children.push(...this.createTwoColumnActivity("HOáº T Äá»˜NG 2: KHÃM PHÃ (15-20 phÃºt)", (result.hoat_dong_kham_pha || result.hoat_dong_kham_pha_1) || ""));
            children.push(...this.createTwoColumnActivity("HOáº T Äá»˜NG 3: LUYá»†N Táº¬P (10-15 phÃºt)", (result.hoat_dong_luyen_tap || result.hoat_dong_luyen_tap_1) || ""));
            children.push(...this.createTwoColumnActivity("HOáº T Äá»˜NG 4: Váº¬N Dá»¤NG (5-10 phÃºt)", result.hoat_dong_van_dung || ""));

            if (result.shl) {
                children.push(...this.createTwoColumnActivity("SINH HOáº T Lá»šP", result.shl));
            }

            options.onProgress?.(70);

            options.onProgress?.(80);

            // Tá»° Äá»˜NG BÆ M PHá»¤ Lá»¤C (Inflation Trick v2.0)
            children.push(this.createSectionTitle("V. Há»’ SÆ  Dáº Y Há»ŒC (PHá»¤ Lá»¤C)"));

            // 1. ThÃªm Phá»¥ lá»¥c tá»« AI viáº¿t
            children.push(...this.renderData(result.ho_so_day_hoc || result.materials || ""));

            // 2. Tá»± Ä‘á»™ng truy váº¥n Database Ä‘á»ƒ thÃªm Máº«u Phiáº¿u/Rubric chuáº©n (TÄƒng Ä‘á»™ dÃ i & chuyÃªn nghiá»‡p)
            const autoAppendices = this.generateAutoAppendices(result);
            children.push(...autoAppendices);

            children.push(
                this.createSectionTitle("VI. HÆ¯á»šNG DáºªN Vá»€ NHÃ€"),
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
                this.createHeader(`BIÃŠN Báº¢N Há»ŒP Tá»” CHUYÃŠN MÃ”N - THÃNG ${month}`),
                this.createField("Ná»™i dung:", result.noi_dung_chinh || result.title || "..."),
                this.createSectionTitle("I. ÄÃNH GIÃ CÃ”NG TÃC THÃNG QUA"),
                ...this.renderData(result.uu_diem || "ChÆ°a cÃ³ dá»¯ liá»‡u Æ°u Ä‘iá»ƒm"),
                ...this.renderData(result.han_che || "ChÆ°a cÃ³ dá»¯ liá»‡u háº¡n cháº¿"),
                this.createSectionTitle("II. TRIá»‚N KHAI CÃ”NG TÃC THÃNG Tá»šI"),
                ...this.renderData(result.ke_hoach_thang_toi || result.content || "..."),
                this.createSectionTitle("III. THá»NG NHáº¤T CHUYÃŠN MÃ”N"),
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
                this.createHeader(`Ká»ŠCH Báº¢N HOáº T Äá»˜NG NGOáº I KHÃ“A/Sá»° KIá»†N`),
                this.createField("Chá»§ Ä‘á»:", result.ten_chu_de || result.title),
                this.createField("Khá»‘i:", metadata.grade),
                this.createField("ThÃ¡ng:", metadata.month),

                this.createSectionTitle("I. Má»¤C ÄÃCH & YÃŠU Cáº¦U"),
                ...this.renderData(result.muc_tieu || result.muc_dich_yeu_cau),

                this.createSectionTitle("II. Ká»ŠCH Báº¢N CHI TIáº¾T"),
                ...this.renderData(result.kich_ban_chi_tiet || result.noi_dung || result.content),

                this.createSectionTitle("III. THÃ”NG ÄIá»†P Káº¾T THÃšC"),
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
                this.createHeader(`Há»’ SÆ  NGHIÃŠN Cá»¨U BÃ€I Há»ŒC - THÃNG ${metadata.month}`),
                this.createField("Khá»‘i:", metadata.grade),
                this.createField("TÃªn bÃ i há»c nghiÃªn cá»©u:", result.ten_bai || result.title),

                this.createSectionTitle("I. LÃ DO CHá»ŒN BÃ€I"),
                ...this.renderData(result.ly_do_chon),

                this.createSectionTitle("II. Má»¤C TIÃŠU NGHIÃŠN Cá»¨U"),
                ...this.renderData(result.muc_tieu || result.objectives),

                this.createSectionTitle("III. CHUá»–I HOáº T Äá»˜NG THIáº¾T Káº¾"),
                ...this.renderData(result.chuoi_hoat_dong || result.methodology),

                this.createSectionTitle("IV. PHÆ¯Æ NG ÃN Há»– TRá»¢"),
                ...this.renderData(result.phuong_an_ho_tro || result.observationFocus),

                this.createSectionTitle("V. CHIA Sáºº Cá»¦A NGÆ¯á»œI Dáº Y"),
                ...this.renderData(result.chia_se_nguoi_day),

                this.createSectionTitle("VI. NHáº¬N XÃ‰T Cá»¦A NGÆ¯á»œI Dá»°"),
                ...this.renderData(result.nhan_xet_nguoi_du || result.analysisPoints),

                this.createSectionTitle("VII. NGUYÃŠN NHÃ‚N & GIáº¢I PHÃP"),
                ...this.renderData(result.nguyen_nhan_giai_phap),

                this.createSectionTitle("VIII. BÃ€I Há»ŒC KINH NGHIá»†M"),
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
                this.createHeader(`Káº¾ HOáº CH KIá»‚M TRA ÄÃNH GIÃ - ${metadata.term}`),
                this.createField("Khá»‘i:", metadata.grade),
                this.createField("Trá»ng tÃ¢m:", result.title || result.ten_ke_hoach || metadata.term),

                this.createSectionTitle("I. Má»¤C ÄÃCH"),
                ...this.renderData(result.purpose || result.muc_tieu),

                this.createSectionTitle("II. MA TRáº¬N Äá»€ KIá»‚M TRA"),
                ...this.renderData(result.matrix || "..."),

                this.createSectionTitle("III. Cáº¤U TRÃšC / Äá»€ MINH Há»ŒA"),
                ...this.renderData(result.structure || result.noi_dung_nhiem_vu),

                this.createSectionTitle("IV. HÆ¯á»šNG DáºªN CHáº¤M (RUBRIC)"),
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
    // ðŸ› ï¸ INTERNAL FORMATTING HELPERS
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
        console.log(`[ExportSystem] ðŸš€ ARCH 26.1: Generating Multi-Segment Table for: ${title}`);

        const textContent = typeof content === "string" ? content : JSON.stringify(content);
        const { intro, segments } = this.parseAllSegmentsWithIntro(textContent);

        const paragraphs: any[] = [
            new Paragraph({
                spacing: { before: 300, after: 150 },
                children: [new TextRun({ text: title, bold: true, size: 28, color: "2E59A7", underline: { type: "single" } })]
            })
        ];

        // Náº¿u cÃ³ ná»™i dung dáº«n nháº­p (vÃ­ dá»¥: TÃªn hoáº¡t Ä‘á»™ng tá»« AI), in ra trÆ°á»›c
        if (intro && intro.length > 5) {
            paragraphs.push(...this.renderData(intro));
        }

        const rows = [
            new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        shading: { fill: "E8EEF7", type: ShadingType.CLEAR, color: "auto" },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "HOáº T Äá»˜NG Cá»¦A GIÃO VIÃŠN", bold: true, size: 22, color: "2E59A7" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        shading: { fill: "F2F5FA", type: ShadingType.CLEAR, color: "auto" },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "HOáº T Äá»˜NG Cá»¦A Há»ŒC SINH", bold: true, size: 22, color: "2E59A7" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            })
        ];

        segments.forEach((seg, idx) => {
            rows.push(new TableRow({
                children: [
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { bottom: { style: idx === segments.length - 1 ? BorderStyle.SINGLE : BorderStyle.DASHED, size: 1, color: "DDDDDD" } },
                        children: [...this.renderData(seg.cot1)]
                    }),
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { bottom: { style: idx === segments.length - 1 ? BorderStyle.SINGLE : BorderStyle.DASHED, size: 1, color: "DDDDDD" } },
                        children: [...this.renderData(seg.cot2)]
                    })
                ]
            }));
        });

        paragraphs.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: rows
        }));

        return paragraphs;
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
                    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Má»¥c ${index + 1}:`, bold: true, size: 22 })], spacing: { before: 100 } }));
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

    /**
     * Parse All Segments (Arch 26.0)
     * Thay tháº¿ parseColumns cÅ© - Há»— trá»£ má»• xáº» Ä‘a táº§ng nhiá»u cáº·p GV/HS
     */
    private parseAllSegmentsWithIntro(content: string): { intro: string, segments: { cot1: string; cot2: string }[] } {
        if (!content || content.trim().length === 0) {
            return { intro: "", segments: [{ cot1: "Äang cáº­p nháº­t ná»™i dung...", cot2: "..." }] };
        }

        const segments: { cot1: string; cot2: string }[] = [];
        let intro = "";

        try {
            // Case 1: JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const json = JSON.parse(jsonMatch[0]);
                if (json.steps && Array.isArray(json.steps)) {
                    json.steps.forEach((s: any) => {
                        segments.push({
                            cot1: s.teacher_action || s.instruction || "GV tá»• chá»©c.",
                            cot2: s.student_action || s.product || "HS thá»±c hiá»‡n."
                        });
                    });
                    return { intro: json.module_title || "", segments };
                }
            }
        } catch (e) { }

        // Case 2: Multi-Segment Markers
        const markerRegex = /\{\{cot_1\}\}([\s\S]*?)\{\{cot_2\}\}([\s\S]*?)(?=\{\{cot_1\}\}|$)/gi;
        let match;
        let firstIndex = -1;

        while ((match = markerRegex.exec(content)) !== null) {
            if (firstIndex === -1) firstIndex = match.index;
            segments.push({
                cot1: match[1].trim(),
                cot2: match[2].trim()
            });
        }

        if (firstIndex !== -1) {
            intro = content.substring(0, firstIndex).trim();
        }

        // Fallback
        if (segments.length === 0) {
            return { intro: "", segments: [{ cot1: content, cot2: "..." }] };
        }

        return { intro, segments };
    }

    // ========================================
    // ðŸŽˆ INFLATION ENGINE (Tá»° Äá»˜NG BÆ M Ná»˜I DUNG)
    // ========================================

    private generateAutoAppendices(result: LessonResult): any[] {
        const blocks: any[] = [];
        const foundMaterials = new Set<string>();

        const searchTargets = [
            { field: result.hoat_dong_khoi_dong, name: "Khá»Ÿi Ä‘á»™ng" },
            { field: result.hoat_dong_kham_pha, name: "KhÃ¡m phÃ¡" },
            { field: result.hoat_dong_luyen_tap, name: "Luyá»‡n táº­p" },
            { field: result.hoat_dong_van_dung, name: "Váº­n dá»¥ng" }
        ];

        searchTargets.forEach(target => {
            if (!target.field) return;

            // STRATEGY 1: Activity-based search
            const phieuList = getPhieuHocTapTheoHoatDong(target.name);
            const rubricList = getRubricTheoHoatDong(target.name);

            this.appendMaterials(blocks, phieuList, rubricList, foundMaterials);
        });

        // STRATEGY 2: Context-Aware (Theme-based) search v34.0
        const theme = result.ten_bai || result.title || "";
        if (theme) {
            console.log(`[ExportSystem] ðŸ§ª Context-Aware Search for: ${theme}`);
            const themePhieus = getPhieuHocTapTheoTuKhoa(theme);
            const themeRubrics = getRubricTheoTuKhoa(theme);
            this.appendMaterials(blocks, themePhieus, themeRubrics, foundMaterials);
        }

        return blocks;
    }

    private appendMaterials(blocks: any[], phieus: any[], rubrics: any[], foundSet: Set<string>) {
        phieus.forEach(phieu => {
            if (!foundSet.has(phieu.ma)) {
                foundSet.add(phieu.ma);
                blocks.push(new Paragraph({
                    children: [new TextRun({ text: `\n\nPHá»¤ Lá»¤C: ${phieu.ten.toUpperCase()} (${phieu.ma})`, bold: true, size: 28 })],
                    heading: HeadingLevel.HEADING_3
                }));
                blocks.push(new Paragraph({
                    children: [new TextRun({ text: `MÃ´ táº£: ${phieu.mo_ta}`, italics: true, size: 22 })]
                }));

                phieu.cau_truc.forEach((section: any) => {
                    blocks.push(new Paragraph({
                        children: [new TextRun({ text: `\n${section.phan}`, bold: true, size: 24 })],
                        spacing: { before: 100 }
                    }));
                    blocks.push(new Paragraph({
                        children: [new TextRun({ text: `HÆ°á»›ng dáº«n: ${section.huong_dan}`, size: 22 })]
                    }));
                    const questions = section.cau_hoi_mau.map((q: string) => new Paragraph({
                        children: [new TextRun({ text: `- ${q}`, size: 22 })],
                        bullet: { level: 0 }
                    }));
                    blocks.push(...questions);
                });
                blocks.push(new Paragraph({
                    children: [new TextRun({ text: `LÆ°u Ã½ sá»­ dá»¥ng: ${phieu.luu_y_su_dung.join('. ')}`, color: "666666", size: 20 })],
                    spacing: { before: 100 }
                }));
            }
        });

        rubrics.forEach(rubric => {
            if (!foundSet.has(rubric.ma)) {
                foundSet.add(rubric.ma);
                blocks.push(new Paragraph({
                    children: [new TextRun({ text: `\n\nPHá»¤ Lá»¤C: ${rubric.ten.toUpperCase()} (${rubric.ma})`, bold: true, size: 28 })],
                    heading: HeadingLevel.HEADING_3
                }));

                const tableRows = [
                    new TableRow({
                        children: [
                            this.createTableCell("TiÃªu chÃ­", true, "E0E0E0"),
                            this.createTableCell("Má»©c 4 (Xuáº¥t sáº¯c)", true, "E0E0E0"),
                            this.createTableCell("Má»©c 1 (ChÆ°a Ä‘áº¡t)", true, "E0E0E0")
                        ]
                    }),
                    ...rubric.tieu_chi.map((tc: any) => new TableRow({
                        children: [
                            this.createTableCell(tc.ten, true),
                            this.createTableCell(tc.muc_4_xuat_sac),
                            this.createTableCell(tc.muc_1_chua_dat)
                        ]
                    }))
                ];
                blocks.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }));
            }
        });
    }

    private createTableCell(text: string, bold = false, fill?: string): TableCell {
        return new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, bold, size: 22 })] })],
            shading: fill ? { fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 100, bottom: 100, left: 100, right: 100 }
        });
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

        // ðŸ’Ž INTEGRITY LOG
        const seal = await IntegrityService.seal(docxBlob, safeName);
        console.log(`[Integrity] ðŸ›¡ï¸ DOCUMENT SEALED: ${seal.checksum} at ${seal.timestamp}`);
    }
}
