
import { ActionResult } from "@/lib/types";

interface CacheEntry {
    content: string;
    timestamp: number;
}

export class CachedProcessingEngine {
    private static instance: CachedProcessingEngine;
    private cache = new Map<string, CacheEntry>();
    private readonly MAX_CACHE_SIZE = 50;
    private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    private constructor() {
        // Try to load from localStorage if available (client-side)
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('pdf_processing_cache');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Convert object back to Map, handling expiry
                    Object.entries(parsed).forEach(([key, value]: [string, any]) => {
                        if (Date.now() - value.timestamp < this.CACHE_TTL) {
                            this.cache.set(key, value);
                        }
                    });
                }
            } catch (e) {
                console.warn('Failed to load cache', e);
            }
        }
    }

    public static getInstance(): CachedProcessingEngine {
        if (!CachedProcessingEngine.instance) {
            CachedProcessingEngine.instance = new CachedProcessingEngine();
        }
        return CachedProcessingEngine.instance;
    }

    private saveToStorage() {
        if (typeof window !== 'undefined') {
            try {
                const obj = Object.fromEntries(this.cache);
                localStorage.setItem('pdf_processing_cache', JSON.stringify(obj));
            } catch (e) {
                console.warn('Failed to save cache', e);
            }
        }
    }

    public async generateFileHash(file: File): Promise<string> {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    public getFromCache(hash: string): string | null {
        const entry = this.cache.get(hash);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.CACHE_TTL) {
            this.cache.delete(hash);
            this.saveToStorage();
            return null;
        }

        // LRU: Move to end (most recently used)
        this.cache.delete(hash);
        this.cache.set(hash, entry);
        this.saveToStorage();

        return entry.content;
    }

    public setCache(hash: string, content: string): void {
        // If exists, update (and move to end via LRU logic in Map)
        if (this.cache.has(hash)) {
            this.cache.delete(hash);
        } else if (this.cache.size >= this.MAX_CACHE_SIZE) {
            // LRU Eviction: Remove the first item (least recently used)
            // Map.keys() returns iterator in insertion order.
            // Since we re-insert on access, the first item is the LRU.
            const lruKey = this.cache.keys().next().value;
            if (lruKey) this.cache.delete(lruKey);
        }

        this.cache.set(hash, { content, timestamp: Date.now() });
        this.saveToStorage();
    }
}
