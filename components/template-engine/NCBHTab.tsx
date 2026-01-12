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
                        <Label htmlFor="ncbh-grade-select">Khá»‘i</Label>
                        <Select value={ncbhGrade} onValueChange={setNcbhGrade} name="ncbhGrade">
                            <SelectTrigger id="ncbh-grade-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">Khá»‘i 10</SelectItem>
                                <SelectItem value="11">Khá»‘i 11</SelectItem>
                                <SelectItem value="12">Khá»‘i 12</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ncbh-month-select">Chá»§ Ä‘á» (ThÃ¡ng)</Label>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth} name="ncbhMonth">
                            <SelectTrigger id="ncbh-month-select">
                                <SelectValue placeholder="Chá»n chá»§ Ä‘á»..." />
                            </SelectTrigger>
                            <SelectContent>
                                {ACADEMIC_MONTHS.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {themes[m.value] || `ThÃ¡ng ${m.value}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ncbh-topic-select">TÃªn bÃ i há»c nghiÃªn cá»©u</Label>
                    <Select
                        value={filteredPpctItems.some(item => item.theme === ncbhTopic) ? ncbhTopic : (ncbhTopic ? "Tá»± nháº­p" : "")}
                        onValueChange={(v) => {
                            if (v !== "Tá»± nháº­p") setNcbhTopic(v);
                            else if (ncbhTopic === "") setNcbhTopic("");
                        }}
                        name="ncbhTopic"
                    >
                        <SelectTrigger id="ncbh-topic-select">
                            <SelectValue placeholder="Chá»n bÃ i dáº¡y tá»« PPCT..." />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredPpctItems.map((item, idx) => (
                                <SelectItem key={idx} value={item.theme}>
                                    {item.theme}
                                </SelectItem>
                            ))}
                            <SelectItem value="Tá»± nháº­p">--- Tá»± nháº­p tÃªn bÃ i ---</SelectItem>
                        </SelectContent>
                    </Select>

                    {(ncbhTopic === "" || !filteredPpctItems.some(item => item.theme === ncbhTopic)) && (
                        <Textarea
                            id="ncbh-topic-custom"
                            name="ncbhTopicCustom"
                            placeholder="VD: Giao tiáº¿p tá»± tin trong cÃ¡c má»‘i quan há»‡ (CÃ¡nh Diá»u/Káº¿t ná»‘i Tri thá»©c)..."
                            value={ncbhTopic}
                            onChange={(e) => setNcbhTopic(e.target.value)}
                            className="mt-2"
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ncbh-instructions">Ghi chÃº/TÃ¬nh huá»‘ng quan sÃ¡t (náº¿u cÃ³)</Label>
                    <Textarea
                        id="ncbh-instructions"
                        name="ncbhInstructions"
                        placeholder="VD: Em Nam tá»• 2 gá»¥c Ä‘áº§u khi tháº£o luáº­n nhÃ³m. Má»™t sá»‘ há»c sinh lÃºng tÃºng khi xá»­ lÃ½ tÃ¬nh huá»‘ng sáº¯m vai..."
                        value={ncbhCustomInstructions}
                        onChange={(e) => setNcbhCustomInstructions(e.target.value)}
                        rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                        AI sáº½ dá»±a trÃªn cÃ¡c thÃ´ng tin nÃ y Ä‘á»ƒ táº¡o biÃªn báº£n tháº£o luáº­n NCBH thá»±c táº¿ hÆ¡n.
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
                            Äang phÃ¢n tÃ­ch bÃ i há»c...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Táº¡o Há»“ sÆ¡ & BiÃªn báº£n NCBH
                        </>
                    )}
                </Button>

                {ncbhResult && (
                    <div className="space-y-6 mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h3 className="font-bold text-lg text-slate-800 uppercase">
                                Há»“ sÆ¡ NghiÃªn cá»©u bÃ i há»c
                            </h3>
                            <Button
                                onClick={onExport}
                                disabled={isExporting}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Xuáº¥t Word
                            </Button>
                        </div>

                        <div className="space-y-6">
                            {/* Part 1: Design */}
                            <div className="space-y-3">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                                    GIAI ÄOáº N 1: THIáº¾T Káº¾ BÃ€I Dáº Y Táº¬P THá»‚
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">LÃ½ do chá»n bÃ i</Label>
                                        <Textarea readOnly value={ncbhResult.ly_do_chon} className="bg-white text-sm" rows={4} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">Má»¥c tiÃªu bÃ i há»c</Label>
                                        <Textarea readOnly value={ncbhResult.muc_tieu} className="bg-white text-sm" rows={4} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500">Chuá»—i hoáº¡t Ä‘á»™ng thá»‘ng nháº¥t</Label>
                                    <Textarea readOnly value={ncbhResult.chuoi_hoat_dong} className="bg-white text-sm" rows={6} />
                                </div>
                            </div>

                            {/* Part 2: Analysis */}
                            <div className="space-y-3 pt-4 border-t border-slate-200">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                    GIAI ÄOáº N 2 & 3: BIÃŠN Báº¢N PHÃ‚N TÃCH BÃ€I Há»ŒC
                                </h4>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500">Chia sáº» cá»§a giÃ¡o viÃªn dáº¡y</Label>
                                    <Textarea readOnly value={ncbhResult.chia_se_nguoi_day} className="bg-white text-sm" rows={3} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-slate-500">Minh chá»©ng viá»‡c há»c (NgÆ°á»i dá»± ghi nháº­n)</Label>
                                    <Textarea readOnly value={ncbhResult.nhan_xet_nguoi_du} className="bg-white text-sm" rows={4} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">NguyÃªn nhÃ¢n & Giáº£i phÃ¡p Ä‘iá»u chá»‰nh</Label>
                                        <Textarea readOnly value={ncbhResult.nguyen_nhan_giai_phap} className="bg-white text-sm" rows={4} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs uppercase text-slate-500">BÃ i há»c kinh nghiá»‡m rÃºt ra</Label>
                                        <Textarea readOnly value={ncbhResult.bai_hoc_kinh_nghiem} className="bg-white text-sm" rows={4} />
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
                                Táº£i xuá»‘ng Há»“ sÆ¡ NCBH (.docx)
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
