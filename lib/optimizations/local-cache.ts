/**
 * LOCAL STORAGE CACHE FOR NCBH
 * Reduces API calls by caching generated content
 * Perfect for free tier optimization
 */

export interface CachedNCBH {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  month: number; // Cache by month for NCBH
}

export class LocalCacheManager {
  private readonly CACHE_PREFIX = 'smart_doc_cache_';
  private readonly DEFAULT_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Cache NCBH result with monthly key
   */
  cacheNCBH(grade: string, month: number, topic: string, data: any): void {
    const cacheKey = this.generateCacheKey('ncbh', grade, month, topic);
    const cacheData: CachedNCBH = {
      data,
      timestamp: Date.now(),
      ttl: this.DEFAULT_TTL,
      month
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`[LocalCache] Cached NCBH for ${grade} - Month ${month} - ${topic}`);
    } catch (error) {
      console.warn('[LocalCache] Failed to cache data:', error);
      // Handle storage quota exceeded
      this.cleanupOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('[LocalCache] Still failed after cleanup:', retryError);
      }
    }
  }

  /**
   * Get cached NCBH result
   */
  getCachedNCBH(grade: string, month: number, topic: string): any | null {
    const cacheKey = this.generateCacheKey('ncbh', grade, month, topic);
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData: CachedNCBH = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - cacheData.timestamp > cacheData.ttl) {
        localStorage.removeItem(cacheKey);
        console.log(`[LocalCache] Expired cache removed for ${cacheKey}`);
        return null;
      }

      // Check if it's the same month (NCBH is monthly)
      if (cacheData.month !== month) {
        console.log(`[LocalCache] Month mismatch, cache invalid for ${cacheKey}`);
        return null;
      }

      console.log(`[LocalCache] Cache hit for ${grade} - Month ${month} - ${topic}`);
      return cacheData.data;
    } catch (error) {
      console.warn('[LocalCache] Failed to retrieve cache:', error);
      return null;
    }
  }

  /**
   * Cache generic data with custom TTL
   */
  cacheData(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const cacheKey = this.CACHE_PREFIX + key;
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('[LocalCache] Failed to cache generic data:', error);
      this.cleanupOldCache();
    }
  }

  /**
   * Get cached generic data
   */
  getCachedData(key: string): any | null {
    const cacheKey = this.CACHE_PREFIX + key;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      
      if (Date.now() - cacheData.timestamp > cacheData.ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn('[LocalCache] Failed to retrieve generic cache:', error);
      return null;
    }
  }

  /**
   * Generate consistent cache key
   */
  private generateCacheKey(type: string, grade: string, month: number, topic: string): string {
    const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
    return `${this.CACHE_PREFIX}${type}_${grade}_${month}_${topicSlug}`;
  }

  /**
   * Clean up expired cache entries
   */
  cleanupOldCache(): void {
    const keysToRemove: string[] = [];
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        try {
          const cached = JSON.parse(localStorage.getItem(key) || '{}');
          if (now - cached.timestamp > cached.ttl) {
            keysToRemove.push(key);
          }
        } catch (error) {
          // Invalid cache entry, remove it
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    if (keysToRemove.length > 0) {
      console.log(`[LocalCache] Cleaned up ${keysToRemove.length} expired cache entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { totalEntries: number; totalSize: number; oldestEntry: number } {
    let totalEntries = 0;
    let totalSize = 0;
    let oldestEntry = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        totalEntries++;
        totalSize += (localStorage.getItem(key) || '').length;
        
        try {
          const cached = JSON.parse(localStorage.getItem(key) || '{}');
          if (cached.timestamp < oldestEntry) {
            oldestEntry = cached.timestamp;
          }
        } catch (error) {
          // Ignore invalid entries
        }
      }
    }

    return {
      totalEntries,
      totalSize,
      oldestEntry: oldestEntry === Date.now() ? 0 : oldestEntry
    };
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`[LocalCache] Cleared ${keysToRemove.length} cache entries`);
  }
}

// Singleton instance
export const localCache = new LocalCacheManager();
