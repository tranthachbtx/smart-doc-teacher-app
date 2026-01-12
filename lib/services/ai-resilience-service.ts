/**
 * AI RESILIENCE V7 - LEAN UTILITY
 * Quáº£n lÃ½ Rate Limit vÃ  Theo dÃµi sá»­ dá»¥ng tÃ i nguyÃªn AI.
 */

export const AIResilienceService = {
    requestsInLastMinute: 0,
    lastResetTime: Date.now(),
    totalTokens: 0,

    /**
     * Kiá»ƒm tra Rate Limit (Há»‡ thá»‘ng Ä‘iá»u tiáº¿t lÆ°u lÆ°á»£ng)
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
     * Æ¯á»›c tÃ­nh sá»‘ token sá»­ dá»¥ng (Monitoring)
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
     * Fallback tá»‘i giáº£n cho System V7
     */
    async getFallbackContent(section: string, topic: string) {
        console.warn(`[Resilience] Triggering Lean Fallback for ${section}...`);
        return `[Há»‡ thá»‘ng dá»± phÃ²ng V7] Äang chuáº©n bá»‹ ná»™i dung cho ${topic}. Vui lÃ²ng thá»­ láº¡i sau giÃ¢y lÃ¡t.`;
    }
};
