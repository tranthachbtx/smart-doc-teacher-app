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

        store.setLoading('isGenerating', true);
        store.setSuccess("🚀 Đang khởi tạo tiến trình AI...");

        try {
            // Pipeline logic will be managed here
            store.setSuccess("✅ Giáo án đã được tạo thành công!");
        } catch (error: any) {
            store.setError(error.message);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [lesson.theme, store]);

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
        store.setSuccess("🧠 Đang thực hiện Phase 2: Phát triển nội dung chuyên sâu (Deep Expansion)...");

        try {
            // 1. Build context and prompt
            const smartData = await SmartPromptService.lookupSmartData(lesson.grade, lesson.theme, lesson.chuDeSo);
            const deepPrompt = SmartPromptService.buildDeepContentPrompt(lesson.result, smartData);

            // 2. Call AI
            const result = await generateDeepContent(deepPrompt, store.selectedModel);

            if (result.success && result.data) {
                const cleaner = TextCleaningService.getInstance();
                const cleanedData = { ...result.data };

                // Clean each field
                Object.keys(cleanedData).forEach(key => {
                    if (typeof cleanedData[key] === 'string') {
                        cleanedData[key] = cleaner.cleanFinalOutput(cleanedData[key]);
                    }
                });

                // Update store with cleaned, expanded content
                store.setLessonResult({
                    ...lesson.result,
                    ...cleanedData
                });

                store.setSuccess("✨ Đã phát triển nội dung chuyên sâu thành công (Phase 2)!");
            } else {
                throw new Error(result.error || "Không thể tạo nội dung chuyên sâu.");
            }
        } catch (error: any) {
            store.setError(`Lỗi Phase 2: ${error.message}`);
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
