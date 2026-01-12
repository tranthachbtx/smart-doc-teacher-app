"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    AlertCircle,
    Download,
    Sparkles,
    Loader2
} from "lucide-react";
import { useAppStore } from "@/lib/store/use-app-store";
import { useLessonActions } from "@/lib/hooks/use-lesson-actions";
import { ConfigPanel } from "./lesson/ConfigPanel";
import { ManualProcessingHub } from "../manual-workflow/ManualProcessingHub";
import { SectionEditorGrid } from "./lesson/SectionEditorGrid";
import { ExpertBrainInjection } from "./ExpertBrainInjection";
import { SmartPromptBuilder } from "./SmartPromptBuilder";
import { LessonActionCenter } from "./lesson/LessonActionCenter";
import type { LessonEngineProps } from "@/lib/types";

export const LessonTab = React.memo((props: Partial<LessonEngineProps>) => {
    // Individual selectors for fine-grained re-renders
    const lesson = useAppStore(s => s.lesson);
    const success = useAppStore(s => s.success);
    const error = useAppStore(s => s.error);
    const { grade: lessonGrade, theme: lessonAutoFilledTheme, file: lessonFile, result: lessonResult } = lesson;

    const { handleGenerateFullPlan, handleExportDocx, handleAudit } = useLessonActions();

    // Memoized derived properties
    const hasData = React.useMemo(() => !!lessonResult, [lessonResult]);
    const fileTitle = React.useMemo(() => lessonFile?.name || "N/A", [lessonFile]);

    return (
        <div className="flex flex-col gap-8 pb-32 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Configuration (BÆ°á»›c 1) */}
                <div className="lg:col-span-4 space-y-8 order-1 lg:order-1">
                    <ConfigPanel />
                    {/* Add any other config widgets here if needed */}
                </div>

                {/* Right Column: Manual Workflow (Quy trÃ¬nh Copy-Paste) */}
                <div className="lg:col-span-8 space-y-8 order-2 lg:order-2">
                    {/* Notifications */}
                    {success && (
                        <div className="premium-glass soft-pastel-mint p-4 rounded-3xl flex items-center gap-4 text-emerald-800 border-emerald-200 shadow-lg animate-in fade-in duration-500">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-bold">{success}</span>
                        </div>
                    )}
                    {error && (
                        <div className="premium-glass soft-pastel-salmon p-4 rounded-3xl flex items-center gap-4 text-red-800 border-red-200 shadow-lg animate-in fade-in duration-500">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <div className="premium-glass p-6 rounded-[2rem] border-blue-100/50 shadow-xl bg-white/60 backdrop-blur-xl">
                        <ManualProcessingHub />
                    </div>
                </div>
            </div>
        </div>
    );
});

LessonTab.displayName = "LessonTab";
