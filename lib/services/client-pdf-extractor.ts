
import * as pdfjsLib from 'pdfjs-dist';

// Configure Web Worker
// Note: We need to point to the worker file in public folder or CDN
// For Next.js, it's often easier to use the CDN for the worker to avoid build complexity
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ClientPDFResult {
    text: string;
    pageCount: number;
    isScanned: boolean;
}

export class ClientPDFExtractor {
    /**
     * Extracts text from PDF using Browser's PDF.js
     * This avoids uploading large files to server.
     */
    static async extractText(file: File, onProgress?: (percent: number) => void): Promise<ClientPDFResult> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            let fullText = '';
            let totalChars = 0;

            console.log(`[ClientPDF] Processing ${numPages} pages...`);

            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');

                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
                totalChars += pageText.length;

                if (onProgress) {
                    onProgress(Math.floor((i / numPages) * 100));
                }
            }

            // Heuristic for scanned PDF: average chars per page < 50
            const isScanned = (totalChars / numPages) < 50;

            return {
                text: fullText,
                pageCount: numPages,
                isScanned
            };

        } catch (error) {
            console.error('[ClientPDF] Extraction failed:', error);
            throw error;
        }
    }
}
