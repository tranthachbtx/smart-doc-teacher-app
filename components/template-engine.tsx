"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { checkApiKeyStatus } from "@/lib/actions/gemini";
import {
  saveTemplate,
  getTemplate,
  getEffectiveTemplate,
  savePPCT,
  getPPCT,
  type PPCTItem,
  saveProject,
  getAllProjects,
  deleteProject,
  type ProjectHistory,
  type TemplateType,
} from "@/lib/template-storage";
import { useTemplateGeneration } from "@/hooks/use-template-generation";
import { ExportService } from "@/lib/services/export-service";
import type {
  MeetingResult,
  LessonResult,
  EventResult,
  LessonTask,
  TemplateData,
} from "@/lib/types";
import {
  ACADEMIC_MONTHS,
  getThemeForMonth,
  getThemeDetails,
} from "@/lib/hdtn-curriculum";
import { DEPT_INFO } from "@/lib/config/department";
import TemplateManager from "@/components/template-manager";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Import curriculum related functions and types
import { getPPCTTheoKhoi, type PPCTChuDe } from "@/lib/data/ppct-database";
import { getCurriculumTasksByTopic } from "@/lib/data/kntt-activities-database";
import {
  getChuDeTheoThang,
  timChuDeTheoTen,
} from "@/lib/data/kntt-curriculum-database";

// Types imported from @/lib/types

const TemplateEngine = () => {
  // Mode state
  const [activeMode, setActiveMode] = useState<TemplateType | "history">("meeting");

  // Meeting state
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("1");
  const [meetingKeyContent, setMeetingKeyContent] = useState<string>("");
  const [meetingTemplate, setMeetingTemplate] = useState<TemplateData | null>(
    null
  );
  const [meetingResult, setMeetingResult] = useState<MeetingResult | null>(
    null
  );
  const [meetingConclusion, setMeetingConclusion] = useState("");

  // Lesson state
  const [lessonGrade, setLessonGrade] = useState<string>("10"); // Default to "10"
  const [lessonTopic, setLessonTopic] = useState<string>("");
  const [selectedChuDeSo, setSelectedChuDeSo] = useState<string>("");
  const [lessonMonth, setLessonMonth] = useState<string>("");
  const [lessonAutoFilledTheme, setLessonAutoFilledTheme] = useState("");
  const [lessonReviewMode, setLessonReviewMode] = useState<boolean>(false);
  const [lessonFullPlanMode, setLessonFullPlanMode] = useState<boolean>(true); // Default to true
  const [lessonDuration, setLessonDuration] = useState("9");
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);
  const lessonFileRef = useRef<HTMLInputElement>(null);
  const [lessonTemplate, setLessonTemplate] = useState<TemplateData | null>(
    null
  ); // Added missing state
  const [lessonCustomInstructions, setLessonCustomInstructions] =
    useState<string>("");
  const [lessonTasks, setLessonTasks] = useState<LessonTask[]>([]);

  const [curriculumTasks, setCurriculumTasks] = useState<LessonTask[]>([]);
  const [showCurriculumTasks, setShowCurriculumTasks] = useState(true);
  const [taskTimeDistribution, setTaskTimeDistribution] = useState<
    Record<string, number>
  >({});

  // Event state
  const [selectedGradeEvent, setSelectedGradeEvent] = useState<string>("");
  const [selectedEventMonth, setSelectedEventMonth] = useState<string>("");
  const [autoFilledTheme, setAutoFilledTheme] = useState<string>("");
  const [eventTemplate, setEventTemplate] = useState<TemplateData | null>(null);
  const [eventResult, setEventResult] = useState<EventResult | null>(null);
  const [eventCustomInstructions, setEventCustomInstructions] =
    useState<string>("");
  const [eventBudget, setEventBudget] = useState("");
  const [eventChecklist, setEventChecklist] = useState("");
  const [eventEvaluation, setEventEvaluation] = useState("");

  // Library/History state
  const [projects, setProjects] = useState<ProjectHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  // Common state
  const { isGenerating, error, setError, generateMeeting, generateLesson, generateEvent, auditLesson } =
    useTemplateGeneration();
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(
    null
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false); // Updated state name to match the update

  const [shdcSuggestion, setShdcSuggestion] = useState("");
  const [hdgdSuggestion, setHdgdSuggestion] = useState("");
  const [shlSuggestion, setShlSuggestion] = useState("");

  // PPCT state
  const [ppctData, setPpctData] = useState<PPCTItem[]>([]);
  const [showPPCTDialog, setShowPPCTDialog] = useState(false);
  const [newPPCTItem, setNewPPCTItem] = useState<PPCTItem>({
    month: "",
    theme: "",
    periods: 2,
    activities: [],
  });
  const [selectedChuDe, setSelectedChuDe] = useState<PPCTChuDe | null>(null);

  // PPCT file upload state
  const ppctFileRef = useRef<HTMLInputElement>(null);
  const [ppctFileName, setPpctFileName] = useState<string | null>(null);

  // File refs
  const meetingFileRef = useRef<HTMLInputElement>(null);
  const eventFileRef = useRef<HTMLInputElement>(null);

  // Default templates state
  const [hasDefaultMeetingTemplate, setHasDefaultMeetingTemplate] =
    useState(false);
  const [hasDefaultEventTemplate, setHasDefaultEventTemplate] = useState(false);
  const [hasDefaultLessonTemplate, setHasDefaultLessonTemplate] =
    useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const result = await checkApiKeyStatus();
      setApiKeyConfigured(result.configured);
    };
    checkApiKey();
  }, []);

  // Load templates from IndexedDB
  useEffect(() => {
    const loadTemplates = async () => {
      const meeting = await getTemplate("meeting");
      const event = await getTemplate("event");
      const lesson = await getTemplate("lesson");
      const defaultMeeting = await getTemplate("default_meeting");
      const defaultEvent = await getTemplate("default_event");
      const defaultLesson = await getTemplate("default_lesson");

      if (meeting)
        setMeetingTemplate({ name: meeting.name, data: meeting.data });
      if (event) setEventTemplate({ name: event.name, data: event.data });
      if (lesson) setLessonTemplate({ name: lesson.name, data: lesson.data });

      setHasDefaultMeetingTemplate(!!defaultMeeting);
      setHasDefaultEventTemplate(!!defaultEvent);
      if (defaultLesson) setHasDefaultLessonTemplate(true);
    };
    loadTemplates();
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const allProjects = await getAllProjects();
    setProjects(allProjects);
  };

  // Auto-fill theme when grade and month are selected (Lesson)
  useEffect(() => {
    if (lessonGrade && lessonMonth) {
      const theme = getThemeForMonth(lessonGrade, lessonMonth);
      setLessonAutoFilledTheme(theme || "");
    } else {
      setLessonAutoFilledTheme("");
    }
  }, [lessonGrade, lessonMonth]);

  // Auto-fill theme when grade and month are selected (Event)
  useEffect(() => {
    if (selectedGradeEvent && selectedEventMonth) {
      const theme = getThemeForMonth(selectedGradeEvent, selectedEventMonth);
      setAutoFilledTheme(theme || "");
    } else {
      setAutoFilledTheme("");
    }
  }, [selectedGradeEvent, selectedEventMonth]);

  // Auto-fill theme when grade and chu de change
  useEffect(() => {
    if (lessonGrade && selectedChuDeSo) {
      const chuDeList = getChuDeListByKhoi(lessonGrade);
      const chuDeSo = Number.parseInt(selectedChuDeSo) || 1;
      const chuDe = chuDeList.find((cd) => cd.chu_de_so === chuDeSo);

      if (chuDe) {
        setLessonAutoFilledTheme(chuDe.ten);
        setLessonDuration(chuDe.tong_tiet.toString());
        setSelectedChuDe(chuDe);
      }
    } else {
      setLessonAutoFilledTheme("");
      setSelectedChuDe(null);
    }
  }, [lessonGrade, selectedChuDeSo]);

  useEffect(() => {
    if (lessonGrade && selectedChuDeSo) {
      // Map chu de to month for curriculum tasks
      setLessonMonth(selectedChuDeSo);
    }
  }, [lessonGrade, selectedChuDeSo]);

  useEffect(() => {
    if (lessonGrade) {
      const loadPPCT = async () => {
        const ppct = await getPPCT(lessonGrade);
        if (ppct) {
          setPpctData(ppct);
        } else {
          setPpctData([]);
        }
      };
      loadPPCT();
    }
  }, [lessonGrade]);

  // Sửa đổi logic để lấy task từ kntt-curriculum-database chi tiết
  useEffect(() => {
    // Use selectedChuDe directly if available, or try based on month
    if (lessonGrade && (selectedChuDe || lessonAutoFilledTheme)) {
      const gradeNum = Number.parseInt(lessonGrade) as 10 | 11 | 12;
      const themeName = selectedChuDe?.ten || lessonAutoFilledTheme;

      if (themeName) {
        // Try to get detailed theme data first
        const chuDeDetailed = timChuDeTheoTen(gradeNum, themeName);

        let allTasks: LessonTask[] = [];

        if (chuDeDetailed && chuDeDetailed.hoat_dong) {
          // If we found the detailed structure from `kntt-curriculum-database.ts`
          let taskIndex = 0;
          chuDeDetailed.hoat_dong.forEach((hd) => {
            // Add each activity's tasks
            if (hd.nhiem_vu && hd.nhiem_vu.length > 0) {
              hd.nhiem_vu.forEach((nv) => {
                let timeVal = 0;
                if (nv.thoi_luong_de_xuat) {
                  const match = nv.thoi_luong_de_xuat.match(/(\d+)/);
                  if (match) timeVal = Number.parseInt(match[1]);
                }

                allTasks.push({
                  id: `curriculum-nv-${taskIndex++}`,
                  name: nv.ten,
                  content: nv.mo_ta || "",
                  source: "curriculum",
                  kyNangCanDat: nv.ky_nang_can_dat || [],
                  sanPhamDuKien: nv.san_pham_du_kien || "",
                  thoiLuongDeXuat: nv.thoi_luong_de_xuat || "",
                  selected: true,
                  time: timeVal > 0 ? timeVal : undefined,
                });
              });
            } else {
              // Fallback if activity has no sub-tasks, treat activity itself as a task
              allTasks.push({
                id: `curriculum-hd-${taskIndex++}`,
                name: hd.ten,
                content: hd.mo_ta || "",
                source: "curriculum",
                selected: true,
              });
            }
          });
        } else {
          // Fallback to old activities database if not found in detailed one
          const curriculumTasksFromDB = getCurriculumTasksByTopic(
            gradeNum,
            themeName
          );
          allTasks = (curriculumTasksFromDB || []).map((task, index) => {
            return {
              id: `curriculum-${index}`,
              name: task.ten,
              content: task.mo_ta || "",
              source: "curriculum",
              selected: true,
            };
          });
        }

        setCurriculumTasks(allTasks);
      } else {
        setCurriculumTasks([]);
      }
    } else {
      setCurriculumTasks([]);
    }
  }, [lessonGrade, lessonMonth, lessonAutoFilledTheme, selectedChuDe]);

  useEffect(() => {
    if (lessonGrade && lessonMonth) {
      const ppctItem = ppctData.find((item) => item.month === lessonMonth);

      // Start with curriculum tasks
      const mergedTasks: LessonTask[] = [...curriculumTasks];

      // Add PPCT tasks if available (avoid duplicates by name)
      if (ppctItem?.tasks && ppctItem.tasks.length > 0) {
        ppctItem.tasks.forEach((ppctTask) => {
          const exists = mergedTasks.some(
            (t) =>
              t.name.toLowerCase().trim() === ppctTask.name.toLowerCase().trim()
          );
          if (!exists) {
            mergedTasks.push({
              id: `ppct-${Date.now()}-${Math.random()}`,
              name: ppctTask.name,
              content: ppctTask.description || "",
              source: "ppct",
              selected: true, // Default to selected
              time: 15, // Default time for PPCT tasks
            });
          }
        });
      }

      // Keep user-added tasks (source: 'user')
      const userTasks = lessonTasks.filter((t) => t.source === "user");
      userTasks.forEach((userTask) => {
        const exists = mergedTasks.some(
          (t) =>
            t.name.toLowerCase().trim() === userTask.name.toLowerCase().trim()
        );
        if (!exists) {
          mergedTasks.push(userTask);
        }
      });

      setLessonTasks(mergedTasks);
    } else {
      // Clear tasks if grade or month is not selected
      setLessonTasks([]);
    }
  }, [lessonGrade, lessonMonth, ppctData, curriculumTasks]); // Removed lessonTasks from dependency array, as it's the state being set

  // Handle template upload
  const handleTemplateUpload = async (file: File, type: TemplateType) => {
    try {
      const buffer = await file.arrayBuffer();
      await saveTemplate(type, file.name, buffer);
      const templateData = { name: file.name, data: buffer };

      if (type === "meeting") {
        setMeetingTemplate(templateData);
        setHasDefaultMeetingTemplate(false); // User uploaded a new template
      } else if (type === "event") {
        setEventTemplate(templateData);
        setHasDefaultEventTemplate(false); // User uploaded a new template
      } else if (type === "lesson") {
        setLessonTemplate(templateData);
        setHasDefaultLessonTemplate(false); // User uploaded a new template
      }

      setSuccess(`Đã tải mẫu "${file.name}" thành công!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(`Lỗi tải mẫu: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle meeting generation
  const handleGenerateMeeting = async () => {
    if (!selectedMonth) {
      setError("Vui lòng chọn tháng");
      return;
    }

    const result = await generateMeeting(
      selectedMonth,
      selectedSession,
      meetingKeyContent,
      meetingConclusion
    );

    if (result.success && result.data) {
      setMeetingResult(result.data);
      setSuccess("Đã tạo biên bản họp thành công!");

      // Auto-save to history
      await saveProject({
        id: `meeting_${Date.now()}`,
        type: "meeting",
        title: `Biên bản họp T${selectedMonth} - Lần ${selectedSession}`,
        data: result.data,
        month: selectedMonth
      });
      loadProjects();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "Lỗi khi tạo biên bản");
    }
  };

  /*
   * Enhanced Time Distribution:
   * 1. Prioritize explicitly set time (if user locked it or previous set).
   * 2. Parse 'thoiLuongDeXuat' from DB if available.
   * 3. Distribute remaining time intelligently.
   */
  const distributeTimeForTasks = useCallback(() => {
    let totalMinutes = 90; // Default
    const periodsMatch = lessonDuration.match(/(\d+)/);
    if (periodsMatch) {
      totalMinutes = Number.parseInt(periodsMatch[1]) * 45;
    }

    // Optimized logic for HĐGD tasks distribution
    let availableTimeForTasks = totalMinutes;
    if (selectedChuDe) {
      // Calculate time strictly for HĐGD
      const hdgdPeriods = selectedChuDe.hdgd || 0;
      if (hdgdPeriods > 0) {
        availableTimeForTasks = hdgdPeriods * 45;
      }
    }

    // Use lessonTasks as the primary source of truth as it contains merged tasks
    const allTasks = lessonTasks.filter((t) => t.selected);

    if (allTasks.length === 0) {
      setTaskTimeDistribution({});
      return;
    }

    const distribution: Record<string, number> = {};
    let usedTime = 0;

    // 1. First pass: Assign time based on DB suggestion (thoiLuongDeXuat)
    const tasksWithSuggestedTime: string[] = [];
    const tasksWithoutSuggestion: string[] = [];

    allTasks.forEach((task) => {
      let allocatedTime = 0;

      // Try to parse thoiLuongDeXuat if available (e.g., "15 phút", "10-15 phút")
      if (task.thoiLuongDeXuat) {
        const timeMatch = task.thoiLuongDeXuat.match(/(\d+)/);
        if (timeMatch) {
          allocatedTime = Number.parseInt(timeMatch[1]);
        }
      }

      if (allocatedTime > 0) {
        distribution[task.id] = allocatedTime;
        usedTime += allocatedTime;
        tasksWithSuggestedTime.push(task.id);
      } else {
        tasksWithoutSuggestion.push(task.id);
      }
    });

    // 2. Adjust if time is tight
    // Use the specific available time for tasks (HĐGD time) instead of total lesson time
    let remainingTime = availableTimeForTasks - usedTime;

    // Only reserve buffer if we are working with raw total minutes (legacy mode),
    // otherwise trust the PPCT HĐGD time is dedicated.
    if (!selectedChuDe) {
      remainingTime -= 10; // Reserve 10 mins purely for buffer/setup if no PPCT structure
    }

    // If we have tasks without suggestion, distribute remaining time to them
    if (tasksWithoutSuggestion.length > 0) {
      if (remainingTime > 0) {
        const timePerTask = Math.floor(
          remainingTime / tasksWithoutSuggestion.length
        );
        tasksWithoutSuggestion.forEach((id) => {
          distribution[id] = Math.max(5, timePerTask); // At least 5 mins
          usedTime += distribution[id];
        });
      } else {
        // No time left, assign minimum 5 mins
        tasksWithoutSuggestion.forEach((id) => {
          distribution[id] = 5;
          usedTime += 5;
        });
      }
    }

    // Update the lessonTasks state with these new times ONLY if they changed
    if (Object.keys(distribution).length > 0) {
      setTaskTimeDistribution(distribution);

      setLessonTasks((prev) => {
        let hasChanged = false;
        const newTasks = prev.map((t) => {
          if (distribution[t.id] !== undefined && distribution[t.id] !== t.time) {
            hasChanged = true;
            return { ...t, time: distribution[t.id] };
          }
          return t;
        });
        return hasChanged ? newTasks : prev;
      });
    }
  }, [lessonDuration, selectedChuDe]);

  useEffect(() => {
    distributeTimeForTasks();
  }, [lessonDuration, selectedChuDe, lessonTasks, distributeTimeForTasks]);

  // Handle lesson plan generation
  const handleGenerateLesson = async () => {
    if (!lessonGrade) {
      setError("Vui lòng chọn khối lớp");
      return;
    }

    const effectiveTopic = lessonTopic || lessonAutoFilledTheme;
    if (!effectiveTopic) {
      setError("Vui lòng chọn chủ đề");
      return;
    }

    // Build custom instructions including tasks
    let fullInstructions = lessonCustomInstructions || "";

    const result = await generateLesson(
      lessonGrade,
      effectiveTopic,
      lessonFullPlanMode,
      lessonDuration,
      fullInstructions,
      lessonTasks,
      ppctData,
      taskTimeDistribution,
      { shdc: shdcSuggestion, hdgd: hdgdSuggestion, shl: shlSuggestion }
    );

    if (result.success && result.data) {
      setLessonResult(result.data);
      setSuccess("Đã tạo kế hoạch dạy học thành công!");

      // Auto-save to history
      await saveProject({
        id: `lesson_${Date.now()}`,
        type: "lesson",
        title: `KHBD: ${lessonTopic || lessonAutoFilledTheme}`,
        data: result.data,
        grade: lessonGrade,
        month: lessonMonth
      });
      loadProjects();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "Lỗi khi tạo nội dung");
    }
  };

  // Handle event script generation
  const handleGenerateEvent = async () => {
    if (!selectedGradeEvent || !selectedEventMonth) {
      setError("Vui lòng chọn khối và tháng");
      return;
    }

    const result = await generateEvent(
      selectedGradeEvent,
      selectedEventMonth,
      autoFilledTheme,
      eventCustomInstructions,
      eventBudget,
      eventChecklist,
      eventEvaluation
    );

    if (result.success && result.data) {
      setEventResult(result.data);
      setSuccess("Đã tạo kịch bản sự kiện thành công!");

      // Auto-save to history
      await saveProject({
        id: `event_${Date.now()}`,
        type: "event",
        title: `Ngoại khóa: ${result.data.ten_chu_de}`,
        data: result.data,
        grade: selectedGradeEvent,
        month: selectedEventMonth
      });
      loadProjects();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "Lỗi khi tạo kịch bản");
    }
  };

  const handleAudit = async () => {
    if (!lessonResult) return;
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const result = await auditLesson(lessonResult, lessonGrade, lessonTopic || lessonAutoFilledTheme);
      if (result.success && "audit" in result && result.audit) {
        setAuditResult(result.audit);
      } else if (result.error) {
        setError(String(result.error));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const loadProjectToWorkbench = (project: ProjectHistory) => {
    setActiveMode(project.type);
    if (project.type === "meeting") {
      setMeetingResult(project.data as MeetingResult);
      if (project.month) setSelectedMonth(project.month);
    } else if (project.type === "lesson") {
      setLessonResult(project.data as LessonResult);
      if (project.grade) setLessonGrade(project.grade);
      if (project.month) setLessonMonth(project.month);
      setLessonTopic(project.title.replace("KHBD: ", ""));
    } else if (project.type === "event") {
      setEventResult(project.data as EventResult);
      if (project.grade) setSelectedGradeEvent(project.grade);
      if (project.month) setSelectedEventMonth(project.month);
    }
    setSuccess(`Đã tải dự án: ${project.title}`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `ngày ${day} tháng ${month} năm ${year}`;
  };

  const getChuDeListByKhoi = (khoi: string): PPCTChuDe[] => {
    const khoiNum = Number.parseInt(khoi);
    const ppct = getPPCTTheoKhoi(khoiNum);
    return ppct?.chu_de || [];
  };

  const getChuDeNumber = (grade: string, month: string): string => {
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
  };

  const getTemplateStatusText = (
    sessionTemplate: TemplateData | null,
    hasDefault: boolean,
    type: string // Not used in current logic, but could be for more advanced statuses
  ) => {
    if (sessionTemplate) {
      return sessionTemplate.name;
    } else if (hasDefault) {
      return "Sử dụng mẫu mặc định";
    } else {
      return "Chưa có mẫu - Nội dung sẽ copy vào clipboard";
    }
  };

  // Helper function to get template button text
  const getTemplateButtonText = (
    sessionTemplate: TemplateData | null,
    hasDefault: boolean
  ) => {
    if (sessionTemplate) return "Đổi mẫu phiên";
    if (hasDefault) return "Dùng mẫu khác";
    return "Tải mẫu lên";
  };

  // Handle export to Word
  const handleExport = async (type: "meeting" | "lesson" | "event") => {
    setIsExporting(true);
    setError(null);

    try {
      let result: { success: boolean; method: "clipboard" | "download" } = {
        success: false,
        method: "clipboard",
      };

      if (type === "meeting") {
        if (!meetingResult) {
          setError("Chưa có nội dung biên bản. Vui lòng tạo nội dung trước.");
          setIsExporting(false);
          return;
        }

        // Use effective template searching (session -> default -> built-in)
        const templateToUse = await getEffectiveTemplate("meeting");

        result = await ExportService.exportMeeting(
          meetingResult,
          templateToUse,
          selectedMonth,
          selectedSession
        );
      } else if (type === "lesson") {
        if (!lessonResult) {
          setError("Chưa có nội dung tích hợp. Vui lòng tạo nội dung trước.");
          setIsExporting(false);
          return;
        }

        const templateToUse = await getEffectiveTemplate("lesson");

        result = await ExportService.exportLesson(lessonResult, templateToUse, {
          grade: lessonGrade,
          topic: lessonTopic || lessonAutoFilledTheme,
          month: lessonMonth,
          duration: lessonFullPlanMode
            ? `${lessonDuration} tiết`
            : lessonDuration,
          fullPlanMode: lessonFullPlanMode,
          reviewMode: lessonReviewMode,
          tasks: lessonTasks,
          ppctData,
          autoFilledTheme: lessonAutoFilledTheme,
          suggestions: {
            shdc: shdcSuggestion,
            hdgd: hdgdSuggestion,
            shl: shlSuggestion,
          },
        });
      } else if (type === "event") {
        if (!eventResult) {
          setError("Chưa có kịch bản ngoại khóa. Vui lòng tạo nội dung trước.");
          setIsExporting(false);
          return;
        }

        const templateToUse = await getEffectiveTemplate("event");

        result = await ExportService.exportEvent(eventResult, templateToUse, {
          grade: selectedGradeEvent,
          month: selectedEventMonth,
          budget: eventBudget,
          checklist: eventChecklist,
          autoFilledTheme: autoFilledTheme,
        });
      }

      if (result.method === "download") {
        setSuccess("Xuất file Word thành công!");
      } else {
        setSuccess(
          "Đã copy nội dung vào Clipboard (do không tìm thấy mẫu Word)"
        );
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Export error:", err);
      setError(`Lỗi xuất file: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Đã copy vào clipboard!");
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError("Không thể copy vào clipboard");
    }
  };

  // Get theme details for display
  const getLessonThemeDetails = () => {
    if (lessonGrade && lessonMonth) {
      return getThemeDetails(lessonGrade, lessonMonth);
    }
    return null;
  };

  const getEventThemeDetails = () => {
    if (selectedGradeEvent && selectedEventMonth) {
      return getThemeDetails(selectedGradeEvent, selectedEventMonth);
    }
    return null;
  };

  const lessonThemeDetails = getLessonThemeDetails();
  const eventThemeDetails = getEventThemeDetails();

  const addLessonTask = () => {
    const newTask: LessonTask = {
      id: `user-${Date.now()}-${Math.random()}`,
      name: `Nhiệm vụ ${lessonTasks.filter((t) => t.source === "user").length + 1
        }`,
      content: "",
      source: "user", // Mark as user-added
      selected: true, // Default to selected
      time: 10, // Default time
    };
    setLessonTasks([...lessonTasks, newTask]);
  };

  const updateLessonTask = (
    id: string,
    field: "name" | "content" | "selected" | "time",
    value: string | boolean | number
  ) => {
    setLessonTasks(
      lessonTasks.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  const removeLessonTask = (id: string) => {
    setLessonTasks(lessonTasks.filter((task) => task.id !== id));
  };

  const handleSavePPCT = async () => {
    if (lessonGrade && ppctData.length > 0) {
      await savePPCT(lessonGrade, ppctData);
      setSuccess("Đã lưu PPCT thành công!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleAddPPCTItem = () => {
    if (newPPCTItem.month && newPPCTItem.theme) {
      // Check if month already exists to avoid duplicates, or merge if necessary
      const existingIndex = ppctData.findIndex(
        (item) => item.month === newPPCTItem.month
      );
      if (existingIndex > -1) {
        // Update existing item
        const updatedData = [...ppctData];
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          ...newPPCTItem,
        };
        setPpctData(updatedData);
      } else {
        // Add new item
        setPpctData([...ppctData, newPPCTItem]);
      }
      setNewPPCTItem({ month: "", theme: "", periods: 2, activities: [] }); // Reset form
      setShowPPCTDialog(false); // Close dialog after adding
    } else {
      setError("Vui lòng nhập đủ Tháng và Chủ đề");
    }
  };

  const handleRemovePPCTItem = (index: number) => {
    setPpctData(ppctData.filter((_, i) => i !== index));
  };

  const handleDownloadPPCTTemplate = async () => {
    try {
      const XLSX = await import("xlsx");

      // Create workbook
      const wb = XLSX.utils.book_new();

      const gradeNum = lessonGrade ? Number.parseInt(lessonGrade) : 10;
      const ppctGradeData = getPPCTTheoKhoi(gradeNum);

      if (!ppctGradeData) {
        setError("Không tìm thấy dữ liệu PPCT cho khối đã chọn");
        return;
      }

      const header = [
        "Tháng",
        "Tên chủ đề",
        "Số tiết",
        "Danh sách Hoạt động",
        "Nhiệm vụ 1",
        "Nhiệm vụ 2",
        "Nhiệm vụ 3",
        "Nhiệm vụ 4",
        "Nhiệm vụ 5",
        "Nhiệm vụ 6",
        "Ghi chú",
      ];

      const dataRows = ppctGradeData.chu_de.map((cd) => {
        // Map chu_de_so to month
        const monthMap: Record<number, string> = {
          1: "9", 2: "10", 3: "11", 4: "12", 5: "1", 6: "2", 7: "3", 8: "4", 9: "5", 10: "5", 11: "5"
        };
        const month = monthMap[cd.chu_de_so] || cd.chu_de_so.toString();

        // Get detailed curriculum data for tasks
        const detailedTheme = timChuDeTheoTen(gradeNum, cd.ten);
        const taskNames: string[] = ["", "", "", "", "", ""];
        let activitiesList = cd.hoat_dong || [];

        if (detailedTheme && detailedTheme.hoat_dong) {
          // Prefer activities from detailed database if available
          activitiesList = detailedTheme.hoat_dong.map(hd => hd.ten);

          let taskIdx = 0;
          detailedTheme.hoat_dong.forEach(hd => {
            if (hd.nhiem_vu) {
              hd.nhiem_vu.forEach(nv => {
                if (taskIdx < 6) {
                  taskNames[taskIdx] = nv.ten;
                  taskIdx++;
                }
              });
            }
          });
        }

        return [
          month,
          cd.ten,
          cd.tong_tiet,
          activitiesList.join("\n"),
          ...taskNames,
          cd.ghi_chu || "",
        ];
      });

      const wsData = [
        ["PHÂN PHỐI CHƯƠNG TRÌNH - HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP"],
        [`KHỐI: ${gradeNum}`],
        [""],
        header,
        ...dataRows
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Set column widths
      ws["!cols"] = [
        { wch: 10 }, // Tháng
        { wch: 40 }, // Tên chủ đề
        { wch: 10 }, // Số tiết
        { wch: 60 }, // Hoạt động
        { wch: 30 }, // NV1
        { wch: 30 }, // NV2
        { wch: 30 }, // NV3
        { wch: 30 }, // NV4
        { wch: 30 }, // NV5
        { wch: 30 }, // NV6
        { wch: 20 }, // Ghi chú
      ];

      XLSX.utils.book_append_sheet(wb, ws, `PPCT_Khoi_${gradeNum}`);

      // Generate and download
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PPCT_Khoi_${gradeNum}_Update.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess("Đã tạo và tải file PPCT chi tiết thành công!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error creating PPCT template:", err);
      setError("Lỗi tạo PPCT. Vui lòng thử lại.");
    }
  };

  const parsePPCTFromText = (text: string): PPCTItem[] => {
    const items: PPCTItem[] = [];
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Check if CSV format (from Excel)
    const isCSV = lines.some((line) => line.includes(","));

    if (isCSV) {
      // Parse CSV format from Excel
      for (const line of lines) {
        const cols = line
          .split(",")
          .map((col) => col.trim().replace(/^"|"$/g, ""));

        // Skip header rows and empty rows
        if (
          !cols[0] ||
          isNaN(Number(cols[0])) ||
          cols[0].toLowerCase().includes("tháng")
        )
          continue;

        const month = cols[0];
        const theme = cols[1] || "";
        const periods = Number(cols[2]) || 2;

        // Extract activities from column 3
        const activities = cols[3] ? cols[3].split("\n").map(a => a.trim()).filter(a => a.length > 0) : undefined;

        // Extract tasks from columns 4-9 (NV 1-6)
        const tasks: { name: string; description: string }[] = [];
        for (let i = 4; i <= 9; i++) {
          if (cols[i] && cols[i].trim()) {
            tasks.push({
              name: `Nhiệm vụ ${i - 3}`,
              description: cols[i].trim(),
            });
          }
        }

        const notes = cols[10] || "";

        // Only accept months 1-12
        if (Number(month) >= 1 && Number(month) <= 12 && theme) {
          items.push({
            month,
            theme,
            periods,
            notes,
            activities,
            tasks: tasks.length > 0 ? tasks : undefined,
          });
        }
      }
    } else {
      // Original text parsing
      const monthPattern =
        /(?:tháng\s*)?(\d{1,2})[\s:|\-–]+(.+?)(?:[\s\-–|]+(\d+)\s*tiết)?$/i;

      for (const line of lines) {
        const match = line.match(monthPattern);
        if (match) {
          const month = match[1];
          const theme = match[2].replace(/[-–|]+\s*\d+\s*tiết.*/i, "").trim();
          const periodsMatch = line.match(/(\d+)\s*tiết/i);
          const periods = periodsMatch ? Number.parseInt(periodsMatch[1]) : 2;

          if (Number.parseInt(month) >= 1 && Number(month) <= 12 && theme) {
            items.push({
              month,
              theme,
              periods,
              notes: "",
            });
          }
        }
      }
    }

    return items;
  };

  // Handle uploading PPCT file
  const handleUploadPPCTFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPpctFileName(file.name);

    try {
      let text = "";

      if (file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
        // Plain text or CSV
        text = await file.text();
      } else if (file.name.endsWith(".docx")) {
        // Word document - use mammoth
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Excel - use xlsx library
        const XLSX = await import("xlsx");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        text = XLSX.utils.sheet_to_csv(sheet);
      } else {
        setError(
          "Định dạng file không được hỗ trợ. Vui lòng dùng .txt, .csv, .docx, .xlsx"
        );
        return;
      }

      const parsedItems = parsePPCTFromText(text);

      if (parsedItems.length > 0) {
        setPpctData(parsedItems);
        setSuccess(
          `Đã đọc ${parsedItems.length} mục PPCT từ file "${file.name}"`
        );
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(
          "Không tìm thấy dữ liệu PPCT hợp lệ. Vui lòng kiểm tra định dạng file."
        );
      }
    } catch (err) {
      console.error("Error parsing PPCT file:", err);
      setError("Lỗi đọc file PPCT. Vui lòng kiểm tra định dạng.");
    }

    // Reset input
    if (ppctFileRef.current) ppctFileRef.current.value = "";
  };

  const updateTaskTime = (taskId: string, minutes: number) => {
    setTaskTimeDistribution((prev) => ({
      ...prev,
      [taskId]: Math.max(0, minutes),
    }));
  };

  const totalDistributedTime = Object.values(taskTimeDistribution).reduce(
    (sum, t) => sum + t,
    0
  );
  const totalAvailableTime = Number.parseInt(lessonDuration) * 45;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-slate-700">Trợ lí cho Trần Thạch - THTP Bùi Thị Xuân - Mũi Né</h1>
          </div>
        </div>
      </header>

      {/* API Key Warning */}
      {apiKeyConfigured === false && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="container mx-auto flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Chưa cấu hình GEMINI_API_KEY. Vui lòng thêm vào{" "}
              <strong>Vars</strong> trong sidebar để sử dụng AI.
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <Tabs
          value={activeMode}
          onValueChange={(v) => setActiveMode(v as TemplateType)}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-white shadow-md rounded-xl p-1">
              <TabsTrigger
                value="meeting"
                className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Biên bản</span>
                <span className="sm:hidden">Họp</span>
              </TabsTrigger>
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
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Ngoại khóa</span>
                <span className="sm:hidden">NK</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="gap-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Archive className="w-4 h-4" />
                <span className="hidden sm:inline">Thư viện</span>
                <span className="sm:hidden">Kho</span>
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="bg-white border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-300 h-10 px-4 rounded-xl whitespace-nowrap"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt mẫu
            </Button>
          </div>

          {/* Meeting Tab */}
          <TabsContent value="meeting">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                {/* Removed template upload section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Tháng</Label>
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tháng..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ACADEMIC_MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lần họp</Label>
                    <Select
                      value={selectedSession}
                      onValueChange={setSelectedSession}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Lần 1 (đầu tháng)</SelectItem>
                        <SelectItem value="2">Lần 2 (cuối tháng)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Theme Info */}
                {selectedMonth && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      Chủ đề tháng {selectedMonth}:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>
                        • Khối 10:{" "}
                        {getThemeForMonth("10", selectedMonth) || "N/A"}
                      </li>
                      <li>
                        • Khối 11:{" "}
                        {getThemeForMonth("11", selectedMonth) || "N/A"}
                      </li>
                      <li>
                        • Khối 12:{" "}
                        {getThemeForMonth("12", selectedMonth) || "N/A"}
                      </li>
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Nội dung trọng tâm (tùy chọn)</Label>
                  <Textarea
                    placeholder="VD: Triển khai hoạt động 20/11, tổ chức sinh hoạt chuyên môn theo nghiên cứu bài học, phân công giáo viên dự giờ, thảo luận về phương pháp dạy học tích cực..."
                    value={meetingKeyContent}
                    onChange={(e) => setMeetingKeyContent(e.target.value)}
                    rows={5}
                    className="resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập các nội dung trọng tâm cần thảo luận trong cuộc họp. AI
                    sẽ phân tích và tạo biên bản chi tiết dựa trên nội dung này.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Kết luận cuộc họp (tùy chọn)</Label>
                  <Textarea
                    placeholder="Nhập nội dung kết luận cuộc họp nếu có sẵn..."
                    value={meetingConclusion}
                    onChange={(e) => setMeetingConclusion(e.target.value)}
                    rows={5}
                    className="resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Nếu bạn có sẵn nội dung kết luận, hãy nhập vào đây. AI sẽ
                    tham khảo để tạo biên bản phù hợp.
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateMeeting}
                  disabled={isGenerating || !selectedMonth}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang tạo biên bản...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Tạo Biên bản AI
                    </>
                  )}
                </Button>

                {/* Results */}
                {meetingResult && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold text-lg text-slate-800">
                      Kết quả tạo biên bản:
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">
                            Nội dung chính:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(meetingResult.noi_dung_chinh)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.noi_dung_chinh}
                          onChange={(e) =>
                            setMeetingResult({
                              ...meetingResult,
                              noi_dung_chinh: e.target.value,
                            })
                          }
                          className="min-h-[150px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-orange-700 font-medium">
                            Ưu điểm:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(meetingResult.uu_diem)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.uu_diem}
                          onChange={(e) =>
                            setMeetingResult({
                              ...meetingResult,
                              uu_diem: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-red-700 font-medium">
                            Hạn chế:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(meetingResult.han_che)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.han_che}
                          onChange={(e) =>
                            setMeetingResult({
                              ...meetingResult,
                              han_che: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">
                            Ý kiến đóng góp:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(meetingResult.y_kien_dong_gop)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.y_kien_dong_gop}
                          onChange={(e) =>
                            setMeetingResult({
                              ...meetingResult,
                              y_kien_dong_gop: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">
                            Kế hoạch tháng tới:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(meetingResult.ke_hoach_thang_toi)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.ke_hoach_thang_toi}
                          onChange={(e) =>
                            setMeetingResult({
                              ...meetingResult,
                              ke_hoach_thang_toi: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                      </div>

                      {meetingResult.ket_luan_cuoc_hop && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium text-purple-700">
                              Kết luận cuộc họp
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  meetingResult.ket_luan_cuoc_hop || ""
                                )
                              }
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={meetingResult.ket_luan_cuoc_hop || ""}
                            onChange={(e) =>
                              setMeetingResult({
                                ...meetingResult,
                                ket_luan_cuoc_hop: e.target.value,
                              })
                            }
                            rows={4}
                            className="bg-purple-50"
                          />
                        </div>
                      )}
                    </div>

                    {/* Export Button */}
                    <Button
                      onClick={() => handleExport("meeting")}
                      disabled={isExporting}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white gap-2"
                      size="lg"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang xuất file...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Xuất file Word
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lesson Tab */}
          <TabsContent value="lesson" className="space-y-4">
            <Card>
              <CardContent className="space-y-4">
                {/* Grade and Topic selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Khối</Label>
                    <Select
                      value={lessonGrade}
                      onValueChange={(value) => {
                        setLessonGrade(value);
                        setSelectedChuDeSo(""); // Reset chu de when grade changes
                        setLessonAutoFilledTheme("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khối..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Khối 10</SelectItem>
                        <SelectItem value="11">Khối 11</SelectItem>
                        <SelectItem value="12">Khối 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chọn Chủ Đề</Label>
                    <Select
                      value={selectedChuDeSo}
                      onValueChange={(value) => {
                        setSelectedChuDeSo(value);
                        const chuDeList = getChuDeListByKhoi(lessonGrade);
                        const chuDe = chuDeList.find(
                          (cd) => cd.chu_de_so === Number.parseInt(value)
                        );
                        if (chuDe) {
                          setLessonAutoFilledTheme(chuDe.ten);
                          setLessonDuration(chuDe.tong_tiet.toString());
                          setSelectedChuDe(chuDe);
                          // Map chu de to month for curriculum tasks
                          setLessonMonth(value);
                        }
                      }}
                      disabled={!lessonGrade}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            lessonGrade ? "Chọn chủ đề..." : "Chọn khối trước"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {lessonGrade &&
                          getChuDeListByKhoi(lessonGrade).map((chuDe) => (
                            <SelectItem
                              key={chuDe.chu_de_so}
                              value={chuDe.chu_de_so.toString()}
                            >
                              CĐ{chuDe.chu_de_so}: {chuDe.ten} (
                              {chuDe.tong_tiet} tiết)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* PPCT Management Section */}
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="w-full text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                    <ListOrdered className="w-3 h-3" /> Quản lý Phân phối Chương trình (PPCT)
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200 h-8 text-xs"
                    onClick={handleDownloadPPCTTemplate}
                    disabled={!lessonGrade}
                  >
                    <Download className="w-3 h-3 mr-1" /> Xuất PPCT chi tiết (Excel)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-green-50 text-green-600 border-green-200 h-8 text-xs"
                    onClick={() => ppctFileRef.current?.click()}
                    disabled={!lessonGrade}
                  >
                    <Upload className="w-3 h-3 mr-1" /> Nhập PPCT từ file
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-indigo-50 text-indigo-600 border-indigo-200 h-8 text-xs"
                    onClick={() => setShowPPCTDialog(true)}
                    disabled={!lessonGrade}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Thêm mục
                  </Button>
                  <input
                    type="file"
                    ref={ppctFileRef}
                    onChange={handleUploadPPCTFile}
                    className="hidden"
                    accept=".xlsx,.xls,.docx,.txt,.csv"
                  />
                  {ppctData.length > 0 && (
                    <div className="w-full mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-500 mb-2">
                        Đang sử dụng {ppctData.length} mục PPCT cho khối {lessonGrade}.
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 ml-2 text-[10px] text-red-500"
                          onClick={() => { if (confirm('Xóa toàn bộ PPCT hiện tại?')) setPpctData([]) }}
                        >
                          Xóa hết
                        </Button>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {ppctData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white dark:bg-slate-800 rounded border border-slate-100 group">
                            <div className="truncate flex-1">
                              <span className="font-bold text-blue-600 mr-2">T{item.month}</span>
                              {item.theme}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                              onClick={() => handleRemovePPCTItem(idx)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto-filled theme display with PPCT info */}
                {selectedChuDe && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Chủ đề {selectedChuDe.chu_de_so}:{" "}
                          {lessonAutoFilledTheme}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          PPCT: {selectedChuDe.tong_tiet} tiết (SHDC:{" "}
                          {selectedChuDe.shdc}, HĐGD: {selectedChuDe.hdgd}, SHL:{" "}
                          {selectedChuDe.shl})
                          {selectedChuDe.tuan_bat_dau &&
                            selectedChuDe.tuan_ket_thuc && (
                              <span>
                                {" "}
                                • Tuần {selectedChuDe.tuan_bat_dau}-
                                {selectedChuDe.tuan_ket_thuc}
                              </span>
                            )}
                        </p>
                        {selectedChuDe.ghi_chu && (
                          <p className="text-xs text-blue-500 italic">
                            {selectedChuDe.ghi_chu}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson topic input */}
                <div className="space-y-2">
                  <Label>
                    Tên bài học cụ thể (tùy chọn nếu đã chọn chủ đề)
                  </Label>
                  <Input
                    placeholder="VD: Thể hiện phẩm chất tốt đẹp của người học sinh..."
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                  />
                </div>

                {/* Full plan mode toggle */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Chế độ KHBD đầy đủ</Label>
                    <p className="text-xs text-muted-foreground">
                      Tạo toàn bộ KHBD thay vì chỉ nội dung tích hợp
                    </p>
                  </div>
                  <Switch
                    checked={lessonFullPlanMode}
                    onCheckedChange={setLessonFullPlanMode}
                  />
                </div>

                {/* Duration selection - only show in full plan mode */}
                {lessonFullPlanMode && (
                  <div className="space-y-2">
                    <Label>Số tiết</Label>
                    <Select
                      value={lessonDuration}
                      onValueChange={setLessonDuration}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedChuDe?.tong_tiet ? (
                          Array.from(
                            { length: selectedChuDe.tong_tiet },
                            (_, i) => i + 1
                          ).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} tiết ({Math.ceil(num / 3)} tuần)
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="3">3 tiết (1 tuần)</SelectItem>
                            <SelectItem value="6">6 tiết (2 tuần)</SelectItem>
                            <SelectItem value="9">9 tiết (3 tuần)</SelectItem>
                            <SelectItem value="12">12 tiết (4 tuần)</SelectItem>
                            <SelectItem value="15">15 tiết (5 tuần)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {lessonGrade && selectedChuDeSo && (
                      <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        <div>
                          <strong>Tổng thời gian:</strong> {totalAvailableTime} phút (
                          {lessonDuration} tiết x 45 phút)
                        </div>
                        {selectedChuDe && (
                          <div className="text-indigo-600 bg-indigo-50 p-2 rounded-md border border-indigo-100">
                            <div className="font-semibold mb-1">
                              Phân bổ chuẩn PPCT:
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-[10px]">
                              <div>
                                <span className="block font-medium">HĐGD</span>
                                {selectedChuDe.hdgd} tiết (
                                {selectedChuDe.hdgd * 45}p)
                              </div>
                              <div>
                                <span className="block font-medium">SHDC</span>
                                {selectedChuDe.shdc} tiết (
                                {selectedChuDe.shdc * 45}p)
                              </div>
                              <div>
                                <span className="block font-medium">SHL</span>
                                {selectedChuDe.shl} tiết (
                                {selectedChuDe.shl * 45}p)
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {curriculumTasks.length > 0 && (
                      <div className="mt-2">
                        {(() => {
                          const maxTaskTime = selectedChuDe
                            ? selectedChuDe.hdgd * 45
                            : totalAvailableTime;
                          const isOver = totalDistributedTime > maxTaskTime;

                          return (
                            <div
                              className={`text-xs font-medium ${isOver ? "text-red-500" : "text-green-600"
                                }`}
                            >
                              Đã phân bổ cho nhiệm vụ (HĐGD): {totalDistributedTime}/{maxTaskTime}{" "}
                              phút
                              {isOver && " (Vượt quá!)"}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {lessonFullPlanMode && (
                  <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-indigo-600" />
                      <Label className="text-indigo-800 dark:text-indigo-200 font-medium">
                        Gợi ý nội dung theo loại hoạt động (tùy chọn)
                      </Label>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      Nhập gợi ý cụ thể để AI tạo nội dung chuyên sâu hơn cho
                      từng loại hoạt động
                    </p>

                    <div className="space-y-3">
                      {/* SHDC Suggestion */}
                      <div className="space-y-1">
                        <Label className="text-sm text-indigo-700 dark:text-indigo-300">
                          Sinh hoạt dưới cờ (SHDC)
                        </Label>
                        <Textarea
                          placeholder="VD: Tổ chức diễn đàn về ý nghĩa truyền thống nhà trường, mời cựu HS chia sẻ..."
                          value={shdcSuggestion}
                          onChange={(e) => setShdcSuggestion(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                      </div>

                      {/* HDGD Suggestion */}
                      <div className="space-y-1">
                        <Label className="text-sm text-indigo-700 dark:text-indigo-300">
                          Hoạt động giáo dục (HĐGD)
                        </Label>
                        <Textarea
                          placeholder="VD: Thảo luận nhóm về các giá trị cốt lõi, đóng vai tình huống thực tế..."
                          value={hdgdSuggestion}
                          onChange={(e) => setHdgdSuggestion(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                      </div>

                      {/* SHL Suggestion */}
                      <div className="space-y-1">
                        <Label className="text-sm text-indigo-700 dark:text-indigo-300">
                          Sinh hoạt lớp (SHL)
                        </Label>
                        <Textarea
                          placeholder="VD: Chia sẻ cảm nhận cá nhân, lập kế hoạch hành động, đánh giá lẫn nhau..."
                          value={shlSuggestion}
                          onChange={(e) => setShlSuggestion(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {curriculumTasks.length > 0 && (
                  <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-600" />
                        <Label className="text-green-800 dark:text-green-200 font-medium">
                          Nhiệm vụ gợi ý từ SGK (
                          {curriculumTasks.filter((t) => t.selected).length} /{" "}
                          {curriculumTasks.length} nhiệm vụ đã chọn)
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={distributeTimeForTasks}
                          className="text-green-700 hover:text-green-800 text-xs bg-transparent"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Phân bổ lại
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowCurriculumTasks(!showCurriculumTasks)
                          }
                          className="text-green-700 hover:text-green-800"
                        >
                          {showCurriculumTasks ? "Ẩn" : "Hiện"}
                        </Button>
                      </div>
                    </div>

                    {showCurriculumTasks && (
                      <div className="space-y-3">
                        {lessonTasks.filter(t => t.source !== 'user').map((task) => (
                          <div
                            key={task.id}
                            className="p-3 bg-white dark:bg-green-900 rounded-md border border-green-300 dark:border-green-700"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={task.selected || false}
                                    onCheckedChange={(checked) =>
                                      updateLessonTask(
                                        task.id,
                                        "selected",
                                        checked
                                      )
                                    }
                                    className="data-[state=checked]:bg-green-500"
                                  />
                                  <Input
                                    value={task.name}
                                    onChange={(e) =>
                                      updateLessonTask(
                                        task.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className="h-7 text-sm font-medium text-green-800 dark:text-green-200 border-none bg-transparent focus:ring-0 px-0"
                                  />
                                </div>
                                <Textarea
                                  value={task.content}
                                  onChange={(e) =>
                                    updateLessonTask(
                                      task.id,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm text-gray-600 dark:text-gray-300 min-h-[60px] resize-y bg-transparent border-gray-200"
                                />

                                {task.thoiLuongDeXuat && (
                                  <p className="text-xs text-orange-600 italic">
                                    * Thời lượng đề xuất từ SGK:{" "}
                                    {task.thoiLuongDeXuat}
                                  </p>
                                )}

                                {/* Skills, products, duration */}
                                <div className="flex flex-wrap gap-2 text-xs">
                                  {task.kyNangCanDat &&
                                    task.kyNangCanDat.length > 0 && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        Kỹ năng: {task.kyNangCanDat.join(", ")}
                                      </span>
                                    )}
                                  {task.sanPhamDuKien && (
                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                      Sản phẩm: {task.sanPhamDuKien}
                                    </span>
                                  )}
                                  <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                    <Clock className="h-3 w-3" />
                                    <input
                                      type="number"
                                      min="0"
                                      max="999"
                                      value={task.time || 0}
                                      onChange={(e) =>
                                        updateLessonTask(
                                          task.id,
                                          "time",
                                          Number.parseInt(e.target.value) || 0
                                        )
                                      }
                                      className="w-12 bg-transparent border-none text-center text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-400 rounded disabled:opacity-50"
                                      disabled={!task.selected}
                                    />
                                    <span>phút</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <p className="text-xs text-green-600 italic">
                          * Các nhiệm vụ này được trích xuất từ cơ sở dữ liệu
                          SGK "Kết nối Tri thức" và sẽ được AI sử dụng khi tạo
                          KHBD. Bạn có thể chọn nhiệm vụ, chỉnh sửa thời gian
                          hoặc thêm nhiệm vụ tùy chỉnh.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* User-added tasks */}
                {lessonTasks.filter((t) => t.source === "user").length > 0 && (
                  <div className="space-y-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-yellow-600" />
                      <Label className="text-yellow-800 dark:text-yellow-200 font-medium">
                        Nhiệm vụ bạn thêm (
                        {lessonTasks.filter((t) => t.source === "user").length})
                      </Label>
                    </div>
                    <div className="space-y-2">
                      {lessonTasks
                        .filter((t) => t.source === "user")
                        .map((task, index) => (
                          <div
                            key={task.id}
                            className="flex items-start gap-2 p-2 bg-white dark:bg-yellow-900 rounded border"
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={task.selected || false}
                                  onCheckedChange={(checked) =>
                                    updateLessonTask(task.id, "selected", checked)
                                  }
                                  className="data-[state=checked]:bg-yellow-500"
                                />
                                <Input
                                  value={task.name}
                                  onChange={(e) =>
                                    updateLessonTask(task.id, "name", e.target.value)
                                  }
                                  placeholder="Tên nhiệm vụ"
                                  className="text-sm font-medium"
                                />
                              </div>
                              <Textarea
                                value={task.content}
                                onChange={(e) =>
                                  updateLessonTask(task.id, "content", e.target.value)
                                }
                                placeholder="Mô tả nhiệm vụ"
                                rows={2}
                                className="text-sm bg-transparent"
                              />
                              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded w-fit">
                                <Clock className="h-3 w-3" />
                                <input
                                  type="number"
                                  min="0"
                                  value={task.time || 0}
                                  onChange={(e) =>
                                    updateLessonTask(
                                      task.id,
                                      "time",
                                      Number.parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-10 bg-transparent border-none text-center text-xs font-medium focus:outline-none"
                                />
                                <span className="text-[10px]">phút</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLessonTask(task.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Add task button */}
                <Button
                  variant="outline"
                  onClick={addLessonTask}
                  className="w-full border-dashed bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm nhiệm vụ tùy chỉnh
                </Button>

                {/* Custom instructions */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chỉ dẫn thêm cho AI (tùy chọn)
                  </Label>
                  <Textarea
                    placeholder="VD: Tập trung vào kỹ năng giao tiếp, sử dụng nhiều hoạt động nhóm, tích hợp video minh họa..."
                    value={lessonCustomInstructions}
                    onChange={(e) =>
                      setLessonCustomInstructions(e.target.value)
                    }
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    AI sẽ cập nhật nội dung dựa trên chỉ dẫn của bạn
                  </p>
                </div>

                {/* Generate button */}
                <Button
                  className="w-full"
                  onClick={handleGenerateLesson}
                  disabled={
                    isGenerating ||
                    !lessonGrade ||
                    (!lessonTopic && !lessonAutoFilledTheme) ||
                    !selectedChuDeSo
                  }
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {lessonFullPlanMode
                        ? "Tạo KHBD đầy đủ"
                        : "Tạo nội dung tích hợp"}
                    </>
                  )}
                </Button>

                {/* Results display */}
                {lessonResult && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">
                        Kết quả tạo nội dung - Chỉnh sửa trước khi xuất file
                      </span>
                    </div>

                    {/* Integration results - editable */}
                    {lessonResult.tich_hop_nls && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">
                            Tích hợp Năng lực số (NLS):
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(lessonResult.tich_hop_nls)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.tich_hop_nls}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              tich_hop_nls: e.target.value,
                            })
                          }
                          className="min-h-[120px] bg-blue-50"
                        />
                      </div>
                    )}

                    {lessonResult.tich_hop_dao_duc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Tích hợp Giáo dục đạo đức:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(lessonResult.tich_hop_dao_duc)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.tich_hop_dao_duc}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              tich_hop_dao_duc: e.target.value,
                            })
                          }
                          className="min-h-[120px] bg-purple-50"
                        />
                      </div>
                    )}

                    {/* Full plan results - editable */}
                    {lessonFullPlanMode && lessonResult.muc_tieu_kien_thuc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">
                            Mục tiêu kiến thức:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.muc_tieu_kien_thuc || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.muc_tieu_kien_thuc || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              muc_tieu_kien_thuc: e.target.value,
                            })
                          }
                          className="min-h-[100px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.muc_tieu_nang_luc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">
                            Mục tiêu năng lực:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.muc_tieu_nang_luc || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.muc_tieu_nang_luc || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              muc_tieu_nang_luc: e.target.value,
                            })
                          }
                          className="min-h-[100px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.muc_tieu_pham_chat && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">
                            Mục tiêu phẩm chất:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.muc_tieu_pham_chat || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.muc_tieu_pham_chat || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              muc_tieu_pham_chat: e.target.value,
                            })
                          }
                          className="min-h-[100px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.thiet_bi_day_hoc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">
                            Thiết bị dạy học & Học liệu:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.thiet_bi_day_hoc || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.thiet_bi_day_hoc || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              thiet_bi_day_hoc: e.target.value,
                            })
                          }
                          className="min-h-[80px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.shdc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-indigo-700 font-medium">
                            Sinh hoạt dưới cờ (SHDC):
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(lessonResult.shdc || "")
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.shdc || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              shdc: e.target.value,
                            })
                          }
                          className="min-h-[150px] bg-indigo-50 border-indigo-100"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.shl && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-indigo-700 font-medium">
                            Sinh hoạt lớp (SHL):
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(lessonResult.shl || "")
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.shl || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              shl: e.target.value,
                            })
                          }
                          className="min-h-[150px] bg-indigo-50 border-indigo-100"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_khoi_dong && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-green-700 font-medium">
                            Hoạt động Khởi động:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.hoat_dong_khoi_dong || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_khoi_dong || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              hoat_dong_khoi_dong: e.target.value,
                            })
                          }
                          className="min-h-[150px] bg-green-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_kham_pha && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-yellow-700 font-medium">
                            Hoạt động Khám phá:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.hoat_dong_kham_pha || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_kham_pha || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              hoat_dong_kham_pha: e.target.value,
                            })
                          }
                          className="min-h-[200px] bg-yellow-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_luyen_tap && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-orange-700 font-medium">
                            Hoạt động Luyện tập:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.hoat_dong_luyen_tap || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_luyen_tap || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              hoat_dong_luyen_tap: e.target.value,
                            })
                          }
                          className="min-h-[150px] bg-orange-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_van_dung && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-red-700 font-medium">
                            Hoạt động Vận dụng:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                lessonResult.hoat_dong_van_dung || ""
                              )
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_van_dung || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              hoat_dong_van_dung: e.target.value,
                            })
                          }
                          className="min-h-[150px] bg-red-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.ho_so_day_hoc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">
                            Hồ sơ dạy học:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(lessonResult.ho_so_day_hoc || "")
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.ho_so_day_hoc || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              ho_so_day_hoc: e.target.value,
                            })
                          }
                          className="min-h-[80px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.huong_dan_ve_nha && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium font-bold">
                            Hướng dẫn về nhà & Chuẩn bị bài sau:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(lessonResult.huong_dan_ve_nha || "")
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.huong_dan_ve_nha || ""}
                          onChange={(e) =>
                            setLessonResult({
                              ...lessonResult,
                              huong_dan_ve_nha: e.target.value,
                            })
                          }
                          className="min-h-[100px] bg-blue-50 border-blue-200"
                        />
                      </div>
                    )}

                    {/* Copy, Audit and Export buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="bg-white border-slate-200 h-11 px-6 rounded-xl shadow-sm text-slate-600 hover:text-blue-600"
                        onClick={() => {
                          const content = lessonFullPlanMode
                            ? `TÊN BÀI: ${lessonResult.ten_bai || lessonTopic
                            }\n\nMỤC TIÊU KIẾN THỨC:\n${lessonResult.muc_tieu_kien_thuc
                            }\n\nMỤC TIÊU NĂNG LỰC:\n${lessonResult.muc_tieu_nang_luc
                            }\n\nMỤC TIÊU PHẨM CHẤT:\n${lessonResult.muc_tieu_pham_chat
                            }\n\nTHIẾT BỊ DẠY HỌC & HỌC LIỆU:\n${lessonResult.thiet_bi_day_hoc
                            }\n\nSINH HOẠT DƯỚI CỜ:\n${lessonResult.shdc
                            }\n\nSINH HOẠT LỚP:\n${lessonResult.shl
                            }\n\nHOẠT ĐỘNG KHỞI ĐỘNG:\n${lessonResult.hoat_dong_khoi_dong
                            }\n\nHOẠT ĐỘNG KHÁM PHÁ:\n${lessonResult.hoat_dong_kham_pha
                            }\n\nHOẠT ĐỘNG LUYỆN TẬP:\n${lessonResult.hoat_dong_luyen_tap
                            }\n\nHOẠT ĐỘNG VẬN DỤNG:\n${lessonResult.hoat_dong_van_dung
                            }\n\nHƯỚNG DẪN VỀ NHÀ:\n${lessonResult.huong_dan_ve_nha
                            }\n\nTÍCH HỢP NLS:\n${lessonResult.tich_hop_nls
                            }\n\nTÍCH HỢP ĐẠO ĐỨC:\n${lessonResult.tich_hop_dao_duc
                            }`
                            : `TÍCH HỢP NLS:\n${lessonResult.tich_hop_nls}\n\nTÍCH HỢP ĐẠO ĐỨC:\n${lessonResult.tich_hop_dao_duc}`;
                          navigator.clipboard.writeText(content);
                          setSuccess("Đã copy vào clipboard!");
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy nội dung
                      </Button>

                      <Button
                        variant="ghost"
                        className="bg-indigo-50 border-indigo-100 h-11 px-6 rounded-xl shadow-sm text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30"
                        onClick={handleAudit}
                        disabled={isAuditing}
                      >
                        {isAuditing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Kiểm định bài dạy (AI Check)
                      </Button>

                      <Button
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 px-6 rounded-xl shadow-md gap-2 ml-auto"
                        onClick={() => handleExport("lesson")}
                      >
                        <Download className="h-4 w-4" />
                        Xuất file Word
                      </Button>
                    </div>

                    {/* Audit Result Display */}
                    {auditResult && (
                      <div className="mt-6 p-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-2xl border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                            <Sparkles className="w-5 h-5" />
                            <h4 className="font-bold">Kết quả Kiểm định Sư phạm</h4>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 text-indigo-400 hover:text-indigo-600"
                            onClick={() => setAuditResult(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {auditResult}
                        </div>
                        <div className="mt-4 pt-4 border-t border-indigo-100 dark:border-indigo-800 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-indigo-600 border-indigo-200"
                            onClick={() => {
                              copyToClipboard(auditResult);
                              setSuccess("Đã copy bản kiểm định!");
                            }}
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            Copy bản kiểm định
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Tab */}
          <TabsContent value="event">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Khối</Label>
                    <Select
                      value={selectedGradeEvent}
                      onValueChange={setSelectedGradeEvent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khối..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Khối 10</SelectItem>
                        <SelectItem value="11">Khối 11</SelectItem>
                        <SelectItem value="12">Khối 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Chọn Tháng</Label>
                    <Select
                      value={selectedEventMonth}
                      onValueChange={setSelectedEventMonth}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tháng..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ACADEMIC_MONTHS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Auto-filled Theme */}
                {autoFilledTheme && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-800 mb-2">
                      Chủ đề từ SGK:
                    </p>
                    <p className="text-purple-700 font-semibold">
                      {autoFilledTheme}
                    </p>
                    {eventThemeDetails && (
                      <div className="mt-3 space-y-2 text-sm text-purple-700">
                        <p>
                          <strong>Mục tiêu:</strong>{" "}
                          {eventThemeDetails.objectives.join("; ")}
                        </p>
                        <p>
                          <strong>Hoạt động gợi ý:</strong>{" "}
                          {eventThemeDetails.activities.join(", ")}
                        </p>
                        <p>
                          <strong>Kỹ năng:</strong>{" "}
                          {eventThemeDetails.skills.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Dự toán kinh phí (tùy chọn)</Label>
                  <Textarea
                    placeholder="Nhập dự toán kinh phí nếu cần...&#10;VD: Banner: 500.000đ, Phần thưởng: 1.000.000đ..."
                    value={eventBudget}
                    onChange={(e) => setEventBudget(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    AI sẽ cố gắng bám sát dự toán bạn cung cấp để xây dựng kế
                    hoạch.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Checklist chuẩn bị (tùy chọn)</Label>
                  <Textarea
                    placeholder="Nhập danh sách cần chuẩn bị...&#10;VD: Âm thanh, ánh sáng, phông nền, quà tặng..."
                    value={eventChecklist}
                    onChange={(e) => setEventChecklist(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    AI sẽ sử dụng checklist này để làm gợi ý cho phần chuẩn bị.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    Chỉ dẫn thêm cho AI (tùy chọn)
                  </Label>
                  <Textarea
                    placeholder="Nhập yêu cầu bổ sung cho AI, ví dụ: Thêm kịch ngắn về chủ đề gia đình, có mini game Kahoot, mời cựu học sinh chia sẻ..."
                    value={eventCustomInstructions}
                    onChange={(e) => setEventCustomInstructions(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    AI sẽ cập nhật nội dung dựa trên chỉ dẫn của bạn
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateEvent}
                  disabled={
                    isGenerating || !selectedGradeEvent || !selectedEventMonth
                  }
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang tạo kịch bản...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Tạo Kịch bản Ngoại khóa AI
                    </>
                  )}
                </Button>

                {/* Results */}
                {eventResult && (
                  <div className="space-y-4 mt-6">
                    <h3 className="font-semibold text-lg text-slate-800">
                      Kết quả kịch bản ngoại khóa:
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Tên chủ đề:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(eventResult.ten_chu_de)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={eventResult.ten_chu_de}
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              ten_chu_de: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Mục đích yêu cầu:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(eventResult.muc_dich_yeu_cau)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.muc_dich_yeu_cau}
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              muc_dich_yeu_cau: e.target.value,
                            })
                          }
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Kịch bản chi tiết:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(eventResult.kich_ban_chi_tiet)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.kich_ban_chi_tiet}
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              kich_ban_chi_tiet: e.target.value,
                            })
                          }
                          className="min-h-[300px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Thông điệp kết thúc:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(eventResult.thong_diep_ket_thuc)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.thong_diep_ket_thuc}
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              thong_diep_ket_thuc: e.target.value,
                            })
                          }
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Năng lực:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(eventResult.nang_luc)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.nang_luc}
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              nang_luc: e.target.value,
                            })
                          }
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">
                            Phẩm chất:
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(eventResult.pham_chat)
                            }
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.pham_chat}
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              pham_chat: e.target.value,
                            })
                          }
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-amber-700">
                          Dự toán kinh phí
                        </Label>
                        <Textarea
                          value={
                            eventResult.du_toan_kinh_phi ||
                            eventBudget ||
                            "Không có"
                          }
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              du_toan_kinh_phi: e.target.value,
                            })
                          }
                          rows={3}
                          className="bg-amber-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-cyan-700">
                          Checklist chuẩn bị
                        </Label>
                        <Textarea
                          value={
                            eventResult.checklist_chuan_bi ||
                            eventChecklist ||
                            ""
                          }
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              checklist_chuan_bi: e.target.value,
                            })
                          }
                          rows={4}
                          className="bg-cyan-50"
                          placeholder="- Chuẩn bị âm thanh, ánh sáng&#10;- In ấn tài liệu&#10;- Liên hệ khách mời..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-rose-700">
                          Mẫu đánh giá sau hoạt động
                        </Label>
                        <Textarea
                          value={
                            eventResult.danh_gia_sau_hoat_dong ||
                            `1. Mức độ hoàn thành mục tiêu: __/10\n2. Sự tham gia của học sinh: __/10\n3. Công tác tổ chức: __/10\n4. Bài học kinh nghiệm:\n5. Đề xuất cải tiến:`
                          }
                          onChange={(e) =>
                            setEventResult({
                              ...eventResult,
                              danh_gia_sau_hoat_dong: e.target.value,
                            })
                          }
                          rows={6}
                          className="bg-rose-50"
                        />
                      </div>
                    </div>

                    {/* Export Button */}
                    <Button
                      onClick={() => handleExport("event")}
                      disabled={isExporting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2"
                      size="lg"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang xuất file...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Xuất file Word
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* History / Library Tab */}
          <TabsContent value="history">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardContent className="p-6 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm dự án (tên bài, tháng, loại)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects
                    .filter(p =>
                      !searchQuery ||
                      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.type.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((project) => (
                      <div
                        key={project.id}
                        className="group relative p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2 rounded-lg ${project.type === 'meeting' ? 'bg-blue-50 text-blue-600' :
                            project.type === 'lesson' ? 'bg-green-50 text-green-600' :
                              'bg-purple-50 text-purple-600'
                            }`}>
                            {project.type === 'meeting' ? <FileText className="w-4 h-4" /> :
                              project.type === 'lesson' ? <BookOpen className="w-4 h-4" /> :
                                <Calendar className="w-4 h-4" />}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-300 hover:text-red-500 h-8 w-8"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm('Bạn có chắc muốn xóa dự án này?')) {
                                await deleteProject(project.id);
                                loadProjects();
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-amber-700">
                          {project.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                            {project.type === 'meeting' ? 'Họp Tổ' :
                              project.type === 'lesson' ? 'Bài dạy' : 'Sự kiện'}
                          </span>
                          {project.grade && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                              Lớp {project.grade}
                            </span>
                          )}
                          {project.month && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-600 rounded">
                              Tháng {project.month}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1 h-7"
                            onClick={() => loadProjectToWorkbench(project)}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Mở lại
                          </Button>
                        </div>
                      </div>
                    ))}

                  {projects.length === 0 && (
                    <div className="col-span-full py-20 text-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Archive className="w-8 h-8 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-500">Thư viện trống</p>
                        <p className="text-sm text-slate-400">Các nội dung bạn tạo sẽ tự động được lưu tại đây.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Template Manager Dialog */}
      <TemplateManager
        open={showSettings}
        onOpenChange={setShowSettings}
        onTemplateSelect={(template, type) => {
          if (type === "meeting") setMeetingTemplate(template);
          else if (type === "lesson") setLessonTemplate(template);
          else if (type === "event") setEventTemplate(template);
        }}
        defaultTemplateStatus={{
          meeting: hasDefaultMeetingTemplate,
          lesson: hasDefaultLessonTemplate,
          event: hasDefaultEventTemplate,
        }}
      />

      <Dialog open={showPPCTDialog} onOpenChange={setShowPPCTDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm Phân phốiChương trình</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tháng</Label>
              <Select
                value={newPPCTItem.month}
                onValueChange={(v) =>
                  setNewPPCTItem({ ...newPPCTItem, month: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {["9", "10", "11", "12", "1", "2", "3", "4", "5"].map((m) => (
                    <SelectItem key={m} value={m}>
                      Tháng {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Chủ đề / Nội dung</Label>
              <Input
                placeholder="VD: Thể hiện phẩm chất tốt đẹp của người học sinh"
                value={newPPCTItem.theme}
                onChange={(e) =>
                  setNewPPCTItem({ ...newPPCTItem, theme: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Số tiết</Label>
              <Select
                value={newPPCTItem.periods.toString()}
                onValueChange={(v) =>
                  setNewPPCTItem({
                    ...newPPCTItem,
                    periods: Number.parseInt(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} tiết
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Danh sách Hoạt động (mỗi dòng một hoạt động)</Label>
              <Textarea
                placeholder="VD: Tìm hiểu nội quy trường lớp&#10;Tìm hiểu truyền thống nhà trường"
                value={newPPCTItem.activities?.join("\n") || ""}
                onChange={(e) =>
                  setNewPPCTItem({
                    ...newPPCTItem,
                    activities: e.target.value.split("\n").filter(a => a.trim() !== ""),
                  })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú (tùy chọn)</Label>
              <Input
                placeholder="VD: Kết hợp với chào mừng 20/11"
                value={newPPCTItem.notes || ""}
                onChange={(e) =>
                  setNewPPCTItem({ ...newPPCTItem, notes: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPPCTDialog(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  handleAddPPCTItem();
                }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateEngine;
