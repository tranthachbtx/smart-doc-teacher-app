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
    MessageSquare,
} from "lucide-react";
import type { EventResult } from "@/lib/types";
import { ACADEMIC_MONTHS, getThemeDetails } from "@/lib/hdtn-curriculum";

interface EventTabProps {
    selectedGradeEvent: string;
    setSelectedGradeEvent: (value: string) => void;
    selectedEventMonth: string;
    setSelectedEventMonth: (value: string) => void;
    autoFilledTheme: string;
    eventBudget: string;
    setEventBudget: (value: string) => void;
    eventChecklist: string;
    setEventChecklist: (value: string) => void;
    eventCustomInstructions: string;
    setEventCustomInstructions: (value: string) => void;
    eventResult: EventResult | null;
    setEventResult: (result: EventResult | null) => void;
    isGenerating: boolean;
    onGenerate: () => void;
    isExporting: boolean;
    onExport: () => void;
    copyToClipboard: (text: string) => void;
}

export function EventTab({
    selectedGradeEvent,
    setSelectedGradeEvent,
    selectedEventMonth,
    setSelectedEventMonth,
    autoFilledTheme,
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

    // Derived state for theme details
    const eventThemeDetails = React.useMemo(() => {
        if (selectedGradeEvent && selectedEventMonth) {
            return getThemeDetails(selectedGradeEvent, selectedEventMonth);
        }
        return null;
    }, [selectedGradeEvent, selectedEventMonth]);

    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6 space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Chọn Khối</Label>
                        <Select
                            value={selectedGradeEvent}
                            onValueChange={setSelectedGradeEvent}
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
                        <Label>Chọn Tháng</Label>
                        <Select
                            value={selectedEventMonth}
                            onValueChange={setSelectedEventMonth}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tháng..." />
                            </SelectTrigger>
                            <SelectContent>
                                {ACADEMIC_MONTHS.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Auto-filled Theme */}
                {autoFilledTheme && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm font-medium text-purple-800 mb-2">
                            Chủ đề từ SGK:
                        </p>
                        <p className="text-purple-700 font-semibold">{autoFilledTheme}</p>
                        {eventThemeDetails && (
                            <div className="mt-3 space-y-2 text-sm text-purple-700">
                                <p>
                                    <strong>Mục tiêu:</strong>{" "}
                                    {eventThemeDetails.objectives.join("; ")}
                                </p>
                                <p>
                                    <strong>Hoạt động gợi ý:</strong>{" "}
                                    {eventThemeDetails.activities.join(", ")}
                                </p>
                                <p>
                                    <strong>Kỹ năng:</strong>{" "}
                                    {eventThemeDetails.skills.join(", ")}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Dự toán kinh phí (tùy chọn)</Label>
                    <Textarea
                        placeholder="Nhập dự toán kinh phí nếu cần...&#10;VD: Banner: 500.000đ, Phần thưởng: 1.000.000đ..."
                        value={eventBudget}
                        onChange={(e) => setEventBudget(e.target.value)}
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        AI sẽ cố gắng bám sát dự toán bạn cung cấp để xây dựng kế hoạch.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label>Checklist chuẩn bị (tùy chọn)</Label>
                    <Textarea
                        placeholder="Nhập danh sách cần chuẩn bị...&#10;VD: Âm thanh, ánh sáng, phông nền, quà tặng..."
                        value={eventChecklist}
                        onChange={(e) => setEventChecklist(e.target.value)}
                        rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        AI sẽ sử dụng checklist này để làm gợi ý cho phần chuẩn bị.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                        Chỉ dẫn thêm cho AI (tùy chọn)
                    </Label>
                    <Textarea
                        placeholder="Nhập yêu cầu bổ sung cho AI, ví dụ: Thêm kịch ngắn về chủ đề gia đình, có mini game Kahoot, mời cựu học sinh chia sẻ..."
                        value={eventCustomInstructions}
                        onChange={(e) => setEventCustomInstructions(e.target.value)}
                        className="min-h-[80px] resize-none"
                    />
                    <p className="text-xs text-slate-500">
                        AI sẽ cập nhật nội dung dựa trên chỉ dẫn của bạn
                    </p>
                </div>

                {/* Generate Button */}
                <Button
                    onClick={onGenerate}
                    disabled={isGenerating || !selectedGradeEvent || !selectedEventMonth}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white gap-2"
                    size="lg"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang tạo kịch bản...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Tạo Kịch bản Ngoại khóa AI
                        </>
                    )}
                </Button>

                {/* Results */}
                {eventResult && (
                    <div className="space-y-4 mt-6">
                        <h3 className="font-semibold text-lg text-slate-800">
                            Kết quả kịch bản ngoại khóa:
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-purple-700 font-medium">
                                        Tên chủ đề:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(eventResult.ten_chu_de)}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input
                                    value={eventResult.ten_chu_de}
                                    onChange={(e) =>
                                        setEventResult({
                                            ...eventResult,
                                            ten_chu_de: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-purple-700 font-medium">
                                        Mục đích yêu cầu:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(eventResult.muc_dich_yeu_cau)
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={eventResult.muc_dich_yeu_cau}
                                    onChange={(e) =>
                                        setEventResult({
                                            ...eventResult,
                                            muc_dich_yeu_cau: e.target.value,
                                        })
                                    }
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-purple-700 font-medium">
                                        Kịch bản chi tiết:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(eventResult.kich_ban_chi_tiet)
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={eventResult.kich_ban_chi_tiet}
                                    onChange={(e) =>
                                        setEventResult({
                                            ...eventResult,
                                            kich_ban_chi_tiet: e.target.value,
                                        })
                                    }
                                    className="min-h-[300px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-purple-700 font-medium">
                                        Phân công chuẩn bị:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(eventResult.phan_cong_chuan_bi)
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={eventResult.phan_cong_chuan_bi}
                                    onChange={(e) =>
                                        setEventResult({
                                            ...eventResult,
                                            phan_cong_chuan_bi: e.target.value,
                                        })
                                    }
                                    className="min-h-[150px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-purple-700 font-medium">
                                        Dự trù kinh phí tham khảo:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(eventResult.du_tru_kinh_phi)
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={eventResult.du_tru_kinh_phi}
                                    onChange={(e) =>
                                        setEventResult({
                                            ...eventResult,
                                            du_tru_kinh_phi: e.target.value,
                                        })
                                    }
                                    className="min-h-[100px]"
                                />
                            </div>

                            <Button
                                onClick={onExport}
                                disabled={isExporting}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xuất file...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Xuất file Word (Kế hoạch)
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
