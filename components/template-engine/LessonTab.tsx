"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Sparkles,
    Download,
    Loader2,
    Copy,
    Info,
    BookOpen,
    Plus,
    Minus,
    CheckCircle,
    AlertCircle,
    X,
    ChevronUp,
    ChevronDown,
    Zap,
    Upload,
    Trash2,
} from "lucide-react";
import type { LessonResult, LessonTask, ActionResult } from "@/lib/types";
import type { PPCTChuDe } from "@/lib/data/ppct-database";
import { getChuDeListByKhoi } from "@/lib/data/ppct-database";
import { useAIContentParser } from "@/hooks/use-ai-content-parser";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ExpertBrainInjection } from "./ExpertBrainInjection";
import { SmartPromptBuilder } from "./SmartPromptBuilder";
import { ConfigPanel } from "./lesson/ConfigPanel";
import { SectionEditorGrid } from "./lesson/SectionEditorGrid";

interface LessonTabProps {
    lessonGrade: string;
    setLessonGrade: (value: string) => void;
    selectedChuDeSo: string;
    setSelectedChuDeSo: (value: string) => void;
    lessonAutoFilledTheme: string;
    setLessonAutoFilledTheme: (value: string) => void;
    lessonDuration: string;
    setLessonDuration: (value: string) => void;
    selectedChuDe: PPCTChuDe | null;
    setSelectedChuDe: (value: PPCTChuDe | null) => void;
    setLessonMonth: (value: string) => void;
    lessonFullPlanMode: boolean;
    setLessonFullPlanMode: (value: boolean) => void;
    shdcSuggestion: string;
    setShdcSuggestion: (value: string) => void;
    hdgdSuggestion: string;
    setHdgdSuggestion: (value: string) => void;
    shlSuggestion: string;
    setShlSuggestion: (value: string) => void;
    curriculumTasks: LessonTask[];
    distributeTimeForTasks: () => void;
    showCurriculumTasks: boolean;
    setShowCurriculumTasks: (value: boolean) => void;
    lessonTasks: LessonTask[];
    updateLessonTask: (id: string, field: any, value: any) => void;
    removeLessonTask: (id: string) => void;
    addLessonTask: () => void;
    lessonCustomInstructions: string;
    setLessonCustomInstructions: (value: string) => void;
    lessonResult: LessonResult | null;
    setLessonResult: (result: LessonResult | null) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    isExporting: boolean;
    onExport: () => void;
    copyToClipboard: (text: string) => void;
    isAuditing: boolean;
    onAudit: () => void;
    auditResult: string | null;
    auditScore: number;
    setSuccess: (msg: string | null) => void;
    setError: (msg: string | null) => void;
    success: string | null;
    error: string | null;
    lessonTopic: string;
    selectedModel: string;
    setSelectedModel: (value: string) => void;
    lessonFile: { mimeType: string; data: string; name: string } | null;
    setLessonFile: (file: { mimeType: string; data: string; name: string } | null) => void;
    onRefineSection: (content: string, instruction: string, model?: string) => Promise<ActionResult>;
    onGenerateSection?: (section: any, context: any, stepInstruction?: string) => Promise<ActionResult>;
}

export function LessonTab({
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
    setLessonMonth,
    lessonFullPlanMode,
    setLessonFullPlanMode,
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
    onGenerate,
    isExporting,
    onExport,
    copyToClipboard,
    isAuditing,
    onAudit,
    auditResult,
    auditScore,
    setSuccess,
    setError,
    success,
    error,
    lessonTopic,
    selectedModel,
    setSelectedModel,
    lessonFile,
    setLessonFile,
    onRefineSection,
    onGenerateSection,
}: LessonTabProps) {
    const [expertGuidance, setExpertGuidance] = React.useState<string>("");
    const [isMerging, setIsMerging] = React.useState(false);
    const { parseContent, isParsing } = useAIContentParser();

    const handleApplyExpertBrain = async () => {
        if (!expertGuidance) {
            setError("Vui lòng dán nội dung từ Gemini Pro vào textbox");
            return;
        }

        setIsMerging(true);
        setSuccess("🧠 Đang xử lý nội dung từ Gemini Pro...");

        try {
            let parsedData: any = null;

            // Step 1: Try to parse as JSON directly first
            try {
                // Remove markdown code blocks if present
                const cleanJson = expertGuidance.replace(/```json\n?|```/g, "").trim();
                parsedData = JSON.parse(cleanJson);
                console.log("Direct JSON Parse Success:", parsedData);
            } catch (jsonErr) {
                console.log("Direct JSON Parse Failed, falling back to AI Parser:", jsonErr);
                // Step 2: Fallback to AI Parser
                const parseResult = await parseContent(expertGuidance, "lesson_plan");
                if (parseResult.success && parseResult.data) {
                    parsedData = parseResult.data;
                } else {
                    throw new Error(parseResult.error || "Không thể phân tích nội dung. Vui lòng kiểm tra định dạng JSON.");
                }
            }

            // Step 3: Map to LessonResult
            const newLessonResult: LessonResult = {
                ten_bai: parsedData.ten_bai || parsedData.title || lessonAutoFilledTheme || "Bài học mới",

                // Objectives
                muc_tieu_kien_thuc: parsedData.context?.objetives || (Array.isArray(parsedData.objectives) ? parsedData.objectives.join('\n') : parsedData.objectives) || "",
                muc_tieu_nang_luc: parsedData.context?.competencies || "",
                muc_tieu_pham_chat: parsedData.context?.qualities || "",

                // Preparation
                gv_chuan_bi: Array.isArray(parsedData.preparation)
                    ? parsedData.preparation.filter((p: string) => p.toLowerCase().includes("gv") || p.toLowerCase().includes("giáo viên")).join('\n')
                    : (parsedData.preparation?.gv || parsedData.gv_chuan_bi || ""),
                hs_chuan_bi: Array.isArray(parsedData.preparation)
                    ? parsedData.preparation.filter((p: string) => p.toLowerCase().includes("hs") || p.toLowerCase().includes("học sinh")).join('\n')
                    : (parsedData.preparation?.hs || parsedData.hs_chuan_bi || ""),

                // Activities
                hoat_dong_khoi_dong: parsedData.activities?.find((a: any) => a.name.includes("Khởi động"))?.content || parsedData.activities?.[0]?.content || "",
                hoat_dong_kham_pha_1: parsedData.activities?.find((a: any) => a.name.includes("Khám phá"))?.content || parsedData.activities?.[1]?.content || "",
                hoat_dong_luyen_tap_1: parsedData.activities?.find((a: any) => a.name.includes("Luyện tập"))?.content || parsedData.activities?.[2]?.content || "",
                hoat_dong_van_dung: parsedData.activities?.find((a: any) => a.name.includes("Vận dụng"))?.content || parsedData.activities?.[3]?.content || "",

                shdc: parsedData.shdc?.kich_ban || "",
                shl: parsedData.shl?.noi_dung || "",

                // Assessment & Homework
                huong_dan_ve_nha: parsedData.homework || "",
                ho_so_day_hoc: parsedData.assessment?.worksheets || "",
                ky_thuat_day_hoc: parsedData.assessment?.rubric || "",

                expertGuidance: parsedData.notes || "Nội dung đã được cập nhật thành công!",

                // Integrated contents
                tich_hop_nls: parsedData.integrations?.nls || parsedData.digital_competency || parsedData.nls_integration || parsedData.tich_hop_nls || "",
                tich_hop_dao_duc: parsedData.integrations?.ethics || parsedData.moral_education || parsedData.ethics_integration || parsedData.tich_hop_dao_duc || "",

                // Reset/Optional others
                ma_chu_de: "",
                hoat_dong_kham_pha_2: "",
                hoat_dong_kham_pha_3: "",
                hoat_dong_kham_pha_4: "",
                hoat_dong_luyen_tap_2: "",
                hoat_dong_luyen_tap_3: "",
                tich_hop_dao_duc_va_bai_hat: "",
                shdc_shl_combined: "",
                noi_dung_chuan_bi: "",
                thiet_bi_day_hoc: "",
                shdc_gợi_ý: "",
                hdgd_gợi_ý: "",
                shl_gợi_ý: "",
                hoat_dong_duoi_co: "",
                hoat_dong_kham_pha: "",
                hoat_dong_luyen_tap: "",
            };

            if (setLessonResult) {
                setLessonResult(newLessonResult);
                setSuccess("✅ Đã áp dụng kết quả từ Gemini Pro thành công!");
                // Clear guidance after success
                setExpertGuidance("");
            }

        } catch (e) {
            console.error("Apply Expert Brain Error:", e);
            setError("Lỗi: " + (e instanceof Error ? e.message : String(e)));
        } finally {
            setIsMerging(false);
        }
    };

    // --- ANTIGRAVITY: FILE-SYSTEM STATE SIMULATION (STEP 2) ---
    // Load state from localStorage on mount (Resumability)
    React.useEffect(() => {
        const savedState = localStorage.getItem(`lesson_state_${lessonGrade}_${selectedChuDeSo}`);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                console.log("Resuming saved lesson state:", parsed);
                if (setLessonResult) setLessonResult(parsed); // Restore state
            } catch (e) {
                console.error("Failed to load saved state", e);
            }
        }
    }, [lessonGrade, selectedChuDeSo]); // Re-load when switching topics

    // Persist state on change
    React.useEffect(() => {
        if (lessonResult && lessonGrade && selectedChuDeSo) {
            localStorage.setItem(`lesson_state_${lessonGrade}_${selectedChuDeSo}`, JSON.stringify(lessonResult));
        }
    }, [lessonResult, lessonGrade, selectedChuDeSo]);



    // AI Section Editor Component
    const AISectionEditor = ({
        label,
        value,
        onChange,
        bgClass,
        field
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        bgClass: string;
        field: string;
    }) => {
        const [isEditingWithAI, setIsEditingWithAI] = React.useState(false);

        const handleAIAction = async (actionPrompt: string) => {
            setIsEditingWithAI(true);
            try {
                setSuccess(`Đang tối ưu phần nội dung này...`);
                const result = await onRefineSection(value, actionPrompt, selectedModel);
                if (result.success && result.content) {
                    onChange(result.content);
                    setSuccess("Đã cập nhật nội dung thành công!");
                }
            } finally {
                setIsEditingWithAI(false);
            }
        };

        return (
            <div className="group space-y-3">
                <div className="flex items-center justify-between px-1">
                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</Label>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Làm sôi nổi hơn"
                            onClick={() => handleAIAction("Làm cho hoạt động này sinh động và sôi nổi hơn")}
                            className="h-8 w-8 p-0 rounded-xl text-orange-500 hover:bg-orange-50 hover:text-orange-600 transition-all"
                        >
                            <Zap className="h-4 w-4 fill-orange-500" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Thêm trò chơi"
                            onClick={() => handleAIAction("Thêm một trò chơi nhỏ khởi động hoặc củng cố")}
                            className="h-8 w-8 p-0 rounded-xl text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Tối ưu năng lực số"
                            onClick={() => handleAIAction("Tối ưu hóa phần tích hợp năng lực số")}
                            className="h-8 w-8 p-0 rounded-xl text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        >
                            <ShieldCheck className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(value)}
                            className="h-8 w-8 p-0 rounded-xl hover:bg-slate-50"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl group-hover:shadow-lg transition-shadow duration-500">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`min-h-[140px] ${bgClass} ${isEditingWithAI ? 'opacity-30' : ''} border-none focus:ring-2 focus:ring-indigo-100 transition-all duration-500 text-sm leading-relaxed p-5 py-4`}
                    />
                    {isEditingWithAI && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-500">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI Refining...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // State for expand/collapse activity suggestion boxes
    const [expandedActivities, setExpandedActivities] = React.useState<Record<string, boolean>>({
        shdc: true,
        hdgd: true,
        shl: true,
    });

    const toggleActivity = (key: string) => {
        setExpandedActivities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Activity Suggestion Box Component
    const ActivitySuggestionBox = ({
        label,
        value,
        onChange,
        placeholder,
        colorClass,
        periodCount
    }: {
        label: string;
        value: string;
        onChange: (value: string) => void;
        placeholder: string;
        colorClass: 'blue' | 'green' | 'orange';
        periodCount: number;
    }) => {
        const colorMap = {
            blue: {
                bg: 'soft-pastel-sky/10',
                border: 'border-blue-200/50',
                header: 'bg-blue-600/5 text-blue-900',
                text: 'text-blue-900',
                badge: 'bg-blue-600 text-white',
                dot: 'bg-blue-600',
            },
            green: {
                bg: 'soft-pastel-mint/10',
                border: 'border-emerald-200/50',
                header: 'bg-emerald-600/5 text-emerald-900',
                text: 'text-emerald-900',
                badge: 'bg-emerald-600 text-white',
                dot: 'bg-emerald-600',
            },
            orange: {
                bg: 'soft-pastel-salmon/10',
                border: 'border-orange-200/50',
                header: 'bg-orange-600/5 text-orange-900',
                text: 'text-orange-900',
                badge: 'bg-orange-600 text-white',
                dot: 'bg-orange-600',
            },
        };

        const colors = colorMap[colorClass];
        const key = colorClass === 'blue' ? 'shdc' : colorClass === 'green' ? 'hdgd' : 'shl';
        const isExpanded = expandedActivities[key];

        return (
            <div className={`premium-glass ${colors.bg} rounded-[2rem] border ${colors.border} overflow-hidden transition-all duration-700 shadow-sm hover:shadow-xl`}>
                <div
                    className={`flex items-center justify-between p-4 px-6 cursor-pointer ${colors.header} transition-all duration-500`}
                    onClick={() => toggleActivity(key)}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${colors.dot} shadow-lg shadow-current animate-pulse`}></div>
                        <Label className={`${colors.text} font-black uppercase text-xs tracking-widest cursor-pointer`}>
                            {label}
                        </Label>
                    </div>
                    <div className="flex items-center gap-4">
                        {periodCount > 0 && (
                            <Badge className={`${colors.badge} h-6 rounded-full px-3 text-[10px] font-black border-none`}>
                                {periodCount} TIẾT
                            </Badge>
                        )}
                        {isExpanded ? <ChevronUp className="h-4 w-4 opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />}
                    </div>
                </div>
                {isExpanded && (
                    <div className="p-6 pt-2 animate-in slide-in-from-top-4 duration-500">
                        <Textarea
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="premium-neumo-inset min-h-[120px] bg-white/40 border-none rounded-2xl text-sm leading-relaxed focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col gap-8 pb-32 max-w-[1400px] mx-auto">
                {/* Main Stage Grid - Responsive Design System */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Configuration & Inputs */}
                    <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
                        <Card className="border-none shadow-none bg-transparent h-fit lg:sticky lg:top-24">
                            <CardContent className="p-0 space-y-6">
                                {/* Config Section */}
                                <ConfigPanel
                                    lessonGrade={lessonGrade}
                                    setLessonGrade={setLessonGrade}
                                    selectedChuDeSo={selectedChuDeSo}
                                    setSelectedChuDeSo={setSelectedChuDeSo}
                                    setLessonAutoFilledTheme={setLessonAutoFilledTheme}
                                    lessonDuration={lessonDuration}
                                    setLessonDuration={setLessonDuration}
                                    selectedChuDe={selectedChuDe}
                                    setSelectedChuDe={setSelectedChuDe}
                                    setLessonMonth={setLessonMonth}
                                />


                                {/* STEP 3: EXPERT BRAIN INJECTION */}
                                <div className="space-y-4">
                                    <div className="px-2">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">Bước 2: Nhập kết quả</h3>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Dán JSON từ Gemini Pro vào đây để phân tích và điền giáo án</p>
                                    </div>
                                    <ExpertBrainInjection
                                        value={expertGuidance}
                                        onChange={setExpertGuidance}
                                        onApply={handleApplyExpertBrain}
                                        isProcessing={isParsing || isMerging}
                                        fileSummary={lessonFile?.name}
                                        topic={lessonAutoFilledTheme}
                                        grade={lessonGrade}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Main Stage */}
                    <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
                        <div className="space-y-6">
                            {/* NOTIFICATION LAYER */}
                            {lessonGrade && lessonAutoFilledTheme && (
                                <div className="mb-8">
                                    <SmartPromptBuilder
                                        grade={lessonGrade}
                                        topicName={lessonAutoFilledTheme}
                                        chuDeSo={selectedChuDeSo}
                                        fileSummary={lessonFile?.name} // User attaches file manually 
                                    />
                                </div>
                            )}

                            <div className="space-y-4 px-4 lg:px-0">
                                {success && (
                                    <div className="premium-glass soft-pastel-mint p-4 rounded-3xl flex items-center gap-4 text-emerald-800 border-emerald-200 animate-in fade-in slide-in-from-top-6 duration-700 shadow-lg">
                                        <div className="w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center text-emerald-600">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{success}</span>
                                    </div>
                                )}
                                {error && (
                                    <div className="premium-glass soft-pastel-salmon p-4 rounded-3xl flex items-center gap-4 text-red-800 border-red-200 animate-in fade-in slide-in-from-top-6 duration-700 shadow-lg">
                                        <div className="w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center text-red-600">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{error}</span>
                                    </div>
                                )}

                                {/* READY BANNER */}
                                {lessonResult && (
                                    <div className="premium-glass p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border-emerald-200 shadow-2xl animate-in zoom-in duration-1000">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                                                <CheckCircle className="h-8 w-8" />
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h3 className="font-black text-xl text-slate-800 leading-tight flex items-center gap-2">
                                                    Bản thảo hoàn tất
                                                    {lessonResult.expert_instructions && (
                                                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse">
                                                            Expert Integrated
                                                        </Badge>
                                                    )}
                                                </h3>
                                                <p className="text-xs text-emerald-700 font-medium">Giáo án đã được tối ưu hóa theo chuẩn 5512</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 w-full md:w-auto">
                                            <Button
                                                variant="outline"
                                                className="flex-1 md:flex-none h-12 rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold premium-glass"
                                                onClick={onAudit}
                                            >
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Audit AI
                                            </Button>
                                            <Button
                                                className="flex-1 md:flex-none h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl shadow-emerald-200 px-8"
                                                onClick={onExport}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Xuất File
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>



                            {/* Results Display Area - Premium Editor Style */}
                            {lessonResult && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 lg:px-0">
                                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                                    <SectionEditorGrid
                                        lessonResult={lessonResult}
                                        setLessonResult={setLessonResult}
                                        AISectionEditor={AISectionEditor}
                                    />

                                    {/* Multi-Action Dashboard */}
                                    <div className="premium-glass p-8 rounded-[3rem] border-indigo-100 shadow-2xl space-y-6">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                                    <CheckCircle className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-lg text-slate-900">Final Verification</h4>
                                                    <p className="text-sm text-slate-500 font-medium">Sao chép hoặc kiểm tra lại toàn bộ giáo án</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 md:flex-none h-14 rounded-2xl border-indigo-100 text-indigo-600 font-black hover:bg-slate-50 px-8"
                                                    onClick={() => {
                                                        const content = `TÊN BÀI: ${lessonResult.ten_bai || lessonTopic}
                                                    \n\nMỤC TIÊU KIẾN THỨC:\n${lessonResult.muc_tieu_kien_thuc || ""}
                                                    \n\nMỤC TIÊU NĂNG LỰC:\n${lessonResult.muc_tieu_nang_luc || ""}
                                                    \n\nMỤC TIÊU PHẨM CHẤT:\n${lessonResult.muc_tieu_pham_chat || ""}
                                                    \n\nTHIẾT BỊ DẠY HỌC & HỌC LIỆU:\n${lessonResult.thiet_bi_day_hoc || ""}
                                                    \n\nSINH HOẠT DƯỚI CỜ:\n${lessonResult.shdc || ""}
                                                    \n\nSINH HOẠT LỚP:\n${lessonResult.shl || ""}
                                                    \n\nHOẠT ĐỘNG KHỞI ĐỘNG:\n${lessonResult.hoat_dong_khoi_dong || ""}
                                                    \n\nHOẠT ĐỘNG KHÁM PHÁ:\n${lessonResult.hoat_dong_kham_pha || ""}
                                                    \n\nHOẠT ĐỘNG LUYỆN TẬP:\n${lessonResult.hoat_dong_luyen_tap || ""}
                                                    \n\nHOẠT ĐỘNG VẬN DỤNG:\n${lessonResult.hoat_dong_van_dung || ""}
                                                    \n\nHƯỚNG DẪN VỀ NHÀ:\n${lessonResult.huong_dan_ve_nha || ""}
                                                    \n\nTÍCH HỢP NLS:\n${lessonResult.tich_hop_nls || ""}
                                                    \n\nTÍCH HỢP ĐẠO ĐỨC:\n${lessonResult.tich_hop_dao_duc || ""}`;
                                                        navigator.clipboard.writeText(content);
                                                        setSuccess("Đã sao chép toàn bộ giáo án vào clipboard!");
                                                    }}
                                                >
                                                    <Copy className="mr-3 h-5 w-5" />
                                                    COPY TO CLIPBOARD
                                                </Button>
                                                <Button
                                                    className="flex-1 md:flex-none h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 px-8"
                                                    onClick={onExport}
                                                >
                                                    <Download className="mr-3 h-5 w-5" />
                                                    DOWNLOAD DOCX
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Audit Result Display */}
                                        {auditResult && (
                                            <div className="premium-glass soft-pastel-salmon/30 p-8 rounded-[2rem] border-red-200/50 animate-in zoom-in duration-700">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3 text-red-800">
                                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                                                            <CheckCircle className="w-6 h-6" />
                                                        </div>
                                                        <h4 className="font-black text-xl uppercase tracking-tight">MOET 5512 Audit Report</h4>
                                                    </div>
                                                    <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 ${auditScore >= 80 ? 'border-emerald-500 text-emerald-600' : auditScore >= 50 ? 'border-amber-500 text-amber-600' : 'border-red-500 text-red-600'} bg-white shadow-xl`}>
                                                        <span className="text-2xl font-black">{auditScore}</span>
                                                        <span className="text-[8px] font-bold uppercase">SCORE</span>
                                                    </div>
                                                </div>
                                                <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 bg-white/40 p-6 rounded-2xl border border-white/40 backdrop-blur-md">
                                                    <div className="whitespace-pre-wrap font-medium">{auditResult}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            {lessonResult && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-full duration-700">
                    <div className="premium-glass p-3 rounded-3xl flex gap-3 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] border-white/40">
                        <Button
                            variant="outline"
                            className="flex-1 h-12 rounded-2xl border-indigo-100 text-indigo-600 bg-white/80"
                            onClick={() => {
                                // Sao chép nội dung bài dạy
                                const content = `TÊN BÀI: ${lessonResult.ten_bai || lessonTopic}
                                \n\nMỤC TIÊU KIẾN THỨC:\n${lessonResult.muc_tieu_kien_thuc || ""}
                                \n\nSINH HOẠT LỚP:\n${lessonResult.shl || ""}
                                \n\nHOẠT ĐỘNG KHỞI ĐỘNG:\n${lessonResult.hoat_dong_khoi_dong || ""}`;
                                navigator.clipboard.writeText(content);
                                setSuccess("Đã sao chép vào clipboard!");
                            }}
                        >
                            <Copy className="h-5 w-5" />
                        </Button>
                        <Button
                            className="flex-[2] h-12 rounded-2xl bg-indigo-600 text-white font-black shadow-lg shadow-indigo-200"
                            onClick={onExport}
                        >
                            <Download className="h-5 w-5 mr-2" />
                            XUẤT FILE
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
