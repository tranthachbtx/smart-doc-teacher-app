/**
 * ðŸŽ¯ SIMPLE LESSON PROCESSOR - BACK TO BASICS ARCHITECTURE 17.0
 * Chá»‰ 3 bÆ°á»›c: Upload PDF â†’ AI Process â†’ Download Word
 * HoÃ n toÃ n loáº¡i bá» sá»± phá»©c táº¡p cá»§a cÃ¡c phiÃªn báº£n trÆ°á»›c
 */

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SimpleLessonProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setResult(null);
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
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/process-lesson', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        setSuccess('âœ… ÄÃ£ táº¡o giÃ¡o Ã¡n thÃ nh cÃ´ng!');
        
        // Auto download Word file
        if (data.wordFile) {
          const byteArray = new Uint8Array(data.wordFile);
          const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `giao-an-${file.name.replace(/\.[^/.]+$/, "")}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
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
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Táº¡o GiÃ¡o Ãn Tá»± Äá»™ng
          </h1>
          <p className="text-slate-600">
            Back to Basics - Chá»‰ 3 bÆ°á»›c Ä‘Æ¡n giáº£n
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Architecture 17.0 - True Simplicity
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <FileText className="w-6 h-6" />
              Quy TrÃ¬nh 3 BÆ°á»›c
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* Step 1: Upload */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="font-semibold text-slate-800">Chá»n File GiÃ¡o Ãn CÅ©</h3>
              </div>
              
              <div className="ml-10">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <Upload className="w-6 h-6 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">
                      {file ? file.name : "Nháº¥n Ä‘á»ƒ chá»n file PDF hoáº·c DOCX"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {file ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : "Há»— trá»£ file PDF, DOCX tá»‘i Ä‘a 50MB"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 2: Process */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-semibold text-slate-800">Xá»­ LÃ½ Tá»± Äá»™ng</h3>
              </div>
              
              <div className="ml-10">
                <Button
                  onClick={handleProcess}
                  disabled={!file || processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Äang xá»­ lÃ½ giÃ¡o Ã¡n...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Táº¡o GiÃ¡o Ãn Tá»± Äá»™ng
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Step 3: Download */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="font-semibold text-slate-800">Táº£i Xuáº¥t File Word</h3>
              </div>
              
              <div className="ml-10">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Download className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    File Word sáº½ tá»± Ä‘á»™ng táº£i xuá»‘ng sau khi xá»­ lÃ½ xong
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {success && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        )}

        {/* Result Preview */}
        {result && result.lessonPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Káº¿t Quáº£ Xem TrÆ°á»›c</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">TiÃªu Ä‘á»:</span> {result.lessonPlan.title || 'GiÃ¡o Ã¡n'}
                </div>
                <div>
                  <span className="font-semibold">Lá»›p:</span> {result.lessonPlan.grade || 'N/A'}
                </div>
                {result.lessonPlan.objectives && (
                  <div>
                    <span className="font-semibold">Má»¥c tiÃªu:</span>
                    <ul className="ml-4 mt-1 list-disc">
                      {result.lessonPlan.objectives.map((obj: string, idx: number) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
