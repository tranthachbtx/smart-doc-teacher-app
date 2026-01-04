"use client";

import React from "react";
import type { LessonResult } from "@/lib/types";
import { Zap } from "lucide-react";

interface SectionEditorGridProps {
    lessonResult: LessonResult;
    setLessonResult: (res: LessonResult) => void;
    AISectionEditor: React.ComponentType<any>;
}

export function SectionEditorGrid({
    lessonResult,
    setLessonResult,
    AISectionEditor
}: SectionEditorGridProps) {
    const updateField = (field: keyof LessonResult, val: any) => {
        setLessonResult({ ...lessonResult, [field]: val });
    };

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AISectionEditor
                        label="Mục tiêu Kiến thức"
                        value={lessonResult.muc_tieu_kien_thuc || ""}
                        onChange={(val: string) => updateField("muc_tieu_kien_thuc", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_kien_thuc"
                    />
                    <AISectionEditor
                        label="Mục tiêu Năng lực"
                        value={lessonResult.muc_tieu_nang_luc || ""}
                        onChange={(val: string) => updateField("muc_tieu_nang_luc", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_nang_luc"
                    />
                    <AISectionEditor
                        label="Mục tiêu Phẩm chất"
                        value={lessonResult.muc_tieu_pham_chat || ""}
                        onChange={(val: string) => updateField("muc_tieu_pham_chat", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_pham_chat"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AISectionEditor
                        label="GV Chuẩn bị"
                        value={lessonResult.gv_chuan_bi || ""}
                        onChange={(val: string) => updateField("gv_chuan_bi", val)}
                        bgClass="premium-glass soft-pastel-sky/10 p-6"
                        field="gv_chuan_bi"
                    />
                    <AISectionEditor
                        label="HS Chuẩn bị"
                        value={lessonResult.hs_chuan_bi || ""}
                        onChange={(val: string) => updateField("hs_chuan_bi", val)}
                        bgClass="premium-glass soft-pastel-sky/10 p-6"
                        field="hs_chuan_bi"
                    />
                </div>
            </div>

            {(lessonResult.tich_hop_nls || lessonResult.tich_hop_dao_duc) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lessonResult.tich_hop_nls && (
                        <AISectionEditor
                            label="Tích hợp Năng lực số"
                            value={lessonResult.tich_hop_nls}
                            onChange={(val: string) => updateField("tich_hop_nls", val)}
                            bgClass="premium-glass soft-pastel-mint/20 border-emerald-200 p-6 shadow-xl"
                            field="tich_hop_nls"
                        />
                    )}
                    {lessonResult.tich_hop_dao_duc && (
                        <AISectionEditor
                            label="Tích hợp Đạo đức"
                            value={lessonResult.tich_hop_dao_duc}
                            onChange={(val: string) => updateField("tich_hop_dao_duc", val)}
                            bgClass="premium-glass soft-pastel-salmon/20 border-red-200 p-6 shadow-xl"
                            field="tich_hop_dao_duc"
                        />
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AISectionEditor
                    label="Sinh hoạt Dưới cờ"
                    value={lessonResult.shdc || ""}
                    onChange={(val: string) => updateField("shdc", val)}
                    bgClass="premium-neumo p-6"
                    field="shdc"
                />
                <AISectionEditor
                    label="Sinh hoạt Lớp"
                    value={lessonResult.shl || ""}
                    onChange={(val: string) => updateField("shl", val)}
                    bgClass="premium-neumo p-6"
                    field="shl"
                />
            </div>

            <AISectionEditor
                label="Hồ sơ Dạy học & Phụ lục"
                value={lessonResult.ho_so_day_hoc || ""}
                onChange={(val: string) => updateField("ho_so_day_hoc", val)}
                bgClass="premium-glass soft-pastel-sky/20 p-8 border-slate-200"
                field="ho_so_day_hoc"
            />

            <div className="space-y-8">
                <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                        <Zap className="h-6 w-6" />
                    </div>
                    Diễn trình Hoạt động Chi tiết
                </h3>

                <div className="space-y-12">
                    <AISectionEditor
                        label="1. Hoạt động Khởi động"
                        value={lessonResult.hoat_dong_khoi_dong || ""}
                        onChange={(val: string) => updateField("hoat_dong_khoi_dong", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-indigo-500"
                        field="hoat_dong_khoi_dong"
                    />
                    <AISectionEditor
                        label="2. Hoạt động Khám phá"
                        value={lessonResult.hoat_dong_kham_pha || ""}
                        onChange={(val: string) => updateField("hoat_dong_kham_pha", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-emerald-500"
                        field="hoat_dong_kham_pha"
                    />
                    <AISectionEditor
                        label="3. Hoạt động Luyện tập"
                        value={lessonResult.hoat_dong_luyen_tap || ""}
                        onChange={(val: string) => updateField("hoat_dong_luyen_tap", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-amber-500"
                        field="hoat_dong_luyen_tap"
                    />
                    <AISectionEditor
                        label="4. Hoạt động Vận dụng"
                        value={lessonResult.hoat_dong_van_dung || ""}
                        onChange={(val: string) => updateField("hoat_dong_van_dung", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-rose-500"
                        field="hoat_dong_van_dung"
                    />
                    <AISectionEditor
                        label="5. Hướng dẫn về nhà"
                        value={lessonResult.huong_dan_ve_nha || ""}
                        onChange={(val: string) => updateField("huong_dan_ve_nha", val)}
                        bgClass="premium-glass soft-pastel-sky/20 p-8"
                        field="huong_dan_ve_nha"
                    />
                </div>
            </div>
        </div>
    );
}
