
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
            khoi_dong: "Khởi động",
            kham_pha: "Khám phá",
            luyen_tap: "Luyện tập",
            van_dung: "Vận dụng"
        };
        return labels[key] || key;
    };

    const generateOptimizedContent = async () => {
        setIsGenerating(true);

        try {
            // Giả lập xử lý (vì ContentFilter là sync, nhưng có thể mở rộng async sau này)
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
                title: "Tối ưu thành công!",
                description: `Đã chọn ${filtered.sections.length} phần nội dung phù hợp nhất cho ${getActivityLabel(activityType)}.`
            });
        } catch (error) {
            console.error('Failed to generate content:', error);
            toast({
                title: "Lỗi tối ưu",
                description: "Không thể trích lọc nội dung phù hợp.",
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
                                <CheckCircle className="w-3 h-3 mr-1" /> Sẵn sàng
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-slate-600">
                        Hệ thống sẽ tự động lọc các phần dữ liệu có độ liên quan cao nhất từ file PDF để đưa vào Prompt cho hoạt động này.
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-md"
                        onClick={generateOptimizedContent}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang trích lọc dữ liệu...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Tự động tối ưu Prompt Ngữ cảnh
                            </>
                        )}
                    </Button>

                    {previewContent && (
                        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">BẢN TINH LỌC (CẮM VÀO PROMPT):</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] text-blue-600 hover:bg-blue-50"
                                    onClick={() => {
                                        navigator.clipboard.writeText(previewContent);
                                        toast({ description: "Đã sao chép nội dung tinh lọc!" });
                                    }}
                                >
                                    <Copy className="w-3 h-3 mr-1" /> Sao chép
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
