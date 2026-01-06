
export class IntelligentContentCleaner {
    private static instance: IntelligentContentCleaner;

    public static getInstance(): IntelligentContentCleaner {
        if (!IntelligentContentCleaner.instance) {
            IntelligentContentCleaner.instance = new IntelligentContentCleaner();
        }
        return IntelligentContentCleaner.instance;
    }

    async clean(content: string, maxLength: number = 2000): Promise<string> {
        let cleaned = content;

        // 1. Remove markers
        cleaned = cleaned.replace(/--- Page \d+ ---/gi, '')
            .replace(/^Page \d+$/gm, '')
            .replace(/https?:\/\/[^\s]+/gi, '');

        // 2. Normalize whitespace
        cleaned = cleaned.replace(/\s+/g, ' ')
            .replace(/[.,!?]{2,}/g, '.')
            .trim();

        // 3. Surgical Boilerplate Removal (Architecture 7.2.4)
        const surgicalNoise = [
            /Chào các em[!,.]?/gi,
            /Sau đây là nội dung[^.]*[.]/gi,
            /như đã nói ở trên/gi,
            /tương tự như (đã nêu|phần trước)/gi,
            /giáo viên tiến hành (các bước|quy trình|thao tác)/gi,
            /học sinh tập trung (lắng nghe|theo dõi)/gi,
            /mục tiêu (của bài|của hoạt động) này là[^:]*:/gi,
            /\(Tiếp theo\)/gi,
            /\(Hết\)/gi,
            /---/g
        ];

        surgicalNoise.forEach(pattern => {
            cleaned = cleaned.replace(pattern, '');
        });

        // 4. Remove empty brackets often left by OCR
        cleaned = cleaned.replace(/\[\s*\]/g, '').replace(/\(\s*\)/g, '');

        // 4. Smart Truncation
        if (cleaned.length > maxLength) {
            const lastSentence = cleaned.lastIndexOf('.', maxLength);
            if (lastSentence > maxLength * 0.7) {
                cleaned = cleaned.substring(0, lastSentence + 1);
            } else {
                cleaned = cleaned.substring(0, maxLength).trim() + "...";
            }
        }

        return cleaned;
    }
}
