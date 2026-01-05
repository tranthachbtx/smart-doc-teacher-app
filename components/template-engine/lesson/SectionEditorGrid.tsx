"use client";

import React, { memo } from "react";
import { Zap } from "lucide-react";
import { useLessonStore } from "@/lib/store/use-lesson-store";
import { SectionEditorItem } from "./SectionEditorItem";

export const SectionEditorGrid = memo(() => {
    const lessonResult = useLessonStore((state) => state.lessonResult);
    const updateField = useLessonStore((state) => state.updateLessonResultField);

    if (!lessonResult) return null;

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SectionEditorItem
                        label="Mục tiêu Kiến thức"
                        value={lessonResult.muc_tieu_kien_thuc || ""}
                        onChange={(val) => updateField("muc_tieu_kien_thuc", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_kien_thuc"
                    />
                    <SectionEditorItem
                        label="Mục tiêu Năng lực"
                        value={lessonResult.muc_tieu_nang_luc || ""}
                        onChange={(val) => updateField("muc_tieu_nang_luc", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_nang_luc"
                    />
                    <SectionEditorItem
                        label="Mục tiêu Phẩm chất"
                        value={lessonResult.muc_tieu_pham_chat || ""}
                        onChange={(val) => updateField("muc_tieu_pham_chat", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_pham_chat"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SectionEditorItem
                        label="GV Chuẩn bị"
                        value={lessonResult.gv_chuan_bi || ""}
                        onChange={(val) => updateField("gv_chuan_bi", val)}
                        bgClass="premium-glass soft-pastel-sky/10 p-6"
                        field="gv_chuan_bi"
                    />
                    <SectionEditorItem
                        label="HS Chuẩn bị"
                        value={lessonResult.hs_chuan_bi || ""}
                        onChange={(val) => updateField("hs_chuan_bi", val)}
                        bgClass="premium-glass soft-pastel-sky/10 p-6"
                        field="hs_chuan_bi"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionEditorItem
                    label="Sinh hoạt Dưới cờ"
                    value={lessonResult.shdc || ""}
                    onChange={(val) => updateField("shdc", val)}
                    bgClass="premium-neumo p-6"
                    field="shdc"
                />
                <SectionEditorItem
                    label="Sinh hoạt Lớp"
                    value={lessonResult.shl || ""}
                    onChange={(val) => updateField("shl", val)}
                    bgClass="premium-neumo p-6"
                    field="shl"
                />
            </div>

            <div className="space-y-8">
                <h3 className="font-black text-2xl text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                        <Zap className="h-6 w-6" />
                    </div>
                    Diễn trình Hoạt động Chi tiết
                </h3>

                <div className="space-y-12">
                    <SectionEditorItem
                        label="1. Hoạt động Khởi động"
                        value={lessonResult.hoat_dong_khoi_dong || ""}
                        onChange={(val) => updateField("hoat_dong_khoi_dong", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-indigo-500"
                        field="hoat_dong_khoi_dong"
                    />
                    <SectionEditorItem
                        label="2. Hoạt động Khám phá"
                        value={lessonResult.hoat_dong_kham_pha || ""}
                        onChange={(val) => updateField("hoat_dong_kham_pha", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-emerald-500"
                        field="hoat_dong_kham_pha"
                    />
                    <SectionEditorItem
                        label="3. Hoạt động Luyện tập"
                        value={lessonResult.hoat_dong_luyen_tap || ""}
                        onChange={(val) => updateField("hoat_dong_luyen_tap", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-amber-500"
                        field="hoat_dong_luyen_tap"
                    />
                    <SectionEditorItem
                        label="4. Hoạt động Vận dụng"
                        value={lessonResult.hoat_dong_van_dung || ""}
                        onChange={(val) => updateField("hoat_dong_van_dung", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-rose-500"
                        field="hoat_dong_van_dung"
                    />
                </div>
            </div>
        </div>
    );
});

SectionEditorGrid.displayName = "SectionEditorGrid";
