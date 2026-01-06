
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
        maxContentLength: number = 4000
    ): FilteredContent {
        // 1. Primary filter by relevance score (Smart thresholding)
        const relevantSections = structuredContent.sections
            .filter(section => (section.relevance[activityType] || 0) >= 45)
            .sort((a, b) => (b.relevance[activityType] || 0) - (a.relevance[activityType] || 0));

        // 2. Secondary filter by content type priority (Activity-aware)
        const prioritizedSections = this.prioritizeByActivity(relevantSections, activityType);

        // 3. Tertiary filter: Dynamic integration within length limits
        let currentLength = 0;
        const selectedSections: ContentSection[] = [];

        for (const section of prioritizedSections) {
            // Priority allocation: Keep at least one objective and one activity if available
            const contentLen = section.content.length;
            if (currentLength + contentLen > maxContentLength && selectedSections.length > 2) {
                continue;
            }
            selectedSections.push(section);
            currentLength += contentLen;
        }

        // 4. Generate structured prompt content
        const promptContent = this.generateTargetedPromptContent(selectedSections, activityType);

        // 5. Calculate weighted relevance
        const totalRelevance = selectedSections.length > 0
            ? selectedSections.reduce((sum, s) => sum + s.relevance[activityType], 0) / selectedSections.length
            : 0;

        return {
            sections: selectedSections,
            promptContent,
            totalRelevance,
            coverage: Math.round((selectedSections.length / (structuredContent.sections.length || 1)) * 100)
        };
    }

    private prioritizeByActivity(sections: ContentSection[], activityType: string): ContentSection[] {
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
            return (b.relevance[activityType as any] || 0) - (a.relevance[activityType as any] || 0);
        });
    }

    private generateTargetedPromptContent(sections: ContentSection[], activityType: string): string {
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
        activityType: string
    ): string {
        const activityNames: Record<string, string> = {
            khoi_dong: 'Khởi động',
            kham_pha: 'Khám phá',
            luyen_tap: 'Luyen tập',
            van_dung: 'Vận dụng'
        };

        let content = `## 📚 DỮ LIỆU GỐC TRÍCH XUẤT CHO HOẠT ĐỘNG: ${activityNames[activityType]?.toUpperCase() || activityType}\n`;
        content += `(Ghi chú: Đây là dữ liệu được AI lọc theo độ liên quan để tối ưu ngữ cảnh)\n\n`;

        sections.forEach((section, index) => {
            content += `--- PHẦN ${index + 1}: ${section.title} [Loại: ${section.type}] ---\n`;
            content += `${section.content}\n\n`;
        });

        return content;
    }
}
