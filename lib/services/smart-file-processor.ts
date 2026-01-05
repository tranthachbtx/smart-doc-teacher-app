
import { CachedProcessingEngine } from "./cached-processing-engine";
import { extractTextFromFile } from "@/lib/actions/gemini";

export class SmartFileProcessor {
    private static instance: SmartFileProcessor;
    // Limit increased to 20MB as requested in Phase 1
    private readonly MAX_FILE_SIZE = 20 * 1024 * 1024;

    private constructor() { }

    public static getInstance(): SmartFileProcessor {
        if (!SmartFileProcessor.instance) {
            SmartFileProcessor.instance = new SmartFileProcessor();
        }
        return SmartFileProcessor.instance;
    }

    public async processFile(
        file: File,
        onProgress?: (stage: string) => void
    ): Promise<{ content: string; source: 'cache' | 'api' }> {

        // 1. Validation
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error(`File too large (Max ${this.MAX_FILE_SIZE / 1024 / 1024}MB).`);
        }

        const cacheEngine = CachedProcessingEngine.getInstance();
        if (onProgress) onProgress("Calculating unique hash...");

        // 2. Hash & Cache
        const hash = await cacheEngine.generateFileHash(file);
        const cachedContent = cacheEngine.getFromCache(hash);

        if (cachedContent) {
            console.log('[SmartFileProcessor] Cache hit for', file.name);
            if (onProgress) onProgress("Found in cache!");
            // Small delay to let user see "Found in cache"
            await new Promise(r => setTimeout(r, 500));
            return { content: cachedContent, source: 'cache' };
        }

        // 3. API Processing (Multi-Strategy)
        console.log('[SmartFileProcessor] Cache miss. Uploading...', file.name);
        if (onProgress) onProgress("Reading file content...");

        // Convert to Base64
        const base64Data = await this.fileToBase64(file);

        if (onProgress) onProgress("Analyzing content (Local Parse -> Cloud AI)...");

        // Lazy load extractor
        const { MultiStrategyExtractor } = await import('@/lib/services/multi-strategy-extractor');
        const extractor = MultiStrategyExtractor.getInstance();

        const extractionResult = await extractor.extract(file, base64Data);

        // If the result comes from 'local_parser', we might want to SUMMARIZE it if it's too long,
        // because manual workflow expects a "Summary/Guidance", not raw 20 page text.
        // However, providing full context is also good.
        // Let's ensure if it's raw text, we ask Gemini to summarize it briefly IF it's massive.
        // For now, return as is, or optionally summarize.

        // 4. Save to Cache
        cacheEngine.setCache(hash, extractionResult.content);

        return { content: extractionResult.content, source: 'api' };
    }

    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:application/pdf;base64, prefix
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }
}
