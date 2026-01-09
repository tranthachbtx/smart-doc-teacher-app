"use client";

import React, { useEffect } from 'react';
import { useAppStore, ProcessingModule } from '@/lib/store/use-app-store';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Copy,
    FileDown,
    CheckCircle,
    Loader2,
    Search,
    BrainCircuit,
    Zap,
    MousePointer2,
    Database,
    Binary,
    Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
import { ContentStructureAnalyzer } from '@/lib/services/content-structure-analyzer';
import { useLessonActions } from '@/lib/hooks/use-lesson-actions';

export function ManualProcessingHub() {
    const store = useAppStore();
    const { lesson } = store;
    const {
        theme: lessonAutoFilledTheme,
        grade: lessonGrade,
        manualModules,
    } = lesson;

    const { handleExportDocx, handleAudit } = useLessonActions();
    const { toast } = useToast();

    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analyzingStatus, setAnalyzingStatus] = React.useState<string>("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // BƯỚC 1: TRÍCH XUẤT ELITE (Architecture 25.0 - Hashing, Caching & Orchestration)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalyzingStatus("Khởi tạo Pipeline 9.1 (Hashing & Security)...");

        try {
            // 1. Sử dụng SmartFileProcessor (Cực mạnh: Hash file, Kiểm tra Cache, Chạy Worker)
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            const processResult = await processor.processFile(file, (stage) => setAnalyzingStatus(stage));
            const rawText = processResult.content;

            setAnalyzingStatus("🧬 Đang tiêm (Inject) ngữ cảnh chuyên môn từ Database...");

            // 2. Sử dụng PedagogicalOrchestrator để làm giàu dữ liệu (Enrichment)
            const { PedagogicalOrchestrator } = await import('@/lib/services/pedagogical-orchestrator');
            const orchestrator = PedagogicalOrchestrator.getInstance();

            // Tìm kiếm sâu trong Database để lấy mục tiêu chuẩn, năng lực số, và tâm lý lớp học
            const { CurriculumService } = await import('@/lib/services/curriculum-service');
            const curriculum = CurriculumService.getInstance();
            const matchedTheme = curriculum.identifyThemeFromText(rawText.substring(0, 1000) + " " + file.name, parseInt(lessonGrade));

            if (matchedTheme) {
                console.log(`[ManualHub] Auto-matched with Database Theme: ${matchedTheme.theme.ten}`);
                store.updateLessonField('theme', matchedTheme.theme.ten);
            }

            setAnalyzingStatus("Đang mổ xẻ nội dung chuẩn 5512 (Professional Processor)...");

            // 3. Sử dụng ProfessionalContentProcessor (Vô cùng mạnh mẽ)
            const { ProfessionalContentProcessor } = await import('@/lib/services/professional-content-processor');
            const activityContent = ProfessionalContentProcessor.extractActivityContent(rawText);

            // 4. Cập nhật Store (File dữ liệu gốc)
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                store.updateLessonField('file', { mimeType: file.type, data: base64, name: file.name });
            };

            // 5. KHỞI TẠO RESULT (Dữ liệu ban đầu "Siêu mạnh")
            const initialResult: any = {
                ...(store.lesson.result || {}),
                ten_bai: file.name.replace('.pdf', ''),
                hoat_dong_khoi_dong: ProfessionalContentProcessor.optimizeForActivity('khoi_dong', activityContent),
                hoat_dong_kham_pha: ProfessionalContentProcessor.optimizeForActivity('kham_pha', activityContent),
                hoat_dong_luyen_tap: ProfessionalContentProcessor.optimizeForActivity('luyen_tap', activityContent),
                hoat_dong_van_dung: ProfessionalContentProcessor.optimizeForActivity('van_dung', activityContent),
            };
            store.setLessonResult(initialResult);

            // 6. KHỞI TẠO MODULES (Với nội dung đã được làm sạch và phong phú)
            const modules = await ManualWorkflowService.analyzeStructure(
                rawText,
                JSON.stringify(activityContent)
            );
            store.updateLessonField('manualModules', modules);

            // 7. BƯỚC CUỐI: AI DEEP DISSECTION (Chỉ xử lý phần Metadata còn thiếu)
            setAnalyzingStatus("Đang dùng Trí tuệ nhân tạo mổ xẻ Metadata (Deep Dive)...");
            try {
                const { ContentStructureAnalyzer } = await import('@/lib/services/content-structure-analyzer');
                const analyzer = new ContentStructureAnalyzer();
                // Chúng ta chỉ gửi TEXT đã trích xuất, không gửi File Base64 cồng kềnh
                const struct = await analyzer.analyzeAndPreFill(
                    { mimeType: 'text/plain', data: Buffer.from(rawText).toString('base64') },
                    lessonGrade,
                    lessonAutoFilledTheme
                );

                if (struct) {
                    store.updateLessonField('theme', struct.ten_bai);
                    store.updateLessonField('processedContext', { cleanData: struct });
                    store.setLessonResult({
                        ...initialResult,
                        ...struct
                    });
                }
            } catch (aiErr) {
                console.warn("[ManualHub] AI Dissection failed, continuing with Regex enrichment.", aiErr);
            }

            toast({
                title: `✅ Đã tận dụng chức năng ưu việt (Source: ${processResult.source === 'cache' ? 'Smart Cache' : 'Deep API'})`,
                description: "Nội dung PDF đã được trích xuất, làm giàu từ Database và chuẩn hóa 5512."
            });

        } catch (error: any) {
            console.error("[ManualProcessingHub] Elite Pipeline Error:", error);
            toast({ title: "Lỗi mổ xẻ PDF", description: error.message, variant: "destructive" });
        } finally {
            console.log("[ManualHub] 🔍 DEEP TRACE: Pipeline execution complete. Store Result:", store.lesson.result);
            setIsAnalyzing(false);
            setAnalyzingStatus("");
        }
    };

    // BƯỚC 2 & 3: COPY SIÊU PROMPT GỘP
    const handleCopyMergedPrompt = async (step: number) => {
        try {
            toast({ title: "Đang tối ưu Siêu Prompt...", description: "Đang gộp hoạt động & tiêm context..." });

            const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);
            const cleanData = store.lesson.processedContext?.cleanData;

            const context = {
                topic: lessonAutoFilledTheme,
                grade: lessonGrade,
                fileSummary: "",
                optimizedFileSummary: cleanData,
                smartData: smartData
            };

            console.log("[ManualHub] 🔍 DEEP TRACE: Exporting with Data Payload:", {
                result: store.lesson.result,
                context: context
            });

            const prompt = step === 1
                ? await ManualWorkflowService.generateMergedPrompt1(context)
                : await ManualWorkflowService.generateMergedPrompt2(context);

            await navigator.clipboard.writeText(prompt);
            toast({ title: `Đã Copy Prompt Bước ${step}!`, description: "Dán vào Gemini Pro Web để lấy kịch bản chi tiết." });
        } catch (e) {
            toast({ title: "Lỗi", variant: "destructive" });
        }
    };

    // HÀM DÁN THÔNG MINH (Tự động bóc tách mảng JSON)
    const handleSmartPaste = (moduleId: string, rawValue: string) => {
        try {
            const jsonStart = rawValue.indexOf('['); // Tìm mảng
            const jsonEnd = rawValue.lastIndexOf(']');
            if (jsonStart !== -1 && jsonEnd !== -1) {
                const jsonStr = rawValue.substring(jsonStart, jsonEnd + 1);
                const activities = JSON.parse(jsonStr);

                if (Array.isArray(activities)) {
                    let currentResult = { ...(store.lesson.result || {}) } as any;

                    activities.forEach(act => {
                        const formatted = act.steps.map((s: any) =>
                            `{{cot_1}}\n${s.teacher_action}\n{{cot_2}}\n${s.student_action}`
                        ).join('\n\n');

                        // Ánh xạ vào đúng ô của store result (Fix labels)
                        if (act.id.includes('khoi_dong')) currentResult.hoat_dong_khoi_dong = `HOẠT ĐỘNG: ${act.module_title || "KHỞI ĐỘNG"}\n\n` + formatted;
                        if (act.id.includes('kham_pha')) currentResult.hoat_dong_kham_pha = `HOẠT ĐỘNG: ${act.module_title || "KHÁM PHÁ"}\n\n` + formatted;
                        if (act.id.includes('luyen_tap')) currentResult.hoat_dong_luyen_tap = `HOẠT ĐỘNG: ${act.module_title || "LUYỆN TẬP"}\n\n` + formatted;
                        if (act.id.includes('van_dung')) currentResult.hoat_dong_van_dung = `HOẠT ĐỘNG: ${act.module_title || "VẬN DỤNG"}\n\n` + formatted;
                    });

                    store.setLessonResult(currentResult);
                    toast({ title: "🪄 Smart Transform Thành công!", description: "Nội dung đã được dàn trang 2 cột tự động." });
                }
            }
        } catch (e) {
            // Fallback: cứ lưu text thô
        }

        // Cập nhật giao diện Module
        store.updateLessonField('manualModules', manualModules.map(m =>
            m.id === moduleId ? { ...m, content: rawValue, isCompleted: true } : m
        ));
    };

    if (!lessonAutoFilledTheme) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-3xl rounded-[3rem] border-2 border-dashed border-indigo-100 min-h-[400px]">
                <MousePointer2 className="w-16 h-16 text-indigo-300 mb-6 animate-bounce" />
                <h3 className="text-2xl font-black text-slate-800 mb-2">Chưa chọn bài dạy</h3>
                <p className="text-slate-500 text-center">Vui lòng chọn chủ đề ở cột trái.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* 🌊 PIPELINE GỘP 3 BƯỚC */}
            <div className="premium-glass soft-pastel-skyblue p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-4 border-indigo-200">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Binary className="w-40 h-40 text-indigo-500" />
                </div>

                <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 fill-indigo-500" />
                    QUY TRÌNH 3 BƯỚC - COPY LẦN 2
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {/* BƯỚC 1: AUTO */}
                    <div className="flex flex-col gap-2">
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                        <Button
                            className="w-full h-24 rounded-3xl bg-white/90 hover:bg-white text-indigo-900 border-2 border-indigo-100 shadow-xl gap-4 group transition-all"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin text-indigo-500" /> : <Database className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />}
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-black opacity-50 px-1 bg-indigo-50 rounded">BƯỚC 1: XỬ LÝ PDF</p>
                                <p className="font-black text-base text-indigo-800 tracking-tighter">Mổ xẻ & Tự điền</p>
                            </div>
                        </Button>
                    </div>

                    {/* BƯỚC 2: COPY-PASTE (XUẤT WORD LUÔN Ở ĐÂY NẾU MUỐN) */}
                    <Button
                        className="h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 hover:scale-[1.03] text-white shadow-2xl shadow-indigo-200 gap-4"
                        onClick={handleExportDocx}
                        disabled={!lesson.result?.hoat_dong_khoi_dong}
                    >
                        <FileDown className="w-8 h-8" />
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-black opacity-70 px-1 bg-white/20 rounded">BƯỚC CHỐT: XUẤT FILE</p>
                            <p className="font-black text-base tracking-tighter">Tải Giáo án Word</p>
                        </div>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-24 rounded-3xl bg-amber-50/80 border-2 border-amber-200 text-amber-900 gap-4 hover:bg-amber-100 transition-colors"
                        onClick={handleAudit}
                    >
                        <Search className="w-8 h-8 text-amber-600" />
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-black opacity-50 px-1 bg-amber-200/50 rounded">KIỂM ĐỊNH</p>
                            <p className="font-black text-base text-amber-800 tracking-tighter">Chuẩn 5512</p>
                        </div>
                    </Button>
                </div>
            </div>

            {/* 📦 CÁC TRẠM TRUNG CHUYỂN DỮ LIỆU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PHẦN 1: KHỞI ĐỘNG & KHÁM PHÁ */}
                <Card className="rounded-[2.5rem] border-2 border-indigo-50 overflow-hidden bg-white shadow-xl group">
                    <div className="bg-indigo-50/50 px-8 py-5 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <span className="font-black text-indigo-900">PHẦN KIẾN THỨC (HĐ 1+2)</span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopyMergedPrompt(1)}
                            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white font-black rounded-xl gap-2"
                        >
                            <Copy className="w-4 h-4" /> Copy Prompt
                        </Button>
                    </div>
                    <div className="p-8">
                        <Textarea
                            placeholder="Dán JSON từ Gemini vào đây để tự động dàn trang 2 cột..."
                            className="min-h-[220px] rounded-3xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-indigo-400 font-mono text-xs transition-all"
                            value={manualModules[1]?.content || ""}
                            onChange={(e) => handleSmartPaste("mod_main_1", e.target.value)}
                        />
                    </div>
                </Card>

                {/* PHẦN 2: LUYỆN TẬP & VẬN DỤNG */}
                <Card className="rounded-[2.5rem] border-2 border-emerald-50 overflow-hidden bg-white shadow-xl group">
                    <div className="bg-emerald-50/50 px-8 py-5 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                                <Search className="w-5 h-5" />
                            </div>
                            <span className="font-black text-emerald-900">PHẦN THỰC CHIẾN (HĐ 3+4)</span>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCopyMergedPrompt(2)}
                            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white font-black rounded-xl gap-2"
                        >
                            <Copy className="w-4 h-4" /> Copy Prompt
                        </Button>
                    </div>
                    <div className="p-8">
                        <Textarea
                            placeholder="Dán JSON từ Gemini vào đây..."
                            className="min-h-[220px] rounded-3xl border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-emerald-400 font-mono text-xs transition-all"
                            value={manualModules[2]?.content || ""}
                            onChange={(e) => handleSmartPaste("mod_main_2", e.target.value)}
                        />
                    </div>
                </Card>
            </div>

            {/* LƯU Ý DƯỚI CÙNG & NÚT XUẤT FILE PHÁ ĐẢO PAGE COUNT */}
            <div className="flex flex-col items-center gap-6 pb-20">
                <Button
                    size="lg"
                    onClick={handleExportDocx}
                    disabled={!store.lesson.result}
                    className="h-20 px-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl hover:shadow-indigo-200/50 transition-all gap-4 group text-xl font-black"
                >
                    {store.loading.isExporting ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin" />
                            ĐANG XUẤT FILE HF V26.0... ({store.exportProgress}%)
                        </>
                    ) : (
                        <>
                            <FileDown className="w-8 h-8 group-hover:bounce" />
                            XUẤT GIÁO ÁN WORD (100+ TRANG)
                        </>
                    )}
                </Button>

                <Badge variant="outline" className="px-6 py-2 rounded-full bg-slate-50 border-slate-200 text-slate-500 gap-2">
                    <Binary className="w-4 h-4" /> Smart Relay Engine v26.0: Đã kích hoạt Multi-Segment Export
                </Badge>
            </div>
        </div>
    );
}
