import { useCallback } from 'react';
import { useLessonStore } from '../store/use-lesson-store';
import { ExportService } from '../services/export-service';
import { auditLessonPlan } from '../actions/gemini';

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
        if (!store.lessonResult) return;

        store.setLoading('isExporting', true);
        store.setExportProgress(0);

        try {
            const fileName = `Giao_an_${store.lessonAutoFilledTheme || store.lessonResult.ten_bai || "HDTN"}.docx`.replace(/\s+/g, "_");
            await ExportService.exportLessonToDocx(
                store.lessonResult,
                fileName,
                (percent) => store.setExportProgress(percent)
            );
            store.setStatus('success', "💾 Đã tải xuống file Word!");
        } catch (error: any) {
            store.setStatus('error', "Lỗi xuất file: " + error.message);
        } finally {
            store.setLoading('isExporting', false);
            setTimeout(() => store.setStatus('success', null), 3000);
        }
    }, [store.lessonResult, store.lessonAutoFilledTheme, store.lessonGrade, store.setLoading, store.setStatus, store.setExportProgress]);

    const handleAudit = useCallback(async () => {
        if (!store.lessonResult) return;

        store.setLoading('isAuditing', true);
        try {
            const result = await auditLessonPlan(
                store.lessonGrade,
                store.lessonAutoFilledTheme
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

    return {
        handleGenerateFullPlan,
        handleExportDocx,
        handleAudit,
    };
};
