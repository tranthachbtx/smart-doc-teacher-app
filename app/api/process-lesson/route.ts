/**
 * 🎯 SIMPLE LESSON PROCESSOR API - BACK TO BASICS ARCHITECTURE 17.0
 * API endpoint đơn giản cho việc xử lý giáo án
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractPDFContent } from '@/lib/simple-pdf-extractor';
import { callAIWithRetry } from '@/lib/simple-ai-caller';
import { parseJSONResponse, LessonPlanData } from '@/lib/simple-json-parser';
import { exportToWord } from '@/lib/simple-word-exporter';

export async function POST(request: NextRequest) {
  console.log('[SIMPLE-API] Processing lesson request...');
  
  try {
    // Step 1: Get file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng chọn file PDF hoặc DOCX' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File quá lớn. Vui lòng chọn file nhỏ hơn 50MB' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Chỉ hỗ trợ file PDF và DOCX' },
        { status: 400 }
      );
    }
    
    console.log(`[SIMPLE-API] Processing file: ${file.name} (${file.size} bytes)`);
    
    // Step 2: Extract content from file
    let pdfContent: string;
    try {
      pdfContent = await extractPDFContent(file);
      console.log(`[SIMPLE-API] Extracted ${pdfContent.length} characters from file`);
    } catch (error) {
      console.error('[SIMPLE-API] PDF extraction failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể trích xuất nội dung từ file. Vui lòng kiểm tra lại file.' },
        { status: 400 }
      );
    }
    
    // Step 3: Generate lesson plan with AI
    let aiResponse: string;
    try {
      const prompt = `
BẠN LÀ CHUYÊN GIA BIÊN SOẠN GIÁO ÁN THEO THÔNG TƯ 5512 CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO VIỆT NAM.

NỘI DUNG TÀI LIỆU GỐC:
${pdfContent}

YÊU CẦU:
1. Phân tích nội dung tài liệu gốc
2. Tạo giáo án hoàn chỉnh theo chuẩn Thông tư 5512
3. Bao gồm đầy đủ các phần: Mục tiêu, Hoạt động dạy học, Kiểm tra đánh giá
4. Nội dung chi tiết, rõ ràng, phù hợp với thực tiễn
5. Trả về định dạng JSON với cấu trúc sau:

{
  "title": "Tiêu đề giáo án",
  "grade": "Lớp học",
  "objectives": ["Mục tiêu 1", "Mục tiêu 2", "Mục tiêu 3"],
  "activities": ["Hoạt động 1", "Hoạt động 2", "Hoạt động 3"],
  "assessment": ["Kiểm tra 1", "Kiểm tra 2"]
}

LƯU Ý:
- Trả về JSON hợp lệ, không có markdown
- Mục tiêu phải rõ ràng, đo lường được
- Hoạt động phải cụ thể, có tính thực tiễn
- Kiểm tra đánh giá phù hợp với mục tiêu
      `;
      
      aiResponse = await callAIWithRetry(prompt, 3);
      console.log(`[SIMPLE-API] AI response received (${aiResponse.length} characters)`);
    } catch (error) {
      console.error('[SIMPLE-API] AI call failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể kết nối đến AI. Vui lòng thử lại sau.' },
        { status: 500 }
      );
    }
    
    // Step 4: Parse AI response
    let lessonPlan: LessonPlanData;
    try {
      lessonPlan = parseJSONResponse(aiResponse);
      console.log('[SIMPLE-API] Successfully parsed lesson plan:', lessonPlan.title);
    } catch (error) {
      console.error('[SIMPLE-API] JSON parsing failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể xử lý phản hồi từ AI. Vui lòng thử lại.' },
        { status: 500 }
      );
    }
    
    // Step 5: Export to Word
    let wordBuffer: Buffer;
    try {
      wordBuffer = await exportToWord(lessonPlan);
      console.log(`[SIMPLE-API] Word document generated (${wordBuffer.length} bytes)`);
    } catch (error) {
      console.error('[SIMPLE-API] Word export failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể tạo file Word. Vui lòng thử lại.' },
        { status: 500 }
      );
    }
    
    // Step 6: Return success response
    const response = {
      success: true,
      lessonPlan: {
        title: lessonPlan.title,
        grade: lessonPlan.grade,
        objectives: lessonPlan.objectives,
        activities: lessonPlan.activities,
        assessment: lessonPlan.assessment
      },
      wordFile: Array.from(wordBuffer),
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        processedAt: new Date().toISOString(),
        contentLength: pdfContent.length,
        aiResponseLength: aiResponse.length,
        wordFileSize: wordBuffer.length
      }
    };
    
    console.log('[SIMPLE-API] Processing completed successfully');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('[SIMPLE-API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    message: 'Simple Lesson Processor API - Back to Basics Architecture 17.0',
    version: '17.0.0',
    endpoints: {
      'POST /': 'Process lesson file and generate Word document'
    },
    usage: {
      method: 'POST',
      contentType: 'multipart/form-data',
      body: {
        file: 'PDF or DOCX file (max 50MB)'
      }
    }
  });
}
