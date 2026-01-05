import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LessonResult, LessonTask } from '@/lib/types';

export interface ProcessingModule {
    id: string;
    title: string;
    type: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung' | 'khac';
    prompt: string;
    content: string;
    isCompleted: boolean;
}

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

    // Manual Processing State (NEW)
    manualModules: ProcessingModule[];

    // UI Status
    isGenerating: boolean;
    isExporting: boolean;
    isAuditing: boolean;
    exportProgress: number;
    success: string | null;
    error: string | null;
    selectedModel: string;

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
    setSelectedModel: (model: string) => void;

    // Manual Processing Actions (NEW)
    setManualModules: (modules: ProcessingModule[]) => void;
    updateModuleContent: (id: string, content: string) => void;
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
            manualModules: [], // Initial empty
            isGenerating: false,
            isExporting: false,
            isAuditing: false,
            exportProgress: 0,
            success: null,
            error: null,
            selectedModel: "gemini-2.0-flash",

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
            setSelectedModel: (model: string) => set({ selectedModel: model }),

            // Manual Actions
            setManualModules: (modules) => set({ manualModules: modules }),
            updateModuleContent: (id, content) => set((state) => ({
                manualModules: state.manualModules.map(m =>
                    m.id === id ? { ...m, content: content, isCompleted: !!content.trim() } : m
                )
            })),

            resetAll: () => set({ lessonResult: null, success: null, error: null, exportProgress: 0, manualModules: [] }),
        }),
        {
            name: 'lesson-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                lessonResult: state.lessonResult,
                lessonGrade: state.lessonGrade,
                lessonAutoFilledTheme: state.lessonAutoFilledTheme,
                manualModules: state.manualModules // Persist manual modules too
            }),
        }
    )
);
