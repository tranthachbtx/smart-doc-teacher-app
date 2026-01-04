"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Sparkles,
    Copy,
    CheckCircle2,
    FileText,
    Zap,
    BrainCircuit,
    ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExpertBrainInjectionProps {
    value: string;
    onChange: (val: string) => void;
    onApply?: () => void;
    fileSummary?: string;
    topic: string;
    grade: string;
    isProcessing?: boolean;
}

export function ExpertBrainInjection({
    value,
    onChange,
    onApply,
    fileSummary,
    topic,
    grade,
    isProcessing
}: ExpertBrainInjectionProps) {
    const [copied, setCopied] = React.useState(false);

    const generateExternalPrompt = () => {
        const { SURGICAL_UPGRADE_PROMPT } = require("@/lib/prompts/ai-prompts");
        const prompt = SURGICAL_UPGRADE_PROMPT(fileSummary || "Chưa có file summary. Hãy dựa vào chủ đề để gợi ý.", topic);

        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const hasStructuredContent = value.includes("-") || value.includes("1.") || value.length > 100;

    return (
        <div className="premium-neumo p-6 space-y-6 soft-pastel-salmon/10 border-amber-100/30 overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200/20 blur-3xl rounded-full"></div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 premium-glass">
                        <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                        <Label className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-none">Expert Brain Injection</Label>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">Cấy não Gemini Pro</h4>
                    </div>
                </div>
                {hasStructuredContent && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold animate-pulse">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Ready
                    </Badge>
                )}
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-white/60 rounded-2xl border border-amber-100/50 backdrop-blur-sm space-y-3">
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        "Bước này cực kỳ quan trọng: Hãy copy prompt bên dưới, dán vào Gemini Pro (bên ngoài) để nhận phân tích chuyên sâu về giáo án cũ của bạn, sau đó dán kết quả vào ô bên dưới."
                    </p>
                    <Button
                        onClick={generateExternalPrompt}
                        variant="outline"
                        size="sm"
                        className="w-full h-11 rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50 font-bold gap-2 group transition-all"
                    >
                        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />}
                        {copied ? "ĐÃ COPY PROMPT" : "COPY PROMPT CHO GEMINI PRO"}
                    </Button>
                </div>

                <div className="relative group">
                    <Textarea
                        placeholder="Dán nội dung phân tích từ Gemini Pro vào đây..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-h-[160px] premium-neumo-inset border-none px-5 py-4 text-xs leading-relaxed focus:ring-2 focus:ring-amber-200/50 transition-all bg-white/40"
                    />
                    {!value && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 transition-opacity group-hover:opacity-10">
                            <Zap className="h-12 w-12 text-amber-500" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={onApply}
                        disabled={!hasStructuredContent || isProcessing}
                        className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-xl shadow-amber-200 gap-3 group overflow-hidden relative"
                    >
                        <Zap className={`h-5 w-5 ${isProcessing ? 'animate-bounce' : 'group-hover:scale-125 transition-transform'}`} />
                        <span>{isProcessing ? "ĐANG PHẪU THUẬT..." : "PHẪU THUẬT & TRỘN NỘI DUNG"}</span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />

                        {isProcessing && (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-400 animate-pulse"></div>
                        )}
                    </Button>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium px-2 justify-center">
                        <Sparkles className="h-3 w-3" />
                        <span>AI sẽ dùng các chỉ thị này làm "Kim chỉ nam" để phẫu thuật giáo án cũ.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
