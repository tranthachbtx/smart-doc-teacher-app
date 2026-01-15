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
import { Sparkles, Download, Loader2, Copy, Clock, AlertCircle } from "lucide-react";
import type { EventResult, EventTabProps } from "@/lib/types";
import { getChuDeListByKhoi, type PPCTChuDe } from "@/lib/data/ppct-database";

// Safety helper to render potentially nested objects from AI
const formatAIValue = (val: any): React.ReactNode => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return val.toString();
  if (Array.isArray(val)) {
    return (
      <ul className="list-disc list-inside space-y-1">
        {val.map((item, i) => (
          <li key={i}>{formatAIValue(item)}</li>
        ))}
      </ul>
    );
  }
  if (typeof val === "object") {
    return (
      <div className="space-y-1">
        {Object.entries(val).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold">{key}:</span> {formatAIValue(value)}
          </div>
        ))}
      </div>
    );
  }
  return String(val);
};

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
  eventDuration,
  setEventDuration,
  eventResult,
  setEventResult,
  isGenerating,
  onGenerate,
  isExporting,
  onExport,
  copyToClipboard,
}: EventTabProps) {
  // State for selected chu de details
  const [selectedChuDe, setSelectedChuDe] = React.useState<PPCTChuDe | null>(
    null
  );

  const { getTopicSuggestion } = require("@/lib/data/event-dna-database");
  const suggestion = React.useMemo(() => {
    return selectedGradeEvent && selectedEventMonth
      ? getTopicSuggestion(selectedGradeEvent, parseInt(selectedEventMonth))
      : null;
  }, [selectedGradeEvent, selectedEventMonth]);

  const smartPlaceholder = suggestion?.smart_suggestion
    ? `Gợi ý: ${suggestion.smart_suggestion}`
    : "Nhập yêu cầu chi tiết hoặc điều chỉnh về nội dung kế hoạch...";

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
            <Label htmlFor="event-grade-select">Chọn Khối</Label>
            <Select
              value={selectedGradeEvent}
              onValueChange={(value) => {
                setSelectedGradeEvent(value);
                setSelectedEventMonth("");
                setAutoFilledTheme("");
                setSelectedChuDe(null);
              }}
              name="eventGrade"
            >
              <SelectTrigger id="event-grade-select">
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
            <Label htmlFor="event-topic-select">Chọn Chủ Đề</Label>
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
              name="eventMonth"
            >
              <SelectTrigger id="event-topic-select">
                <SelectValue
                  placeholder={
                    selectedGradeEvent ? "Chọn chủ đề..." : "Chọn khối trước"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {chuDeList.map((chuDe) => (
                  <SelectItem
                    key={chuDe.chu_de_so}
                    value={chuDe.chu_de_so.toString()}
                  >
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
                <strong>Thời gian:</strong> Tuần {selectedChuDe.tuan_bat_dau} -
                Tuần {selectedChuDe.tuan_ket_thuc}
              </p>
            )}
          </div>
        )}

        {/* Event Duration */}
        <div className="space-y-2">
          <Label
            htmlFor="event-duration-input"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4 text-purple-600" />
            Thời lượng hoạt động
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="event-duration-input"
              name="eventDuration"
              type="number"
              min="15"
              max="240"
              value={eventDuration || ""}
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
                className={
                  eventDuration === "45"
                    ? "bg-purple-100 border-purple-300"
                    : ""
                }
              >
                45p
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEventDuration("90")}
                className={
                  eventDuration === "90"
                    ? "bg-purple-100 border-purple-300"
                    : ""
                }
              >
                90p
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEventDuration("120")}
                className={
                  eventDuration === "120"
                    ? "bg-purple-100 border-purple-300"
                    : ""
                }
              >
                2h
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEventDuration("180")}
                className={
                  eventDuration === "180"
                    ? "bg-purple-100 border-purple-300"
                    : ""
                }
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
          <Label htmlFor="event-budget-textarea">
            Dự toán kinh phí (tùy chọn)
          </Label>
          <Textarea
            id="event-budget-textarea"
            name="eventBudget"
            placeholder="Nhập dự toán kinh phí nếu cần...&#10;VD: Banner: 500.000đ, Phần thưởng: 1.000.000đ..."
            value={eventBudget || ""}
            onChange={(e) => setEventBudget(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Để trống nếu không cần dự toán kinh phí
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-checklist-textarea">
            Checklist chuẩn bị (tùy chọn)
          </Label>
          <Textarea
            id="event-checklist-textarea"
            name="eventChecklist"
            placeholder="Nhập các công việc cần chuẩn bị...&#10;VD: In ấn tài liệu, Chuẩn bị phòng họp..."
            value={eventChecklist || ""}
            onChange={(e) => setEventChecklist(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-instructions-textarea">Yêu cầu bổ sung</Label>
          <Textarea
            id="event-instructions-textarea"
            name="eventInstructions"
            placeholder={smartPlaceholder}
            value={eventCustomInstructions || ""}
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
              <h3 className="text-lg font-semibold text-slate-800">Kết quả</h3>
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
                  {eventResult.ten_chu_de || eventResult.ten_ke_hoach || eventResult.title || "Kế hoạch ngoại khoa"}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>Thời gian:</strong> {eventResult.thoi_gian}
                  </p>
                  <p>
                    <strong>Địa điểm:</strong> {eventResult.dia_diem}
                  </p>
                  <p>
                    <strong>Đối tượng:</strong> {eventResult.doi_tuong || eventResult.grade || "..."}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {eventResult.so_luong || "Toàn khối"}
                  </p>
                </div>
              </div>

              {/* Objectives */}
              {(eventResult.muc_dich_yeu_cau || eventResult.muc_tieu) && (
                <div className="p-3 bg-white rounded border">
                  <h5 className="font-bold text-sm mb-2 text-purple-700 uppercase">I. MỤC TIÊU - YÊU CẦU:</h5>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {formatAIValue(eventResult.muc_dich_yeu_cau || eventResult.muc_tieu)}
                  </div>
                  {(eventResult.nang_luc || eventResult.pham_chat) && (
                    <div className="mt-3 pt-3 border-t border-dashed space-y-2">
                      {eventResult.nang_luc && <p className="text-sm"><strong>Năng lực:</strong> {formatAIValue(eventResult.nang_luc)}</p>}
                      {eventResult.pham_chat && <p className="text-sm"><strong>Phẩm chất:</strong> {formatAIValue(eventResult.pham_chat)}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Organization Prep */}
              {(eventResult.chuan_bi || eventResult.preparation) && (
                <div className="p-3 bg-white rounded border">
                  <h5 className="font-bold text-sm mb-2 text-purple-700 uppercase">
                    II. TỔ CHỨC THỰC HIỆN (CHUẨN BỊ):
                  </h5>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">
                    {formatAIValue(eventResult.chuan_bi || eventResult.preparation)}
                  </div>
                </div>
              )}

              {/* Timeline (New 2-Column Structure) */}
              {(eventResult.timeline && Array.isArray(eventResult.timeline)) && (
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                  <h5 className="font-bold text-sm mb-3 text-purple-900 flex items-center gap-2 uppercase">
                    <Sparkles className="w-4 h-4 text-purple-600" /> III. NỘI DUNG VÀ HÌNH THỨC THỰC HIỆN:
                  </h5>
                  <div className="space-y-4">
                    {eventResult.timeline.map((act: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2 border-b pb-2">
                          <span className="font-bold text-purple-800">{act.activity_name}</span>
                          <span className="text-xs font-mono bg-purple-100 px-2 py-0.5 rounded text-purple-700">{act.time}</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                          <p><strong>Mô tả:</strong> {act.description}</p>
                          {act.mc_script && (
                            <div className="bg-slate-50 p-2 rounded border-l-4 border-purple-400 italic">
                              <span className="text-purple-600 font-bold not-italic">🎤 MC Script:</span> "{act.mc_script}"
                            </div>
                          )}
                          {act.logistics && <p className="text-xs text-slate-500">📦 Chuẩn bị: {act.logistics}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget Details */}
              {(eventResult.budget_details && Array.isArray(eventResult.budget_details)) && (
                <div className="p-3 bg-white rounded border">
                  <h5 className="font-bold text-sm mb-2 text-purple-700 uppercase">IV. KINH PHÍ THỰC HIỆN:</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="border-b bg-slate-50">
                          <th className="p-2">Hạng mục</th>
                          <th className="p-2 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventResult.budget_details.map((b: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{b.item}</td>
                            <td className="p-2 text-right">{parseInt(b.cost).toLocaleString('vi-VN')} đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-right font-bold text-purple-800">
                    TỔNG CỘNG: {eventResult.total_budget}
                  </p>
                </div>
              )}

              {/* Closing Message */}
              {eventResult.thong_diep_ket_thuc && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <h5 className="font-bold text-sm mb-2 text-indigo-900 uppercase">Thông điệp kết thúc:</h5>
                  <div className="text-sm text-indigo-800 italic">
                    {formatAIValue(eventResult.thong_diep_ket_thuc)}
                  </div>
                </div>
              )}

              {/* Interaction activities (Minigames/TikTok) */}
              {eventResult.interaction && (
                <div className="p-3 bg-pink-50 border border-pink-100 rounded-lg">
                  <h5 className="font-bold text-sm mb-2 text-pink-900 uppercase">Hoạt động tương tác:</h5>
                  <div className="text-sm text-pink-800 whitespace-pre-wrap">
                    {formatAIValue(eventResult.interaction)}
                  </div>
                </div>
              )}

              {/* Footer Admin (Participants/Implementation) */}
              {eventResult.footer_admin && (
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl mt-4 font-serif">
                  <h5 className="font-bold text-xs mb-2 text-slate-500 uppercase tracking-widest">Thông tin hành chính & Ký duyệt:</h5>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap">
                    {formatAIValue(eventResult.footer_admin)}
                  </div>
                </div>
              )}

              {/* Funding Text */}
              {eventResult.kinh_phi && (
                <div className="p-3 bg-white rounded border">
                  <h5 className="font-medium text-sm mb-2">
                    Kinh phí thực hiện:
                  </h5>
                  <div className="text-sm text-slate-600">
                    {formatAIValue(eventResult.kinh_phi)}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {eventResult.checklist_chuan_bi &&
                eventResult.checklist_chuan_bi.length > 0 && (
                  <div className="p-3 bg-white rounded border">
                    <h5 className="font-medium text-sm mb-2">
                      Công việc chuẩn bị:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {eventResult.checklist_chuan_bi.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Budget */}
              {eventResult.du_toan_kinh_phi &&
                eventResult.du_toan_kinh_phi.length > 0 && (
                  <div className="p-3 bg-white rounded border">
                    <h5 className="font-medium text-sm mb-2">
                      Dự toán kinh phí:
                    </h5>
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
