"use client";

import React, { useEffect, useCallback } from 'react';
import { useAppStore, ProcessingModule } from '@/lib/store/use-app-store';
import { LessonResult } from '@/lib/types';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { PedagogicalOrchestrator } from '@/lib/services/pedagogical-orchestrator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, CheckCircle, RefreshCw, ClipboardList, Upload, Loader2, FileText, AlertCircle, Search, X, BrainCircuit, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
// Redundant Analyzer Removed
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ContentStructureAnalyzer, StructuredContent } from '@/lib/services/content-structure-analyzer';
import { StructuredContentViewer } from '@/components/ui/structured-content-viewer';
import { ActivityContentBuilder } from '@/components/ui/activity-content-builder';
import { useLessonActions } from '@/lib/hooks/use-lesson-actions';
import { ExpertBrainInjection } from '../template-engine/ExpertBrainInjection';
import { ContentFilter } from '@/lib/services/content-filter';
import { ProfessionalContentProcessor } from '@/lib/services/professional-content-processor';
import { Rocket } from 'lucide-react';

export function ManualProcessingHub() {
    const store = useAppStore();
    const { lesson, isExporting, isGenerating } = store;
    const {
        theme: lessonAutoFilledTheme,
        grade: lessonGrade,
        expertGuidance,
        manualModules,
        result: lessonResult
    } = lesson;

    const setExpertGuidance = (v: string) => store.updateLessonField('expertGuidance', v);
    const setManualModules = (v: ProcessingModule[]) => store.updateLessonField('manualModules', v);
    const updateModuleContent = (id: string, content: string) => {
        store.updateLessonField('manualModules', manualModules.map(m =>
            m.id === id ? { ...m, content, isCompleted: !!content.trim() } : m
        ));
    };
    const setLessonResult = (v: LessonResult | null) => store.setLessonResult(v);

    const {
        handleExportDocx,
        handleGenerateFullPlan,
        handleSurgicalMerge: actionSurgicalMerge,
        handleAudit
    } = useLessonActions();

    const onApplyMerge = useCallback(() => {
        if (!expertGuidance) return;
        actionSurgicalMerge(expertGuidance);
    }, [expertGuidance, actionSurgicalMerge]);
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

    // Restore from Session Memory (processedContext)
    useEffect(() => {
        if (store.lesson.processedContext && !structuredContent) {
            const ctx = store.lesson.processedContext;
            console.log("[ManualProcessingHub] Restoring session context from store...");
            setStructuredContent(ctx.structured);
            setExpertGuidance(ctx.scientificText);
            setOptimizedMap(ctx.optimizedMap);

            // If manual modules are empty, re-analyze structure from restored text
            if (manualModules.length === 0) {
                const modules = ManualWorkflowService.analyzeStructure(ctx.scientificText, "2");
                setManualModules(modules);
            }

            toast({
                title: "🔄 Đã khôi phục dữ liệu!",
                description: "Hệ thống đã tự động khôi phục dữ liệu phân tích từ phiên trước."
            });
        }
    }, [store.lesson.processedContext]); // Run once when context exists or changes

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Step 1: Save File to Store (Base64) for AI Chain Engine
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            store.updateLessonField('file', {
                mimeType: file.type,
                data: base64,
                name: file.name
            });
        };
        reader.readAsDataURL(file);

        // Step 3: Session-Based Context Memory (Check and Warn)
        if (store.lesson.processedContext) {
            const confirmNew = window.confirm("Bạn đã có dữ liệu phân tích từ lần trước. Tải file mới sẽ xóa dữ liệu cũ. Tiếp tục?");
            if (!confirmNew) return;
        }

        setIsAnalyzing(true);
        setAnalyzingStatus("Đang khởi tạo...");

        try {
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            const result = await processor.processFile(file, (status) => {
                setAnalyzingStatus(status);
            });

            if (result.content && result.content.trim().length > 0) {
                setAnalyzingStatus("AI đang cấu trúc hóa nội dung...");
                const analyzer = new ContentStructureAnalyzer();
                const structured = await analyzer.analyzePDFContent(result.content, store.selectedModel);
                setStructuredContent(structured);

                const scientificText = PedagogicalOrchestrator.simplifyScientificText(result.content);
                // If simplification is too aggressive or empty, use full content
                const expertContext = (scientificText && scientificText.length > 100) ? scientificText : result.content;
                setExpertGuidance(expertContext);

                const modules = ManualWorkflowService.analyzeStructure(expertContext, "2");
                setManualModules(modules);

                // --- STEP 1 & 2: PEDAGOGICAL SLICING & DEEP TAGGING ---
                setAnalyzingStatus("Đang bóc tách bản chất sư phạm (Deep Tagging)...");
                const processedContent = ProfessionalContentProcessor.extractActivityContent(result.content);

                const filter = new ContentFilter();
                const newOptimizedMap: Record<string, any> = {};

                modules.forEach(mod => {
                    const filtered = filter.filterContentForActivity(structured, mod.type as any);
                    // Combine filtered prompt text with semantic tags for that specific module's slice
                    newOptimizedMap[mod.id] = {
                        promptContent: filtered.promptContent,
                        semanticTags: processedContent.semanticTags
                    };
                });

                setOptimizedMap(newOptimizedMap);

                // Save to Global Store for Session Resilience
                store.updateLessonField('processedContext', {
                    structured,
                    scientificText,
                    optimizedMap: newOptimizedMap,
                    processedContent // Contains assets and semantic tags
                });

                toast({
                    title: "✅ Phân tích xong & Sẵn sàng Deep Dive!",
                    description: `Đã lưu file và phân tích cấu trúc. Hãy bấm nút 'Tạo Kế hoạch bài dạy' để chạy quy trình tự động.`
                });
            } else {
                throw new Error("Không tìm thấy nội dung văn bản trong tài liệu này.");
            }
        } catch (error: any) {
            toast({ title: "Lỗi phân tích", description: error.message, variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
            setAnalyzingStatus("");
        }
    };

    const handleCopyPrompt = async (module: ProcessingModule) => {
        try {
            toast({ title: "Đang tối ưu...", description: "Hệ thống đang tra cứu dữ liệu chuyên môn..." });

            const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);

            const prompt = await ManualWorkflowService.generatePromptForModule(module, {
                topic: lessonAutoFilledTheme,
                grade: lessonGrade,
                fileSummary: expertGuidance || "Nội dung sách giáo khoa...",
                optimizedFileSummary: optimizedMap[module.id] || (store.lesson.processedContext?.optimizedMap?.[module.id]),
                smartData: smartData
            });

            try {
                await navigator.clipboard.writeText(prompt);
                toast({
                    title: "Đã sao chép Prompt!",
                    description: `Đã tích cực tích hợp Dữ liệu Chuyên gia vào Prompt`,
                });
            } catch (clipboardError: any) {
                console.warn("[ManualProcessingHub] Clipboard blocked. Using alert fallback.");
                // Since we can't easily show a modal from here without more state, 
                // we'll use a prompt() which is a synchronous user gesture that allows copying.
                // It's old school but extremely reliable for "copy this text" when everything else fails.
                const manualCopy = window.confirm("Trình duyệt chặn tự động sao chép. Bạn có muốn xem Prompt để sao chép thủ công không?");
                if (manualCopy) {
                    const tempTextArea = document.createElement("textarea");
                    tempTextArea.value = prompt;
                    document.body.appendChild(tempTextArea);
                    tempTextArea.select();
                    try {
                        document.execCommand('copy');
                        toast({ title: "Đã sao chép!", description: "Đã dùng phương thức dự phòng để sao chép." });
                    } catch (err) {
                        alert("Không thể sao chép tự động. Vui lòng copy nội dung trong hộp thoại tiếp theo.");
                        window.prompt("Copy Prompt tại đây (Ctrl+C):", prompt);
                    }
                    document.body.removeChild(tempTextArea);
                }
            }
        } catch (error: any) {
            console.error("[ManualProcessingHub] Error generating prompt:", error);
            toast({
                title: "Lỗi tạo Prompt",
                description: error.message || "Không thể kết nối với AI. Vui lòng thử lại sau.",
                variant: "destructive"
            });
        }
    };

    const handleFinalizeManualWorkflow = () => {
        // Collect all modules and update lessonResult
        const getMod = (id: string) => manualModules.find(m => m.id === id)?.content || "";

        const mappedResult: any = {
            ten_bai: lessonAutoFilledTheme,
            grade: lessonGrade,
            // 4 Core Activities
            hoat_dong_khoi_dong: getMod("mod_khoi_dong"),
            hoat_dong_kham_pha: getMod("mod_kham_pha"),
            hoat_dong_luyen_tap: getMod("mod_luyen_tap"),
            hoat_dong_van_dung: getMod("mod_van_dung"),

            // SHDC & SHL
            shdc: getMod("mod_shdc"),
            shl: getMod("mod_shl"),

            // Metadata & Sections
            ...parseMetadataModule(getMod("mod_setup")),
            ...parseAppendixModule(getMod("mod_appendix")),
        };

        // Fallback for Metadata if parsing failed or empty
        if (!mappedResult.muc_tieu_kien_thuc) mappedResult.muc_tieu_kien_thuc = getMod("mod_setup") || "Xem chi tiết trong từng hoạt động.";
        if (!mappedResult.gv_chuan_bi) mappedResult.gv_chuan_bi = "Theo nội dung bài dạy.";
        if (!mappedResult.ho_so_day_hoc) mappedResult.ho_so_day_hoc = getMod("mod_appendix") || "N/A";
        if (!mappedResult.huong_dan_ve_nha) mappedResult.huong_dan_ve_nha = "Hoàn thành các nhiệm vụ mở rộng.";

        setLessonResult(mappedResult);
        toast({
            title: "Hợp nhất thành công!",
            description: "Toàn bộ 8 Module đã được chuyển vào Giáo án chính. Sẵn sàng xuất file đầy đủ.",
        });
    };

    // Helper to parse JSON or structured text from Setup module
    const parseMetadataModule = (content: string) => {
        try {
            const json = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || "");
            return {
                muc_tieu_kien_thuc: json.muc_tieu_kien_thuc || json.kien_thuc,
                muc_tieu_nang_luc: json.muc_tieu_nang_luc || json.nang_luc,
                muc_tieu_pham_chat: json.muc_tieu_pham_chat || json.pham_chat,
                tich_hop_nls: json.tich_hop_nls || json.năng_lực_số,
                gv_chuan_bi: json.thiet_bi_day_hoc?.gv || json.gv_chuan_bi,
                hs_chuan_bi: json.thiet_bi_day_hoc?.hs || json.hs_chuan_bi
            };
        } catch { return {}; }
    };

    // Helper to parse JSON from Appendix module
    const parseAppendixModule = (content: string) => {
        try {
            const json = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || "");
            return {
                ho_so_day_hoc: json.ho_so_day_hoc || json.appendix,
                huong_dan_ve_nha: json.huong_dan_ve_nha || json.dặn_dò
            };
        } catch { return {}; }
    };

    const handleExportWithCheck = async () => {
        if (!lessonResult && manualModules.some(m => m.isCompleted)) {
            handleFinalizeManualWorkflow();
            // Wait for state
            setTimeout(() => handleExportDocx(), 150);
        } else {
            handleExportDocx();
        }
    };

    const handleAuditWithCheck = async () => {
        if (!lessonResult && manualModules.some(m => m.isCompleted)) {
            handleFinalizeManualWorkflow();
            // Wait for state
            setTimeout(() => handleAudit(), 150);
        } else {
            handleAudit();
        }
    };

    if (!lessonAutoFilledTheme) {
        return (
            <div className="text-center p-12 bg-white/40 backdrop-blur-xl rounded-[2rem] border-2 border-dashed border-blue-100/50">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Sẵn sàng khởi tạo!</h3>
                <p className="text-slate-500 max-w-md mx-auto">Vui lòng chọn khối và nhập tên bài học ở cột bên trái, hoặc tải file PDF giáo án cũ để bắt đầu quy trình phẫu thuật.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Steps: Compact Grid Layout */}
            <div className="premium-glass soft-pastel-skyblue p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">

                    {/* 1. Upload & Analyze Analysis */}
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileUpload}
                        />
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-xl bg-white/80 text-blue-800 border-blue-200/50 hover:bg-white shadow-sm gap-2 justify-start px-4"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Upload className="w-4 h-4 text-blue-500" />}
                            <span className="font-bold text-xs uppercase tracking-wide truncate">
                                {isAnalyzing ? analyzingStatus : "1. Tải lên & Phân tích PDF"}
                            </span>
                        </Button>

                        {expertGuidance && (
                            <Badge className="w-full h-8 justify-center bg-emerald-500/10 text-emerald-700 border-emerald-200/50 animate-in zoom-in-95">
                                <FileText className="w-3 h-3 mr-2" />
                                <span className="text-[10px] font-bold uppercase">Tài liệu đã sẵn sàng</span>
                            </Badge>
                        )}
                    </div>

                    {/* 2. Generate Plan (Rocket) */}
                    <Button
                        className="w-full h-auto min-h-[48px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-200 gap-3"
                        onClick={handleGenerateFullPlan}
                        disabled={isGenerating || !lessonAutoFilledTheme}
                    >
                        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                        <div className="flex flex-col items-start">
                            <span className="font-black text-xs uppercase tracking-wider">
                                {store.lesson.file ? "2. Tạo KHBD (Từ File)" : "2. Auto-Fetch & Tạo KHBD"}
                            </span>
                            <span className="text-[10px] opacity-80 font-normal">
                                {store.lesson.file ? "Deep Dive 5 Bước (File Mode)" : "Deep Dive 5 Bước (Database Mode)"}
                            </span>
                        </div>
                    </Button>

                    {/* 3. Audit (5512) */}
                    <Button
                        variant="outline"
                        onClick={handleAuditWithCheck}
                        disabled={!lessonResult && !manualModules.some(m => m.isCompleted)}
                        className="w-full h-12 rounded-xl border-amber-200/50 text-amber-800 bg-amber-50/50 hover:bg-amber-100/80 gap-2 justify-start px-4"
                    >
                        <Search className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-xs uppercase tracking-wide">3. Kiểm định 5512</span>
                    </Button>

                    {/* 4. Export Word */}
                    <Button
                        onClick={handleExportWithCheck}
                        disabled={isExporting || (!lessonResult && !manualModules.some(m => m.isCompleted))}
                        className="w-full h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-200 gap-2"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                        <span className="font-bold text-xs uppercase tracking-wide">4. Xuất file Word</span>
                    </Button>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left side: Advanced AI Injection & Merging */}
                <div className="lg:col-span-12 space-y-6">
                    <ExpertBrainInjection
                        value={expertGuidance}
                        onChange={setExpertGuidance}
                        onApply={onApplyMerge}
                        isProcessing={isAnalyzing}
                        topic={lessonAutoFilledTheme}
                        grade={lessonGrade}
                    />
                </div>

                {/* Modules Grid - Alternative Manual Flow */}
                <div className="lg:col-span-12">
                    <Tabs defaultValue="modules" className="w-full">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="modules" className="rounded-lg">Quy trình từng bước</TabsTrigger>
                            <TabsTrigger value="context" className="rounded-lg">Ngữ cảnh AI (Raw)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="modules" className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {manualModules.map((module) => (
                                    <Card key={module.id} className={`border-2 transition-all ${module.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-100'}`}>
                                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                    {module.isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                                                    {module.title}
                                                </CardTitle>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopyPrompt(module)}
                                                className="text-blue-600 border-blue-200"
                                            >
                                                <Copy className="w-4 h-4 mr-2" />
                                                Prompt
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {structuredContent && (
                                                <ActivityContentBuilder
                                                    structuredContent={structuredContent}
                                                    activityType={module.type as any}
                                                    onContentGenerated={(content) => {
                                                        setOptimizedMap(prev => ({ ...prev, [module.id]: content }));
                                                    }}
                                                />
                                            )}
                                            <Textarea
                                                placeholder={`Dán kết quả AI cho phần ${module.title}...`}
                                                className="min-h-[120px] text-xs font-mono bg-white/50 border-slate-200"
                                                value={module.content}
                                                onChange={(e) => updateModuleContent(module.id, e.target.value)}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="context" className="mt-6">
                            <Card className="border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-sm">Trình xem ngữ cảnh nâng cao</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        value={expertGuidance}
                                        onChange={(e) => setExpertGuidance(e.target.value)}
                                        className="min-h-[400px] font-mono text-xs bg-slate-900 text-slate-300 p-4"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
