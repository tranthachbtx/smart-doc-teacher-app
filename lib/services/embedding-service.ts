
import { GoogleGenerativeAI } from "@google/generative-ai";

export class EmbeddingService {
    private static instance: EmbeddingService;
    private genAI: GoogleGenerativeAI;
    private model: any;

    private constructor() {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "embedding-001" });
    }

    public static getInstance(): EmbeddingService {
        if (!EmbeddingService.instance) {
            EmbeddingService.instance = new EmbeddingService();
        }
        return EmbeddingService.instance;
    }

    async getEmbedding(text: string): Promise<number[]> {
        try {
            const result = await this.model.embedContent(text.substring(0, 1000));
            return result.embedding.values;
        } catch (error) {
            console.error("[EmbeddingService] Error:", error);
            // Fallback to a zero vector if embedding fails
            return new Array(768).fill(0);
        }
    }

    calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
