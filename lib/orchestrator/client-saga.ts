import { SagaJob, SagaTask } from '@/lib/types/index';

// Re-export types for other modules
export type { SagaJob, SagaTask };

/**
 * ANTIGRAVITY CLIENT-SIDE ORCHESTRATOR (v6.13 - Fortress Edition)
 * Chiến thuật: Zero-CORS Architecture. 
 * Mọi yêu cầu đều đi qua Internal Tunnel để đảm bảo tính ổn định và bảo mật Key.
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

async function callAIProxy(prompt: string, model = "gemini-2.0-flash", file?: { mimeType: string, data: string }) {
    // CHỈ DÙNG INTERNAL TUNNEL - Tuyệt đối không gọi trực tiếp Proxy URL từ Client để tránh CORS
    const url = window.location.origin + "/api/gemini-tunnel/v1beta/models/" + model + ":generateContent";

    try {
        console.log(`[Saga] Routing via Tunnel: ${model}. Prompt: ${prompt.length} chars.`);
        const parts: any[] = [{ text: prompt }];
        if (file && file.data) {
            parts.push({ inlineData: { mimeType: file.mimeType || "application/pdf", data: file.data } });
        }

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts }] }),
            signal: AbortSignal.timeout(90000) // Tăng lên 90s cho các tác vụ nặng
        });

        const raw = await response.text();
        let data: any = null;
        try {
            data = raw ? JSON.parse(raw) : null;
        } catch {
            throw new Error(`Tunnel returned non-JSON (${response.status}): ${raw.slice(0, 200)}`);
        }

        if (response.ok) {
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) return text;
            throw new Error("AI trả về phản hồi trống.");
        }

        const detail = data?.detail ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)) : "";
        const errorMsg =
            data?.error?.detail?.error?.message ||
            data?.error?.message ||
            data?.error ||
            (detail ? `${data?.error || 'Server Error'} | ${detail}` : `Server Error ${response.status}`);
        throw new Error(errorMsg);

    } catch (e: any) {
        console.error("[Saga] AI Pipeline Failed:", e.message);
        throw e;
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
        let summary = "Không có tài liệu tham khảo.";

        if (file) {
            try {
                console.log("[Saga] Phase 0: Analyzing & Compressing PDF Knowledge...");
                const analysisPrompt = `VAI TRÒ: Chuyên gia phân tích nội dung. 
NHIỆM VỤ: Nghiên cứu file PDF này và trích xuất:
1. Nội dung kiến thức cốt lõi (Khái niệm, định nghĩa, công thức).
2. Các hoạt động chính đã gợi ý trong tài liệu.
3. Phong cách và mục tiêu giảng dạy.
Lưu tất cả thành một bản "Tài liệu tham khảo bối cảnh" súc tích.`;

                summary = await callAIProxy(analysisPrompt, "gemini-2.0-flash", file);
                console.log("[Saga] Context Extraction Complete. Summary length:", summary.length);
            } catch (e: any) {
                console.warn("[Saga] PDF Analysis failed. Using blank context.", e.message);
            }
        }

        const tasks: SagaTask[] = [
            { id: 'blueprint', title: '0. Phân tích bối cảnh', status: 'completed', output: summary, gist: 'Đã nén PDF thành công', retryCount: 0 },
            { id: 'muc_tieu_kien_thuc', title: '1. Mục tiêu (CV 5512)', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_khoi_dong', title: '2. Hoạt động Khởi động', status: 'pending', retryCount: 0 },
            { id: 'shdc', title: '3. Sinh hoạt dưới cờ', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_1', title: '4.1 Khám phá 1', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_2', title: '4.2 Khám phá 2', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_3', title: '4.3 Tích hợp thực tiễn', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_luyen_tap_1', title: '5.1 Luyện tập cơ bản', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_luyen_tap_2', title: '5.2 Vận dụng sáng tạo', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_van_dung', title: '6. Dự án thực tế', status: 'pending', retryCount: 0 },
            { id: 'ho_so_day_hoc', title: '7. Phụ lục & Rubric', status: 'pending', retryCount: 0 },
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

            const summary = this.job.lessonFileSummary || "Không có tài liệu tham khảo.";
            const completedGists = this.job.tasks.filter(x => x.status === 'completed').map(x => `[${x.title}]: ${x.gist}`).join("\n");

            const prompt = `CHỦ ĐỀ: ${this.job.topic} (Khối ${this.job.grade})
BỐI CẢNH PDF: ${summary}
CÁC PHẦN ĐÃ LÀM: ${completedGists}

NHIỆM VỤ: Hãy soạn thảo chi tiết mục "${t.title}" chuẩn MOET 5512.
YÊU CẦU: Viết sâu sắc, chuyên môn cao. 
KHOẢNG CÁCH: 1000 từ.
DẤU HIỆU KẾT THÚC: STUDENT_GIST: <tóm tắt ngắn gọn 1 câu>`;

            const output = await callAIProxy(prompt, "gemini-2.0-flash");
            const gist = (output.match(/STUDENT_GIST:\s*([\s\S]*)$/i)?.[1] || "Đã hoàn thành " + t.title).trim();

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
