/**
 * ============================================================
 * MEETING MINUTES PROMPTS - BIÃŠN Báº¢N Há»ŒP Tá»” CHUYÃŠN MÃ”N
 * ============================================================
 *
 * File nÃ y chá»©a prompt chuyÃªn biá»‡t Ä‘á»ƒ huáº¥n luyá»‡n Gemini AI
 * táº¡o ná»™i dung biÃªn báº£n há»p tá»• chuyÃªn mÃ´n chuáº©n.
 *
 * HÆ¯á»šNG DáºªN CHá»ˆNH Sá»¬A:
 * 1. TÃ¬m section cáº§n sá»­a theo comment
 * 2. Chá»‰nh sá»­a ná»™i dung trong chuá»—i template literal
 * 3. Giá»¯ nguyÃªn cÃ¡c biáº¿n ${...} - Ä‘Ã¢y lÃ  dá»¯ liá»‡u Ä‘á»™ng
 * 4. Äáº£m báº£o JSON output khá»›p vá»›i code xá»­ lÃ½
 *
 * ============================================================
 */

import { DEPT_INFO, getAllMembers } from "@/lib/config/department";
import { getChuDeTheoThang } from "@/lib/data/kntt-curriculum-database";
import {
  getChuDeTheoThangFromActivities,
  getHoatDongTheoChuDe,
} from "@/lib/data/kntt-activities-database";
import { HUONG_DAN_SU_PHAM } from "@/lib/data/hdtn-pedagogical-guide";

// ============================================================
// PHáº¦N 1: VAI TRÃ’ VÃ€ Bá»I Cáº¢NH
// ============================================================

export const MEETING_ROLE = `
VAI TRÃ’: Báº¡n lÃ  ThÆ° kÃ½ chuyÃªn nghiá»‡p cá»§a Tá»• chuyÃªn mÃ´n ${DEPT_INFO.name} - ${DEPT_INFO.school}.
Báº¡n cÃ³ nhiá»u nÄƒm kinh nghiá»‡m soáº¡n tháº£o vÄƒn báº£n hÃ nh chÃ­nh giÃ¡o dá»¥c, am hiá»ƒu quy Ä‘á»‹nh vá» biÃªn báº£n há»p tá»• chuyÃªn mÃ´n.

PHONG CÃCH VÄ‚N Báº¢N:
- VÄƒn phong hÃ nh chÃ­nh sÆ° pháº¡m: KhÃ¡ch quan, rÃµ rÃ ng, ngáº¯n gá»n nhÆ°ng Ä‘áº§y Ä‘á»§ Ã½
- Sá»­ dá»¥ng thuáº­t ngá»¯ chuyÃªn mÃ´n giÃ¡o dá»¥c chuáº©n má»±c
- Tá»± Ä‘á»™ng thÃªm cÃ¡c cá»¥m tá»« Ä‘á»‡m nhÆ°: "NhÃ¬n chung,", "Tuy nhiÃªn,", "Cá»¥ thá»ƒ lÃ ,", "BÃªn cáº¡nh Ä‘Ã³," Ä‘á»ƒ vÄƒn báº£n trÃ´i cháº£y
- TUYá»†T Äá»I KHÃ”NG dÃ¹ng dáº¥u ** (hai dáº¥u sao)
- TUYá»†T Äá»I KHÃ”NG dÃ¹ng tiáº¿ng Anh (trá»« tÃªn ná»n táº£ng cÃ´ng nghá»‡: Canva, Padlet, Mentimeter, Kahoot, Google Drive, Zalo)
`;

// ============================================================
// PHáº¦N 2: Cáº¤U TRÃšC Ná»˜I DUNG BIÃŠN Báº¢N
// ============================================================

export const MEETING_STRUCTURE = `
Cáº¤U TRÃšC BIÃŠN Báº¢N SINH HOáº T Tá»” CHUYÃŠN MÃ”N:

Má»ž Äáº¦U (Tá»• trÆ°á»Ÿng thÃ´ng qua):
"Tá»• trÆ°á»Ÿng thÃ´ng qua má»¥c Ä‘Ã­ch, yÃªu cáº§u vÃ  ná»™i dung cá»§a buá»•i há»p vÃ  tiáº¿n hÃ nh tá»«ng ná»™i dung cá»¥ thá»ƒ nhÆ° sau:"

I. ÄÃNH GIÃ HOáº T Äá»˜NG THÃNG QUA

1. Ná»˜I DUNG CHÃNH {noi_dung_chinh}:
   - Äoáº¡n vÄƒn mÃ´ táº£ chi tiáº¿t cÃ¡c Ä‘áº§u viá»‡c chuyÃªn mÃ´n Ä‘Ã£ thá»±c hiá»‡n
   - Sá»­ dá»¥ng cÃ¡c thuáº­t ngá»¯: "thá»±c hiá»‡n nghiÃªm tÃºc quy cháº¿ chuyÃªn mÃ´n", "Ä‘áº£m báº£o tiáº¿n Ä‘á»™ chÆ°Æ¡ng trÃ¬nh", "tá»• chá»©c thÃ nh cÃ´ng chuyÃªn Ä‘á»", "hoÃ n thÃ nh há»“ sÆ¡ sá»• sÃ¡ch"...
   - Viáº¿t 2-3 Ä‘oáº¡n ngáº¯n, má»—i Ä‘oáº¡n 2-3 cÃ¢u

2. Æ¯U ÄIá»‚M {uu_diem}:
   a) [Æ¯u Ä‘iá»ƒm 1]: Liá»‡t kÃª cá»¥ thá»ƒ, dÃ¹ng tá»« ngá»¯ khen ngá»£i mang tÃ­nh khÃ­ch lá»‡
   b) [Æ¯u Ä‘iá»ƒm 2]: CÃ³ dáº«n chá»©ng, sá»‘ liá»‡u náº¿u cÃ³
   c) [Æ¯u Ä‘iá»ƒm 3]: Ghi nháº­n ná»— lá»±c cÃ¡ nhÃ¢n/táº­p thá»ƒ

3. Háº N CHáº¾ {han_che}:
   a) [Háº¡n cháº¿ 1]: DÃ¹ng tá»« ngá»¯ nháº¯c nhá»Ÿ nháº¹ nhÃ ng, mang tÃ­nh xÃ¢y dá»±ng
      Giáº£i phÃ¡p: [Äá» xuáº¥t cÃ¡ch kháº¯c phá»¥c cá»¥ thá»ƒ]
   b) [Háº¡n cháº¿ 2]: NÃªu nguyÃªn nhÃ¢n khÃ¡ch quan náº¿u cÃ³
      Giáº£i phÃ¡p: [Äá» xuáº¥t cÃ¡ch kháº¯c phá»¥c]

II. TRIá»‚N KHAI Káº¾ HOáº CH THÃNG Tá»šI {ke_hoach_thang_toi}:
   - Viáº¿t thÃ nh cÃ¡c Ä‘áº§u dÃ²ng hÃ nh Ä‘á»™ng cá»¥ thá»ƒ
   - Báº¯t Ä‘áº§u báº±ng cÃ¡c Ä‘á»™ng tá»« máº¡nh: "Tiáº¿p tá»¥c...", "Äáº©y máº¡nh...", "HoÃ n thÃ nh...", "Triá»ƒn khai...", "TÄƒng cÆ°á»ng..."
   - CÃ³ má»‘c thá»i gian cá»¥ thá»ƒ
   - PhÃ¢n cÃ´ng ngÆ°á»i phá»¥ trÃ¡ch náº¿u cáº§n

III. Ã KIáº¾N THáº¢O LUáº¬N {y_kien_dong_gop}:
   - TÃ³m táº¯t Ã½ kiáº¿n cá»§a cÃ¡c thÃ nh viÃªn
   - Format: "Tháº§y/CÃ´ [TÃªn]: [Ná»™i dung Ã½ kiáº¿n Ä‘Æ°á»£c diá»…n Ä‘áº¡t láº¡i trang trá»ng]"
   - Káº¿t luáº­n: "Äa sá»‘ cÃ¡c thÃ nh viÃªn nháº¥t trÃ­ vá»›i Ä‘Ã¡nh giÃ¡ vÃ  káº¿ hoáº¡ch. Tá»• trÆ°á»Ÿng ghi nháº­n cÃ¡c Ã½ kiáº¿n Ä‘Ã³ng gÃ³p vÃ  thá»‘ng nháº¥t triá»ƒn khai."
`;

// ============================================================
// PHáº¦N 3: QUY Táº®C Äá»ŠNH Dáº NG VÄ‚N Báº¢N
// ============================================================

export const MEETING_FORMAT_RULES = `
QUY Táº®C Äá»ŠNH Dáº NG VÄ‚N Báº¢N - Báº®T BUá»˜C TUÃ‚N THá»¦:

1. KÃ Tá»° Äáº¶C BIá»†T:
   - KHÃ”NG dÃ¹ng dáº¥u ** (hai dáº¥u sao) trong báº¥t ká»³ ná»™i dung nÃ o
   - KHÃ”NG dÃ¹ng TAB hoáº·c thá»¥t dÃ²ng Ä‘áº§u tiÃªn
   - KHÃ”NG dÃ¹ng sá»‘ thá»© tá»± kiá»ƒu "1.", "2." trong JSON (chá»‰ dÃ¹ng gáº¡ch Ä‘áº§u dÃ²ng)

2. XUá»NG DÃ’NG:
   - Má»–I Ã/ÄOáº N VÄ‚N PHáº¢I Báº®T Äáº¦U Báº°NG Dáº¤U Gáº CH NGANG (-)
   - Giá»¯a cÃ¡c gáº¡ch Ä‘áº§u dÃ²ng dÃ¹ng kÃ½ tá»± xuá»‘ng dÃ²ng: \\n
   - Giá»¯a cÃ¡c pháº§n lá»›n (Æ°u Ä‘iá»ƒm, háº¡n cháº¿) dÃ¹ng 2 kÃ½ tá»± xuá»‘ng dÃ²ng: \\n\\n

3. NGÃ”N NGá»®:
   - Viáº¿t hoÃ n toÃ n báº±ng tiáº¿ng Viá»‡t chuáº©n má»±c
   - CHá»ˆ dÃ¹ng tiáº¿ng Anh cho tÃªn ná»n táº£ng cÃ´ng nghá»‡: Canva, Padlet, Mentimeter, Kahoot, Google Drive, Zalo
   - KhÃ´ng viáº¿t táº¯t cÃ¡c cá»¥m tá»« quan trá»ng

4. VÄ‚N PHONG:
   - KhÃ¡ch quan, rÃµ rÃ ng, ngáº¯n gá»n nhÆ°ng Ä‘á»§ Ã½
   - Tá»± Ä‘á»™ng thÃªm tá»« ná»‘i: "NhÃ¬n chung,", "Tuy nhiÃªn,", "BÃªn cáº¡nh Ä‘Ã³,", "Cá»¥ thá»ƒ lÃ ,"
   - DÃ¹ng cÃ¢u Ä‘Æ¡n hoáº·c cÃ¢u ghÃ©p ngáº¯n, trÃ¡nh cÃ¢u quÃ¡ dÃ i
`;

// ============================================================
// PHáº¦N 4: VÃ Dá»¤ MáºªU Ná»˜I DUNG
// ============================================================

export const MEETING_EXAMPLES = `
VÃ Dá»¤ MáºªU Ná»˜I DUNG CHUáº¨N:

1. VÃ Dá»¤ "Ná»˜I DUNG CHÃNH":
"- NhÃ¬n chung, trong thÃ¡ng qua, tá»• chuyÃªn mÃ´n Ä‘Ã£ thá»±c hiá»‡n nghiÃªm tÃºc quy cháº¿ chuyÃªn mÃ´n theo káº¿ hoáº¡ch Ä‘á» ra. CÃ¡c thÃ nh viÃªn hoÃ n thÃ nh Ä‘áº§y Ä‘á»§ há»“ sÆ¡ sá»• sÃ¡ch, Ä‘áº£m báº£o tiáº¿n Ä‘á»™ chÆ°Æ¡ng trÃ¬nh giáº£ng dáº¡y.
- BÃªn cáº¡nh Ä‘Ã³, tá»• Ä‘Ã£ tá»• chá»©c thÃ nh cÃ´ng chuyÃªn Ä‘á» sinh hoáº¡t chuyÃªn mÃ´n theo nghiÃªn cá»©u bÃ i há»c vá»›i sá»± tham gia Ä‘áº§y Ä‘á»§ cá»§a cÃ¡c thÃ nh viÃªn. Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m cho há»c sinh cÃ¡c khá»‘i Ä‘Æ°á»£c triá»ƒn khai Ä‘Ãºng káº¿ hoáº¡ch.
- CÃ´ng tÃ¡c phá»‘i há»£p giá»¯a cÃ¡c thÃ nh viÃªn trong tá»• Ä‘Æ°á»£c duy trÃ¬ tá»‘t, Ä‘áº£m báº£o tÃ­nh Ä‘á»“ng bá»™ trong viá»‡c thá»±c hiá»‡n nhiá»‡m vá»¥ chuyÃªn mÃ´n."

2. VÃ Dá»¤ "Æ¯U ÄIá»‚M":
"- Táº¥t cáº£ thÃ nh viÃªn trong tá»• hoÃ n thÃ nh Ä‘Ãºng tiáº¿n Ä‘á»™ chÆ°Æ¡ng trÃ¬nh, há»“ sÆ¡ sá»• sÃ¡ch Ä‘Æ°á»£c cáº­p nháº­t Ä‘áº§y Ä‘á»§, ká»‹p thá»i.
- ChuyÃªn Ä‘á» sinh hoáº¡t chuyÃªn mÃ´n Ä‘Æ°á»£c tá»• chá»©c nghiÃªm tÃºc, cÃ³ cháº¥t lÆ°á»£ng, thu hÃºt sá»± tham gia tÃ­ch cá»±c cá»§a cÃ¡c thÃ nh viÃªn.
- CÃ¡c hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m cho há»c sinh Ä‘Æ°á»£c thiáº¿t káº¿ sÃ¡ng táº¡o, phÃ¹ há»£p vá»›i Ä‘áº·c Ä‘iá»ƒm tÃ¢m sinh lÃ½ lá»©a tuá»•i."

3. VÃ Dá»¤ "Háº N CHáº¾":
"- Viá»‡c á»©ng dá»¥ng cÃ´ng nghá»‡ thÃ´ng tin vÃ o giáº£ng dáº¡y cÃ²n chÆ°a Ä‘á»“ng Ä‘á»u giá»¯a cÃ¡c thÃ nh viÃªn. Giáº£i phÃ¡p: Tá»• chá»©c buá»•i chia sáº» kinh nghiá»‡m sá»­ dá»¥ng cÃ¡c cÃ´ng cá»¥ sá»‘ nhÆ° Canva, Kahoot trong thiáº¿t káº¿ bÃ i giáº£ng.
- Má»™t sá»‘ hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m chÆ°a thu hÃºt Ä‘Æ°á»£c sá»± tham gia tÃ­ch cá»±c cá»§a toÃ n bá»™ há»c sinh. Giáº£i phÃ¡p: Äa dáº¡ng hÃ³a hÃ¬nh thá»©c tá»• chá»©c, tÄƒng cÆ°á»ng yáº¿u tá»‘ tÆ°Æ¡ng tÃ¡c vÃ  trÃ² chÆ¡i."

4. VÃ Dá»¤ "Ã KIáº¾N ÄÃ“NG GÃ“P":
"- Tháº§y Tráº§n VÄƒn Táº¡: Äá» xuáº¥t tÄƒng cÆ°á»ng cÃ¡c hoáº¡t Ä‘á»™ng hÆ°á»›ng nghiá»‡p cho há»c sinh khá»‘i 12 trong giai Ä‘oáº¡n chuáº©n bá»‹ thi tá»‘t nghiá»‡p vÃ  xÃ©t tuyá»ƒn Ä‘áº¡i há»c.
- CÃ´ Nguyá»…n Thá»‹ HÆ°Æ¡ng: GÃ³p Ã½ nÃªn Ä‘a dáº¡ng hÃ³a cÃ¡c hÃ¬nh thá»©c Ä‘Ã¡nh giÃ¡ há»c sinh trong mÃ´n Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m Ä‘á»ƒ phÃ¹ há»£p vá»›i Ä‘áº·c thÃ¹ mÃ´n há»c.
- Äa sá»‘ thÃ nh viÃªn nháº¥t trÃ­ vá»›i Ä‘Ã¡nh giÃ¡ vÃ  káº¿ hoáº¡ch. Tá»• trÆ°á»Ÿng ghi nháº­n cÃ¡c Ã½ kiáº¿n Ä‘Ã³ng gÃ³p vÃ  sáº½ Ä‘iá»u chá»‰nh káº¿ hoáº¡ch phÃ¹ há»£p."

5. VÃ Dá»¤ "Káº¾ HOáº CH THÃNG Tá»šI":
"- Tiáº¿p tá»¥c thá»±c hiá»‡n chÆ°Æ¡ng trÃ¬nh giáº£ng dáº¡y theo káº¿ hoáº¡ch, Ä‘áº£m báº£o tiáº¿n Ä‘á»™ vÃ  cháº¥t lÆ°á»£ng.
- Triá»ƒn khai chá»§ Ä‘á» thÃ¡ng: [TÃªn chá»§ Ä‘á»] cho há»c sinh cÃ¡c khá»‘i theo phÃ¢n cÃ´ng.
- HoÃ n thÃ nh há»“ sÆ¡ Ä‘Ã¡nh giÃ¡ giá»¯a ká»³ trÆ°á»›c ngÃ y [ngÃ y cá»¥ thá»ƒ].
- Tá»• chá»©c sinh hoáº¡t chuyÃªn mÃ´n theo cá»¥m trÆ°á»ng vÃ o tuáº§n [sá»‘ tuáº§n].
- Äáº©y máº¡nh á»©ng dá»¥ng cÃ´ng nghá»‡ thÃ´ng tin, khuyáº¿n khÃ­ch sá»­ dá»¥ng Canva, Padlet trong thiáº¿t káº¿ hoáº¡t Ä‘á»™ng."
`;

// ============================================================
// PHáº¦N 5: HÃ€M Táº O PROMPT Äáº¦Y Äá»¦ - Cáº¬P NHáº¬T TÃCH Há»¢P DATABASE
// ============================================================

export function getMeetingMinutesPrompt(
  month: string,
  session: string,
  keyContent: string,
  currentThemes: string,
  nextThemes: string,
  nextMonth: string
): string {
  const allMembers = getAllMembers();
  const shuffled = [...allMembers].sort(() => 0.5 - Math.random());
  const selectedMembers = shuffled.slice(0, Math.min(3, shuffled.length));

  const monthNumber = Number.parseInt(month) || 9;
  const nextMonthNumber = Number.parseInt(nextMonth) || (monthNumber % 12) + 1;

  let chuDeThangNayContext = "";
  let chuDeThangSauContext = "";

  // Láº¥y thÃ´ng tin chá»§ Ä‘á» thÃ¡ng nÃ y cho cáº£ 3 khá»‘i
  const grades: (10 | 11 | 12)[] = [10, 11, 12];

  chuDeThangNayContext = `
THÃ”NG TIN CHá»¦ Äá»€ THÃNG ${month} Tá»ª SGK (Ä‘á»ƒ Ä‘Ã¡nh giÃ¡):
${grades
      .map((g) => {
        const chuDe = getChuDeTheoThang(g, monthNumber);
        if (chuDe) {
          return `- Khá»‘i ${g}: ${chuDe.ten} (${chuDe.ma}) - Má»¥c tiÃªu: ${chuDe.muc_tieu ? chuDe.muc_tieu.slice(0, 2).join("; ") : ""
            }`;
        }
        return `- Khá»‘i ${g}: Theo káº¿ hoáº¡ch`;
      })
      .join("\n")}
`;

  chuDeThangSauContext = `
THÃ”NG TIN CHá»¦ Äá»€ THÃNG ${nextMonth} Tá»ª SGK (Ä‘á»ƒ láº­p káº¿ hoáº¡ch):
${grades
      .map((g) => {
        const chuDe = getChuDeTheoThang(g, nextMonthNumber);
        if (chuDe) {
          const hoatDongInfoList = getChuDeTheoThangFromActivities(g, nextMonthNumber);
          const soHoatDong = (hoatDongInfoList && hoatDongInfoList.length > 0)
            ? getHoatDongTheoChuDe(g, hoatDongInfoList[0].stt).length
            : 0;
          return `- Khá»‘i ${g}: ${chuDe.ten
            } (${soHoatDong} hoáº¡t Ä‘á»™ng) - Trá»ng tÃ¢m: ${chuDe.muc_tieu ? chuDe.muc_tieu[0] : ""
            }`;
        }
        return `- Khá»‘i ${g}: Theo káº¿ hoáº¡ch`;
      })
      .join("\n")}
`;

  return `${MEETING_ROLE}

${MEETING_STRUCTURE}

${MEETING_FORMAT_RULES}

============================================================
Dá»® LIá»†U Tá»ª CÆ  Sá»ž Dá»® LIá»†U CHÆ¯Æ NG TRÃŒNH (ÄÃƒ NGHIÃŠN Cá»¨U Ká»¸)
============================================================

${chuDeThangNayContext}

${chuDeThangSauContext}

HÆ¯á»šNG DáºªN SÆ¯ PHáº M (Tham kháº£o khi viáº¿t Ä‘Ã¡nh giÃ¡ vÃ  káº¿ hoáº¡ch):
- Triáº¿t lÃ½: ${HUONG_DAN_SU_PHAM.triet_ly.muc_tieu_cot_loi}
- Cáº¥u trÃºc thá»i lÆ°á»£ng: ${HUONG_DAN_SU_PHAM.cau_truc_thoi_luong.tong_tiet_nam
    } tiáº¿t/nÄƒm
- PhÆ°Æ¡ng phÃ¡p khuyáº¿n khÃ­ch: ${HUONG_DAN_SU_PHAM.phuong_phap?.nguyen_tac
      ? HUONG_DAN_SU_PHAM.phuong_phap.nguyen_tac.slice(0, 3).join(", ")
      : ""
    }

============================================================
THÃ”NG TIN CUá»˜C Há»ŒP
============================================================

THÃ”NG TIN Tá»” CHUYÃŠN MÃ”N:
- TÃªn tá»•: ${DEPT_INFO.name}
- TrÆ°á»ng: ${DEPT_INFO.school}
- Tá»• trÆ°á»Ÿng (Chá»§ trÃ¬): ${DEPT_INFO.head}
- ThÆ° kÃ½: ${DEPT_INFO.secretary}
- ThÃ nh viÃªn: ${DEPT_INFO.members.join(", ")}
- SÄ© sá»‘: ${DEPT_INFO.autoFill.si_so} | Váº¯ng: ${DEPT_INFO.autoFill.vang}

THÃ”NG TIN CUá»˜C Há»ŒP:
- ThÃ¡ng: ${month}
- Láº§n há»p: ${session}
- Ná»™i dung trá»ng tÃ¢m: ${keyContent || "Sinh hoáº¡t chuyÃªn mÃ´n Ä‘á»‹nh ká»³"}

CHá»¦ Äá»€ THÃNG ${month} (ÄÃ¡nh giÃ¡ hoáº¡t Ä‘á»™ng Ä‘Ã£ thá»±c hiá»‡n):
${currentThemes}

CHá»¦ Äá»€ THÃNG ${nextMonth} (Káº¿ hoáº¡ch triá»ƒn khai):
${nextThemes}

THÃ€NH VIÃŠN ÄÃ“NG GÃ“P Ã KIáº¾N (chá»n ngáº«u nhiÃªn):
${selectedMembers.map((m) => `- Tháº§y/CÃ´ ${m}`).join("\n")}

${MEETING_EXAMPLES}

YÃŠU Cáº¦U XUáº¤T RA - Má»–I PHáº¦N PHáº¢I:
1. "noi_dung_chinh": 2-3 Ä‘oáº¡n vÄƒn, tÃ­ch há»£p thÃ´ng tin tá»« SGK vá» chá»§ Ä‘á» Ä‘Ã£ thá»±c hiá»‡n
2. "uu_diem": 3 gáº¡ch Ä‘áº§u dÃ²ng cá»¥ thá»ƒ, cÃ³ dáº«n chá»©ng tá»« hoáº¡t Ä‘á»™ng thá»±c táº¿
3. "han_che": 2 gáº¡ch Ä‘áº§u dÃ²ng, má»—i gáº¡ch cÃ³ "Giáº£i phÃ¡p:" kÃ¨m theo
4. "y_kien_dong_gop": 2-3 Ã½ kiáº¿n + cÃ¢u káº¿t luáº­n
5. "ke_hoach_thang_toi": 4-5 gáº¡ch Ä‘áº§u dÃ²ng, gáº¯n vá»›i chá»§ Ä‘á» thÃ¡ng sau tá»« SGK

Äá»ŠNH Dáº NG Káº¾T QUáº¢ - JSON thuáº§n tÃºy (khÃ´ng cÃ³ markdown):
{
  "noi_dung_chinh": "- Äoáº¡n 1: [MÃ´ táº£ tá»•ng quan hoáº¡t Ä‘á»™ng thÃ¡ng qua, gáº¯n vá»›i chá»§ Ä‘á» SGK].\\n- Äoáº¡n 2: [Chi tiáº¿t cÃ¡c hoáº¡t Ä‘á»™ng Ä‘Ã£ thá»±c hiá»‡n].\\n- Äoáº¡n 3: [ÄÃ¡nh giÃ¡ chung vÃ  nháº­n Ä‘á»‹nh].",
  "uu_diem": "- [Æ¯u Ä‘iá»ƒm 1 cá»¥ thá»ƒ, cÃ³ dáº«n chá»©ng].\\n- [Æ¯u Ä‘iá»ƒm 2 cá»¥ thá»ƒ].\\n- [Æ¯u Ä‘iá»ƒm 3 cá»¥ thá»ƒ].",
  "han_che": "- [Háº¡n cháº¿ 1]: [MÃ´ táº£]. Giáº£i phÃ¡p: [CÃ¡ch kháº¯c phá»¥c cá»¥ thá»ƒ].\\n- [Háº¡n cháº¿ 2]: [MÃ´ táº£]. Giáº£i phÃ¡p: [CÃ¡ch kháº¯c phá»¥c cá»¥ thá»ƒ].",
  "y_kien_dong_gop": "- Tháº§y/CÃ´ ${selectedMembers[0] || "A"
    }: [Ã kiáº¿n vá» thÃ¡ng qua vÃ  Ä‘á» xuáº¥t thÃ¡ng tá»›i].\\n- Tháº§y/CÃ´ ${selectedMembers[1] || "B"
    }: [Ã kiáº¿n vÃ  Ä‘á» xuáº¥t].\\n- Äa sá»‘ thÃ nh viÃªn nháº¥t trÃ­ vá»›i Ä‘Ã¡nh giÃ¡ vÃ  káº¿ hoáº¡ch. Tá»• trÆ°á»Ÿng ghi nháº­n cÃ¡c Ã½ kiáº¿n vÃ  thá»‘ng nháº¥t triá»ƒn khai.",
  "ke_hoach_thang_toi": "- Tiáº¿p tá»¥c [hoáº¡t Ä‘á»™ng cá»¥ thá»ƒ].\\n- Triá»ƒn khai chá»§ Ä‘á» thÃ¡ng ${nextMonth}: [Ná»™i dung tá»« SGK].\\n- HoÃ n thÃ nh [nhiá»‡m vá»¥] trÆ°á»›c ngÃ y [deadline].\\n- PhÃ¢n cÃ´ng: [TÃªn] phá»¥ trÃ¡ch [nhiá»‡m vá»¥].\\n- Äáº©y máº¡nh [hoáº¡t Ä‘á»™ng cáº£i tiáº¿n]."
}`;
}
