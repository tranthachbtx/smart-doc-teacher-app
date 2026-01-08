
import { MultiModalAIManager } from "./multi-modal-ai-manager";

export interface PedagogicalAuditReport {
    overallScore: number;
    detailedScores: {
        moet5512Compliance: number; // Tuân thủ 5512 (4 bước)
        pedagogicalLogic: number;   // Logic dạy học (Mục tiêu - Kết quả)
        digitalInnovation: number;  // Đổi mới sáng tạo số (TT 02/2025)
        studentCentricity: number;  // Lấy học sinh làm trung tâm
    };
    professionalReasoning: string;   // Lập luận chuyên môn chi tiết
    actionableImprovements: string[]; // Các bước cải thiện cụ thể
    auditMetadata: {
        timestamp: string;
        engineVersion: string;
        reliabilityScore: number;
    };
}

/**
 * ARCHITECTURE 20.0 - PROFESSIONAL PEDAGOGICAL AUDIT
 * Hệ thống kiểm định sư phạm chuyên sâu dành cho giáo án 2018.
 */
export class PedagogicalAuditSystem {
    private static instance: PedagogicalAuditSystem;
    private aiManager: MultiModalAIManager;

    private constructor() {
        this.aiManager = MultiModalAIManager.getInstance();
    }

    public static getInstance(): PedagogicalAuditSystem {
        if (!PedagogicalAuditSystem.instance) {
            PedagogicalAuditSystem.instance = new PedagogicalAuditSystem();
        }
        return PedagogicalAuditSystem.instance;
    }

    /**
     * Thực hiện kiểm định chuyên sâu KHBD
     */
    async audit(lessonPlan: any): Promise<PedagogicalAuditReport> {
        const prompt = `
        BẠN LÀ CHUYÊN GIA KIỂM ĐỊNH GIÁO DỤC CAO CẤP (PEDAGOGICAL AUDIT SYSTEM V5).
        
        NHIỆM VỤ:
        Phân tích và kiểm soát chất lượng Kế hoạch bài dạy (KHBD) theo Công văn 5512/BGDĐT và chương trình giáo dục phổ thông 2018.
        
        TIÊU CHÍ KIỂM ĐỊNH NGHIÊM NGẶT:
        1. **TUÂN THỦ 5512 (MoET 5512 Compliance)**: Kiểm tra sự hiện diện và chi tiết của 4 bước tổ chức: Chuyển giao -> Thực hiện -> Báo cáo -> Kết luận.
        2. **LOGIC SƯ PHẠM (Pedagogical Logic)**: Mục tiêu (Yêu cầu cần đạt) có được hiện thực hóa qua hoạt động và được đo lường qua sản phẩm không?
        3. **SÁNG TẠO SỐ (Digital Innovation)**: Việc tích hợp công cụ số (AI, Video, PHT số) có thực sự giúp HS đạt mục tiêu hay chỉ làm "màu"?
        4. **TRỌNG TÂM HS (Student Centricity)**: HS có thực sự hoạt động, hay giáo viên vẫn là người nói chính?
        
        NỘI DUNG GIÁO ÁN CẦN KIỂM ĐỊNH:
        ${JSON.stringify(lessonPlan, null, 2)}
        
        YÊU CẦU TRẢ VỀ JSON DUY NHẤT:
        {
          "overallScore": number (0-100),
          "detailedScores": {
            "moet5512Compliance": number,
            "pedagogicalLogic": number,
            "digitalInnovation": number,
            "studentCentricity": number
          },
          "professionalReasoning": "Lập luận sắc bén về chuyên môn, phân tích cụ thể các điểm mạnh/yếu.",
          "actionableImprovements": ["Gợi ý cụ thể 1", "Gợi ý cụ thể 2"]
        }
        `;

        try {
            const result = await this.aiManager.processContent({ text: "Audit Level: Professional" }, prompt, 'deep');
            const reportData = this.extractJSON(result.content);

            if (!reportData) throw new Error("AI output failed JSON parsing.");

            return {
                ...reportData,
                auditMetadata: {
                    timestamp: new Date().toISOString(),
                    engineVersion: "5.0.0-Hifi",
                    reliabilityScore: 0.95
                }
            } as PedagogicalAuditReport;
        } catch (error) {
            console.error("[PedagogicalAuditSystem] Audit failed:", error);
            return this.getFallbackReport();
        }
    }

    private extractJSON(text: string): any {
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch {
            return null;
        }
    }

    private getFallbackReport(): PedagogicalAuditReport {
        return {
            overallScore: 0,
            detailedScores: { moet5512Compliance: 0, pedagogicalLogic: 0, digitalInnovation: 0, studentCentricity: 0 },
            professionalReasoning: "Hệ thống kiểm định tạm thời không hoạt động. Vui lòng thử lại sau.",
            actionableImprovements: [],
            auditMetadata: {
                timestamp: new Date().toISOString(),
                engineVersion: "5.0.0-Fallback",
                reliabilityScore: 0
            }
        };
    }
}
