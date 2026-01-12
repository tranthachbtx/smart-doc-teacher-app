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
                        label="Má»¥c tiÃªu Kiáº¿n thá»©c"
                        value={lessonResult.muc_tieu_kien_thuc || ""}
                        onChange={(val) => updateField("muc_tieu_kien_thuc", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_kien_thuc"
                    />
                    <SectionEditorItem
                        label="Má»¥c tiÃªu NÄƒng lá»±c"
                        value={lessonResult.muc_tieu_nang_luc || ""}
                        onChange={(val) => updateField("muc_tieu_nang_luc", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_nang_luc"
                    />
                    <SectionEditorItem
                        label="Má»¥c tiÃªu Pháº©m cháº¥t"
                        value={lessonResult.muc_tieu_pham_chat || ""}
                        onChange={(val) => updateField("muc_tieu_pham_chat", val)}
                        bgClass="premium-neumo p-6"
                        field="muc_tieu_pham_chat"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SectionEditorItem
                        label="GV Chuáº©n bá»‹"
                        value={lessonResult.gv_chuan_bi || ""}
                        onChange={(val) => updateField("gv_chuan_bi", val)}
                        bgClass="premium-glass soft-pastel-sky/10 p-6"
                        field="gv_chuan_bi"
                    />
                    <SectionEditorItem
                        label="HS Chuáº©n bá»‹"
                        value={lessonResult.hs_chuan_bi || ""}
                        onChange={(val) => updateField("hs_chuan_bi", val)}
                        bgClass="premium-glass soft-pastel-sky/10 p-6"
                        field="hs_chuan_bi"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionEditorItem
                    label="Sinh hoáº¡t DÆ°á»›i cá»"
                    value={lessonResult.shdc || ""}
                    onChange={(val) => updateField("shdc", val)}
                    bgClass="premium-neumo p-6"
                    field="shdc"
                />
                <SectionEditorItem
                    label="Sinh hoáº¡t Lá»›p"
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
                    Diá»…n trÃ¬nh Hoáº¡t Ä‘á»™ng Chi tiáº¿t
                </h3>

                <div className="space-y-12">
                    <SectionEditorItem
                        label="1. Hoáº¡t Ä‘á»™ng Khá»Ÿi Ä‘á»™ng"
                        value={lessonResult.hoat_dong_khoi_dong || ""}
                        onChange={(val) => updateField("hoat_dong_khoi_dong", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-indigo-500"
                        field="hoat_dong_khoi_dong"
                    />
                    <SectionEditorItem
                        label="2. Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡"
                        value={lessonResult.hoat_dong_kham_pha || ""}
                        onChange={(val) => updateField("hoat_dong_kham_pha", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-emerald-500"
                        field="hoat_dong_kham_pha"
                    />
                    <SectionEditorItem
                        label="3. Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p"
                        value={lessonResult.hoat_dong_luyen_tap || ""}
                        onChange={(val) => updateField("hoat_dong_luyen_tap", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-amber-500"
                        field="hoat_dong_luyen_tap"
                    />
                    <SectionEditorItem
                        label="4. Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng"
                        value={lessonResult.hoat_dong_van_dung || ""}
                        onChange={(val) => updateField("hoat_dong_van_dung", val)}
                        bgClass="premium-neumo p-8 border-l-8 border-l-rose-500"
                        field="hoat_dong_van_dung"
                    />
                </div>
            </div>

            {/* Footer Sections */}
            <div className="space-y-8 pt-8 border-t border-slate-200">
                <h3 className="font-black text-2xl text-slate-800">ThÃ´ng tin Bá»• trá»£ (Phá»¥ lá»¥c & Dáº·n dÃ²)</h3>
                <div className="grid grid-cols-1 gap-6">
                    <SectionEditorItem
                        label="TÃ­ch há»£p NÄƒng lá»±c sá»‘"
                        value={lessonResult.tich_hop_nls || ""}
                        onChange={(val) => updateField("tich_hop_nls", val)}
                        bgClass="premium-glass soft-pastel-mint/10 p-6"
                        field="tich_hop_nls"
                    />
                    <SectionEditorItem
                        label="Há»“ sÆ¡ Dáº¡y há»c (Phá»¥ lá»¥c: Phiáº¿u há»c táº­p, Rubric...)"
                        value={lessonResult.ho_so_day_hoc || lessonResult.materials || ""}
                        onChange={(val) => updateField("ho_so_day_hoc", val)}
                        bgClass="premium-neumo p-6"
                        field="ho_so_day_hoc"
                    />
                    <SectionEditorItem
                        label="HÆ°á»›ng dáº«n vá» nhÃ "
                        value={lessonResult.huong_dan_ve_nha || lessonResult.homework || ""}
                        onChange={(val) => updateField("huong_dan_ve_nha", val)}
                        bgClass="premium-neumo p-6"
                        field="huong_dan_ve_nha"
                    />
                </div>
            </div>
        </div>
    );
});

SectionEditorGrid.displayName = "SectionEditorGrid";
