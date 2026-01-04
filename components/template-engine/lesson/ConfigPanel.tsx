"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getChuDeListByKhoi, type PPCTChuDe } from "@/lib/data/ppct-database";

interface ConfigPanelProps {
    lessonGrade: string;
    setLessonGrade: (val: string) => void;
    selectedChuDeSo: string;
    setSelectedChuDeSo: (val: string) => void;
    setLessonAutoFilledTheme: (val: string) => void;
    lessonDuration: string;
    setLessonDuration: (val: string) => void;
    selectedChuDe: PPCTChuDe | null;
    setSelectedChuDe: (val: PPCTChuDe | null) => void;
    setLessonMonth: (val: string) => void;
}

export function ConfigPanel({
    lessonGrade,
    setLessonGrade,
    selectedChuDeSo,
    setSelectedChuDeSo,
    setLessonAutoFilledTheme,
    lessonDuration,
    setLessonDuration,
    selectedChuDe,
    setSelectedChuDe,
    setLessonMonth,
}: ConfigPanelProps) {
    return (
        <div className="space-y-6">
            <div className="premium-neumo p-6 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 premium-glass">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">Bước 1: Cấu hình</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Lập trình bối cảnh bài dạy</p>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Khối lớp (Grade)</Label>
                        <Select
                            value={lessonGrade}
                            onValueChange={(value) => {
                                setLessonGrade(value);
                                setSelectedChuDeSo("");
                                setLessonAutoFilledTheme("");
                            }}
                        >
                            <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-white dark:border-slate-800 shadow-sm">
                                <SelectValue placeholder="Chọn khối..." />
                            </SelectTrigger>
                            <SelectContent className="premium-glass rounded-2xl">
                                <SelectItem value="10">Khối 10 (Grade 10)</SelectItem>
                                <SelectItem value="11">Khối 11 (Grade 11)</SelectItem>
                                <SelectItem value="12">Khối 12 (Grade 12)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Chủ đề (PPCT Month)</Label>
                        <Select
                            value={selectedChuDeSo}
                            onValueChange={(value) => {
                                setSelectedChuDeSo(value);
                                const chuDeList = getChuDeListByKhoi(lessonGrade);
                                const chuDe = chuDeList.find(
                                    (cd) => cd.chu_de_so === Number.parseInt(value)
                                );
                                if (chuDe) {
                                    setLessonAutoFilledTheme(chuDe.ten);
                                    setLessonDuration(chuDe.tong_tiet.toString());
                                    setSelectedChuDe(chuDe);
                                    setLessonMonth(value);
                                }
                            }}
                            disabled={!lessonGrade}
                        >
                            <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border-white dark:border-slate-800">
                                <SelectValue placeholder={lessonGrade ? "Chọn chủ đề..." : "Chọn khối trước"} />
                            </SelectTrigger>
                            <SelectContent className="premium-glass rounded-2xl">
                                {lessonGrade &&
                                    getChuDeListByKhoi(lessonGrade).map((chuDe) => (
                                        <SelectItem key={chuDe.chu_de_so} value={chuDe.chu_de_so.toString()}>
                                            {chuDe.chu_de_so}. {chuDe.ten}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>


                    {/* PPCT Dash */}
                    {selectedChuDe && (
                        <div className="premium-glass p-4 rounded-3xl space-y-3 border-indigo-200/50 bg-indigo-50/10">
                            <div className="flex items-center gap-2 border-b border-indigo-100/50 pb-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                <span className="text-[9px] font-bold text-indigo-800 uppercase tracking-wider">Phân bổ tiết học</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center">
                                    <p className="text-[8px] text-slate-400 font-black uppercase">SHDC</p>
                                    <p className="text-sm font-black text-indigo-600">{selectedChuDe.shdc}</p>
                                </div>
                                <div className="text-center border-x border-indigo-100">
                                    <p className="text-[8px] text-slate-400 font-black uppercase">HĐGD</p>
                                    <p className="text-sm font-black text-emerald-600">{selectedChuDe.hdgd}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[8px] text-slate-400 font-black uppercase">SHL</p>
                                    <p className="text-sm font-black text-amber-600">{selectedChuDe.shl}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
