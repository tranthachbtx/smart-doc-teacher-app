import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { DEPT_INFO } from "@/lib/config/department";
import { TextCleaningService } from "./text-cleaning-service";

const cleaner = TextCleaningService.getInstance();

/**
 * 🛡️ HÀM LÀM SẠCH DỮ LIỆU THÔNG MINH (v75.10)
 */
const clean = (val: any): string => {
  if (val === undefined || val === null || val === "" || val === "...") return "";
  if (Array.isArray(val)) return val.map(v => String(v)).join("\n- ");

  let text = String(val);
  const lines = text.split("\n");
  const cleanedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.length > 50) return line;
    return trimmed
      .replace(/^(#+\s*)?(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s*$/gi, "")
      .replace(/^(#+\s*)?(\d+)\.\s*$/g, "")
      .replace(/^(Yêu cầu cần đạt|Năng lực|Phẩm chất|Chuẩn bị|Hành động):/gi, "");
  });

  return cleanedLines.filter(l => l.trim() !== "").join("\n");
};

/**
 * 🛠️ BỘ VÁ LỖI XML THÔNG MINH (Architecture 26.2 - Block-Aware)
 * Sửa lỗi Word chia cắt thẻ mà không phá hủy cấu trúc XML (Page/Row/Paragraph).
 */
const repairTags = (zip: PizZip) => {
  const files = Object.keys(zip.files).filter(path => path.startsWith("word/") && path.endsWith(".xml"));

  files.forEach((path) => {
    const file = zip.file(path);
    if (!file) return;
    let content = file.asText();

    // 1. Chỉ kết nối ngoặc nếu giữa chúng là các tag "Run-level" (không phá paragraph/table)
    const safeJoinRegex = /\{(<(?!w:(?:p|tr|tc|sectPr))[^>]+>|\s)*\{/g;
    const safeCloseRegex = /\}(<(?!w:(?:p|tr|tc|sectPr))[^>]+>|\s)*\}/g;

    content = content.replace(safeJoinRegex, "{{");
    content = content.replace(safeCloseRegex, "}}");

    // 2. Làm sạch trắng nội dung bên trong {{...}} để tránh lỗi split tag name
    content = content.replace(/(\{\{)([^{}]+?)(\}\})/g, (m, open, inner, close) => {
      // Giữ lại nội dung chữ, loại bỏ toàn bộ tag XML rác lọt vào giữa
      return open + inner.replace(/<[^>]+>/g, "").trim() + close;
    });

    // 3. Xử lý ngoặc đơn split (Run-level only)
    content = content.replace(/\{(<(?!w:(?:p|tr|tc|sectPr))[^>]+>|\s)+([^{}]+?)(<(?!w:(?:p|tr|tc|sectPr))[^>]+>|\s)+\}/g, (m, p1, inner, p3) => {
      return "{" + inner.replace(/<[^>]+>/g, "").trim() + "}";
    });

    zip.file(path, content);
  });
};

export const TemplateExportService = {
  /**
   * ⚙️ CONFIGURATION FOR DOCXTEMPLATER
   */
  getDocOptions() {
    return {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}'
      }
    };
  },

  /**
   * 🧪 CÔNG NGHỆ NHẬN DIỆN VÀ RENDER DỮ LIỆU ĐA TẦNG
   */
  flexibleRender(data: any): string {
    if (!data) return "...";
    if (typeof data === "string") return cleaner.cleanFinalOutput(data);

    if (Array.isArray(data)) {
      return data
        .map((item) => {
          if (typeof item === "string") return `- ${cleaner.cleanFinalOutput(item)}`;
          if (typeof item === "object") return this.flexibleRender(item);
          return `- ${String(item)}`;
        })
        .join("\n");
    }

    if (typeof data === "object") {
      return Object.entries(data)
        .filter(([key]) => !["metadata", "status", "id"].includes(key))
        .map(([key, value]) => {
          const label = key.replace(/_/g, " ").toUpperCase();
          const content = typeof value === "object" ? `\n${this.flexibleRender(value)}` : String(value);
          return `- ${label}: ${cleaner.cleanFinalOutput(content)}`;
        })
        .join("\n");
    }

    return String(data);
  },

  /**
   * 🖋️ ĐẢM BẢO DẤU GẠCH ĐẦU DÒNG CHO MỤC TIÊU
   */
  ensureBulletPoints(data: any): string {
    if (!data) return "...";
    if (Array.isArray(data)) {
      return data.map(item => `- ${cleaner.cleanFinalOutput(String(item))}`).join("\n");
    }
    const text = String(data);
    if (!text.trim().startsWith("-") && !text.trim().startsWith("*")) {
      return text.split("\n").map(line => line.trim() ? `- ${line.trim()}` : "").join("\n");
    }
    return cleaner.cleanFinalOutput(text);
  },

  /**
   * 🧬 BỘ GIẢI MÃ JSON THÔNG MINH
   */
  parseAIResult(input: any): any {
    if (typeof input === "object" && input !== null) return input;
    if (typeof input !== "string") return {};

    try {
      const sanitized = cleaner.sanitizeAIResponse(input);
      return JSON.parse(sanitized);
    } catch (e) {
      console.warn("⚠️ [DEEP_TRACE] Lỗi parse JSON, thử mode cứu hộ (Regex)...");
      try {
        const jsonMatch = input.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[jsonMatch.length - 1]);
      } catch (innerE) {
        console.error("❌ [DEEP_TRACE] Thất bại hoàn toàn khi parse dữ liệu AI.");
      }
      return {};
    }
  },

  /**
   * 🚀 XUẤT KẾ HOẠCH NGOẠI KHÓA
   */
  async exportEventToTemplate(inputData: any, templatePath: string = "/templates/mau-ke-hoach-ngoai-khoa.docx") {
    try {
      console.log("🛠️ [TECH_V26] ĐANG KÍCH HOẠT QUY TRÌNH ĐIỀN DỮ LIỆU THÔNG MINH...");
      const data = this.parseAIResult(inputData);
      const now = new Date();

      const rawTimeline = data.timeline || data.steps || data.tien_trinh || [];
      const processedTimeline = (Array.isArray(rawTimeline) ? rawTimeline : []).map((act: any) => ({
        header: clean(act.activity_name || act.name || act.hoat_dong || "HOẠT ĐỘNG").toUpperCase(),
        time: act.time ? `(${act.time})` : "",
        content: `- TRÌNH TỰ THỰC HIỆN:\n${this.flexibleRender(act.description || act.content || act.hoat_dong_chi_tiet)}\n` +
          `${act.mc_script ? `\n- LỜI DẪN MC:\n"${this.flexibleRender(act.mc_script)}"\n` : ""}` +
          `${act.logistics ? `\n- CHUẨN BỊ:\n${this.flexibleRender(act.logistics)}` : ""}`
      }));

      const rawBudget = data.budget_details || data.du_toan_kinh_phi || [];
      let totalValue = 0;
      const processedBudget = (Array.isArray(rawBudget) ? rawBudget : []).map((b: any, i: number) => {
        const costStr = String(b.cost || b.estimated_cost || "0");
        const val = parseInt(costStr.replace(/\D/g, "")) || 0;
        totalValue += val;
        return {
          stt: i + 1,
          item: clean(b.item || b.hang_muc),
          cost: val > 0 ? val.toLocaleString('vi-VN') + " đ" : costStr
        };
      });

      const finalData = {
        so_ke_hoach: clean(data.so_ke_hoach) || `${data.grade || "11"}/KHNK-HĐTN-HN`,
        thang: data.thang || (now.getMonth() + 1),
        nam: data.nam || now.getFullYear(),
        khoi_lop: data.grade || "11",
        chu_de: data.topic_id ? `Chủ đề ${data.topic_id}` : (clean(data.chu_de || data.theme) || "Hoạt động trải nghiệm, hướng nghiệp"),
        ten_chu_de: clean(data.ten_chu_de || data.ten_ke_hoach || data.title || "KẾ HOẠCH NGOẠI KHÓA").toUpperCase(),
        muc_dich_yeu_cau: this.ensureBulletPoints(data.muc_dich_yeu_cau || data.muc_tieu || data.purposes),
        nang_luc: this.flexibleRender(data.nang_luc || data.competencies),
        pham_chat: this.flexibleRender(data.pham_chat || data.qualities),
        thoi_gian: `7h 15 phút. Ngày ..... tháng ${data.thang || (now.getMonth() + 1)} năm ${data.nam || now.getFullYear()}.`,
        dia_diem: clean(data.dia_diem || "Sân trường THPT Bùi Thị Xuân"),
        budget: processedBudget,
        tong_kinh_phi: totalValue > 0 ? totalValue.toLocaleString('vi-VN') + " VNĐ" : (data.total_budget || "Theo thực tế"),
        chuan_bi: this.flexibleRender(data.chuan_bi || data.preparation || data.to_chuc_thuc_hien),
        timeline: processedTimeline,
        thong_diep_ket_thuc: clean(data.thong_diep_ket_thuc) || "Chúc chương trình thành công tốt đẹp!",
        to_truong: DEPT_INFO.head,
        hieu_truong: "Lê Phan Phan",
      };

      const response = await fetch(templatePath);
      if (!response.ok) throw new Error(`[DEEP_TRACE] Template not found: ${templatePath}`);
      const buffer = await response.arrayBuffer();
      const zip = new PizZip(buffer);

      console.log("🔍 [DEEP_TRACE:DATA] Payload for Template:", JSON.stringify(finalData, null, 2).slice(0, 1000) + "...");

      repairTags(zip);

      // 3. Forensic Sandbox for Docxtemplater
      let doc: any;
      try {
        console.log("🛠️ [DEEP_TRACE:ACTION] Initializing Docxtemplater Engine...");
        doc = new Docxtemplater(zip, this.getDocOptions());
        doc.render(finalData);
      } catch (e: any) {
        console.error("❌ [DEEP_TRACE:FAIL_LOUD] Docxtemplater Engine Failure.");
        if (e.properties && e.properties.errors) {
          console.error("Forensic Error Report:", JSON.stringify(e.properties.errors, null, 2));
          const tags = e.properties.errors.map((err: any) => err.properties?.xtag || err.properties?.tag).filter(Boolean);
          throw new Error(`Template Error! Broken tags detected: ${tags.join(", ") || e.message}`);
        }
        throw e;
      }

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });

      saveAs(out, `KHNK_${finalData.khoi_lop}_${finalData.ten_chu_de.slice(0, 20)}.docx`);
      return true;
    } catch (error: any) {
      console.error("❌ [TECH_V26] LỖI XUẤT WORD:", error);
      // Fail Loud with structural evidence
      if (error.properties?.errors) {
        console.warn("Dumping detailed Multi-Error for developer inspection...");
      }
      throw error;
    }
  },

  /**
   * 🚀 XUẤT GIÁO ÁN (STUB - Cần mở rộng nếu muốn dùng template cho KHBH)
   */
  async exportLessonToTemplate(inputData: any, templatePath: string = "/templates/mau-ke-hoach-day-hoc.docx") {
    console.log("🚀 [DEEP_TRACE:LESSON] Khởi động quy trình xuất giáo án...");
    try {
      const data = this.parseAIResult(inputData);
      const now = new Date();

      const finalData = {
        ten_truong: (DEPT_INFO.school || "THPT Bùi Thị Xuân").toUpperCase(),
        to_chuyen_mon: (DEPT_INFO.name || "Tổ HĐTN - HN").toUpperCase(),
        ten_giao_vien: DEPT_INFO.head,
        ngay_soan: `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`,
        chu_de: data.ma_chu_de || "10.1",
        ten_chu_de: (data.ten_bai || "KẾ HOẠCH BÀI DẠY").toUpperCase(),
        lop: inputData.grade || "10",
        so_tiet: data.so_tiet || "2 tiết",
        muc_tieu_kien_thuc: this.ensureBulletPoints(data.muc_tieu_kien_thuc),
        muc_tieu_nang_luc: this.flexibleRender(data.muc_tieu_nang_luc),
        muc_tieu_pham_chat: this.ensureBulletPoints(data.muc_tieu_pham_chat),
        gv_chuanbi: this.flexibleRender(data.gv_chuan_bi),
        hs_chuanbi: this.flexibleRender(data.hs_chuan_bi),
        hoat_dong_duoi_co: this.flexibleRender(data.shdc),
        hoat_dong_khoi_dong: this.flexibleRender(data.hoat_dong_khoi_dong),
        hoat_dong_kham_pha: this.flexibleRender(data.hoat_dong_kham_pha),
        hoat_dong_luyen_tap: this.flexibleRender(data.hoat_dong_luyen_tap),
        hoat_dong_van_dung: this.flexibleRender(data.hoat_dong_van_dung),
        tich_hop_nls: this.flexibleRender(data.tich_hop_nls),
        tich_hop_dao_duc: this.flexibleRender(data.tich_hop_dao_duc),
        ho_so_day_hoc: this.flexibleRender(data.ho_so_day_hoc),
        huong_dan_on_tap: this.flexibleRender(data.huong_dan_ve_nha)
      };

      const response = await fetch(templatePath);
      if (!response.ok) throw new Error(`Template not found: ${templatePath}`);
      const buffer = await response.arrayBuffer();
      const zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, this.getDocOptions());
      doc.render(finalData);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });

      saveAs(out, `GiaoAn_${finalData.lop}_${finalData.ten_chu_de.slice(0, 20)}.docx`);
      return true;
    } catch (error: any) {
      console.error("❌ [DEEP_TRACE:LESSON] Lỗi xuất giáo án:", error.message);
      throw error;
    }
  },

  async exportMeetingToTemplate(inputData: any, templatePath: string = "/templates/mau-bien-ban-hop-to.docx") {
    console.log("🚀 [DEEP_TRACE:MEETING] Khởi động quy trình xuất biên bản họp...");
    try {
      const data = this.parseAIResult(inputData);
      const now = new Date();

      const finalData = {
        upper_agency: (DEPT_INFO.upperAgency || "SỞ GIÁO DỤC VÀ ĐÀO TẠO LÂM ĐỒNG").toUpperCase(),
        ten_truong: (DEPT_INFO.school || "THPT Bùi Thị Xuân - Mũi Né").toUpperCase(),
        to_chuyen_mon: (DEPT_INFO.name || "TỔ HĐTN, HN & GDĐP").toUpperCase(),
        ngay: now.getDate(),
        thang: data.thang || (now.getMonth() + 1),
        nam: data.nam || now.getFullYear(),
        lan_hop: (data.lan_hop || `Sinh hoạt định kỳ`).toUpperCase(),
        chu_tri: DEPT_INFO.head,
        thu_ky: DEPT_INFO.secretary,
        thanh_vien: (DEPT_INFO.members.join(", ")),
        vang: DEPT_INFO.autoFill.vang || "0",
        ly_do: DEPT_INFO.autoFill.ly_do || "Không có",
        noi_dung_chinh: this.flexibleRender(data.noi_dung_chinh),
        uu_diem: this.ensureBulletPoints(data.uu_diem),
        han_che: this.ensureBulletPoints(data.han_che),
        ke_hoach_thang_toi: this.ensureBulletPoints(data.ke_hoach_thang_toi),
        y_kien_dong_gop: this.flexibleRender(data.y_kien_dong_gop)
      };

      const response = await fetch(templatePath);
      if (!response.ok) throw new Error(`Template not found at: ${templatePath}`);
      const buffer = await response.arrayBuffer();
      const zip = new PizZip(buffer);
      repairTags(zip);

      let doc: any;
      try {
        doc = new Docxtemplater(zip, this.getDocOptions());
        doc.render(finalData);
      } catch (e: any) {
        console.error("❌ [DEEP_TRACE:FAIL] Docxtemplater Meeting Failure.");
        if (e.properties && e.properties.errors) {
          const tags = e.properties.errors.map((err: any) => err.properties?.xtag || err.properties?.tag).filter(Boolean);
          throw new Error(`Template Meeting Error! Broken tags: ${tags.join(", ")}`);
        }
        throw e;
      }

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });

      saveAs(out, `BBHop_Thang${finalData.thang}_${finalData.to_chuyen_mon.replace(/\s+/g, '_')}.docx`);
      return true;
    } catch (error: any) {
      console.error("❌ [DEEP_TRACE:FATAL] Meeting Export Aborted:", error.message);
      throw error;
    }
  },

  async exportNCBHToTemplate(inputData: any, templatePath: string = "/templates/mau-ncbh.docx") {
    console.log("🚀 [DEEP_TRACE:NCBH] Khởi động quy trình xuất hồ sơ NCBH...");
    try {
      const data = this.parseAIResult(inputData);
      const now = new Date();
      const finalData = {
        upper_agency: (DEPT_INFO.upperAgency || "SỞ GIÁO DỤC VÀ ĐÀO TẠO LÂM ĐỒNG").toUpperCase(),
        ten_truong: (DEPT_INFO.school || "THPT BÙI THỊ XUÂN - MŨI NÉ").toUpperCase(),
        to_chuyen_mon: (DEPT_INFO.name || "TỔ HĐTN, HN & GDĐP").toUpperCase(),
        ngay: now.getDate(),
        thang: now.getMonth() + 1,
        nam: now.getFullYear(),
        chu_tri: DEPT_INFO.head,
        ten_bai: (data.ten_bai || "BÀI HỌC NGHIÊN CỨU").toUpperCase(),
        ly_do_chon: this.flexibleRender(data.ly_do_chon),
        muc_tieu: this.flexibleRender(data.muc_tieu),
        chuoi_hoat_dong: this.flexibleRender(data.chuoi_hoat_dong),
        phuong_an_ho_tro: this.flexibleRender(data.phuong_an_ho_tro || data.phu_ong_an_ho_tro),
        chia_se_nguoi_day: this.flexibleRender(data.chia_se_nguoi_day),
        nhan_xet_nguoi_du: this.flexibleRender(data.nhan_xet_nguoi_du),
        nguyen_nhan_giai_phap: this.flexibleRender(data.nguyen_nhan_giai_phap),
        bai_hoc_kin_nghiem: this.flexibleRender(data.bai_hoc_kin_nghiem)
      };

      const response = await fetch(templatePath);
      if (!response.ok) throw new Error(`Template not found: ${templatePath}`);
      const buffer = await response.arrayBuffer();
      const zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, this.getDocOptions());
      doc.render(finalData);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });

      saveAs(out, `NCBH_${finalData.ten_bai.slice(0, 20)}.docx`);
      return true;
    } catch (error: any) {
      console.error("❌ [DEEP_TRACE:NCBH] Lỗi xuất NCBH:", error.message);
      throw error;
    }
  },

  async exportAssessmentToTemplate(inputData: any, templatePath: string = "/templates/Assessment_Template.docx") {
    console.log("🚀 [DEEP_TRACE:ASSESSMENT] Khởi động quy trình xuất kế hoạch đánh giá...");
    try {
      const data = this.parseAIResult(inputData);
      const now = new Date();
      const finalData = {
        upper_agency: (DEPT_INFO.upperAgency || "SỞ GIÁO DỤC VÀ ĐÀO TẠO LÂM ĐỒNG").toUpperCase(),
        ten_truong: (DEPT_INFO.school || "THPT BÙI THỊ XUÂN - MŨI NÉ").toUpperCase(),
        to_chuyen_mon: (DEPT_INFO.name || "TỔ HĐTN, HN & GDĐP").toUpperCase(),
        ngay: now.getDate(),
        thang: now.getMonth() + 1,
        nam: now.getFullYear(),
        chu_tri: DEPT_INFO.head,
        ten_ke_hoach: (data.ten_ke_hoach || "KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ").toUpperCase(),
        hoc_ky: data.hoc_ky || "Học kỳ 1",
        khoi: inputData.grade || "10",
        muc_tieu: this.ensureBulletPoints(data.muc_tieu),
        noi_dung_nhiem_vu: this.flexibleRender(data.noi_dung_nhiem_vu),
        hinh_thuc_to_chuc: this.flexibleRender(data.hinh_thuc_to_chuc),
        ma_tran_dac_ta: this.flexibleRender(data.ma_tran_dac_ta),
        bang_kiem_rubric: this.flexibleRender(data.bang_kiem_rubric),
        loi_khuyen: this.flexibleRender(data.loi_khuyen)
      };

      const response = await fetch(templatePath);
      if (!response.ok) throw new Error(`Template not found: ${templatePath}`);
      const buffer = await response.arrayBuffer();
      const zip = new PizZip(buffer);
      repairTags(zip);

      const doc = new Docxtemplater(zip, this.getDocOptions());
      doc.render(finalData);

      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });

      saveAs(out, `DGGia_${finalData.khoi}_${finalData.ten_ke_hoach.slice(0, 20)}.docx`);
      return true;
    } catch (error: any) {
      console.error("❌ [DEEP_TRACE:ASSESSMENT] Lỗi xuất đánh giá:", error.message);
      throw error;
    }
  }
};
