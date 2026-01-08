/**
 * 🌉 BACKWARD COMPATIBILITY BRIDGE
 * Chuyển hướng useLessonStore sang useAppStore để tránh lỗi build 
 * trong khi vẫn giữ cấu trúc Slice mới.
 */

import { useAppStore } from './use-app-store';

// Mock hook that behaves like the old one but uses the new store
export const useLessonStore: any = (selector?: (state: any) => any) => {
    const store = useAppStore();

    // Nếu có selector, chúng ta cần giả lập cấu trúc cũ
    if (selector) {
        const legacyState = {
            ...store.lesson,
            lessonGrade: store.lesson.grade,
            lessonAutoFilledTheme: store.lesson.theme,
            selectedChuDeSo: store.lesson.chuDeSo,
            lessonDuration: store.lesson.duration,
            lessonMonth: store.lesson.month,
            lessonTasks: store.lesson.tasks,
            lessonFile: store.lesson.file,
            lessonResult: store.lesson.result,
            isGenerating: store.generatingMode === 'lesson',
            success: store.success,
            error: store.error,
            setLoading: store.setLoading,
            setLessonGrade: store.setLessonGrade,
            setLessonResult: store.setLessonResult,
            setExpertGuidance: (v: string) => store.updateLessonField('expertGuidance', v),
            setStatus: (type: 'success' | 'error', msg: string | null) => {
                if (type === 'success') store.setSuccess(msg);
                else store.setError(msg);
            }
        };
        return selector(legacyState);
    }

    return store;
};

// Map setState for emergency direct access
(useLessonStore as any).setState = (state: any) => {
    useAppStore.setState((s) => ({
        lesson: { ...s.lesson, ...state }
    }));
};

// Map getState for unit tests
(useLessonStore as any).getState = () => {
    const store = useAppStore.getState();
    return {
        ...store.lesson,
        lessonGrade: store.lesson.grade,
        lessonResult: store.lesson.result,
        isGenerating: store.generatingMode === 'lesson',
        success: store.success,
        error: store.error,
        isExporting: store.isExporting,
        setLoading: store.setLoading,
        setLessonGrade: store.setLessonGrade,
        setLessonResult: store.setLessonResult,
        setStatus: (type: 'success' | 'error', msg: string | null) => {
            if (type === 'success') useAppStore.setState({ success: msg });
            else useAppStore.setState({ error: msg });
        },
        resetAll: () => useAppStore.setState((s) => ({
            lesson: { ...s.lesson, result: null, tasks: [], expertGuidance: '', auditResult: null, auditScore: 0 },
            error: null,
            success: null,
            generatingMode: null
        }))
    };
};
