
/**
 * 🛡️ SECURITY VAULT - ISO 25010 COMPLIANCE
 * Provides AES-256 encryption for client-side data.
 */

export class SecurityVault {
    private static instance: SecurityVault;
    private key: CryptoKey | null = null;
    private readonly SALT = 'ANTIGRAVITY_VAULT_2026';

    private constructor() { }

    public static getInstance(): SecurityVault {
        if (!SecurityVault.instance) {
            SecurityVault.instance = new SecurityVault();
        }
        return SecurityVault.instance;
    }

    /**
     * Khởi tạo khóa mã hóa dựa trên mật khẩu hoặc mã máy
     */
    private async ensureKey(): Promise<CryptoKey> {
        if (this.key) return this.key;

        const encoder = new TextEncoder();
        const baseKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode(this.SALT),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        this.key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode('SMART_DOC_SALT'),
                iterations: 100000,
                hash: 'SHA-256'
            },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );

        return this.key;
    }

    /**
     * Mã hóa chuỗi văn bản
     */
    public async encrypt(text: string): Promise<string> {
        const key = await this.ensureKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoder = new TextEncoder();

        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encoder.encode(text)
        );

        // Combine IV and Encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return btoa(String.fromCharCode(...combined));
    }

    /**
     * Giải mã chuỗi văn bản
     */
    public async decrypt(encoded: string): Promise<string> {
        try {
            const key = await this.ensureKey();
            const combined = new Uint8Array(
                atob(encoded).split('').map(c => c.charCodeAt(0))
            );

            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                key,
                data
            );

            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error('[SecurityVault] Decryption failed. Key mismatch or corrupted data.');
            return "";
        }
    }
}
