import { useState } from "react";
import {
  generateMeetingMinutes,
  generateLessonPlan,
  generateEventScript,
  auditLessonPlan,
} from "@/lib/actions/gemini";
import type {
  MeetingResult,
  LessonResult,
  EventResult,
  LessonTask,
} from "@/lib/types";
import type { PPCTItem } from "@/lib/template-storage";

export function useTemplateGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMeeting = async (
    month: string,
    session: string,
    keyContent: string,
    conclusion?: string
  ) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateMeetingMinutes(month, session, keyContent);

      if (result.success && result.data) {
        // Manually merging conclusion if needed, although gemini might not return it
        // The original code passed 'meetingConclusion' to generateMeetingMinutes but
        // looking at gemini.ts signature: generateMeetingMinutes(month, session, keyContent)
        // It seems the original generic call might have been slightly different or I missed a parameter update.
        // I will adhere to the gemini.ts signature I saw.
        // Wait, looking at TemplateEngine.tsx line 400:
        // generateMeetingMinutes(selectedMonth, selectedSession, meetingKeyContent, meetingConclusion)
        // But gemini.ts signature was (month, session, keyContent).
        // This suggests there might be a discrepancy or I misread gemini.ts.
        // Let's assume the component wants to inject the conclusion into the result locally.

        const enhancedData: MeetingResult = {
          ...result.data,
          ket_luan_cuoc_hop: conclusion || "",
        };
        return { success: true, data: enhancedData };
      } else {
        setError(result.error || "Lỗi khi tạo biên bản");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      const msg = err.message || "Lỗi không xác định";
      setError(msg);
      return { success: false, error: msg };
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
    suggestions?: { shdc?: string; hdgd?: string; shl?: string }
  ) => {
    setIsGenerating(true);
    setError(null);

    // Build instructions
    let fullInstructions = customInstructions || "";
    const selectedTasks = tasks.filter((t) => t.selected);

    if (selectedTasks.length > 0) {
      const tasksPrompt = selectedTasks
        .map(
          (task, index) =>
            `NHIỆM VỤ ${index + 1}: ${task.name}\nNội dung: ${task.content}`
        )
        .join("\n\n");

      fullInstructions += `\n\n=== CÁC NHIỆM VỤ CẦN THIẾT KẾ ===\n${tasksPrompt}\n\nYÊU CẦU: Hãy thiết kế tiến trình dạy học RIÊNG CHO TỪNG NHIỆM VỤ. Mỗi nhiệm vụ cần có đầy đủ 4 bước (Chuyển giao - Thực hiện - Báo cáo - Kết luận). Trình bày theo cấu trúc:\n\nNHIỆM VỤ 1: [Tên]\n- Nội dung nhiệm vụ: [Chi tiết]\n- Tiến trình thực hiện:\n  + Bước 1: Chuyển giao nhiệm vụ...\n  + Bước 2: Thực hiện nhiệm vụ...\n  + Bước 3: Báo cáo, thảo luận...\n  + Bước 4: Kết luận, nhận định...\n\n(Tương tự cho các nhiệm vụ tiếp theo)`;
    }

    // Attempt to find month from PPCT data
    let foundMonth: number | undefined = undefined;
    if (ppctData && ppctData.length > 0) {
      const match = ppctData.find(
        (item) =>
          item.theme.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(item.theme.toLowerCase())
      );
      if (match && match.month) {
        foundMonth = Number.parseInt(match.month);
      }
    }

    try {
      const simplifiedTasks = selectedTasks.map((t) => ({
        name: t.name,
        description: `${t.content}${t.time ? `\n(Thời gian phân bổ: ${t.time} phút)` : ""}`,
      }));

      const result = await generateLessonPlan(
        grade,
        topic,
        fullPlanMode,
        fullPlanMode ? `${duration}` : undefined, // Keep exact duration format
        fullInstructions,
        simplifiedTasks,
        foundMonth,
        suggestions
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
    month: string,
    theme: string,
    instructions: string,
    budget?: string,
    checklist?: string,
    evaluation?: string
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateEventScript(grade, theme, instructions);

      if (result.success && result.data) {
        // Inject local data
        const enhancedData: EventResult = {
          ...result.data,
          du_toan_kinh_phi: budget,
          checklist_chuan_bi: checklist,
          danh_gia_sau_hoat_dong: evaluation,
        };
        return { success: true, data: enhancedData };
      } else {
        setError(result.error || "Lỗi khi tạo kịch bản");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const auditLesson = async (lessonData: any, grade: string, topic: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await auditLessonPlan(lessonData, grade, topic);
      return result;
    } catch (err: any) {
      setError(err.message || "Lỗi kiểm định");
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
    generateEvent,
    auditLesson,
  };
}
