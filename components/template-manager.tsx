"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Upload,
  FileText,
  Check,
  Trash2,
  AlertCircle,
  Star,
  Download,
  Plus,
  Save,
  X,
  BookOpen,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import {
  saveTemplate,
  getTemplate,
  deleteTemplate,
  savePPCT,
  getPPCT,
  type TemplateType,
  type PPCTItem,
} from "@/lib/template-storage";
import {
  PPCT_KHOI_10,
  PPCT_KHOI_11,
  PPCT_KHOI_12,
  type PPCTKhoi,
} from "@/lib/data/ppct-database";
import type { Document as DocxDocument } from "docx";
import {
  createMeetingTemplate,
  createLessonTemplate,
  createEventTemplate,
  createAssessmentTemplate,
} from "@/lib/docx-templates";

interface TemplateInfo {
  name: string;
  data: ArrayBuffer;
}

interface TemplateManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // PPCT props - optional, for syncing with main component
  onPPCTChange?: (grade: string, data: PPCTItem[]) => void;
  onTemplateSelect?: (template: any, type: any) => void;
  defaultTemplateStatus?: { meeting: boolean; lesson: boolean; event: boolean };
}

export function TemplateManager({
  open,
  onOpenChange,
  onPPCTChange,
  onTemplateSelect,
}: TemplateManagerProps) {
  const [activeTab, setActiveTab] = useState("default");

  // Default templates state
  const [defaultMeetingTemplate, setDefaultMeetingTemplate] =
    useState<TemplateInfo | null>(null);
  const [defaultEventTemplate, setDefaultEventTemplate] =
    useState<TemplateInfo | null>(null);
  const [defaultLessonTemplate, setDefaultLessonTemplate] =
    useState<TemplateInfo | null>(null);
  const [defaultAssessmentTemplate, setDefaultAssessmentTemplate] =
    useState<TemplateInfo | null>(null);
  const [defaultNcbhTemplate, setDefaultNcbhTemplate] =
    useState<TemplateInfo | null>(null);

  // Session templates state
  const [sessionMeetingTemplate, setSessionMeetingTemplate] =
    useState<TemplateInfo | null>(null);
  const [sessionEventTemplate, setSessionEventTemplate] =
    useState<TemplateInfo | null>(null);
  const [sessionLessonTemplate, setSessionLessonTemplate] =
    useState<TemplateInfo | null>(null);
  const [sessionAssessmentTemplate, setSessionAssessmentTemplate] =
    useState<TemplateInfo | null>(null);
  const [sessionNcbhTemplate, setSessionNcbhTemplate] =
    useState<TemplateInfo | null>(null);

  // PPCT state
  const [ppctGrade, setPpctGrade] = useState("10");
  const [ppctData, setPpctData] = useState<PPCTItem[]>([]);
  const [ppctFileName, setPpctFileName] = useState<string | null>(null);
  const [showAddPPCTDialog, setShowAddPPCTDialog] = useState(false);
  const [newPPCTItem, setNewPPCTItem] = useState<PPCTItem>({
    month: "",
    theme: "",
    periods: 2,
  });
  const ppctFileRef = useRef<HTMLInputElement>(null);

  // Word template creation guide dialog state
  const [showWordTemplateGuide, setShowWordTemplateGuide] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    if (open) {
      loadTemplates();
      loadPPCT(ppctGrade);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      loadPPCT(ppctGrade);
    }
  }, [ppctGrade, open]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Load default templates
      const [defaultMeeting, defaultEvent, defaultLesson, defaultAssessment, defaultNcbh] = await Promise.all([
        getTemplate("default_meeting"),
        getTemplate("default_event"),
        getTemplate("default_lesson"),
        getTemplate("default_assessment"),
        getTemplate("default_ncbh"),
      ]);

      // Load session templates
      const [sessionMeeting, sessionEvent, sessionLesson, sessionAssessment, sessionNcbh] = await Promise.all([
        getTemplate("meeting"),
        getTemplate("event"),
        getTemplate("lesson"),
        getTemplate("assessment"),
        getTemplate("ncbh"),
      ]);

      if (defaultMeeting)
        setDefaultMeetingTemplate({
          name: defaultMeeting.name,
          data: defaultMeeting.data,
        });
      else setDefaultMeetingTemplate(null);

      if (defaultEvent)
        setDefaultEventTemplate({
          name: defaultEvent.name,
          data: defaultEvent.data,
        });
      else setDefaultEventTemplate(null);

      if (defaultLesson)
        setDefaultLessonTemplate({
          name: defaultLesson.name,
          data: defaultLesson.data,
        });
      else setDefaultLessonTemplate(null);

      if (defaultAssessment)
        setDefaultAssessmentTemplate({
          name: defaultAssessment.name,
          data: defaultAssessment.data,
        });
      else setDefaultAssessmentTemplate(null);

      if (defaultNcbh)
        setDefaultNcbhTemplate({
          name: defaultNcbh.name,
          data: defaultNcbh.data,
        });
      else setDefaultNcbhTemplate(null);

      if (sessionMeeting)
        setSessionMeetingTemplate({
          name: sessionMeeting.name,
          data: sessionMeeting.data,
        });
      else setSessionMeetingTemplate(null);

      if (sessionEvent)
        setSessionEventTemplate({
          name: sessionEvent.name,
          data: sessionEvent.data,
        });
      else setSessionEventTemplate(null);

      if (sessionLesson)
        setSessionLessonTemplate({
          name: sessionLesson.name,
          data: sessionLesson.data,
        });
      else setSessionLessonTemplate(null);

      if (sessionAssessment)
        setSessionAssessmentTemplate({
          name: sessionAssessment.name,
          data: sessionAssessment.data,
        });
      else setSessionAssessmentTemplate(null);

      if (sessionNcbh)
        setSessionNcbhTemplate({
          name: sessionNcbh.name,
          data: sessionNcbh.data,
        });
      else setSessionNcbhTemplate(null);

      // Show setup guide if no default templates exist
      if (!defaultMeeting && !defaultEvent && !defaultLesson) {
        setShowSetupGuide(true);
      }
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPPCT = async (grade: string) => {
    try {
      const data = await getPPCT(grade);
      setPpctData(data || []);
    } catch (error) {
      console.error("Error loading PPCT:", error);
      setPpctData([]);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpload = async (
    type: TemplateType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      showMessage("error", "Vui lÃ²ng chá»n file .docx");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      await saveTemplate(type, file.name, arrayBuffer);
      await loadTemplates();

      let templateName = "tÃ i liá»‡u";
      if (type.includes("meeting")) templateName = "BiÃªn báº£n Há»p";
      else if (type.includes("event")) templateName = "Káº¿ hoáº¡ch Ngoáº¡i khÃ³a";
      else if (type.includes("lesson")) templateName = "Káº¿ hoáº¡ch BÃ i dáº¡y";
      else if (type.includes("ncbh")) templateName = "NghiÃªn cá»©u BÃ i há»c";
      else if (type.includes("assessment")) templateName = "Káº¿ hoáº¡ch Kiá»ƒm tra";

      const isDefault = type.startsWith("default_");
      showMessage(
        "success",
        `ÄÃ£ lÆ°u máº«u ${isDefault ? "máº·c Ä‘á»‹nh " : ""}${templateName}`
      );

      // Notify parent component if callback exists
      if (onTemplateSelect && !isDefault) {
        onTemplateSelect({ name: file.name, data: arrayBuffer }, type);
      }

      // Hide setup guide after first upload
      if (isDefault) {
        setShowSetupGuide(false);
      }
    } catch (error) {
      console.error("Error saving template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ lÆ°u template. Vui lÃ²ng thá»­ láº¡i.");
    }

    // Reset input
    event.target.value = "";
  };

  const handleDelete = async (type: TemplateType) => {
    try {
      await deleteTemplate(type);
      await loadTemplates();

      let templateName = "tÃ i liá»‡u";
      if (type.includes("meeting")) templateName = "BiÃªn báº£n Há»p";
      else if (type.includes("event")) templateName = "Káº¿ hoáº¡ch Ngoáº¡i khÃ³a";
      else if (type.includes("lesson")) templateName = "Káº¿ hoáº¡ch BÃ i dáº¡y";
      else if (type.includes("ncbh")) templateName = "NghiÃªn cá»©u BÃ i há»c";
      else if (type.includes("assessment")) templateName = "Káº¿ hoáº¡ch Kiá»ƒm tra";

      const isDefault = type.startsWith("default_");
      showMessage(
        "success",
        `ÄÃ£ xÃ³a máº«u ${isDefault ? "máº·c Ä‘á»‹nh " : ""}${templateName}`
      );

      // Notify parent component if callback exists
      if (onTemplateSelect && !isDefault) {
        onTemplateSelect(null, type);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ xÃ³a template. Vui lÃ²ng thá»­ láº¡i.");
    }
  };

  // PPCT Functions
  const handleDownloadPPCTTemplate = async () => {
    try {
      const XLSX = await import("xlsx");

      const wb = XLSX.utils.book_new();

      // Get PPCT data from database based on selected grade
      let ppctDb: PPCTKhoi;
      switch (ppctGrade) {
        case "10":
          ppctDb = PPCT_KHOI_10;
          break;
        case "11":
          ppctDb = PPCT_KHOI_11;
          break;
        case "12":
          ppctDb = PPCT_KHOI_12;
          break;
        default:
          ppctDb = PPCT_KHOI_10;
      }

      // Create header rows
      const templateData: (string | number)[][] = [
        ["PHÃ‚N PHá»I CHÆ¯Æ NG TRÃŒNH - HOáº T Äá»˜NG TRáº¢I NGHIá»†M, HÆ¯á»šNG NGHIá»†P"],
        ["SÃ¡ch Káº¿t ná»‘i Tri thá»©c vá»›i Cuá»™c sá»‘ng"],
        [""],
        ["KHá»I:", ppctGrade, "", "", "", "", "", "", ""],
        [
          "Tá»•ng sá»‘ tiáº¿t:",
          ppctDb.tong_tiet,
          "tiáº¿t/nÄƒm (3 tiáº¿t/tuáº§n x 35 tuáº§n)",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [""],
        [
          "Chá»§ Ä‘á»",
          "TÃªn chá»§ Ä‘á»",
          "Tá»•ng tiáº¿t",
          "SHDC",
          "HÄGD",
          "SHL",
          "Tuáº§n BÄ",
          "Tuáº§n KT",
          "Ghi chÃº",
        ],
      ];

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
        ]);
      }

      // Add empty rows for editing
      templateData.push(["", "", "", "", "", "", "", "", ""]);
      templateData.push(["", "", "", "", "", "", "", "", ""]);
      templateData.push(["", "", "", "", "", "", "", "", ""]);

      // Add instructions
      templateData.push([""]);
      templateData.push(["HÆ¯á»šNG DáºªN:"]);
      templateData.push(["- Chá»‰nh sá»­a thÃ´ng tin trong cÃ¡c cá»™t vÃ  lÆ°u file"]);
      templateData.push([
        "- Upload láº¡i file nÃ y vÃ o á»©ng dá»¥ng Ä‘á»ƒ cáº­p nháº­t PPCT",
      ]);
      templateData.push([
        "- SHDC: Sinh hoáº¡t dÆ°á»›i cá», HÄGD: Hoáº¡t Ä‘á»™ng giÃ¡o dá»¥c theo chá»§ Ä‘á», SHL: Sinh hoáº¡t lá»›p",
      ]);
      templateData.push([
        "- Tá»•ng tiáº¿t = SHDC + HÄGD + SHL (má»—i tuáº§n 3 tiáº¿t: 1 SHDC + 1 HÄGD + 1 SHL)",
      ]);

      const ws = XLSX.utils.aoa_to_sheet(templateData);
      ws["!cols"] = [
        { wch: 10 }, // Chá»§ Ä‘á»
        { wch: 55 }, // TÃªn chá»§ Ä‘á»
        { wch: 10 }, // Tá»•ng tiáº¿t
        { wch: 8 }, // SHDC
        { wch: 8 }, // HÄGD
        { wch: 8 }, // SHL
        { wch: 10 }, // Tuáº§n BÄ
        { wch: 10 }, // Tuáº§n KT
        { wch: 40 }, // Ghi chÃº
      ];

      XLSX.utils.book_append_sheet(wb, ws, "PPCT");
      XLSX.writeFile(wb, `PPCT_HDTN_HN_Khoi_${ppctGrade}_KNTT.xlsx`);

      showMessage(
        "success",
        `ÄÃ£ táº£i máº«u Excel PPCT Khá»‘i ${ppctGrade} vá»›i ${ppctDb.chu_de.length} chá»§ Ä‘á»`
      );
    } catch (error) {
      console.error("Error creating PPCT template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ táº¡o file máº«u");
    }
  };

  const parsePPCTFromText = (text: string): PPCTItem[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    const items: PPCTItem[] = [];

    for (const line of lines) {
      // Skip header lines
      if (
        line.includes("PHÃ‚N PHá»I CHÆ¯Æ NG TRÃŒNH") ||
        line.includes("KHá»I:") ||
        line.includes("Tá»•ng sá»‘ tiáº¿t") ||
        line.includes("HÆ¯á»šNG DáºªN") ||
        line.includes("Chá»§ Ä‘á»,TÃªn chá»§ Ä‘á»") ||
        line.includes("SÃ¡ch Káº¿t ná»‘i")
      ) {
        continue;
      }

      // Try to parse new format: CÄ sá»‘, TÃªn, Tá»•ng tiáº¿t, SHDC, HÄGD, SHL, Tuáº§n BÄ, Tuáº§n KT, Ghi chÃº
      const newFormatMatch = line.match(
        /^(\d+),([^,]+),(\d+),(\d+),(\d+),(\d+),(\d*),(\d*),?(.*)$/
      );
      if (newFormatMatch) {
        const chuDeSo = Number.parseInt(newFormatMatch[1]);
        const ten = newFormatMatch[2].trim();
        const tongTiet = Number.parseInt(newFormatMatch[3]) || 9;
        const shdc = Number.parseInt(newFormatMatch[4]) || 3;
        const hdgd = Number.parseInt(newFormatMatch[5]) || 3;
        const shl = Number.parseInt(newFormatMatch[6]) || 3;
        const tuanBD = newFormatMatch[7]
          ? Number.parseInt(newFormatMatch[7])
          : undefined;
        const tuanKT = newFormatMatch[8]
          ? Number.parseInt(newFormatMatch[8])
          : undefined;
        const ghiChu = newFormatMatch[9]?.trim() || "";

        if (ten && chuDeSo) {
          // Convert to PPCTItem format (month = chu_de_so for compatibility)
          items.push({
            month: chuDeSo.toString(),
            theme: ten,
            periods: tongTiet,
            tasks: [
              { name: "SHDC", description: `${shdc} tiáº¿t` },
              { name: "HÄGD", description: `${hdgd} tiáº¿t` },
              { name: "SHL", description: `${shl} tiáº¿t` },
            ],
            notes:
              ghiChu ||
              (tuanBD && tuanKT ? `Tuáº§n ${tuanBD}-${tuanKT}` : undefined),
          });
        }
        continue;
      }

      // Try to parse old CSV format: ThÃ¡ng, TÃªn chá»§ Ä‘á», Sá»‘ tiáº¿t, ...
      const csvMatch = line.match(/^(\d{1,2}),([^,]+),(\d+),?(.*)$/);
      if (csvMatch) {
        const month = csvMatch[1];
        const theme = csvMatch[2].trim();
        const periods = Number.parseInt(csvMatch[3]) || 2;

        const remainingParts = csvMatch[4] ? csvMatch[4].split(",") : [];
        const tasks: { name: string; description: string }[] = [];

        for (let i = 0; i < remainingParts.length - 1; i++) {
          const taskDesc = remainingParts[i]?.trim();
          if (taskDesc) {
            tasks.push({ name: `Nhiá»‡m vá»¥ ${i + 1}`, description: taskDesc });
          }
        }

        const notes = remainingParts[remainingParts.length - 1]?.trim() || "";

        if (theme) {
          items.push({
            month,
            theme,
            periods,
            tasks: tasks.length > 0 ? tasks : undefined,
            notes: notes || undefined,
          });
        }
        continue;
      }

      // Try to parse text format: "ThÃ¡ng X: Chá»§ Ä‘á» - Y tiáº¿t"
      const textMatch = line.match(
        /[Tt]hÃ¡ng\s*(\d{1,2})[:\s]+([^-â€“]+)[-â€“]\s*(\d+)\s*tiáº¿t/i
      );
      if (textMatch) {
        items.push({
          month: textMatch[1],
          theme: textMatch[2].trim(),
          periods: Number.parseInt(textMatch[3]) || 2,
        });
      }
    }

    return items;
  };

  const handleUploadPPCTFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPpctFileName(file.name);

    try {
      let text = "";

      if (file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
        text = await file.text();
      } else if (file.name.endsWith(".docx")) {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const XLSX = await import("xlsx");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        text = XLSX.utils.sheet_to_csv(sheet);
      } else {
        showMessage(
          "error",
          "Äá»‹nh dáº¡ng file khÃ´ng Ä‘Æ°á»£c há»— trá»£. Vui lÃ²ng dÃ¹ng .txt, .csv, .docx, .xlsx"
        );
        return;
      }

      const parsedItems = parsePPCTFromText(text);

      if (parsedItems.length > 0) {
        setPpctData(parsedItems);
        showMessage(
          "success",
          `ÄÃ£ Ä‘á»c ${parsedItems.length} má»¥c PPCT tá»« file "${file.name}"`
        );
      } else {
        showMessage(
          "error",
          "KhÃ´ng tÃ¬m tháº¥y dá»¯ liá»‡u PPCT há»£p lá»‡. Vui lÃ²ng kiá»ƒm tra Ä‘á»‹nh dáº¡ng file."
        );
      }
    } catch (err) {
      console.error("Error parsing PPCT file:", err);
      showMessage("error", "KhÃ´ng thá»ƒ Ä‘á»c file. Vui lÃ²ng kiá»ƒm tra Ä‘á»‹nh dáº¡ng.");
    }

    e.target.value = "";
  };

  const handleAddPPCTItem = () => {
    if (!newPPCTItem.month || !newPPCTItem.theme) {
      showMessage("error", "Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ ThÃ¡ng vÃ  Chá»§ Ä‘á»");
      return;
    }

    setPpctData((prev) => [...prev, { ...newPPCTItem }]);
    setNewPPCTItem({ month: "", theme: "", periods: 2 });
    setShowAddPPCTDialog(false);
    showMessage("success", "ÄÃ£ thÃªm má»¥c PPCT má»›i");
  };

  const handleRemovePPCTItem = (index: number) => {
    setPpctData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSavePPCT = async () => {
    try {
      await savePPCT(ppctGrade, ppctData);
      showMessage("success", `ÄÃ£ lÆ°u PPCT cho Khá»‘i ${ppctGrade}`);

      // Notify parent component
      if (onPPCTChange) {
        onPPCTChange(ppctGrade, ppctData);
      }
    } catch (error) {
      console.error("Error saving PPCT:", error);
      showMessage("error", "KhÃ´ng thá»ƒ lÆ°u PPCT");
    }
  };

  // Count uploaded default templates
  const defaultTemplateCount = [
    defaultMeetingTemplate,
    defaultEventTemplate,
    defaultLessonTemplate,
  ].filter(Boolean).length;

  const TemplateCard = ({
    type,
    title,
    description,
    template,
    isDefault = false,
  }: {
    type: TemplateType;
    title: string;
    description: string;
    template: TemplateInfo | null;
    isDefault?: boolean;
  }) => (
    <Card
      className={`p-4 border-2 transition-all ${template
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
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${template
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
              className={`flex items-center gap-2 text-xs ${isDefault
                ? "text-amber-700 bg-amber-100"
                : "text-green-700 bg-green-100"
                } px-2 py-1.5 rounded-lg`}
            >
              {isDefault ? (
                <Star className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              <span className="font-medium truncate">{template.name}</span>
            </div>
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => handleUpload(type, e)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer bg-transparent text-xs h-8"
                  asChild
                >
                  <span>
                    <Upload className="w-3 h-3 mr-1" />
                    Thay Ä‘á»•i
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
            <input
              type="file"
              accept=".docx"
              onChange={(e) => handleUpload(type, e)}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full cursor-pointer border-dashed bg-transparent text-xs h-8"
              asChild
            >
              <span>
                <Upload className="w-3 h-3 mr-1" />
                Táº£i lÃªn máº«u .docx
              </span>
            </Button>
          </label>
        )}
      </div>
    </Card>
  );

  const downloadMeetingWordTemplate = async () => {
    try {
      const blob = await createMeetingTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau-Bien-ban-Hop-To.docx";
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", "ÄÃ£ táº£i máº«u BiÃªn báº£n Há»p Tá»•");
    } catch (error) {
      console.error("Error creating meeting template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ táº¡o máº«u Word");
    }
  };

  const downloadLessonWordTemplate = async () => {
    try {
      const blob = await createLessonTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau-Ke-hoach-Bai-day.docx";
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", "ÄÃ£ táº£i máº«u Káº¿ hoáº¡ch BÃ i dáº¡y");
    } catch (error) {
      console.error("Error creating lesson template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ táº¡o máº«u Word");
    }
  };

  const downloadAssessmentWordTemplate = async () => {
    try {
      const blob = await createAssessmentTemplate();
      // Download the file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau-Ke-hoach-Kiem-tra.docx";
      a.click();
      URL.revokeObjectURL(url);
      // Also save to IDB as default_assessment
      const arrayBuffer = await blob.arrayBuffer();
      await saveTemplate("default_assessment" as any, "Mau_Ke_Hoach_Kiem_Tra.docx", arrayBuffer);
      await loadTemplates();
      showMessage("success", "ÄÃ£ táº£i vÃ  lÆ°u máº«u Káº¿ hoáº¡ch Kiá»ƒm tra");
    } catch (error) {
      console.error("Error creating Assessment Word template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ táº¡o file máº«u Word");
    }
  };

  const downloadEventWordTemplate = async () => {
    try {
      const blob = await createEventTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau-Ke-hoach-Ngoai-khoa.docx";
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", "ÄÃ£ táº£i máº«u Káº¿ hoáº¡ch Ngoáº¡i khÃ³a");
    } catch (error) {
      console.error("Error creating event template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ táº¡o máº«u Word");
    }
  };

  const downloadNCBHWordTemplate = async () => {
    try {
      const { createNCBHTemplate } = await import("@/lib/docx-templates");
      const blob = await createNCBHTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mau-Nghien-cuu-Bai-hoc.docx";
      a.click();
      URL.revokeObjectURL(url);

      // Also save to IDB as default_ncbh
      const arrayBuffer = await blob.arrayBuffer();
      await saveTemplate("default_ncbh" as any, "Mau_Nghien_Cuu_Bai_Hoc.docx", arrayBuffer);
      await loadTemplates();

      showMessage("success", "ÄÃ£ táº£i vÃ  lÆ°u máº«u NghiÃªn cá»©u BÃ i há»c");
    } catch (error) {
      console.error("Error creating NCBH template:", error);
      showMessage("error", "KhÃ´ng thá»ƒ táº¡o máº«u Word");
    }
  };

  // End of Word template download functions

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              CÃ i Ä‘áº·t Máº«u & PPCT
            </DialogTitle>
            <DialogDescription>
              Quáº£n lÃ½ máº«u xuáº¥t file Word
            </DialogDescription>
          </DialogHeader>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
                }`}
            >
              {message.text}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              <TabsTrigger value="default" className="gap-1.5 text-xs">
                <Star className="w-3.5 h-3.5" />
                Máº«u
              </TabsTrigger>
              <TabsTrigger value="session" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" />
                PhiÃªn
              </TabsTrigger>
              <TabsTrigger value="ppct" className="gap-1.5 text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                PPCT
              </TabsTrigger>
              <TabsTrigger value="ncbh" className="gap-1.5 text-xs">
                <Zap className="w-3.5 h-3.5" />
                NCBH
              </TabsTrigger>
              <TabsTrigger value="khtt" className="gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                KTÄG
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-1.5 text-xs">
                <HelpCircle className="w-3.5 h-3.5" />
                HD
              </TabsTrigger>
            </TabsList>

            {/* Default Templates Tab */}
            <TabsContent value="default" className="space-y-4 mt-4">
              {/* Setup Guide */}
              {showSetupGuide && defaultTemplateCount < 4 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start justify-between">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">
                        Thiáº¿t láº­p máº«u máº·c Ä‘á»‹nh láº§n Ä‘áº§u
                      </h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Táº£i lÃªn cÃ¡c file máº«u Word (.docx). Chá»‰ cáº§n lÃ m 1 láº§n, sau Ä‘Ã³ máº«u sáº½ Ä‘Æ°á»£c lÆ°u vÄ©nh viá»…n.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSetupGuide(false)}
                    className="text-xs"
                  >
                    ÄÃ£ hiá»ƒu
                  </Button>
                </div>
              )}

              {/* Progress indicator */}
              {defaultTemplateCount > 0 && defaultTemplateCount < 4 && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    <Star className="w-4 h-4 text-amber-600" />
                    <span>
                      ÄÃ£ thiáº¿t láº­p {defaultTemplateCount} máº«u máº·c Ä‘á»‹nh
                    </span>
                  </div>
                </div>
              )}

              {defaultTemplateCount === 4 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>ÄÃ£ thiáº¿t láº­p Ä‘áº§y Ä‘á»§ cÃ¡c máº«u máº·c Ä‘á»‹nh!</span>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  Äang táº£i...
                </div>
              ) : (
                <div className="space-y-3">
                  <TemplateCard
                    type="default_meeting"
                    title="Máº«u BiÃªn Báº£n Há»p Tá»•"
                    description="Template máº·c Ä‘á»‹nh cho biÃªn báº£n há»p tá»• chuyÃªn mÃ´n"
                    template={defaultMeetingTemplate}
                    isDefault
                  />
                  <TemplateCard
                    type="default_event"
                    title="Máº«u Káº¿ Hoáº¡ch Ngoáº¡i KhÃ³a"
                    description="Template máº·c Ä‘á»‹nh cho káº¿ hoáº¡ch ngoáº¡i khÃ³a"
                    template={defaultEventTemplate}
                    isDefault
                  />
                  <TemplateCard
                    type="default_lesson"
                    title="Máº«u KHBD (Báº£ng 2 Cá»™t)"
                    description="Máº«u Káº¿ hoáº¡ch bÃ i dáº¡y chuáº©n 2 cá»™t (Xu hÆ°á»›ng 2024-2025)"
                    template={defaultLessonTemplate}
                    isDefault
                  />
                  <TemplateCard
                    type="default_ncbh"
                    title="Máº«u NghiÃªn Cá»©u BÃ i Há»c"
                    description="Template máº·c Ä‘á»‹nh cho há»“ sÆ¡ & biÃªn báº£n NCBH"
                    template={defaultNcbhTemplate}
                    isDefault
                  />
                  {!defaultNcbhTemplate && (
                    <div className="flex justify-end mt-1 mb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 h-8 text-xs"
                        onClick={downloadNCBHWordTemplate}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Táº¡o máº«u NCBH chuáº©n
                      </Button>
                    </div>
                  )}
                  <div className="pt-4 border-t border-dashed">
                    <TemplateCard
                      type="default_assessment"
                      title="Máº«u Káº¿ Hoáº¡ch Kiá»ƒm Tra"
                      description="Template máº·c Ä‘á»‹nh cho káº¿ hoáº¡ch kiá»ƒm tra Ä‘Ã¡nh giÃ¡"
                      template={defaultAssessmentTemplate}
                      isDefault
                    />
                    {!defaultAssessmentTemplate && (
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                          onClick={downloadAssessmentWordTemplate}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Táº¡o máº«u Kiá»ƒm tra chuáº©n
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Session Templates Tab */}
            <TabsContent value="session" className="space-y-4 mt-4">
              <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  <strong>Máº«u phiÃªn lÃ m viá»‡c</strong> Ä‘Æ°á»£c Æ°u tiÃªn sá»­ dá»¥ng trÆ°á»›c
                  máº«u máº·c Ä‘á»‹nh.
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-6 text-gray-500 text-sm">
                  Äang táº£i...
                </div>
              ) : (
                <div className="space-y-3">
                  <TemplateCard
                    type="meeting"
                    title="Máº«u BiÃªn Báº£n Há»p"
                    description="Template cho biÃªn báº£n há»p tá»• (phiÃªn nÃ y)"
                    template={sessionMeetingTemplate}
                  />
                  <TemplateCard
                    type="event"
                    title="Máº«u Káº¿ Hoáº¡ch Ngoáº¡i KhÃ³a"
                    description="Template cho káº¿ hoáº¡ch ngoáº¡i khÃ³a (phiÃªn nÃ y)"
                    template={sessionEventTemplate}
                  />
                  <TemplateCard
                    type="lesson"
                    title="Máº«u Káº¿ Hoáº¡ch BÃ i Dáº¡y"
                    description="Template cho KHBD (phiÃªn nÃ y)"
                    template={sessionLessonTemplate}
                  />
                  <TemplateCard
                    type="ncbh"
                    title="Máº«u NghiÃªn Cá»©u BÃ i Há»c"
                    description="Template cho NCBH (phiÃªn nÃ y)"
                    template={sessionNcbhTemplate}
                  />
                  <TemplateCard
                    type="assessment"
                    title="Máº«u Káº¿ Hoáº¡ch Kiá»ƒm Tra"
                    description="Template cho Káº¿ hoáº¡ch kiá»ƒm tra (phiÃªn nÃ y)"
                    template={sessionAssessmentTemplate}
                  />
                </div>
              )}
            </TabsContent>


            {/* PPCT Tab */}
            <TabsContent value="ppct" className="space-y-4 mt-4">
              <div className="flex gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-800">
                  <strong>PhÃ¢n phá»‘i ChÆ°Æ¡ng trÃ¬nh (PPCT)</strong> giÃºp tá»± Ä‘á»™ng
                  Ä‘iá»n nhiá»‡m vá»¥ vÃ  gá»£i Ã½ sá»‘ tiáº¿t khi táº¡o KHBD.
                </p>
              </div>

              {/* Grade Selection */}
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Khá»‘i:</Label>
                <Select value={ppctGrade} onValueChange={setPpctGrade}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Khá»‘i 10</SelectItem>
                    <SelectItem value="11">Khá»‘i 11</SelectItem>
                    <SelectItem value="12">Khá»‘i 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPPCTTemplate}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Táº£i máº«u Excel
                </Button>
                <input
                  ref={ppctFileRef}
                  type="file"
                  accept=".txt,.csv,.docx,.xlsx,.xls"
                  className="hidden"
                  onChange={handleUploadPPCTFile}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => ppctFileRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload PPCT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddPPCTDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  ThÃªm thá»§ cÃ´ng
                </Button>
                {ppctData.length > 0 && (
                  <Button variant="default" size="sm" onClick={handleSavePPCT}>
                    <Save className="w-4 h-4 mr-1" />
                    LÆ°u PPCT
                  </Button>
                )}
              </div>

              {ppctFileName && (
                <p className="text-xs text-indigo-600">
                  File Ä‘Ã£ upload: {ppctFileName}
                </p>
              )}

              {/* PPCT Data Display */}
              {ppctData.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  <div className="text-xs text-indigo-600 mb-2">
                    ÄÃ£ cÃ³ {ppctData.length} má»¥c PPCT cho Khá»‘i {ppctGrade}.
                  </div>
                  {ppctData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded border space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm w-20">
                          ThÃ¡ng {item.month}:
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {item.theme}
                        </span>
                        <span className="text-xs bg-indigo-100 px-2 py-1 rounded">
                          {item.periods} tiáº¿t
                        </span>
                        {item.notes && (
                          <span className="text-xs text-gray-500 italic">
                            {item.notes}
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePPCTItem(index)}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      {item.tasks && item.tasks.length > 0 && (
                        <div className="pl-20 space-y-1">
                          <p className="text-xs font-medium text-indigo-700">
                            CÃ¡c nhiá»‡m vá»¥:
                          </p>
                          {item.tasks.map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="text-xs text-gray-600 flex items-start gap-2"
                            >
                              <span className="bg-indigo-50 px-1.5 py-0.5 rounded">
                                {taskIndex + 1}
                              </span>
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
                  <p>ChÆ°a cÃ³ PPCT cho Khá»‘i {ppctGrade}.</p>
                  <div className="text-xs space-y-1">
                    <p>
                      1. Click <strong>"Táº£i máº«u Excel"</strong> Ä‘á»ƒ táº£i file máº«u
                    </p>
                    <p>2. Äiá»n thÃ´ng tin PPCT vÃ o file Excel</p>
                    <p>
                      3. Click <strong>"Upload PPCT"</strong> Ä‘á»ƒ táº£i lÃªn
                    </p>
                    <p>
                      4. Click <strong>"LÆ°u PPCT"</strong> Ä‘á»ƒ lÆ°u vÄ©nh viá»…n
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* KHTT - Káº¿ hoáº¡ch Kiá»ƒm tra Tab */}
            <TabsContent value="khtt" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Máº«u Káº¿ hoáº¡ch Kiá»ƒm tra ÄÃ¡nh giÃ¡
                  </h3>
                  <p className="text-xs text-indigo-700 mb-3">
                    Táº£i máº«u Word Ä‘á»ƒ xem trÆ°á»›c vÃ  chá»‰nh sá»­a cáº¥u trÃºc káº¿ hoáº¡ch kiá»ƒm tra theo nhu cáº§u cá»§a báº¡n.
                  </p>
                </div>

                {/* Download Buttons */}
                <div className="grid grid-cols-1 gap-3">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-gray-800">Máº«u Káº¿ hoáº¡ch Kiá»ƒm tra chuáº©n</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          File Word vá»›i cÃ¡c placeholder Ä‘á»ƒ xuáº¥t Káº¿ hoáº¡ch Kiá»ƒm tra
                        </p>
                      </div>
                      <Button
                        onClick={downloadAssessmentWordTemplate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Táº£i máº«u
                      </Button>
                    </div>
                  </Card>

                  {defaultAssessmentTemplate && (
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <div>
                            <h4 className="font-medium text-sm text-green-800">ÄÃ£ cÃ³ máº«u máº·c Ä‘á»‹nh</h4>
                            <p className="text-xs text-green-600">{defaultAssessmentTemplate.name}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete("default_assessment" as any)}
                          className="text-red-600 border-red-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          XÃ³a
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Placeholder Variables */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800">
                    CÃ¡c biáº¿n placeholder trong máº«u
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p><span className="text-blue-600">{"{{ten_truong}}"}</span> - TÃªn trÆ°á»ng</p>
                    <p><span className="text-blue-600">{"{{to_chuyen_mon}}"}</span> - TÃªn tá»• chuyÃªn mÃ´n</p>
                    <p><span className="text-blue-600">{"{{hoc_ky}}"}</span> - Há»c ká»³</p>
                    <p><span className="text-blue-600">{"{{khoi}}"}</span> - Khá»‘i lá»›p</p>
                    <p><span className="text-blue-600">{"{{ky_danh_gia}}"}</span> - Ká»³ Ä‘Ã¡nh giÃ¡</p>
                    <p><span className="text-blue-600">{"{{ten_chu_de}}"}</span> - TÃªn chá»§ Ä‘á»</p>
                    <p><span className="text-blue-600">{"{{san_pham}}"}</span> - Loáº¡i sáº£n pháº©m</p>
                    <p><span className="text-blue-600">{"{{muc_tieu}}"}</span> - Má»¥c tiÃªu Ä‘Ã¡nh giÃ¡</p>
                    <p><span className="text-blue-600">{"{{noi_dung_nhiem_vu}}"}</span> - Ná»™i dung nhiá»‡m vá»¥</p>
                    <p><span className="text-blue-600">{"{{hinh_thuc_to_chuc}}"}</span> - HÃ¬nh thá»©c tá»• chá»©c</p>
                    <p><span className="text-blue-600">{"{{ma_tran_dac_ta}}"}</span> - Ma tráº­n Ä‘áº·c táº£</p>
                    <p><span className="text-blue-600">{"{{bang_kiem_rubric}}"}</span> - Rubric Ä‘Ã¡nh giÃ¡</p>
                    <p><span className="text-blue-600">{"{{loi_khuyen}}"}</span> - Lá»i khuyÃªn cho giÃ¡o viÃªn</p>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-yellow-700">
                      <p className="font-medium">LÆ°u Ã½ quan trá»ng:</p>
                      <p className="mt-1">
                        Hiá»‡n táº¡i, chá»©c nÄƒng xuáº¥t Káº¿ hoáº¡ch Kiá»ƒm tra sá»­ dá»¥ng thÆ° viá»‡n táº¡o file Word trá»±c tiáº¿p
                        thay vÃ¬ dÃ¹ng template, Ä‘á»ƒ Ä‘áº£m báº£o tÃ­nh á»•n Ä‘á»‹nh. Máº«u nÃ y chá»‰ Ä‘á»ƒ tham kháº£o cáº¥u trÃºc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* NCBH Tab */}
            <TabsContent value="ncbh" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                  <h3 className="font-semibold text-rose-900 text-sm mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Máº«u NghiÃªn Cá»©u BÃ i Há»c (NCBH)
                  </h3>
                  <p className="text-xs text-rose-700 mb-3">
                    Há»“ sÆ¡ NCBH káº¿t há»£p giá»¯a Giai Ä‘oáº¡n 1 (Thiáº¿t káº¿) vÃ  Giai Ä‘oáº¡n 2 & 3 (PhÃ¢n tÃ­ch bÃ i há»c).
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-gray-800">Máº«u NCBH máº·c Ä‘á»‹nh (Code)</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          File Word chuáº©n 2024-2025 vá»›i Ä‘áº§y Ä‘á»§ biáº¿n placeholder.
                        </p>
                      </div>
                      <Button
                        onClick={downloadNCBHWordTemplate}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Táº£i máº«u chuáº©n
                      </Button>
                    </div>
                  </Card>

                  {defaultNcbhTemplate && (
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <div>
                            <h4 className="font-medium text-sm text-green-800">ÄÃ£ kÃ­ch hoáº¡t máº«u máº·c Ä‘á»‹nh</h4>
                            <p className="text-xs text-green-600">{defaultNcbhTemplate.name}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete("default_ncbh" as any)}
                          className="text-red-600 border-red-200 h-8 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          XÃ³a
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Word Template Guide Tab */}
            <TabsContent value="guide" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    HÆ°á»›ng dáº«n táº¡o Máº«u vÄƒn báº£n Word (.docx)
                  </h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Sá»­ dá»¥ng cÃ¡c biáº¿n placeholder trong file Word Ä‘á»ƒ há»‡ thá»‘ng tá»±
                    Ä‘á»™ng thay tháº¿ ná»™i dung khi xuáº¥t file.
                  </p>
                </div>

                {/* Variables for Meeting Minutes */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">
                      BiÃªn báº£n Há»p Tá»•
                    </span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p>
                      <span className="text-blue-600">{"{{ten_truong}}"}</span>{" "}
                      - TÃªn trÆ°á»ng
                    </p>
                    <p>
                      <span className="text-blue-600">
                        {"{{to_chuyen_mon}}"}
                      </span>{" "}
                      - TÃªn tá»• chuyÃªn mÃ´n
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{so_bien_ban}}"}</span>{" "}
                      - Sá»‘ biÃªn báº£n
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{ngay_hop}}"}</span> -
                      NgÃ y há»p
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{dia_diem}}"}</span> -
                      Äá»‹a Ä‘iá»ƒm
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{chu_tri}}"}</span> -
                      NgÆ°á»i chá»§ trÃ¬
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{thu_ky}}"}</span> -
                      ThÆ° kÃ½
                    </p>
                    <p>
                      <span className="text-blue-600">
                        {"{{thanh_vien_vang}}"}
                      </span>{" "}
                      - ThÃ nh viÃªn váº¯ng máº·t
                    </p>
                    <p>
                      <span className="text-blue-600">
                        {"{{noi_dung_hop}}"}
                      </span>{" "}
                      - Ná»™i dung cuá»™c há»p (AI táº¡o)
                    </p>
                    <p>
                      <span className="text-blue-600">{"{{ket_luan}}"}</span> -
                      Káº¿t luáº­n cuá»™c há»p
                    </p>
                    <p>
                      <span className="text-blue-600">
                        {"{{ke_hoach_thang_toi}}"}
                      </span>{" "}
                      - Káº¿ hoáº¡ch thÃ¡ng tá»›i
                    </p>
                  </div>
                </div>

                {/* Variables for Lesson Plan */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                        Káº¿ hoáº¡ch BÃ i dáº¡y (KHBD 2 Cá»™t)
                      </span>
                    </h4>
                    <span className="text-[10px] text-amber-600 font-medium px-2 py-0.5 bg-amber-50 rounded border border-amber-100">
                      KhuyÃªn dÃ¹ng 2024-2025
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ThÃ´ng tin chung</p>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono border border-slate-100">
                        <p><span className="text-green-600">{"{{ten_truong}}"}</span> - TÃªn trÆ°á»ng</p>
                        <p><span className="text-green-600">{"{{to_chuyen_mon}}"}</span> - Tá»• chuyÃªn mÃ´n</p>
                        <p><span className="text-green-600">{"{{ten_giao_vien}}"}</span> - Há» tÃªn giÃ¡o viÃªn</p>
                        <p><span className="text-green-600">{"{{ngay_soan}}"}</span> - NgÃ y soáº¡n bÃ i</p>
                        <p><span className="text-green-600">{"{{chu_de}}"}</span> - Sá»‘ thá»© tá»± chá»§ Ä‘á»</p>
                        <p><span className="text-green-600">{"{{ten_chu_de}}"}</span> - TÃªn chá»§ Ä‘á» há»c táº­p</p>
                        <p><span className="text-green-600">{"{{lop}}"}</span> - Khá»‘i lá»›p (10/11/12)</p>
                        <p><span className="text-green-600">{"{{so_tiet}}"}</span> - Tá»•ng sá»‘ tiáº¿t</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Má»¥c tiÃªu & Chuáº©n bá»‹</p>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono border border-slate-100">
                        <p><span className="text-green-600">{"{{muc_tieu_kien_thuc}}"}</span> - YÃªu cáº§u cáº§n Ä‘áº¡t</p>
                        <p><span className="text-green-600">{"{{muc_tieu_nang_luc}}"}</span> - NÄƒng lá»±c</p>
                        <p><span className="text-green-600">{"{{muc_tieu_pham_chat}}"}</span> - Pháº©m cháº¥t</p>
                        <p><span className="text-green-600">{"{{gv_chuan_bi}}"}</span> - Chuáº©n bá»‹ cá»§a GV</p>
                        <p><span className="text-green-600">{"{{hs_chuan_bi}}"}</span> - Chuáº©n bá»‹ cá»§a HS</p>
                        <p><span className="text-green-600">{"{{shdc}}"}</span> - Sinh hoáº¡t dÆ°á»›i cá»</p>
                        <p><span className="text-green-600">{"{{shl}}"}</span> - Sinh hoáº¡t lá»›p</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tiáº¿n trÃ¬nh (DÃ nh cho báº£ng 2 Cá»™t)</p>
                    <div className="bg-indigo-50/50 rounded-lg p-3 space-y-2 text-[11px] border border-indigo-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-indigo-900 border-b border-indigo-100 pb-1 mb-1">Cá»˜T 1: ThÃ´ng tin HÄ</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_khoi_dong_cot_1}}"}</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_kham_pha_cot_1}}"}</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_luyen_tap_cot_1}}"}</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_van_dung_cot_1}}"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-indigo-900 border-b border-indigo-100 pb-1 mb-1">Cá»˜T 2: Tá»• chá»©c thá»±c hiá»‡n</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_khoi_dong_cot_2}}"}</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_kham_pha_cot_2}}"}</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_luyen_tap_cot_2}}"}</p>
                          <p className="font-mono text-indigo-600">{"{{hoat_dong_van_dung_cot_2}}"}</p>
                        </div>
                      </div>
                      <p className="text-indigo-700 italic mt-2 py-1 px-2 bg-white rounded border border-indigo-50">
                        * Máº¹o: Thiáº¿t káº¿ báº£ng 2 cá»™t trong Word, Ä‘iá»n cÃ¡c biáº¿n tÆ°Æ¡ng á»©ng vÃ o tá»«ng Ã´ Ä‘á»ƒ ná»™i dung tá»± Ä‘á»™ng tÃ¡ch biá»‡t.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phá»¥ lá»¥c & KhÃ¡c</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono border border-slate-100">
                      <p><span className="text-green-600">{"{{ho_so_day_hoc}}"}</span> - Phá»¥ lá»¥c / Phiáº¿u há»c táº­p / Rubric</p>
                      <p><span className="text-green-600">{"{{huong_dan_ve_nha}}"}</span> - HÆ°á»›ng dáº«n vá» nhÃ </p>
                      <p><span className="text-green-600">{"{{tich_hop_nls}}"}</span> - Báº£ng tá»•ng há»£p tÃ­ch há»£p NLS</p>
                      <p><span className="text-green-600">{"{{tich_hop_dao_duc}}"}</span> - Báº£ng tá»•ng há»£p GD Ä‘áº¡o Ä‘á»©c</p>
                    </div>
                  </div>
                </div>

                {/* Variables for Event Plan */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                      Káº¿ hoáº¡ch Ngoáº¡i khÃ³a
                    </span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p>
                      <span className="text-purple-600">
                        {"{{ten_truong}}"}
                      </span>{" "}
                      - TÃªn trÆ°á»ng
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{to_chuyen_mon}}"}
                      </span>{" "}
                      - TÃªn tá»• chuyÃªn mÃ´n
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{so_ke_hoach}}"}
                      </span>{" "}
                      - Sá»‘ káº¿ hoáº¡ch
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{ten_hoat_dong}}"}
                      </span>{" "}
                      - TÃªn hoáº¡t Ä‘á»™ng ngoáº¡i khÃ³a
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{chu_de}}"}</span> -
                      Chá»§ Ä‘á» liÃªn quan
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{khoi_lop}}"}</span>{" "}
                      - Khá»‘i lá»›p tham gia
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{ngay_to_chuc}}"}
                      </span>{" "}
                      - NgÃ y tá»• chá»©c
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{dia_diem}}"}</span>{" "}
                      - Äá»‹a Ä‘iá»ƒm
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{thoi_luong}}"}
                      </span>{" "}
                      - Thá»i lÆ°á»£ng
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{muc_tieu}}"}</span>{" "}
                      - Má»¥c tiÃªu (yÃªu cáº§u cáº§n Ä‘áº¡t, nÄƒng lá»±c, pháº©m cháº¥t)
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{noi_dung}}"}</span>{" "}
                      - Ná»™i dung chÆ°Æ¡ng trÃ¬nh (AI táº¡o)
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{kich_ban}}"}</span>{" "}
                      - Ká»‹ch báº£n chi tiáº¿t
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{cau_hoi_tuong_tac}}"}
                      </span>{" "}
                      - CÃ¢u há»i tÆ°Æ¡ng tÃ¡c
                    </p>
                    <p>
                      <span className="text-purple-600">
                        {"{{thong_diep}}"}
                      </span>{" "}
                      - ThÃ´ng Ä‘iá»‡p káº¿t thÃºc
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{kinh_phi}}"}</span>{" "}
                      - Kinh phÃ­ dá»± kiáº¿n
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{phan_cong}}"}</span>{" "}
                      - PhÃ¢n cÃ´ng nhiá»‡m vá»¥
                    </p>
                    <p>
                      <span className="text-purple-600">{"{{noi_nhan}}"}</span>{" "}
                      - NÆ¡i nháº­n
                    </p>
                  </div>
                </div>

                {/* Variables for NCBH */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
                      NghiÃªn cá»©u bÃ i há»c (NCBH)
                    </span>
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-xs font-mono">
                    <p><span className="text-red-600">{"{{ten_truong}}"}</span> - TÃªn trÆ°á»ng</p>
                    <p><span className="text-red-600">{"{{to_chuyen_mon}}"}</span> - TÃªn tá»• chuyÃªn mÃ´n</p>
                    <p><span className="text-red-600">{"{{ten_bai}}"}</span> - TÃªn bÃ i há»c nghiÃªn cá»©u</p>
                    <p><span className="text-red-600">{"{{ngay_thuc_hien}}"}</span> - NgÃ y thá»±c hiá»‡n/Ghi biÃªn báº£n</p>
                    <p><span className="text-red-600">{"{{ly_do_chon}}"}</span> - LÃ½ do chá»n bÃ i há»c (Thiáº¿t káº¿)</p>
                    <p><span className="text-red-600">{"{{muc_tieu}}"}</span> - Má»¥c tiÃªu bÃ i há»c (Thiáº¿t káº¿)</p>
                    <p><span className="text-red-600">{"{{chuoi_hoat_dong}}"}</span> - Chuá»—i hoáº¡t Ä‘á»™ng thá»‘ng nháº¥t (Thiáº¿t káº¿)</p>
                    <p><span className="text-red-600">{"{{phuong_an_ho_tro}}"}</span> - PhÆ°Æ¡ng Ã¡n há»— trá»£ HS khÃ³ khÄƒn (Thiáº¿t káº¿)</p>
                    <p><span className="text-red-600">{"{{chia_se_nguoi_day}}"}</span> - Chia sáº» cá»§a giÃ¡o viÃªn dáº¡y minh há»a (PhÃ¢n tÃ­ch)</p>
                    <p><span className="text-red-600">{"{{nhan_xet_nguoi_du}}"}</span> - Minh chá»©ng viá»‡c há»c cá»§a HS (PhÃ¢n tÃ­ch)</p>
                    <p><span className="text-red-600">{"{{nguyen_nhan_giai_phap}}"}</span> - NguyÃªn nhÃ¢n & Giáº£i phÃ¡p Ä‘iá»u chá»‰nh (PhÃ¢n tÃ­ch)</p>
                    <p><span className="text-red-600">{"{{bai_hoc_kinh_nghiem}}"}</span> - BÃ i há»c kinh nghiá»‡m rÃºt ra (PhÃ¢n tÃ­ch)</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-semibold text-amber-900 text-sm">
                    LÆ°u Ã½ quan trá»ng:
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    <li>
                      Biáº¿n pháº£i Ä‘áº·t trong cáº·p dáº¥u ngoáº·c nhá»n kÃ©p:{" "}
                      <code className="bg-amber-100 px-1 rounded">
                        {"{{ten_bien}}"}
                      </code>
                    </li>
                    <li>
                      TÃªn biáº¿n pháº£i viáº¿t Ä‘Ãºng chÃ­nh táº£, khÃ´ng dáº¥u, dÃ¹ng dáº¥u gáº¡ch
                      dÆ°á»›i
                    </li>
                    <li>
                      Ná»™i dung trong biáº¿n sáº½ Ä‘Æ°á»£c AI tá»± Ä‘á»™ng táº¡o hoáº·c láº¥y tá»«
                      thÃ´ng tin báº¡n nháº­p
                    </li>
                    <li>
                      Báº¡n cÃ³ thá»ƒ thÃªm ná»™i dung cá»‘ Ä‘á»‹nh xung quanh biáº¿n trong máº«u
                      Word
                    </li>
                    <li>
                      Äá»‹nh dáº¡ng (font, size, mÃ u...) trong máº«u Word sáº½ Ä‘Æ°á»£c giá»¯
                      nguyÃªn
                    </li>
                  </ul>
                </div>

                {/* Download sample templates */}
                <div className="p-4 bg-gray-50 rounded-xl border space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Táº£i máº«u Word cÃ³ sáºµn:
                  </h4>
                  <p className="text-xs text-gray-600">
                    Báº¡n cÃ³ thá»ƒ táº£i cÃ¡c máº«u Word máº·c Ä‘á»‹nh Ä‘Ã£ Ä‘Æ°á»£c thiáº¿t láº­p sáºµn
                    cÃ¡c biáº¿n placeholder, sau Ä‘Ã³ chá»‰nh sá»­a theo Ã½ muá»‘n.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadMeetingWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Máº«u BiÃªn báº£n Há»p
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadLessonWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Máº«u KHBD
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadEventWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Máº«u Ngoáº¡i khÃ³a
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={downloadNCBHWordTemplate}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Máº«u NCBH
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent >
      </Dialog >

      {/* Add PPCT Item Dialog */}
      < Dialog open={showAddPPCTDialog} onOpenChange={setShowAddPPCTDialog} >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ThÃªm má»¥c PPCT</DialogTitle>
            <DialogDescription>
              ThÃªm chá»§ Ä‘á» má»›i vÃ o PhÃ¢n phá»‘i ChÆ°Æ¡ng trÃ¬nh Khá»‘i {ppctGrade}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ThÃ¡ng</Label>
                <Select
                  value={newPPCTItem.month}
                  onValueChange={(v) =>
                    setNewPPCTItem((p) => ({ ...p, month: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chá»n thÃ¡ng" />
                  </SelectTrigger>
                  <SelectContent>
                    {["9", "10", "11", "12", "1", "2", "3", "4", "5"].map(
                      (m) => (
                        <SelectItem key={m} value={m}>
                          ThÃ¡ng {m}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sá»‘ tiáº¿t</Label>
                <Select
                  value={String(newPPCTItem.periods)}
                  onValueChange={(v) =>
                    setNewPPCTItem((p) => ({
                      ...p,
                      periods: Number.parseInt(v),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                      (n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} tiáº¿t
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Chá»§ Ä‘á» / Ná»™i dung</Label>
              <Textarea
                value={newPPCTItem.theme}
                onChange={(e) =>
                  setNewPPCTItem((p) => ({ ...p, theme: e.target.value }))
                }
                placeholder="Nháº­p tÃªn chá»§ Ä‘á»..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chÃº (tÃ¹y chá»n)</Label>
              <Input
                value={newPPCTItem.notes || ""}
                onChange={(e) =>
                  setNewPPCTItem((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="VD: Káº¿t há»£p vá»›i 20/11..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddPPCTDialog(false)}
              >
                Há»§y
              </Button>
              <Button onClick={handleAddPPCTItem}>ThÃªm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog >
    </>
  );
}

export default TemplateManager;
