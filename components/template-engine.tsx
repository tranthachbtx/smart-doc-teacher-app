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
import { checkApiKeyStatus, generateAssessmentPlan } from "@/lib/actions/gemini";
import { ASSESSMENT_PRODUCT_TYPES } from "@/lib/prompts/assessment-prompts";
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
import { MeetingTab } from "@/components/template-engine/MeetingTab";
import { LessonTab } from "@/components/template-engine/LessonTab";
import { EventTab } from "@/components/template-engine/EventTab";
import { AssessmentTab } from "@/components/template-engine/AssessmentTab";

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

  // Assessment state
  const [assessmentGrade, setAssessmentGrade] = useState("10");
  const [assessmentTerm, setAssessmentTerm] = useState("Giữa kì 1");
  const [assessmentProductType, setAssessmentProductType] = useState("");
  const [assessmentTopic, setAssessmentTopic] = useState("");
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [assessmentTemplate, setAssessmentTemplate] = useState<TemplateData | null>(null);

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
      const assessment = await getTemplate("assessment"); // Load assessment session template

      const defaultMeeting = await getTemplate("default_meeting");
      const defaultEvent = await getTemplate("default_event");
      const defaultLesson = await getTemplate("default_lesson");
      const defaultAssessment = await getTemplate("default_assessment"); // Load default assessment template

      if (meeting)
        setMeetingTemplate({ name: meeting.name, data: meeting.data });
      if (event) setEventTemplate({ name: event.name, data: event.data });
      if (lesson) setLessonTemplate({ name: lesson.name, data: lesson.data });
      if (assessment) setAssessmentTemplate({ name: assessment.name, data: assessment.data });
      else if (defaultAssessment) setAssessmentTemplate({ name: defaultAssessment.name, data: defaultAssessment.data }); // Fallback to default if no session template

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

  // Auto-fill activity suggestions based on selected chu de
  useEffect(() => {
    if (selectedChuDe && selectedChuDe.hoat_dong && selectedChuDe.hoat_dong.length > 0) {
      const activities = selectedChuDe.hoat_dong;

      // Categorize activities based on keywords
      const shdcActivities: string[] = [];
      const hdgdActivities: string[] = [];
      const shlActivities: string[] = [];

      activities.forEach((activity) => {
        const lowerActivity = activity.toLowerCase();
        if (lowerActivity.includes("tìm hiểu") || lowerActivity.includes("giáo dục") || lowerActivity.includes("diễn đàn") || lowerActivity.includes("xác định")) {
          shdcActivities.push(`• ${activity}`);
        } else if (lowerActivity.includes("thực hiện") || lowerActivity.includes("thực hành") || lowerActivity.includes("thể hiện") || lowerActivity.includes("xây dựng") || lowerActivity.includes("lập")) {
          hdgdActivities.push(`• ${activity}`);
        } else if (lowerActivity.includes("rèn luyện") || lowerActivity.includes("điều chỉnh") || lowerActivity.includes("đánh giá") || lowerActivity.includes("chia sẻ")) {
          shlActivities.push(`• ${activity}`);
        } else {
          // Default: add to HDGD as most activities are educational
          hdgdActivities.push(`• ${activity}`);
        }
      });

      // Always update when chu de changes
      setShdcSuggestion(shdcActivities.join("\n"));
      setHdgdSuggestion(hdgdActivities.join("\n"));
      setShlSuggestion(shlActivities.join("\n"));
    } else {
      // Clear suggestions when no chu de selected
      setShdcSuggestion("");
      setHdgdSuggestion("");
      setShlSuggestion("");
    }
  }, [selectedChuDe]);

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
      } else if (type === "assessment") {
        setAssessmentTemplate(templateData);
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
      { shdc: shdcSuggestion, hdgd: hdgdSuggestion, shl: shlSuggestion },
      selectedChuDe // Pass chu de info for period distribution
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

  const handleGenerateAssessment = async () => {
    if (!assessmentGrade) {
      setError("Vui lòng chọn khối");
      return;
    }
    if (!assessmentProductType) {
      setError("Vui lòng chọn loại sản phẩm");
      return;
    }
    if (!assessmentTopic) {
      setError("Vui lòng nhập chủ đề/nội dung");
      return;
    }

    // Set local loading state if needed, or rely on global isGenerating if wired up
    // For now we assume consistent isGenerating usage or add a local one? 
    // The hook useTemplateGeneration handles generic state, but for this custom func we might need to toggle it manually if not passed through hook.
    // However, looking at hook usage, it wraps main generations. We might extend the hook later.
    // For now, let's just call the action directly and manage state locally or via setError/setSuccess.

    // We'll mimic the pattern:
    try {
      setSuccess("Đang tạo kế hoạch kiểm tra...");
      const result = await generateAssessmentPlan(
        assessmentGrade,
        assessmentTerm,
        assessmentProductType,
        assessmentTopic
      );

      if (result.success && result.data) {
        setAssessmentResult(result.data);
        setSuccess("Đã tạo kế hoạch kiểm tra thành công!");

        // Auto-save
        await saveProject({
          id: `assessment_${Date.now()}`,
          type: "assessment",
          title: `Kiểm tra ${assessmentTerm} - Khối ${assessmentGrade}`,
          data: result.data,
          grade: assessmentGrade
        });
        loadProjects();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Lỗi khi tạo kế hoạch");
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleExportAssessment = async () => {
    setIsExporting(true);
    setError(null);
    try {
      if (!assessmentResult) {
        setError("Chưa có nội dung. Vui lòng tạo trước.");
        setIsExporting(false);
        return;
      }


      // For Assessment, we always create the Word file directly (skip docxtemplater)
      // because auto-generated templates don't work well with docxtemplater
      // and user-uploaded templates may have malformed placeholders
      const result = await ExportService.exportAssessmentPlan(
        assessmentResult,
        null, // Always pass null to force direct file creation
        {
          grade: assessmentGrade,
          term: assessmentTerm,
          productType: assessmentProductType,
          topic: assessmentTopic
        }
      );

      if (result.success) {
        setSuccess(result.method === "download" ? "Đã tải xuống file Word!" : "Đã copy nội dung!");
      } else {
        // Fallback
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError("Lỗi xuất file: " + err.message);
    } finally {
      setIsExporting(false);
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
    } else if (project.type === "assessment") {
      setAssessmentResult(project.data);
      if (project.grade) setAssessmentGrade(project.grade);
      // Try to parse term from title if stored or just let user set it?
      // For now just load generic data
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
            <h1 className="text-base font-semibold text-slate-700">Trợ lí cho Trần Thạch - THTP Bùi Thị Xuân - Mũi Né - Lâm Đồng</h1>
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
            <TabsList className="grid grid-cols-5 w-full bg-white shadow-md rounded-xl p-1">
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
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Ngoại khóa</span>
                <span className="sm:hidden">HĐNK</span>
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
              onClick={() => setShowSettings(true)}
              className="bg-white border-slate-200 shadow-sm text-slate-600 hover:text-blue-600 hover:border-blue-300 h-10 px-4 rounded-xl whitespace-nowrap"
            >
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt
            </Button>
          </div>

          {/* Meeting Tab */}
          <TabsContent value="meeting">
            <MeetingTab
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedSession={selectedSession}
              setSelectedSession={setSelectedSession}
              meetingKeyContent={meetingKeyContent}
              setMeetingKeyContent={setMeetingKeyContent}
              meetingConclusion={meetingConclusion}
              setMeetingConclusion={setMeetingConclusion}
              meetingResult={meetingResult}
              setMeetingResult={setMeetingResult}
              isGenerating={isGenerating}
              onGenerate={handleGenerateMeeting}
              isExporting={isExporting}
              onExport={() => handleExport("meeting")}
              copyToClipboard={copyToClipboard}
            />
          </TabsContent>

          {/* Lesson Tab */}
          <TabsContent value="lesson" className="space-y-4">
            <LessonTab
              lessonGrade={lessonGrade}
              setLessonGrade={setLessonGrade}
              selectedChuDeSo={selectedChuDeSo}
              setSelectedChuDeSo={setSelectedChuDeSo}
              lessonAutoFilledTheme={lessonAutoFilledTheme}
              setLessonAutoFilledTheme={setLessonAutoFilledTheme}
              lessonDuration={lessonDuration}
              setLessonDuration={setLessonDuration}
              selectedChuDe={selectedChuDe}
              setSelectedChuDe={setSelectedChuDe}
              setLessonMonth={setLessonMonth}
              lessonFullPlanMode={lessonFullPlanMode}
              setLessonFullPlanMode={setLessonFullPlanMode}
              shdcSuggestion={shdcSuggestion}
              setShdcSuggestion={setShdcSuggestion}
              hdgdSuggestion={hdgdSuggestion}
              setHdgdSuggestion={setHdgdSuggestion}
              shlSuggestion={shlSuggestion}
              setShlSuggestion={setShlSuggestion}
              curriculumTasks={curriculumTasks}
              distributeTimeForTasks={distributeTimeForTasks}
              showCurriculumTasks={showCurriculumTasks}
              setShowCurriculumTasks={setShowCurriculumTasks}
              lessonTasks={lessonTasks}
              updateLessonTask={updateLessonTask}
              removeLessonTask={removeLessonTask}
              addLessonTask={addLessonTask}
              lessonCustomInstructions={lessonCustomInstructions}
              setLessonCustomInstructions={setLessonCustomInstructions}
              lessonResult={lessonResult}
              setLessonResult={setLessonResult}
              isGenerating={isGenerating}
              onGenerate={handleGenerateLesson}
              isExporting={isExporting}
              onExport={() => handleExport("lesson")}
              copyToClipboard={copyToClipboard}
              isAuditing={isAuditing}
              onAudit={handleAudit}
              auditResult={auditResult}
              setSuccess={setSuccess}
              lessonTopic={lessonTopic}
            />
          </TabsContent>
          <TabsContent value="event">
            <EventTab
              selectedGradeEvent={selectedGradeEvent}
              setSelectedGradeEvent={setSelectedGradeEvent}
              selectedEventMonth={selectedEventMonth}
              setSelectedEventMonth={setSelectedEventMonth}
              autoFilledTheme={autoFilledTheme}
              setAutoFilledTheme={setAutoFilledTheme}
              eventBudget={eventBudget}
              setEventBudget={setEventBudget}
              eventChecklist={eventChecklist}
              setEventChecklist={setEventChecklist}
              eventCustomInstructions={eventCustomInstructions}
              setEventCustomInstructions={setEventCustomInstructions}
              eventResult={eventResult}
              setEventResult={setEventResult}
              isGenerating={isGenerating}
              onGenerate={handleGenerateEvent}
              isExporting={isExporting}
              onExport={() => handleExport("event")}
              copyToClipboard={copyToClipboard}
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
              onTemplateUpload={(file) => handleTemplateUpload(file, "assessment" as any)}
              assessmentResult={assessmentResult}
              isGenerating={isGenerating}
              onGenerate={handleGenerateAssessment}
              isExporting={isExporting}
              onExport={handleExportAssessment}
            />
          </TabsContent>
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
        </Tabs >
      </main >

      {/* Template Manager Dialog */}
      < TemplateManager
        open={showSettings}
        onOpenChange={setShowSettings}
        onTemplateSelect={(template, type) => {
          if (type && type.includes("meeting")) setMeetingTemplate(template);
          else if (type && type.includes("lesson")) setLessonTemplate(template);
          else if (type && type.includes("event")) setEventTemplate(template);
          else if (type && type.includes("assessment")) setAssessmentTemplate(template);
        }}
        defaultTemplateStatus={{
          meeting: hasDefaultMeetingTemplate,
          lesson: hasDefaultLessonTemplate,
          event: hasDefaultEventTemplate,
        }}
      />

      < Dialog open={showPPCTDialog} onOpenChange={setShowPPCTDialog} >
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
      </Dialog >
    </div >
  );
};

export default TemplateEngine;
