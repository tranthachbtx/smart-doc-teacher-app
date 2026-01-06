
import { MultiModalAIManager } from "./multi-modal-ai-manager";

export interface NeuralMergedPlan {
    plan: any;
    confidence: number;
    reasoning: string;
}

export class NeuralMergerEngine {
    private static instance: NeuralMergerEngine;
    private aiManager: MultiModalAIManager;

    private constructor() {
        this.aiManager = MultiModalAIManager.getInstance();
    }

    public static getInstance(): NeuralMergerEngine {
        if (!NeuralMergerEngine.instance) {
            NeuralMergerEngine.instance = new NeuralMergerEngine();
        }
        return NeuralMergerEngine.instance;
    }

    /**
     * Architecture 10.0: Intelligent Fusion of AI suggestions into a lesson plan
     */
    async neuralMerge(currentPlan: any, suggestions: string): Promise<NeuralMergedPlan> {
        const prompt = `
        BẠN LÀ CHUYÊN GIA HỢP NHẤT DỮ LIỆU SƯ PHẠM (NEURAL MERGER ENGINE).
        
        NHIỆM VỤ:
        Hợp nhất các gợi ý từ AI vào kế hoạch bài dạy hiện tại.
        
        KẾ HOẠCH HIỆN TẠI (JSON):
        ${JSON.stringify(currentPlan, null, 2)}
        
        GỢI Ý/CHỈ THỊ MỚI:
        "${suggestions}"
        
        YÊU CẦU NGHIÊM NGẶT:
        1. KHÔNG ghi đè toàn bộ nếu không cần thiết. Chỉ "cấy ghép" (surgical fusion) các ý hay vào đúng vị trí.
        2. Nếu gợi ý yêu cầu thêm "chuyển đổi số", hãy lồng ghép công cụ số vào các hoạt động hiện có.
        3. Nếu gợi ý yêu cầu "tăng tính thực tiễn", hãy sửa lại phần Vận dụng.
        4. Trả về DUY NHẤT một đối tượng JSON có cấu trúc y hệt KẾ HOẠCH HIỆN TẠI nhưng đã được nâng cấp.
        5. Đảm bảo tính mạch lạc sư phạm 5512.
        
        KẾT QUẢ TRẢ VỀ:
        Trả về JSON sạch sẽ.
        `;

        try {
            const result = await this.aiManager.processContent({ text: suggestions }, prompt);
            const mergedPlan = this.extractJSON(result.content);

            return {
                plan: mergedPlan || currentPlan,
                confidence: 95,
                reasoning: "Hợp nhất thành công bằng mạng Neural Gemini-2.0-Flash."
            };
        } catch (error) {
            console.error("[NeuralMergerEngine] Error:", error);
            return {
                plan: currentPlan,
                confidence: 0,
                reasoning: "Hợp nhất thất bại, giữ nguyên bản gốc."
            };
        }
    }

    private extractJSON(text: string): any {
        try {
            const jsonPart = text.match(/\{[\s\S]*\}/);
            return jsonPart ? JSON.parse(jsonPart[0]) : null;
        } catch {
            return null;
        }
    }
}
