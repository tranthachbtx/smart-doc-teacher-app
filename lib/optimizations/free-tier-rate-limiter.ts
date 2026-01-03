/**
 * FREE TIER RATE LIMITER
 * Optimized for Vercel Free Tier & Gemini Free Tier
 * 
 * Strategy: 1 token/minute refill, max 60 tokens
 * Perfect for 5-6 NCBH requests per month
 */

export class FreeTierRateLimiter {
  private tokens: number = 60; // Start with max capacity
  private lastRefill: number = Date.now();
  private readonly capacity: number = 60;
  private readonly refillRate: number = 60; // 60 tokens per hour (1 per minute)
  private readonly emergencyMode: boolean = false;

  constructor() {
    // Initialize with full tank for first use
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }

  /**
   * Wait for available token with smart refill
   */
  async waitForToken(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRefill;

    // Refill tokens based on elapsed time (1 token per minute)
    const tokensToAdd = Math.floor(elapsed / 60000);
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    // Calculate wait time for next token
    const waitTime = 60000 - (elapsed % 60000); // Wait until next minute
    console.log(`[FreeTierLimiter] No tokens available. Waiting ${Math.ceil(waitTime / 1000)}s for next token...`);
    
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // After waiting, we should have exactly 1 token
    this.tokens = 0;
    this.lastRefill = Date.now();
  }

  /**
   * Get current status for monitoring
   */
  getStatus(): { tokens: number; capacity: number; waitTime: number } {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / 60000);
    const currentTokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    const waitTime = currentTokens >= 1 ? 0 : (60000 - (elapsed % 60000));

    return {
      tokens: currentTokens,
      capacity: this.capacity,
      waitTime: Math.ceil(waitTime / 1000)
    };
  }

  /**
   * Force reset tokens (for testing or emergency)
   */
  reset(): void {
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    console.log('[FreeTierLimiter] Tokens reset to full capacity');
  }

  /**
   * Check if we can make a request without waiting
   */
  canMakeRequest(): boolean {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / 60000);
    const currentTokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    
    return currentTokens >= 1;
  }
}

// Singleton instance for app-wide usage
export const freeTierLimiter = new FreeTierRateLimiter();
