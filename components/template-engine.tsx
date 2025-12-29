"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react" // Added List import
import {
  generateMeetingMinutes,
  generateLessonPlan,
  generateEventScript,
  checkApiKeyStatus,
} from "@/lib/actions/gemini"
import { type TemplateType, saveTemplate, getTemplate } from "@/lib/template_storage"
import { ACADEMIC_MONTHS, getThemeForMonth, getThemeDetails } from "@/lib/hdtn-curriculum"
import { DEPT_INFO } from "@/lib/department"
import TemplateManager from "@/components/template-manager"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { savePPCT, getPPCT, type PPCTItem } from "@/lib/template_storage"
// Import curriculum related functions and types
import { getPPCTTheoKhoi, type PPCTChuDe } from "@/lib/ppct-database"
import { getCurriculumTasksByTopic } from "@/lib/kntt-activities-database"
import { getChuDeTheoThang } from "@/lib/kntt-curriculum-database"

// Define TemplateData type
type TemplateData = {
  name: string
  data: ArrayBuffer
}

interface MeetingResult {
  noi_dung_chinh: string
  uu_diem: string
  han_che: string
  y_kien_dong_gop: string
  ke_hoach_thang_toi: string
  // New field
  ket_luan_cuoc_hop?: string
}

interface LessonResult {
  tich_hop_nls: string
  tich_hop_dao_duc: string
  // Full plan fields - Added new fields from template
  ma_chu_de?: string
  ten_bai?: string
  muc_tieu_kien_thuc?: string
  muc_tieu_nang_luc?: string
  muc_tieu_pham_chat?: string
  gv_chuan_bi?: string
  hs_chuan_bi?: string
  thiet_bi_day_hoc?: string
  hoat_dong_duoi_co?: string
  hoat_dong_khoi_dong?: string
  hoat_dong_kham_pha?: string
  hoat_dong_luyen_tap?: string
  hoat_dong_van_dung?: string
  ho_so_day_hoc?: string
  huong_dan_ve_nha?: string
  // Task details
  nhiem_vu?: Array<{
    ten: string
    noi_dung: string
    ky_nang: string
    san_pham: string
    thoi_luong: string
    to_chuc_thuc_hien: {
      chuyen_giao: string
      thuc_hien: string
      bao_cao: string
      ket_luan: string
    }
  }>
  // New fields for suggestions
  shdc_gợi_ý?: string
  hdgd_gợi_ý?: string
  shl_gợi_ý?: string
}

interface LessonTask {
  id: string
  name: string
  content: string
  source?: "curriculum" | "ppct" | "user"
  kyNangCanDat?: string[]
  sanPhamDuKien?: string
  thoiLuongDeXuat?: string
  // Added for selection and time tracking
  selected?: boolean
  time?: number
}

const TemplateEngine = () => {
  // Mode state
  const [activeMode, setActiveMode] = useState<TemplateType>("meeting")

  // Meeting state
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedSession, setSelectedSession] = useState<string>("1")
  const [meetingKeyContent, setMeetingKeyContent] = useState<string>("")
  const [meetingTemplate, setMeetingTemplate] = useState<TemplateData | null>(null)
  const [meetingResult, setMeetingResult] = useState<MeetingResult | null>(null)
  const [meetingConclusion, setMeetingConclusion] = useState("")

  // Lesson state
  const [lessonGrade, setLessonGrade] = useState<string>("10") // Default to "10"
  const [lessonTopic, setLessonTopic] = useState<string>("")
  const [selectedChuDeSo, setSelectedChuDeSo] = useState<string>("")
  const [lessonMonth, setLessonMonth] = useState<string>("")
  const [lessonAutoFilledTheme, setLessonAutoFilledTheme] = useState("")
  const [lessonReviewMode, setLessonReviewMode] = useState<boolean>(false)
  const [lessonFullPlanMode, setLessonFullPlanMode] = useState<boolean>(true) // Default to true
  const [lessonDuration, setLessonDuration] = useState("9")
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null)
  const lessonFileRef = useRef<HTMLInputElement>(null)
  const [lessonTemplate, setLessonTemplate] = useState<TemplateData | null>(null) // Added missing state
  const [lessonCustomInstructions, setLessonCustomInstructions] = useState<string>("")
  const [lessonTasks, setLessonTasks] = useState<LessonTask[]>([])

  const [curriculumTasks, setCurriculumTasks] = useState<LessonTask[]>([])
  const [showCurriculumTasks, setShowCurriculumTasks] = useState(true)
  const [taskTimeDistribution, setTaskTimeDistribution] = useState<Record<string, number>>({})

  // Event state
  const [selectedGradeEvent, setSelectedGradeEvent] = useState<string>("")
  const [selectedEventMonth, setSelectedEventMonth] = useState<string>("")
  const [autoFilledTheme, setAutoFilledTheme] = useState<string>("")
  const [eventTemplate, setEventTemplate] = useState<TemplateData | null>(null)
  const [eventResult, setEventResult] = useState<{
    ten_chu_de: string
    nang_luc: string
    pham_chat: string
    muc_dich_yeu_cau: string
    kich_ban_chi_tiet: string
    thong_diep_ket_thuc: string
    // New fields from updates
    du_toan_kinh_phi?: string
    checklist_chuan_bi?: string
    danh_gia_sau_hoat_dong?: string
  } | null>(null)
  const [eventCustomInstructions, setEventCustomInstructions] = useState<string>("")
  const [eventBudget, setEventBudget] = useState("")
  const [eventChecklist, setEventChecklist] = useState("")
  const [eventEvaluation, setEventEvaluation] = useState("")

  // Common state
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showGuide, setShowGuide] = useState(false) // Updated state name to match the update

  const [shdcSuggestion, setShdcSuggestion] = useState("")
  const [hdgdSuggestion, setHdgdSuggestion] = useState("")
  const [shlSuggestion, setShlSuggestion] = useState("")

  // PPCT state
  const [ppctData, setPpctData] = useState<PPCTItem[]>([])
  const [showPPCTDialog, setShowPPCTDialog] = useState(false)
  const [newPPCTItem, setNewPPCTItem] = useState<PPCTItem>({ month: "", theme: "", periods: 2 })
  const [selectedChuDe, setSelectedChuDe] = useState<PPCTChuDe | null>(null)

  // PPCT file upload state
  const ppctFileRef = useRef<HTMLInputElement>(null)
  const [ppctFileName, setPpctFileName] = useState<string | null>(null)

  // File refs
  const meetingFileRef = useRef<HTMLInputElement>(null)
  const eventFileRef = useRef<HTMLInputElement>(null)

  // Default templates state
  const [hasDefaultMeetingTemplate, setHasDefaultMeetingTemplate] = useState(false)
  const [hasDefaultEventTemplate, setHasDefaultEventTemplate] = useState(false)
  const [hasDefaultLessonTemplate, setHasDefaultLessonTemplate] = useState(false)

  useEffect(() => {
    const checkApiKey = async () => {
      const result = await checkApiKeyStatus()
      setApiKeyConfigured(result.configured)
    }
    checkApiKey()
  }, [])

  // Load templates from IndexedDB
  useEffect(() => {
    const loadTemplates = async () => {
      const meeting = await getTemplate("meeting")
      const event = await getTemplate("event")
      const lesson = await getTemplate("lesson")
      const defaultMeeting = await getTemplate("default_meeting")
      const defaultEvent = await getTemplate("default_event")
      const defaultLesson = await getTemplate("default_lesson")

      if (meeting) setMeetingTemplate({ name: meeting.name, data: meeting.data })
      if (event) setEventTemplate({ name: event.name, data: event.data })
      if (lesson) setLessonTemplate({ name: lesson.name, data: lesson.data })

      setHasDefaultMeetingTemplate(!!defaultMeeting)
      setHasDefaultEventTemplate(!!defaultEvent)
      setHasDefaultLessonTemplate(!!defaultLesson)
    }
    loadTemplates()
  }, [])

  // Auto-fill theme when grade and month are selected (Lesson)
  useEffect(() => {
    if (lessonGrade && lessonMonth) {
      const theme = getThemeForMonth(lessonGrade, lessonMonth)
      setLessonAutoFilledTheme(theme || "")
    } else {
      setLessonAutoFilledTheme("")
    }
  }, [lessonGrade, lessonMonth])

  // Auto-fill theme when grade and month are selected (Event)
  useEffect(() => {
    if (selectedGradeEvent && selectedEventMonth) {
      const theme = getThemeForMonth(selectedGradeEvent, selectedEventMonth)
      setAutoFilledTheme(theme || "")
    } else {
      setAutoFilledTheme("")
    }
  }, [selectedGradeEvent, selectedEventMonth])

  // Auto-fill theme when grade and chu de change
  useEffect(() => {
    if (lessonGrade && selectedChuDeSo) {
      const chuDeList = getChuDeListByKhoi(lessonGrade)
      const chuDeSo = Number.parseInt(selectedChuDeSo) || 1
      const chuDe = chuDeList.find((cd) => cd.chu_de_so === chuDeSo)

      if (chuDe) {
        setLessonAutoFilledTheme(chuDe.ten)
        setLessonDuration(chuDe.tong_tiet.toString())
        setSelectedChuDe(chuDe)
      }
    } else {
      setLessonAutoFilledTheme("")
      setSelectedChuDe(null)
    }
  }, [lessonGrade, selectedChuDeSo])

  useEffect(() => {
    if (lessonGrade && selectedChuDeSo) {
      // Map chu de to month for curriculum tasks
      setLessonMonth(selectedChuDeSo)
    }
  }, [lessonGrade, selectedChuDeSo])

  useEffect(() => {
    if (lessonGrade) {
      const loadPPCT = async () => {
        const ppct = await getPPCT(lessonGrade)
        if (ppct) {
          setPpctData(ppct)
        } else {
          setPpctData([])
        }
      }
      loadPPCT()
    }
  }, [lessonGrade])

  // Sửa đổi logic để lấy task từ kntt-activities-database dựa trên tên chủ đề
  useEffect(() => {
    // Use lessonMonth derived from selectedChuDeSo
    if (lessonGrade && lessonMonth) {
      const gradeNum = Number.parseInt(lessonGrade) as 10 | 11 | 12
      const monthNum = Number.parseInt(lessonMonth)

      const chuDe = getChuDeTheoThang(gradeNum, monthNum)
      const chuDeName = chuDe?.ten_chu_de || lessonAutoFilledTheme // Use auto-filled theme if chuDe.ten_chu_de is missing

      if (chuDeName) {
        const curriculumTasksFromDB = getCurriculumTasksByTopic(gradeNum, chuDeName)

        const allTasks: LessonTask[] = (curriculumTasksFromDB || []).map((task, index) => ({
          id: `curriculum-${index}`,
          name: task.ten,
          content: task.mo_ta || "",
          source: "curriculum",
          kyNangCanDat: task.ky_nang_can_dat ? task.ky_nang_can_dat.split(";").map((s) => s.trim()) : [], // Split skills
          sanPhamDuKien: task.san_pham_du_kien || "",
          thoiLuongDeXuat: task.thoi_luong_de_xuat || "",
          selected: true, // Default to selected
          time: task.thoi_luong_de_xuat ? Number.parseInt(task.thoi_luong_de_xuat.split(" ")[0]) : 10, // Default time
        }))
        setCurriculumTasks(allTasks)
      } else {
        setCurriculumTasks([])
      }
    } else {
      setCurriculumTasks([])
    }
  }, [lessonGrade, lessonMonth, lessonAutoFilledTheme]) // Added lessonAutoFilledTheme to dependency array

  useEffect(() => {
    if (lessonGrade && lessonMonth) {
      const ppctItem = ppctData.find((item) => item.month === lessonMonth)

      // Start with curriculum tasks
      const mergedTasks: LessonTask[] = [...curriculumTasks]

      // Add PPCT tasks if available (avoid duplicates by name)
      if (ppctItem?.tasks && ppctItem.tasks.length > 0) {
        ppctItem.tasks.forEach((ppctTask) => {
          const exists = mergedTasks.some((t) => t.name.toLowerCase().trim() === ppctTask.name.toLowerCase().trim())
          if (!exists) {
            mergedTasks.push({
              id: `ppct-${Date.now()}-${Math.random()}`,
              name: ppctTask.name,
              content: ppctTask.description || "",
              source: "ppct",
              selected: true, // Default to selected
              time: 15, // Default time for PPCT tasks
            })
          }
        })
      }

      // Keep user-added tasks (source: 'user')
      const userTasks = lessonTasks.filter((t) => t.source === "user")
      userTasks.forEach((userTask) => {
        const exists = mergedTasks.some((t) => t.name.toLowerCase().trim() === userTask.name.toLowerCase().trim())
        if (!exists) {
          mergedTasks.push(userTask)
        }
      })

      setLessonTasks(mergedTasks)
    } else {
      // Clear tasks if grade or month is not selected
      setLessonTasks([])
    }
  }, [lessonGrade, lessonMonth, ppctData, curriculumTasks]) // Removed lessonTasks from dependency array, as it's the state being set

  // Handle template upload
  const handleTemplateUpload = async (file: File, type: TemplateType) => {
    try {
      const buffer = await file.arrayBuffer()
      await saveTemplate(type, file.name, buffer)
      const templateData = { name: file.name, data: buffer }

      if (type === "meeting") {
        setMeetingTemplate(templateData)
        setHasDefaultMeetingTemplate(false) // User uploaded a new template
      } else if (type === "event") {
        setEventTemplate(templateData)
        setHasDefaultEventTemplate(false) // User uploaded a new template
      } else if (type === "lesson") {
        setLessonTemplate(templateData)
        setHasDefaultLessonTemplate(false) // User uploaded a new template
      }

      setSuccess(`Đã tải mẫu "${file.name}" thành công!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Lỗi tải mẫu: ${err.message}`)
      setTimeout(() => setError(null), 5000)
    }
  }

  // Handle meeting generation
  const handleGenerateMeeting = async () => {
    if (!selectedMonth) {
      setError("Vui lòng chọn tháng")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateMeetingMinutes(selectedMonth, selectedSession, meetingKeyContent, meetingConclusion) // Pass meetingConclusion

      if (result.success && result.data) {
        setMeetingResult(result.data)
        setSuccess("Tạo biên bản thành công!")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || "Lỗi khi tạo biên bản")
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định")
    } finally {
      setIsGenerating(false)
    }
  }

  const distributeTimeForTasks = useCallback(() => {
    const totalMinutes = Number.parseInt(lessonDuration) * 45 // 1 tiết = 45 phút
    const allTasks = [
      ...curriculumTasks.filter((t) => t.selected),
      ...lessonTasks.filter((t) => t.source === "user" && t.selected),
    ]

    if (allTasks.length === 0) {
      setTaskTimeDistribution({})
      return
    }

    const distribution: Record<string, number> = {}
    let remainingTime = totalMinutes

    // Prioritize tasks with specified time
    const tasksWithTime = allTasks.filter((t) => t.time && t.time > 0)
    const tasksWithoutTime = allTasks.filter((t) => !t.time || t.time <= 0)

    // Distribute time for tasks that have explicit time set
    tasksWithTime.forEach((task) => {
      distribution[task.id] = task.time as number
      remainingTime -= task.time as number
    })

    // If there's remaining time and tasks without explicit time, distribute evenly
    if (remainingTime > 0 && tasksWithoutTime.length > 0) {
      const timePerTask = Math.floor(remainingTime / tasksWithoutTime.length)
      tasksWithoutTime.forEach((task) => {
        distribution[task.id] = timePerTask
      })
    } else if (remainingTime < 0) {
      // If total time exceeds available time, cap at 0 for tasks without time
      tasksWithoutTime.forEach((task) => {
        distribution[task.id] = 0
      })
    }

    setTaskTimeDistribution(distribution)
  }, [lessonDuration, curriculumTasks, lessonTasks])

  // Handle lesson plan generation
  const handleGenerateLesson = async () => {
    if (!lessonGrade) {
      setError("Vui lòng chọn khối lớp")
      return
    }

    const effectiveTopic = lessonTopic || lessonAutoFilledTheme
    if (!effectiveTopic) {
      setError("Vui lòng chọn chủ đề")
      return
    }

    setIsGenerating(true)
    setError(null)

    // Build custom instructions including tasks
    let fullInstructions = lessonCustomInstructions || ""

    // Ensure only selected tasks are included
    const selectedLessonTasks = lessonTasks.filter((t) => t.selected)

    if (selectedLessonTasks.length > 0) {
      const tasksPrompt = selectedLessonTasks
        .map((task, index) => `NHIỆM VỤ ${index + 1}: ${task.name}\nNội dung: ${task.content}`)
        .join("\n\n")

      fullInstructions += `\n\n=== CÁC NHIỆM VỤ CẦN THIẾT KẾ ===\n${tasksPrompt}\n\nYÊU CẦU: Hãy thiết kế tiến trình dạy học RIÊNG CHO TỪNG NHIỆM VỤ. Mỗi nhiệm vụ cần có đầy đủ 4 bước (Chuyển giao - Thực hiện - Báo cáo - Kết luận). Trình bày theo cấu trúc:\n\nNHIỆM VỤ 1: [Tên]\n- Nội dung nhiệm vụ: [Chi tiết]\n- Tiến trình thực hiện:\n  + Bước 1: Chuyển giao nhiệm vụ...\n  + Bước 2: Thực hiện nhiệm vụ...\n  + Bước 3: Báo cáo, thảo luận...\n  + Bước 4: Kết luận, nhận định...\n\n(Tương tự cho các nhiệm vụ tiếp theo)`
    }

    try {
      const result = await generateLessonPlan(
        lessonGrade,
        effectiveTopic,
        lessonFullPlanMode,
        lessonFullPlanMode ? `${lessonDuration} tiết` : undefined,
        fullInstructions,
        ppctData, // Pass ppctData
        // Pass task time distribution if full plan mode is active
        lessonFullPlanMode ? taskTimeDistribution : undefined,
        // Pass suggestions
        lessonFullPlanMode ? shdcSuggestion : undefined,
        lessonFullPlanMode ? hdgdSuggestion : undefined,
        lessonFullPlanMode ? shlSuggestion : undefined,
      )

      if (result.success && result.data) {
        setLessonResult(result.data as LessonResult)
        setSuccess(lessonFullPlanMode ? "Tạo Kế hoạch bài dạy đầy đủ thành công!" : "Tạo nội dung tích hợp thành công!")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || "Lỗi khi tạo nội dung")
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định")
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle event script generation
  const handleGenerateEvent = async () => {
    if (!selectedGradeEvent || !selectedEventMonth) {
      setError("Vui lòng chọn khối và tháng")
      return
    }

    if (!autoFilledTheme) {
      setError("Không tìm thấy chủ đề cho tháng này")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateEventScript(
        selectedGradeEvent,
        autoFilledTheme,
        eventCustomInstructions || undefined,
        eventBudget, // Pass budget
        eventChecklist, // Pass checklist
        eventEvaluation, // Pass evaluation template
      )

      if (result.success && result.data) {
        setEventResult(result.data)
        setSuccess("Tạo kịch bản ngoại khóa thành công!")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || "Lỗi khi tạo kịch bản")
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định")
    } finally {
      setIsGenerating(false)
    }
  }

  const getCurrentDate = () => {
    const now = new Date()
    const day = now.getDate()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    return `ngày ${day} tháng ${month} năm ${year}`
  }

  const getChuDeListByKhoi = (khoi: string): PPCTChuDe[] => {
    const khoiNum = Number.parseInt(khoi)
    const ppct = getPPCTTheoKhoi(khoiNum)
    return ppct?.chu_de || []
  }

  const getChuDeNumber = (grade: string, month: string): string => {
    const monthNum = Number.parseInt(month)
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
    }
    return monthToChuDe[monthNum]?.toString() || "1"
  }

  const getTemplateStatusText = (
    sessionTemplate: TemplateData | null,
    hasDefault: boolean,
    type: string, // Not used in current logic, but could be for more advanced statuses
  ) => {
    if (sessionTemplate) {
      return sessionTemplate.name
    } else if (hasDefault) {
      return "Sử dụng mẫu mặc định"
    } else {
      return "Chưa có mẫu - Nội dung sẽ copy vào clipboard"
    }
  }

  // Helper function to get template button text
  const getTemplateButtonText = (sessionTemplate: TemplateData | null, hasDefault: boolean) => {
    if (sessionTemplate) return "Đổi mẫu phiên"
    if (hasDefault) return "Dùng mẫu khác"
    return "Tải mẫu lên"
  }

  // Handle export to Word
  const handleExport = async (type: "meeting" | "lesson" | "event") => {
    setIsExporting(true)
    setError(null)

    try {
      const Docxtemplater = (await import("docxtemplater")).default
      const PizZip = (await import("pizzip")).default

      let saveAs: (blob: Blob, filename: string) => void
      try {
        const fileSaver = await import("file-saver")
        saveAs = fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default
        if (typeof saveAs !== "function") {
          // Fallback to native download
          saveAs = (blob: Blob, filename: string) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        }
      } catch {
        // Fallback to native download if file-saver fails
        saveAs = (blob: Blob, filename: string) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }

      // Determine the effective template: user-uploaded first, then default, then fallback
      const userTemplate = type === "meeting" ? meetingTemplate : type === "event" ? eventTemplate : lessonTemplate
      const hasDefault =
        type === "meeting"
          ? hasDefaultMeetingTemplate
          : type === "event"
            ? hasDefaultEventTemplate
            : hasDefaultLessonTemplate
      const templateType = type === "meeting" ? "meeting" : type === "event" ? "event" : "lesson"

      let effectiveTemplateData: ArrayBuffer | null = null
      let templateName = "No template loaded"

      if (userTemplate) {
        effectiveTemplateData = userTemplate.data
        templateName = userTemplate.name
      } else if (hasDefault) {
        // Fetch default template content
        // Assuming `getTemplate` can fetch default templates using a prefix like "default_"
        const defaultTemplate = await getTemplate(`default_${templateType}`)
        if (defaultTemplate) {
          effectiveTemplateData = defaultTemplate.data
          templateName = defaultTemplate.name // This will be the default template name
        }
      }

      if (!effectiveTemplateData) {
        // No template found (user-uploaded or default) - fallback to clipboard copy
        setSuccess("Chưa có mẫu Word (cả mẫu tùy chỉnh và mặc định). Nội dung đã được copy vào clipboard!")
        // ... (clipboard logic remains the same) ...
        // For now, we'll continue with the clipboard logic below if no template data is found.
      }

      let data: Record<string, string | ArrayBuffer | null | Record<string, unknown>> = {}
      let fileName = ""

      const formatForWord = (text: unknown): string => {
        // Handle null/undefined
        if (text === null || text === undefined) return ""

        // Handle arrays - join with newlines
        if (Array.isArray(text)) {
          return formatForWord(
            text
              .map((item) => {
                if (typeof item === "object" && item !== null) {
                  // Format object items recursively
                  return Object.entries(item)
                    .map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`)
                    .join("\n")
                }
                return String(item)
              })
              .join("\n"),
          )
        }

        // Handle objects - convert to string representation
        if (typeof text === "object") {
          const obj = text as Record<string, unknown>
          // Special handling for SHDC/SHL objects
          if ("shdc" in obj || "shl" in obj) {
            const parts: string[] = []
            if (obj.shdc && Array.isArray(obj.shdc)) {
              parts.push("SINH HOẠT DƯỚI CỜ:")
              obj.shdc.forEach((item: Record<string, unknown>, idx: number) => {
                parts.push(`Tuần ${idx + 1}: ${item.ten_hoat_dong || item.ten || ""}`)
                if (item.noi_dung_chinh) parts.push(`Nội dung: ${item.noi_dung_chinh}`)
              })
            }
            if (obj.shl && Array.isArray(obj.shl)) {
              parts.push("\nSINH HOẠT LỚP:")
              obj.shl.forEach((item: Record<string, unknown>, idx: number) => {
                parts.push(`Tuần ${idx + 1}: ${item.ten_hoat_dong || item.ten || ""}`)
                if (item.noi_dung_chinh) parts.push(`Nội dung: ${item.noi_dung_chinh}`)
              })
            }
            return formatForWord(parts.join("\n"))
          }
          // Generic object handling
          return formatForWord(
            Object.entries(obj)
              .map(([key, value]) => `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`)
              .join("\n"),
          )
        }

        // Handle non-string primitives
        if (typeof text !== "string") {
          return formatForWord(String(text))
        }

        // Now we know text is a string
        let formatted = text
          // Remove TAB characters
          .replace(/\t/g, "")
          // Remove ** markdown bold
          .replace(/\*\*/g, "")
          // Clean up lines - keep original structure
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n")
          .trim()

        // Replace single newlines with LINE marker (soft break - same paragraph)
        // This creates line breaks WITHOUT blank lines between them
        formatted = formatted.replace(/\n/g, "{{LINE}}")

        return formatted
      }

      if (type === "meeting") {
        if (!meetingResult) {
          setError("Chưa có nội dung biên bản. Vui lòng tạo nội dung trước.")
          return
        }

        data = {
          ...DEPT_INFO.autoFill,
          thang: selectedMonth,
          lan_hop: selectedSession,
          noi_dung_chinh: formatForWord(meetingResult.noi_dung_chinh),
          uu_diem: formatForWord(meetingResult.uu_diem || ""),
          han_che: formatForWord(meetingResult.han_che || ""),
          y_kien_dong_gop: formatForWord(meetingResult.y_kien_dong_gop),
          ke_hoach_thang_toi: formatForWord(meetingResult.ke_hoach_thang_toi),
          // Add ket_luan_cuoc_hop
          ket_luan_cuoc_hop: formatForWord(meetingResult.ket_luan_cuoc_hop || ""),
        }
        fileName = `Bien_ban_hop_T${selectedMonth}_L${selectedSession}.docx`
      } else if (type === "lesson") {
        if (!lessonResult) {
          setError("Chưa có nội dung tích hợp. Vui lòng tạo nội dung trước.")
          return
        }
        const reviewPrefix = lessonReviewMode ? "[AI - CẦN DUYỆT] " : ""

        if (lessonFullPlanMode) {
          const chuDeNumber = getChuDeNumber(lessonGrade, lessonMonth)

          data = {
            // Basic info
            ngay_soan: getCurrentDate(),
            chu_de: chuDeNumber,
            ten_chu_de: lessonTopic || lessonAutoFilledTheme,
            ten_bai: lessonTopic || lessonAutoFilledTheme,
            lop: lessonGrade,
            khoi: lessonGrade,
            so_tiet: lessonDuration,

            // Objectives
            muc_tieu_kien_thuc: formatForWord(lessonResult.muc_tieu_kien_thuc || ""),
            muc_tieu_nang_luc: formatForWord(lessonResult.muc_tieu_nang_luc || ""),
            muc_tieu_pham_chat: formatForWord(lessonResult.muc_tieu_pham_chat || ""),

            // Equipment - Split into GV and HS
            gv_chuan_bi: formatForWord(lessonResult.gv_chuan_bi || ""),
            hs_chuan_bi: formatForWord(lessonResult.hs_chuan_bi || ""),
            thiet_bi_day_hoc: formatForWord(lessonResult.thiet_bi_day_hoc || ""),

            // Activities - Added hoat_dong_duoi_co
            hoat_dong_duoi_co: formatForWord(lessonResult.hoat_dong_duoi_co || ""),
            hoat_dong_khoi_dong: formatForWord(lessonResult.hoat_dong_khoi_dong || ""),
            hoat_dong_kham_pha: formatForWord(lessonResult.hoat_dong_kham_pha || ""),
            hoat_dong_luyen_tap: formatForWord(lessonResult.hoat_dong_luyen_tap || ""),
            hoat_dong_van_dung: formatForWord(lessonResult.hoat_dong_van_dung || ""),

            // Additional sections - Added huong_dan_ve_nha
            ho_so_day_hoc: formatForWord(lessonResult.ho_so_day_hoc || ""),
            huong_dan_ve_nha: formatForWord(lessonResult.huong_dan_ve_nha || ""),

            // Integration
            tich_hop_nls: reviewPrefix + formatForWord(lessonResult.tich_hop_nls),
            tich_hop_dao_duc: reviewPrefix + formatForWord(lessonResult.tich_hop_dao_duc),

            // Add SHDC, HDGD, SHL suggestions if they exist in lessonResult
            shdc_gợi_ý: formatForWord(lessonResult.shdc_gợi_ý || shdcSuggestion),
            hdgd_gợi_ý: formatForWord(lessonResult.hdgd_gợi_ý || hdgdSuggestion),
            shl_gợi_ý: formatForWord(lessonResult.shl_gợi_ý || shlSuggestion),

            ...lessonTasks.reduce(
              (acc, task, index) => {
                const taskNum = index + 1
                acc[`nhiem_vu_${taskNum}_ten`] = task.name || ""
                acc[`nhiem_vu_${taskNum}_noi_dung`] = formatForWord(task.content || "")
                acc[`nhiem_vu_${taskNum}_ky_nang`] = formatForWord(
                  Array.isArray(task.kyNangCanDat) ? task.kyNangCanDat.join(", ") : task.kyNangCanDat || "",
                )
                acc[`nhiem_vu_${taskNum}_san_pham`] = formatForWord(task.sanPhamDuKien || "")
                acc[`nhiem_vu_${taskNum}_thoi_luong`] = task.thoiLuongDeXuat || ""

                // Add 4 steps for each task from AI result if available
                const nhiemVuFromResult = lessonResult.nhiem_vu?.[index]
                if (nhiemVuFromResult?.to_chuc_thuc_hien) {
                  acc[`nhiem_vu_${taskNum}_chuyen_giao`] = formatForWord(
                    nhiemVuFromResult.to_chuc_thuc_hien.chuyen_giao || "",
                  )
                  acc[`nhiem_vu_${taskNum}_thuc_hien`] = formatForWord(
                    nhiemVuFromResult.to_chuc_thuc_hien.thuc_hien || "",
                  )
                  acc[`nhiem_vu_${taskNum}_bao_cao`] = formatForWord(nhiemVuFromResult.to_chuc_thuc_hien.bao_cao || "")
                  acc[`nhiem_vu_${taskNum}_ket_luan`] = formatForWord(
                    nhiemVuFromResult.to_chuc_thuc_hien.ket_luan || "",
                  )
                }

                return acc
              },
              {} as Record<string, string>,
            ),
            // Add PPCT data dynamically
            ...ppctData.reduce(
              (acc, ppctItem) => {
                acc[`ppct_thang_${ppctItem.month}_ten`] = ppctItem.theme || ""
                acc[`ppct_thang_${ppctItem.month}_so_tiet`] = ppctItem.periods.toString()
                if (ppctItem.notes) {
                  acc[`ppct_thang_${ppctItem.month}_ghi_chu`] = ppctItem.notes
                }
                if (ppctItem.tasks && ppctItem.tasks.length > 0) {
                  ppctItem.tasks.forEach((task, taskIndex) => {
                    acc[`ppct_thang_${ppctItem.month}_nhiem_vu_${taskIndex + 1}_ten`] = task.name || ""
                    acc[`ppct_thang_${ppctItem.month}_nhiem_vu_${taskIndex + 1}_mo_ta`] = formatForWord(
                      task.description || "",
                    )
                  })
                }
                return acc
              },
              {} as Record<string, string>,
            ),
          }
          fileName = `KHBD_Lop${lessonGrade}_ChuDe${chuDeNumber}_${lessonTopic || lessonAutoFilledTheme}.docx`.replace(
            /\s+/g,
            "_",
          )
        } else {
          // Default integration-only export
          data = {
            ten_bai: lessonTopic || lessonAutoFilledTheme,
            khoi: lessonGrade,
            tich_hop_nls: reviewPrefix + formatForWord(lessonResult.tich_hop_nls),
            tich_hop_dao_duc: reviewPrefix + formatForWord(lessonResult.tich_hop_dao_duc),
          }
          fileName = `KHBD_tich_hop_${lessonTopic || lessonAutoFilledTheme}.docx`.replace(/\s+/g, "_")
        }
      } else if (type === "event") {
        if (!eventResult) {
          setError("Chưa có kịch bản ngoại khóa. Vui lòng tạo nội dung trước.")
          return
        }
        data = {
          ten_chu_de: eventResult.ten_chu_de,
          nang_luc: formatForWord(eventResult.nang_luc || ""),
          pham_chat: formatForWord(eventResult.pham_chat || ""),
          muc_dich_yeu_cau: formatForWord(eventResult.muc_dich_yeu_cau),
          kich_ban_chi_tiet: formatForWord(eventResult.kich_ban_chi_tiet),
          thong_diep_ket_thuc: formatForWord(eventResult.thong_diep_ket_thuc),
          khoi: selectedGradeEvent,
          thang: selectedEventMonth,
          // Add new fields to data
          du_toan_kinh_phi: formatForWord(eventResult.du_toan_kinh_phi || eventBudget || ""),
          checklist_chuan_bi: formatForWord(eventResult.checklist_chuan_bi || eventChecklist || ""),
          danh_gia_sau_hoat_dong: formatForWord(
            eventResult.danh_gia_sau_hoat_dong ||
              `1. Mức độ hoàn thành mục tiêu: __/10\n2. Sự tham gia của học sinh: __/10\n3. Công tác tổ chức: __/10\n4. Bài học kinh nghiệm:\n5. Đề xuất cải tiến:`,
          ),
        }
        fileName = `KH_Ngoaikhoa_K${selectedGradeEvent}_T${selectedEventMonth}.docx`
      }

      if (!effectiveTemplateData) {
        // No template - just copy content to clipboard
        const content = Object.entries(data)
          .map(([key, value]) => `${key}:\n${(value || "").replace(/\{\{LINE\}\}/g, "\n")}`) // Changed PARA to LINE here
          .join("\n\n---\n\n")

        await navigator.clipboard.writeText(content)
        setSuccess("Chưa có mẫu Word (cả mẫu mặc định). Nội dung đã được copy vào clipboard!")
        setTimeout(() => setSuccess(null), 3000)
        return
      }

      const zip = new PizZip(effectiveTemplateData)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: false, // Disable linebreaks, we handle it manually
        nullGetter: () => "",
      })

      doc.render(data)

      const processedZip = doc.getZip()

      const documentXml = processedZip.file("word/document.xml")
      if (documentXml) {
        let xmlContent = documentXml.asText()

        // Use soft line break (<w:br/>) instead of new paragraph
        // This keeps text together without blank lines between them
        xmlContent = xmlContent.replace(/\{\{LINE\}\}/g, "</w:t><w:br/><w:t>")

        processedZip.file("word/document.xml", xmlContent)
      }

      const output = processedZip.generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      saveAs(output, fileName)
      setSuccess(`Đã xuất file "${fileName}" thành công!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("[v0] Export error:", err)
      if (err.message?.includes("Can't find end of central directory")) {
        setError("File mẫu không hợp lệ. Vui lòng tải lại mẫu Word (.docx).")
      } else {
        setError(`Lỗi xuất file: ${err.message}`)
      }
    } finally {
      setIsExporting(false)
    }
  }

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess("Đã copy vào clipboard!")
      setTimeout(() => setSuccess(null), 2000)
    } catch {
      setError("Không thể copy vào clipboard")
    }
  }

  // Get theme details for display
  const getLessonThemeDetails = () => {
    if (lessonGrade && lessonMonth) {
      return getThemeDetails(lessonGrade, lessonMonth)
    }
    return null
  }

  const getEventThemeDetails = () => {
    if (selectedGradeEvent && selectedEventMonth) {
      return getThemeDetails(selectedGradeEvent, selectedEventMonth)
    }
    return null
  }

  const lessonThemeDetails = getLessonThemeDetails()
  const eventThemeDetails = getEventThemeDetails()

  const addLessonTask = () => {
    const newTask: LessonTask = {
      id: `user-${Date.now()}-${Math.random()}`,
      name: `Nhiệm vụ ${lessonTasks.filter((t) => t.source === "user").length + 1}`,
      content: "",
      source: "user", // Mark as user-added
      selected: true, // Default to selected
      time: 10, // Default time
    }
    setLessonTasks([...lessonTasks, newTask])
  }

  const updateLessonTask = (
    id: string,
    field: "name" | "content" | "selected" | "time",
    value: string | boolean | number,
  ) => {
    setLessonTasks(lessonTasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)))
  }

  const removeLessonTask = (id: string) => {
    setLessonTasks(lessonTasks.filter((task) => task.id !== id))
  }

  const handleSavePPCT = async () => {
    if (lessonGrade && ppctData.length > 0) {
      await savePPCT(lessonGrade, ppctData)
      setSuccess("Đã lưu PPCT thành công!")
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleAddPPCTItem = () => {
    if (newPPCTItem.month && newPPCTItem.theme) {
      // Check if month already exists to avoid duplicates, or merge if necessary
      const existingIndex = ppctData.findIndex((item) => item.month === newPPCTItem.month)
      if (existingIndex > -1) {
        // Update existing item
        const updatedData = [...ppctData]
        updatedData[existingIndex] = { ...updatedData[existingIndex], ...newPPCTItem }
        setPpctData(updatedData)
      } else {
        // Add new item
        setPpctData([...ppctData, newPPCTItem])
      }
      setNewPPCTItem({ month: "", theme: "", periods: 2 }) // Reset form
      setShowPPCTDialog(false) // Close dialog after adding
    } else {
      setError("Vui lòng nhập đủ Tháng và Chủ đề")
    }
  }

  const handleRemovePPCTItem = (index: number) => {
    setPpctData(ppctData.filter((_, i) => i !== index))
  }

  const handleDownloadPPCTTemplate = async () => {
    try {
      const XLSX = await import("xlsx")

      // Create workbook with template structure
      const wb = XLSX.utils.book_new()

      // Template data with example
      const templateData = [
        ["PHÂN PHỐI CHƯƠNG TRÌNH - HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP"],
        [""],
        ["KHỐI:", lessonGrade || "10", "", "", "", "", ""],
        [""],
        ["Tháng", "Tên chủ đề", "Số tiết", "Nhiệm vụ 1", "Nhiệm vụ 2", "Nhiệm vụ 3", "Nhiệm vụ 4", "Ghi chú"],
        [
          "9",
          "Thể hiện phẩm chất tốt đẹp của người học sinh",
          "4",
          "Tìm hiểu các phẩm chất tốt đẹp",
          "Rèn luyện phẩm chất trung thực",
          "Thực hành trong thực tế",
          "Đánh giá và chia sẻ",
          "",
        ],
        [
          "10",
          "Xây dựng quan điểm sống",
          "3",
          "Khám phá quan điểm sống",
          "Xây dựng quan điểm cá nhân",
          "Chia sẻ và thảo luận",
          "",
          "",
        ],
        [
          "11",
          "Giữ gìn truyền thống nhà trường",
          "4",
          "Tìm hiểu truyền thống",
          "Thực hiện hoạt động truyền thống",
          "Phát huy truyền thống",
          "Tổng kết đánh giá",
          "Kết hợp 20/11",
        ],
        [
          "12",
          "Thực hiện trách nhiệm với gia đình",
          "3",
          "Nhận diện trách nhiệm",
          "Thực hành trách nhiệm",
          "Đánh giá và cam kết",
          "",
          "",
        ],
        [
          "1",
          "Xây dựng kế hoạch tài chính cá nhân",
          "4",
          "Tìm hiểu tài chính cá nhân",
          "Lập kế hoạch chi tiêu",
          "Thực hành tiết kiệm",
          "Đánh giá kết quả",
          "",
        ],
        [
          "2",
          "Vận động cộng đồng tham gia hoạt động xã hội",
          "3",
          "Xác định hoạt động xã hội",
          "Lập kế hoạch vận động",
          "Thực hiện và báo cáo",
          "",
          "",
        ],
        [
          "3",
          "Tìm hiểu hoạt động sản xuất kinh doanh địa phương",
          "4",
          "Khảo sát thực tế",
          "Phân tích hoạt động",
          "Đề xuất ý tưởng",
          "Báo cáo kết quả",
          "",
        ],
        [
          "4",
          "Định hướng học tập và rèn luyện theo nghề",
          "3",
          "Tìm hiểu ngành nghề",
          "Xác định năng lực bản thân",
          "Lập kế hoạch phát triển",
          "",
          "",
        ],
        [
          "5",
          "Bảo vệ cảnh quan thiên nhiên và môi trường",
          "4",
          "Nhận diện vấn đề môi trường",
          "Đề xuất giải pháp",
          "Thực hiện hành động",
          "Đánh giá và lan tỏa",
          "",
        ],
        [""],
        ["HƯỚNG DẪN:"],
        ["- Điền thông tin vào các cột tương ứng"],
        ["- Mỗi chủ đề có thể có từ 1-4 nhiệm vụ (để trống nếu không có)"],
        ["- Số tiết: Số tiết dạy cho chủ đề đó"],
        ["- Ghi chú: Các lưu ý đặc biệt (kết hợp sự kiện, ngày lễ...)"],
        ["- Lưu file và upload lên hệ thống SmartDoc Teacher"],
      ]

      const ws = XLSX.utils.aoa_to_sheet(templateData)

      // Set column widths
      ws["!cols"] = [
        { wch: 8 }, // Tháng
        { wch: 45 }, // Tên chủ đề
        { wch: 8 }, // Số tiết
        { wch: 30 }, // Nhiệm vụ 1
        { wch: 30 }, // Nhiệm vụ 2
        { wch: 30 }, // Nhiệm vụ 3
        { wch: 30 }, // Nhiệm vụ 4
        { wch: 20 }, // Ghi chú
      ]

      XLSX.utils.book_append_sheet(wb, ws, `PPCT_Khoi_${lessonGrade || "10"}`)

      // Generate and download
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Mau_PPCT_Khoi_${lessonGrade || "10"}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess("Đã tải mẫu PPCT Excel thành công!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error creating PPCT template:", err)
      setError("Lỗi tạo mẫu PPCT. Vui lòng thử lại.")
    }
  }

  const parsePPCTFromText = (text: string): PPCTItem[] => {
    const items: PPCTItem[] = []
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    // Check if CSV format (from Excel)
    const isCSV = lines.some((line) => line.includes(","))

    if (isCSV) {
      // Parse CSV format from Excel
      for (const line of lines) {
        const cols = line.split(",").map((col) => col.trim().replace(/^"|"$/g, ""))

        // Skip header rows and empty rows
        if (!cols[0] || isNaN(Number(cols[0])) || cols[0].toLowerCase().includes("tháng")) continue

        const month = cols[0]
        const theme = cols[1] || ""
        const periods = Number(cols[2]) || 2

        // Extract tasks from columns 3-6
        const tasks: { name: string; description: string }[] = []
        for (let i = 3; i <= 6; i++) {
          if (cols[i] && cols[i].trim()) {
            tasks.push({
              name: `Nhiệm vụ ${i - 2}`,
              description: cols[i].trim(),
            })
          }
        }

        const notes = cols[7] || ""

        // Only accept months 1-12
        if (Number(month) >= 1 && Number(month) <= 12 && theme) {
          items.push({
            month,
            theme,
            periods,
            notes,
            tasks: tasks.length > 0 ? tasks : undefined,
          })
        }
      }
    } else {
      // Original text parsing
      const monthPattern = /(?:tháng\s*)?(\d{1,2})[\s:|\-–]+(.+?)(?:[\s\-–|]+(\d+)\s*tiết)?$/i

      for (const line of lines) {
        const match = line.match(monthPattern)
        if (match) {
          const month = match[1]
          const theme = match[2].replace(/[-–|]+\s*\d+\s*tiết.*/i, "").trim()
          const periodsMatch = line.match(/(\d+)\s*tiết/i)
          const periods = periodsMatch ? Number.parseInt(periodsMatch[1]) : 2

          if (Number.parseInt(month) >= 1 && Number(month) <= 12 && theme) {
            items.push({
              month,
              theme,
              periods,
              notes: "",
            })
          }
        }
      }
    }

    return items
  }

  // Handle uploading PPCT file
  const handleUploadPPCTFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPpctFileName(file.name)

    try {
      let text = ""

      if (file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
        // Plain text or CSV
        text = await file.text()
      } else if (file.name.endsWith(".docx")) {
        // Word document - use mammoth
        const mammoth = await import("mammoth")
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // Excel - use xlsx library
        const XLSX = await import("xlsx")
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        text = XLSX.utils.sheet_to_csv(sheet)
      } else {
        setError("Định dạng file không được hỗ trợ. Vui lòng dùng .txt, .csv, .docx, .xlsx")
        return
      }

      const parsedItems = parsePPCTFromText(text)

      if (parsedItems.length > 0) {
        setPpctData(parsedItems)
        setSuccess(`Đã đọc ${parsedItems.length} mục PPCT từ file "${file.name}"`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError("Không tìm thấy dữ liệu PPCT hợp lệ. Vui lòng kiểm tra định dạng file.")
      }
    } catch (err) {
      console.error("Error parsing PPCT file:", err)
      setError("Lỗi đọc file PPCT. Vui lòng kiểm tra định dạng.")
    }

    // Reset input
    if (ppctFileRef.current) ppctFileRef.current.value = ""
  }

  useEffect(() => {
    distributeTimeForTasks()
  }, [distributeTimeForTasks])

  const updateTaskTime = (taskId: string, minutes: number) => {
    setTaskTimeDistribution((prev) => ({
      ...prev,
      [taskId]: Math.max(0, minutes),
    }))
  }

  const totalDistributedTime = Object.values(taskTimeDistribution).reduce((sum, t) => sum + t, 0)
  const totalAvailableTime = Number.parseInt(lessonDuration) * 45

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SmartDoc - {DEPT_INFO.shortName}</h1>
              <p className="text-xs text-slate-500">{DEPT_INFO.school}</p>
            </div>
          </div>

          {/* Thêm nút "Cài đặt mẫu" vào header */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)} className="gap-2">
              <Settings className="w-4 h-4" />
              Cài đặt mẫu
            </Button>
          </div>
        </div>
      </header>

      {/* API Key Warning */}
      {apiKeyConfigured === false && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="container mx-auto flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              Chưa cấu hình GEMINI_API_KEY. Vui lòng thêm vào <strong>Vars</strong> trong sidebar để sử dụng AI.
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

        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as TemplateType)} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto bg-white shadow-md rounded-xl p-1">
            <TabsTrigger
              value="meeting"
              className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg"
            >
              <FileText className="w-4 h-4" />
              Biên bản Họp
            </TabsTrigger>
            <TabsTrigger
              value="lesson"
              className="gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg"
            >
              <BookOpen className="w-4 h-4" />
              Kế hoạch Bài dạy
            </TabsTrigger>
            <TabsTrigger
              value="event"
              className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg"
            >
              <Calendar className="w-4 h-4" />
              Kế hoạch Ngoại khóa
            </TabsTrigger>
          </TabsList>

          {/* Meeting Tab */}
          <TabsContent value="meeting">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Biên bản Họp Tổ Chuyên môn
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Tự động tạo nội dung biên bản họp theo tháng và chủ đề HĐTN
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Removed template upload section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Tháng</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
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
                    <p className="text-sm font-medium text-blue-800 mb-2">Chủ đề tháng {selectedMonth}:</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Khối 10: {getThemeForMonth("10", selectedMonth) || "N/A"}</li>
                      <li>• Khối 11: {getThemeForMonth("11", selectedMonth) || "N/A"}</li>
                      <li>• Khối 12: {getThemeForMonth("12", selectedMonth) || "N/A"}</li>
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
                    Nhập các nội dung trọng tâm cần thảo luận trong cuộc họp. AI sẽ phân tích và tạo biên bản chi tiết
                    dựa trên nội dung này.
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
                    Nếu bạn có sẵn nội dung kết luận, hãy nhập vào đây. AI sẽ tham khảo để tạo biên bản phù hợp.
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
                    <h3 className="font-semibold text-lg text-slate-800">Kết quả tạo biên bản:</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">Nội dung chính:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(meetingResult.noi_dung_chinh)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.noi_dung_chinh}
                          onChange={(e) => setMeetingResult({ ...meetingResult, noi_dung_chinh: e.target.value })}
                          className="min-h-[150px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-orange-700 font-medium">Ưu điểm:</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(meetingResult.uu_diem)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.uu_diem}
                          onChange={(e) => setMeetingResult({ ...meetingResult, uu_diem: e.target.value })}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-red-700 font-medium">Hạn chế:</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(meetingResult.han_che)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.han_che}
                          onChange={(e) => setMeetingResult({ ...meetingResult, han_che: e.target.value })}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">Ý kiến đóng góp:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(meetingResult.y_kien_dong_gop)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.y_kien_dong_gop}
                          onChange={(e) => setMeetingResult({ ...meetingResult, y_kien_dong_gop: e.target.value })}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">Kế hoạch tháng tới:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(meetingResult.ke_hoach_thang_toi)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={meetingResult.ke_hoach_thang_toi}
                          onChange={(e) => setMeetingResult({ ...meetingResult, ke_hoach_thang_toi: e.target.value })}
                          className="min-h-[100px]"
                        />
                      </div>

                      {meetingResult.ket_luan_cuoc_hop && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium text-purple-700">Kết luận cuộc họp</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(meetingResult.ket_luan_cuoc_hop || "")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={meetingResult.ket_luan_cuoc_hop || ""}
                            onChange={(e) => setMeetingResult({ ...meetingResult, ket_luan_cuoc_hop: e.target.value })}
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Kế hoạch Bài dạy
                </CardTitle>
                <CardDescription>Tạo nội dung tích hợp NLS và đạo đức cho kế hoạch bài dạy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grade and Topic selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Khối</Label>
                    <Select
                      value={lessonGrade}
                      onValueChange={(value) => {
                        setLessonGrade(value)
                        setSelectedChuDeSo("") // Reset chu de when grade changes
                        setLessonAutoFilledTheme("")
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
                        setSelectedChuDeSo(value)
                        const chuDeList = getChuDeListByKhoi(lessonGrade)
                        const chuDe = chuDeList.find((cd) => cd.chu_de_so === Number.parseInt(value))
                        if (chuDe) {
                          setLessonAutoFilledTheme(chuDe.ten)
                          setLessonDuration(chuDe.tong_tiet.toString())
                          setSelectedChuDe(chuDe)
                          // Map chu de to month for curriculum tasks
                          setLessonMonth(value)
                        }
                      }}
                      disabled={!lessonGrade}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={lessonGrade ? "Chọn chủ đề..." : "Chọn khối trước"} />
                      </SelectTrigger>
                      <SelectContent>
                        {lessonGrade &&
                          getChuDeListByKhoi(lessonGrade).map((chuDe) => (
                            <SelectItem key={chuDe.chu_de_so} value={chuDe.chu_de_so.toString()}>
                              CĐ{chuDe.chu_de_so}: {chuDe.ten} ({chuDe.tong_tiet} tiết)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Auto-filled theme display with PPCT info */}
                {selectedChuDe && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Chủ đề {selectedChuDe.chu_de_so}: {lessonAutoFilledTheme}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          PPCT: {selectedChuDe.tong_tiet} tiết (SHDC: {selectedChuDe.shdc}, HĐGD: {selectedChuDe.hdgd},
                          SHL: {selectedChuDe.shl})
                          {selectedChuDe.tuan_bat_dau && selectedChuDe.tuan_ket_thuc && (
                            <span>
                              {" "}
                              • Tuần {selectedChuDe.tuan_bat_dau}-{selectedChuDe.tuan_ket_thuc}
                            </span>
                          )}
                        </p>
                        {selectedChuDe.ghi_chu && (
                          <p className="text-xs text-blue-500 italic">{selectedChuDe.ghi_chu}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson topic input */}
                <div className="space-y-2">
                  <Label>Tên bài học cụ thể (tùy chọn nếu đã chọn chủ đề)</Label>
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
                    <p className="text-xs text-muted-foreground">Tạo toàn bộ KHBD thay vì chỉ nội dung tích hợp</p>
                  </div>
                  <Switch checked={lessonFullPlanMode} onCheckedChange={setLessonFullPlanMode} />
                </div>

                {/* Duration selection - only show in full plan mode */}
                {lessonFullPlanMode && (
                  <div className="space-y-2">
                    <Label>Số tiết</Label>
                    <Select value={lessonDuration} onValueChange={setLessonDuration}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedChuDe?.tong_tiet ? (
                          Array.from({ length: selectedChuDe.tong_tiet }, (_, i) => i + 1).map((num) => (
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
                          Tổng thời gian: {totalAvailableTime} phút ({lessonDuration} tiết x 45 phút)
                        </div>
                        {selectedChuDe && (
                          <div className="text-indigo-600">
                            PPCT gợi ý: {selectedChuDe.tong_tiet} tiết (SHDC: {selectedChuDe.shdc}, HĐGD:{" "}
                            {selectedChuDe.hdgd}, SHL: {selectedChuDe.shl})
                          </div>
                        )}
                      </div>
                    )}
                    {curriculumTasks.length > 0 && (
                      <div
                        className={`text-xs mt-1 ${totalDistributedTime > totalAvailableTime ? "text-red-500" : "text-green-600"}`}
                      >
                        Đã phân bổ: {totalDistributedTime}/{totalAvailableTime} phút
                        {totalDistributedTime > totalAvailableTime && " (Vượt quá!)"}
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
                      Nhập gợi ý cụ thể để AI tạo nội dung chuyên sâu hơn cho từng loại hoạt động
                    </p>

                    <div className="space-y-3">
                      {/* SHDC Suggestion */}
                      <div className="space-y-1">
                        <Label className="text-sm text-indigo-700 dark:text-indigo-300">Sinh hoạt dưới cờ (SHDC)</Label>
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
                        <Label className="text-sm text-indigo-700 dark:text-indigo-300">Sinh hoạt lớp (SHL)</Label>
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
                          Nhiệm vụ gợi ý từ SGK ({curriculumTasks.filter((t) => t.selected).length} /{" "}
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
                          onClick={() => setShowCurriculumTasks(!showCurriculumTasks)}
                          className="text-green-700 hover:text-green-800"
                        >
                          {showCurriculumTasks ? "Ẩn" : "Hiện"}
                        </Button>
                      </div>
                    </div>

                    {showCurriculumTasks && (
                      <div className="space-y-3">
                        {curriculumTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 bg-white dark:bg-green-900 rounded-md border border-green-300 dark:border-green-700"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={task.selected || false}
                                    onCheckedChange={(checked) => updateLessonTask(task.id, "selected", checked)}
                                    className="data-[state=checked]:bg-green-500"
                                  />
                                  <span className="font-medium text-sm text-green-800 dark:text-green-200">
                                    {task.name}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{task.content}</p>

                                {/* Skills, products, duration */}
                                <div className="flex flex-wrap gap-2 text-xs">
                                  {task.kyNangCanDat && task.kyNangCanDat.length > 0 && (
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
                                        updateLessonTask(task.id, "time", Number.parseInt(e.target.value) || 0)
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
                          * Các nhiệm vụ này được trích xuất từ cơ sở dữ liệu SGK "Kết nối Tri thức" và sẽ được AI sử
                          dụng khi tạo KHBD. Bạn có thể chọn nhiệm vụ, chỉnh sửa thời gian hoặc thêm nhiệm vụ tùy chỉnh.
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
                        Nhiệm vụ bạn thêm ({lessonTasks.filter((t) => t.source === "user").length})
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
                              <Input
                                value={task.name}
                                onChange={(e) => updateLessonTask(task.id, "name", e.target.value)}
                                placeholder="Tên nhiệm vụ"
                                className="text-sm"
                              />
                              <Textarea
                                value={task.content}
                                onChange={(e) => updateLessonTask(task.id, "content", e.target.value)}
                                placeholder="Mô tả nhiệm vụ"
                                rows={2}
                                className="text-sm"
                              />
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
                <Button variant="outline" onClick={addLessonTask} className="w-full border-dashed bg-transparent">
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
                    onChange={(e) => setLessonCustomInstructions(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">AI sẽ cập nhật nội dung dựa trên chỉ dẫn của bạn</p>
                </div>

                {/* Generate button */}
                <Button
                  className="w-full"
                  onClick={handleGenerateLesson}
                  disabled={
                    isGenerating || !lessonGrade || (!lessonTopic && !lessonAutoFilledTheme) || !selectedChuDeSo
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
                      {lessonFullPlanMode ? "Tạo KHBD đầy đủ" : "Tạo nội dung tích hợp"}
                    </>
                  )}
                </Button>

                {/* Results display */}
                {lessonResult && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Kết quả tạo nội dung - Chỉnh sửa trước khi xuất file</span>
                    </div>

                    {/* Integration results - editable */}
                    {lessonResult.tich_hop_nls && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-blue-700 font-medium">Tích hợp Năng lực số (NLS):</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(lessonResult.tich_hop_nls)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.tich_hop_nls}
                          onChange={(e) => setLessonResult({ ...lessonResult, tich_hop_nls: e.target.value })}
                          className="min-h-[120px] bg-blue-50"
                        />
                      </div>
                    )}

                    {lessonResult.tich_hop_dao_duc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Tích hợp Giáo dục đạo đức:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.tich_hop_dao_duc)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.tich_hop_dao_duc}
                          onChange={(e) => setLessonResult({ ...lessonResult, tich_hop_dao_duc: e.target.value })}
                          className="min-h-[120px] bg-purple-50"
                        />
                      </div>
                    )}

                    {/* Full plan results - editable */}
                    {lessonFullPlanMode && lessonResult.muc_tieu_kien_thuc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">Mục tiêu kiến thức:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.muc_tieu_kien_thuc || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.muc_tieu_kien_thuc || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, muc_tieu_kien_thuc: e.target.value })}
                          className="min-h-[100px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.muc_tieu_nang_luc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">Mục tiêu năng lực:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.muc_tieu_nang_luc || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.muc_tieu_nang_luc || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, muc_tieu_nang_luc: e.target.value })}
                          className="min-h-[100px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.muc_tieu_pham_chat && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">Mục tiêu phẩm chất:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.muc_tieu_pham_chat || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.muc_tieu_pham_chat || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, muc_tieu_pham_chat: e.target.value })}
                          className="min-h-[100px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.thiet_bi_day_hoc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">Thiết bị dạy học:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.thiet_bi_day_hoc || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.thiet_bi_day_hoc || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, thiet_bi_day_hoc: e.target.value })}
                          className="min-h-[80px] bg-slate-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_khoi_dong && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-green-700 font-medium">Hoạt động Khởi động:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.hoat_dong_khoi_dong || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_khoi_dong || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, hoat_dong_khoi_dong: e.target.value })}
                          className="min-h-[150px] bg-green-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_kham_pha && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-yellow-700 font-medium">Hoạt động Khám phá:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.hoat_dong_kham_pha || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_kham_pha || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, hoat_dong_kham_pha: e.target.value })}
                          className="min-h-[200px] bg-yellow-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_luyen_tap && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-orange-700 font-medium">Hoạt động Luyện tập:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.hoat_dong_luyen_tap || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_luyen_tap || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, hoat_dong_luyen_tap: e.target.value })}
                          className="min-h-[150px] bg-orange-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.hoat_dong_van_dung && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-red-700 font-medium">Hoạt động Vận dụng:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.hoat_dong_van_dung || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.hoat_dong_van_dung || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, hoat_dong_van_dung: e.target.value })}
                          className="min-h-[150px] bg-red-50"
                        />
                      </div>
                    )}

                    {lessonFullPlanMode && lessonResult.ho_so_day_hoc && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-slate-700 font-medium">Hồ sơ dạy học:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lessonResult.ho_so_day_hoc || "")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={lessonResult.ho_so_day_hoc || ""}
                          onChange={(e) => setLessonResult({ ...lessonResult, ho_so_day_hoc: e.target.value })}
                          className="min-h-[80px] bg-slate-50"
                        />
                      </div>
                    )}

                    {/* Copy and Export buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content = lessonFullPlanMode
                            ? `TÊN BÀI: ${lessonResult.ten_bai || lessonTopic}\n\nMỤC TIÊU KIẾN THỨC:\n${lessonResult.muc_tieu_kien_thuc}\n\nMỤC TIÊU NĂNG LỰC:\n${lessonResult.muc_tieu_nang_luc}\n\nMỤC TIÊU PHẨM CHẤT:\n${lessonResult.muc_tieu_pham_chat}\n\nTHIẾT BỊ DẠY HỌC:\n${lessonResult.thiet_bi_day_hoc}\n\nHOẠT ĐỘNG KHỞI ĐỘNG:\n${lessonResult.hoat_dong_khoi_dong}\n\nHOẠT ĐỘNG KHÁM PHÁ:\n${lessonResult.hoat_dong_kham_pha}\n\nHOẠT ĐỘNG LUYỆN TẬP:\n${lessonResult.hoat_dong_luyen_tap}\n\nHOẠT ĐỘNG VẬN DỤNG:\n${lessonResult.hoat_dong_van_dung}\n\nTÍCH HỢP NLS:\n${lessonResult.tich_hop_nls}\n\nTÍCH HỢP ĐẠO ĐỨC:\n${lessonResult.tich_hop_dao_duc}\n\nPHÂN PHỐI CHƯƠNG TRÌNH:\n${ppctData.map((item) => `- Tháng ${item.month}: ${item.theme} (${item.periods} tiết) ${item.notes ? `[${item.notes}]` : ""}${item.tasks && item.tasks.length > 0 ? `\n  Nhiệm vụ: ${item.tasks.map((t) => t.description).join(", ")}` : ""}`).join("\n")}\n\nCÁC NHIỆM VỤ CỦA BÀI HỌC:\n${lessonTasks.map((task, index) => `${index + 1}. ${task.name}:\n   ${task.content}${task.source === "curriculum" ? `\n   (Kỹ năng: ${task.kyNangCanDat}, Sản phẩm: ${task.sanPhamDuKien}, Thời lượng: ${task.thoiLuongDeXuat})` : ""}`).join("\n\n")}`
                            : `TÍCH HỢP NLS:\n${lessonResult.tich_hop_nls}\n\nTÍCH HỢP ĐẠO ĐỨC:\n${lessonResult.tich_hop_dao_duc}`
                          navigator.clipboard.writeText(content)
                          setSuccess("Đã copy vào clipboard!")
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy nội dung
                      </Button>

                      <Button variant="outline" onClick={() => handleExport("lesson")}>
                        <Download className="mr-2 h-4 w-4" />
                        Xuất file Word
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Tab */}
          <TabsContent value="event">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Kế hoạch Ngoại khóa HĐTN
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Tự động tạo kịch bản hoạt động ngoại khóa sáng tạo theo chủ đề SGK
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chọn Khối</Label>
                    <Select value={selectedGradeEvent} onValueChange={setSelectedGradeEvent}>
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
                    <Select value={selectedEventMonth} onValueChange={setSelectedEventMonth}>
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
                    <p className="text-sm font-medium text-purple-800 mb-2">Chủ đề từ SGK:</p>
                    <p className="text-purple-700 font-semibold">{autoFilledTheme}</p>
                    {eventThemeDetails && (
                      <div className="mt-3 space-y-2 text-sm text-purple-700">
                        <p>
                          <strong>Mục tiêu:</strong> {eventThemeDetails.objectives.join("; ")}
                        </p>
                        <p>
                          <strong>Hoạt động gợi ý:</strong> {eventThemeDetails.activities.join(", ")}
                        </p>
                        <p>
                          <strong>Kỹ năng:</strong> {eventThemeDetails.skills.join(", ")}
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
                    AI sẽ cố gắng bám sát dự toán bạn cung cấp để xây dựng kế hoạch.
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
                  <p className="text-xs text-slate-500">AI sẽ cập nhật nội dung dựa trên chỉ dẫn của bạn</p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateEvent}
                  disabled={isGenerating || !selectedGradeEvent || !selectedEventMonth}
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
                    <h3 className="font-semibold text-lg text-slate-800">Kết quả kịch bản ngoại khóa:</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Tên chủ đề:</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(eventResult.ten_chu_de)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={eventResult.ten_chu_de}
                          onChange={(e) => setEventResult({ ...eventResult, ten_chu_de: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Mục đích yêu cầu:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(eventResult.muc_dich_yeu_cau)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.muc_dich_yeu_cau}
                          onChange={(e) => setEventResult({ ...eventResult, muc_dich_yeu_cau: e.target.value })}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Kịch bản chi tiết:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(eventResult.kich_ban_chi_tiet)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.kich_ban_chi_tiet}
                          onChange={(e) => setEventResult({ ...eventResult, kich_ban_chi_tiet: e.target.value })}
                          className="min-h-[300px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Thông điệp kết thúc:</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(eventResult.thong_diep_ket_thuc)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.thong_diep_ket_thuc}
                          onChange={(e) => setEventResult({ ...eventResult, thong_diep_ket_thuc: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Năng lực:</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(eventResult.nang_luc)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.nang_luc}
                          onChange={(e) => setEventResult({ ...eventResult, nang_luc: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-700 font-medium">Phẩm chất:</Label>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(eventResult.pham_chat)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          value={eventResult.pham_chat}
                          onChange={(e) => setEventResult({ ...eventResult, pham_chat: e.target.value })}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-amber-700">Dự toán kinh phí</Label>
                        <Textarea
                          value={eventResult.du_toan_kinh_phi || eventBudget || "Không có"}
                          onChange={(e) => setEventResult({ ...eventResult, du_toan_kinh_phi: e.target.value })}
                          rows={3}
                          className="bg-amber-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-cyan-700">Checklist chuẩn bị</Label>
                        <Textarea
                          value={eventResult.checklist_chuan_bi || eventChecklist || ""}
                          onChange={(e) => setEventResult({ ...eventResult, checklist_chuan_bi: e.target.value })}
                          rows={4}
                          className="bg-cyan-50"
                          placeholder="- Chuẩn bị âm thanh, ánh sáng&#10;- In ấn tài liệu&#10;- Liên hệ khách mời..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium text-rose-700">Mẫu đánh giá sau hoạt động</Label>
                        <Textarea
                          value={
                            eventResult.danh_gia_sau_hoat_dong ||
                            `1. Mức độ hoàn thành mục tiêu: __/10\n2. Sự tham gia của học sinh: __/10\n3. Công tác tổ chức: __/10\n4. Bài học kinh nghiệm:\n5. Đề xuất cải tiến:`
                          }
                          onChange={(e) => setEventResult({ ...eventResult, danh_gia_sau_hoat_dong: e.target.value })}
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
        </Tabs>
      </main>

      {/* Template Manager Dialog */}
      <TemplateManager
        open={showSettings}
        onOpenChange={setShowSettings}
        onTemplateSelect={(template, type) => {
          if (type === "meeting") setMeetingTemplate(template)
          else if (type === "lesson") setLessonTemplate(template)
          else if (type === "event") setEventTemplate(template)
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
              <Select value={newPPCTItem.month} onValueChange={(v) => setNewPPCTItem({ ...newPPCTItem, month: v })}>
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
                onChange={(e) => setNewPPCTItem({ ...newPPCTItem, theme: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Số tiết</Label>
              <Select
                value={newPPCTItem.periods.toString()}
                onValueChange={(v) => setNewPPCTItem({ ...newPPCTItem, periods: Number.parseInt(v) })}
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
              <Label>Ghi chú (tùy chọn)</Label>
              <Input
                placeholder="VD: Kết hợp với chào mừng 20/11"
                value={newPPCTItem.notes || ""}
                onChange={(e) => setNewPPCTItem({ ...newPPCTItem, notes: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPPCTDialog(false)}>
                Hủy
              </Button>
              <Button
                onClick={() => {
                  handleAddPPCTItem()
                }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TemplateEngine
