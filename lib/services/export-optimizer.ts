
import type { LessonResult } from "@/lib/types";

export interface PerformanceReport {
    startTime: number;
    endTime?: number;
    duration?: number;
    contentSize: number;
    heapSizeBefore: number;
    heapSizeAfter?: number;
    memoryUsage?: number;
    chunkCount: number;
    success: boolean;
}

export class ExportOptimizer {
    private static metrics: Partial<PerformanceReport> = {
        chunkCount: 0,
        success: false
    };

    /**
     * Start monitoring performance metrics
     */
    static startMonitoring(contentSize: number = 0) {
        this.metrics = {
            startTime: Date.now(),
            contentSize,
            heapSizeBefore: this.getUsedMemory(),
            chunkCount: 0,
            success: false
        };
    }

    /**
     * Helper to get current memory usage
     */
    private static getUsedMemory(): number {
        if (typeof window !== 'undefined' && (window.performance as any).memory) {
            return (window.performance as any).memory.usedJSHeapSize;
        }
        return 0;
    }

    /**
     * Check if memory usage is within safe limits (Phase 1.1)
     */
    static checkMemoryUsage(): boolean {
        const used = this.getUsedMemory();
        if (typeof window !== 'undefined' && (window.performance as any).memory) {
            const limit = (window.performance as any).memory.jsHeapSizeLimit;
            // Warning if using more than 80% of limit
            return used < limit * 0.8;
        }
        return true;
    }

    /**
     * Suggest/trigger garbage collection hints (Phase 1.1)
     */
    static async garbageCollect() {
        console.log("[ExportOptimizer] Triggering memory relief...");
        // In JS we can't force GC, but we can nullify references
        // and pause to let the engine breathe
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Deep Validation of content structure (Phase 5.2)
     */
    static validateContent(result: any): { valid: boolean; errors: string[]; warnings: string[] } {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!result) return { valid: false, errors: ["Dữ liệu trống"], warnings: [] };

        // Required field checking (MOET 5512 Integrity)
        if (!result.ten_bai || result.ten_bai.trim().length < 5) {
            errors.push("Tên bài học không hợp lệ hoặc quá ngắn.");
        }

        const essentialObjectives = [
            { fieldPath: 'muc_tieu_kien_thuc', label: 'Kiến thức' },
            { fieldPath: 'muc_tieu_nang_luc', label: 'Năng lực' },
            { fieldPath: 'muc_tieu_pham_chat', label: 'Phẩm chất' }
        ];

        essentialObjectives.forEach(obj => {
            if (!result[obj.fieldPath] || result[obj.fieldPath].trim().length < 10) {
                warnings.push(`Trường "${obj.label}" có vẻ quá ngắn hoặc đang để trống.`);
            }
        });

        // Activity Check
        if (!result.hoat_dong_khoi_dong && !result.hoat_dong_kham_pha) {
            errors.push("Giáo án thiếu các hoạt động dạy học cốt lõi.");
        }

        // Duplicate content detection (Simple check)
        if (result.hoat_dong_khoi_dong === result.hoat_dong_kham_pha && result.hoat_dong_khoi_dong) {
            warnings.push("Phát hiện nội dung trùng lặp giữa các hoạt động.");
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Predict export risk based on content size and memory availability (Phase 5.1)
     */
    static predictExportRisk(content: any): { riskLevel: 'low' | 'medium' | 'high'; message?: string } {
        const contentStr = JSON.stringify(content);
        const sizeInKB = contentStr.length / 1024;

        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        let message = "Bộ nhớ an toàn. Hệ thống đã sẵn sàng.";

        if (sizeInKB > 1500) { // > 1.5MB of JSON
            riskLevel = 'high';
            message = "Tài liệu rất lớn. Hệ thống sẽ tự động chuyển sang chế độ xử lý ngầm (Web Worker) để đảm bảo ổn định.";
        } else if (sizeInKB > 600) {
            riskLevel = 'medium';
            message = "Tài liệu có kích thước trung bình. Quá trình xử lý có thể mất vài giây.";
        }

        // Final check against current available memory
        if (!this.checkMemoryUsage()) {
            riskLevel = 'high';
            message = "Cảnh báo: Bộ nhớ trình duyệt đang ở mức báo động! Vui lòng đóng bớt các tab khác.";
        }

        return { riskLevel, message };
    }

    /**
     * Optimize content for processing (Phase 1.1)
     */
    static optimizeContent(content: any): any {
        // Deep clone or pick necessary fields to reduce memory footprint
        if (!content) return null;
        return JSON.parse(JSON.stringify(content));
    }

    /**
     * Generate detailed performance report (Phase 3.2)
     */
    static getPerformanceReport(): PerformanceReport {
        const endTime = Date.now();
        const heapSizeAfter = this.getUsedMemory();

        return {
            startTime: this.metrics.startTime || 0,
            endTime,
            duration: endTime - (this.metrics.startTime || 0),
            contentSize: this.metrics.contentSize || 0,
            heapSizeBefore: this.metrics.heapSizeBefore || 0,
            heapSizeAfter,
            memoryUsage: heapSizeAfter - (this.metrics.heapSizeBefore || 0),
            chunkCount: this.metrics.chunkCount || 0,
            success: this.metrics.success || false
        };
    }

    static setSuccess(value: boolean) {
        this.metrics.success = value;
    }

    /**
     * Memory-safe processing in chunks (Phase 1.1)
     */
    static async processWithMemorySafety<T, R>(
        items: T[],
        processor: (chunk: T[]) => Promise<R[]>,
        chunkSize: number = 1,
        onProgress?: (percent: number) => void
    ): Promise<R[]> {
        const results: R[] = [];
        const total = items.length;

        for (let i = 0; i < total; i += chunkSize) {
            // Check memory before each chunk
            if (!this.checkMemoryUsage()) {
                await this.garbageCollect();
            }

            const chunk = items.slice(i, i + chunkSize);
            const chunkResults = await processor(chunk);
            results.push(...chunkResults);

            this.metrics.chunkCount!++;

            if (onProgress) {
                onProgress(Math.round(((i + chunk.length) / total) * 100));
            }

            // Yield to main thread (Phase 1)
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        return results;
    }
}
