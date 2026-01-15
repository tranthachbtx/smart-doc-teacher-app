
/**
 * 🛠️ JSON HEALER v77.1 - FAIL FAST & FAIL LOUD
 * Centralized utility to protect data integrity and provide forensic evidence on failure.
 */
export class JsonHealer {
    public static parse<T = any>(text: string, context: string = "UNKNOWN"): T {
        if (!text || text.trim().length === 0) {
            throw new Error(`[JSON_HEALER:${context}] FAIL_LOUD: Input text is empty.`);
        }

        let cleaned = text.trim();

        // 1. Remove Markdown Code Fences
        cleaned = cleaned.replace(/^```json\s*/g, "").replace(/```\s*$/g, "").trim();

        // 2. Isolate JSON structure
        const firstOpen = cleaned.indexOf("{");
        const lastClose = cleaned.lastIndexOf("}");

        if (firstOpen === -1 || lastClose === -1 || lastClose < firstOpen) {
            console.error(`[JSON_HEALER:${context}] FATAL: No JSON object found in text:`, text);
            throw new Error(`[JSON_HEALER:${context}] FAIL_LOUD: Missing '{ }' structure. Raw text length: ${text.length}`);
        }

        const jsonCandidate = cleaned.substring(firstOpen, lastClose + 1);

        try {
            return JSON.parse(jsonCandidate) as T;
        } catch (e1: any) {
            console.warn(`[JSON_HEALER:${context}] Attempting Healing Strategy 1 (Character Sanitization)...`);

            // Strategy 1: Remove control characters and fix trailing commas
            const healed = jsonCandidate
                .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "")
                .replace(/,\s*}/g, "}")
                .replace(/,\s*]/g, "]");

            try {
                return JSON.parse(healed) as T;
            } catch (e2: any) {
                console.error(`[JSON_HEALER:${context}] ALL HEALING FAILED.`);
                console.error(`[FORENSIC_DUMP] Raw Candidate:`, jsonCandidate);
                throw new Error(`[JSON_HEALER:${context}] FAIL_LOUD: Invalid JSON format. Error: ${e2.message}`);
            }
        }
    }

    /**
     * Extracts multiple JSON objects if present
     */
    public static extractMany(text: string): any[] {
        const results: any[] = [];

        // Simple bracket matching for multiple objects
        let depth = 0;
        let start = -1;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '{') {
                if (depth === 0) start = i;
                depth++;
            } else if (text[i] === '}') {
                depth--;
                if (depth === 0 && start !== -1) {
                    try {
                        const candidate = text.substring(start, i + 1);
                        results.push(this.parse(candidate, "MULTI_EXTRACT"));
                    } catch (e) {
                        // Skip invalid ones in multi-extract
                    }
                    start = -1;
                }
            }
        }
        return results;
    }
}
