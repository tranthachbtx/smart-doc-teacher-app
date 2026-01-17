import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sparkles,
    Download,
    Loader2,
    Copy,
} from "lucide-react";
import {
    ACADEMIC_MONTHS,
    getThemeForMonth,
    getThemesByGrade,
} from "@/lib/hdtn-curriculum";
import type { NCBHResult, NCBHTabProps } from "@/lib/types";

// NCBHTabProps is now imported from @/lib/types

export function NCBHTab({
    selectedMonth,
    setSelectedMonth,
    ncbhGrade,
    setNcbhGrade,
    ncbhTopic,
    setNcbhTopic,
    ncbhCustomInstructions,
    setNcbhCustomInstructions,
    ncbhResult,
    setNcbhResult,
    isGenerating,
    onGenerate,
    isExporting,
    onExport,
    copyToClipboard,
    ppctData,
}: NCBHTabProps) {
    // Filter PPCT items for the selected month/theme
    const filteredPpctItems = React.useMemo(() => {
        if (!ppctData) return [];
        return ppctData.filter(item => item.month === selectedMonth);
    }, [ppctData, selectedMonth]);

    const themes = getThemesByGrade(ncbhGrade) || {};

    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="ncbh-grade-select">Khối</Label>
                        <Select value={ncbhGrade} onValueChange={setNcbhGrade} name="ncbhGrade">
                            <SelectTrigger id="ncbh-grade-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">Khối 10</SelectItem>
                                <SelectItem value="11">Khối 11</SelectItem>
                                <SelectItem value="12">Khối 12</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ncbh-month-select">Chủ đề (Tháng)</Label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth} name="ncbhMonth">
                            <SelectTrigger id="ncbh-month-select">
                                <SelectValue placeholder="Chọn chủ đề..." />
                            </SelectTrigger>
                            <SelectContent>
                                {ACADEMIC_MONTHS.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {themes[m.value] || `Tháng ${m.value}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ncbh-topic-input">Tên bài học nghiên cứu (Tên bài không có trong PPCT / NCBH)</Label>
                    <Input
                        id="ncbh-topic-input"
                        name="ncbhTopic"
                        placeholder="VD: Giao tiếp tự tin trong các mối quan hệ (Cánh Diều/Kết nối Tri thức)..."
                        value={ncbhTopic || ""}
                        onChange={(e) => setNcbhTopic(e.target.value)}
                        className="bg-white border-slate-200 h-12 text-base font-semibold"
                    />
                    <p className="text-[10px] text-slate-500 italic">
                        * Gợi ý: {filteredPpctItems.length > 0 ? filteredPpctItems.map(i => i.theme).slice(0, 3).join(", ") + "..." : "Nhập tên bài bất kỳ để AI nghiên cứu đối soát."}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ncbh-instructions">Ghi chú/Tình huống quan sát (nếu có)</Label>
                    <Textarea
                        id="ncbh-instructions"
                        name="ncbhInstructions"
                        placeholder="VD: Em Nam tổ 2 gục đầu khi thảo luận nhóm. Một số học sinh lúng túng khi xử lý tình huống sắm vai..."
                        value={ncbhCustomInstructions || ""}
                        onChange={(e) => setNcbhCustomInstructions(e.target.value)}
                        rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                        AI sẽ dựa trên các thông tin này để tạo biên bản thảo luận NCBH thực tế hơn.
                    </p>
                </div>

                <Button
                    onClick={onGenerate}
                    disabled={isGenerating || !ncbhTopic}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white gap-2"
                    size="lg"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang phân tích bài học...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Tạo Hồ sơ & Biên bản NCBH
                        </>
                    )}
                </Button>

                {ncbhResult && (
                    <div className="space-y-6 mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-bold text-lg text-slate-800 uppercase">
                                Hồ sơ Nghiên cứu bài học
                            </h3>
                            <Button
                                onClick={onExport}
                                disabled={isExporting}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Xuất Word
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Part 1: Design */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                                    GIAI ĐOẠN 1: THIẾT KẾ BÀI DẠY TẬP THỂ
                                </h4>

                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500 font-bold">Tên bài học nghiên cứu (Hợp nhất)</Label>
                                    <Input
                                        value={ncbhResult.ten_bai || ""}
                                        onChange={(e) => setNcbhResult({ ...ncbhResult, ten_bai: e.target.value })}
                                        className="bg-white border-red-100 font-bold text-red-900"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Lý do chọn bài</Label>
                                        <Textarea
                                            value={ncbhResult.ly_do_chon}
                                            onChange={(e) => setNcbhResult({ ...ncbhResult, ly_do_chon: e.target.value })}
                                            className="bg-white text-sm"
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Mục tiêu bài học</Label>
                                        <Textarea
                                            value={ncbhResult.muc_tieu}
                                            onChange={(e) => setNcbhResult({ ...ncbhResult, muc_tieu: e.target.value })}
                                            className="bg-white text-sm"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Chuỗi hoạt động thống nhất</Label>
                                        <Textarea
                                            value={ncbhResult.chuoi_hoat_dong}
                                            onChange={(e) => setNcbhResult({ ...ncbhResult, chuoi_hoat_dong: e.target.value })}
                                            className="bg-white text-sm"
                                            rows={6}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Phương án hỗ trợ (Scaffold)</Label>
                                        <Textarea
                                            value={ncbhResult.phuong_an_ho_tro || ""}
                                            onChange={(e) => setNcbhResult({ ...ncbhResult, phuong_an_ho_tro: e.target.value })}
                                            className="bg-white text-sm border-indigo-100"
                                            rows={6}
                                            placeholder="Kịch bản hỗ trợ HS yếu, thúc đẩy HS giỏi..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Part 2: Analysis */}
                            <div className="space-y-3 pt-4 border-t border-slate-200">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                    GIAI ĐOẠN 2 & 3: BIÊN BẢN PHÂN TÍCH BÀI HỌC
                                </h4>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500">Chia sẻ của giáo viên dạy</Label>
                                    <Textarea
                                        value={ncbhResult.chia_se_nguoi_day}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNcbhResult({ ...ncbhResult, chia_se_nguoi_day: e.target.value })}
                                        className="bg-white text-sm"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500">Minh chứng việc học (Người dự ghi nhận)</Label>
                                    <Textarea
                                        value={ncbhResult.nhan_xet_nguoi_du}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNcbhResult({ ...ncbhResult, nhan_xet_nguoi_du: e.target.value })}
                                        className="bg-white text-sm"
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Nguyên nhân & Giải pháp điều chỉnh</Label>
                                        <Textarea
                                            value={ncbhResult.nguyen_nhan_giai_phap}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNcbhResult({ ...ncbhResult, nguyen_nhan_giai_phap: e.target.value })}
                                            className="bg-white text-sm"
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Bài học kinh nghiệm rút ra</Label>
                                        <Textarea
                                            value={ncbhResult.bai_hoc_kinh_nghiem}
                                            onChange={(e) => setNcbhResult({ ...ncbhResult, bai_hoc_kinh_nghiem: e.target.value })}
                                            className="bg-white text-sm"
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={onExport}
                                disabled={isExporting}
                                className="w-full md:w-auto px-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white gap-2"
                                size="lg"
                            >
                                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                                Tải xuống Hồ sơ NCBH (.docx)
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
