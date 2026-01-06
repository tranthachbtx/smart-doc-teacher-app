
import { ContentSection, StructuredContent } from "./content-structure-analyzer";

export interface FilteredContent {
    sections: ContentSection[];
    promptContent: string;
    totalRelevance: number;
    coverage: number;
}

export class ContentFilter {
    filterContentForActivity(
        structuredContent: StructuredContent,
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung',
        maxContentLength: number = 3000
    ): FilteredContent {
        // 1. Lọc theo độ liên quan (> 40 để giữ lại các phần có ích)
        const relevantSections = structuredContent.sections
            .filter(section => (section.relevance[activityType] || 0) >= 40)
            .sort((a, b) => (b.relevance[activityType] || 0) - (a.relevance[activityType] || 0));

        // 2. Ưu tiên theo loại hoạt động
        const prioritizedSections = this.prioritizeSections(relevantSections, activityType);

        // 3. Trích xuất nội dung trong giới hạn độ dài
        let currentLength = 0;
        const selectedSections: ContentSection[] = [];

        for (const section of prioritizedSections) {
            if (currentLength + section.content.length > maxContentLength && selectedSections.length > 0) {
                // Nếu vượt quá giới hạn, chỉ thêm đoạn tóm tắt hoặc bỏ qua
                continue;
            }
            selectedSections.push(section);
            currentLength += section.content.length;
        }

        // 4. Tạo nội dung cho prompt
        const promptContent = this.generatePromptContent(selectedSections, activityType);

        const totalRelevance = selectedSections.length > 0
            ? selectedSections.reduce((sum, s) => sum + s.relevance[activityType], 0) / selectedSections.length
            : 0;

        return {
            sections: selectedSections,
            promptContent,
            totalRelevance,
            coverage: (selectedSections.length / (structuredContent.sections.length || 1)) * 100
        };
    }

<<<<<<< HEAD
    private prioritizeByActivity(
        sections: ContentSection[],
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung'
    ): ContentSection[] {
        const priorities: Record<string, string[]> = {
            khoi_dong: ['objective', 'activity', 'knowledge'],
            kham_pha: ['knowledge', 'activity', 'objective'],
            luyen_tap: ['activity', 'assessment', 'knowledge'],
            van_dung: ['activity', 'assessment', 'resource']
        };
        const pList = priorities[activityType] || [];
        return [...sections].sort((a, b) => {
            const aIdx = pList.indexOf(a.type);
            const bIdx = pList.indexOf(b.type);
            const aP = aIdx === -1 ? 99 : aIdx;
            const bP = bIdx === -1 ? 99 : bIdx;
            if (aP !== bP) return aP - bP;
            return (b.relevance[activityType] || 0) - (a.relevance[activityType] || 0);
        });
    }

    private generateTargetedPromptContent(
        sections: ContentSection[],
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung'
    ): string {
        const names: Record<string, string> = {
            khoi_dong: 'KHỞI ĐỘNG (WARM-UP)',
            kham_pha: 'KHÁM PHÁ (KNOWLEDGE FORMATION)',
            luyen_tap: 'LUYỆN TẬP (PRACTICE)',
            van_dung: 'VẬN DỤNG (APPLICATION)'
        };

        let content = `## 🎯 DỮ LIỆU ĐÃ TỐI ƯU CHO HOẠT ĐỘNG: ${names[activityType] || activityType}\n`;
        content += `> Hướng dẫn: Đây là các mảnh kiến thức được trích xuất từ tài liệu gốc, lọc theo mức độ liên quan cao nhất.\n\n`;

        sections.forEach((s, i) => {
            content += `[MẢNH ${i + 1}: ${s.title.toUpperCase()}] (${s.type})\n`;
            content += `${s.content}\n\n`;
        });

        return content;
    }

=======
>>>>>>> parent of 1427bc2 (V10)
    private prioritizeSections(
        sections: ContentSection[],
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung'
    ): ContentSection[] {
        const typePriorities: Record<string, string[]> = {
            khoi_dong: ['objective', 'activity', 'knowledge'],
            kham_pha: ['knowledge', 'activity', 'objective'],
            luyen_tap: ['assessment', 'activity', 'knowledge'],
            van_dung: ['assessment', 'activity', 'resource']
        };

        const priorities = typePriorities[activityType] || [];

        return [...sections].sort((a, b) => {
            const aIndex = priorities.indexOf(a.type);
            const bIndex = priorities.indexOf(b.type);

            const aPriority = aIndex === -1 ? 99 : aIndex;
            const bPriority = bIndex === -1 ? 99 : bIndex;

            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            // Cùng loại thì ưu tiên độ liên quan
            return (b.relevance[activityType] || 0) - (a.relevance[activityType] || 0);
        });
    }

    private generatePromptContent(
        sections: ContentSection[],
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung'
    ): string {
        const activityNames: Record<string, string> = {
            khoi_dong: 'Khởi động',
            kham_pha: 'Khám phá',
            luyen_tap: 'Luyen tập',
            van_dung: 'Vận dụng'
        };

        let content = `## 📚 DỮ LIỆU GỐC TRÍCH XUẤT CHO HOẠT ĐỘNG: ${activityNames[activityType]?.toUpperCase()}\n`;
        content += `(Ghi chú: Đây là dữ liệu được AI lọc theo độ liên quan để tối ưu ngữ cảnh)\n\n`;

        sections.forEach((section, index) => {
            content += `--- PHẦN ${index + 1}: ${section.title} [Loại: ${section.type}] ---\n`;
            content += `${section.content}\n\n`;
        });

        return content;
    }
}
