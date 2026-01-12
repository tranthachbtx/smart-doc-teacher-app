"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const COMPLIANCE_SYSTEM_PROMPT = `Báº¡n lÃ  ChuyÃªn gia Thanh tra GiÃ¡o dá»¥c cáº¥p cao (Senior MOET Auditor).
Nhiá»‡m vá»¥ cá»§a báº¡n lÃ  kiá»ƒm Ä‘á»‹nh GiÃ¡o Ã¡n theo CÃ´ng vÄƒn 5512 vÃ  Khung nÄƒng lá»±c sá»‘ 2025.

QUY TRÃŒNH TÆ¯ DUY (CHAIN-OF-THOUGHT):
1. BÆ°á»›c 1: QuÃ©t toÃ n bá»™ má»¥c tiÃªu. Kiá»ƒm tra xem cÃ³ Ä‘á»§ 3 thÃ nh pháº§n (Kiáº¿n thá»©c, NÄƒng lá»±c, Pháº©m cháº¥t) khÃ´ng? CÃ³ viáº¿t Ä‘Ãºng Ä‘á»™ng tá»« Ä‘o lÆ°á»ng Ä‘Æ°á»£c (liá»‡t kÃª, trÃ¬nh bÃ y, thá»±c hiá»‡n...) khÃ´ng?
2. BÆ°á»›c 2: Kiá»ƒm tra Tiáº¿n trÃ¬nh dáº¡y há»c. CÃ³ Ä‘á»§ 4 Hoáº¡t Ä‘á»™ng khÃ´ng?
3. BÆ°á»›c 3: PhÃ¢n tÃ­ch sÃ¢u 1 Hoáº¡t Ä‘á»™ng báº¥t ká»³. CÃ³ Ä‘á»§ 4 bÆ°á»›c Tá»• chá»©c (Chuyá»ƒn giao, Thá»±c hiá»‡n, BÃ¡o cÃ¡o, Káº¿t luáº­n) khÃ´ng?
4. BÆ°á»›c 4: Soi xÃ©t tÃ­nh hiá»‡n Ä‘áº¡i. CÃ³ tÃ­ch há»£p NÄƒng lá»±c sá»‘ (Sá»­ dá»¥ng AI, Canva, Padlet...) má»™t cÃ¡ch thá»±c cháº¥t khÃ´ng?

QUY Táº®C CHáº¤M ÄIá»‚M (Thanh Ä‘iá»ƒm 100):
1. TIÃŠU CHÃ 1: Má»¤C TIÃŠU (20Ä‘) - Pháº£i Ä‘á»§ 3 pháº§n, ngÃ´n ngá»¯ Ä‘Ãºng chuáº©n 5512.
2. TIÃŠU CHÃ 2: THIáº¾T Bá»Š (10Ä‘) - GV vÃ  HS chuáº©n bá»‹ cá»¥ thá»ƒ.
3. TIÃŠU CHÃ 3: TIáº¾N TRÃŒNH 4 HÄ (50Ä‘) - Cá»±c ká»³ quan trá»ng. Má»—i HÄ pháº£i cÃ³ má»¥c nhá».
4. TIÃŠU CHÃ 4: TÃCH Há»¢P NLS & Äáº O Äá»¨C (20Ä‘) - CÃ³ sÃ¡ng táº¡o vÃ  sá»­ dá»¥ng cÃ´ng nghá»‡ sá»‘ khÃ´ng?

Äá»ŠNH Dáº NG BÃO CÃO (Markdown):
# ðŸ“ BÃO CÃO KIá»‚M Äá»ŠNH CHUYÃŠN SÃ‚U
### ðŸ“Š Äiá»ƒm tá»•ng quÃ¡t: [X]/100
[ÄÃ¡nh giÃ¡ tá»•ng thá»ƒ vá» tÆ° duy sÆ° pháº¡m cá»§a giÃ¡o Ã¡n]

### ðŸ” PHÃ‚N TÃCH CHI TIáº¾T
- **Má»¥c tiÃªu**: [ÄÃ¡nh giÃ¡]
- **Tiáº¿n trÃ¬nh**: [ÄÃ¡nh giÃ¡ bÆ°á»›c chuyá»ƒn giao vÃ  sáº£n pháº©m]
- **NÄƒng lá»±c sá»‘**: [ÄÃ¡nh giÃ¡ má»©c Ä‘á»™ tÃ­ch há»£p cÃ´ng nghá»‡]

### ðŸ’¡ CHá»ˆ THá»Š Cáº¢I THIá»†N (SURGICAL DIRECTIVES)
1. [Sá»­a pháº§n...] Ä‘á»ƒ...
2. [ThÃªm...] vÃ o...
`;

export async function check5512Compliance(lessonContent: any, modelName: string = "gemini-1.5-flash") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { success: false, error: "Missing API Key" };

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { temperature: 0.2 }
        });

        const prompt = `Kiá»ƒm Ä‘á»‹nh giÃ¡o Ã¡n sau:
        ---
        ${JSON.stringify(lessonContent, null, 2).substring(0, 20000)}
        ---
        HÃƒY XUáº¤T BÃO CÃO THEO Äá»ŠNH Dáº NG QUY Äá»ŠNH.`;

        const result = await model.generateContent([
            { text: COMPLIANCE_SYSTEM_PROMPT },
            { text: prompt }
        ]);

        return {
            success: true,
            audit: result.response.text(),
            score: parseInt(result.response.text().match(/Äiá»ƒm tá»•ng quÃ¡t: (\d+)/)?.[1] || "0")
        };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
