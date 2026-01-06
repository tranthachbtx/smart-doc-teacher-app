/**
 * 🎯 ENHANCED LESSON PROCESSOR API - ARCHITECTURE 18.0
 * API endpoint với database integration và advanced AI processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancedPDFExtractor, type AnalyzedPDFContent } from '@/lib/enhanced-pdf-extractor';
import { databaseIntegrationService, type LessonContext } from '@/lib/database-integration-service';
import { advancedAIProcessor, type StructuredLessonPlan } from '@/lib/advanced-ai-processor';
import { exportToWord } from '@/lib/simple-word-exporter';

export async function POST(request: NextRequest) {
  console.log('[ENHANCED-API] Processing lesson request with Database Integration...');

  try {
    // Step 1: Get file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const grade = (formData.get('grade') as string) || '10';
    const topic = (formData.get('topic') as string) || '';
    const chuDeSo = (formData.get('chuDeSo') as string) || '';
    const oldLessonContent = (formData.get('oldLessonContent') as string) || '';

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

    console.log(`[ENHANCED-API] Processing file: ${file.name} (${file.size} bytes)`);

    // Step 2: Enhanced PDF extraction and analysis
    let pdfContent: AnalyzedPDFContent;
    try {
      pdfContent = await enhancedPDFExtractor.extractAndAnalyzePDF(file);
      console.log(`[ENHANCED-API] PDF analysis complete: ${pdfContent.sections.length} sections found`);
    } catch (error) {
      console.error('[ENHANCED-API] PDF analysis failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể phân tích file PDF. Vui lòng kiểm tra lại file.' },
        { status: 400 }
      );
    }

    // Step 3: Get database context
    let context: LessonContext;
    try {
      context = await databaseIntegrationService.getContextForLesson(
        grade,
        topic || pdfContent.metadata.title || 'Bài học',
        chuDeSo || undefined,
        oldLessonContent
      );
      console.log(`[ENHANCED-API] Database context retrieved: ${context.referenceMaterials.length} reference materials`);
    } catch (error) {
      console.error('[ENHANCED-API] Database context failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể lấy context từ database. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Step 4: Advanced AI processing
    let lessonPlan: StructuredLessonPlan;
    try {
      lessonPlan = await advancedAIProcessor.processLessonWithAI(
        pdfContent,
        context,
        oldLessonContent
      );
      console.log(`[ENHANCED-API] AI processing complete: confidence ${Math.round(lessonPlan.confidence * 100)}%`);
    } catch (error) {
      console.error('[ENHANCED-API] AI processing failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể xử lý với AI. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Step 5: Export to Word
    let wordBuffer: Buffer;
    try {
      wordBuffer = await exportToWord(lessonPlan);
      console.log(`[ENHANCED-API] Word document generated (${wordBuffer.length} bytes)`);
    } catch (error) {
      console.error('[ENHANCED-API] Word export failed:', error);
      return NextResponse.json(
        { success: false, error: 'Không thể tạo file Word. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Step 6: Return comprehensive response
    const response = {
      success: true,
      lessonPlan: {
        ten_bai: lessonPlan.ten_bai,
        muc_tieu_kien_thuc: lessonPlan.muc_tieu_kien_thuc,
        muc_tieu_nang_luc: lessonPlan.muc_tieu_nang_luc,
        muc_tieu_pham_chat: lessonPlan.muc_tieu_pham_chat,
        thiet_bi_day_hoc: lessonPlan.thiet_bi_day_hoc,
        shdc: lessonPlan.shdc,
        shl: lessonPlan.shl,
        hoat_dong_khoi_dong: lessonPlan.hoat_dong_khoi_dong,
        hoat_dong_kham_pha: lessonPlan.hoat_dong_kham_pha,
        hoat_dong_luyen_tap: lessonPlan.hoat_dong_luyen_tap,
        hoat_dong_van_dung: lessonPlan.hoat_dong_van_dung,
        ho_so_day_hoc: lessonPlan.ho_so_day_hoc,
        huong_dan_ve_nha: lessonPlan.huong_dan_ve_nha,
        ai_generated: lessonPlan.ai_generated,
        confidence: lessonPlan.confidence,
        processing_time: lessonPlan.processing_time,
        database_context_used: lessonPlan.database_context_used
      },
      wordFile: Array.from(wordBuffer),
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        processedAt: new Date().toISOString(),
        pdfAnalysis: {
          sections: pdfContent.sections.length,
          structure: pdfContent.structure,
          language: pdfContent.structure.language
        },
        databaseContext: {
          ppctData: context.ppctData ? `Chủ đề ${context.ppctData.chu_de_so}: ${context.ppctData.ten}` : null,
          referenceMaterials: context.referenceMaterials.length,
          educationalFocus: context.educationalContext.trongTamPhatTrien
        },
        processingSteps: lessonPlan.processing_steps || [],
        performance: {
          totalProcessingTime: lessonPlan.processing_time,
          confidence: lessonPlan.confidence,
          databaseIntegration: true,
          aiSteps: lessonPlan.processing_steps?.length || 0
        }
      }
    };

    console.log('[ENHANCED-API] Processing completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('[ENHANCED-API] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Đã xảy ra lỗi không mong muốn: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    message: 'Enhanced Lesson Processor API - Architecture 18.0',
    version: '18.0.0',
    features: [
      'Enhanced PDF Analysis',
      'Database Integration',
      'Advanced AI Processing',
      'Multi-step Reasoning',
      'Educational Intelligence',
      'Professional Word Export'
    ],
    endpoints: {
      'POST /': 'Process lesson file with full database integration',
      'GET /': 'API information and features'
    },
    usage: {
      method: 'POST',
      contentType: 'multipart/form-data',
      body: {
        file: 'PDF or DOCX file (max 50MB)',
        grade: 'Grade level (10, 11, 12)',
        topic: 'Lesson topic',
        chuDeSo: 'PPCT chủ đề số',
        oldLessonContent: 'Old lesson content for reference (optional)'
      }
    }
  });
}
