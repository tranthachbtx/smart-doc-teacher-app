import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LessonResult, LessonTask } from '@/lib/types';

interface LessonState {
    // Data
    lessonResult: LessonResult | null;
    lessonGrade: string;
    selectedChuDeSo: string;
    lessonAutoFilledTheme: string;
    lessonDuration: string;
    lessonMonth: string;
    lessonTasks: LessonTask[];
    lessonFile: { mimeType: string; data: string; name: string } | null;
    expertGuidance: string;

    // UI Status
    isGenerating: boolean;
    isExporting: boolean;
    isAuditing: boolean;
    exportProgress: number;
    success: string | null;
    error: string | null;

    // Actions
    setLessonResult: (result: LessonResult | null) => void;
    updateLessonResultField: (field: keyof LessonResult, value: any) => void;
    setLessonGrade: (grade: string) => void;
    setLessonDuration: (duration: string) => void;
    setLessonTopic: (topic: string) => void;
    setLessonFile: (file: { mimeType: string; data: string; name: string } | null) => void;
    setExpertGuidance: (guidance: string) => void;
    setLoading: (key: 'isGenerating' | 'isExporting' | 'isAuditing', value: boolean) => void;
    setStatus: (type: 'success' | 'error', msg: string | null) => void;
    setExportProgress: (progress: number) => void;
    resetAll: () => void;
}

export const useLessonStore = create<LessonState>()(
    persist(
        (set) => ({
            // Initial States
            lessonResult: null,
            lessonGrade: "10",
            selectedChuDeSo: "1",
            lessonAutoFilledTheme: "",
            lessonDuration: "2 tiết",
            lessonMonth: "9",
            lessonTasks: [],
            lessonFile: null,
            expertGuidance: "",
            isGenerating: false,
            isExporting: false,
            isAuditing: false,
            exportProgress: 0,
            success: null,
            error: null,

            // Actions
            setLessonResult: (result) => set({ lessonResult: result }),
            updateLessonResultField: (field, value) => set((state) => ({
                lessonResult: state.lessonResult ? { ...state.lessonResult, [field]: value } : null
            })),
            setLessonGrade: (grade) => set({ lessonGrade: grade }),
            setLessonDuration: (duration) => set({ lessonDuration: duration }),
            setLessonTopic: (topic) => set({ lessonAutoFilledTheme: topic }),
            setLessonFile: (file) => set({ lessonFile: file }),
            setExpertGuidance: (guidance) => set({ expertGuidance: guidance }),
            setLoading: (key, value) => {
                if (key === 'isExporting' && !value) set({ exportProgress: 0 });
                set({ [key]: value });
            },
            setStatus: (type, msg) => set({ [type]: msg }),
            setExportProgress: (progress: number) => set({ exportProgress: progress }),
            resetAll: () => set({ lessonResult: null, success: null, error: null, exportProgress: 0 }),
        }),
        {
            name: 'lesson-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                lessonResult: state.lessonResult,
                lessonGrade: state.lessonGrade,
                lessonAutoFilledTheme: state.lessonAutoFilledTheme
            }), // Chỉ persist những dữ liệu quan trọng
        }
    )
);
