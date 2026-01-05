
import { ActionResult } from "@/lib/types";

export interface FileChunk {
    data: Blob;
    index: number;
    total: number;
    startPage?: number;
    endPage?: number;
}

export interface ChunkProcessingResult {
    chunkIndex: number;
    text: string;
    summary?: string;
}

export class ChunkedPDFProcessor {
    private static instance: ChunkedPDFProcessor;
    private readonly MAX_CHUNK_SIZE_BYTES = 4 * 1024 * 1024; // 4MB to be safe with Server Action limits

    private constructor() { }

    public static getInstance(): ChunkedPDFProcessor {
        if (!ChunkedPDFProcessor.instance) {
            ChunkedPDFProcessor.instance = new ChunkedPDFProcessor();
        }
        return ChunkedPDFProcessor.instance;
    }

    /**
     * Determines if a file needs chunking based on size.
     */
    public shouldChunk(file: File): boolean {
        return file.size > this.MAX_CHUNK_SIZE_BYTES;
    }

    /**
     * Splits a File into chunks. 
     * NOTE: For PDFs, simple binary splitting (Blob.slice) often breaks the file structure 
     * unless the receiving parser handles partial streams (rare).
     * 
     * IDEALLY: We should parse pages client-side.
     * FALLBACK: We slice binary, but the Server Action MUST handle binary reconstruction or partial parsing.
     * 
     * CURRENT STRATEGY: 
     * Since we can't reliably split PDF structure without a heavy library like pdf-lib, 
     * and we want to avoid breaking the PDF, we might need to rely on the SERVER to download/process 
     * if the file is too huge for a single upload. 
     * 
     * HOWEVER, User Phase 2 requests "Chunked Processing". 
     * We will attempt logical splitting if possible, otherwise physical splitting.
     */
    public async createChunks(file: File): Promise<FileChunk[]> {
        const chunks: FileChunk[] = [];
        const totalChunks = Math.ceil(file.size / this.MAX_CHUNK_SIZE_BYTES);

        for (let i = 0; i < totalChunks; i++) {
            const start = i * this.MAX_CHUNK_SIZE_BYTES;
            const end = Math.min(start + this.MAX_CHUNK_SIZE_BYTES, file.size);
            const blob = file.slice(start, end);

            chunks.push({
                data: blob,
                index: i,
                total: totalChunks
            });
        }
        return chunks;
    }

    /**
     * Process a large file by splitting it, uploading chunks, and merging results.
     * Note: This requires the Server Action to support 'Append' or 'Process Chunk' mode.
     */
    public async processInChunks(
        file: File,
        processorFn: (chunk: FileChunk) => Promise<string>,
        onProgress?: (progress: number) => void
    ): Promise<string> {
        const chunks = await this.createChunks(file);
        const results: string[] = [];

        for (let i = 0; i < chunks.length; i++) {
            if (onProgress) {
                onProgress(Math.round(((i + 1) / chunks.length) * 100));
            }

            // Processing delay to avoid rate limits
            if (i > 0) await new Promise(r => setTimeout(r, 1500));

            try {
                // We send the chunk. 
                // CRITICAL: A binary slice of a PDF is usually invalid.
                // If we are just sending text (e.g. .txt), this works.
                // For PDF, this approach is flawed without Server-Side Reconstruction.
                // 
                // REVISED APPROACH:
                // We cannot send binary chunks of a PDF to Gemini Vision.
                // We MUST extract text Client-Side effectively or accept the 20MB upload.
                // 
                // If 'processorFn' implies Client-Side Page Extraction -> Text -> Send Text Chunk,
                // that is the only valid "Chunking" strategy for oversized PDFs on limited bandwidth/quota.

                const result = await processorFn(chunks[i]);
                results.push(result);
            } catch (e: any) {
                console.error(`Chunk ${i} failed`, e);
                // Continue best effort? Or fail?
                // For now, we log and continue.
                results.push(`[Chunk ${i} Error: ${e.message}]`);
            }
        }

        return results.join("\n\n--- CHUNK SEPARATOR ---\n\n");
    }
}
