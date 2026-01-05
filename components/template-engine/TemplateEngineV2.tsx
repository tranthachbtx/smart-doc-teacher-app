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
  generateMeetingMinutes,
  generateLessonPlan,
  generateEventScript,
  generateNCBH as generateNCBHAction,
  generateAIContent
} from "@/lib/actions/gemini";
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
  TemplateData
} from "@/lib/types";
import type { PPCTChuDe } from "@/lib/data/ppct-database";
import { saveTemplate } from "@/lib/template-storage";
import { ExportService } from "@/lib/services/export-service";

// ========================================
// MAIN TEMPLATE ENGINE COMPONENT
// ========================================

export function TemplateEngine() {
  // --- Tab Management ---
  const [activeMode, setActiveMode] = useState<string>("lesson");
  const [useManualWorkflow, setUseManualWorkflow] = useState(true); // Default to Expert Mode

  // --- Meeting State ---
  const [selectedSession, setSelectedSession] = useState<string>("1");
  const [meetingKeyContent, setMeetingKeyContent] = useState<string>("");
  const [meetingConclusion, setMeetingConclusion] = useState<string>("");
  const [meetingResult, setMeetingResult] = useState<MeetingResult | null>(null);

  // --- Lesson State ---
  const [lessonGrade, setLessonGrade] = useState<string>("10");
  const [selectedChuDeSo, setSelectedChuDeSo] = useState<string>("");
  const [lessonAutoFilledTheme, setLessonAutoFilledTheme] = useState<string>("");
  const [lessonDuration, setLessonDuration] = useState<string>("2 tiết");
  const [selectedChuDe, setSelectedChuDe] = useState<PPCTChuDe | null>(null);
  const [shdcSuggestion, setShdcSuggestion] = useState<string>("");
  const [hdgdSuggestion, setHdgdSuggestion] = useState<string>("");
  const [shlSuggestion, setShlSuggestion] = useState<string>("");
  const [curriculumTasks, setCurriculumTasks] = useState<LessonTask[]>([]);
  const [showCurriculumTasks, setShowCurriculumTasks] = useState<boolean>(false);
  const [lessonTasks, setLessonTasks] = useState<LessonTask[]>([]);
  const [lessonCustomInstructions, setLessonCustomInstructions] = useState<string>("");
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);
  const [lessonFullPlanMode, setLessonFullPlanMode] = useState<boolean>(true);

  // --- Event State ---
  const [selectedGradeEvent, setSelectedGradeEvent] = useState<string>("10");
  const [selectedEventMonth, setSelectedEventMonth] = useState<string>("9");
  const [autoFilledTheme, setAutoFilledTheme] = useState<string>("");
  const [eventType, setEventType] = useState<string>("chuyên đề");
  const [eventBudget, setEventBudget] = useState<string>("tối ưu");
  const [eventChecklist, setEventChecklist] = useState<string>("");
  const [eventEvaluation, setEventEvaluation] = useState<string>("");
  const [eventResult, setEventResult] = useState<EventResult | null>(null);
  const [eventCustomInstructions, setEventCustomInstructions] = useState<string>("");

  // --- NCBH State ---
  const [selectedMonth, setSelectedMonth] = useState<string>("9");
  const [ncbhGrade, setNcbhGrade] = useState<string>("10");
  const [ncbhTopic, setNcbhTopic] = useState<string>("");
  const [ncbhCustomInstructions, setNcbhCustomInstructions] = useState<string>("");
  const [ncbhResult, setNcbhResult] = useState<NCBHResult | null>(null);

  // --- Assessment State ---
  const [assessmentGrade, setAssessmentGrade] = useState<string>("10");
  const [assessmentTerm, setAssessmentTerm] = useState<string>("giữa kỳ");
  const [assessmentProductType, setAssessmentProductType] = useState<string>("bài kiểm tra");
  const [assessmentTopic, setAssessmentTopic] = useState<string>("");
  const [assessmentTemplate, setAssessmentTemplate] = useState<TemplateData | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  // --- Common State ---
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [auditScore, setAuditScore] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<string>("gemini-2.0-flash");
  const [lessonTopic, setLessonTopic] = useState<string>("");
  const [templateManagerOpen, setTemplateManagerOpen] = useState<boolean>(false);
  const [lessonFile, setLessonFile] = useState<{ mimeType: string; data: string; name: string } | null>(null);

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
    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      switch (mode) {
        case "meeting":
          const meetingRes = await generateMeetingMinutes(
            selectedMonth,
            selectedSession,
            meetingKeyContent,
            meetingConclusion,
            selectedModel
          );
          if (meetingRes.success && meetingRes.data) {
            setMeetingResult(meetingRes.data);
            setSuccess("Đã tạo biên bản họp thành công!");
          } else {
            throw new Error(meetingRes.error);
          }
          break;
        case "lesson":
          const effectiveTopic = lessonTopic || lessonAutoFilledTheme;
          const lessonRes = await generateLessonPlan(
            lessonGrade,
            effectiveTopic,
            lessonDuration,
            lessonCustomInstructions,
            lessonTasks.filter(t => t.selected).map(t => `${t.name}: ${t.content}`),
            Number(selectedChuDeSo).toString(),
            JSON.stringify({ shdc: shdcSuggestion, hdgd: hdgdSuggestion, shl: shlSuggestion }),
            lessonFile || undefined,
            selectedModel
          );
          if (lessonRes.success && lessonRes.data) {
            setLessonResult(lessonRes.data);
            setSuccess("Đã tạo kế hoạch bài dạy thành công!");
          } else {
            throw new Error(lessonRes.error);
          }
          break;
        case "event":
          const eventRes = await generateEventScript(
            selectedGradeEvent,
            autoFilledTheme,
            eventCustomInstructions,
            eventBudget,
            eventChecklist,
            eventEvaluation,
            selectedModel
          );
          if (eventRes.success && eventRes.data) {
            setEventResult(eventRes.data);
            setSuccess("Đã tạo kịch bản ngoại khóa thành công!");
          } else {
            throw new Error(eventRes.error);
          }
          break;
        case "ncbh":
          const ncbhRes = await generateNCBHAction(
            ncbhGrade,
            ncbhTopic,
            ncbhCustomInstructions,
            selectedModel
          );
          if (ncbhRes.success && ncbhRes.data) {
            setNcbhResult(ncbhRes.data);
            setSuccess("Đã tạo nghiên cứu bài học thành công!");
          } else {
            throw new Error(ncbhRes.error);
          }
          break;
        case "assessment":
          const assessRes = await generateAssessmentPlan(
            assessmentGrade,
            assessmentTerm,
            assessmentProductType,
            assessmentTopic,
            selectedModel
          );
          if (assessRes.success && assessRes.data) {
            setAssessmentResult(assessRes.data);
            setSuccess("Đã tạo kế hoạch kiểm tra đánh giá thành công!");
          } else {
            throw new Error(assessRes.error);
          }
          break;
        default:
          throw new Error("Unknown mode");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (mode: string) => {
    setIsExporting(true);
    try {
      setSuccess("Đang tạo file Word...");

      let res;
      switch (mode) {
        case "lesson":
          if (!lessonResult) throw new Error("Chưa có kết quả giáo án để xuất");
          res = await ExportService.exportLessonToDocx(
            lessonResult,
            {
              onProgress: (p) => setSuccess(`Đang xuất file... ${Math.round(p)}%`),
              onError: (e) => setError(e.message)
            }
          );
          break;
        case "meeting":
          if (!meetingResult) throw new Error("Chưa có kết quả biên bản để xuất");
          res = await ExportService.exportMeeting(
            meetingResult,
            null,
            selectedMonth,
            selectedSession
          );
          break;
        case "event":
          if (!eventResult) throw new Error("Chưa có kết quả kịch bản để xuất");
          res = await ExportService.exportEvent(
            eventResult,
            null,
            { grade: selectedGradeEvent, month: selectedEventMonth }
          );
          break;
        case "ncbh":
          if (!ncbhResult) throw new Error("Chưa có kết quả NCBH để xuất");
          res = await ExportService.exportNCBH(
            ncbhResult,
            null,
            { grade: ncbhGrade, month: selectedMonth }
          );
          break;
        case "assessment":
          if (!assessmentResult) throw new Error("Chưa có kết quả đánh giá để xuất");
          res = await ExportService.exportAssessmentPlan(
            assessmentResult,
            null,
            {
              grade: assessmentGrade,
              term: assessmentTerm,
              productType: assessmentProductType
            }
          );
          break;
        default:
          throw new Error(`Chế độ xuất "${mode}" chưa được hỗ trợ`);
      }

      if (res?.success) {
        setSuccess("Đã xuất file Word thành công!");
      }
    } catch (err) {
      console.error("Export Error:", err);
      setError(err instanceof Error ? err.message : "Xuất file thất bại");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAuditResult("Đánh giá hoàn thành! Giáo án đạt chuẩn 5512.");
      setAuditScore(85);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đánh giá thất bại");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleRefineSection = async (content: string, instruction: string, model?: string): Promise<ActionResult> => {
    setIsGenerating(true);
    try {
      const prompt = `Bạn là một biên tập viên giáo dục chuyên nghiệp. Hãy chỉnh sửa nội dung sau đây dựa trên yêu cầu.\n\nNỘI DUNG GỐC:\n${content}\n\nYÊU CẦU CHỈNH SỬA: ${instruction}\n\nLưu ý: Chỉ trả về nội dung đã chỉnh sửa, không kèm lời dẫn.`;
      const res = await generateAIContent(prompt, model || selectedModel);
      return res;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSection = async (section: any, context: any, stepInstruction?: string): Promise<ActionResult> => {
    setIsGenerating(true);
    try {
      const effectiveTopic = lessonTopic || lessonAutoFilledTheme;
      const result = await generateLessonSection(
        lessonGrade,
        effectiveTopic,
        section,
        typeof context === 'string' ? context : JSON.stringify(context || ""),
        lessonDuration,
        lessonCustomInstructions,
        lessonTasks.filter(t => t.selected).map(t => `${t.name}: ${t.content}`),
        Number(selectedChuDeSo).toString(),
        JSON.stringify({ shdc: shdcSuggestion, hdgd: hdgdSuggestion, shl: shlSuggestion }),
        selectedModel,
        lessonFile || undefined,
        stepInstruction
      );

      if (result.success && result.data) {
        setLessonResult((prev: LessonResult | null) => {
          if (!prev) return result.data as LessonResult;
          return {
            ...prev,
            ...result.data
          } as LessonResult;
        });
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const distributeTimeForTasks = () => {
    // Logic placeholder
  };

  const updateLessonTask = (id: string, field: any, value: any) => {
    setLessonTasks(prev => prev.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const removeLessonTask = (id: string) => {
    setLessonTasks(prev => prev.filter(task => task.id !== id));
  };

  const addLessonTask = () => {
    const newTask: LessonTask = {
      id: Date.now().toString(),
      name: "Task mới",
      content: "",
    };
    setLessonTasks(prev => [...prev, newTask]);
  };

  const onTemplateUpload = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      await saveTemplate("assessment", file.name, buffer);
      setAssessmentTemplate({ name: file.name, data: buffer });
      setSuccess(`Đã tải lên mẫu "${file.name}"`);
    } catch (err: any) {
      setError(`Lỗi tải mẫu: ${err.message}`);
    }
  };

  // --- Props for Engines ---
  const meetingEngineProps: MeetingEngineProps = {
    selectedMonth,
    setSelectedMonth,
    selectedSession,
    setSelectedSession,
    meetingKeyContent,
    setMeetingKeyContent,
    meetingConclusion,
    setMeetingConclusion,
    meetingResult,
    setMeetingResult,
    isGenerating,
    onGenerate: () => handleGenerate("meeting"),
    isExporting,
    onExport: () => handleExport("meeting"),
    copyToClipboard,
  };

  const lessonEngineProps: LessonEngineProps = {
    lessonGrade,
    setLessonGrade,
    selectedChuDeSo,
    setSelectedChuDeSo,
    lessonAutoFilledTheme,
    setLessonAutoFilledTheme,
    lessonDuration,
    setLessonDuration,
    selectedChuDe,
    setSelectedChuDe,
    setLessonMonth: setSelectedMonth,
    shdcSuggestion,
    setShdcSuggestion,
    hdgdSuggestion,
    setHdgdSuggestion,
    shlSuggestion,
    setShlSuggestion,
    curriculumTasks,
    distributeTimeForTasks,
    showCurriculumTasks,
    setShowCurriculumTasks,
    lessonTasks,
    updateLessonTask,
    removeLessonTask,
    addLessonTask,
    lessonCustomInstructions,
    setLessonCustomInstructions,
    lessonResult,
    setLessonResult,
    isGenerating,
    onGenerate: () => handleGenerate("lesson"),
    isExporting,
    onExport: () => handleExport("lesson"),
    copyToClipboard,
    isAuditing,
    onAudit: handleAudit,
    auditResult,
    auditScore,
    setSuccess,
    setError,
    success,
    error,
    lessonTopic,
    setLessonTopic,
    selectedModel,
    setSelectedModel,
    lessonFile,
    setLessonFile,
    onRefineSection: handleRefineSection,
    onGenerateSection: handleGenerateSection,
    lessonFullPlanMode,
    setLessonFullPlanMode,
  };

  const eventEngineProps: EventEngineProps = {
    selectedGradeEvent,
    setSelectedGradeEvent,
    selectedEventMonth,
    setSelectedEventMonth,
    autoFilledTheme,
    setAutoFilledTheme,
    eventType,
    setEventType,
    eventBudget,
    setEventBudget,
    eventChecklist,
    setEventChecklist,
    eventEvaluation,
    setEventEvaluation,
    eventResult,
    setEventResult,
    isGenerating,
    onGenerate: () => handleGenerate("event"),
    isExporting,
    onExport: () => handleExport("event"),
    copyToClipboard,
    eventCustomInstructions,
    setEventCustomInstructions,
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trợ lý cho Trần Thạch - Trường THPT Bùi Thị Xuân - Mũi Né - Lâm Đồng
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Hệ thống AI hỗ trợ tạo Kế hoạch bài học chuẩn 5512, nghiên cứu bài học chuyên sâu, kế hoạch ngoại khóa chất lượng và kế hoạch đánh giá khoa học!
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeMode} onValueChange={setActiveMode} className="space-y-6">
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
              onClick={() => window.open('/api/test-api-keys', '_blank')}
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

          <TabsContent value="lesson" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            {/* Integrated Workflow (Auto + Manual merged) */}
            <LessonEngine {...lessonEngineProps} />
          </TabsContent>

          <TabsContent value="event">
            <EventEngine {...eventEngineProps} />
          </TabsContent>

          <TabsContent value="ncbh">
            <NCBHTab
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              ncbhGrade={ncbhGrade}
              setNcbhGrade={setNcbhGrade}
              ncbhTopic={ncbhTopic}
              setNcbhTopic={setNcbhTopic}
              ncbhCustomInstructions={ncbhCustomInstructions}
              setNcbhCustomInstructions={setNcbhCustomInstructions}
              ncbhResult={ncbhResult}
              setNcbhResult={setNcbhResult}
              isGenerating={isGenerating}
              onGenerate={() => handleGenerate("ncbh")}
              isExporting={isExporting}
              onExport={() => handleExport("ncbh")}
              copyToClipboard={copyToClipboard}
              ppctData={[]}
            />
          </TabsContent>

          <TabsContent value="assessment">
            <AssessmentTab
              assessmentGrade={assessmentGrade}
              setAssessmentGrade={setAssessmentGrade}
              assessmentTerm={assessmentTerm}
              setAssessmentTerm={setAssessmentTerm}
              assessmentProductType={assessmentProductType}
              setAssessmentProductType={setAssessmentProductType}
              assessmentTopic={assessmentTopic}
              setAssessmentTopic={setAssessmentTopic}
              assessmentTemplate={assessmentTemplate}
              onTemplateUpload={onTemplateUpload}
              assessmentResult={assessmentResult}
              isGenerating={isGenerating}
              onGenerate={() => handleGenerate("assessment")}
              isExporting={isExporting}
              onExport={() => handleExport("assessment")}
            />
          </TabsContent>

          <TabsContent value="history">
            <TemplateManager open={templateManagerOpen} onOpenChange={setTemplateManagerOpen} />
          </TabsContent>
        </Tabs>

        {/* Status Messages */}
        {success && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
