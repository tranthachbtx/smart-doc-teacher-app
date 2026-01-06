
import React from 'react';

export interface ComponentMetrics {
    name: string;
    renderCount: number;
    totalRenderTime: number;
    averageRenderTime: number;
    lastRenderTime: number;
    isOptimized: boolean;
    options: any;
}

export class ReactPerformanceManager {
    private static instance: ReactPerformanceManager;
    private componentRegistry: Map<string, ComponentMetrics> = new Map();
    private renderBudget: number = 16; // 16ms for 60fps

    public static getInstance(): ReactPerformanceManager {
        if (!ReactPerformanceManager.instance) {
            ReactPerformanceManager.instance = new ReactPerformanceManager();
        }
        return ReactPerformanceManager.instance;
    }

    registerComponent(name: string, options: any = {}): void {
        if (this.componentRegistry.has(name)) return;

        const metrics: ComponentMetrics = {
            name,
            renderCount: 0,
            totalRenderTime: 0,
            averageRenderTime: 0,
            lastRenderTime: 0,
            isOptimized: true,
            options
        };

        this.componentRegistry.set(name, metrics);
        console.log(`[PerformanceManager] Registered & Monitored: ${name}`);
    }

    recordRender(componentName: string, duration: number): void {
        const metrics = this.componentRegistry.get(componentName);
        if (metrics) {
            metrics.renderCount++;
            metrics.totalRenderTime += duration;
            metrics.averageRenderTime = metrics.totalRenderTime / metrics.renderCount;
            metrics.lastRenderTime = duration;

            if (duration > this.renderBudget) {
                console.warn(`[PerformanceManager] 🐢 ${componentName} render slow: ${duration.toFixed(2)}ms (Limit: ${this.renderBudget}ms)`);
            }
        }
    }

    getMetrics(name: string): ComponentMetrics | undefined {
        return this.componentRegistry.get(name);
    }
}
