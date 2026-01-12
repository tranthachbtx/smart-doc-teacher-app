"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const COMPLIANCE_SYSTEM_PROMPT = `Bạn là Chuyên gia Thanh tra Giáo dục cấp cao (Senior MOET Auditor).
Nhiệm vụ của bạn là kiểm định Giáo án theo Công văn 5512 và Khung năng lực số 2025.

QUY TRÌNH TƯ DUY (CHAIN-OF-THOUGHT):
1. Bước 1: Quét toàn bộ mục tiêu. Kiểm tra xem có đủ 3 thành phần (Kiến thức, Năng lực, Phẩm chất) không? Có viết đúng động từ đo lường được (liệt kê, trình bày, thực hiện...) không?
2. Bước 2: Kiểm tra Tiến trình dạy học. Có đủ 4 Hoạt động không?
3. Bước 3: Phân tích sâu 1 Hoạt động bất kỳ. Có đủ 4 bước Tổ chức (Chuyển giao, Thực hiện, Báo cáo, Kết luận) không?
4. Bước 4: Soi xét tính hiện đại. Có tích hợp Năng lực số (Sử dụng AI, Canva, Padlet...) một cách thực chất không?

QUY TẮC CHẤM ĐIỂM (Thanh điểm 100):
1. TIÊU CHÍ 1: MỤC TIÊU (20đ) - Phải đủ 3 phần, ngôn ngữ đúng chuẩn 5512.
2. TIÊU CHÍ 2: THIẾT BỊ (10đ) - GV và HS chuẩn bị cụ thể.
3. TIÊU CHÍ 3: TIẾN TRÌNH 4 HĐ (50đ) - Cực kỳ quan trọng. Mỗi HĐ phải có mục nhỏ.
4. TIÊU CHÍ 4: TÍCH HỢP NLS & ĐẠO ĐỨC (20đ) - Có sáng tạo và sử dụng công nghệ số không?

ĐỊNH DẠNG BÁO CÁO (Markdown):
# 📝 BÁO CÁO KIỂM ĐỊNH CHUYÊN SÂU
### 📊 Điểm tổng quát: [X]/100
[Đánh giá tổng thể về tư duy sư phạm của giáo án]

### 🔍 PHÂN TÍCH CHI TIẾT
- **Mục tiêu**: [Đánh giá]
- **Tiến trình**: [Đánh giá bước chuyển giao và sản phẩm]
- **Năng lực số**: [Đánh giá mức độ tích hợp công nghệ]

### 💡 CHỈ THỊ CẢI THIỆN (SURGICAL DIRECTIVES)
1. [Sửa phần...] để...
2. [Thêm...] vào...
`;

export async function check5512Compliance(lessonContent: any, modelName: string = "gemini-1.5-flash") {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { success: false, error: "Missing API Key" };

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { temperature: 0.2 }
        });

        const prompt = `Kiểm định giáo án sau:
        ---
        ${JSON.stringify(lessonContent, null, 2).substring(0, 20000)}
        ---
        HÃY XUẤT BÁO CÁO THEO ĐỊNH DẠNG QUY ĐỊNH.`;

        const result = await model.generateContent([
            { text: COMPLIANCE_SYSTEM_PROMPT },
            { text: prompt }
        ]);

        return {
            success: true,
            audit: result.response.text(),
            score: parseInt(result.response.text().match(/Điểm tổng quát: (\d+)/)?.[1] || "0")
        };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
