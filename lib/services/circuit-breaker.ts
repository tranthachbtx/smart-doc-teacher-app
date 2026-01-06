
export interface CircuitBreakerConfig {
    failureThreshold: number;
    resetTimeout: number;
    monitoringPeriod: number;
}

export enum CircuitState {
    CLOSED,
    OPEN,
    HALF_OPEN
}

export class CircuitBreaker {
    private state: CircuitState = CircuitState.CLOSED;
    private failures: number = 0;
    private lastFailureTime?: number;
    private config: CircuitBreakerConfig;

    constructor(config: CircuitBreakerConfig) {
        this.config = config;
    }

    public async execute<T>(action: () => Promise<T>): Promise<T> {
        if (this.state === CircuitState.OPEN) {
            if (Date.now() - (this.lastFailureTime || 0) > this.config.resetTimeout) {
                this.state = CircuitState.HALF_OPEN;
            } else {
                throw new Error("CIRCUIT_BREAKER_OPEN");
            }
        }

        try {
            const result = await action();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess() {
        this.failures = 0;
        this.state = CircuitState.CLOSED;
    }

    private onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
        }
    }

    public getState(): string {
        return CircuitState[this.state];
    }
}
