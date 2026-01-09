/**
 * 🎯 SIMPLE PDF EXTRACTOR - BACK TO BASICS ARCHITECTURE 17.0
 * Trích xuất nội dung từ PDF và DOCX một cách đơn giản
 */

// Using require for pdf-parse to avoid TypeScript module resolution issues
export async function extractPDFContent(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();

    if (file.type === 'application/pdf') {
      // 1. Browser Environment Check
      if (typeof window !== 'undefined') {
        // pdf-parse is Node.js only.
        // Throw error to trigger Fallback to Client-Side PDFJS (which is working).
        throw new Error("Client-side environment extracted via Fallback.");
      }

      // 2. Server-side Extraction
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      return data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX, we'll use a simpler approach - convert to text
      // Note: This is a simplified version. For full DOCX support, consider using mammoth.js
      const text = await file.text();
      return text;
    } else {
      throw new Error('Chỉ hỗ trợ file PDF và DOCX');
    }
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Không thể trích xuất nội dung từ file. Vui lòng kiểm tra lại file.');
  }
}

export async function extractFromBuffer(buffer: ArrayBuffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      return data.text;
    } else {
      throw new Error('Unsupported file type for buffer extraction');
    }
  } catch (error) {
    console.error('Buffer extraction error:', error);
    throw new Error('Failed to extract content from buffer');
  }
}
