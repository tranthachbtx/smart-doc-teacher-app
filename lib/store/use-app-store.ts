import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
    LessonResult,
    LessonTask,
    MeetingResult,
    EventResult,
    NCBHResult,
    AssessmentResult,
    TemplateData
} from '@/lib/types';

export interface ProcessingModule {
    id: string;
    title: string;
    type: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung' | 'khac' | 'shdc' | 'shl' | 'setup' | 'appendix';
    prompt: string;
    content: string;
    isCompleted: boolean;
}

interface AppState {
    // Global UI Status
    generatingMode: string | null;
    isGenerating: boolean;
    isExporting: boolean;
    isAuditing: boolean;
    exportProgress: number;
    success: string | null;
    error: string | null;
    selectedModel: string;

    // Lesson Slice
    lesson: {
        result: LessonResult | null;
        grade: string;
        chuDeSo: string;
        theme: string;
        duration: string;
        month: string;
        tasks: LessonTask[];
        file: { mimeType: string; data: string; name: string } | null;
        expertGuidance: string;
        manualModules: ProcessingModule[];
        shdcSuggestion: string;
        hdgdSuggestion: string;
        shlSuggestion: string;
        customInstructions: string;
        auditResult: string | null;
        auditScore: number;
        auditAnalysis: any | null; // Detailed AI Audit (Strengths/Weaknesses)
        executionPlan: any[] | null; // Segmented phases for long-form content
        processedContext: any | null; // Cache for analyzed PDF structure
        fileSummary: string;
    };

    // Meeting Slice
    meeting: {
        month: string;
        session: string;
        keyContent: string;
        conclusion: string;
        result: MeetingResult | null;
    };

    // Event Slice
    event: {
        grade: string;
        month: string;
        theme: string;
        budget: string;
        checklist: string;
        instructions: string;
        result: EventResult | null;
    };

    // Assessment Slice
    assessment: {
        grade: string;
        term: string;
        productType: string;
        topic: string;
        template: TemplateData | null;
        result: AssessmentResult | null;
    };

    // NCBH Slice
    ncbh: {
        grade: string;
        month: string;
        topic: string;
        instructions: string;
        result: NCBHResult | null;
    };

    // Actions
    setLoading: (key: 'isExporting' | 'isAuditing' | 'isGenerating', value: boolean) => void;
    setGeneratingMode: (mode: string | null) => void;
    setSuccess: (msg: string | null) => void;
    setError: (msg: string | null) => void;
    setExportProgress: (progress: number) => void;
    setSelectedModel: (model: string) => void;

    // Lesson Actions
    setLessonGrade: (grade: string) => void;
    setLessonTheme: (theme: string) => void;
    setLessonResult: (result: LessonResult | null) => void;
    updateLessonField: (field: keyof AppState['lesson'], value: any) => void;
    resetLesson: () => void;

    // Meeting Actions
    updateMeetingField: (field: keyof AppState['meeting'], value: any) => void;

    // Event Actions
    updateEventField: (field: keyof AppState['event'], value: any) => void;

    // Assessment Actions
    updateAssessmentField: (field: keyof AppState['assessment'], value: any) => void;

    // NCBH Actions
    updateNcbhField: (field: keyof AppState['ncbh'], value: any) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial Global States
            generatingMode: null,
            isGenerating: false,
            isExporting: false,
            isAuditing: false,
            exportProgress: 0,
            success: null,
            error: null,
            selectedModel: "gemini-2.0-flash",

            // Initial Lesson State
            lesson: {
                result: null,
                grade: "10",
                chuDeSo: "1",
                theme: "",
                duration: "2 tiết",
                month: "9",
                tasks: [],
                file: null,
                expertGuidance: "",
                manualModules: [],
                shdcSuggestion: "",
                hdgdSuggestion: "",
                shlSuggestion: "",
                customInstructions: "",
                auditResult: null,
                auditScore: 0,
                auditAnalysis: null,
                executionPlan: null,
                processedContext: null,
                fileSummary: "",
            },

            // Initial Meeting State
            meeting: {
                month: "9",
                session: "1",
                keyContent: "",
                conclusion: "",
                result: null,
            },

            // Initial Event State
            event: {
                grade: "10",
                month: "9",
                theme: "",
                budget: "",
                checklist: "",
                instructions: "",
                result: null,
            },

            // Initial Assessment State
            assessment: {
                grade: "10",
                term: "Học kỳ 1",
                productType: "Bài kiểm tra viết",
                topic: "",
                template: null,
                result: null,
            },

            // Initial NCBH State
            ncbh: {
                grade: "10",
                month: "9",
                topic: "",
                instructions: "",
                result: null,
            },

            // Global Actions
            setLoading: (key, value) => set({ [key]: value }),
            setGeneratingMode: (mode) => set({ generatingMode: mode }),
            setSuccess: (msg) => set({ success: msg }),
            setError: (msg) => set({ error: msg }),
            setExportProgress: (progress) => set({ exportProgress: progress }),
            setSelectedModel: (model) => set({ selectedModel: model }),

            // Lesson Actions
            setLessonGrade: (grade) => set((s) => ({ lesson: { ...s.lesson, grade } })),
            setLessonTheme: (theme) => set((s) => ({ lesson: { ...s.lesson, theme } })),
            setLessonResult: (result) => set((s) => ({ lesson: { ...s.lesson, result } })),
            updateLessonField: (field, value) => set((s) => ({
                lesson: { ...s.lesson, [field]: value }
            })),
            resetLesson: () => set((s) => ({
                lesson: { ...s.lesson, result: null, manualModules: [], auditResult: null, auditScore: 0, processedContext: null }
            })),

            // Meeting Actions
            updateMeetingField: (field, value) => set((s) => ({
                meeting: { ...s.meeting, [field]: value }
            })),

            // Event Actions
            updateEventField: (field, value) => set((s) => ({
                event: { ...s.event, [field]: value }
            })),

            // Assessment Actions
            updateAssessmentField: (field, value) => set((s) => ({
                assessment: { ...s.assessment, [field]: value }
            })),

            // NCBH Actions
            updateNcbhField: (field, value) => set((s) => ({
                ncbh: { ...s.ncbh, [field]: value }
            })),
        }),
        {
            name: 'smart-doc-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                ...state,
                lesson: {
                    ...state.lesson,
                    file: null, // DO NOT PERSIST LARGE FILE TO DISK
                    result: state.lesson.result,
                    manualModules: state.lesson.manualModules
                }
            })
        }
    )
);
