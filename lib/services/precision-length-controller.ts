import { LessonResult } from "../types";
import { ContentScalingService } from "./content-scaling-service";
import { IntelligentContentScaler } from "./intelligent-content-scaler";

export interface PrecisionResult {
    success: boolean;
    content: LessonResult;
    actualPages: number;
    targetPages: number;
    deviation: number;
    attempts: number;
    scalingApplied: boolean;
}

/**
 * Architecture 6.0: Precision Length Controller
 * Đảm bảo đạt chính xác mục tiêu số trang thông qua các thuật toán điều chỉnh lặp (Iterative Adjustment).
 */
export class PrecisionLengthController {
    private static instance: PrecisionLengthController;
    private maxAttempts = 3;

    private constructor() { }

    static getInstance(): PrecisionLengthController {
        if (!this.instance) {
            this.instance = new PrecisionLengthController();
        }
        return this.instance;
    }

    /**
     * Thực hiện kiểm soát độ dài chính xác cho toàn bộ giáo án
     */
    async achieveTargetLength(
        lesson: LessonResult,
        targetPages: number = 40,
        tolerance: number = 2
    ): Promise<PrecisionResult> {
        let currentContent = { ...lesson };
        let currentPages = ContentScalingService.estimatePageCount(currentContent);
        let attempts = 0;
        let scalingApplied = false;

        console.log(`[PrecisionScaling] Starting achievement: Current ${currentPages}, Target ${targetPages}`);

        while (attempts < this.maxAttempts) {
            const deviation = currentPages - targetPages;

            // Nếu đã nằm trong khoảng dung sai, dừng lại
            if (Math.abs(deviation) <= tolerance) {
                return {
                    success: true,
                    content: currentContent,
                    actualPages: currentPages,
                    targetPages,
                    deviation,
                    attempts,
                    scalingApplied
                };
            }

            // Nếu quá ngắn, thực hiện mở rộng ưu tiên (Khám phá -> Luyện tập)
            if (deviation < 0) {
                console.log(`[PrecisionScaling] Attempt ${attempts + 1}: Under target, expanding...`);
                const scaler = IntelligentContentScaler.getInstance();

                // Mở rộng phần Khám phá (là phần quan trọng nhất)
                if (currentContent.hoat_dong_kham_pha && currentContent.hoat_dong_kham_pha.length < 5000) {
                    currentContent.hoat_dong_kham_pha = await scaler.expandModule(
                        "KHÁM PHÁ KIẾN THỨC MỚI",
                        currentContent.hoat_dong_kham_pha,
                        3000 // Target 3000 words for this section
                    );
                    scalingApplied = true;
                }
            }
            // Nếu quá dài, ta có thể triệt tiêu bớt (chưa triển khai vì mục tiêu 50 trang thường là thiếu trang)
            else {
                console.log(`[PrecisionScaling] Attempt ${attempts + 1}: Over target, stabilizing...`);
                break;
            }

            // Cập nhật lại số trang sau khi biến đổi
            currentPages = ContentScalingService.estimatePageCount(currentContent);
            attempts++;
        }

        return {
            success: Math.abs(currentPages - targetPages) <= tolerance,
            content: currentContent,
            actualPages: currentPages,
            targetPages,
            deviation: currentPages - targetPages,
            attempts,
            scalingApplied
        };
    }
}
