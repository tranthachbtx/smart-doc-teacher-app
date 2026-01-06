
export interface AnalyzedSection {
    title: string;
    content: string;
}

export interface AnalyzedLessonPlan {
    topic: string;
    objectives: string;
    preparations: string;
    activities: AnalyzedSection[];
    rawText: string;
}

export class LessonPlanAnalyzer {
    /**
     * Phân tích văn bản thô từ PDF thành cấu trúc bài dạy
     */
    static analyze(text: string): AnalyzedLessonPlan {
        if (!text) {
            return { topic: "", objectives: "", preparations: "", activities: [], rawText: "" };
        }

        // 1. Tìm Topic/Chủ đề
        let topic = "";
        const topicMatch = text.match(/(?:CHỦ ĐỀ|BÀI|BÀI DẠY|TÊN BÀI)\s*\d*:?\s*(.*)/i);
        if (topicMatch) {
            topic = topicMatch[1].trim();
        }

        // 2. Phân tách các phần lớn dựa trên số La Mã hoặc tiêu đề chuẩn
        const sections = this.splitIntoSections(text);

        const objectives = sections.find(s =>
            /MỤC TIÊU|YÊU CẦU CẦN ĐẠT/i.test(s.title)
        )?.content || "";

        const preparations = sections.find(s =>
            /THIẾT BỊ DẠY HỌC|CHUẨN BỊ/i.test(s.title)
        )?.content || "";

        // 3. Tìm các Hoạt động
        const activitySection = sections.find(s =>
            /HOẠT ĐỘNG DẠY HỌC|TIẾN TRÌNH/i.test(s.title)
        );

        let activities: AnalyzedSection[] = [];
        if (activitySection) {
            activities = this.splitActivities(activitySection.content);
        } else {
            // Fallback: Tìm hoạt động trong toàn văn bản nếu không thấy mục III
            activities = this.splitActivities(text);
        }

        return {
            topic,
            objectives,
            preparations,
            activities,
            rawText: text
        };
    }

    private static splitIntoSections(text: string): AnalyzedSection[] {
        // Tách theo các mục La Mã thường gặp: I. II. III. IV. V.
        const romanRegex = /^(?=[IVX]+\.\s+[A-ZĐƯĂÂÊÔƠ])/gm;

        // Hoặc các tiêu đề VIẾT HOA hoàn toàn ở đầu dòng
        // const capitalRegex = /^(?=[A-ZĐƯĂÂÊÔƠ\s]{5,})/gm;

        const parts = text.split(/^[IVX]+\.\s+/gm).filter(p => p.trim().length > 0);
        const result: AnalyzedSection[] = [];

        // Phần đầu trước I. thường là tên bài
        if (parts.length > 0 && !text.trim().startsWith("I.")) {
            result.push({ title: "THÔNG TIN CHUNG", content: parts[0] });
        }

        // Các phần còn lại
        // Vì split làm mất marker I. II. nên ta cần quét lại tiêu đề ở dòng đầu mỗi part
        parts.forEach((part, index) => {
            if (index === 0 && !text.trim().startsWith("I.")) return;

            const lines = part.split('\n');
            const title = lines[0].trim();
            const content = lines.slice(1).join('\n').trim();
            result.push({ title, content });
        });

        return result;
    }

    private static splitActivities(text: string): AnalyzedSection[] {
        // Tìm các hoạt động theo định dạng: Hoạt động 1, Hoạt động 2... hoặc A. B. C. D.
        // Ưu tiên Hoạt động X vì nó phổ biến trong 5512
        let activityParts = text.split(/Hoạt động\s+\d+\.?/i).filter(p => p.trim().length > 10);

        if (activityParts.length <= 1) {
            // Thử tách theo A. B. C. D.
            activityParts = text.split(/^[A-D]\.\s+/gm).filter(p => p.trim().length > 10);
        }

        return activityParts.map((part, index) => {
            const lines = part.split('\n');
            // Cố gắng tìm tiêu đề hoạt động ở 1-2 dòng đầu
            let title = lines[0].trim();
            if (title.length < 5 && lines.length > 1) title += " " + lines[1].trim();

            return {
                title: title || `Hoạt động ${index + 1}`,
                content: part.trim()
            };
        });
    }

    /**
     * Clean and format for AI prompt integration
     */
    static formatForPrompt(analyzed: AnalyzedLessonPlan): string {
        let output = `Tên bài: ${analyzed.topic}\n\n`;
        output += `### 1. MỤC TIÊU/YÊU CẦU CẦN ĐẠT:\n${analyzed.objectives}\n\n`;
        output += `### 2. CHUẨN BỊ:\n${analyzed.preparations}\n\n`;
        output += `### 3. CÁC HOẠT ĐỘNG CHÍNH ĐÃ CÓ:\n`;

        analyzed.activities.forEach((act, i) => {
            output += `\n[HĐ ${i + 1}]: ${act.title}\n${act.content.substring(0, 1000)}${act.content.length > 1000 ? "..." : ""}\n`;
        });

        return output;
    }
}
