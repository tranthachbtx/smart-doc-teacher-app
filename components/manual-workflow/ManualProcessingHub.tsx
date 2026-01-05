
import React, { useEffect } from 'react';
import { useLessonStore, ProcessingModule } from '@/lib/store/use-lesson-store';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { ExportService } from '@/lib/services/export-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, CheckCircle, RefreshCw, ClipboardList, Upload, Loader2, FileText, AlertCircle, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromFile } from '@/lib/actions/gemini';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
import { LessonPlanAnalyzer, AnalyzedLessonPlan } from '@/lib/services/lesson-plan-analyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ContentStructureAnalyzer, StructuredContent } from '@/lib/services/content-structure-analyzer';
import { StructuredContentViewer } from '@/components/ui/structured-content-viewer';
import { ActivityContentBuilder } from '@/components/ui/activity-content-builder';

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
    const [structuredContent, setStructuredContent] = React.useState<StructuredContent | null>(null);
    const [optimizedMap, setOptimizedMap] = React.useState<Record<string, string>>({});
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

            if (result.content && result.content.trim().length > 0) {
                // 1. Phân tích cấu trúc sâu bằng AI (NEW)
                setAnalyzingStatus("AI đang cấu trúc hóa nội dung...");
                const analyzer = new ContentStructureAnalyzer();
                const structured = await analyzer.analyzePDFContent(result.content);
                setStructuredContent(structured);

                // 2. Chuyển đổi thành text khoa học cho context mặc định
                const scientificText = LessonPlanAnalyzer.formatForPrompt(LessonPlanAnalyzer.analyze(result.content));
                setExpertGuidance(scientificText);

                // 3. Khởi tạo các Modules
                const modules = ManualWorkflowService.analyzeStructure(scientificText, "2");
                setManualModules(modules);

                const isFallback = structured.title.includes("(Regex Mode)");

                toast({
                    title: isFallback ? "⚠️ Chế độ Dự phòng" : (result.source === 'cache' ? "⚡ Đã tải từ Cache!" : "✅ Phân tích hoàn tất!"),
                    description: isFallback
                        ? "AI tạm thời không khả dụng. Hệ thống đã sử dụng bộ lọc thông minh (Regex) để trích xuất cấu trúc."
                        : (result.source === 'cache'
                            ? "Tài liệu này đã được phân tích trước đó."
                            : `Đã cấu trúc hóa ${structured.sections.length} phần nội dung hữu ích.`)
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
            optimizedFileSummary: optimizedMap[module.id],
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

            {/* Visual Analysis Viewer (Nơi hiển thị kết quả phân tích PDF trực quan) */}
            {expertGuidance && (
                <Card className="border-blue-200 bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-800 font-semibold">
                                <Search className="w-5 h-5" />
                                <span>Phân tích nội dung tài liệu</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setExpertGuidance("")} className="text-slate-400">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="structured" className="w-full">
                            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50/50 px-4 h-11">
                                <TabsTrigger value="structured" className="data-[state=active]:bg-white">Cấu trúc trích xuất</TabsTrigger>
                                <TabsTrigger value="raw" className="data-[state=active]:bg-white">Nội dung thô (AI Context)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="structured" className="p-4 m-0">
                                {(() => {
                                    const analyzed = LessonPlanAnalyzer.analyze(expertGuidance);
                                    return (
                                        <div className="space-y-6">
                                            {structuredContent ? (
                                                <StructuredContentViewer
                                                    structuredContent={structuredContent}
                                                    onSectionSelect={(section, act) => {
                                                        toast({
                                                            title: "Đã ghi nhận!",
                                                            description: `Đã chọn phần "${section.title}" cho hoạt động ${act}.`
                                                        });
                                                    }}
                                                />
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4 text-green-500" /> Mục tiêu bài học
                                                            </h4>
                                                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 min-h-[100px] border border-slate-100 whitespace-pre-wrap">
                                                                {analyzed.objectives || "Không tìm thấy dữ liệu mục tiêu cụ thể."}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4 text-blue-500" /> Thiết bị dạy học
                                                            </h4>
                                                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 min-h-[100px] border border-slate-100 whitespace-pre-wrap">
                                                                {analyzed.preparations || "Không tìm thấy dữ liệu chuẩn bị cụ thể."}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b pb-1">
                                                            <ClipboardList className="w-4 h-4 text-purple-500" /> Các hoạt động dạy học được trích xuất ({analyzed.activities.length})
                                                        </h4>
                                                        <Accordion type="single" collapsible className="w-full">
                                                            {analyzed.activities.length > 0 ? (
                                                                analyzed.activities.map((act, i) => (
                                                                    <AccordionItem value={`act-${i}`} key={i} className="border-slate-100">
                                                                        <AccordionTrigger className="hover:no-underline py-2 text-sm font-medium">
                                                                            <span className="text-left">{act.title}</span>
                                                                        </AccordionTrigger>
                                                                        <AccordionContent className="bg-slate-50/50 p-3 rounded-md text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">
                                                                            {act.content}
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                ))
                                                            ) : (
                                                                <div className="text-center py-6 text-slate-400 text-sm italic">
                                                                    Hệ thống sẽ tự đề xuất hoạt động chuẩn 5512 dựa trên chủ đề nếu không trích xuất được file.
                                                                </div>
                                                            )}
                                                        </Accordion>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </TabsContent>

                            <TabsContent value="raw" className="p-0 m-0">
                                <Textarea
                                    value={expertGuidance}
                                    onChange={(e) => setExpertGuidance(e.target.value)}
                                    className="border-0 rounded-none focus-visible:ring-0 min-h-[400px] font-mono text-xs bg-slate-900 text-slate-300 p-4"
                                    placeholder="Nội dung tóm tắt từ file PDF sẽ hiện ở đây..."
                                />
                                <div className="p-2 bg-slate-100 text-[10px] text-slate-500 italic border-t">
                                    * Đây là dữ liệu AI sẽ đọc trực tiếp. Thầy có thể chỉnh sửa để tối ưu prompt.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
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
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopyPrompt(module)}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Prompt
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {structuredContent && (
                                <ActivityContentBuilder
                                    structuredContent={structuredContent}
                                    activityType={module.type as any}
                                    onContentGenerated={(optimized) => {
                                        setOptimizedMap(prev => ({ ...prev, [module.id]: optimized }));
                                    }}
                                />
                            )}
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
