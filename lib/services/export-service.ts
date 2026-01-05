// @ts-nocheck
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import { ExportOptimizer } from "./export-optimizer";
import { WorkerManager } from "./worker-manager";
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
  VerticalAlign,
  TextDirection,
  UnderlineType,
  convertInchesToTwip,
  HeightRule
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
 * ENHANCED: Worker support for background processing
 */
export const ExportService = {
  // Thresholds for Large Content Handling
  LARGE_CONTENT_THRESHOLD: 50000, // characters
  PROGRESS_CHUNK_SIZE: 5000,
  WORKER_ENABLED: typeof Worker !== 'undefined' && typeof window !== 'undefined',

  /**
   * Helper: Trigger download using a robust anchor method (Fix GUID filename)
   */
  triggerDownload(blob: Blob, fileName: string) {
    const docxMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // Sanitize filename: Remove diacritics and special chars (Phase 5.7)
    const sanitizedName = fileName
      .normalize('NFD') // Decompose accents
      .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .trim();

    let safeName = sanitizedName.toLowerCase().endsWith('.docx') ? sanitizedName : `${sanitizedName}.docx`;
    if (safeName === '.docx') safeName = "Giao_an.docx";

    console.log(`[ExportService] Triggering download via file-saver: ${safeName}`);
    console.log(`[ExportService] Blob size: ${blob.size}, type: ${blob.type}`);

    // ✅ ENHANCED: Validate blob before download
    if (blob.size === 0) {
      console.error("[ExportService] Blob is empty, cannot download");
      throw new Error("Generated file is empty");
    }

    if (blob.size < 1024) {
      console.warn("[ExportService] Blob is very small, might be corrupted");
    }

    try {
      // Primary method: file-saver (most robust for older/specific browsers)
      const sanitizedBlob = blob.type === docxMimeType ? blob : blob.slice(0, blob.size, docxMimeType);
      saveAs(sanitizedBlob, safeName);
      console.log(`[ExportService] Download triggered successfully via file-saver`);
    } catch (e) {
      console.warn("file-saver failed, falling back to anchor click", e);
      // Fallback method: anchor click
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = 'none';
      link.href = url;
      link.download = safeName;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (link.parentNode) document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);
      console.log(`[ExportService] Download triggered successfully via anchor click`);
    }
  },
  /**
   * Exports a Lesson Plan to a .docx file with Progress Tracking
   * Tuân thủ chuẩn Công văn 5512/BGDĐT-GDTrH với cấu trúc 2 cột.
   * ENHANCED: Memory-safe processing with error recovery & worker support
   */
  async exportLessonToDocx(
    result: LessonResult,
    fileName: string = "Giao_an_HDTN.docx",
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    // Start performance monitoring
    ExportOptimizer.startMonitoring();

    // Validate content before processing (Phase 5.2)
    const validation = ExportOptimizer.validateContent(result);
    if (!validation.valid) {
      console.error('Content validation failed:', validation.errors);
      throw new Error(`Content validation failed: ${validation.errors.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Content validation warnings:', validation.warnings);
      // Optional: Pass warnings back to UI via potential callback
    }

    // Optimize content for processing
    const optimizedResult = ExportOptimizer.optimizeContent(result);

    if (onProgress) onProgress(5);

    try {
      // Decide processing strategy based on content size and worker support
      const contentSize = JSON.stringify(optimizedResult).length;
      const useWorker = this.WORKER_ENABLED && contentSize > this.LARGE_CONTENT_THRESHOLD;

      console.log(`Export strategy: ${useWorker ? 'Worker' : 'Main thread'} (size: ${Math.round(contentSize / 1024)}KB)`);

      if (useWorker) {
        return await this.exportWithWorker(optimizedResult, fileName, onProgress);
      } else {
        return await this.exportMainThread(optimizedResult, fileName, onProgress);
      }

    } catch (error) {
      console.error('Export failed:', error);
      const report = ExportOptimizer.getPerformanceReport();
      console.error('Performance Report on Error:', report);

      // Attempt recovery with simplified export
      return await this.fallbackExport(optimizedResult, fileName, onProgress);
    }
  },

  /**
   * Export using worker for large content
   */
  async exportWithWorker(
    result: LessonResult,
    fileName: string,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    console.log('Starting worker-based export...');

    try {
      // Prepare content for worker
      const content = this.prepareContentForWorker(result);

      // Execute export in worker
      const workerResult = await WorkerManager.executeExport(
        content,
        fileName,
        {
          timeout: 60000, // 60 seconds for worker
          chunkSize: 50,
          onProgress: (percent) => onProgress ? onProgress(10 + Math.round(percent * 0.8)) : null
        }
      );

      // Download using a more robust method (Phase 5.6)
      const docxMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      let finalBlob: Blob;

      if (workerResult.base64) {
        // ✅ FIXED: Proper Base64 to Blob conversion
        const base64Data = workerResult.base64;
        const byteCharacters = atob(base64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        finalBlob = new Blob(byteArrays, { type: docxMimeType });
      } else if (workerResult.blob) {
        finalBlob = workerResult.blob.slice(0, workerResult.blob.size, docxMimeType);
      } else {
        throw new Error("Worker returned no usable data");
      }

      const actualFileName = (workerResult && workerResult.fileName) || fileName || "Giao_an.docx";
      this.triggerDownload(finalBlob, actualFileName);

      // Log worker metrics
      console.log('Worker export metrics:', workerResult.metrics);

      if (onProgress) onProgress(100);

      return { success: true, method: "download" };

    } catch (error) {
      console.error('Worker export failed, falling back to main thread:', error);
      return await this.exportMainThread(result, fileName, onProgress);
    }
  },

  /**
   * Export on main thread (fallback or small content)
   */
  async exportMainThread(
    result: LessonResult,
    fileName: string,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    console.log('Starting main thread export...');

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

    if (onProgress) onProgress(20);

    // Process activities with memory safety
    const activities = [
      { title: "HOẠT ĐỘNG 1: KHỞI ĐỘNG (5-7 phút)", content: result.hoat_dong_khoi_dong },
      { title: "HOẠT ĐỘNG 2: KHÁM PHÁ (15-20 phút)", content: result.hoat_dong_kham_pha || result.hoat_dong_kham_pha_1 },
      { title: "HOẠT ĐỘNG 3: LUYỆN TẬP (10-15 phút)", content: result.hoat_dong_luyen_tap || result.hoat_dong_luyen_tap_1 },
      { title: "HOẠT ĐỘNG 4: VẬN DỤNG (5-10 phút)", content: result.hoat_dong_van_dung }
    ];

    // Process activities with chunking for large content
    const activityResults = await ExportOptimizer.processWithMemorySafety(
      activities,
      async (chunk) => {
        const chunkChildren = [];
        for (const activity of chunk) {
          chunkChildren.push(...this.createTwoColumnActivity(activity.title, activity.content));
        }
        return chunkChildren;
      },
      2, // Process 2 activities at a time
      (percent) => onProgress ? onProgress(20 + Math.round(percent * 0.4)) : null
    );

    children.push(...activityResults);

    if (onProgress) onProgress(60);

    // Add remaining sections
    children.push(
      this.createSectionTitle("V. HỒ SƠ DẠY HỌC (PHỤ LỤC)"),
      ...this.renderFormattedText(result.ho_so_day_hoc || "..."),
      this.createSectionTitle("VI. HƯỚNG DẪN VỀ NHÀ"),
      ...this.renderFormattedText(result.huong_dan_ve_nha || "...")
    );

    if (onProgress) onProgress(80);

    // Create document with error handling
    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    if (onProgress) onProgress(90);

    // Generate blob with timeout protection
    const blob = await this.generateBlobWithTimeout(doc, 30000); // 30 second timeout

    // Download with error handling
    await this.downloadWithRetry(blob, fileName, 3);

    if (onProgress) onProgress(100);

    // Log performance metrics
    ExportOptimizer.setSuccess(true);
    const report = ExportOptimizer.getPerformanceReport();
    console.log('Export Performance Report:', report);

    return { success: true, method: "download" };
  },

  /**
   * Prepare content for worker processing
   */
  prepareContentForWorker(result: LessonResult): any {
    // Simplify content for worker processing
    return {
      type: 'lesson_plan',
      data: {
        title: result.ten_bai,
        objectives: {
          knowledge: result.muc_tieu_kien_thuc,
          skills: result.muc_tieu_nang_luc,
          attitudes: result.muc_tieu_pham_chat,
          digital_competency: result.tich_hop_nls,
          ethics: result.tich_hop_dao_duc
        },
        equipment: {
          teacher: result.gv_chuan_bi || result.thiet_bi_day_hoc,
          student: result.hs_chuan_bi
        },
        activities: [
          { title: "HOẠT ĐỘNG 1: KHỞI ĐỘNG", content: result.hoat_dong_khoi_dong },
          { title: "HOẠT ĐỘNG 2: KHÁM PHÁ", content: result.hoat_dong_kham_pha || result.hoat_dong_kham_pha_1 },
          { title: "HOẠT ĐỘNG 3: LUYỆN TẬP", content: result.hoat_dong_luyen_tap || result.hoat_dong_luyen_tap_1 },
          { title: "HOẠT ĐỘNG 4: VẬN DỤNG", content: result.hoat_dong_van_dung }
        ],
        attachments: result.ho_so_day_hoc,
        homework: result.huong_dan_ve_nha
      }
    };
  },

  /**
   * Exports a Lesson Plan to a .docx file using a template
   */
  async exportLessonToDocx(
    lesson: LessonResult,
    options?: {
      onProgress?: (progress: number) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    try {
      console.log("[ExportService] Starting Template-Based Export 5512...");
      options?.onProgress?.(10);

      // 1. Load Template
      const response = await fetch("/templates/KHBD_Template_2Cot.docx");
      if (!response.ok) throw new Error("Could not load template file");
      const templateArrayBuffer = await response.arrayBuffer();

      options?.onProgress?.(30);

      // 2. Init PizZip
      // PizZip works with binary string or Uint8Array. Best is binary string from arraybuffer for browser
      // Convert ArrayBuffer to Binary String
      const data = new Uint8Array(templateArrayBuffer);
      let binaryString = "";
      for (let i = 0; i < data.length; i++) {
        binaryString += String.fromCharCode(data[i]);
      }
      const zip = new PizZip(binaryString);

      // 3. Clean XML (Remove phantom tags in placeholders)
      let docXml = zip.file("word/document.xml")?.asText();
      if (!docXml) throw new Error("Invalid template: No document.xml found");

      docXml = docXml.replace(/(\{\{)([\s\S]*?)(\}\})/g, (match, open, inner, close) => {
        const key = inner.replace(/<[^>]+>/g, "");
        return "{{" + key + "}}";
      });

      options?.onProgress?.(50);

      // 4. Prepare Data Helper Functions
      const escapeXml = (unsafe: string) => {
        return unsafe.replace(/[<>&'"]/g, (c) => {
          switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
          }
        });
      };

      const formatContent = (text: string | undefined) => {
        if (!text) return "";
        // Clean markdown code blocks if any
        let clean = text.replace(/```[\s\S]*?```/g, "").replace(/\*\*/g, "").replace(/\*/g, "");
        clean = escapeXml(clean);
        return clean.replace(/\n/g, '<w:br/>');
      };

      // Helper to parse content into GV/HS columns if they are combined in one markdown string
      // Note: This relies on the specific content structure or we treat the whole block as GV/Shared?
      // Since lessonResult structure varies, let's assume we extract generic sections for now.
      // Ideally, the AI should return separated content. If currently mixed, we rely on parseTwoColumnContent

      const parseColumns = (content: string) => {
        // 1. Try JSON Parsing (Priority for Manual Workflow)
        // 1. Try JSON Parsing (Priority for Manual Workflow)
        try {
          // Smart Sanitizer: Extract JSON object only
          const startIndex = content.indexOf("{");
          const endIndex = content.lastIndexOf("}");

          if (startIndex !== -1 && endIndex !== -1) {
            const jsonString = content.substring(startIndex, endIndex + 1);
            const jsonData = JSON.parse(jsonString);

            if (jsonData.steps && Array.isArray(jsonData.steps)) {
              let gv = "";
              let hs = "";
              jsonData.steps.forEach((step: any) => {
                const tAction = step.teacher_action || "";
                const sAction = step.student_action || "";
                // Supports LaTeX escaping if present
                if (tAction) gv += (gv ? "\n\n" : "") + tAction;
                if (sAction) hs += (hs ? "\n\n" : "") + sAction;
              });
              // Also support Duration injection if template allows (optional future feature)
              return { gv, hs };
            }
          }
        } catch (e) {
          // Not JSON or Invalid JSON, ignore and fallback
        }

        // 2. Old Regex Logic (Legacy/Fallback)
        const cot1Match = /\{\{cot_1\}\}/i.exec(content);
        const cot2Match = /\{\{cot_2\}\}/i.exec(content);

        if (!cot1Match && !cot2Match) {
          // No markers -> Return full content for GV, empty for HS
          return { gv: content, hs: "" };
        }

        const cot1Index = cot1Match ? cot1Match.index : -1;
        const cot2Index = cot2Match ? cot2Match.index : -1;

        let gv = "";
        let hs = "";

        if (cot1Index !== -1) {
          const startGv = cot1Index + 9;
          const endGv = (cot2Index !== -1 && cot2Index > cot1Index) ? cot2Index : content.length;
          gv = content.substring(startGv, endGv).trim();
        }
        if (cot2Index !== -1) {
          const startHs = cot2Index + 9;
          hs = content.substring(startHs).trim();
        }
        return { gv, hs };
      };

      // 5. Map Data
      // Extract Sections from LessonResult
      const getSectionContent = (titleKeyword: string) => {
        // This is heuristic: find section in lesson.activities that matches keyword
        // Or if lesson.activities is structured.
        // Fallback: If 'activities' is just markdown string or array, we search.
        // Assuming lesson.activities is Key-Value map as per type definition? 
        // Let's look at type usage. Usually it is: { title: "...", content: "..." }[] or similar.
        // Actually check types: interface LessonResult { ... activities: any ... }
        // Let's assume generic access for now.
        return "";
      };

      // MAPPING STRATEGY: 
      // We map specific fields from LessonResult to Placeholders.
      // Objectives
      const muc_tieu_kt = formatContent(lesson.objectives?.knowledge || lesson.objectives_content || "");
      const muc_tieu_nl = formatContent(lesson.objectives?.skills || "");
      const muc_tieu_pc = formatContent(lesson.objectives?.qualities || "");

      // Preparations
      const gv_prep = formatContent(lesson.preparations?.teacher || "");
      const hs_prep = formatContent(lesson.preparations?.student || "");

      // Activities: We need to find Khởi động, Khám phá, Luyện tập, Vận dụng
      // Since the input `lesson` might have widely varying structure from AI, we do best effort mapping.

      // Simple logic: Extract from the BIG content string if sections are not strictly separated, 
      // OR if `lesson.activities` is an array of sections.
      let act1 = { gv: "", hs: "" }; // KHOI DONG
      let act2 = { gv: "", hs: "" }; // KHAM PHA (The big one)
      let act3 = { gv: "", hs: "" }; // LUYEN TAP
      let act4 = { gv: "", hs: "" }; // VAN DUNG

      // Try to parse from lesson.activities if it is an array
      if (Array.isArray(lesson.activities)) {
        // Heuristic mapping by index or title
        lesson.activities.forEach((act: any, index: number) => {
          const title = (act.title || "").toLowerCase();
          const content = act.content || act.full_content || "";
          const { gv, hs } = parseColumns(content);

          if (title.includes("khởi động") || index === 0) {
            act1 = { gv: formatContent(gv), hs: formatContent(hs) };
          } else if (title.includes("luyện tập")) {
            act3 = { gv: formatContent(gv), hs: formatContent(hs) };
          } else if (title.includes("vận dụng")) {
            act4 = { gv: formatContent(gv), hs: formatContent(hs) };
          } else {
            // Default to Kham Pha (Content Heavy) for specific knowledge formation
            // Append if multiple activities
            act2.gv += (act2.gv ? "<w:br/><w:br/>" : "") + `<b>${formatContent(act.title)}</b><w:br/>` + formatContent(gv);
            act2.hs += (act2.hs ? "<w:br/><w:br/>" : "") + formatContent(hs);
          }
        });
      }

      options?.onProgress?.(70);

      const replacements: Record<string, string> = {
        ten_truong: formatContent("TRƯỜNG THPT................"),
        to_chuyen_mon: formatContent("TỔ................"),
        ten_chu_de: formatContent((lesson.title || "TÊN BÀI HỌC").toUpperCase()),
        ten_giao_vien: formatContent("................"),
        lop: formatContent(lesson.grade || "................"),
        so_tiet: formatContent(lesson.duration || "................"),
        ngay_soan: formatContent(new Date().toLocaleDateString('vi-VN')),

        muc_tieu_kien_thuc: muc_tieu_kt,
        muc_tieu_nang_luc: muc_tieu_nl,
        muc_tieu_pham_chat: muc_tieu_pc,

        gv_chuan_bi: gv_prep,
        hs_chuan_bi: hs_prep,

        // Activities
        hoat_dong_khoi_dong_cot_1: act1.gv,
        hoat_dong_khoi_dong_cot_2: act1.hs,

        hoat_dong_kham_pha_cot_1: act2.gv, // This will handle the MASSIVE content
        hoat_dong_kham_pha_cot_2: act2.hs,

        hoat_dong_luyen_tap_cot_1: act3.gv,
        hoat_dong_luyen_tap_cot_2: act3.hs,

        hoat_dong_van_dung_cot_1: act4.gv,
        hoat_dong_van_dung_cot_2: act4.hs,

        shdc: "",
        shl: "",
        ho_so_day_hoc: formatContent(lesson.materials || ""),
        huong_dan_ve_nha: formatContent(lesson.homework || "")
      };

      // 6. Perform Replacement
      Object.keys(replacements).forEach(key => {
        const placeholder = `{{${key}}}`;
        const value = replacements[key];
        docXml = docXml?.split(placeholder).join(value);
      });

      // 7. Save and Download
      zip.file("word/document.xml", docXml);
      const out = zip.generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        compression: "DEFLATE"
      });

      options?.onProgress?.(100);

      const fileName = `${lesson.title || "Giao_an_5512"}.docx`;
      this.triggerDownload(out, fileName);

      console.log("[ExportService] Template Export Completed Successfully");

    } catch (error) {
      console.error("[ExportService] Template Export Failed:", error);
      options?.onError?.(error instanceof Error ? error : new Error("Unknown error"));
    }
  },

  /**
   * Generate blob with timeout protection
   */
  async generateBlobWithTimeout(doc: any, timeoutMs: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Document generation timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      Packer.toBlob(doc)
        .then(blob => {
          clearTimeout(timeout);
          // Safe re-typing of Blob without nesting
          const docxMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          const finalBlob = blob.slice(0, blob.size, docxMimeType);
          resolve(finalBlob);
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  },

  /**
   * Download with retry mechanism
   */
  async downloadWithRetry(blob: Blob, fileName: string, maxRetries: number): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.triggerDownload(blob, fileName);
        return; // Success
      } catch (error) {
        console.error(`Download attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  },

  /**
   * Fallback export with simplified structure
   */
  async fallbackExport(
    result: LessonResult,
    fileName: string,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; method: "download" | "clipboard" }> {
    console.log('Attempting fallback export...');

    try {
      const simplifiedChildren = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "KẾ HOẠCH BÀI DẠY (FALLBACK)", bold: true, size: 28 })
          ]
        }),
        new Paragraph({ text: "", spacing: { after: 200 } }),
        ...this.renderFormattedText(`Tên bài: ${result.ten_bai || "..."}`),
        ...this.renderFormattedText(`Mục tiêu: ${result.muc_tieu_kien_thuc || "..."}`),
        ...this.renderFormattedText(`Hoạt động: ${result.hoat_dong_khoi_dong || "..."}`)
      ];

      const doc = new Document({
        sections: [{ children: simplifiedChildren }]
      });

      const blob = await Packer.toBlob(doc);
      this.triggerDownload(blob, `fallback_${fileName}`);
      return { success: true, method: "download" };
    } catch (error) {
      console.error('Fallback export failed:', error);
      throw new Error('Both primary and fallback exports failed');
    }
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
    this.triggerDownload(blob, fileName);
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
    this.triggerDownload(blob, fileName);
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
    this.triggerDownload(blob, fileName);
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
              ...({ shading: { fill: "F1F5F9" } } as any),
            }),
            new TableCell({
              children: [new Paragraph({ text: "Mức độ / Mô tả", bold: true, alignment: AlignmentType.CENTER })],
              ...({ shading: { fill: "F1F5F9" } } as any),
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
    this.triggerDownload(blob, fileName);
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

    // Regex finding indices (Case Insensitive)
    const cot1Match = /\{\{cot_1\}\}/i.exec(content);
    const cot2Match = /\{\{cot_2\}\}/i.exec(content);

    const cot1Index = cot1Match ? cot1Match.index : -1;
    const cot2Index = cot2Match ? cot2Match.index : -1;

    if (cot1Index === -1 && cot2Index === -1) {
      return { gv: content.trim(), hs: "..." };
    }

    let gvContent = "...";
    let hsContent = "...";

    if (cot1Index !== -1) {
      const startGv = cot1Index + 9;
      const endGv = (cot2Index !== -1 && cot2Index > cot1Index) ? cot2Index : content.length;
      gvContent = content.substring(startGv, endGv).trim();
    }

    if (cot2Index !== -1) {
      const startHs = cot2Index + 9;
      hsContent = content.substring(startHs).trim();
    }

    return { gv: gvContent, hs: hsContent };
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
          cantSplit: true,
          height: { value: 300, rule: HeightRule.ATLEAST },
          children: [
            new TableCell({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Hoạt động của Giáo viên", bold: true, size: 22 })]
              })],
              ...({
                shading: { fill: "F1F5F9" },
                width: { size: 50, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 120, bottom: 120, left: 120, right: 120 }
              } as any)
            }),
            new TableCell({
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Hoạt động của Học sinh", bold: true, size: 22 })]
              })],
              ...({
                shading: { fill: "F1F5F9" },
                width: { size: 50, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 120, bottom: 120, left: 120, right: 120 }
              } as any)
            }),
          ]
        }),
        // Content Row
        new TableRow({
          cantSplit: false, // Allow extensive content to split pages
          height: { value: 300, rule: HeightRule.ATLEAST },
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

    // Splitting by major steps a), b), c), d) - STRICT START OF LINE
    const steps = fullContent.split(/(?:\r?\n|^)(?=[a-d]\))/i);

    steps.forEach(step => {
      const trimmedStep = step.trim();
      if (!trimmedStep) return;

      if (trimmedStep.toLowerCase().startsWith('d)')) {
        // Handle 2-column for Step D
        const labelEnd = trimmedStep.indexOf(':');
        const label = labelEnd > -1 ? trimmedStep.substring(0, labelEnd) : "d) Tổ chức thực hiện";
        const body = labelEnd > -1 ? trimmedStep.substring(labelEnd + 1).trim() : trimmedStep.substring(2).trim();

        results.push(new Paragraph({
          spacing: { before: 120, after: 60 },
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
            spacing: { before: 60, after: 60 },
            alignment: AlignmentType.JUSTIFIED,
            indent: { firstLine: 720 },
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
   * Advanced Text Rendering with Nested Lists, Code Blocks and AI Cleaning
   */
  renderFormattedText(text: string): Paragraph[] {
    if (!text) return [new Paragraph({ text: "...", size: 24 })];

    const cleanedText = text
      .replace(/```(json|markdown|text|html)?/g, '')
      .replace(/```/g, '')
      .trim();

    const paragraphs: Paragraph[] = [];
    const lines = cleanedText.split('\n');

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Heading detection
      if (trimmedLine.startsWith('### ')) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: trimmedLine.substring(4), bold: true, size: 26, underline: {} })],
          spacing: { before: 120, after: 60 },
          alignment: AlignmentType.JUSTIFIED
        }));
        return;
      }

      // Explicit new line detection for list items or steps
      // Detects: -, +, *, •, ●, \d., or specific keywords like "Bước"
      const listMatch = trimmedLine.match(/^([-*•+●]|\d+\.|Bước\s+\d+:?)\s+(.*)/);

      if (listMatch) {
        // It's a list item or distinct step -> New Paragraph with formatting
        paragraphs.push(new Paragraph({
          children: this.parseMarkdownToRuns(trimmedLine),
          spacing: { after: 60, before: 60 },
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 360, hanging: 360 } // Hanging indent for nice list look
        }));
      } else {
        // Standard Paragraph
        paragraphs.push(new Paragraph({
          children: this.parseMarkdownToRuns(trimmedLine),
          spacing: { after: 60, before: 60 },
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 }
        }));
      }
    });

    return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: cleanedText, size: 24 })];
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
