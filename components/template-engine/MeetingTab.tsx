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
                        <Label htmlFor="meeting-month-select">Chá»n ThÃ¡ng</Label>
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                            name="meetingMonth"
                        >
                            <SelectTrigger id="meeting-month-select">
                                <SelectValue placeholder="Chá»n thÃ¡ng..." />
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
                        <Label htmlFor="meeting-session-select">Láº§n há»p</Label>
                        <Select
                            value={selectedSession}
                            onValueChange={setSelectedSession}
                            name="meetingSession"
                        >
                            <SelectTrigger id="meeting-session-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Láº§n 1 (Ä‘áº§u thÃ¡ng)</SelectItem>
                                <SelectItem value="2">Láº§n 2 (cuá»‘i thÃ¡ng)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Theme Info */}
                {selectedMonth && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                            Chá»§ Ä‘á» thÃ¡ng {selectedMonth}:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                                â€¢ Khá»‘i 10:{" "}
                                {getThemeForMonth("10", selectedMonth) || "N/A"}
                            </li>
                            <li>
                                â€¢ Khá»‘i 11:{" "}
                                {getThemeForMonth("11", selectedMonth) || "N/A"}
                            </li>
                            <li>
                                â€¢ Khá»‘i 12:{" "}
                                {getThemeForMonth("12", selectedMonth) || "N/A"}
                            </li>
                        </ul>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="meeting-key-content">Ná»™i dung trá»ng tÃ¢m (tÃ¹y chá»n)</Label>
                    <Textarea
                        id="meeting-key-content"
                        name="meetingKeyContent"
                        placeholder="VD: Triá»ƒn khai hoáº¡t Ä‘á»™ng 20/11, tá»• chá»©c sinh hoáº¡t chuyÃªn mÃ´n theo nghiÃªn cá»©u bÃ i há»c, phÃ¢n cÃ´ng giÃ¡o viÃªn dá»± giá», tháº£o luáº­n vá» phÆ°Æ¡ng phÃ¡p dáº¡y há»c tÃ­ch cá»±c..."
                        value={meetingKeyContent}
                        onChange={(e) => setMeetingKeyContent(e.target.value)}
                        rows={5}
                        className="resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                        Nháº­p cÃ¡c ná»™i dung trá»ng tÃ¢m cáº§n tháº£o luáº­n trong cuá»™c há»p. AI
                        sáº½ phÃ¢n tÃ­ch vÃ  táº¡o biÃªn báº£n chi tiáº¿t dá»±a trÃªn ná»™i dung nÃ y.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="meeting-conclusion">Káº¿t luáº­n cuá»™c há»p (tÃ¹y chá»n)</Label>
                    <Textarea
                        id="meeting-conclusion"
                        name="meetingConclusion"
                        placeholder="Nháº­p ná»™i dung káº¿t luáº­n cuá»™c há»p náº¿u cÃ³ sáºµn..."
                        value={meetingConclusion}
                        onChange={(e) => setMeetingConclusion(e.target.value)}
                        rows={5}
                        className="resize-y"
                    />
                    <p className="text-xs text-muted-foreground">
                        Náº¿u báº¡n cÃ³ sáºµn ná»™i dung káº¿t luáº­n, hÃ£y nháº­p vÃ o Ä‘Ã¢y. AI sáº½
                        tham kháº£o Ä‘á»ƒ táº¡o biÃªn báº£n phÃ¹ há»£p.
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
                            Äang táº¡o biÃªn báº£n...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Táº¡o BiÃªn báº£n AI
                        </>
                    )}
                </Button>

                {/* Results */}
                {meetingResult && (
                    <div className="space-y-4 mt-6">
                        <h3 className="font-semibold text-lg text-slate-800">
                            Káº¿t quáº£ táº¡o biÃªn báº£n:
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-blue-700 font-medium">
                                        Ná»™i dung chÃ­nh:
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
                                        Æ¯u Ä‘iá»ƒm:
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
                                        Háº¡n cháº¿:
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
                                        Ã kiáº¿n Ä‘Ã³ng gÃ³p:
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
                                        Káº¿ hoáº¡ch thÃ¡ng tá»›i:
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
                                            Káº¿t luáº­n cuá»™c há»p
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
                                    Äang xuáº¥t file...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Xuáº¥t file Word
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
