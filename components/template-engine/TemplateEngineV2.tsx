/**
 * 🏗️ TEMPLATE ENGINE v2.0 (REFACTORED)
 * Đã chia nhỏ God Component thành các modules riêng biệt
 */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Sparkles,
  Download,
  Calendar,
  BookOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Info,
  MessageSquare,
  Plus,
  X,
  Clock,
  Settings,
  Archive,
  Search,
  Trash2,
  ExternalLink,
  ListOrdered,
  Upload,
  Zap,
} from "lucide-react";
import {
  checkApiKeyStatus,
  generateAssessmentPlan,
  generateLessonSection,
  genMtgMinutes,
  generateLessonPlan,
  generateEventScript,
  generateNCBHAction,
  generateAIContent,
} from "@/lib/actions/gemini";
import { performAdvancedAudit } from "@/lib/actions/advanced-audit";
import { MeetingEngine, type MeetingEngineProps } from "./MeetingEngine";
import { LessonEngine, type LessonEngineProps } from "./LessonEngine";
import { EventEngine, type EventEngineProps } from "./EventEngine";
import { NCBHTab } from "./NCBHTab";
import { ManualProcessingHub } from "@/components/manual-workflow/ManualProcessingHub";

import { AssessmentTab } from "./AssessmentTab";
import { TemplateManager } from "../template-manager";
import type {
  MeetingResult,
  LessonResult,
  EventResult,
  NCBHResult,
  AssessmentResult,
  LessonTask,
  ActionResult,
  TemplateData,
} from "@/lib/types";
import { useAppStore } from "@/lib/store/use-app-store";
import { saveTemplate } from "@/lib/template-storage";
import { DocumentExportSystem } from "@/lib/services/document-export-system";

// ========================================
// MAIN TEMPLATE ENGINE COMPONENT
// ========================================

export function TemplateEngine() {
  const store = useAppStore();
  const {
    lesson: lessonData,
    meeting: meetingData,
    event: eventData,
    assessment: assessmentData,
    ncbh: ncbhData,
    error,
    success,
    setError,
    setSuccess,
  } = store;

  // --- Tab Management (Keep local for immediate UI) ---
  const [activeMode, setActiveMode] = useState<string>("lesson");
  const [useManualWorkflow, setUseManualWorkflow] = useState(true);
  const [templateManagerOpen, setTemplateManagerOpen] =
    useState<boolean>(false);

  // --- Effects ---
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // --- Handlers ---
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Đã sao chép vào clipboard!");
    } catch (err) {
      setError("Không thể sao chép. Vui lòng thử lại.");
    }
  };

  const handleGenerate = async (mode: string) => {
    store.setGeneratingMode(mode);
    store.setError(null);
    store.setSuccess(null);

    try {
      switch (mode) {
        case "meeting":
          // Fail Fast: Meeting
          if (!meetingData.month || !meetingData.session) {
            throw new Error("REQUIRED_FIELDS_MISSING: Month and Session must be provided.");
          }
          const meetingRes = await genMtgMinutes(
            meetingData.month,
            meetingData.session,
            meetingData.keyContent,
            meetingData.conclusion,
            store.selectedModel
          );
          if (meetingRes.success && meetingRes.data) {
            store.updateMeetingField("result", meetingRes.data);
            store.setSuccess("Đã tạo biên bản họp thành công!");
          } else {
            if (meetingRes.content) {
              await copyToClipboard(meetingRes.content);
              store.setSuccess(
                "Đã COPY PROMPT vào bộ nhớ tạm. Hãy dán vào Gemini/ChatGPT!"
              );
              // Don't throw to avoid red error screen matching user preference for "Manual Workflow"
              return;
            }
            throw new Error(meetingRes.error);
          }
          break;
        case "lesson":
          const effectiveTopicLabel = lessonData.theme;
          const lessonRes = await generateLessonPlan(
            lessonData.grade,
            effectiveTopicLabel,
            lessonData.duration,
            lessonData.customInstructions,
            lessonData.tasks
              .filter((t) => t.selected)
              .map((t) => `${t.name}: ${t.content}`),
            Number(lessonData.chuDeSo).toString(),
            JSON.stringify({
              shdc: lessonData.shdcSuggestion,
              hdgd: lessonData.hdgdSuggestion,
              shl: lessonData.shlSuggestion,
            }),
            lessonData.file || undefined,
            store.selectedModel
          );
          if (lessonRes.success && lessonRes.data) {
            store.setLessonResult(lessonRes.data);
            store.setSuccess("Đã tạo kế hoạch bài dạy thành công!");
          } else {
            // Lesson plan usually works with Manual Workflow Hub, but if they use this legacy path:
            if (lessonRes.content) {
              await copyToClipboard(lessonRes.content);
              store.setSuccess("⚠️ Đã COPY PROMPT Giáo án. Hãy dán vào AI!");
              return;
            }
            throw new Error(lessonRes.error);
          }
          break;
        case "event":
          console.log("[DEEP_TRACE:1_INPUT] Event generation triggered.");
          console.log("[DEEP_TRACE:1_INPUT] Payload details:", {
            grade: eventData.grade,
            theme: eventData.theme,
            instructions: eventData.instructions,
            budget: eventData.budget,
            checklist: eventData.checklist,
            month: eventData.month,
            model: store.selectedModel,
          });

          // Logic Check: Fail Fast
          if (!eventData.theme || eventData.theme.trim().length < 2) {
            throw new Error("MIN_DATA_REQUIRED: Event theme is mandatory.");
          }
          if (!eventData.grade) {
            throw new Error("MIN_DATA_REQUIRED: Event grade is mandatory.");
          }

          const eventRes = await generateEventScript(
            eventData.grade,
            eventData.theme,
            eventData.instructions,
            eventData.budget,
            eventData.checklist,
            "", // evaluation placeholder
            store.selectedModel,
            parseInt(eventData.month) || 10,
            eventData.duration
          );

          console.log("[DEEP_TRACE:2_FLOW] Response from generateEventScript:", eventRes.success ? "SUCCESS" : "FAILED");

          if (eventRes.success && eventRes.data) {
            console.log("[DEEP_TRACE:2_FLOW] Data received. Keys:", Object.keys(eventRes.data).join(", "));
            store.updateEventField("result", eventRes.data);
            store.setSuccess("Đã tạo kịch bản ngoại khóa thành công!");
          } else {
            console.error("[DEEP_TRACE:2_FLOW] Generation failed. Error:", eventRes.error);
            // Updated: Show error instead of Copy Prompt fallback for Event mode
            throw new Error(
              eventRes.error ||
              "Không thể tạo kế hoạch ngoại khóa. Vui lòng thử lại!"
            );
          }
          break;
        case "ncbh":
          // Fail Fast: NCBH
          if (!ncbhData.grade || !ncbhData.topic) {
            throw new Error("MIN_DATA_REQUIRED: NCBH grade and topic are mandatory.");
          }
          const ncbhRes = await generateNCBHAction(
            ncbhData.grade,
            ncbhData.topic,
            ncbhData.instructions,
            store.selectedModel
          );
          if (ncbhRes.success && ncbhRes.data) {
            store.updateNcbhField("result", ncbhRes.data);
            store.setSuccess("Đã tạo nghiên cứu bài học thành công!");
          } else {
            if (ncbhRes.content) {
              await copyToClipboard(ncbhRes.content);
              store.setSuccess(
                "Đã COPY PROMPT NCBH. Hãy dán vào AI để tạo!"
              );
              return;
            }
            throw new Error(ncbhRes.error);
          }
          break;
        case "assessment":
          // Fail Fast: Assessment
          if (!assessmentData.grade || !assessmentData.topic || !assessmentData.productType) {
            throw new Error("MIN_DATA_REQUIRED: Grade, Topic and Product Type are mandatory.");
          }
          const assessRes = await generateAssessmentPlan(
            assessmentData.grade,
            assessmentData.term,
            assessmentData.productType,
            assessmentData.topic,
            store.selectedModel
          );
          if (assessRes.success && assessRes.data) {
            store.updateAssessmentField("result", assessRes.data);
            store.setSuccess("Đã tạo kế hoạch kiểm tra đánh giá thành công!");
          } else {
            if (assessRes.content) {
              await copyToClipboard(assessRes.content);
              store.setSuccess(
                "Đã COPY PROMPT Đánh giá. Hãy dán vào AI để tạo!"
              );
              return;
            }
            throw new Error(assessRes.error);
          }
          break;
        default:
          throw new Error("Unknown mode");
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      store.setGeneratingMode(null);
    }
  };

  const handleExport = async (mode: string) => {
    store.setLoading("isExporting", true);
    // Restore the Template Service for "Sample-Based" export
    const { TemplateExportService } = await import(
      "@/lib/services/template-export-service"
    );
    const exportSystem = DocumentExportSystem.getInstance(); // Keep as fallback/alternative for others

    try {
      store.setSuccess("Đang xuất file dựa trên mẫu chuẩn...");

      let success = false;
      switch (mode) {
        case "lesson":
          if (!lessonData.result)
            throw new Error("Chưa có kết quả giáo án để xuất");
          success = await TemplateExportService.exportLessonToTemplate(
            lessonData.result
          );
          break;
        case "meeting":
          if (!meetingData.result)
            throw new Error("Chưa có kết quả biên bản để xuất");
          success = await TemplateExportService.exportMeetingToTemplate(
            meetingData.result
          );
          break;
        case "event":
          if (!eventData.result)
            throw new Error("Chưa có kết quả kịch bản để xuất");
          success = await TemplateExportService.exportEventToTemplate(
            eventData.result
          );
          break;
        case "ncbh":
          if (!ncbhData.result) throw new Error("Chưa có kết quả NCBH để xuất");
          success = await TemplateExportService.exportNCBHToTemplate(
            ncbhData.result
          );
          break;
        case "assessment":
          if (!assessmentData.result)
            throw new Error("Chưa có kết quả đánh giá để xuất");
          const templateInput =
            assessmentData.template?.data || "/templates/Assessment_Template.docx";
          // If we have a custom arrayBuffer from upload, docxtemplater needs a different handling,
          // but for now we follow the template path pattern.
          success = await TemplateExportService.exportAssessmentToTemplate(
            assessmentData.result,
            typeof templateInput === "string" ? templateInput : undefined
          );
          break;
        default:
          throw new Error(
            `Chế độ xuất "${mode}" chưa được hỗ trợ trong phiên bản tinh gọn.`
          );
      }

      if (success) {
        store.setSuccess("Đã xuất file Word thành công!");
      } else {
        throw new Error("Quá trình xuất file gặp sự cố kỹ thuật.");
      }
    } catch (err) {
      console.error("Export Error:", err);
      store.setError(err instanceof Error ? err.message : "Xuất file thất bại");
    } finally {
      store.setLoading("isExporting", false);
    }
  };

  const handleAudit = async () => {
    if (!lessonData.result) {
      store.setError("Không có dữ liệu giáo án để kiểm định.");
      return;
    }

    store.setLoading("isAuditing", true);
    store.setSuccess(
      "🔍 Đang thực hiện kiểm định chuyên sâu (Pedagogical Audit V5)..."
    );

    try {
      const result = await performAdvancedAudit(lessonData.result);
      if (result.success && result.report) {
        const report = result.report;
        store.updateLessonField("auditResult", report.professionalReasoning);
        store.updateLessonField("auditScore", report.overallScore);
        store.setSuccess(
          `✅ Kiểm định hoàn tất! Điểm: ${report.overallScore}/100`
        );
      } else {
        throw new Error(result.error || "Kiểm định không thành công");
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "Đánh giá thất bại");
    } finally {
      store.setLoading("isAuditing", false);
    }
  };

  const handleRefineSection = async (
    content: string,
    instruction: string,
    model?: string
  ): Promise<ActionResult> => {
    store.setGeneratingMode("refine");
    try {
      const prompt = `Bạn là một biên tập viên giáo dục chuyên nghiệp. Hãy chỉnh sửa nội dung sau đây dựa trên yêu cầu.\n\nNỘI DUNG GỐC:\n${content}\n\nYÊU CẦU CHỈNH SỬA: ${instruction}\n\nLưu ý: Chỉ trả về nội dung đã chỉnh sửa, không kèm lời dẫn.`;
      const res = await generateAIContent(prompt, model || store.selectedModel);
      return res;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      store.setGeneratingMode(null);
    }
  };

  const handleGenerateSection = async (
    section: any,
    context: any,
    stepInstruction?: string
  ): Promise<ActionResult> => {
    store.setGeneratingMode("section");
    try {
      const effectiveTopic = lessonData.theme;
      const result = await generateLessonSection(
        lessonData.grade,
        effectiveTopic,
        section,
        typeof context === "string" ? context : JSON.stringify(context || ""),
        lessonData.duration,
        lessonData.customInstructions,
        lessonData.tasks
          .filter((t) => t.selected)
          .map((t) => `${t.name}: ${t.content}`),
        Number(lessonData.chuDeSo).toString(),
        JSON.stringify({
          shdc: lessonData.shdcSuggestion,
          hdgd: lessonData.hdgdSuggestion,
          shl: lessonData.shlSuggestion,
        }),
        store.selectedModel,
        lessonData.file || undefined,
        stepInstruction
      );

      if (result.success && result.data) {
        store.setLessonResult({
          ...(lessonData.result || ({} as any)),
          ...result.data,
        });
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      store.setGeneratingMode(null);
    }
  };

  const distributeTimeForTasks = () => {
    // Logic placeholder
  };

  const onTemplateUpload = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      await saveTemplate("assessment", file.name, buffer);
      store.updateAssessmentField("template", {
        name: file.name,
        data: buffer,
      });
      store.setSuccess(`Đã tải lên mẫu "${file.name}"`);
    } catch (err: any) {
      store.setError(`Lỗi tải mẫu: ${err.message}`);
    }
  };

  // --- Props for Engines ---
  const meetingEngineProps: MeetingEngineProps = {
    selectedMonth: meetingData.month,
    setSelectedMonth: (v) => store.updateMeetingField("month", v),
    selectedSession: meetingData.session,
    setSelectedSession: (v) => store.updateMeetingField("session", v),
    meetingKeyContent: meetingData.keyContent,
    setMeetingKeyContent: (v) => store.updateMeetingField("keyContent", v),
    meetingConclusion: meetingData.conclusion,
    setMeetingConclusion: (v) => store.updateMeetingField("conclusion", v),
    meetingResult: meetingData.result,
    setMeetingResult: (v) => store.updateMeetingField("result", v),
    isGenerating: store.generatingMode === "meeting",
    onGenerate: () => handleGenerate("meeting"),
    isExporting: store.isExporting,
    onExport: () => handleExport("meeting"),
    copyToClipboard,
  };

  const lessonEngineProps: LessonEngineProps = {
    lessonGrade: lessonData.grade,
    setLessonGrade: store.setLessonGrade,
    selectedChuDeSo: lessonData.chuDeSo,
    setSelectedChuDeSo: (v) => store.updateLessonField("chuDeSo", v),
    lessonAutoFilledTheme: lessonData.theme,
    setLessonAutoFilledTheme: store.setLessonTheme,
    lessonDuration: lessonData.duration,
    setLessonDuration: (v) => store.updateLessonField("duration", v),
    selectedChuDe: null, // Legacy, can be derived or removed if unused
    setSelectedChuDe: () => { },
    setLessonMonth: (v) => store.updateLessonField("month", v),
    shdcSuggestion: lessonData.shdcSuggestion,
    setShdcSuggestion: (v) => store.updateLessonField("shdcSuggestion", v),
    hdgdSuggestion: lessonData.hdgdSuggestion,
    setHdgdSuggestion: (v) => store.updateLessonField("hdgdSuggestion", v),
    shlSuggestion: lessonData.shlSuggestion,
    setShlSuggestion: (v) => store.updateLessonField("shlSuggestion", v),
    curriculumTasks: [],
    distributeTimeForTasks,
    showCurriculumTasks: false,
    setShowCurriculumTasks: () => { },
    lessonTasks: lessonData.tasks,
    updateLessonTask: (id, field, value) => {
      store.updateLessonField(
        "tasks",
        lessonData.tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t))
      );
    },
    removeLessonTask: (id) => {
      store.updateLessonField(
        "tasks",
        lessonData.tasks.filter((t) => t.id !== id)
      );
    },
    addLessonTask: () => {
      const newTask: LessonTask = {
        id: Date.now().toString(),
        name: "Task mới",
        content: "",
      };
      store.updateLessonField("tasks", [...lessonData.tasks, newTask]);
    },
    lessonCustomInstructions: lessonData.customInstructions,
    setLessonCustomInstructions: (v) =>
      store.updateLessonField("customInstructions", v),
    lessonResult: lessonData.result,
    setLessonResult: store.setLessonResult,
    isGenerating:
      store.generatingMode === "lesson" ||
      store.generatingMode === "section" ||
      store.generatingMode === "refine",
    onGenerate: () => handleGenerate("lesson"),
    isExporting: store.isExporting,
    onExport: () => handleExport("lesson"),
    copyToClipboard,
    isAuditing: store.isAuditing,
    onAudit: handleAudit,
    auditResult: lessonData.auditResult,
    auditScore: lessonData.auditScore,
    setSuccess: store.setSuccess,
    setError: store.setError,
    success: store.success,
    error: store.error,
    lessonTopic: lessonData.theme,
    setLessonTopic: store.setLessonTheme,
    selectedModel: store.selectedModel,
    setSelectedModel: store.setSelectedModel,
    lessonFile: lessonData.file,
    setLessonFile: (v) => store.updateLessonField("file", v),
    onRefineSection: handleRefineSection,
    onGenerateSection: handleGenerateSection,
    lessonFullPlanMode: true,
    setLessonFullPlanMode: () => { },
  };

  const eventEngineProps: EventEngineProps = {
    selectedGradeEvent: eventData.grade,
    setSelectedGradeEvent: (v) => store.updateEventField("grade", v),
    selectedEventMonth: eventData.month,
    setSelectedEventMonth: (v) => store.updateEventField("month", v),
    autoFilledTheme: eventData.theme,
    setAutoFilledTheme: (v) => store.updateEventField("theme", v),
    eventType: "chuyên đề", // default
    setEventType: () => { },
    eventBudget: eventData.budget,
    setEventBudget: (v) => store.updateEventField("budget", v),
    eventChecklist: eventData.checklist,
    setEventChecklist: (v) => store.updateEventField("checklist", v),
    eventEvaluation: "",
    setEventEvaluation: () => { },
    eventResult: eventData.result,
    setEventResult: (v) => store.updateEventField("result", v),
    isGenerating: store.generatingMode === "event",
    onGenerate: () => handleGenerate("event"),
    isExporting: store.isExporting,
    onExport: () => handleExport("event"),
    copyToClipboard,
    eventCustomInstructions: eventData.instructions,
    setEventCustomInstructions: (v) =>
      store.updateEventField("instructions", v),
    eventDuration: eventData.duration,
    setEventDuration: (v) => store.updateEventField("duration", v),
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trợ lý cho Trần Thạch - Trường THPT Bùi Thị Xuân - Mũi Né - Lâm
              Đồng
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Hệ thống AI hỗ trợ tạo Kế hoạch bài học chuẩn 5512, nghiên cứu bài
              học chuyên sâu, kế hoạch ngoại khóa chất lượng và kế hoạch đánh
              giá khoa học!
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs
          value={activeMode}
          onValueChange={setActiveMode}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-white shadow-md rounded-xl p-1 h-auto">
              <TabsTrigger
                value="lesson"
                className="gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Bài dạy</span>
                <span className="sm:hidden">KHBD</span>
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Ngoại khóa</span>
                <span className="sm:hidden">HĐNK</span>
              </TabsTrigger>
              <TabsTrigger
                value="meeting"
                className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Biên bản</span>
                <span className="sm:hidden">Họp</span>
              </TabsTrigger>
              <TabsTrigger
                value="ncbh"
                className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">NC Bài học</span>
                <span className="sm:hidden">NCBH</span>
              </TabsTrigger>
              <TabsTrigger
                value="assessment"
                className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Đánh giá</span>
                <span className="sm:hidden">ĐG</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">Lưu trữ</span>
                <span className="sm:hidden">Kho</span>
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/test-keys", "_blank")}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Test API</span>
            </Button>
          </div>

          {/* Tab Contents */}
          <TabsContent value="meeting">
            <MeetingEngine {...meetingEngineProps} />
          </TabsContent>

          <TabsContent
            value="lesson"
            className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
          >
            {/* Integrated Workflow (Auto + Manual merged) */}
            <LessonEngine {...lessonEngineProps} />
          </TabsContent>

          <TabsContent value="event">
            <EventEngine {...eventEngineProps} />
          </TabsContent>

          <TabsContent value="ncbh">
            <NCBHTab
              selectedMonth={ncbhData.month}
              setSelectedMonth={(v) => store.updateNcbhField("month", v)}
              ncbhGrade={ncbhData.grade}
              setNcbhGrade={(v) => store.updateNcbhField("grade", v)}
              ncbhTopic={ncbhData.topic}
              setNcbhTopic={(v) => store.updateNcbhField("topic", v)}
              ncbhCustomInstructions={ncbhData.instructions}
              setNcbhCustomInstructions={(v) =>
                store.updateNcbhField("instructions", v)
              }
              ncbhResult={ncbhData.result}
              setNcbhResult={(v) => store.updateNcbhField("result", v)}
              isGenerating={store.generatingMode === "ncbh"}
              onGenerate={() => handleGenerate("ncbh")}
              isExporting={store.isExporting}
              onExport={() => handleExport("ncbh")}
              copyToClipboard={copyToClipboard}
              ppctData={[]}
            />
          </TabsContent>

          <TabsContent value="assessment">
            <AssessmentTab
              assessmentGrade={assessmentData.grade}
              setAssessmentGrade={(v) =>
                store.updateAssessmentField("grade", v)
              }
              assessmentTerm={assessmentData.term}
              setAssessmentTerm={(v) => store.updateAssessmentField("term", v)}
              assessmentProductType={assessmentData.productType}
              setAssessmentProductType={(v) =>
                store.updateAssessmentField("productType", v)
              }
              assessmentTopic={assessmentData.topic}
              setAssessmentTopic={(v) =>
                store.updateAssessmentField("topic", v)
              }
              assessmentTemplate={assessmentData.template}
              onTemplateUpload={onTemplateUpload}
              assessmentResult={assessmentData.result}
              setAssessmentResult={(v) =>
                store.updateAssessmentField("result", v)
              }
              isGenerating={store.generatingMode === "assessment"}
              onGenerate={() => handleGenerate("assessment")}
              isExporting={store.isExporting}
              onExport={() => handleExport("assessment")}
            />
          </TabsContent>

          <TabsContent value="history">
            <TemplateManager
              open={templateManagerOpen}
              onOpenChange={setTemplateManagerOpen}
            />
          </TabsContent>
        </Tabs>

        {/* Status Messages */}
        {store.success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {store.success}
          </div>
        )}

        {store.error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {store.error}
          </div>
        )}
      </div>
    </div>
  );
}
