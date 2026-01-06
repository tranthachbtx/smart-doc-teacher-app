
export interface CircuitBreakerOptions {
    failureThreshold: number;
    resetTimeout: number; // ms
    monitoringPeriod: number; // ms
}

export class CircuitBreaker {
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    private failureCount: number = 0;
    private lastFailureTime: number = 0;
    private successCount: number = 0;

    constructor(private options: CircuitBreakerOptions) { }

    async execute<T>(operation: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
                this.state = 'HALF_OPEN';
                console.log('[CircuitBreaker] Transitioning to HALF_OPEN');
            } else {
                const remainingTime = Math.ceil((this.options.resetTimeout - (Date.now() - this.lastFailureTime)) / 1000);
                throw new Error(`CIRCUIT_OPEN: Hệ thống đang tạm nghỉ bảo trì để tránh bị khóa IP. Thử lại sau ${remainingTime} giây.`);
            }
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error: any) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.successCount++;
        this.failureCount = 0;

        if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            console.log('[CircuitBreaker] Transitioning to CLOSED');
        }
    }

    private onFailure(): void {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.options.failureThreshold) {
            this.state = 'OPEN';
            console.error(`[CircuitBreaker] TRIPPED! State: OPEN. Too many failures (${this.failureCount}).`);
        }
    }

    public getState() {
        return this.state;
    }
}
