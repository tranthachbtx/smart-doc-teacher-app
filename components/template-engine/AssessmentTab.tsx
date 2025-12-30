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
import type { TemplateData } from "@/lib/types";
import { ASSESSMENT_PRODUCT_TYPES } from "@/lib/prompts/assessment-prompts";

interface AssessmentTabProps {
    assessmentGrade: string;
    setAssessmentGrade: (value: string) => void;
    assessmentTerm: string;
    setAssessmentTerm: (value: string) => void;
    assessmentProductType: string;
    setAssessmentProductType: (value: string) => void;
    assessmentTopic: string;
    setAssessmentTopic: (value: string) => void;
    assessmentTemplate: TemplateData | null;
    onTemplateUpload: (file: File) => void;
    assessmentResult: any;
    isGenerating: boolean;
    onGenerate: () => void;
    isExporting: boolean;
    onExport: () => void;
}

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
                            <Label>Khối lớp</Label>
                            <Select
                                value={assessmentGrade}
                                onValueChange={setAssessmentGrade}
                            >
                                <SelectTrigger>
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
                            <Label>Kỳ đánh giá</Label>
                            <Select
                                value={assessmentTerm}
                                onValueChange={setAssessmentTerm}
                            >
                                <SelectTrigger>
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
                            <Label>Loại sản phẩm</Label>
                            <Select
                                value={assessmentProductType}
                                onValueChange={setAssessmentProductType}
                            >
                                <SelectTrigger>
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
                            <Label>Chủ đề / Nội dung trọng tâm</Label>
                            <Input
                                value={assessmentTopic}
                                onChange={(e) => setAssessmentTopic(e.target.value)}
                                placeholder="VD: Chủ đề 3 - Xây dựng tình bạn..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Mẫu văn bản (Tùy chọn)</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="file"
                                    accept=".docx"
                                    className="hidden"
                                    id="assessment-template-upload"
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
                            disabled={isGenerating || !assessmentGrade || !assessmentProductType}
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
                                            {assessmentResult.ten_ke_hoach}
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
                            {/* Tasks */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <ListOrdered className="h-4 w-4 text-indigo-600" />
                                    Nội dung nhiệm vụ giao cho học sinh
                                </h3>
                                <div className="grid gap-4">
                                    {(assessmentResult.nhiem_vu || []).map((nv: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <div className="font-medium text-slate-900 mb-1">{idx + 1}. {nv.ten_nhiem_vu || nv.yeu_cau}</div>
                                            <div className="text-sm text-slate-600 mb-2">{nv.mo_ta}</div>
                                            <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded inline-block">
                                                Tiêu chí: {nv.tieu_chi_danh_gia}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rubric Preview */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-indigo-600" />
                                    Công cụ đánh giá (Rubric)
                                </h3>
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100 text-slate-700">
                                            <tr>
                                                <th className="p-2 text-left border-r">Tiêu chí</th>
                                                <th className="p-2 text-center border-r">Mức 1 (Đạt)</th>
                                                <th className="p-2 text-center border-r">Mức 2 (Khá)</th>
                                                <th className="p-2 text-center">Mức 3 (Tốt)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {(assessmentResult.cong_cu_danh_gia?.rubric || []).slice(0, 3).map((r: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="p-2 border-r font-medium">{r.tieu_chi}</td>
                                                    <td className="p-2 border-r text-slate-600">{r.muc_1}</td>
                                                    <td className="p-2 border-r text-slate-600">{r.muc_2}</td>
                                                    <td className="p-2 text-slate-600">{r.muc_3}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {(assessmentResult.cong_cu_danh_gia?.rubric || []).length > 3 && (
                                        <div className="text-center p-2 text-xs text-muted-foreground bg-slate-50">
                                            ... và {(assessmentResult.cong_cu_danh_gia?.rubric || []).length - 3} tiêu chí khác
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
                                <Info className="h-5 w-5 text-yellow-600 shrink-0" />
                                <div>
                                    <h4 className="font-medium text-yellow-800 text-sm">Lời khuyên chuyên môn</h4>
                                    <p className="text-sm text-yellow-700 mt-1">{assessmentResult.loi_khuyen}</p>
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
