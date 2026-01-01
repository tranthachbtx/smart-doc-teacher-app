import { DEPT_INFO } from "@/lib/config/department";
import type {
  MeetingResult,
  LessonResult,
  EventResult,
  LessonTask,
  TemplateData,
  NCBHResult,
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
    // Remove Markdown Headers
    .replace(/^#+\s+/gm, "")
    // Remove Markdown Bold/Italic stars
    .replace(/\*{1,3}/g, "")
    // Remove TAB characters
    .replace(/\t/g, "")
    // Convert [COT_1] and [COT_2] markers to readable format for Word template
    .replace(/\[COT_1\]/g, "📋 THÔNG TIN HOẠT ĐỘNG:\n")
    .replace(/\[\/COT_1\]/g, "\n")
    .replace(/\[COT_2\]/g, "📝 TỔ CHỨC THỰC HIỆN:\n")
    .replace(/\[\/COT_2\]/g, "")
    // Legacy: Convert old column marker format
    .replace(/\[CỘT 1: THÔNG TIN\]/g, "📋 THÔNG TIN HOẠT ĐỘNG:\n")
    .replace(/\[CỘT 2: TỔ CHỨC THỰC HIỆN\]/g, "\n📝 TỔ CHỨC THỰC HIỆN:\n")
    .replace(/\[CỘT 1:[^\]]*\]/g, "")
    .replace(/\[CỘT 2:[^\]]*\]/g, "")
    // Convert markdown table format to readable text format
    .replace(/\|\s*BƯỚC\s*\|\s*HOẠT ĐỘNG (CỦA )?GV\s*\|\s*HOẠT ĐỘNG (CỦA )?HS\s*\|\s*THỜI GIAN\s*\|/gi,
      "BƯỚC | HOẠT ĐỘNG GV | HOẠT ĐỘNG HS | THỜI GIAN")
    .replace(/\|[-]+\|[-]+\|[-]+\|[-]+\|/g, "─────────────────────────────────────────")
    // Convert table rows: |B1|...|...|...|
    .replace(/\|\s*B(\d+)[:\s]*([^|]*)\s*\|\s*([^|]*)\s*\|\s*([^|]*)\s*\|\s*([^|]*)\s*\|/g,
      "B$1: $2\n  • GV: $3\n  • HS: $4\n  • Thời gian: $5")
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

const extractColumn = (text: string | undefined, column: 1 | 2): string => {
  if (!text) return "";
  const markerStart = column === 1 ? "[COT_1]" : "[COT_2]";
  const markerEnd = column === 1 ? "[/COT_1]" : "[/COT_2]";

  let startIdx = text.indexOf(markerStart);
  // Support legacy markers if new ones not found
  if (startIdx === -1) {
    const legacyMarker = column === 1 ? "[CỘT 1: THÔNG TIN]" : "[CỘT 2: TỔ CHỨC THỰC HIỆN]";
    startIdx = text.indexOf(legacyMarker);
    if (startIdx === -1) return "";

    // For legacy, we just take until the next marker or end
    const nextLegacyMarker = column === 1 ? "[CỘT 2:" : "[CỘT 1:";
    const nextIdx = text.indexOf(nextLegacyMarker, startIdx + 1);
    if (nextIdx !== -1) {
      return text.substring(startIdx + legacyMarker.length, nextIdx).trim();
    }
    return text.substring(startIdx + legacyMarker.length).trim();
  }

  const endIdx = text.indexOf(markerEnd, startIdx + markerStart.length);
  if (endIdx === -1) {
    const nextStartIdx = text.indexOf(column === 1 ? "[COT_2]" : "[COT_1]", startIdx + markerStart.length);
    if (nextStartIdx !== -1) {
      return text.substring(startIdx + markerStart.length, nextStartIdx).trim();
    }
    return text.substring(startIdx + markerStart.length).trim();
  }

  return text.substring(startIdx + markerStart.length, endIdx).trim();
};

const vStylePara = `<w:pPr><w:ind w:firstLine="720"/><w:jc w:val="both"/><w:spacing w:line="300" w:lineRule="auto" w:after="0"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>`;
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
    delimiters: {
      start: "{",
      end: "}",
    },
  });

  try {
    doc.render(data);
  } catch (error: any) {
    // Log detailed error for debugging
    console.error("[ExportService] Docxtemplater render error:", error);
    if (error.properties && error.properties.errors) {
      error.properties.errors.forEach((e: any) => {
        console.error("[ExportService] Template error:", e.message, "| Properties:", e.properties);
      });
    }
    throw new Error(`Lỗi xử lý template: ${error.message || "Không rõ lỗi"}`);
  }

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

    const cleanRedundantTitles = (text: string | undefined) => {
      if (!text) return "";
      let cleaned = formatForWord(text);
      // Remove common redundant patterns at the start (repeat up to 3 times for nested headers)
      for (let i = 0; i < 3; i++) {
        cleaned = cleaned
          .replace(/^(I\.\s*MỤC\s*TIÊU|II\.\s*THIẾT\s*BỊ\s*DẠY\s*HỌC|III\.\s*TIẾN\s*TRÌNH\s*DẠY\s*HỌC|IV\.\s*HỒ\s*SƠ|V\.\s*HƯỚNG\s*DẪN\s*VỀ\s*NHÀ):?\s*/i, "")
          .replace(/^(1\.\s*Yêu\s*cầu\s*cần\s*đạt|1\.\s*Kiến\s*thức|2\.\s*Năng\s*lực|3\.\s*Phẩm\s*chất|1\.\s*Đối\s*với\s*giáo\s*viên|2\.\s*Đối\s*với\s*học\s*sinh):?\s*/i, "")
          .trim();
      }
      return cleaned;
    };

    if (fullPlanMode) {
      const chuDeNumber = getChuDeNumber(month);
      data = {
        ten_truong: DEPT_INFO.school,
        to_chuyen_mon: DEPT_INFO.name,
        ten_giao_vien: "....................................", // Để trống cho GV tự điền hoặc có thể lấy từ setting
        giao_vien: "....................................",
        ngay_soan: new Date().toLocaleDateString("vi-VN"), // Simplified date
        chu_de: chuDeNumber,
        ten_chu_de: topic || autoFilledTheme,
        ten_bai: topic || autoFilledTheme,
        lop: grade,
        khoi: grade,
        so_tiet: duration,

        muc_tieu_kien_thuc: cleanRedundantTitles(result.muc_tieu_kien_thuc),
        muc_tieu_nang_luc: cleanRedundantTitles(result.muc_tieu_nang_luc),
        muc_tieu_pham_chat: cleanRedundantTitles(result.muc_tieu_pham_chat),

        gv_chuan_bi: cleanRedundantTitles(result.gv_chuan_bi),
        hs_chuan_bi: cleanRedundantTitles(result.hs_chuan_bi),
        thiet_bi_day_hoc: formatForWord(result.thiet_bi_day_hoc || ""),

        hoat_dong_duoi_co: formatForWord(result.hoat_dong_duoi_co || ""),
        shdc: formatForWord(result.shdc || ""),
        shl: formatForWord(result.shl || ""),
        hoat_dong_khoi_dong_cot_1: formatForWord(extractColumn(result.hoat_dong_khoi_dong, 1)),
        hoat_dong_khoi_dong_cot_2: formatForWord(extractColumn(result.hoat_dong_khoi_dong, 2)),

        hoat_dong_kham_pha_cot_1: formatForWord(extractColumn(result.hoat_dong_kham_pha, 1)),
        hoat_dong_kham_pha_cot_2: formatForWord(extractColumn(result.hoat_dong_kham_pha, 2)),

        hoat_dong_luyen_tap_cot_1: formatForWord(extractColumn(result.hoat_dong_luyen_tap, 1)),
        hoat_dong_luyen_tap_cot_2: formatForWord(extractColumn(result.hoat_dong_luyen_tap, 2)),

        hoat_dong_van_dung_cot_1: formatForWord(extractColumn(result.hoat_dong_van_dung, 1)),
        hoat_dong_van_dung_cot_2: formatForWord(extractColumn(result.hoat_dong_van_dung, 2)),


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
      topic: string;
    }
  ) {
    const { grade, term, productType, topic } = options;

    // Helper to format Matrix as a text table
    const formatMatrix = (matrix: any[]) => {
      if (!Array.isArray(matrix)) return "";
      return matrix.map(m => `+ Mức độ: ${m?.muc_do || 'N/A'}\n  Mô tả: ${m?.mo_ta || ''}`).join("\n\n");
    };

    // Helper to format Rubric as a text table
    const formatRubric = (rubric: any[]) => {
      if (!Array.isArray(rubric)) return "";
      return rubric.map(r => {
        const levels = r?.muc_do;
        let levelText = "";
        if (!levels) {
          levelText = "";
        } else if (typeof levels === 'string') {
          levelText = levels;
        } else if (typeof levels === 'object') {
          levelText = `\n  - Xuất sắc: ${levels.xuat_sac || ''}\n  - Tốt: ${levels.tot || ''}\n  - Đạt: ${levels.dat || ''}\n  - Chưa đạt: ${levels.chua_dat || ''}`;
        }
        return `+ Tiêu chí: ${r?.tieu_chi || 'N/A'} (Trọng số: ${r?.trong_so || 'N/A'})${levelText}`;
      }).join("\n\n");
    };

    const data = {
      // Required template fields
      ten_truong: DEPT_INFO.school.replace("Trường THPT ", ""),
      to_chuyen_mon: DEPT_INFO.name,
      hoc_ky: term,
      // Content fields - properly format complex data structures
      ten_ke_hoach: typeof result.ten_ke_hoach === 'string'
        ? result.ten_ke_hoach
        : `Kế hoạch kiểm tra ${term}`,
      // Format muc_tieu: handle array of objects with loai and chi_tiet
      muc_tieu: formatForWord((() => {
        if (!result.muc_tieu) return "";
        if (typeof result.muc_tieu === 'string') return result.muc_tieu;
        if (Array.isArray(result.muc_tieu)) {
          return result.muc_tieu.map((item: any) => {
            if (typeof item === 'string') return item;
            if (item.loai && item.chi_tiet) {
              const details = Array.isArray(item.chi_tiet) ? item.chi_tiet.join("\n- ") : item.chi_tiet;
              return `${item.loai}:\n- ${details}`;
            }
            return "";
          }).filter(Boolean).join("\n\n");
        }
        return "";
      })()),
      // Format noi_dung_nhiem_vu: handle object with tieu_de_du_an, boi_canh, yeu_cau_san_pham, thoi_han
      noi_dung_nhiem_vu: formatForWord((() => {
        if (!result.noi_dung_nhiem_vu) return "";
        if (typeof result.noi_dung_nhiem_vu === 'string') return result.noi_dung_nhiem_vu;
        if (typeof result.noi_dung_nhiem_vu === 'object') {
          const obj = result.noi_dung_nhiem_vu;
          const parts: string[] = [];
          if (obj.tieu_de_du_an) parts.push(`Tên dự án: ${obj.tieu_de_du_an}`);
          if (obj.boi_canh) parts.push(`Bối cảnh: ${obj.boi_canh}`);
          if (obj.yeu_cau_san_pham) parts.push(`Yêu cầu sản phẩm: ${obj.yeu_cau_san_pham}`);
          if (obj.thoi_han) parts.push(`Thời hạn: ${obj.thoi_han}`);
          return parts.join("\n\n");
        }
        return "";
      })()),
      hinh_thuc_to_chuc: formatForWord(
        typeof result.hinh_thuc_to_chuc === 'string'
          ? result.hinh_thuc_to_chuc
          : ""
      ),
      ma_tran_dac_ta: formatForWord(formatMatrix(result.ma_tran_dac_ta)),
      bang_kiem_rubric: formatForWord(formatRubric(result.bang_kiem_rubric)),
      loi_khuyen: formatForWord(
        typeof result.loi_khuyen === 'string'
          ? result.loi_khuyen
          : ""
      ),
      khoi: grade || "10",
      ky_danh_gia: term || "",
      loai_san_pham: productType || "",
      san_pham: productType || "", // Map to {{san_pham}} in template
      ten_chu_de: topic || "",
    };

    const fileName = `KH_KiemTra_${term}_Khoi${grade}.docx`.replace(/\s+/g, "_");

    // If no user-uploaded template, create Word file directly using docx library
    if (!template?.data) {
      const docx = await import("docx");
      const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;

      // Standard document formatting constants (in TWIPs - 1/20 of a point)
      const FIRST_LINE_INDENT = 720; // 0.5 inch = 720 TWIPs
      const LINE_SPACING = 276; // 1.15 line spacing
      const SPACING_AFTER = 120; // 6pt after paragraph
      const FONT_SIZE = 26; // 13pt
      const FONT_NAME = "Times New Roman";

      // Helper to create a paragraph with proper formatting
      const createFormattedParagraph = (
        text: string,
        options: {
          bold?: boolean;
          italics?: boolean;
          isTitle?: boolean;
          isBullet?: boolean;
          noIndent?: boolean;
        } = {}
      ) => {
        const { bold = false, italics = false, isTitle = false, isBullet = false, noIndent = false } = options;
        return new Paragraph({
          alignment: isTitle ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
          indent: isTitle || noIndent || isBullet ? undefined : { firstLine: FIRST_LINE_INDENT },
          spacing: { line: LINE_SPACING, after: SPACING_AFTER },
          children: [new TextRun({
            text: isBullet ? `• ${text}` : text,
            size: isTitle ? 28 : FONT_SIZE,
            font: FONT_NAME,
            bold,
            italics
          })],
        });
      };

      // Helper to create multiple paragraphs from text with newlines
      const createParagraphs = (text: string, options: { bold?: boolean; italics?: boolean } = {}): any[] => {
        if (!text) return [];
        const lines = text.split(/\n/).filter(line => line.trim());
        return lines.map(line => {
          const trimmedLine = line.trim();
          // Check if line starts with bullet point markers
          const isBullet = /^[-•+]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine);
          const cleanLine = trimmedLine.replace(/^[-•+]\s/, '').replace(/^\d+\.\s/, '');

          return createFormattedParagraph(
            isBullet ? cleanLine : trimmedLine,
            { ...options, isBullet, noIndent: isBullet }
          );
        });
      };

      // Safe text formatter that handles any input type
      const formatText = (text: unknown): string => {
        if (text === null || text === undefined) return "";
        if (typeof text === 'string') {
          return text.replace(/\[\[STYLE_FIX\]\]/g, "").replace(/\{\{BR\}\}/g, "\n");
        }
        return String(text);
      };

      // Prepare content strings
      const safeData = {
        ten_ke_hoach: formatText(data.ten_ke_hoach) || "Kế hoạch kiểm tra",
        ten_truong: formatText(data.ten_truong) || "Bùi Thị Xuân - Mũi Né",
        to_chuyen_mon: formatText(data.to_chuyen_mon) || "Tổ HĐTN, HN & GDĐP",
        khoi: formatText(data.khoi) || "10",
        ky_danh_gia: formatText(data.ky_danh_gia) || "",
        san_pham: formatText(data.san_pham) || "",
        ten_chu_de: formatText(data.ten_chu_de) || "",
        muc_tieu: formatText(data.muc_tieu) || "",
        noi_dung_nhiem_vu: formatText(data.noi_dung_nhiem_vu) || "",
        hinh_thuc_to_chuc: formatText(data.hinh_thuc_to_chuc) || "",
        ma_tran_dac_ta: formatText(data.ma_tran_dac_ta) || "",
        bang_kiem_rubric: formatText(data.bang_kiem_rubric) || "",
        loi_khuyen: formatText(data.loi_khuyen) || "",
      };

      // Build document children array
      const docChildren: (typeof Paragraph | typeof Table)[] = [
        // Header Table - 2 columns
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TRƯỜNG THPT", bold: true, size: 26, font: FONT_NAME })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: safeData.ten_truong, bold: true, size: 26, font: FONT_NAME })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `TỔ: ${safeData.to_chuyen_mon}`, size: 24, font: FONT_NAME })] }),
                  ],
                }),
                new TableCell({
                  width: { size: 60, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 26, font: FONT_NAME })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 26, font: FONT_NAME, underline: {} })] }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        // Title - Centered, Bold, Uppercase
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ", bold: true, size: 32, font: FONT_NAME })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: `${(safeData.ky_danh_gia || "").toUpperCase()} - NĂM HỌC 20... - 20...`, bold: true, size: 28, font: FONT_NAME })]
        }),
        new Paragraph({ text: "" }),
        // Info section - No indent, standard spacing
        new Paragraph({
          spacing: { after: SPACING_AFTER },
          children: [new TextRun({ text: "Môn học/HĐGD: ", bold: true, size: FONT_SIZE, font: FONT_NAME }), new TextRun({ text: "Hoạt động trải nghiệm, Hướng nghiệp", size: FONT_SIZE, font: FONT_NAME })]
        }),
        new Paragraph({
          spacing: { after: SPACING_AFTER },
          children: [new TextRun({ text: "Khối lớp: ", bold: true, size: FONT_SIZE, font: FONT_NAME }), new TextRun({ text: safeData.khoi, size: FONT_SIZE, font: FONT_NAME })]
        }),
        new Paragraph({
          spacing: { after: SPACING_AFTER },
          children: [new TextRun({ text: "Thời điểm đánh giá: ", bold: true, size: FONT_SIZE, font: FONT_NAME }), new TextRun({ text: safeData.ky_danh_gia, size: FONT_SIZE, font: FONT_NAME })]
        }),
        new Paragraph({
          spacing: { after: SPACING_AFTER },
          children: [new TextRun({ text: "Chủ đề/Nội dung: ", bold: true, size: FONT_SIZE, font: FONT_NAME }), new TextRun({ text: safeData.ten_chu_de, size: FONT_SIZE, font: FONT_NAME })]
        }),
        new Paragraph({ text: "" }),
        // I. Objectives
        new Paragraph({
          spacing: { before: 200, after: SPACING_AFTER },
          children: [new TextRun({ text: "I. MỤC TIÊU ĐÁNH GIÁ", bold: true, size: 28, font: FONT_NAME })]
        }),
        ...createParagraphs(safeData.muc_tieu),
        // II. Forms & Products
        new Paragraph({
          spacing: { before: 200, after: SPACING_AFTER },
          children: [new TextRun({ text: "II. HÌNH THỨC VÀ SẢN PHẨM", bold: true, size: 28, font: FONT_NAME })]
        }),
        createFormattedParagraph(`Hình thức tổ chức: ${safeData.hinh_thuc_to_chuc}`, { noIndent: true }),
        createFormattedParagraph(`Sản phẩm yêu cầu: ${safeData.san_pham}`, { noIndent: true }),
        new Paragraph({ text: "" }),
        new Paragraph({
          spacing: { after: SPACING_AFTER },
          children: [new TextRun({ text: "Nội dung nhiệm vụ cụ thể:", bold: true, italics: true, size: FONT_SIZE, font: FONT_NAME })]
        }),
        ...createParagraphs(safeData.noi_dung_nhiem_vu),
        // III. Matrix
        new Paragraph({
          spacing: { before: 200, after: SPACING_AFTER },
          children: [new TextRun({ text: "III. MA TRẬN ĐẶC TẢ", bold: true, size: 28, font: FONT_NAME })]
        }),
        ...createParagraphs(safeData.ma_tran_dac_ta),
        // IV. Rubric
        new Paragraph({
          spacing: { before: 200, after: SPACING_AFTER },
          children: [new TextRun({ text: "IV. TIÊU CHÍ ĐÁNH GIÁ (RUBRIC)", bold: true, size: 28, font: FONT_NAME })]
        }),
        ...createParagraphs(safeData.bang_kiem_rubric),
        // V. Notes
        new Paragraph({
          spacing: { before: 200, after: SPACING_AFTER },
          children: [new TextRun({ text: "V. GHI CHÚ CHO GIÁO VIÊN", bold: true, size: 28, font: FONT_NAME })]
        }),
        ...createParagraphs(safeData.loi_khuyen),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        // Footer - Signatures Table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN", bold: true, size: FONT_SIZE, font: FONT_NAME })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 24, font: FONT_NAME })] }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "GIÁO VIÊN LẬP KẾ HOẠCH", bold: true, size: FONT_SIZE, font: FONT_NAME })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true, size: 24, font: FONT_NAME })] }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ];

      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren as any[],
        }],
      });

      const blob = await Packer.toBlob(doc);

      // Save file
      let saveAs: (blob: Blob, filename: string) => void;
      try {
        const fileSaver = await import("file-saver");
        saveAs = (fileSaver as any).saveAs || (fileSaver as any).default?.saveAs || (fileSaver as any).default;
      } catch {
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

      saveAs(blob, fileName);
      return { success: true, method: "download" as const };
    }

    return processTemplate(data, template.data, fileName);
  },

  async exportNCBH(
    result: NCBHResult,
    template: TemplateData | null,
    options: {
      grade: string;
      month: string;
      topic: string;
    }
  ) {
    const { grade, month, topic } = options;

    const data = {
      ten_truong: DEPT_INFO.school,
      to_chuyen_mon: DEPT_INFO.name,
      ngay_thuc_hien: new Date().toLocaleDateString("vi-VN"),
      lop: grade,
      khoi: grade,
      thang: month,
      ten_bai: topic,

      // Giai đoạn 1
      ly_do_chon: formatForWord(result.ly_do_chon),
      muc_tieu: formatForWord(result.muc_tieu),
      chuoi_hoat_dong: formatForWord(result.chuoi_hoat_dong),
      phuong_an_ho_tro: formatForWord(result.phuong_an_ho_tro),

      // Giai đoạn 2 & 3
      chia_se_nguoi_day: formatForWord(result.chia_se_nguoi_day),
      nhan_xet_nguoi_du: formatForWord(result.nhan_xet_nguoi_du),
      nguyen_nhan_giai_phap: formatForWord(result.nguyen_nhan_giai_phap),
      bai_hoc_kinh_nghiem: formatForWord(result.bai_hoc_kinh_nghiem),
    };

    const fileName = `NCBH_${grade}_T${month}_${topic.substring(0, 20)}.docx`;
    return processTemplate(data, template?.data || null, fileName);
  },
};
