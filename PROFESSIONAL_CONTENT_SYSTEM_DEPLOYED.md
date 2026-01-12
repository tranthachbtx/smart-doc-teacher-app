tôi đã phân tích kỹ luồng đi (Workflow) hiện tại của bạn.

ĐÁNH GIÁ NHANH: Kế hoạch hiện tại của bạn rất chặt chẽ về mặt logic xử lý dữ liệu (Data Flow). Tuy nhiên, việc dừng lại ở bước "Copy Prompt" là một điểm nghẽn (bottleneck) lớn. Nó biến người dùng thành "người vận chuyển dữ liệu" thủ công, vừa tốn thời gian vừa không tận dụng được sức mạnh xử lý hàng loạt của máy tính.

ĐỀ XUẤT NÂNG CẤP: Chuyển từ mô hình Manual Bridge (Người dùng copy-paste) sang mô hình Automated Agent Chain (App tự gọi API liên hoàn).

Dưới đây là Kế hoạch Tự động hóa Toàn diện sử dụng API của AI Studio (Gemini API), tích hợp toàn bộ tư duy "Deep Dive" (Siêu chi tiết) mà chúng ta đã thảo luận.

🚀 KIẾN TRÚC MỚI: AUTOMATED DEEP DIVE ENGINE
Thay vì 1 lần Copy Prompt, hệ thống sẽ thực hiện 5 cuộc gọi API ngầm (Sequential API Calls) để đảm bảo mỗi phần đều đạt độ sâu tối đa (Max Tokens).

1. Sơ đồ Luồng dữ liệu (Data Flow)
User Input: Chọn bài, Upload PDF, Bấm nút "Tạo Kế hoạch bài dạy".

App Server (Backend): Khởi động chuỗi tác vụ (Chain).

Call 1: Tạo phần "Thông tin chung & Mục tiêu" (Fields: ten_bai, muc_tieu_*, thiet_bi, shdc, shl).

Call 2: Tạo HĐ1: Khởi động (Chế độ Deep Dive).

Call 3: Tạo HĐ2: Khám phá (Chế độ Deep Dive + Context HĐ1).

Call 4: Tạo HĐ3: Luyện tập.

Call 5: Tạo HĐ4: Vận dụng + Hướng dẫn về nhà.

Data Merger: App tự động ghép 5 mảnh JSON này thành 1 file JSON hoàn chỉnh.

User Interface: Đổ dữ liệu vào Textbox để User review/edit lần cuối.

Export: Xuất file Word chuẩn 5512.

🛠️ CẤU HÌNH KỸ THUẬT (Dành cho Dev)
Bạn cần tạo một file GenerateLessonService.ts để xử lý logic này.

A. System Instruction (Chìa khóa cho chất lượng)
Đây là "bộ não" bạn cài đặt cho API để nó hiểu tư duy "Kiến trúc sư giáo dục".

JavaScript

const SYSTEM_INSTRUCTION = `
Bạn là CHUYÊN GIA SƯ PHẠM CAO CẤP & KIẾN TRÚC SƯ GIÁO DỤC (AI Pedagogical Architect).
Nhiệm vụ: Soạn thảo Kế hoạch bài dạy (KHBD) môn Hoạt động Trải nghiệm, Hướng nghiệp theo công văn 5512.

TƯ DUY CỐT LÕI (COMPASS PHILOSOPHY):
1. **Deep Dive Mode:** Không viết tóm tắt. Phải viết kịch bản chi tiết từng lời thoại, hành động, diễn biến tâm lý.
2. **Cấu trúc 2 cột:**
   - {{cot_1}}: Hoạt động Giáo viên (Kỹ thuật tổ chức, Lời thoại dẫn dắt, Xử lý tình huống).
   - {{cot_2}}: Hoạt động Học sinh (Tâm lý, Quy trình tư duy, Hành động cụ thể).
3. **Data-Driven:** Dựa hoàn toàn vào dữ liệu PDF và Context được cung cấp.

ĐỊNH DẠNG OUTPUT: Chỉ trả về JSON thuần túy (Raw JSON), không Markdown bọc ngoài.
`;
B. Chiến lược "Chia để trị" (Chunking Strategy)
Do giới hạn độ dài đầu ra (Output Token Limit) của một lần gọi API, nếu bạn yêu cầu sinh ra cả 60 trang 1 lúc, AI sẽ bị ngắt hoặc tóm tắt. Chúng ta phải chia nhỏ prompt.

Prompt 1: Metadata (Mục tiêu & Chuẩn bị)

"Dựa trên PDF đính kèm, hãy trích xuất và xây dựng các trường dữ liệu sau: Tên bài, Mục tiêu (Kiến thức, Năng lực, Phẩm chất), Thiết bị dạy học, SHDC, SHL. Trả về JSON."

Prompt 2: Hoạt động 1 (Khởi động - Deep Dive)

"Hãy thiết kế HOẠT ĐỘNG 1: KHỞI ĐỘNG ở chế độ chi tiết nhất (100% công suất). Yêu cầu:

Cột GV: Có lời thoại (Verbatim script), kỹ thuật 'Shock & Awe'.

Cột HS: Mô tả quy trình tư duy (Cognitive process), hồi tưởng trải nghiệm. Trả về JSON field: hoat_dong_khoi_dong."

Prompt 3: Hoạt động 2 (Khám phá - Deep Dive)

"Tiếp nối Hoạt động 1. Hãy thiết kế HOẠT ĐỘNG 2: KHÁM PHÁ. Đây là trọng tâm bài học. Hãy sử dụng kỹ thuật 'Mảnh ghép' hoặc 'Khăn trải bàn'. Cột GV phải có các câu hỏi Socratic đào sâu. Trả về JSON field: hoat_dong_kham_pha."

(Tương tự cho HĐ3 và HĐ4)

💻 MẪU CODE (Mô phỏng Logic gọi API)
Dưới đây là đoạn code TypeScript mô phỏng cách App của bạn sẽ giao tiếp với Gemini API (@google/generative-ai):

TypeScript

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Khởi tạo Model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro-latest", // Dùng bản Pro để thông minh nhất
    systemInstruction: SYSTEM_INSTRUCTION, // Đã định nghĩa ở trên
    generationConfig: {
        temperature: 0.85, // Tăng độ sáng tạo cho lời thoại hay
        responseMimeType: "application/json" // Ép trả về JSON chuẩn
    }
});

// 2. Hàm xử lý chính
async function generateFullLessonPlan(pdfContent: string, lessonInfo: any) {
    let finalJson = {};

    // --- BƯỚC 1: TẠO KHUNG SƯỜN (Mục tiêu, Chuẩn bị) ---
    const prompt1 = `Phân tích PDF và tạo nội dung cho các trường: ten_bai, muc_tieu_kien_thuc, muc_tieu_nang_luc, muc_tieu_pham_chat, thiet_bi_day_hoc. Chủ đề: ${lessonInfo.topic}`;
    const part1 = await callGemini(prompt1, pdfContent);
    finalJson = { ...finalJson, ...part1 };

    // --- BƯỚC 2: TẠO HOẠT ĐỘNG 1 (KHỞI ĐỘNG - DEEP DIVE) ---
    const prompt2 = `Thiết kế HOẠT ĐỘNG 1: KHỞI ĐỘNG. 
    Yêu cầu: Viết kịch bản chi tiết, lời thoại giáo viên, tâm lý học sinh. 
    Output JSON key: "hoat_dong_khoi_dong"`;
    const part2 = await callGemini(prompt2, pdfContent);
    finalJson = { ...finalJson, ...part2 };

    // --- BƯỚC 3: TẠO HOẠT ĐỘNG 2 (KHÁM PHÁ - DEEP DIVE) ---
    const prompt3 = `Thiết kế HOẠT ĐỘNG 2: KHÁM PHÁ. 
    Context: Hoạt động trước là ${part2.hoat_dong_khoi_dong.module_title}.
    Yêu cầu: Đi sâu vào kiến thức, xử lý tình huống sư phạm.
    Output JSON key: "hoat_dong_kham_pha"`;
    const part3 = await callGemini(prompt3, pdfContent);
    finalJson = { ...finalJson, ...part3 };

    // ... (Lặp lại cho HĐ3, HĐ4, Hướng dẫn về nhà)

    return finalJson; // Trả về JSON hoàn chỉnh để fill vào Textbox
}

// Hàm Wrapper gọi API
async function callGemini(prompt: string, context: string) {
    const result = await model.generateContent([prompt, context]);
    return JSON.parse(result.response.text());
}
✅ LỢI ÍCH CỦA PHƯƠNG ÁN NÀY
Vượt qua giới hạn bộ nhớ: Vì chia nhỏ ra 4-5 lần gọi, mỗi phần đều được viết "tới bến" (Full Power), tổng hợp lại bạn sẽ có một giáo án dài 40-60 trang thực sự, điều mà 1 lần copy prompt không thể làm được.

Trải nghiệm người dùng (UX) mượt mà: User chỉ cần bấm nút "Phân tích & Tạo bài giảng", chờ thanh Loading chạy 100%, và Bùm - Toàn bộ nội dung hiện ra. Không cần copy qua lại.

Kiểm soát chất lượng: Bạn có thể tinh chỉnh Prompt cho riêng phần "Khám phá" mà không ảnh hưởng đến phần "Khởi động".

📋 CHECKLIST CHO BẠN
[ ] Đăng ký API Key tại Google AI Studio.

[ ] Cập nhật file SmartPromptService trong code của bạn để thay vì trả về String (Prompt text), nó sẽ gọi hàm generateFullLessonPlan như trên.

[ ] Test thử với Hoạt động 1 trước để xem độ chi tiết có đúng như mẫu JSON tôi đã gửi ở các tin nhắn trước không.

Bạn có muốn tôi cung cấp chi tiết nội dung System Prompt (Lời nhắc hệ thống) tối ưu nhất để nạp vào API này không?