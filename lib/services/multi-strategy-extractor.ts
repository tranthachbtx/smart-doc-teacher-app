
import { parseFileLocally } from "@/lib/actions/local-parser";
import { extractTextFromFile } from "@/lib/actions/gemini";

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

        // STRATEGY 1: Local Parser (Fastest, Cheapest)
        // We always try this first for DOCX and PDF (Text-based).
        try {
            console.log('[MultiStrategy] Attempting Local Parse...');
            const localRes = await parseFileLocally({
                mimeType: file.type,
                data: base64Data
            });

            if (localRes.success && localRes.content && localRes.content.length > 50) {
                // Validation: If extraction is too short (<50 chars), it might be a scanned PDF (image only).
                // If reasonably long, accept it.
                return {
                    content: localRes.content,
                    source: 'local_parser'
                };
            } else if (localRes.success) {
                console.warn('[MultiStrategy] Local parse too short. Likely scanned document.');
            } else {
                errors.push(`Local Parser: ${localRes.error}`);
            }
        } catch (e: any) {
            errors.push(`Local Parser Exception: ${e.message}`);
        }

        // STRATEGY 2: Gemini Vision (Fallback for Scanned PDFs or Complex Layouts)
        try {
            console.log('[MultiStrategy] Falling back to Gemini Vision...');
            const geminiRes = await extractTextFromFile(
                { mimeType: file.type, data: base64Data },
                "Hãy phân tích tài liệu này. Tóm tắt nội dung chính và đề xuất cấu trúc bài dạy phù hợp. Trả về text thuần."
            );

            if (geminiRes.success && geminiRes.content) {
                return {
                    content: geminiRes.content,
                    source: 'gemini_vision'
                };
            } else {
                errors.push(`Gemini Vision: ${geminiRes.error}`);
            }
        } catch (e: any) {
            errors.push(`Gemini Vision Exception: ${e.message}`);
        }

        // All strategies failed
        throw new Error(`All extraction strategies failed. Details: ${errors.join(' | ')}`);
    }
}
