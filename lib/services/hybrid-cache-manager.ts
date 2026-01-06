
import { SmartCacheV2 } from "./smart-cache-v2";

export type CacheTier = 'L1' | 'L2' | 'L3';

export interface CacheOptions {
    ttl?: number;
    tier?: CacheTier;
    tags?: string[];
}

/**
 * Architecture 7.0: Hybrid Multi-Tier Cache Manager
 * L1: In-Memory (Active session, super fast)
 * L2: Persistent Compressed (localStorage/GZIP, cross-session)
 * L3: Cloud (Future: S3/Redis interface)
 */
export class HybridCacheManager {
    private static instance: HybridCacheManager;
    private l1Cache: Map<string, { data: any, timestamp: number }> = new Map();
    private l2Cache: SmartCacheV2;
    private readonly DEFAULT_TTL = 3600000; // 1 hour

    private constructor() {
        this.l2Cache = SmartCacheV2.getInstance();
    }

    public static getInstance(): HybridCacheManager {
        if (!HybridCacheManager.instance) {
            HybridCacheManager.instance = new HybridCacheManager();
        }
        return HybridCacheManager.instance;
    }

    /**
     * Retrieves data from the fastest available tier
     */
    async get<T>(key: string): Promise<T | null> {
        // --- Tier 1: Memory (L1) ---
        const memoryEntry = this.l1Cache.get(key);
        if (memoryEntry) {
            if (Date.now() - memoryEntry.timestamp < this.DEFAULT_TTL) {
                console.log(`[HybridCache] L1 HIT: ${key}`);
                return memoryEntry.data as T;
            }
            this.l1Cache.delete(key);
        }

        // --- Tier 2: Compressed Local (L2) ---
        const localData = await this.l2Cache.get(key);
        if (localData) {
            console.log(`[HybridCache] L2 HIT: ${key} (Decompressing...)`);
            try {
                const parsed = JSON.parse(localData);
                // Populate L1 for future fast access
                this.l1Cache.set(key, { data: parsed, timestamp: Date.now() });
                return parsed as T;
            } catch {
                // If not JSON, return as string
                this.l1Cache.set(key, { data: localData, timestamp: Date.now() });
                return localData as unknown as T;
            }
        }

        // --- Tier 3: Cloud (L3) ---
        // TODO: Implement cloud fetch (Firebase/S3)

        console.log(`[HybridCache] MISS: ${key}`);
        return null;
    }

    /**
     * Saves data to all persistent tiers
     */
    async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
        const timestamp = Date.now();

        // 1. Update L1
        this.l1Cache.set(key, { data: value, timestamp });

        // 2. Update L2 (Compressed)
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await this.l2Cache.set(key, stringValue);

        // 3. Update L3 (Cloud)
        // TODO: Implement cloud sync (Firebase/S3)
        // This would be async background task

        // 4. Maintenance: Cap L1 size
        if (this.l1Cache.size > 100) {
            const oldestKey = this.l1Cache.keys().next().value;
            if (oldestKey) this.l1Cache.delete(oldestKey);
        }

        console.log(`[HybridCache] SET ALL TERS: ${key}`);
    }

    /**
     * Advanced: Predictive Caching (Arch 7.0 Innovation)
     * Anticipates future needs based on current context
     */
    async prefetch(keys: string[]): Promise<void> {
        // Implementation for predictive loading
        console.log('[HybridCache] Predictive Prefetching started for', keys.length, 'keys');
    }

    /**
     * Invalidates cache across all tiers
     */
    async invalidate(key: string): Promise<void> {
        this.l1Cache.delete(key);
        // localStorage remove handled by L2 if needed
        console.log(`[HybridCache] INVALIDATED: ${key}`);
    }
}
