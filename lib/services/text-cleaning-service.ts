
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
        const lines = text.split('\n');
        const cleanedLines: string[] = [];

        // Logic phục hồi từ Kiến trúc 18.0: Nhận dạng cấu trúc trước khi xóa rác
        const hasTOC = /mục lục|table of contents|nội dung/i.test(text.substring(0, 5000));

        for (const line of lines) {
            let skip = false;
            const trimmed = line.trim();

            // 1. Nhận diện Page Markers (Architecture 18.0)
            if (/^(Trang\s+\d+|Page\s+\d+|[0-9]+\s*$|^- \d+ -$)/i.test(trimmed)) {
                // Nếu không phải trong mục lục, ta có thể an tâm xóa các đánh dấu trang đơn lẻ
                if (!hasTOC || trimmed.length < 15) skip = true;
            }

            // 2. Nhận diện Headers lặp lại (Architecture 19.0 logic)
            if (/C\s*H\s*Ủ\s*Đ\s*Ề\s*\d+:.*?\(\d+\s*tiết\)/gi.test(trimmed)) skip = true;
            if (/YÊU CẦU CẦN ĐẠT MỤC CỦA CHỦ ĐỀ/gi.test(trimmed)) skip = true;
            if (/Ngày soạn:…\/…\/…/g.test(trimmed)) skip = true;
            if (/Ngày dạy:…\/…\/…/g.test(trimmed)) skip = true;

            // 3. Xử lý OCR noise đặc thù
            const sanitized = trimmed.replace(/,\s*\d+\s*\)\.?/g, "");

            if (!skip && sanitized.length > 0) {
                cleanedLines.push(sanitized);
            }
        }

        return cleanedLines.join('\n');
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
     * 🧼 CLEAN FINAL OUTPUT
     * Loại bỏ các marker kỹ thuật [AI-SUGGESTION], [PDF] và dọn dẹp markdown rác.
     */
    public cleanFinalOutput(text: string): string {
        if (!text) return "";

        return text
            // 1. Loại bỏ các marker kỹ thuật (GIỮ LẠI {{cot_1}}, {{cot_2}} CHO EXPORT SYSTEM)
            .replace(/\[AI-SUGGESTION\]/gi, "")
            .replace(/\[PDF\]/gi, "")
            .replace(/\[KHTN\]/gi, "")
            .replace(/\[HĐTN\]/gi, "")
            // .replace(/{{cot_1}}/g, "") // DISABLED: Cần giữ để phân cột
            // .replace(/{{cot_2}}/g, "") // DISABLED: Cần giữ để phân cột

            // 2. Sửa lỗi thừa dấu **
            .replace(/\*\*\s*\*\*/g, "**") // ** ** -> **
            .replace(/\*\*\*\*/g, "**")    // **** -> **

            // 3. Normalize các bullet point
            .replace(/^[•●○◘◙] /gm, "- ")

            // 4. Chuẩn hóa khoảng trắng
            .replace(/[ \t]+/g, " ")
            .replace(/\n\s*\n\s*\n+/g, "\n\n")
            .trim();
    }
}
