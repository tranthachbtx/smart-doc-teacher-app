
"use server";

import { ActionResult } from "@/lib/types";
// We use dynamic imports to handle potential missing dependencies gracefully,
// or just standard imports if we are confident.
// Given extract_pdf.js exists, pdf-parse is likely available.

export async function parseFileLocally(
    file: { mimeType: string; data: string }
): Promise<ActionResult> {
    try {
        const buffer = Buffer.from(file.data, 'base64');

        // 1. DOCX Handling (via mammoth)
        if (file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ buffer: buffer });
            return {
                success: true,
                content: result.value, // The raw text
            };
        }

        // 2. PDF Handling (via pdf-parse)
        if (file.mimeType === 'application/pdf') {
            try {
                const pdf = (await import('pdf-parse')).default;
                const data = await pdf(buffer);
                return {
                    success: true,
                    content: data.text,
                    // We could also return meta like numpages: data.numpages
                };
            } catch (pdfError: any) {
                console.error("PDF Parse Local Error:", pdfError);
                return { success: false, error: "Local PDF Parser failed. " + pdfError.message };
            }
        }

        // 3. Text Handling
        if (file.mimeType === 'text/plain') {
            return { success: true, content: buffer.toString('utf-8') };
        }

        return { success: false, error: "Unsupported file type for local parsing." };

    } catch (error: any) {
        console.error("Local Parsing Error:", error);
        return { success: false, error: error.message };
    }
}
