/**
 * 🚀 Export Performance Optimizer
 * Tối ưu hóa hiệu suất và độ tin cậy cho Word Export
 */

export class ExportOptimizer {
  // Performance monitoring
  private static performanceMetrics = {
    startTime: 0,
    memoryUsage: 0,
    chunkCount: 0,
    errorCount: 0
  };

  /**
   * Memory-safe chunking for large content
   */
  static async processWithMemorySafety<T>(
    data: T[],
    processor: (chunk: T[]) => Promise<any[]>,
    chunkSize: number = 100,
    onProgress?: (percent: number) => void
  ): Promise<any[]> {
    const results: any[] = [];
    const totalChunks = Math.ceil(data.length / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
      
      // Memory check before processing
      if (this.checkMemoryUsage()) {
        await this.garbageCollect();
      }
      
      try {
        const chunkResult = await processor(chunk);
        results.push(...chunkResult);
        
        // Progress update
        if (onProgress) {
          onProgress(Math.round(((i + 1) / totalChunks) * 100));
        }
        
        // Yield to main thread
        await this.yieldToMainThread();
        
      } catch (error) {
        console.error(`Chunk ${i} processing failed:`, error);
        this.performanceMetrics.errorCount++;
        
        // Continue with fallback
        results.push(this.createFallbackChunk(chunk));
      }
    }
    
    return results;
  }

  /**
   * Check memory usage and return true if cleanup needed
   */
  private static checkMemoryUsage(): boolean {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      return usageRatio > 0.7; // 70% threshold
    }
    return false;
  }

  /**
   * Force garbage collection if available
   */
  private static async garbageCollect(): Promise<void> {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
    // Always yield to allow natural GC
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Yield to main thread with adaptive delay
   */
  private static async yieldToMainThread(): Promise<void> {
    const delay = this.performanceMetrics.errorCount > 0 ? 50 : 10;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Create fallback chunk when processing fails
   */
  private static createFallbackChunk(chunk: any[]): any[] {
    return chunk.map(item => ({
      text: typeof item === 'string' ? item : '...',
      fallback: true
    }));
  }

  /**
   * Validate content before export
   */
  static validateContent(content: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!content) {
      errors.push('Content is null or undefined');
      return { valid: false, errors };
    }

    // Check for circular references
    try {
      JSON.stringify(content);
    } catch (e) {
      errors.push('Circular reference detected in content');
    }

    // Check content size
    const contentSize = JSON.stringify(content).length;
    if (contentSize > 10 * 1024 * 1024) { // 10MB
      errors.push('Content too large (>10MB)');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Optimize content for processing
   */
  static optimizeContent(content: any): any {
    if (typeof content === 'string') {
      return content
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control chars
    }
    
    if (Array.isArray(content)) {
      return content.map(item => this.optimizeContent(item));
    }
    
    if (typeof content === 'object' && content !== null) {
      const optimized: any = {};
      for (const [key, value] of Object.entries(content)) {
        optimized[key] = this.optimizeContent(value);
      }
      return optimized;
    }
    
    return content;
  }

  /**
   * Start performance monitoring
   */
  static startMonitoring(): void {
    this.performanceMetrics = {
      startTime: Date.now(),
      memoryUsage: 0,
      chunkCount: 0,
      errorCount: 0
    };
  }

  /**
   * Get performance report
   */
  static getPerformanceReport(): {
    duration: number;
    memoryUsage: string;
    chunkCount: number;
    errorCount: number;
    success: boolean;
  } {
    const duration = Date.now() - this.performanceMetrics.startTime;
    const success = this.performanceMetrics.errorCount === 0;
    
    return {
      duration,
      memoryUsage: `${Math.round(this.performanceMetrics.memoryUsage / 1024 / 1024)}MB`,
      chunkCount: this.performanceMetrics.chunkCount,
      errorCount: this.performanceMetrics.errorCount,
      success
    };
  }
}
