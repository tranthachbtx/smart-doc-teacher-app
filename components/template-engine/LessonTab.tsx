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
import { useLessonStore } from "@/lib/store/use-lesson-store";
import { useLessonActions } from "@/lib/hooks/use-lesson-actions";
import { ConfigPanel } from "./lesson/ConfigPanel";
import { SectionEditorGrid } from "./lesson/SectionEditorGrid";
import { ExpertBrainInjection } from "./ExpertBrainInjection";
import { SmartPromptBuilder } from "./SmartPromptBuilder";
import { LessonActionCenter } from "./lesson/LessonActionCenter"; // Chúng ta sẽ tạo component này

export const LessonTab = React.memo(() => {
    // Individual selectors for fine-grained re-renders
    const lessonGrade = useLessonStore(s => s.lessonGrade);
    const lessonAutoFilledTheme = useLessonStore(s => s.lessonAutoFilledTheme);
    const selectedChuDeSo = useLessonStore(s => s.selectedChuDeSo);
    const lessonFile = useLessonStore(s => s.lessonFile);
    const lessonResult = useLessonStore(s => s.lessonResult);
    const expertGuidance = useLessonStore(s => s.expertGuidance);
    const setExpertGuidance = useLessonStore(s => s.setExpertGuidance);
    const isGenerating = useLessonStore(s => s.isGenerating);
    const success = useLessonStore(s => s.success);
    const error = useLessonStore(s => s.error);

    const { handleGenerateFullPlan, handleExportDocx, handleAudit } = useLessonActions();

    // Memoized derived properties
    const hasData = React.useMemo(() => !!lessonResult, [lessonResult]);
    const fileTitle = React.useMemo(() => lessonFile?.name || "N/A", [lessonFile]);

    return (
        <div className="flex flex-col gap-8 pb-32 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Configuration */}
                <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
                    <ConfigPanel />

                    <div className="space-y-4">
                        <div className="px-2">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">Bước 2: Nhập kết quả</h3>
                            <p className="text-[10px] text-slate-500 font-medium italic">Dán JSON từ Gemini Pro vào đây để điền giáo án nhanh</p>
                        </div>
                        <ExpertBrainInjection
                            value={expertGuidance}
                            onChange={setExpertGuidance}
                            onApply={() => {/* Logic apply sẽ được chuyển qua hook sau */ }}
                            topic={lessonAutoFilledTheme}
                            grade={lessonGrade}
                            isProcessing={isGenerating}
                        />
                    </div>
                </div>

                {/* Right Column: Content Generation & Review */}
                <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
                    <div className="space-y-6">
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

                        {/* Smart Prompt Builder */}
                        {lessonGrade && lessonAutoFilledTheme && (
                            <SmartPromptBuilder
                                grade={lessonGrade}
                                topicName={lessonAutoFilledTheme}
                                chuDeSo={selectedChuDeSo}
                                fileSummary={fileTitle}
                            />
                        )}

                        {/* Main Editor Section */}
                        {hasData ? (
                            <div className="space-y-10">
                                <div className="premium-glass p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border-emerald-200 shadow-2xl">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xl">
                                            <CheckCircle className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl text-slate-800">Bản thảo MOET 5512</h3>
                                            <p className="text-xs text-emerald-700 font-medium">Giáo án đã sẵn sàng để xuất file</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <Button variant="outline" className="flex-1 rounded-2xl border-emerald-200" onClick={handleAudit}>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Audit AI
                                        </Button>
                                        <Button className="flex-1 rounded-2xl bg-emerald-600 text-white" onClick={handleExportDocx}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Xuất File
                                        </Button>
                                    </div>
                                </div>

                                <SectionEditorGrid />
                                <LessonActionCenter />
                            </div>
                        ) : (
                            <div className="h-[400px] flex flex-col items-center justify-center premium-neumo rounded-[3rem] border-dashed border-2 border-slate-200 opacity-60">
                                <Loader2 className="h-12 w-12 text-slate-300 animate-spin mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa có dữ liệu bài dạy</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

LessonTab.displayName = "LessonTab";
