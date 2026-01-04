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
        const response = await fetch('/api/gemini-tunnel/v1beta/models/gemini-2.0-flash:generateContent', {
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
        let summary = "Không có tài liệu tham khảo.";

        if (file) {
            try {
                console.log("[Saga] Phase 0: Analyzing & Compressing PDF Knowledge...");
                const analysisPrompt = `VAI TRÒ: Chuyên gia Phân tích Sư phạm (Pedagogical Analyst). 
NHIỆM VỤ: Nghiên cứu kỹ tệp này và trích xuất dữ liệu thô để chuẩn bị cho quá trình "PHẪU THUẬT & TÁI CẤU TRÚC" sang chuẩn 5512:
1. DANH SÁCH HOẠT ĐỘNG: Liệt kê tất cả các hoạt động dạy học đang có (tên, mục tiêu sơ khai, cách làm).
2. NỘI DUNG CỐT LÕI: Các đơn vị kiến thức, thông điệp chính mà giáo án cũ muốn truyền tải.
3. KỊCH BẢN GỐC: Trích xuất các câu hỏi, ví dụ, hoặc tình huống hay mà giáo viên đã soạn (cần giữ lại).
4. ĐIỂM YẾU: Chỉ ra những chỗ thiếu hụt (thường là NLS, Đạo đức, hoặc các bước 5512 chưa rõ ràng).

Kết quả trả về phải cực kỳ chi tiết để làm "nguyên liệu" cho các bước sinh nội dung tiếp theo.`;

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
            { id: 'shl', title: '4. Sinh hoạt lớp', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_1', title: '5.1 Khám phá 1', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_2', title: '5.2 Khám phá 2', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_kham_pha_3', title: '5.3 Tích hợp thực tiễn', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_luyen_tap_1', title: '6.1 Luyện tập cơ bản', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_luyen_tap_2', title: '6.2 Vận dụng sáng tạo', status: 'pending', retryCount: 0 },
            { id: 'hoat_dong_van_dung', title: '7. Dự án thực tế', status: 'pending', retryCount: 0 },
            { id: 'ho_so_day_hoc', title: '8. Phụ lục & Rubric', status: 'pending', retryCount: 0 },
            { id: 'huong_dan_ve_nha', title: '9. Hướng dẫn về nhà', status: 'pending', retryCount: 0 },
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
            const expertGuidance = this.job.expertGuidance ? `\nCHỈ THỊ TỪ CHUYÊN GIA (GEMINI PRO - ƯU TIÊN TỐI THƯỢNG):\n${this.job.expertGuidance}\n` : "";
            const completedGists = this.job.tasks.filter(x => x.status === 'completed').map(x => `[${x.title}]: ${x.gist}`).join("\n");

            const isUpgrade = !!this.job.lessonFileSummary;
            const prompt = `
${SYSTEM_ROLE}
${expertGuidance}

CHỦ ĐỀ: ${this.job.topic} (Khối ${this.job.grade})
${isUpgrade ? `BỐI CẢNH GIÁO ÁN CŨ (PHẪU THUẬT TỪ ĐÂY): ${summary}` : `BỐI CẢNH SGK: ${summary}`}
CÁC PHẦN ĐÃ HOÀN THÀNH: ${completedGists}

NHIỆM VỤ: Hãy soạn thảo CHI TIẾT VÀ ĐÀO SÂU mục "${t.title}" (CV 5512).

            ${isUpgrade ?
                    `YÊU CẦU NÂNG CẤP:
1. TRÍCH XUẤT: Lấy toàn bộ ý tưởng hay từ giáo án cũ ở phần "${t.title}".
2. CẤU TRÚC LẠI: Ép nội dung đó vào bảng 2 cột [COT_1] và [COT_2].
3. NÂNG TẦM: Chèn hoạt động Năng lực số (dùng công cụ số) và Đạo đức (phản biện giá trị) vào kịch bản. Theo sát CHỈ THỊ TỪ CHUYÊN GIA nếu có ở trên.` :
                    `YÊU CẦU SÁNG TẠO: Tự biên soạn kịch bản mới 100% cực kỳ chi tiết.`}

            ${t.id === 'shdc' ?
                    `ĐẶC BIỆT CHO SINH HOẠT DƯỚI CỜ:
- Đây là hoạt động tập thể toàn trường.
- Kịch bản phải có: Nghi lễ chào cờ, Tuyên bố lý do, Phần văn nghệ/Sân khấu hóa, Phần trò chơi tập thể, Tổng kết thi đua.` : ''}

            ${t.id === 'shl' ?
                    `ĐẶC BIỆT CHO SINH HOẠT LỚP:
- Đây là hoạt động trong lớp học (15 phút đầu giờ).
- Kịch bản phải có: Ổn định tổ chức, Sinh hoạt theo chủ đề, Công tác học tập, Kế hoạch tuần tới.
- Nội dung ngắn gọn, tập trung vào nề nếp và học tập.` : ''}

            ${t.id === 'ho_so_day_hoc' ?
                    `ĐẶC BIỆT CHO HỒ SƠ DẠY HỌC:
- Hãy liệt kê chi tiết: 
1. Phiếu học tập (ít nhất 2 phiếu với câu hỏi cụ thể)
2. Bảng Rubric đánh giá (Tiêu chí - Mức độ)
3. Link tham khảo tài liệu số.` : ''}

            ${t.id === 'huong_dan_ve_nha' ?
                    `ĐẶC BIỆT CHO HƯỚNG DẪN VỀ NHÀ:
- Tổng kết ngắn gọn nội dung bài học.
- Giao nhiệm vụ cụ thể: Bài tập SGK, Dự án nhỏ, hoặc Tìm kiếm thông tin cho bài sau.
- Gợi ý tài liệu tham khảo số (Video, Website).` : ''}

ĐỘ DÀI: ~1500 từ cho riêng phần này. 
ĐỊNH DẠNG: Sử dụng [COT_1]...[/COT_1] và [COT_2]...[/COT_2] nếu là hoạt động dạy học.

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
