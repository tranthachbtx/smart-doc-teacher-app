
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

import { LessonResult, MeetingResult, EventResult, NCBHResult, AssessmentResult } from "@/lib/types";

// Helper to clean undefined/null values
const clean = (val: any, defaultVal = "...") => val || defaultVal;

/**
 * 🛠️ TEMPLATE EXPORT SERVICE v1.0
 * Sử dụng thư viện docxtemplater để điền dữ liệu vào mẫu Word có sẵn.
 * Hỗ trợ Mapping 1:1 từ LessonResult sang biến Template.
 */
export const TemplateExportService = {
    exportLessonToTemplate(lesson: LessonResult, templatePath: string = "/templates/KHBD_Template_2Cot.docx") {
        try {
            return this.processExport(templatePath, {
                // --- NHÓM 1: THÔNG TIN CHUNG ---
                ten_truong: "TRƯỜNG THPT X",
                to_chuyen_mon: "TỔ TRẢI NGHIỆM - HƯỚNG NGHIỆP",

                chu_de: clean(lesson.chuDeSo),
                ten_chu_de: clean(lesson.theme || lesson.ten_bai),
                ten_giao_vien: "............................................",
                lop: lesson.grade ? `12A${lesson.grade.replace(/\D/g, '')}` : "12A...",
                so_tiet: lesson.duration ? lesson.duration.replace(/\D/g, '') : "03",
                ngay_soan: new Date().toLocaleDateString('vi-VN'),

                // --- NHÓM 2: MỤC TIÊU & THIẾT BỊ ---
                muc_tieu_kien_thuc: clean(lesson.muc_tieu_kien_thuc),
                muc_tieu_nang_luc: clean(lesson.muc_tieu_nang_luc),
                muc_tieu_pham_chat: clean(lesson.muc_tieu_pham_chat),

                gv_chuan_bi: clean(lesson.gv_chuan_bi),
                hs_chuan_bi: clean(lesson.hs_chuan_bi),

                // --- NHÓM 3: TIẾN TRÌNH ---
                shdc: clean(lesson.shdc),
                shl: clean(lesson.shl),

                // HĐ Khởi động
                hoat_dong_khoi_dong_cot_1: clean(lesson.hoat_dong_khoi_dong_cot_1),
                hoat_dong_khoi_dong_cot_2: clean(lesson.hoat_dong_khoi_dong_cot_2),

                // HĐ Khám phá
                hoat_dong_kham_pha_cot_1: clean(lesson.hoat_dong_kham_pha_cot_1),
                hoat_dong_kham_pha_cot_2: clean(lesson.hoat_dong_kham_pha_cot_2),

                // HĐ Luyện tập
                hoat_dong_luyen_tap_cot_1: clean(lesson.hoat_dong_luyen_tap_cot_1),
                hoat_dong_luyen_tap_cot_2: clean(lesson.hoat_dong_luyen_tap_cot_2),

                // HĐ Vận dụng
                hoat_dong_van_dung_cot_1: clean(lesson.hoat_dong_van_dung_cot_1),
                hoat_dong_van_dung_cot_2: clean(lesson.hoat_dong_van_dung_cot_2),

                // --- NHÓM 4: ĐÁNH GIÁ ---
                ho_so_day_hoc: clean(lesson.ho_so_day_hoc),
                huong_dan_ve_nha: clean(lesson.huong_dan_ve_nha)
            }, `Giao_an_${(lesson.theme || "bai_day").substring(0, 50)}.docx`);
        } catch (error) {
            console.error("Template Export Error (Lesson):", error);
            throw error;
        }
    },

    async exportMeetingToTemplate(meeting: MeetingResult, templatePath: string = "/templates/mau-bien-ban-hop-to.docx") {
        return this.processExport(templatePath, {
            ten_truong: "TRƯỜNG THPT X",
            to_chuyen_mon: "TRẢI NGHIỆM - HƯỚNG NGHIỆP",
            nam: new Date().getFullYear(),
            thang: new Date().getMonth() + 1,
            lan_hop: "1",
            chu_tri: "Tổ trưởng",
            thu_ky: "................",
            thanh_vien: "Toàn thể giáo viên trong tổ",

            noi_dung_chinh: clean(meeting.noi_dung_chinh || meeting.content),
            uu_diem: clean(meeting.uu_diem),
            han_che: clean(meeting.han_che),
            ke_hoach_thang_toi: clean(meeting.ke_hoach_thang_toi),
            y_kien_dong_gop: clean(meeting.y_kien_dong_gop),
            ket_luan: clean(meeting.ket_luan_cuoc_hop || meeting.conclusion)
        }, `Bien_ban_hop_${new Date().toISOString().slice(0, 10)}.docx`);
    },

    async exportEventToTemplate(event: EventResult, templatePath: string = "/templates/mau-ke-hoach-ngoai-khoa.docx") {
        return this.processExport(templatePath, {
            ten_truong: "TRƯỜNG THPT X",
            to_chuyen_mon: "TRẢI NGHIỆM - HƯỚNG NGHIỆP",
            so_ke_hoach: "...",
            dia_diem: clean(event.dia_diem),
            thang: new Date().getMonth() + 1,
            nam: new Date().getFullYear(),

            khoi_lop: "...",
            chu_de: "...",
            ten_chu_de: clean(event.ten_chu_de || event.title),

            muc_dich_yeu_cau: clean(typeof event.muc_tieu === 'string' ? event.muc_tieu : JSON.stringify(event.muc_tieu)),
            nang_luc: clean(event.nang_luc),
            pham_chat: clean(event.pham_chat),

            thoi_gian: clean(event.thoi_gian),
            kinh_phi: Array.isArray(event.du_toan_kinh_phi) ? event.du_toan_kinh_phi.join("\n") : clean(event.du_toan_kinh_phi),

            giao_vien_phu_trach: "................",

            chuan_bi: Array.isArray(event.checklist_chuan_bi) ? event.checklist_chuan_bi.join("\n") : clean(event.checklist_chuan_bi),
            kich_ban_chi_tiet: clean(event.kich_ban_chi_tiet),
            thong_diep_ket_thuc: clean(event.thong_diep_ket_thuc),

            to_truong: "................",
            hieu_truong: "................"
        }, `Ke_hoach_ngoai_khoa_${(event.ten_chu_de || "su_kien").substring(0, 50)}.docx`);
    },

    async exportNCBHToTemplate(ncbh: NCBHResult, templatePath: string = "/templates/mau-ke-hoach-day-hoc.docx") {
        // Note: Using lesson plan template as fallback if specific NCBH template is missing, 
        // but user requested using what is available. If 'mau-ke-hoach-day-hoc.docx' is generic, we try to map.
        // Or we can use a "best fit" approach. 
        // Based on analysis, we should use a template that matches strict NCBH structure if possible, 
        // but we will map to the standard placeholders identified.

        return this.processExport(templatePath, {
            ten_truong: "TRƯỜNG THPT X",
            to_chuyen_mon: "TRẢI NGHIỆM - HƯỚNG NGHIỆP",
            ten_bai: clean(ncbh.ten_bai || ncbh.title),

            ly_do_chon: clean(ncbh.ly_do_chon),
            muc_tieu: clean(ncbh.muc_tieu || ncbh.objectives),
            chuoi_hoat_dong: clean(ncbh.chuoi_hoat_dong),
            phuong_an_ho_tro: clean(ncbh.phuong_an_ho_tro),

            ngay_thuc_hien: "...",
            khoi: "...",

            chia_se_nguoi_day: clean(ncbh.chia_se_nguoi_day),
            nhan_xet_nguoi_du: clean(ncbh.nhan_xet_nguoi_du),
            nguyen_nhan_giai_phap: clean(ncbh.nguyen_nhan_giai_phap),
            bai_hoc_kinh_nghiem: clean(ncbh.bai_hoc_kinh_nghiem)
        }, `Ho_so_NCBH_${(ncbh.ten_bai || "bai_hoc").substring(0, 50)}.docx`);
    },

    async exportAssessmentToTemplate(assessment: AssessmentResult, templateInput: string | ArrayBuffer = "/templates/mau-ke-hoach-day-hoc.docx") {
        // Support custom template (ArrayBuffer) or default path (string)
        return this.processExport(templateInput, {
            ten_truong: "TRƯỜNG THPT X",
            to_chuyen_mon: "TRẢI NGHIỆM - HƯỚNG NGHIỆP",
            ten_ke_hoach: clean(assessment.ten_ke_hoach || assessment.title),
            hoc_ky: "...",
            khoi: "...",

            muc_tieu: clean(Array.isArray(assessment.muc_tieu) ? assessment.muc_tieu.join("\n") : assessment.muc_tieu),

            noi_dung_nhiem_vu: clean(typeof assessment.noi_dung_nhiem_vu === 'string' ? assessment.noi_dung_nhiem_vu : JSON.stringify(assessment.noi_dung_nhiem_vu)),

            // Format complex objects into readable text for the template
            ma_tran_dac_ta: assessment.structure || "...",
            bang_kiem_rubric: clean(assessment.rubric_text || JSON.stringify(assessment.bang_kiem_rubric)),
            loi_khuyen: clean(typeof assessment.loi_khuyen === 'string' ? assessment.loi_khuyen : JSON.stringify(assessment.loi_khuyen))
        }, `Ke_hoach_danh_gia_${(assessment.ten_ke_hoach || "kiem_tra").substring(0, 50)}.docx`);
    },

    // --- CORE PROCESSOR ---
    async processExport(templateInput: string | ArrayBuffer, data: any, outputFilename: string) {
        try {
            let templateArrayBuffer: ArrayBuffer;

            if (typeof templateInput === 'string') {
                const response = await fetch(templateInput);
                if (!response.ok) {
                    throw new Error(`Cannot load template: ${templateInput}`);
                }
                templateArrayBuffer = await response.arrayBuffer();
            } else {
                templateArrayBuffer = templateInput;
            }

            const zip = new PizZip(templateArrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
                nullGetter: () => "" // Keep empty if missing
            });

            doc.render(data);

            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            saveAs(out, outputFilename);
            return true;
        } catch (error) {
            console.error("Template Export Error:", error);
            throw error;
        }
    }
};
