
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Target,
    ClipboardCheck,
    BookOpen,
    Lightbulb,
    AlertTriangle,
    Eye,
    FileText
} from 'lucide-react';

interface PreviewProps {
    result: any;
}

export function LessonResultPreview({ result }: PreviewProps) {
    if (!result) return (
        <div className="p-12 text-center text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>ChÆ°a cÃ³ dá»¯ liá»‡u Ä‘á»ƒ hiá»ƒn thá»‹ X-RAY Preview.</p>
        </div>
    );

    const decodeForPreview = (text: string) => {
        if (!text) return "";
        try {
            // Use the professional cleaner to strip meta-tags and system headers
            const { TextCleaningService } = require('@/lib/services/text-cleaning-service');
            const cleaner = TextCleaningService.getInstance();
            return cleaner.cleanFinalOutput(text);
        } catch (e) {
            // Fallback to simple replace if service is not available (should not happen on client)
            return text.replace(/\|\|LINE_BREAK\|\|/g, "\n");
        }
    };

    const renderActivityTable = (title: string, content1: string, content2: string) => {
        if (!content1 && !content2) return null;

        return (
            <div className="space-y-3 mb-8">
                <h4 className="font-black text-indigo-900 flex items-center gap-2 text-sm uppercase">
                    <ClipboardCheck className="w-4 h-4" /> {title}
                </h4>
                <div className="border rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="w-1/2 p-3 text-left text-[10px] font-black text-slate-500 uppercase">Hoáº¡t Ä‘á»™ng cá»§a GV</th>
                                <th className="w-1/2 p-3 text-left text-[10px] font-black text-slate-500 uppercase">Hoáº¡t Ä‘á»™ng cá»§a HS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="divide-x">
                                <td className="p-4 text-xs leading-relaxed whitespace-pre-wrap align-top">
                                    {decodeForPreview(content1) || <span className="text-rose-300 italic">Thiáº¿u dá»¯ liá»‡u GV</span>}
                                </td>
                                <td className="p-4 text-xs leading-relaxed whitespace-pre-wrap align-top">
                                    {decodeForPreview(content2) || <span className="text-rose-300 italic">Thiáº¿u dá»¯ liá»‡u HS</span>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-8 p-1">
                {/* 1. TINH HOA METADATA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="rounded-3xl border-slate-100 bg-slate-50/50 shadow-none">
                        <CardHeader className="py-4">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                                <Target className="w-4 h-4" /> Má»¥c tiÃªu kiáº¿n thá»©c
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs leading-relaxed">
                            {decodeForPreview(result.muc_tieu_kien_thuc) || "..."}
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-slate-100 bg-slate-50/50 shadow-none">
                        <CardHeader className="py-4">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> NÄƒng lá»±c & Pháº©m cháº¥t
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs leading-relaxed space-y-2">
                            <p><b>NÄƒng lá»±c:</b> {decodeForPreview(result.muc_tieu_nang_luc) || "..."}</p>
                            <p><b>Pháº©m cháº¥t:</b> {decodeForPreview(result.muc_tieu_pham_chat) || "..."}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. CHUá»–I HOáº T Äá»˜NG ( Chuáº©n 5512 ) */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-indigo-600">Arch 34.0</Badge>
                        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Cáº¥u trÃºc 2 cá»™t X-RAY</h3>
                    </div>

                    {renderActivityTable("HÄ 1: KHá»žI Äá»˜NG", result.hoat_dong_khoi_dong_cot_1, result.hoat_dong_khoi_dong_cot_2)}
                    {renderActivityTable("HÄ 2: KHÃM PHÃ", result.hoat_dong_kham_pha_cot_1, result.hoat_dong_kham_pha_cot_2)}
                    {renderActivityTable("HÄ 3: LUYá»†N Táº¬P", result.hoat_dong_luyen_tap_cot_1, result.hoat_dong_luyen_tap_cot_2)}
                    {renderActivityTable("HÄ 4: Váº¬N Dá»¤NG", result.hoat_dong_van_dung_cot_1, result.hoat_dong_van_dung_cot_2)}

                    {result.shdc && (
                        <div className="p-4 bg-slate-50 rounded-2xl text-xs whitespace-pre-wrap">
                            <h5 className="font-bold mb-2">Sinh hoáº¡t dÆ°á»›i cá»:</h5>
                            {decodeForPreview(result.shdc)}
                        </div>
                    )}

                    {result.shl && (
                        <div className="p-4 bg-slate-50 rounded-2xl text-xs whitespace-pre-wrap">
                            <h5 className="font-bold mb-2">Sinh hoáº¡t lá»›p:</h5>
                            {decodeForPreview(result.shl)}
                        </div>
                    )}
                </div>

                {/* 3. PHá»¤ Lá»¤C & HÆ¯á»šNG DáºªN */}
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                    <h4 className="font-black text-amber-900 flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4" /> Há»’ SÆ  & HÆ¯á»šNG DáºªN Vá»€ NHÃ€
                    </h4>
                    <div className="text-xs leading-relaxed space-y-4">
                        <div>
                            <p className="font-bold text-amber-800">Há»“ sÆ¡ dáº¡y há»c (AI-written):</p>
                            <p className="mt-1">{decodeForPreview(result.ho_so_day_hoc) || "ChÆ°a cÃ³ ná»™i dung phá»¥ lá»¥c tá»« AI."}</p>
                        </div>
                        <div>
                            <p className="font-bold text-amber-800">HÆ°á»›ng dáº«n vá» nhÃ :</p>
                            <p className="mt-1">{decodeForPreview(result.huong_dan_ve_nha) || "..."}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
