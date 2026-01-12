"use server";

/**
 * ðŸ§¬ KHBH MERGER ENGINE - HYBRID INTELLIGENCE 18.0
 * ChuyÃªn trÃ¡ch viá»‡c "pháº«u thuáº­t" vÃ  trá»™n cÃ¡c "Chá»‰ thá»‹ chiáº¿n lÆ°á»£c" tá»« Gemini Pro vÃ o giÃ¡o Ã¡n hiá»‡n táº¡i.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MergedResult {
    success: boolean;
    content: any;
    auditTrail: string;
    badge: "Expert Integrated" | "Standard";
}

export async function surgicalMerge(currentPlan: any, expertDirectives: string): Promise<MergedResult> {
    console.log("[KHBHMerger] Starting Surgical Fusion via Server Action...");

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
        return {
            success: false,
            content: currentPlan,
            auditTrail: "Lá»—i: ChÆ°a cáº¥u hÃ¬nh GEMINI_API_KEY trÃªn server.",
            badge: "Standard"
        };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
Báº N LÃ€: ChuyÃªn gia Pháº«u thuáº­t & Há»£p nháº¥t GiÃ¡o Ã¡n SÆ° pháº¡m CAO Cáº¤P.
NHIá»†M Vá»¤: Lá»“ng ghÃ©p cÃ¡c CHá»ˆ THá»Š CHIáº¾N LÆ¯á»¢C vÃ o GIÃO ÃN HIá»†N Táº I má»™t cÃ¡ch thÃ´ng minh, chuáº©n xÃ¡c 5512.

GIÃO ÃN HIá»†N Táº I (JSON):
${JSON.stringify(currentPlan, null, 2)}

CHá»ˆ THá»Š CHIáº¾N LÆ¯á»¢C Tá»ª CHUYÃŠN GIA (PROMPT NGá»® Cáº¢NH):
${expertDirectives}

YÃŠU Cáº¦U NGHIÃŠM NGáº¶T (STRICT RULES):
1. **CHUáº¨N HÃ€NH CHÃNH (NO DIALOGUE)**: Tuyá»‡t Ä‘á»‘i bá» cÃ¡c lá»i thoáº¡i "GV nÃ³i", "HS thÆ°a". Thay tháº¿ báº±ng mÃ´ táº£ HÃ nh Ä‘á»™ng sÆ° pháº¡m (Teacher Action) vÃ  Sáº£n pháº©m Ä‘áº¡t Ä‘Æ°á»£c (Student Product).
2. **CHI TIáº¾T HÃ“A Sáº¢N PHáº¨M**: Viáº¿t Cá»°C Ká»² CHI TIáº¾T cÃ¡c Ä‘Ã¡p Ã¡n dá»± kiáº¿n, ná»™i dung phiáº¿u há»c táº­p, káº¿t quáº£ pháº£n tÆ° cá»§a HS (Ä‘á»ƒ tÄƒng Ä‘á»™ dÃ i vÃ  tÃ­nh chuyÃªn mÃ´n).
3. **FUSION (Há»¢P NHáº¤T)**: GIá»® Láº I cÃ¡c vÃ­ dá»¥ hay tá»« giÃ¡o Ã¡n cÅ© nhÆ°ng NÃ‚NG Cáº¤P cÃ¡ch tá»• chá»©c theo 4 bÆ°á»›c chuáº©n 5512 (Chuyá»ƒn giao -> Thá»±c hiá»‡n -> BÃ¡o cÃ¡o -> Chá»‘t).
4. **VERTICAL ENTANGLEMENT**: Äáº£m báº£o sá»± káº¿t ná»‘i cháº·t cháº½ giá»¯a Sinh hoáº¡t dÆ°á»›i cá» -> Hoáº¡t Ä‘á»™ng giÃ¡o dá»¥c -> Sinh hoáº¡t lá»›p.
5. **FORMAT**: Duy trÃ¬ marker {{cot_1}} cho GV vÃ  {{cot_2}} cho HS trong cÃ¡c cá»™t tá»• chá»©c thá»±c hiá»‡n.
6. **BADGE**: Gáº¯n badge "Expert Integrated" vÃ o káº¿t quáº£.

TRáº¢ Vá»€: Má»™t Ä‘á»‘i tÆ°á»£ng JSON duy nháº¥t lÃ  giÃ¡o Ã¡n Ä‘Ã£ Ä‘Æ°á»£c há»£p nháº¥t. Tráº£ vá» TRá»°C TIáº¾P JSON, khÃ´ng thÃªm text giáº£i thÃ­ch.
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON Safely
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return valid JSON for merging");
        }

        const mergedContent = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            content: mergedContent,
            auditTrail: "ÄÃ£ thá»±c hiá»‡n pháº«u thuáº­t ná»™i dung vÃ  lá»“ng ghÃ©p chá»‰ thá»‹ nÄƒng lá»±c sá»‘ 2025.",
            badge: "Expert Integrated"
        };
    } catch (error: any) {
        console.error("[KHBHMerger] Error:", error);
        return {
            success: false,
            content: currentPlan,
            auditTrail: `Lá»—i há»£p nháº¥t: ${error.message}`,
            badge: "Standard"
        };
    }
}
