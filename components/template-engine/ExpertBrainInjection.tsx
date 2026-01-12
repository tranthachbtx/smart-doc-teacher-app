"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Sparkles,
    CheckCircle2,
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
    isProcessing
}: ExpertBrainInjectionProps) {

    // Check if content looks like JSON or structured text
    const hasStructuredContent = value.includes("{") || value.includes("cot_1");

    return (
        <div className="premium-neumo p-6 space-y-6 soft-pastel-salmon/10 border-amber-100/30 overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200/20 blur-3xl rounded-full"></div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 premium-glass">
                        <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                        <Label className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-none">AI Result Injection</Label>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">DÃ¡n káº¿t quáº£ Gemini</h4>
                    </div>
                </div>
                {hasStructuredContent && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold animate-pulse">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Ready to Parse
                    </Badge>
                )}
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-white/60 rounded-2xl border border-amber-100/50 backdrop-blur-sm space-y-3">
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                        "Sau khi Gemini tráº£ vá» káº¿t quáº£ JSON, hÃ£y sao chÃ©p toÃ n bá»™ vÃ  dÃ¡n vÃ o Ã´ dÆ°á»›i Ä‘Ã¢y. Há»‡ thá»‘ng sáº½ tá»± Ä‘á»™ng phÃ¢n tÃ­ch vÃ  Ä‘iá»n vÃ o cÃ¡c má»¥c bÃ i dáº¡y."
                    </p>
                </div>

                <div className="relative group">
                    <Textarea
                        placeholder='DÃ¡n káº¿t quáº£ JSON vÃ o Ä‘Ã¢y... (VÃ­ dá»¥: { "title": "...", "activities": [...] })'
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-h-[160px] premium-neumo-inset border-none px-5 py-4 text-xs leading-relaxed focus:ring-2 focus:ring-amber-200/50 transition-all bg-white/40 font-mono"
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
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black shadow-xl shadow-rose-200 gap-3 group overflow-hidden relative"
                    >
                        <Zap className={`h-5 w-5 ${isProcessing ? 'animate-bounce' : 'group-hover:scale-125 transition-transform'}`} />
                        <span>{isProcessing ? "ÄANG PHáºªU THUáº¬T..." : "PHáºªU THUáº¬T & TRá»˜N Ná»˜I DUNG"}</span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-50 group-hover:translate-x-1 transition-transform" />

                        {isProcessing && (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30 animate-pulse"></div>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
