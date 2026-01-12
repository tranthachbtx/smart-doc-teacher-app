/**
 * ============================================================
 * KHDH PROMPTS - Káº¾ HOáº CH Dáº Y Há»ŒC (LESSON PLAN)
 * ============================================================
 *
 * File nÃ y chá»©a prompt chuyÃªn biá»‡t cho viá»‡c táº¡o Káº¿ hoáº¡ch dáº¡y há»c
 * theo chuáº©n CÃ´ng vÄƒn 5512/BGDÄT-GDTrH
 *
 * CÃCH CHá»ˆNH Sá»¬A:
 * 1. VAI TRÃ’ (ROLE): Äiá»u chá»‰nh vai trÃ² cá»§a AI
 * 2. NHIá»†M Vá»¤ (TASK): Thay Ä‘á»•i yÃªu cáº§u Ä‘áº§u ra
 * 3. Dá»® LIá»†U Äáº¦U VÃ€O: ThÃªm/bá»›t cÃ¡c trÆ°á»ng input
 * 4. Äá»ŠNH Dáº NG Äáº¦U RA: Sá»­a cáº¥u trÃºc JSON output
 *
 * ============================================================
 */

import {
  CURRICULUM_DATABASE,
  DIGITAL_LITERACY_FRAMEWORK,
  MORAL_EDUCATION_THEMES,
} from "./lesson-plan-prompts";
import {
  getChuDeTheoThang,
  timChuDeTheoTen,
  taoPromptContextTuChuDe,
} from "../data/kntt-curriculum-database";
import {
  getHoatDongTheoChuDe,
  getChuDeTheoThangFromActivities,
} from "../data/kntt-activities-database";
import {
  getMucDoBloomTheoKhoi,
  taoContextKHBD_CV5512,
  getTrongTamTheoKhoi,
} from "../data/hdtn-pedagogical-guide";
import {
  getCauHoiTheoKhoi,
  taoContextCauHoiGoiMo,
} from "../data/cau-hoi-goi-mo-database";
import {
  taoContextPhieuHocTap,
  taoContextRubric,
  taoContextDanhGiaKHBD,
} from "../data/phieu-hoc-tap-rubric-database";
import {
  taoContextSHDC_SHL,
  taoContextTieuChiDanhGia,
  taoContextBangBieu,
} from "../data/shdc-shl-templates";
import {
  taoContextNLSChiTiet,
  goiYNLSTheoChuDe,
} from "../data/nang-luc-so-database";
import {
  getPPCTChuDe,
  taoContextPPCT,
  HUONG_DAN_AI_SU_DUNG_PPCT,
  taoContextPhanBoThoiGian,
} from "../data/ppct-database";

export const MONTH_TO_CHU_DE: Record<number, number> = {
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  1: 5,
  2: 6,
  3: 7,
  4: 8,
  5: 9,
};

// ============================================================
// PHáº¦N 1: VAI TRÃ’ VÃ€ Bá»I Cáº¢NH
// ============================================================

// ============================================================
// PART 1: ROLE & CONTEXT (ANTIGRAVITY ARCHITECTURE)
// ============================================================

export const KHDH_TONE = `
TONE OF VOICE:
- PROFESSIONAL: Sá»­ dá»¥ng thuáº­t ngá»¯ sÆ° pháº¡m chÃ­nh xÃ¡c (VD: "Chuyá»ƒn giao nhiá»‡m vá»¥", "Sáº£n pháº©m dá»± kiáº¿n", "KÃ­ch hoáº¡t tÆ° duy").
-pedagogical: Táº­p trung vÃ o "HÃ nh Ä‘á»™ng sÆ° pháº¡m" thay vÃ¬ lá»i thoáº¡i.
- DETAILED: KHÃ”NG viáº¿t chung chung kiá»ƒu "GV giáº£ng bÃ i". Báº®T BUá»˜C viáº¿t "GV sá»­ dá»¥ng bá»™ cÃ¢u há»i gá»£i má»Ÿ: '...', quan sÃ¡t vÃ  há»— trá»£ cÃ¡c nhÃ³m tháº£o luáº­n ká»¹ thuáº­t khÄƒn tráº£i bÃ n...".
`;

export const KHDH_ROLE = `
YOU ARE A SENIOR INSTRUCTIONAL DESIGNER & PEDAGOGICAL ARCHITECT (ANTIGRAVITY SYSTEM).
Experience: 25 years in Experiential Activities, Career Guidance, and Digital Competence.
Mission: Create extensive, deep, and legally compliant lesson plans (Official Letter 5512) that exceed national standards.

${KHDH_TONE}

CORE PHILOSOPHIES (KIM CHá»ˆ NAM):
1. CONSTRUCTIVISM & KOLB'S CYCLE: Every lesson plan must follow the 4-phase Experiential Learning Cycle: 
   - Concrete Experience (Khá»Ÿi Ä‘á»™ng).
   - Reflective Observation (KhÃ¡m phÃ¡).
   - Abstract Conceptualization (Káº¿t ná»‘i).
   - Active Experimentation (Luyá»‡n táº­p/Váº­n dá»¥ng).
2. DESIGN THINKING: Empathize with student needs, Define local problems, Ideate creative solutions, Prototype products, and Test in reality.
3. SERVICE LEARNING (SL): Connect classroom activities to real-world community needs (Social Responsibility).
4. COMPETENCY-BASED: Shift from "Teaching content" to "Designing learning experiences" that form specific Qualities and Competencies.
`;

// ============================================================
// PART 2: TASK
// ============================================================

export const KHDH_TASK = `
Má»¤C TIÃŠU Sáº¢N PHáº¨M: "PHáºªU THUáº¬T & TÃI Cáº¤U TRÃšC" giÃ¡o Ã¡n cÅ© thÃ nh KHBD SIÃŠU CHI TIáº¾T (30-50 trang) chuáº©n "LA BÃ€N".

QUY TRÃŒNH Xá»¬ LÃ (Báº®T BUá»˜C):
1. TRÃCH XUáº¤T TINH HOA: Äá»c file cÅ©, giá»¯ láº¡i cÃ¡c "ná»™i dung gá»‘c", cÃ¡c vÃ­ dá»¥ thá»±c táº¿ vÃ  sá»‘ liá»‡u chuyÃªn mÃ´n.
2. ÃP Äáº¶T KHUNG 5512: Ã‰p toÃ n bá»™ ná»™i dung cÅ© vÃ o khung 4 bÆ°á»›c (Chuyá»ƒn giao -> Thá»±c hiá»‡n -> BÃ¡o cÃ¡o -> Chá»‘t). Náº¿u file cÅ© chá»‰ cÃ³ "GV giáº£ng, HS nghe", báº¡n PHáº¢I tá»± biÃªn soáº¡n láº¡i thÃ nh cÃ¡c nhiá»‡m vá»¥ cá»¥ thá»ƒ.
3. INJECT Há»† THá»NG NLS & Äáº O Äá»¨C (NÃ‚NG Táº¦M): Sá»­ dá»¥ng khung ThÃ´ng tÆ° 02/2025 Ä‘á»ƒ chÃ¨n cÃ¡c hoáº¡t Ä‘á»™ng dÃ¹ng AI, Canva, Padlet... vÃ o Ä‘Ãºng cÃ¡c bÆ°á»›c thá»±c hÃ nh.
4. CHI TIáº¾T HÃ“A HÃ€NH Äá»˜NG & Sáº¢N PHáº¨M: Tuyá»‡t Ä‘á»‘i khÃ´ng viáº¿t ká»‹ch báº£n há»™i thoáº¡i. Thay vÃ o Ä‘Ã³, mÃ´ táº£ chi tiáº¿t "GV lÃ m gÃ¬?" vÃ  "Sáº£n pháº©m cá»¥ thá»ƒ HS pháº£i Ä‘áº¡t Ä‘Æ°á»£c lÃ  gÃ¬?".

TRIáº¾T LÃ: "KHÃ”NG CHá»ˆ LÃ€ SAO CHÃ‰P - MÃ€ LÃ€ NÃ‚NG Cáº¤P Há»† GEN GIÃO ÃN".
`;

// ============================================================
// PART 3: INTEGRATION RULES (NLS & ETHICS)
// ============================================================

export const INTEGRATION_RULES = `
INTEGRATION FRAMEWORKS:

1. DIGITAL LITERACY (NLS) - CIRCULAR 02/2025/TT-BGDÄT:
   - Focus on: Digital Content Creation (3.1), Search/Eval (1.1, 1.2), and Netiquette (2.5).
   - Use tools: Canva (design), CapCut (video), Padlet (collab), VR/AR apps (visualizing).

2. DESIGN THINKING (DT) INTEGRATION:
   - Phase 1 (Empathize/Define): Use SWOT, Fishbone, or PESTEL in Exploration.
   - Phase 2 (Ideate/Prototype): Design creative solutions in Practice/Apply.

3. SERVICE LEARNING (SL) & ETHICS:
   - Connect lessons to community "Service" (e.g., "Cleaning the beach", "Donating books").
   - Qualities formed through ACTION: Responsibility is shown by doing, not just knowing.
`;

// ============================================================
// PART 4: ACTIVITY STRUCTURE (2-COLUMN FORMAT)
// ============================================================

export const ACTIVITY_STRUCTURE = `
Cáº¤U TRÃšC HOáº T Äá»˜NG (Äá»ŠNH Dáº NG Báº¢NG 2 Cá»˜T - CHUáº¨N MÃ”N HÄTN, HN):

*** QUAN TRá»ŒNG: TUÃ‚N THá»¦ ÄÃšNG FORMAT Äá»‚ Há»† THá»NG Tá»° Äá»˜NG ÄIá»€N VÃ€O FILE WORD ***

Má»—i hoáº¡t Ä‘á»™ng (hoat_dong_khoi_dong, hoat_dong_kham_pha,...) PHáº¢I Ä‘Æ°á»£c Ä‘á»‹nh dáº¡ng nhÆ° sau:

{{cot_1}}
a) Má»¥c tiÃªu:
- [Ghi rÃµ YÃªu cáº§u cáº§n Ä‘áº¡t vá» kiáº¿n thá»©c/ká»¹ nÄƒng, tá»‘i thiá»ƒu 3 Ã½].
- [Ã nghÄ©a thá»±c tiá»…n Ä‘á»‘i vá»›i há»c sinh].

b) Ná»™i dung (Ká»‹ch báº£n thá»±c hiá»‡n):
- [MÃ´ táº£ ngáº¯n gá»n nhiá»‡m vá»¥ trá»ng tÃ¢m].
- [Danh sÃ¡ch há»c liá»‡u/thiáº¿t bá»‹ cáº§n dÃ¹ng].

c) Sáº£n pháº©m:
- [Káº¿t quáº£ cá»¥ thá»ƒ: Ná»™i dung phiáº¿u há»c táº­p, káº¿t quáº£ tháº£o luáº­n, hoáº·c sáº£n pháº©m sá»‘].
- [MÃ´ táº£ tiÃªu chÃ­ Ä‘áº¡t Ä‘Æ°á»£c cá»§a sáº£n pháº©m].

d) Tá»• chá»©c thá»±c hiá»‡n:
{{cot_2}}
BÆ°á»›c 1: CHUYá»‚N GIAO NHIá»†M Vá»¤
â€¢ GV thá»±c hiá»‡n: [MÃ´ táº£ ká»¹ thuáº­t dáº¡y há»c sá»­ dá»¥ng: Tráº¡m, Máº£nh ghÃ©p, KWL... vÃ  cÃ¡c bÆ°á»›c chá»‰ dáº«n cá»§a GV].
â€¢ Lá»‡nh bÃ i táº­p/CÃ¢u há»i Ä‘á»‹nh hÆ°á»›ng: 
  + [CÃ¢u há»i 1: KÃ­ch thÃ­ch tÆ° duy].
  + [CÃ¢u há»i 2: ÄÃ o sÃ¢u váº¥n Ä‘á»].

BÆ°á»›c 2: THá»°C HIá»†N NHIá»†M Vá»¤ ([X] phÃºt)
â€¢ HS thá»±c hiá»‡n: [MÃ´ táº£ chi tiáº¿t HS lÃ m gÃ¬: Äá»c tÃ i liá»‡u, tháº£o luáº­n nhÃ³m 4, tÃ¬m kiáº¿m thÃ´ng tin trÃªn internet, hoÃ n thiá»‡n Phiáº¿u há»c táº­p].
â€¢ Sáº¢N PHáº¨M/ÄÃP ÃN Dá»° KIáº¾N: 
  + [Liá»‡t kÃª chi tiáº¿t cÃ¡c cÃ¢u tráº£ lá»i Ä‘Ãºng, ná»™i dung kiáº¿n thá»©c chuáº©n HS cáº§n trÃ¬nh bÃ y Ä‘Æ°á»£c].
  + [MÃ´ táº£ hÃ¬nh thá»©c sáº£n pháº©m: SÆ¡ Ä‘á»“ tÆ° duy, bÃ i trÃ¬nh thuyáº¿t trÃ¬nh Canva...].
â€¢ Há»— trá»£ (Scaffolding): [GV quan sÃ¡t vÃ  Ä‘á»‹nh hÆ°á»›ng cho cÃ¡c nhÃ³m gáº·p khÃ³ khÄƒn ra sao?].

BÆ°á»›c 3: BÃO CÃO, THáº¢O LUáº¬N ([X] phÃºt)
â€¢ GV Ä‘iá»u phá»‘i: [CÃ¡ch thá»©c tá»• chá»©c bÃ¡o cÃ¡o: PhÃ²ng tranh, Thuyáº¿t trÃ¬nh quay vÃ²ng, BÃ¬nh chá»n trá»±c tuyáº¿n...].
â€¢ HS bÃ¡o cÃ¡o: [Ná»™i dung bÃ¡o cÃ¡o, cÃ¡ch thá»©c pháº£n biá»‡n vÃ  Ä‘áº·t cÃ¢u há»i giá»¯a cÃ¡c nhÃ³m].

BÆ°á»›c 4: Káº¾T LUáº¬N, NHáº¬N Äá»ŠNH
â€¢ GV chá»‘t kiáº¿n thá»©c: [TÃ³m táº¯t ná»™i dung cá»‘t lÃµi, khoa há»c].
â€¢ GiÃ¡o dá»¥c tÃ­ch há»£p: [BÃ i há»c vá» Äáº¡o Ä‘á»©c/NÄƒng lá»±c sá»‘ rÃºt ra tá»« hoáº¡t Ä‘á»™ng].
{{/cot_2}}
{{/cot_1}}

=== LÆ¯U Ã ===
- KHÃ”NG thÃªm tiÃªu Ä‘á» "HOáº T Äá»˜NG 1:...".
- Báº®T BUá»˜C giá»¯ marker {{cot_1}} vÃ  {{cot_2}}.
- Ná»™i dung GV/HS pháº£i Cá»¤ THá»‚, TRá»°C QUAN, khÃ´ng viáº¿t chung chung.
`;

// ============================================================
// PART 5: FORMAT RULES
// ============================================================

export const FORMAT_RULES = `
FORMATTING & LANGUAGE RULES:

1. TUYá»†T Äá»I KHÃ”NG dÃ¹ng lá»i thoáº¡i (Kiá»ƒu: GV: "..."). Chá»‰ dÃ¹ng vÄƒn phong hÃ nh Ä‘á»™ng hÃ nh chÃ­nh.
2. KHÃ”NG dÃ¹ng dáº¥u ** trong ná»™i dung.
3. KHÃ”NG dÃ¹ng TAB hoáº·c thá»¥t dÃ²ng. Sá»­ dá»¥ng gáº¡ch Ä‘áº§u dÃ²ng (-) rÃµ rÃ ng.
4. Äá»ŠA ÄIá»‚M/THá»œI GIAN: Sá»­ dá»¥ng Ä‘á»‹nh dáº¡ng "HÃ  Ná»™i, ngÃ y... thÃ¡ng... nÄƒm...".
5. PHÃ‚N Cáº¤P Äá»€ Má»¤C: Sá»­ dá»¥ng I -> 1 -> a -> - (Theo Nghá»‹ Ä‘á»‹nh 30).
6. Äá»˜NG Tá»ª HÃ€NH Äá»˜NG: Sá»­ dá»¥ng cÃ¡c Ä‘á»™ng tá»« Bloom (Liá»‡t kÃª, PhÃ¢n tÃ­ch, ÄÃ¡nh giÃ¡, SÃ¡ng táº¡o).
7. Sáº¢N PHáº¨M Há»ŒC SINH: Pháº£i viáº¿t Cá»°C Ká»² DÃ€I VÃ€ CHI TIáº¾T (Ä‘Ã¡p Ã¡n, máº«u báº£ng Ä‘Ã£ Ä‘iá»n) Ä‘á»ƒ tÄƒng Ä‘á»™ dÃ y cho giÃ¡o Ã¡n.
8. PARAGRAPHS: Use double newline (\\n\\n) to separate paragraphs for XML parsing.
9. *** FINAL OUTPUT MUST BE IN VIETNAMESE *** (System instructions are English, but content is Vietnamese).
`;

// ============================================================
// PHáº¦N 6: HÃ€M Táº O PROMPT Äáº¦Y Äá»¦ - Cáº¬P NHáº¬T TÃCH Há»¢P DATABASE
// ============================================================

export interface ActivitySuggestions {
  shdc?: string;
  hdgd?: string;
  shl?: string;
}

export function getKHDHPrompt(
  grade: string,
  topic: string,
  duration = "2 tiáº¿t",
  additionalRequirements?: string,
  tasks?: Array<{ name: string; description: string; time?: number }>,
  month?: number,
  activitySuggestions?: ActivitySuggestions,
  hasFile?: boolean
): string {
  const curriculum =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];

  const gradeNumber = (Number.parseInt(grade) || 10) as 10 | 11 | 12;

  // Calculate total minutes based on duration string
  let totalMinutes = 90; // Default 2 periods
  const periodsMatch = duration.match(/(\d+)/);
  if (periodsMatch) {
    totalMinutes = Number.parseInt(periodsMatch[1]) * 45;
  }

  // Tá»I Æ¯U HÃ“A TÃŒM KIáº¾M CHá»¦ Äá»€ (DEEP TRACE LOGIC)
  // Æ¯u tiÃªn 1: TÃ¬m theo TÃªn chá»§ Ä‘á» (ChÃ­nh xÃ¡c nháº¥t vá»›i Input ngÆ°á»i dÃ¹ng)
  // Æ¯u tiÃªn 2: TÃ¬m theo ThÃ¡ng (Náº¿u ngÆ°á»i dÃ¹ng chá»n thÃ¡ng nhÆ°ng chÆ°a nháº­p tÃªn chuáº©n)

  let foundChuDe = null;
  let machNoiDung = "ban_than";
  let chuDeSo = 1;

  // 1. TÃ¬m theo tÃªn
  if (topic && topic.trim().length > 0) {
    foundChuDe = timChuDeTheoTen(gradeNumber, topic);
  }

  // 2. Fallback tÃ¬m theo thÃ¡ng
  if (!foundChuDe && month) {
    foundChuDe = getChuDeTheoThang(gradeNumber, month);
  }

  // 3. Fallback máº·c Ä‘á»‹nh theo thÃ¡ng náº¿u cÃ³ (Ä‘á»ƒ tÃ­nh PPCT)
  if (!foundChuDe && month) {
    chuDeSo = MONTH_TO_CHU_DE[month] || 1;
  }

  // Náº¿u tÃ¬m tháº¥y chá»§ Ä‘á» trong DB, cáº­p nháº­t cÃ¡c thÃ´ng sá»‘
  let chuDeContext = "";
  let tenChuDe = topic;

  if (foundChuDe) {
    tenChuDe = foundChuDe.ten;
    chuDeContext = taoPromptContextTuChuDe(foundChuDe, gradeNumber);
    if (foundChuDe.mach_noi_dung) machNoiDung = foundChuDe.mach_noi_dung;

    const match = foundChuDe.ma.match(/\d+\.(\d+)/);
    if (match) chuDeSo = Number.parseInt(match[1]);
  }

  // TÃ­nh toÃ¡n PPCT vÃ  Thá»i lÆ°á»£ng dá»±a trÃªn Chá»§ Ä‘á» sá»‘ Ä‘Ã£ xÃ¡c Ä‘á»‹nh
  let ppctContext = "";
  let phanBoThoiGianContext = "";
  let ppctInfo = null;

  ppctInfo = getPPCTChuDe(gradeNumber, chuDeSo);
  if (ppctInfo) {
    ppctContext = taoContextPPCT(gradeNumber, chuDeSo);
    phanBoThoiGianContext = taoContextPhanBoThoiGian(gradeNumber, chuDeSo);
  }

  if (month && !ppctInfo && !foundChuDe) {
    // Logic cÅ©: Náº¿u váº«n khÃ´ng tÃ¬m Ä‘Æ°á»£c gÃ¬ thÃ¬ dÃ¹ng map thÃ¡ng máº·c Ä‘á»‹nh
    chuDeSo = MONTH_TO_CHU_DE[month] || 1;
    ppctInfo = getPPCTChuDe(gradeNumber, chuDeSo);
    if (ppctInfo) {
      ppctContext = taoContextPPCT(gradeNumber, chuDeSo);
      phanBoThoiGianContext = taoContextPhanBoThoiGian(gradeNumber, chuDeSo);
    }
  }

  // Láº¥y danh sÃ¡ch hoáº¡t Ä‘á»™ng chi tiáº¿t tá»« kntt-activities-database
  let hoatDongContext = "";
  if (month) {
    const chuDeInfo = getChuDeTheoThangFromActivities(gradeNumber, month);
    if (chuDeInfo && chuDeInfo.length > 0) {
      const firstChuDe = chuDeInfo[0];
      const hoatDongList = getHoatDongTheoChuDe(gradeNumber, firstChuDe.stt);
      if (hoatDongList.length > 0) {
        hoatDongContext = `
DANH SÃCH HOáº T Äá»˜NG CHI TIáº¾T Tá»ª SGK(${hoatDongList.length} hoáº¡t Ä‘á»™ng):
${hoatDongList
            .map((hd, i) => `${i + 1}. ${hd.ten}${hd.mo_ta ? ` - ${hd.mo_ta}` : ""}`)
            .join("\n")
          }
`;
      }
    }
  }

  // Láº¥y hÆ°á»›ng dáº«n sÆ° pháº¡m tá»« hdtn-pedagogical-guide
  const bloomInfo = getMucDoBloomTheoKhoi(gradeNumber);
  const cv5512Context = taoContextKHBD_CV5512(
    gradeNumber,
    tenChuDe,
    machNoiDung
  );

  // Láº¥y cÃ¢u há»i gá»£i má»Ÿ
  let cauHoiContext = "";
  const khoiCauHoi = getCauHoiTheoKhoi(gradeNumber);
  if (khoiCauHoi) {
    cauHoiContext = `
============================================================
CÃ‚U Há»ŽI Gá»¢I Má»ž (ÄÃƒ NGHIÃŠN Cá»¨U THEO Äá»˜ TUá»”I VÃ€ Má»¤C TIÃŠU NÄ‚NG Lá»°C)
============================================================

TRá»ŒNG TÃ‚M KHá»I ${gradeNumber}: ${khoiCauHoi.trong_tam}
Má»¤C TIÃŠU CÃ‚U Há»ŽI: ${khoiCauHoi.muc_tieu_cau_hoi}

${taoContextCauHoiGoiMo(gradeNumber, topic)}

HÆ¯á»šNG DáºªN Sá»¬ Dá»¤NG CÃ‚U Há»ŽI Gá»¢I Má»ž:
- Sá»­ dá»¥ng cÃ¢u há»i phÃ¹ há»£p trong pháº§n "BÆ°á»›c 1: Chuyá»ƒn giao nhiá»‡m vá»¥" Ä‘á»ƒ khÆ¡i gá»£i HS suy nghÄ©
- Chá»n cÃ¢u há»i theo loáº¡i phÃ¹ há»£p vá»›i má»¥c tiÃªu hoáº¡t Ä‘á»™ng:
  + QUAN_SAT, KET_NOI: DÃ¹ng cho Hoáº¡t Ä‘á»™ng Khá»Ÿi Ä‘á»™ng
  + PHAN_BIEN, TU_DUY, DA_CHIEU, PHAN_TICH: DÃ¹ng cho Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡
  + THUC_HANH, CHIEN_LUOC, HANH_DONG: DÃ¹ng cho Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p
  + TONG_HOP, GIA_TRI, CAM_XUC: DÃ¹ng cho Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng
- CÃ³ thá»ƒ Ä‘iá»u chá»‰nh cÃ¢u há»i cho phÃ¹ há»£p vá»›i bá»‘i cáº£nh cá»¥ thá»ƒ cá»§a bÃ i há»c
`;
  }

  const shdcShlContext = taoContextSHDC_SHL(gradeNumber, chuDeSo);
  const tieuChiDanhGiaContext = taoContextTieuChiDanhGia(topic, gradeNumber);
  const bangBieuContext = taoContextBangBieu(topic);

  const phieuHocTapContext = taoContextPhieuHocTap(topic, topic);
  const rubricContext = taoContextRubric(topic);
  const danhGiaKHBDContext = taoContextDanhGiaKHBD(topic, []);

  let activitySuggestionsContext = "";
  if (
    activitySuggestions &&
    (activitySuggestions.shdc ||
      activitySuggestions.hdgd ||
      activitySuggestions.shl)
  ) {
    activitySuggestionsContext = `
============================================================
Gá»¢I Ã Cá»¤ THá»‚ Tá»ª GIÃO VIÃŠN CHO Tá»ªNG LOáº I HOáº T Äá»˜NG
============================================================

QUAN TRá»ŒNG: GiÃ¡o viÃªn Ä‘Ã£ cung cáº¥p gá»£i Ã½ cá»¥ thá»ƒ sau Ä‘Ã¢y. AI PHáº¢I Æ°u tiÃªn sá»­ dá»¥ng cÃ¡c gá»£i Ã½ nÃ y Ä‘á»ƒ thiáº¿t káº¿ ná»™i dung phÃ¹ há»£p:

${activitySuggestions.shdc
        ? `**Gá»¢I Ã CHO SINH HOáº T DÆ¯á»šI Cá»œ (SHDC):**
${activitySuggestions.shdc}

â†’ HÃ£y thiáº¿t káº¿ cÃ¡c hoáº¡t Ä‘á»™ng SHDC dá»±a trÃªn gá»£i Ã½ trÃªn, Ä‘áº£m báº£o:
  - PhÃ¹ há»£p vá»›i quy mÃ´ toÃ n trÆ°á»ng
  - Thá»i lÆ°á»£ng 15-20 phÃºt/buá»•i
  - CÃ³ tÃ­nh tÆ°Æ¡ng tÃ¡c cao vá»›i há»c sinh
`
        : ""
      }

${activitySuggestions.hdgd
        ? `**Gá»¢I Ã CHO HOáº T Äá»˜NG GIÃO Dá»¤C (HÄGD):**
${activitySuggestions.hdgd}

â†’ HÃ£y thiáº¿t káº¿ cÃ¡c hoáº¡t Ä‘á»™ng HÄGD dá»±a trÃªn gá»£i Ã½ trÃªn, Ä‘áº£m báº£o:
  - Äa dáº¡ng phÆ°Æ¡ng phÃ¡p (tháº£o luáº­n, Ä‘Ã³ng vai, dá»± Ã¡n...)
  - TÃ­ch há»£p NLS vÃ  giÃ¡o dá»¥c Ä‘áº¡o Ä‘á»©c
  - CÃ³ sáº£n pháº©m há»c táº­p cá»¥ thá»ƒ
`
        : ""
      }

${activitySuggestions.shl
        ? `**Gá»¢I Ã CHO SINH HOáº T Lá»šP (SHL):**
${activitySuggestions.shl}

â†’ HÃ£y thiáº¿t káº¿ cÃ¡c hoáº¡t Ä‘á»™ng SHL dá»±a trÃªn gá»£i Ã½ trÃªn, Ä‘áº£m báº£o:
  - PhÃ¹ há»£p vá»›i quy mÃ´ lá»›p há»c
  - Thá»i lÆ°á»£ng 45 phÃºt/buá»•i
  - Táº­p trung vÃ o pháº£n Ã¡nh, Ä‘Ã¡nh giÃ¡ vÃ  cam káº¿t hÃ nh Ä‘á»™ng
`
        : ""
      }
`;
  }

  const nlsContext = taoContextNLSChiTiet(gradeNumber, topic);

  // TÃ¬m topic trong curriculum cÅ© (backup)
  let topicInfo = null;
  if (curriculum) {
    for (const category of Object.values(curriculum.themes)) {
      for (const t of category.topics) {
        if (
          topic.toLowerCase().includes(t.name.toLowerCase()) ||
          t.name.toLowerCase().includes(topic.toLowerCase())
        ) {
          topicInfo = {
            ...t,
            categoryName: category.name,
          };
          break;
        }
      }
      if (topicInfo) break;
    }
  }

  const nlsFramework = Object.entries(DIGITAL_LITERACY_FRAMEWORK)
    .map(([k, v]) => `- NLS ${k}: ${v.name}`)
    .join("\n");

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}`)
    .join("\n");

  let tasksSection = "";
  if (tasks && tasks.length > 0) {
    tasksSection = `
DANH SÃCH NHIá»†M Vá»¤ Cáº¦N THIáº¾T Káº¾ CHI TIáº¾T VÃ€ PHÃ‚N Bá»” THá»œI GIAN:
LÆ¯U Ã: Náº¿u trong mÃ´ táº£ nhiá»‡m vá»¥ cÃ³ ghi (Thá»i gian phÃ¢n bá»•: ...), báº¡n Báº®T BUá»˜C pháº£i thiáº¿t káº¿ hoáº¡t Ä‘á»™ng sao cho vá»«a khÃ­t vá»›i thá»i gian Ä‘Ã³.

${tasks
        .map(
          (t, i) => `
Nhiá»‡m vá»¥ ${i + 1}: ${t.name}
- Ná»™i dung & Thá»i gian yÃªu cáº§u: ${t.description}
- Cáº§n táº¡o: Má»¥c tiÃªu, Ná»™i dung chi tiáº¿t, Ká»¹ nÄƒng cáº§n Ä‘áº¡t, Sáº£n pháº©m dá»± kiáº¿n, vÃ  4 bÆ°á»›c tá»• chá»©c thá»±c hiá»‡n (KhÃ¡m phÃ¡ - Káº¿t ná»‘i - Thá»±c hÃ nh - Váº­n dá»¥ng)
`
        )
        .join("\n")}
`;
  }

  // NLS Suggestions
  const nlsSuggestions = goiYNLSTheoChuDe(topic);
  const nlsSuggestionText = nlsSuggestions.length > 0
    ? nlsSuggestions.map(nl => `- ${nl.ma} (${nl.ten}): ${nl.vi_du_tich_hop.join(", ")}`).join("\n")
    : "Tá»± Ä‘á» xuáº¥t 1-2 nÄƒng lá»±c sá»‘ phÃ¹ há»£p (Tra cá»©u, Táº¡o ná»™i dung, hoáº·c An toÃ n sá»‘).";


  return `
# VAI TRÃ’: ChuyÃªn gia tháº©m Ä‘á»‹nh vÃ  phÃ¡t triá»ƒn chÆ°Æ¡ng trÃ¬nh HÄTN, HN 12 (ChÆ°Æ¡ng trÃ¬nh 2018).

# Dá»® LIá»†U THAM KHáº¢O (INPUT):

1. **Ná»™i dung thá»±c táº¿ tá»« KHBH cÅ© (PDF Input):**
${hasFile ? `
   (Há»† THá»NG ÄÃƒ Gá»¬I KÃˆM TÃ€I LIá»†U PDF/áº¢NH)
   - Nhiá»‡m vá»¥ cá»§a báº¡n lÃ  Äá»ŒC Ká»¸ tÃ i liá»‡u Ä‘Ã­nh kÃ¨m nÃ y.
   - TrÃ­ch xuáº¥t toÃ n bá»™: TÃªn bÃ i, Má»¥c tiÃªu, Tiáº¿n trÃ¬nh hoáº¡t Ä‘á»™ng cÅ©.
   - Nháº­n diá»‡n cÃ¡c Ä‘iá»ƒm yáº¿u: Má»¥c tiÃªu thá»¥ Ä‘á»™ng (Biáº¿t, Hiá»ƒu...), Hoáº¡t Ä‘á»™ng sÆ¡ sÃ i, Thiáº¿u cÃ´ng nghá»‡.
` : `
   (KHÃ”NG CÃ“ TÃ€I LIá»†U ÄÃNH KÃˆM)
   - Giáº£ Ä‘á»‹nh: GiÃ¡o viÃªn cáº§n xÃ¢y dá»±ng bÃ i má»›i hoÃ n toÃ n tá»« con sá»‘ 0.
   - HÃ£y sá»­ dá»¥ng 100% dá»¯ liá»‡u chuáº©n tá»« há»‡ thá»‘ng dÆ°á»›i Ä‘Ã¢y.
`}

2. **Dá»¯ liá»‡u chuáº©n tá»« Kho dá»¯ liá»‡u Há»‡ thá»‘ng (Database Injection):**

   a) **ThÃ´ng tin chá»§ Ä‘á» (Tra cá»©u tá»« Database ChÆ°Æ¡ng trÃ¬nh):**
   - TÃªn chá»§ Ä‘á» chuáº©n: "${tenChuDe}"
   - Máº¡ch ná»™i dung: ${machNoiDung}
   - **YÃªu cáº§u cáº§n Ä‘áº¡t (YCCÄ) & Má»¥c tiÃªu chuáº©n:**
${chuDeContext}

   b) **Gá»£i Ã½ hoáº¡t Ä‘á»™ng chuáº©n cá»§a SGK (Tham kháº£o):**
${hoatDongContext || "   - (ChÆ°a cÃ³ dá»¯ liá»‡u chi tiáº¿t, hÃ£y bÃ¡m sÃ¡t tÃªn chá»§ Ä‘á»)"}

   c) **Äá»‹nh hÆ°á»›ng NÄƒng lá»±c sá»‘ (Theo ThÃ´ng tÆ° 02/2025):**
   - Há»‡ thá»‘ng gá»£i Ã½ cÃ¡c nÄƒng lá»±c sau lÃ  phÃ¹ há»£p nháº¥t cho chá»§ Ä‘á» nÃ y:
${nlsSuggestionText}

   d) **HÆ°á»›ng dáº«n phÃ¢n bá»• thá»i gian (PPCT):**
${phanBoThoiGianContext || HUONG_DAN_AI_SU_DUNG_PPCT}

${activitySuggestionsContext ? `
   e) **YÃªu cáº§u Ä‘áº·c biá»‡t tá»« GiÃ¡o viÃªn (User Custom):**
${activitySuggestionsContext}
` : ""}

# NHIá»†M Vá»¤ (AUDIT & UPGRADE):
HÃ£y phÃ¢n tÃ­ch dá»¯ liá»‡u cÅ© (náº¿u cÃ³) vÃ  tÃ¡i cáº¥u trÃºc láº¡i thÃ nh Káº¿ hoáº¡ch dáº¡y há»c (KHBD) chuáº©n 5512.

1. **Má»¥c tiÃªu (Audit & Standardize):** 
   - RÃ€ SOÃT: Náº¿u file cÅ© dÃ¹ng Ä‘á»™ng tá»« thá»¥ Ä‘á»™ng (Hiá»ƒu, Biáº¿t), hÃ£y *Gáº CH Bá»Ž* vÃ  thay báº±ng Ä‘á»™ng tá»« hÃ nh Ä‘á»™ng thang Bloom (PhÃ¢n tÃ­ch, Thiáº¿t káº¿, Thá»±c hiá»‡n, ÄÃ¡nh giÃ¡) dá»±a trÃªn má»¥c "YÃªu cáº§u cáº§n Ä‘áº¡t" á»Ÿ trÃªn.

2. **Thiáº¿t bá»‹ & Há»c liá»‡u (Digital Upgrade):**
   - Cáº¬P NHáº¬T: Báº¯t buá»™c bá»• sung cÃ´ng cá»¥ sá»‘ (NLS) Ä‘Ã£ gá»£i Ã½ á»Ÿ má»¥c 2c vÃ o pháº§n "Thiáº¿t bá»‹ dáº¡y há»c" vÃ  "Tiáº¿n trÃ¬nh".
   - VÃ­ dá»¥: Thay vÃ¬ "MÃ¡y chiáº¿u", hÃ£y ghi "MÃ¡y chiáº¿u, Padlet (tháº£o luáº­n), Canva (thiáº¿t káº¿)".

3. **Tiáº¿n trÃ¬nh Hoáº¡t Ä‘á»™ng (Enrich & Deepen):**
   - SO SÃNH: Äá»‘i chiáº¿u hoáº¡t Ä‘á»™ng trong file cÅ© vá»›i "Gá»£i Ã½ hoáº¡t Ä‘á»™ng chuáº©n" (Má»¥c 2b).
   - NÃ‚NG Cáº¤P: Náº¿u hoáº¡t Ä‘á»™ng cÅ© sÆ¡ sÃ i, hÃ£y VIáº¾T Láº I HOÃ€N TOÃ€N dá»±a trÃªn gá»£i Ã½ chuáº©n, thÃªm chi tiáº¿t cÃ¡c bÆ°á»›c thá»±c hiá»‡n (GV lÃ m gÃ¬, HS lÃ m gÃ¬).
   - Äá»ŠNH Dáº NG: Sá»­ dá»¥ng triá»‡t Ä‘á»ƒ cáº¥u trÃºc **{{cot_1}}** vÃ  **{{cot_2}}** cho pháº§n "Tá»• chá»©c thá»±c hiá»‡n".

# YÃŠU Cáº¦U OUTPUT JSON (QUAN TRá»ŒNG - Báº®T BUá»˜C):
- Tráº£ vá» **DUY NHáº¤T** má»™t khá»‘i JSON há»£p lá»‡. 
- KhÃ´ng viáº¿t lá»i dáº«n. KhÃ´ng Markdown dÆ° thá»«a ngoÃ i block JSON.
- **Quy táº¯c vÄƒn báº£n:** Má»i kÃ½ tá»± xuá»‘ng dÃ²ng trong ná»™i dung JSON pháº£i chuyá»ƒn thÃ nh \`\\n\`.

\`\`\`json
{
  "ma_chu_de": "${grade}.${chuDeSo}",
  "ten_bai": "${tenChuDe}",
  "so_tiet": "${duration}",
  "muc_tieu_kien_thuc": "- [Äá»™ng tá»« hÃ nh Ä‘á»™ng] ... (BÃ¡m sÃ¡t YCCÄ)\\n- [Äá»™ng tá»« hÃ nh Ä‘á»™ng] ...",
  "muc_tieu_nang_luc": "a) NÄƒng lá»±c chung:\\n- Tá»± chá»§ vÃ  tá»± há»c: ...\\n- Giao tiáº¿p vÃ  há»£p tÃ¡c: ...\\n\\nb) NÄƒng lá»±c Ä‘áº·c thÃ¹:\\n- ThÃ­ch á»©ng...: ...\\n- Thiáº¿t káº¿...: ...",
  "muc_tieu_pham_chat": "- TrÃ¡ch nhiá»‡m: ...\\n- NhÃ¢n Ã¡i: ...",
  "gv_chuan_bi": "- MÃ¡y tÃ­nh, Tivi\\n- [CÃ´ng cá»¥ sá»‘ tá»« má»¥c 2c]...\\n- Phiáº¿u há»c táº­p...",
  "hs_chuan_bi": "- SGK, Smartphone (há»— trá»£ há»c táº­p)...",
  "shdc": "TÃªn hoáº¡t Ä‘á»™ng: [TÃªn tá»« gá»£i Ã½].\\nHÃ¬nh thá»©c: [SÃ¢n kháº¥u hÃ³a/Diá»…n Ä‘Ã n].\\nMÃ´ táº£: [TÃ³m táº¯t ká»‹ch báº£n háº¥p dáº«n].",
  "shl": "TÃªn hoáº¡t Ä‘á»™ng: [TÃªn tá»« gá»£i Ã½].\\nHÃ¬nh thá»©c: [Tháº£o luáº­n/SÆ¡ káº¿t].\\nMÃ´ táº£: [TÃ³m táº¯t ká»‹ch báº£n háº¥p dáº«n].",
  "hoat_dong_khoi_dong": "a) Má»¥c tiÃªu: ...\\nb) Ná»™i dung: ...\\nc) Sáº£n pháº©m: ...\\nd) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "hoat_dong_kham_pha": "a) Má»¥c tiÃªu: ...\\nb) Ná»™i dung: ...\\nc) Sáº£n pháº©m: ...\\nd) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "hoat_dong_luyen_tap": "a) Má»¥c tiÃªu: ...\\nb) Ná»™i dung: ...\\nc) Sáº£n pháº©m: ...\\nd) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "hoat_dong_van_dung": "a) Má»¥c tiÃªu: ...\\nb) Ná»™i dung: ...\\nc) Sáº£n pháº©m: ...\\nd) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "ho_so_day_hoc": "PHIáº¾U Há»ŒC Táº¬P:\\n...\\nRUBRIC ÄÃNH GIÃ:\\n...",
  "tich_hop_nls": "- [Hoáº¡t Ä‘á»™ng]: Sá»­ dá»¥ng [CÃ´ng cá»¥] Ä‘á»ƒ [Má»¥c Ä‘Ã­ch]...",
  "tich_hop_dao_duc": "- [Hoáº¡t Ä‘á»™ng]: GiÃ¡o dá»¥c pháº©m cháº¥t [TÃªn] qua tÃ¬nh huá»‘ng...",
  "huong_dan_ve_nha": "..."
}
\`\`\`
QUAN TRá»ŒNG: Báº¡n chá»‰ Ä‘Æ°á»£c tráº£ vá» DUY NHáº¤T má»™t khá»‘i mÃ£ JSON há»£p lá»‡. KhÃ´ng Ä‘Æ°á»£c viáº¿t thÃªm lá»i dáº«n nhÆ° "ÄÃ¢y lÃ  káº¿t quáº£...", "DÆ°á»›i Ä‘Ã¢y lÃ  JSON...". Báº¯t Ä‘áº§u ngay báº±ng kÃ½ tá»± { vÃ  káº¿t thÃºc báº±ng }.
`;
}

// ============================================================
// PHáº¦N 7: HÃ€M Táº O PROMPT TÃCH Há»¢P (KHI CÃ“ MáºªU Sáº´N)
// ============================================================

export function getKHDHIntegrationPrompt(
  grade: string,
  topic: string,
  templateContent: string
): string {
  const curriculum =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];

  const nlsFramework = Object.entries(DIGITAL_LITERACY_FRAMEWORK)
    .map(([k, v]) => `- NLS ${k}: ${v.name}`)
    .join("\n");

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}`)
    .join("\n");

  return `${KHDH_ROLE}

NHIá»†M Vá»¤ Äáº¶C BIá»†T: TÃCH Há»¢P NLS VÃ€ Äáº O Äá»¨C VÃ€O MáºªU KHDH CÃ“ Sáº´N

TÃ´i Ä‘Ã£ cÃ³ sáºµn má»™t Káº¿ hoáº¡ch dáº¡y há»c. Nhiá»‡m vá»¥ cá»§a báº¡n lÃ :
1. Äá»c vÃ  phÃ¢n tÃ­ch ná»™i dung máº«u KHDH
2. XÃ¡c Ä‘á»‹nh vá»‹ trÃ­ PHÃ™ Há»¢P Ä‘á»ƒ chÃ¨n NLS vÃ  Äáº¡o Ä‘á»©c
3. Táº¡o ná»™i dung tÃ­ch há»£p Gáº®N Vá»šI Tá»ªNG HOáº T Äá»˜NG trong máº«u

Dá»® LIá»†U Äáº¦U VÃ€O:

Khá»‘i lá»›p: ${grade}
Má»©c Ä‘á»™ Bloom: ${curriculum?.bloomLevel || "Nháº­n biáº¿t, Hiá»ƒu"}
Chá»§ Ä‘á»/BÃ i há»c: "${topic}"

Ná»˜I DUNG MáºªU KHDH ÄÃƒ CÃ“:
---
${templateContent.substring(0, 2000)}
---

============================================================
NLS THEO CHá»¦ Äá»€
============================================================

${taoContextNLSChiTiet(Number.parseInt(grade), topic)}

============================================================
TIÃŠU CHÃ ÄÃNH GIÃ NLS THEO CHá»¦ Äá»€
============================================================

${goiYNLSTheoChuDe(topic)}

${INTEGRATION_RULES}

KHUNG NÄ‚NG Lá»°C Sá» (chá»n 2-4 phÃ¹ há»£p vá»›i cÃ¡c hoáº¡t Ä‘á»™ng trong máº«u):
${nlsFramework}

KHUNG PHáº¨M CHáº¤T (chá»n 1-2 phÃ¹ há»£p):
${moralThemes}

${FORMAT_RULES}

Äá»ŠNH Dáº NG Äáº¦U RA - JSON thuáº§n tÃºy:

{
  "tich_hop_nls": "TÃCH Há»¢P NLS THEO HOáº T Äá»˜NG TRONG MáºªU:\\n\\n- Hoáº¡t Ä‘á»™ng Khá»Ÿi Ä‘á»™ng: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ cá»¥ thá»ƒ: GV lÃ m gÃ¬, HS lÃ m gÃ¬, cÃ´ng cá»¥ gÃ¬].\\n\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ cá»¥ thá»ƒ].\\n\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ sáº£n pháº©m sá»‘ HS táº¡o].\\n\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: NLS [MÃ£] ([TÃªn]) - [MÃ´ táº£ + nháº¯c an toÃ n thÃ´ng tin].",
  "tich_hop_dao_duc": "TÃCH Há»¢P GIÃO Dá»¤C Äáº O Äá»¨C THEO HOáº T Äá»˜NG:\\n\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: [Pháº©m cháº¥t] - [TÃ¬nh huá»‘ng/ná»™i dung cá»¥ thá»ƒ tá»« máº«u Ä‘á»ƒ HS suy ngáº«m].\\n\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: [Pháº©m cháº¥t] - [BÃ i táº­p Ä‘Ã³ng vai/xá»­ lÃ½ tÃ¬nh huá»‘ng].\\n\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: [Pháº©m cháº¥t] - [Cam káº¿t hÃ nh Ä‘á»™ng cá»¥ thá»ƒ].",
  "ky_thuat_day_hoc": "KHUNG Ká»¸ THUáº¬T Dáº Y Há»ŒC:\\n\\n- [KyThuatDayHoc1]\\n\\n- [KyThuatDayHoc2]",
  "tich_hop_dao_duc_va_bai_hat": "Tá»”NG Há»¢P Äáº O Äá»¨C VÃ€ BÃ€I HÃT:\\n\\n- Hoáº¡t Ä‘á»™ng KhÃ¡m phÃ¡: [Pháº©m cháº¥t] - [BÃ i hÃ¡t/video gá»£i má»Ÿ].\\n\\n- Hoáº¡t Ä‘á»™ng Luyá»‡n táº­p: [Pháº©m cháº¥t] - [BÃ i hÃ¡t/video liÃªn quan].\\n\\n- Hoáº¡t Ä‘á»™ng Váº­n dá»¥ng: [Pháº©m cháº¥t] - [BÃ i hÃ¡t/video káº¿t thÃºc]."
}`;
}

// ============================================================
// EXPORT
// ============================================================

export default {
  KHDH_ROLE,
  KHDH_TASK,
  INTEGRATION_RULES,
  ACTIVITY_STRUCTURE,
  FORMAT_RULES,
  getKHDHPrompt,
  getKHDHIntegrationPrompt,
};
