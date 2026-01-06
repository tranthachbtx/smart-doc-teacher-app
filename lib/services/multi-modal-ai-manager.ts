
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
     */
    async processContent(input: { text: string; file?: any }, prompt: string): Promise<{ content: string; success: boolean }> {
        console.log(`[MultiModalAIManager] Routing request to Gemini...`);

        try {
            // Combine input and prompt for the underlying gemini action
            const combinedPrompt = `${prompt}\n\nCONTENT TO PROCESS:\n${input.text}`;

            const result = await generateAIContent(combinedPrompt, "gemini-1.5-flash");

            if (result.success && result.content) {
                return {
                    content: result.content,
                    success: true
                };
            } else {
                throw new Error(result.error || "AI processing failed");
            }
        } catch (error: any) {
            console.error(`[MultiModalAIManager] Error:`, error.message);
            return {
                content: "",
                success: false
            };
        }
    }
}
