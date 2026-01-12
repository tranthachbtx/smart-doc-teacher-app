"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, CheckCircle, Sparkles } from "lucide-react";
import { useLessonStore } from "@/lib/store/use-lesson-store";
import { useLessonActions } from "@/lib/hooks/use-lesson-actions";

export const LessonActionCenter = React.memo(() => {
    const { lessonResult, lessonAutoFilledTheme, isExporting, exportProgress } = useLessonStore();
    const { handleExportDocx, handleGenerateDeepContent } = useLessonActions();
    const setStatus = useLessonStore((state) => state.setStatus);

    if (!lessonResult) return null;

    const handleCopyToClipboard = () => {
        const content = `TÃŠN BÃ€I: ${lessonResult.ten_bai || lessonAutoFilledTheme}
        \n\nMá»¤C TIÃŠU KIáº¾N THá»¨C:\n${lessonResult.muc_tieu_kien_thuc || ""}
        \n\nDIá»„N TRÃŒNH HOáº T Äá»˜NG:\n${lessonResult.hoat_dong_khoi_dong || ""}`;

        navigator.clipboard.writeText(content);
        setStatus('success', "ÄÃ£ sao chÃ©p toÃ n bá»™ ná»™i dung giÃ¡o Ã¡n!");
        setTimeout(() => setStatus('success', null), 3000);
    };

    return (
        <div className="premium-glass p-8 rounded-[3rem] border-indigo-100 shadow-2xl space-y-6">
            {isExporting && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Äang khá»Ÿi táº¡o file DOCX...</span>
                        <span className="text-[10px] font-black text-indigo-600 italic">{exportProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-indigo-50 rounded-full overflow-hidden border border-indigo-100/50">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 ease-out"
                            style={{ width: `${exportProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg text-slate-900">HoÃ n táº¥t & Kiá»ƒm tra</h4>
                        <p className="text-sm text-slate-500 font-medium">LÆ°u trá»¯ hoáº·c chia sáº» giÃ¡o Ã¡n cá»§a báº¡n</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <Button
                        variant="outline"
                        className="flex-1 md:flex-none h-14 rounded-2xl border-indigo-100 text-indigo-600 font-black px-8"
                        onClick={handleCopyToClipboard}
                        disabled={isExporting}
                    >
                        <Copy className="mr-3 h-5 w-5" />
                        COPY
                    </Button>

                    <Button
                        variant="outline"
                        className="flex-1 md:flex-none h-14 rounded-2xl border-amber-200 bg-amber-50 text-amber-700 font-black px-8 hover:bg-amber-100"
                        onClick={handleGenerateDeepContent}
                        disabled={isExporting}
                    >
                        <Sparkles className="mr-3 h-5 w-5 text-amber-500" />
                        PHASE 2: DEEP CONTENT
                    </Button>

                    <Button
                        className="flex-1 md:flex-none h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl px-8 relative overflow-hidden group"
                        onClick={handleExportDocx}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <span className="flex items-center">
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-3" />
                                PROCESSING...
                            </span>
                        ) : (
                            <>
                                <Download className="mr-3 h-5 w-5" />
                                DOWNLOAD DOCX
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
});
