import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    BookOpen,
    ListOrdered,
    Info,
    Upload,
} from "lucide-react";
import type { TemplateData, AssessmentResult, AssessmentTabProps } from "@/lib/types";
import { ASSESSMENT_PRODUCT_TYPES } from "@/lib/prompts/assessment-prompts";

// AssessmentTabProps is now imported from @/lib/types

export function AssessmentTab({
    assessmentGrade,
    setAssessmentGrade,
    assessmentTerm,
    setAssessmentTerm,
    assessmentProductType,
    setAssessmentProductType,
    assessmentTopic,
    setAssessmentTopic,
    assessmentTemplate,
    onTemplateUpload,
    assessmentResult,
    setAssessmentResult,
    isGenerating,
    onGenerate,
    isExporting,
    onExport,
}: AssessmentTabProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình Kiểm tra</CardTitle>
                        <CardDescription>
                            Thiết lập thông tin cho kế hoạch kiểm tra định kỳ
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="assessment-grade-select">Khối lớp</Label>
                            <Select
                                value={assessmentGrade}
                                onValueChange={setAssessmentGrade}
                                name="assessmentGrade"
                            >
                                <SelectTrigger id="assessment-grade-select">
                                    <SelectValue placeholder="Chọn khối" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">Khối 10</SelectItem>
                                    <SelectItem value="11">Khối 11</SelectItem>
                                    <SelectItem value="12">Khối 12</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assessment-term-select">Kỳ đánh giá</Label>
                            <Select
                                value={assessmentTerm}
                                onValueChange={setAssessmentTerm}
                                name="assessmentTerm"
                            >
                                <SelectTrigger id="assessment-term-select">
                                    <SelectValue placeholder="Chọn kỳ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Giữa kì 1">Giữa kì 1</SelectItem>
                                    <SelectItem value="Cuối kì 1">Cuối kì 1</SelectItem>
                                    <SelectItem value="Giữa kì 2">Giữa kì 2</SelectItem>
                                    <SelectItem value="Cuối kì 2">Cuối kì 2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assessment-product-select">Loại sản phẩm</Label>
                            <Select
                                value={assessmentProductType}
                                onValueChange={setAssessmentProductType}
                                name="assessmentProductType"
                            >
                                <SelectTrigger id="assessment-product-select">
                                    <SelectValue placeholder="Chọn loại sản phẩm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(ASSESSMENT_PRODUCT_TYPES).map(([key, group]) => (
                                        <div key={key}>
                                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/30">
                                                {group.label}
                                            </div>
                                            {group.types.map((type) => (
                                                <SelectItem key={type} value={type} className="pl-6">
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assessment-topic-input">Chủ đề / Nội dung trọng tâm</Label>
                            <Input
                                id="assessment-topic-input"
                                name="assessmentTopic"
                                value={assessmentTopic || ""}
                                onChange={(e) => setAssessmentTopic(e.target.value)}
                                placeholder="VD: Chủ đề 3 - Xây dựng tình bạn..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assessment-template-upload">Mẫu văn bản (Tùy chọn)</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="file"
                                    accept=".docx"
                                    className="hidden"
                                    id="assessment-template-upload"
                                    name="assessmentTemplate"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onTemplateUpload(file);
                                    }}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                    onClick={() => document.getElementById("assessment-template-upload")?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {assessmentTemplate ? assessmentTemplate.name : "Tải mẫu lên (.docx)"}
                                </Button>
                            </div>
                        </div>

                        <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
                            onClick={onGenerate}
                            disabled={isGenerating || !assessmentGrade || !assessmentProductType || !assessmentTopic}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang nghiên cứu chương trình...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Tạo Kế hoạch Kiểm tra
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
                {assessmentResult ? (
                    <Card className="border-indigo-100 shadow-md">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <BookOpen className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-indigo-900">
                                            {typeof assessmentResult.ten_ke_hoach === 'string'
                                                ? assessmentResult.ten_ke_hoach
                                                : 'Kế hoạch kiểm tra'}
                                        </CardTitle>
                                        <CardDescription>
                                            Mục tiêu: {Array.isArray(assessmentResult.muc_tieu) ? assessmentResult.muc_tieu.length : 0} yêu cầu cần đạt
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button onClick={onExport} disabled={isExporting}>
                                    {isExporting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-4 w-4" />
                                    )}
                                    Xuất Word
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-indigo-500 font-bold">Tên kế hoạch</Label>
                                    <Input
                                        value={assessmentResult.ten_ke_hoach || ""}
                                        onChange={(e) => setAssessmentResult({ ...assessmentResult, ten_ke_hoach: e.target.value })}
                                        className="bg-white border-indigo-100 font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-indigo-500 font-bold">Hình thức tổ chức</Label>
                                    <Input
                                        value={assessmentResult.hinh_thuc_to_chuc || ""}
                                        onChange={(e) => setAssessmentResult({ ...assessmentResult, hinh_thuc_to_chuc: e.target.value })}
                                        className="bg-white border-indigo-100"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm uppercase">
                                        <ListOrdered className="h-4 w-4 text-indigo-600" />
                                        Ma trận / Đặc tả
                                    </h3>
                                    <Textarea
                                        value={typeof assessmentResult.ma_tran_dac_ta === 'string'
                                            ? assessmentResult.ma_tran_dac_ta
                                            : (Array.isArray(assessmentResult.ma_tran_dac_ta) ?
                                                assessmentResult.ma_tran_dac_ta.map((m: any) => `${m.muc_do}: ${m.mo_ta}`).join('\n') : "")
                                        }
                                        onChange={(e) => setAssessmentResult({ ...assessmentResult, ma_tran_dac_ta: e.target.value })}
                                        className="min-h-[200px] text-sm font-sans"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm uppercase">
                                        <BookOpen className="h-4 w-4 text-indigo-600" />
                                        Nhiệm vụ giao cho HS
                                    </h3>
                                    <Textarea
                                        value={typeof assessmentResult.noi_dung_nhiem_vu === 'string'
                                            ? assessmentResult.noi_dung_nhiem_vu
                                            : (assessmentResult.noi_dung_nhiem_vu ? JSON.stringify(assessmentResult.noi_dung_nhiem_vu, null, 2) : "")
                                        }
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            setAssessmentResult({ ...assessmentResult, noi_dung_nhiem_vu: e.target.value });
                                        }}
                                        className="min-h-[200px] text-sm font-sans"
                                    />
                                </div>
                            </div>

                            {/* Rubric Preview - Simplified Editable Version */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-indigo-600" />
                                    Công cụ đánh giá (Rubric / Bảng kiểm)
                                </h3>
                                <Textarea
                                    value={assessmentResult.rubric_text || (assessmentResult.bang_kiem_rubric ?
                                        (Array.isArray(assessmentResult.bang_kiem_rubric) ?
                                            assessmentResult.bang_kiem_rubric.map((r: any) =>
                                                `TIÊU CHÍ: ${r.tieu_chi} (${r.trong_so})\n` +
                                                `- Xuất sắc: ${r.muc_do?.xuat_sac || '...'}\n` +
                                                `- Tốt: ${r.muc_do?.tot || '...'}\n` +
                                                `- Đạt: ${r.muc_do?.dat || '...'}\n` +
                                                `- Chưa đạt: ${r.muc_do?.chua_dat || '...'}\n`
                                            ).join('\n') : JSON.stringify(assessmentResult.bang_kiem_rubric, null, 2)) : "")}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                        setAssessmentResult({ ...assessmentResult, rubric_text: e.target.value });
                                    }}
                                    className="min-h-[400px] text-sm font-sans bg-white border-indigo-100"
                                    placeholder="Nội dung Rubric chi tiết..."
                                />
                                <p className="text-xs text-muted-foreground italic">
                                    * Bạn có thể chỉnh sửa văn bản trên. Khi xuất Word, hệ thống sẽ sử dụng nội dung đã hiển thị trong ô này.
                                </p>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
                                <Info className="h-5 w-5 text-yellow-600 shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-yellow-800 text-sm">Lời khuyên chuyên môn</h4>
                                    <Textarea
                                        value={typeof assessmentResult.loi_khuyen === 'string' ? assessmentResult.loi_khuyen : JSON.stringify(assessmentResult.loi_khuyen)}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            setAssessmentResult({ ...assessmentResult, loi_khuyen: e.target.value });
                                        }}
                                        className="mt-1 text-sm bg-transparent border-yellow-200"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                        <div className="bg-indigo-50 p-4 rounded-full mb-4">
                            <Sparkles className="h-8 w-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            Chưa có kế hoạch kiểm tra
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            Chọn kỳ đánh giá, loại sản phẩm và chủ đề ở cột bên trái, sau đó nhấn "Tạo Kế hoạch" để AI thiết kế ma trận và rubric.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
