"use client";

import React, { useState, memo } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Zap, Plus, ShieldCheck, Copy, Loader2 } from "lucide-react";
import { useLessonStore } from "@/lib/store/use-lesson-store";
import { onRefineSection } from "@/lib/actions/gemini"; // Chuyển logic refine sang action

interface SectionEditorItemProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    bgClass: string;
    field: string;
}

export const SectionEditorItem = memo(({
    label,
    value,
    onChange,
    bgClass,
    field
}: SectionEditorItemProps) => {
    const [isRefining, setIsRefining] = useState(false);
    const setStatus = useLessonStore((state) => state.setStatus);
    const selectedModel = useLessonStore((state) => state.lessonAutoFilledTheme); // Placeholder for model

    const handleAIAction = async (instruction: string) => {
        setIsRefining(true);
        setStatus('success', `AI đang tối ưu phần: ${label}...`);
        try {
            const result = await onRefineSection(value, instruction, "gemini-1.5-flash");
            if (result.success && result.content) {
                onChange(result.content);
                setStatus('success', "Đã cập nhật nội dung thành công!");
            }
        } catch (err: any) {
            setStatus('error', "Lỗi AI: " + err.message);
        } finally {
            setIsRefining(false);
            setTimeout(() => setStatus('success', null), 3000);
        }
    };

    return (
        <div className="group space-y-3">
            <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">
                    {label}
                </Label>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIAction("Làm cho nội dung sôi nổi và sinh động hơn")}
                        className="h-8 w-8 p-0 rounded-xl text-orange-500 hover:bg-orange-50"
                    >
                        <Zap className="h-4 w-4 fill-orange-500" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIAction("Thêm yêu cầu năng lực số cho phần này")}
                        className="h-8 w-8 p-0 rounded-xl text-indigo-500 hover:bg-indigo-50"
                    >
                        <ShieldCheck className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            navigator.clipboard.writeText(value);
                            setStatus('success', "Đã copy nội dung!");
                        }}
                        className="h-8 w-8 p-0 rounded-xl hover:bg-slate-50"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl group-hover:shadow-lg transition-all duration-500">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`min-h-[140px] ${bgClass} ${isRefining ? 'opacity-30' : ''} border-none focus:ring-2 focus:ring-indigo-100 transition-all duration-500 text-sm leading-relaxed p-5 py-4`}
                />
                {isRefining && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI Refining...</span>
                    </div>
                )}
            </div>
        </div>
    );
});

SectionEditorItem.displayName = "SectionEditorItem";
