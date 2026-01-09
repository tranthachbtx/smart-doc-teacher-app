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

    // BƯỚC 1: XỬ LÝ TỰ ĐỘNG (Pre-Fill)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setAnalyzingStatus("Đang đọc & Mổ xẻ trực tiếp PDF...");

        try {
            // Sử dụng API Route để vượt rào Payload 1MB của Server Action
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/extract-pdf-content', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi xử lý file');
            }

            const extractionResult = await response.json();

            // Xử lý bước mổ xẻ AI (Pre-Fill Deep Data)
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];
                const filePayload = { mimeType: file.type, data: base64 };

                // Lưu vào store
                store.updateLessonField('file', { ...filePayload, name: file.name });

                const analyzer = new ContentStructureAnalyzer();
                const struct = await analyzer.analyzeAndPreFill(filePayload, lessonGrade, lessonAutoFilledTheme);

                // TỰ ĐỘNG ĐIỀN DATA (Việc nhẹ)
                store.updateLessonField('theme', struct.ten_bai);
                store.updateLessonField('processedContext', { cleanData: struct });

                // Cập nhật Result tạm thời cho phần Metadata
                const initialResult: any = {
                    ...(store.lesson.result || {}),
                    ten_bai: struct.ten_bai,
                    muc_tieu_kien_thuc: struct.muc_tieu_kien_thuc,
                    muc_tieu_nang_luc: struct.muc_tieu_nang_luc,
                    muc_tieu_pham_chat: struct.muc_tieu_pham_chat,
                    thiet_bi_gv: struct.thiet_bi_gv,
                    thiet_bi_hs: struct.thiet_bi_hs,
                    shdc: struct.noi_dung_shdc,
                    shl: struct.noi_dung_shl,
                };
                store.setLessonResult(initialResult);

                // Khởi tạo các module copy VỚI DỮ LIỆU ĐÃ MỔ XẺ
                const modules = await ManualWorkflowService.analyzeStructure(
                    extractionResult.content || "",
                    JSON.stringify(struct)
                );
                store.updateLessonField('manualModules', modules);

                toast({ title: "✅ Đã mổ xẻ PDF thành công!", description: "Metadata & Sinh hoạt đã được điền. Các module đã sẵn sàng." });
            };
        } catch (error: any) {
            console.error("[ManualProcessingHub] Upload Error:", error);
            toast({ title: "Lỗi mổ xẻ PDF", description: error.message, variant: "destructive" });
        } finally {
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

                        // Ánh xạ vào đúng ô của store result
                        if (act.id.includes('khoi_dong')) currentResult.hoat_dong_khoi_dong = formatted;
                        if (act.id.includes('kham_pha')) currentResult.hoat_dong_kham_pha = formatted;
                        if (act.id.includes('luyen_tap')) currentResult.hoat_dong_luyen_tap = formatted;
                        if (act.id.includes('van_dung')) currentResult.hoat_dong_van_dung = formatted;
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

            {/* LƯU Ý DƯỚI CÙNG */}
            <div className="flex justify-center">
                <Badge variant="outline" className="px-6 py-2 rounded-full bg-slate-50 border-slate-200 text-slate-500 gap-2">
                    <Binary className="w-4 h-4" /> Smart Relay Engine v20.2: Tự động phát hiện & Chuyển đổi JSON
                </Badge>
            </div>
        </div>
    );
}
