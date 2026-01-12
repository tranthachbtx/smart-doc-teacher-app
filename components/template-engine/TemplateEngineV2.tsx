/**
 * ðŸ—ï¸ TEMPLATE ENGINE v2.0 (REFACTORED)
 * ÄÃ£ chia nhá» God Component thÃ nh cÃ¡c modules riÃªng biá»‡t
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
  TemplateData
} from "@/lib/types";
import { useAppStore } from "@/lib/store/use-app-store";
import { saveTemplate } from "@/lib/template-storage";
import { DocumentExportSystem } from "@/lib/services/document-export-system";

// ========================================
// MAIN TEMPLATE ENGINE COMPONENT
// ========================================

export function TemplateEngine() {
  const store = useAppStore();
  const { lesson, meeting, event, assessment, ncbh, error, success, setError, setSuccess } = store;

  // --- Tab Management (Keep local for immediate UI) ---
  const [activeMode, setActiveMode] = useState<string>("lesson");
  const [useManualWorkflow, setUseManualWorkflow] = useState(true);
  const [templateManagerOpen, setTemplateManagerOpen] = useState<boolean>(false);

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
      setSuccess("ÄÃ£ sao chÃ©p vÃ o clipboard!");
    } catch (err) {
      setError("KhÃ´ng thá»ƒ sao chÃ©p. Vui lÃ²ng thá»­ láº¡i.");
    }
  };

  const handleGenerate = async (mode: string) => {
    store.setGeneratingMode(mode);
    store.setError(null);
    store.setSuccess(null);

    try {
      switch (mode) {
        case "meeting":
          const meetingRes = await generateMeetingMinutes(
            meeting.month,
            meeting.session,
            meeting.keyContent,
            meeting.conclusion,
            store.selectedModel
          );
          if (meetingRes.success && meetingRes.data) {
            store.updateMeetingField('result', meetingRes.data);
            store.setSuccess("ÄÃ£ táº¡o biÃªn báº£n há»p thÃ nh cÃ´ng!");
          } else {
            if (meetingRes.content) {
              await copyToClipboard(meetingRes.content);
              store.setSuccess("âš ï¸ AI server quÃ¡ táº£i. ÄÃ£ COPY PROMPT vÃ o bá»™ nhá»› táº¡m. HÃ£y dÃ¡n vÃ o Gemini/ChatGPT!");
              // Don't throw to avoid red error screen matching user preference for "Manual Workflow"
              return;
            }
            throw new Error(meetingRes.error);
          }
          break;
        case "lesson":
          const effectiveTopicLabel = lesson.theme;
          const lessonRes = await generateLessonPlan(
            lesson.grade,
            effectiveTopicLabel,
            lesson.duration,
            lesson.customInstructions,
            lesson.tasks.filter(t => t.selected).map(t => `${t.name}: ${t.content}`),
            Number(lesson.chuDeSo).toString(),
            JSON.stringify({ shdc: lesson.shdcSuggestion, hdgd: lesson.hdgdSuggestion, shl: lesson.shlSuggestion }),
            lesson.file || undefined,
            store.selectedModel
          );
          if (lessonRes.success && lessonRes.data) {
            store.setLessonResult(lessonRes.data);
            store.setSuccess("ÄÃ£ táº¡o káº¿ hoáº¡ch bÃ i dáº¡y thÃ nh cÃ´ng!");
          } else {
            // Lesson plan usually works with Manual Workflow Hub, but if they use this legacy path:
            if (lessonRes.content) {
              await copyToClipboard(lessonRes.content);
              store.setSuccess("âš ï¸ ÄÃ£ COPY PROMPT GiÃ¡o Ã¡n. HÃ£y dÃ¡n vÃ o AI!");
              return;
            }
            throw new Error(lessonRes.error);
          }
          break;
        case "event":
          const eventRes = await generateEventScript(
            event.grade,
            event.theme,
            event.instructions,
            event.budget,
            event.checklist,
            "", // evaluation placeholder
            store.selectedModel
          );
          if (eventRes.success && eventRes.data) {
            store.updateEventField('result', eventRes.data);
            store.setSuccess("ÄÃ£ táº¡o ká»‹ch báº£n ngoáº¡i khÃ³a thÃ nh cÃ´ng!");
          } else {
            if (eventRes.content) {
              await copyToClipboard(eventRes.content);
              store.setSuccess("âš ï¸ ÄÃ£ COPY PROMPT ngoáº¡i khÃ³a. HÃ£y dÃ¡n vÃ o AI Ä‘á»ƒ táº¡o!");
              return;
            }
            throw new Error(eventRes.error);
          }
          break;
        case "ncbh":
          const ncbhRes = await generateNCBHAction(
            ncbh.grade,
            ncbh.topic,
            ncbh.instructions,
            store.selectedModel
          );
          if (ncbhRes.success && ncbhRes.data) {
            store.updateNcbhField('result', ncbhRes.data);
            store.setSuccess("ÄÃ£ táº¡o nghiÃªn cá»©u bÃ i há»c thÃ nh cÃ´ng!");
          } else {
            if (ncbhRes.content) {
              await copyToClipboard(ncbhRes.content);
              store.setSuccess("âš ï¸ ÄÃ£ COPY PROMPT NCBH. HÃ£y dÃ¡n vÃ o AI Ä‘á»ƒ táº¡o!");
              return;
            }
            throw new Error(ncbhRes.error);
          }
          break;
        case "assessment":
          const assessRes = await generateAssessmentPlan(
            assessment.grade,
            assessment.term,
            assessment.productType,
            assessment.topic,
            store.selectedModel
          );
          if (assessRes.success && assessRes.data) {
            store.updateAssessmentField('result', assessRes.data);
            store.setSuccess("ÄÃ£ táº¡o káº¿ hoáº¡ch kiá»ƒm tra Ä‘Ã¡nh giÃ¡ thÃ nh cÃ´ng!");
          } else {
            if (assessRes.content) {
              await copyToClipboard(assessRes.content);
              store.setSuccess("âš ï¸ ÄÃ£ COPY PROMPT ÄÃ¡nh giÃ¡. HÃ£y dÃ¡n vÃ o AI Ä‘á»ƒ táº¡o!");
              return;
            }
            throw new Error(assessRes.error);
          }
          break;
        default:
          throw new Error("Unknown mode");
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "ÄÃ£ xáº£y ra lá»—i");
    } finally {
      store.setGeneratingMode(null);
    }
  };

  const handleExport = async (mode: string) => {
    store.setLoading('isExporting', true);
    // Restore the Template Service for "Sample-Based" export
    const { TemplateExportService } = await import("@/lib/services/template-export-service");
    const exportSystem = DocumentExportSystem.getInstance(); // Keep as fallback/alternative for others

    try {
      store.setSuccess("Äang xuáº¥t file dá»±a trÃªn máº«u chuáº©n...");

      let success = false;
      switch (mode) {

        case "lesson":
          if (!lesson.result) throw new Error("ChÆ°a cÃ³ káº¿t quáº£ giÃ¡o Ã¡n Ä‘á»ƒ xuáº¥t");
          success = await TemplateExportService.exportLessonToTemplate(lesson.result);
          break;
        case "meeting":
          if (!meeting.result) throw new Error("ChÆ°a cÃ³ káº¿t quáº£ biÃªn báº£n Ä‘á»ƒ xuáº¥t");
          success = await TemplateExportService.exportMeetingToTemplate(meeting.result);
          break;
        case "event":
          if (!event.result) throw new Error("ChÆ°a cÃ³ káº¿t quáº£ ká»‹ch báº£n Ä‘á»ƒ xuáº¥t");
          success = await TemplateExportService.exportEventToTemplate(event.result);
          break;
        case "ncbh":
          if (!ncbh.result) throw new Error("ChÆ°a cÃ³ káº¿t quáº£ NCBH Ä‘á»ƒ xuáº¥t");
          success = await TemplateExportService.exportNCBHToTemplate(ncbh.result);
          break;
        case "assessment":
          if (!assessment.result) throw new Error("ChÆ°a cÃ³ káº¿t quáº£ Ä‘Ã¡nh giÃ¡ Ä‘á»ƒ xuáº¥t");
          const templateInput = assessment.template?.data || "/templates/mau-ke-hoach-day-hoc.docx";
          // If we have a custom arrayBuffer from upload, docxtemplater needs a different handling, 
          // but for now we follow the template path pattern.
          success = await TemplateExportService.exportAssessmentToTemplate(assessment.result, typeof templateInput === 'string' ? templateInput : undefined);
          break;
        default:
          throw new Error(`Cháº¿ Ä‘á»™ xuáº¥t "${mode}" chÆ°a Ä‘Æ°á»£c há»— trá»£ trong phiÃªn báº£n tinh gá»n.`);
      }

      if (success) {
        store.setSuccess("ÄÃ£ xuáº¥t file Word thÃ nh cÃ´ng!");
      } else {
        throw new Error("QuÃ¡ trÃ¬nh xuáº¥t file gáº·p sá»± cá»‘ ká»¹ thuáº­t.");
      }
    } catch (err) {
      console.error("Export Error:", err);
      store.setError(err instanceof Error ? err.message : "Xuáº¥t file tháº¥t báº¡i");
    } finally {
      store.setLoading('isExporting', false);
    }
  };

  const handleAudit = async () => {
    if (!lesson.result) {
      store.setError("KhÃ´ng cÃ³ dá»¯ liá»‡u giÃ¡o Ã¡n Ä‘á»ƒ kiá»ƒm Ä‘á»‹nh.");
      return;
    }

    store.setLoading('isAuditing', true);
    store.setSuccess("ðŸ” Äang thá»±c hiá»‡n kiá»ƒm Ä‘á»‹nh chuyÃªn sÃ¢u (Pedagogical Audit V5)...");

    try {
      const result = await performAdvancedAudit(lesson.result);
      if (result.success && result.report) {
        const report = result.report;
        store.updateLessonField('auditResult', report.professionalReasoning);
        store.updateLessonField('auditScore', report.overallScore);
        store.setSuccess(`âœ… Kiá»ƒm Ä‘á»‹nh hoÃ n táº¥t! Äiá»ƒm: ${report.overallScore}/100`);
      } else {
        throw new Error(result.error || "Kiá»ƒm Ä‘á»‹nh khÃ´ng thÃ nh cÃ´ng");
      }
    } catch (err) {
      store.setError(err instanceof Error ? err.message : "ÄÃ¡nh giÃ¡ tháº¥t báº¡i");
    } finally {
      store.setLoading('isAuditing', false);
    }
  };

  const handleRefineSection = async (content: string, instruction: string, model?: string): Promise<ActionResult> => {
    store.setGeneratingMode("refine");
    try {
      const prompt = `Báº¡n lÃ  má»™t biÃªn táº­p viÃªn giÃ¡o dá»¥c chuyÃªn nghiá»‡p. HÃ£y chá»‰nh sá»­a ná»™i dung sau Ä‘Ã¢y dá»±a trÃªn yÃªu cáº§u.\n\nNá»˜I DUNG Gá»C:\n${content}\n\nYÃŠU Cáº¦U CHá»ˆNH Sá»¬A: ${instruction}\n\nLÆ°u Ã½: Chá»‰ tráº£ vá» ná»™i dung Ä‘Ã£ chá»‰nh sá»­a, khÃ´ng kÃ¨m lá»i dáº«n.`;
      const res = await generateAIContent(prompt, model || store.selectedModel);
      return res;
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      store.setGeneratingMode(null);
    }
  };

  const handleGenerateSection = async (section: any, context: any, stepInstruction?: string): Promise<ActionResult> => {
    store.setGeneratingMode("section");
    try {
      const effectiveTopic = lesson.theme;
      const result = await generateLessonSection(
        lesson.grade,
        effectiveTopic,
        section,
        typeof context === 'string' ? context : JSON.stringify(context || ""),
        lesson.duration,
        lesson.customInstructions,
        lesson.tasks.filter(t => t.selected).map(t => `${t.name}: ${t.content}`),
        Number(lesson.chuDeSo).toString(),
        JSON.stringify({ shdc: lesson.shdcSuggestion, hdgd: lesson.hdgdSuggestion, shl: lesson.shlSuggestion }),
        store.selectedModel,
        lesson.file || undefined,
        stepInstruction
      );

      if (result.success && result.data) {
        store.setLessonResult({
          ...(lesson.result || {} as any),
          ...result.data
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
      store.updateAssessmentField('template', { name: file.name, data: buffer });
      store.setSuccess(`ÄÃ£ táº£i lÃªn máº«u "${file.name}"`);
    } catch (err: any) {
      store.setError(`Lá»—i táº£i máº«u: ${err.message}`);
    }
  };

  // --- Props for Engines ---
  const meetingEngineProps: MeetingEngineProps = {
    selectedMonth: meeting.month,
    setSelectedMonth: (v) => store.updateMeetingField('month', v),
    selectedSession: meeting.session,
    setSelectedSession: (v) => store.updateMeetingField('session', v),
    meetingKeyContent: meeting.keyContent,
    setMeetingKeyContent: (v) => store.updateMeetingField('keyContent', v),
    meetingConclusion: meeting.conclusion,
    setMeetingConclusion: (v) => store.updateMeetingField('conclusion', v),
    meetingResult: meeting.result,
    setMeetingResult: (v) => store.updateMeetingField('result', v),
    isGenerating: store.generatingMode === "meeting",
    onGenerate: () => handleGenerate("meeting"),
    isExporting: store.isExporting,
    onExport: () => handleExport("meeting"),
    copyToClipboard,
  };

  const lessonEngineProps: LessonEngineProps = {
    lessonGrade: lesson.grade,
    setLessonGrade: store.setLessonGrade,
    selectedChuDeSo: lesson.chuDeSo,
    setSelectedChuDeSo: (v) => store.updateLessonField('chuDeSo', v),
    lessonAutoFilledTheme: lesson.theme,
    setLessonAutoFilledTheme: store.setLessonTheme,
    lessonDuration: lesson.duration,
    setLessonDuration: (v) => store.updateLessonField('duration', v),
    selectedChuDe: null, // Legacy, can be derived or removed if unused
    setSelectedChuDe: () => { },
    setLessonMonth: (v) => store.updateLessonField('month', v),
    shdcSuggestion: lesson.shdcSuggestion,
    setShdcSuggestion: (v) => store.updateLessonField('shdcSuggestion', v),
    hdgdSuggestion: lesson.hdgdSuggestion,
    setHdgdSuggestion: (v) => store.updateLessonField('hdgdSuggestion', v),
    shlSuggestion: lesson.shlSuggestion,
    setShlSuggestion: (v) => store.updateLessonField('shlSuggestion', v),
    curriculumTasks: [],
    distributeTimeForTasks,
    showCurriculumTasks: false,
    setShowCurriculumTasks: () => { },
    lessonTasks: lesson.tasks,
    updateLessonTask: (id, field, value) => {
      store.updateLessonField('tasks', lesson.tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
    },
    removeLessonTask: (id) => {
      store.updateLessonField('tasks', lesson.tasks.filter(t => t.id !== id));
    },
    addLessonTask: () => {
      const newTask: LessonTask = { id: Date.now().toString(), name: "Task má»›i", content: "" };
      store.updateLessonField('tasks', [...lesson.tasks, newTask]);
    },
    lessonCustomInstructions: lesson.customInstructions,
    setLessonCustomInstructions: (v) => store.updateLessonField('customInstructions', v),
    lessonResult: lesson.result,
    setLessonResult: store.setLessonResult,
    isGenerating: store.generatingMode === "lesson" || store.generatingMode === "section" || store.generatingMode === "refine",
    onGenerate: () => handleGenerate("lesson"),
    isExporting: store.isExporting,
    onExport: () => handleExport("lesson"),
    copyToClipboard,
    isAuditing: store.isAuditing,
    onAudit: handleAudit,
    auditResult: lesson.auditResult,
    auditScore: lesson.auditScore,
    setSuccess: store.setSuccess,
    setError: store.setError,
    success: store.success,
    error: store.error,
    lessonTopic: lesson.theme,
    setLessonTopic: store.setLessonTheme,
    selectedModel: store.selectedModel,
    setSelectedModel: store.setSelectedModel,
    lessonFile: lesson.file,
    setLessonFile: (v) => store.updateLessonField('file', v),
    onRefineSection: handleRefineSection,
    onGenerateSection: handleGenerateSection,
    lessonFullPlanMode: true,
    setLessonFullPlanMode: () => { },
  };

  const eventEngineProps: EventEngineProps = {
    selectedGradeEvent: event.grade,
    setSelectedGradeEvent: (v) => store.updateEventField('grade', v),
    selectedEventMonth: event.month,
    setSelectedEventMonth: (v) => store.updateEventField('month', v),
    autoFilledTheme: event.theme,
    setAutoFilledTheme: (v) => store.updateEventField('theme', v),
    eventType: "chuyÃªn Ä‘á»", // default
    setEventType: () => { },
    eventBudget: event.budget,
    setEventBudget: (v) => store.updateEventField('budget', v),
    eventChecklist: event.checklist,
    setEventChecklist: (v) => store.updateEventField('checklist', v),
    eventEvaluation: "",
    setEventEvaluation: () => { },
    eventResult: event.result,
    setEventResult: (v) => store.updateEventField('result', v),
    isGenerating: store.generatingMode === "event",
    onGenerate: () => handleGenerate("event"),
    isExporting: store.isExporting,
    onExport: () => handleExport("event"),
    copyToClipboard,
    eventCustomInstructions: event.instructions,
    setEventCustomInstructions: (v) => store.updateEventField('instructions', v),
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trá»£ lÃ½ cho Tráº§n Tháº¡ch - TrÆ°á»ng THPT BÃ¹i Thá»‹ XuÃ¢n - MÅ©i NÃ© - LÃ¢m Äá»“ng
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Há»‡ thá»‘ng AI há»— trá»£ táº¡o Káº¿ hoáº¡ch bÃ i há»c chuáº©n 5512, nghiÃªn cá»©u bÃ i há»c chuyÃªn sÃ¢u, káº¿ hoáº¡ch ngoáº¡i khÃ³a cháº¥t lÆ°á»£ng vÃ  káº¿ hoáº¡ch Ä‘Ã¡nh giÃ¡ khoa há»c!
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
                <span className="hidden sm:inline">BÃ i dáº¡y</span>
                <span className="sm:hidden">KHBD</span>
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Ngoáº¡i khÃ³a</span>
                <span className="sm:hidden">HÄNK</span>
              </TabsTrigger>
              <TabsTrigger
                value="meeting"
                className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">BiÃªn báº£n</span>
                <span className="sm:hidden">Há»p</span>
              </TabsTrigger>
              <TabsTrigger
                value="ncbh"
                className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">NC BÃ i há»c</span>
                <span className="sm:hidden">NCBH</span>
              </TabsTrigger>
              <TabsTrigger
                value="assessment"
                className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">ÄÃ¡nh giÃ¡</span>
                <span className="sm:hidden">ÄG</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">LÆ°u trá»¯</span>
                <span className="sm:hidden">Kho</span>
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/test-keys', '_blank')}
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
              selectedMonth={ncbh.month}
              setSelectedMonth={(v) => store.updateNcbhField('month', v)}
              ncbhGrade={ncbh.grade}
              setNcbhGrade={(v) => store.updateNcbhField('grade', v)}
              ncbhTopic={ncbh.topic}
              setNcbhTopic={(v) => store.updateNcbhField('topic', v)}
              ncbhCustomInstructions={ncbh.instructions}
              setNcbhCustomInstructions={(v) => store.updateNcbhField('instructions', v)}
              ncbhResult={ncbh.result}
              setNcbhResult={(v) => store.updateNcbhField('result', v)}
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
              assessmentGrade={assessment.grade}
              setAssessmentGrade={(v) => store.updateAssessmentField('grade', v)}
              assessmentTerm={assessment.term}
              setAssessmentTerm={(v) => store.updateAssessmentField('term', v)}
              assessmentProductType={assessment.productType}
              setAssessmentProductType={(v) => store.updateAssessmentField('productType', v)}
              assessmentTopic={assessment.topic}
              setAssessmentTopic={(v) => store.updateAssessmentField('topic', v)}
              assessmentTemplate={assessment.template}
              onTemplateUpload={onTemplateUpload}
              assessmentResult={assessment.result}
              isGenerating={store.generatingMode === "assessment"}
              onGenerate={() => handleGenerate("assessment")}
              isExporting={store.isExporting}
              onExport={() => handleExport("assessment")}
            />
          </TabsContent>

          <TabsContent value="history">
            <TemplateManager open={templateManagerOpen} onOpenChange={setTemplateManagerOpen} />
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
