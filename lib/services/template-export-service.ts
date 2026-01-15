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
        content: `- MÔ TẢ TRÌNH TỰ:\n${this.flexibleRender(act.description || act.content || act.hoat_dong_chi_tiet)}\n` +
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
  async exportLessonToTemplate(data: any, templatePath?: string) {
    console.warn("⚠️ exportLessonToTemplate chưa được triển khai đầy đủ với Template DOCX.");
    return false;
  },

  async exportMeetingToTemplate(data: any, templatePath?: string) {
    console.warn("⚠️ exportMeetingToTemplate chưa được triển khai đầy đủ với Template DOCX.");
    return false;
  },

  async exportNCBHToTemplate(data: any, templatePath?: string) {
    console.warn("⚠️ exportNCBHToTemplate chưa được triển khai đầy đủ với Template DOCX.");
    return false;
  },

  async exportAssessmentToTemplate(data: any, templatePath?: string) {
    console.warn("⚠️ exportAssessmentToTemplate chưa được triển khai đầy đủ với Template DOCX.");
    return false;
  }
};
