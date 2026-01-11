
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { TextCleaningService } from "./text-cleaning-service";
import { LessonResult } from "@/lib/types";

const cleaner = TextCleaningService.getInstance();

/**
 * Clean data values for safe injection into docxtemplater.
 * Prevents AI-generated characters from being interpreted as tags.
 */
const clean = (val: any) => {
    if (!val) return "...";
    const text = cleaner.cleanFinalOutput(String(val));
    // Neutralize any {{ or }} inside the content to prevent them from being seen as nested tags
    return text.replace(/{{/g, "{ { ").replace(/}}/g, " } } ");
};

export const TemplateExportService = {
    async exportLessonToTemplate(lesson: LessonResult, templatePath: string = "/templates/KHBD_Template_2Cot.docx") {
        let zip: any = null;
        try {
            console.log("[v34.22] 🚀 Starting Super-Surgical Export...");
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error(`Template not found at ${templatePath}`);
            const buffer = await response.arrayBuffer();
            zip = new PizZip(buffer);

            // 🛡️ ARCHITECTURE 34.22 - THE SURGEON
            // This algorithm penetrates XML nodes to repair fragmented docxtemplater tags
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
                    // E.g., {{ten_<w:rPr/>truong}} -> {{ten_truong}}
                    repaired = repaired.replace(/(\{\{)([\s\S]*?)(\}\})/g, (match: string, open: string, inner: string, close: string) => {
                        // Remove all XML tags within the tag name but preserve everything else
                        const cleanedInner = inner.replace(/<[^>]+>/g, "");
                        return `${open}${cleanedInner}${close}`;
                    });

                    if (repaired !== content) {
                        console.log(`[AUDIT] ✅ Repaired fragmentation in: ${path}`);
                        zip.file(path, repaired);
                    }
                }
            });

            // Explicitly configure docxtemplater to be as resilient as possible
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

            saveAs(out, `GiaoArea_Export_${Date.now()}.docx`);
            console.log("[v34.22] ✅ Export Successful!");
            return true;
        } catch (error: any) {
            console.error("⛔ [DEEP AUDIT] CRITICAL EXPORT FAILURE:", error);

            // Fail Loud Mechanism with Snippet Context
            if (error.properties && error.properties.errors) {
                const xmlContent = zip && zip.file("word/document.xml")?.asText() || "";

                const tableData = error.properties.errors.map((e: any) => {
                    const offset = e.properties.offset;
                    const snippet = xmlContent.substring(
                        Math.max(0, offset - 30),
                        Math.min(xmlContent.length, offset + 60)
                    );
                    return {
                        ID: e.properties.id,
                        Message: e.message,
                        Offset: offset,
                        Context: snippet.replace(/\n/g, "\\n")
                    };
                });
                console.table(tableData);
            }
            throw error;
        }
    }
};
