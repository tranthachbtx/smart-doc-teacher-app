/**
 * AI RESILIENCE V7 - LEAN UTILITY
 * Quản lý Rate Limit và Theo dõi sử dụng tài nguyên AI.
 */

export const AIResilienceService = {
    requestsInLastMinute: 0,
    lastResetTime: Date.now(),
    totalTokens: 0,

    /**
     * Kiểm tra Rate Limit (Hệ thống điều tiết lưu lượng)
     */
    canMakeRequest(): boolean {
        const now = Date.now();
        if (now - this.lastResetTime > 60000) {
            this.requestsInLastMinute = 0;
            this.lastResetTime = now;
        }
        return this.requestsInLastMinute < 15;
    },

    /**
     * Ước tính số token sử dụng (Monitoring)
     */
    trackUsage(input: string, output: string) {
        const inputTokens = Math.ceil(input.split(/\s+/).length * 1.3);
        const outputTokens = Math.ceil(output.split(/\s+/).length * 1.3);
        this.totalTokens += (inputTokens + outputTokens);

        return {
            inputTokens,
            outputTokens,
            estimatedCost: (inputTokens + outputTokens) * 0.00000015
        };
    },

    /**
     * Fallback tối giản cho System V7
     */
    async getFallbackContent(section: string, topic: string) {
        console.warn(`[Resilience] Triggering Lean Fallback for ${section}...`);
        return `[Hệ thống dự phòng V7] Đang chuẩn bị nội dung cho ${topic}. Vui lòng thử lại sau giây lát.`;
    }
};
