
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { LessonResult } from "@/lib/types";

/**
 * 🛠️ TEMPLATE EXPORT SERVICE v1.0
 * Sử dụng thư viện docxtemplater để điền dữ liệu vào mẫu Word có sẵn.
 * Hỗ trợ Mapping 1:1 từ LessonResult sang biến Template.
 */
export const TemplateExportService = {
    async exportLessonToTemplate(lesson: LessonResult, templatePath: string = "/templates/KHBD_Template_2Cot.docx") {
        try {
            // 1. Load Template
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`Cannot load template: ${templatePath}`);
            }
            const templateArrayBuffer = await response.arrayBuffer();

            // 2. Prepare Data (Flat Mapping Strategy)
            const data = {
                // --- NHÓM 1: THÔNG TIN CHUNG ---
                ten_truong: "TRƯỜNG THPT X", // Default or from settings
                to_chuyen_mon: "TỔ TRẢI NGHIỆM - HƯỚNG NGHIỆP",

                chu_de: lesson.chuDeSo || "...",
                ten_chu_de: lesson.theme || lesson.ten_bai || "...",
                ten_giao_vien: "............................................",
                lop: lesson.grade ? `12A${lesson.grade.replace(/\D/g, '')}` : "12A...",
                so_tiet: lesson.duration ? lesson.duration.replace(/\D/g, '') : "03",
                ngay_soan: new Date().toLocaleDateString('vi-VN'),

                // --- NHÓM 2: MỤC TIÊU & THIẾT BỊ ---
                muc_tieu_kien_thuc: lesson.muc_tieu_kien_thuc || "...",
                muc_tieu_nang_luc: lesson.muc_tieu_nang_luc || "...",
                muc_tieu_pham_chat: lesson.muc_tieu_pham_chat || "...",

                gv_chuan_bi: lesson.gv_chuan_bi || "...",
                hs_chuan_bi: lesson.hs_chuan_bi || "...",

                // --- NHÓM 3: TIẾN TRÌNH ---
                shdc: lesson.shdc || "...",
                shl: lesson.shl || "...",

                // HĐ Khởi động
                hoat_dong_khoi_dong_cot_1: lesson.hoat_dong_khoi_dong_cot_1 || "...",
                hoat_dong_khoi_dong_cot_2: lesson.hoat_dong_khoi_dong_cot_2 || "...",

                // HĐ Khám phá
                hoat_dong_kham_pha_cot_1: lesson.hoat_dong_kham_pha_cot_1 || "...",
                hoat_dong_kham_pha_cot_2: lesson.hoat_dong_kham_pha_cot_2 || "...",

                // HĐ Luyện tập
                hoat_dong_luyen_tap_cot_1: lesson.hoat_dong_luyen_tap_cot_1 || "...",
                hoat_dong_luyen_tap_cot_2: lesson.hoat_dong_luyen_tap_cot_2 || "...",

                // HĐ Vận dụng
                hoat_dong_van_dung_cot_1: lesson.hoat_dong_van_dung_cot_1 || "...",
                hoat_dong_van_dung_cot_2: lesson.hoat_dong_van_dung_cot_2 || "...",

                // --- NHÓM 4: ĐÁNH GIÁ ---
                ho_so_day_hoc: lesson.ho_so_day_hoc || "...",
                huong_dan_ve_nha: lesson.huong_dan_ve_nha || "..."
            };

            // 3. Render Document
            const zip = new PizZip(templateArrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.render(data);

            // 4. Output File
            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            saveAs(out, `Giao_an_${data.ten_chu_de.substring(0, 50)}.docx`);
            return true;
        } catch (error) {
            console.error("Template Export Error:", error);
            throw error;
        }
    }
};
