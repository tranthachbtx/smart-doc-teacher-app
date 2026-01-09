import { useCallback } from 'react';
import { useAppStore } from '../store/use-app-store';
import { DocumentExportSystem } from '../services/document-export-system';

export const useLessonActions = () => {
    const store = useAppStore();
    const { lesson } = store;

    /**
     * TẠO GIÁO ÁN NHANH (BẢN NHÁP)
     * Đã đơn giản hóa tối đa, chỉ gọi AI 1 lần để lấy khung.
     */
    const handleGenerateFullPlan = useCallback(async () => {
        if (!lesson.theme) {
            store.setError("Vui lòng chọn hoặc nhập chủ đề bài học");
            return;
        }

        console.log("[useLessonActions] 🚀 Đang tạo khung giáo án (Simple Mode)");

        store.setLoading('isGenerating', true);
        store.setSuccess("🚀 Đang kết nối AI (3-Layer Relay)...");

        try {
            const { generateLesson } = await import('../actions/gemini');

            let filePayload = undefined;
            if (lesson.file) {
                filePayload = {
                    mimeType: lesson.file.mimeType,
                    data: lesson.file.data,
                    name: lesson.file.name
                };
            }

            const result = await generateLesson(
                lesson.grade,
                lesson.theme,
                lesson.duration,
                undefined,
                undefined,
                lesson.month,
                undefined,
                filePayload,
                store.selectedModel
            );

            if (result.success && result.data) {
                store.setLessonResult(result.data);
                store.setSuccess("✅ Đã tạo xong khung giáo án!");
            } else {
                store.setError(result.error || "Có lỗi xảy ra khi gọi AI.");
            }
        } catch (error: any) {
            store.setError(error.message);
        } finally {
            store.setLoading('isGenerating', false);
        }
    }, [lesson.theme, lesson.grade, lesson.duration, lesson.month, lesson.file, store]);

    /**
     * KIỂM ĐỊNH GIÁO ÁN
     */
    const handleAudit = useCallback(async () => {
        if (!lesson.result) return;
        store.setLoading('isAuditing', true);
        store.setSuccess("🔍 Đang thực hiện kiểm định chuyên sâu...");
        try {
            const { performAdvancedAudit } = await import('../actions/advanced-audit');
            const result = await performAdvancedAudit(lesson.result);
            if (result.success && result.report) {
                store.updateLessonField('auditResult', result.report.professionalReasoning);
                store.updateLessonField('auditScore', result.report.overallScore);
                store.setSuccess(`✅ Kiểm định hoàn tất! Điểm: ${result.report.overallScore}/100`);
            } else {
                store.setError(result.error || "Kiểm định không thành công");
            }
        } catch (error: any) {
            store.setError(error.message);
        } finally {
            store.setLoading('isAuditing', false);
        }
    }, [lesson.result, store]);

    /**
     * XUẤT FILE WORD 5512
     */
    const handleExportDocx = useCallback(async () => {
        if (!lesson.result) {
            store.setError("Không có dữ liệu giáo án để xuất");
            return;
        }

        store.setLoading('isExporting', true);
        store.setExportProgress(0);

        try {
            const result = await DocumentExportSystem.getInstance().exportLesson(
                lesson.result,
                { onProgress: (p) => store.setExportProgress(p) }
            );

            if (result) {
                store.setSuccess(`💾 Đã tải xuống file Word!`);
            } else {
                throw new Error("Lỗi khi xuất file");
            }
        } catch (error: any) {
            store.setError(error.message || "Lỗi xuất file");
        } finally {
            store.setLoading('isExporting', false);
            setTimeout(() => store.setSuccess(null), 5000);
        }
    }, [lesson.result, lesson.theme, store]);

    /**
     * TẠO NỘI DUNG CHUYÊN SÂU (STUB)
     */
    const handleGenerateDeepContent = useCallback(async () => {
        store.setError("Tính năng này đã được chuyển sang Manual Processing Hub để tối ưu chất lượng.");
    }, [store]);

    return {
        handleGenerateFullPlan,
        handleExportDocx,
        handleAudit,
        handleGenerateDeepContent
    };
};
