/**
 * 🌉 BACKWARD COMPATIBILITY BRIDGE
 * Chuyển hướng useLessonStore sang useAppStore để tránh lỗi build 
 * trong khi vẫn giữ cấu trúc Slice mới.
 */

import { useAppStore } from './use-app-store';

// Define the legacy state structure for better type inference
export interface LegacyLessonState {
    lessonGrade: string;
    lessonAutoFilledTheme: string;
    selectedChuDeSo: string;
    lessonDuration: string;
    lessonMonth: string;
    lessonTasks: any[];
    lessonFile: { mimeType: string; data: string; name: string } | null;
    lessonResult: any;
    isGenerating: boolean;
    isExporting: boolean;
    success: string | null;
    error: string | null;
    setLoading: (key: any, value: boolean) => void;
    setLessonGrade: (grade: string) => void;
    setLessonResult: (result: any) => void;
    setExpertGuidance: (v: string) => void;
    setStatus: (type: 'success' | 'error', msg: string | null) => void;
    // Bridge for direct state updates in tests
    result?: any;
}

// Define the hook interface to support both hook usage and static methods
export interface UseLessonStore {
    (selector?: (state: LegacyLessonState) => any): any;
    getState: () => LegacyLessonState & { resetAll: () => void };
    setState: (state: Partial<LegacyLessonState>) => void;
}

// Mock hook implementation
const useLessonStoreHook = (selector?: (state: LegacyLessonState) => any) => {
    const store = useAppStore();

    const legacyState: LegacyLessonState = {
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
        isExporting: store.isExporting,
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

    if (selector) {
        return selector(legacyState);
    }

    return legacyState;
};

// Assign static methods
(useLessonStoreHook as any).setState = (state: any) => {
    useAppStore.setState((s) => ({
        lesson: { ...s.lesson, ...state }
    }));
};

(useLessonStoreHook as any).getState = () => {
    const store = useAppStore.getState();
    const legacyState: LegacyLessonState = {
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
        isExporting: store.isExporting,
        success: store.success,
        error: store.error,
        setLoading: store.setLoading,
        setLessonGrade: store.setLessonGrade,
        setLessonResult: store.setLessonResult,
        setExpertGuidance: (v: string) => store.updateLessonField('expertGuidance', v),
        setStatus: (type: 'success' | 'error', msg: string | null) => {
            if (type === 'success') useAppStore.setState({ success: msg });
            else useAppStore.setState({ error: msg });
        }
    };

    return {
        ...legacyState,
        resetAll: () => useAppStore.setState((s) => ({
            lesson: { ...s.lesson, result: null, tasks: [], expertGuidance: '', auditResult: null, auditScore: 0 },
            error: null,
            success: null,
            generatingMode: null
        }))
    };
};

export const useLessonStore = useLessonStoreHook as unknown as UseLessonStore;
