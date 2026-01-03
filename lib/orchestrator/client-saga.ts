
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
    private tokens: number;
    private lastCheck: number;
    private readonly capacity: number = 15;
    private readonly refillRate: number = 4; // tokens per minute (smoothed)

    constructor() {
        this.tokens = 15;
        this.lastCheck = Date.now();
    }

    async waitForToken() {
        while (true) {
            const now = Date.now();
            const elapsed = now - this.lastCheck;
            this.tokens = Math.min(this.capacity, this.tokens + (elapsed * this.refillRate) / 60000);
            this.lastCheck = now;

            if (this.tokens >= 1) {
                this.tokens -= 1;
                return;
            }
            // Wait 5 seconds before checking again
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

const bucket = new TokenBucket();

/**
 * CALL AI VIA PROXY (Client-Side)
 */
async function callAIProxy(prompt: string, model = "gemini-1.5-flash", file?: { mimeType: string, data: string }) {
    await bucket.waitForToken();

    // Use NEXT_PUBLIC prefix for client-side access in Next.js
    const proxyUrl = process.env.NEXT_PUBLIC_GEMINI_PROXY_URL || "https://your-worker-name.workers.dev";

    const system = `ROLE: Expert Curriculum Developer (K12 Vietnam). 
TASK: Generate high-density MOET 5512 content.
CONTEXT: If a file is attached, it is an OLD LESSON PLAN for optimization. Keep its essence but expand it significantly.
OUTPUT: VIETNAMESE ONLY (Tiếng Việt).
QUALITY: Professional, pedagogical, creative. No fluff.`;

    const parts: any[] = [{ text: `${system}\n\nPROMPT:\n${prompt}` }];
    if (file && file.data) {
        parts.push({
            inlineData: {
                mimeType: file.mimeType || "application/pdf",
                data: file.data
            }
        });
    }

    // Ensure absolute URL
    const targetUrl = proxyUrl.startsWith('http') ? proxyUrl : `https://${proxyUrl}`;
    const endpoint = `${targetUrl.replace(/\/$/, '')}/v1beta/models/${model}:generateContent`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Antigravity-Source": "Client-Saga-v6.0"
        },
        body: JSON.stringify({ contents: [{ parts }] })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Proxy Error (${response.status}): ${errorText}`);
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty AI response");
    return text;
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
            // The Plan as defined in the report and existing UI (Using resultKeys as IDs)
            const tasks: SagaTask[] = [
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

            await this.update({ tasks, status: 'processing' });
        } catch (e: any) {
            console.error("Architect Phase Failed", e);
            await this.update({ status: 'failed' });
        }
    }

    private async expansionPhase() {
        // Current file context
        const file = (this.job as any).lessonFile;

        for (let i = 0; i < this.job.tasks.length; i++) {
            const task = this.job.tasks[i];
            if (task.status === 'completed') continue;

            try {
                const updatedTasks = [...this.job.tasks];
                updatedTasks[i] = { ...task, status: 'processing' };
                await this.update({ tasks: updatedTasks });

                // Context Injection: previous completed tasks' gists
                const gistsContext = this.job.tasks
                    .filter(t => t.status === 'completed')
                    .map(t => `[${t.title}]: ${t.gist || t.output?.slice(0, 400)}`)
                    .join('\n');

                const expansionPrompt = `
        ${file ? "SỬ DỤNG GIÁO ÁN GỐC ĐỂ TỐI ƯU HÓA: Hãy lấy kiến trúc và ý tưởng từ tệp PDF cũ đính kèm và nâng cấp nó lên tầm cao mới chuyên sâu hơn.\n" : ""}
        
        BỐI CẢNH CÁC PHẦN ĐÃ LÀM:
        ${gistsContext}
        
        NHIỆM VỤ HIỆN TẠI: Soạn thảo nội dung chi tiết cho phần "${task.title}".
        CHỈ DẪN KỸ THUẬT: ${(task as any).instruction || "Phát triển sư phạm chiều sâu theo CV 5512"}.
        
        YÊU CẦU CHẤT LƯỢNG:
        1. Tạo ra khoảng 1000-1500 từ cho phần này.
        2. Mô tả kịch bản đối thoại GV-HS cực kỳ chi tiết.
        3. Sử dụng kỹ thuật "Chain of Density" (Nén thông tin - Không viết lan man nhưng cực giàu chi tiết).
        4. Đảm bảo tính nhất quán với các phần đã hoàn thành trước đó.
        
        KẾT THÚC BẰM:
        STUDENT_GIST: <tóm tắt ngắn gọn năng lực học sinh đạt được sau phần này trong 100 chữ>
        `;

                const output = await callAIProxy(expansionPrompt, "gemini-1.5-flash", file);

                // Extract Gist
                const gistMatch = output.match(/STUDENT_GIST:\s*([\s\S]*?)$/i) || output.match(/TÓM TẮT:\s*([\s\S]*?)$/i);
                const gist = gistMatch ? gistMatch[1].trim() : "";

                updatedTasks[i] = { ...task, status: 'completed', output, gist };
                await this.update({ tasks: updatedTasks });

                // Slow cooking delay (Gap between tasks to stay in green zone)
                if (i < this.job.tasks.length - 1) {
                    console.log("Slow Cooking Cooling: 45s gap...");
                    await new Promise(r => setTimeout(r, 45000));
                }

            } catch (e: any) {
                console.error(`Task ${task.id} failed:`, e);
                const updatedTasks = [...this.job.tasks];
                updatedTasks[i] = { ...task, status: 'failed', error: e.message, retryCount: task.retryCount + 1 };
                await this.update({ tasks: updatedTasks, status: 'failed' });
                return; // Halt on error to allow user to Resume or Retry
            }
        }

        await this.update({ status: 'completed' });
    }
}
