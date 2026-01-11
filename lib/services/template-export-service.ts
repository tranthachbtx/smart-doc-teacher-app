
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { TextCleaningService } from "./text-cleaning-service";
import { LessonResult, MeetingResult, EventResult, NCBHResult, AssessmentResult } from "@/lib/types";

const cleaner = TextCleaningService.getInstance();

/**
 * Clean data values for safe injection into docxtemplater.
 * Prevents AI-generated characters from being interpreted as tags.
 */
const clean = (val: any) => {
    if (!val) return "...";
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    const text = cleaner.cleanFinalOutput(String(val));
    // Neutralize any {{ or }} inside the content to prevent them from being seen as nested tags
    return text.replace(/{{/g, "{ { ").replace(/}}/g, " } } ");
};

/**
 * �️ SURGICAL TAG REPAIR ENGINE
 * Penetrates XML nodes to repair fragmented docxtemplater tags
 */
const repairTags = (zip: PizZip) => {
    const xmlFiles = ["word/document.xml", "word/header1.xml", "word/footer1.xml"];
    xmlFiles.forEach(path => {
        const file = zip.file(path);
        if (file) {
            const content = file.asText();
            let repaired = content;

            // Step 1: Collapse fragmented delimiters (e.g., { <xml/> { -> {{)
            repaired = repaired
                .replace(/\{(<[^>]+>|\s)*\{+/g, "{{")
                .replace(/\}(<[^>]+>|\s)*\}+/g, "}}");

            // Step 2: Tag Interior Surgeon (Removes formatting tags INSIDE tag names)
            repaired = repaired.replace(/(\{\{)([\s\S]*?)(\}\})/g, (match: string, open: string, inner: string, close: string) => {
                const cleanedInner = inner.replace(/<[^>]+>/g, "");
                return `${open}${cleanedInner}${close}`;
            });

            if (repaired !== content) {
                console.log(`[AUDIT] ✅ Repaired fragmentation in: ${path}`);
                zip.file(path, repaired);
            }
        }
    });
};

export const TemplateExportService = {
    async exportLessonToTemplate(lesson: LessonResult, templatePath: string = "/templates/KHBD_Template_2Cot.docx") {
        let zip: any = null;
        try {
            console.log("[v34.22] 🚀 Starting Super-Surgical Export (Lesson)...");
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found at ${templatePath}`);
            const buffer = await response.arrayBuffer();
            zip = new PizZip(buffer);

            repairTags(zip);

            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                delimiters: { start: "{{", end: "}}" },
                nullGetter: () => ""
            });

            const data = {
                ten_truong: clean(lesson.ten_truong || "........................"),
                to_chuyen_mon: clean(lesson.to_chuyen_mon || "........................"),
                chu_de: clean(lesson.chuDeSo || "......"),
                ten_chu_de: clean(lesson.theme || lesson.ten_bai || "........................"),
                ten_giao_vien: clean(lesson.ten_giao_vien || "............................................"),
                lop: lesson.grade ? `12A${lesson.grade.replace(/\D/g, '')}` : "12A...",
                so_tiet: (lesson.duration || lesson.so_tiet || "03").replace(/\D/g, ''),
                ngay_soan: new Date().toLocaleDateString('vi-VN'),
                muc_tieu_kien_thuc: clean(lesson.muc_tieu_kien_thuc),
                muc_tieu_nang_luc: clean(lesson.muc_tieu_nang_luc),
                muc_tieu_pham_chat: clean(lesson.muc_tieu_pham_chat),
                gv_chuan_bi: clean(lesson.gv_chuan_bi),
                hs_chuan_bi: clean(lesson.hs_chuan_bi),
                shdc: clean(lesson.shdc),
                shl: clean(lesson.shl),
                hoat_dong_khoi_dong_cot_1: clean(lesson.hoat_dong_khoi_dong_cot_1),
                hoat_dong_khoi_dong_cot_2: clean(lesson.hoat_dong_khoi_dong_cot_2),
                hoat_dong_kham_pha_cot_1: clean(lesson.hoat_dong_kham_pha_cot_1),
                hoat_dong_kham_pha_cot_2: clean(lesson.hoat_dong_kham_pha_cot_2),
                hoat_dong_luyen_tap_cot_1: clean(lesson.hoat_dong_luyen_tap_cot_1),
                hoat_dong_luyen_tap_cot_2: clean(lesson.hoat_dong_luyen_tap_cot_2),
                hoat_dong_van_dung_cot_1: clean(lesson.hoat_dong_van_dung_cot_1),
                hoat_dong_van_dung_cot_2: clean(lesson.hoat_dong_van_dung_cot_2),
                ho_so_day_hoc: clean(lesson.ho_so_day_hoc),
                huong_dan_ve_nha: clean(lesson.huong_dan_ve_nha)
            };

            doc.render(data);
            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });

            saveAs(out, `GiaoArea_Lesson_${Date.now()}.docx`);
            return true;
        } catch (error: any) {
            this.handleError(error, zip);
            throw error;
        }
    },

    async exportMeetingToTemplate(meeting: MeetingResult, templatePath: string = "/templates/mau-bien-ban-hop-to.docx") {
        let zip: any = null;
        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found at ${templatePath}`);
            const buffer = await response.arrayBuffer();
            zip = new PizZip(buffer);
            repairTags(zip);

            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: "{{", end: "}}" }, nullGetter: () => "" });

            const data = {
                thang: new Date().getMonth() + 1,
                noi_dung_chinh: clean(meeting.noi_dung_chinh || meeting.title || meeting.content),
                uu_diem: clean(meeting.uu_diem),
                han_che: clean(meeting.han_che),
                y_kien: clean(meeting.y_kien_dong_gop),
                ke_hoach: clean(meeting.ke_hoach_thang_toi),
                ket_luan: clean(meeting.ket_luan_cuoc_hop || meeting.conclusion)
            };

            doc.render(data);
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, `Bien_Ban_Hop_To_${Date.now()}.docx`);
            return true;
        } catch (error: any) { this.handleError(error, zip); throw error; }
    },

    async exportEventToTemplate(event: EventResult, templatePath: string = "/templates/mau-ke-hoach-ngoai-khoa.docx") {
        let zip: any = null;
        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found at ${templatePath}`);
            const buffer = await response.arrayBuffer();
            zip = new PizZip(buffer);
            repairTags(zip);

            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: "{{", end: "}}" }, nullGetter: () => "" });

            const data = {
                ten_ke_hoach: clean(event.ten_ke_hoach || event.title || event.ten_chu_de),
                thoi_gian: clean(event.thoi_gian),
                dia_diem: clean(event.dia_diem),
                doi_tuong: clean(event.doi_tuong),
                muc_tieu: clean(event.muc_tieu),
                noi_dung: clean(event.noi_dung || event.content),
                kich_ban: clean(event.kich_ban_chi_tiet),
                du_toan: clean(event.du_toan_kinh_phi)
            };

            doc.render(data);
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, `Ke_Hoach_Ngoai_Khoa_${Date.now()}.docx`);
            return true;
        } catch (error: any) { this.handleError(error, zip); throw error; }
    },

    async exportNCBHToTemplate(ncbh: NCBHResult, templatePath: string = "/templates/mau-ke-hoach-day-hoc.docx") {
        let zip: any = null;
        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found at ${templatePath}`);
            const buffer = await response.arrayBuffer();
            zip = new PizZip(buffer);
            repairTags(zip);

            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: "{{", end: "}}" }, nullGetter: () => "" });

            const data = {
                ten_bai: clean(ncbh.ten_bai || ncbh.title),
                muc_tieu: clean(ncbh.muc_tieu || ncbh.objectives),
                ly_do: clean(ncbh.ly_do_chon),
                chuoi_hoat_dong: clean(ncbh.chuoi_hoat_dong),
                bai_hoc: clean(ncbh.bai_hoc_kinh_nghiem)
            };

            doc.render(data);
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, `NCBH_Export_${Date.now()}.docx`);
            return true;
        } catch (error: any) { this.handleError(error, zip); throw error; }
    },

    async exportAssessmentToTemplate(assessment: AssessmentResult, templatePath: string = "/templates/mau-ke-hoach-day-hoc.docx") {
        let zip: any = null;
        try {
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found at ${templatePath}`);
            const buffer = await response.arrayBuffer();
            zip = new PizZip(buffer);
            repairTags(zip);

            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, delimiters: { start: "{{", end: "}}" }, nullGetter: () => "" });

            const data = {
                ten_ke_hoach: clean(assessment.ten_ke_hoach || assessment.title),
                muc_tieu: clean(assessment.muc_tieu),
                matrix: clean(assessment.matrix),
                rubric: clean(assessment.rubric_text)
            };

            doc.render(data);
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, `Kiem_Tra_Danh_Gia_${Date.now()}.docx`);
            return true;
        } catch (error: any) { this.handleError(error, zip); throw error; }
    },

    handleError(error: any, zip: any) {
        console.error("⛔ [DEEP AUDIT] CRITICAL EXPORT FAILURE:", error);
        if (error.properties && error.properties.errors && zip) {
            const xmlContent = zip.file("word/document.xml")?.asText() || "";
            const tableData = error.properties.errors.map((e: any) => {
                const offset = e.properties.offset;
                const snippet = xmlContent.substring(Math.max(0, offset - 30), Math.min(xmlContent.length, offset + 60));
                return { ID: e.properties.id, Message: e.message, Offset: offset, Context: snippet.replace(/\n/g, "\\n") };
            });
            console.table(tableData);
        }
    }
};
