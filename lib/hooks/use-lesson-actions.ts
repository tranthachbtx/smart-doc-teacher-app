import { useCallback } from 'react';
import { useAppStore } from '../store/use-app-store';
import { DocumentExportSystem } from '../services/document-export-system';
import { auditLessonPlan } from '../actions/gemini';
import { surgicalMerge } from '../services/KHBHMerger';
import { performAdvancedAudit } from '../actions/advanced-audit';
import { generateDeepContent } from '../actions/gemini';
import { SmartPromptService } from '../services/smart-prompt-service';
import { TextCleaningService } from '../services/text-cleaning-service';

export const useLessonActions = () => {
    const store = useAppStore();
    const { lesson } = store;

    const handleGenerateFullPlan = useCallback(async () => {
        if (!lesson.theme) {
            store.setError("Vui lòng chọn hoặc nhập chủ đề bài học");
            return;
        }

        console.log("[SYSTEM_AUDIT_LOG_CLIENT] 🚀 Client triggering generateLesson | Theme:", lesson.theme);

        store.setLoading('isGenerating', true);
        store.setSuccess("🚀 Đang khởi tạo tiến trình AI (Automated Deep Dive)...");

        try {
            // Dynamic import to avoid circular dependencies
            const { generateLesson } = await import('../actions/gemini');

            // 🎯 SMART-INPUT LOGIC: If no file, synthesize one from Theme for Deep Dive Engine
            let filePayload = undefined;

            if (lesson.file) {
                filePayload = {
                    mimeType: lesson.file.mimeType,
                    data: lesson.file.data, // This is base64 string
                    name: lesson.file.name
                };
            } else if (lesson.theme && lesson.grade) {
                // 🎯 ENHANCED DATABASE MODE (FIX: EMPTY CONTENT)
                const smartData = await SmartPromptService.lookupSmartData(lesson.grade, lesson.theme, lesson.chuDeSo);

                const richContent = `YÊU CẦU TỰ ĐỘNG KHỞI TẠO (DATABASE MODE):
                - Chủ đề: ${lesson.theme}
                - Khối lớp: ${lesson.grade}
                
                DỮ LIỆU TỪ CHƯƠNG TRÌNH GDPT 2018 (CHI TIẾT):
                ${smartData.objectives}
                
                NHIỆM VỤ SƯ PHẠM CỐT LÕI CẦN THỂ HIỆN TRONG GIÁO ÁN:
                1. Khởi động: ${smartData.coreMissions.khoiDong}
                2. Khám phá: ${smartData.coreMissions.khamPha}
                3. Luyện tập: ${smartData.coreMissions.luyenTap}
                4. Vận dụng: ${smartData.coreMissions.vanDung}
                
                GỢI Ý PHƯƠNG PHÁP & KỸ THUẬT DẠY HỌC:
                ${smartData.pedagogicalNotes}
                
                YÊU CẦU TÍCH HỢP NĂNG LỰC SỐ:
                ${smartData.digitalCompetency}
                
                YÊU CẦU ĐÁNH GIÁ (RUBRIC/HỒ SƠ):
                ${smartData.assessmentTools}
                `;

                // Browser-safe Base64 encoding for Unicode
                const base64Content = btoa(unescape(encodeURIComponent(richContent)));

                filePayload = {
                    mimeType: 'text/plain',
                    data: base64Content,
                    name: `Auto_Fetch_Database_Lop${lesson.grade}.txt`
                };
                console.log("[useLessonActions] No file uploaded. Synthesized RICH Virtual File from Database.");
            }

            const result = await generateLesson(
                lesson.grade,
                lesson.theme,
                lesson.duration,
                undefined, // context
                undefined, // tasks
                lesson.month,
                undefined, // suggestions
                filePayload,
                store.selectedModel
            );

            if (result.success && result.data) {
                console.log(`[SYSTEM_AUDIT_LOG_CLIENT] 🏁 Result received: Keys=${Object.keys(result.data).join(',')}`);
                store.setLessonResult(result.data);
                store.setSuccess("✅ Giáo án đã được tạo thành công!");
            } else {
                store.setError(result.error || "Có lỗi xảy ra khi tạo giáo án.");
            }
        } catch (error: any) {
            store.setError(error.message);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [lesson.theme, lesson.grade, lesson.duration, lesson.month, lesson.file, store]);

    const handleExportDocx = useCallback(async () => {
        if (!lesson.result) {
            store.setError("Không có dữ liệu giáo án để xuất");
            return;
        }

        store.setLoading('isExporting', true);
        store.setExportProgress(0);

        try {
            const fileName = `Giao_an_${lesson.theme || lesson.result.ten_bai || "HDTN"}.docx`.replace(/\s+/g, "_");

            // Enhanced progress tracking
            const startTime = Date.now();
            const progressCallback = (percent: number) => {
                store.setExportProgress(percent);

                // Log progress for debugging
                if (percent % 25 === 0) {
                    const elapsed = Date.now() - startTime;
                    console.log(`Export progress: ${percent}% (${elapsed}ms elapsed)`);
                }
            };

            const result = await DocumentExportSystem.getInstance().exportLesson(
                lesson.result,
                { onProgress: progressCallback }
            );

            if (result) {
                const totalTime = Date.now() - startTime;
                store.setSuccess(`💾 Đã tải xuống file Word! (${totalTime}ms)`);

                // Log success metrics
                console.log(`Export completed successfully in ${totalTime}ms`);
            } else {
                throw new Error("Export returned false");
            }

        } catch (error: any) {
            console.error('Export error details:', {
                error: error.message,
                stack: error.stack,
                lessonResultSize: store.lesson.result ? JSON.stringify(store.lesson.result).length : 0,
                timestamp: new Date().toISOString()
            });

            // Enhanced error messages
            let errorMessage = "Lỗi xuất file: ";

            if (error.message.includes('timeout')) {
                errorMessage += "Quá thời gian xử lý. Vui lòng thử lại với nội dung ngắn hơn.";
            } else if (error.message.includes('memory')) {
                errorMessage += "Bộ nhớ không đủ. Vui lòng đóng các tab khác và thử lại.";
            } else if (error.message.includes('validation')) {
                errorMessage += "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại nội dung.";
            } else if (error.message.includes('network')) {
                errorMessage += "Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.";
            } else {
                errorMessage += error.message || "Lỗi không xác định";
            }

            store.setError(errorMessage);

            // Optional: Report error to analytics (Phase 3.1)
            if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'export_error', {
                    error_message: error.message,
                    content_size: lesson.result ? JSON.stringify(lesson.result).length : 0
                });
            }

        } finally {
            store.setLoading('isExporting', false);
            // Clear success message after 5 seconds, error after 10 seconds
            const clearTime = store.success ? 5000 : 10000;
            setTimeout(() => store.setSuccess(null), clearTime);
        }
    }, [lesson.result, lesson.theme, store]);

    const handleAudit = useCallback(async () => {
        if (!lesson.result) return;

        store.setLoading('isAuditing', true);
        store.setSuccess("🔍 Đang thực hiện kiểm định chuyên sâu (Neural Audit)...");

        try {
            const result = await performAdvancedAudit(lesson.result);
            if (result.success && result.report) {
                const report = result.report;
                store.setSuccess(`✅ Kiểm định hoàn tất: Score ${report.overallScore}/100. ${report.professionalReasoning?.substring(0, 100)}...`);

                // You could also open a dialog here with full report details
                console.log("[Audit Report]", report);
            } else {
                store.setError(result.error || "Kiểm định không thành công");
            }
        } catch (error: any) {
            store.setError(error.message);
        } finally {
            store.setLoading('isAuditing', false);
        }
    }, [lesson.result, store]);

    const handleGenerateDeepContent = useCallback(async () => {
        if (!lesson.result) {
            store.setError("Bạn cần có khung giáo án 4 hoạt động trước khi tạo nội dung chuyên sâu.");
            return;
        }

        store.setLoading('isGenerating', true);
        store.setSuccess("🧠 Bắt đầu quy trình Siêu chuyên sâu (Sequential Deepening)...");

        try {
            const smartData = await SmartPromptService.lookupSmartData(lesson.grade, lesson.theme, lesson.chuDeSo);
            const cleaner = TextCleaningService.getInstance();
            let currentPlan = { ...lesson.result };

            // Priority: File Summary > Expert Guidance
            const fileContext = lesson.fileSummary || lesson.expertGuidance || "";

            // Sequential Stages for Maximum Density (Split into 4 for maximum depth)
            const stages = [
                { id: "s1", label: "Giai đoạn 1: Mục tiêu, Thiết bị & Khởi động", focus: "setup, shdc, hoat_dong_khoi_dong" },
                { id: "s2", label: "Giai đoạn 2: Khám phá (Deep Dive)", focus: "hoat_dong_kham_pha" },
                { id: "s3", label: "Giai đoạn 3: Luyện tập (Deep Dive)", focus: "hoat_dong_luyen_tap" },
                { id: "s4", label: "Giai đoạn 4: Vận dụng & Tổng kết", focus: "hoat_dong_van_dung, shl, ho_so_day_hoc, huong_dan_ve_nha" }
            ];

            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];
                store.setSuccess(`🚀 [${i + 1}/${stages.length}] ${stage.label}...`);

                // Inject File Context into the prompt
                const deepPrompt = SmartPromptService.buildDeepContentPrompt(currentPlan, smartData, stage.focus, fileContext);
                const result = await generateDeepContent(deepPrompt, store.selectedModel);

                if (result.success && result.data) {
                    const stageData = { ...result.data };

                    // Clean and Update only the fields we focused on in this stage
                    // This prevents AI from "shinking" other fields it wasn't focusing on
                    const focusFields = stage.focus.split(',').map(f => f.trim());

                    focusFields.forEach(field => {
                        // Cast to 'any' to allow dynamic string indexing
                        const dynamicStageData = stageData as any;
                        const dynamicCurrentPlan = currentPlan as any;

                        if (dynamicStageData[field]) {
                            let contentToCLean = dynamicStageData[field];
                            if (typeof contentToCLean === 'string') {
                                dynamicCurrentPlan[field] = cleaner.cleanFinalOutput(contentToCLean);
                            } else {
                                dynamicCurrentPlan[field] = contentToCLean; // Keep objects as is
                            }
                        }
                    });

                    // Also always update goals in Stage 1
                    if (stage.id === "foundation") {
                        currentPlan.muc_tieu_kien_thuc = cleaner.cleanFinalOutput(stageData.muc_tieu_kien_thuc || currentPlan.muc_tieu_kien_thuc);
                        currentPlan.muc_tieu_nang_luc = cleaner.cleanFinalOutput(stageData.muc_tieu_nang_luc || currentPlan.muc_tieu_nang_luc);
                        currentPlan.muc_tieu_pham_chat = cleaner.cleanFinalOutput(stageData.muc_tieu_pham_chat || currentPlan.muc_tieu_pham_chat);
                        currentPlan.thiet_bi_day_hoc = cleaner.cleanFinalOutput(stageData.thiet_bi_day_hoc || currentPlan.thiet_bi_day_hoc);
                    }

                    store.setLessonResult(currentPlan);
                } else {
                    console.warn(`Stage ${stage.id} failed, skipping...`, result.error);
                }
            }

            store.setSuccess("✨ Chúc mừng! Giáo án đã được phẫu thuật nội dung SIÊU CHI TIẾT thành công!");
        } catch (error: any) {
            store.setError(`Lỗi Sequential Deepening: ${error.message}`);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [lesson.result, lesson.grade, lesson.theme, lesson.chuDeSo, store]);

    const handleSurgicalMerge = useCallback(async (expertDirectives: string) => {
        if (!lesson.result) return;

        store.setLoading('isGenerating', true);
        store.setSuccess("🧬 Đang tiến hành hợp nhất chuyên môn (Surgical Fusion)...");

        try {
            const result = await surgicalMerge(lesson.result, expertDirectives);
            if (result.success && result.content) {
                store.setLessonResult(result.content);
                store.setSuccess(`✅ ${result.auditTrail}`);
            } else {
                store.setError(result.auditTrail || "Không thể thực hiện hợp nhất.");
            }
        } catch (error: any) {
            store.setError(`Lỗi Merge: ${error.message}`);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [lesson.result, store]);

    return {
        handleGenerateFullPlan,
        handleExportDocx,
        handleAudit,
        handleSurgicalMerge,
        handleGenerateDeepContent,
    };
};
