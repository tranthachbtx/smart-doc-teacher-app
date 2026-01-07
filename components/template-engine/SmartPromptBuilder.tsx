
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sparkles,
    Database,
    Copy,
    Send,
    CheckCircle,
    RefreshCw,
    Eye
} from "lucide-react";
import {
    SmartPromptService,
    SmartPromptData
} from "@/lib/services/smart-prompt-service";
import { toast } from "@/hooks/use-toast";

interface SmartPromptBuilderProps {
    grade: string;
    topicName: string;
    chuDeSo?: string;
    fileSummary?: string; // Optional summary of uploaded file
}

export function SmartPromptBuilder({ grade, topicName, chuDeSo, fileSummary }: SmartPromptBuilderProps) {
    const [data, setData] = useState<SmartPromptData | null>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    // Field states
    const [objectives, setObjectives] = useState("");
    const [studentCharacteristics, setStudentCharacteristics] = useState("");
    const [coreTasks, setCoreTasks] = useState("");
    const [shdcSuggestions, setShdcSuggestions] = useState("");
    const [digitalCompetency, setDigitalCompetency] = useState("");
    const [assessmentTools, setAssessmentTools] = useState("");
    const [pedagogicalNotes, setPedagogicalNotes] = useState("");

    const handleLookup = async () => {
        if (!grade || !topicName) {
            toast({
                title: "Thiếu thông tin",
                description: "Vui lòng chọn Khối và nhập Tên bài dạy",
                variant: "destructive",
            });
            return;
        }

        setIsLookingUp(true);
        try {
            const result = await SmartPromptService.lookupSmartData(grade, topicName, chuDeSo);
            setData(result);

            // Auto-fill fields
            setObjectives(result.objectives);
            setStudentCharacteristics(result.studentCharacteristics);
            setCoreTasks(Object.values(result.coreMissions).join("\n\n"));
            setShdcSuggestions(result.shdc_shl_suggestions);
            setDigitalCompetency(result.digitalCompetency);
            setAssessmentTools(result.assessmentTools);
            setPedagogicalNotes(result.pedagogicalNotes);

            toast({
                title: "Tra cứu thành công",
                description: "Đã tìm thấy dữ liệu từ Database chuyên gia",
            });
        } catch (e) {
            console.error(e);
            toast({
                title: "Lỗi tra cứu",
                description: "Không thể tìm thấy dữ liệu. Vui lòng kiểm tra lại cấu hình.",
                variant: "destructive",
            });
        } finally {
            setIsLookingUp(false);
        }
    };

    const handleGeneratePrompt = () => {
        if (!data) return;

        // Construct current data object from editable fields
        const currentData: SmartPromptData = {
            grade,
            topicName,
            objectives,
            studentCharacteristics,
            coreMissions: {
                khoiDong: coreTasks.split("\n\n")[0] || "",
                khamPha: coreTasks.split("\n\n")[1] || "",
                luyenTap: coreTasks.split("\n\n")[2] || "",
                vanDung: coreTasks.split("\n\n")[3] || ""
            },
            shdc_shl_suggestions: shdcSuggestions,
            digitalCompetency,
            assessmentTools,
            pedagogicalNotes
        };

        const prompt = SmartPromptService.buildFinalSmartPrompt(currentData, fileSummary);
        setGeneratedPrompt(prompt);
        setShowPreview(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPrompt);
        toast({
            title: "Đã sao chép",
            description: "Prompt đã được lưu vào clipboard",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Smart Prompt Builder
                </h3>
                <Button
                    onClick={handleLookup}
                    disabled={isLookingUp}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                >
                    {isLookingUp ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                    Tra cứu Database
                </Button>
            </div>

            {data && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Section 1: Pedagogical Context */}
                    <div className="premium-glass p-8 rounded-[3rem] border-blue-100 shadow-2xl bg-white/95">
                        <h4 className="text-sm font-black text-blue-800 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-blue-100/50">
                                <Sparkles className="h-5 w-5" />
                            </span>
                            01. Bối cảnh sư phạm & Tâm lý học sinh
                        </h4>
                        <div className="space-y-8">
                            <SmartField label="Đặc điểm Học sinh (Psychology)" value={studentCharacteristics} onChange={setStudentCharacteristics} height="min-h-[120px]" bg="bg-slate-50/50" />
                            <SmartField label="Mục tiêu bài dạy (Circular 32/2018)" value={objectives} onChange={setObjectives} height="min-h-[200px]" bg="bg-slate-50/50" />
                        </div>
                    </div>

                    {/* Section 2: Core Tasks */}
                    <div className="premium-glass p-8 rounded-[3rem] border-indigo-100 shadow-2xl bg-white/95">
                        <h4 className="text-sm font-black text-indigo-800 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-indigo-100/50">
                                <Database className="h-5 w-5" />
                            </span>
                            02. Hoạt động trọng tâm & Nội dung chi tiết
                        </h4>
                        <SmartField label="Chi tiết nhiệm vụ & Sản phẩm dự kiến" value={coreTasks} onChange={setCoreTasks} height="min-h-[400px]" bg="bg-slate-50/50" />
                    </div>

                    {/* Section 3: Integration & Tools */}
                    <div className="premium-glass p-8 rounded-[3rem] border-emerald-100 shadow-2xl bg-white/95">
                        <h4 className="text-sm font-black text-emerald-800 mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-emerald-100/50">
                                <RefreshCw className="h-5 w-5" />
                            </span>
                            03. Môi trường, Công cụ & Đánh giá
                        </h4>
                        <div className="space-y-8">
                            <SmartField label="Gợi ý SHDC & SHL" value={shdcSuggestions} onChange={setShdcSuggestions} height="min-h-[160px]" bg="bg-slate-50/50" />
                            <SmartField label="Năng lực số (Digital Tools)" value={digitalCompetency} onChange={setDigitalCompetency} height="min-h-[220px]" bg="bg-slate-50/50" />
                            <SmartField label="Công cụ đánh giá (Rubric/PHT)" value={assessmentTools} onChange={setAssessmentTools} height="min-h-[160px]" bg="bg-slate-50/50" />
                            <SmartField label="Lưu ý sư phạm (Pedagogy)" value={pedagogicalNotes} onChange={setPedagogicalNotes} bg="bg-amber-50/30" height="min-h-[220px]" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row justify-end gap-4 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setData(null)}
                            className="h-14 px-8 rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            HỦY BỎ TRA CỨU
                        </Button>
                        <Button
                            onClick={handleGeneratePrompt}
                            className="h-14 px-10 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:scale-[1.02] transition-all text-white font-black shadow-2xl hover:shadow-indigo-200/50"
                        >
                            <Eye className="h-5 w-5 mr-3" />
                            TẠO & XEM PROMPT CHI TIẾT
                        </Button>
                    </div>
                </div>
            )}

            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b flex items-center justify-between bg-white">
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                <Database className="h-5 w-5 text-purple-600" />
                                Prompt Gemini Pro Ready
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                                Đóng
                            </Button>
                        </div>
                        <CardContent className="p-0 flex-1 overflow-auto bg-slate-50 relative">
                            <Textarea
                                value={generatedPrompt}
                                readOnly
                                className="w-full h-full min-h-[500px] p-6 text-sm font-mono border-none focus:ring-0 bg-transparent resize-none leading-relaxed"
                            />
                            <Button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-sm text-slate-700 hover:text-indigo-600 backdrop-blur-sm"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Sao chép Prompt
                            </Button>

                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <a
                                    href="https://aistudio.google.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Mở Google AI Studio
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function SmartField({ label, value, onChange, height = "min-h-[120px]", bg = "bg-white" }: { label: string, value: string, onChange: (v: string) => void, height?: string, bg?: string }) {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <div className="group space-y-3 transition-all duration-300 w-full">
            <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                    {label}
                </Label>
                <div className="h-[1px] flex-1 bg-slate-200/60 dark:bg-slate-700 ml-6 group-focus-within:bg-indigo-200 transition-colors" />
            </div>
            <div className="relative">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`${height} ${bg} w-full rounded-3xl border-slate-200/80 dark:border-slate-700 shadow-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50/50 dark:focus:ring-indigo-900/30 overflow-hidden resize-none transition-all duration-300 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 placeholder:text-slate-300 p-6`}
                    style={{ minHeight: height.includes('[') ? height.split('[')[1].split(']')[0] : '120px' }}
                />
                <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-sm text-[10px] font-black text-indigo-500 px-3 py-1.5 rounded-full border border-indigo-50 dark:border-indigo-900/50 uppercase tracking-widest">
                        {value?.length || 0} characters
                    </div>
                </div>
            </div>
        </div>
    );
}
