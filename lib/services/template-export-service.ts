import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { DEPT_INFO } from "@/lib/config/department";
import { TextCleaningService } from "./text-cleaning-service";
import {
  LessonResult,
  MeetingResult,
  EventResult,
  NCBHResult,
  AssessmentResult,
} from "@/lib/types";

const cleaner = TextCleaningService.getInstance();

/**
 * Clean data values for safe injection into docxtemplater.
 * Prevents AI-generated characters from being interpreted as tags.
 */
const clean = (val: any): string => {
  if (val === undefined || val === null) return "...";
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === "object") {
          // Handle complex objects like rubrics or matrix rows
          return Object.entries(item)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
        }
        return String(item);
      })
      .join("\n");
  }
  if (typeof val === "object") {
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
  }
  const text = cleaner.cleanFinalOutput(String(val));
  // Neutralize any {{ or }} inside the content to prevent them from being seen as nested tags
  return text.replace(/{{/g, "{ { ").replace(/}}/g, " } } ");
};

/**
 * ðŸ›¡ï¸ SURGICAL TAG REPAIR ENGINE
 * Penetrates XML nodes to repair fragmented docxtemplater tags
 */
const repairTags = (zip: PizZip) => {
  const xmlFiles = [
    "word/document.xml",
    "word/header1.xml",
    "word/footer1.xml",
  ];
  xmlFiles.forEach((path) => {
    const file = zip.file(path);
    if (file) {
      const content = file.asText();
      let repaired = content;

      // Step 1: Collapse fragmented delimiters (e.g., { <xml/> { -> {{)
      repaired = repaired
        .replace(/\{(<[^>]+>|\s)*\{+/g, "{{")
        .replace(/\}(<[^>]+>|\s)*\}+/g, "}}");

      // Step 2: Tag Interior Surgeon (Removes formatting tags INSIDE tag names)
      repaired = repaired.replace(
        /(\{\{)([\s\S]*?)(\}\})/g,
        (match: string, open: string, inner: string, close: string) => {
          const cleanedInner = inner.replace(/<[^>]+>/g, "");
          return `${open}${cleanedInner}${close}`;
        }
      );

      if (repaired !== content) {
        console.log(`[AUDIT] âœ… Repaired fragmentation in: ${path}`);
        zip.file(path, repaired);
      }
    }
  });
};

export const TemplateExportService = {
  async exportLessonToTemplate(
    lesson: LessonResult,
    templatePath: string = "/templates/KHBD_Template_2Cot.docx"
  ) {
    let zip: any = null;
    try {
      console.log("[v34.22] ðŸš€ Starting Super-Surgical Export (Lesson)...");
      const response = await fetch(templatePath);
      if (!response.ok)
        throw new Error(`Template not found at ${templatePath}`);
      const buffer = await response.arrayBuffer();
      zip = new PizZip(buffer);

      repairTags(zip);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
        nullGetter: () => "",
      });

      const data = {
        ten_truong: clean(DEPT_INFO.school.toUpperCase()),
        to_chuyen_mon: clean(DEPT_INFO.name.toUpperCase()),
        chu_de: clean(lesson.chuDeSo || "......"),
        ten_chu_de: clean(
          lesson.theme || lesson.ten_bai || "........................"
        ),
        ten_giao_vien: clean(
          lesson.ten_giao_vien || "............................................"
        ),
        lop: lesson.grade ? `12A${lesson.grade.replace(/\D/g, "")}` : "12A...",
        so_tiet: (lesson.duration || lesson.so_tiet || "03").replace(/\D/g, ""),
        ngay_soan: new Date().toLocaleDateString("vi-VN"),
        upper_agency: clean(DEPT_INFO.upperAgency),
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
        huong_dan_ve_nha: clean(lesson.huong_dan_ve_nha),
        to_truong: clean(DEPT_INFO.head),
        hieu_truong: "........................",
      };

      doc.render(data);
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, `GiaoArea_Lesson_${Date.now()}.docx`);
      return true;
    } catch (error: any) {
      this.handleError(error, zip);
      throw error;
    }
  },

  async exportMeetingToTemplate(
    meeting: MeetingResult,
    templatePath: string = "/templates/mau-bien-ban-hop-to.docx"
  ) {
    let zip: any = null;
    try {
      const response = await fetch(templatePath);
      if (!response.ok)
        throw new Error(`Template not found at ${templatePath}`);
      const buffer = await response.arrayBuffer();
      zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
        nullGetter: () => "",
      });

      // FULL SYNC with meeting-prompts.ts & docx-templates.ts
      const now = new Date();
      const data = {
        ten_truong: clean(DEPT_INFO.school.toUpperCase()),
        to_chuyen_mon: clean(DEPT_INFO.name.toUpperCase()),
        thang: now.getMonth() + 1,
        nam: now.getFullYear(),
        lan_hop: clean(meeting.lan_hop || "01"),
        chu_tri: clean(meeting.chu_tri || DEPT_INFO.head),
        thu_ky: clean(meeting.thu_ky || DEPT_INFO.members[1] || "................"),
        thanh_vien: clean(meeting.thanh_vien || DEPT_INFO.members.join(", ")),
        noi_dung_chinh: clean(meeting.noi_dung_chinh || meeting.content),
        uu_diem: clean(meeting.uu_diem),
        han_che: clean(meeting.han_che),
        y_kien_dong_gop: clean(meeting.y_kien_dong_gop),
        y_kien: clean(meeting.y_kien_dong_gop), // Alias
        ke_hoach_thang_toi: clean(meeting.ke_hoach_thang_toi),
        ke_hoach: clean(meeting.ke_hoach_thang_toi), // Alias
        ket_luan_cuoc_hop: clean(
          meeting.ket_luan_cuoc_hop || meeting.conclusion
        ),
        ket_luan: clean(meeting.ket_luan_cuoc_hop || meeting.conclusion), // Alias
      };

      doc.render(data);
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(out, `Bien_Ban_Hop_To_${Date.now()}.docx`);
      return true;
    } catch (error: any) {
      this.handleError(error, zip);
      throw error;
    }
  },

  async exportEventToTemplate(
    event: EventResult,
    templatePath: string = "/templates/mau-ke-hoach-ngoai-khoa.docx"
  ) {
    let zip: any = null;
    try {
      console.log("[v34.25] 🚀 Exporting Event to Template...");
      const response = await fetch(templatePath);
      if (!response.ok)
        throw new Error(`Template not found at ${templatePath}`);
      const buffer = await response.arrayBuffer();
      zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
        nullGetter: () => "",
      });

      const now = new Date();
      const data = {
        upper_agency: clean(DEPT_INFO.upperAgency),
        ten_truong: clean(DEPT_INFO.school.toUpperCase().replace("TRƯỜNG THPT", "").trim()),
        to_chuyen_mon: clean(DEPT_INFO.name.toUpperCase().replace("TỔ", "").trim()),
        so_ke_hoach: clean(event.so_ke_hoach || "..../KH-BTX"),
        ngay_thang: `Mũi Né, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`,
        khoi: clean(event.grade || event.doi_tuong || "12"),
        khoi_lop: clean(event.grade || event.doi_tuong || "12"),
        ten_chu_de: clean(event.ten_chu_de || event.title || event.ten_ke_hoach),
        muc_dich_yeu_cau: clean(event.muc_tieu || event.muc_dich_yeu_cau),
        nang_luc: clean(event.nang_luc),
        pham_chat: clean(event.pham_chat),
        thoi_gian: clean(event.thoi_gian),
        dia_diem: clean(event.dia_diem || "Sân trường"),
        noi_dung: clean(event.noi_dung || event.content || event.kich_ban_chi_tiet),
        kich_ban_chi_tiet: clean(event.kich_ban_chi_tiet),
        kinh_phi: clean(event.kinh_phi || event.du_toan_kinh_phi),
        chuan_bi: clean(event.checklist_chuan_bi || event.to_chuc_thuc_hien_chuan_bi),
        to_chuc_thuc_hien: clean(event.to_chuc_thuc_hien_chuan_bi),
        to_truong: clean(DEPT_INFO.head),
      };

      doc.render(data);
      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(out, `KHNK_${event.grade || "Event"}_${Date.now()}.docx`);
      return true;
    } catch (error: any) {
      this.handleError(error, zip);
      throw error;
    }
  },

  async exportNCBHToTemplate(
    ncbh: NCBHResult,
    templatePath: string = "/templates/NCBH_Template.docx"
  ) {
    let zip: any = null;
    try {
      const response = await fetch(templatePath);
      if (!response.ok)
        throw new Error(`Template not found at ${templatePath}`);
      const buffer = await response.arrayBuffer();
      zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
        nullGetter: () => "",
      });

      // FULL SYNC with ncbh-prompts.ts
      const now = new Date();
      const data = {
        ten_truong: clean(DEPT_INFO.school.toUpperCase()),
        to_chuyen_mon: clean(DEPT_INFO.name.toUpperCase()),
        upper_agency: clean(DEPT_INFO.upperAgency),
        ngay: now.getDate(),
        thang: now.getMonth() + 1,
        nam: now.getFullYear(),
        ten_bai: clean(ncbh.ten_bai || ncbh.title),
        ly_do_chon: clean(ncbh.ly_do_chon),
        ly_do: clean(ncbh.ly_do_chon), // Alias
        muc_tieu: clean(ncbh.muc_tieu || ncbh.objectives),
        chuoi_hoat_dong: clean(ncbh.chuoi_hoat_dong),
        phuong_an_ho_tro: clean(ncbh.phuong_an_ho_tro),
        chia_se_nguoi_day: clean(ncbh.chia_se_nguoi_day),
        nhan_xet_nguoi_du: clean(ncbh.nhan_xet_nguoi_du),
        nguyen_nhan_giai_phap: clean(ncbh.nguyen_nhan_giai_phap),
        bai_hoc_kinh_nghiem: clean(ncbh.bai_hoc_kinh_nghiem),
        bai_hoc: clean(ncbh.bai_hoc_kinh_nghiem), // Alias
        to_truong: clean(DEPT_INFO.head),
      };

      doc.render(data);
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(out, `NCBH_Export_${Date.now()}.docx`);
      return true;
    } catch (error: any) {
      this.handleError(error, zip);
      throw error;
    }
  },

  async exportAssessmentToTemplate(
    assessment: AssessmentResult,
    templatePath: string = "/templates/Assessment_Template.docx"
  ) {
    let zip: any = null;
    try {
      const response = await fetch(templatePath);
      if (!response.ok)
        throw new Error(`Template not found at ${templatePath}`);
      const buffer = await response.arrayBuffer();
      zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        delimiters: { start: "{{", end: "}}" },
        nullGetter: () => "",
      });

      // FULL SYNC with assessment-prompts.ts
      const now = new Date();
      const data = {
        ten_truong: clean(DEPT_INFO.school.toUpperCase()),
        to_chuyen_mon: clean(DEPT_INFO.name.toUpperCase()),
        upper_agency: clean(DEPT_INFO.upperAgency),
        ngay: now.getDate(),
        thang: now.getMonth() + 1,
        nam: now.getFullYear(),
        ten_ke_hoach: clean(assessment.ten_ke_hoach || assessment.title),
        muc_tieu: clean(assessment.muc_tieu),
        noi_dung_nhiem_vu: clean(assessment.noi_dung_nhiem_vu),
        hinh_thuc_to_chuc: clean(
          assessment.metadata?.hinh_thuc_to_chuc ||
          (assessment as any).hinh_thuc_to_chuc
        ), // Extracted from result if available
        ma_tran_dac_ta: clean(
          assessment.matrix || (assessment as any).ma_tran_dac_ta
        ),
        matrix: clean(assessment.matrix || (assessment as any).ma_tran_dac_ta), // Alias
        bang_kiem_rubric: clean(
          assessment.rubric_text || (assessment as any).bang_kiem_rubric
        ),
        rubric: clean(
          assessment.rubric_text || (assessment as any).bang_kiem_rubric
        ), // Alias
        loi_khuyen: clean(assessment.loi_khuyen),
        to_truong: clean(DEPT_INFO.head),
        hieu_truong: "........................",
      };

      doc.render(data);
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(out, `Kiem_Tra_Danh_Gia_${Date.now()}.docx`);
      return true;
    } catch (error: any) {
      this.handleError(error, zip);
      throw error;
    }
  },

  handleError(error: any, zip: any) {
    console.error("â›” [DEEP AUDIT] CRITICAL EXPORT FAILURE:", error);
    if (error.properties && error.properties.errors && zip) {
      const xmlContent = zip.file("word/document.xml")?.asText() || "";
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
          Context: snippet.replace(/\n/g, "\\n"),
        };
      });
      console.table(tableData);
    }
  },
};
