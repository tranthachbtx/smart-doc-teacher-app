
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

        // 1. Tìm Topic/Chủ đề - Mở rộng pattern
        let topic = "";
        const topicMatch = text.match(/(?:CHỦ ĐỀ|BÀI|BÀI DẠY|TÊN BÀI|TÊN CHỦ ĐỀ)\s*\d*:?\s*(.*)/i);
        if (topicMatch) {
            topic = topicMatch[1].trim();
        }

        // 2. Phân tách các phần lớn dựa trên số La Mã hoặc tiêu đề chuẩn
        const sections = this.splitIntoSections(text);

        // Advanced Patterns for Objectives (MoET 5512)
        const objectiveRegex = /MỤC TIÊU|YÊU CẦU CẦN ĐẠT|I\.\s*MỤC TIÊU/i;
        const objectivesSection = sections.find(s => objectiveRegex.test(s.title));
        let objectives = objectivesSection?.content || "";

        // Nếu không tìm thấy bằng split, thử dùng regex trực tiếp trên text
        if (!objectives) {
            const directMatch = text.match(/MỤC TIÊU\s*[\s\S]*?(?=II\.|CHUẨN BỊ|THIẾT BỊ)/i);
            if (directMatch) objectives = directMatch[0];
        }

        // Advanced Patterns for Preparations
        const preparationRegex = /THIẾT BỊ DẠY HỌC|CHUẨN BỊ|II\.\s*THIẾT BỊ/i;
        const preparationsSection = sections.find(s => preparationRegex.test(s.title));
        let preparations = preparationsSection?.content || "";

        if (!preparations) {
            const directMatch = text.match(/THIẾT BỊ DẠY HỌC\s*[\s\S]*?(?=III\.|HOẠT ĐỘNG|TIẾN TRÌNH)/i);
            if (directMatch) preparations = directMatch[0];
        }

        // 3. Tìm các Hoạt động (MoET 5512)
        const activityRegex = /HOẠT ĐỘNG DẠY HỌC|TIẾN TRÌNH|III\.\s*CÁC HOẠT ĐỘNG|IV\.\s*CÁC HOẠT ĐỘNG/i;
        const activitySection = sections.find(s => activityRegex.test(s.title));

        let activities: AnalyzedSection[] = [];
        if (activitySection) {
            activities = this.splitActivities(activitySection.content);
        } else {
            // Fallback: Tìm hoạt động trong toàn văn bản
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
        // 1. Tiền xử lý: Loại bỏ rác PDF chuyên sâu
        const cleanedText = text
            .replace(/--- Page \d+ ---/gi, '')
            .replace(/^Page \d+$/gm, '')
            .replace(/^\d+$/gm, '')
            .replace(/^(Phòng|Sở) GD&ĐT.*$/gm, '') // Lọc header hành chính
            .replace(/^Trường:.*$/gm, '')
            .replace(/^Họ và tên giáo viên:.*$/gm, '');

        // 2. Tìm các hoạt động theo chuẩn 5512 hoặc ký tự đầu mục
        // Nhận diện: Hoạt động X, HĐ X, A. B. C. D. (đầu dòng)
        const splitRegex = /(?=Hoạt động\s+\d+\.?)|(?=HĐ\s*\d+\.?)|(?=^[A-D]\.\s+[A-ZĐƯĂÂÊÔƠ])/gm;
        let activityParts = cleanedText.split(splitRegex).filter(p => p.trim().length > 30);

        if (activityParts.length <= 1) {
            // Thử tách theo các tiểu mục 1. 2. 3. 4. nếu không thấy chữ Hoạt động
            activityParts = cleanedText.split(/^(?=[1-4]\.\s+[A-ZĐƯĂÂÊÔƠ])/gm).filter(p => p.trim().length > 30);
        }

        const cleanedResult = activityParts.map((part, index) => {
            const lines = part.trim().split('\n').filter(l => l.trim().length > 0);
            if (lines.length === 0) return null;

            let title = lines[0].trim();
            // Nếu tiêu đề quá ngắn, thử gộp với dòng tiếp theo
            if (title.length < 15 && lines.length > 1) {
                title = (title + " - " + lines[1].trim()).trim();
            }

            // Dọn dẹp metadata rác trong tiêu đề
            title = title.replace(/^[,.\s\)]+/, '')
                .replace(/^(Hoạt động|HĐ)\s*\d+\.?\s*/i, '')
                .trim();

            const finalTitle = title || `Hoạt động ${index + 1}`;

            return {
                title: finalTitle.substring(0, 100), // Không để tiêu đề quá dài
                content: part.trim()
            };
        }).filter(item => {
            if (!item) return false;
            // Loại bỏ các mục quá ngắn hoặc chỉ toàn ký tự lạ
            const isContentTooShort = item.content.length < 60;
            const isJustNumbers = /^\d+$/.test(item.title);
            return !isContentTooShort && !isJustNumbers;
        }) as AnalyzedSection[];

        return cleanedResult;
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
