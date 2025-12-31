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
    X,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import type { LessonResult, LessonTask } from "@/lib/types";
import type { PPCTChuDe } from "@/lib/data/ppct-database";
import { getChuDeListByKhoi } from "@/lib/data/ppct-database";

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
    setSuccess: (msg: string) => void;
    lessonTopic: string;
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
    setSuccess,
    lessonTopic,
}: LessonTabProps) {
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
                                        <SelectItem key={chuDe.chu_de_so} value={chuDe.chu_de_so.toString()}>
                                            Chủ đề {chuDe.chu_de_so}: {chuDe.ten}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Theme Input */}
                <div className="space-y-2">
                    <Label>Tên Chủ Đề (Tự động điền)</Label>
                    <Input
                        value={lessonAutoFilledTheme}
                        onChange={(e) => setLessonAutoFilledTheme(e.target.value)}
                        placeholder="Tên chủ đề sẽ tự động hiển thị..."
                    />
                </div>

                {/* Full Plan Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                    <div className="space-y-1">
                        <Label className="text-base">Chế độ KHBD Đầy đủ</Label>
                        <p className="text-sm text-muted-foreground">
                            Tạo kế hoạch chi tiết bao gồm mục tiêu, thiết bị, SHDC, HĐGD, SHL...
                        </p>
                    </div>
                    <Switch
                        checked={lessonFullPlanMode}
                        onCheckedChange={setLessonFullPlanMode}
                    />
                </div>

                {/* Period Distribution - Show when a chu de is selected */}
                {selectedChuDe && lessonFullPlanMode && (
                    <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-indigo-600" />
                                <Label className="text-indigo-800 dark:text-indigo-200 font-medium">
                                    Phân phối tiết theo PPCT
                                </Label>
                            </div>
                            <span className="text-sm text-indigo-600 font-medium">
                                Tổng: {selectedChuDe.tong_tiet} tiết (Tuần {selectedChuDe.tuan_bat_dau || '?'} - {selectedChuDe.tuan_ket_thuc || '?'})
                            </span>
                        </div>

                        {/* Period Distribution Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {/* SHDC */}
                            <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">SHDC</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-blue-800 dark:text-blue-200">{selectedChuDe.shdc}</span>
                                        <span className="text-xs text-blue-600">tiết</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-blue-600 dark:text-blue-400">Sinh hoạt dưới cờ</p>
                            </div>

                            {/* HDGD */}
                            <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 border border-green-200 dark:border-green-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-green-700 dark:text-green-300">HĐGD</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-green-800 dark:text-green-200">{selectedChuDe.hdgd}</span>
                                        <span className="text-xs text-green-600">tiết</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-green-600 dark:text-green-400">Hoạt động giáo dục</p>
                            </div>

                            {/* SHL */}
                            <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">SHL</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-bold text-orange-800 dark:text-orange-200">{selectedChuDe.shl}</span>
                                        <span className="text-xs text-orange-600">tiết</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-orange-600 dark:text-orange-400">Sinh hoạt lớp</p>
                            </div>
                        </div>

                        {/* Suggested Activities from PPCT */}
                        {selectedChuDe.hoat_dong && selectedChuDe.hoat_dong.length > 0 && (
                            <div className="mt-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                <Label className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                                    Hoạt động gợi ý từ SGK:
                                </Label>
                                <ul className="mt-2 space-y-1.5">
                                    {selectedChuDe.hoat_dong.map((activity, idx) => (
                                        <li key={idx} className="text-xs text-indigo-600 dark:text-indigo-400 flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                                            <span>{activity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Activity Suggestions with Editable Content */}
                {lessonFullPlanMode && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-indigo-600" />
                            <Label className="text-indigo-800 dark:text-indigo-200 font-medium">
                                Gợi ý nội dung theo loại hoạt động
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Nhập gợi ý cụ thể để AI tạo nội dung chuyên sâu hơn cho từng loại hoạt động
                        </p>

                        {/* SHDC Suggestion with expand/collapse */}
                        <ActivitySuggestionBox
                            label="Sinh hoạt dưới cờ (SHDC)"
                            value={shdcSuggestion}
                            onChange={setShdcSuggestion}
                            placeholder="VD: Tổ chức diễn đàn về ý nghĩa truyền thống nhà trường, mời cựu HS chia sẻ..."
                            colorClass="blue"
                            periodCount={selectedChuDe?.shdc || 0}
                        />

                        {/* HDGD Suggestion */}
                        <ActivitySuggestionBox
                            label="Hoạt động giáo dục (HĐGD)"
                            value={hdgdSuggestion}
                            onChange={setHdgdSuggestion}
                            placeholder="VD: Thảo luận nhóm về các giá trị cốt lõi, đóng vai tình huống thực tế..."
                            colorClass="green"
                            periodCount={selectedChuDe?.hdgd || 0}
                        />

                        {/* SHL Suggestion */}
                        <ActivitySuggestionBox
                            label="Sinh hoạt lớp (SHL)"
                            value={shlSuggestion}
                            onChange={setShlSuggestion}
                            placeholder="VD: Chia sẻ cảm nhận cá nhân, lập kế hoạch hành động, đánh giá lẫn nhau..."
                            colorClass="orange"
                            periodCount={selectedChuDe?.shl || 0}
                        />
                    </div>
                )}

                {curriculumTasks.length > 0 && (
                    <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-green-600" />
                                <Label className="text-green-800 dark:text-green-200 font-medium">
                                    Nhiệm vụ gợi ý từ SGK ({curriculumTasks.length} nhiệm vụ)
                                </Label>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCurriculumTasks(!showCurriculumTasks)}
                                className="text-green-700 hover:text-green-800"
                            >
                                {showCurriculumTasks ? "Ẩn" : "Hiện"}
                            </Button>
                        </div>

                        {showCurriculumTasks && (
                            <div className="space-y-3">
                                {lessonTasks
                                    .filter((t) => t.source !== "user")
                                    .map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-3 bg-white dark:bg-green-900 rounded-md border border-green-300 dark:border-green-700"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        value={task.name}
                                                        onChange={(e) =>
                                                            updateLessonTask(task.id, "name", e.target.value)
                                                        }
                                                        className="h-7 text-sm font-medium text-green-800 dark:text-green-200 border-green-200 bg-transparent focus:ring-1 focus:ring-green-400"
                                                    />
                                                    <Textarea
                                                        value={task.content}
                                                        onChange={(e) =>
                                                            updateLessonTask(task.id, "content", e.target.value)
                                                        }
                                                        className="text-sm text-gray-600 dark:text-gray-300 min-h-[60px] resize-y bg-transparent border-gray-200"
                                                    />

                                                    {task.thoiLuongDeXuat && (
                                                        <p className="text-xs text-orange-600 italic">
                                                            * Thời lượng đề xuất từ SGK: {task.thoiLuongDeXuat}
                                                        </p>
                                                    )}

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
                                                        {(task.time || task.thoiLuongDeXuat) && (
                                                            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                                                <Clock className="h-3 w-3" />
                                                                <span className="text-xs font-medium">
                                                                    {task.time || task.thoiLuongDeXuat} phút
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                <p className="text-xs text-green-600 italic">
                                    * Các nhiệm vụ này được trích xuất từ cơ sở dữ liệu SGK "Kết nối Tri thức" và sẽ được AI sử dụng khi tạo KHBD. Bạn có thể chọn nhiệm vụ, chỉnh sửa thời gian hoặc thêm nhiệm vụ tùy chỉnh.
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
                                .map((task) => (
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
                        onChange={(e) => setLessonCustomInstructions(e.target.value)}
                        rows={3}
                    />
                    <p className="text-xs text-slate-500">
                        AI sẽ cập nhật nội dung dựa trên chỉ dẫn của bạn
                    </p>
                </div>

                {/* Generate button */}
                <Button
                    className="w-full"
                    onClick={onGenerate}
                    disabled={
                        isGenerating ||
                        !lessonGrade ||
                        !lessonAutoFilledTheme ||
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
                                        onClick={() => copyToClipboard(lessonResult.tich_hop_nls)}
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
                                            copyToClipboard(lessonResult.muc_tieu_kien_thuc || "")
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
                                            copyToClipboard(lessonResult.muc_tieu_nang_luc || "")
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
                                            copyToClipboard(lessonResult.muc_tieu_pham_chat || "")
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

                        {lessonFullPlanMode &&
                            (lessonResult.gv_chuan_bi ||
                                lessonResult.hs_chuan_bi ||
                                lessonResult.thiet_bi_day_hoc) && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-slate-100 rounded-lg">
                                        <Label className="text-slate-800 font-bold block mb-2">
                                            II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
                                        </Label>

                                        {lessonResult.gv_chuan_bi && (
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-indigo-700 font-medium italic">
                                                        1. Đối với giáo viên (Tích hợp NLS & Đạo đức):
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            copyToClipboard(lessonResult.gv_chuan_bi || "")
                                                        }
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    value={lessonResult.gv_chuan_bi || ""}
                                                    onChange={(e) =>
                                                        setLessonResult({
                                                            ...lessonResult,
                                                            gv_chuan_bi: e.target.value,
                                                        })
                                                    }
                                                    className="min-h-[100px] bg-slate-50"
                                                />
                                            </div>
                                        )}

                                        {lessonResult.hs_chuan_bi && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-indigo-700 font-medium italic">
                                                        2. Đối với học sinh và Hướng dẫn về nhà (Tích hợp NLS &
                                                        Đạo đức):
                                                    </Label>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            copyToClipboard(lessonResult.hs_chuan_bi || "")
                                                        }
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    value={lessonResult.hs_chuan_bi || ""}
                                                    onChange={(e) =>
                                                        setLessonResult({
                                                            ...lessonResult,
                                                            hs_chuan_bi: e.target.value,
                                                        })
                                                    }
                                                    className="min-h-[100px] bg-slate-50"
                                                />
                                            </div>
                                        )}

                                        {!lessonResult.gv_chuan_bi &&
                                            !lessonResult.hs_chuan_bi &&
                                            lessonResult.thiet_bi_day_hoc && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-slate-700 font-medium italic">
                                                            Thiết bị dạy học & Học liệu:
                                                        </Label>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                copyToClipboard(lessonResult.thiet_bi_day_hoc || "")
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
                                    </div>
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
                                        onClick={() => copyToClipboard(lessonResult.shdc || "")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={lessonResult.shdc || ""}
                                    onChange={(e) =>
                                        setLessonResult({ ...lessonResult, shdc: e.target.value })
                                    }
                                    className="min-h-[150px] bg-indigo-50"
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
                                    className="min-h-[150px] bg-indigo-50"
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
                                onClick={onAudit}
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
                                onClick={onExport}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
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
                                </div>
                                <div className="prose dark:prose-invert max-w-none text-sm bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                                    <div className="whitespace-pre-wrap">{auditResult}</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
