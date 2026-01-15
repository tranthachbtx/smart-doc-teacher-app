
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
     * 🧼 CLEAN FINAL OUTPUT v34.24
     * Loại bỏ các marker kỹ thuật, meta-comments của AI và các tiêu đề dư thừa.
     */
    public cleanFinalOutput(text: string): string {
        if (!text) return "";

        let cleaned = text;

        // 1. Loại bỏ Page Markers và Technical Snippets
        cleaned = cleaned
            .replace(/---+\s*Page\s*\d+\s*---+/gi, "") // --- Page 5 ---
            .replace(/(\()?Trang\s*\d+(\))?/gi, "")     // (Trang 5)
            .replace(/(\()?Page\s*\d+(\))?/gi, "")      // (Page 5)
            .replace(/##\s*🏛️\s*(SHDC|SHL|HĐGD|KHÓA|KHTN|HĐTN)\s*\(.*?\)/gi, "") // ## 🏛️ SHDC (DỮ LIỆU TỪ PDF)
            .replace(/##\s*DỮ LIỆU.*?:\s*(KHỞI ĐỘNG|KHÁM PHÁ|LUYỆN TẬP|VẬN DỤNG)/gi, "")
            .replace(/##\s*(MỤC TIÊU|HOẠT ĐỘNG|THIẾT BỊ|HỌC LIỆU|PHỤ LỤC|PHÂN TÍCH).*?\(.*?\)/gi, "");

        // 2. Loại bỏ Meta-comments trong ngoặc đơn/kép của AI (Deep Filtering)
        cleaned = cleaned
            .replace(/\(DỮ LIỆU TỪ PDF\)/gi, "")
            .replace(/\(đã lọc từ PDF\)/gi, "")
            .replace(/\(trích xuất từ PDF\)/gi, "")
            .replace(/\(theo yêu cầu Database\)/gi, "")
            .replace(/\(Dữ liệu Database\)/gi, "")
            .replace(/\(Dự án Database\)/gi, "")
            .replace(/\(Database chuẩn\)/gi, "")
            .replace(/\(Script\):?/gi, "")
            .replace(/\(TÌNH HUỐNG GIẢ ĐỊNG\):?/gi, "")
            .replace(/\(Case Study\):?/gi, "")
            .replace(/\(Gamification.*?\):?/gi, "")
            .replace(/\(Kỹ thuật.*?\):?/gi, "");

        // 3. Loại bỏ các Tiêu đề chương mục (Đã bị vô hiệu hóa để đảm bảo "Preview = Export")
        /*
        cleaned = cleaned
            .replace(/^#+\s*.*?$/gm, (match) => {
                if (/(MỤC TIÊU|THIẾT BỊ|TIẾN TRÌNH|HỒ SƠ|HƯỚNG DẪN|SINH HOẠT|HOẠT ĐỘNG \d+)/i.test(match)) {
                    return "";
                }
                return match;
            })
            .replace(/^I\.\s*MỤC TIÊU$/gm, "")
            .replace(/^II\.\s*THIẾT BỊ DẠY HỌC.*?$/gm, "")
            .replace(/^III\.\s*TIẾN TRÌNH DẠY HỌC$/gm, "")
            .replace(/^IV\.\s*HỒ SƠ DẠY HỌC$/gm, "")
            .replace(/^V\.\s*HƯỚNG DẪN VỀ NHÀ$/gm, "")
            .replace(/^[A-C]\.\s*SINH HOẠT.*?$/gm, "")
            .replace(/^[A-D]\.\s*HOẠT ĐỘNG GIÁO DỤC.*?$/gm, "")
            .replace(/^HOẠT ĐỘNG \d+:.*?$/gm, "")
            .replace(/^TỔ TRƯỞNG CHUYÊN MÔN$/gm, "")
            .replace(/^NGƯỜI SOẠN$/gm, "")
            .replace(/^\(Ký và ghi rõ họ tên\)$/gm, "")
            .replace(/^─────────────────$/gm, "");
        */

        // 4. Các Marker nội bộ (GIỮ LẠI {{cot_1}}, {{cot_2}} cho Export System)
        cleaned = cleaned
            .replace(/\[AI-SUGGESTION\]/gi, "")
            .replace(/\[PDF\]/gi, "")
            .replace(/\[KHTN\]/gi, "")
            .replace(/\[HĐTN\]/gi, "");

        // 5. Làm sạch Markdown dư thừa và Khoảng trắng
        cleaned = cleaned
            .replace(/\*\*\s*\*\*/g, "**") // ** ** -> **
            .replace(/\*\*\*\*/g, "**")    // **** -> **
            .replace(/^[•●○◘◙] /gm, "- ")   // Normalize bullets
            .replace(/[ \t]+/g, " ")       // Gộp space
            .replace(/\|\|LINE_BREAK\|\|/g, "\n")
            .replace(/\n\s*\n\s*\n+/g, "\n\n") // Giới hạn 2 dòng trống
            .trim();

        // 6. Loại bỏ các dòng chỉ chứa rác hoặc placeholder
        cleaned = cleaned.split('\n')
            .filter(line => {
                const t = line.trim();
                if (!t) return true;
                if (/^\.*$/.test(t)) return false; // Chỉ toàn dấu chấm
                if (/^[-*_\s]*$/.test(t) && t.length > 2) return false; // Chỉ toàn gạch ngang
                return true;
            })
            .join('\n')
            .trim();

        return cleaned;
    }

    /**
     * 🧪 SANITIZE AI RESPONSE v34.0
     * Buồng khử trùng dữ liệu trước khi parse JSON.
     */
    public sanitizeAIResponse(rawText: string): string {
        if (!rawText) return "{}";

        let cleanText = rawText;

        // 1. Tìm khối JSON (Tìm { đầu tiên và } cuối cùng)
        const objStart = cleanText.indexOf('{');
        const objEnd = cleanText.lastIndexOf('}');
        if (objStart === -1 || objEnd === -1) return "{}";

        cleanText = cleanText.substring(objStart, objEnd + 1);

        // 2. Chuẩn hóa xuống dòng sơ bộ thành \n
        cleanText = cleanText.replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");

        // 3. STATE-AWARE SANITIZER v2 (v34.6): Xử lý Nested Quotes
        let result = "";
        let insideString = false;

        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];

            if (char === '"') {
                // Kiểm tra xem đây có phải là quote của JSON structure không
                const before = cleanText.substring(Math.max(0, i - 10), i).trim();
                const after = cleanText.substring(i + 1, i + 10).trim();

                const isStructural =
                    (!insideString && (before.endsWith('{') || before.endsWith(',') || before === "")) || // Bắt đầu Key
                    (insideString && after.startsWith(':')) || // Kết thúc Key
                    (!insideString && before.endsWith(':')) || // Bắt đầu Value
                    (insideString && (after.startsWith(',') || after.startsWith('}') || after.startsWith(']') || after === "")); // Kết thúc Value

                if (isStructural) {
                    insideString = !insideString;
                    result += '"';
                } else {
                    // Dấu ngoặc kép lồng trong nội dung -> dùng dấu đơn để an toàn
                    result += "'";
                }
            } else if (char === '\n') {
                // Nếu đang trong chuỗi, biến xuống dòng thành marker an toàn
                if (insideString) {
                    result += "||LINE_BREAK||";
                } else {
                    result += "\n";
                }
            } else {
                result += char;
            }
        }
        cleanText = result;

        // 4. Vá lỗi dấu phẩy cuối & Khử ký tự điều khiển
        cleanText = cleanText.replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .replace(/[\x00-\x1F\x7F-\x9F]/g, " ");

        return cleanText;
    }
}
