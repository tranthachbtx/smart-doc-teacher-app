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
import type { LessonResult } from "@/lib/types";

/**
 * Service to handle document exports with enhanced formatting (MOET 5512 Standard)
 */
export const ExportService = {
  /**
   * Exports a Lesson Plan to a .docx file
   */
  async exportLessonToDocx(result: LessonResult, fileName: string = "Giao_an_HDTN.docx"): Promise<void> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              alignment: AlignmentType.CENTER,
              heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: (result.ten_bai || "KẾ HOẠCH BÀI DẠY").toUpperCase(),
                  bold: true,
                  size: 32,
                  color: "2E59A7"
                }),
              ],
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            // I. OBJECTIVES
            this.createSectionTitle("I. MỤC TIÊU"),
            this.createField("1. Kiến thức:", result.muc_tieu_kien_thuc),
            this.createField("2. Năng lực:", result.muc_tieu_nang_luc),
            this.createField("3. Phẩm chất:", result.muc_tieu_pham_chat),
            this.createField("4. Tích hợp Năng lực số:", result.tich_hop_nls),
            this.createField("5. Tích hợp Đạo đức:", result.tich_hop_dao_duc),

            // II. EQUIPMENT
            this.createSectionTitle("II. THIẾT BỊ DẠY HỌC & HỌC LIỆU"),
            this.createField("1. Giáo viên:", result.gv_chuan_bi || result.thiet_bi_day_hoc),
            this.createField("2. Học sinh:", result.hs_chuan_bi),

            // III. PROCEDURE
            this.createSectionTitle("III. TIẾN TRÌNH DẠY HỌC"),

            this.createSubSection("A. SINH HOẠT DƯỚI CỜ"),
            ...this.createActivityTable("Hoạt động chính", result.shdc),

            this.createSubSection("B. HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ"),
            ...this.createActivityTable("1. Hoạt động Khởi động", result.hoat_dong_khoi_dong),
            ...this.createActivityTable("2. Hoạt động Khám phá", result.hoat_dong_kham_pha || result.hoat_dong_kham_pha_1),
            ...this.createActivityTable("3. Hoạt động Luyện tập", result.hoat_dong_luyen_tap || result.hoat_dong_luyen_tap_1),
            ...this.createActivityTable("4. Hoạt động Vận dụng", result.hoat_dong_van_dung),

            this.createSubSection("C. SINH HOẠT LỚP"),
            ...this.createActivityTable("Nội dung sinh hoạt", result.shl),

            // IV. ASSESSMENT
            this.createSectionTitle("IV. HỒ SƠ DẠY HỌC & PHỤ LỤC"),
            ...this.renderFormattedText(result.ho_so_day_hoc || "..."),

            // V. HOMEWORK
            this.createSectionTitle("V. HƯỚNG DẪN VỀ NHÀ"),
            ...this.renderFormattedText(result.huong_dan_ve_nha || "..."),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
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
   * Creates a table-based activity block as per MOET 5512 styles
   */
  createActivityTable(title: string, content: string | undefined) {
    if (!content) return [new Paragraph({ text: "...", indent: { left: 360 } })];

    return [
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 24, italic: true, color: "2E59A7" })],
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
          italic: true,
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
