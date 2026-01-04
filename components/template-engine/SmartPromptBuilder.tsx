
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
            setCoreTasks(result.coreTasks);
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
            coreTasks,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <SmartField label="Đặc điểm Học sinh (Psychology)" value={studentCharacteristics} onChange={setStudentCharacteristics} height="h-32" />
                        <SmartField label="Mục tiêu bài dạy (Objectives)" value={objectives} onChange={setObjectives} height="h-64" />
                        <SmartField label="Nhiệm vụ cốt lõi (Tasks)" value={coreTasks} onChange={setCoreTasks} height="h-80" />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <SmartField label="Gợi ý SHDC & SHL" value={shdcSuggestions} onChange={setShdcSuggestions} height="h-40" />
                        <SmartField label="Năng lực số (Digital Tools)" value={digitalCompetency} onChange={setDigitalCompetency} height="h-48" />
                        <SmartField label="Công cụ đánh giá (Assessment)" value={assessmentTools} onChange={setAssessmentTools} height="h-48" />
                        <SmartField label="Lưu ý sư phạm (Pedagogy)" value={pedagogicalNotes} onChange={setPedagogicalNotes} bg="bg-yellow-50" height="h-48" />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="outline" onClick={() => setData(null)}>Hủy bỏ</Button>
                        <Button
                            onClick={handleGeneratePrompt}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xl"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Tạo & Xem Prompt
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

function SmartField({ label, value, onChange, height = "h-24", bg = "bg-white" }: { label: string, value: string, onChange: (v: string) => void, height?: string, bg?: string }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</Label>
            <Textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`${height} ${bg} resize-none focus:ring-indigo-100 border-slate-200`}
            />
        </div>
    )
}
