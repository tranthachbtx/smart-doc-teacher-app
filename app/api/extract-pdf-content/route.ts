/**
 * ðŸŽ¯ ENHANCED PDF EXTRACTOR API - ARCHITECTURE 18.0
 * Sá»­ dá»¥ng MultiStrategyExtractor Ä‘Ã£ cÃ³ sáºµn trong há»‡ thá»‘ng
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
        { success: false, error: 'Vui lÃ²ng chá»n file PDF hoáº·c DOCX' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File quÃ¡ lá»›n. Vui lÃ²ng chá»n file nhá» hÆ¡n 50MB' },
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
        { success: false, error: 'Chá»‰ há»— trá»£ file PDF vÃ  DOCX' },
        { status: 400 }
      );
    }

    console.log(`[PDF-EXTRACTOR] Processing file: ${file.name} (${file.size} bytes)`);

    // Convert file to base64 for MultiStrategyExtractor
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // Use existing MultiStrategyExtractor for fast processing
    const extractor = MultiStrategyExtractor.getInstance();
    let extractedContent: { content: string, source: string } = { content: '', source: 'none' };
    try {
      extractedContent = await extractor.extract(file, base64Data);
    } catch (err) {
      console.warn('[PDF-EXTRACTOR] Extractor failed, proceeding to AI analysis:', err);
    }

    // Deep Analysis using ContentStructureAnalyzer (on server)
    console.log('[PDF-EXTRACTOR] Performing structural analysis...');
    const analyzer = new ContentStructureAnalyzer();
    const filePayload = { mimeType: file.type, data: base64Data };

    // Attempt pre-fill analysis (this gives us the metadata and activity chunks)
    // Pass empty grade/theme if not provided, or extract from text later
    let struct = null;
    try {
      struct = await analyzer.analyzeAndPreFill(filePayload, "10", file.name);
    } catch (err) {
      console.warn('[PDF-EXTRACTOR] Structural analysis failed, using raw text only:', err);
    }

    // Handle Fallback to Gemini Vision for content if extraction was very poor
    let finalContent = extractedContent.content;
    let extractionSource = extractedContent.source;

    if (!finalContent || finalContent.length < 100) {
      if (struct) {
        // Use reconstructed content from struct if raw extraction failed
        finalContent = [
          struct.ten_bai,
          struct.muc_tieu_kien_thuc,
          struct.raw_khoi_dong,
          struct.raw_kham_pha,
          struct.raw_luyen_tap,
          struct.raw_van_dung
        ].join('\n\n');
        extractionSource = 'ai_reconstruction';
      } else {
        console.log('[PDF-EXTRACTOR] Fallback to Gemini Vision for better extraction...');
        const geminiResult = await extractTextFromFile(
          filePayload,
          "HÃ£y phÃ¢n tÃ­ch tÃ i liá»‡u nÃ y vÃ  trÃ­ch xuáº¥t ná»™i dung theo cáº¥u trÃºc giÃ¡o Ã¡n. Táº­p trung vÃ o cÃ¡c pháº§n: Má»¥c tiÃªu, Chuáº©n bá»‹, Hoáº¡t Ä‘á»™ng (Khá»Ÿi Ä‘á»™ng, KhÃ¡m phÃ¡, Luyá»‡n táº­p, Váº­n dá»¥ng), Kiá»ƒm tra, HÆ°á»›ng dáº«n vá» nhÃ ."
        );

        if (geminiResult.success) {
          finalContent = geminiResult.content || '';
          extractionSource = 'gemini_vision';
        }
      }
    }

    // Extract KHBH sections
    const khbhSections = extractKHBHSections(finalContent);

    console.log(`[PDF-EXTRACTOR] Analysis complete. Source: ${extractionSource}`);

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
      struct: struct, // RETURN THE ANALYZED STRUCTURE
      summary: finalContent.substring(0, 500)
    });

  } catch (error) {
    console.error('[PDF-EXTRACTOR] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `ÄÃ£ xáº£y ra lá»—i: ${errorMessage}` },
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
      title: 'Má»¥c tiÃªu bÃ i há»c',
      patterns: [/má»¥c tiÃªu/i, /tiÃªu chÃ­/i, /kiáº¿n thá»©c/i, /nÄƒng lá»±c/i, /pháº©m cháº¥t/i],
      priority: 1
    },
    {
      key: 'chuáº©n_bá»‹',
      title: 'Chuáº©n bá»‹ bÃ i há»c',
      patterns: [/chuáº©n bá»‹/i, /thiáº¿t bá»‹/i, /giÃ¡o cá»¥/i, /há»c liá»‡u/i],
      priority: 2
    },
    {
      key: 'hoat_Ä‘á»™ng_khá»Ÿi_Ä‘á»™ng',
      title: 'HOáº T Äá»˜NG 1: KHá»žI Äá»˜NG',
      patterns: [/khá»Ÿi Ä‘á»™ng/i, /Ä‘áº·t váº¥n Ä‘á»/i, /giá»›i thiá»‡u/i, /warm[-]?up/i, /hoáº¡t Ä‘á»™ng 1/i],
      priority: 3
    },
    {
      key: 'hoáº¡t_Ä‘á»™ng_khÃ¡m_phÃ¡',
      title: 'HOáº T Äá»˜NG 2: KHÃM PHÃ',
      patterns: [/khÃ¡m phÃ¡/i, /hÃ¬nh thÃ nh/i, /xÃ¢y dá»±ng/i, /má»›i/i, /hoáº¡t Ä‘á»™ng 2/i],
      priority: 4
    },
    {
      key: 'hoáº¡t_Ä‘á»™ng_luyá»‡n_táº­p',
      title: 'HOáº T Äá»˜NG 3: LUYá»†N Táº¬P',
      patterns: [/luyá»‡n táº­p/i, /thá»±c hÃ nh/i, /cá»§ng cá»‘/i, /bÃ i táº­p/i, /hoáº¡t Ä‘á»™ng 3/i],
      priority: 5
    },
    {
      key: 'hoáº¡t_Ä‘á»™ng_váº­n_dá»¥ng',
      title: 'HOáº T Äá»˜NG 4: Váº¬N Dá»¤NG',
      patterns: [/váº­n dá»¥ng/i, /má»Ÿ rá»™ng/i, /sÃ¡ng táº¡o/i, /thá»±c táº¿/i, /hoáº¡t Ä‘á»™ng 4/i],
      priority: 6
    },
    {
      key: 'kiá»ƒm_tra',
      title: 'Kiá»ƒm tra Ä‘Ã¡nh giÃ¡',
      patterns: [/kiá»ƒm tra/i, /Ä‘Ã¡nh giÃ¡/i, /tá»± luáº­n/i, /bÃ i kiá»ƒm tra/i],
      priority: 7
    },
    {
      key: 'hÆ°á»›ng_dáº«n',
      title: 'HÆ°á»›ng dáº«n vá» nhÃ ',
      patterns: [/hÆ°á»›ng dáº«n/i, /vá» nhÃ /i, /dáº·n dÃ²/i, /bÃ i táº­p vá» nhÃ /i],
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
