export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private successTimes: number[] = [];
    private failureTimes: number[] = [];
    private errors: Error[] = [];

    private constructor() { }

    public static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    recordSuccess(duration: number) {
        this.successTimes.push(duration);
        if (this.successTimes.length > 50) this.successTimes.shift();
    }

    recordFailure(duration: number, error: Error) {
        this.failureTimes.push(duration);
        this.errors.push(error);
        if (this.failureTimes.length > 50) this.failureTimes.shift();
        if (this.errors.length > 50) this.errors.shift();
    }

    getStats() {
        const avgSuccess = this.successTimes.length > 0
            ? this.successTimes.reduce((a, b) => a + b, 0) / this.successTimes.length
            : 0;
        return {
            avgSuccessTime: Math.round(avgSuccess),
            totalSuccess: this.successTimes.length,
            totalFailure: this.failureTimes.length,
            lastError: this.errors[this.errors.length - 1]?.message
        };
    }
}
