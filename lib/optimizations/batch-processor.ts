/**
 * BATCH PROCESSOR FOR NCBH
 * Groups multiple requests into single API calls
 * Optimized for free tier usage patterns
 */

export interface NCBHRequest {
  id: string;
  grade: string;
  month: number;
  topic: string;
  sections: string[];
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
}

export interface BatchResult {
  requestId: string;
  results: Record<string, any>;
  timestamp: number;
}

export class BatchProcessor {
  private queue: NCBHRequest[] = [];
  private processing = false;
  private readonly BATCH_SIZE = 3; // Process 3 NCBH at once
  private readonly BATCH_DELAY = 30000; // 30 seconds to collect batch
  private readonly MAX_WAIT_TIME = 60000; // Max 1 minute wait

  /**
   * Add NCBH request to batch queue
   */
  async addToBatch(request: NCBHRequest): Promise<BatchResult | null> {
    return new Promise((resolve, reject) => {
      // Add to queue with resolve callback
      (request as any).resolve = resolve;
      (request as any).reject = reject;
      
      this.queue.push(request);
      console.log(`[BatchProcessor] Added request ${request.id} to queue. Queue size: ${this.queue.length}`);

      if (!this.processing) {
        this.startBatchProcessing();
      }
    });
  }

  /**
   * Start batch processing if not already running
   */
  private async startBatchProcessing(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    console.log('[BatchProcessor] Starting batch processing...');

    while (this.queue.length > 0) {
      await this.processBatch();
      
      // Small delay between batches to avoid rate limiting
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    this.processing = false;
    console.log('[BatchProcessor] Batch processing completed');
  }

  /**
   * Process a batch of NCBH requests
   */
  private async processBatch(): Promise<void> {
    if (this.queue.length === 0) return;

    // Take requests from queue
    const batch = this.queue.splice(0, Math.min(this.BATCH_SIZE, this.queue.length));
    console.log(`[BatchProcessor] Processing batch of ${batch.length} requests`);

    try {
      // Wait a bit to collect more requests if we have fewer than max batch size
      if (batch.length < this.BATCH_SIZE && this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.BATCH_DELAY));
        
        // Add any new requests to this batch
        const additionalRequests = this.queue.splice(0, this.BATCH_SIZE - batch.length);
        batch.push(...additionalRequests);
      }

      // Create combined prompt for batch
      const batchPrompt = this.createBatchPrompt(batch);
      
      // Call AI once for entire batch
      const batchResponse = await this.callAIBatch(batchPrompt);
      
      // Parse and distribute results
      const results = this.parseBatchResponse(batchResponse, batch);
      
      // Resolve all promises in batch
      batch.forEach((request, index) => {
        const result: BatchResult = {
          requestId: request.id,
          results: results[index] || {},
          timestamp: Date.now()
        };
        
        if ((request as any).resolve) {
          (request as any).resolve(result);
        }
      });

      console.log(`[BatchProcessor] Successfully processed batch of ${batch.length} requests`);

    } catch (error) {
      console.error('[BatchProcessor] Batch processing failed:', error);
      
      // Reject all requests in batch
      batch.forEach(request => {
        if ((request as any).reject) {
          (request as any).reject(error);
        }
      });
    }
  }

  /**
   * Create combined prompt for batch processing
   */
  private createBatchPrompt(requests: NCBHRequest[]): string {
    const requestsInfo = requests.map((req, reqIndex) => {
      return `
REQUEST ${reqIndex + 1}:
- ID: ${req.id}
- Grade: ${req.grade}
- Month: ${req.month}
- Topic: ${req.topic}
- Sections needed: ${req.sections.join(', ')}
`;
    }).join('\n');

    return `
ROLE: Expert Curriculum Developer specializing in NghiÃªn cá»©u bÃ i há»c (NCBH).

TASK: Process ${requests.length} NCBH requests in a single response. Each request needs different sections.

${requestsInfo}

INSTRUCTIONS:
1. Process each request SEPARATELY
2. For each request, generate only the requested sections
3. Use the following JSON format for EACH request:

{
  "request_0": {
    "ten_bai": "TÃªn bÃ i há»c",
    "ly_do_chon": "LÃ½ do chá»n bÃ i...",
    "muc_tieu": "Má»¥c tiÃªu...",
    "chuoi_hoat_dong": "Chuá»—i hoáº¡t Ä‘á»™ng...",
    "phuong_an_ho_tro": "PhÆ°Æ¡ng Ã¡n há»— trá»£...",
    "chia_se_nguoi_day": "Chia sáº» ngÆ°á»i dáº¡y...",
    "nhan_xet_nguoi_du": "Nháº­n xÃ©t ngÆ°á»i dá»±...",
    "nguyen_nhan_giai_phap": "NguyÃªn nhÃ¢n giáº£i phÃ¡p...",
    "bai_hoc_kinh_nghiem": "BÃ i há»c kinh nghiá»‡m..."
  },
  "request_1": {
    ...similar structure...
  }
}

IMPORTANT: Return ALL requests in a single JSON response with all request_0, request_1, etc objects.
`;
  }

  /**
   * Call AI for batch processing
   */
  private async callAIBatch(prompt: string): Promise<string> {
    // Import the rate limiter
    const { freeTierLimiter } = await import('./free-tier-rate-limiter');
    
    // Wait for token availability
    await freeTierLimiter.waitForToken();
    
    // Import the gemini actions
    const geminiActions = await import('../actions/gemini');
    
    console.log('[BatchProcessor] Calling AI for batch processing...');
    const response = await geminiActions.generateAIContent(prompt, 'gemini-1.5-flash-8b');
    
    if (!response.success) {
      throw new Error(response.error || 'AI generation failed');
    }
    
    return response.content || '';
  }

  /**
   * Parse batch response and distribute results
   */
  private parseBatchResponse(response: string, requests: NCBHRequest[]): Record<string, any>[] {
    const results: Record<string, any>[] = [];
    
    try {
      // Try to parse as JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Extract results for each request
        requests.forEach((req, reqIndex) => {
          const requestKey = `request_${reqIndex}`;
          results[reqIndex] = parsed[requestKey] || {};
        });
      } else {
        // Fallback: try to extract individual sections
        requests.forEach((req, reqIndex) => {
          results[reqIndex] = this.extractIndividualSections(response, reqIndex);
        });
      }
    } catch (error) {
      console.error('[BatchProcessor] Failed to parse batch response:', error);
      
      // Return empty results for all requests
      requests.forEach((req, reqIndex) => {
        results[reqIndex] = {};
      });
    }
    
    return results;
  }

  /**
   * Extract individual sections from response (fallback method)
   */
  private extractIndividualSections(response: string, requestIndex: number): Record<string, any> {
    const sections: Record<string, any> = {};
    
    // Simple regex-based extraction (fallback)
    const sectionPatterns = {
      ten_bai: /(?:REQUEST\s*\d+[^:]*:\s*)?["']?ten_bai["']?\s*[:=]\s*["']([^"']+)["']/i,
      ly_do_chon: /(?:REQUEST\s*\d+[^:]*:\s*)?["']?ly_do_chon["']?\s*[:=]\s*["']([^"']+)["']/i,
      muc_tieu: /(?:REQUEST\s*\d+[^:]*:\s*)?["']?muc_tieu["']?\s*[:=]\s*["']([^"']+)["']/i,
    };
    
    Object.entries(sectionPatterns).forEach(([key, pattern]) => {
      const match = response.match(pattern);
      if (match) {
        sections[key] = match[1];
      }
    });
    
    return sections;
  }

  /**
   * Get current queue status
   */
  getQueueStatus(): { queueLength: number; processing: boolean; oldestRequest: number } {
    const oldestRequest = this.queue.length > 0 
      ? Math.min(...this.queue.map(req => req.timestamp))
      : 0;
    
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      oldestRequest
    };
  }

  /**
   * Clear queue (for emergency situations)
   */
  clearQueue(): void {
    // Reject all pending requests
    this.queue.forEach(request => {
      if ((request as any).reject) {
        (request as any).reject(new Error('Queue cleared'));
      }
    });
    
    this.queue = [];
    console.log('[BatchProcessor] Queue cleared');
  }
}

// Singleton instance
export const batchProcessor = new BatchProcessor();
