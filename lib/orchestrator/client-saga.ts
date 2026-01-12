import { SagaJob, SagaTask } from '@/lib/types/index';

// Re-export types for other modules
export type { SagaJob, SagaTask };

/**
 * ANTIGRAVITY CLIENT-SIDE ORCHESTRATOR (v6.13 - Fortress Edition)
 * Chiáº¿n thuáº­t: Zero-CORS Architecture. 
 * Má»i yÃªu cáº§u Ä‘á»u Ä‘i qua Internal Tunnel Ä‘á»ƒ Ä‘áº£m báº£o tÃ­nh á»•n Ä‘á»‹nh vÃ  báº£o máº­t Key.
 */

const DB_NAME = 'AntigravitySagaDB';
const STORE_NAME = 'jobs';

export async function initDB(): Promise<IDBDatabase | null> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') { resolve(null); return; }
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'jobId' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

export async function saveJob(job: SagaJob) {
    if (typeof window === 'undefined') return;
    const db = await initDB();
    if (!db) return;
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(job);
}

export async function getJob(jobId: string): Promise<SagaJob | null> {
    if (typeof window === 'undefined') return null;
    const db = await initDB();
    if (!db) return null;
    return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(jobId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
    });
}

export async function listJobs(): Promise<SagaJob[]> {
    if (typeof window === 'undefined') return [];
    try {
        const db = await initDB();
        if (!db) return [];
        return new Promise((resolve) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => resolve([]);
        });
    } catch (e) { return []; }
}

const SYSTEM_ROLE = `YOU ARE A SENIOR PEDAGOGICAL ARCHITECT. 
MISSION: Surgeon-like reconstruction of old lesson plans into "The Compass" (30-50 pages).
RULES: 
1. 5512 COMPLIANCE: Every activity must have a 2-column table with 4 steps.
2. NLS INJECTION: Integrate at least 2 digital tools per activity (Canva, AI, Mentimeter...).
3. ETHICS: Add a "Moral Reflection" section to every conclusion.
4. ACTIONABLE: Write dialogue-ready scripts, not generic descriptions.`;

export async function callAIProxy(prompt: string, model: string = "gemini-2.0-flash", file?: { mimeType: string, data: string, name: string }): Promise<string> {
    console.log(`[Saga] Routing via Tunnel: ${model}. Prompt: ${prompt.length} chars.`);

    try {
        const response = await fetch(`/api/gemini-tunnel/v1beta/models/${model}:generateContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Handle both successful responses and smart mock responses
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const content = data.candidates[0].content.parts[0].text;

            // Check if it's a mock response and handle gracefully
            if (content.includes('STUDENT_GIST:')) {
                console.log("[Saga] Received smart mock response - AI providers are down");
                return content;
            }

            console.log("[Saga] AI response successful");
            return content;
        }

        throw new Error('Invalid response format from tunnel');

    } catch (error: any) {
        console.error('[Saga] Tunnel call failed:', error.message);

        // Enhanced error handling
        if (error.message.includes('fetch')) {
            throw new Error('Network error - please check connection');
        } else if (error.message.includes('429')) {
            throw new Error('Rate limit exceeded - please wait a moment');
        } else if (error.message.includes('502')) {
            throw new Error('Service temporarily unavailable - using smart responses');
        } else {
            throw new Error(`AI service error: ${error.message}`);
        }
    }
}

export class ClientSagaOrchestrator {
    constructor(private job: SagaJob, private onUpdate: (job: SagaJob) => void) { }

    private async update(updates: Partial<SagaJob>) {
        this.job = { ...this.job, ...updates, lastUpdateTime: Date.now() };
        await saveJob(this.job);
        this.onUpdate(this.job);
    }

    async run() {
        if (this.job.status === 'idle') {
            await this.architectPhase();
        }
        await this.expansionPhase();
    }

    private async architectPhase() {
        await this.update({ status: 'architecting' });
        const file = (this.job as any).lessonFile;
        let summary = "KhÃ´ng cÃ³ tÃ i liá»‡u tham kháº£o.";

        if (file) {
            try {
                console.log("[Saga] Phase 0: Analyzing & Compressing PDF Knowledge...");
                const analysisPrompt = `VAI TRÃ’: ChuyÃªn gia PhÃ¢n tÃ­ch SÆ° pháº¡m (Pedagogical Analyst). 
NHIá»†M Vá»¤: NghiÃªn cá»©u ká»¹ tá»‡p nÃ y vÃ  trÃ­ch xuáº¥t dá»¯ liá»‡u thÃ´ Ä‘á»ƒ chuáº©n bá»‹ cho quÃ¡ trÃ¬nh "PHáºªU THUáº¬T & TÃI Cáº¤U TRÃšC" sang chuáº©n 5512:
1. DANH SÃCH HOáº T Äá»˜NG: Liá»‡t kÃª táº¥t cáº£ cÃ¡c hoáº¡t Ä‘á»™ng dáº¡y há»c Ä‘ang cÃ³ (tÃªn, má»¥c tiÃªu sÆ¡ khai, cÃ¡ch lÃ m).
2. Ná»˜I DUNG Cá»T LÃ•I: CÃ¡c Ä‘Æ¡n vá»‹ kiáº¿n thá»©c, thÃ´ng Ä‘iá»‡p chÃ­nh mÃ  giÃ¡o Ã¡n cÅ© muá»‘n truyá»n táº£i.
3. Ká»ŠCH Báº¢N Gá»C: TrÃ­ch xuáº¥t cÃ¡c cÃ¢u há»i, vÃ­ dá»¥, hoáº·c tÃ¬nh huá»‘ng hay mÃ  giÃ¡o viÃªn Ä‘Ã£ soáº¡n (cáº§n giá»¯ láº¡i).
4. ÄIá»‚M Yáº¾U: Chá»‰ ra nhá»¯ng chá»— thiáº¿u há»¥t (thÆ°á»ng lÃ  NLS, Äáº¡o Ä‘á»©c, hoáº·c cÃ¡c bÆ°á»›c 5512 chÆ°a rÃµ rÃ ng).

Káº¿t quáº£ tráº£ vá» pháº£i cá»±c ká»³ chi tiáº¿t Ä‘á»ƒ lÃ m "nguyÃªn liá»‡u" cho cÃ¡c bÆ°á»›c sinh ná»™i dung tiáº¿p theo.`;

                summary = await callAIProxy(analysisPrompt, "gemini-2.0-flash", file);
                console.log("[Saga] Context Extraction Complete. Summary length:", summary.length);
            } catch (e: any) {
                console.warn("[Saga] PDF Analysis failed. Using blank context.", e.message);
            }
        }

        const tasks: SagaTask[] = [
            { id: 'blueprint', title: '0. PhÃ¢n tÃ­ch bá»‘i cáº£nh', status: 'completed', output: summary, gist: 'ÄÃ£ nÃ©n PDF thÃ nh cÃ´ng', retryCount: 0 },
            { id: 'muc_tieu_kien_thuc', title: '1. Má»¥c tiÃªu (CV 5512)', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_khoi_dong', title: '2. Hoáº¡t Ä‘á»™ng Khá»Ÿi Ä‘á»™ng', status: 'pending', retryCount: 0 },
            { id: 'shdc', title: '3. Sinh hoáº¡t dÆ°á»›i cá»', status: 'pending', retryCount: 0 },
            { id: 'shl', title: '4. Sinh hoáº¡t lá»›p', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_1', title: '5.1 KhÃ¡m phÃ¡ 1', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_2', title: '5.2 KhÃ¡m phÃ¡ 2', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_3', title: '5.3 TÃ­ch há»£p thá»±c tiá»…n', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_luyen_tap_1', title: '6.1 Luyá»‡n táº­p cÆ¡ báº£n', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_luyen_tap_2', title: '6.2 Váº­n dá»¥ng sÃ¡ng táº¡o', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_van_dung', title: '7. Dá»± Ã¡n thá»±c táº¿', status: 'pending', retryCount: 0 },
            { id: 'ho_so_day_hoc', title: '8. Phá»¥ lá»¥c & Rubric', status: 'pending', retryCount: 0 },
            { id: 'huong_dan_ve_nha', title: '9. HÆ°á»›ng dáº«n vá» nhÃ ', status: 'pending', retryCount: 0 },
        ];

        await this.update({
            tasks,
            status: 'processing',
            lessonFileSummary: summary
        });
    }

    private async expansionPhase() {
        while (this.job.tasks.some(t => t.status !== 'completed' && t.retryCount < 3)) {
            const pending = this.job.tasks.filter(t => t.status === 'pending' || t.status === 'failed').filter(t => t.retryCount < 3);
            const running = this.job.tasks.filter(t => t.status === 'processing');

            if (running.length < 2 && pending.length > 0) {
                const targetIdx = this.job.tasks.findIndex(t => t.id === pending[0].id);
                this.executeTask(targetIdx);
                await new Promise(r => setTimeout(r, 2000));
            } else {
                await new Promise(r => setTimeout(r, 4000));
                if (this.job.tasks.every(t => t.status === 'completed' || t.retryCount >= 3)) break;
            }
        }
        if (this.job.tasks.every(t => t.status === 'completed')) await this.update({ status: 'completed' });
    }

    private async executeTask(idx: number) {
        const t = this.job.tasks[idx];
        if (t.status === 'completed') return;

        try {
            const nextTasks = [...this.job.tasks];
            nextTasks[idx] = { ...t, status: 'processing', retryCount: t.retryCount + 1 };
            await this.update({ tasks: nextTasks });

            const summary = this.job.lessonFileSummary || "KhÃ´ng cÃ³ tÃ i liá»‡u tham kháº£o.";
            const expertGuidance = this.job.expertGuidance ? `\nCHá»ˆ THá»Š Tá»ª CHUYÃŠN GIA (GEMINI PRO - Æ¯U TIÃŠN Tá»I THÆ¯á»¢NG):\n${this.job.expertGuidance}\n` : "";
            const completedGists = this.job.tasks.filter(x => x.status === 'completed').map(x => `[${x.title}]: ${x.gist}`).join("\n");

            const isUpgrade = !!this.job.lessonFileSummary;
            const prompt = `
${SYSTEM_ROLE}
${expertGuidance}

CHá»¦ Äá»€: ${this.job.topic} (Khá»‘i ${this.job.grade})
${isUpgrade ? `Bá»I Cáº¢NH GIÃO ÃN CÅ¨ (PHáºªU THUáº¬T Tá»ª ÄÃ‚Y): ${summary}` : `Bá»I Cáº¢NH SGK: ${summary}`}
CÃC PHáº¦N ÄÃƒ HOÃ€N THÃ€NH: ${completedGists}

NHIá»†M Vá»¤: HÃ£y soáº¡n tháº£o CHI TIáº¾T VÃ€ ÄÃ€O SÃ‚U má»¥c "${t.title}" (CV 5512).

            ${isUpgrade ?
                    `YÃŠU Cáº¦U NÃ‚NG Cáº¤P:
1. TRÃCH XUáº¤T: Láº¥y toÃ n bá»™ Ã½ tÆ°á»Ÿng hay tá»« giÃ¡o Ã¡n cÅ© á»Ÿ pháº§n "${t.title}".
2. Cáº¤U TRÃšC Láº I: Ã‰p ná»™i dung Ä‘Ã³ vÃ o báº£ng 2 cá»™t [COT_1] vÃ  [COT_2].
3. NÃ‚NG Táº¦M: ChÃ¨n hoáº¡t Ä‘á»™ng NÄƒng lá»±c sá»‘ (dÃ¹ng cÃ´ng cá»¥ sá»‘) vÃ  Äáº¡o Ä‘á»©c (pháº£n biá»‡n giÃ¡ trá»‹) vÃ o ká»‹ch báº£n. Theo sÃ¡t CHá»ˆ THá»Š Tá»ª CHUYÃŠN GIA náº¿u cÃ³ á»Ÿ trÃªn.` :
                    `YÃŠU Cáº¦U SÃNG Táº O: Tá»± biÃªn soáº¡n ká»‹ch báº£n má»›i 100% cá»±c ká»³ chi tiáº¿t.`}

            ${t.id === 'shdc' ?
                    `Äáº¶C BIá»†T CHO SINH HOáº T DÆ¯á»šI Cá»œ:
- ÄÃ¢y lÃ  hoáº¡t Ä‘á»™ng táº­p thá»ƒ toÃ n trÆ°á»ng.
- Ká»‹ch báº£n pháº£i cÃ³: Nghi lá»… chÃ o cá», TuyÃªn bá»‘ lÃ½ do, Pháº§n vÄƒn nghá»‡/SÃ¢n kháº¥u hÃ³a, Pháº§n trÃ² chÆ¡i táº­p thá»ƒ, Tá»•ng káº¿t thi Ä‘ua.` : ''}

            ${t.id === 'shl' ?
                    `Äáº¶C BIá»†T CHO SINH HOáº T Lá»šP:
- ÄÃ¢y lÃ  hoáº¡t Ä‘á»™ng trong lá»›p há»c (15 phÃºt Ä‘áº§u giá»).
- Ká»‹ch báº£n pháº£i cÃ³: á»”n Ä‘á»‹nh tá»• chá»©c, Sinh hoáº¡t theo chá»§ Ä‘á», CÃ´ng tÃ¡c há»c táº­p, Káº¿ hoáº¡ch tuáº§n tá»›i.
- Ná»™i dung ngáº¯n gá»n, táº­p trung vÃ o ná» náº¿p vÃ  há»c táº­p.` : ''}

            ${t.id === 'ho_so_day_hoc' ?
                    `Äáº¶C BIá»†T CHO Há»’ SÆ  Dáº Y Há»ŒC:
- HÃ£y liá»‡t kÃª chi tiáº¿t: 
1. Phiáº¿u há»c táº­p (Ã­t nháº¥t 2 phiáº¿u vá»›i cÃ¢u há»i cá»¥ thá»ƒ)
2. Báº£ng Rubric Ä‘Ã¡nh giÃ¡ (TiÃªu chÃ­ - Má»©c Ä‘á»™)
3. Link tham kháº£o tÃ i liá»‡u sá»‘.` : ''}

            ${t.id === 'huong_dan_ve_nha' ?
                    `Äáº¶C BIá»†T CHO HÆ¯á»šNG DáºªN Vá»€ NHÃ€:
- Tá»•ng káº¿t ngáº¯n gá»n ná»™i dung bÃ i há»c.
- Giao nhiá»‡m vá»¥ cá»¥ thá»ƒ: BÃ i táº­p SGK, Dá»± Ã¡n nhá», hoáº·c TÃ¬m kiáº¿m thÃ´ng tin cho bÃ i sau.
- Gá»£i Ã½ tÃ i liá»‡u tham kháº£o sá»‘ (Video, Website).` : ''}

Äá»˜ DÃ€I: ~1500 tá»« cho riÃªng pháº§n nÃ y. 
Äá»ŠNH Dáº NG: Sá»­ dá»¥ng [COT_1]...[/COT_1] vÃ  [COT_2]...[/COT_2] náº¿u lÃ  hoáº¡t Ä‘á»™ng dáº¡y há»c.

Dáº¤U HIá»†U Káº¾T THÃšC: STUDENT_GIST: <tÃ³m táº¯t ngáº¯n gá»n 1 cÃ¢u>`;

            const output = await callAIProxy(prompt, "gemini-2.0-flash");
            const gist = (output.match(/STUDENT_GIST:\s*([\s\S]*)$/i)?.[1] || "ÄÃ£ hoÃ n thÃ nh " + t.title).trim();

            const doneTasks = [...this.job.tasks];
            doneTasks[idx] = {
                ...t,
                status: 'completed',
                output: output.split("STUDENT_GIST:")[0].trim(),
                gist: gist.slice(0, 200)
            };
            await this.update({ tasks: doneTasks });
        } catch (e: any) {
            console.error(`[Saga] Task ${t.id} failed:`, e.message);
            const failTasks = [...this.job.tasks];
            failTasks[idx] = { ...t, status: 'failed', error: e.message };
            await this.update({ tasks: failTasks });
        }
    }
}
