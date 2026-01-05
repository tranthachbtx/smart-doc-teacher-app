import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
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
 * Service to handle document exports with enhanced formatting (MOET 5512 Standard)
 * Optimized for large content (60-80 pages) with chunking and non-blocking processing.
 */
export const ExportService = {
  // Thresholds for Large Content Handling
  LARGE_CONTENT_THRESHOLD: 50000, // characters
  PROGRESS_CHUNK_SIZE: 5000,
  /**
   * Exports a Lesson Plan to a .docx file with Progress Tracking
   */
  /**
   * Exports a Lesson Plan to a .docx file with Progress Tracking
   * Tuân thủ chuẩn Công văn 5512/BGDĐT-GDTrH với cấu trúc 2 cột.
   */
  async exportLessonToDocx(
    result: LessonResult,
    fileName: string = "Giao_an_HDTN.docx",
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    if (onProgress) onProgress(10);

    const children: any[] = [
      // Header Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: "KẾ HOẠCH BÀI DẠY (CHƯƠNG TRÌNH GDPT 2018)",
            bold: true,
            size: 32,
            color: "2E59A7"
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),

      // I. TÊN BÀI HỌC
      this.createSectionTitle("I. TÊN BÀI HỌC/CHỦ ĐỀ"),
      this.createField("", result.ten_bai || "..."),

      // II. MỤC TIÊU
      this.createSectionTitle("II. MỤC TIÊU"),
      this.createField("1. Kiến thức:", result.muc_tieu_kien_thuc),
      this.createField("2. Năng lực:", result.muc_tieu_nang_luc),
      this.createField("3. Phẩm chất:", result.muc_tieu_pham_chat),
      this.createField("4. Tích hợp Năng lực số (TT 02/2025):", result.tich_hop_nls),
      this.createField("5. Tích hợp Đạo đức/Giá trị:", result.tich_hop_dao_duc),

      // III. THIẾT BỊ DẠY HỌC & HỌC LIỆU
      this.createSectionTitle("III. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU"),
      this.createField("1. Đối với Giáo viên:", result.gv_chuan_bi || result.thiet_bi_day_hoc),
      this.createField("2. Đối với Học sinh:", result.hs_chuan_bi),

      // IV. TIẾN TRÌNH DẠY HỌC
      this.createSectionTitle("IV. TIẾN TRÌNH DẠY HỌC"),
    ];

    if (onProgress) onProgress(40);

    // Activity 1: Khởi động
    children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 1: KHỞI ĐỘNG (5-7 phút)", result.hoat_dong_khoi_dong));

    // Activity 2: Khám phá
    children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 2: KHÁM PHÁ (15-20 phút)", result.hoat_dong_kham_pha || result.hoat_dong_kham_pha_1));

    if (onProgress) onProgress(60);
    // Yield to main thread for large content
    await new Promise(resolve => setTimeout(resolve, 0));

    // Activity 3: Luyện tập
    children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 3: LUYỆN TẬP (10-15 phút)", result.hoat_dong_luyen_tap || result.hoat_dong_luyen_tap_1));

    // Activity 4: Vận dụng
    children.push(...this.createTwoColumnActivity("HOẠT ĐỘNG 4: VẬN DỤNG (5-10 phút)", result.hoat_dong_van_dung));

    if (onProgress) onProgress(80);

    // V. HỒ SƠ DẠY HỌC
    children.push(this.createSectionTitle("V. HỒ SƠ DẠY HỌC (PHỤ LỤC)"));
    children.push(...this.renderFormattedText(result.ho_so_day_hoc || "..."));

    // VI. HƯỚNG DẪN VỀ NHÀ
    children.push(this.createSectionTitle("VI. HƯỚNG DẪN VỀ NHÀ"));
    children.push(...this.renderFormattedText(result.huong_dan_ve_nha || "..."));

    if (onProgress) onProgress(90);

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);

    if (onProgress) onProgress(100);
    return { success: true, method: "download" };
  },

  /**
   * Helper to estimate total character count to decide processing strategy
   */
  estimateTotalChars(result: LessonResult): number {
    let count = 0;
    const fields = [
      result.muc_tieu_kien_thuc, result.muc_tieu_nang_luc, result.muc_tieu_pham_chat,
      result.shdc, result.hoat_dong_khoi_dong, result.hoat_dong_kham_pha,
      result.hoat_dong_luyen_tap, result.hoat_dong_van_dung, result.shl,
      result.ho_so_day_hoc, result.huong_dan_ve_nha
    ];
    fields.forEach(f => { if (f) count += f.length; });
    return count;
  },

  /**
   * Wrapper for Lesson Plan export to match TemplateEngine expectations
   */
  async exportLesson(result: LessonResult, template: any, metadata: any): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    const fileName = `Giao_an_${metadata.topic || result.ten_bai || "HDTN"}.docx`.replace(/\s+/g, "_");
    return await this.exportLessonToDocx(result, fileName);
  },

  /**
   * Exports a Meeting Minute to a .docx file
   */
  async exportMeeting(result: MeetingResult, template: any, month: string, session: string): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    const fileName = `Bien_ban_hop_T${month}_Lan_${session}.docx`;
    const doc = new Document({
      sections: [{
        children: [
          this.createSectionTitle(`BIÊN BẢN HỌP THÁNG ${month} - LẦN ${session}`),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          this.createField("1. Nội dung chính:", result.noi_dung_chinh),
          this.createField("2. Ưu điểm:", result.uu_diem),
          this.createField("3. Hạn chế:", result.han_che),
          this.createField("4. Ý kiến đóng góp:", result.y_kien_dong_gop),
          this.createField("5. Kế hoạch tháng tới:", result.ke_hoach_thang_toi),

          ...(result.ket_luan_cuoc_hop ? [
            this.createSectionTitle("KẾT LUẬN CUỘC HỌP"),
            ...this.renderFormattedText(result.ket_luan_cuoc_hop)
          ] : [])
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
    return { success: true, method: "download" };
  },

  /**
   * Exports an Event Script to a .docx file
   */
  async exportEvent(result: EventResult, template: any, metadata: any): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    const fileName = `Kich_ban_Ngoai_khoa_${metadata.month || "T"}_Khoi_${metadata.grade || ""}.docx`.replace(/\s+/g, "_");

    const children: any[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: (result.ten_chu_de || "KỊCH BẢN NGOẠI KHÓA").toUpperCase(),
            bold: true,
            size: 32,
            color: "2E59A7"
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),

      this.createField("Khối lớp:", metadata.grade),
      this.createField("Thời gian:", result.thoi_gian),
      this.createField("Địa điểm:", result.dia_diem),
      this.createField("Đối tượng:", result.doi_tuong),

      this.createSectionTitle("I. MỤC TIÊU"),
      ...this.renderFormattedText(this.formatMixedContent(result.muc_tieu)),

      this.createSectionTitle("II. KỊCH BẢN CHI TIẾT"),
      ...this.renderFormattedText(this.formatMixedContent(result.kich_ban_chi_tiet || result.noi_dung)),
    ];

    if (result.tien_trinh && result.tien_trinh.length > 0) {
      children.push(this.createSectionTitle("III. THỜI GIAN BIỂU CHI TIẾT"));
      result.tien_trinh.forEach((item, idx) => {
        children.push(this.createSubSection(`${idx + 1}. ${item.thoi_gian}`));
        children.push(...this.renderFormattedText(item.hoat_dong));
      });
    }

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
    return { success: true, method: "download" };
  },

  /**
   * Exports a NCBH Profile to a .docx file
   */
  async exportNCBH(result: NCBHResult, template: any, metadata: any): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    const { grade, month } = metadata;
    const fileName = `Ho_so_NCBH_Khoi_${grade || ""}_T${month || ""}.docx`;
    const doc = new Document({
      sections: [{
        children: [
          this.createSectionTitle(`HỒ SƠ NGHIÊN CỨU BÀI HỌC - KHỐI ${grade}`),
          new Paragraph({ text: "", spacing: { after: 200 } }),

          this.createSubSection("BÀI DẠY: " + (result.ten_bai || "")),
          this.createSectionTitle("PHẦN 1: THIẾT KẾ BÀI DẠY TẬP THỂ"),
          this.createField("Lý do chọn bài:", result.ly_do_chon),
          this.createField("Mục tiêu bài học:", result.muc_tieu),
          this.createField("Chuỗi hoạt động:", result.chuoi_hoat_dong),

          this.createSectionTitle("PHẦN 2: BIÊN BẢN PHÂN TÍCH BÀI HỌC"),
          this.createField("Chia sẻ của giáo viên dạy:", result.chia_se_nguoi_day),
          this.createField("Ý kiến đóng góp (Người dự):", result.nhan_xet_nguoi_du),
          this.createField("Nguyên nhân & Giải pháp:", result.nguyen_nhan_giai_phap),
          this.createField("Bài học kinh nghiệm:", result.bai_hoc_kinh_nghiem),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
    return { success: true, method: "download" };
  },

  /**
   * Exports an Assessment Plan to a .docx file
   */
  async exportAssessmentPlan(result: AssessmentResult, template: any, metadata: any): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    const fileName = `Ke_hoach_Kiem_tra_${metadata.term || ""}_Khoi_${metadata.grade || ""}.docx`.replace(/\s+/g, "_");

    const children: any[] = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: (result.ten_ke_hoach || "KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ").toUpperCase(),
            bold: true,
            size: 32,
            color: "2E59A7",
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 200 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Khối: ${metadata.grade || ""} | Hoạt động: ${metadata.term || ""} | Loại sản phẩm: ${metadata.productType || ""}`,
            size: 24,
            italics: true,
          }),
        ],
      }),
      new Paragraph({ text: "", spacing: { after: 300 } }),

      this.createSectionTitle("I. MỤC TIÊU"),
      ...this.renderFormattedText(this.formatMixedContent(result.muc_tieu)),

      this.createSectionTitle("II. NỘI DUNG & NHIỆM VỤ CHI TIẾT"),
    ];

    if (result.nhiem_vu && result.nhiem_vu.length > 0) {
      result.nhiem_vu.forEach((nv, idx) => {
        children.push(this.createSubSection(`${idx + 1}. ${nv.ten_nhiem_vu || "Nhiệm vụ"}`));
        if (nv.yeu_cau) children.push(this.createField("Yêu cầu:", nv.yeu_cau));
        if (nv.mo_ta) children.push(this.createField("Mô tả:", nv.mo_ta));
        if (nv.tieu_chi_danh_gia) children.push(this.createField("Tiêu chí:", nv.tieu_chi_danh_gia));
      });
    } else {
      children.push(...this.renderFormattedText(this.formatMixedContent(result.noi_dung_nhiem_vu)));
    }

    if (result.bang_kiem_rubric && result.bang_kiem_rubric.length > 0) {
      children.push(this.createSectionTitle("III. CÔNG CỤ ĐÁNH GIÁ (RUBRIC)"));

      const tableRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "Tiêu chí", bold: true, alignment: AlignmentType.CENTER })],
              shading: { fill: "F1F5F9" },
            }),
            new TableCell({
              children: [new Paragraph({ text: "Mức độ / Mô tả", bold: true, alignment: AlignmentType.CENTER })],
              shading: { fill: "F1F5F9" },
            }),
          ],
        }),
      ];

      result.bang_kiem_rubric.forEach((item) => {
        let describe = "";
        if (item.muc_do) {
          const levels = item.muc_do as any;
          describe = Object.entries(levels)
            .filter(([_, v]) => v)
            .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
            .join("\n");
        }

        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: item.tieu_chi, bold: true })],
                width: { size: 30, type: WidthType.PERCENTAGE },
                margins: { top: 120, bottom: 120, left: 120, right: 120 },
              }),
              new TableCell({
                children: this.renderFormattedText(describe),
                width: { size: 70, type: WidthType.PERCENTAGE },
                margins: { top: 120, bottom: 120, left: 120, right: 120 },
              }),
            ],
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        })
      );
    }

    if (result.loi_khuyen) {
      children.push(this.createSectionTitle("IV. GỢI Ý PHÁT TRIỂN & LỜI KHUYÊN"));
      children.push(...this.renderFormattedText(this.formatMixedContent(result.loi_khuyen)));
    }

    const doc = new Document({
      sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
    return { success: true, method: "download" };
  },

  formatMixedContent(val: any): string {
    if (!val) return "...";
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.join("\n");
    return JSON.stringify(val, null, 2);
  },

  createSectionTitle(text: string) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 28,
          underline: { type: "single" },
          color: "1A365D"
        }),
      ],
    });
  },

  createSubSection(text: string) {
    return new Paragraph({
      spacing: { before: 300, after: 150 },
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 24,
          color: "444444"
        }),
      ],
    });
  },

  createField(label: string, value: string | undefined) {
    return new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: label, bold: true, size: 24 }),
        new TextRun({ text: " ", size: 24 }),
        ...this.parseMarkdownToRuns(value || "...")
      ],
    });
  },

  /**
   * Helper to parse content with {{cot_1}} and {{cot_2}} placeholders
   */
  parseTwoColumnContent(content: string): { gv: string; hs: string } {
    if (!content) return { gv: "...", hs: "..." };

    // Regular expressions to find the markers
    const cot1Regex = /\{\{cot_1\}\}([\s\S]*?)(?=\{\{cot_2\}\}|$)/i;
    const cot2Regex = /\{\{cot_2\}\}([\s\S]*?)(?=\{\{cot_1\}\}|$)/i;

    const gvMatch = content.match(cot1Regex);
    const hsMatch = content.match(cot2Regex);

    return {
      gv: gvMatch ? gvMatch[1].trim() : content.split('{{')[0].trim() || "...",
      hs: hsMatch ? hsMatch[1].trim() : "..."
    };
  },

  /**
   * Creates a 2-column table for Teacher and Student activities
   */
  createTwoColumnTable(gvContent: string, hsContent: string) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
      },
      rows: [
        // Header Row
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Hoạt động của Giáo viên", bold: true, size: 22 })]
              })],
              shading: { fill: "F1F5F9" },
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 120, bottom: 120 }
            }),
            new TableCell({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Hoạt động của Học sinh", bold: true, size: 22 })]
              })],
              shading: { fill: "F1F5F9" },
              width: { size: 50, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 120, bottom: 120 }
            })
          ]
        }),
        // Content Row
        new TableRow({
          children: [
            new TableCell({
              children: this.renderFormattedText(gvContent),
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 180, bottom: 180, left: 180, right: 180 },
              verticalAlign: VerticalAlign.TOP
            }),
            new TableCell({
              children: this.renderFormattedText(hsContent),
              width: { size: 50, type: WidthType.PERCENTAGE },
              margins: { top: 180, bottom: 180, left: 180, right: 180 },
              verticalAlign: VerticalAlign.TOP
            })
          ]
        })
      ]
    });
  },

  /**
   * Complex Activity Block with 2-column structure for Step D
   */
  createTwoColumnActivity(title: string, fullContent: string | undefined) {
    if (!fullContent) return [new Paragraph({ text: "...", indent: { left: 360 } })];

    const results: any[] = [
      new Paragraph({
        spacing: { before: 240, after: 120 },
        children: [new TextRun({ text: title, bold: true, size: 26, color: "2E59A7", underline: {} })]
      })
    ];

    // Splitting by major steps a), b), c), d)
    const steps = fullContent.split(/(?=[a-d]\))/i);

    steps.forEach(step => {
      const trimmedStep = step.trim();
      if (!trimmedStep) return;

      if (trimmedStep.toLowerCase().startsWith('d)')) {
        // Handle 2-column for Step D
        const label = trimmedStep.split(':')[0] || "d) Tổ chức thực hiện";
        const body = trimmedStep.substring(label.length + 1).trim();

        results.push(new Paragraph({
          spacing: { before: 120, after: 80 },
          children: [new TextRun({ text: label + ":", bold: true, size: 24, italics: true })]
        }));

        const { gv, hs } = this.parseTwoColumnContent(body);
        results.push(this.createTwoColumnTable(gv, hs));
      } else {
        // Regular single column for a, b, c
        const colonIndex = trimmedStep.indexOf(':');
        if (colonIndex !== -1) {
          const label = trimmedStep.substring(0, colonIndex + 1);
          const body = trimmedStep.substring(colonIndex + 1).trim();

          results.push(new Paragraph({
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({ text: label, bold: true, size: 24, italics: true }),
              new TextRun({ text: " ", size: 24 }),
              ...this.parseMarkdownToRuns(body)
            ]
          }));
        } else {
          results.push(...this.renderFormattedText(trimmedStep));
        }
      }
    });

    return results;
  },

  /**
   * Legacy Helper - kept for compatibility but prioritized above by createTwoColumnActivity
   */
  createActivityTable(title: string, content: string | undefined) {
    if (!content) return [new Paragraph({ text: "...", indent: { left: 360 } })];

    return [
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 24, italics: true, color: "2E59A7" })],
        spacing: { before: 200, after: 100 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: this.renderFormattedText(content),
                shading: { fill: "F8FAFC" },
                margins: { top: 240, bottom: 240, left: 240, right: 240 },
                verticalAlign: VerticalAlign.TOP
              })
            ]
          })
        ]
      })
    ];
  },

  /**
   * Renders plain text with Markdown support and list detection
   */
  renderFormattedText(text: string): Paragraph[] {
    if (!text) return [new Paragraph({ text: "...", size: 24 })];

    return text.split('\n').map(line => {
      const trimmed = line.trim();

      // List detection
      const listMatch = trimmed.match(/^([-*•]|\d+\.)\s+(.*)/);
      if (listMatch) {
        return new Paragraph({
          children: this.parseMarkdownToRuns(listMatch[2]),
          bullet: { level: 0 },
          spacing: { after: 120 }
        });
      }

      // Heading detection
      if (trimmed.startsWith('### ')) {
        return new Paragraph({
          children: [new TextRun({ text: trimmed.substring(4), bold: true, size: 26, underline: {} })],
          spacing: { before: 100, after: 80 }
        });
      }

      return new Paragraph({
        children: this.parseMarkdownToRuns(line),
        spacing: { after: 120 }
      });
    });
  },

  /**
   * Basic Markdown Parser for TextRun
   * Handles **bold** and *italic*
   */
  parseMarkdownToRuns(text: string): TextRun[] {
    if (!text) return [new TextRun({ text: "", size: 24 })];

    const runs: TextRun[] = [];
    let currentPos = 0;
    // Regex to find **bold** or *italic*
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Normal text before match
      if (match.index > currentPos) {
        runs.push(new TextRun({ text: text.substring(currentPos, match.index), size: 24 }));
      }

      const matchText = match[0];
      if (matchText.startsWith('**')) {
        // Bold
        runs.push(new TextRun({
          text: matchText.substring(2, matchText.length - 2),
          bold: true,
          size: 24
        }));
      } else {
        // Italic
        runs.push(new TextRun({
          text: matchText.substring(1, matchText.length - 1),
          italics: true,
          size: 24
        }));
      }
      currentPos = regex.lastIndex;
    }

    // Remaining text
    if (currentPos < text.length) {
      runs.push(new TextRun({ text: text.substring(currentPos), size: 24 }));
    }

    return runs.length > 0 ? runs : [new TextRun({ text: text, size: 24 })];
  }
};
