
/**
 * ðŸ§¹ TEXT CLEANING SERVICE - HYBRID INTELLIGENCE 18.0
 * ChuyÃªn trÃ¡ch lÃ m sáº¡ch, chuáº©n hÃ³a vÃ  tá»‘i Æ°u ná»™i dung trÃ­ch xuáº¥t tá»« PDF/Word.
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
     * Quy trÃ¬nh lÃ m sáº¡ch tá»•ng thá»ƒ
     */
    public clean(text: string): string {
        if (!text) return "";

        let cleaned = text;

        // 1. Loáº¡i bá» cÃ¡c kÃ½ tá»± Ä‘iá»u khiá»ƒn vÃ  rÃ¡c mÃ£ hÃ³a
        cleaned = this.removeControlCharacters(cleaned);

        // 2. Chuáº©n hÃ³a khoáº£ng tráº¯ng vÃ  dÃ²ng trá»‘ng
        cleaned = this.normalizeWhitespace(cleaned);

        // 3. Loáº¡i bá» header/footer/page numbers phá»• biáº¿n
        cleaned = this.removeDocumentJunk(cleaned);

        // 4. Sá»­a lá»—i font/encoding tiáº¿ng Viá»‡t phá»• biáº¿n (náº¿u cÃ³)
        cleaned = this.fixVietnameseEncoding(cleaned);

        return cleaned.trim();
    }

    private removeControlCharacters(text: string): string {
        // Loáº¡i bá» kÃ½ tá»± null, cÃ¡c kÃ½ tá»± khÃ´ng in Ä‘Æ°á»£c trá»« \n \t \r
        return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    }

    private normalizeWhitespace(text: string): string {
        return text
            .replace(/[ \t]+/g, " ")             // Gá»™p nhiá»u space/tab thÃ nh 1
            .replace(/\n\s*\n\s*\n+/g, "\n\n")  // Giá»›i háº¡n tá»‘i Ä‘a 2 dÃ²ng trá»‘ng liÃªn tiáº¿p
            .replace(/^\s+|\s+$/gm, "");        // Trim tá»«ng dÃ²ng
    }

    private removeDocumentJunk(text: string): string {
        const lines = text.split('\n');
        const cleanedLines: string[] = [];

        // Logic phá»¥c há»“i tá»« Kiáº¿n trÃºc 18.0: Nháº­n dáº¡ng cáº¥u trÃºc trÆ°á»›c khi xÃ³a rÃ¡c
        const hasTOC = /má»¥c lá»¥c|table of contents|ná»™i dung/i.test(text.substring(0, 5000));

        for (const line of lines) {
            let skip = false;
            const trimmed = line.trim();

            // 1. Nháº­n diá»‡n Page Markers (Architecture 18.0)
            if (/^(Trang\s+\d+|Page\s+\d+|[0-9]+\s*$|^- \d+ -$)/i.test(trimmed)) {
                // Náº¿u khÃ´ng pháº£i trong má»¥c lá»¥c, ta cÃ³ thá»ƒ an tÃ¢m xÃ³a cÃ¡c Ä‘Ã¡nh dáº¥u trang Ä‘Æ¡n láº»
                if (!hasTOC || trimmed.length < 15) skip = true;
            }

            // 2. Nháº­n diá»‡n Headers láº·p láº¡i (Architecture 19.0 logic)
            if (/C\s*H\s*á»¦\s*Ä\s*á»€\s*\d+:.*?\(\d+\s*tiáº¿t\)/gi.test(trimmed)) skip = true;
            if (/YÃŠU Cáº¦U Cáº¦N Äáº T Má»¤C Cá»¦A CHá»¦ Äá»€/gi.test(trimmed)) skip = true;
            if (/NgÃ y soáº¡n:â€¦\/â€¦\/â€¦/g.test(trimmed)) skip = true;
            if (/NgÃ y dáº¡y:â€¦\/â€¦\/â€¦/g.test(trimmed)) skip = true;

            // 3. Xá»­ lÃ½ OCR noise Ä‘áº·c thÃ¹
            const sanitized = trimmed.replace(/,\s*\d+\s*\)\.?/g, "");

            if (!skip && sanitized.length > 0) {
                cleanedLines.push(sanitized);
            }
        }

        return cleanedLines.join('\n');
    }

    private fixVietnameseEncoding(text: string): string {
        // Má»™t sá»‘ trÃ¬nh Ä‘á»c PDF cÅ© cÃ³ thá»ƒ bá»‹ lá»—i cÃ¡c kÃ½ tá»± nÃ y
        return text
            .replace(/ï€¿/g, "")
            .replace(/ï‚·/g, "-")
            .replace(/ïƒ˜/g, "=>")
            .replace(/ïƒ¼/g, "v")
            .replace(/ï‚¨/g, "[ ]");
    }

    /**
     * ðŸ§¼ CLEAN FINAL OUTPUT v34.24
     * Loáº¡i bá» cÃ¡c marker ká»¹ thuáº­t, meta-comments cá»§a AI vÃ  cÃ¡c tiÃªu Ä‘á» dÆ° thá»«a.
     */
    public cleanFinalOutput(text: string): string {
        if (!text) return "";

        let cleaned = text;

        // 1. Loáº¡i bá» Page Markers vÃ  Technical Snippets
        cleaned = cleaned
            .replace(/---+\s*Page\s*\d+\s*---+/gi, "") // --- Page 5 ---
            .replace(/(\()?Trang\s*\d+(\))?/gi, "")     // (Trang 5)
            .replace(/(\()?Page\s*\d+(\))?/gi, "")      // (Page 5)
            .replace(/##\s*ðŸ›ï¸\s*(SHDC|SHL|HÄGD|KHÃ“A|KHTN|HÄTN)\s*\(.*?\)/gi, "") // ## ðŸ›ï¸ SHDC (Dá»® LIá»†U Tá»ª PDF)
            .replace(/##\s*Dá»® LIá»†U.*?:\s*(KHá»žI Äá»˜NG|KHÃM PHÃ|LUYá»†N Táº¬P|Váº¬N Dá»¤NG)/gi, "")
            .replace(/##\s*(Má»¤C TIÃŠU|HOáº T Äá»˜NG|THIáº¾T Bá»Š|Há»ŒC LIá»†U|PHá»¤ Lá»¤C|PHÃ‚N TÃCH).*?\(.*?\)/gi, "");

        // 2. Loáº¡i bá» Meta-comments trong ngoáº·c Ä‘Æ¡n/kÃ©p cá»§a AI (Deep Filtering)
        cleaned = cleaned
            .replace(/\(Dá»® LIá»†U Tá»ª PDF\)/gi, "")
            .replace(/\(Ä‘Ã£ lá»c tá»« PDF\)/gi, "")
            .replace(/\(trÃ­ch xuáº¥t tá»« PDF\)/gi, "")
            .replace(/\(theo yÃªu cáº§u Database\)/gi, "")
            .replace(/\(Dá»¯ liá»‡u Database\)/gi, "")
            .replace(/\(Dá»± Ã¡n Database\)/gi, "")
            .replace(/\(Database chuáº©n\)/gi, "")
            .replace(/\(Script\):?/gi, "")
            .replace(/\(TÃŒNH HUá»NG GIáº¢ Äá»ŠNG\):?/gi, "")
            .replace(/\(Case Study\):?/gi, "")
            .replace(/\(Gamification.*?\):?/gi, "")
            .replace(/\(Ká»¹ thuáº­t.*?\):?/gi, "");

        // 3. Loáº¡i bá» cÃ¡c TiÃªu Ä‘á» chÆ°Æ¡ng má»¥c Ä‘Ã£ cÃ³ sáºµn trong file Word (TrÃ¡nh láº·p láº¡i)
        cleaned = cleaned
            .replace(/^#+\s*.*?$/gm, (match) => {
                // Chá»‰ xÃ³a náº¿u header chá»©a cÃ¡c tá»« khÃ³a há»‡ thá»‘ng hoáº·c trÃ¹ng láº·p 5512
                if (/(Má»¤C TIÃŠU|THIáº¾T Bá»Š|TIáº¾N TRÃŒNH|Há»’ SÆ |HÆ¯á»šNG DáºªN|SINH HOáº T|HOáº T Äá»˜NG \d+)/i.test(match)) {
                    return "";
                }
                return match;
            })
            .replace(/^I\.\s*Má»¤C TIÃŠU$/gm, "")
            .replace(/^II\.\s*THIáº¾T Bá»Š Dáº Y Há»ŒC.*?$/gm, "")
            .replace(/^III\.\s*TIáº¾N TRÃŒNH Dáº Y Há»ŒC$/gm, "")
            .replace(/^IV\.\s*Há»’ SÆ  Dáº Y Há»ŒC$/gm, "")
            .replace(/^V\.\s*HÆ¯á»šNG DáºªN Vá»€ NHÃ€$/gm, "")
            .replace(/^[A-C]\.\s*SINH HOáº T.*?$/gm, "")
            .replace(/^[A-D]\.\s*HOáº T Äá»˜NG GIÃO Dá»¤C.*?$/gm, "")
            .replace(/^HOáº T Äá»˜NG \d+:.*?$/gm, "")
            // Footer rÃ¡c
            .replace(/^Tá»” TRÆ¯á»žNG CHUYÃŠN MÃ”N$/gm, "")
            .replace(/^NGÆ¯á»œI SOáº N$/gm, "")
            .replace(/^\(KÃ½ vÃ  ghi rÃµ há» tÃªn\)$/gm, "")
            .replace(/^â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€$/gm, "");

        // 4. CÃ¡c Marker ná»™i bá»™ (GIá»® Láº I {{cot_1}}, {{cot_2}} cho Export System)
        cleaned = cleaned
            .replace(/\[AI-SUGGESTION\]/gi, "")
            .replace(/\[PDF\]/gi, "")
            .replace(/\[KHTN\]/gi, "")
            .replace(/\[HÄTN\]/gi, "");

        // 5. LÃ m sáº¡ch Markdown dÆ° thá»«a vÃ  Khoáº£ng tráº¯ng
        cleaned = cleaned
            .replace(/\*\*\s*\*\*/g, "**") // ** ** -> **
            .replace(/\*\*\*\*/g, "**")    // **** -> **
            .replace(/^[â€¢â—â—‹â—˜â—™] /gm, "- ")   // Normalize bullets
            .replace(/[ \t]+/g, " ")       // Gá»™p space
            .replace(/\|\|LINE_BREAK\|\|/g, "\n")
            .replace(/\n\s*\n\s*\n+/g, "\n\n") // Giá»›i háº¡n 2 dÃ²ng trá»‘ng
            .trim();

        // 6. Loáº¡i bá» cÃ¡c dÃ²ng chá»‰ chá»©a rÃ¡c hoáº·c placeholder
        cleaned = cleaned.split('\n')
            .filter(line => {
                const t = line.trim();
                if (!t) return true;
                if (/^\.*$/.test(t)) return false; // Chá»‰ toÃ n dáº¥u cháº¥m
                if (/^[-*_\s]*$/.test(t) && t.length > 2) return false; // Chá»‰ toÃ n gáº¡ch ngang
                return true;
            })
            .join('\n')
            .trim();

        return cleaned;
    }

    /**
     * ðŸ§ª SANITIZE AI RESPONSE v34.0
     * Buá»“ng khá»­ trÃ¹ng dá»¯ liá»‡u trÆ°á»›c khi parse JSON.
     */
    public sanitizeAIResponse(rawText: string): string {
        if (!rawText) return "{}";

        let cleanText = rawText;

        // 1. TÃ¬m khá»‘i JSON (TÃ¬m { Ä‘áº§u tiÃªn vÃ  } cuá»‘i cÃ¹ng)
        const objStart = cleanText.indexOf('{');
        const objEnd = cleanText.lastIndexOf('}');
        if (objStart === -1 || objEnd === -1) return "{}";

        cleanText = cleanText.substring(objStart, objEnd + 1);

        // 2. Chuáº©n hÃ³a xuá»‘ng dÃ²ng sÆ¡ bá»™ thÃ nh \n
        cleanText = cleanText.replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n");

        // 3. STATE-AWARE SANITIZER v2 (v34.6): Xá»­ lÃ½ Nested Quotes
        let result = "";
        let insideString = false;

        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];

            if (char === '"') {
                // Kiá»ƒm tra xem Ä‘Ã¢y cÃ³ pháº£i lÃ  quote cá»§a JSON structure khÃ´ng
                const before = cleanText.substring(Math.max(0, i - 10), i).trim();
                const after = cleanText.substring(i + 1, i + 10).trim();

                const isStructural =
                    (!insideString && (before.endsWith('{') || before.endsWith(',') || before === "")) || // Báº¯t Ä‘áº§u Key
                    (insideString && after.startsWith(':')) || // Káº¿t thÃºc Key
                    (!insideString && before.endsWith(':')) || // Báº¯t Ä‘áº§u Value
                    (insideString && (after.startsWith(',') || after.startsWith('}') || after.startsWith(']') || after === "")); // Káº¿t thÃºc Value

                if (isStructural) {
                    insideString = !insideString;
                    result += '"';
                } else {
                    // Dáº¥u ngoáº·c kÃ©p lá»“ng trong ná»™i dung -> dÃ¹ng dáº¥u Ä‘Æ¡n Ä‘á»ƒ an toÃ n
                    result += "'";
                }
            } else if (char === '\n') {
                // Náº¿u Ä‘ang trong chuá»—i, biáº¿n xuá»‘ng dÃ²ng thÃ nh marker an toÃ n
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

        // 4. VÃ¡ lá»—i dáº¥u pháº©y cuá»‘i & Khá»­ kÃ½ tá»± Ä‘iá»u khiá»ƒn
        cleanText = cleanText.replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .replace(/[\x00-\x1F\x7F-\x9F]/g, " ");

        return cleanText;
    }
}
