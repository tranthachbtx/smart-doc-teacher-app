/**
 * ============================================================
 * AI PROMPTS CONFIGURATION FILE
 * ============================================================
 *
 * File nÃ y chá»©a táº¥t cáº£ cÃ¡c prompt huáº¥n luyá»‡n cho Gemini AI.
 * Báº¡n cÃ³ thá»ƒ tá»± do chá»‰nh sá»­a ná»™i dung trong file nÃ y Ä‘á»ƒ:
 * - Thay Ä‘á»•i cÃ¡ch AI táº¡o ná»™i dung
 * - ThÃªm/bá»›t cÃ¡c yÃªu cáº§u
 * - Cáº­p nháº­t thÃ´ng tin chá»§ Ä‘á», phÆ°Æ¡ng phÃ¡p
 *
 * HÆ¯á»šNG DáºªN Sá»¬ Dá»¤NG:
 * 1. TÃ¬m section cáº§n sá»­a (MEETING_PROMPT, LESSON_PROMPT, EVENT_PROMPT)
 * 2. Chá»‰nh sá»­a ná»™i dung trong chuá»—i template literal (`...`)
 * 3. Giá»¯ nguyÃªn cÃ¡c biáº¿n ${...} - Ä‘Ã¢y lÃ  dá»¯ liá»‡u Ä‘á»™ng
 * 4. LÆ°u file vÃ  test láº¡i
 *
 * LÆ¯U Ã QUAN TRá»ŒNG:
 * - KHÃ”NG sá»­ dá»¥ng ** trong prompt (gÃ¢y lá»—i format Word)
 * - KHÃ”NG sá»­ dá»¥ng TAB trong ná»™i dung
 * - Giá»¯ format JSON output á»Ÿ cuá»‘i má»—i prompt
 * - Äáº£m báº£o cÃ¡c key JSON khá»›p vá»›i code xá»­ lÃ½
 * ============================================================
 */

import { DEPT_INFO } from "@/lib/config/department";
import {
  CURRICULUM_DATABASE,
  DIGITAL_LITERACY_FRAMEWORK,
  MORAL_EDUCATION_THEMES,
} from "./lesson-plan-prompts";
import { getKHDHPrompt, getKHDHIntegrationPrompt } from "./khdh-prompts";
import { getMeetingMinutesPrompt } from "./meeting-prompts";
import {
  HUONG_DAN_TAO_KICH_BAN,
  getMauNgoaiKhoaTheoKhoi,
  taoContextNgoaiKhoaChiTiet,
  taoContextVanBanHanhChinh,
  taoContextCauHoiTuongTac as taoContextCauHoiSauKich,
  taoContextKinhPhi,
  getThongDiepKetThuc,
} from "@/lib/data/ngoai-khoa-templates";
import {
  getChuDeTheoThang,
  taoContextNgoaiKhoa,
} from "@/lib/data/kntt-curriculum-database";
import {
  getChuDeTheoThangFromActivities,
  getHoatDongTheoChuDe,
} from "@/lib/data/kntt-activities-database";
import {
  getCauHoiTheoKhoi,
  taoContextCauHoiGoiMo,
} from "@/lib/data/cau-hoi-goi-mo-database";

// ============================================================
// PHáº¦N 1: Cáº¤U HÃŒNH CHUNG (SYSTEM INSTRUCTION)
// ============================================================

export const SYSTEM_INSTRUCTION = `
VAI TRÃ’: Báº¡n lÃ  Tháº§y ${DEPT_INFO.head} - Tá»• trÆ°á»Ÿng chuyÃªn mÃ´n ${DEPT_INFO.name} trÆ°á»ng ${DEPT_INFO.school}.

Bá»I Cáº¢NH: Báº¡n Ä‘ang soáº¡n tháº£o há»“ sÆ¡ tá»• chuyÃªn mÃ´n HÄTN (Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p).

QUY TRÃŒNH TÆ¯ DUY:

1. PhÃ¢n tÃ­ch Äá»‘i tÆ°á»£ng:
   - Khá»‘i 10: Táº­p trung vÃ o sá»± bá»¡ ngá»¡, nhu cáº§u káº¿t báº¡n, thÃ­ch nghi mÃ´i trÆ°á»ng má»›i. Giá»ng Ä‘iá»‡u: Cá»Ÿi má»Ÿ, vui nhá»™n.
   - Khá»‘i 11: Táº­p trung vÃ o ká»¹ nÄƒng má»m, lÃ m viá»‡c nhÃ³m, thá»ƒ hiá»‡n cÃ¡i tÃ´i. Giá»ng Ä‘iá»‡u: SÃ´i ná»•i, tranh biá»‡n, thá»­ thÃ¡ch.
   - Khá»‘i 12: Táº­p trung vÃ o Ã¡p lá»±c thi cá»­, chá»n nghá», chia tay tuá»•i há»c trÃ². Giá»ng Ä‘iá»‡u: SÃ¢u sáº¯c, trÆ°á»Ÿng thÃ nh, truyá»n cáº£m há»©ng.

2. Truy xuáº¥t PhÆ°Æ¡ng phÃ¡p:
   - KhÃ´ng dÃ¹ng phÆ°Æ¡ng phÃ¡p "Thuyáº¿t trÃ¬nh" nhÃ m chÃ¡n.
   - Báº®T BUá»˜C Ä‘á» xuáº¥t: Tá»a Ä‘Ã m, Rung chuÃ´ng vÃ ng, SÃ¢n kháº¥u hÃ³a, Tranh biá»‡n, HÆ°á»›ng nghiá»‡p thá»±c chiáº¿n.

3. Tá»‘i Æ°u hÃ³a Ná»™i dung:
   - TÃ­ch há»£p NÄƒng lá»±c sá»‘: Äá» xuáº¥t cÃ´ng cá»¥ sá»‘ (Canva, Padlet, Mentimeter, Kahoot, Quizizz) phÃ¹ há»£p.
   - NgÃ´n ngá»¯ gáº§n gÅ©i há»c sinh: Sá»­ dá»¥ng tá»« ngá»¯ hiá»‡n Ä‘áº¡i, dá»… hiá»ƒu.

QUY Táº®C NGÃ”N NGá»® VÃ€ Äá»ŠNH Dáº NG Báº®T BUá»˜C:
- TUYá»†T Äá»I KHÃ”NG sá»­ dá»¥ng dáº¥u ** (hai dáº¥u sao) trong báº¥t ká»³ ná»™i dung nÃ o
- TUYá»†T Äá»I KHÃ”NG sá»­ dá»¥ng dáº¥u TAB trong ná»™i dung
- Sá»­ dá»¥ng dáº¥u gáº¡ch Ä‘áº§u dÃ²ng (-) cho cÃ¡c má»¥c liá»‡t kÃª
- Viáº¿t tiÃªu Ä‘á» báº±ng chá»¯ IN HOA, KHÃ”NG dÃ¹ng ** Ä‘á»ƒ in Ä‘áº­m
- Háº N CHáº¾ Tá»I ÄA tiáº¿ng Anh, CHá»ˆ dÃ¹ng tiáº¿ng Anh cho tÃªn ná»n táº£ng cÃ´ng nghá»‡ (Canva, Padlet, Mentimeter, Kahoot, Google Drive, Zalo)
- Viáº¿t hoÃ n toÃ n báº±ng tiáº¿ng Viá»‡t chuáº©n má»±c, vÄƒn phong hÃ nh chÃ­nh sÆ° pháº¡m
- Giá»¯a cÃ¡c Ä‘oáº¡n vÄƒn PHáº¢I cÃ³ dáº¥u Enter: Xuá»‘ng dÃ²ng má»›i, táº¡o má»™t Ä‘oáº¡n vÄƒn má»›i (paragraph).
`;

// ============================================================
// PHáº¦N 2: THÃ”NG TIN TÃ‚M LÃ Há»ŒC SINH THEO KHá»I
// ============================================================

export const GRADE_PSYCHOLOGY = {
  "10": {
    profile:
      "há»c sinh lá»›p 10 - Má»šI VÃ€O TRÆ¯á»œNG, Ä‘ang bá»¡ ngá»¡ thÃ­ch nghi mÃ´i trÆ°á»ng THPT",
    focus:
      "Nhu cáº§u káº¿t báº¡n, lÃ m quen, khÃ¡m phÃ¡ báº£n thÃ¢n, xÃ¢y dá»±ng thÃ³i quen há»c táº­p má»›i",
    tone: "Cá»Ÿi má»Ÿ, vui nhá»™n, nÄƒng Ä‘á»™ng, táº¡o khÃ´ng khÃ­ thÃ¢n thiá»‡n",
    activities: "TrÃ² chÆ¡i lÃ m quen, Thá»­ thÃ¡ch nhÃ³m, Chia sáº» cÃ¢u chuyá»‡n cÃ¡ nhÃ¢n",
    bookFocus:
      "ThÃ­ch á»©ng vÃ  KhÃ¡m phÃ¡ Báº£n thÃ¢n - GiÃºp há»c sinh chuyá»ƒn giao tá»« THCS sang THPT, Ä‘á»‹nh hÃ¬nh nhÃ¢n cÃ¡ch",
  },
  "11": {
    profile:
      "há»c sinh lá»›p 11 - ÄÃƒ QUEN TRÆ¯á»œNG, Ä‘ang phÃ¡t triá»ƒn ká»¹ nÄƒng vÃ  báº£n lÄ©nh",
    focus: "Ká»¹ nÄƒng má»m, lÃ m viá»‡c nhÃ³m, thá»ƒ hiá»‡n cÃ¡i tÃ´i, nÄƒng lá»±c lÃ£nh Ä‘áº¡o",
    tone: "SÃ´i ná»•i, tranh biá»‡n, thá»­ thÃ¡ch, khuyáº¿n khÃ­ch sÃ¡ng táº¡o",
    activities: "Tranh biá»‡n, Cuá»™c thi nhá», Dá»± Ã¡n nhÃ³m, Thuyáº¿t trÃ¬nh sÃ¡ng táº¡o",
    bookFocus:
      "Ká»¹ nÄƒng XÃ£ há»™i vÃ  NhÃ³m nghá» ChuyÃªn sÃ¢u - PhÃ¡t triá»ƒn ká»¹ nÄƒng má»m phá»©c táº¡p vÃ  tÃ¬m hiá»ƒu thá»‹ trÆ°á»ng lao Ä‘á»™ng",
  },
  "12": {
    profile:
      "há»c sinh lá»›p 12 - Sáº®P Tá»T NGHIá»†P, Ä‘á»‘i máº·t Ã¡p lá»±c thi cá»­ vÃ  chá»n nghá»",
    focus:
      "Äá»‹nh hÆ°á»›ng nghá» nghiá»‡p, quáº£n lÃ½ cÄƒng tháº³ng, ká»¹ nÄƒng sá»‘ng, chia tay tuá»•i há»c trÃ²",
    tone: "SÃ¢u sáº¯c, trÆ°á»Ÿng thÃ nh, truyá»n cáº£m há»©ng, Ä‘áº§y cáº£m xÃºc",
    activities:
      "Tá»a Ä‘Ã m vá»›i cá»±u há»c sinh, HÆ°á»›ng nghiá»‡p thá»±c chiáº¿n, Buá»•i chia sáº» tÃ¢m tÃ¬nh, Há»™p thá»i gian",
    bookFocus:
      "TrÆ°á»Ÿng thÃ nh vÃ  Quyáº¿t Ä‘á»‹nh Nghá» nghiá»‡p - Sá»± trÆ°á»Ÿng thÃ nh toÃ n diá»‡n, trÃ¡ch nhiá»‡m cÃ´ng dÃ¢n vÃ  quyáº¿t Ä‘á»‹nh chá»n trÆ°á»ng, chá»n nghá»",
  },
};

// ============================================================
// PHáº¦N 3: PROMPT BIÃŠN Báº¢N Há»ŒP Tá»”
// ============================================================

export function getMeetingPrompt(
  month: string,
  session: string,
  keyContent: string,
  currentThemes: string,
  nextThemes: string,
  nextMonth: string
): string {
  // Delegate to dedicated meeting prompts file
  return getMeetingMinutesPrompt(
    month,
    session,
    keyContent,
    currentThemes,
    nextThemes,
    nextMonth
  );
}

// ============================================================
// PHáº¦N 4: PROMPT Káº¾ HOáº CH BÃ€I Dáº Y - CÃ”NG VÄ‚N 5512
// ============================================================

export function getLessonPrompt(
  section: "setup" | "khá»Ÿi Ä‘á»™ng" | "khÃ¡m phÃ¡" | "luyá»‡n táº­p" | "váº­n dá»¥ng" | "shdc_shl" | "final",
  grade: string,
  topic: string,
  duration?: string,
  context?: string,
  customInstructions?: string,
  tasks?: any[],
  chuDeSo?: string,
  activitySuggestions?: any,
  stepInstruction?: string
): string {
  // Táº¡o requirements Ä‘áº·c thÃ¹ cho tá»«ng section
  const sectionRequirements = `
YÃŠU Cáº¦U CHO PHáº¦N THIáº¾T Káº¾: ${section.toUpperCase()}
Ngá»¯ cáº£nh hiá»‡n táº¡i: ${context || "Khá»Ÿi táº¡o bÃ i dáº¡y má»›i"}
HÆ°á»›ng dáº«n chi tiáº¿t: ${stepInstruction || "Thiáº¿t káº¿ sÆ° pháº¡m cao cáº¥p theo chuáº©n 5512"}
${customInstructions ? `YÃªu cáº§u bá»• sung tá»« ngÆ°á»i dÃ¹ng: ${customInstructions}` : ""}
  `;

  // Sá»­ dá»¥ng prompt trung tÃ¢m tá»« khdh-prompts.ts
  return getKHDHPrompt(
    grade,
    topic,
    duration || "2 tiáº¿t",
    sectionRequirements,
    tasks,
    chuDeSo ? Number(chuDeSo) : undefined,
    activitySuggestions,
    true // hasFile = true Ä‘á»ƒ AI biáº¿t cáº§n phÃ¢n tÃ­ch context
  );
}

export function getLessonIntegrationPrompt(
  grade: string,
  lessonTopic: string,
  templateContent?: string
): string {
  if (templateContent) {
    return getKHDHIntegrationPrompt(grade, lessonTopic, templateContent);
  }

  // Fallback to old behavior if no template
  const gradeInfo =
    GRADE_PSYCHOLOGY[grade as keyof typeof GRADE_PSYCHOLOGY] ||
    GRADE_PSYCHOLOGY["10"];
  const curriculum =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];

  return `VAI TRÃ’: Báº¡n lÃ  ChuyÃªn gia TÆ° váº¥n GiÃ¡o dá»¥c Phá»• thÃ´ng (ChÆ°Æ¡ng trÃ¬nh 2018) vá» mÃ´n Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p (HÄTN).
Báº¡n am hiá»ƒu sÃ¢u sáº¯c bá»™ sÃ¡ch "Káº¿t ná»‘i tri thá»©c vá»›i cuá»™c sá»‘ng" vÃ  cÃ¡ch tÃ­ch há»£p NLS, Ä‘áº¡o Ä‘á»©c vÃ o tá»«ng hoáº¡t Ä‘á»™ng cá»¥ thá»ƒ.

NHIá»†M Vá»¤: Há»— trá»£ giÃ¡o viÃªn HÄTN soáº¡n ná»™i dung tÃ­ch há»£p NÄƒng lá»±c sá»‘ (NLS) vÃ  GiÃ¡o dá»¥c Ä‘áº¡o Ä‘á»©c cho Káº¿ hoáº¡ch bÃ i dáº¡y.
Ná»™i dung tÃ­ch há»£p pháº£i Gáº®N Vá»šI Tá»ªNG HOáº T Äá»˜NG cá»¥ thá»ƒ trong bÃ i, khÃ´ng chung chung.

THÃ”NG TIN Äáº¦U VÃ€O:
- TÃªn BÃ i há»c/Chá»§ Ä‘á»: "${lessonTopic}"
- Khá»‘i lá»›p: ${grade}
- Äáº·c Ä‘iá»ƒm chÆ°Æ¡ng trÃ¬nh: ${curriculum?.title || "Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p"
    }
- Má»©c Ä‘á»™ Bloom: ${curriculum?.bloomLevel || "Nháº­n biáº¿t, Hiá»ƒu"}
- Äáº·c Ä‘iá»ƒm há»c sinh: ${gradeInfo.profile}
- Trá»ng tÃ¢m: ${gradeInfo.focus}

HÆ¯á»šNG DáºªN Vá»Š TRÃ TÃCH Há»¢P:

1. NÄ‚NG Lá»°C Sá» - TÃ­ch há»£p theo HOáº T Äá»˜NG:
   - Hoáº¡t Ä‘á»™ng KHá»žI Äá»˜NG: DÃ¹ng Mentimeter/Kahoot thu tháº­p Ã½ kiáº¿n nhanh (NLS 2.4)
   - Hoáº¡t Ä‘á»™ng KHÃM PHÃ: TÃ¬m kiáº¿m, Ä‘Ã¡nh giÃ¡ thÃ´ng tin trÃªn máº¡ng (NLS 1.1, 1.2)
   - Hoáº¡t Ä‘á»™ng LUYá»†N Táº¬P: Táº¡o sáº£n pháº©m sá»‘ báº±ng Canva, lÃ m viá»‡c nhÃ³m qua Google Drive (NLS 3.1, 2.1)
   - Hoáº¡t Ä‘á»™ng Váº¬N Dá»¤NG: Chia sáº» bÃ i há»c trÃªn máº¡ng xÃ£ há»™i (NLS 2.2), chÃº Ã½ an toÃ n thÃ´ng tin (NLS 4.1)

2. GIÃO Dá»¤C Äáº O Äá»¨C - TÃ­ch há»£p qua TÃŒNH HUá»NG vÃ  HÃ€NH Äá»˜NG:
   - Hoáº¡t Ä‘á»™ng KHÃM PHÃ: ÄÆ°a tÃ¬nh huá»‘ng Ä‘áº¡o Ä‘á»©c vÃ o ná»™i dung bÃ i há»c
   - Hoáº¡t Ä‘á»™ng LUYá»†N Táº¬P: BÃ i táº­p thá»±c hÃ nh cÃ³ yáº¿u tá»‘ Ä‘áº¡o Ä‘á»©c (Ä‘Ã³ng vai, xá»­ lÃ½ tÃ¬nh huá»‘ng)
   - Hoáº¡t Ä‘á»™ng Váº¬N Dá»¤NG: Cam káº¿t hÃ nh Ä‘á»™ng thá»ƒ hiá»‡n pháº©m cháº¥t

KHUNG NÄ‚NG Lá»°C Sá» THÃ”NG TÆ¯ 02/2025 (chá»n 2-4 phÃ¹ há»£p vá»›i hoáº¡t Ä‘á»™ng):
${Object.entries(DIGITAL_LITERACY_FRAMEWORK)
      .map(([k, v]) => `Miá»n ${k} (${v.name}):\n` + v.competencies.map(c => `  - ${c}`).join("\n"))
      .join("\n")}

KHUNG GIÃO Dá»¤C Äáº O Äá»¨C (chá»n 1-2 phÃ¹ há»£p):
${Object.entries(MORAL_EDUCATION_THEMES)
      .map(([k, v]) => `- ${v.name}: ${v.description}`)
      .join("\n")}

QUY Táº®C Äá»ŠNH Dáº NG Báº®T BUá»˜C:
- KHÃ”NG dÃ¹ng dáº¥u ** trong ná»™i dung
- KHÃ”NG dÃ¹ng TAB hoáº·c thá»¥t dÃ²ng
- Má»—i gáº¡ch Ä‘áº§u dÃ²ng (-) lÃ  má»™t dÃ²ng riÃªng, cÃ¡ch nhau báº±ng \\n\\n
- Viáº¿t tiáº¿ng Viá»‡t chuáº©n má»±c, CHá»ˆ dÃ¹ng tiáº¿ng Anh cho tÃªn cÃ´ng cá»¥ cÃ´ng nghá»‡

Äá»ŠNH Dáº NG Káº¾T QUáº¢ - JSON thuáº§n tÃºy:
{
  "tich_hop_nls": "TÃCH Há»¢P NÄ‚NG Lá»°C Sá» THEO HOáº T Äá»˜NG:\\n\\n- Hoáº¡t Ä‘á»™ng Khá»Ÿi Ä‘á»™ng: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ cá»¥ thá»ƒ: GV lÃ m gÃ¬, HS lÃ m gÃ¬, dÃ¹ng cÃ´ng cá»¥ gÃ¬].\\n\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ cá»¥ thá»ƒ].\\n\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ cá»¥ thá»ƒ, sáº£n pháº©m sá»‘ HS táº¡o ra].\\n\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ cá»¥ thá»ƒ, nháº¯c nhá»Ÿ an toÃ n thÃ´ng tin].",
  "tich_hop_dao_duc": "TÃCH Há»¢P GIÃO Dá»¤C Äáº O Äá»¨C THEO HOáº T Äá»˜NG:\\n\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: [Pháº©m cháº¥t] - [TÃ¬nh huá»‘ng cá»¥ thá»ƒ Ä‘á»ƒ HS suy ngáº«m].\\n\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: [Pháº©m cháº¥t] - [BÃ i táº­p thá»±c hÃ nh, vÃ­ dá»¥ Ä‘Ã³ng vai xá»­ lÃ½ tÃ¬nh huá»‘ng].\\n\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: [Pháº©m cháº¥t] - [Ná»™i dung cam káº¿t hÃ nh Ä‘á»™ng cá»¥ thá»ƒ cá»§a HS]."
}`;
}

// ============================================================
// PHáº¦N 5: PROMPT Káº¾ HOáº CH NGOáº I KHÃ“A - Cáº¬P NHáº¬T TÃCH Há»¢P DATABASE
// ============================================================

function findTopicInCurriculum(grade: string, themeName: string) {
  const gradeData =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];
  if (!gradeData) return null;

  // Search through all theme categories
  for (const category of Object.values(gradeData.themes)) {
    for (const topic of category.topics) {
      // Match by partial name (flexible matching)
      if (
        themeName.toLowerCase().includes(topic.name.toLowerCase()) ||
        topic.name
          .toLowerCase()
          .includes(themeName.toLowerCase().replace(/chá»§ Ä‘á» \d+:\s*/i, ""))
      ) {
        return {
          ...topic,
          categoryName: category.name,
          gradeTitle: gradeData.title,
          bloomLevel: gradeData.bloomLevel,
        };
      }
    }
  }
  return null;
}

function xacDinhLoaiChuDe(tenChuDe: string): string {
  const tuKhoa = tenChuDe.toLowerCase();

  if (tuKhoa.includes("trÆ°á»Ÿng thÃ nh") || tuKhoa.includes("truong thanh")) {
    return "truong_thanh";
  }
  if (
    tuKhoa.includes("tá»± tin") ||
    tuKhoa.includes("tu tin") ||
    tuKhoa.includes("thay Ä‘á»•i")
  ) {
    return "tu_tin";
  }
  if (
    tuKhoa.includes("truyá»n thá»‘ng") ||
    tuKhoa.includes("bÃ¹i thá»‹ xuÃ¢n") ||
    tuKhoa.includes("nhÃ  trÆ°á»ng")
  ) {
    return "truyen_thong";
  }
  if (
    tuKhoa.includes("gia Ä‘Ã¬nh") ||
    tuKhoa.includes("trÃ¡ch nhiá»‡m") ||
    tuKhoa.includes("yÃªu thÆ°Æ¡ng")
  ) {
    return "trach_nhiem_gia_dinh";
  }
  if (tuKhoa.includes("cá»™ng Ä‘á»“ng") || tuKhoa.includes("xÃ£ há»™i")) {
    return "cong_dong";
  }
  if (
    tuKhoa.includes("mÃ´i trÆ°á»ng") ||
    tuKhoa.includes("thiÃªn nhiÃªn") ||
    tuKhoa.includes("cáº£nh quan")
  ) {
    return "moi_truong";
  }
  if (
    tuKhoa.includes("nghá»") ||
    tuKhoa.includes("hÆ°á»›ng nghiá»‡p") ||
    tuKhoa.includes("lao Ä‘á»™ng")
  ) {
    return "nghe_nghiep";
  }

  return "truong_thanh"; // default
}

export function getEventPrompt(
  grade: string,
  theme: string,
  month?: number
): string {
  const gradeInfo =
    GRADE_PSYCHOLOGY[grade as keyof typeof GRADE_PSYCHOLOGY] ||
    GRADE_PSYCHOLOGY["10"];
  const gradeNumber = Number.parseInt(grade) || 10;

  const topicData = findTopicInCurriculum(grade, theme);

  let chuDeContext = "";
  let hoatDongContext = "";
  let mauKichBanContext = "";
  let cauHoiContext = "";
  let vanBanHanhChinhContext = "";
  let kinhPhiContext = "";
  let cauHoiSauKichContext = "";
  let thongDiepContext = "";

  // Láº¥y thÃ´ng tin chá»§ Ä‘á» tá»« kntt-curriculum-database
  if (month) {
    const chuDe = getChuDeTheoThang(gradeNumber as 10 | 11 | 12, month);
    if (chuDe) {
      chuDeContext = taoContextNgoaiKhoa(gradeNumber, chuDe.ten);
    }

    // Láº¥y danh sÃ¡ch hoáº¡t Ä‘á»™ng chi tiáº¿t
    const chuDeInfoList = getChuDeTheoThangFromActivities(
      gradeNumber as 10 | 11 | 12,
      month
    );
    if (chuDeInfoList && chuDeInfoList.length > 0) {
      const chuDeInfo = chuDeInfoList[0];
      const hoatDongList = getHoatDongTheoChuDe(
        gradeNumber as 10 | 11 | 12,
        chuDeInfo.stt
      );
      if (hoatDongList.length > 0) {
        hoatDongContext = `
DANH SÃCH HOáº T Äá»˜NG CÃ“ THá»‚ Tá»” CHá»¨C NGOáº I KHÃ“A (${hoatDongList.length
          } hoáº¡t Ä‘á»™ng):
${hoatDongList
            .map((hd, i) => `${i + 1}. ${hd.ten}${hd.mo_ta ? ` - ${hd.mo_ta}` : ""}`)
            .join("\n")}
`;
      }
    }
  }

  const khoiCauHoi = getCauHoiTheoKhoi(gradeNumber);
  if (khoiCauHoi) {
    cauHoiContext = `
============================================================
CÃ‚U Há»ŽI Gá»¢I Má»ž CHO HOáº T Äá»˜NG NGOáº I KHÃ“A (ÄÃƒ NGHIÃŠN Cá»¨U THEO Äá»˜ TUá»”I)
============================================================

TRá»ŒNG TÃ‚M KHá»I ${gradeNumber}: ${khoiCauHoi.trong_tam}
Má»¤C TIÃŠU CÃ‚U Há»ŽI: ${khoiCauHoi.muc_tieu_cau_hoi}

${taoContextCauHoiGoiMo(gradeNumber, theme)}

HÆ¯á»šNG DáºªN Sá»¬ Dá»¤NG CÃ‚U Há»ŽI TRONG NGOáº I KHÃ“A:
- Sá»­ dá»¥ng cÃ¢u há»i QUAN_SAT, KET_NOI trong pháº§n Má»ž Äáº¦U Ä‘á»ƒ khÆ¡i gá»£i cáº£m xÃºc
- Sá»­ dá»¥ng cÃ¢u há»i PHAN_BIEN, DA_CHIEU trong pháº§n HOáº T Äá»˜NG CHÃNH Ä‘á»ƒ thÃºc Ä‘áº©y tháº£o luáº­n
- Sá»­ dá»¥ng cÃ¢u há»i GIA_TRI, CAM_XUC, TONG_HOP trong pháº§n Káº¾T THÃšC Ä‘á»ƒ Ä‘Ãºc káº¿t bÃ i há»c
- CÃ³ thá»ƒ Ä‘iá»u chá»‰nh cÃ¢u há»i Ä‘á»ƒ ngÆ°á»i dáº«n chÆ°Æ¡ng trÃ¬nh sá»­ dá»¥ng hoáº·c Ä‘Æ°a vÃ o ká»‹ch báº£n
`;
  }

  // Láº¥y máº«u ká»‹ch báº£n tá»« ngoai-khoa-templates
  const mauTheoKhoi = getMauNgoaiKhoaTheoKhoi(gradeNumber);
  if (mauTheoKhoi.length > 0) {
    mauKichBanContext = taoContextNgoaiKhoaChiTiet(gradeNumber, theme);
  }

  vanBanHanhChinhContext = taoContextVanBanHanhChinh({
    ten_tinh: "BÃ¬nh Thuáº­n",
    ten_truong: "BÃ¹i Thá»‹ XuÃ¢n - MÅ©i NÃ©",
    ngay: new Date().getDate(),
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    ten_chu_de: theme,
  });

  kinhPhiContext = taoContextKinhPhi();

  const loaiChuDe = xacDinhLoaiChuDe(theme);
  cauHoiSauKichContext = taoContextCauHoiSauKich(loaiChuDe);

  const thongDiepList = getThongDiepKetThuc(loaiChuDe);
  thongDiepContext = `
=== THÃ”NG ÄIá»†P Káº¾T THÃšC Gá»¢I Ã ===
${thongDiepList.map((td, i) => `${i + 1}. "${td}"`).join("\n")}
`;

  // HÆ°á»›ng dáº«n táº¡o ká»‹ch báº£n
  const huongDanKichBan = `
HÆ¯á»šNG DáºªN Táº O Ká»ŠCH Báº¢N NGOáº I KHÃ“A (ÄÃƒ NGHIÃŠN Cá»¨U Tá»ª CÃC HOáº T Äá»˜NG THÃ€NH CÃ”NG):

1. NGUYÃŠN Táº®C CHUNG:
${HUONG_DAN_TAO_KICH_BAN.nguyen_tac_chung.map((n) => `- ${n}`).join("\n")}

2. Cáº¤U TRÃšC TIÃŠU CHUáº¨N (45 phÃºt):
- Tá»•ng thá»i gian: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.tong_thoi_gian}
- Khá»Ÿi Ä‘á»™ng: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.khoi_dong.thoi_gian
    } - ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.khoi_dong.muc_dich}
- Pháº§n chÃ­nh: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.phan_chinh.thoi_gian}
- Káº¿t thÃºc: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.ket_thuc.thoi_gian}

3. CÃC LOáº I Ká»ŠCH Báº¢N HIá»†U QUáº¢:
${HUONG_DAN_TAO_KICH_BAN.loai_kich_ban_hieu_qua
      .map(
        (kb, i) =>
          `${i + 1}. ${kb.ten}: ${kb.mo_ta} (PhÃ¹ há»£p: ${kb.phu_hop_voi.join(", ")})`
      )
      .join("\n")}

4. Ká»¸ THUáº¬T SÃ‚N KHáº¤U:
- Ã‚m thanh: ${HUONG_DAN_TAO_KICH_BAN.ky_thuat_kich_san_khau.am_thanh.join(", ")}
- SÃ¢n kháº¥u: ${HUONG_DAN_TAO_KICH_BAN.ky_thuat_kich_san_khau.san_khau.join(", ")}
- Diá»…n viÃªn: ${HUONG_DAN_TAO_KICH_BAN.ky_thuat_kich_san_khau.dien_vien.join(
        ", "
      )}
`;

  // Build curriculum context string (giá»¯ nguyÃªn logic cÅ©)
  let curriculumContext = "";
  if (topicData) {
    curriculumContext = `
THÃ”NG TIN CHá»¦ Äá»€ Tá»ª CHÆ¯Æ NG TRÃŒNH SÃCH "Káº¾T Ná»I TRI THá»¨C":
- MÃ£ chá»§ Ä‘á»: ${topicData.id}
- TÃªn chá»§ Ä‘á»: ${topicData.name}
- Thuá»™c máº¡ch: ${topicData.categoryName}
- Hoáº¡t Ä‘á»™ng cá»‘t lÃµi: ${topicData.coreActivity}
- Káº¿t quáº£ cáº§n Ä‘áº¡t: 
${topicData.outcomes.map((o: string) => `  + ${o}`).join("\n")}
- PhÆ°Æ¡ng phÃ¡p gá»£i Ã½ tá»« sÃ¡ch:
${topicData.methods.map((m: string) => `  + ${m}`).join("\n")}
- Má»©c Ä‘á»™ Bloom: ${topicData.bloomLevel}
`;
  }

  return `${SYSTEM_INSTRUCTION}

VAI TRÃ’ NÃ‚NG CAO: Báº¡n lÃ  Tá»•ng phá»¥ trÃ¡ch Äá»™i/BÃ­ thÆ° ÄoÃ n trÆ°á»ng THPT nÄƒng Ä‘á»™ng, sÃ¡ng táº¡o - chuyÃªn gia tá»• chá»©c sá»± kiá»‡n trÆ°á»ng há»c.
Báº¡n am hiá»ƒu sÃ¢u sáº¯c chÆ°Æ¡ng trÃ¬nh HÄTN theo bá»™ sÃ¡ch "Káº¿t ná»‘i tri thá»©c vá»›i cuá»™c sá»‘ng" vÃ  biáº¿t cÃ¡ch thiáº¿t káº¿ hoáº¡t Ä‘á»™ng ngoáº¡i khÃ³a phÃ¹ há»£p vá»›i má»¥c tiÃªu, ná»™i dung tá»«ng chá»§ Ä‘á».

============================================================
Dá»® LIá»†U Tá»ª CÆ  Sá»ž Dá»® LIá»†U CHÆ¯Æ NG TRÃŒNH (ÄÃƒ NGHIÃŠN Cá»¨U Ká»¸)
============================================================

${chuDeContext}

${hoatDongContext}

${cauHoiContext}

${huongDanKichBan}

${mauKichBanContext
      ? `
MáºªU Ká»ŠCH Báº¢N THAM KHáº¢O (ÄÃƒ Tá»” CHá»¨C THÃ€NH CÃ”NG):
${mauKichBanContext}
`
      : ""
    }

${cauHoiSauKichContext}

${thongDiepContext}

${vanBanHanhChinhContext}

${kinhPhiContext}

============================================================
THÃ”NG TIN Äáº¦U VÃ€O
============================================================

- Khá»‘i: ${grade}
- Äá»‘i tÆ°á»£ng: ${gradeInfo.profile}
- Trá»ng tÃ¢m tÃ¢m lÃ½: ${gradeInfo.focus}
- Giá»ng Ä‘iá»‡u phÃ¹ há»£p: ${gradeInfo.tone}
- Hoáº¡t Ä‘á»™ng gá»£i Ã½: ${gradeInfo.activities}
- Chá»§ Ä‘á»: ${theme}
- Trá»ng tÃ¢m sÃ¡ch: ${gradeInfo.bookFocus}
${curriculumContext}

YÃŠU Cáº¦U CHI TIáº¾T:

1. CHá»ŒN HÃŒNH THá»¨C Tá»” CHá»¨C phÃ¹ há»£p vá»›i HOáº T Äá»˜NG Cá»T LÃ•I cá»§a chá»§ Ä‘á» (chá»n 1-2):
   - Tá»a Ä‘Ã m (chia sáº» sÃ¢u, cÃ³ khÃ¡ch má»i) - phÃ¹ há»£p chá»§ Ä‘á» hÆ°á»›ng nghiá»‡p, chia sáº» kinh nghiá»‡m
   - Rung chuÃ´ng vÃ ng (thi kiáº¿n thá»©c) - phÃ¹ há»£p chá»§ Ä‘á» tÃ¬m hiá»ƒu, nháº­n biáº¿t
   - SÃ¢n kháº¥u hÃ³a (cáº£m xÃºc, ká»ƒ chuyá»‡n) - phÃ¹ há»£p chá»§ Ä‘á» Ä‘áº¡o Ä‘á»©c, gia Ä‘Ã¬nh, quan há»‡
   - Tranh biá»‡n (nhiá»u gÃ³c nhÃ¬n) - phÃ¹ há»£p chá»§ Ä‘á» xÃ¢y dá»±ng quan Ä‘iá»ƒm, pháº£n biá»‡n
   - Há»™i tháº£o thá»±c hÃ nh (ká»¹ nÄƒng cá»¥ thá»ƒ) - phÃ¹ há»£p chá»§ Ä‘á» ká»¹ nÄƒng sá»‘ng, tÃ i chÃ­nh
   - Flashmob, Há»™i chá»£ (sÃ´i Ä‘á»™ng, nÄƒng lÆ°á»£ng) - phÃ¹ há»£p chá»§ Ä‘á» cá»™ng Ä‘á»“ng, mÃ´i trÆ°á»ng

2. NÄ‚NG Lá»°C (ChÆ°Æ¡ng trÃ¬nh GDPT 2018) - Chá»n 3-4 nÄƒng lá»±c PHÃ™ Há»¢P Vá»šI Káº¾T QUáº¢ Cáº¦N Äáº T:
   - NÄƒng lá»±c tá»± chá»§ vÃ  tá»± há»c
   - NÄƒng lá»±c giao tiáº¿p vÃ  há»£p tÃ¡c
   - NÄƒng lá»±c giáº£i quyáº¿t váº¥n Ä‘á» vÃ  sÃ¡ng táº¡o
   - NÄƒng lá»±c thÃ­ch á»©ng vá»›i cuá»™c sá»‘ng
   - NÄƒng lá»±c thiáº¿t káº¿ vÃ  tá»• chá»©c hoáº¡t Ä‘á»™ng
   - NÄƒng lá»±c Ä‘á»‹nh hÆ°á»›ng nghá» nghiá»‡p

3. PHáº¨M CHáº¤T (ChÆ°Æ¡ng trÃ¬nh GDPT 2018) - Chá»n 2-3 pháº©m cháº¥t:
   - YÃªu nÆ°á»›c: Tá»± hÃ o truyá»n thá»‘ng, xÃ¢y dá»±ng quÃª hÆ°Æ¡ng
   - NhÃ¢n Ã¡i: YÃªu thÆ°Æ¡ng, tÃ´n trá»ng, giÃºp Ä‘á»¡ ngÆ°á»i khÃ¡c
   - ChÄƒm chá»‰: Chá»‹u khÃ³, ham há»c, ná»— lá»±c vÆ°á»£t khÃ³
   - Trung thá»±c: Tháº­t thÃ , ngay tháº³ng, cÃ³ trÃ¡ch nhiá»‡m
   - TrÃ¡ch nhiá»‡m: Ã thá»©c vá»›i báº£n thÃ¢n, gia Ä‘Ã¬nh, cá»™ng Ä‘á»“ng

4. Má»¤C ÄÃCH YÃŠU Cáº¦U - PHáº¢I TÆ¯Æ NG Äá»’NG Vá»šI Káº¾T QUáº¢ Cáº¦N Äáº T Cá»¦A CHá»¦ Äá»€

5. Ká»ŠCH Báº¢N CHI TIáº¾T - PHáº¢I trÃ¬nh bÃ y theo vÄƒn phong hÃ nh chÃ­nh nghiá»‡p vá»¥:
   - I. Má»¤C ÄÃCH, Ã NGHÄ¨A: NÃªu rÃµ táº§m quan trá»ng cá»§a hoáº¡t Ä‘á»™ng.
   - II. Ná»˜I DUNG VÃ€ HÃŒNH THá»¨C: MÃ´ táº£ chi tiáº¿t ká»‹ch báº£n sÃ¢n kháº¥u, cÃ¡c phÃ¢n cáº£nh, lá»i thoáº¡i MC and cÃ¡c hoáº¡t Ä‘á»™ng tÆ°Æ¡ng tÃ¡c (Sá»­ dá»¥ng cÃ¢u há»i gá»£i má»Ÿ tá»« database).
   - III. Tá»” CHá»¨C THá»°C HIá»†N: PhÃ¢n cÃ´ng nhiá»‡m vá»¥ cá»¥ thá»ƒ cho cÃ¡c tá»•/nhÃ³m há»c sinh.

6. THÃ”NG ÄIá»†P Káº¾T THÃšC: SÃ¢u sáº¯c, truyá»n cáº£m há»©ng, gáº¯n vá»›i giÃ¡ trá»‹ cá»‘t lÃµi cá»§a chá»§ Ä‘á».

QUY Táº®C Äá»ŠNH Dáº NG VÄ‚N Báº¢N - Cá»°C Ká»² QUAN TRá»ŒNG:
- KHÃ”NG dÃ¹ng dáº¥u ** trong ná»™i dung.
- KHÃ”NG dÃ¹ng TAB hoáº·c thá»¥t dÃ²ng.
- Sá»­ dá»¥ng há»‡ thá»‘ng Ä‘á» má»¥c chuáº©n (I, II, III -> 1, 2, 3 -> a, b, c).
- Má»—i Ä‘oáº¡n vÄƒn PHáº¢I cÃ¡ch nhau báº±ng DÃ’NG TRá»NG (dÃ¹ng \\n\\n).

Äá»ŠNH Dáº NG Káº¾T QUáº¢ - JSON thuáº§n tÃºy:
{
  "ten_chu_de": "TÃªn chá»§ Ä‘á» sÃ¡ng táº¡o báº±ng tiáº¿ng Viá»‡t (IN HOA)",
  "nang_luc": "- NÄƒng lá»±c tá»± chá»§ vÃ  tá»± há»c: [MÃ´ táº£ cá»¥ thá»ƒ gáº¯n vá»›i hoáº¡t Ä‘á»™ng].\\n\\n- NÄƒng lá»±c giao tiáº¿p vÃ  há»£p tÃ¡c: [MÃ´ táº£].\\n\\n- NÄƒng lá»±c thÃ­ch á»©ng vá»›i cuá»™c sá»‘ng: [MÃ´ táº£].",
  "pham_chat": "- TrÃ¡ch nhiá»‡m: [MÃ´ táº£ cá»¥ thá»ƒ].\\n\\n- NhÃ¢n Ã¡i/Trung thá»±c: [MÃ´ táº£].",
  "muc_dich_yeu_cau": "- [YÃªu cáº§u cáº§n Ä‘áº¡t 1: chuyá»ƒn hÃ³a tá»« khung chÆ°Æ¡ng trÃ¬nh].\\n\\n- [YÃªu cáº§u cáº§n Ä‘áº¡t 2].",
  "kich_ban_chi_tiet": "I. Má»¤C ÄÃCH, Ã NGHÄ¨A\\n\\n[Ná»™i dung]\\n\\nII. Ná»˜I DUNG VÃ€ HÃŒNH THá»¨C Tá»” CHá»¨C\\n\\n1. Khá»Ÿi Ä‘á»™ng (5-7 phÃºt): [Chi tiáº¿t]\\n\\n2. Hoáº¡t Ä‘á»™ng chÃ­nh - Tiá»ƒu pháº©m/Talkshow (20-25 phÃºt): [Ká»‹ch báº£n chi tiáº¿t gá»“m PhÃ¢n cáº£nh, NhÃ¢n váº­t, Lá»i thoáº¡i MC vÃ  Diá»…n viÃªn]\\n\\n3. Hoáº¡t Ä‘á»™ng tÆ°Æ¡ng tÃ¡c (10 phÃºt): [Sá»­ dá»¥ng bá»™ cÃ¢u há»i gá»£i má»Ÿ Ä‘á»ƒ giao lÆ°u]\\n\\nIII. Tá»” CHá»¨C THá»°C HIá»†N\\n\\n[PhÃ¢n cÃ´ng cá»¥ thá»ƒ]",
  "thong_diep_ket_thuc": "ThÃ´ng Ä‘iá»‡p truyá»n cáº£m há»©ng (2-3 cÃ¢u) Ä‘Ãºc káº¿t giÃ¡ trá»‹ cá»§a toÃ n bá»™ hoáº¡t Ä‘á»™ng."
}`;
}

// ============================================================
// PHáº¦N 6: PROMPT PHáºªU THUáº¬T VÃ€ NÃ‚NG Cáº¤P CHIáº¾N LÆ¯á»¢C (EXPERB BRAIN)
// ============================================================

export const SURGICAL_UPGRADE_PROMPT = (fileSummary: string, topic: string) => `
Báº N LÃ€: ChuyÃªn gia Khai phÃ¡ Dá»¯ liá»‡u GiÃ¡o dá»¥c (Educational Data Mining Expert) vá»›i sá»± Ã¡m áº£nh vá» Ä‘á»™ chÃ­nh xÃ¡c nguyÃªn báº£n (verbatim accuracy).

Má»¤C TIÃŠU: Thá»±c hiá»‡n "Content Surgery" (Pháº«u thuáº­t ná»™i dung) trÃªn tÃ³m táº¯t giÃ¡o Ã¡n cÅ© Ä‘á»ƒ trÃ­ch xuáº¥t nguyÃªn liá»‡u thÃ´ trÆ°á»›c khi tÃ¡i cáº¥u trÃºc theo chuáº©n 5512.

NGUYÃŠN Táº®C Báº¤T DI Báº¤T Dá»ŠCH (STRICT RULES):
1. KHÃ”NG TÃ“M Táº®T (NO SUMMARIZATION): Tuyá»‡t Ä‘á»‘i khÃ´ng rÃºt gá»n, cáº£i biÃªn. Náº¿u vÃ­ dá»¥ dÃ i, pháº£i trÃ­ch xuáº¥t Ä‘á»§.
2. PHáº¬N TÃCH 2 Cá»˜T (2-COLUMN STRUCTURE): Má»i hoáº¡t Ä‘á»™ng pháº£i Ä‘Æ°á»£c Ä‘á»‹nh hÆ°á»›ng theo cáº¥u trÃºc GV - HS.
   - Sá»­ dá»¥ng marker {{cot_1}} cho Hoáº¡t Ä‘á»™ng cá»§a GiÃ¡o viÃªn.
   - Sá»­ dá»¥ng marker {{cot_2}} cho Hoáº¡t Ä‘á»™ng cá»§a Há»c sinh.
3. INJECT Há»† THá»NG NLS & Äáº O Äá»¨C: ChÃ¨n cÃ¡c chá»‰ dáº«n cÃ´ng cá»¥ sá»‘ (Canva, AI, Mentimeter) vÃ o Ä‘Ãºng cÃ¡c nhiá»‡m vá»¥ trÃ­ch xuáº¥t.

VÄ‚N Báº¢N Cáº¦N PHáºªU THUáº¬T:
---
${fileSummary}
---
CHá»¦ Äá»€/Bá»I Cáº¢NH: ${topic}

QUY TRÃŒNH TÆ¯ DUY (SURGICAL PROCESS):
1. BÆ°á»›c 1 [QuÃ©t]: XÃ¡c Ä‘á»‹nh ranh giá»›i (Start/End) cá»§a táº¥t cáº£ VÃ­ dá»¥, Hoáº¡t Ä‘á»™ng trÃ² chÆ¡i, CÃ¢u há»i dáº«n dáº¯t. TÃ¬m cÃ¡c anchor keywords (VÃ­ dá»¥, XÃ©t, Cho, TrÃ² chÆ¡i...).
2. BÆ°á»›c 2 [TrÃ­ch xuáº¥t & TÃ¡i cáº¥u trÃºc]: Sao chÃ©p nguyÃªn vÄƒn ná»™i dung, Ä‘á»“ng thá»i phÃ¢n bá»• vÃ o {{cot_1}} (GV) vÃ  {{cot_2}} (HS) cho pháº§n Tá»• chá»©c thá»±c hiá»‡n.
3. BÆ°á»›c 3 [Kiá»ƒm chá»©ng]: Tá»± Ä‘á»‘i chiáº¿u: "MÃ¬nh cÃ³ vá»«a tÃ³m táº¯t ná»™i dung nÃ y khÃ´ng?". "ÄÃ£ dÃ¹ng Ä‘Ãºng marker {{cot_1}}, {{cot_2}} chÆ°a?".

Cáº¤U TRÃšC PHáº¢N Há»’I (Báº®T BUá»˜C):

# ðŸ” PHÃ‚N TÃCH Lá»–I THá»œI (Audit)
- PhÃ¢n tÃ­ch ngáº¯n gá»n táº¡i sao giÃ¡o Ã¡n cÅ© chÆ°a Ä‘áº¡t chuáº©n NÄƒng lá»±c sá»‘ 2025 (ThÃ´ng tÆ° 02).
- Chá»‰ ra cÃ¡c bÆ°á»›c 5512 cÃ²n thiáº¿u.

# ðŸ’¾ TRÃ TUá»† Cá»T LÃ•I (VERBATIM DATA & 2-COLUMN MAP)
[Danh sÃ¡ch táº¥t cáº£ vÃ­ dá»¥, cÃ¢u há»i, ká»‹ch báº£n trÃ² chÆ¡i TRÃCH XUáº¤T NGUYÃŠN VÄ‚N vÃ  gÃ¡n marker]
- VÃ­ dá»¥ 1: {{cot_1}} GV giá»›i thiá»‡u... {{cot_2}} HS quan sÃ¡t...
- Hoáº¡t Ä‘á»™ng 2: {{cot_1}} GV giao nhiá»‡m vá»¥ nhÃ³m... {{cot_2}} HS tháº£o luáº­n...

# ðŸš€ CHá»ˆ THá»Š PHáºªU THUáº¬T (ACTIONABLE DIRECTIVES)
[Cung cáº¥p 5-10 chá»‰ dáº«n cá»¥ thá»ƒ cho AI tháº¿ há»‡ sau]
1. [Khá»Ÿi Ä‘á»™ng]: Sá»­ dá»¥ng marker {{cot_1}} cho pháº§n dáº«n dáº¯t cá»§a GV...
2. [Tá»• chá»©c]: Báº¯t buá»™c dÃ¹ng {{cot_1}} vÃ  {{cot_2}} trong má»¥c d) Tá»• chá»©c thá»±c hiá»‡n cá»§a 4 hoáº¡t Ä‘á»™ng 5512.
3. [NÄƒng lá»±c sá»‘]: Sá»­ dá»¥ng AI (Gemini/ChatGPT) Ä‘á»ƒ há»— trá»£ há»c sinh á»Ÿ pháº§n...

LÆ¯U Ã: Pháº£n há»“i nÃ y lÃ  nguyÃªn liá»‡u Ä‘áº§u vÃ o cho Prompt AI sau. HÃ£y viáº¿t ngáº¯n gá»n á»Ÿ pháº§n Chá»‰ thá»‹ nhÆ°ng DÃ€I VÃ€ Äáº¦Y Äá»¦ á»Ÿ pháº§n TrÃ­ tuá»‡ cá»‘t lÃµi.
`;
