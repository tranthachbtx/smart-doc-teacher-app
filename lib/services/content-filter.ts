
import { ContentSection, StructuredContent } from "./content-structure-analyzer";
import { TextCleaningService } from "./text-cleaning-service";

export interface FilteredContent {
    sections: ContentSection[];
    promptContent: string;
    totalRelevance: number;
    coverage: number;
}

export class ContentFilter {
    /**
     * Lá»c ná»™i dung dá»±a trÃªn loáº¡i hoáº¡t Ä‘á»™ng vÃ  giá»›i háº¡n Ä‘á»™ dÃ i
     */
    filterContentForActivity(
        structuredContent: StructuredContent,
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung' | 'khac' | 'shdc' | 'shl' | 'setup' | 'appendix',
        maxContentLength: number = 4000
    ): FilteredContent {
        // 1. Lá»c theo Ä‘á»™ liÃªn quan
        // Náº¿u lÃ  'khac' hoáº·c cÃ¡c pháº§n bá»• trá»£, láº¥y toÃ n bá»™ hoáº·c lá»c theo type resource/objective
        let relevantSections = [];
        if (activityType === 'khoi_dong' || activityType === 'kham_pha' || activityType === 'luyen_tap' || activityType === 'van_dung') {
            const typeKey = activityType;
            relevantSections = structuredContent.sections
                .filter(section => (section.relevance[typeKey] || 0) >= 35)
                .sort((a, b) => (b.relevance[typeKey] || 0) - (a.relevance[typeKey] || 0));
        } else {
            // Äá»‘i vá»›i SHDC/SHL/Setup: Láº¥y cÃ¡c pháº§n cÃ³ type tÆ°Æ¡ng á»©ng
            relevantSections = structuredContent.sections.filter(s => {
                if (activityType === 'shdc' || activityType === 'shl') return s.title.toLowerCase().includes(activityType);
                if (activityType === 'setup') return s.type === 'objective' || s.type === 'resource';
                if (activityType === 'appendix') return s.type === 'assessment' || s.type === 'resource';
                return true; // fallback cho 'khac'
            });
            if (relevantSections.length === 0) relevantSections = structuredContent.sections.slice(0, 10);
        }

        // 2. Æ¯u tiÃªn theo loáº¡i hoáº¡t Ä‘á»™ng (DÃ¹ng logic V10 cáº£i tiáº¿n)
        // Type assertion to bypass strict activity check for prioritization
        const prioritizedSections = this.prioritizeByActivity(relevantSections, activityType as any);

        // 3. TrÃ­ch xuáº¥t ná»™i dung trong giá»›i háº¡n Ä‘á»™ dÃ i
        let currentLength = 0;
        const selectedSections: ContentSection[] = [];

        for (const section of prioritizedSections) {
            if (currentLength + section.content.length > maxContentLength && selectedSections.length > 0) {
                continue;
            }
            selectedSections.push(section);
            currentLength += section.content.length;
        }

        // 4. Táº¡o ná»™i dung cho prompt (Targeted format)
        const promptContent = this.generateTargetedPromptContent(selectedSections, activityType as any);

        const totalRelevance = selectedSections.length > 0
            ? selectedSections.reduce((sum, s) => {
                const relevance = (activityType in s.relevance) ? (s.relevance as any)[activityType] : 50;
                return sum + relevance;
            }, 0) / selectedSections.length
            : 0;

        return {
            sections: selectedSections,
            promptContent,
            totalRelevance,
            coverage: (selectedSections.length / (structuredContent.sections.length || 1)) * 100
        };
    }

    private prioritizeByActivity(
        sections: ContentSection[],
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung' | 'shdc' | 'shl' | 'setup' | 'appendix' | 'khac'
    ): ContentSection[] {
        const priorities: Record<string, string[]> = {
            khoi_dong: ['objective', 'activity', 'knowledge'],
            kham_pha: ['knowledge', 'activity', 'objective'],
            luyen_tap: ['activity', 'assessment', 'knowledge'],
            van_dung: ['activity', 'assessment', 'resource'],
            shdc: ['activity', 'objective'],
            shl: ['activity', 'objective'],
            setup: ['objective', 'resource'],
            appendix: ['assessment', 'resource']
        };
        const pList = priorities[activityType] || [];
        return [...sections].sort((a, b) => {
            const aIdx = pList.indexOf(a.type);
            const bIdx = pList.indexOf(b.type);
            const aP = aIdx === -1 ? 99 : aIdx;
            const bP = bIdx === -1 ? 99 : bIdx;
            if (aP !== bP) return aP - bP;
            return ((b.relevance as Record<string, any>)[activityType] || 0) - ((a.relevance as Record<string, any>)[activityType] || 0);
        });
    }

    private generateTargetedPromptContent(
        sections: ContentSection[],
        activityType: 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung' | 'shdc' | 'shl' | 'setup' | 'appendix' | 'khac'
    ): string {
        const names: Record<string, string> = {
            khoi_dong: 'KHá»žI Äá»˜NG (WARM-UP)',
            kham_pha: 'KHÃM PHÃ (KNOWLEDGE FORMATION)',
            luyen_tap: 'LUYá»†N Táº¬P (PRACTICE)',
            van_dung: 'Váº¬N Dá»¤NG (APPLICATION)',
            shdc: 'SINH HOáº T DÆ¯á»šI Cá»œ',
            shl: 'SINH HOáº T Lá»šP',
            setup: 'Má»¤C TIÃŠU & THIáº¾T Bá»Š',
            appendix: 'PHá»¤ Lá»¤C & ÄÃNH GIÃ'
        };

        const cleaner = TextCleaningService.getInstance();
        let content = `## ðŸŽ¯ Dá»® LIá»†U ÄÃƒ Tá»I Æ¯U CHO HOáº T Äá»˜NG: ${names[activityType] || activityType}\n`;
        content += `> HÆ°á»›ng dáº«n: ÄÃ¢y lÃ  cÃ¡c máº£nh kiáº¿n thá»©c Ä‘Æ°á»£c trÃ­ch xuáº¥t tá»« tÃ i liá»‡u gá»‘c, lá»c theo má»©c Ä‘á»™ liÃªn quan cao nháº¥t.\n\n`;

        sections.forEach((s, i) => {
            const sanitizedTitle = cleaner.clean(s.title).toUpperCase();
            const sanitizedContent = cleaner.clean(s.content);

            // Skip if the resulting content is too short or just a marker
            if (sanitizedContent.length < 30 || sanitizedTitle.match(/PAGE\s+\d+/i)) return;

            content += `[Máº¢NH ${i + 1}: ${sanitizedTitle}] (${s.type})\n`;
            content += `${sanitizedContent}\n\n`;
        });

        return content;
    }
}
