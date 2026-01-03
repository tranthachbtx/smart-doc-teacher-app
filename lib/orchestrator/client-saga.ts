
/**
 * ANTIGRAVITY CLIENT-SIDE ORCHESTRATOR (v6.0)
 * Specialized for "Slow Cooking" 30-50 page lesson plans.
 * Bypasses Vercel Timeouts and reduces Shadow Ban risk via IP Distribution.
 */

export interface SagaTask {
    id: string;
    title: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    output?: string;
    gist?: string;
    error?: string;
    retryCount: number;
}

export interface SagaJob {
    jobId: string;
    grade: string;
    topic: string;
    tasks: SagaTask[];
    status: 'idle' | 'architecting' | 'processing' | 'completed' | 'failed';
    startTime?: number;
    lastUpdateTime?: number;
    lessonFile?: { mimeType: string; data: string; name: string };
}

const DB_NAME = 'AntigravitySagaDB';
const STORE_NAME = 'jobs';

export async function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'jobId' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveJob(job: SagaJob) {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(job);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getJob(jobId: string): Promise<SagaJob | null> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(jobId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

export async function listJobs(): Promise<SagaJob[]> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

/**
 * TOKEN BUCKET RATE LIMITER
 */
class TokenBucket {
    private getRefillRate(): number {
        const hour = new Date().getHours();
        // Giờ thấp điểm (đêm): nạp 5 thẻ/phút. Giờ cao điểm (ngày): 1 thẻ/phút.
        if (hour >= 22 || hour <= 6) return 5;
        return 1;
    }

    async waitForToken() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;

        const rate = this.getRefillRate();
        const refillAmount = (elapsed * rate) / 60000;

        if (refillAmount >= 1) {
            this.tokens = Math.min(this.capacity, this.tokens + Math.floor(refillAmount));
            this.lastRefill = now;
        }

        if (this.tokens < 1) {
            const waitTime = 60000 - (now - this.lastRefill);
            console.log(`[AdaptiveRate] Bucket empty. Current rate: ${rate} tpm. Cooling down for ${Math.round(waitTime / 1000)}s...`);
            await new Promise(r => setTimeout(r, Math.max(0, waitTime)));
            this.tokens = 1;
            this.lastRefill = Date.now();
        }

        this.tokens--;
    }
}

const bucket = new TokenBucket();

/**
 * DECORRELATED JITTER BACKOFF
 * Formula: sleep = min(cap, random(base, sleep * 3))
 */
async function backoff(attempt: number, currentSleep: number): Promise<number> {
    const base = 5000; // 5s
    const cap = 60000; // 60s
    const nextSleep = Math.min(cap, Math.floor(Math.random() * (currentSleep * 3 - base + 1)) + base);
    console.log(`[Resilience] Backing off for ${Math.round(nextSleep / 1000)}s (Attempt ${attempt})...`);
    await new Promise(r => setTimeout(r, nextSleep));
    return nextSleep;
}

/**
 * CALL AI VIA PROXY (Client-Side)
 */
async function callAIProxy(prompt: string, model = "gemini-1.5-flash", file?: { mimeType: string, data: string }) {
    await bucket.waitForToken();

    const proxyUrl = process.env.NEXT_PUBLIC_GEMINI_PROXY_URL || "";

    if (!proxyUrl || proxyUrl.includes("your-worker-name")) {
        throw new Error("CHƯA CẤU HÌNH PROXY: Vui lòng thay đổi NEXT_PUBLIC_GEMINI_PROXY_URL trong file .env.local thành địa chỉ Cloudflare Worker của bạn.");
    }

    const system = `VAI TRÒ: Chuyên gia Sư phạm Cao cấp (MOET 5512).
CHIẾN LƯỢC: 'Review & Upgrade' (Đánh giá và Nâng cấp).
NHIỆM VỤ: KHÔNG viết mới hoàn toàn. Hãy đọc giáo án cũ trong PDF đính kèm, giữ nguyên ý tưởng cốt lõi và NÂNG CẤP cấu trúc, ngôn ngữ, phương pháp (Bloom, Năng lực số, Đạo đức) để đạt độ dài 50 trang.
ĐỊNH DẠNG: Markdown thuần túy. KHÔNG dùng khối JSON.
NGÔN NGỮ: Tiếng Việt.`;

    const parts: any[] = [{ text: `${system}\n\nPROMPT:\n${prompt}` }];
    if (file && file.data) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType || "application/pdf",
                data: file.data
            }
        });
    }

    const targetUrl = proxyUrl.startsWith('http') ? proxyUrl : `https://${proxyUrl}`;
    const endpoint = `${targetUrl.replace(/\/$/, '')}/v1beta/models/${model}:generateContent`;

    let attempt = 0;
    let sleepTime = 5000;

    while (attempt < 3) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Antigravity-Source": "Client-Saga-v6.2",
                    "X-Antigravity-Strategy": "Review-Upgrade"
                },
                body: JSON.stringify({ contents: [{ parts }] })
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 429 || response.status >= 500) {
                    attempt++;
                    sleepTime = await backoff(attempt, sleepTime);
                    continue;
                }
                throw new Error(`Proxy Error (${response.status}): ${errorText}`);
            }

            const json = await response.json();
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("Empty AI response");
            return text;
        } catch (e: any) {
            if (attempt >= 2) throw e;
            attempt++;
            sleepTime = await backoff(attempt, sleepTime);
        }
    }
}

export class ClientSagaOrchestrator {
    private job: SagaJob;
    private onUpdate: (job: SagaJob) => void;

    constructor(job: SagaJob, onUpdate: (job: SagaJob) => void) {
        this.job = job;
        this.onUpdate = onUpdate;
    }

    private async update(updates: Partial<SagaJob>) {
        this.job = { ...this.job, ...updates, lastUpdateTime: Date.now() };
        await saveJob(this.job);
        this.onUpdate(this.job);
    }

    async run() {
        if (this.job.status === 'idle') {
            await this.architectPhase();
        }

        if (this.job.status === 'processing' || this.job.status === 'architecting') {
            await this.expansionPhase();
        }
    }

    private async architectPhase() {
        await this.update({ status: 'architecting' });
        try {
            const file = this.job.lessonFile;
            let dynamicBlueprint = null;

            if (file) {
                try {
                    console.log("[Saga] Analyzing PDF Context for Custom Architecture...");
                    const architectPrompt = `
                    VAI TRÒ: Chuyên gia Phân tích Sư phạm & Kiến trúc sư Giáo án.
                    NHIỆM VỤ: Phân tích tệp PDF đính kèm (là giáo án cũ) và thiết kế một Dàn ý tối ưu hóa theo CV 5512.
                    
                    YÊU CẦU:
                    1. Xác định các lỗ hổng sư phạm so với chuẩn CV 5512 (30-50 trang).
                    2. Thiết kế 8-10 Milestone (Nhiệm vụ) để lấp đầy các lỗ hổng đó.
                    
                    ĐỊNH DẠNG TRẢ VỀ JSON:
                    {
                      "tasks": [
                        { "id": "blueprint", "title": "0. Phân tích & Lập cấu trúc (Context Analysis)", "instruction": "Phân tích sâu dựa trên tệp PDF đã cung cấp" },
                        { "id": "muc_tieu_kien_thuc", "title": "1. Mục tiêu & Chuẩn bị (Deep Analysis)", "instruction": "Xác định Kiến thức, Năng lực, Phẩm chất và Thiết bị" },
                        ... (Tiếp tục các bước như hoat_dong_khoi_dong, hoat_dong_kham_pha_1,2,3, hoat_dong_luyen_tap_1,2, hoat_dong_van_dung, ho_so_day_hoc)
                      ]
                    }`;

                    const response = await callAIProxy(architectPrompt, "gemini-1.5-flash", file);
                    const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || "");
                    if (parsed.tasks) dynamicBlueprint = parsed.tasks;
                } catch (e) {
                    console.warn("[Saga] PDF Analysis failed, falling back to standard plan:", e);
                    // We don't throw here, just swallow and use fallback
                }
            }

            // Fallback to standard 5512 architecture if AI fails or no file
            const tasks: SagaTask[] = dynamicBlueprint || [
                { id: 'blueprint', title: '0. Lập dàn ý (Architecture)', status: 'pending', retryCount: 0, instruction: 'Thiết kế cấu trúc tổng thể cho 50 trang theo CV 5512' } as any,
                { id: 'muc_tieu_kien_thuc', title: '1. Mục tiêu & Chuẩn bị (Deep Analysis)', status: 'pending', retryCount: 0, instruction: 'Xác định Kiến thức, Năng lực, Phẩm chất và Thiết bị dạy học' } as any,
                { id: 'hoat_dong_khoi_dong', title: '2. HĐ: Khởi động - Tạo mâu thuẫn', status: 'pending', retryCount: 0, instruction: 'Thiết kế kịch bản dẫn dắt, trò chơi hoặc tình huống gây hứng thú' } as any,
                { id: 'shdc', title: '3. Sinh hoạt dưới cờ & Lớp', status: 'pending', retryCount: 0, instruction: 'Tích hợp các hoạt động trải nghiệm theo chủ đề của tuần' } as any,
                { id: 'hoat_dong_kham_pha_1', title: '4.1 Khám phá 1: Hình thành kiến thức', status: 'pending', retryCount: 0, instruction: 'Phát triển nội dung trọng tâm số 1 bằng Chain of Density' } as any,
                { id: 'hoat_dong_kham_pha_2', title: '4.2 Khám phá 2: Phân tích & Phản biện', status: 'pending', retryCount: 0, instruction: 'Phát triển nội dung trọng tâm số 2, tăng cường tương tác' } as any,
                { id: 'hoat_dong_kham_pha_3', title: '4.3 Khám phá 3: Tích hợp NLS & Đạo đức', status: 'pending', retryCount: 0, instruction: 'Lồng ghép năng lực số, rèn luyện phẩm chất và liên hệ thực tế' } as any,
                { id: 'hoat_dong_luyen_tap_1', title: '5.1 Luyện tập 1: Củng cố cơ bản', status: 'pending', retryCount: 0, instruction: 'Xây dựng hệ thống câu hỏi, bài tập củng cố lý thuyết' } as any,
                { id: 'hoat_dong_luyen_tap_2', title: '5.2 Luyện tập 2: Sáng tạo & Giải quyết', status: 'pending', retryCount: 0, instruction: 'Hoạt động luyện tập nâng cao, rèn luyện kỹ năng thực hành' } as any,
                { id: 'hoat_dong_van_dung', title: '6. Vận dụng: Dự án thực tế', status: 'pending', retryCount: 0, instruction: 'Thiết kế dự án, bài tập thực tế tại nhà hoặc tại lớp' } as any,
                { id: 'ho_so_day_hoc', title: '7. Hồ sơ: Phiếu & Rubric', status: 'pending', retryCount: 0, instruction: 'Tổng hợp và thiết kế các phụ lục, thang chấm điểm chi tiết' } as any,
            ];

            // Normalize task status (ensure they are all 'pending' for state machine)
            const normalizedTasks = tasks.map(t => ({ ...t, status: 'pending' as any, retryCount: 0 }));

            await this.update({ tasks: normalizedTasks, status: 'processing' });
        } catch (e: any) {
            console.error("Architect Phase Failed", e);
            await this.update({ status: 'failed' });
        }
    }

    private async expansionPhase() {
        const file = (this.job as any).lessonFile;
        const maxConcurrency = 3; // Nâng cấp: Chạy song song tối đa 3 nhiệm vụ

        while (this.job.tasks.some(t => t.status !== 'completed' && t.status !== 'failed')) {
            const pendingTasks = this.job.tasks.filter(t => t.status === 'pending');
            const processingTasks = this.job.tasks.filter(t => t.status === 'processing');

            if (processingTasks.length < maxConcurrency && pendingTasks.length > 0) {
                const taskToStart = pendingTasks[0];
                const taskIdx = this.job.tasks.findIndex(t => t.id === taskToStart.id);

                // Floating promise: Không dùng await ở đây để chạy song song
                this.executeTask(taskIdx, file);

                // Khoảng nghỉ ngắn 2s giữa các lần bắt đầu task song song để tránh burst đột ngột
                await new Promise(r => setTimeout(r, 2000));
            } else {
                // Đợi một chút trước khi kiểm tra lại trạng thái các task
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        if (this.job.status === 'processing' && this.job.tasks.every(t => t.status === 'completed')) {
            await this.update({ status: 'completed' });
        }
    }

    private async executeTask(taskIdx: number, file: any) {
        const task = this.job.tasks[taskIdx];
        try {
            const updatedTasks = [...this.job.tasks];
            updatedTasks[taskIdx] = { ...task, status: 'processing' };
            await this.update({ tasks: updatedTasks });

            const gistsContext = this.job.tasks
                .filter(t => t.status === 'completed')
                .map(t => `[${t.title}]: ${t.gist || t.output?.slice(0, 300)}`)
                .join('\n');

            const expansionPrompt = `
    BỐI CẢNH BÀI DẠY: ${this.job.topic} (Khối ${this.job.grade})
    BỐI CẢNH CÁC PHẦN ĐÃ LÀM: ${gistsContext}
    
    NHIỆM VỤ: NÂNG CẤP PHẦN "${task.title}".
    
    CHIẾN LƯỢC TIẾT KIỆM TOKEN (TEMPLATE-BASED):
    1. KHÔNG viết mới từ đầu. 
    2. Nếu có file PDF cũ, hãy chọn lọc 3-5 ý tưởng hay nhất để nâng cấp.
    3. Sử dụng cấu trúc chuẩn MOET 5512.
    
    MẪU GỢI Ý (Tham khảo):
    - Lý do: "Đặc thù môn học, khái niệm khó..."
    - Mục tiêu: "Sử dụng thang Bloom..."
    - Hoạt động: "Chuyển giao -> Thực hiện -> Báo cáo -> Kết luận."
    
    YÊU CẦU ĐẦU RA: Markdown, tối ưu hóa (1000 từ chất lượng).
    KẾT THÚC BẰNG:
    STUDENT_GIST: <tóm tắt ngắn gọn 100 chữ>
    `;

            const output = await callAIProxy(expansionPrompt, "gemini-1.5-flash", file);
            const gistMatch = output.match(/STUDENT_GIST:\s*([\s\S]*?)$/i) || output.match(/TÓM TẮT:\s*([\s\S]*?)$/i);
            const gist = gistMatch ? gistMatch[1].trim() : "";

            const finalTasks = [...this.job.tasks];
            finalTasks[taskIdx] = {
                ...task,
                status: 'completed',
                output,
                gist
            };
            await this.update({ tasks: finalTasks });

        } catch (e: any) {
            console.error(`Task ${task.id} failed`, e);
            const failTasks = [...this.job.tasks];
            failTasks[taskIdx] = { ...task, status: 'failed', error: e.message };
            await this.update({ tasks: failTasks });
        }
    }
}
    }
}
