
import { generateAIContent } from "@/lib/actions/gemini";

/**
 * 🛰️ MULTI-MODAL AI MANAGER - HYBRID INTELLIGENCE BRIDGE
 * Acts as a central orchestrator for advanced engines (Neural, Quantum, etc.)
 */
export class MultiModalAIManager {
    private static instance: MultiModalAIManager;

    public static getInstance(): MultiModalAIManager {
        if (!MultiModalAIManager.instance) {
            MultiModalAIManager.instance = new MultiModalAIManager();
        }
        return MultiModalAIManager.instance;
    }

    /**
     * Standardized method for engines to process content via AI
     * V6.0: Smart Routing & Resilience Engine
     */
    async processContent(
        input: { text: string; file?: any },
        prompt: string,
        tier: 'fast' | 'deep' = 'fast'
    ): Promise<{ content: string; success: boolean }> {
        const preferredModel = tier === 'deep' ? "gemini-1.5-pro" : "gemini-1.5-flash";
        const fallbackModel = tier === 'deep' ? "gemini-1.5-flash" : "gemini-2.0-flash"; // Ultimate fallback

        console.log(`[MultiModalAIManager] Routing ${tier.toUpperCase()} request to ${preferredModel}...`);

        try {
            // Attempt with preferred model
            return await this.executeAI(input, prompt, preferredModel);
        } catch (error: any) {
            console.warn(`[MultiModalAIManager] Preferred model (${preferredModel}) failed: ${error.message}. Attempting resilience fallback to ${fallbackModel}...`);

            try {
                // Resilience Fallback
                return await this.executeAI(input, prompt, fallbackModel);
            } catch (fallbackError: any) {
                console.error(`[MultiModalAIManager] Critical Failure: Both models failed.`, fallbackError.message);
                return { content: "", success: false };
            }
        }
    }

    /**
     * Internal execution agent
     */
    private async executeAI(input: { text: string; file?: any }, prompt: string, model: string): Promise<{ content: string; success: boolean }> {
        const combinedPrompt = `${prompt}\n\nCONTENT TO PROCESS:\n${input.text}`;
        const result = await generateAIContent(combinedPrompt, model);

        if (result.success && result.content) {
            return { content: result.content, success: true };
        } else {
            throw new Error(result.error || "AI processing returned empty result");
        }
    }
}
