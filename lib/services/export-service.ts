import { DEPT_INFO } from "@/lib/config/department";
import type {
  MeetingResult,
  LessonResult,
  EventResult,
  LessonTask,
  TemplateData,
} from "@/lib/types";
import type { PPCTItem } from "@/lib/template-storage";

// Helper function to format text for Word
function formatForWord(text: unknown): string {
  // Handle null/undefined
  if (text === null || text === undefined) return "";

  // Handle arrays - join with newlines
  if (Array.isArray(text)) {
    return formatForWord(
      text
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            // Format object items recursively
            return Object.entries(item)
              .map(
                ([key, value]) =>
                  `${key}: ${typeof value === "string" ? value : JSON.stringify(value)
                  }`
              )
              .join("\n");
          }
          return String(item);
        })
        .join("\n")
    );
  }

  // Handle objects - convert to string representation
  if (typeof text === "object") {
    const obj = text as Record<string, unknown>;
    // Special handling for SHDC/SHL objects
    if ("shdc" in obj || "shl" in obj) {
      const parts: string[] = [];
      if (obj.shdc && Array.isArray(obj.shdc)) {
        parts.push("SINH HOẠT DƯỚI CỜ:");
        obj.shdc.forEach((item: Record<string, unknown>, idx: number) => {
          parts.push(
            `Tuần ${idx + 1}: ${item.ten_hoat_dong || item.ten || ""}`
          );
          if (item.noi_dung_chinh)
            parts.push(`Nội dung: ${item.noi_dung_chinh}`);
        });
      }
      if (obj.shl && Array.isArray(obj.shl)) {
        parts.push("\nSINH HOẠT LỚP:");
        obj.shl.forEach((item: Record<string, unknown>, idx: number) => {
          parts.push(
            `Tuần ${idx + 1}: ${item.ten_hoat_dong || item.ten || ""}`
          );
          if (item.noi_dung_chinh)
            parts.push(`Nội dung: ${item.noi_dung_chinh}`);
        });
      }
      return formatForWord(parts.join("\n"));
    }
    // Generic object handling
    return formatForWord(
      Object.entries(obj)
        .map(
          ([key, value]) =>
            `${key}: ${typeof value === "string" ? value : JSON.stringify(value)
            }`
        )
        .join("\n")
    );
  }

  // Handle non-string primitives
  if (typeof text !== "string") {
    return formatForWord(String(text));
  }

  // Now we know text is a string
  let formatted = text
    // Remove TAB characters
    .replace(/\t/g, "")
    // Remove ** markdown bold (not supported in simple text tags)
    .replace(/\*\*/g, "")
    // Clean up lines
    .split("\n")
    .map((line) => line.trim())
    // Collapse multiple empty lines into a single newline
    .filter((line, index, arr) => line !== "" || (index > 0 && arr[index - 1] !== ""))
    .join("\n")
    .trim()
    // Convert multiple newlines to single newlines for paragraph separation
    .replace(/\n\s*\n/g, "\n");

  if (!formatted) return "";

  // Standardize administrative styling (Decree 30/2020/NĐ-CP):
  // - Line spacing: 1.5 lines
  // - First line indent: 1.27cm (720 twips)
  // - Justified alignment
  // - Font: Times New Roman, Size 13pt (26 half-points)

  // Use a marker for line breaks and a special marker for the start
  return "[[STYLE_FIX]]" + formatted.replace(/\n/g, "{{BR}}");
}

const vStylePara = `<w:pPr><w:ind w:firstLine="720"/><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="0"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>`;
const vStyleBreak = `</w:t></w:r></w:p><w:p>${vStylePara}`;

function getChuDeNumber(month: string): string {
  const monthNum = Number.parseInt(month);
  // Map month to chu de number based on academic year
  const monthToChuDe: Record<number, number> = {
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 9,
  };
  return monthToChuDe[monthNum]?.toString() || "1";
}

// Core export logic
async function processTemplate(
  data: Record<string, any>,
  templateData: ArrayBuffer | null,
  fileName: string
) {
  // If no template, copy to clipboard
  if (!templateData) {
    const content = Object.entries(data)
      .map(
        ([key, value]) =>
          `${key}:\n${(String(value) || "").replace(/\{\{BR\}\}/g, "\n")}`
      )
      .join("\n\n---\n\n");

    await navigator.clipboard.writeText(content);
    return { success: true, method: "clipboard" as const };
  }

  // Dynamic imports for docx processing with fallback for different module formats
  const PizZipModule = await import("pizzip");
  const PizZip = PizZipModule.default || PizZipModule;

  const DocxtemplaterModule = await import("docxtemplater");
  const Docxtemplater = DocxtemplaterModule.default || DocxtemplaterModule;

  let saveAs: (blob: Blob, filename: string) => void;

  try {
    const fileSaver = await import("file-saver");
    saveAs = (fileSaver as any).saveAs || (fileSaver as any).default?.saveAs || (fileSaver as any).default;
    if (typeof saveAs !== "function") throw new Error("FileSaver not found");
  } catch (err) {
    console.warn("FileSaver not available, using DOM fallback:", err);
    saveAs = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
  }

  const zip = new PizZip(templateData);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: false, // We handle them manually for better control
    nullGetter: () => "",
  });

  doc.render(data);

  const processedZip = doc.getZip();
  const documentXml = processedZip.file("word/document.xml");
  if (documentXml) {
    let xmlContent = documentXml.asText();

    // Administrative styles according to Decree 30/2020/NĐ-CP
    // Font: Times New Roman, Size: 13pt (26 half-points), Spacing: 1.5 lines (360 twips)
    const adminStylesPara = `<w:pPr><w:ind w:firstLine="720"/><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="0"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>`;
    const adminStylesBreak = `</w:t></w:r></w:p><w:p>${adminStylesPara}`;

    // 1. Handle internal line breaks
    xmlContent = xmlContent.replace(/\{\{BR\}\}/g, adminStylesBreak);

    // 2. Handle first-line paragraph formatting using the [[STYLE_FIX]] marker
    // We look for paragraphs containing the marker and inject the administrative style properties
    // This fixed the common issue where the first line inherits a different style from the template
    xmlContent = xmlContent.replace(/(<w:p(?: [^>]*)?>)(<w:pPr>.*?<\/w:pPr>)?(<w:r(?: [^>]*)?><w:rPr>.*?<\/w:rPr><w:t(?: [^>]*)?>.*?\[\[STYLE_FIX\]\])/g, (match, pOpen, pPr, rest) => {
      // Replace existing pPr with administrative pPr or inject if missing
      const newPPr = `<w:pPr><w:ind w:firstLine="720"/><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="0"/></w:pPr>`;
      return `${pOpen}${newPPr}${rest}`;
    });

    // 3. Remove markers
    xmlContent = xmlContent.replace(/\[\[STYLE_FIX\]\]/g, "");

    // Enforce Vietnamese Administrative Margins (Decree 30)
    xmlContent = xmlContent.replace(/<w:pgMar[^>]*\/>/g, '<w:pgMar w:top="1134" w:right="850" w:bottom="1134" w:left="1701" w:header="720" w:footer="720" w:gutter="0"/>');

    processedZip.file("word/document.xml", xmlContent);

    processedZip.file("word/document.xml", xmlContent);
  }

  const output = processedZip.generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(output, fileName);
  return { success: true, method: "download" as const };
}

export const ExportService = {
  async exportMeeting(
    result: MeetingResult,
    template: TemplateData | null,
    month: string,
    session: string
  ) {
    const data = {
      ...DEPT_INFO.autoFill,
      thang: month,
      lan_hop: session,
      noi_dung_chinh: formatForWord(result.noi_dung_chinh),
      uu_diem: formatForWord(result.uu_diem || ""),
      han_che: formatForWord(result.han_che || ""),
      y_kien_dong_gop: formatForWord(result.y_kien_dong_gop),
      ke_hoach_thang_toi: formatForWord(result.ke_hoach_thang_toi),
      ket_luan_cuoc_hop: formatForWord(result.ket_luan_cuoc_hop || ""),
    };
    const fileName = `Bien_ban_hop_T${month}_L${session}.docx`;
    return processTemplate(data, template?.data || null, fileName);
  },

  async exportLesson(
    result: LessonResult,
    template: TemplateData | null,
    options: {
      grade: string;
      topic: string;
      month: string;
      duration: string;
      fullPlanMode: boolean;
      reviewMode: boolean;
      tasks: LessonTask[];
      ppctData: PPCTItem[];
      autoFilledTheme: string;
      suggestions: { shdc?: string; hdgd?: string; shl?: string };
    }
  ) {
    const {
      grade,
      topic,
      month,
      duration,
      fullPlanMode,
      reviewMode,
      tasks,
      ppctData,
      autoFilledTheme,
      suggestions,
    } = options;
    const reviewPrefix = reviewMode ? "[AI - CẦN DUYỆT] " : "";
    let data: Record<string, any> = {};
    let fileName = "";

    if (fullPlanMode) {
      const chuDeNumber = getChuDeNumber(month);
      data = {
        ngay_soan: new Date().toLocaleDateString("vi-VN"), // Simplified date
        chu_de: chuDeNumber,
        ten_chu_de: topic || autoFilledTheme,
        ten_bai: topic || autoFilledTheme,
        lop: grade,
        khoi: grade,
        so_tiet: duration,

        muc_tieu_kien_thuc: formatForWord(result.muc_tieu_kien_thuc || ""),
        muc_tieu_nang_luc: formatForWord(result.muc_tieu_nang_luc || ""),
        muc_tieu_pham_chat: formatForWord(result.muc_tieu_pham_chat || ""),

        gv_chuan_bi: formatForWord(result.gv_chuan_bi || ""),
        hs_chuan_bi: formatForWord(result.hs_chuan_bi || ""),
        thiet_bi_day_hoc: formatForWord(result.thiet_bi_day_hoc || ""),

        hoat_dong_duoi_co: formatForWord(result.hoat_dong_duoi_co || ""),
        shdc: formatForWord(result.shdc || ""),
        shl: formatForWord(result.shl || ""),
        hoat_dong_khoi_dong: formatForWord(result.hoat_dong_khoi_dong || ""),
        hoat_dong_kham_pha: formatForWord(result.hoat_dong_kham_pha || ""),
        hoat_dong_luyen_tap: formatForWord(result.hoat_dong_luyen_tap || ""),
        hoat_dong_van_dung: formatForWord(result.hoat_dong_van_dung || ""),

        ho_so_day_hoc: formatForWord(result.ho_so_day_hoc || ""),
        huong_dan_ve_nha: formatForWord(result.huong_dan_ve_nha || ""),

        tich_hop_nls: reviewPrefix + formatForWord(result.tich_hop_nls),
        tich_hop_dao_duc: reviewPrefix + formatForWord(result.tich_hop_dao_duc),

        shdc_gợi_ý: formatForWord(result.shdc_gợi_ý || suggestions.shdc),
        hdgd_gợi_ý: formatForWord(result.hdgd_gợi_ý || suggestions.hdgd),
        shl_gợi_ý: formatForWord(result.shl_gợi_ý || suggestions.shl),
      };

      // Add tasks
      tasks.forEach((task, index) => {
        const taskNum = index + 1;
        data[`nhiem_vu_${taskNum}_ten`] = task.name || "";
        data[`nhiem_vu_${taskNum}_noi_dung`] = formatForWord(
          task.content || ""
        );
        data[`nhiem_vu_${taskNum}_ky_nang`] = formatForWord(
          Array.isArray(task.kyNangCanDat)
            ? task.kyNangCanDat.join(", ")
            : task.kyNangCanDat || ""
        );
        data[`nhiem_vu_${taskNum}_san_pham`] = formatForWord(
          task.sanPhamDuKien || ""
        );
        data[`nhiem_vu_${taskNum}_thoi_luong`] = task.thoiLuongDeXuat || "";

        const nhiemVuFromResult = result.nhiem_vu?.[index];
        if (nhiemVuFromResult?.to_chuc_thuc_hien) {
          data[`nhiem_vu_${taskNum}_chuyen_giao`] = formatForWord(
            nhiemVuFromResult.to_chuc_thuc_hien.chuyen_giao || ""
          );
          data[`nhiem_vu_${taskNum}_thuc_hien`] = formatForWord(
            nhiemVuFromResult.to_chuc_thuc_hien.thuc_hien || ""
          );
          data[`nhiem_vu_${taskNum}_bao_cao`] = formatForWord(
            nhiemVuFromResult.to_chuc_thuc_hien.bao_cao || ""
          );
          data[`nhiem_vu_${taskNum}_ket_luan`] = formatForWord(
            nhiemVuFromResult.to_chuc_thuc_hien.ket_luan || ""
          );
        }
      });

      // Add PPCT
      ppctData.forEach((ppctItem) => {
        data[`ppct_thang_${ppctItem.month}_ten`] = ppctItem.theme || "";
        data[`ppct_thang_${ppctItem.month}_so_tiet`] =
          ppctItem.periods.toString();
        if (ppctItem.notes)
          data[`ppct_thang_${ppctItem.month}_ghi_chu`] = ppctItem.notes;

        // Add activities
        if (ppctItem.activities && ppctItem.activities.length > 0) {
          data[`ppct_thang_${ppctItem.month}_hoat_dong`] = formatForWord(ppctItem.activities.join("\n"));
          ppctItem.activities.forEach((act, actIdx) => {
            data[`ppct_thang_${ppctItem.month}_hoat_dong_${actIdx + 1}`] = act;
          });
        }

        if (ppctItem.tasks && ppctItem.tasks.length > 0) {
          ppctItem.tasks.forEach((task, taskIndex) => {
            data[`ppct_thang_${ppctItem.month}_nhiem_vu_${taskIndex + 1}_ten`] =
              task.name || "";
            data[
              `ppct_thang_${ppctItem.month}_nhiem_vu_${taskIndex + 1}_mo_ta`
            ] = formatForWord(task.description || "");
          });
        }
      });

      fileName = `KHBD_Lop${grade}_ChuDe${chuDeNumber}_${topic || autoFilledTheme
        }.docx`.replace(/\s+/g, "_");
    } else {
      data = {
        ten_bai: topic || autoFilledTheme,
        khoi: grade,
        tich_hop_nls: reviewPrefix + formatForWord(result.tich_hop_nls),
        tich_hop_dao_duc: reviewPrefix + formatForWord(result.tich_hop_dao_duc),
      };
      fileName = `KHBD_tich_hop_${topic || autoFilledTheme}.docx`.replace(
        /\s+/g,
        "_"
      );
    }

    return processTemplate(data, template?.data || null, fileName);
  },

  async exportEvent(
    result: EventResult,
    template: TemplateData | null,
    options: {
      grade: string;
      month: string;
      budget?: string;
      checklist?: string;
      autoFilledTheme: string;
    }
  ) {
    const { grade, month, budget, checklist, autoFilledTheme } = options;

    // Check if autoFilledTheme matches result or use simple logic?
    // The original code passed autoFilledTheme indirectly or from state.

    const data = {
      ten_chu_de: result.ten_chu_de,
      nang_luc: formatForWord(result.nang_luc || ""),
      pham_chat: formatForWord(result.pham_chat || ""),
      muc_dich_yeu_cau: formatForWord(result.muc_dich_yeu_cau),
      kich_ban_chi_tiet: formatForWord(result.kich_ban_chi_tiet),
      thong_diep_ket_thuc: formatForWord(result.thong_diep_ket_thuc),
      khoi: grade,
      thang: month,
      du_toan_kinh_phi: formatForWord(result.du_toan_kinh_phi || budget || ""),
      checklist_chuan_bi: formatForWord(
        result.checklist_chuan_bi || checklist || ""
      ),
      danh_gia_sau_hoat_dong: formatForWord(
        result.danh_gia_sau_hoat_dong ||
        `1. Mức độ hoàn thành mục tiêu: __/10\n2. Sự tham gia của học sinh: __/10\n3. Công tác tổ chức: __/10\n4. Bài học kinh nghiệm:\n5. Đề xuất cải tiến:`
      ),
    };
    const fileName = `KH_Ngoaikhoa_KG_${grade}_T${month}.docx`;
    return processTemplate(data, template?.data || null, fileName);
  },

  async exportAssessmentPlan(
    result: any,
    template: TemplateData | null,
    options: {
      grade: string;
      term: string;
      productType: string;
    }
  ) {
    const { grade, term, productType } = options;

    // Helper to format Matrix as a text table
    const formatMatrix = (matrix: any[]) => {
      if (!Array.isArray(matrix)) return "";
      return matrix.map(m => `+ Mức độ: ${m.muc_do}\n  Mô tả: ${m.mo_ta}`).join("\n\n");
    };

    // Helper to format Rubric as a text table
    const formatRubric = (rubric: any[]) => {
      if (!Array.isArray(rubric)) return "";
      return rubric.map(r => {
        const levels = r.muc_do;
        let levelText = "";
        if (typeof levels === 'string') {
          levelText = levels;
        } else {
          levelText = `\n  - Xuất sắc: ${levels.xuat_sac || ''}\n  - Tốt: ${levels.tot || ''}\n  - Đạt: ${levels.dat || ''}\n  - Chưa đạt: ${levels.chua_dat || ''}`;
        }
        return `+ Tiêu chí: ${r.tieu_chi} (Trọng số: ${r.trong_so})${levelText}`;
      }).join("\n\n");
    };

    const data = {
      ten_ke_hoach: result.ten_ke_hoach,
      muc_tieu: formatForWord(Array.isArray(result.muc_tieu) ? result.muc_tieu.join("\n") : result.muc_tieu),
      noi_dung_nhiem_vu: formatForWord(result.noi_dung_nhiem_vu),
      hinh_thuc_to_chuc: formatForWord(result.hinh_thuc_to_chuc),
      ma_tran_dac_ta: formatForWord(formatMatrix(result.ma_tran_dac_ta)),
      bang_kiem_rubric: formatForWord(formatRubric(result.bang_kiem_rubric)),
      loi_khuyen: formatForWord(result.loi_khuyen),
      khoi: grade,
      ky_danh_gia: term,
      loai_san_pham: productType,
    };

    const fileName = `KH_KiemTra_${term}_Khoi${grade}.docx`.replace(/\s+/g, "_");
    return processTemplate(data, template?.data || null, fileName);
  },
};
