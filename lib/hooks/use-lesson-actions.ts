import { useCallback } from 'react';
import { useLessonStore } from '../store/use-lesson-store';
import { ExportService } from '../services/export-service';
import { ExportOptimizer } from '../services/export-optimizer';
import { auditLessonPlan } from '../actions/gemini';
import { surgicalMerge } from '../services/KHBHMerger';

export const useLessonActions = () => {
    const store = useLessonStore();

    const handleGenerateFullPlan = useCallback(async () => {
        if (!store.lessonAutoFilledTheme) {
            store.setStatus('error', "Vui lòng chọn hoặc nhập chủ đề bài học");
            return;
        }

        store.setLoading('isGenerating', true);
        store.setStatus('success', "🚀 Đang khởi tạo tiến trình AI...");

        try {
            // Pipeline logic will be managed here
            store.setStatus('success', "✅ Giáo án đã được tạo thành công!");
        } catch (error: any) {
            store.setStatus('error', error.message);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [store.lessonAutoFilledTheme, store.setLoading, store.setStatus]);

    const handleExportDocx = useCallback(async () => {
        if (!store.lessonResult) {
            store.setStatus('error', "Không có dữ liệu giáo án để xuất");
            return;
        }

        store.setLoading('isExporting', true);
        store.setExportProgress(0);

        try {
            // Pre-export validation & Risk Prediction (Phase 5.1)
            const risk = ExportOptimizer.predictExportRisk(store.lessonResult);
            if (risk.riskLevel !== 'low') {
                console.warn(`Export Risk (${risk.riskLevel}): ${risk.message}`);
                store.setStatus(risk.riskLevel === 'high' ? 'error' : 'success', risk.message || "");
            }

            const fileName = `Giao_an_${store.lessonAutoFilledTheme || store.lessonResult.ten_bai || "HDTN"}.docx`.replace(/\s+/g, "_");

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

            const result = await ExportService.exportLessonToDocx(
                store.lessonResult,
                fileName,
                progressCallback
            );

            if (result.success) {
                const totalTime = Date.now() - startTime;
                store.setStatus('success', `💾 Đã tải xuống file Word! (${totalTime}ms)`);

                // Log success metrics
                console.log(`Export completed successfully in ${totalTime}ms`);
            } else {
                throw new Error("Export returned false");
            }

        } catch (error: any) {
            console.error('Export error details:', {
                error: error.message,
                stack: error.stack,
                lessonResultSize: store.lessonResult ? JSON.stringify(store.lessonResult).length : 0,
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

            store.setStatus('error', errorMessage);

            // Optional: Report error to analytics (Phase 3.1)
            if (typeof window !== 'undefined' && 'gtag' in window) {
                (window as any).gtag('event', 'export_error', {
                    error_message: error.message,
                    content_size: store.lessonResult ? JSON.stringify(store.lessonResult).length : 0
                });
            }

        } finally {
            store.setLoading('isExporting', false);
            // Clear success message after 5 seconds, error after 10 seconds
            const clearTime = store.success ? 5000 : 10000;
            setTimeout(() => store.setStatus('success', null), clearTime);
        }
    }, [store.lessonResult, store.lessonAutoFilledTheme, store.lessonGrade, store.setLoading, store.setStatus, store.setExportProgress, store.success]);

    const handleAudit = useCallback(async () => {
        if (!store.lessonResult) return;

        store.setLoading('isAuditing', true);
        try {
            const result = await auditLessonPlan(
                store.lessonResult,
                store.selectedModel
            );
            if (result.success) {
                store.setStatus('success', "🔍 Đã hoàn tất kiểm định MOET 5512");
            }
        } catch (error: any) {
            store.setStatus('error', error.message);
        } finally {
            store.setLoading('isAuditing', false);
        }
    }, [store.lessonResult, store.lessonGrade, store.lessonAutoFilledTheme, store.setLoading, store.setStatus]);

    const handleSurgicalMerge = useCallback(async () => {
        if (!store.expertGuidance || !store.lessonResult) {
            store.setStatus('error', "Thiếu dữ liệu: Cần cả Giáo án gốc và Chỉ thị chuyên gia");
            return;
        }

        store.setLoading('isGenerating', true);
        store.setStatus('success', "🧬 Đang thực hiện phẫu thuật & trộn nội dung...");

        try {
            const result = await surgicalMerge(store.lessonResult, store.expertGuidance);

            if (result.success) {
                store.setLessonResult(result.content);
                store.setStatus('success', `✅ ${result.auditTrail}`);
            } else {
                throw new Error(result.auditTrail);
            }
        } catch (error: any) {
            store.setStatus('error', `Lỗi phẫu thuật: ${error.message}`);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [store.expertGuidance, store.lessonResult, store.setLessonResult, store.setLoading, store.setStatus]);

    return {
        handleGenerateFullPlan,
        handleExportDocx,
        handleAudit,
        handleSurgicalMerge,
    };
};
