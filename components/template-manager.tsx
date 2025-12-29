"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Check, Trash2, AlertCircle, Star, Download, Plus, Save, X, BookOpen } from "lucide-react"
import {
  saveTemplate,
  getTemplate,
  deleteTemplate,
  savePPCT,
  getPPCT,
  type TemplateType,
  type PPCTItem,
} from "@/lib/template-storage"
import { PPCT_KHOI_10, PPCT_KHOI_11, PPCT_KHOI_12, type PPCTKhoi } from "@/lib/ppct-database"
import type { Document as DocxDocument } from "docx"

interface TemplateInfo {
  name: string
  data: ArrayBuffer
}

interface TemplateManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // PPCT props - optional, for syncing with main component
  onPPCTChange?: (grade: string, data: PPCTItem[]) => void
}

export function TemplateManager({ open, onOpenChange, onPPCTChange }: TemplateManagerProps) {
  const [activeTab, setActiveTab] = useState("default")

  // Default templates state
  const [defaultMeetingTemplate, setDefaultMeetingTemplate] = useState<TemplateInfo | null>(null)
  const [defaultEventTemplate, setDefaultEventTemplate] = useState<TemplateInfo | null>(null)
  const [defaultLessonTemplate, setDefaultLessonTemplate] = useState<TemplateInfo | null>(null)

  // Session templates state
  const [sessionMeetingTemplate, setSessionMeetingTemplate] = useState<TemplateInfo | null>(null)
  const [sessionEventTemplate, setSessionEventTemplate] = useState<TemplateInfo | null>(null)
  const [sessionLessonTemplate, setSessionLessonTemplate] = useState<TemplateInfo | null>(null)

  // PPCT state
  const [ppctGrade, setPpctGrade] = useState("10")
  const [ppctData, setPpctData] = useState<PPCTItem[]>([])
  const [ppctFileName, setPpctFileName] = useState<string | null>(null)
  const [showAddPPCTDialog, setShowAddPPCTDialog] = useState(false)
  const [newPPCTItem, setNewPPCTItem] = useState<PPCTItem>({ month: "", theme: "", periods: 2 })
  const ppctFileRef = useRef<HTMLInputElement>(null)

  // Word template creation guide dialog state
  const [showWordTemplateGuide, setShowWordTemplateGuide] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  useEffect(() => {
    if (open) {
      loadTemplates()
      loadPPCT(ppctGrade)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      loadPPCT(ppctGrade)
    }
  }, [ppctGrade, open])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      // Load default templates
      const [defaultMeeting, defaultEvent, defaultLesson] = await Promise.all([
        getTemplate("default_meeting"),
        getTemplate("default_event"),
        getTemplate("default_lesson"),
      ])

      // Load session templates
      const [sessionMeeting, sessionEvent, sessionLesson] = await Promise.all([
        getTemplate("meeting"),
        getTemplate("event"),
        getTemplate("lesson"),
      ])

      if (defaultMeeting) setDefaultMeetingTemplate({ name: defaultMeeting.name, data: defaultMeeting.data })
      else setDefaultMeetingTemplate(null)

      if (defaultEvent) setDefaultEventTemplate({ name: defaultEvent.name, data: defaultEvent.data })
      else setDefaultEventTemplate(null)

      if (defaultLesson) setDefaultLessonTemplate({ name: defaultLesson.name, data: defaultLesson.data })
      else setDefaultLessonTemplate(null)

      if (sessionMeeting) setSessionMeetingTemplate({ name: sessionMeeting.name, data: sessionMeeting.data })
      else setSessionMeetingTemplate(null)

      if (sessionEvent) setSessionEventTemplate({ name: sessionEvent.name, data: sessionEvent.data })
      else setSessionEventTemplate(null)

      if (sessionLesson) setSessionLessonTemplate({ name: sessionLesson.name, data: sessionLesson.data })
      else setSessionLessonTemplate(null)

      // Show setup guide if no default templates exist
      if (!defaultMeeting && !defaultEvent && !defaultLesson) {
        setShowSetupGuide(true)
      }
    } catch (error) {
      console.error("Error loading templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadPPCT = async (grade: string) => {
    try {
      const data = await getPPCT(grade)
      setPpctData(data || [])
    } catch (error) {
      console.error("Error loading PPCT:", error)
      setPpctData([])
    }
  }

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpload = async (type: TemplateType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".docx")) {
      showMessage("error", "Vui lòng chọn file .docx")
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      await saveTemplate(type, file.name, arrayBuffer)
      await loadTemplates()

      const templateName = type.includes("meeting")
        ? "Biên bản Họp"
        : type.includes("event")
          ? "Kế hoạch Ngoại khóa"
          : "Kế hoạch Bài dạy"
      const isDefault = type.startsWith("default_")
      showMessage("success", `Đã lưu mẫu ${isDefault ? "mặc định " : ""}${templateName}`)

      // Hide setup guide after first upload
      if (isDefault) {
        setShowSetupGuide(false)
      }
    } catch (error) {
      console.error("Error saving template:", error)
      showMessage("error", "Không thể lưu template. Vui lòng thử lại.")
    }

    // Reset input
    event.target.value = ""
  }

  const handleDelete = async (type: TemplateType) => {
    try {
      await deleteTemplate(type)
      await loadTemplates()

      const templateName = type.includes("meeting")
        ? "Biên bản Họp"
        : type.includes("event")
          ? "Kế hoạch Ngoại khóa"
          : "Kế hoạch Bài dạy"
      const isDefault = type.startsWith("default_")
      showMessage("success", `Đã xóa mẫu ${isDefault ? "mặc định " : ""}${templateName}`)
    } catch (error) {
      console.error("Error deleting template:", error)
      showMessage("error", "Không thể xóa template. Vui lòng thử lại.")
    }
  }

  // PPCT Functions
  const handleDownloadPPCTTemplate = async () => {
    try {
      const XLSX = await import("xlsx")

      const wb = XLSX.utils.book_new()

      // Get PPCT data from database based on selected grade
      let ppctDb: PPCTKhoi
      switch (ppctGrade) {
        case "10":
          ppctDb = PPCT_KHOI_10
          break
        case "11":
          ppctDb = PPCT_KHOI_11
          break
        case "12":
          ppctDb = PPCT_KHOI_12
          break
        default:
          ppctDb = PPCT_KHOI_10
      }

      // Create header rows
      const templateData: (string | number)[][] = [
        ["PHÂN PHỐI CHƯƠNG TRÌNH - HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP"],
        ["Sách Kết nối Tri thức với Cuộc sống"],
        [""],
        ["KHỐI:", ppctGrade, "", "", "", "", "", "", ""],
        ["Tổng số tiết:", ppctDb.tong_tiet, "tiết/năm (3 tiết/tuần x 35 tuần)", "", "", "", "", "", ""],
        [""],
        ["Chủ đề", "Tên chủ đề", "Tổng tiết", "SHDC", "HĐGD", "SHL", "Tuần BĐ", "Tuần KT", "Ghi chú"],
      ]

      // Add data from PPCT database
      for (const cd of ppctDb.chu_de) {
        templateData.push([
          cd.chu_de_so,
          cd.ten,
          cd.tong_tiet,
          cd.shdc,
          cd.hdgd,
          cd.shl,
          cd.tuan_bat_dau || "",
          cd.tuan_ket_thuc || "",
          cd.ghi_chu || "",
        ])
      }

      // Add empty rows for editing
      templateData.push(["", "", "", "", "", "", "", "", ""])
      templateData.push(["", "", "", "", "", "", "", "", ""])
      templateData.push(["", "", "", "", "", "", "", "", ""])

      // Add instructions
      templateData.push([""])
      templateData.push(["HƯỚNG DẪN:"])
      templateData.push(["- Chỉnh sửa thông tin trong các cột và lưu file"])
      templateData.push(["- Upload lại file này vào ứng dụng để cập nhật PPCT"])
      templateData.push(["- SHDC: Sinh hoạt dưới cờ, HĐGD: Hoạt động giáo dục theo chủ đề, SHL: Sinh hoạt lớp"])
      templateData.push(["- Tổng tiết = SHDC + HĐGD + SHL (mỗi tuần 3 tiết: 1 SHDC + 1 HĐGD + 1 SHL)"])

      const ws = XLSX.utils.aoa_to_sheet(templateData)
      ws["!cols"] = [
        { wch: 10 }, // Chủ đề
        { wch: 55 }, // Tên chủ đề
        { wch: 10 }, // Tổng tiết
        { wch: 8 }, // SHDC
        { wch: 8 }, // HĐGD
        { wch: 8 }, // SHL
        { wch: 10 }, // Tuần BĐ
        { wch: 10 }, // Tuần KT
        { wch: 40 }, // Ghi chú
      ]

      XLSX.utils.book_append_sheet(wb, ws, "PPCT")
      XLSX.writeFile(wb, `PPCT_HDTN_HN_Khoi_${ppctGrade}_KNTT.xlsx`)

      showMessage("success", `Đã tải mẫu Excel PPCT Khối ${ppctGrade} với ${ppctDb.chu_de.length} chủ đề`)
    } catch (error) {
      console.error("Error creating PPCT template:", error)
      showMessage("error", "Không thể tạo file mẫu")
    }
  }

  const parsePPCTFromText = (text: string): PPCTItem[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    const items: PPCTItem[] = []

    for (const line of lines) {
      // Skip header lines
      if (
        line.includes("PHÂN PHỐI CHƯƠNG TRÌNH") ||
        line.includes("KHỐI:") ||
        line.includes("Tổng số tiết") ||
        line.includes("HƯỚNG DẪN") ||
        line.includes("Chủ đề,Tên chủ đề") ||
        line.includes("Sách Kết nối")
      ) {
        continue
      }

      // Try to parse new format: CĐ số, Tên, Tổng tiết, SHDC, HĐGD, SHL, Tuần BĐ, Tuần KT, Ghi chú
      const newFormatMatch = line.match(/^(\d+),([^,]+),(\d+),(\d+),(\d+),(\d+),(\d*),(\d*),?(.*)$/)
      if (newFormatMatch) {
        const chuDeSo = Number.parseInt(newFormatMatch[1])
        const ten = newFormatMatch[2].trim()
        const tongTiet = Number.parseInt(newFormatMatch[3]) || 9
        const shdc = Number.parseInt(newFormatMatch[4]) || 3
        const hdgd = Number.parseInt(newFormatMatch[5]) || 3
        const shl = Number.parseInt(newFormatMatch[6]) || 3
        const tuanBD = newFormatMatch[7] ? Number.parseInt(newFormatMatch[7]) : undefined
        const tuanKT = newFormatMatch[8] ? Number.parseInt(newFormatMatch[8]) : undefined
        const ghiChu = newFormatMatch[9]?.trim() || ""

        if (ten && chuDeSo) {
          // Convert to PPCTItem format (month = chu_de_so for compatibility)
          items.push({
            month: chuDeSo.toString(),
            theme: ten,
            periods: tongTiet,
            tasks: [
              { name: "SHDC", description: `${shdc} tiết` },
              { name: "HĐGD", description: `${hdgd} tiết` },
              { name: "SHL", description: `${shl} tiết` },
            ],
            notes: ghiChu || (tuanBD && tuanKT ? `Tuần ${tuanBD}-${tuanKT}` : undefined),
          })
        }
        continue
      }

      // Try to parse old CSV format: Tháng, Tên chủ đề, Số tiết, ...
      const csvMatch = line.match(/^(\d{1,2}),([^,]+),(\d+),?(.*)$/)
      if (csvMatch) {
        const month = csvMatch[1]
        const theme = csvMatch[2].trim()
        const periods = Number.parseInt(csvMatch[3]) || 2

        const remainingParts = csvMatch[4] ? csvMatch[4].split(",") : []
        const tasks: { name: string; description: string }[] = []

        for (let i = 0; i < remainingParts.length - 1; i++) {
          const taskDesc = remainingParts[i]?.trim()
          if (taskDesc) {
            tasks.push({ name: `Nhiệm vụ ${i + 1}`, description: taskDesc })
          }
        }

        const notes = remainingParts[remainingParts.length - 1]?.trim() || ""

        if (theme) {
          items.push({ month, theme, periods, tasks: tasks.length > 0 ? tasks : undefined, notes: notes || undefined })
        }
        continue
      }

      // Try to parse text format: "Tháng X: Chủ đề - Y tiết"
      const textMatch = line.match(/[Tt]háng\s*(\d{1,2})[:\s]+([^-–]+)[-–]\s*(\d+)\s*tiết/i)
      if (textMatch) {
        items.push({
          month: textMatch[1],
          theme: textMatch[2].trim(),
          periods: Number.parseInt(textMatch[3]) || 2,
        })
      }
    }

    return items
  }

  const handleUploadPPCTFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPpctFileName(file.name)

    try {
      let text = ""

      if (file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
        text = await file.text()
      } else if (file.name.endsWith(".docx")) {
        const mammoth = await import("mammoth")
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const XLSX = await import("xlsx")
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        text = XLSX.utils.sheet_to_csv(sheet)
      } else {
        showMessage("error", "Định dạng file không được hỗ trợ. Vui lòng dùng .txt, .csv, .docx, .xlsx")
        return
      }

      const parsedItems = parsePPCTFromText(text)

      if (parsedItems.length > 0) {
        setPpctData(parsedItems)
        showMessage("success", `Đã đọc ${parsedItems.length} mục PPCT từ file "${file.name}"`)
      } else {
        showMessage("error", "Không tìm thấy dữ liệu PPCT hợp lệ. Vui lòng kiểm tra định dạng file.")
      }
    } catch (err) {
      console.error("Error parsing PPCT file:", err)
      showMessage("error", "Không thể đọc file. Vui lòng kiểm tra định dạng.")
    }

    e.target.value = ""
  }

  const handleAddPPCTItem = () => {
    if (!newPPCTItem.month || !newPPCTItem.theme) {
      showMessage("error", "Vui lòng điền đầy đủ Tháng và Chủ đề")
      return
    }

    setPpctData((prev) => [...prev, { ...newPPCTItem }])
    setNewPPCTItem({ month: "", theme: "", periods: 2 })
    setShowAddPPCTDialog(false)
    showMessage("success", "Đã thêm mục PPCT mới")
  }

  const handleRemovePPCTItem = (index: number) => {
    setPpctData((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSavePPCT = async () => {
    try {
      await savePPCT(ppctGrade, ppctData)
      showMessage("success", `Đã lưu PPCT cho Khối ${ppctGrade}`)

      // Notify parent component
      if (onPPCTChange) {
        onPPCTChange(ppctGrade, ppctData)
      }
    } catch (error) {
      console.error("Error saving PPCT:", error)
      showMessage("error", "Không thể lưu PPCT")
    }
  }

  // Count uploaded default templates
  const defaultTemplateCount = [defaultMeetingTemplate, defaultEventTemplate, defaultLessonTemplate].filter(
    Boolean,
  ).length

  const TemplateCard = ({
    type,
    title,
    description,
    template,
    isDefault = false,
  }: {
    type: TemplateType
    title: string
    description: string
    template: TemplateInfo | null
    isDefault?: boolean
  }) => (
    <Card
      className={`p-4 border-2 transition-all ${
        template
          ? isDefault
            ? "border-amber-300 bg-amber-50/50"
            : "border-green-300 bg-green-50/50"
          : "border-dashed border-gray-300 bg-gray-50/50"
      } rounded-xl`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                template
                  ? isDefault
                    ? "bg-amber-100 text-amber-600"
                    : "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {template ? (
                isDefault ? (
                  <Star className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )
              ) : (
                <FileText className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
        </div>

        {template ? (
          <div className="space-y-2">
            <div
              className={`flex items-center gap-2 text-xs ${isDefault ? "text-amber-700 bg-amber-100" : "text-green-700 bg-green-100"} px-2 py-1.5 rounded-lg`}
            >
              {isDefault ? <Star className="w-3 h-3" /> : <Check className="w-3 h-3" />}
              <span className="font-medium truncate">{template.name}</span>
            </div>
            <div className="flex gap-2">
              <label className="flex-1">
                <input type="file" accept=".docx" onChange={(e) => handleUpload(type, e)} className="hidden" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer bg-transparent text-xs h-8"
                  asChild
                >
                  <span>
                    <Upload className="w-3 h-3 mr-1" />
                    Thay đổi
                  </span>
                </Button>
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(type)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ) : (
          <label className="block">
            <input type="file" accept=".docx" onChange={(e) => handleUpload(type, e)} className="hidden" />
            <Button
              variant="outline"
              className="w-full cursor-pointer border-dashed bg-transparent text-xs h-8"
              asChild
            >
              <span>
                <Upload className="w-3 h-3 mr-1" />
                Tải lên mẫu .docx
              </span>
            </Button>
          </label>
        )}
      </div>
    </Card>
  )

  const downloadMeetingWordTemplate = async () => {
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
      } = await import("docx")

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header - 2 columns layout simulation
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "TRƯỜNG THPT", bold: true, size: 24 })],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "{{ten_truong}}", bold: true, size: 24 })],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "TỔ {{to_chuyen_mon}}", size: 22 })],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24 }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 24, underline: {} }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              // Title
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "BIÊN BẢN", bold: true, size: 32 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Sinh hoạt định kỳ của tổ/nhóm chuyên môn tháng: {{thang}}/{{nam}}", size: 26 }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Lần: {{lan_hop}}", size: 24 })],
              }),
              new Paragraph({ text: "----------", alignment: AlignmentType.CENTER }),
              new Paragraph({ text: "" }),
              // Section I
              new Paragraph({
                children: [new TextRun({ text: "I. Thời gian và địa điểm:", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Thời gian: Vào lúc......giờ........ phút, ngày .......tháng ...... năm {{nam}}",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Tại trường THPT {{ten_truong}}", size: 24 })],
              }),
              new Paragraph({ text: "" }),
              // Section II
              new Paragraph({
                children: [new TextRun({ text: "II. Thành phần:", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Chủ trì: {{chu_tri}}", size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Thư ký: {{thu_ky}}", size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Thành viên: {{thanh_vien}}", size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Vắng: ........ Lí do...................................", size: 24 })],
              }),
              new Paragraph({ text: "" }),
              // Section III
              new Paragraph({
                children: [new TextRun({ text: "III. Nội dung:", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Tổ trưởng thông qua mục đích, yêu cầu và nội dung của buổi họp và tiến hành từng nội dung cụ thể như sau:",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "1. Đánh giá hoạt động tuần – tháng qua", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Nội dung chính: {{noi_dung_chinh}}", size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "a) Ưu điểm: {{uu_diem}}", size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "b) Hạn chế: {{han_che}}", size: 24 })],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "2. Triển khai kế hoạch tuần – tháng tới", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "{{ke_hoach_thang_toi}}", size: 24 })],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "3. Ý kiến thảo luận", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [new TextRun({ text: "{{y_kien_dong_gop}}", size: 24 })],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "4. Kết luận của chủ trì cuộc họp", bold: true, size: 24 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Các thành viên đồng ý hoàn toàn với ý kiến thảo luận và đóng góp trên.",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Biên bản kết thúc lúc......giờ......phút cùng ngày.", size: 24 })],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({ text: "" }),
              // Signatures
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "CHỦ TRÌ CUỘC HỌP", bold: true, size: 24 })],
                          }),
                          new Paragraph({ text: "" }),
                          new Paragraph({ text: "" }),
                          new Paragraph({ text: "" }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "{{chu_tri}}", size: 24 })],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "THƯ KÝ", bold: true, size: 24 })],
                          }),
                          new Paragraph({ text: "" }),
                          new Paragraph({ text: "" }),
                          new Paragraph({ text: "" }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "{{thu_ky}}", size: 24 })],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc as DocxDocument)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "Mau-Bien-ban-Hop-To.docx"
      a.click()
      URL.revokeObjectURL(url)
      showMessage("success", "Đã tải mẫu Biên bản Họp Tổ")
    } catch (error) {
      console.error("Error creating meeting template:", error)
      showMessage("error", "Không thể tạo mẫu Word")
    }
  }

  const downloadLessonWordTemplate = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import("docx")

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "KẾ HOẠCH GIÁO DỤC CHỦ ĐỀ", bold: true, size: 32 })],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "Trường: THPT {{ten_truong}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "Tổ: {{to_chuyen_mon}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "Họ và tên giáo viên: {{ten_giao_vien}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "Ngày soạn: {{ngay_soan}}", size: 24 })] }),
              new Paragraph({
                children: [new TextRun({ text: "Chủ đề {{chu_de}}: {{ten_chu_de}}", bold: true, size: 26 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Môn học: Hoạt động trải nghiệm, hướng nghiệp; lớp: {{lop}}", size: 24 }),
                ],
              }),
              new Paragraph({ children: [new TextRun({ text: "Thời gian thực hiện: ({{so_tiet}})", size: 24 })] }),
              new Paragraph({ text: "" }),
              // Section I - Mục tiêu
              new Paragraph({ children: [new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: "1. Yêu cầu cần đạt:", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{muc_tieu_kien_thuc}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "2. Năng lực", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{muc_tieu_nang_luc}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "3. Phẩm chất", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{muc_tieu_pham_chat}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              // Section II - Thiết bị
              new Paragraph({ children: [new TextRun({ text: "II. THIẾT BỊ DẠY HỌC", bold: true, size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: "1. Đối với giáo viên", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{gv_chuanbi}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "2. Đối với học sinh", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{hs_chuanbi}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              // Section III - Hoạt động
              new Paragraph({ children: [new TextRun({ text: "III. CÁC HOẠT ĐỘNG DẠY HỌC", bold: true, size: 26 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "GỢI Ý NỘI DUNG SINH HOẠT DƯỚI CỜ VÀ SINH HOẠT LỚP",
                    bold: true,
                    size: 24,
                    underline: {},
                  }),
                ],
              }),
              new Paragraph({ children: [new TextRun({ text: "{{hoat_dong_duoi_co}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [
                  new TextRun({ text: "HOẠT ĐỘNG GIÁO DỤC THEO CHỦ ĐỀ", bold: true, size: 24, underline: {} }),
                ],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "A. HOẠT ĐỘNG KHỞI ĐỘNG", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{hoat_dong_khoi_dong}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "B. HOẠT ĐỘNG KHÁM PHÁ", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{hoat_dong_kham_pha}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "C. HOẠT ĐỘNG LUYỆN TẬP", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{hoat_dong_luyen_tap}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "D. HOẠT ĐỘNG VẬN DỤNG", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{hoat_dong_van_dung}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "E. Tích hợp và hồ sơ:", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{tich_hop_nls}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{tich_hop_dao_duc}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{ho_so_day_hoc}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "HƯỚNG DẪN VỀ NHÀ", bold: true, size: 24, underline: {} })],
              }),
              new Paragraph({ children: [new TextRun({ text: "{{huong_dan_on_tap}}", size: 24 })] }),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc as DocxDocument)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "Mau-Ke-hoach-Bai-day.docx"
      a.click()
      URL.revokeObjectURL(url)
      showMessage("success", "Đã tải mẫu Kế hoạch Bài dạy")
    } catch (error) {
      console.error("Error creating lesson template:", error)
      showMessage("error", "Không thể tạo mẫu Word")
    }
  }

  const downloadEventWordTemplate = async () => {
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
      } = await import("docx")

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "TRƯỜNG THPT {{ten_truong}}", bold: true, size: 22 })],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "TỔ {{to_chuyen_mon}}", size: 22 })],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "Số: {{so_ke_hoach}}/KHNK-HĐTN-HN", size: 20 })],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 24 }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({ text: "Độc lập – Tự do – Hạnh phúc", bold: true, size: 24, underline: {} }),
                            ],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "{{dia_diem}}, ngày ... tháng {{thang}} năm {{nam}}",
                                italics: true,
                                size: 22,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              // Title
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "KẾ HOẠCH", bold: true, size: 32 })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Ngoại khoá khối {{khoi_lop}} - Chủ đề {{chu_de}} "{{ten_chu_de}}"',
                    bold: true,
                    size: 26,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              // Section I - Mục tiêu
              new Paragraph({ children: [new TextRun({ text: "I. MỤC TIÊU", bold: true, size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: "1. Yêu cầu cần đạt:", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{muc_dich_yeu_cau}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "2. Năng lực:", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{nang_luc}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "3. Phẩm chất:", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{pham_chat}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              // Section II - Thời gian địa điểm
              new Paragraph({ children: [new TextRun({ text: "II. THỜI GIAN – ĐỊA ĐIỂM", bold: true, size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: "1. Thời gian: {{thoi_gian}}", size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "2. Địa điểm: {{dia_diem}}", size: 24 })] }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "3. Yêu cầu: Nghiêm túc thực hiện, giáo viên đánh giá tiết dạy theo quy định nhà trường.",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              // Section III - Kinh phí
              new Paragraph({ children: [new TextRun({ text: "III. KINH PHÍ THỰC HIỆN", bold: true, size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{kinh_phi}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              // Thành phần tham dự
              new Paragraph({ children: [new TextRun({ text: "THÀNH PHẦN THAM DỰ", bold: true, size: 26 })] }),
              new Paragraph({
                children: [new TextRun({ text: "1. Toàn thể cán bộ, giáo viên, nhân viên.", size: 24 })],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "2. Giáo viên phụ trách chính (Giảng dạy môn HĐTN, HN): {{giao_vien_phu_trach}}",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: "3. Học sinh: Học sinh khối {{khoi_lop}}.", size: 24 })],
              }),
              new Paragraph({ children: [new TextRun({ text: "4. Trang phục: Đồng phục trường.", size: 24 })] }),
              new Paragraph({ text: "" }),
              // Tổ chức thực hiện
              new Paragraph({ children: [new TextRun({ text: "TỔ CHỨC THỰC HIỆN:", bold: true, size: 26 })] }),
              new Paragraph({ children: [new TextRun({ text: "1. Chuẩn bị:", bold: true, size: 24 })] }),
              new Paragraph({ children: [new TextRun({ text: "{{chuan_bi}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun({ text: "2. Nội dung, hình thức thực hiện:", bold: true, size: 24 })],
              }),
              new Paragraph({ children: [new TextRun({ text: "{{kich_ban_chi_tiet}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({ children: [new TextRun({ text: "{{thong_diep_ket_thuc}}", size: 24 })] }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Trên đây là Kế hoạch tổ chức chương trình ngoại khóa chủ đề "{{ten_chu_de}}" của tổ hoạt động trải nghiệm, hướng nghiệp. Giáo viên và học sinh khối {{khoi_lop}} tham gia nghiêm túc, nhiệt tình để kế hoạch được thực hiện thành công tốt đẹp./.',
                    italics: true,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({ text: "" }),
              // Signatures
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "TỔ TRƯỞNG CHUYÊN MÔN", bold: true, size: 24 })],
                          }),
                          new Paragraph({ text: "" }),
                          new Paragraph({ text: "" }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "{{to_truong}}", size: 24 })],
                          }),
                        ],
                      }),
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "HIỆU TRƯỞNG", bold: true, size: 24 })],
                          }),
                          new Paragraph({ text: "" }),
                          new Paragraph({ text: "" }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "{{hieu_truong}}", size: 24 })],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              // Nơi nhận
              new Paragraph({ children: [new TextRun({ text: "* Nơi nhận:", bold: true, italics: true, size: 22 })] }),
              new Paragraph({ children: [new TextRun({ text: "- BGH (Chỉ đạo)", size: 22 })] }),
              new Paragraph({ children: [new TextRun({ text: "- Tổ HĐTN-HN (thực hiện)", size: 22 })] }),
              new Paragraph({ children: [new TextRun({ text: "- Lớp ....... (Thực hiện)", size: 22 })] }),
              new Paragraph({ children: [new TextRun({ text: "- Lưu", size: 22 })] }),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc as DocxDocument)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "Mau-Ke-hoach-Ngoai-khoa.docx"
      a.click()
      URL.revokeObjectURL(url)
      showMessage("success", "Đã tải mẫu Kế hoạch Ngoại khóa")
    } catch (error) {
      console.error("Error creating event template:", error)
      showMessage("error", "Không thể tạo mẫu Word")
    }
  }
  // End of Word template download functions

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">Cài đặt Mẫu & PPCT</DialogTitle>
            <DialogDescription>
              Quản lý mẫu Word và Phân phối chương trình cho các chức năng xuất file.
            </DialogDescription>
          </DialogHeader>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
            >
              {message.text}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="default" className="gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5" />
                Mẫu mặc định
              </TabsTrigger>
              <TabsTrigger value="session" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" />
                Mẫu phiên
              </TabsTrigger>
              <TabsTrigger value="ppct" className="gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                PPCT
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-1.5 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                Hướng dẫn
              </TabsTrigger>
            </TabsList>

            {/* Default Templates Tab */}
            <TabsContent value="default" className="space-y-4 mt-4">
              {/* Setup Guide for First-time Users */}
              {showSetupGuide && defaultTemplateCount === 0 && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">Thiết lập mẫu mặc định lần đầu</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Tải lên 3 file mẫu Word (.docx) bên dưới. Chỉ cần làm 1 lần, sau đó mẫu sẽ được lưu vĩnh viễn.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowSetupGuide(false)} className="text-xs">
                    Đã hiểu
                  </Button>
                </div>
              )}

              {/* Progress indicator */}
              {defaultTemplateCount > 0 && defaultTemplateCount < 3 && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span>Đã thiết lập {defaultTemplateCount}/3 mẫu mặc định</span>
                  </div>
                </div>
              )}

              {defaultTemplateCount === 3 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Đã thiết lập đầy đủ 3 mẫu mặc định!</span>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-6 text-gray-500 text-sm">Đang tải...</div>
              ) : (
                <div className="space-y-3">
                  <TemplateCard
                    type="default_meeting"
                    title="Mẫu Biên Bản Họp Tổ"
                    description="Template mặc định cho biên bản họp tổ chuyên môn"
                    template={defaultMeetingTemplate}
                    isDefault
                  />
                  <TemplateCard
                    type="default_event"
                    title="Mẫu Kế Hoạch Ngoại Khóa"
                    description="Template mặc định cho kế hoạch ngoại khóa"
                    template={defaultEventTemplate}
                    isDefault
                  />
                  <TemplateCard
                    type="default_lesson"
                    title="Mẫu Kế Hoạch Bài Dạy"
                    description="Template mặc định cho kế hoạch giáo dục chủ đề"
                    template={defaultLessonTemplate}
                    isDefault
                  />
                </div>
              )}
            </TabsContent>

            {/* Session Templates Tab */}
            <TabsContent value="session" className="space-y-4 mt-4">
              <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  <strong>Mẫu phiên làm việc</strong> được ưu tiên sử dụng trước mẫu mặc định.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-6 text-gray-500 text-sm">Đang tải...</div>
              ) : (
                <div className="space-y-3">
                  <TemplateCard
                    type="meeting"
                    title="Mẫu Biên Bản Họp"
                    description="Template cho biên bản họp tổ (phiên này)"
                    template={sessionMeetingTemplate}
                  />
                  <TemplateCard
                    type="event"
                    title="Mẫu Kế Hoạch Ngoại Khóa"
                    description="Template cho kế hoạch ngoại khóa (phiên này)"
                    template={sessionEventTemplate}
                  />
                  <TemplateCard
                    type="lesson"
                    title="Mẫu Kế Hoạch Bài Dạy"
                    description="Template cho KHBD (phiên này)"
                    template={sessionLessonTemplate}
                  />
                </div>
              )}
            </TabsContent>

            {/* PPCT Tab */}
            <TabsContent value="ppct" className="space-y-4 mt-4">
              <div className="flex gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-800">
                  <strong>Phân phối Chương trình (PPCT)</strong> giúp tự động điền nhiệm vụ và gợi ý số tiết khi tạo
                  KHBD.
                </p>
              </div>

              {/* Grade Selection */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Khối:</Label>
                <Select value={ppctGrade} onValueChange={setPpctGrade}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Khối 10</SelectItem>
                    <SelectItem value="11">Khối 11</SelectItem>
                    <SelectItem value="12">Khối 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadPPCTTemplate}>
                  <Download className="w-4 h-4 mr-1" />
                  Tải mẫu Excel
                </Button>
                <input
                  ref={ppctFileRef}
                  type="file"
                  accept=".txt,.csv,.docx,.xlsx,.xls"
                  className="hidden"
                  onChange={handleUploadPPCTFile}
                />
                <Button variant="outline" size="sm" onClick={() => ppctFileRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" />
                  Upload PPCT
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddPPCTDialog(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm thủ công
                </Button>
                {ppctData.length > 0 && (
                  <Button variant="default" size="sm" onClick={handleSavePPCT}>
                    <Save className="w-4 h-4 mr-1" />
                    Lưu PPCT
                  </Button>
                )}
              </div>

              {ppctFileName && <p className="text-xs text-indigo-600">File đã upload: {ppctFileName}</p>}

              {/* PPCT Data Display */}
              {ppctData.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="text-xs text-indigo-600 mb-2">
                    Đã có {ppctData.length} mục PPCT cho Khối {ppctGrade}.
                  </div>
                  {ppctData.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded border space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm w-20">Tháng {item.month}:</span>
                        <span className="flex-1 text-sm font-medium">{item.theme}</span>
                        <span className="text-xs bg-indigo-100 px-2 py-1 rounded">{item.periods} tiết</span>
                        {item.notes && <span className="text-xs text-gray-500 italic">{item.notes}</span>}
                        <Button variant="ghost" size="sm" onClick={() => handleRemovePPCTItem(index)}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      {item.tasks && item.tasks.length > 0 && (
                        <div className="pl-20 space-y-1">
                          <p className="text-xs font-medium text-indigo-700">Các nhiệm vụ:</p>
                          {item.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="bg-indigo-50 px-1.5 py-0.5 rounded">{taskIndex + 1}</span>
                              <span>{task.description}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-indigo-600 space-y-2 p-4 bg-indigo-50/50 rounded-lg">
                  <p>Chưa có PPCT cho Khối {ppctGrade}.</p>
                  <div className="text-xs space-y-1">
                    <p>
                      1. Click <strong>"Tải mẫu Excel"</strong> để tải file mẫu
                    </p>
                    <p>2. Điền thông tin PPCT vào file Excel</p>
                    <p>
                      3. Click <strong>"Upload PPCT"</strong> để tải lên
                    </p>
                    <p>
                      4. Click <strong>"Lưu PPCT"</strong> để lưu vĩnh viễn
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Word Template Guide Tab */}
            <TabsContent value="guide" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Hướng dẫn tạo Mẫu văn bản Word (.docx)
                  </h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Sử dụng các biến placeholder trong file Word để hệ thống tự động thay thế nội dung khi xuất file.
                  </p>
                </div>

                {/* Variables for Meeting Minutes */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">Biên bản Họp Tổ</span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p>
                      <span className="text-blue-600">{"{{ten_truong}}"}</span> - Tên trường
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{to_chuyen_mon}}"}</span> - Tên tổ chuyên môn
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{so_bien_ban}}"}</span> - Số biên bản
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{ngay_hop}}"}</span> - Ngày họp
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{dia_diem}}"}</span> - Địa điểm
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{chu_tri}}"}</span> - Người chủ trì
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{thu_ky}}"}</span> - Thư ký
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{thanh_vien_vang}}"}</span> - Thành viên vắng mặt
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{noi_dung_hop}}"}</span> - Nội dung cuộc họp (AI tạo)
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{ket_luan}}"}</span> - Kết luận cuộc họp
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{ke_hoach_thang_toi}}"}</span> - Kế hoạch tháng tới
                    </p>
                  </div>
                </div>

                {/* Variables for Lesson Plan */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                      Kế hoạch Bài dạy (KHBD)
                    </span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p>
                      <span className="text-green-600">{"{{ten_truong}}"}</span> - Tên trường
                    </p>
                    <p>
                      <span className="text-green-600">{"{{to_chuyen_mon}}"}</span> - Tên tổ chuyên môn
                    </p>
                    <p>
                      <span className="text-green-600">{"{{giao_vien}}"}</span> - Họ tên giáo viên
                    </p>
                    <p>
                      <span className="text-green-600">{"{{khoi_lop}}"}</span> - Khối lớp (10, 11, 12)
                    </p>
                    <p>
                      <span className="text-green-600">{"{{ten_chu_de}}"}</span> - Tên chủ đề
                    </p>
                    <p>
                      <span className="text-green-600">{"{{so_tiet}}"}</span> - Số tiết
                    </p>
                    <p>
                      <span className="text-green-600">{"{{thoi_gian}}"}</span> - Thời gian thực hiện
                    </p>
                    <p>
                      <span className="text-green-600">{"{{muc_tieu}}"}</span> - Mục tiêu (năng lực, phẩm chất)
                    </p>
                    <p>
                      <span className="text-green-600">{"{{thiet_bi}}"}</span> - Thiết bị dạy học
                    </p>
                    <p>
                      <span className="text-green-600">{"{{tien_trinh}}"}</span> - Tiến trình dạy học (AI tạo)
                    </p>
                    <p>
                      <span className="text-green-600">{"{{hoat_dong_khoi_dong}}"}</span> - Hoạt động khởi động
                    </p>
                    <p>
                      <span className="text-green-600">{"{{hoat_dong_kham_pha}}"}</span> - Hoạt động khám phá
                    </p>
                    <p>
                      <span className="text-green-600">{"{{hoat_dong_luyen_tap}}"}</span> - Hoạt động luyện tập
                    </p>
                    <p>
                      <span className="text-green-600">{"{{hoat_dong_van_dung}}"}</span> - Hoạt động vận dụng
                    </p>
                    <p>
                      <span className="text-green-600">{"{{shdc}}"}</span> - Nội dung Sinh hoạt dưới cờ
                    </p>
                    <p>
                      <span className="text-green-600">{"{{shl}}"}</span> - Nội dung Sinh hoạt lớp
                    </p>
                    <p>
                      <span className="text-green-600">{"{{tich_hop_nls}}"}</span> - Tích hợp Năng lực số
                    </p>
                    <p>
                      <span className="text-green-600">{"{{tich_hop_dao_duc}}"}</span> - Tích hợp Đạo đức
                    </p>
                  </div>
                </div>

                {/* Variables for Event Plan */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                      Kế hoạch Ngoại khóa
                    </span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p>
                      <span className="text-purple-600">{"{{ten_truong}}"}</span> - Tên trường
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{to_chuyen_mon}}"}</span> - Tên tổ chuyên môn
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{so_ke_hoach}}"}</span> - Số kế hoạch
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{ten_hoat_dong}}"}</span> - Tên hoạt động ngoại khóa
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{chu_de}}"}</span> - Chủ đề liên quan
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{khoi_lop}}"}</span> - Khối lớp tham gia
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{ngay_to_chuc}}"}</span> - Ngày tổ chức
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{dia_diem}}"}</span> - Địa điểm
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{thoi_luong}}"}</span> - Thời lượng
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{muc_tieu}}"}</span> - Mục tiêu (yêu cầu cần đạt, năng lực,
                      phẩm chất)
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{noi_dung}}"}</span> - Nội dung chương trình (AI tạo)
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{kich_ban}}"}</span> - Kịch bản chi tiết
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{cau_hoi_tuong_tac}}"}</span> - Câu hỏi tương tác
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{thong_diep}}"}</span> - Thông điệp kết thúc
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{kinh_phi}}"}</span> - Kinh phí dự kiến
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{phan_cong}}"}</span> - Phân công nhiệm vụ
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{noi_nhan}}"}</span> - Nơi nhận
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-semibold text-amber-900 text-sm">Lưu ý quan trọng:</h4>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    <li>
                      Biến phải đặt trong cặp dấu ngoặc nhọn kép:{" "}
                      <code className="bg-amber-100 px-1 rounded">{"{{ten_bien}}"}</code>
                    </li>
                    <li>Tên biến phải viết đúng chính tả, không dấu, dùng dấu gạch dưới</li>
                    <li>Nội dung trong biến sẽ được AI tự động tạo hoặc lấy từ thông tin bạn nhập</li>
                    <li>Bạn có thể thêm nội dung cố định xung quanh biến trong mẫu Word</li>
                    <li>Định dạng (font, size, màu...) trong mẫu Word sẽ được giữ nguyên</li>
                  </ul>
                </div>

                {/* Download sample templates */}
                <div className="p-4 bg-gray-50 rounded-xl border space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm">Tải mẫu Word có sẵn:</h4>
                  <p className="text-xs text-gray-600">
                    Bạn có thể tải các mẫu Word mặc định đã được thiết lập sẵn các biến placeholder, sau đó chỉnh sửa
                    theo ý muốn.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadMeetingWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Mẫu Biên bản Họp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadLessonWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Mẫu KHBD
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadEventWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Mẫu Ngoại khóa
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add PPCT Item Dialog */}
      <Dialog open={showAddPPCTDialog} onOpenChange={setShowAddPPCTDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm mục PPCT</DialogTitle>
            <DialogDescription>Thêm chủ đề mới vào Phân phối Chương trình Khối {ppctGrade}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tháng</Label>
                <Select value={newPPCTItem.month} onValueChange={(v) => setNewPPCTItem((p) => ({ ...p, month: v }))}>
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
                <Label>Số tiết</Label>
                <Select
                  value={String(newPPCTItem.periods)}
                  onValueChange={(v) => setNewPPCTItem((p) => ({ ...p, periods: Number.parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} tiết
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Chủ đề / Nội dung</Label>
              <Textarea
                value={newPPCTItem.theme}
                onChange={(e) => setNewPPCTItem((p) => ({ ...p, theme: e.target.value }))}
                placeholder="Nhập tên chủ đề..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú (tùy chọn)</Label>
              <Input
                value={newPPCTItem.notes || ""}
                onChange={(e) => setNewPPCTItem((p) => ({ ...p, notes: e.target.value }))}
                placeholder="VD: Kết hợp với 20/11..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddPPCTDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddPPCTItem}>Thêm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TemplateManager
