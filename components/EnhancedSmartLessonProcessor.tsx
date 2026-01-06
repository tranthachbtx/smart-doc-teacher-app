/**
 * 🎯 ENHANCED SMART LESSON PROCESSOR - ARCHITECTURE 18.0
 * Nâng cấp hoàn chỉnh với đầy đủ 4 bước theo yêu cầu người dùng
 */

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  FileText,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  Brain,
  Database,
  Copy,
  BookOpen,
  Settings,
  Play,
  Save
} from 'lucide-react';
import { getChuDeListByKhoi, type PPCTChuDe } from '@/lib/data/ppct-database';
import { SmartPromptService } from '@/lib/services/smart-prompt-service';
import { ManualWorkflowService } from '@/lib/services/manual-workflow-service';
import { useToast } from '@/hooks/use-toast';

export default function EnhancedSmartLessonProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  // Configuration states
  const [grade, setGrade] = useState<string>("10");
  const [chuDeSo, setChuDeSo] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [selectedChuDe, setSelectedChuDe] = useState<PPCTChuDe | null>(null);

  // Analysis states
  const [pdfContent, setPdfContent] = useState<string>("");
  const [structuredContent, setStructuredContent] = useState<any>(null);
  const [databaseContext, setDatabaseContext] = useState<any>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [jsonResponse, setJsonResponse] = useState<string>("");
  const [filledTemplate, setFilledTemplate] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);

  const { toast } = useToast();

  // Get PPCT data for selected grade
  const chuDeList = getChuDeListByKhoi(grade);

  // Update topic when chuDe changes
  useEffect(() => {
    const chuDe = chuDeList.find(cd => cd.chu_de_so === Number(chuDeSo));
    if (chuDe) {
      setTopic(chuDe.ten);
      setSelectedChuDe(chuDe);
    } else {
      setSelectedChuDe(null);
    }
  }, [chuDeSo, chuDeList]);

  // Initialize modules when content is available
  useEffect(() => {
    if (pdfContent && modules.length === 0) {
      const initialModules = ManualWorkflowService.analyzeStructure(pdfContent, "2");
      setModules(initialModules);
    }
  }, [pdfContent, modules.length]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setProcessingSteps(['Đang tải file...']);

      try {
        // Extract PDF content
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/extract-pdf-content', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          setPdfContent(data.content);
          setStructuredContent(data.structured);
          setProcessingSteps(prev => [...prev, '✅ Phân tích PDF hoàn tất']);

          toast({
            title: "Phân tích thành công",
            description: `Đã trích xuất ${data.sections.length} phần nội dung từ PDF`
          });
        } else {
          throw new Error(data.error);
        }
      } catch (error: any) {
        console.error('PDF extraction failed:', error);
        setError(`Không thể phân tích file PDF: ${error.message || 'Lỗi không xác định'}`);
        toast({
          title: "Lỗi phân tích",
          description: error.message || "Đã xảy ra lỗi khi trích xuất nội dung PDF",
          variant: "destructive"
        });
      }
    }
  };

  const handleDatabaseIntegration = async () => {
    if (!grade || !topic) {
      setError('Vui lòng chọn khối và chủ đề trước khi tích hợp database');
      return;
    }

    setProcessingSteps(prev => [...prev, 'Đang tích hợp database...']);

    try {
      // Get smart data from database
      const smartData = await SmartPromptService.lookupSmartData(grade, topic, chuDeSo);
      setDatabaseContext(smartData);

      setProcessingSteps(prev => [...prev, '✅ Database integration hoàn tất']);

      toast({
        title: "Database Integration",
        description: `Đã tích hợp ${smartData.objectives ? 'PPCT' : ''}${smartData.digitalCompetency ? ', NLS' : ''} và các database khác`
      });
    } catch (error) {
      console.error('Database integration failed:', error);
      setError('Không thể tích hợp database. Vui lòng thử lại.');
    }
  };

  const handleGeneratePrompt = () => {
    if (!pdfContent || !databaseContext) {
      setError('Vui lòng upload PDF và tích hợp database trước khi tạo prompt');
      return;
    }

    setProcessingSteps(prev => [...prev, 'Đang tạo prompt thông minh...']);

    try {
      // Build final smart prompt using the service
      const prompt = SmartPromptService.buildFinalSmartPrompt(databaseContext, pdfContent);
      setGeneratedPrompt(prompt);

      setProcessingSteps(prev => [...prev, '✅ Đã tạo prompt thông minh']);

      toast({
        title: "Prompt Generated",
        description: "Đã thiết kế prompt tối ưu theo chuẩn 5512"
      });
    } catch (error) {
      console.error('Prompt generation failed:', error);
      setError('Không thể tạo prompt. Vui lòng thử lại.');
    }
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) {
      setError('Không có prompt để copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Đã sao chép",
        description: "Prompt đã được copy vào clipboard, hãy paste vào Gemini Pro"
      });
    } catch (error) {
      console.error('Copy failed:', error);
      setError('Không thể copy prompt');
    }
  };

  const handleProcessJsonResponse = () => {
    if (!jsonResponse) {
      setError('Vui lòng paste JSON response từ Gemini Pro');
      return;
    }

    try {
      // Parse JSON response
      const jsonData = JSON.parse(jsonResponse);

      // Fill template with JSON data
      const template = {
        ten_bai: jsonData.ten_bai || topic,
        muc_tieu_kien_thuc: jsonData.muc_tieu_kien_thuc || "",
        muc_tieu_nang_luc: jsonData.muc_tieu_nang_luc || "",
        muc_tieu_pham_chat: jsonData.muc_tieu_pham_chat || "",
        thiet_bi_day_hoc: jsonData.thiet_bi_day_hoc || "",
        shdc: jsonData.shdc || "",
        shl: jsonData.shl || "",
        hoat_dong_khoi_dong: jsonData.hoat_dong_khoi_dong || "",
        hoat_dong_kham_pha: jsonData.hoat_dong_kham_pha || "",
        hoat_dong_luyen_tap: jsonData.hoat_dong_luyen_tap || "",
        hoat_dong_van_dung: jsonData.hoat_dong_van_dung || "",
        ho_so_day_hoc: jsonData.ho_so_day_hoc || "",
        huong_dan_ve_nha: jsonData.huong_dan_ve_nha || ""
      };

      setFilledTemplate(template);
      setProcessingSteps(prev => [...prev, '✅ JSON đã được điền vào template']);

      toast({
        title: "Template Filled",
        description: "Đã điền nội dung từ JSON vào template KHBH"
      });
    } catch (error) {
      console.error('JSON parsing failed:', error);
      setError('JSON không hợp lệ. Vui lòng kiểm tra lại.');
    }
  };

  const handleExportWord = async () => {
    if (!filledTemplate) {
      setError('Vui lòng điền template trước khi xuất Word');
      return;
    }

    setProcessingSteps(prev => [...prev, 'Đang xuất file Word...']);

    try {
      const response = await fetch('/api/export-to-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filledTemplate)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `giao-an-${topic.replace(/\s+/g, '-')}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setProcessingSteps(prev => [...prev, '✅ Export Word hoàn tất']);

        toast({
          title: "Export Success",
          description: "File Word đã được tải xuống"
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Word export failed:', error);
      setError('Không thể xuất file Word. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Enhanced Smart Lesson Processor 18.0
          </h1>
          <p className="text-slate-600">
            Quy trình 4 bước: Upload → Database → Prompt → JSON → Word
          </p>
          <div className="mt-4 inline-flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <Database className="w-4 h-4 mr-1" />
              Database Integration
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              <Brain className="w-4 h-4 mr-1" />
              AI Processing
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800">
              <FileText className="w-4 h-4 mr-1" />
              5512 Compliance
            </Badge>
          </div>
        </div>

        {/* Configuration Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Bước 1: Cấu hình
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Khối lớp</label>
                <Select value={grade} onValueChange={setGrade}>
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
                <label className="text-sm font-medium">Chủ đề (PPCT)</label>
                <Select value={chuDeSo} onValueChange={setChuDeSo} disabled={!grade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                  <SelectContent>
                    {chuDeList.map((chuDe) => (
                      <SelectItem key={chuDe.chu_de_so} value={chuDe.chu_de_so.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-xs font-bold">
                            {chuDe.chu_de_so}
                          </span>
                          <span>{chuDe.ten}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tên bài học</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Tên bài học"
                />
              </div>
            </div>

            {selectedChuDe && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Phân bổ tiết học</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">SHDC</p>
                    <p className="font-bold text-blue-600">{selectedChuDe.shdc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">HĐGD</p>
                    <p className="font-bold text-green-600">{selectedChuDe.hdgd}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SHL</p>
                    <p className="font-bold text-amber-600">{selectedChuDe.shl}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Processing Steps */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Bước 2: Upload</TabsTrigger>
            <TabsTrigger value="database">Bước 3: Database</TabsTrigger>
            <TabsTrigger value="prompt">Bước 4: Prompt</TabsTrigger>
            <TabsTrigger value="json">Bước 5: JSON</TabsTrigger>
          </TabsList>

          {/* Step 2: Upload & Analysis */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload KHBH cũ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Chọn file PDF hoặc DOCX</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Hệ thống sẽ phân tích và trích xuất nội dung theo cấu trúc KHBH
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {pdfContent && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Nội dung đã trích xuất:</h4>
                    <div className="max-h-40 overflow-y-auto text-sm">
                      {pdfContent.substring(0, 500)}...
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleDatabaseIntegration}
                  disabled={!pdfContent || !grade || !topic}
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Tích hợp Database
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Database Integration */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {databaseContext ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Context từ Database:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Mục tiêu:</p>
                          <p className="text-sm">{databaseContext.objectives?.substring(0, 100)}...</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Năng lực số:</p>
                          <p className="text-sm">{databaseContext.digitalCompetency?.substring(0, 100)}...</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleGeneratePrompt} className="w-full">
                      <Brain className="w-4 h-4 mr-2" />
                      Tạo Prompt thông minh
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Chưa có dữ liệu database</p>
                    <p className="text-sm text-gray-400">Vui lòng hoàn thành Bước 2 trước</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Prompt Generation */}
          <TabsContent value="prompt">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Prompt cho Gemini Pro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Prompt đã tạo:</h4>
                        <Button size="sm" onClick={handleCopyPrompt}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Prompt
                        </Button>
                      </div>
                      <Textarea
                        value={generatedPrompt}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Hướng dẫn sử dụng:</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Copy prompt ở trên</li>
                        <li>Paste vào Gemini Pro hoặc ChatGPT</li>
                        <li>Nhận JSON response</li>
                        <li>Paste JSON vào Bước 5</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Chưa có prompt</p>
                    <p className="text-sm text-gray-400">Vui lòng hoàn thành Bước 3 trước</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 5: JSON Processing */}
          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  JSON Response & Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Paste JSON response từ Gemini Pro:</label>
                    <Textarea
                      value={jsonResponse}
                      onChange={(e) => setJsonResponse(e.target.value)}
                      placeholder="Paste JSON response ở đây..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  <Button onClick={handleProcessJsonResponse} disabled={!jsonResponse}>
                    <Play className="w-4 h-4 mr-2" />
                    Điền vào Template
                  </Button>
                </div>

                {filledTemplate && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Template đã điền:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Tên bài:</p>
                          <p>{filledTemplate.ten_bai}</p>
                        </div>
                        <div>
                          <p className="font-medium">Mục tiêu kiến thức:</p>
                          <p>{filledTemplate.muc_tieu_kien_thuc?.substring(0, 100)}...</p>
                        </div>
                        <div>
                          <p className="font-medium">Mục tiêu năng lực:</p>
                          <p>{filledTemplate.muc_tieu_nang_luc?.substring(0, 100)}...</p>
                        </div>
                        <div>
                          <p className="font-medium">Mục tiêu phẩm chất:</p>
                          <p>{filledTemplate.muc_tieu_pham_chat?.substring(0, 100)}...</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleExportWord} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Xuất file Word
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Processing Steps Status */}
        {processingSteps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {step.includes('✅') ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
