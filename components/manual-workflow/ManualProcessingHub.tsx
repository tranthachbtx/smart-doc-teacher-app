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
    LayoutDashboard
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
    const [detectedTopicName, setDetectedTopicName] = React.useState<string>("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // BƯỚC 1: TRÍCH XUẤT ELITE (Architecture 25.0 - Hashing, Caching & Orchestration)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        console.log(`[ManualHub] 1. INPUT TRACE: File: ${file.name}, Size: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)}MB), Type: ${file.type}`);
        setAnalyzingStatus("Khởi tạo Pipeline 9.1 (Hashing & Security)...");

        try {
            const { SmartFileProcessor } = await import('@/lib/services/smart-file-processor');
            const processor = SmartFileProcessor.getInstance();

            // 1. EXTRACT FULL CONTENT (Client Side - No Limit)
            const processResult = await processor.processFile(file, (stage) => setAnalyzingStatus(stage));
            const fullText = processResult.content;
            console.log(`[ManualHub] 1. EXTRACTION SUCCESS: ${fullText.length} chars available on Client.`);

            if (!fullText || fullText.length < 100) {
                console.error("[ManualHub] 1. BREAKING POINT: Extracted text is too short or empty.");
                toast({
                    title: "Lỗi Trích Xuất Dữ Liệu",
                    description: "Hệ thống không thể đọc được nội dung từ file này (có thể là file ảnh/scan chưa OCR). Vui lòng kiểm tra lại file gốc.",
                    variant: "destructive",
                    duration: 10000
                });
                setIsAnalyzing(false);
                setAnalyzingStatus("");
                return;
            }

            // 2. SMART SLICING: Prepare Header for AI (Server Limit Protection)
            setAnalyzingStatus("🔪 Đang cắt lát dữ liệu thông minh (Smart Slicing)...");
            // Take first 6000 chars for Metadata Analysis (Title, Grade, Objectives usually appear first)
            const headerSlice = fullText.substring(0, 6000);
            console.log(`[ManualHub] 2. SLICING: Sending ${headerSlice.length} chars to Server for Metadata Analysis.`);

            setAnalyzingStatus("🧠 Phân tích Metadata & Tra cứu Database (Server Side)...");

            // 3. SERVER ORCHESTRATION (Analyze Header + Lookup DB)
            // We use a new internal API route or call the service directly if server actions allow.
            // For now, we reuse ContentStructureAnalyzer but with the SLICE only.
            const { ContentStructureAnalyzer } = await import('@/lib/services/content-structure-analyzer');
            const analyzer = new ContentStructureAnalyzer();

            // Encode SLICE to Base64 to simulate file payload for the existing API signature
            // FIX: Use browser-native Base64 encoding instead of Buffer (Node.js only)
            const utf8Bytes = new TextEncoder().encode(headerSlice);
            let binaryString = "";
            for (let i = 0; i < utf8Bytes.length; i++) {
                binaryString += String.fromCharCode(utf8Bytes[i]);
            }
            const payloadData = window.btoa(binaryString);

            // This step gets: Ten Bai, Khoi Lop, (Auto-detected) + DB lookup could happen here or next.
            // Actually, let's call the analyzer with the slice.
            const struct = await analyzer.analyzeAndPreFill(
                { mimeType: 'text/plain', data: payloadData }, // Sending TEXT slice as mimed data
                lessonGrade,
                store.lesson.theme
            );

            // 4. CLIENT ASSEMBLY (Recombine AI Metadata + DB Info + Full Local Text)
            // Note: 'struct' contains the AI analyzed metadata from the header.
            // We now need to update the store and let the user generate full prompts.
            // The FULL TEXT is still in 'fullText' variable, safely on the client.

            if (struct) {
                console.log("[ManualHub] 3. METADATA RECEIVED:", struct);
                const cleanStruct = {
                    ...struct,
                };

                setDetectedTopicName(struct.ten_bai);

                // CRITICAL FIX: DO NOT overwrite the selected theme if it's already set 
                // and differs from the detected one. Instead, just store it in context.
                const currentTheme = store.lesson.theme;
                if (!currentTheme || currentTheme === "Chưa chọn chủ đề") {
                    store.updateLessonField('theme', struct.ten_bai);
                } else if (currentTheme.toLowerCase() !== struct.ten_bai.toLowerCase()) {
                    console.warn(`[ManualHub] TOPIC CONFLICT: UI has "${currentTheme}", PDF has "${struct.ten_bai}"`);
                    toast({
                        title: "Phát hiện xung đột chủ đề",
                        description: `Bạn đang chọn "${currentTheme}" nhưng PDF là "${struct.ten_bai}". Hệ thống sẽ ưu tiên chủ đề bạn ĐÃ CHỌN để tra cứu Database.`,
                        variant: "default",
                        duration: 10000
                    });
                }

                store.updateLessonField('processedContext', {
                    cleanData: cleanStruct,
                    fullRawText: fullText,
                    detectedTheme: struct.ten_bai // Preserve detection for UI display
                });

                // INITIALIZE RESULT: Only with metadata like Title, but NOT activity content from PDF
                store.setLessonResult({
                    ...(store.lesson.result || {}),
                    ten_bai: currentTheme || struct.ten_bai,
                });

                // 5. INJECT DATABASE CONTEXT (Client Side Lookup based on AI Result)
                setAnalyzingStatus("💉 Tiêm dữ liệu chuyên môn (Database Injection)...");
                // The existing flow already did some DB lookup, let's ensure we use the AI-detected theme
                const { CurriculumService } = await import('@/lib/services/curriculum-service');
                const curriculum = CurriculumService.getInstance();
                const detectedTheme = struct?.ten_bai || store.lesson.theme;

                // We can now update the Smart Data context
                // Note: The handleCopyPrompt function will re-fetch SmartData based on the updated theme.

                // 6. PROCESS PREVIEW (Professional Content Processor - Regex on FULL TEXT)
                setAnalyzingStatus("⚡ Xử lý RegEx trên toàn bộ văn bản (Client Side)...");
                const { ProfessionalContentProcessor } = await import('@/lib/services/professional-content-processor');
                const activityContent = ProfessionalContentProcessor.extractActivityContent(fullText);

                // LOGIC REVERSAL: Store PDF optimized content as REFERENCE, not as the RESULT.
                const pdfReference = {
                    hoat_dong_khoi_dong: ProfessionalContentProcessor.optimizeForActivity('khoi_dong', activityContent),
                    hoat_dong_kham_pha: ProfessionalContentProcessor.optimizeForActivity('kham_pha', activityContent),
                    hoat_dong_luyen_tap: ProfessionalContentProcessor.optimizeForActivity('luyen_tap', activityContent),
                    hoat_dong_van_dung: ProfessionalContentProcessor.optimizeForActivity('van_dung', activityContent),
                    shdc: ProfessionalContentProcessor.optimizeForActivity('shdc', activityContent),
                    shl: ProfessionalContentProcessor.optimizeForActivity('shl', activityContent),
                };

                store.updateLessonField('processedContext', {
                    ...(store.lesson.processedContext || {}),
                    pdfReference: pdfReference
                });

                // Save manual modules analysis metadata
                const modules = await ManualWorkflowService.analyzeStructure(
                    fullText,
                    JSON.stringify(activityContent)
                );
                store.updateLessonField('manualModules', modules);

                toast({
                    title: `✅ Đã phân tích PDF (Smart Slicing Active)`,
                    description: `Đã phân tích 6k ký tự đầu trên Server & Xử lý ${fullText.length} ký tự tại Client.`
                });
            }

        } catch (error: any) {
            console.error("[ManualProcessingHub] Pipeline Error:", error);
            toast({
                title: "Lỗi Hệ Thống Nghiêm Trọng",
                description: error.message || "Lỗi không xác định trong quy trình xử lý file.",
                variant: "destructive",
                duration: 15000
            });
        } finally {
            setIsAnalyzing(false);
            setAnalyzingStatus("");
        }
    };

    // BƯỚC 2 & 3: COPY SIÊU PROMPT 3 TRỤ CỘT (Arch 31.0)
    const handleCopyPrompt = async (pillarId: string) => {
        try {
            console.log(`[ManualHub] 2. PROMPT FLOW TRACE: Generating Pillar ${pillarId}`);
            toast({ title: "Đang nén dữ liệu...", description: "Đang tạo Siêu Prompt theo Trụ cột..." });

            const smartData = await SmartPromptService.lookupSmartData(lessonGrade, lessonAutoFilledTheme);
            const processedContext = store.lesson.processedContext || {};
            const fullText = processedContext.fullRawText || "";
            const cleanData = processedContext.cleanData;

            if (!lessonAutoFilledTheme) {
                console.warn("[ManualHub] DATA INTEGRITY ALERT: Theme is empty. Prompt will be generic.");
                toast({ title: "Cảnh báo dữ liệu", description: "Chủ đề bài học đang trống. Prompt có thể không tối ưu.", variant: "destructive" });
            }

            // STRATEGIC DECISION: If we have Full Text (> 500 chars), we inject it ALL into the prompt.
            // SANITIZATION: Clean up characters that break LLM Heredoc or JSON blocks
            const sanitizedFullText = fullText
                .replace(/"""/g, "'''")
                .replace(/\r/g, "");

            const fileSummaryToUse = sanitizedFullText.length > 500 ? sanitizedFullText : (cleanData || "");
            console.log(`[ManualHub] 2. FLOW: Injecting ${fileSummaryToUse.length} chars of PDF context.`);

            const context: any = {
                topic: lessonAutoFilledTheme,
                grade: lessonGrade,
                fileSummary: fileSummaryToUse,
                optimizedFileSummary: store.lesson.result || cleanData,
                pdfReference: processedContext.pdfReference,
                smartData: smartData
            };

            let prompt = "";
            if (pillarId === 'pillar_1') prompt = await ManualWorkflowService.generatePillar1Prompt(context);
            else if (pillarId === 'pillar_2') prompt = await ManualWorkflowService.generatePillar2Prompt(context);
            else if (pillarId === 'pillar_3') prompt = await ManualWorkflowService.generatePillar3Prompt(context);

            if (!prompt) throw new Error("Prompt generation returned EMPTY string.");

            await navigator.clipboard.writeText(prompt);
            toast({ title: "Đã Copy Siêu Prompt Trụ Cột!", description: "Dán vào Gemini Pro để lấy kết quả chuyên biệt." });
            console.log(`[ManualHub] 2. PROMPT SUCCESS: Pillar ${pillarId} copied to clipboard.`);
        } catch (e: any) {
            console.error("[ManualHub] PROMPT BREAKING POINT:", e);
            toast({ title: "Lỗi tạo Prompt", description: e.message, variant: "destructive" });
        }
    };

    // HÀM DÁN THÔNG MINH ELITE (Arch 31.0 - The 3-Pillar Dissection)
    const handleSmartPaste = (moduleId: string, rawValue: string) => {
        console.log(`[ManualHub] 3. PASTE TRACE: Processing input from ${moduleId}`);
        try {
            const objStart = rawValue.indexOf('{');
            const objEnd = rawValue.lastIndexOf('}');

            if (objStart === -1 || objEnd === -1) {
                console.error("[ManualHub] 3. BREAKING POINT: No JSON object found in paste.");
                toast({
                    title: "Lỗi Định Dạng JSON",
                    description: "Không tìm thấy khối { } trong nội dung bạn vừa dán. Hãy đảm bảo bạn copy toàn bộ kết quả từ Gemini.",
                    variant: "destructive"
                });
                return;
            }

            let data;
            try {
                // Attempt to fix common JSON errors from LLMs (trailing commas, etc.)
                const jsonStr = rawValue.substring(objStart, objEnd + 1)
                    .replace(/,\s*}/g, '}')
                    .replace(/,\s*]/g, ']');
                data = JSON.parse(jsonStr);
                console.log("[ManualHub] 3. PARSE SUCCESS:", Object.keys(data));
            } catch (parseErr: any) {
                console.error("[ManualHub] 3. BREAKING POINT: JSON Parse Error", parseErr);
                toast({
                    title: "Lỗi Cú Pháp JSON",
                    description: `Dữ liệu AI trả về bị lỗi định dạng: ${parseErr.message}. Vui lòng kiểm tra lại cấu trúc file.`,
                    variant: "destructive"
                });
                return;
            }

            let r = { ...(store.lesson.result || {}) } as any;
            let capturedAny = false;

            // TYPE 1: FRAMEWORK (Flexible Architecture v33.0 - Supports both Wrapper & Flat)
            // Check for wrapper type
            if (data.type === 'framework' && data.data) {
                const d = data.data;
                r.muc_tieu_kien_thuc = d.muc_tieu?.kien_thuc;
                r.muc_tieu_nang_luc = d.muc_tieu?.nang_luc;
                r.muc_tieu_pham_chat = d.muc_tieu?.pham_chat;
                r.tich_hop_nls = d.muc_tieu?.nls;
                r.gv_chuan_bi = d.thiet_bi?.gv;
                r.hs_chuan_bi = d.thiet_bi?.hs;
                r.shdc = d.hoat_dong_shdc;
                r.shl = d.hoat_dong_shl;
                if (d.ten_bai) r.ten_bai = d.ten_bai;
                if (d.so_tiet) r.duration = d.so_tiet;
            }
            // Check for Flat Structure (Prompt 1 v33.0)
            else if (data.ten_bai || data.muc_tieu_kien_thuc || data.shdc) {
                if (data.ten_bai) r.ten_bai = data.ten_bai;
                if (data.so_tiet) r.duration = data.so_tiet;
                if (data.muc_tieu_kien_thuc) r.muc_tieu_kien_thuc = data.muc_tieu_kien_thuc;
                if (data.muc_tieu_nang_luc) r.muc_tieu_nang_luc = data.muc_tieu_nang_luc;
                if (data.muc_tieu_pham_chat) r.muc_tieu_pham_chat = data.muc_tieu_pham_chat;
                if (data.gv_chuan_bi) r.gv_chuan_bi = data.gv_chuan_bi;
                if (data.hs_chuan_bi) r.hs_chuan_bi = data.hs_chuan_bi;
                if (data.shdc) r.shdc = data.shdc;
                if (data.shl) r.shl = data.shl;
            }

            // TYPE 2 & 3: MAIN ACTIVITIES (FLEXIBLE ARCHITECTURE v34.0 - Flat & Nested)
            if (data.khoi_dong || data.kham_pha || data.luyen_tap || data.van_dung ||
                data.hoat_dong_khoi_dong_cot_1 || data.hoat_dong_kham_pha_cot_1 ||
                data.hoat_dong_luyen_tap_cot_1 || data.hoat_dong_van_dung_cot_1) {

                // 1. Handle Nested Structure (khoi_dong: { cot_gv, cot_hs })
                const mapNestedActivity = (key: string, storePrefix: string) => {
                    if (data[key]) {
                        r[`${storePrefix}_cot_1`] = data[key].cot_gv;
                        r[`${storePrefix}_cot_2`] = data[key].cot_hs;
                        r[storePrefix] = `HOẠT ĐỘNG: ${key.toUpperCase()}\n\n{{cot_1}}\n${data[key].cot_gv}\n{{cot_2}}\n${data[key].cot_hs}`;
                    }
                };

                // 2. Handle Flat Structure (hoat_dong_khoi_dong_cot_1, hoat_dong_khoi_dong_cot_2)
                const mapFlatActivity = (prefix: string) => {
                    if (data[`${prefix}_cot_1`] || data[`${prefix}_cot_2`]) {
                        r[`${prefix}_cot_1`] = data[`${prefix}_cot_1`];
                        r[`${prefix}_cot_2`] = data[`${prefix}_cot_2`];
                        r[prefix] = `HOẠT ĐỘNG\n\n{{cot_1}}\n${data[`${prefix}_cot_1`]}\n{{cot_2}}\n${data[`${prefix}_cot_2`]}`;
                    }
                };

                mapNestedActivity('khoi_dong', 'hoat_dong_khoi_dong');
                mapNestedActivity('kham_pha', 'hoat_dong_kham_pha');
                mapNestedActivity('luyen_tap', 'hoat_dong_luyen_tap');
                mapNestedActivity('van_dung', 'hoat_dong_van_dung');

                mapFlatActivity('hoat_dong_khoi_dong');
                mapFlatActivity('hoat_dong_kham_pha');
                mapFlatActivity('hoat_dong_luyen_tap');
                mapFlatActivity('hoat_dong_van_dung');

                // EXTRA MAPPING
                if (data.ho_so_day_hoc) r.ho_so_day_hoc = data.ho_so_day_hoc;
                if (data.huong_dan_ve_nha) r.huong_dan_ve_nha = data.huong_dan_ve_nha;
                if (data.shdc) r.shdc = data.shdc;
                if (data.shl) r.shl = data.shl;
                if (data.ten_bai) r.ten_bai = data.ten_bai;
                if (data.so_tiet) r.duration = data.so_tiet;
            }
            // LEGACY SUPPORT (To be deprecated)
            else if ((data.type === 'main_part_1' || data.type === 'main_part_2') && data.activities) {
                data.activities.forEach((act: any) => {
                    let formatted = "";
                    if (act.objective) formatted += `**1. Mục tiêu:**\n${act.objective}\n\n`;
                    if (act.content) formatted += `**2. Nội dung:**\n${act.content}\n\n`;
                    if (act.product) formatted += `**3. Sản phẩm học tập:**\n${act.product}\n\n`;

                    if (act.steps) {
                        formatted += `**4. Tổ chức thực hiện:**\n\n`;
                        const labels: any = { 'transfer': 'a) Chuyển giao nhiệm vụ:', 'perform': 'b) Thực hiện nhiệm vụ:', 'report': 'c) Báo cáo, thảo luận:', 'conclude': 'd) Kết luận, nhận định:' };
                        formatted += act.steps.map((s: any) =>
                            `{{cot_1}}\n**${labels[s.step_type] || 'Bước:'}**\n${s.teacher_action}\n{{cot_2}}\n${s.student_action}`
                        ).join('\n\n');
                    }

                    const id = act.id?.toLowerCase() || "";
                    const fullContent = act.module_title ? `HOẠT ĐỘNG: ${act.module_title}\n\n${formatted}` : formatted;

                    if (id.includes('khoi_dong')) r.hoat_dong_khoi_dong = fullContent;
                    else if (id.includes('kham_pha')) r.hoat_dong_kham_pha = fullContent;
                    else if (id.includes('luyen_tap')) r.hoat_dong_luyen_tap = fullContent;
                    else if (id.includes('van_dung')) r.hoat_dong_van_dung = fullContent;
                });
            }

            // EXTRA: HOMEWORK & RUBRIC (Pillar 3 Specific - Legacy)
            if (data.homework) r.huong_dan_ve_nha = data.homework;
            if (data.rubric) {
                const rub = data.rubric;
                const formattedRub = rub.content ? `HOẠT ĐỘNG: ${rub.module_title || "RUBRIC"}\n\n${rub.content}` : String(rub);
                r.ho_so_day_hoc = (r.ho_so_day_hoc || "") + "\n\n" + formattedRub;
            }

            store.setLessonResult(r);
            toast({ title: "🪄 Triple-Pillar Integration v33.0!", description: "Đã phân rã dữ liệu vào đúng kịch bản (Flat & Legacy)." });
        } catch (e) {
            console.warn("[ManualHub] Dissection error:", e);
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
            {/* 🌊 PIPELINE GỘP 3 BƯỚC */}
            <div className="premium-glass soft-pastel-skyblue p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-4 border-indigo-200">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Binary className="w-40 h-40 text-indigo-50" />
                </div>

                <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 fill-indigo-500" />
                    BỘ CÔNG CỤ BIÊN SOẠN KHBH THỦ CÔNG v31.0
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
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
                                <p className="font-black text-base text-indigo-800 tracking-tighter">Mổ xẻ Metadata</p>
                            </div>
                        </Button>
                    </div>

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

                {detectedTopicName && detectedTopicName !== lessonAutoFilledTheme && (
                    <div className="mt-4 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-center gap-3 animate-pulse">
                        <BrainCircuit className="w-6 h-6 text-rose-500" />
                        <div>
                            <p className="text-xs font-black text-rose-900 uppercase">Phát hiện xung đột chủ đề!</p>
                            <p className="text-sm text-rose-700">File nhận diện là: <b>{detectedTopicName}</b>. Bạn có muốn sử dụng chủ đề này thay vì <b>{lessonAutoFilledTheme}</b>?</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100"
                            onClick={() => store.updateLessonField('theme', detectedTopicName)}
                        >
                            Chấp nhận
                        </Button>
                    </div>
                )}
            </div>

            {/* 🏰 HỆ THỐNG 3 TRỤ CỘT (ARCH 31.0 - PILLAR STRATEGY) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* TRỤ CỘT 1: KHUNG & GIÁO ÁN VỆ TINH */}
                <Card className="rounded-[3rem] border-2 border-slate-100 overflow-hidden bg-white shadow-2xl group flex flex-col relative">
                    <div className="absolute top-4 right-4 bg-slate-100 text-[10px] font-black px-2 py-1 rounded-full text-slate-400">PILLAR 1/3</div>
                    <div className="bg-gradient-to-br from-slate-50 to-white px-6 py-8 border-b flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 text-sm uppercase leading-tight">1. Khung & Vệ tinh</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">Setup + SHDC + SHL</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => handleCopyPrompt('pillar_1')}
                            className="bg-slate-900 text-white hover:bg-slate-700 font-black rounded-2xl gap-2 py-6 shadow-lg shadow-slate-200"
                        >
                            <Copy className="w-4 h-4" /> COPY PROMPT 1
                        </Button>
                    </div>
                    <div className="p-6 flex-grow">
                        <Textarea
                            placeholder="Dán JSON Khung (Metadata + SHDC + SHL)..."
                            className="min-h-[220px] h-full rounded-[2.5rem] border-2 border-slate-100 bg-slate-50/10 focus:bg-white focus:border-slate-800 font-mono text-[10px] p-6 shadow-inner transition-all"
                            value={manualModules.find(m => m.id === 'pillar_1')?.content || ""}
                            onChange={(e) => handleSmartPaste("pillar_1", e.target.value)}
                        />
                    </div>
                </Card>

                {/* TRỤ CỘT 2: KIẾN TẠO TRI THỨC */}
                <Card className="rounded-[3rem] border-2 border-indigo-100 overflow-hidden bg-white shadow-2xl group flex flex-col relative">
                    <div className="absolute top-4 right-4 bg-indigo-100 text-[10px] font-black px-2 py-1 rounded-full text-indigo-400">PILLAR 2/3</div>
                    <div className="bg-gradient-to-br from-indigo-50/30 to-white px-6 py-8 border-b flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                                <Zap className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h3 className="font-black text-indigo-900 text-sm uppercase leading-tight">2. Kiến tạo tri thức</h3>
                                <p className="text-indigo-400 text-[10px] font-bold uppercase mt-1">Hoạt động 1 + 2 (Deep Dive)</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => handleCopyPrompt('pillar_2')}
                            className="bg-indigo-600 text-white hover:bg-indigo-800 font-black rounded-2xl gap-2 py-6 shadow-lg shadow-indigo-200"
                        >
                            <Copy className="w-4 h-4" /> COPY PROMPT 2
                        </Button>
                    </div>
                    <div className="p-6 flex-grow">
                        <Textarea
                            placeholder="Dán JSON Hoạt động 1 & 2 cốt lõi..."
                            className="min-h-[220px] h-full rounded-[2.5rem] border-2 border-indigo-50 bg-indigo-50/5 focus:bg-white focus:border-indigo-600 font-mono text-[10px] p-6 shadow-inner transition-all"
                            value={manualModules.find(m => m.id === 'pillar_2')?.content || ""}
                            onChange={(e) => handleSmartPaste("pillar_2", e.target.value)}
                        />
                    </div>
                </Card>

                {/* TRỤ CỘT 3: THỰC CHIẾN & ĐÁNH GIÁ */}
                <Card className="rounded-[3rem] border-2 border-rose-100 overflow-hidden bg-white shadow-2xl group flex flex-col relative">
                    <div className="absolute top-4 right-4 bg-rose-100 text-[10px] font-black px-2 py-1 rounded-full text-rose-400">PILLAR 3/3</div>
                    <div className="bg-gradient-to-br from-rose-50/30 to-white px-6 py-8 border-b flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl">
                                <Binary className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-rose-900 text-sm uppercase leading-tight">3. Thực chiến & Đánh giá</h3>
                                <p className="text-rose-400 text-[10px] font-bold uppercase mt-1">HĐ 3 + 4 + Bảng Rubric</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            onClick={() => handleCopyPrompt('pillar_3')}
                            className="bg-rose-600 text-white hover:bg-rose-800 font-black rounded-2xl gap-2 py-6 shadow-lg shadow-rose-200"
                        >
                            <Copy className="w-4 h-4" /> COPY PROMPT 3
                        </Button>
                    </div>
                    <div className="p-6 flex-grow">
                        <Textarea
                            placeholder="Dán JSON HĐ 3, 4 và Rubric đánh giá..."
                            className="min-h-[220px] h-full rounded-[2.5rem] border-2 border-rose-50 bg-rose-50/5 focus:bg-white focus:border-rose-600 font-mono text-[10px] p-6 shadow-inner transition-all"
                            value={manualModules.find(m => m.id === 'pillar_3')?.content || ""}
                            onChange={(e) => handleSmartPaste("pillar_3", e.target.value)}
                        />
                    </div>
                </Card>
            </div>

            <div className="flex flex-col items-center gap-6 pb-20">
                <Button
                    size="lg"
                    onClick={handleExportDocx}
                    disabled={!store.lesson.result}
                    className="h-20 px-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xl hover:shadow-indigo-200/50 transition-all gap-4 group text-xl font-black"
                >
                    {store.isExporting ? (
                        <>
                            <Loader2 className="w-8 h-8 animate-spin" />
                            ĐANG XUẤT FILE... ({store.exportProgress}%)
                        </>
                    ) : (
                        <>
                            <FileDown className="w-8 h-8 group-hover:bounce" />
                            XUẤT GIÁO ÁN WORD (5512)
                        </>
                    )}
                </Button>

                <Badge variant="outline" className="px-6 py-2 rounded-full bg-slate-50 border-slate-200 text-slate-500 gap-2">
                    <Binary className="w-4 h-4" /> Deep Dissection Engine v31.0: Triple-Pillar Protocol Active
                </Badge>
            </div>
        </div>
    );
}
