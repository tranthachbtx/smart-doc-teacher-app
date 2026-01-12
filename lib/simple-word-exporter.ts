/**
 * ðŸŽ¯ SIMPLE WORD EXPORTER - BACK TO BASICS ARCHITECTURE 17.0
 * Xuáº¥t file Word má»™t cÃ¡ch Ä‘Æ¡n giáº£n vÃ  hiá»‡u quáº£
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { LessonPlanData } from './simple-json-parser';

export async function exportToWord(lessonPlan: any): Promise<Buffer> {
  try {
    // Determine data structure
    const isEnhanced = !!lessonPlan.ten_bai;
    const title = isEnhanced ? lessonPlan.ten_bai : (lessonPlan.title || 'GiÃ¡o Ã¡n');
    const grade = isEnhanced ? (lessonPlan.grade || 'KhÃ´ng xÃ¡c Ä‘á»‹nh') : (lessonPlan.grade || 'KhÃ´ng xÃ¡c Ä‘á»‹nh');

    // Normalize objectives
    let objectives: string[] = [];
    if (isEnhanced) {
      if (lessonPlan.muc_tieu_kien_thuc) objectives.push(`Kiáº¿n thá»©c: ${lessonPlan.muc_tieu_kien_thuc}`);
      if (lessonPlan.muc_tieu_nang_luc) objectives.push(`NÄƒng lá»±c: ${lessonPlan.muc_tieu_nang_luc}`);
      if (lessonPlan.muc_tieu_pham_chat) objectives.push(`Pháº©m cháº¥t: ${lessonPlan.muc_tieu_pham_chat}`);
    } else {
      objectives = lessonPlan.objectives || [];
    }

    // Normalize activities
    let activities: { title: string, content: string }[] = [];
    if (isEnhanced) {
      if (lessonPlan.hoat_dong_khoi_dong) activities.push({ title: "Khá»Ÿi Ä‘á»™ng", content: lessonPlan.hoat_dong_khoi_dong });
      if (lessonPlan.hoat_dong_kham_pha) activities.push({ title: "KhÃ¡m phÃ¡", content: lessonPlan.hoat_dong_kham_pha });
      if (lessonPlan.hoat_dong_luyen_tap) activities.push({ title: "Luyá»‡n táº­p", content: lessonPlan.hoat_dong_luyen_tap });
      if (lessonPlan.hoat_dong_van_dung) activities.push({ title: "Váº­n dá»¥ng", content: lessonPlan.hoat_dong_van_dung });
    } else {
      activities = (lessonPlan.activities || []).map((a: any, i: number) => ({
        title: `Hoáº¡t Ä‘á»™ng ${i + 1}`,
        content: a
      }));
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 32,
                color: "2E74BC"
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Grade info
          new Paragraph({
            children: [
              new TextRun({
                text: `Lá»›p: ${grade}`,
                bold: true,
                size: 24
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
          }),

          // Objectives section
          new Paragraph({
            children: [
              new TextRun({
                text: "I. Má»¤C TIÃŠU Há»ŒC Táº¬P",
                bold: true,
                size: 28,
                color: "4F81BD"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...objectives.map((objective, index) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: isEnhanced ? objective : `${index + 1}. ${objective}`,
                  size: 22
                })
              ],
              spacing: { after: 200 }
            })
          ),

          // Activities section
          new Paragraph({
            children: [
              new TextRun({
                text: "II. HOáº T Äá»˜NG Dáº Y Há»ŒC",
                bold: true,
                size: 28,
                color: "4F81BD"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...activities.flatMap((activity) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: activity.title,
                  bold: true,
                  size: 24,
                  underline: {}
                })
              ],
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: activity.content,
                  size: 22
                })
              ],
              spacing: { after: 200 }
            })
          ]),

          // Assessment section (if simple)
          ...(!isEnhanced && lessonPlan.assessment && lessonPlan.assessment.length > 0 ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "III. KIá»‚M TRA ÄÃNH GIÃ",
                  bold: true,
                  size: 28,
                  color: "4F81BD"
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...lessonPlan.assessment.map((item: string, index: number) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. ${item}`,
                    size: 22
                  })
                ],
                spacing: { after: 200 }
              })
            )
          ] : []),

          // Extra sections for Enhanced
          ...(isEnhanced ? [
            new Paragraph({
              children: [new TextRun({ text: "III. Há»’ SÆ  Dáº Y Há»ŒC", bold: true, size: 28, color: "4F81BD" })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: lessonPlan.ho_so_day_hoc || "...", size: 22 })],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "IV. HÆ¯á»šNG DáºªN Vá»€ NHÃ€", bold: true, size: 28, color: "4F81BD" })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: lessonPlan.huong_dan_ve_nha || "...", size: 22 })],
              spacing: { after: 200 }
            })
          ] : []),

          // Footer
          new Paragraph({
            children: [
              new TextRun({
                text: `---`,
                size: 20,
                color: "999999"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `GiÃ¡o Ã¡n Ä‘Æ°á»£c táº¡o tá»± Ä‘á»™ng bá»Ÿi Smart Doc Teacher App`,
                size: 18,
                color: "999999",
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `NgÃ y táº¡o: ${new Date().toLocaleDateString('vi-VN')}`,
                size: 18,
                color: "999999",
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER
          })
        ]
      }]
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  } catch (error) {
    console.error('Word export error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export to Word: ${errorMessage}`);
  }
}


export async function exportSimpleText(content: string, title: string = "document"): Promise<Buffer> {
  try {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 28
              })
            ],
            heading: HeadingLevel.TITLE,
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                size: 22
              })
            ],
            spacing: { before: 200 }
          })
        ]
      }]
    });

    return await Packer.toBuffer(doc);
  } catch (error) {
    console.error('Simple text export error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export text: ${errorMessage}`);
  }
}
