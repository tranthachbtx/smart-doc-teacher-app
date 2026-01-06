
/**
 * 🧹 TEXT CLEANING SERVICE - HYBRID INTELLIGENCE 18.0
 * Chuyên trách làm sạch, chuẩn hóa và tối ưu nội dung trích xuất từ PDF/Word.
 */

export class TextCleaningService {
    private static instance: TextCleaningService;

    public static getInstance(): TextCleaningService {
        if (!TextCleaningService.instance) {
            TextCleaningService.instance = new TextCleaningService();
        }
        return TextCleaningService.instance;
    }

    /**
     * Quy trình làm sạch tổng thể
     */
    public clean(text: string): string {
        if (!text) return "";

        let cleaned = text;

        // 1. Loại bỏ các ký tự điều khiển và rác mã hóa
        cleaned = this.removeControlCharacters(cleaned);

        // 2. Chuẩn hóa khoảng trắng và dòng trống
        cleaned = this.normalizeWhitespace(cleaned);

        // 3. Loại bỏ header/footer/page numbers phổ biến
        cleaned = this.removeDocumentJunk(cleaned);

        // 4. Sửa lỗi font/encoding tiếng Việt phổ biến (nếu có)
        cleaned = this.fixVietnameseEncoding(cleaned);

        return cleaned.trim();
    }

    private removeControlCharacters(text: string): string {
        // Loại bỏ ký tự null, các ký tự không in được trừ \n \t \r
        return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    }

    private normalizeWhitespace(text: string): string {
        return text
            .replace(/[ \t]+/g, " ")             // Gộp nhiều space/tab thành 1
            .replace(/\n\s*\n\s*\n+/g, "\n\n")  // Giới hạn tối đa 2 dòng trống liên tiếp
            .replace(/^\s+|\s+$/gm, "");        // Trim từng dòng
    }

    private removeDocumentJunk(text: string): string {
        return text
            .replace(/^Trang\s+\d+(\/\d+)?$/gmi, "")        // Trang 1/10
            .replace(/^Page\s+\d+(\s+of\s+\d+)?$/gmi, "")   // Page 1 of 5
            .replace(/^- \d+ -$/gm, "")                     // - 1 -
            .replace(/^[0-9]+\s*$/gm, "");                  // Dòng chỉ chứa số trang
    }

    private fixVietnameseEncoding(text: string): string {
        // Một số trình đọc PDF cũ có thể bị lỗi các ký tự này
        return text
            .replace(//g, "")
            .replace(//g, "-")
            .replace(//g, "=>")
            .replace(//g, "v")
            .replace(//g, "[ ]");
    }

    /**
     * Chuẩn hóa để so sánh (deduplication)
     */
    public normalizeForComparison(text: string): string {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt để so sánh mờ
            .replace(/\s+/g, "")             // Loại bỏ toàn bộ khoảng trắng
            .replace(/[^\w]/g, "");          // Chỉ giữ lại chữ và số
    }
}
