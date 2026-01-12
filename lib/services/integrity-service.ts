
/**
 * ðŸ’Ž INTEGRITY SERVICE - ISO 25010 COMPLIANCE
 * Ensures document integrity through SHA-256 hashing.
 */

export class IntegrityService {
    /**
     * Táº¡o mÃ£ bÄƒm SHA-256 cho má»™t Blob (vÃ­ dá»¥: file Word)
     */
    static async generateChecksum(blob: Blob): Promise<string> {
        const arrayBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    /**
     * Kiá»ƒm tra tÃ­nh toÃ n váº¹n cá»§a blob so vá»›i mÃ£ bÄƒm cho trÆ°á»›c
     */
    static async verify(blob: Blob, expectedChecksum: string): Promise<boolean> {
        const actualChecksum = await this.generateChecksum(blob);
        return actualChecksum === expectedChecksum;
    }

    /**
     * Táº¡o 'Tem báº£o Ä‘áº£m' (Metadata) cho file
     */
    static async seal(blob: Blob, fileName: string): Promise<{ fileName: string; checksum: string; timestamp: string }> {
        const checksum = await this.generateChecksum(blob);
        return {
            fileName,
            checksum,
            timestamp: new Date().toISOString()
        };
    }
}
