
import { parseFileLocally } from "@/lib/actions/local-parser";
import { extractTextFromFile } from "@/lib/actions/gemini";
import { TextCleaningService } from "./text-cleaning-service";
import { enhancedPDFExtractor } from "@/lib/enhanced-pdf-extractor";

export interface ExtractedContent {
    content: string;
    source: 'local_parser' | 'gemini_vision' | 'ocr';
    score?: number;
}

export class MultiStrategyExtractor {
    private static instance: MultiStrategyExtractor;

    // Strategy Weights (Higher is better)
    // Local Parser: Fast, Free, High Text Accuracy (if text layout is simple). Format might be lost.
    // Gemini Vision: Slow, Costly, High Context/Visual Accuracy.

    private constructor() { }

    public static getInstance(): MultiStrategyExtractor {
        if (!MultiStrategyExtractor.instance) {
            MultiStrategyExtractor.instance = new MultiStrategyExtractor();
        }
        return MultiStrategyExtractor.instance;
    }

    public async extract(file: File, base64Data: string): Promise<ExtractedContent> {

        const errors: string[] = [];

        // STRATEGY 1: Client-Side PDF Parser (Browser Main Thread / Worker)
        // Fastest, Zero Network Latency for Text PDFs.
        if (file.type === 'application/pdf' && typeof window !== 'undefined') {
            try {
                console.log('[MultiStrategy] Attempting Enhanced PDF Extraction (Arch 18.0)...');
                const enhancedRes = await enhancedPDFExtractor.extractAndAnalyzePDF(file);

                if (enhancedRes.sections.length > 0 || enhancedRes.rawText.length > 500) {
                    console.log(`[MultiStrategy] Enhanced extraction success. Found ${enhancedRes.sections.length} sections.`);
                    // We return the raw text cleaned, but the system can now leverage enhancedRes if needed later
                    return this.finalizeContent(enhancedRes.rawText, 'local_parser');
                }
            } catch (e: any) {
                console.warn(`[MultiStrategy] Enhanced PDF Extraction failed: ${e.message}`);
                errors.push(`Enhanced PDF: ${e.message}`);
            }

            try {
                console.log('[MultiStrategy] Attempting Client-Side PDF Parse...');
                // Dynamic import to ensure it runs only in browser
                const { ClientPDFExtractor } = await import('@/lib/services/client-pdf-extractor');

                const clientRes = await ClientPDFExtractor.extractText(file);

                if (!clientRes.isScanned && clientRes.text.length > 100) {
                    console.log('[MultiStrategy] Client-side success.');
                    return this.finalizeContent(clientRes.text, 'local_parser');
                } else {
                    console.warn('[MultiStrategy] PDF appears scanned or empty (Client). Falling back...');
                }
            } catch (e: any) {
                console.warn(`[MultiStrategy] Client PDF Parse failed: ${e.message}`, e);
                errors.push(`Client PDF: ${e.message}`);
            }
        } else if (file.type === 'application/pdf') {
            console.log('[MultiStrategy] Skipping Client-side strategies (Server environment).');
        }

        // STRATEGY 2: Server-Side Local Parser (DOCX mainly, or PDF fallback)
        try {
            console.log('[MultiStrategy] Attempting Server-Side Local Parse...');
            const localRes = await parseFileLocally({
                mimeType: file.type,
                data: base64Data
            });

            if (localRes.success && localRes.content && localRes.content.length > 50) {
                return this.finalizeContent(localRes.content, 'local_parser');
            } else if (localRes.success) {
                console.warn('[MultiStrategy] Server Local parse too short.');
            } else {
                errors.push(`Server Parser: ${localRes.error}`);
            }
        } catch (e: any) {
            errors.push(`Server Parser Exception: ${e.message}`);
        }

        // STRATEGY 3: Gemini Vision (Ultimate Fallback for Scanned/Complex)
        try {
            console.log('[MultiStrategy] Falling back to Gemini Vision...');
            const geminiRes = await extractTextFromFile(
                { mimeType: file.type, data: base64Data },
                "Hãy phân tích tài liệu này. Tóm tắt nội dung chính và đề xuất cấu trúc bài dạy phù hợp. Trả về text thuần."
            );

            if (geminiRes.success && geminiRes.content) {
                return this.finalizeContent(geminiRes.content, 'gemini_vision');
            } else {
                errors.push(`Gemini Vision: ${geminiRes.error}`);
            }
        } catch (e: any) {
            errors.push(`Gemini Vision Exception: ${e.message}`);
        }

        // All strategies failed
        if (errors.length > 0) {
            console.warn('[MultiStrategy] No high-quality text extracted via traditional methods. AI fallback encouraged.', errors);
        }

        return {
            content: "",
            source: 'ocr', // Placeholder for AI fallback
            score: 0
        };
    }

    private finalizeContent(content: string, source: 'local_parser' | 'gemini_vision' | 'ocr'): ExtractedContent {
        const cleaner = TextCleaningService.getInstance();
        return {
            content: cleaner.clean(content),
            source
        };
    }
}
