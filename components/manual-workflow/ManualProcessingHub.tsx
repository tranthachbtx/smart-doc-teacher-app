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
    Sparkles,
    LayoutDashboard,
    Eye,
    AlertTriangle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { LessonResultPreview } from './LessonResultPreview';
import { useToast } from '@/hooks/use-toast';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
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
    const [detectedTopicName, setDetectedTopicName] = React.useState<string>("");
    const [activePhaseIndex, setActivePhaseIndex] = React.useState<number>(0);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // 🚀 AUTO-INIT SCRATCH MODE (v39.2)
    // Nếu người dùng chọn bài mới mà không có PDF, tự khởi tạo khung lộ trình
    useEffect(() => {
        if (lessonAutoFilledTheme && (!manualModules || manualModules.length === 0)) {
            console.log("[ManualHub] Initializing Scratch Mode Pipeline...");

            // Giả định mặc định 3 tiết nếu không có PDF
            const defaultPeriods = "3 tiết";
            const executionPlan = ManualWorkflowService.generateExecutionPlan(defaultPeriods);

            // Khởi tạo 3 Trụ cột mặc định
            const defaultModules: ProcessingModule[] = [
                { id: "pillar_1", title: "Trụ cột 1: Khung & Vệ tinh (Audit Mode)", type: "setup", prompt: "", content: "", isCompleted: false },
                { id: "pillar_2", title: "Trụ cột 2: Kiến tạo & Khám phá (Deep)", type: "khac", prompt: "", content: "", isCompleted: false },
                { id: "pillar_3", title: "Trụ cột 3: Thực chiến & Đánh giá (Premium)", type: "khac", prompt: "", content: "", isCompleted: false },
            ];

            store.updateLessonField('executionPlan', executionPlan);
            store.updateLessonField('manualModules', defaultModules);
        }
    }, [lessonAutoFilledTheme, manualModules, store]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalyzingStatus("Khởi tạo Pipeline...");

        try {
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            const processResult = await processor.processFile(file, (stage) => setAnalyzingStatus(stage));
            const fullText = processResult.content;

            if (!fullText || fullText.length < 100) {
                toast({
                    title: "Lỗi Trích Xuất",
                    description: "Không thể đọc được nội dung từ file.",
                    variant: "destructive"
                });
                setIsAnalyzing(false);
                return;
            }

            const headerSlice = fullText.substring(0, 6000);
            const { ContentStructureAnalyzer } = await import('@/lib/services/content-structure-analyzer');
            const analyzer = new ContentStructureAnalyzer();

            const utf8Bytes = new TextEncoder().encode(headerSlice);
            let binaryString = "";
            for (let i = 0; i < utf8Bytes.length; i++) {
                binaryString += String.fromCharCode(utf8Bytes[i]);
            }
            const payloadData = window.btoa(binaryString);

            const struct = await analyzer.analyzeAndPreFill(
                { mimeType: 'text/plain', data: payloadData },
                lessonGrade,
                store.lesson.theme
            );

            if (struct) {
                setDetectedTopicName(struct.ten_bai);
                const currentTheme = store.lesson.theme;
                if (!currentTheme || currentTheme === "Chưa chọn chủ đề") {
                    store.updateLessonField('theme', struct.ten_bai);
                }

                store.updateLessonField('processedContext', {
                    cleanData: struct,
                    fullRawText: fullText,
                    detectedTheme: struct.ten_bai
                });

                store.setLessonResult({
                    ...(store.lesson.result || {}),
                    ten_bai: currentTheme || struct.ten_bai,
                });

                const { ProfessionalContentProcessor } = await import('@/lib/services/professional-content-processor');
                const activityContent = ProfessionalContentProcessor.extractActivityContent(fullText);

                const pdfReference = {
                    hoat_dong_khoi_dong: ProfessionalContentProcessor.optimizeForActivity('khoi_dong', activityContent),
                    hoat_dong_kham_pha: ProfessionalContentProcessor.optimizeForActivity('kham_pha', activityContent),
                    hoat_dong_luyen_tap: ProfessionalContentProcessor.optimizeForActivity('luyen_tap', activityContent),
                    hoat_dong_van_dung: ProfessionalContentProcessor.optimizeForActivity('van_dung', activityContent),
                    shdc: ProfessionalContentProcessor.optimizeForActivity('shdc', activityContent),
                    shl: ProfessionalContentProcessor.optimizeForActivity('shl', activityContent),
                };

                // 🏛️ MODULE 1 & 2: INTEGRATED PIPELINE (Efficiency v36.2)
                setAnalyzingStatus("Tổng hợp kết quả Thẩm định & Lập lộ trình...");

                const executionPlan = ManualWorkflowService.generateExecutionPlan(struct.so_tiet || "3");

                store.updateLessonField('processedContext', {
                    ...(store.lesson.processedContext || {}),
                    pdfReference: pdfReference
                });

                // Audit data is now part of the initial 'struct' from ContentStructureAnalyzer
                if (struct.audit_analysis) {
                    store.updateLessonField('auditAnalysis', struct.audit_analysis);
                }

                store.updateLessonField('executionPlan', executionPlan);

                const modules = await ManualWorkflowService.analyzeStructure(fullText, JSON.stringify(activityContent));
                store.updateLessonField('manualModules', modules);

                toast({ title: "✅ Deep Trace hoàn tất! Đã hợp nhất Audit vào Pipeline chính." });
            }
        } catch (error: any) {
            toast({ title: "Lỗi Hệ Thống", description: error.message, variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
            setAnalyzingStatus("");
        }
    };

    const handleCopyPrompt = async (pillarId: string) => {
        try {
            const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);
            const processedContext = store.lesson.processedContext || {};
            const fullText = processedContext.fullRawText || "";
            const cleanData = processedContext.cleanData;

            const sanitizedFullText = fullText.replace(/"""/g, "'''").replace(/\r/g, "");
            const executionPlan = store.lesson.executionPlan || [];

            const context: any = {
                topic: lessonAutoFilledTheme,
                grade: lessonGrade,
                fileSummary: sanitizedFullText.length > 500 ? sanitizedFullText : (cleanData || ""),
                optimizedFileSummary: store.lesson.result || cleanData,
                pdfReference: processedContext.pdfReference,
                smartData: smartData,
                auditAnalysis: lesson.auditAnalysis, // Inject Module 1
                phaseContext: executionPlan.length > 0 ? executionPlan[activePhaseIndex] : null // Inject Module 2
            };

            let prompt = "";
            if (pillarId === 'pillar_1') prompt = await ManualWorkflowService.generatePillar1Prompt(context);
            else if (pillarId === 'pillar_2') prompt = await ManualWorkflowService.generatePillar2Prompt(context);
            else if (pillarId === 'pillar_3') prompt = await ManualWorkflowService.generatePillar3Prompt(context);

            await navigator.clipboard.writeText(prompt);
            toast({ title: "Đã Copy Siêu Prompt!" });
        } catch (e: any) {
            toast({ title: "Lỗi tạo Prompt", description: e.message, variant: "destructive" });
        }
    };

    const handleSmartPaste = async (moduleId: string, rawValue: string) => {
        try {
            const { TextCleaningService } = await import('@/lib/services/text-cleaning-service');
            const cleaner = TextCleaningService.getInstance();
            const sanitizedJson = cleaner.sanitizeAIResponse(rawValue);

            const data = JSON.parse(sanitizedJson);
            const currentResult = { ...(store.lesson.result || {}) };
            let r = { ...currentResult } as any;

            const mergeValue = (targetKey: string, newValue: any) => {
                if (!newValue) return;
                const isSegmented = (store.lesson.executionPlan?.length || 0) > 1;

                if (!r[targetKey] || r[targetKey].length < 10) {
                    r[targetKey] = newValue;
                } else if (isSegmented && r[targetKey].indexOf(newValue.substring(0, 20)) === -1) {
                    // Append for segmented phases if not already present
                    r[targetKey] = r[targetKey] + "\n\n" + newValue;
                }
            };

            if (data.type === 'framework' && data.data) {
                const d = data.data;
                mergeValue('ten_truong', d.ten_truong);
                mergeValue('to_chuyen_mon', d.to_chuyen_mon);
                mergeValue('ten_giao_vien', d.ten_giao_vien);
                mergeValue('muc_tieu_kien_thuc', d.muc_tieu?.kien_thuc);
                mergeValue('muc_tieu_nang_luc', d.muc_tieu?.nang_luc);
                mergeValue('muc_tieu_pham_chat', d.muc_tieu?.pham_chat);
                mergeValue('gv_chuan_bi', d.thiet_bi?.gv);
                mergeValue('hs_chuan_bi', d.thiet_bi?.hs);
                mergeValue('shdc', d.hoat_dong_shdc);
                mergeValue('shl', d.hoat_dong_shl);
                if (d.ten_bai) r.ten_bai = d.ten_bai;
                if (d.so_tiet) r.duration = d.so_tiet;
            } else if (data.ten_bai || data.muc_tieu_kien_thuc || data.ten_truong) {
                mergeValue('ten_truong', data.ten_truong);
                mergeValue('to_chuyen_mon', data.to_chuyen_mon);
                mergeValue('ten_giao_vien', data.ten_giao_vien);
                mergeValue('muc_tieu_kien_thuc', data.muc_tieu_kien_thuc);
                mergeValue('muc_tieu_nang_luc', data.muc_tieu_nang_luc);
                mergeValue('muc_tieu_pham_chat', data.muc_tieu_pham_chat);
                mergeValue('gv_chuan_bi', data.gv_chuan_bi);
                mergeValue('hs_chuan_bi', data.hs_chuan_bi);
                mergeValue('shdc', data.shdc);
                mergeValue('shl', data.shl);
            }

            // Pillar 3 specifically (v39.1 separated fields)
            if (data.phieu_hoc_tap || data.rubric_danh_gia) {
                const combinedHoSo = [
                    data.phieu_hoc_tap || "",
                    data.rubric_danh_gia || ""
                ].filter(Boolean).join("\n\n");
                mergeValue('ho_so_day_hoc', combinedHoSo);
            } else if (data.ho_so_day_hoc) {
                mergeValue('ho_so_day_hoc', data.ho_so_day_hoc);
            }

            if (data.huong_dan_ve_nha) mergeValue('huong_dan_ve_nha', data.huong_dan_ve_nha);

            if (data.khoi_dong || data.kham_pha || data.luyen_tap || data.van_dung) {
                const mapNestedActivity = (key: string, storePrefix: string) => {
                    if (data[key]) {
                        mergeValue(`${storePrefix}_cot_1`, data[key].cot_gv);
                        mergeValue(`${storePrefix}_cot_2`, data[key].cot_hs);

                        // Also update the combined preview field
                        const cot1 = r[`${storePrefix}_cot_1`];
                        const cot2 = r[`${storePrefix}_cot_2`];
                        r[storePrefix] = `HOẠT ĐỘNG: ${key.toUpperCase()}\n\n{{cot_1}}\n${cot1}\n{{cot_2}}\n${cot2}`;
                    }
                };
                mapNestedActivity('khoi_dong', 'hoat_dong_khoi_dong');
                mapNestedActivity('kham_pha', 'hoat_dong_kham_pha');
                mapNestedActivity('luyen_tap', 'hoat_dong_luyen_tap');
                mapNestedActivity('van_dung', 'hoat_dong_van_dung');
            }

            store.setLessonResult(r);
            toast({ title: "🪄 Đã cập nhật dữ liệu sạch!" });
        } catch (e) {
            console.warn("[ManualHub] Merge error:", e);
        }

        store.updateLessonField('manualModules', manualModules.map((m: ProcessingModule) =>
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
            <div className="premium-glass soft-pastel-skyblue p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-4 border-indigo-200">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Binary className="w-40 h-40 text-indigo-50" /></div>
                <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 fill-indigo-500" /> BỘ CÔNG CỤ BIÊN SOẠN THỦ CÔNG
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    <div className="flex flex-col gap-2">
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                        <Button className="w-full h-24 rounded-3xl bg-white/90 hover:bg-white text-indigo-900 border-2 border-indigo-100 shadow-xl gap-4 group transition-all" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                            {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Database className="w-8 h-8 text-indigo-500" />}
                            <div className="text-left"><p className="text-[10px] uppercase font-black opacity-50">BƯỚC 1</p><p className="font-black text-base">Deep Trace PDF</p></div>
                        </Button>
                    </div>
                    <Button className="h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 hover:scale-[1.03] text-white shadow-2xl gap-4" onClick={handleExportDocx} disabled={!lesson.result?.hoat_dong_khoi_dong}>
                        <FileDown className="w-8 h-8" /><div className="text-left"><p className="text-[10px] uppercase font-black opacity-70">BƯỚC CHỐT</p><p className="font-black text-base">Xuất Word</p></div>
                    </Button>

                    {/* 🏛️ MODULE 1 UI: Audit Summary */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-24 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 gap-4" disabled={!lesson.auditAnalysis}>
                                <AlertTriangle className="w-8 h-8 text-rose-600" />
                                <div className="text-left">
                                    <p className="text-[10px] uppercase font-black opacity-50">HỆ THỐNG PHÊ BÌNH</p>
                                    <p className="font-black text-base">Bản Audit AI</p>
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl rounded-[3rem] p-8">
                            <DialogHeader><DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2"><Search className="text-rose-600" /> KẾT QUẢ THẨM ĐỊNH SƯ PHẠM (TRUY VẾT 5512)</DialogTitle></DialogHeader>
                            {lesson.auditAnalysis && (
                                <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-4">
                                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 italic text-rose-900">"{lesson.auditAnalysis.danh_gia_tong_quan}"</div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {lesson.auditAnalysis.phan_tich_chi_tiet.map((item: any, i: number) => (
                                            <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col gap-2">
                                                <h4 className="font-black text-slate-900 flex items-center gap-2"><Badge variant="outline">{item.tieu_chi}</Badge></h4>
                                                <p className="text-xs"><b>Hiện trạng:</b> {item.hien_trang}</p>
                                                <p className="text-xs text-rose-600"><b>Điểm yếu:</b> {item.diem_yeu}</p>
                                                <p className="text-xs text-indigo-600 font-bold"><b>Giải pháp nâng cấp:</b> {item.giai_phap_goi_y}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                                        <h4 className="font-black text-indigo-900 mb-2">⭐ CHIẾN LƯỢC LỘT XÁC:</h4>
                                        <p className="text-sm whitespace-pre-wrap">{lesson.auditAnalysis.goi_y_nang_cap_chien_luoc}</p>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-24 rounded-3xl bg-indigo-50/50 border-2 border-indigo-200 text-indigo-900 gap-4"><Eye className="w-8 h-8 text-indigo-600" /><div className="text-left"><p className="text-[10px] uppercase font-black opacity-50">X-RAY VIEW</p><p className="font-black text-base">Xem trước</p></div></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl rounded-[3rem] p-8">
                            <DialogHeader><DialogTitle className="text-2xl font-black text-slate-900">GIÁO ÁN X-RAY PREVIEW</DialogTitle></DialogHeader>
                            <LessonResultPreview result={lesson.result} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* 💻 MODULE 2 UI: Phase Selector */}
            {lesson.executionPlan && lesson.executionPlan.length > 1 && (
                <div className="flex flex-col gap-4 bg-indigo-900/5 p-8 rounded-[3rem] border-2 border-indigo-100">
                    <h3 className="font-black text-indigo-900 flex items-center gap-2"><LayoutDashboard className="w-5 h-5" /> CHẾ ĐỘ "CHIA ĐỂ TRỊ" (SEGMENTATION ENGINE ACTIVATED)</h3>
                    <div className="flex flex-wrap gap-4">
                        {lesson.executionPlan.map((phase, idx) => (
                            <Button
                                key={phase.id}
                                onClick={() => setActivePhaseIndex(idx)}
                                className={`h-16 px-8 rounded-2xl font-black transition-all ${activePhaseIndex === idx ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'}`}
                            >
                                {idx + 1}. {phase.name} ({phase.range})
                            </Button>
                        ))}
                    </div>
                    {lesson.executionPlan[activePhaseIndex] && (
                        <p className="text-xs text-indigo-800 font-bold bg-white/50 p-4 rounded-2xl border border-indigo-50 italic">
                            🎯 Mục tiêu giai đoạn hiện tại: {lesson.executionPlan[activePhaseIndex].focus}
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['pillar_1', 'pillar_2', 'pillar_3'].map((id, idx) => (
                    <Card key={id} className="rounded-[3rem] border-2 border-slate-100 overflow-hidden bg-white shadow-2xl flex flex-col">
                        <div className="bg-slate-50 px-6 py-8 border-b flex flex-col gap-6">
                            <h3 className="font-black text-slate-900 uppercase">Trụ cột {idx + 1}</h3>
                            <Button onClick={() => handleCopyPrompt(id)} className="bg-slate-900 text-white font-black rounded-2xl py-6">COPY PROMPT {idx + 1}</Button>
                        </div>
                        <div className="p-6 flex-grow">
                            <Textarea placeholder="Dán kết quả JSON tại đây..." className="min-h-[220px] rounded-[2.5rem] font-mono text-[10px] p-6 shadow-inner" value={manualModules.find(m => m.id === id)?.content || ""} onChange={(e) => handleSmartPaste(id, e.target.value)} />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col items-center gap-6 pb-20">
                <Button size="lg" onClick={handleExportDocx} disabled={!store.lesson.result} className="h-20 px-12 rounded-full bg-indigo-600 text-white shadow-2xl text-xl font-black">
                    {store.isExporting ? <Loader2 className="animate-spin" /> : "XUẤT GIÁO ÁN WORD"}
                </Button>
            </div>
        </div>
    );
}
