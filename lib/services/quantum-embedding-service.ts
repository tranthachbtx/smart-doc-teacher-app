
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MultipleEmbeddings {
    semantic: number[];
    pedagogical: number[];
    contextual: number[];
}

export interface QuantumEmbedding {
    values: number[];
    metadata: {
        model: string;
        dimensions: number;
        timestamp: number;
    };
}

export class QuantumEmbeddingService {
    private static instance: QuantumEmbeddingService;
    private genAI: GoogleGenerativeAI;
    private model: any;

    private constructor() {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using text-embedding-004 which supports up to 768 or more, 
        // we'll aim for the highest available stability
        this.model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    }

    public static getInstance(): QuantumEmbeddingService {
        if (!QuantumEmbeddingService.instance) {
            QuantumEmbeddingService.instance = new QuantumEmbeddingService();
        }
        return QuantumEmbeddingService.instance;
    }

    /**
     * Architecture 10.0: High-dimensional semantic mapping
     */
    async getQuantumEmbedding(text: string): Promise<QuantumEmbedding> {
        try {
            // text-embedding-004 can produce 768 dimensional vectors by default
            const result = await this.model.embedContent({
                content: { parts: [{ text: text.substring(0, 2000) }] },
                taskType: "RETRIEVAL_DOCUMENT"
            });

            return {
                values: result.embedding.values,
                metadata: {
                    model: "text-embedding-004",
                    dimensions: result.embedding.values.length,
                    timestamp: Date.now()
                }
            };
        } catch (error) {
            console.error("[QuantumEmbeddingService] Error:", error);
            return {
                values: new Array(768).fill(0),
                metadata: {
                    model: "fallback",
                    dimensions: 768,
                    timestamp: Date.now()
                }
            };
        }
    }

    calculateSimilarity(vecA: number[], vecB: number[]): number {
        if (vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
    }
}
