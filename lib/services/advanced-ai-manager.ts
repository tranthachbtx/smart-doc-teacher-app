
import { generateAIContent } from "@/lib/actions/gemini";
import { CircuitBreaker } from "./circuit-breaker";
import { PerformanceMonitor } from "./performance-monitor";
import { StructuredContent } from "./content-structure-analyzer";

export interface AIRequest {
    id: string;
    content: string;
    options?: any;
    priority: number;
    timestamp: number;
    timeout: number;
}

export class AdvancedAIManager {
    private static instance: AdvancedAIManager;
    private circuitBreaker: CircuitBreaker;
    private performanceMonitor: PerformanceMonitor;

    private constructor() {
        this.circuitBreaker = new CircuitBreaker({
            failureThreshold: 3,
            resetTimeout: 30000,
            monitoringPeriod: 60000
        });
        this.performanceMonitor = PerformanceMonitor.getInstance();
    }

    public static getInstance(): AdvancedAIManager {
        if (!AdvancedAIManager.instance) {
            AdvancedAIManager.instance = new AdvancedAIManager();
        }
        return AdvancedAIManager.instance;
    }

    async analyzeContent(
        content: string,
        prompt: string,
        timeoutMs: number = 45000
    ): Promise<string> {

        return this.circuitBreaker.execute(async () => {
            const startTime = Date.now();
            try {
                // AbortSignal for the fetch itself
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

                const aiResponse = await generateAIContent(prompt, "gemini-1.5-flash");

                clearTimeout(timeoutId);

                if (!aiResponse.success || !aiResponse.content) {
                    throw new Error(aiResponse.error || "AI_EMPTY_RESPONSE");
                }

                const duration = Date.now() - startTime;
                this.performanceMonitor.recordSuccess(duration);
                console.log(`[AdvancedAIManager] AI Success in ${duration}ms`);

                return aiResponse.content;
            } catch (error: any) {
                const duration = Date.now() - startTime;
                this.performanceMonitor.recordFailure(duration, error);
                console.error(`[AdvancedAIManager] AI Failure after ${duration}ms:`, error.message);
                throw error;
            }
        });
    }

    public getStats() {
        return {
            ...this.performanceMonitor.getStats(),
            circuitState: this.circuitBreaker.getState()
        };
    }
}
