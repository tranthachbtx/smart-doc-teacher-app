/**
 * ============================================================
 * LESSON PLAN PROMPTS - Káº¾ HOáº CH BÃ€I Dáº Y HÄTN
 * ============================================================
 *
 * File nÃ y chá»©a toÃ n bá»™ prompt huáº¥n luyá»‡n Gemini AI
 * Ä‘á»ƒ thiáº¿t káº¿ Káº¿ hoáº¡ch bÃ i dáº¡y mÃ´n Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p
 * theo bá»™ sÃ¡ch "Káº¿t ná»‘i Tri thá»©c vá»›i Cuá»™c sá»‘ng"
 *
 * HÆ¯á»šNG DáºªN CHá»ˆNH Sá»¬A:
 * 1. CÆ  Sá»ž Dá»® LIá»†U CHÆ¯Æ NG TRÃŒNH (CURRICULUM_DATABASE):
 *    - Chá»‰nh sá»­a ná»™i dung chá»§ Ä‘á» theo SGK
 *    - Cáº­p nháº­t yÃªu cáº§u cáº§n Ä‘áº¡t cho tá»«ng khá»‘i lá»›p
 *
 * 2. QUY Táº®C PHÃ‚N TÃCH NGá»® Cáº¢NH (CONTEXT_PARSING_RULES):
 *    - Thay Ä‘á»•i má»©c Ä‘á»™ Bloom's taxonomy theo khá»‘i
 *    - Cáº­p nháº­t Ä‘áº·c Ä‘iá»ƒm tÃ¢m lÃ½ há»c sinh
 *
 * 3. Cáº¤U TRÃšC GIÃO ÃN (LESSON_STRUCTURE):
 *    - TuÃ¢n thá»§ CÃ´ng vÄƒn 5512/BGDÄT-GDTrH
 *    - CÃ³ thá»ƒ thÃªm/bá»›t cÃ¡c pháº§n theo yÃªu cáº§u BGH
 *
 * ============================================================
 */

// ============================================================
// PHáº¦N 1: CÆ  Sá»ž LÃ LUáº¬N VÃ€ TRIáº¾T LÃ SÆ¯ PHáº M
// ============================================================

export const PEDAGOGICAL_FOUNDATION = `
TRIáº¾T LÃ "Káº¾T Ná»I TRI THá»¨C":

Bá»™ sÃ¡ch "Káº¿t ná»‘i tri thá»©c vá»›i cuá»™c sá»‘ng" Ä‘Æ°á»£c xÃ¢y dá»±ng dá»±a trÃªn quan Ä‘iá»ƒm:
- ÄÆ°a bÃ i há»c vÃ o thá»±c tiá»…n cuá»™c sá»‘ng
- ÄÆ°a cuá»™c sá»‘ng vÃ o bÃ i há»c
- Há»c sinh lÃ  TRUNG TÃ‚M cá»§a sá»± tráº£i nghiá»‡m, chiÃªm nghiá»‡m vÃ  Ä‘Ãºc káº¿t

MÃ” HÃŒNH XOáº®N á»C (SPIRAL CURRICULUM):
CÃ¡c chá»§ Ä‘á» cá»‘t lÃµi "Báº£n thÃ¢n", "Gia Ä‘Ã¬nh", "Cá»™ng Ä‘á»“ng", "MÃ´i trÆ°á»ng" vÃ  "Nghá» nghiá»‡p" 
Ä‘Æ°á»£c láº·p láº¡i á»Ÿ cáº£ ba khá»‘i lá»›p nhÆ°ng vá»›i Má»¨C Äá»˜ YÃŠU Cáº¦U TÄ‚NG TIáº¾N vá» chiá»u sÃ¢u vÃ  Ä‘á»™ phá»©c táº¡p.

PHÃ‚N TÃCH Dá»ŒC THEO KHá»I Lá»šP (Bloom's Taxonomy):

Khá»‘i 10 - Má»¨C "TÃŒM HIá»‚U" (Nháº­n biáº¿t, Hiá»ƒu):
- Trá»ng tÃ¢m: ThÃ­ch á»©ng vÃ  nháº­n diá»‡n
- Há»c sinh vá»«a bÆ°á»›c vÃ o mÃ´i trÆ°á»ng THPT, cáº§n Ä‘á»‹nh vá»‹ báº£n thÃ¢n
- LÃ m quen vá»›i cÃ¡c khÃ¡i niá»‡m nghá» nghiá»‡p cÆ¡ báº£n
- Tá»« khÃ³a hoáº¡t Ä‘á»™ng: TÃ¬m hiá»ƒu, Nháº­n biáº¿t, KhÃ¡m phÃ¡, MÃ´ táº£

Khá»‘i 11 - Má»¨C "PHÃ‚N TÃCH/ÄÃNH GIÃ" (PhÃ¢n tÃ­ch, ÄÃ¡nh giÃ¡):
- Trá»ng tÃ¢m: PhÃ¡t triá»ƒn vÃ  káº¿t ná»‘i
- Há»c sinh má»Ÿ rá»™ng ra cá»™ng Ä‘á»“ng, xÃ£ há»™i
- PhÃ¡t triá»ƒn ká»¹ nÄƒng má»m phá»©c táº¡p
- Tá»« khÃ³a hoáº¡t Ä‘á»™ng: PhÃ¢n tÃ­ch, So sÃ¡nh, ÄÃ¡nh giÃ¡, Pháº£n biá»‡n

Khá»‘i 12 - Má»¨C "QUYáº¾T Äá»ŠNH/GIáº¢I QUYáº¾T" (Tá»•ng há»£p, SÃ¡ng táº¡o):
- Trá»ng tÃ¢m: TrÆ°á»Ÿng thÃ nh vÃ  quyáº¿t Ä‘á»‹nh
- Há»c sinh Ä‘á»‘i máº·t vá»›i cÃ¡c quyáº¿t Ä‘á»‹nh nghá» nghiá»‡p thá»±c sá»±
- Chuáº©n bá»‹ cho cuá»™c sá»‘ng cÃ´ng dÃ¢n
- Tá»« khÃ³a hoáº¡t Ä‘á»™ng: Quyáº¿t Ä‘á»‹nh, Giáº£i quyáº¿t, XÃ¢y dá»±ng, Thiáº¿t káº¿
`

// ============================================================
// PHáº¦N 2: CÆ  Sá»ž Dá»® LIá»†U CHÆ¯Æ NG TRÃŒNH (Káº¾T Ná»I TRI THá»¨C)
// ============================================================

export const CURRICULUM_DATABASE = {
  "10": {
    title: "Lá»›p 10: ThÃ­ch á»©ng vÃ  KhÃ¡m phÃ¡ Báº£n thÃ¢n",
    description: "GiÃºp há»c sinh chuyá»ƒn giao tá»« THCS sang THPT, Ä‘á»‹nh hÃ¬nh nhÃ¢n cÃ¡ch vÃ  lÃ m quen mÃ´i trÆ°á»ng má»›i",
    bloomLevel: "Nháº­n biáº¿t, Hiá»ƒu (TÃ¬m hiá»ƒu)",
    themes: {
      // Máº CH 1: HOáº T Äá»˜NG HÆ¯á»šNG VÃ€O Báº¢N THÃ‚N
      ban_than: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng vÃ o báº£n thÃ¢n",
        topics: [
          {
            id: "10.1",
            name: "Thá»ƒ hiá»‡n pháº©m cháº¥t tá»‘t Ä‘áº¹p cá»§a ngÆ°á»i há»c sinh",
            coreActivity: "Nháº­n diá»‡n cÃ¡c pháº©m cháº¥t tá»‘t Ä‘áº¹p cáº§n cÃ³ cá»§a há»c sinh THPT",
            outcomes: ["Liá»‡t kÃª Ä‘Æ°á»£c cÃ¡c pháº©m cháº¥t tá»‘t Ä‘áº¹p", "Tá»± Ä‘Ã¡nh giÃ¡ báº£n thÃ¢n", "Láº­p káº¿ hoáº¡ch rÃ¨n luyá»‡n"],
            methods: ["Tháº£o luáº­n nhÃ³m", "TrÃ² chÆ¡i khÃ¡m phÃ¡ báº£n thÃ¢n", "Viáº¿t nháº­t kÃ½"],
          },
          {
            id: "10.2",
            name: "XÃ¢y dá»±ng quan Ä‘iá»ƒm sá»‘ng",
            coreActivity: "TÃ¬m hiá»ƒu vÃ  xÃ¢y dá»±ng quan Ä‘iá»ƒm sá»‘ng tÃ­ch cá»±c",
            outcomes: ["Hiá»ƒu tháº¿ nÃ o lÃ  quan Ä‘iá»ƒm sá»‘ng", "XÃ¡c Ä‘á»‹nh quan Ä‘iá»ƒm sá»‘ng cÃ¡ nhÃ¢n", "Chia sáº» vá»›i báº¡n bÃ¨"],
            methods: ["CÃ¢u chuyá»‡n truyá»n cáº£m há»©ng", "Tháº£o luáº­n nhÃ³m", "BÃ i táº­p tá»± váº¥n"],
          },
          {
            id: "10.3",
            name: "RÃ¨n luyá»‡n báº£n thÃ¢n",
            coreActivity: "XÃ¢y dá»±ng thÃ³i quen há»c táº­p vÃ  sinh hoáº¡t tÃ­ch cá»±c",
            outcomes: ["Láº­p káº¿ hoáº¡ch rÃ¨n luyá»‡n", "Thá»±c hiá»‡n vÃ  theo dÃµi tiáº¿n Ä‘á»™", "Äiá»u chá»‰nh phÃ¹ há»£p"],
            methods: ["Láº­p káº¿ hoáº¡ch SMART", "Nháº­t kÃ½ theo dÃµi", "Chia sáº» kinh nghiá»‡m"],
          },
          {
            id: "10.4",
            name: "Tá»± tin giao tiáº¿p",
            coreActivity: "RÃ¨n luyá»‡n ká»¹ nÄƒng giao tiáº¿p tá»± tin",
            outcomes: ["Nháº­n biáº¿t rÃ o cáº£n giao tiáº¿p", "Thá»±c hÃ nh giao tiáº¿p", "Tá»± tin trÃ¬nh bÃ y"],
            methods: ["ÄÃ³ng vai", "Thuyáº¿t trÃ¬nh ngáº¯n", "Pháº£n há»“i tÃ­ch cá»±c"],
          },
        ],
      },
      // Máº CH 2: HOáº T Äá»˜NG HÆ¯á»šNG Äáº¾N XÃƒ Há»˜I
      xa_hoi: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng Ä‘áº¿n xÃ£ há»™i",
        topics: [
          {
            id: "10.5",
            name: "Thá»±c hiá»‡n trÃ¡ch nhiá»‡m vá»›i gia Ä‘Ã¬nh",
            coreActivity: "Nháº­n thá»©c vÃ  thá»±c hiá»‡n trÃ¡ch nhiá»‡m cá»§a con cÃ¡i trong gia Ä‘Ã¬nh",
            outcomes: ["Liá»‡t kÃª trÃ¡ch nhiá»‡m", "Láº­p káº¿ hoáº¡ch thá»±c hiá»‡n", "ÄÃ¡nh giÃ¡ káº¿t quáº£"],
            methods: ["Tháº£o luáº­n tÃ¬nh huá»‘ng", "Dá»± Ã¡n gia Ä‘Ã¬nh", "Chia sáº» cÃ¢u chuyá»‡n"],
          },
          {
            id: "10.6",
            name: "XÃ¢y dá»±ng cá»™ng Ä‘á»“ng",
            coreActivity: "Tham gia cÃ¡c hoáº¡t Ä‘á»™ng xÃ¢y dá»±ng cá»™ng Ä‘á»“ng",
            outcomes: ["Nháº­n biáº¿t váº¥n Ä‘á» cá»™ng Ä‘á»“ng", "Äá» xuáº¥t giáº£i phÃ¡p", "Tham gia hoáº¡t Ä‘á»™ng"],
            methods: ["Kháº£o sÃ¡t cá»™ng Ä‘á»“ng", "Dá»± Ã¡n tÃ¬nh nguyá»‡n", "BÃ¡o cÃ¡o káº¿t quáº£"],
          },
        ],
      },
      // Máº CH 3: HOáº T Äá»˜NG HÆ¯á»šNG Äáº¾N Tá»° NHIÃŠN
      tu_nhien: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng Ä‘áº¿n tá»± nhiÃªn",
        topics: [
          {
            id: "10.7",
            name: "Báº£o tá»“n cáº£nh quan thiÃªn nhiÃªn",
            coreActivity: "TÃ¬m hiá»ƒu vÃ  báº£o vá»‡ cáº£nh quan thiÃªn nhiÃªn Ä‘á»‹a phÆ°Æ¡ng",
            outcomes: ["Nháº­n biáº¿t cáº£nh quan", "Äá» xuáº¥t báº£o vá»‡", "Thá»±c hiá»‡n hÃ nh Ä‘á»™ng"],
            methods: ["Tham quan thá»±c Ä‘á»‹a", "Dá»± Ã¡n báº£o vá»‡", "Truyá»n thÃ´ng"],
          },
          {
            id: "10.8",
            name: "Báº£o vá»‡ mÃ´i trÆ°á»ng",
            coreActivity: "Thá»±c hiá»‡n cÃ¡c hoáº¡t Ä‘á»™ng báº£o vá»‡ mÃ´i trÆ°á»ng",
            outcomes: ["Nháº­n thá»©c váº¥n Ä‘á»", "Thay Ä‘á»•i hÃ nh vi", "Váº­n Ä‘á»™ng ngÆ°á»i khÃ¡c"],
            methods: ["Chiáº¿n dá»‹ch mÃ´i trÆ°á»ng", "3R thá»±c hÃ nh", "Truyá»n thÃ´ng sá»‘"],
          },
        ],
      },
      // Máº CH 4: HOáº T Äá»˜NG HÆ¯á»šNG NGHIá»†P
      huong_nghiep: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng nghiá»‡p",
        topics: [
          {
            id: "10.9",
            name: "TÃ¬m hiá»ƒu hoáº¡t Ä‘á»™ng sáº£n xuáº¥t, kinh doanh, dá»‹ch vá»¥ cá»§a Ä‘á»‹a phÆ°Æ¡ng",
            coreActivity: "Kháº£o sÃ¡t vÃ  tÃ¬m hiá»ƒu cÃ¡c ngÃ nh nghá» táº¡i Ä‘á»‹a phÆ°Æ¡ng",
            outcomes: ["Liá»‡t kÃª ngÃ nh nghá»", "MÃ´ táº£ Ä‘áº·c Ä‘iá»ƒm", "ÄÃ¡nh giÃ¡ tiá»m nÄƒng"],
            methods: ["Tham quan cÆ¡ sá»Ÿ", "Phá»ng váº¥n ngÆ°á»i lao Ä‘á»™ng", "BÃ¡o cÃ¡o nhÃ³m"],
          },
          {
            id: "10.10",
            name: "Hiá»ƒu báº£n thÃ¢n Ä‘á»ƒ chá»n nghá»",
            coreActivity: "ÄÃ¡nh giÃ¡ nÄƒng lá»±c, sá»Ÿ thÃ­ch Ä‘á»ƒ Ä‘á»‹nh hÆ°á»›ng nghá» nghiá»‡p",
            outcomes: ["Tá»± Ä‘Ã¡nh giÃ¡ nÄƒng lá»±c", "XÃ¡c Ä‘á»‹nh sá»Ÿ thÃ­ch nghá»", "LiÃªn há»‡ vá»›i nghá» nghiá»‡p"],
            methods: ["Tráº¯c nghiá»‡m Holland", "Tháº£o luáº­n nhÃ³m", "TÆ° váº¥n cÃ¡ nhÃ¢n"],
          },
          {
            id: "10.11",
            name: "Äá»‹nh hÆ°á»›ng há»c táº­p vÃ  rÃ¨n luyá»‡n theo nhÃ³m nghá» lá»±a chá»n",
            coreActivity: "XÃ¢y dá»±ng káº¿ hoáº¡ch há»c táº­p phÃ¹ há»£p vá»›i Ä‘á»‹nh hÆ°á»›ng nghá»",
            outcomes: ["Chá»n nhÃ³m nghá» quan tÃ¢m", "Láº­p káº¿ hoáº¡ch há»c táº­p", "Thá»±c hiá»‡n vÃ  Ä‘iá»u chá»‰nh"],
            methods: ["Láº­p káº¿ hoáº¡ch", "Mentor nghá» nghiá»‡p", "Theo dÃµi tiáº¿n Ä‘á»™"],
          },
        ],
      },
    },
  },

  "11": {
    title: "Lá»›p 11: Ká»¹ nÄƒng XÃ£ há»™i vÃ  NhÃ³m nghá» ChuyÃªn sÃ¢u",
    description: "PhÃ¡t triá»ƒn ká»¹ nÄƒng má»m phá»©c táº¡p vÃ  tÃ¬m hiá»ƒu chuyÃªn sÃ¢u vá» thá»‹ trÆ°á»ng lao Ä‘á»™ng",
    bloomLevel: "PhÃ¢n tÃ­ch, ÄÃ¡nh giÃ¡",
    themes: {
      ban_than: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng vÃ o báº£n thÃ¢n",
        topics: [
          {
            id: "11.1",
            name: "XÃ¢y dá»±ng quan há»‡ vá»›i tháº§y cÃ´, báº¡n bÃ¨",
            coreActivity: "PhÃ¢n tÃ­ch vÃ  phÃ¡t triá»ƒn má»‘i quan há»‡ tÃ­ch cá»±c",
            outcomes: ["ÄÃ¡nh giÃ¡ má»‘i quan há»‡ hiá»‡n táº¡i", "XÃ¢y dá»±ng chiáº¿n lÆ°á»£c cáº£i thiá»‡n", "Thá»±c hÃ nh ká»¹ nÄƒng"],
            methods: ["PhÃ¢n tÃ­ch tÃ¬nh huá»‘ng", "ÄÃ³ng vai", "Pháº£n há»“i 360 Ä‘á»™"],
          },
          {
            id: "11.2",
            name: "Quáº£n lÃ½ cáº£m xÃºc báº£n thÃ¢n",
            coreActivity: "Nháº­n diá»‡n vÃ  quáº£n lÃ½ cáº£m xÃºc hiá»‡u quáº£",
            outcomes: ["Nháº­n biáº¿t cáº£m xÃºc", "Ãp dá»¥ng ká»¹ thuáº­t quáº£n lÃ½", "ÄÃ¡nh giÃ¡ hiá»‡u quáº£"],
            methods: ["Nháº­t kÃ½ cáº£m xÃºc", "Ká»¹ thuáº­t thÆ° giÃ£n", "Chia sáº» nhÃ³m"],
          },
          {
            id: "11.3",
            name: "TÆ° duy Ä‘á»™c láº­p vÃ  pháº£n biá»‡n",
            coreActivity: "RÃ¨n luyá»‡n tÆ° duy pháº£n biá»‡n trong há»c táº­p vÃ  cuá»™c sá»‘ng",
            outcomes: ["PhÃ¢n tÃ­ch váº¥n Ä‘á» Ä‘a chiá»u", "ÄÃ¡nh giÃ¡ thÃ´ng tin", "ÄÆ°a ra quan Ä‘iá»ƒm cÃ³ cÄƒn cá»©"],
            methods: ["Tranh biá»‡n", "PhÃ¢n tÃ­ch case study", "Viáº¿t bÃ i luáº­n"],
          },
          {
            id: "11.4",
            name: "Giáº£i quyáº¿t mÃ¢u thuáº«n trong gia Ä‘Ã¬nh",
            coreActivity: "PhÃ¢n tÃ­ch nguyÃªn nhÃ¢n vÃ  tÃ¬m giáº£i phÃ¡p cho mÃ¢u thuáº«n gia Ä‘Ã¬nh",
            outcomes: ["Nháº­n diá»‡n nguyÃªn nhÃ¢n", "Äá» xuáº¥t giáº£i phÃ¡p", "Thá»±c hÃ nh giao tiáº¿p"],
            methods: ["PhÃ¢n tÃ­ch tÃ¬nh huá»‘ng", "ÄÃ³ng vai", "Ká»¹ nÄƒng láº¯ng nghe"],
          },
        ],
      },
      xa_hoi: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng Ä‘áº¿n xÃ£ há»™i",
        topics: [
          {
            id: "11.5",
            name: "PhÃ¡t triá»ƒn cá»™ng Ä‘á»“ng bá»n vá»¯ng",
            coreActivity: "ÄÃ¡nh giÃ¡ vÃ  Ä‘á» xuáº¥t giáº£i phÃ¡p phÃ¡t triá»ƒn cá»™ng Ä‘á»“ng",
            outcomes: ["PhÃ¢n tÃ­ch hiá»‡n tráº¡ng", "Äá» xuáº¥t dá»± Ã¡n", "Thá»±c hiá»‡n vÃ  Ä‘Ã¡nh giÃ¡"],
            methods: ["SWOT analysis", "Dá»± Ã¡n cá»™ng Ä‘á»“ng", "Huy Ä‘á»™ng nguá»“n lá»±c"],
          },
        ],
      },
      tu_nhien: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng Ä‘áº¿n tá»± nhiÃªn",
        topics: [
          {
            id: "11.6",
            name: "Báº£o tá»“n Ä‘a dáº¡ng sinh há»c",
            coreActivity: "ÄÃ¡nh giÃ¡ táº§m quan trá»ng vÃ  Ä‘á» xuáº¥t báº£o tá»“n Ä‘a dáº¡ng sinh há»c",
            outcomes: ["PhÃ¢n tÃ­ch giÃ¡ trá»‹", "ÄÃ¡nh giÃ¡ nguy cÆ¡", "Äá» xuáº¥t báº£o tá»“n"],
            methods: ["NghiÃªn cá»©u thá»±c Ä‘á»‹a", "Dá»± Ã¡n báº£o tá»“n", "Truyá»n thÃ´ng"],
          },
          {
            id: "11.7",
            name: "á»¨ng phÃ³ biáº¿n Ä‘á»•i khÃ­ háº­u",
            coreActivity: "PhÃ¢n tÃ­ch tÃ¡c Ä‘á»™ng vÃ  Ä‘á» xuáº¥t giáº£i phÃ¡p á»©ng phÃ³",
            outcomes: ["Hiá»ƒu nguyÃªn nhÃ¢n", "ÄÃ¡nh giÃ¡ tÃ¡c Ä‘á»™ng", "Äá» xuáº¥t hÃ nh Ä‘á»™ng"],
            methods: ["NghiÃªn cá»©u sá»‘ liá»‡u", "Dá»± Ã¡n xanh", "Váº­n Ä‘á»™ng chÃ­nh sÃ¡ch"],
          },
        ],
      },
      huong_nghiep: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng nghiá»‡p",
        topics: [
          {
            id: "11.8",
            name: "TÃ¬m hiá»ƒu nhÃ³m nghá» cÆ¡ báº£n",
            coreActivity: "PhÃ¢n tÃ­ch chuyÃªn sÃ¢u cÃ¡c nhÃ³m nghá» phá»• biáº¿n",
            outcomes: ["So sÃ¡nh nhÃ³m nghá»", "ÄÃ¡nh giÃ¡ phÃ¹ há»£p", "Äá»‹nh hÆ°á»›ng cá»¥ thá»ƒ"],
            methods: ["NghiÃªn cá»©u thá»‹ trÆ°á»ng", "Phá»ng váº¥n chuyÃªn gia", "Job shadowing"],
          },
          {
            id: "11.9",
            name: "RÃ¨n luyá»‡n pháº©m cháº¥t ngÆ°á»i lao Ä‘á»™ng",
            coreActivity: "ÄÃ¡nh giÃ¡ vÃ  rÃ¨n luyá»‡n pháº©m cháº¥t nghá» nghiá»‡p",
            outcomes: ["XÃ¡c Ä‘á»‹nh pháº©m cháº¥t cáº§n thiáº¿t", "Láº­p káº¿ hoáº¡ch rÃ¨n luyá»‡n", "Tá»± Ä‘Ã¡nh giÃ¡ tiáº¿n bá»™"],
            methods: ["MÃ´ hÃ¬nh nÄƒng lá»±c", "Thá»±c táº­p ngáº¯n háº¡n", "Portfolio"],
          },
          {
            id: "11.10",
            name: "XÃ¢y dá»±ng káº¿ hoáº¡ch há»c táº­p theo Ä‘á»‹nh hÆ°á»›ng nghá»",
            coreActivity: "Thiáº¿t káº¿ káº¿ hoáº¡ch há»c táº­p chi tiáº¿t theo nghá» chá»n",
            outcomes: ["PhÃ¢n tÃ­ch yÃªu cáº§u nghá»", "Láº­p lá»™ trÃ¬nh há»c táº­p", "Thá»±c hiá»‡n vÃ  Ä‘iá»u chá»‰nh"],
            methods: ["Lá»™ trÃ¬nh há»c táº­p", "Mentoring", "Review Ä‘á»‹nh ká»³"],
          },
        ],
      },
    },
  },

  "12": {
    title: "Lá»›p 12: TrÆ°á»Ÿng thÃ nh vÃ  Quyáº¿t Ä‘á»‹nh Nghá» nghiá»‡p",
    description: "Sá»± trÆ°á»Ÿng thÃ nh toÃ n diá»‡n, trÃ¡ch nhiá»‡m cÃ´ng dÃ¢n vÃ  quyáº¿t Ä‘á»‹nh chá»n trÆ°á»ng, chá»n nghá»",
    bloomLevel: "Tá»•ng há»£p, SÃ¡ng táº¡o (Quyáº¿t Ä‘á»‹nh, Giáº£i quyáº¿t)",
    themes: {
      ban_than: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng vÃ o báº£n thÃ¢n",
        topics: [
          {
            id: "12.1",
            name: "Thá»ƒ hiá»‡n sá»± trÆ°á»Ÿng thÃ nh cá»§a báº£n thÃ¢n",
            coreActivity: "Tá»•ng káº¿t vÃ  thá»ƒ hiá»‡n sá»± trÆ°á»Ÿng thÃ nh qua 3 nÄƒm THPT",
            outcomes: ["NhÃ¬n nháº­n sá»± thay Ä‘á»•i", "Chia sáº» bÃ i há»c", "Äá»‹nh hÆ°á»›ng tÆ°Æ¡ng lai"],
            methods: ["Portfolio cÃ¡ nhÃ¢n", "ThÆ° gá»­i báº£n thÃ¢n", "Buá»•i chia sáº»"],
          },
          {
            id: "12.2",
            name: "Theo Ä‘uá»•i Ä‘am mÃª",
            coreActivity: "XÃ¡c Ä‘á»‹nh vÃ  láº­p káº¿ hoáº¡ch theo Ä‘uá»•i Ä‘am mÃª",
            outcomes: ["XÃ¡c Ä‘á»‹nh Ä‘am mÃª", "CÃ¢n báº±ng Ä‘am mÃª vÃ  thá»±c táº¿", "Láº­p káº¿ hoáº¡ch hÃ nh Ä‘á»™ng"],
            methods: ["Ikigai workshop", "Mentor chia sáº»", "Dá»± Ã¡n cÃ¡ nhÃ¢n"],
          },
          {
            id: "12.3",
            name: "HoÃ n thiá»‡n báº£n thÃ¢n",
            coreActivity: "ÄÃ¡nh giÃ¡ toÃ n diá»‡n vÃ  láº­p káº¿ hoáº¡ch hoÃ n thiá»‡n báº£n thÃ¢n",
            outcomes: ["Tá»± Ä‘Ã¡nh giÃ¡ 360", "XÃ¡c Ä‘á»‹nh Ä‘iá»ƒm cáº§n cáº£i thiá»‡n", "Cam káº¿t hÃ nh Ä‘á»™ng"],
            methods: ["SWOT cÃ¡ nhÃ¢n", "Feedback tá»« ngÆ°á»i khÃ¡c", "Káº¿ hoáº¡ch phÃ¡t triá»ƒn"],
          },
          {
            id: "12.4",
            name: "Tá»• chá»©c cuá»™c sá»‘ng gia Ä‘Ã¬nh",
            coreActivity: "Chuáº©n bá»‹ ká»¹ nÄƒng tá»• chá»©c cuá»™c sá»‘ng Ä‘á»™c láº­p",
            outcomes: ["Ká»¹ nÄƒng quáº£n lÃ½ tÃ i chÃ­nh", "Ká»¹ nÄƒng sinh hoáº¡t", "Ká»¹ nÄƒng giao tiáº¿p gia Ä‘Ã¬nh"],
            methods: ["Thá»±c hÃ nh quáº£n lÃ½ ngÃ¢n sÃ¡ch", "Dá»± Ã¡n sá»‘ng Ä‘á»™c láº­p", "TÆ° váº¥n gia Ä‘Ã¬nh"],
          },
        ],
      },
      xa_hoi: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng Ä‘áº¿n xÃ£ há»™i",
        topics: [
          {
            id: "12.5",
            name: "ÄoÃ n káº¿t cÃ¡c dÃ¢n tá»™c Viá»‡t Nam",
            coreActivity: "TÃ¬m hiá»ƒu vÃ  thá»ƒ hiá»‡n tinh tháº§n Ä‘oÃ n káº¿t dÃ¢n tá»™c",
            outcomes: ["Hiá»ƒu giÃ¡ trá»‹ Ä‘oÃ n káº¿t", "TÃ´n trá»ng Ä‘a dáº¡ng vÄƒn hÃ³a", "Thá»±c hiá»‡n hÃ nh Ä‘á»™ng"],
            methods: ["TÃ¬m hiá»ƒu vÄƒn hÃ³a", "Giao lÆ°u", "Dá»± Ã¡n vÄƒn hÃ³a"],
          },
        ],
      },
      tu_nhien: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng Ä‘áº¿n tá»± nhiÃªn",
        topics: [
          {
            id: "12.6",
            name: "GÃ¬n giá»¯ váº» Ä‘áº¹p thiÃªn nhiÃªn",
            coreActivity: "SÃ¡ng táº¡o giáº£i phÃ¡p báº£o vá»‡ váº» Ä‘áº¹p thiÃªn nhiÃªn",
            outcomes: ["ÄÃ¡nh giÃ¡ hiá»‡n tráº¡ng", "Thiáº¿t káº¿ giáº£i phÃ¡p", "Triá»ƒn khai dá»± Ã¡n"],
            methods: ["Dá»± Ã¡n sÃ¡ng táº¡o", "Chiáº¿n dá»‹ch truyá»n thÃ´ng", "Huy Ä‘á»™ng cá»™ng Ä‘á»“ng"],
          },
          {
            id: "12.7",
            name: "Báº£o vá»‡ Ä‘á»™ng váº­t hoang dÃ£",
            coreActivity: "Tham gia báº£o vá»‡ Ä‘á»™ng váº­t hoang dÃ£",
            outcomes: ["Hiá»ƒu luáº­t phÃ¡p", "Tham gia báº£o vá»‡", "Truyá»n thÃ´ng váº­n Ä‘á»™ng"],
            methods: ["NghiÃªn cá»©u phÃ¡p luáº­t", "TÃ¬nh nguyá»‡n", "Chiáº¿n dá»‹ch sá»‘"],
          },
        ],
      },
      huong_nghiep: {
        name: "Hoáº¡t Ä‘á»™ng hÆ°á»›ng nghiá»‡p",
        topics: [
          {
            id: "12.8",
            name: "YÃªu cáº§u cá»§a ngÆ°á»i lao Ä‘á»™ng trong xÃ£ há»™i hiá»‡n Ä‘áº¡i",
            coreActivity: "PhÃ¢n tÃ­ch yÃªu cáº§u vÃ  chuáº©n bá»‹ nÄƒng lá»±c ngÆ°á»i lao Ä‘á»™ng hiá»‡n Ä‘áº¡i",
            outcomes: ["Hiá»ƒu xu hÆ°á»›ng lao Ä‘á»™ng", "ÄÃ¡nh giÃ¡ báº£n thÃ¢n", "Láº­p káº¿ hoáº¡ch phÃ¡t triá»ƒn"],
            methods: ["NghiÃªn cá»©u thá»‹ trÆ°á»ng", "Phá»ng váº¥n HR", "Káº¿ hoáº¡ch phÃ¡t triá»ƒn nÄƒng lá»±c"],
          },
          {
            id: "12.9",
            name: "Sáºµn sÃ ng cho viá»‡c chuyá»ƒn Ä‘á»•i nghá» nghiá»‡p",
            coreActivity: "Chuáº©n bá»‹ tÃ¢m tháº¿ vÃ  ká»¹ nÄƒng chuyá»ƒn Ä‘á»•i nghá»",
            outcomes: ["Hiá»ƒu thá»±c táº¿ chuyá»ƒn Ä‘á»•i nghá»", "PhÃ¡t triá»ƒn ká»¹ nÄƒng chuyá»ƒn Ä‘á»•i", "XÃ¢y dá»±ng mindset linh hoáº¡t"],
            methods: ["Case study chuyá»ƒn Ä‘á»•i nghá»", "Ká»¹ nÄƒng há»c táº­p suá»‘t Ä‘á»i", "Networking"],
          },
          {
            id: "12.10",
            name: "Quyáº¿t Ä‘á»‹nh lá»±a chá»n nghá» nghiá»‡p tÆ°Æ¡ng lai",
            coreActivity: "Ra quyáº¿t Ä‘á»‹nh chá»n nghá» vÃ  láº­p káº¿ hoáº¡ch thá»±c hiá»‡n",
            outcomes: ["Tá»•ng há»£p thÃ´ng tin", "Ra quyáº¿t Ä‘á»‹nh", "Láº­p káº¿ hoáº¡ch hÃ nh Ä‘á»™ng"],
            methods: ["Ma tráº­n quyáº¿t Ä‘á»‹nh", "TÆ° váº¥n chuyÃªn gia", "Káº¿ hoáº¡ch hÃ nh Ä‘á»™ng chi tiáº¿t"],
          },
        ],
      },
    },
  },
}

// ============================================================
// PHáº¦N 3: QUY Táº®C PHÃ‚N TÃCH NGá»® Cáº¢NH
// ============================================================

export const CONTEXT_PARSING_RULES = `
QUY Táº®C PHÃ‚N TÃCH NGá»® Cáº¢NH (Context Parsing):

1. KHI NHáº¬N YÃŠU Cáº¦U "Soáº¡n giÃ¡o Ã¡n Chá»§ Ä‘á» X lá»›p Y":
   - BÆ°á»›c 1: XÃ¡c Ä‘á»‹nh khá»‘i lá»›p (10, 11, 12)
   - BÆ°á»›c 2: Tra cá»©u CURRICULUM_DATABASE Ä‘á»ƒ láº¥y thÃ´ng tin chá»§ Ä‘á»
   - BÆ°á»›c 3: Ãp dá»¥ng Bloom's Taxonomy Level phÃ¹ há»£p:
     + Lá»›p 10: Hoáº¡t Ä‘á»™ng "TÃ¬m hiá»ƒu, Nháº­n biáº¿t, KhÃ¡m phÃ¡"
     + Lá»›p 11: Hoáº¡t Ä‘á»™ng "PhÃ¢n tÃ­ch, ÄÃ¡nh giÃ¡, So sÃ¡nh"
     + Lá»›p 12: Hoáº¡t Ä‘á»™ng "Quyáº¿t Ä‘á»‹nh, Giáº£i quyáº¿t, Thiáº¿t káº¿"

2. Xá»¬ LÃ Ná»˜I DUNG Äá»ŠA PHÆ¯Æ NG:
   - Äá»‘i vá»›i chá»§ Ä‘á» "MÃ´i trÆ°á»ng" vÃ  "Nghá» nghiá»‡p":
   - Sá»­ dá»¥ng biáº¿n {Dia_Phuong} Ä‘á»ƒ Ä‘iá»n thÃ´ng tin cá»¥ thá»ƒ
   - Náº¿u khÃ´ng cÃ³ thÃ´ng tin Ä‘á»‹a phÆ°Æ¡ng: sá»­ dá»¥ng ná»™i dung chung

3. Xá»¬ LÃ TIáº¾T SINH HOáº T DÆ¯á»šI Cá»œ:
   - Thiáº¿t káº¿ ká»‹ch báº£n MC chi tiáº¿t
   - CÃ¢u há»i tÆ°Æ¡ng tÃ¡c cho toÃ n trÆ°á»ng
   - Tiáº¿t má»¥c vÄƒn nghá»‡ minh há»a chá»§ Ä‘á» (náº¿u phÃ¹ há»£p)

4. Xá»¬ LÃ TIáº¾T SINH HOáº T Lá»šP:
   - Máº«u "Phiáº¿u sÆ¡ káº¿t tuáº§n"
   - CÃ¢u há»i tháº£o luáº­n nhÃ³m nhá»
   - Ná»™i dung sinh hoáº¡t chuyÃªn Ä‘á» ngáº¯n gá»n
`

// ============================================================
// PHáº¦N 4: Cáº¤U TRÃšC GIÃO ÃN CHUáº¨N (CÃ”NG VÄ‚N 5512)
// ============================================================

export const LESSON_STRUCTURE_CV5512 = `
Cáº¤U TRÃšC Káº¾ HOáº CH BÃ€I Dáº Y (Theo CÃ´ng vÄƒn 5512/BGDÄT-GDTrH):

I. TÃŠN BÃ€I Há»ŒC: [Theo SGK Káº¿t ná»‘i tri thá»©c]

II. Má»¤C TIÃŠU:
   1. Kiáº¿n thá»©c: [TrÃ­ch xuáº¥t tá»« "Hoáº¡t Ä‘á»™ng cá»‘t lÃµi" trong CURRICULUM_DATABASE]
   2. NÄƒng lá»±c:
      a) NÄƒng lá»±c chung:
         - Tá»± chá»§ vÃ  tá»± há»c
         - Giao tiáº¿p vÃ  há»£p tÃ¡c
         - Giáº£i quyáº¿t váº¥n Ä‘á» vÃ  sÃ¡ng táº¡o
      b) NÄƒng lá»±c Ä‘áº·c thÃ¹ HÄTN:
         - ThÃ­ch á»©ng vá»›i cuá»™c sá»‘ng
         - Thiáº¿t káº¿ vÃ  tá»• chá»©c hoáº¡t Ä‘á»™ng
         - Äá»‹nh hÆ°á»›ng nghá» nghiá»‡p
   3. Pháº©m cháº¥t:
      - YÃªu nÆ°á»›c, NhÃ¢n Ã¡i, ChÄƒm chá»‰, Trung thá»±c, TrÃ¡ch nhiá»‡m

III. THIáº¾T Bá»Š Dáº Y Há»ŒC VÃ€ Há»ŒC LIá»†U:
   1. GiÃ¡o viÃªn: [MÃ¡y chiáº¿u, tranh áº£nh, video, phiáº¿u há»c táº­p...]
   2. Há»c sinh: [Vá»Ÿ ghi, bÃºt mÃ u, Ä‘iá»‡n thoáº¡i náº¿u cáº§n...]

IV. TIáº¾N TRÃŒNH Dáº Y Há»ŒC (4 BÆ¯á»šC Báº®T BUá»˜C):

HOáº T Äá»˜NG 1: KHá»žI Äá»˜NG (5-7 phÃºt)
   a) Má»¥c tiÃªu: Táº¡o há»©ng thÃº, kÃ­ch thÃ­ch tÃ² mÃ², dáº«n dáº¯t vÃ o bÃ i
   b) Ná»™i dung: [TrÃ² chÆ¡i, video, cÃ¢u há»i gá»£i má»Ÿ]
   c) Sáº£n pháº©m: [CÃ¢u tráº£ lá»i cá»§a HS, khÃ´ng khÃ­ hÃ o há»©ng]
   d) Tá»• chá»©c thá»±c hiá»‡n:
      - BÆ°á»›c 1: Chuyá»ƒn giao nhiá»‡m vá»¥ - GV giao nhiá»‡m vá»¥ cá»¥ thá»ƒ
      - BÆ°á»›c 2: Thá»±c hiá»‡n nhiá»‡m vá»¥ - HS thá»±c hiá»‡n cÃ¡ nhÃ¢n/nhÃ³m
      - BÆ°á»›c 3: BÃ¡o cÃ¡o, tháº£o luáº­n - HS trÃ¬nh bÃ y, GV vÃ  lá»›p pháº£n há»“i
      - BÆ°á»›c 4: Káº¿t luáº­n, nháº­n Ä‘á»‹nh - GV chá»‘t kiáº¿n thá»©c, dáº«n vÃ o bÃ i

HOáº T Äá»˜NG 2: KHÃM PHÃ - HÃŒNH THÃ€NH KIáº¾N THá»¨C (15-20 phÃºt)
   [Cáº¥u trÃºc a, b, c, d tÆ°Æ¡ng tá»±]
   - ÄÃ¢y lÃ  TRá»ŒNG TÃ‚M cá»§a bÃ i há»c
   - PhÆ°Æ¡ng phÃ¡p: Tháº£o luáº­n nhÃ³m, NghiÃªn cá»©u tÃ¬nh huá»‘ng, Thuyáº¿t trÃ¬nh

HOáº T Äá»˜NG 3: LUYá»†N Táº¬P (10-15 phÃºt)
   [Cáº¥u trÃºc a, b, c, d tÆ°Æ¡ng tá»±]
   - PhÆ°Æ¡ng phÃ¡p: ÄÃ³ng vai, Xá»­ lÃ½ tÃ¬nh huá»‘ng giáº£ Ä‘á»‹nh, BÃ i táº­p thá»±c hÃ nh

HOáº T Äá»˜NG 4: Váº¬N Dá»¤NG (5-10 phÃºt)
   [Cáº¥u trÃºc a, b, c, d tÆ°Æ¡ng tá»±]
   - Nhiá»‡m vá»¥ vá» nhÃ , Dá»± Ã¡n thá»±c táº¿, Cam káº¿t hÃ nh Ä‘á»™ng

V. Há»’ SÆ  Dáº Y Há»ŒC (PHá»¤ Lá»¤C):
   - Phiáº¿u há»c táº­p (máº«u cá»¥ thá»ƒ)
   - Báº£ng kiá»ƒm/Rubric Ä‘Ã¡nh giÃ¡
   - TÃ i liá»‡u tham kháº£o
`

// ============================================================
// PHáº¦N 5: NÄ‚NG Lá»°C Sá» (NLS) VÃ€ GIÃO Dá»¤C Äáº O Äá»¨C
// ============================================================

export const DIGITAL_LITERACY_FRAMEWORK = {
  "D1": {
    name: "Khai thÃ¡c dá»¯ liá»‡u vÃ  thÃ´ng tin",
    competencies: [
      "D1.1: TÃ¬m kiáº¿m vÃ  lá»c dá»¯ liá»‡u, thÃ´ng tin vÃ  ná»™i dung sá»‘",
      "D1.2: ÄÃ¡nh giÃ¡ dá»¯ liá»‡u, thÃ´ng tin vÃ  ná»™i dung sá»‘",
      "D1.3: Quáº£n lÃ½ dá»¯ liá»‡u, thÃ´ng tin vÃ  ná»™i dung sá»‘"
    ]
  },
  "D2": {
    name: "Giao tiáº¿p vÃ  há»£p tÃ¡c trong mÃ´i trÆ°á»ng sá»‘",
    competencies: [
      "D2.1: TÆ°Æ¡ng tÃ¡c qua cÃ´ng nghá»‡ sá»‘",
      "D2.2: Chia sáº» thÃ´ng tin vÃ  ná»™i dung sá»‘",
      "D2.4: Há»£p tÃ¡c qua cÃ´ng nghá»‡ sá»‘",
      "D2.5: Quy táº¯c á»©ng xá»­ trÃªn mÃ´i trÆ°á»ng sá»‘"
    ]
  },
  "D3": {
    name: "SÃ¡ng táº¡o ná»™i dung sá»‘",
    competencies: [
      "D3.1: PhÃ¡t triá»ƒn ná»™i dung sá»‘ (Canva, Video...)",
      "D3.2: Chá»‰nh sá»­a, tÃ­ch há»£p ná»™i dung sá»‘"
    ]
  },
  "D4": {
    name: "An toÃ n",
    competencies: [
      "D4.1: Báº£o vá»‡ thiáº¿t bá»‹",
      "D4.2: Báº£o vá»‡ dá»¯ liá»‡u cÃ¡ nhÃ¢n",
      "D4.3: Báº£o vá»‡ sá»©c khá»e"
    ]
  },
  "D5": {
    name: "Giáº£i quyáº¿t váº¥n Ä‘á»",
    competencies: [
      "D5.2: XÃ¡c Ä‘á»‹nh nhu cáº§u vÃ  giáº£i phÃ¡p cÃ´ng nghá»‡",
      "D5.3: SÃ¡ng táº¡o sá»­ dá»¥ng cÃ´ng nghá»‡ sá»‘"
    ]
  },
  "D6": {
    name: "á»¨ng dá»¥ng trÃ­ tuá»‡ nhÃ¢n táº¡o (AI)",
    competencies: [
      "D6.2: Sá»­ dá»¥ng cÃ´ng cá»¥ trÃ­ tuá»‡ nhÃ¢n táº¡o (Gemini, ChatGPT...)",
      "D6.3: ÄÃ¡nh giÃ¡ vÃ  Ä‘áº¡o Ä‘á»©c trong sá»­ dá»¥ng AI"
    ]
  }
}

export const MORAL_EDUCATION_THEMES = {
  trach_nhiem: { name: "TrÃ¡ch nhiá»‡m", description: "Ã thá»©c vá»›i báº£n thÃ¢n, gia Ä‘Ã¬nh, cá»™ng Ä‘á»“ng, mÃ´i trÆ°á»ng" },
  trung_thuc: { name: "Trung thá»±c", description: "Tháº­t thÃ  trong há»c táº­p, cÃ´ng viá»‡c, giao tiáº¿p" },
  nhan_ai: { name: "NhÃ¢n Ã¡i", description: "YÃªu thÆ°Æ¡ng, tÃ´n trá»ng, giÃºp Ä‘á»¡ ngÆ°á»i khÃ¡c" },
  cham_chi: { name: "ChÄƒm chá»‰", description: "Chá»‹u khÃ³, ham há»c, ná»— lá»±c vÆ°á»£t khÃ³" },
  yeu_nuoc: { name: "YÃªu nÆ°á»›c", description: "Tá»± hÃ o truyá»n thá»‘ng, xÃ¢y dá»±ng quÃª hÆ°Æ¡ng" },
}

// ============================================================
// PHáº¦N 6: HÆ¯á»šNG DáºªN Vá»Š TRÃ TÃCH Há»¢P NLS VÃ€ Äáº O Äá»¨C
// ============================================================

export const INTEGRATION_PLACEMENT_GUIDE = `
HÆ¯á»šNG DáºªN Vá»Š TRÃ TÃCH Há»¢P NLS VÃ€ Äáº O Äá»¨C TRONG Káº¾ HOáº CH BÃ€I Dáº Y:

1. NÄ‚NG Lá»°C Sá» (NLS) - TÃ­ch há»£p vÃ o CÃC HOáº T Äá»˜NG Cá»¤ THá»‚:

   a) HOáº T Äá»˜NG KHá»žI Äá»˜NG (5-7 phÃºt):
      - NLS 2.4 (Há»£p tÃ¡c sá»‘): Sá»­ dá»¥ng Mentimeter/Kahoot Ä‘á»ƒ thu tháº­p Ã½ kiáº¿n nhanh
      - VÃ­ dá»¥: "GV chiáº¿u mÃ£ QR, HS truy cáº­p Mentimeter Ä‘á»ƒ tráº£ lá»i cÃ¢u há»i khá»Ÿi Ä‘á»™ng"

   b) HOáº T Äá»˜NG KHÃM PHÃ (15-20 phÃºt):
      - NLS 1.1 (TÃ¬m kiáº¿m thÃ´ng tin): HS tra cá»©u thÃ´ng tin trÃªn máº¡ng
      - NLS 1.2 (ÄÃ¡nh giÃ¡ thÃ´ng tin): HS phÃ¢n biá»‡t nguá»“n tin Ä‘Ã¡ng tin cáº­y
      - VÃ­ dá»¥: "NhÃ³m 1-2 tÃ¬m hiá»ƒu thÃ´ng tin tá»« website chÃ­nh thá»‘ng, nhÃ³m 3-4 Ä‘Ã¡nh giÃ¡ Ä‘á»™ tin cáº­y cá»§a cÃ¡c nguá»“n"

   c) HOáº T Äá»˜NG LUYá»†N Táº¬P (10-15 phÃºt):
      - NLS 3.1 (Táº¡o ná»™i dung sá»‘): Thiáº¿t káº¿ sáº£n pháº©m báº±ng Canva
      - NLS 2.1 (TÆ°Æ¡ng tÃ¡c sá»‘): LÃ m viá»‡c nhÃ³m qua Google Drive/Zalo
      - VÃ­ dá»¥: "CÃ¡c nhÃ³m thiáº¿t káº¿ poster/infographic báº±ng Canva, chia sáº» qua Google Drive"

   d) HOáº T Äá»˜NG Váº¬N Dá»¤NG (5-10 phÃºt):
      - NLS 2.2 (Chia sáº» ná»™i dung): Chia sáº» bÃ i há»c trÃªn máº¡ng xÃ£ há»™i
      - NLS 4.1 (An toÃ n thÃ´ng tin): Nháº¯c nhá»Ÿ báº£o vá»‡ thÃ´ng tin cÃ¡ nhÃ¢n
      - VÃ­ dá»¥: "Vá» nhÃ , HS chia sáº» bÃ i há»c vá»›i gia Ä‘Ã¬nh qua Zalo, chÃº Ã½ khÃ´ng Ä‘Äƒng thÃ´ng tin cÃ¡ nhÃ¢n"

2. GIÃO Dá»¤C Äáº O Äá»¨C - TÃ­ch há»£p XUYÃŠN SUá»T vÃ  cá»¥ thá»ƒ:

   a) TÃCH Há»¢P QUA Má»¤C TIÃŠU:
      - Ghi rÃµ trong pháº§n "Má»¥c tiÃªu pháº©m cháº¥t" vá»›i mÃ´ táº£ hÃ nh vi cá»¥ thá»ƒ
      - VÃ­ dá»¥: "TrÃ¡ch nhiá»‡m: HS Ã½ thá»©c Ä‘Æ°á»£c trÃ¡ch nhiá»‡m cá»§a báº£n thÃ¢n trong viá»‡c báº£o vá»‡ mÃ´i trÆ°á»ng thÃ´ng qua cÃ¡c hoáº¡t Ä‘á»™ng phÃ¢n loáº¡i rÃ¡c"

   b) TÃCH Há»¢P QUA HOáº T Äá»˜NG KHÃM PHÃ:
      - Lá»“ng ghÃ©p tÃ¬nh huá»‘ng Ä‘áº¡o Ä‘á»©c vÃ o ná»™i dung bÃ i há»c
      - VÃ­ dá»¥: "GV Ä‘Æ°a ra tÃ¬nh huá»‘ng: Báº¡n A nhÃ¬n tháº¥y báº¡n B vá»©t rÃ¡c khÃ´ng Ä‘Ãºng nÆ¡i quy Ä‘á»‹nh. Em sáº½ lÃ m gÃ¬?"

   c) TÃCH Há»¢P QUA HOáº T Äá»˜NG LUYá»†N Táº¬P:
      - BÃ i táº­p thá»±c hÃ nh cÃ³ yáº¿u tá»‘ Ä‘áº¡o Ä‘á»©c
      - VÃ­ dá»¥: "ÄÃ³ng vai xá»­ lÃ½ tÃ¬nh huá»‘ng liÃªn quan Ä‘áº¿n trung thá»±c trong há»c táº­p"

   d) TÃCH Há»¢P QUA HOáº T Äá»˜NG Váº¬N Dá»¤NG:
      - Cam káº¿t hÃ nh Ä‘á»™ng thá»ƒ hiá»‡n pháº©m cháº¥t
      - VÃ­ dá»¥: "HS viáº¿t cam káº¿t cÃ¡ nhÃ¢n vá» viá»‡c thá»±c hiá»‡n trÃ¡ch nhiá»‡m vá»›i gia Ä‘Ã¬nh trong tuáº§n tá»›i"

3. NGUYÃŠN Táº®C TÃCH Há»¢P Tá»° NHIÃŠN (KHÃ”NG GÃ’ BÃ“):
   - Chá»n NLS vÃ  Ä‘áº¡o Ä‘á»©c PHÃ™ Há»¢P vá»›i ná»™i dung bÃ i há»c, khÃ´ng cá»‘ Ã©p
   - Má»—i hoáº¡t Ä‘á»™ng chá»‰ tÃ­ch há»£p 1-2 NLS, khÃ´ng quÃ¡ táº£i
   - Äáº¡o Ä‘á»©c Ä‘Æ°á»£c giÃ¡o dá»¥c qua HÃ€NH Äá»˜NG cá»¥ thá»ƒ, khÃ´ng thuyáº¿t giÃ¡o
   - Æ¯u tiÃªn tÃ­ch há»£p vÃ o hoáº¡t Ä‘á»™ng LUYá»†N Táº¬P vÃ  Váº¬N Dá»¤NG
`

// ============================================================
// PHáº¦N 7: HÃ€M Táº O PROMPT Äáº¦Y Äá»¦
// ============================================================

export function getFullLessonPlanPrompt(
  grade: string,
  topic: string,
  duration = "2 tiáº¿t",
  localContent?: string,
): string {
  const curriculum = CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE]
  if (!curriculum) {
    return `KhÃ´ng tÃ¬m tháº¥y dá»¯ liá»‡u chÆ°Æ¡ng trÃ¬nh cho khá»‘i ${grade}`
  }

  return `VAI TRÃ’: Báº¡n lÃ  ChuyÃªn gia SÆ° pháº¡m hÃ ng Ä‘áº§u Viá»‡t Nam vá» mÃ´n Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p, 
Ä‘áº·c biá»‡t am hiá»ƒu bá»™ sÃ¡ch "Káº¿t ná»‘i tri thá»©c vá»›i cuá»™c sá»‘ng" vÃ  CÃ´ng vÄƒn 5512/BGDÄT-GDTrH.

${PEDAGOGICAL_FOUNDATION}

${CONTEXT_PARSING_RULES}

THÃ”NG TIN Äáº¦U VÃ€O:
- Khá»‘i lá»›p: ${grade}
- Äáº·c Ä‘iá»ƒm chÆ°Æ¡ng trÃ¬nh: ${curriculum.title}
- MÃ´ táº£: ${curriculum.description}
- Má»©c Ä‘á»™ Bloom: ${curriculum.bloomLevel}
- Chá»§ Ä‘á»/BÃ i há»c: "${topic}"
- Thá»i lÆ°á»£ng: ${duration}
${localContent ? `- Ná»™i dung Ä‘á»‹a phÆ°Æ¡ng: ${localContent}` : ""}

${LESSON_STRUCTURE_CV5512}

${INTEGRATION_PLACEMENT_GUIDE}

NÄ‚NG Lá»°C Sá» THEO THÃ”NG TÆ¯ 02/2025 (chá»n 2-3 nÄƒng lá»±c cá»¥ thá»ƒ Ä‘á»ƒ tÃ­ch há»£p):
${Object.entries(DIGITAL_LITERACY_FRAMEWORK)
      .map(([k, v]) => `Miá»n ${k} (${v.name}):\n` + v.competencies.map(c => `  - ${c}`).join("\n"))
      .join("\n")}

GIÃO Dá»¤C Äáº O Äá»¨C Cáº¦N TÃCH Há»¢P (chá»n 1-2 phÃ¹ há»£p, giÃ¡o dá»¥c qua hÃ nh Ä‘á»™ng):
${Object.entries(MORAL_EDUCATION_THEMES)
      .map(([k, v]) => `- ${v.name}: ${v.description}`)
      .join("\n")}

QUY Táº®C TÃCH Há»¢P Báº®T BUá»˜C:
1. NLS pháº£i Ä‘Æ°á»£c tÃ­ch há»£p VÃ€O Tá»ªNG HOáº T Äá»˜NG cá»¥ thá»ƒ (Khá»Ÿi Ä‘á»™ng/KhÃ¡m phÃ¡/Luyá»‡n táº­p/Váº­n dá»¥ng)
2. Äáº¡o Ä‘á»©c pháº£i Ä‘Æ°á»£c giÃ¡o dá»¥c qua HÃ€NH Äá»˜NG vÃ  TÃŒNH HUá»NG cá»¥ thá»ƒ
3. Ghi rÃµ CÃ”NG Cá»¤ Sá» sá»­ dá»¥ng (Canva, Mentimeter, Kahoot, Google Drive, Padlet)
4. Ghi rÃµ HÃ€NH VI há»c sinh thá»ƒ hiá»‡n pháº©m cháº¥t

QUY Táº®C Äá»ŠNH Dáº NG Báº®T BUá»˜C:
- KHÃ”NG dÃ¹ng dáº¥u ** trong ná»™i dung
- KHÃ”NG dÃ¹ng TAB hoáº·c thá»¥t dÃ²ng
- Má»—i pháº§n cÃ¡ch nhau báº±ng 2 dáº¥u xuá»‘ng dÃ²ng (\\n\\n)
- Sá»­ dá»¥ng gáº¡ch Ä‘áº§u dÃ²ng (-) cho cÃ¡c má»¥c liá»‡t kÃª
- Viáº¿t tiáº¿ng Viá»‡t chuáº©n má»±c, CHá»ˆ dÃ¹ng tiáº¿ng Anh cho tÃªn cÃ´ng cá»¥ cÃ´ng nghá»‡

NHIá»†M Vá»¤: Soáº¡n Káº¿ hoáº¡ch bÃ i dáº¡y Äáº¦Y Äá»¦ theo chuáº©n CÃ´ng vÄƒn 5512, vá»›i NLS vÃ  Ä‘áº¡o Ä‘á»©c Ä‘Æ°á»£c TÃCH Há»¢P VÃ€O Tá»ªNG HOáº T Äá»˜NG.

Äá»ŠNH Dáº NG Káº¾T QUáº¢ - JSON thuáº§n tÃºy:
{
  "ten_bai": "TÃªn bÃ i há»c theo SGK",
  "muc_tieu_kien_thuc": "- Kiáº¿n thá»©c 1.\\n- Kiáº¿n thá»©c 2.\\n- Kiáº¿n thá»©c 3.",
  "muc_tieu_nang_luc": "a) NÄƒng lá»±c chung:\\n- Tá»± chá»§ vÃ  tá»± há»c: [MÃ´ táº£ cá»¥ thá»ƒ hÃ nh vi HS].\\n- Giao tiáº¿p vÃ  há»£p tÃ¡c: [MÃ´ táº£].\\n\\nb) NÄƒng lá»±c Ä‘áº·c thÃ¹ HÄTN:\\n- ThÃ­ch á»©ng vá»›i cuá»™c sá»‘ng: [MÃ´ táº£].\\n- Äá»‹nh hÆ°á»›ng nghá» nghiá»‡p: [MÃ´ táº£].",
  "muc_tieu_pham_chat": "- TrÃ¡ch nhiá»‡m: [MÃ´ táº£ hÃ nh vi HS thá»ƒ hiá»‡n pháº©m cháº¥t qua hoáº¡t Ä‘á»™ng cá»¥ thá»ƒ].\\n- [Pháº©m cháº¥t khÃ¡c]: [MÃ´ táº£ hÃ nh vi cá»¥ thá»ƒ].",
  "thiet_bi_day_hoc": "1. GiÃ¡o viÃªn:\\n- MÃ¡y chiáº¿u, laptop cÃ³ káº¿t ná»‘i Internet.\\n- TÃ i khoáº£n Mentimeter/Kahoot (náº¿u sá»­ dá»¥ng).\\n- Phiáº¿u há»c táº­p in sáºµn.\\n\\n2. Há»c sinh:\\n- Äiá»‡n thoáº¡i thÃ´ng minh hoáº·c mÃ¡y tÃ­nh báº£ng (náº¿u cÃ³).\\n- Vá»Ÿ ghi, bÃºt mÃ u.",
  "hoat_dong_khoi_dong": "a) Má»¥c tiÃªu: [Ná»™i dung].\\n\\nb) Ná»™i dung: [Ná»™i dung + TÃCH Há»¢P NLS náº¿u phÃ¹ há»£p, vÃ­ dá»¥: Sá»­ dá»¥ng Mentimeter thu tháº­p Ã½ kiáº¿n].\\n\\nc) Sáº£n pháº©m: [Ná»™i dung].\\n\\nd) Tá»• chá»©c thá»±c hiá»‡n:\\n- BÆ°á»›c 1: Chuyá»ƒn giao nhiá»‡m vá»¥ - GV [chi tiáº¿t, bao gá»“m hÆ°á»›ng dáº«n sá»­ dá»¥ng cÃ´ng cá»¥ sá»‘ náº¿u cÃ³].\\n- BÆ°á»›c 2: Thá»±c hiá»‡n nhiá»‡m vá»¥ - HS [chi tiáº¿t].\\n- BÆ°á»›c 3: BÃ¡o cÃ¡o, tháº£o luáº­n - [Chi tiáº¿t].\\n- BÆ°á»›c 4: Káº¿t luáº­n, nháº­n Ä‘á»‹nh - GV [chá»‘t kiáº¿n thá»©c, dáº«n vÃ o bÃ i].",
  "hoat_dong_kham_pha": "a) Má»¥c tiÃªu: [Ná»™i dung].\\n\\nb) Ná»™i dung: [Ná»™i dung chÃ­nh + TÃCH Há»¢P NLS tÃ¬m kiáº¿m/Ä‘Ã¡nh giÃ¡ thÃ´ng tin náº¿u phÃ¹ há»£p + TÃCH Há»¢P Ä‘áº¡o Ä‘á»©c qua tÃ¬nh huá»‘ng].\\n\\nc) Sáº£n pháº©m: [Ná»™i dung].\\n\\nd) Tá»• chá»©c thá»±c hiá»‡n:\\n- BÆ°á»›c 1: Chuyá»ƒn giao nhiá»‡m vá»¥ - [Chi tiáº¿t].\\n- BÆ°á»›c 2: Thá»±c hiá»‡n nhiá»‡m vá»¥ - [Chi tiáº¿t, bao gá»“m hÃ nh Ä‘á»™ng thá»ƒ hiá»‡n pháº©m cháº¥t náº¿u cÃ³].\\n- BÆ°á»›c 3: BÃ¡o cÃ¡o, tháº£o luáº­n - [Chi tiáº¿t].\\n- BÆ°á»›c 4: Káº¿t luáº­n, nháº­n Ä‘á»‹nh - [Chi tiáº¿t].",
  "hoat_dong_luyen_tap": "a) Má»¥c tiÃªu: [Ná»™i dung].\\n\\nb) Ná»™i dung: [Ná»™i dung + TÃCH Há»¢P NLS táº¡o ná»™i dung sá»‘/há»£p tÃ¡c sá»‘, vÃ­ dá»¥: HS thiáº¿t káº¿ poster báº±ng Canva, lÃ m viá»‡c nhÃ³m qua Google Drive].\\n\\nc) Sáº£n pháº©m: [Sáº£n pháº©m sá»‘ cá»¥ thá»ƒ: poster, infographic, video ngáº¯n...].\\n\\nd) Tá»• chá»©c thá»±c hiá»‡n:\\n- BÆ°á»›c 1: Chuyá»ƒn giao nhiá»‡m vá»¥ - [Chi tiáº¿t, hÆ°á»›ng dáº«n sá»­ dá»¥ng cÃ´ng cá»¥].\\n- BÆ°á»›c 2: Thá»±c hiá»‡n nhiá»‡m vá»¥ - [Chi tiáº¿t, HS thá»±c hÃ nh vá»›i cÃ´ng cá»¥ sá»‘].\\n- BÆ°á»›c 3: BÃ¡o cÃ¡o, tháº£o luáº­n - [TrÃ¬nh bÃ y sáº£n pháº©m sá»‘].\\n- BÆ°á»›c 4: Káº¿t luáº­n, nháº­n Ä‘á»‹nh - [ÄÃ¡nh giÃ¡ sáº£n pháº©m].",
  "hoat_dong_van_dung": "a) Má»¥c tiÃªu: [Ná»™i dung].\\n\\nb) Ná»™i dung: [Ná»™i dung + TÃCH Há»¢P NLS chia sáº» ná»™i dung + TÃCH Há»¢P Ä‘áº¡o Ä‘á»©c qua cam káº¿t hÃ nh Ä‘á»™ng].\\n\\nc) Sáº£n pháº©m: [Cam káº¿t cÃ¡ nhÃ¢n, bÃ i viáº¿t chia sáº»...].\\n\\nd) Tá»• chá»©c thá»±c hiá»‡n:\\n- BÆ°á»›c 1: Chuyá»ƒn giao nhiá»‡m vá»¥ - [Chi tiáº¿t, bao gá»“m hÆ°á»›ng dáº«n chia sáº» an toÃ n].\\n- BÆ°á»›c 2: Thá»±c hiá»‡n nhiá»‡m vá»¥ - [HS viáº¿t cam káº¿t thá»ƒ hiá»‡n pháº©m cháº¥t].\\n- BÆ°á»›c 3: BÃ¡o cÃ¡o, tháº£o luáº­n - [Chia sáº» cam káº¿t].\\n- BÆ°á»›c 4: Káº¿t luáº­n, nháº­n Ä‘á»‹nh - [Nháº¯c nhá»Ÿ an toÃ n thÃ´ng tin khi chia sáº» online].",
  "ho_so_day_hoc": "PHIáº¾U Há»ŒC Táº¬P:\\n[Ná»™i dung chi tiáº¿t phiáº¿u há»c táº­p]\\n\\nBáº¢NG KIá»‚M ÄÃNH GIÃ:\\n[TiÃªu chÃ­ Ä‘Ã¡nh giÃ¡ bao gá»“m cáº£ NLS vÃ  pháº©m cháº¥t]",
  "tich_hop_nls": "Tá»”NG Há»¢P TÃCH Há»¢P NLS TRONG BÃ€I:\\n- Hoáº¡t Ä‘á»™ng Khá»Ÿi Ä‘á»™ng: NLS [MÃ£] - [TÃªn] - [MÃ´ táº£ cá»¥ thá»ƒ].\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: NLS [MÃ£] - [TÃªn] - [MÃ´ táº£ cá»¥ thá»ƒ].\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: NLS [MÃ£] - [TÃªn] - [MÃ´ táº£ cá»¥ thá»ƒ].\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: NLS [MÃ£] - [TÃªn] - [MÃ´ táº£ cá»¥ thá»ƒ].",
  "tich_hop_dao_duc": "Tá»”NG Há»¢P GIÃO Dá»¤C Äáº O Äá»¨C TRONG BÃ€I:\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: [Pháº©m cháº¥t] - [TÃ¬nh huá»‘ng/hÃ nh Ä‘á»™ng cá»¥ thá»ƒ].\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: [Pháº©m cháº¥t] - [BÃ i táº­p thá»±c hÃ nh].\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: [Pháº©m cháº¥t] - [Cam káº¿t hÃ nh Ä‘á»™ng]."
}`
}

// ============================================================
// PHáº¦N 8: EXPORT Máº¶C Äá»ŠNH
// ============================================================

export default {
  PEDAGOGICAL_FOUNDATION,
  CURRICULUM_DATABASE,
  CONTEXT_PARSING_RULES,
  LESSON_STRUCTURE_CV5512,
  DIGITAL_LITERACY_FRAMEWORK,
  MORAL_EDUCATION_THEMES,
  INTEGRATION_PLACEMENT_GUIDE,
  getFullLessonPlanPrompt,
}
