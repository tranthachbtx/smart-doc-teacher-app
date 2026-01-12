/**
 * ðŸŽ¯ SIMPLE LESSON PROCESSOR API - BACK TO BASICS ARCHITECTURE 17.0
 * API endpoint Ä‘Æ¡n giáº£n cho viá»‡c xá»­ lÃ½ giÃ¡o Ã¡n
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
    
    console.log(`[SIMPLE-API] Processing file: ${file.name} (${file.size} bytes)`);
    
    // Step 2: Extract content from file
    let pdfContent: string;
    try {
      pdfContent = await extractPDFContent(file);
      console.log(`[SIMPLE-API] Extracted ${pdfContent.length} characters from file`);
    } catch (error) {
      console.error('[SIMPLE-API] PDF extraction failed:', error);
      return NextResponse.json(
        { success: false, error: 'KhÃ´ng thá»ƒ trÃ­ch xuáº¥t ná»™i dung tá»« file. Vui lÃ²ng kiá»ƒm tra láº¡i file.' },
        { status: 400 }
      );
    }
    
    // Step 3: Generate lesson plan with AI
    let aiResponse: string;
    try {
      const prompt = `
Báº N LÃ€ CHUYÃŠN GIA BIÃŠN SOáº N GIÃO ÃN THEO THÃ”NG TÆ¯ 5512 Cá»¦A Bá»˜ GIÃO Dá»¤C VÃ€ ÄÃ€O Táº O VIá»†T NAM.

Ná»˜I DUNG TÃ€I LIá»†U Gá»C:
${pdfContent}

YÃŠU Cáº¦U:
1. PhÃ¢n tÃ­ch ná»™i dung tÃ i liá»‡u gá»‘c
2. Táº¡o giÃ¡o Ã¡n hoÃ n chá»‰nh theo chuáº©n ThÃ´ng tÆ° 5512
3. Bao gá»“m Ä‘áº§y Ä‘á»§ cÃ¡c pháº§n: Má»¥c tiÃªu, Hoáº¡t Ä‘á»™ng dáº¡y há»c, Kiá»ƒm tra Ä‘Ã¡nh giÃ¡
4. Ná»™i dung chi tiáº¿t, rÃµ rÃ ng, phÃ¹ há»£p vá»›i thá»±c tiá»…n
5. Tráº£ vá» Ä‘á»‹nh dáº¡ng JSON vá»›i cáº¥u trÃºc sau:

{
  "title": "TiÃªu Ä‘á» giÃ¡o Ã¡n",
  "grade": "Lá»›p há»c",
  "objectives": ["Má»¥c tiÃªu 1", "Má»¥c tiÃªu 2", "Má»¥c tiÃªu 3"],
  "activities": ["Hoáº¡t Ä‘á»™ng 1", "Hoáº¡t Ä‘á»™ng 2", "Hoáº¡t Ä‘á»™ng 3"],
  "assessment": ["Kiá»ƒm tra 1", "Kiá»ƒm tra 2"]
}

LÆ¯U Ã:
- Tráº£ vá» JSON há»£p lá»‡, khÃ´ng cÃ³ markdown
- Má»¥c tiÃªu pháº£i rÃµ rÃ ng, Ä‘o lÆ°á»ng Ä‘Æ°á»£c
- Hoáº¡t Ä‘á»™ng pháº£i cá»¥ thá»ƒ, cÃ³ tÃ­nh thá»±c tiá»…n
- Kiá»ƒm tra Ä‘Ã¡nh giÃ¡ phÃ¹ há»£p vá»›i má»¥c tiÃªu
      `;
      
      aiResponse = await callAIWithRetry(prompt, 3);
      console.log(`[SIMPLE-API] AI response received (${aiResponse.length} characters)`);
    } catch (error) {
      console.error('[SIMPLE-API] AI call failed:', error);
      return NextResponse.json(
        { success: false, error: 'KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n AI. Vui lÃ²ng thá»­ láº¡i sau.' },
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
        { success: false, error: 'KhÃ´ng thá»ƒ xá»­ lÃ½ pháº£n há»“i tá»« AI. Vui lÃ²ng thá»­ láº¡i.' },
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
        { success: false, error: 'KhÃ´ng thá»ƒ táº¡o file Word. Vui lÃ²ng thá»­ láº¡i.' },
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
      { success: false, error: 'ÄÃ£ xáº£y ra lá»—i khÃ´ng mong muá»‘n. Vui lÃ²ng thá»­ láº¡i.' },
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
