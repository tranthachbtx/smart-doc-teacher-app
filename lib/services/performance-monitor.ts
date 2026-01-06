
export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private successCount: number = 0;
    private failureCount: number = 0;
    private totalDuration: number = 0;
    private lastDurations: number[] = [];

    private constructor() { }

    public static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    public recordSuccess(duration: number) {
        this.successCount++;
        this.totalDuration += duration;
        this.lastDurations.push(duration);
        if (this.lastDurations.length > 50) this.lastDurations.shift();
    }

    public recordFailure(duration: number, error: any) {
        this.failureCount++;
        this.totalDuration += duration;
    }

    public getStats() {
        const avgDuration = this.successCount > 0 ? this.totalDuration / (this.successCount + this.failureCount) : 0;
        return {
            successCount: this.successCount,
            failureCount: this.failureCount,
            avgDuration,
            lastDurations: this.lastDurations
        };
    }
}
