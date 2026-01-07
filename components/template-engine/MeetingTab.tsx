import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
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
} from "lucide-react";
import {
    ACADEMIC_MONTHS,
    getThemeForMonth,
} from "@/lib/hdtn-curriculum";
import type { MeetingResult, MeetingTabProps } from "@/lib/types";

// MeetingTabProps is now imported from @/lib/types

export function MeetingTab({
    selectedMonth,
    setSelectedMonth,
    selectedSession,
    setSelectedSession,
    meetingKeyContent,
    setMeetingKeyContent,
    meetingConclusion,
    setMeetingConclusion,
    meetingResult,
    setMeetingResult,
    isGenerating,
    onGenerate,
    isExporting,
    onExport,
    copyToClipboard,
}: MeetingTabProps) {
    return (
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="meeting-month-select">Chọn Tháng</Label>
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                            name="meetingMonth"
                        >
                            <SelectTrigger id="meeting-month-select">
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

                    <div className="space-y-2">
                        <Label htmlFor="meeting-session-select">Lần họp</Label>
                        <Select
                            value={selectedSession}
                            onValueChange={setSelectedSession}
                            name="meetingSession"
                        >
                            <SelectTrigger id="meeting-session-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Lần 1 (đầu tháng)</SelectItem>
                                <SelectItem value="2">Lần 2 (cuối tháng)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Theme Info */}
                {selectedMonth && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                            Chủ đề tháng {selectedMonth}:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                                • Khối 10:{" "}
                                {getThemeForMonth("10", selectedMonth) || "N/A"}
                            </li>
                            <li>
                                • Khối 11:{" "}
                                {getThemeForMonth("11", selectedMonth) || "N/A"}
                            </li>
                            <li>
                                • Khối 12:{" "}
                                {getThemeForMonth("12", selectedMonth) || "N/A"}
                            </li>
                        </ul>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="meeting-key-content">Nội dung trọng tâm (tùy chọn)</Label>
                    <Textarea
                        id="meeting-key-content"
                        name="meetingKeyContent"
                        placeholder="VD: Triển khai hoạt động 20/11, tổ chức sinh hoạt chuyên môn theo nghiên cứu bài học, phân công giáo viên dự giờ, thảo luận về phương pháp dạy học tích cực..."
                        value={meetingKeyContent}
                        onChange={(e) => setMeetingKeyContent(e.target.value)}
                        rows={5}
                        className="resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                        Nhập các nội dung trọng tâm cần thảo luận trong cuộc họp. AI
                        sẽ phân tích và tạo biên bản chi tiết dựa trên nội dung này.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="meeting-conclusion">Kết luận cuộc họp (tùy chọn)</Label>
                    <Textarea
                        id="meeting-conclusion"
                        name="meetingConclusion"
                        placeholder="Nhập nội dung kết luận cuộc họp nếu có sẵn..."
                        value={meetingConclusion}
                        onChange={(e) => setMeetingConclusion(e.target.value)}
                        rows={5}
                        className="resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                        Nếu bạn có sẵn nội dung kết luận, hãy nhập vào đây. AI sẽ
                        tham khảo để tạo biên bản phù hợp.
                    </p>
                </div>

                {/* Generate Button */}
                <Button
                    onClick={onGenerate}
                    disabled={isGenerating || !selectedMonth}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white gap-2"
                    size="lg"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang tạo biên bản...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Tạo Biên bản AI
                        </>
                    )}
                </Button>

                {/* Results */}
                {meetingResult && (
                    <div className="space-y-4 mt-6">
                        <h3 className="font-semibold text-lg text-slate-800">
                            Kết quả tạo biên bản:
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-blue-700 font-medium">
                                        Nội dung chính:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(meetingResult.noi_dung_chinh || "")
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={meetingResult.noi_dung_chinh}
                                    onChange={(e) =>
                                        setMeetingResult({
                                            ...meetingResult,
                                            noi_dung_chinh: e.target.value,
                                        })
                                    }
                                    className="min-h-[150px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-orange-700 font-medium">
                                        Ưu điểm:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(meetingResult.uu_diem || "")
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={meetingResult.uu_diem}
                                    onChange={(e) =>
                                        setMeetingResult({
                                            ...meetingResult,
                                            uu_diem: e.target.value,
                                        })
                                    }
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-red-700 font-medium">
                                        Hạn chế:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(meetingResult.han_che || "")
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={meetingResult.han_che}
                                    onChange={(e) =>
                                        setMeetingResult({
                                            ...meetingResult,
                                            han_che: e.target.value,
                                        })
                                    }
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-blue-700 font-medium">
                                        Ý kiến đóng góp:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(meetingResult.y_kien_dong_gop || "")
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={meetingResult.y_kien_dong_gop}
                                    onChange={(e) =>
                                        setMeetingResult({
                                            ...meetingResult,
                                            y_kien_dong_gop: e.target.value,
                                        })
                                    }
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-blue-700 font-medium">
                                        Kế hoạch tháng tới:
                                    </Label>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyToClipboard(meetingResult.ke_hoach_thang_toi || "")
                                        }
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={meetingResult.ke_hoach_thang_toi}
                                    onChange={(e) =>
                                        setMeetingResult({
                                            ...meetingResult,
                                            ke_hoach_thang_toi: e.target.value,
                                        })
                                    }
                                    className="min-h-[100px]"
                                />
                            </div>

                            {meetingResult.ket_luan_cuoc_hop && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="font-medium text-purple-700">
                                            Kết luận cuộc họp
                                        </Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(
                                                    meetingResult.ket_luan_cuoc_hop || ""
                                                )
                                            }
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={meetingResult.ket_luan_cuoc_hop || ""}
                                        onChange={(e) =>
                                            setMeetingResult({
                                                ...meetingResult,
                                                ket_luan_cuoc_hop: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="bg-purple-50"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Export Button */}
                        <Button
                            onClick={onExport}
                            disabled={isExporting}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white gap-2"
                            size="lg"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang xuất file...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Xuất file Word
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
