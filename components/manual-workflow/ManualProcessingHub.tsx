
import React, { useEffect, useCallback, useState } from 'react';
import { useLessonStore, ProcessingModule } from '@/lib/store/use-lesson-store';
import { LessonResult } from '@/lib/types';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { ExportService } from '@/lib/services/export-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, CheckCircle, RefreshCw, ClipboardList, Upload, Loader2, FileText, AlertCircle, Search, X, Link, Activity, Zap, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromFile } from '@/lib/actions/gemini';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
import { LessonPlanAnalyzer, AnalyzedLessonPlan } from '@/lib/services/lesson-plan-analyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ContentStructureAnalyzer, StructuredContent } from '@/lib/services/content-structure-analyzer';
import { StructuredContentViewer } from '@/components/ui/structured-content-viewer';
import { ActivityContentBuilder } from '@/components/ui/activity-content-builder';
import { IntelligentContextEngine, ActivityType } from '@/lib/services/intelligent-context-engine';
import { UnifiedContentAggregator } from '@/lib/services/unified-content-aggregator';
import { ContentScalingService } from '@/lib/services/content-scaling-service';
import { IntelligentContentScaler } from '@/lib/services/intelligent-content-scaler';
import { PrecisionLengthController } from '@/lib/services/precision-length-controller';
import { IntelligentPromptOrchestrator } from '@/lib/services/intelligent-prompt-orchestrator';
import { VirtualScroller } from '@/components/ui/virtual-scroller';
import { ReactPerformanceManager } from '@/lib/services/react-performance-manager';
import { QuantumComplianceSystem, QuantumComplianceReport } from '@/lib/services/quantum-compliance-system';
import { QuantumNeuralFusionEngine } from '@/lib/services/quantum-neural-fusion-engine';
import { ShieldAlert, BookOpen, Lightbulb, CheckCircle2, Info } from 'lucide-react';

export function ManualProcessingHub() {
    const {
        lessonAutoFilledTheme,
        lessonGrade,
        expertGuidance, // Dùng làm context fileSummary
        setExpertGuidance,
        manualModules,
        setManualModules,
        updateModuleContent,
        isGenerating,
        isExporting,
        setLoading,
        setStatus,
        setExportProgress
    } = useLessonStore();

    const { toast } = useToast();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [expandingModules, setExpandingModules] = React.useState<Record<string, boolean>>({});
    const [analyzingStatus, setAnalyzingStatus] = React.useState<string>("");
    const [structuredContent, setStructuredContent] = React.useState<StructuredContent | null>(null);
    const [optimizedMap, setOptimizedMap] = React.useState<Record<string, string>>({});
    const [analysisLogs, setAnalysisLogs] = React.useState<{ msg: string, time: string, type: 'info' | 'success' | 'warn' }[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [lastFileHash, setLastFileHash] = React.useState<string>("");

    const [complianceReport, setComplianceReport] = React.useState<QuantumComplianceReport | null>(null);
    const [isAuditing, setIsAuditing] = React.useState(false);

    // Performance Monitoring init
    React.useEffect(() => {
        const perf = ReactPerformanceManager.getInstance();
        perf.registerComponent('ManualProcessingHub');
    }, []);

    const addLog = useCallback((msg: string, type: 'info' | 'success' | 'warn' = 'info') => {
        setAnalysisLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    }, []);

    // Memoize the expensive regex analysis
    const analyzedLessonPlan = React.useMemo(() => {
        if (!expertGuidance) return null;
        return LessonPlanAnalyzer.analyze(expertGuidance);
    }, [expertGuidance]);

    // Init modules if empty
    useEffect(() => {
        if (manualModules.length === 0 && lessonAutoFilledTheme) {
            const initialModules = ManualWorkflowService.analyzeStructure(expertGuidance, "2");
            setManualModules(initialModules);
        }
    }, [lessonAutoFilledTheme, manualModules.length, expertGuidance, setManualModules]);

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 1. Kiểm tra Hash để tránh xử lý lặp lại cùng một file
        const { CachedProcessingEngine } = await import('@/lib/services/cached-processing-engine');
        const hashEngine = CachedProcessingEngine.getInstance();
        const currentHash = await hashEngine.generateFileHash(file);

        if (currentHash === lastFileHash && expertGuidance) {
            console.log('[ManualHub] File này vừa được xử lý, bỏ qua để tối ưu.');
            toast({ title: "Thông báo", description: "Tài liệu này đã được tải lên và xử lý." });
            return;
        }

        setLastFileHash(currentHash);
        setIsAnalyzing(true);
        setAnalyzingStatus("Đang khởi tạo...");
        setAnalysisLogs([]);
        addLog(`Bắt đầu xử lý file: ${file.name}`, 'info');

        try {
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            const result = await processor.processFile(file, (status) => {
                setAnalyzingStatus(status);
                addLog(status, 'info');
            });

            if (result.content && result.content.trim().length > 0) {
                addLog(`Đã trích xuất văn bản (${result.content.length} ký tự). Nguồn: ${result.source}`, 'success');

                // 2. Phân tích cấu trúc sâu bằng AI (Singleton Optimized)
                setAnalyzingStatus("AI đang cấu trúc hóa nội dung...");
                addLog("Đang gửi yêu cầu phân tích cấu trúc đến AI...", 'info');

                const analyzer = ContentStructureAnalyzer.getInstance();
                const structured = await analyzer.analyzePDFContent(result.content);
                setStructuredContent(structured);
                addLog(`Cấu trúc hóa hoàn tất: Tìm thấy ${structured.sections.length} khối nội dung.`, 'success');

                // 3. Chuyển đổi thành text khoa học cho context mặc định
                addLog("Đang định dạng lại dữ liệu sư phạm chuyên sâu...", 'info');
                const scientificText = LessonPlanAnalyzer.formatForPrompt(LessonPlanAnalyzer.analyze(result.content));
                setExpertGuidance(scientificText);

                // 4. Khởi tạo các Modules
                addLog("Đang khởi tạo 4 bước hoạt động (Chuẩn 5512)...", 'info');
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
                throw new Error("Không tìm thấy nội dung văn bản trong tài liệu này.");
            }
        } catch (error: any) {
            console.error('[ManualHub] Error:', error);
            addLog(`LỖI: ${error.message}`, 'warn');
            toast({ title: "Lỗi phân tích", description: error.message, variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
            setAnalyzingStatus("");
            addLog("Quy trình hoàn tất.", 'success');
        }
    }, [lastFileHash, lessonGrade, lessonAutoFilledTheme, expertGuidance, setManualModules, setExpertGuidance, setStructuredContent, toast]);

    const handleAutoGenerateFull = async () => {
        if (!lessonAutoFilledTheme || !expertGuidance) {
            toast({
                title: "Thiếu dữ liệu",
                description: "Vui lòng nhập chủ đề và tài liệu trước khi chạy AI tự động.",
                variant: "destructive"
            });
            return;
        }

        setLoading('isGenerating', true);
        setAnalyzingStatus("Đang khởi động Orchestrator...");
        addLog("BẮT ĐẦU: Quy trình 4-Prompt tự động (Architecture 6.0)", 'success');

        try {
            const orchestrator = IntelligentPromptOrchestrator.getInstance();
            const result = await orchestrator.generateFullLesson(
                lessonAutoFilledTheme,
                lessonGrade,
                expertGuidance,
                (status, progress) => {
                    setAnalyzingStatus(status);
                    setExportProgress(progress);
                    addLog(status, 'info');
                }
            );

            if (result.success && result.modules) {
                // Cập nhật toàn bộ module vào store
                setManualModules(result.modules);
                toast({
                    title: "Thành công!",
                    description: "Đã tự động tạo xong toàn bộ 4 hoạt động dạy học.",
                });
                addLog("HOÀN TẤT: Toàn bộ bài dạy đã được xây dựng thành công.", 'success');
            } else {
                throw new Error(result.error || "Lỗi quy trình tự động");
            }
        } catch (error: any) {
            console.error('[Orchestration] Error:', error);
            toast({ title: "Lỗi AI", description: error.message, variant: "destructive" });
            addLog(`LỖI AI: ${error.message}`, 'warn');
        } finally {
            setLoading('isGenerating', false);
            setAnalyzingStatus("");
            setExportProgress(0);
        }
    };

    const handleCopyPrompt = async (module: ProcessingModule) => {
        let prevContext = undefined;
        let prevSummary = "";
        const moduleIndex = manualModules.findIndex(m => m.id === module.id);
        if (moduleIndex > 0) {
            const prevModule = manualModules[moduleIndex - 1];
            if (prevModule.isCompleted && prevModule.content) {
                // Sử dụng Helper từ Service để trích xuất tóm tắt thông minh
                prevSummary = ManualWorkflowService.extractSummaryFromContent(prevModule.content);

                // Fallback nếu không có tóm tắt trong JSON
                if (!prevSummary) {
                    prevContext = `Hoạt động trước: ${prevModule.title}. Nội dung tóm tắt: ${prevModule.content.substring(0, 300)}...`;
                } else {
                    // If a smart summary exists, use it as the primary context
                    prevContext = `Tóm tắt hoạt động trước (${prevModule.title}): ${prevSummary}`;
                }
            }
        }
        // Notify user about system lookup
        toast({ title: "Đang tối ưu...", description: "Hệ thống đang tra cứu dữ liệu chuyên môn..." });

        // Lookup Smart Data (Async)
        const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);

        // Architecture 4.0: Unified Aggregation for 30-50 Page scale
        const aggregator = UnifiedContentAggregator.getInstance();
        const aggregatedData = aggregator.aggregate(
            structuredContent || {
                title: "", grade: lessonGrade, subject: "", sections: [],
                metadata: { totalWordCount: 0, sectionCount: 0, processedAt: "" }
            },
            smartData,
            module.type as ActivityType,
            45 // Target 45 pages total
        );

        const prompt = ManualWorkflowService.generatePromptForModule(module, {
            topic: lessonAutoFilledTheme,
            grade: lessonGrade,
            fileSummary: expertGuidance || "Nội dung sách giáo khoa...",
            optimizedFileSummary: optimizedMap[module.id],
            previousContext: prevContext,
            previousSummary: prevSummary,
            smartData: smartData,
            aggregatedData: aggregatedData
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
            // 1. Construct LessonResult (Baseline)
            const baselineResult = {
                ten_bai: lessonAutoFilledTheme,
                grade: lessonGrade,
                muc_tieu_kien_thuc: "Xem nội dung chi tiết trong các hoạt động",
                muc_tieu_nang_luc: "",
                muc_tieu_pham_chat: "",
                hs_chuan_bi: "",
                gv_chuan_bi: "",
                hoat_dong_khoi_dong: manualModules.find(m => m.type === 'khoi_dong')?.content || "",
                hoat_dong_kham_pha: manualModules.find(m => m.type === 'kham_pha')?.content || "",
                hoat_dong_luyen_tap: manualModules.find(m => m.type === 'luyen_tap')?.content || "",
                hoat_dong_van_dung: manualModules.find(m => m.type === 'van_dung')?.content || "",
                ho_so_day_hoc: "",
                huong_dan_ve_nha: ""
            } as LessonResult;

            // 2. Architecture 6.0: Precision Length Achievement
            setAnalyzingStatus("Đang tinh chỉnh độ dài chuẩn 30-50 trang...");
            const precisionController = PrecisionLengthController.getInstance();
            const precisionResult = await precisionController.achieveTargetLength(baselineResult, 45);

            // 3. Call Export Service with final precise content
            await ExportService.exportLessonToDocx(
                precisionResult.content as any,
                `Giao_an_Chuyen_gia_${lessonAutoFilledTheme}.docx`,
                (p) => setExportProgress(p)
            );

            setStatus('success', "Xuất file thành công!");
            toast({
                title: "Thành công!",
                description: `File Word (${precisionResult.actualPages} trang) đã được tải xuống.`
            });

        } catch (error: any) {
            setStatus('error', error.message);
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        } finally {
            setLoading('isExporting', false);
        }
    };

    // Quantum Neural Audit (Architecture 11.0)
    const handleRunDeepAudit = async () => {
        if (manualModules.every(m => !m.content)) {
            toast({ title: "Thiếu dữ liệu", description: "Vui lòng nhập nội dung giáo án trước khi kiểm định.", variant: "destructive" });
            return;
        }

        setIsAuditing(true);
        addLog("Bắt đầu kiểm định 5512 bằng mạng Neural...", 'info');

        try {
            const auditor = QuantumComplianceSystem.getInstance();
            const lessonSummary = {
                theme: lessonAutoFilledTheme,
                grade: lessonGrade,
                modules: manualModules.map(m => ({ title: m.title, content: m.content || "" }))
            };

            const report = await auditor.quantumComplianceCheck(lessonSummary);
            setComplianceReport(report);
            addLog(`Kiểm định hoàn tất. Điểm tổng quát: ${report.overallQuantumScore}%`, 'success');

            toast({
                title: "✅ Kiểm định Quantum hoàn tất!",
                description: `KHBD đạt ${report.overallQuantumScore}/100 điểm sư phạm.`
            });
        } catch (error) {
            console.error("[Audit] Error:", error);
            toast({ title: "Lỗi", description: "Không thể chạy kiểm định AI.", variant: "destructive" });
        } finally {
            setIsAuditing(false);
        }
    };

    const handleExpandModule = async (module: ProcessingModule) => {
        if (!module.content) return;

        setExpandingModules(prev => ({ ...prev, [module.id]: true }));
        try {
            const fusionEngine = QuantumNeuralFusionEngine.getInstance();
            const result = await fusionEngine.quantumNeuralFusion(
                { title: module.title, content: module.content || "" },
                "Hãy mở rộng nội dung này thành một kịch bản dạy học chi tiết 30-50 trang, thêm các hoạt động chuyển đổi số, trò chơi tương tác và tiêu chí đánh giá năng lực số theo chuẩn 2025."
            );

            if (result.plan?.content) {
                updateModuleContent(module.id, result.plan.content);
                addLog(`Nâng cấp hoàn tất (${result.plan.content.length} ký tự).`, 'success');
                toast({ title: "🚀 Quantum Upgraded!", description: `Đã tối ưu hóa ${module.title} bằng Neural Fusion.` });
            }
        } catch (error: any) {
            toast({
                title: "Lỗi mở rộng",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setExpandingModules(prev => ({ ...prev, [module.id]: false }));
        }
    };

    // Calculate Export Readiness
    const currentEstimatedPages = manualModules.reduce((acc, m) => acc + (m.content?.split(/\s+/).length || 0), 0) / 350;
    const roundedPages = Math.max(1, Math.round(currentEstimatedPages));
    const needsExpansion = roundedPages < 30;

    // Final Stabilized UI Return (Phase 2)
    const renderUI = React.useMemo(() => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-800">Trung tâm Điều phối Giao án (Expert Mode)</h2>
                    <Badge variant={roundedPages >= 30 ? "default" : "secondary"} className="bg-blue-100 text-blue-700 border-blue-200">
                        Ước tính: {roundedPages} trang ({Math.round(currentEstimatedPages * 350)} từ)
                    </Badge>
                    {needsExpansion && (
                        <div className="flex items-center text-xs text-amber-600 gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            Cần thêm nội dung để đạt mục tiêu 30-50 trang
                        </div>
                    )}
                </div>
            </div>

            {/* Live Status & Analysis Console - Isolated Component to prevent Lag */}
            {isAnalyzing && (
                <AnalysisConsole
                    isAnalyzing={isAnalyzing}
                    analyzingStatus={analyzingStatus}
                    logs={analysisLogs}
                />
            )}

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

                <div className="flex gap-4">
                    <Button
                        size="lg"
                        onClick={handleAutoGenerateFull}
                        disabled={isGenerating || !lessonAutoFilledTheme}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                    >
                        {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
                        Tự động tạo toàn bộ (AI Orchestrator)
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        onClick={handleRunDeepAudit}
                        disabled={isAuditing || manualModules.every(m => !m.isCompleted)}
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 shadow-sm"
                    >
                        {isAuditing ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <ShieldAlert className="w-5 h-5 mr-2" />}
                        Kiểm định 5512 (Neural)
                    </Button>

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
                                <TabsTrigger value="compliance" className="data-[state=active]:bg-white flex items-center gap-2">
                                    <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                                    Báo cáo Kiểm định Neural
                                </TabsTrigger>
                                <TabsTrigger value="advisor" className="data-[state=active]:bg-white flex items-center gap-2">
                                    <Wand2 className="w-3.5 h-3.5 text-blue-500" />
                                    Cố vấn Sư phạm AI
                                </TabsTrigger>
                                <TabsTrigger value="raw" className="data-[state=active]:bg-white">Nội dung thô (AI Context)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="compliance" className="p-4 m-0 animate-in slide-in-from-right-2 duration-300">
                                {complianceReport ? (
                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                                                        <Activity className="w-5 h-5" /> Chỉ số Chất lượng Quantum
                                                    </h4>
                                                    <div className="text-3xl font-black text-purple-600">
                                                        {complianceReport.overallQuantumScore}%
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { label: "Đúng đắn Sư phạm", score: complianceReport.detailedQuantumScores.pedagogical, icon: BookOpen },
                                                        { label: "Tuân thủ Chuẩn 5512", score: complianceReport.detailedQuantumScores.standards, icon: CheckCircle2 },
                                                        { label: "Đổi mới & Công nghệ", score: complianceReport.detailedQuantumScores.innovation, icon: Lightbulb }
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-medium text-slate-600">
                                                                <span className="flex items-center gap-1.5"><item.icon className="w-3 h-3" /> {item.label}</span>
                                                                <span>{item.score}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                                                                    style={{ width: `${item.score}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex-1 p-5 bg-blue-50/30 border border-blue-100 rounded-2xl">
                                                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-3">
                                                    <Info className="w-4 h-4" /> Lập luận Neural
                                                </h4>
                                                <p className="text-xs text-slate-600 leading-relaxed italic">
                                                    "{complianceReport.quantumReasoning}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-5 border border-amber-100 bg-amber-50/30 rounded-2xl">
                                            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-4">
                                                <Zap className="w-4 h-4 text-amber-500" /> Đề xuất Cải tiến Quantum
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {complianceReport.quantumImprovements.map((imp, idx) => (
                                                    <div key={idx} className="flex gap-3 p-3 bg-white rounded-xl border border-amber-100 shadow-sm text-xs text-amber-800">
                                                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 font-bold">
                                                            {idx + 1}
                                                        </div>
                                                        {imp}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                                        <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">Chưa có dữ liệu kiểm định.</p>
                                        <p className="text-xs">Hãy nhấn nút "Kiểm định 5512 (Neural)" để bắt đầu phân tích sâu.</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="advisor" className="p-4 m-0 animate-in slide-in-from-top-2 duration-300">
                                {structuredContent?.reasoning ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <div className="space-y-1">
                                                <div className="text-sm font-bold text-purple-900 flex items-center gap-2">
                                                    <Activity className="w-4 h-4" />
                                                    Điểm tuân thủ MoET 5512
                                                </div>
                                                <div className="text-2xl font-black text-purple-800">
                                                    {structuredContent.reasoning.score}/100
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {Object.entries(structuredContent.reasoning.compliance).map(([key, val]) => (
                                                    <Badge key={key} variant={val ? "default" : "outline"} className={val ? "bg-green-500" : "text-slate-400"}>
                                                        {key === 'objectives' ? 'Mục tiêu' : key === 'preparations' ? 'Chuẩn bị' : key === 'activities' ? 'Hoạt động' : 'Đánh giá'}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-3">
                                                    <Zap className="w-4 h-4" /> Gợi ý "Phẫu thuật" Giáo án
                                                </h4>
                                                <ul className="space-y-2">
                                                    {structuredContent.reasoning.suggestions.map((s: string, i: number) => (
                                                        <li key={i} className="text-xs text-blue-700 flex gap-2">
                                                            <span className="shrink-0">•</span>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                                                <h4 className="text-sm font-bold text-green-800 flex items-center gap-2 mb-3">
                                                    <Search className="w-4 h-4" /> Nhận định Sư phạm
                                                </h4>
                                                <ul className="space-y-2">
                                                    {structuredContent.reasoning.pedagogicalInsights.map((s: string, i: number) => (
                                                        <li key={i} className="text-xs text-green-700 flex gap-2">
                                                            <span className="shrink-0">•</span>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-slate-400 italic text-right mt-2">
                                            * Dự báo thời gian thực hiện: {structuredContent.reasoning.estimatedDeliveryTime}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 space-y-3">
                                        <Loader2 className="w-8 h-8 text-slate-300 animate-spin mx-auto" />
                                        <p className="text-slate-400 text-sm">Đang phân tích chuyên sâu...</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="structured" className="p-4 m-0">
                                {(() => {
                                    if (!analyzedLessonPlan) return null;
                                    return (
                                        <div className="space-y-6">
                                            {structuredContent ? (
                                                <StructuredContentViewer
                                                    structuredContent={structuredContent}
                                                    onSectionSelect={(section, actKey) => {
                                                        const actMap: Record<string, number> = {
                                                            'khoi_dong': 0,
                                                            'kham_pha': 1,
                                                            'luyen_tap': 2,
                                                            'van_dung': 3
                                                        };
                                                        const index = actMap[actKey];
                                                        if (index !== undefined && manualModules[index]) {
                                                            const existing = manualModules[index].content || "";
                                                            const added = section.content;
                                                            // Avoid duplicate additions
                                                            if (existing.includes(added.substring(0, 50))) {
                                                                toast({
                                                                    title: "Nội dung đã tồn tại",
                                                                    description: "Đoạn văn này dường như đã được thêm vào trước đó.",
                                                                    variant: "default"
                                                                });
                                                                return;
                                                            }
                                                            const newContent = existing ? `${existing}\n\n${added}` : added;
                                                            updateModuleContent(manualModules[index].id, newContent);
                                                            toast({
                                                                title: "🚀 Ánh xạ thành công!",
                                                                description: `Đã đưa nội dung vào "${manualModules[index].title}".`,
                                                            });
                                                        }
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
                                                                {analyzedLessonPlan.objectives || "Không tìm thấy dữ liệu mục tiêu cụ thể."}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4 text-blue-500" /> Thiết bị dạy học
                                                            </h4>
                                                            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 min-h-[100px] border border-slate-100 whitespace-pre-wrap">
                                                                {analyzedLessonPlan.preparations || "Không tìm thấy dữ liệu chuẩn bị cụ thể."}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b pb-1">
                                                            <ClipboardList className="w-4 h-4 text-purple-500" /> Các hoạt động dạy học được trích xuất ({analyzedLessonPlan.activities.length})
                                                        </h4>
                                                        <Accordion type="single" collapsible className="w-full">
                                                            {analyzedLessonPlan.activities.length > 0 ? (
                                                                analyzedLessonPlan.activities.map((act: any, i: number) => (
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
                                <CardDescription className="flex items-center gap-2">
                                    <span>Bước {manualModules.indexOf(module) + 1} / {manualModules.length}</span>
                                    {manualModules.indexOf(module) > 0 && manualModules[manualModules.indexOf(module) - 1].isCompleted && (
                                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-blue-200 text-blue-600 bg-blue-50 flex items-center gap-1">
                                            <Link className="w-2.5 h-2.5" /> Context Linked
                                        </Badge>
                                    )}
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
                            {/* Context Preview (Architecture 7.0) */}
                            {manualModules.indexOf(module) > 0 && manualModules[manualModules.indexOf(module) - 1].isCompleted && (
                                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2">
                                    <Activity className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                                    <div>
                                        <span className="font-bold">Ngữ cảnh từ {manualModules[manualModules.indexOf(module) - 1].title}:</span>
                                        <p className="mt-1 italic line-clamp-2">
                                            {ManualWorkflowService.extractSummaryFromContent(manualModules[manualModules.indexOf(module) - 1].content) || "Đã sẵn sàng kế thừa logic và nội dung từ bước trước."}
                                        </p>
                                    </div>
                                </div>
                            )}
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
                                <div className="flex items-center gap-2">
                                    {module.content && (
                                        isValidJSON(module.content)
                                            ? <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Valid JSON</Badge>
                                            : <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Text Mode (Khuyến nghị dùng JSON)</Badge>
                                    )}
                                    {module.content && module.content.split(/\s+/).length < 600 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                                            onClick={() => handleExpandModule(module)}
                                            disabled={expandingModules[module.id]}
                                        >
                                            {expandingModules[module.id] ? (
                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                            ) : (
                                                <Zap className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                                            )}
                                            Nâng cấp & Mở rộng (30-50 trang)
                                        </Button>
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
    ), [
        roundedPages, currentEstimatedPages, needsExpansion, isAnalyzing, analyzingStatus,
        handleFileUpload, handleAutoGenerateFull, isGenerating, lessonAutoFilledTheme, handleExport,
        isExporting, manualModules, expertGuidance, setExpertGuidance, structuredContent, expandingModules,
        handleExpandModule, handleCopyPrompt, updateModuleContent, toast, optimizedMap, fileInputRef,
        analyzedLessonPlan
    ]);

    // Measure Render Quality
    const startTime = React.useRef(performance.now());
    React.useEffect(() => {
        const renderTime = performance.now() - startTime.current;
        ReactPerformanceManager.getInstance().recordRender('ManualProcessingHub', renderTime);
        startTime.current = performance.now();
    });

    if (!lessonAutoFilledTheme) {
        return <div className="text-center p-10 text-slate-500">Vui lòng nhập tên bài học hoặc tải file lên trước.</div>;
    }

    return renderUI;
}

interface AnalysisLog {
    msg: string;
    time: string;
    type: 'info' | 'success' | 'warn';
}

interface AnalysisConsoleProps {
    isAnalyzing: boolean;
    analyzingStatus: string;
    logs: AnalysisLog[];
}

/**
 * Isolated Analysis Console to prevent heavy parent re-renders
 */
const AnalysisConsole = React.memo(({ isAnalyzing, analyzingStatus, logs }: AnalysisConsoleProps) => {
    return (
        <Card className="border-blue-200 bg-slate-950 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <CardHeader className="bg-slate-900 border-b border-slate-800 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                        <div className="flex gap-1.5 mr-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="uppercase tracking-widest text-[10px]">Processing System Live Feed</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                        Status: {analyzingStatus}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 bg-slate-950">
                <div className="h-[200px] custom-scrollbar font-mono text-xs">
                    <VirtualScroller
                        items={logs}
                        itemHeight={24}
                        containerHeight={200}
                        renderItem={(log: AnalysisLog, i: number) => (
                            <div key={i} className="flex gap-3 h-[24px] items-center animate-in slide-in-from-left-2 duration-200">
                                <span className="text-slate-600 shrink-0 w-[70px]">[{log.time}]</span>
                                <span className={
                                    log.type === 'success' ? 'text-green-400' :
                                        log.type === 'warn' ? 'text-red-400' : 'text-blue-400'
                                }>
                                    {log.type === 'success' && '✓ '}
                                    {log.type === 'warn' && '⚠ '}
                                    {log.type === 'info' && '● '}
                                    {log.msg}
                                </span>
                            </div>
                        )}
                    />
                    {logs.length === 0 && (
                        <div className="text-slate-700 italic text-center py-4">
                            Cơ sở dữ liệu đang được đồng bộ...
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        <span className="text-[10px] text-blue-300/60 uppercase tracking-tighter">Architecture 7.1.1: Optimized 60FPS</span>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                        Stable Capacity
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
});

AnalysisConsole.displayName = 'AnalysisConsole';
