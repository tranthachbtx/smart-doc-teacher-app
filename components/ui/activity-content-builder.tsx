
"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Copy, CheckCircle, Zap } from "lucide-react";
import { ContentSection, StructuredContent } from "@/lib/services/content-structure-analyzer";
import { ContentFilter } from "@/lib/services/content-filter";
import { useToast } from "@/hooks/use-toast";

interface ActivityContentBuilderProps {
    structuredContent: StructuredContent;
    activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung';
    onContentGenerated: (content: string) => void;
}

export function ActivityContentBuilder({
    structuredContent,
    activityType,
    onContentGenerated
}: ActivityContentBuilderProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewContent, setPreviewContent] = useState<string>('');
    const { toast } = useToast();

    const getActivityLabel = (key: string) => {
        const labels: Record<string, string> = {
            khoi_dong: "Khá»Ÿi Ä‘á»™ng",
            kham_pha: "KhÃ¡m phÃ¡",
            luyen_tap: "Luyá»‡n táº­p",
            van_dung: "Váº­n dá»¥ng"
        };
        return labels[key] || key;
    };

    const generateOptimizedContent = async () => {
        setIsGenerating(true);

        try {
            // Giáº£ láº­p xá»­ lÃ½ (vÃ¬ ContentFilter lÃ  sync, nhÆ°ng cÃ³ thá»ƒ má»Ÿ rá»™ng async sau nÃ y)
            await new Promise(r => setTimeout(r, 800));

            const contentFilter = new ContentFilter();
            const filtered = contentFilter.filterContentForActivity(
                structuredContent,
                activityType,
                3000
            );

            setPreviewContent(filtered.promptContent);
            onContentGenerated(filtered.promptContent);

            toast({
                title: "Tá»‘i Æ°u thÃ nh cÃ´ng!",
                description: `ÄÃ£ chá»n ${filtered.sections.length} pháº§n ná»™i dung phÃ¹ há»£p nháº¥t cho ${getActivityLabel(activityType)}.`
            });
        } catch (error) {
            console.error('Failed to generate content:', error);
            toast({
                title: "Lá»—i tá»‘i Æ°u",
                description: "KhÃ´ng thá»ƒ trÃ­ch lá»c ná»™i dung phÃ¹ há»£p.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="border-blue-100 bg-blue-50/30 overflow-hidden">
                <CardHeader className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <CardTitle className="text-base font-bold text-blue-900">
                                AI Content Builder: {getActivityLabel(activityType)}
                            </CardTitle>
                        </div>
                        {previewContent && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                <CheckCircle className="w-3 h-3 mr-1" /> Sáºµn sÃ ng
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-slate-600">
                        Há»‡ thá»‘ng sáº½ tá»± Ä‘á»™ng lá»c cÃ¡c pháº§n dá»¯ liá»‡u cÃ³ Ä‘á»™ liÃªn quan cao nháº¥t tá»« file PDF Ä‘á»ƒ Ä‘Æ°a vÃ o Prompt cho hoáº¡t Ä‘á»™ng nÃ y.
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                        onClick={generateOptimizedContent}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Äang trÃ­ch lá»c dá»¯ liá»‡u...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Tá»± Ä‘á»™ng tá»‘i Æ°u Prompt Ngá»¯ cáº£nh
                            </>
                        )}
                    </Button>

                    {previewContent && (
                        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Báº¢N TINH Lá»ŒC (Cáº®M VÃ€O PROMPT):</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] text-blue-600 hover:bg-blue-50"
                                    onClick={() => {
                                        navigator.clipboard.writeText(previewContent);
                                        toast({ description: "ÄÃ£ sao chÃ©p ná»™i dung tinh lá»c!" });
                                    }}
                                >
                                    <Copy className="w-3 h-3 mr-1" /> Sao chÃ©p
                                </Button>
                            </div>
                            <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-slate-300 leading-relaxed max-h-[150px] overflow-y-auto border border-slate-800">
                                {previewContent}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
