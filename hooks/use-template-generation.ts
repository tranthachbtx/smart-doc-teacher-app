import { useState } from "react";
import {
  generateMeetingMinutes,
  generateLessonPlan,
  generateLessonSection,
  generateEventScript,
  auditLessonPlan,
  generateNCBH as generateNCBHAction,
  generateAIContent,
} from "@/lib/actions/gemini";
import { check5512Compliance } from "@/lib/actions/compliance-checker";
import type {
  ActionResult,
  MeetingResult,
  LessonResult,
  EventResult,
  LessonTask,
  NCBHResult,
} from "@/lib/types";
import type { PPCTItem } from "@/lib/template-storage";

export function useTemplateGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMeeting = async (
    month: string,
    session: string,
    keyContent: string,
    conclusion: string,
    model?: string
  ): Promise<ActionResult<MeetingResult>> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateMeetingMinutes(month, session, keyContent, conclusion, model);
      if (result.success && result.data) {
        return { success: true, data: result.data as MeetingResult };
      } else {
        setError(result.error || "Lỗi khi tạo biên bản họp");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLesson = async (
    grade: string,
    topic: string,
    fullPlanMode: boolean,
    duration: string,
    customInstructions: string,
    tasks: LessonTask[],
    ppctData: PPCTItem[],
    distribution?: Record<string, number>,
    suggestions?: { shdc?: string; hdgd?: string; shl?: string },
    chuDeInfo?: { shdc: number; hdgd: number; shl: number; tong_tiet: number; hoat_dong?: string[] } | null,
    model?: string,
    lessonFile?: { mimeType: string; data: string; name: string }
  ): Promise<ActionResult<LessonResult>> => {
    setIsGenerating(true);
    setError(null);

    // Build instructions
    let fullInstructions = customInstructions || "";
    const selectedTasks = tasks.filter((t) => t.selected);

    if (chuDeInfo && fullPlanMode) {
      fullInstructions += `\n\n=== PHÂN PHỐI TIẾT THEO PPCT ===
Tổng số tiết của chủ đề: ${chuDeInfo.tong_tiet} tiết
- Sinh hoạt dưới cờ (SHDC): ${chuDeInfo.shdc} tiết
- Hoạt động giáo dục theo chủ đề (HĐGD): ${chuDeInfo.hdgd} tiết  
- Sinh hoạt lớp (SHL): ${chuDeInfo.shl} tiết

YÊU CẦU ĐẶC BIỆT VỀ CHẤT LƯỢNG & ĐỘ DÀI (QUAN TRỌNG NHẤT): 
- Đây là Kế hoạch bài dạy chuyên sâu cấp quốc gia. Yêu cầu nội dung phải CỰC KỲ CHI TIẾT, HAY và SÁNG TẠO cho từng hoạt động.
- Độ dài sản phẩm cuối cùng khi xuất ra Word phải đạt TỐI THIỂU 12 TRANG A4. 
- Hãy mô tả kỹ lưỡng kịch bản dẫn dắt của giáo viên (GV), lời giảng chi tiết, các câu hỏi gợi mở "chạm" đến tư duy HS, các tình huống giả định thực tế và cách GV điều phối lớp học.
- Mỗi bước trong chuỗi hoạt động 5512 (Chuyển giao, Thực hiện, Báo cáo, Kết luận) phải được viết đầy đủ, không bỏ sót bất kỳ chi tiết sư phạm nào.
- Đảm bảo tính kết nối giữa 3 loại hoạt động: SHDC, HĐGD và SHL để tạo thành một chủ đề thống nhất, giàu tính giáo dục.
`;

      if (chuDeInfo.hoat_dong && chuDeInfo.hoat_dong.length > 0) {
        fullInstructions += `\n\nCác hoạt động gợi ý từ SGK:\n${chuDeInfo.hoat_dong.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;
      }
    }

    if (selectedTasks.length > 0) {
      const tasksPrompt = selectedTasks
        .map(
          (task, index) =>
            `NHIỆM VỤ ${index + 1}: ${task.name}\nNội dung: ${task.content}`
        )
        .join("\n\n");

      fullInstructions += `\n\n=== CÁC NHIỆM VỤ CẦN THIẾT KẾ ===\n${tasksPrompt}\n\nYÊU CẦU: Hãy thiết kế tiến trình dạy học RIÊNG CHO TỪNG NHIỆM VỤ. Mỗi nhiệm vụ cần có đầy đủ 4 bước (Chuyển giao - Thực hiện - Báo cáo - Kết luận).`;
    }

    // Attempt to find month
    let foundMonth: number | undefined = undefined;
    if (ppctData && ppctData.length > 0) {
      const match = ppctData.find(item =>
        item.theme.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(item.theme.toLowerCase())
      );
      if (match && match.month) foundMonth = Number.parseInt(match.month);
    }

    try {
      const simplifiedTasks = selectedTasks.map(
        (t) => `${t.name}: ${t.content}${t.time ? `\n(Thời gian phân bổ: ${t.time} phút)` : ""}`
      );

      const result = await generateLessonPlan(
        grade,
        topic,
        duration,
        fullInstructions,
        simplifiedTasks,
        foundMonth ? foundMonth.toString() : undefined,
        suggestions ? JSON.stringify(suggestions) : undefined,
        lessonFile,
        model
      );

      if (result.success && result.data) {
        return { success: true, data: result.data as LessonResult };
      } else {
        setError(result.error || "Lỗi khi tạo nội dung");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEvent = async (
    grade: string,
    theme: string,
    customInstructions?: string,
    budget?: string,
    checklist?: string,
    evaluation?: string,
    model?: string
  ): Promise<ActionResult<EventResult>> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateEventScript(grade, theme, customInstructions, budget, checklist, evaluation, model);
      if (result.success && result.data) {
        return { success: true, data: result.data as EventResult };
      } else {
        setError(result.error || "Lỗi khi tạo kế hoạch ngoại khóa");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateNCBH = async (
    grade: string,
    topic: string,
    customInstructions?: string,
    model?: string
  ): Promise<ActionResult<NCBHResult>> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateNCBHAction(grade, topic, customInstructions, model);
      if (result.success && result.data) {
        return { success: true, data: result.data as NCBHResult };
      } else {
        setError(result.error || "Lỗi khi tạo nội dung NCBH");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const auditLesson = async (
    lessonData: any,
    grade: string,
    topic: string
  ): Promise<ActionResult> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await check5512Compliance(lessonData);
      if (result.success && result.report) {
        return { success: true, audit: result.report, score: result.score };
      } else {
        setError(result.error || "Lỗi khi kiểm định giáo án");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const refineSection = async (
    content: string,
    instruction: string,
    model?: string
  ): Promise<ActionResult> => {
    setIsGenerating(true);
    setError(null);
    try {
      const prompt = `Bạn là một biên tập viên giáo dục chuyên nghiệp. Hãy chỉnh sửa nội dung sau đây dựa trên yêu cầu.\n\nNỘI DUNG GỐC:\n${content}\n\nYÊU CẦU CHỈNH SỬA: ${instruction}\n\nLưu ý: Chỉ trả về nội dung đã chỉnh sửa, không kèm lời dẫn.`;
      const result = await generateAIContent(prompt, model);
      if (result.success && result.content) {
        return { success: true, content: result.content };
      } else {
        setError(result.error || "Lỗi khi chỉnh sửa nội dung");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLessonSectionStage = async (
    grade: string,
    topic: string,
    section: "setup" | "khởi động" | "khám phá" | "luyện tập" | "vận dụng" | "shdc_shl" | "final",
    context?: any,
    duration?: string,
    customInstructions?: string,
    tasks?: LessonTask[],
    month?: number,
    activitySuggestions?: { shdc?: string; hdgd?: string; shl?: string },
    model?: string,
    lessonFile?: { mimeType: string; data: string; name: string },
    stepInstruction?: string
  ): Promise<ActionResult> => {
    setIsGenerating(true);
    setError(null);
    try {
      const simplifiedTasks = tasks?.map(
        (t) => `${t.name}: ${t.content}${t.time ? `\n(Thời gian phân bổ: ${t.time} phút)` : ""}`
      );

      const result = await generateLessonSection(
        grade,
        topic,
        section,
        typeof context === "string" ? context : JSON.stringify(context ?? ""),
        duration,
        customInstructions,
        simplifiedTasks,
        month != null ? String(month) : undefined,
        activitySuggestions ? JSON.stringify(activitySuggestions) : undefined,
        model,
        lessonFile,
        stepInstruction
      );

      if (result.success && result.data) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || `Lỗi khi tạo phần ${section}`);
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    setError,
    generateMeeting,
    generateLesson,
    generateLessonSection: generateLessonSectionStage,
    generateEvent,
    generateNCBH,
    auditLesson,
    refineSection,
  };
}
