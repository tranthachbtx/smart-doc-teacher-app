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
} from "lucide-react";
import type { LessonResult, LessonTask, ActionResult } from "@/lib/types";
import type { PPCTChuDe } from "@/lib/data/ppct-database";
import { getChuDeListByKhoi } from "@/lib/data/ppct-database";
import { useSlowOrchestrator } from "@/hooks/use-slow-orchestrator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
    // --- ANTIGRAVITY v6.0: CLIENT-SIDE SAGA INTEGRATION ---
    const {
        currentJob,
        isGenerating: isSagaGenerating,
        startJob: startSagaJob,
        resumeJob: resumeSagaJob
    } = useSlowOrchestrator();

    const handleSagaGenerate = async () => {
        if (!lessonGrade || !lessonAutoFilledTheme) return;

        // Prepare file context if exists
        const sagaContext = {
            lessonFile: lessonFile || undefined,
            grade: lessonGrade,
            topic: lessonAutoFilledTheme,
        };

        setSuccess("🔥 Kích hoạt hệ thống Client-Side Saga (v6.0). Quy trình 'Nấu chậm' 45-60 phút đang bắt đầu tại trình duyệt của bạn...");

        // Start the job (which internally handles task distribution and slow cooking)
        await startSagaJob(lessonGrade, lessonAutoFilledTheme);
    };

    // Effect to sync Saga completed tasks to lessonResult
    React.useEffect(() => {
        if (currentJob && currentJob.tasks.length > 0) {
            const completedTasks = currentJob.tasks.filter(t => t.status === 'completed');
            if (completedTasks.length > 0) {
                const newResult: any = { ...lessonResult };
                let hashChanged = false;
                completedTasks.forEach(task => {
                    if (task.output && !newResult[task.id]) {
                        newResult[task.id] = task.output;
                        hashChanged = true;
                    }
                });
                if (hashChanged && setLessonResult) {
                    setLessonResult(newResult);
                }
            }
        }
    }, [currentJob, lessonResult, setLessonResult]);

    // --- REDIRECTING MANUAL CLICKS TO SAGA ---
    const handleStepGenerate = (stepId: string) => {
        setSuccess(`Vui lòng sử dụng hệ thống "Saga Slow-Cooking" bên dưới để tạo phần "${stepId}". Chế độ thủ công đã bị tạm dừng để tránh lỗi Vercel Timeout.`);
    };

    const expandedStep = null; // Legacy placeholder
    const setExpandedStep = (val: any) => { };
    const stepInstructions: Record<string, string> = {};

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
                { id: 'shdc', label: '3. Sinh hoạt dưới cờ & Lớp', resultKey: 'shdc', icon: '🏛️' },
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
            ]
        },
        {
            stage: "PHASE 4: FINALIZATION",
            tasks: [
                { id: 'ho_so_day_hoc', label: '7. Hồ sơ: Phiếu & Rubric', resultKey: 'ho_so_day_hoc', icon: '📋' },
                { id: 'preparation', label: '8. Hướng dẫn về nhà', resultKey: 'huong_dan_ve_nha', icon: '🔜' },
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
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label className="text-slate-700 font-medium">{label}</Label>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Làm sôi nổi hơn"
                            onClick={() => handleAIAction("Làm cho hoạt động này sinh động và sôi nổi hơn")}
                            className="h-7 w-7 p-0 text-orange-500 hover:text-orange-600"
                        >
                            <Zap className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Thêm trò chơi"
                            onClick={() => handleAIAction("Thêm một trò chơi nhỏ khởi động hoặc củng cố")}
                            className="h-7 w-7 p-0 text-blue-500 hover:text-blue-600"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            title="Tối ưu năng lực số"
                            onClick={() => handleAIAction("Tối ưu hóa phần tích hợp năng lực số")}
                            className="h-7 w-7 p-0 text-indigo-500 hover:text-indigo-600"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(value)}
                            className="h-7 w-7 p-0"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`min-h-[100px] ${bgClass} ${isEditingWithAI ? 'opacity-50' : ''}`}
                    />
                    {isEditingWithAI && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
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
                bg: 'bg-blue-50 dark:bg-blue-950',
                border: 'border-blue-200 dark:border-blue-800',
                header: 'hover:bg-blue-100 dark:hover:bg-blue-900',
                text: 'text-blue-800 dark:text-blue-200',
                badge: 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
                dot: 'bg-blue-500',
            },
            green: {
                bg: 'bg-green-50 dark:bg-green-950',
                border: 'border-green-200 dark:border-green-800',
                header: 'hover:bg-green-100 dark:hover:bg-green-900',
                text: 'text-green-800 dark:text-green-200',
                badge: 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200',
                dot: 'bg-green-500',
            },
            orange: {
                bg: 'bg-orange-50 dark:bg-orange-950',
                border: 'border-orange-200 dark:border-orange-800',
                header: 'hover:bg-orange-100 dark:hover:bg-orange-900',
                text: 'text-orange-800 dark:text-orange-200',
                badge: 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200',
                dot: 'bg-orange-500',
            },
        };

        const colors = colorMap[colorClass];
        const key = colorClass === 'blue' ? 'shdc' : colorClass === 'green' ? 'hdgd' : 'shl';
        const isExpanded = expandedActivities[key];

        return (
            <div className={`${colors.bg} rounded-lg border ${colors.border} overflow-hidden`}>
                <div
                    className={`flex items-center justify-between p-3 cursor-pointer ${colors.header} transition-colors`}
                    onClick={() => toggleActivity(key)}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                        <Label className={`${colors.text} font-medium cursor-pointer`}>
                            {label}
                        </Label>
                        {periodCount > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge} font-medium`}>
                                {periodCount} tiết
                            </span>
                        )}
                    </div>
                    {isExpanded ? <ChevronUp className={`h-4 w-4 ${colors.text}`} /> : <ChevronDown className={`h-4 w-4 ${colors.text}`} />}
                </div>
                {isExpanded && (
                    <div className="p-3 pt-0">
                        <Textarea
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="min-h-[80px] text-sm bg-white dark:bg-slate-900"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
            {/* Left Column: Configuration & Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shrink-0">
                    <CardContent className="p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <BookOpen className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Cấu hình bài dạy</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Khối lớp</Label>
                                <Select
                                    value={lessonGrade}
                                    onValueChange={(value) => {
                                        setLessonGrade(value);
                                        setSelectedChuDeSo("");
                                        setLessonAutoFilledTheme("");
                                    }}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200">
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
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Chủ đề (theo PPCT)</Label>
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
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50/50 border-slate-200">
                                        <SelectValue placeholder={lessonGrade ? "Chọn chủ đề..." : "Chọn khối trước"} />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tên bài dạy chi tiết</Label>
                                <Textarea
                                    value={lessonAutoFilledTheme}
                                    onChange={(e) => setLessonAutoFilledTheme(e.target.value)}
                                    placeholder="Nhập tên bài học..."
                                    className="min-h-[80px] rounded-xl bg-slate-50/50 border-slate-200 resize-none focus:ring-indigo-500 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Model</Label>
                                <Select value={selectedModel} onValueChange={setSelectedModel}>
                                    <SelectTrigger className="h-11 rounded-xl bg-indigo-50/30 border-indigo-100 text-indigo-700 font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gemini-1.5-flash">🛡️ Gemini 1.5 Flash (Bản chuẩn Ổn định nhất)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* HIỂN THỊ THÔNG TIN PPCT CHI TIẾT */}
                            {selectedChuDe && (
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3 animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="h-4 w-4 text-indigo-600" />
                                        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase">Phân bổ tiết dạy (PPCT)</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl border border-white/40 text-center shadow-sm">
                                            <p className="text-[10px] text-slate-500 font-medium">SHDC</p>
                                            <p className="text-sm font-black text-indigo-600">{selectedChuDe.shdc} tiết</p>
                                        </div>
                                        <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl border border-white/40 text-center shadow-sm">
                                            <p className="text-[10px] text-slate-500 font-medium">HĐGD</p>
                                            <p className="text-sm font-black text-emerald-600">{selectedChuDe.hdgd} tiết</p>
                                        </div>
                                        <div className="bg-white/60 dark:bg-slate-800/60 p-2 rounded-xl border border-white/40 text-center shadow-sm">
                                            <p className="text-[10px] text-slate-500 font-medium">SHL</p>
                                            <p className="text-sm font-black text-orange-600">{selectedChuDe.shl} tiết</p>
                                        </div>
                                    </div>

                                    {selectedChuDe.hoat_dong && selectedChuDe.hoat_dong.length > 0 && (
                                        <div className="mt-2 space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-3 w-3 text-amber-500" />
                                                <span className="text-[10px] font-bold text-slate-600 uppercase">Nội dung trọng tâm (DB)</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {selectedChuDe.hoat_dong.map((hd, i) => (
                                                    <li key={i} className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-lg border border-white/20">
                                                        • {hd}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={`p-4 rounded-2xl border-2 border-2 border-dashed transition-all ${lessonFile ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-indigo-600" />
                                    Giáo án cũ / Tham khảo (PDF)
                                </Label>
                                {lessonFile && (
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-red-500" onClick={() => setLessonFile(null)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

                            {lessonFile ? (
                                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-100 shadow-sm">
                                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <Copy className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-bold text-emerald-700 truncate">{lessonFile.name}</p>
                                        <p className="text-[9px] text-emerald-600/70">Đã nạp bản gốc để tối ưu</p>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full h-20 rounded-xl border-dashed bg-white/50 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col gap-1"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="text-[10px] font-bold">Nạp Giáo án cũ để nâng cấp</span>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Main Stage */}
            <div className="lg:col-span-8 space-y-6">
                <div className="space-y-6">
                    {/* KHỐI THÔNG BÁO TÁC VỤ (DI CHUYỂN LÊN TRÊN THEO YÊU CẦU) */}
                    <div className="space-y-4">
                        {success && (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 animate-in fade-in slide-in-from-top-4 duration-300">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{success}</span>
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl flex items-center gap-3 text-red-800 dark:text-red-300 animate-in fade-in slide-in-from-top-4 duration-300">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {/* Banner trạng thái bản thảo (Move up from bottom) */}
                        {lessonResult && (
                            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600">
                                        <CheckCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Bản thảo Giáo án Đã sẵn sàng</h3>
                                        <p className="text-xs text-emerald-700/70 italic">Bạn có thể tinh chỉnh các phần chi tiết ở bên dưới</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-100 h-10 px-4"
                                        onClick={onAudit}
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Kiểm định AI
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none h-10 px-4 font-bold"
                                        onClick={onExport}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Xuất Word
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Card className="border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-t-4 border-t-indigo-500 overflow-hidden">
                        <CardContent className="p-6 md:p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
                                        <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
                                        Phòng Lab Thiết kế Chuyên sâu
                                    </h2>
                                    <p className="text-slate-500 text-sm">Kiến tạo giáo án 5512 chi tiết với sự hỗ trợ của AI & PDF chuyên biệt</p>
                                </div>
                                <div>
                                    {!isAutoRunning ? (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    if (confirm('Bạn có chắc chắn muốn xóa bản thảo hiện tại và làm mới từ đầu không?')) {
                                                        localStorage.removeItem(`lesson_state_${lessonGrade}_${selectedChuDeSo}`);
                                                        setLessonResult(null);
                                                        setSuccess("Đã làm mới bản thảo thành công!");
                                                    }
                                                }}
                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                                disabled={!lessonResult}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Làm mới
                                            </Button>
                                            <Button
                                                onClick={handleSagaGenerate}
                                                disabled={isSagaGenerating || !lessonGrade || !lessonAutoFilledTheme}
                                                className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white shadow-xl shadow-indigo-200 border border-white/20"
                                            >
                                                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                                                Saga Slow-Cooking (45-60 min)
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button disabled className="bg-slate-100 text-slate-400 border border-slate-200">
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin text-emerald-600" />
                                            Saga đang 'nấu chậm'... (Vui lòng không đóng Tab)
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* SAGA PROGRESS DASHBOARD (v6.0) */}
                            {currentJob && (
                                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in duration-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-100">Tiến trình Saga Client-Side</h4>
                                                <p className="text-xs text-slate-500">Nấu chậm 1000-1500 từ/phần • Vượt rào API</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {currentJob.status === 'processing' && (
                                                <div className="flex items-center gap-2 mr-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Live Engine</span>
                                                </div>
                                            )}
                                            <Badge variant={currentJob.status === 'completed' ? 'default' : 'outline'} className={currentJob.status === 'completed' ? 'bg-emerald-500' : ''}>
                                                {currentJob.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">Hoàn thành: {currentJob.tasks.filter(t => t.status === 'completed').length}/{currentJob.tasks.length}</span>
                                            <span className="text-emerald-600">{Math.round((currentJob.tasks.filter(t => t.status === 'completed').length / (currentJob.tasks.length || 1)) * 100)}%</span>
                                        </div>
                                        <Progress value={(currentJob.tasks.filter(t => t.status === 'completed').length / (currentJob.tasks.length || 1)) * 100} className="h-2 rounded-full" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                                        {currentJob.tasks.map((task) => (
                                            <div key={task.id} className={`p-3 rounded-2xl border transition-all ${task.status === 'completed' ? 'bg-emerald-50/50 border-emerald-100' :
                                                task.status === 'processing' ? 'bg-indigo-50/50 border-indigo-100 shadow-lg shadow-indigo-100/50' :
                                                    task.status === 'failed' ? 'bg-red-50 border-red-100' :
                                                        'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60'
                                                }`}>
                                                <div className="flex items-center gap-2">
                                                    {task.status === 'completed' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> :
                                                        task.status === 'processing' ? <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" /> :
                                                            task.status === 'failed' ? <AlertCircle className="h-4 w-4 text-red-500" /> :
                                                                <Clock className="h-4 w-4 text-slate-300" />}
                                                    <span className={`text-[10px] font-bold truncate flex-1 ${task.status === 'completed' ? 'text-emerald-700' :
                                                        task.status === 'processing' ? 'text-indigo-700' : 'text-slate-400'
                                                        }`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {currentJob.status === 'failed' && (
                                        <div className="flex gap-2">
                                            <Button onClick={() => resumeSagaJob(currentJob.jobId)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                                                Tiếp tục (Resume)
                                            </Button>
                                            <Button variant="outline" onClick={() => startSagaJob(lessonGrade, lessonAutoFilledTheme)} className="flex-1 border-slate-200">
                                                Làm lại (Restart)
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {designSteps.map((step, idx) => {
                                    const isDone = !!(lessonResult as any)?.[step.resultKey] || (step.id === 'shdc_shl' && !!lessonResult?.shdc);
                                    const currentLoading = stepInProgress === step.id;

                                    return (
                                        <div key={step.id} className="space-y-4">
                                            {/* Stage Header If First Task In Stage */}
                                            {workflowPlan.find(p => p.tasks[0].id === step.id) && (
                                                <div className="col-span-full pt-4 border-b border-indigo-100 dark:border-indigo-900 pb-2 mb-2">
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                                        {workflowPlan.find(p => p.tasks[0].id === step.id)?.stage}
                                                    </span>
                                                </div>
                                            )}

                                            <div
                                                className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${isDone
                                                    ? 'bg-emerald-50/30 border-emerald-200/50 shadow-sm'
                                                    : 'bg-slate-50/50 border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl'
                                                    } ${step.isSub ? 'ml-6 scale-[0.98]' : ''}`}
                                            >
                                                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}>
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200/50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                                        }`}>
                                                        {isDone ? <CheckCircle className="h-6 w-6" /> : (step as any).icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {step.isSub ? 'TASK NODE' : 'MILESTONE'}
                                                        </p>
                                                        <h4 className={`text-sm font-bold flex items-center gap-2 ${isDone ? 'text-emerald-900' : 'text-slate-700'}`}>
                                                            {step.label}
                                                            {stepInstructions[step.id] && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                                                        </h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`h-8 w-8 p-0 rounded-lg ${expandedStep === step.id ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}
                                                        onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={isDone ? "ghost" : "default"}
                                                        className={`h-10 px-5 rounded-xl font-bold transition-all ${isDone
                                                            ? 'text-emerald-600 hover:bg-emerald-100'
                                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                                                            }`}
                                                        disabled={isGenerating || !lessonGrade || !lessonAutoFilledTheme}
                                                        onClick={() => handleStepGenerate(step.id)}
                                                    >
                                                        {retryCountDown && currentLoading ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-[10px] opacity-80">Nghỉ ngơi...</span>
                                                                <span>{retryCountDown}s</span>
                                                            </div>
                                                        ) : currentLoading ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : isDone ? (
                                                            "Làm lại"
                                                        ) : (
                                                            <>
                                                                <Sparkles className="h-4 w-4 mr-2" />
                                                                Thiết kế
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Step-specific suggestion textbox */}
                                            {expandedStep === step.id && (
                                                <div className="ml-6 mr-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 shadow-inner animate-in slide-in-from-top-2 duration-200">
                                                    <Label className="text-[10px] font-bold text-indigo-600 flex items-center gap-1.5 mb-2">
                                                        <Sparkles className="h-3 w-3" />
                                                        CHỈ DẪN RIÊNG CHO {step.label.toUpperCase()}
                                                    </Label>
                                                    <Textarea
                                                        value={stepInstructions[step.id] || ""}
                                                        onChange={(e) => setStepInstructions({ ...stepInstructions, [step.id]: e.target.value })}
                                                        placeholder="VD: Sử dụng trò chơi đóng vai, tập trung vào tình huống thực tế..."
                                                        className="min-h-[80px] text-xs bg-slate-50/50 border-none focus:ring-1 focus:ring-indigo-100 rounded-lg"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 italic text-indigo-700 text-[10px]">
                                <Info className="h-4 w-4 flex-shrink-0" />
                                <p>AI sẽ tự động nghiên cứu tệp PDF bạn đã nạp để trích xuất nội dung chính xác. Hãy bắt đầu từ bước 1 để xác lập mục tiêu trọng tâm.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Settings & Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <MessageSquare className="h-5 w-5 text-indigo-600" />
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Gợi ý hoạt động</h3>
                            </div>
                            <div className="space-y-3">
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

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <Zap className="h-5 w-5 text-amber-500" />
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Chỉ dẫn đặc biệt</h3>
                            </div>
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all h-full">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Yêu cầu bổ sung cho AI</Label>
                                <Textarea
                                    value={lessonCustomInstructions}
                                    onChange={(e) => setLessonCustomInstructions(e.target.value)}
                                    placeholder="VD: Sử dụng phương pháp thảo luận nhóm, tích hợp năng lực số..."
                                    className="min-h-[120px] rounded-xl bg-slate-50/30 border-slate-100 focus:border-indigo-300 resize-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Display Area */}
                    {lessonResult && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            <div className="space-y-4">
                                {/* Editable Sections */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Step 2 Inputs: Objectives */}
                                        <AISectionEditor
                                            label="Mục tiêu Kiến thức"
                                            value={lessonResult.muc_tieu_kien_thuc || ""}
                                            onChange={(val) => setLessonResult({ ...lessonResult, muc_tieu_kien_thuc: val })}
                                            bgClass="bg-white border-slate-100"
                                            field="muc_tieu_kien_thuc"
                                        />
                                        <AISectionEditor
                                            label="Mục tiêu Năng lực"
                                            value={lessonResult.muc_tieu_nang_luc || ""}
                                            onChange={(val) => setLessonResult({ ...lessonResult, muc_tieu_nang_luc: val })}
                                            bgClass="bg-white border-slate-100"
                                            field="muc_tieu_nang_luc"
                                        />
                                        <AISectionEditor
                                            label="Mục tiêu Phẩm chất"
                                            value={lessonResult.muc_tieu_pham_chat || ""}
                                            onChange={(val) => setLessonResult({ ...lessonResult, muc_tieu_pham_chat: val })}
                                            bgClass="bg-white border-slate-100"
                                            field="muc_tieu_pham_chat"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <AISectionEditor
                                            label="GV Chuẩn bị"
                                            value={lessonResult.gv_chuan_bi || ""}
                                            onChange={(val) => setLessonResult({ ...lessonResult, gv_chuan_bi: val })}
                                            bgClass="bg-slate-50/50"
                                            field="gv_chuan_bi"
                                        />
                                        <AISectionEditor
                                            label="HS Chuẩn bị"
                                            value={lessonResult.hs_chuan_bi || ""}
                                            onChange={(val) => setLessonResult({ ...lessonResult, hs_chuan_bi: val })}
                                            bgClass="bg-slate-50/50"
                                            field="hs_chuan_bi"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 my-4" /> {/* Separator */}

                                {lessonResult.tich_hop_nls && (
                                    <AISectionEditor
                                        label="Tích hợp Năng lực số"
                                        value={lessonResult.tich_hop_nls}
                                        onChange={(val) => setLessonResult({ ...lessonResult, tich_hop_nls: val })}
                                        bgClass="bg-blue-50/30"
                                        field="tich_hop_nls"
                                    />
                                )}
                                {lessonResult.tich_hop_dao_duc && (
                                    <AISectionEditor
                                        label="Tích hợp Đạo đức"
                                        value={lessonResult.tich_hop_dao_duc}
                                        onChange={(val) => setLessonResult({ ...lessonResult, tich_hop_dao_duc: val })}
                                        bgClass="bg-purple-50/30"
                                        field="tich_hop_dao_duc"
                                    />
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AISectionEditor
                                        label="Sinh hoạt Dưới cờ"
                                        value={lessonResult.shdc || ""}
                                        onChange={(val) => setLessonResult({ ...lessonResult, shdc: val })}
                                        bgClass="bg-pink-50/30"
                                        field="shdc"
                                    />
                                    <AISectionEditor
                                        label="Sinh hoạt Lớp"
                                        value={lessonResult.shl || ""}
                                        onChange={(val) => setLessonResult({ ...lessonResult, shl: val })}
                                        bgClass="bg-pink-50/30"
                                        field="shl"
                                    />
                                </div>

                                <AISectionEditor
                                    label="Hồ sơ Dạy học & Phụ lục"
                                    value={lessonResult.ho_so_day_hoc || ""}
                                    onChange={(val) => setLessonResult({ ...lessonResult, ho_so_day_hoc: val })}
                                    bgClass="bg-slate-50 border-slate-200"
                                    field="ho_so_day_hoc"
                                />
                                {lessonResult.hoat_dong_khoi_dong && (
                                    <AISectionEditor
                                        label="Hoạt động Khởi động"
                                        value={lessonResult.hoat_dong_khoi_dong}
                                        onChange={(val) => setLessonResult({ ...lessonResult, hoat_dong_khoi_dong: val })}
                                        bgClass="bg-white border-slate-100"
                                        field="hoat_dong_khoi_dong"
                                    />
                                )}
                                {lessonResult.hoat_dong_kham_pha && (
                                    <AISectionEditor
                                        label="Hoạt động Khám phá"
                                        value={lessonResult.hoat_dong_kham_pha}
                                        onChange={(val) => setLessonResult({ ...lessonResult, hoat_dong_kham_pha: val })}
                                        bgClass="bg-white border-slate-100"
                                        field="hoat_dong_kham_pha"
                                    />
                                )}
                                {lessonResult.hoat_dong_luyen_tap && (
                                    <AISectionEditor
                                        label="Hoạt động Luyện tập"
                                        value={lessonResult.hoat_dong_luyen_tap}
                                        onChange={(val) => setLessonResult({ ...lessonResult, hoat_dong_luyen_tap: val })}
                                        bgClass="bg-white border-slate-100"
                                        field="hoat_dong_luyen_tap"
                                    />
                                )}
                                {lessonResult.hoat_dong_van_dung && (
                                    <AISectionEditor
                                        label="Hoạt động Vận dụng"
                                        value={lessonResult.hoat_dong_van_dung}
                                        onChange={(val) => setLessonResult({ ...lessonResult, hoat_dong_van_dung: val })}
                                        bgClass="bg-white border-slate-100"
                                        field="hoat_dong_van_dung"
                                    />
                                )}
                                {lessonResult.huong_dan_ve_nha && (
                                    <AISectionEditor
                                        label="Hướng dẫn về nhà"
                                        value={lessonResult.huong_dan_ve_nha}
                                        onChange={(val) => setLessonResult({ ...lessonResult, huong_dan_ve_nha: val })}
                                        bgClass="bg-white border-slate-100"
                                        field="huong_dan_ve_nha"
                                    />
                                )}
                                {lessonResult.noi_dung_chuan_bi && (
                                    <AISectionEditor
                                        label="Nội dung Chuẩn bị (Bài sau)"
                                        value={lessonResult.noi_dung_chuan_bi}
                                        onChange={(val) => setLessonResult({ ...lessonResult, noi_dung_chuan_bi: val })}
                                        bgClass="bg-amber-50/30 border-amber-100"
                                        field="noi_dung_chuan_bi"
                                    />
                                )}
                            </div>

                            {/* Actions Area */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-xl border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200"
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
                                    <Copy className="mr-2 h-4 w-4" />
                                    Sao chép Toàn bộ
                                </Button>
                            </div>

                            {/* Audit Result Display */}
                            {auditResult && (
                                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-3xl border border-amber-100 dark:border-amber-900/50 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center gap-3 mb-4 text-amber-700 dark:text-amber-400">
                                        <Sparkles className="w-6 h-6" />
                                        <h4 className="font-black text-lg">Phân tích & Kiểm định Sư phạm</h4>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-black/20 p-5 rounded-2xl border border-amber-200/50">
                                        <div className="whitespace-pre-wrap">{auditResult}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                    )}
                </div>
            </div>
        </div >
    );
}
