/**
 * 🎯 ENHANCED PDF EXTRACTOR API - ARCHITECTURE 18.0
 * Sử dụng MultiStrategyExtractor đã có sẵn trong hệ thống
 */

import { NextRequest, NextResponse } from 'next/server';
import { MultiStrategyExtractor } from '@/lib/services/multi-strategy-extractor';
import { ContentStructureAnalyzer } from '@/lib/services/content-structure-analyzer';
import { extractTextFromFile } from '@/lib/actions/gemini';

export async function POST(request: NextRequest) {
  console.log('[PDF-EXTRACTOR] Processing PDF extraction request...');
  
  try {
    // Get file from form data
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
    
    console.log(`[PDF-EXTRACTOR] Processing file: ${file.name} (${file.size} bytes)`);
    
    // Convert file to base64 for MultiStrategyExtractor
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    
    // Use existing MultiStrategyExtractor for fast processing
    const extractor = MultiStrategyExtractor.getInstance();
    const extractedContent = await extractor.extract(file, base64Data);
    
    // Fallback to Gemini Vision if needed
    let finalContent = extractedContent.content;
    let extractionSource = extractedContent.source;
    
    if (!finalContent || finalContent.length < 100) {
      console.log('[PDF-EXTRACTOR] Fallback to Gemini Vision for better extraction...');
      try {
        const geminiResult = await extractTextFromFile(
          { mimeType: file.type, data: base64Data },
          "Hãy phân tích tài liệu này và trích xuất nội dung theo cấu trúc giáo án. Tập trung vào các phần: Mục tiêu, Chuẩn bị, Hoạt động (Khởi động, Khám phá, Luyện tập, Vận dụng), Kiểm tra, Hướng dẫn về nhà."
        );
        
        if (geminiResult.success) {
          finalContent = geminiResult.content || '';
          extractionSource = 'gemini_vision';
        }
      } catch (error) {
        console.error('[PDF-EXTRACTOR] Gemini Vision fallback failed:', error);
      }
    }
    
    // Extract KHBH sections
    const khbhSections = extractKHBHSections(finalContent);
    
    console.log(`[PDF-EXTRACTOR] Analysis complete: ${khbhSections.length} KHBH sections found`);
    
    return NextResponse.json({
      success: true,
      content: finalContent,
      sections: khbhSections,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractionSource: extractionSource
      },
      summary: finalContent.substring(0, 500)
    });
    
  } catch (error) {
    console.error('[PDF-EXTRACTOR] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Đã xảy ra lỗi: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Extract sections according to KHBH structure
 */
function extractKHBHSections(content: string) {
  const sections = [];
  
  // Define KHBH section patterns
  const sectionPatterns = [
    { 
      key: 'muc_tieu', 
      title: 'Mục tiêu bài học', 
      patterns: [/mục tiêu/i, /tiêu chí/i, /kiến thức/i, /năng lực/i, /phẩm chất/i],
      priority: 1
    },
    { 
      key: 'chuẩn_bị', 
      title: 'Chuẩn bị bài học', 
      patterns: [/chuẩn bị/i, /thiết bị/i, /giáo cụ/i, /học liệu/i],
      priority: 2
    },
    { 
      key: 'hoat_động_khởi_động', 
      title: 'HOẠT ĐỘNG 1: KHỞI ĐỘNG', 
      patterns: [/khởi động/i, /đặt vấn đề/i, /giới thiệu/i, /warm[-]?up/i, /hoạt động 1/i],
      priority: 3
    },
    { 
      key: 'hoạt_động_khám_phá', 
      title: 'HOẠT ĐỘNG 2: KHÁM PHÁ', 
      patterns: [/khám phá/i, /hình thành/i, /xây dựng/i, /mới/i, /hoạt động 2/i],
      priority: 4
    },
    { 
      key: 'hoạt_động_luyện_tập', 
      title: 'HOẠT ĐỘNG 3: LUYỆN TẬP', 
      patterns: [/luyện tập/i, /thực hành/i, /củng cố/i, /bài tập/i, /hoạt động 3/i],
      priority: 5
    },
    { 
      key: 'hoạt_động_vận_dụng', 
      title: 'HOẠT ĐỘNG 4: VẬN DỤNG', 
      patterns: [/vận dụng/i, /mở rộng/i, /sáng tạo/i, /thực tế/i, /hoạt động 4/i],
      priority: 6
    },
    { 
      key: 'kiểm_tra', 
      title: 'Kiểm tra đánh giá', 
      patterns: [/kiểm tra/i, /đánh giá/i, /tự luận/i, /bài kiểm tra/i],
      priority: 7
    },
    { 
      key: 'hướng_dẫn', 
      title: 'Hướng dẫn về nhà', 
      patterns: [/hướng dẫn/i, /về nhà/i, /dặn dò/i, /bài tập về nhà/i],
      priority: 8
    }
  ];
  
  // Fallback: Extract from raw text
  const lines = content.split('\n');
  let currentSection = null;
  let currentContent = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line starts a new section
    const matchedPattern = sectionPatterns.find(pattern => 
      pattern.patterns.some(p => p.test(trimmedLine)) && trimmedLine.length < 100
    );
    
    if (matchedPattern) {
      // Save previous section
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: currentContent.join('\n').trim()
        });
      }
      
      // Start new section
      currentSection = {
        key: matchedPattern.key,
        title: matchedPattern.title,
        content: '',
        confidence: 0.7,
        type: matchedPattern.key
      };
      currentContent = [];
    } else if (currentSection && trimmedLine) {
      currentContent.push(trimmedLine);
    }
  }
  
  // Add last section
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: currentContent.join('\n').trim()
    });
  }
  
  // Sort by priority and merge similar sections
  const sortedSections = sections.sort((a, b) => {
    const priorityA = sectionPatterns.find(p => p.key === a.key)?.priority || 999;
    const priorityB = sectionPatterns.find(p => p.key === b.key)?.priority || 999;
    return priorityA - priorityB;
  });
  
  return sortedSections;
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    message: 'PDF Content Extractor API - Architecture 18.0',
    version: '18.0.0',
    features: [
      'Enhanced PDF Analysis',
      'KHBH Structure Extraction',
      'Section Classification',
      'Content Analysis',
      'Metadata Extraction'
    ],
    endpoints: {
      'POST /': 'Extract and analyze PDF content',
      'GET /': 'API information'
    },
    usage: {
      method: 'POST',
      contentType: 'multipart/form-data',
      body: {
        file: 'PDF or DOCX file (max 50MB)'
      },
      response: {
        success: 'boolean',
        content: 'Raw text content',
        structured: 'Enhanced analysis result',
        sections: 'KHBH structured sections',
        metadata: 'File metadata',
        summary: 'Content summary'
      }
    }
  });
}
