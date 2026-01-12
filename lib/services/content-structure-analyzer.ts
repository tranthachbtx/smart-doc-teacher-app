import { generateAIContent } from "@/lib/actions/gemini";

/**
 * ðŸ”¬ SMART PARSING PIPELINE v20.2
 * Tá»± Ä‘á»™ng hÃ³a khÃ¢u "Viá»‡c nháº¹" vÃ  Má»• xáº» dá»¯ liá»‡u "Viá»‡c náº·ng".
 */

// --- LEGACY COMPATIBILITY INTERFACES ---
export interface ContentSection {
    id: string;
    title: string;
    content: string;
    type: 'objective' | 'knowledge' | 'activity' | 'assessment' | 'resource' | 'other';
    relevance: Record<string, number>;
    confidence?: number;
    metadata: {
        wordCount: number;
        pageNumber?: number;
    };
}

export interface StructuredContent {
    sections: ContentSection[];
    metadata: {
        title: string;
        grade: string;
        subject: string;
        extractedAt: string;
        wordCount?: number;
    };
}
// --- END LEGACY ---

export interface CleanedStructure {
    // Dá»¯ liá»‡u cho Ã´ Metadata (Auto-Fill)
    ten_bai: string;
    so_tiet: string;
    muc_tieu_kien_thuc: string;
    muc_tieu_nang_luc: string;
    muc_tieu_pham_chat: string;
    thiet_bi_gv: string;
    thiet_bi_hs: string;

    // Dá»¯ liá»‡u cho sinh hoáº¡t (Auto-Fill)
    noi_dung_shdc: string;
    noi_dung_shl: string;

    // Dá»¯ liá»‡u gá»‘c Ä‘Ã£ lá»c (Cho Prompt Manual)
    raw_khoi_dong: string;
    raw_kham_pha: string;
    raw_luyen_tap: string;
    raw_van_dung: string;

    // ðŸ›ï¸ MODULE 1: AI AUDIT INTEGRATION
    audit_analysis: {
        danh_gia_tong_quan: string;
        phan_tich_chi_tiet: Array<{
            tieu_chi: string;
            hien_trang: string;
            diem_yeu: string;
            giai_phap_goi_y: string;
        }>;
        goi_y_nang_cap_chien_luoc: string;
    };
}

export class ContentStructureAnalyzer {
    async analyzeAndPreFill(filePayload: { mimeType: string, data: string }, grade: string, theme: string): Promise<CleanedStructure> {
        const prompt = `
        Báº¡n lÃ  chuyÃªn gia Tháº©m Ä‘á»‹nh vÃ  Xá»­ lÃ½ dá»¯ liá»‡u giÃ¡o dá»¥c 5512 (Modern 2025).
        Nhiá»‡m vá»¥: PhÃ¢n tÃ­ch file bÃ i dáº¡y cÅ© vÃ  thá»±c hiá»‡n 3 cÃ´ng viá»‡c trong 1 láº§n cháº¡y:
        1. TRÃCH XUáº¤T sáº¡ch sáº½ ná»™i dung tá»«ng hoáº¡t Ä‘á»™ng (khÃ´ng tÃ³m táº¯t).
        2. Tá»° Äá»˜NG SOáº N THáº¢O pháº§n Má»¥c tiÃªu vÃ  Sinh hoáº¡t (SHDC/SHL) chuáº©n 5512.
        3. THáº¨M Äá»ŠNH SÆ¯ PHáº M (Audit): PhÃª bÃ¬nh kháº¯c nghiá»‡t file cÅ© Ä‘á»ƒ tÃ¬m lá»—i (Pain Points).
        
        Bá»‘i cáº£nh ban Ä‘áº§u: Khá»‘i ${grade}, BÃ i há»c: ${theme}.
        LÆ¯U Ã: Náº¿u ná»™i dung file KHÃC vá»›i chá»§ Ä‘á» bÃ i há»c "${theme}", hÃ£y Æ¯U TIÃŠN TUYá»†T Äá»I ná»™i dung trong file.
        
        # Äá»ŠNH Dáº NG JSON TRáº¢ Vá»€ (DUY NHáº¤T):
        {
          "ten_bai": "TÃªn bÃ i há»c",
          "so_tiet": "Sá»‘ tiáº¿t trÃ­ch lá»c (VD: 3)",
          "muc_tieu_kien_thuc": "Chuáº©n 2018...",
          "muc_tieu_nang_luc": "NÄƒng lá»±c chung/Ä‘áº·c thÃ¹...",
          "muc_tieu_pham_chat": "Pháº©m cháº¥t...",
          "thiet_bi_gv": "Chi tiáº¿t thiáº¿t bá»‹...",
          "thiet_bi_hs": "Chi tiáº¿t thiáº¿t bá»‹...",
          "noi_dung_shdc": "Ká»‹ch báº£n SHDC (150-200 tá»«)...",
          "noi_dung_shl": "Ká»‹ch báº£n SHL (150-200 tá»«)...",
          "raw_khoi_dong": "TrÃ­ch xuáº¥t chi tiáº¿t nháº¥t pháº§n Khá»Ÿi Ä‘á»™ng...",
          "raw_kham_pha": "TrÃ­ch xuáº¥t chi tiáº¿t nháº¥t pháº§n KhÃ¡m phÃ¡...",
          "raw_luyen_tap": "TrÃ­ch xuáº¥t chi tiáº¿t nháº¥t pháº§n Luyá»‡n táº­p...",
          "raw_van_dung": "TrÃ­ch xuáº¥t chi tiáº¿t nháº¥t pháº§n Váº­n dá»¥ng...",
          "audit_analysis": {
            "danh_gia_tong_quan": "Nháº­n xÃ©t vÃ  Ä‘iá»ƒm sá»‘ (thang 10).",
            "phan_tich_chi_tiet": [
              { "tieu_chi": "Má»¥c tiÃªu", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "PhÆ°Æ¡ng phÃ¡p", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "Tiáº¿n trÃ¬nh", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "CÃ´ng nghá»‡", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "ÄÃ¡nh giÃ¡", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." }
            ],
            "goi_y_nang_cap_chien_luoc": "3 Ã½ tÆ°á»Ÿng lá»™t sáº¯c bÃ i dáº¡y."
          }
        }
        `;

        try {
            // Sá»¬ Dá»¤NG CHáº¾ Äá»˜ MULTIMODAL (Gá»­i file trá»±c tiáº¿p thay vÃ¬ text trÃ­ch xuáº¥t lá»—i)
            const result = await generateAIContent(prompt, "gemini-2.0-flash", filePayload);

            if (!result.success) {
                console.error("[Analyzer] AI Error Response:", result.error);
                throw new Error(`AI Dissection failed: ${result.error}`);
            }

            if (!result.content) throw new Error("AI returned empty content.");

            const jsonMatch = result.content.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            if (!data) {
                console.warn("[Analyzer] AI Content was not valid JSON:", result.content);
                throw new Error("Invalid JSON format from AI.");
            }

            return data;
        } catch (e: any) {
            console.error("[Analyzer] Final Catch Error:", e.message);
            throw e;
        }
    }
}
