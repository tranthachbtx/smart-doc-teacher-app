import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    Clock,
} from "lucide-react";
import type { EventResult, EventTabProps } from "@/lib/types";
import { getChuDeListByKhoi, type PPCTChuDe } from "@/lib/data/ppct-database";

// EventTabProps is now imported from @/lib/types

export function EventTab({
    selectedGradeEvent,
    setSelectedGradeEvent,
    selectedEventMonth,
    setSelectedEventMonth,
    autoFilledTheme,
    setAutoFilledTheme,
    eventBudget,
    setEventBudget,
    eventChecklist,
    setEventChecklist,
    eventCustomInstructions,
    setEventCustomInstructions,
    eventResult,
    setEventResult,
    isGenerating,
    onGenerate,
    isExporting,
    onExport,
    copyToClipboard,
}: EventTabProps) {

    // State for selected chu de details
    const [selectedChuDe, setSelectedChuDe] = React.useState<PPCTChuDe | null>(null);

    // State for event duration (in minutes)
    const [eventDuration, setEventDuration] = React.useState("45");

    // Get chu de list for selected grade
    const chuDeList = React.useMemo(() => {
        if (selectedGradeEvent) {
            return getChuDeListByKhoi(selectedGradeEvent);
        }
        return [];
    }, [selectedGradeEvent]);

    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6 space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Chọn Khối</Label>
                        <Select
                            value={selectedGradeEvent}
                            onValueChange={(value) => {
                                setSelectedGradeEvent(value);
                                setSelectedEventMonth("");
                                setAutoFilledTheme("");
                                setSelectedChuDe(null);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn khối..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">Khối 10</SelectItem>
                                <SelectItem value="11">Khối 11</SelectItem>
                                <SelectItem value="12">Khối 12</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Chọn Chủ Đề</Label>
                        <Select
                            value={selectedEventMonth}
                            onValueChange={(value) => {
                                setSelectedEventMonth(value);
                                const chuDe = chuDeList.find(
                                    (cd) => cd.chu_de_so === Number.parseInt(value)
                                );
                                if (chuDe) {
                                    setAutoFilledTheme(chuDe.ten);
                                    setSelectedChuDe(chuDe);
                                }
                            }}
                            disabled={!selectedGradeEvent}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={selectedGradeEvent ? "Chọn chủ đề..." : "Chọn khối trước"} />
                            </SelectTrigger>
                            <SelectContent>
                                {chuDeList.map((chuDe) => (
                                    <SelectItem key={chuDe.chu_de_so} value={chuDe.chu_de_so.toString()}>
                                        Chủ đề {chuDe.chu_de_so}: {chuDe.ten}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Theme Display */}
                {selectedChuDe && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-800 mb-2">
                            Chủ đề từ SGK:
                        </p>
                        <p className="text-purple-700 font-semibold">{autoFilledTheme}</p>
                        {selectedChuDe.tuan_bat_dau && selectedChuDe.tuan_ket_thuc && (
                            <p className="text-xs text-purple-600 mt-2">
                                <strong>Thời gian:</strong> Tuần {selectedChuDe.tuan_bat_dau} - Tuần {selectedChuDe.tuan_ket_thuc}
                            </p>
                        )}
                    </div>
                )}

                {/* Event Duration */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        Thời lượng hoạt động
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            min="15"
                            max="240"
                            value={eventDuration}
                            onChange={(e) => setEventDuration(e.target.value)}
                            className="w-24"
                            placeholder="45"
                        />
                        <span className="text-sm text-muted-foreground">phút</span>
                        <div className="flex gap-1 ml-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEventDuration("45")}
                                className={eventDuration === "45" ? "bg-purple-100 border-purple-300" : ""}
                            >
                                45p
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEventDuration("90")}
                                className={eventDuration === "90" ? "bg-purple-100 border-purple-300" : ""}
                            >
                                90p
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEventDuration("120")}
                                className={eventDuration === "120" ? "bg-purple-100 border-purple-300" : ""}
                            >
                                2h
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEventDuration("180")}
                                className={eventDuration === "180" ? "bg-purple-100 border-purple-300" : ""}
                            >
                                3h
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Chọn hoặc nhập thời lượng phù hợp với kế hoạch của trường
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Dự toán kinh phí (tùy chọn)</Label>
                    <Textarea
                        placeholder="Nhập dự toán kinh phí nếu cần...&#10;VD: Banner: 500.000đ, Phần thưởng: 1.000.000đ..."
                        value={eventBudget}
                        onChange={(e) => setEventBudget(e.target.value)}
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        Để trống nếu không cần dự toán kinh phí
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Checklist chuẩn bị (tùy chọn)</Label>
                    <Textarea
                        placeholder="Nhập các công việc cần chuẩn bị...&#10;VD: In ấn tài liệu, Chuẩn bị phòng họp..."
                        value={eventChecklist}
                        onChange={(e) => setEventChecklist(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Yêu cầu bổ sung</Label>
                    <Textarea
                        placeholder="Nhập yêu cầu chi tiết hoặc điều chỉnh về nội dung kế hoạch..."
                        value={eventCustomInstructions}
                        onChange={(e) => setEventCustomInstructions(e.target.value)}
                        rows={3}
                    />
                </div>

                {/* Generate Button */}
                <Button
                    onClick={onGenerate}
                    disabled={isGenerating || !selectedGradeEvent || !selectedEventMonth}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Tạo Kế hoạch Ngoại khóa
                        </>
                    )}
                </Button>

                {/* Result Display */}
                {eventResult && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Kết quả
                            </h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(JSON.stringify(eventResult, null, 2))
                                    }
                                >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onExport}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-1" />
                                    )}
                                    Xuất Word
                                </Button>
                            </div>
                        </div>

                        {/* Event Result Content */}
                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded border">
                                <h4 className="font-medium text-purple-800 mb-2">
                                    {eventResult.ten_ke_hoach}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <p>
                                        <strong>Thời gian:</strong> {eventResult.thoi_gian}
                                    </p>
                                    <p>
                                        <strong>Địa điểm:</strong> {eventResult.dia_diem}
                                    </p>
                                    <p>
                                        <strong>Đối tượng:</strong> {eventResult.doi_tuong}
                                    </p>
                                    <p>
                                        <strong>Số lượng:</strong> {eventResult.so_luong}
                                    </p>
                                </div>
                            </div>

                            {/* Objectives */}
                            {eventResult.muc_tieu && (
                                <div className="p-3 bg-white rounded border">
                                    <h5 className="font-medium text-sm mb-2">Mục tiêu:</h5>
                                    <p className="text-sm text-slate-600">
                                        {typeof eventResult.muc_tieu === 'string'
                                            ? eventResult.muc_tieu
                                            : JSON.stringify(eventResult.muc_tieu)}
                                    </p>
                                </div>
                            )}

                            {/* Content */}
                            {eventResult.noi_dung && (
                                <div className="p-3 bg-white rounded border">
                                    <h5 className="font-medium text-sm mb-2">Nội dung:</h5>
                                    {Array.isArray(eventResult.noi_dung) ? (
                                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                            {eventResult.noi_dung.map((item, idx) => (
                                                <li key={idx}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-600">
                                            {typeof eventResult.noi_dung === 'string'
                                                ? eventResult.noi_dung
                                                : JSON.stringify(eventResult.noi_dung)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Timeline */}
                            {eventResult.tien_trinh && eventResult.tien_trinh.length > 0 && (
                                <div className="p-3 bg-white rounded border">
                                    <h5 className="font-medium text-sm mb-2">Tiến trình:</h5>
                                    <div className="space-y-2">
                                        {eventResult.tien_trinh.map((step, idx) => (
                                            <div key={idx} className="flex gap-2 text-sm">
                                                <span className="font-medium text-purple-600 whitespace-nowrap">
                                                    {step.thoi_gian}:
                                                </span>
                                                <span className="text-slate-600">{step.hoat_dong}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Checklist */}
                            {eventResult.checklist_chuan_bi && eventResult.checklist_chuan_bi.length > 0 && (
                                <div className="p-3 bg-white rounded border">
                                    <h5 className="font-medium text-sm mb-2">Công việc chuẩn bị:</h5>
                                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                        {eventResult.checklist_chuan_bi.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Budget */}
                            {eventResult.du_toan_kinh_phi && eventResult.du_toan_kinh_phi.length > 0 && (
                                <div className="p-3 bg-white rounded border">
                                    <h5 className="font-medium text-sm mb-2">Dự toán kinh phí:</h5>
                                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                        {eventResult.du_toan_kinh_phi.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
