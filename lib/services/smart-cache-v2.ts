/**
 * Smart Cache V2 with Compression
 * Improvements:
 * - GZIP Compression for storage efficiency (localStorage 5MB limit).
 * - Metadata tracking (original size vs compressed size).
 */

export interface CacheEntryV2 {
    data: string; // Base64 encoded compressed string
    timestamp: number;
    originalSize: number;
    compressedSize: number;
    checksum: string; // Simple length-based checksum for now
}

export class SmartCacheV2 {
    private static instance: SmartCacheV2;
    private cache = new Map<string, CacheEntryV2>();
    private readonly STORAGE_KEY = 'smart_cache_v2';
    private readonly MAX_ENTRIES = 50;
    private readonly TTL = 24 * 60 * 60 * 1000; // 24 Hours

    private constructor() {
        if (typeof window !== 'undefined') {
            this.loadFromStorage();
        }
    }

    public static getInstance(): SmartCacheV2 {
        if (!SmartCacheV2.instance) {
            SmartCacheV2.instance = new SmartCacheV2();
        }
        return SmartCacheV2.instance;
    }

    private loadFromStorage() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                Object.entries(parsed).forEach(([key, value]: [string, any]) => {
                    // Check TTL
                    if (Date.now() - value.timestamp < this.TTL) {
                        this.cache.set(key, value);
                    }
                });
            }
        } catch (e) {
            console.warn('[SmartCacheV2] Failed to load cache', e);
        }
    }

    private saveToStorage() {
        if (typeof window !== 'undefined') {
            try {
                const obj = Object.fromEntries(this.cache);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
            } catch (e) {
                console.warn('[SmartCacheV2] Failed to save cache (quota exceeded?)', e);
                // If quota exceeded, we might want to evict oldest
                if (this.cache.size > 0) {
                    const oldest = this.cache.keys().next().value;
                    this.cache.delete(oldest!);
                }
            }
        }
    }

    // --- Compression Utils (Browser Native CompressionStream) ---

    private async compress(input: string): Promise<string> {
        if (typeof CompressionStream === 'undefined') return input;

        try {
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const textEncoder = new TextEncoder();

            writer.write(textEncoder.encode(input));
            writer.close();

            const reader = stream.readable.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
            const result = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.length;
            }

            return this.bytesToBase64(result);
        } catch (e) {
            console.error('[SmartCacheV2] Compression failed', e);
            return input;
        }
    }

    private async decompress(input: string): Promise<string | null> {
        if (typeof window === 'undefined' || typeof DecompressionStream === 'undefined' || !this.isBase64(input)) {
            return input;
        }

        try {
            const bytes = this.base64ToBytes(input);
            const stream = new DecompressionStream('gzip');
            const writer = stream.writable.getWriter();

            writer.write(bytes as any);
            writer.close();

            const reader = stream.readable.getReader();
            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }
            result += decoder.decode();

            return result;
        } catch (e) {
            console.error('[SmartCacheV2] Decompression failed', e);
            // CRITICAL FIX: If decompression fails, return null (treat as cache miss).
            // Do NOT return the compressed binary string as text!
            return null;
        }
    }

    private bytesToBase64(bytes: Uint8Array): string {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    private base64ToBytes(base64: string): Uint8Array {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    private isBase64(str: string) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }

    // --- Public API ---

    public async set(key: string, content: string): Promise<void> {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.MAX_ENTRIES) {
            const lruKey = this.cache.keys().next().value;
            if (lruKey) this.cache.delete(lruKey);
        }

        const compressedData = await this.compress(content);

        this.cache.set(key, {
            data: compressedData,
            timestamp: Date.now(),
            originalSize: content.length,
            compressedSize: compressedData.length,
            checksum: content.length.toString()
        });

        this.saveToStorage();
    }

    public async get(key: string): Promise<string | null> {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }

        // LRU Refresh
        this.cache.delete(key);
        this.cache.set(key, entry);
        this.saveToStorage();

        return await this.decompress(entry.data);
    }
}
