"use client";

import React, { useEffect, useCallback } from 'react';
import { useLessonStore, ProcessingModule } from '@/lib/store/use-lesson-store';
import { LessonResult } from '@/lib/types';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { ExportService } from '@/lib/services/export-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, FileDown, CheckCircle, RefreshCw, ClipboardList, Upload, Loader2, FileText, AlertCircle, Search, X, BrainCircuit, Zap, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
import { LessonPlanAnalyzer } from '@/lib/services/lesson-plan-analyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ContentStructureAnalyzer, StructuredContent } from '@/lib/services/content-structure-analyzer';
import { StructuredContentViewer } from '@/components/ui/structured-content-viewer';
import { ActivityContentBuilder } from '@/components/ui/activity-content-builder';
import { useLessonActions } from '@/lib/hooks/use-lesson-actions';
import { ExpertBrainInjection } from '../template-engine/ExpertBrainInjection';

export function ManualProcessingHub() {
    const {
        lessonAutoFilledTheme,
        lessonGrade,
        expertGuidance,
        setExpertGuidance,
        manualModules,
        setManualModules,
        updateModuleContent,
        isExporting,
        setLoading,
        setStatus,
        setExportProgress,
        lessonResult
    } = useLessonStore();

    const { handleExportDocx, handleSurgicalMerge, handleAudit } = useLessonActions();
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

        try {
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            const result = await processor.processFile(file, (status) => {
                setAnalyzingStatus(status);
            });

            if (result.content && result.content.trim().length > 0) {
                setAnalyzingStatus("AI đang cấu trúc hóa nội dung...");
                const analyzer = new ContentStructureAnalyzer();
                const structured = await analyzer.analyzePDFContent(result.content);
                setStructuredContent(structured);

                const scientificText = LessonPlanAnalyzer.formatForPrompt(LessonPlanAnalyzer.analyze(result.content));
                setExpertGuidance(scientificText);

                const modules = ManualWorkflowService.analyzeStructure(scientificText, "2");
                setManualModules(modules);

                toast({
                    title: "✅ Phân tích hoàn tất!",
                    description: `Đã cấu trúc hóa ${structured.sections.length} phần nội dung hữu ích.`
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
        toast({ title: "Đang tối ưu...", description: "Hệ thống đang tra cứu dữ liệu chuyên môn..." });

        const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);

        const prompt = ManualWorkflowService.generatePromptForModule(module, {
            topic: lessonAutoFilledTheme,
            grade: lessonGrade,
            fileSummary: expertGuidance || "Nội dung sách giáo khoa...",
            optimizedFileSummary: optimizedMap[module.id],
            smartData: smartData
        });

        navigator.clipboard.writeText(prompt);
        toast({
            title: "Đã sao chép Prompt!",
            description: `Đã tích hợp Dữ liệu Chuyên gia vào Prompt`,
        });
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
                        Trung tâm Điều hành Phẫu thuật
                    </h2>
                    <p className="text-blue-600 mt-1">
                        Kết hợp Trí tuệ Nhân tạo & Chỉ thị Chuyên gia để tạo giáo án 5512 hoàn hảo.
                    </p>

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

                <div className="flex gap-3">
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={handleAudit}
                        disabled={!lessonResult}
                        className="border-amber-200 text-amber-700 hover:bg-amber-50 shadow-sm"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Kiểm định 5512
                    </Button>

                    <Button
                        size="lg"
                        onClick={handleExportDocx}
                        disabled={isExporting || !lessonResult}
                        className="bg-green-600 hover:bg-green-700 shadow-lg text-white"
                    >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FileDown className="w-5 h-5 mr-2" />}
                        Xuất Word (Tối ưu)
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left side: Advanced AI Injection & Merging */}
                <div className="lg:col-span-12 space-y-6">
                    <ExpertBrainInjection
                        value={expertGuidance}
                        onChange={setExpertGuidance}
                        onApply={handleSurgicalMerge}
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
                                        <CardContent>
                                            <Textarea
                                                placeholder={`Dán kết quả AI cho phần ${module.title}...`}
                                                className="min-h-[120px] text-xs font-mono"
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
