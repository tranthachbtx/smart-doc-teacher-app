
import { TextCleaningService } from "./text-cleaning-service";

export interface AuditAnalysisResult {
    danh_gia_tong_quan: string;
    phan_tich_chi_tiet: Array<{
        tieu_chi: string;
        hien_trang: string;
        diem_yeu: string;
        giai_phap_goi_y: string;
    }>;
    goi_y_nang_cap_chien_luoc: string;
}

/**
 * ðŸ›ï¸ MODULE 1: AI AUDITOR SERVICE v35.6
 * ChuyÃªn trÃ¡ch viá»‡c "Äá»c hiá»ƒu - PhÃ¢n tÃ­ch - PhÃª bÃ¬nh" file PDF cÅ©.
 */
export const AIAuditorService = {
    async analyzePDFContent(rawText: string, model: string = "gemini-2.0-flash"): Promise<AuditAnalysisResult> {
        console.log("[AIAuditor] ðŸ” Initiating Deep Content Audit...");

        const cleaner = TextCleaningService.getInstance();
        const cleanedText = cleaner.clean(rawText);

        const prompt = `
# VAI TRÃ’: ChuyÃªn gia Tháº©m Ä‘á»‹nh ChÆ°Æ¡ng trÃ¬nh GiÃ¡o dá»¥c (Chuáº©n 5512 - Modern 2025).

# NHIá»†M Vá»¤:
Báº¡n sáº½ nháº­n Ä‘Æ°á»£c ná»™i dung cá»§a má»™t Káº¿ hoáº¡ch bÃ i dáº¡y (KHBH) cÅ©. HÃ£y phÃ¢n tÃ­ch nÃ³ dÆ°á»›i gÃ³c Ä‘á»™ phÃª bÃ¬nh sÆ° pháº¡m kháº¯c nghiá»‡t Ä‘á»ƒ tÃ¬m ra cÃ¡c Ä‘iá»ƒm yáº¿u cáº§n nÃ¢ng cáº¥p.

# Dá»® LIá»†U Äáº¦U VÃ€O:
"""${cleanedText.substring(0, 50000)}"""

# TIÃŠU CHÃ PHÃ‚N TÃCH (5 Pain Points):
1. **Má»¥c tiÃªu:** Äá»™ng tá»« cÃ³ Ä‘o lÆ°á»ng Ä‘Æ°á»£c khÃ´ng? CÃ³ gáº¯n vá»›i biá»ƒu hiá»‡n hÃ nh vi cá»¥ thá»ƒ khÃ´ng?
2. **Tiáº¿n trÃ¬nh:** CÃ¡c hoáº¡t Ä‘á»™ng cÃ³ bá»‹ sÆ¡ sÃ i khÃ´ng? (VÃ­ dá»¥: Luyá»‡n táº­p chá»‰ lÃ  tráº¯c nghiá»‡m, Váº­n dá»¥ng chá»‰ lÃ  bÃ i táº­p vá» nhÃ ).
3. **PhÆ°Æ¡ng phÃ¡p:** CÃ³ sá»­ dá»¥ng ká»¹ thuáº­t dáº¡y há»c tÃ­ch cá»±c (Máº£nh ghÃ©p, KhÄƒn tráº£i bÃ n, Tráº¡m...) khÃ´ng hay chá»‰ lÃ  "Há»i - ÄÃ¡p"?
4. **CÃ´ng nghá»‡ (EdTech):** CÃ³ sá»­ dá»¥ng cÃ´ng cá»¥ sá»‘ (Padlet, Canva, Quizizz, AI) khÃ´ng hay chá»‰ lÃ  Powerpoint/Video cÅ©?
5. **ÄÃ¡nh giÃ¡:** CÃ³ Rubric cháº¥m Ä‘iá»ƒm 4 má»©c Ä‘á»™ khÃ´ng?

# YÃŠU Cáº¦U OUTPUT JSON:
Tráº£ vá» DUY NHáº¤T JSON vá»›i cáº¥u trÃºc:
{
  "danh_gia_tong_quan": "Äiá»ƒm sá»‘ Æ°á»›c lÆ°á»£ng (thang 10) vÃ  nháº­n xÃ©t chung.",
  "phan_tich_chi_tiet": [
    { "tieu_chi": "Má»¥c tiÃªu", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "PhÆ°Æ¡ng phÃ¡p", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "Tiáº¿n trÃ¬nh", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "CÃ´ng nghá»‡", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "ÄÃ¡nh giÃ¡", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." }
  ],
  "goi_y_nang_cap_chien_luoc": "Äá» xuáº¥t 3 Ã½ tÆ°á»Ÿng lá»›n Ä‘á»ƒ lá»™t xÃ¡c bÃ i nÃ y (VD: Gamification, Dá»± Ã¡n thá»±c táº¿...)"
}
        `.trim();

        try {
            const { generateAIContent } = await import("../actions/gemini");
            const response = await generateAIContent(prompt, model);

            if (response.success && response.content) {
                const sanitizedJson = cleaner.sanitizeAIResponse(response.content);
                return JSON.parse(sanitizedJson);
            }
            throw new Error(response.error || "KhÃ´ng thá»ƒ thá»±c hiá»‡n tháº©m Ä‘á»‹nh AI.");
        } catch (error: any) {
            console.error("[AIAuditor] ðŸ’¥ Audit Failed:", error.message);
            throw error;
        }
    }
};
