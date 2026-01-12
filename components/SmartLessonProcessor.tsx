/**
 * ðŸŽ¯ SMART LESSON PROCESSOR 2.0 - ARCHITECTURE 18.0
 * NÃ¢ng cáº¥p hoÃ n chá»‰nh vá»›i database integration vÃ  advanced AI processing
 */

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle, Brain, Database } from 'lucide-react';

export default function SmartLessonProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setResult(null);
      setProcessingSteps([]);
    }
  };
  
  const handleProcess = async () => {
    if (!file) {
      setError('Vui lÃ²ng chá»n file PDF hoáº·c DOCX');
      return;
    }
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    setProcessingSteps(['Báº¯t Ä‘áº§u xá»­ lÃ½...']);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setProcessingSteps(prev => [...prev, 'Äang táº£i file lÃªn server...']);
      
      const response = await fetch('/api/process-lesson-enhanced', {
        method: 'POST',
        body: formData
      });
      
      setProcessingSteps(prev => [...prev, 'Äang xá»­ lÃ½ vá»›i AI...']);
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        setSuccess('âœ… ÄÃ£ táº¡o giÃ¡o Ã¡n thÃ nh cÃ´ng vá»›i Database Integration!');
        
        // Show processing steps
        if (data.processing_steps) {
          setProcessingSteps(prev => [...prev, ...data.processing_steps.map((step: any) => step.name)]);
        }
        
        setProcessingSteps(prev => [...prev, 'Äang táº¡o file Word...']);
        
        // Auto download Word file
        if (data.wordFile) {
          const byteArray = new Uint8Array(data.wordFile);
          const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `giao-an-thong-minh-${file.name.replace(/\.[^/.]+$/, "")}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        
        setProcessingSteps(prev => [...prev, 'âœ… HoÃ n thÃ nh!']);
      } else {
        setError(data.error || 'ÄÃ£ xáº£y ra lá»—i khi xá»­ lÃ½ giÃ¡o Ã¡n');
      }
    } catch (error) {
      console.error('Processing failed:', error);
      setError('âŒ Lá»—i káº¿t ná»‘i Ä‘áº¿n server. Vui lÃ²ng thá»­ láº¡i.');
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Smart Lesson Processor 2.0
          </h1>
          <p className="text-slate-600">
            Architecture 18.0 - Database Integration + Advanced AI
          </p>
          <div className="mt-4 inline-flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Database className="w-4 h-4" />
              Database Integration
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <Brain className="w-4 h-4" />
              Advanced AI Processing
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Táº¡o GiÃ¡o Ãn ThÃ´ng Minh
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Chá»n file PDF hoáº·c DOCX</p>
                <p className="text-sm text-gray-500">
                  Há»‡ thá»‘ng sáº½ phÃ¢n tÃ­ch ná»™i dung vÃ  tÃ­ch há»£p database giÃ¡o dá»¥c
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* File Info */}
            {file && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-sm">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            )}

            {/* Processing Steps */}
            {processingSteps.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Processing Steps:</h3>
                <div className="space-y-1">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Loader2 className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={handleProcess}
              disabled={!file || processing}
              className="w-full py-3 text-lg font-medium"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Äang xá»­ lÃ½ vá»›i AI...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Xá»­ lÃ½ vá»›i Database Integration
                </>
              )}
            </Button>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Result Preview */}
            {result && result.lessonPlan && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Káº¿t quáº£ xá»­ lÃ½:</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>TÃªn bÃ i:</strong> {result.lessonPlan.ten_bai}</div>
                  <div><strong>Má»¥c tiÃªu kiáº¿n thá»©c:</strong> {result.lessonPlan.muc_tieu_kien_thuc?.substring(0, 100)}...</div>
                  <div><strong>Má»¥c tiÃªu nÄƒng lá»±c:</strong> {result.lessonPlan.muc_tieu_nang_luc?.substring(0, 100)}...</div>
                  <div><strong>Confidence:</strong> {Math.round((result.lessonPlan.confidence || 0) * 100)}%</div>
                  <div><strong>Database Context:</strong> {result.lessonPlan.database_context_used ? 'âœ… ÄÃ£ sá»­ dá»¥ng' : 'âŒ KhÃ´ng sá»­ dá»¥ng'}</div>
                  <div><strong>Processing Time:</strong> {result.lessonPlan.processing_time}ms</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Database Integration</h3>
            </div>
            <p className="text-sm text-gray-600">
              TÃ­ch há»£p PPCT, chÆ°Æ¡ng trÃ¬nh giáº£ng dáº¡y, nÄƒng lá»±c sá»‘ vÃ  cÃ¡c database giÃ¡o dá»¥c khÃ¡c
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-green-600" />
              <h3 className="font-medium">Advanced AI</h3>
            </div>
            <p className="text-sm text-gray-600">
              Multi-step AI processing vá»›i context-aware generation vÃ  educational intelligence
            </p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium">Professional Output</h3>
            </div>
            <p className="text-sm text-gray-600">
              Káº¿t cáº¥u trÃºc 2 cá»™t theo ThÃ´ng tÆ° 5512 vÃ  export Word chuyÃªn nghiá»‡p
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
