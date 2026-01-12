/**
 * ðŸŒ‰ BACKWARD COMPATIBILITY BRIDGE
 * Chuyá»ƒn hÆ°á»›ng useLessonStore sang useAppStore Ä‘á»ƒ trÃ¡nh lá»—i build 
 * trong khi váº«n giá»¯ cáº¥u trÃºc Slice má»›i.
 */

import { useAppStore } from './use-app-store';

// Define the legacy state structure for better type inference
export interface LegacyLessonState {
    lessonGrade: string;
    lessonAutoFilledTheme: string;
    lessonTopic: string;
    selectedChuDeSo: string;
    lessonDuration: string;
    lessonMonth: string;
    lessonTasks: any[];
    lessonFile: { mimeType: string; data: string; name: string } | null;
    lessonResult: any;
    isGenerating: boolean;
    isExporting: boolean;
    exportProgress: number;
    success: string | null;
    error: string | null;
    setLoading: (key: any, value: boolean) => void;
    setLessonGrade: (grade: string) => void;
    setLessonResult: (result: any) => void;
    setExpertGuidance: (v: string) => void;
    setStatus: (type: 'success' | 'error', msg: string | null) => void;
    updateLessonResultField: (field: string, value: any) => void;
    setLessonTopic: (v: string) => void;
    setLessonMonth: (v: string) => void;
    setLessonDuration: (v: string) => void;
    setSelectedChuDeSo: (v: string) => void;
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
        lessonTopic: store.lesson.theme,
        selectedChuDeSo: store.lesson.chuDeSo,
        lessonDuration: store.lesson.duration,
        lessonMonth: store.lesson.month,
        lessonTasks: store.lesson.tasks,
        lessonFile: store.lesson.file,
        lessonResult: store.lesson.result,
        isGenerating: store.generatingMode === 'lesson',
        isExporting: store.isExporting,
        exportProgress: store.exportProgress,
        success: store.success,
        error: store.error,
        setLoading: store.setLoading,
        setLessonGrade: store.setLessonGrade,
        setLessonResult: store.setLessonResult,
        setExpertGuidance: (v: string) => store.updateLessonField('expertGuidance', v),
        setStatus: (type: 'success' | 'error', msg: string | null) => {
            if (type === 'success') store.setSuccess(msg);
            else store.setError(msg);
        },
        updateLessonResultField: (field: string, value: any) => {
            const currentResult = store.lesson.result || {};
            store.updateLessonField('result', { ...currentResult, [field]: value });
        },
        setLessonTopic: (v: string) => store.updateLessonField('theme', v),
        setLessonMonth: (v: string) => store.updateLessonField('month', v),
        setLessonDuration: (v: string) => store.updateLessonField('duration', v),
        setSelectedChuDeSo: (v: string) => store.updateLessonField('chuDeSo', v)
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
        lessonTopic: store.lesson.theme,
        selectedChuDeSo: store.lesson.chuDeSo,
        lessonDuration: store.lesson.duration,
        lessonMonth: store.lesson.month,
        lessonTasks: store.lesson.tasks,
        lessonFile: store.lesson.file,
        lessonResult: store.lesson.result,
        isGenerating: store.generatingMode === 'lesson',
        isExporting: store.isExporting,
        exportProgress: store.exportProgress,
        success: store.success,
        error: store.error,
        setLoading: store.setLoading,
        setLessonGrade: store.setLessonGrade,
        setLessonResult: store.setLessonResult,
        setExpertGuidance: (v: string) => store.updateLessonField('expertGuidance', v),
        setStatus: (type: 'success' | 'error', msg: string | null) => {
            if (type === 'success') useAppStore.setState({ success: msg });
            else useAppStore.setState({ error: msg });
        },
        updateLessonResultField: (field: string, value: any) => {
            const currentResult = store.lesson.result || {};
            useAppStore.getState().updateLessonField('result', { ...currentResult, [field]: value });
        },
        setLessonTopic: (v: string) => useAppStore.getState().updateLessonField('theme', v),
        setLessonMonth: (v: string) => useAppStore.getState().updateLessonField('month', v),
        setLessonDuration: (v: string) => useAppStore.getState().updateLessonField('duration', v),
        setSelectedChuDeSo: (v: string) => useAppStore.getState().updateLessonField('chuDeSo', v)
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
