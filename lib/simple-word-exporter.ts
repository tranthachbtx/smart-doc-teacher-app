/**
 * 🎯 SIMPLE WORD EXPORTER - BACK TO BASICS ARCHITECTURE 17.0
 * Xuất file Word một cách đơn giản và hiệu quả
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { LessonPlanData } from './simple-json-parser';

export async function exportSimpleWord(lessonPlan: LessonPlanData): Promise<Buffer> {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [
              new TextRun({
                text: lessonPlan.title.toUpperCase(),
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
                text: `Lớp: ${lessonPlan.grade}`,
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
                text: "I. MỤC TIÊU HỌC TẬP",
                bold: true,
                size: 28,
                color: "4F81BD"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...lessonPlan.objectives.map((objective, index) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${objective}`,
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
                text: "II. HOẠT ĐỘNG DẠY HỌC",
                bold: true,
                size: 28,
                color: "4F81BD"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...lessonPlan.activities.map((activity, index) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `Hoạt động ${index + 1}: ${activity}`,
                  size: 22
                })
              ],
              spacing: { after: 200 }
            })
          ),

          // Assessment section
          new Paragraph({
            children: [
              new TextRun({
                text: "III. KIỂM TRA ĐÁNH GIÁ",
                bold: true,
                size: 28,
                color: "4F81BD"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...lessonPlan.assessment.map((item, index) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${item}`,
                  size: 22
                })
              ],
              spacing: { after: 200 }
            })
          ),

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
                text: `Giáo án được tạo tự động bởi Smart Doc Teacher App`,
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
                text: `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`,
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
