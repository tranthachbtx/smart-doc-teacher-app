/**
 * AI RESILIENCE SERVICE (Phase 3: Hybrid & Fallback)
 * Đảm bảo hệ thống luôn hoạt động ngay cả khi API gặp sự cố.
 */

import { SmartPromptService } from "./smart-prompt-service";

interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
}

export class AIResilienceService {
    private static requestsInLastMinute = 0;
    private static lastResetTime = Date.now();
    private static totalTokens = 0;

    /**
     * Kiểm tra Rate Limit để tránh bị Block IP
     */
    static canMakeRequest(): boolean {
        const now = Date.now();
        if (now - this.lastResetTime > 60000) {
            this.requestsInLastMinute = 0;
            this.lastResetTime = now;
        }

        // Giới hạn an toàn: 15 requests/phút cho Free Tier
        return this.requestsInLastMinute < 15;
    }

    /**
     * Ước tính số token (1 word approx 1.3 tokens)
     */
    static trackUsage(input: string, output: string): TokenUsage {
        const inputTokens = Math.ceil(input.split(/\s+/).length * 1.3);
        const outputTokens = Math.ceil(output.split(/\s+/).length * 1.3);
        this.totalTokens += (inputTokens + outputTokens);

        return {
            inputTokens,
            outputTokens,
            estimatedCost: (inputTokens + outputTokens) * 0.00000015 // Giá ước tính cho Flash 2.0
        };
    }

    /**
     * Fallback Mechanism: Trả về nội dung mẫu nếu AI thất bại
     */
    static async getFallbackContent(section: string, grade: string, topic: string) {
        console.warn(`[Resilience] Triggering Fallback for ${section}...`);

        // Lấy dữ liệu thô từ Database nội bộ để cứu vãn
        const rawData = await SmartPromptService.lookupSmartData(grade, "", topic);

        const fallbacks: Record<string, string> = {
            "objectives": `[OFFLINE FALLBACK]\n${rawData.objectives}\n\nLưu ý: Nội dung này được trích xuất từ Database nội bộ do AI đang quá tải.`,
            "activities": `[OFFLINE FALLBACK]\n1. Khởi động: Trò chơi tìm hiểu về ${topic}.\n2. Khám phá: Đọc tài liệu và thảo luận nhóm.\n3. Luyện tập: Giải quyết tình huống thực tế.\n4. Vận dụng: Lập kế hoạch hành động cá nhân.`,
            "preparation": rawData.pedagogicalNotes
        };

        return fallbacks[section] || "Nội dung đang được cập nhật...";
    }
}
