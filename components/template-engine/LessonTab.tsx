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
    Clock,
    Plus,
    Minus,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    X,
    ChevronUp,
    ChevronDown,
    Zap,
    Upload,
    Trash2,
    ShieldCheck,
    Lightbulb,
} from "lucide-react";
import type { LessonResult, LessonTask, ActionResult } from "@/lib/types";
import type { PPCTChuDe } from "@/lib/data/ppct-database";
import { getChuDeListByKhoi } from "@/lib/data/ppct-database";
import { useSlowOrchestrator } from "@/hooks/use-slow-orchestrator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ExpertBrainInjection } from "./ExpertBrainInjection";

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
    setLessonFile: (value: { mimeType: string; data: string; name: string } | null) => void;
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
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [stepInProgress, setStepInProgress] = React.useState<string | null>(null);
    const [expandedStep, setExpandedStep] = React.useState<string | null>(null);
    const [stepInstructions, setStepInstructions] = React.useState<Record<string, string>>({});
    const [expertGuidance, setExpertGuidance] = React.useState<string>("");
    const [isMerging, setIsMerging] = React.useState(false);

    const handleApplyExpertBrain = async () => {
        if (!lessonResult || !expertGuidance) return;
        setIsMerging(true);
        try {
            const { KHBHMerger } = await import("@/lib/integration/khbh-merger");
            const merged = KHBHMerger.merge(lessonResult, expertGuidance);
            if (setLessonResult) setLessonResult(merged);
            setSuccess("Đã phẫu thuật và trộn trí tuệ Gemini Pro vào giáo án!");
        } catch (e) {
            setError("Lỗi khi trộn nội dung: " + (e instanceof Error ? e.message : String(e)));
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
    // --- ANTIGRAVITY v4.5: INDUSTRIAL HIERARCHICAL WORKFLOW ---
    // --- ANTIGRAVITY v6.0: DECOMMISSIONED OLD LOGIC ---
    // (Old handleAutoGenerate and manual states were triggering timeouts)
    // --- ANTIGRAVITY v6.2: DIAGNOSTIC & SYNC ---
    const {
        currentJob,
        isGenerating: isSagaGenerating,
        startJob: startSagaJob,
        resumeJob: resumeSagaJob
    } = useSlowOrchestrator();

    React.useEffect(() => {
        if (currentJob) {
            console.log(`[Diagnostic] Saga State: ${currentJob.status}. Tasks Completed: ${currentJob.tasks.filter((t: any) => t.status === 'completed').length}`);
            // Check if any task failed with ENV_ERROR
            const envError = currentJob.tasks.find((t: any) => t.error?.includes("ENV_ERROR"));
            if (envError) {
                console.error("[Crit] Environment Variable Sync Error detected in Saga:", envError.error);
            }
        }
    }, [currentJob]);

    // Effect to sync Saga completed tasks to lessonResult
    React.useEffect(() => {
        if (currentJob && currentJob.tasks.length > 0) {
            const completedTasks = currentJob.tasks.filter((t: any) => t.status === 'completed');
            if (completedTasks.length > 0) {
                const newResult: any = { ...lessonResult };
                let hashChanged = false;
                completedTasks.forEach((task: any) => {
                    // Antigravity Sync: Map Saga Task ID to LessonResult key
                    const key = task.id;
                    if (task.output && !newResult[key]) {
                        newResult[key] = task.output;
                        hashChanged = true;
                    }
                });
                if (hashChanged && setLessonResult) {
                    setLessonResult(newResult);
                }
            }
        }
    }, [currentJob, lessonResult, setLessonResult]);

    const handleSagaGenerate = async () => {
        if (!lessonGrade || !lessonAutoFilledTheme) {
            setError("Vui lòng nhập Khối và Tên bài dạy trước khi bắt đầu.");
            return;
        }

        console.log("[Saga] Starting Job. Current Proxy URL in Bundle:", process.env.NEXT_PUBLIC_GEMINI_PROXY_URL);

        setSuccess("🔥 Kích hoạt hệ thống Client-Side Saga (v6.2). Đang khởi tạo lộ trình tối ưu...");
        await startSagaJob(lessonGrade, lessonAutoFilledTheme, lessonFile || undefined, expertGuidance);
    };

    // --- REDIRECTING MANUAL CLICKS TO SAGA ---
    const handleStepGenerate = (stepId: string) => {
        setSuccess(`Vui lòng sử dụng hệ thống "Saga Slow-Cooking" bên dưới để tạo phần "${stepId}". Chế độ thủ công đã bị tạm dừng để tránh lỗi Vercel Timeout.`);
    };

    const workflowPlan = [
        {
            stage: "PHASE 0: ARCHITECTURE",
            tasks: [
                { id: 'blueprint', label: '0. Lập dàn ý (Architecture)', resultKey: 'blueprint', icon: '🏗️' },
                { id: 'muc_tieu_kien_thuc', label: '1. Mục tiêu & Chuẩn bị (Deep Analysis)', resultKey: 'muc_tieu_kien_thuc', icon: '🎯' },
            ]
        },
        {
            stage: "PHASE 1: FOUNDATION & WARM-UP",
            tasks: [
                { id: 'hoat_dong_khoi_dong', label: '2. HĐ: Khởi động - Tạo mâu thuẫn', resultKey: 'hoat_dong_khoi_dong', icon: '⚡' },
                { id: 'shdc', label: '3. Sinh hoạt dưới cờ', resultKey: 'shdc', icon: '🏛️' },
                { id: 'shl', label: '4. Sinh hoạt lớp', resultKey: 'shl', icon: '👥' },
            ]
        },
        {
            stage: "PHASE 2: KNOWLEDGE EXPLORATION (Compass Scripting)",
            tasks: [
                { id: 'hoat_dong_kham_pha_1', label: '4.1 Khám phá 1: Hình thành kiến thức', resultKey: 'hoat_dong_kham_pha_1', icon: '🔍', isSub: true },
                { id: 'hoat_dong_kham_pha_2', label: '4.2 Khám phá 2: Phân tích & Phản biện', resultKey: 'hoat_dong_kham_pha_2', icon: '📖', isSub: true },
                { id: 'hoat_dong_kham_pha_3', label: '4.3 Khám phá 3: Tích hợp NLS & Đạo đức', resultKey: 'hoat_dong_kham_pha_3', icon: '🌐', isSub: true },
            ]
        },
        {
            stage: "PHASE 3: PRACTICE & APPLICATION",
            tasks: [
                { id: 'hoat_dong_luyen_tap_1', label: '5.1 Luyện tập 1: Củng cố cơ bản', resultKey: 'hoat_dong_luyen_tap_1', icon: '💪', isSub: true },
                { id: 'hoat_dong_luyen_tap_2', label: '5.2 Luyện tập 2: Sáng tạo & Giải quyết', resultKey: 'hoat_dong_luyen_tap_2', icon: '🛠️', isSub: true },
                { id: 'hoat_dong_van_dung', label: '6. Vận dụng: Dự án thực tế', resultKey: 'hoat_dong_van_dung', icon: '🚀' },
                { id: 'huong_dan_ve_nha', label: '7. Hướng dẫn về nhà', resultKey: 'huong_dan_ve_nha', icon: '🏠' },
            ]
        },
        {
            stage: "PHASE 4: FINALIZATION",
            tasks: [
                { id: 'ho_so_day_hoc', label: '8. Hồ sơ: Phiếu & Rubric', resultKey: 'ho_so_day_hoc', icon: '📋' },
            ]
        }
    ];
    const designSteps = workflowPlan.flatMap(p => p.tasks);
    const retryCountDown = null;
    const isAutoRunning = false;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setLessonFile({
                    mimeType: file.type,
                    data: base64String,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

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
                                {/* Config Panel - Neumo Raised */}
                                <div className="premium-neumo p-6 space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 premium-glass">
                                            <BookOpen className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">Cấu hình</h3>
                                            <p className="text-[10px] text-slate-500 font-medium">Lập trình bối cảnh bài dạy</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Khối lớp (Grade)</Label>
                                            <Select
                                                value={lessonGrade}
                                                onValueChange={(value) => {
                                                    setLessonGrade(value);
                                                    setSelectedChuDeSo("");
                                                    setLessonAutoFilledTheme("");
                                                }}
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-white dark:border-slate-800 shadow-sm">
                                                    <SelectValue placeholder="Chọn khối..." />
                                                </SelectTrigger>
                                                <SelectContent className="premium-glass rounded-2xl">
                                                    <SelectItem value="10">Khối 10 (Grade 10)</SelectItem>
                                                    <SelectItem value="11">Khối 11 (Grade 11)</SelectItem>
                                                    <SelectItem value="12">Khối 12 (Grade 12)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Chủ đề (PPCT Month)</Label>
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
                                                        setLessonMonth(value);
                                                    }
                                                }}
                                                disabled={!lessonGrade}
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-white dark:border-slate-800">
                                                    <SelectValue placeholder={lessonGrade ? "Chọn chủ đề..." : "Chọn khối trước"} />
                                                </SelectTrigger>
                                                <SelectContent className="premium-glass rounded-2xl">
                                                    {lessonGrade &&
                                                        getChuDeListByKhoi(lessonGrade).map((chuDe) => (
                                                            <SelectItem key={chuDe.chu_de_so} value={chuDe.chu_de_so.toString()}>
                                                                {chuDe.chu_de_so}. {chuDe.ten}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tiêu đề bài học</Label>
                                            <Textarea
                                                value={lessonAutoFilledTheme}
                                                onChange={(e) => setLessonAutoFilledTheme(e.target.value)}
                                                placeholder="Nhập tên bài học..."
                                                className="min-h-[100px] premium-neumo-inset border-none px-4 py-3 focus:ring-2 focus:ring-indigo-100 text-sm leading-relaxed"
                                            />
                                        </div>

                                        {/* PPCT Info Dashboard */}
                                        {selectedChuDe && (
                                            <div className="premium-glass p-5 rounded-3xl space-y-4 border-indigo-200/50 soft-pastel-sky/20">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tighter">Phân bổ tiết học thực tế</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[9px] text-slate-500 font-bold">SHDC</span>
                                                        <span className="text-lg font-black text-indigo-600">{selectedChuDe.shdc}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center border-x border-indigo-100">
                                                        <span className="text-[9px] text-slate-500 font-bold">HĐGD</span>
                                                        <span className="text-lg font-black text-emerald-600">{selectedChuDe.hdgd}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[9px] text-slate-500 font-bold">SHL</span>
                                                        <span className="text-lg font-black text-amber-600">{selectedChuDe.shl}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* File Upload Section - Neumo Raised */}
                                <div className="premium-neumo p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                                            <Upload className="h-4 w-4 text-indigo-600" />
                                            Nguồn tài liệu gốc (PDF)
                                        </Label>
                                        {lessonFile && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => setLessonFile(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

                                    {lessonFile ? (
                                        <div className="premium-glass p-4 rounded-2xl flex items-center gap-4 border-emerald-200 soft-pastel-mint/30">
                                            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs font-bold text-slate-700 truncate">{lessonFile.name}</p>
                                                <p className="text-[10px] text-emerald-600 font-medium">Hệ thống đang sẵn sàng xử lý</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full h-32 rounded-3xl border-dashed border-2 border-slate-200 bg-slate-50/50 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white hover:shadow-2xl transition-all duration-500 flex flex-col gap-2"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                <Plus className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">Nạp giáo án cũ</span>
                                        </Button>
                                    )}
                                </div>

                                {/* STEP 2: GENERATION CONTROL */}
                                <div className="premium-neumo p-6 space-y-6">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 premium-glass">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">Bước 1: Khởi tạo</h3>
                                            <p className="text-[10px] text-slate-500 font-medium">Tạo khung giáo án thô từ PDF</p>
                                        </div>
                                    </div>

                                    {!isAutoRunning ? (
                                        <Button
                                            onClick={handleSagaGenerate}
                                            disabled={isSagaGenerating || !lessonGrade || !lessonAutoFilledTheme}
                                            className="w-full h-14 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-2xl shadow-indigo-200 border border-indigo-400/20 group"
                                        >
                                            <Zap className="h-5 w-5 mr-3 group-hover:animate-pulse" />
                                            START GENERATION
                                        </Button>
                                    ) : (
                                        <div className="premium-glass soft-pastel-mint h-14 w-full rounded-[1.5rem] flex items-center justify-center gap-4 text-emerald-800 border-emerald-200 font-bold">
                                            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                                            SAGA RUNNING...
                                        </div>
                                    )}
                                </div>

                                {/* STEP 3: EXPERT BRAIN INJECTION */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-slate-800 px-2">Bước 2 & 3: Tinh chỉnh</h3>
                                    <p className="text-[10px] text-slate-500 font-medium px-2 pb-2">Nâng cấp giáo án bằng trí tuệ cấp chuyên gia</p>
                                    <ExpertBrainInjection
                                        value={expertGuidance}
                                        onChange={setExpertGuidance}
                                        onApply={handleApplyExpertBrain}
                                        isProcessing={isMerging}
                                        fileSummary={currentJob?.lessonFileSummary}
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

                            {/* MAIN LAB HEADER & SAGA CONTROL */}
                            <Card className="border-none shadow-none bg-transparent overflow-visible">
                                <CardContent className="p-0 space-y-8">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 lg:px-0">
                                        <div className="space-y-2 text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                <Zap className="h-3 w-3 fill-indigo-600" />
                                                Advanced AI Pipeline
                                            </div>
                                            <h2 className="text-4xl font-black text-slate-900 leading-[1.1]">
                                                Phòng Lab <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Thiết kế</span>
                                            </h2>
                                            <p className="text-slate-500 text-sm font-medium">Xây dựng giáo án đa tầng với công nghệ Saga Orchestration</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex gap-3">
                                                {/* (Moved to Sidebar Step 1) */}
                                                {!isAutoRunning && lessonResult && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (confirm('Bạn có chắc chắn muốn xóa bản thảo hiện tại và làm mới từ đầu không?')) {
                                                                localStorage.removeItem(`lesson_state_${lessonGrade}_${selectedChuDeSo}`);
                                                                setLessonResult(null);
                                                                setSuccess("Đã làm mới bản thảo thành công!");
                                                            }
                                                        }}
                                                        className="h-12 w-12 rounded-[1.2rem] border-red-100 text-red-500 hover:bg-red-50 p-0"
                                                        title="Xóa & Làm lại"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SAGA PROGRESS DASHBOARD - REDESIGNED */}
                                    {currentJob && (
                                        <div className="premium-neumo mx-4 lg:mx-0 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-indigo-600">
                                                        <ShieldCheck className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-800">Tiến độ Client-Side Saga</h4>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                            {currentJob.status === 'processing' ? '🔥 Processing Data Chunks' : '🏁 Session Ready'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className="h-8 rounded-xl px-4 bg-slate-900 text-white font-black text-[10px]">
                                                    {Math.round((currentJob.tasks.filter((t: any) => t.status === 'completed').length / (currentJob.tasks.length || 1)) * 100)}% COMPLETE
                                                </Badge>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[11px] font-black text-slate-500">
                                                    <span>DEPLOYMENT NODES</span>
                                                    <span className="text-indigo-600">{currentJob.tasks.filter((t: any) => t.status === 'completed').length} / {currentJob.tasks.length}</span>
                                                </div>
                                                <div className="h-4 w-full bg-slate-100 rounded-full p-1 shadow-inner">
                                                    <div
                                                        className="h-full bg-indigo-600 rounded-full shadow-lg transition-all duration-1000"
                                                        style={{ width: `${(currentJob.tasks.filter((t: any) => t.status === 'completed').length / (currentJob.tasks.length || 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                {currentJob.tasks.map((task: any) => (
                                                    <div key={task.id} className={`premium-glass p-3 rounded-2xl flex items-center gap-3 border transition-all ${task.status === 'completed' ? 'soft-pastel-mint border-emerald-100' :
                                                        task.status === 'processing' ? 'soft-pastel-sky border-indigo-100 shadow-xl' :
                                                            'bg-white/50 border-white opacity-50'
                                                        }`}>
                                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${task.status === 'completed' ? 'bg-white text-emerald-600' :
                                                            task.status === 'processing' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                                            }`}>
                                                            {task.status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                                                                task.status === 'processing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                                                        </div>
                                                        <span className="text-[9px] font-black text-slate-700 truncate leading-tight uppercase tracking-tighter">{task.title}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {currentJob.status === 'failed' && (
                                                <div className="premium-glass soft-pastel-salmon p-4 rounded-3xl flex gap-3 border-red-200 mt-4">
                                                    <Button onClick={() => resumeSagaJob(currentJob.jobId)} className="flex-1 h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold">
                                                        RESUME PIPELINE
                                                    </Button>
                                                    <Button variant="outline" onClick={() => startSagaJob(lessonGrade, lessonAutoFilledTheme)} className="flex-1 h-12 rounded-2xl border-red-200 text-red-600 font-bold">
                                                        RESTART
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* MILESTONES GRID */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-20 px-4 lg:px-0">
                                        {designSteps.map((step, idx) => {
                                            const isDone = !!(lessonResult as any)?.[step.resultKey] || (step.id === 'shdc_shl' && !!lessonResult?.shdc);
                                            const currentLoading = stepInProgress === step.id;

                                            return (
                                                <div key={step.id} className="space-y-2">
                                                    {/* Stage Header */}
                                                    {workflowPlan.find(p => p.tasks[0].id === step.id) && (
                                                        <div className="col-span-full pt-4 pb-1 flex items-center gap-2">
                                                            <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                                                            <span className="text-[9px] font-black text-indigo-900/60 uppercase tracking-widest">
                                                                {workflowPlan.find(p => p.tasks[0].id === step.id)?.stage}
                                                            </span>
                                                            <div className="h-[1px] flex-1 bg-slate-100" />
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`group relative flex items-center justify-between p-3 rounded-[1.5rem] border transition-all duration-500 hover:scale-[1.005] ${isDone
                                                            ? 'premium-glass soft-pastel-mint border-emerald-200/50 shadow-sm'
                                                            : 'premium-neumo hover:shadow-md hover:border-indigo-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden" onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}>
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-sm transition-all duration-500 shrink-0 ${isDone
                                                                ? 'bg-white text-emerald-500 shadow-emerald-100'
                                                                : 'bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white shadow-slate-100'
                                                                }`}>
                                                                {isDone ? <CheckCircle className="h-4 w-4" /> : (step as any).icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`text-xs font-bold tracking-tight truncate transition-colors duration-500 ${isDone ? 'text-emerald-900' : 'text-slate-700'}`}>
                                                                    {step.label}
                                                                </h4>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 pl-1.5">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={`h-8 w-8 p-0 rounded-lg transition-all duration-300 ${expandedStep === step.id ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-slate-400'}`}
                                                                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                                                            >
                                                                <MessageSquare className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant={isDone ? "ghost" : "default"}
                                                                className={`h-8 px-3 rounded-lg font-bold text-[10px] transition-all duration-300 ${isDone
                                                                    ? 'text-emerald-600 hover:bg-emerald-50'
                                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200/50'
                                                                    }`}
                                                                disabled={isGenerating || !lessonGrade || !lessonAutoFilledTheme}
                                                                onClick={() => handleStepGenerate(step.id)}
                                                            >
                                                                {currentLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : (isDone ? "SỬA" : "SOẠN")}
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Step suggestion box - Compact */}
                                                    {expandedStep === step.id && (
                                                        <div className="p-3 premium-neumo-inset animate-in slide-in-from-top-4 duration-500 rounded-xl mx-0.5">
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <Label className="text-[8px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                                                                    <Sparkles className="h-2.5 w-2.5" />
                                                                    Chỉ thị chuyên biệt
                                                                </Label>
                                                            </div>
                                                            <Textarea
                                                                value={stepInstructions[step.id] || ""}
                                                                onChange={(e) => setStepInstructions({ ...stepInstructions, [step.id]: e.target.value })}
                                                                placeholder="Gợi ý/yêu cầu cụ thể cho bước này..."
                                                                className="min-h-[60px] text-xs bg-transparent border-none focus:ring-0 leading-relaxed font-medium placeholder:text-slate-400 p-0"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>


                                    <div className="flex items-center gap-4 p-5 premium-glass soft-pastel-sky/20 border-indigo-100/50 italic text-indigo-700 text-[11px] font-medium leading-relaxed rounded-[2rem] mx-4 lg:mx-0">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                            <Info className="h-5 w-5" />
                                        </div>
                                        <p>AI Engine sẽ nghiên cứu sâu tệp PDF bạn đã nạp để trích xuất nội dung chính xác. Vui lòng hoàn thành các Node theo thứ tự từ trên xuống để đảm bảo tính logic xuyên suốt.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Settings & Suggestions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:px-0">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                                        <h3 className="font-black text-xl text-slate-900">Gợi ý hoạt động</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <ActivitySuggestionBox
                                            label="Sinh hoạt dưới cờ"
                                            value={shdcSuggestion}
                                            onChange={setShdcSuggestion}
                                            placeholder="Ý tưởng tổ chức..."
                                            colorClass="blue"
                                            periodCount={selectedChuDe?.shdc || 0}
                                        />
                                        <ActivitySuggestionBox
                                            label="Hoạt động giáo dục"
                                            value={hdgdSuggestion}
                                            onChange={setHdgdSuggestion}
                                            placeholder="Nội dung trọng tâm..."
                                            colorClass="green"
                                            periodCount={selectedChuDe?.hdgd || 0}
                                        />
                                        <ActivitySuggestionBox
                                            label="Sinh hoạt lớp"
                                            value={shlSuggestion}
                                            onChange={setShlSuggestion}
                                            placeholder="Yêu cầu sinh hoạt..."
                                            colorClass="orange"
                                            periodCount={selectedChuDe?.shl || 0}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 h-full flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-amber-500 rounded-full" />
                                        <h3 className="font-black text-xl text-slate-900 focus-visible:">Chỉ dẫn đặc biệt</h3>
                                    </div>
                                    <div className="premium-neumo p-6 flex-1 flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Global AI Directives</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    // Trigger pre-fill dialog
                                                    const event = new CustomEvent('openPreFill', { detail: 'global' });
                                                    window.dispatchEvent(event);
                                                }}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                <Lightbulb className="h-3 w-3" />
                                                Gợi ý
                                            </Button>
                                        </div>
                                        <Textarea
                                            value={lessonCustomInstructions}
                                            onChange={(e) => setLessonCustomInstructions(e.target.value)}
                                            placeholder="VD: Sử dụng phương pháp thảo luận nhóm, tích hợp năng lực số..."
                                            className="flex-1 premium-neumo-inset border-none px-4 py-3 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-100 min-h-[200px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Results Display Area - Premium Editor Style */}
                            {lessonResult && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 lg:px-0">
                                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Mục tiêu Kiến thức */}
                                                <AISectionEditor
                                                    label="Mục tiêu Kiến thức"
                                                    value={lessonResult.muc_tieu_kien_thuc || ""}
                                                    onChange={(val) => setLessonResult({ ...lessonResult, muc_tieu_kien_thuc: val })}
                                                    bgClass="premium-neumo p-6"
                                                    field="muc_tieu_kien_thuc"
                                                />
                                                <AISectionEditor
                                                    label="Mục tiêu Năng lực"
                                                    value={lessonResult.muc_tieu_nang_luc || ""}
                                                    onChange={(val) => setLessonResult({ ...lessonResult, muc_tieu_nang_luc: val })}
                                                    bgClass="premium-neumo p-6"
                                                    field="muc_tieu_nang_luc"
                                                />
                                                <AISectionEditor
                                                    label="Mục tiêu Phẩm chất"
                                                    value={lessonResult.muc_tieu_pham_chat || ""}
                                                    onChange={(val) => setLessonResult({ ...lessonResult, muc_tieu_pham_chat: val })}
                                                    bgClass="premium-neumo p-6"
                                                    field="muc_tieu_pham_chat"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <AISectionEditor
                                                    label="GV Chuẩn bị"
                                                    value={lessonResult.gv_chuan_bi || ""}
                                                    onChange={(val) => setLessonResult({ ...lessonResult, gv_chuan_bi: val })}
                                                    bgClass="premium-glass soft-pastel-sky/10 p-6"
                                                    field="gv_chuan_bi"
                                                />
                                                <AISectionEditor
                                                    label="HS Chuẩn bị"
                                                    value={lessonResult.hs_chuan_bi || ""}
                                                    onChange={(val) => setLessonResult({ ...lessonResult, hs_chuan_bi: val })}
                                                    bgClass="premium-glass soft-pastel-sky/10 p-6"
                                                    field="hs_chuan_bi"
                                                />
                                            </div>
                                        </div>

                                        {(lessonResult.tich_hop_nls || lessonResult.tich_hop_dao_duc) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {lessonResult.tich_hop_nls && (
                                                    <AISectionEditor
                                                        label="Tích hợp Năng lực số"
                                                        value={lessonResult.tich_hop_nls}
                                                        onChange={(val) => setLessonResult({ ...lessonResult, tich_hop_nls: val })}
                                                        bgClass="premium-glass soft-pastel-mint/20 border-emerald-200 p-6 shadow-xl"
                                                        field="tich_hop_nls"
                                                    />
                                                )}
                                                {lessonResult.tich_hop_dao_duc && (
                                                    <AISectionEditor
                                                        label="Tích hợp Đạo đức"
                                                        value={lessonResult.tich_hop_dao_duc}
                                                        onChange={(val) => setLessonResult({ ...lessonResult, tich_hop_dao_duc: val })}
                                                        bgClass="premium-glass soft-pastel-salmon/20 border-red-200 p-6 shadow-xl"
                                                        field="tich_hop_dao_duc"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <AISectionEditor
                                                label="Sinh hoạt Dưới cờ"
                                                value={lessonResult.shdc || ""}
                                                onChange={(val) => setLessonResult({ ...lessonResult, shdc: val })}
                                                bgClass="premium-neumo p-6"
                                                field="shdc"
                                            />
                                            <AISectionEditor
                                                label="Sinh hoạt Lớp"
                                                value={lessonResult.shl || ""}
                                                onChange={(val) => setLessonResult({ ...lessonResult, shl: val })}
                                                bgClass="premium-neumo p-6"
                                                field="shl"
                                            />
                                        </div>

                                        <AISectionEditor
                                            label="Hồ sơ Dạy học & Phụ lục"
                                            value={lessonResult.ho_so_day_hoc || ""}
                                            onChange={(val) => setLessonResult({ ...lessonResult, ho_so_day_hoc: val })}
                                            bgClass="premium-glass soft-pastel-sky/20 p-8 border-slate-200"
                                            field="ho_so_day_hoc"
                                        />

                                        <div className="space-y-8">
                                            <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                                                    <Zap className="h-6 w-6" />
                                                </div>
                                                Diễn trình Hoạt động Chi tiết
                                            </h3>

                                            {[
                                                { label: "Hoạt động Khởi động", field: "hoat_dong_khoi_dong" },
                                                { label: "Hoạt động Khám phá", field: "hoat_dong_kham_pha" },
                                                { label: "Hoạt động Luyện tập", field: "hoat_dong_luyen_tap" },
                                                { label: "Hoạt động Vận dụng", field: "hoat_dong_van_dung" },
                                                { label: "Hướng dẫn về nhà", field: "huong_dan_ve_nha" },
                                                { label: "Nội dung Chuẩn bị (Bài sau)", field: "noi_dung_chuan_bi" }
                                            ].map((act) => (
                                                (lessonResult as any)[act.field] && (
                                                    <AISectionEditor
                                                        key={act.field}
                                                        label={act.label}
                                                        value={(lessonResult as any)[act.field]}
                                                        onChange={(val) => setLessonResult({ ...lessonResult, [act.field]: val })}
                                                        bgClass="premium-neumo p-8"
                                                        field={act.field as any}
                                                    />
                                                )
                                            ))}
                                        </div>
                                    </div>

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
