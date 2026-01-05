
import React, { useEffect } from 'react';
import { useLessonStore, ProcessingModule } from '@/lib/store/use-lesson-store';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { ExportService } from '@/lib/services/export-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, CheckCircle, RefreshCw, ClipboardList, Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromFile } from '@/lib/actions/gemini';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';

export function ManualProcessingHub() {
    const {
        lessonAutoFilledTheme,
        lessonGrade,
        expertGuidance, // Dùng làm context fileSummary
        setExpertGuidance,
        manualModules,
        setManualModules,
        updateModuleContent,
        isExporting,
        setLoading,
        setStatus,
        setExportProgress
    } = useLessonStore();

    const { toast } = useToast();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analyzingStatus, setAnalyzingStatus] = React.useState<string>("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Init modules if empty
    useEffect(() => {
        if (manualModules.length === 0 && lessonAutoFilledTheme) {
            const initialModules = ManualWorkflowService.analyzeStructure(expertGuidance, "2");
            setManualModules(initialModules);
        }
    }, [lessonAutoFilledTheme, manualModules.length, expertGuidance, setManualModules]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalyzingStatus("Đang khởi tạo...");

        // Reset file input value to allow re-uploading the same file if needed (e.g. after error)
        // fileInputRef.current!.value = ''; // Optional, but good practice

        try {
            // Lazy import to avoid circular dependencies if any, though here it is fine.
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            const result = await processor.processFile(file, (status) => {
                setAnalyzingStatus(status);
            });

            console.log('[ManualHub] Result received:', result);

            if (result.content && result.content.trim().length > 0) {
                setExpertGuidance(result.content); // Save Context

                // Re-analyze structure based on new content
                const modules = ManualWorkflowService.analyzeStructure(result.content, "2");
                setManualModules(modules);

                toast({
                    title: result.source === 'cache' ? "⚡ Đã tải từ Cache!" : "✅ Phân tích hoàn tất!",
                    description: result.source === 'cache'
                        ? "Tài liệu này đã được phân tích trước đó."
                        : `Đã trích xuất ${result.content.length} ký tự và cập nhật cấu trúc.`
                });
            } else {
                console.warn('[ManualHub] Content empty despite success flag.');
                throw new Error("Không tìm thấy nội dung văn bản trong tài liệu này. Vui lòng kiểm tra lại file.");
            }
        } catch (error: any) {
            console.error('[ManualHub] Error:', error);
            toast({ title: "Lỗi phân tích", description: error.message, variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
            setAnalyzingStatus("");
        }
    };

    const handleCopyPrompt = async (module: ProcessingModule) => {
        // Get previous context
        const currentIndex = manualModules.findIndex(m => m.id === module.id);
        const prevModule = currentIndex > 0 ? manualModules[currentIndex - 1] : undefined;

        let prevContext = undefined;
        if (prevModule && prevModule.isCompleted) {
            try {
                // Try extracting smart summary from JSON
                const jsonClean = prevModule.content.substring(prevModule.content.indexOf("{"), prevModule.content.lastIndexOf("}") + 1);
                const jsonData = JSON.parse(jsonClean);
                if (jsonData.summary_for_next_step) {
                    prevContext = `Tóm tắt hoạt động trước (${prevModule.title}): ${jsonData.summary_for_next_step}`;
                } else {
                    throw new Error("No summary field");
                }
            } catch (e) {
                // Fallback to raw text truncation
                prevContext = `Hoạt động trước: ${prevModule.title}. Nội dung tóm tắt: ${prevModule.content.substring(0, 200)}...`;
            }
        }

        // Notify user about system lookup
        toast({ title: "Đang tối ưu...", description: "Hệ thống đang tra cứu dữ liệu chuyên môn..." });

        // Lookup Smart Data (Async)
        const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);

        const prompt = ManualWorkflowService.generatePromptForModule(module, {
            topic: lessonAutoFilledTheme,
            grade: lessonGrade,
            fileSummary: expertGuidance || "Nội dung sách giáo khoa...",
            previousContext: prevContext,
            smartData: smartData
        });

        navigator.clipboard.writeText(prompt);
        toast({
            title: "Đã sao chép Prompt!",
            description: `Đã tích hợp Dữ liệu Chuyên gia vào Prompt (Clipboard Ready)`,
        });
    };

    // Helper to check JSON validity
    const isValidJSON = (text: string) => {
        if (!text) return false;
        try {
            const start = text.indexOf("{");
            const end = text.lastIndexOf("}");
            if (start === -1 || end === -1) return false;
            JSON.parse(text.substring(start, end + 1));
            return true;
        } catch { return false; }
    };

    const handleExport = async () => {
        setLoading('isExporting', true);
        try {
            // 1. Construct LessonResult from Modules
            const lessonResult = {
                title: lessonAutoFilledTheme,
                grade: lessonGrade,
                objectives: { knowledge: "Xem nội dung chi tiết", skills: "", qualities: "" },
                preparations: { teacher: "", student: "" },
                activities: manualModules.map(m => ({
                    title: m.title,
                    content: m.content, // ExportService will parse GV/HS from this
                    full_content: m.content
                }))
            };

            // 2. Call Export Service
            await ExportService.exportLessonToDocx(
                lessonResult as any,
                {
                    onProgress: (p) => setExportProgress(p),
                    onError: (e) => setStatus('error', e.message)
                }
            );

            setStatus('success', "Xuất file thành công!");
            toast({ title: "Thành công!", description: "File Word đã được tải xuống." });

        } catch (error: any) {
            setStatus('error', error.message);
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        } finally {
            setLoading('isExporting', false);
        }
    };

    if (!lessonAutoFilledTheme) {
        return <div className="text-center p-10 text-slate-500">Vui lòng nhập tên bài học hoặc tải file lên trước.</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Steps */}
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6" />
                        Quy trình "Copy-Paste" Thông Minh
                    </h2>
                    <p className="text-blue-600 mt-1">
                        Sử dụng Gemini Pro/ChatGPT bên ngoài để tạo nội dung chất lượng cao nhất.
                    </p>

                    {/* Upload Section */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                            {isAnalyzing ? (analyzingStatus || "Đang phân tích...") : "Phân tích tài liệu PDF"}
                        </Button>
                        {expertGuidance && (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                <FileText className="w-3 h-3 mr-1" /> Đã có tài liệu
                            </Badge>
                        )}
                    </div>
                </div>

                <Button
                    size="lg"
                    onClick={handleExport}
                    disabled={isExporting || manualModules.every(m => !m.isCompleted)}
                    className="bg-green-600 hover:bg-green-700 shadow-lg"
                >
                    {isExporting ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <FileDown className="w-5 h-5 mr-2" />}
                    Tổng hợp & Xuất Word
                </Button>
            </div>

            {/* Context Viewer (Nơi hiển thị kết quả phân tích PDF) */}
            {expertGuidance && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
                        <FileText className="w-4 h-4" />
                        <span>Dữ liệu trích xuất từ tài liệu (Context cho AI):</span>
                    </div>
                    <Textarea
                        value={expertGuidance}
                        onChange={(e) => setExpertGuidance(e.target.value)}
                        className="bg-white min-h-[100px] text-sm text-slate-600"
                        placeholder="Nội dung tóm tắt từ file PDF sẽ hiện ở đây..."
                    />
                    <p className="text-[10px] text-slate-500 mt-1 italic">
                        * Đây là nội dung AI đã "đọc" được từ file PDF của thầy. Thầy có thể chỉnh sửa để AI hiểu đúng ý hơn trước khi Copy Prompt.
                    </p>
                </div>
            )}

            {/* Modules Grid */}
            <div className="grid grid-cols-1 gap-6">
                {manualModules.map((module) => (
                    <Card key={module.id} className={`border-2 transition-all ${module.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-100'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    {module.isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                                    {module.title}
                                </CardTitle>
                                <CardDescription>
                                    Bước {manualModules.indexOf(module) + 1} / {manualModules.length}
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyPrompt(module)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Prompt
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder={`Dán JSON kết quả từ Gemini/ChatGPT cho phần ${module.title} vào đây (Bắt buộc định dạng JSON)...`}
                                className={`min-h-[200px] font-mono text-sm ${isValidJSON(module.content) ? 'bg-green-50/10' : 'bg-white'}`}
                                value={module.content}
                                onChange={(e) => updateModuleContent(module.id, e.target.value)}
                            />
                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    {module.content && (
                                        isValidJSON(module.content)
                                            ? <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Valid JSON</Badge>
                                            : <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Text Mode (Khuyến nghị dùng JSON)</Badge>
                                    )}
                                </div>
                                <Badge variant={module.isCompleted ? "default" : "secondary"} className={module.isCompleted ? "bg-green-600" : ""}>
                                    {module.isCompleted ? "Đã có nội dung" : "Đang chờ nội dung"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
