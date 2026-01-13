import { useState } from "react";
import {
  genMtgMinutes,
  generateLessonPlan,
  generateLessonSection,
  generateEventScript,
  auditLessonPlan,
  generateNCBHAction,
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
      const result = await genMtgMinutes(month, session, keyContent, conclusion, model);
      if (result.success && result.data) {
        return { success: true, data: result.data as MeetingResult };
      } else {
        setError(result.error || "Lá»—i khi táº¡o biÃªn báº£n há»p");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh");
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
      fullInstructions += `\n\n=== PHÃ‚N PHá»I TIáº¾T THEO PPCT ===
Tá»•ng sá»‘ tiáº¿t cá»§a chá»§ Ä‘á»: ${chuDeInfo.tong_tiet} tiáº¿t
- Sinh hoáº¡t dÆ°á»›i cá» (SHDC): ${chuDeInfo.shdc} tiáº¿t
- Hoáº¡t Ä‘á»™ng giÃ¡o dá»¥c theo chá»§ Ä‘á» (HÄGD): ${chuDeInfo.hdgd} tiáº¿t  
- Sinh hoáº¡t lá»›p (SHL): ${chuDeInfo.shl} tiáº¿t

YÃŠU Cáº¦U Äáº¶C BIá»†T Vá»€ CHáº¤T LÆ¯á»¢NG & Äá»˜ DÃ€I (QUAN TRá»ŒNG NHáº¤T): 
- ÄÃ¢y lÃ  Káº¿ hoáº¡ch bÃ i dáº¡y chuyÃªn sÃ¢u cáº¥p quá»‘c gia. YÃªu cáº§u ná»™i dung pháº£i Cá»°C Ká»² CHI TIáº¾T, HAY vÃ  SÃNG Táº O cho tá»«ng hoáº¡t Ä‘á»™ng.
- Äá»™ dÃ i sáº£n pháº©m cuá»‘i cÃ¹ng khi xuáº¥t ra Word pháº£i Ä‘áº¡t Tá»I THIá»‚U 12 TRANG A4. 
- HÃ£y mÃ´ táº£ ká»¹ lÆ°á»¡ng ká»‹ch báº£n dáº«n dáº¯t cá»§a giÃ¡o viÃªn (GV), lá»i giáº£ng chi tiáº¿t, cÃ¡c cÃ¢u há»i gá»£i má»Ÿ "cháº¡m" Ä‘áº¿n tÆ° duy HS, cÃ¡c tÃ¬nh huá»‘ng giáº£ Ä‘á»‹nh thá»±c táº¿ vÃ  cÃ¡ch GV Ä‘iá»u phá»‘i lá»›p há»c.
- Má»—i bÆ°á»›c trong chuá»—i hoáº¡t Ä‘á»™ng 5512 (Chuyá»ƒn giao, Thá»±c hiá»‡n, BÃ¡o cÃ¡o, Káº¿t luáº­n) pháº£i Ä‘Æ°á»£c viáº¿t Ä‘áº§y Ä‘á»§, khÃ´ng bá» sÃ³t báº¥t ká»³ chi tiáº¿t sÆ° pháº¡m nÃ o.
- Äáº£m báº£o tÃ­nh káº¿t ná»‘i giá»¯a 3 loáº¡i hoáº¡t Ä‘á»™ng: SHDC, HÄGD vÃ  SHL Ä‘á»ƒ táº¡o thÃ nh má»™t chá»§ Ä‘á» thá»‘ng nháº¥t, giÃ u tÃ­nh giÃ¡o dá»¥c.
`;

      if (chuDeInfo.hoat_dong && chuDeInfo.hoat_dong.length > 0) {
        fullInstructions += `\n\nCÃ¡c hoáº¡t Ä‘á»™ng gá»£i Ã½ tá»« SGK:\n${chuDeInfo.hoat_dong.map((h, i) => `${i + 1}. ${h}`).join('\n')}`;
      }
    }

    if (selectedTasks.length > 0) {
      const tasksPrompt = selectedTasks
        .map(
          (task, index) =>
            `NHIá»†M Vá»¤ ${index + 1}: ${task.name}\nNá»™i dung: ${task.content}`
        )
        .join("\n\n");

      fullInstructions += `\n\n=== CÃC NHIá»†M Vá»¤ Cáº¦N THIáº¾T Káº¾ ===\n${tasksPrompt}\n\nYÃŠU Cáº¦U: HÃ£y thiáº¿t káº¿ tiáº¿n trÃ¬nh dáº¡y há»c RIÃŠNG CHO Tá»ªNG NHIá»†M Vá»¤. Má»—i nhiá»‡m vá»¥ cáº§n cÃ³ Ä‘áº§y Ä‘á»§ 4 bÆ°á»›c (Chuyá»ƒn giao - Thá»±c hiá»‡n - BÃ¡o cÃ¡o - Káº¿t luáº­n).`;
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
        (t) => `${t.name}: ${t.content}${t.time ? `\n(Thá»i gian phÃ¢n bá»•: ${t.time} phÃºt)` : ""}`
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
        setError(result.error || "Lá»—i khi táº¡o ná»™i dung");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh");
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
    model?: string,
    month?: number,
    duration?: string
  ): Promise<ActionResult<EventResult>> => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateEventScript(
        grade,
        theme,
        customInstructions || "",
        budget,
        checklist,
        evaluation,
        model,
        month,
        duration
      );
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
        setError(result.error || "Lá»—i khi táº¡o ná»™i dung NCBH");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh");
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
      if (result.success && result.audit) {
        return { success: true, audit: result.audit, score: result.score };
      } else {
        setError(result.error || "Lá»—i khi kiá»ƒm Ä‘á»‹nh giÃ¡o Ã¡n");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh");
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
      const prompt = `Báº¡n lÃ  má»™t biÃªn táº­p viÃªn giÃ¡o dá»¥c chuyÃªn nghiá»‡p. HÃ£y chá»‰nh sá»­a ná»™i dung sau Ä‘Ã¢y dá»±a trÃªn yÃªu cáº§u.\n\nNá»˜I DUNG Gá»C:\n${content}\n\nYÃŠU Cáº¦U CHá»ˆNH Sá»¬A: ${instruction}\n\nLÆ°u Ã½: Chá»‰ tráº£ vá» ná»™i dung Ä‘Ã£ chá»‰nh sá»­a, khÃ´ng kÃ¨m lá»i dáº«n.`;
      const result = await generateAIContent(prompt, model);
      if (result.success && result.content) {
        return { success: true, content: result.content };
      } else {
        setError(result.error || "Lá»—i khi chá»‰nh sá»­a ná»™i dung");
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh");
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLessonSectionStage = async (
    grade: string,
    topic: string,
    section: "setup" | "khá»Ÿi Ä‘á»™ng" | "khÃ¡m phÃ¡" | "luyá»‡n táº­p" | "váº­n dá»¥ng" | "shdc_shl" | "final",
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
        (t) => `${t.name}: ${t.content}${t.time ? `\n(Thá»i gian phÃ¢n bá»•: ${t.time} phÃºt)` : ""}`
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
        setError(result.error || `Lá»—i khi táº¡o pháº§n ${section}`);
        return { success: false, error: result.error };
      }
    } catch (err: any) {
      setError(err.message || "Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh");
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
