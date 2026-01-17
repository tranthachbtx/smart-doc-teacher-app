
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
            <p>Chưa có dữ liệu để hiển thị X-RAY Preview.</p>
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

        const gvText = decodeForPreview(content1);
        const hasAudioCue = gvText.includes('[AUDIO SCENOGRAPHY]');
        const displayGvText = gvText.replace(/\[AUDIO SCENOGRAPHY\]:\s*/gi, "");
        const audioCueText = gvText.match(/\[AUDIO SCENOGRAPHY\]:\s*(.*)/i)?.[1];

        return (
            <div className="space-y-3 mb-10">
                <div className="flex items-center justify-between">
                    <h4 className="font-black text-indigo-900 flex items-center gap-2 text-sm uppercase">
                        <ClipboardCheck className="w-5 h-5" /> {title}
                    </h4>
                    {hasAudioCue && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
                            🎧 Audio Scenography Active
                        </Badge>
                    )}
                </div>

                {hasAudioCue && audioCueText && (
                    <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 text-[11px] text-amber-900 italic flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">🔊</div>
                        <span><b>Bối cảnh âm thanh:</b> {audioCueText.split('\n')[0]}</span>
                    </div>
                )}

                <div className="border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-sm bg-white">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b-2 border-slate-100">
                                <th className="w-1/2 p-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Hoạt động của GV</th>
                                <th className="w-1/2 p-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Hoạt động của HS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="divide-x-2 divide-slate-100">
                                <td className="p-5 text-sm leading-relaxed whitespace-pre-wrap align-top font-medium text-slate-700">
                                    {displayGvText || <span className="text-rose-300 italic">Thiếu dữ liệu GV</span>}
                                </td>
                                <td className="p-5 text-sm leading-relaxed whitespace-pre-wrap align-top text-slate-600">
                                    {decodeForPreview(content2) || <span className="text-rose-300 italic">Thiếu dữ liệu HS</span>}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <ScrollArea className="h-[75vh] pr-4">
            <div className="space-y-10 p-2">
                {/* 1. TINH HOA METADATA - NÂNG CẤP NC1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="rounded-[2.5rem] border-slate-100 bg-white shadow-xl shadow-slate-100/50 overflow-hidden lg:col-span-2">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
                        <CardHeader className="py-6">
                            <CardTitle className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-500" /> Chiến lược mục tiêu bài dạy
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-relaxed space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mục tiêu cốt lõi (MOET)</p>
                                {decodeForPreview(result.muc_tieu_kien_thuc) || "..."}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Năng lực đặc thù</p>
                                    <p className="text-xs">{decodeForPreview(result.muc_tieu_nang_luc) || "..."}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Phẩm chất</p>
                                    <p className="text-xs">{decodeForPreview(result.muc_tieu_pham_chat) || "..."}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-indigo-100 bg-indigo-50/30 shadow-xl shadow-indigo-100/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Eye className="w-24 h-24" />
                        </div>
                        <CardHeader className="py-6">
                            <CardTitle className="text-sm font-black text-indigo-900 uppercase flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-600" /> Digital Competence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-white rounded-2xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Mã năng lực số (NC1)</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.ho_so_day_hoc?.includes('NC1') ? (
                                        result.ho_so_day_hoc.match(/NC1:?\s*([^\n]*)/gi)?.map((m: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                                {m.replace(/NC1:?\s*/i, "").trim()}
                                            </Badge>
                                        ))
                                    ) : <span className="text-xs italic text-slate-400">Đang quét mã...</span>}
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-400 uppercase mb-2">Ý tưởng chủ đạo</p>
                                <p className="text-xs leading-relaxed italic text-indigo-900">
                                    {result.ho_so_day_hoc?.match(/Ý TƯỞNG CHỦ ĐẠO \(PHAN THIẾT\): (.*)/i)?.[1] || "Bản sắc địa phương..."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. CHUỖI HOẠT ĐỘNG ( Chuẩn 5512 ) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <Badge className="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-1 rounded-full text-[10px] font-black shadow-lg">V5.0 ELITE</Badge>
                        <h3 className="font-black text-slate-900 text-xl uppercase tracking-tighter">Tiến trình tổ chức dạy học</h3>
                    </div>

                    {renderActivityTable("HĐ 1: XÁC ĐỊNH VẤN ĐỀ", result.hoat_dong_khoi_dong_cot_1, result.hoat_dong_khoi_dong_cot_2)}
                    {renderActivityTable("HĐ 2: HÌNH THÀNH KIẾN THỨC", result.hoat_dong_kham_pha_cot_1, result.hoat_dong_kham_pha_cot_2)}
                    {renderActivityTable("HĐ 3: LUYỆN TẬP", result.hoat_dong_luyen_tap_cot_1, result.hoat_dong_luyen_tap_cot_2)}
                    {renderActivityTable("HĐ 4: VẬN DỤNG", result.hoat_dong_van_dung_cot_1, result.hoat_dong_van_dung_cot_2)}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.shdc && (
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-xs leading-relaxed">
                                <h5 className="font-black text-slate-400 uppercase text-[10px] mb-3 flex items-center gap-2">
                                    <ClipboardCheck className="w-3 h-3" /> Sinh hoạt dưới cờ
                                </h5>
                                {decodeForPreview(result.shdc)}
                            </div>
                        )}

                        {result.shl && (
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-xs leading-relaxed">
                                <h5 className="font-black text-slate-400 uppercase text-[10px] mb-3 flex items-center gap-2">
                                    <ClipboardCheck className="w-3 h-3" /> Sinh hoạt lớp
                                </h5>
                                {decodeForPreview(result.shl)}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. PHỤ LỤC & ĐÁNH GIÁ - NÂNG CẤP RUBRIC */}
                <div className="p-8 bg-indigo-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        <div className="md:w-1/2 space-y-6">
                            <h4 className="font-black flex items-center gap-2 text-sm uppercase tracking-widest text-indigo-300">
                                <BookOpen className="w-5 h-5" /> Hồ sơ dạy học & Phụ lục
                            </h4>
                            <div className="text-xs leading-relaxed opacity-90 p-6 bg-white/5 rounded-3xl border border-white/10">
                                {decodeForPreview(result.ho_so_day_hoc) || "..."}
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                                <p className="font-black text-indigo-300 text-[10px] uppercase mb-2">HƯỚNG DẪN VỀ NHÀ:</p>
                                <p className="text-xs opacity-90">{decodeForPreview(result.huong_dan_ve_nha) || "..."}</p>
                            </div>
                        </div>

                        <div className="md:w-1/2 space-y-6">
                            <h4 className="font-black flex items-center gap-2 text-sm uppercase tracking-widest text-indigo-300">
                                <ClipboardCheck className="w-5 h-5" /> Công cụ đánh giá (TT 22)
                            </h4>
                            <div className="p-6 bg-white/10 rounded-3xl border border-white/20 text-xs leading-relaxed max-h-[400px] overflow-auto">
                                <pre className="whitespace-pre-wrap font-sans">
                                    {result.rubric_text || "Đang tạo Rubric chuyên sâu..."}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
