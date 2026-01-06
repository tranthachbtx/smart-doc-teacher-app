
"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, FileText, Target, Lightbulb, ClipboardCheck, Settings, Search } from "lucide-react";
import { StructuredContent, ContentSection } from "@/lib/services/content-structure-analyzer";

interface StructuredContentViewerProps {
    structuredContent: StructuredContent;
    onSectionSelect?: (section: ContentSection, activity: string) => void;
    selectedActivity?: string;
}

const TYPE_CONFIG: Record<string, { label: string, icon: any, variant: "default" | "secondary" | "outline" | "destructive" }> = {
    objective: { label: "Mục tiêu", icon: Target, variant: "default" },
    activity: { label: "Hoạt động", icon: ClipboardCheck, variant: "secondary" },
    knowledge: { label: "Kiến thức", icon: Lightbulb, variant: "outline" },
    assessment: { label: "Đánh giá", icon: Search, variant: "destructive" },
    resource: { label: "Học liệu", icon: Settings, variant: "outline" },
};

export function StructuredContentViewer({
    structuredContent,
    onSectionSelect,
    selectedActivity
}: StructuredContentViewerProps) {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [filterType, setFilterType] = useState<string>('all');

    const filteredSections = useMemo(() => {
        if (filterType === 'all') return structuredContent.sections;
        return structuredContent.sections.filter(section => section.type === filterType);
    }, [structuredContent, filterType]);

    const toggleSection = (sectionId: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId);
        } else {
            newExpanded.add(sectionId);
        }
        setExpandedSections(newExpanded);
    };

    const getActivityLabel = (key: string) => {
        const labels: Record<string, string> = {
            khoi_dong: "Khởi động",
            kham_pha: "Khám phá",
            luyen_tap: "Luyện tập",
            van_dung: "Vận dụng"
        };
        return labels[key] || key;
    };

    return (
        <div className="space-y-6">
            {/* Header with filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Nội dung đã cấu trúc hóa
                    </h3>
                    <p className="text-sm text-slate-500">Tìm thấy {structuredContent.sections.length} phần nội dung có ý nghĩa.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="text-xs h-7"
                    >
                        Tất cả
                    </Button>
                    {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                        <Button
                            key={type}
                            variant={filterType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterType(type)}
                            className="text-xs h-7"
                        >
                            {config.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content sections */}
            <div className="space-y-3">
                {filteredSections.map(section => {
                    const Config = TYPE_CONFIG[section.type] || { label: section.type, icon: FileText, variant: "outline" };
                    const Icon = Config.icon;
                    const isExpanded = expandedSections.has(section.id);

                    return (
                        <Card key={section.id} className={`overflow-hidden transition-all border ${isExpanded ? 'ring-1 ring-blue-100' : 'hover:border-blue-200'}`}>
                            <CardHeader
                                className="cursor-pointer py-3 px-4 select-none hover:bg-slate-50/50"
                                onClick={() => toggleSection(section.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={Config.variant} className="text-[10px] px-1.5 py-0">
                                                    {Config.label}
                                                </Badge>
                                                <h4 className="font-semibold text-sm text-slate-700 truncate">{section.title}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] font-medium text-slate-400">
                                            {section.metadata.wordCount} chữ
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            {isExpanded && (
                                <CardContent className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                                    {/* Relevance scores */}
                                    <div className="mb-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                            Độ liên quan gợi ý:
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {Object.entries(section.relevance).map(([activity, score]) => (
                                                <div key={activity} className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 truncate">
                                                        {getActivityLabel(activity)}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${score > 70 ? 'bg-green-500' : score > 40 ? 'bg-blue-400' : 'bg-slate-300'}`}
                                                                style={{ width: `${score}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-[10px] font-bold ${score > 70 ? 'text-green-600' : 'text-slate-600'}`}>
                                                            {score}%
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="bg-white p-3 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {section.content}
                                    </div>

                                    {/* Actions */}
                                    {onSectionSelect && (
                                        <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap gap-2">
                                            {Object.keys(section.relevance).map((act) => (
                                                <Button
                                                    key={act}
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`text-[10px] h-7 px-2 ${section.relevance[act as keyof typeof section.relevance] > 60 ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : 'text-slate-400'}`}
                                                    onClick={() => onSectionSelect(section, act)}
                                                >
                                                    + {getActivityLabel(act)} ({section.relevance[act as keyof typeof section.relevance]}%)
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
