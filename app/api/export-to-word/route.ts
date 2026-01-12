/**
 * ðŸŽ¯ WORD EXPORT API - ARCHITECTURE 18.0
 * API endpoint Ä‘á»ƒ xuáº¥t file Word tá»« template KHBH
 */

import { NextRequest, NextResponse } from 'next/server';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export async function POST(request: NextRequest) {
  console.log('[WORD-EXPORT] Processing Word export request...');
  
  try {
    // Get template data from request body
    const templateData = await request.json();
    
    if (!templateData) {
      return NextResponse.json(
        { success: false, error: 'KhÃ´ng cÃ³ dá»¯ liá»‡u template' },
        { status: 400 }
      );
    }
    
    console.log(`[WORD-EXPORT] Exporting lesson: ${templateData.ten_bai}`);
    
    // Create Word document with 2-column structure for activities
    const doc = createWordDocument(templateData);
    
    // Generate buffer
    const buffer = await Packer.toBuffer(doc);
    
    console.log(`[WORD-EXPORT] Word document generated (${buffer.length} bytes)`);
    
    // Return as response
    return new NextResponse(buffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="giao-an-${templateData.ten_bai?.replace(/\s+/g, '-') || 'khong-ten'}.docx"`,
        'Content-Length': buffer.length.toString()
      }
    });
    
  } catch (error) {
    console.error('[WORD-EXPORT] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `ÄÃ£ xáº£y ra lá»—i: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Create Word document with proper KHBH structure
 */
function createWordDocument(data: any): Document {
  const children = [];
  
  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: data.ten_bai || "GIÃO ÃN",
          bold: true,
          size: 32,
          color: "2E74B5"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );
  
  // Grade and basic info
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Khá»‘i: ${data.grade || 'N/A'}  |  Chá»§ Ä‘á»: ${data.topic || 'N/A'}`,
          size: 24,
          color: "44546A"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 }
    })
  );
  
  // Section 1: Má»¥c tiÃªu
  if (data.muc_tieu_kien_thuc || data.muc_tieu_nang_luc || data.muc_tieu_pham_chat) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "I. Má»¤C TIÃŠU BÃ€I Há»ŒC",
            bold: true,
            size: 28,
            color: "2E74B5"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    if (data.muc_tieu_kien_thuc) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "1. Kiáº¿n thá»©c:",
              bold: true,
              size: 24
            }),
            new TextRun({
              text: ` ${data.muc_tieu_kien_thuc}`,
              size: 24
            })
          ],
          spacing: { after: 200 }
        })
      );
    }
    
    if (data.muc_tieu_nang_luc) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "2. NÄƒng lá»±c:",
              bold: true,
              size: 24
            }),
            new TextRun({
              text: ` ${data.muc_tieu_nang_luc}`,
              size: 24
            })
          ],
          spacing: { after: 200 }
        })
      );
    }
    
    if (data.muc_tieu_pham_chat) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "3. Pháº©m cháº¥t:",
              bold: true,
              size: 24
            }),
            new TextRun({
              text: ` ${data.muc_tieu_pham_chat}`,
              size: 24
            })
          ],
          spacing: { after: 400 }
        })
      );
    }
  }
  
  // Section 2: Chuáº©n bá»‹
  if (data.thiet_bi_day_hoc) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "II. CHUáº¨N Bá»Š BÃ€I Há»ŒC",
            bold: true,
            size: 28,
            color: "2E74B5"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.thiet_bi_day_hoc,
            size: 24
          })
        ],
        spacing: { after: 400 }
      })
    );
  }
  
  // Section 3: Hoáº¡t Ä‘á»™ng dáº¡y há»c
  if (data.hoat_dong_khoi_dong || data.hoat_dong_kham_pha || 
      data.hoat_dong_luyen_tap || data.hoat_dong_van_dung) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "III. HOáº T Äá»˜NG Dáº Y Há»ŒC",
            bold: true,
            size: 28,
            color: "2E74B5"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    // Process each activity with 2-column structure
    const activities = [
      { key: 'hoat_dong_khoi_dong', title: '1. Hoáº¡t Ä‘á»™ng khá»Ÿi Ä‘á»™ng' },
      { key: 'hoat_dong_kham_pha', title: '2. Hoáº¡t Ä‘á»™ng khÃ¡m phÃ¡' },
      { key: 'hoat_dong_luyen_tap', title: '3. Hoáº¡t Ä‘á»™ng luyá»‡n táº­p' },
      { key: 'hoat_dong_van_dung', title: '4. Hoáº¡t Ä‘á»™ng váº­n dá»¥ng' }
    ];
    
    activities.forEach(activity => {
      if (data[activity.key]) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: activity.title,
                bold: true,
                size: 26,
                color: "44546A"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 }
          })
        );
        
        // Parse and format activity content with 2-column structure
        const formattedActivity = formatActivityContent(data[activity.key]);
        formattedActivity.forEach(paragraph => {
          children.push(paragraph);
        });
      }
    });
  }
  
  // Section 4: Kiá»ƒm tra Ä‘Ã¡nh giÃ¡
  if (data.ho_so_day_hoc) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "IV. KIá»‚M TRA ÄÃNH GIÃ",
            bold: true,
            size: 28,
            color: "2E74B5"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.ho_so_day_hoc,
            size: 24
          })
        ],
        spacing: { after: 400 }
      })
    );
  }
  
  // Section 5: HÆ°á»›ng dáº«n vá» nhÃ 
  if (data.huong_dan_ve_nha) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "V. HÆ¯á»šNG DáºªN Vá»€ NHÃ€",
            bold: true,
            size: 28,
            color: "2E74B5"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );
    
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.huong_dan_ve_nha,
            size: 24
          })
        ],
        spacing: { after: 400 }
      })
    );
  }
  
  return new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });
}

/**
 * Format activity content with 2-column structure
 */
function formatActivityContent(content: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  
  if (!content) return paragraphs;
  
  // Parse content for {{cot_1}} and {{cot_2}} markers
  const parts = content.split(/({{cot_[12]}})/);
  
  let currentColumn = null;
  let accumulatedText = '';
  
  parts.forEach(part => {
    if (part === '{{cot_1}}') {
      // Save accumulated text if any
      if (accumulatedText.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: accumulatedText.trim(),
                size: 24
              })
            ],
            spacing: { after: 200 }
          })
        );
      }
      
      // Start teacher column
      currentColumn = 'teacher';
      accumulatedText = '';
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "GiÃ¡o viÃªn:",
              bold: true,
              size: 24,
              color: "2E74B5"
            })
          ],
          spacing: { after: 100 }
        })
      );
      
    } else if (part === '{{cot_2}}') {
      // Save teacher column text
      if (accumulatedText.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: accumulatedText.trim(),
                size: 24
              })
            ],
            spacing: { after: 200 }
          })
        );
      }
      
      // Start student column
      currentColumn = 'student';
      accumulatedText = '';
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Há»c sinh:",
              bold: true,
              size: 24,
              color: "70AD47"
            })
          ],
          spacing: { after: 100 }
        })
      );
      
    } else {
      accumulatedText += part;
    }
  });
  
  // Save final accumulated text
  if (accumulatedText.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: accumulatedText.trim(),
            size: 24
          })
        ],
        spacing: { after: 200 }
      })
    );
  }
  
  // If no column markers found, just add as simple paragraph
  if (paragraphs.length === 0 && content.trim()) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: content.trim(),
            size: 24
          })
        ],
        spacing: { after: 200 }
      })
    );
  }
  
  return paragraphs;
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    message: 'Word Export API - Architecture 18.0',
    version: '18.0.0',
    features: [
      'Professional Word Export',
      '2-Column Activity Structure',
      '5512 Compliance',
      'Template Filling',
      'Automatic Formatting'
    ],
    endpoints: {
      'POST /': 'Export lesson plan to Word document',
      'GET /': 'API information'
    },
    usage: {
      method: 'POST',
      contentType: 'application/json',
      body: {
        ten_bai: 'string',
        muc_tieu_kien_thuc: 'string',
        muc_tieu_nang_luc: 'string',
        muc_tieu_pham_chat: 'string',
        thiet_bi_day_hoc: 'string',
        hoat_dong_khoi_dong: 'string',
        hoat_dong_kham_pha: 'string',
        hoat_dong_luyen_tap: 'string',
        hoat_dong_van_dung: 'string',
        ho_so_day_hoc: 'string',
        huong_dan_ve_nha: 'string'
      },
      response: 'Word document file'
    }
  });
}
