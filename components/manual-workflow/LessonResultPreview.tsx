
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
        return text.replace(/\|\|LINE_BREAK\|\|/g, "\n");
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
                                <th className="w-1/2 p-3 text-left text-[10px] font-black text-slate-500 uppercase">Hoạt động của GV</th>
                                <th className="w-1/2 p-3 text-left text-[10px] font-black text-slate-500 uppercase">Hoạt động của HS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="divide-x">
                                <td className="p-4 text-xs leading-relaxed whitespace-pre-wrap align-top">
                                    {decodeForPreview(content1) || <span className="text-rose-300 italic">Thiếu dữ liệu GV</span>}
                                </td>
                                <td className="p-4 text-xs leading-relaxed whitespace-pre-wrap align-top">
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
        <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-8 p-1">
                {/* 1. TINH HOA METADATA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="rounded-3xl border-slate-100 bg-slate-50/50 shadow-none">
                        <CardHeader className="py-4">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                                <Target className="w-4 h-4" /> Mục tiêu kiến thức
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs leading-relaxed">
                            {decodeForPreview(result.muc_tieu_kien_thuc) || "..."}
                        </CardContent>
                    </Card>
                    <Card className="rounded-3xl border-slate-100 bg-slate-50/50 shadow-none">
                        <CardHeader className="py-4">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" /> Năng lực & Phẩm chất
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs leading-relaxed space-y-2">
                            <p><b>Năng lực:</b> {decodeForPreview(result.muc_tieu_nang_luc) || "..."}</p>
                            <p><b>Phẩm chất:</b> {decodeForPreview(result.muc_tieu_pham_chat) || "..."}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. CHUỖI HOẠT ĐỘNG ( Chuẩn 5512 ) */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-indigo-600">Arch 34.0</Badge>
                        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Cấu trúc 2 cột X-RAY</h3>
                    </div>

                    {renderActivityTable("HĐ 1: KHỞI ĐỘNG", result.hoat_dong_khoi_dong_cot_1, result.hoat_dong_khoi_dong_cot_2)}
                    {renderActivityTable("HĐ 2: KHÁM PHÁ", result.hoat_dong_kham_pha_cot_1, result.hoat_dong_kham_pha_cot_2)}
                    {renderActivityTable("HĐ 3: LUYỆN TẬP", result.hoat_dong_luyen_tap_cot_1, result.hoat_dong_luyen_tap_cot_2)}
                    {renderActivityTable("HĐ 4: VẬN DỤNG", result.hoat_dong_van_dung_cot_1, result.hoat_dong_van_dung_cot_2)}

                    {result.shdc && (
                        <div className="p-4 bg-slate-50 rounded-2xl text-xs whitespace-pre-wrap">
                            <h5 className="font-bold mb-2">Sinh hoạt dưới cờ:</h5>
                            {decodeForPreview(result.shdc)}
                        </div>
                    )}

                    {result.shl && (
                        <div className="p-4 bg-slate-50 rounded-2xl text-xs whitespace-pre-wrap">
                            <h5 className="font-bold mb-2">Sinh hoạt lớp:</h5>
                            {decodeForPreview(result.shl)}
                        </div>
                    )}
                </div>

                {/* 3. PHỤ LỤC & HƯỚNG DẪN */}
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-4">
                    <h4 className="font-black text-amber-900 flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4" /> HỒ SƠ & HƯỚNG DẪN VỀ NHÀ
                    </h4>
                    <div className="text-xs leading-relaxed space-y-4">
                        <div>
                            <p className="font-bold text-amber-800">Hồ sơ dạy học (AI-written):</p>
                            <p className="mt-1">{decodeForPreview(result.ho_so_day_hoc) || "Chưa có nội dung phụ lục từ AI."}</p>
                        </div>
                        <div>
                            <p className="font-bold text-amber-800">Hướng dẫn về nhà:</p>
                            <p className="mt-1">{decodeForPreview(result.huong_dan_ve_nha) || "..."}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
