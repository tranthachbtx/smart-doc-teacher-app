

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
    ): Promise<{ content: string; source: 'cache' | 'api'; analyzed?: any }> {
        console.log(`[SmartFileProcessor] Initiating 9.1 High-Performance Pipeline for ${file.name}`);

        // 1. Validation
        if (file.size > this.MAX_FILE_SIZE) {
            throw new Error(`File too large (Max ${this.MAX_FILE_SIZE / 1024 / 1024}MB).`);
        }

        const { SmartCacheV2 } = await import('@/lib/services/smart-cache-v2');
        const cacheEngine = SmartCacheV2.getInstance();

        if (onProgress) onProgress("🔐 Layering Security & Checking Cache...");

        // 2. Hash & Cache
        const hash = await this.generateFileHash(file);

        const cachedContent = await cacheEngine.get(hash);

        if (cachedContent) {
            console.log(`[SmartFileProcessor] Smart Cache V2 hit for ${file.name}. Content Length: ${cachedContent.length}`);
            console.log(`[SmartFileProcessor] 🚨 AUDIT MODE: IGNORING CACHE to force clean extraction.`);
            // if (onProgress) onProgress("⚡ Found in Smart Cache!");
            // await new Promise(r => setTimeout(r, 500));
            // return { content: cachedContent, source: 'cache' };
        }

        // 3. API Processing (Multi-Strategy)
        console.log('[SmartFileProcessor] Cache miss. Uploading...', file.name);
        if (onProgress) onProgress("Reading file content...");

        // Convert to Base64
        const base64Data = await this.fileToBase64(file);

        if (onProgress) onProgress("Analyzing content (Client PDF / Local / Cloud AI)...");

        const { MultiStrategyExtractor } = await import('@/lib/services/multi-strategy-extractor');
        const extractor = MultiStrategyExtractor.getInstance();

        const extractionResult = await extractor.extract(file, base64Data);
        console.log(`[SmartFileProcessor] Extraction complete. Length: ${extractionResult.content?.length || 0} chars. Source: ${extractionResult.source}`);

        if (onProgress) onProgress("🧠 Offloading Pedagogical Analysis to Background Worker...");

        // --- 9.1 PERFORMANCE: WORKER OFFLOAD ---
        let analyzed = null;
        try {
            analyzed = await this.runWorkerAnalysis(extractionResult.content, file.name);
        } catch (e) {
            console.warn('[SmartFileProcessor] Worker analysis failed, falling back to main thread.', e);
        }

        // If the result comes from 'local_parser', we might want to SUMMARIZE it if it's too long,
        // because manual workflow expects a "Summary/Guidance", not raw 20 page text.
        // However, providing full context is also good.
        // Let's ensure if it's raw text, we ask Gemini to summarize it briefly IF it's massive.
        // For now, return as is, or optionally summarize.

        // 4. Save to Smart Cache
        // Validate content before caching
        if (extractionResult.content && extractionResult.content.length > 50) {
            // Save async to not block UI
            cacheEngine.set(hash, extractionResult.content).catch(e => console.warn('Cache set failed', e));
        } else {
            console.warn('[SmartFileProcessor] Content too short/empty. NOT caching.');
        }

        return {
            content: extractionResult.content,
            source: 'api',
            analyzed
        };
    }

    private async runWorkerAnalysis(content: string, fileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const worker = new Worker(new URL('../workers/smart-processor.worker.ts', import.meta.url));
                worker.onmessage = (e) => {
                    if (e.data.success) {
                        resolve(e.data.result);
                    } else {
                        reject(new Error(e.data.error));
                    }
                    worker.terminate();
                };
                worker.onerror = (e) => {
                    reject(e);
                    worker.terminate();
                };
                worker.postMessage({ type: 'PROCESS_TEXT_ANALYSIS', data: content, fileName });
            } catch (e) {
                reject(e);
            }
        });
    }

    private async generateFileHash(file: File): Promise<string> {
        if (typeof window === 'undefined') return file.name; // Fallback
        try {
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            console.warn('[SmartFileProcessor] Hashing failed', e);
            return `${file.name}_${file.size}_${file.lastModified}`;
        }
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
