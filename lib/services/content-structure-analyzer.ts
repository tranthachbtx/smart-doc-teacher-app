import { generateAIContent } from "@/lib/actions/gemini";


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
        shdc?: number;
        shl?: number;
        setup?: number;
        appendix?: number;
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
    async analyzePDFContent(rawText: string, model: string = "gemini-1.5-flash-latest"): Promise<StructuredContent> {
        // 1. Initial AI analysis for structure
        const structurePrompt = `
        Bạn là chuyên gia phân tích dữ liệu giáo dục. Hãy phân tích nội dung giáo án sau và bóc tách thành các phần nhỏ có ý nghĩa sư phạm.
        
        YÊU CẦU NGHIÊM NGẶT VỀ LÀM SẠCH DỮ LIỆU:
        1. LOẠI BỎ HOÀN TOÀN các dòng chứa thông tin rác: Số trang (Trang 1, Page X...), Header/Footer lặp lại.
        2. LOẠI BỎ các tiêu đề chủ đề quá dài lặp lại ở đầu mỗi trang (ví dụ: "Chủ đề 7: Bảo vệ...").
        3. LOẠI BỎ các thông tin hành chính như "Ngày soạn", "Ngày dạy", "Người soạn".
        4. KHÔNG giữ lại các ký hiệu OCR lỗi (như , 2). , v.v.) trong nội dung.
        
        NHIỆM VỤ CẤU TRÚC & LAYOUT (QUAN TRỌNG):
        1. NHẬN DIỆN CỘT: Nếu thấy ký tự '|' phân tách dòng, đó có thể là ranh giới giữa Cột Giáo viên và Cột Học sinh.
        2. TÁI CẤU TRÚC 5512: Nếu trích xuất hoạt động (activity), hãy phân tích mối quan hệ GV-HS.
        3. SỬ DỤNG MARKER: Nếu nhận diện được nội dung của GV và HS, hãy lồng ghép {{cot_1}} cho GV và {{cot_2}} cho HS ngay trong trường "content" của JSON.
        4. Phân loại từng phần vào các nhóm: objective (mục tiêu), activity (hoạt động), knowledge (kiến thức), assessment (đánh giá), resource (thiết bị/tài liệu).
        5. Đánh giá mức độ liên quan (0-100) của từng phần với 4 loại hoạt động: Khởi động (khoi_dong), Khám phá (kham_pha), Luyện tập (luyen_tap), Vận dụng (van_dung).
        6. Trả về JSON theo cấu trúc sau (KHÔNG thêm text bên ngoài):
        {
            "title": "Tiêu đề bài học (Làm sạch, không chứa 'Trang X')",
            "grade": "Khối lớp",
            "subject": "Môn học",
            "sections": [
                {
                    "title": "Tiêu đề mục (Ví dụ: Hoạt động 1, Mục tiêu bài học)",
                    "type": "objective|activity|knowledge|assessment|resource",
                    "content": "Nội dung chi tiết (SỬ DỤNG {{cot_1}} VÀ {{cot_2}} NẾU LÀ HOẠT ĐỘNG DẠY HỌC)",
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
        ${rawText.substring(0, 15000)}
        `;

        try {
            const aiResponse = await generateAIContent(structurePrompt, model);

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
        } catch (error: any) {
            console.warn("⚠️ [ContentStructureAnalyzer] AI Analysis failed, switching to Enhanced Architecture 18.0 Fallback:", error.message);
            // Return a fallback structured content if AI fails
            try {
                return await this.getEnhancedFallbackStructure(rawText);
            } catch (fallbackError: any) {
                console.error("❌ [ContentStructureAnalyzer] Fatal error in enhanced fallback logic:", fallbackError);
                throw new Error("Không thể phân tích tài liệu ngay cả bằng phương thức Kiến trúc 18.0: " + fallbackError.message);
            }
        }
    }

    private async getEnhancedFallbackStructure(rawText: string): Promise<StructuredContent> {
        // V7: Simplified fallback without LessonPlanAnalyzer
        const sections: ContentSection[] = [];

        // Add a single knowledge section as backup (FULL CONTENT PRESERVED)
        // Set high relevance across the board so PedagogicalOrchestrator sees it as "setup" context
        sections.push({
            id: `fallback_raw_${Date.now()}`,
            title: "Nội dung gốc (Fallback Mode)",
            type: "resource", // 'resource' is treated as universal context
            content: rawText, // DO NOT TRUNCATE!
            relevance: { khoi_dong: 50, kham_pha: 50, luyen_tap: 50, van_dung: 50, setup: 100 },
            metadata: { pageNumbers: [], wordCount: rawText.length / 5, complexity: 'medium' }
        });

        return {
            title: "Tài liệu trích xuất (Enhanced Fallback)",
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
