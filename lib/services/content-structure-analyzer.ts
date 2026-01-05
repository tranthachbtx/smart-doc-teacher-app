import { generateAIContent } from "@/lib/actions/gemini";
import { LessonPlanAnalyzer } from "./lesson-plan-analyzer";

export interface ContentSection {
    id: string;
    title: string;
    type: 'objective' | 'activity' | 'knowledge' | 'assessment' | 'resource';
    content: string;
    subsections?: ContentSection[];
    relevance: {
        khoi_dong: number; // 0-100
        kham_pha: number;
        luyen_tap: number;
        van_dung: number;
    };
    metadata: {
        pageNumbers: number[];
        wordCount: number;
        complexity: 'low' | 'medium' | 'high';
    };
}

export interface StructuredContent {
    title: string;
    grade: string;
    subject: string;
    sections: ContentSection[];
    metadata: {
        totalWordCount: number;
        sectionCount: number;
        processedAt: string;
    };
}

export class ContentStructureAnalyzer {
    async analyzePDFContent(rawText: string): Promise<StructuredContent> {
        // 1. Initial AI analysis for structure
        const structurePrompt = `
        Bạn là chuyên gia phân tích dữ liệu giáo dục. Hãy phân tích nội dung giáo án sau và bóc tách thành các phần nhỏ có ý nghĩa sư phạm.
        
        YÊU CẦU:
        1. Phân loại từng phần vào các nhóm: objective (mục tiêu), activity (hoạt động), knowledge (kiến thức), assessment (đánh giá), resource (thiết bị/tài liệu).
        2. Đánh giá mức độ liên quan (0-100) của từng phần với 4 loại hoạt động: Khởi động (khoi_dong), Khám phá (kham_pha), Luyện tập (luyen_tap), Vận dụng (van_dung).
        3. Trả về JSON theo cấu trúc sau (KHÔNG thêm text bên ngoài):
        {
            "title": "Tiêu đề bài học",
            "grade": "Khối lớp",
            "subject": "Môn học",
            "sections": [
                {
                    "title": "Tiêu đề mục",
                    "type": "objective|activity|knowledge|assessment|resource",
                    "content": "Nội dung chi tiết của phần này",
                    "relevance": {
                        "khoi_dong": 80,
                        "kham_pha": 90,
                        "luyen_tap": 70,
                        "van_dung": 60
                    },
                    "metadata": {
                        "complexity": "low|medium|high"
                    }
                }
            ]
        }
        
        NỘI DUNG CẦN PHÂN TÍCH:
        ${rawText.substring(0, 10000)}
        `;

        try {
            const aiResponse = await generateAIContent(structurePrompt, "gemini-1.5-flash");

            if (!aiResponse.success || !aiResponse.content) {
                throw new Error("AI analysis failed: " + aiResponse.error);
            }

            // Clean JSON string
            const jsonStr = aiResponse.content.substring(
                aiResponse.content.indexOf("{"),
                aiResponse.content.lastIndexOf("}") + 1
            );

            const parsed = JSON.parse(jsonStr);

            // Enhance with IDs and defaults
            const sections = (parsed.sections || []).map((s: any, index: number) => ({
                ...s,
                id: `sec_${Date.now()}_${index}`,
                metadata: {
                    ...s.metadata,
                    pageNumbers: [],
                    wordCount: s.content.split(/\s+/).length,
                    complexity: s.metadata?.complexity || 'medium'
                }
            }));

            return {
                title: parsed.title || "Tài liệu chưa đặt tên",
                grade: parsed.grade || "Chưa rõ",
                subject: parsed.subject || "Chưa rõ",
                sections: sections,
                metadata: {
                    totalWordCount: rawText.split(/\s+/).length,
                    sectionCount: sections.length,
                    processedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error("ContentStructureAnalyzer Error:", error);
            // Return a fallback structured content if AI fails
            return this.getFallbackStructure(rawText);
        }
    }

    private getFallbackStructure(rawText: string): StructuredContent {
        const analyzed = LessonPlanAnalyzer.analyze(rawText);
        const sections: ContentSection[] = [];

        // 1. Add Objectives
        if (analyzed.objectives) {
            sections.push({
                id: `fallback_obj_${Date.now()}`,
                title: "Mục tiêu bài học (Regex)",
                type: "objective",
                content: analyzed.objectives,
                relevance: { khoi_dong: 90, kham_pha: 10, luyen_tap: 10, van_dung: 10 },
                metadata: { pageNumbers: [], wordCount: analyzed.objectives.split(/\s+/).length, complexity: 'medium' }
            });
        }

        // 2. Add Preparations
        if (analyzed.preparations) {
            sections.push({
                id: `fallback_prep_${Date.now()}`,
                title: "Thiết bị dạy học/Chuẩn bị",
                type: "resource",
                content: analyzed.preparations,
                relevance: { khoi_dong: 50, kham_pha: 50, luyen_tap: 20, van_dung: 20 },
                metadata: { pageNumbers: [], wordCount: analyzed.preparations.split(/\s+/).length, complexity: 'low' }
            });
        }

        // 3. Add Activities
        analyzed.activities.forEach((act, index) => {
            sections.push({
                id: `fallback_act_${Date.now()}_${index}`,
                title: act.title,
                type: "activity",
                content: act.content,
                relevance: {
                    khoi_dong: index === 0 ? 80 : 20,
                    kham_pha: 70,
                    luyen_tap: index > 1 ? 80 : 30,
                    van_dung: 40
                },
                metadata: { pageNumbers: [], wordCount: act.content.split(/\s+/).length, complexity: 'medium' }
            });
        });

        // 4. Default knowledge section if everything else is empty
        if (sections.length === 0) {
            sections.push({
                id: "fallback_raw",
                title: "Nội dung trích xuất thô",
                type: "knowledge",
                content: rawText.substring(0, 5000),
                relevance: { khoi_dong: 50, kham_pha: 50, luyen_tap: 50, van_dung: 50 },
                metadata: { pageNumbers: [], wordCount: rawText.length / 5, complexity: 'medium' }
            });
        }

        return {
            title: analyzed.topic || "Tài liệu trích xuất (Regex Mode)",
            grade: "Chưa rõ",
            subject: "Chưa rõ",
            sections: sections,
            metadata: {
                totalWordCount: rawText.split(/\s+/).length,
                sectionCount: sections.length,
                processedAt: new Date().toISOString()
            }
        };
    }
}
