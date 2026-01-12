export const ASSESSMENT_PRODUCT_TYPES = {
    MEDIA: {
        label: "Sáº£n pháº©m Truyá»n thÃ´ng Äa phÆ°Æ¡ng tiá»‡n",
        types: [
            "Video Clip / Vlog / Phim ngáº¯n",
            "Infographic / Poster sá»‘",
            "Táº­p san Ä‘iá»‡n tá»­ / Newsletter / Website"
        ]
    },
    PLAN_REPORT: {
        label: "Sáº£n pháº©m Káº¿ hoáº¡ch & BÃ¡o cÃ¡o",
        types: [
            "Báº£n káº¿ hoáº¡ch hoáº¡t Ä‘á»™ng (Action Plan)",
            "Há»“ sÆ¡ nÄƒng lá»±c / Portfolio",
            "BÃ¡o cÃ¡o thu hoáº¡ch (Reflection Paper)"
        ]
    },
    PERFORMANCE: {
        label: "Sáº£n pháº©m Biá»ƒu diá»…n & Thá»±c hÃ nh",
        types: [
            "Thuyáº¿t trÃ¬nh / HÃ¹ng biá»‡n",
            "Tiá»ƒu pháº©m Ä‘Ã³ng vai",
            "Tá»• chá»©c sá»± kiá»‡n"
        ]
    },
    MAKING: {
        label: "Sáº£n pháº©m Cháº¿ táº¡o & STEM",
        types: [
            "MÃ´ hÃ¬nh váº­t lÃ½",
            "Sáº£n pháº©m tÃ¡i cháº¿",
            "Sáº£n pháº©m thá»§ cÃ´ng"
        ]
    }
};

export const RUBRIC_TEMPLATES: Record<string, any[]> = {
    MEDIA: [
        { name: "Ná»™i dung & ThÃ´ng Ä‘iá»‡p", weight: 40, criteria: ["ThÃ´ng Ä‘iá»‡p Ã½ nghÄ©a, nhÃ¢n vÄƒn", "Kiáº¿n thá»©c chÃ­nh xÃ¡c, khoa há»c", "Ká»‹ch báº£n/Cáº¥u trÃºc lÃ´i cuá»‘n"] },
        { name: "Ká»¹ thuáº­t & Tháº©m má»¹", weight: 30, criteria: ["HÃ¬nh áº£nh/Video sáº¯c nÃ©t, Ä‘áº¹p máº¯t", "Ã‚m thanh rÃµ rÃ ng/MÃ u sáº¯c hÃ i hÃ²a", "Ká»¹ thuáº­t dá»±ng/Thiáº¿t káº¿ chuyÃªn nghiá»‡p"] },
        { name: "SÃ¡ng táº¡o", weight: 15, criteria: ["Ã tÆ°á»Ÿng Ä‘á»™c Ä‘Ã¡o, má»›i láº¡", "CÃ¡ch thá»ƒ hiá»‡n áº¥n tÆ°á»£ng", "Mang Ä‘áº­m dáº¥u áº¥n cÃ¡ nhÃ¢n/nhÃ³m"] },
        { name: "Há»£p tÃ¡c & Quy trÃ¬nh", weight: 15, criteria: ["LÃ m viá»‡c nhÃ³m hiá»‡u quáº£", "ÄÃºng háº¡n", "CÃ³ minh chá»©ng háº­u trÆ°á»ng"] }
    ],
    PLAN_REPORT: [
        { name: "TÃ­nh Kháº£ thi & Thá»±c táº¿", weight: 30, criteria: ["Má»¥c tiÃªu SMART", "Nguá»“n lá»±c Ä‘Æ°á»£c xÃ¡c Ä‘á»‹nh rÃµ", "Lá»™ trÃ¬nh/Timeline há»£p lÃ½"] },
        { name: "Cáº¥u trÃºc & HÃ¬nh thá»©c", weight: 20, criteria: ["Äáº§y Ä‘á»§ cÃ¡c má»¥c theo quy Ä‘á»‹nh", "TrÃ¬nh bÃ y vÄƒn báº£n chuyÃªn nghiá»‡p", "NgÃ´n ngá»¯ trong sÃ¡ng, máº¡ch láº¡c"] },
        { name: "PhÃ¢n tÃ­ch & TÆ° duy", weight: 30, criteria: ["PhÃ¢n tÃ­ch bá»‘i cáº£nh sÃ¢u sáº¯c", "Nháº­n diá»‡n rá»§i ro tá»‘t", "Giáº£i phÃ¡p/Äá» xuáº¥t sÃ¡ng táº¡o"] },
        { name: "Tá»•ng káº¿t & Pháº£n há»“i", weight: 20, criteria: ["BÃ i há»c kinh nghiá»‡m rÃºt ra", "ÄÃ¡nh giÃ¡ trung thá»±c káº¿t quáº£", "Káº¿ hoáº¡ch cáº£i thiá»‡n"] }
    ],
    PERFORMANCE: [
        { name: "Ná»™i dung & Ká»‹ch báº£n", weight: 35, criteria: ["ÄÃºng chá»§ Ä‘á» quy Ä‘á»‹nh", "Ká»‹ch báº£n cháº·t cháº½, Ã½ nghÄ©a", "ThÃ´ng Ä‘iá»‡p rÃµ rÃ ng"] },
        { name: "Ká»¹ nÄƒng Biá»ƒu diá»…n", weight: 35, criteria: ["Giá»ng nÃ³i/NgÃ´n ngá»¯ cÆ¡ thá»ƒ tá»± tin", "Phá»‘i há»£p nhÃ³m nhá»‹p nhÃ ng", "Xá»­ lÃ½ tÃ¬nh huá»‘ng tá»‘t"] },
        { name: "SÃ¡ng táº¡o & DÃ n dá»±ng", weight: 20, criteria: ["Äáº¡o cá»¥/Trang phá»¥c phÃ¹ há»£p, sÃ¡ng táº¡o", "Ã‚m nháº¡c/Ãnh sÃ¡ng há»— trá»£ hiá»‡u quáº£", "CÃ¡ch dÃ n dá»±ng má»›i máº»"] },
        { name: "Cáº£m xÃºc & TÃ¡c Ä‘á»™ng", weight: 10, criteria: ["GÃ¢y xÃºc Ä‘á»™ng/há»©ng thÃº cho khÃ¡n giáº£", "Truyá»n cáº£m há»©ng tÃ­ch cá»±c"] }
    ],
    MAKING: [
        { name: "TÃ­nh Khoa há»c & Ká»¹ thuáº­t", weight: 30, criteria: ["NguyÃªn lÃ½ hoáº¡t Ä‘á»™ng chÃ­nh xÃ¡c", "Cáº¥u trÃºc vá»¯ng cháº¯c, an toÃ n", "Váº­t liá»‡u phÃ¹ há»£p"] },
        { name: "TÃ­nh Tháº©m má»¹ & HoÃ n thiá»‡n", weight: 25, criteria: ["HÃ¬nh thá»©c Ä‘áº¹p, cÃ¢n Ä‘á»‘i", "Äá»™ hoÃ n thiá»‡n chi tiáº¿t cao", "Trang trÃ­ áº¥n tÆ°á»£ng"] },
        { name: "TÃ­nh á»¨ng dá»¥ng & Há»¯u Ã­ch", weight: 25, criteria: ["Giáº£i quyáº¿t Ä‘Æ°á»£c váº¥n Ä‘á» thá»±c táº¿", "CÃ³ kháº£ nÄƒng sá»­ dá»¥ng/tÃ¡i sá»­ dá»¥ng", "ThÃ¢n thiá»‡n mÃ´i trÆ°á»ng"] },
        { name: "Thuyáº¿t trÃ¬nh sáº£n pháº©m", weight: 20, criteria: ["Giá»›i thiá»‡u rÃµ rÃ ng quy trÃ¬nh lÃ m", "Giáº£i thÃ­ch tá»‘t nguyÃªn lÃ½", "Tráº£ lá»i pháº£n biá»‡n thuyáº¿t phá»¥c"] }
    ]
};


export function getAssessmentPrompt(
    grade: string,
    term: string, // "Giá»¯a kÃ¬ 1", "Cuá»‘i kÃ¬ 1", ...
    productType: string,
    topic: string,
    curriculum: string = "Káº¿t ná»‘i tri thá»©c" // Default book
): string {
    // Defensive: ensure all inputs are strings
    const safeGrade = grade || "10";
    const safeTerm = term || "Giá»¯a kÃ¬ 1";
    const safeProductType = productType || "";
    const safeTopic = topic || "";
    const safeCurriculum = curriculum || "Káº¿t ná»‘i tri thá»©c";

    // Determine Rubric Suggestion based on Product Type
    let rubricSuggestion = "";
    // Simple matching (can be improved)
    if (safeProductType.includes("Video") || safeProductType.includes("Tranh") || safeProductType.includes("Poster") || safeProductType.includes("Truyá»n thÃ´ng")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.MEDIA);
    } else if (safeProductType.includes("Káº¿ hoáº¡ch") || safeProductType.includes("BÃ¡o cÃ¡o") || safeProductType.includes("Há»“ sÆ¡")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.PLAN_REPORT);
    } else if (safeProductType.includes("Thuyáº¿t trÃ¬nh") || safeProductType.includes("Tiá»ƒu pháº©m") || safeProductType.includes("Sá»± kiá»‡n")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.PERFORMANCE);
    } else if (safeProductType.includes("MÃ´ hÃ¬nh") || safeProductType.includes("Cháº¿ táº¡o") || safeProductType.includes("Thá»§ cÃ´ng")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.MAKING);
    }

    return `VAI TRÃ’: Báº¡n lÃ  ChuyÃªn gia ÄÃ¡nh giÃ¡ GiÃ¡o dá»¥c, am hiá»ƒu sÃ¢u sáº¯c ThÃ´ng tÆ° 22/2021/TT-BGDÄT vÃ  Ä‘áº·c thÃ¹ mÃ´n Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p.

NHIá»†M Vá»¤: Soáº¡n tháº£o "Káº¾ HOáº CH KIá»‚M TRA ÄÃNH GIÃ Äá»ŠNH Ká»² Báº°NG Sáº¢N PHáº¨M" cho há»c sinh.

THÃ”NG TIN Äáº¦U VÃ€O:
- Khá»‘i lá»›p: ${safeGrade}
- Ká»³ Ä‘Ã¡nh giÃ¡: ${safeTerm}
- Loáº¡i sáº£n pháº©m: ${safeProductType}
- Chá»§ Ä‘á»/Ná»™i dung trá»ng tÃ¢m: ${safeTopic}
- Bá»™ sÃ¡ch: ${safeCurriculum}

Cáº¤U TRÃšC Äáº¦U RA (JSON Format):
Báº¡n hÃ£y tráº£ vá» káº¿t quáº£ dÆ°á»›i dáº¡ng JSON vá»›i cÃ¡c trÆ°á»ng sau:
1. ten_ke_hoach: TÃªn káº¿ hoáº¡ch kiá»ƒm tra (VÃ­ dá»¥: Káº¿ hoáº¡ch kiá»ƒm tra Giá»¯a kÃ¬ 1 - Dá»± Ã¡n "VÄƒn hÃ³a há»c Ä‘Æ°á»ng").
2. muc_tieu: Má»¥c tiÃªu Ä‘Ã¡nh giÃ¡ (YÃªu cáº§u cáº§n Ä‘áº¡t vá» pháº©m cháº¥t, nÄƒng lá»±c).
3. noi_dung_nhiem_vu: MÃ´ táº£ chi tiáº¿t nhiá»‡m vá»¥ há»c sinh cáº§n lÃ m (Bá»‘i cáº£nh, YÃªu cáº§u sáº£n pháº©m, Thá»i háº¡n).
4. hinh_thuc_to_chuc: CÃ¡ch thá»©c tá»• chá»©c (CÃ¡ nhÃ¢n/NhÃ³m, Thuyáº¿t trÃ¬nh/Ná»™p online).
5. ma_tran_dac_ta: Báº£ng ma tráº­n Ä‘áº·c táº£ theo 4 má»©c Ä‘á»™ (Nháº­n biáº¿t, ThÃ´ng hiá»ƒu, Váº­n dá»¥ng, Váº­n dá»¥ng cao) kÃ¨m tá»· lá»‡ %.
6. bang_kiem_rubric: Chi tiáº¿t Rubric Ä‘Ã¡nh giÃ¡ (TiÃªu chÃ­, CÃ¡c má»©c Ä‘á»™ Ä‘iá»ƒm, MÃ´ táº£ ká»¹ thuáº­t).
7. loi_khuyen: Lá»i khuyÃªn cho giÃ¡o viÃªn khi triá»ƒn khai.

YÃŠU Cáº¦U Äáº¶C BIá»†T:
- Rubric phÃ¢n chia rÃµ rÃ ng: Äá»‹nh lÆ°á»£ng (Äiá»ƒm sá»‘) vÃ  Äá»‹nh tÃ­nh (MÃ´ táº£ hÃ nh vi).
- NgÃ´n ngá»¯: SÆ° pháº¡m, chuáº©n má»±c, khÃ­ch lá»‡ sá»± sÃ¡ng táº¡o.
- TuÃ¢n thá»§ quy táº¯c: ÄÃ¡nh giÃ¡ vÃ¬ sá»± tiáº¿n bá»™ cá»§a ngÆ°á»i há»c.
${rubricSuggestion ? `- Gá»¢I Ã Cáº¤U TRÃšC RUBRIC (Tham kháº£o Ä‘á»ƒ xÃ¢y dá»±ng): ${rubricSuggestion}` : ""}

Äá»ŠNH Dáº NG JSON MáºªU:
{
  "ten_ke_hoach": "...",
  "muc_tieu": ["...", "..."],
  "noi_dung_nhiem_vu": "...",
  "hinh_thuc_to_chuc": "...",
  "ma_tran_dac_ta": [
    { "muc_do": "Nháº­n biáº¿t (20%)", "mo_ta": "..." },
    { "muc_do": "ThÃ´ng hiá»ƒu (30%)", "mo_ta": "..." }
  ],
  "bang_kiem_rubric": [
    { 
      "tieu_chi": "Ná»™i dung", 
      "trong_so": "40%", 
      "muc_do": {
        "xuat_sac": "...",
        "tot": "...",
        "dat": "...",
        "chua_dat": "..."
      }
    }
  ],
  "loi_khuyen": "..."
}`;
}
