
import type { LessonResult } from "@/lib/types";

/**
 * KHBHMerger: CÃ´ng cá»¥ pháº«u thuáº­t vÃ  tÃ­ch há»£p trÃ­ tuá»‡ nhÃ¢n táº¡o (v1.0)
 * ChuyÃªn trÃ¡ch viá»‡c trá»™n cÃ¡c gá»£i Ã½ chiáº¿n lÆ°á»£c tá»« Gemini Pro vÃ o giÃ¡o Ã¡n hiá»‡n táº¡i.
 */
export class KHBHMerger {
    /**
     * TÃ­ch há»£p cÃ¡c gá»£i Ã½ vÃ o giÃ¡o Ã¡n cÅ©
     * @param currentPlan GiÃ¡o Ã¡n hiá»‡n táº¡i (Ä‘Ã£ Ä‘Æ°á»£c parse hoáº·c sinh ra)
     * @param suggestions Chuá»—i vÄƒn báº£n gá»£i Ã½ tá»« "Expert Brain Injection"
     */
    static merge(currentPlan: LessonResult, suggestions: string): LessonResult {
        const updated = { ...currentPlan };

        console.log("[Merger] ðŸ› ï¸ Báº¯t Ä‘áº§u pháº«u thuáº­t giÃ¡o Ã¡n vá»›i gá»£i Ã½ chiáº¿n lÆ°á»£c...");

        // Try JSON parsing first
        try {
            const jsonPart = suggestions.match(/\{[\s\S]*\}/);
            if (jsonPart) {
                const data = JSON.parse(jsonPart[0]);
                console.log("[Merger] ðŸ§¬ PhÃ¡t hiá»‡n Ä‘á»‹nh dáº¡ng JSON - Äang tiáº¿n hÃ nh ghÃ©p táº¡ng...");

                return {
                    ...updated,
                    ...data,
                    // Keep some metadata
                    expertGuidance: suggestions
                };
            }
        } catch (e) {
            console.log("[Merger] âš ï¸ KhÃ´ng pháº£i JSON hoáº·c JSON lá»—i, chuyá»ƒn sang phÃ¢n tÃ­ch Regex...");
        }

        // Fallback: Regex-based extraction (Existing logic)
        const directives = this.extractDirectives(suggestions);

        // 2. TÃ­ch há»£p NÄƒng lá»±c sá»‘ (NLS) - Æ¯u tiÃªn hÃ ng Ä‘áº§u theo ThÃ´ng tÆ° 02/2025
        if (directives.nls) {
            updated.tich_hop_nls = this.appendSmartly(updated.tich_hop_nls, directives.nls);
        }

        // 3. Cáº­p nháº­t Má»¥c tiÃªu kiáº¿n thá»©c/nÄƒng lá»±c/pháº©m cháº¥t
        if (directives.mucTieu) {
            updated.muc_tieu_kien_thuc = this.appendSmartly(updated.muc_tieu_kien_thuc, directives.mucTieu);
        }

        // 4. Cáº£i tiáº¿n Thiáº¿t bá»‹ dáº¡y há»c
        if (directives.thietBi) {
            updated.gv_chuan_bi = this.appendSmartly(updated.gv_chuan_bi, directives.thietBi);
        }

        // 5. NÃ¢ng cáº¥p cÃ¡c Hoáº¡t Ä‘á»™ng (Khá»Ÿi Ä‘á»™ng, KhÃ¡m phÃ¡, Luyá»‡n táº­p, Váº­n dá»¥ng)
        if (directives.activities) {
            if (directives.activities.khoi_dong) {
                updated.hoat_dong_khoi_dong = this.patchActivity(updated.hoat_dong_khoi_dong || "", directives.activities.khoi_dong);
            }
            if (directives.activities.kham_pha) {
                updated.hoat_dong_kham_pha = this.patchActivity(updated.hoat_dong_kham_pha || "", directives.activities.kham_pha);
            }
            if (directives.activities.luyen_tap) {
                updated.hoat_dong_luyen_tap = this.patchActivity(updated.hoat_dong_luyen_tap || "", directives.activities.luyen_tap);
            }
            if (directives.activities.van_dung) {
                updated.hoat_dong_van_dung = this.patchActivity(updated.hoat_dong_van_dung || "", directives.activities.van_dung);
            }
        }

        // 6. LÆ°u trá»¯ chá»‰ thá»‹ gá»‘c vÃ o metadata hoáº·c custom field náº¿u cáº§n (dÃ nh cho AI pháº«u thuáº­t lá»›p sau)
        updated.expertGuidance = suggestions;
        updated.expert_instructions = suggestions; // Legacy compatibility

        return updated;
    }

    /**
     * TrÃ­ch xuáº¥t cÃ¡c khá»‘i ná»™i dung tá»« prompt response cá»§a Gemini
     */
    private static extractDirectives(text: string) {
        const sections: any = {
            nls: "",
            mucTieu: "",
            thietBi: "",
            activities: {}
        };

        // Regex thÃ´ng minh Ä‘á»ƒ báº¯t cÃ¡c block [SECTION] hoáº·c cÃ¡c tiÃªu Ä‘á» cÃ³ dáº¥u #
        const nlsMatch = text.match(/#*\s*(NÄƒng lá»±c sá»‘|NLS|Digital Competency)([\s\S]*?)(?=#|$)/i);
        if (nlsMatch) sections.nls = nlsMatch[2].trim();

        const mtMatch = text.match(/#*\s*(Má»¥c tiÃªu|Kiáº¿n thá»©c|YÃªu cáº§u cáº§n Ä‘áº¡t)([\s\S]*?)(?=#|$)/i);
        if (mtMatch) sections.mucTieu = mtMatch[2].trim();

        const tbMatch = text.match(/#*\s*(Thiáº¿t bá»‹|Há»c liá»‡u|CÃ´ng cá»¥)([\s\S]*?)(?=#|$)/i);
        if (tbMatch) sections.thietBi = tbMatch[2].trim();

        // Hoáº¡t Ä‘á»™ng
        const kdMatch = text.match(/#*\s*(Hoáº¡t Ä‘á»™ng 1|Khá»Ÿi Ä‘á»™ng)([\s\S]*?)(?=#|$)/i);
        if (kdMatch) sections.activities.khoi_dong = kdMatch[2].trim();

        const kpMatch = text.match(/#*\s*(Hoáº¡t Ä‘á»™ng 2|KhÃ¡m phÃ¡)([\s\S]*?)(?=#|$)/i);
        if (kpMatch) sections.activities.kham_pha = kpMatch[2].trim();

        const ltMatch = text.match(/#*\s*(Hoáº¡t Ä‘á»™ng 3|Luyá»‡n táº­p)([\s\S]*?)(?=#|$)/i);
        if (ltMatch) sections.activities.luyen_tap = ltMatch[2].trim();

        const vdMatch = text.match(/#*\s*(Hoáº¡t Ä‘á»™ng 4|Váº­n dá»¥ng)([\s\S]*?)(?=#|$)/i);
        if (vdMatch) sections.activities.van_dung = vdMatch[2].trim();

        return sections;
    }

    private static appendSmartly(original: string | undefined, addition: string): string {
        if (!original) return addition;
        if (original.includes(addition)) return original;
        return `${original}\n\n[Cáº¬P NHáº¬T CHIáº¾N LÆ¯á»¢C]:\n${addition}`;
    }

    private static patchActivity(original: string, improvement: string): string {
        // Náº¿u hoáº¡t Ä‘á»™ng cÃ³ cáº¥u trÃºc [COT_1]...[COT_2], ta cá»‘ gáº¯ng nhÃ©t gá»£i Ã½ vÃ o pháº§n phÃ¹ há»£p
        if (original.includes("[COT_2]")) {
            return original.replace("[COT_2]", `[COT_2]\n\n[Gá»¢I Ã NÃ‚NG Cáº¤P]:\n${improvement}\n`);
        }
        return `${original}\n\n[Gá»¢I Ã NÃ‚NG Cáº¤P]:\n${improvement}`;
    }
}
