
// CLOUDFLARE WORKER PROXY FOR ANTIGRAVITY (v5.0)
// Deploy this to Cloudflare Workers to bypass IP blocking & sanitize headers.

// 1. CONFIGURATION
const API_KEYS = [
    // Paster your Gemini API Keys here
    "KEY_1_HERE",
    "KEY_2_HERE",
    "KEY_3_HERE"
];

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
];

// 2. STATE MANAGEMENT (Simple In-Memory for Round Robin)
let currentKeyIndex = 0;

export default {
    async fetch(request, env, ctx) {
        // Only allow POST
        if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

        const url = new URL(request.url);
        // Target Gemini API
        const targetUrl = `https://generativelanguage.googleapis.com${url.pathname}${url.search}`;

        // 3. KEY ROTATION (Round Robin)
        const selectedKey = API_KEYS[currentKeyIndex];
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;

        // 4. HEADER SANITIZATION & INJECTION
        const newHeaders = new Headers();
        newHeaders.set("Content-Type", "application/json");
        newHeaders.set("x-goog-api-key", selectedKey); // Inject Key securely at Edge

        // Rotate User-Agent to look like real browser
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
        newHeaders.set("User-Agent", randomUA);

        // Inject Client Hints to bypass fingerprinting
        newHeaders.set("sec-ch-ua", '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
        newHeaders.set("sec-ch-ua-mobile", "?0");
        newHeaders.set("sec-ch-ua-platform", '"Windows"');
        newHeaders.set("Referer", "https://aistudio.google.com/"); // Mask origin
        newHeaders.set("Origin", "https://aistudio.google.com");

        try {
            const response = await fetch(targetUrl, {
                method: "POST",
                headers: newHeaders,
                body: request.body
            });

            // 5. RESPONSE HANDLING
            // If Rate Limited (429), the client (Antigravity) will handle the backoff/jitter.
            // We just pass the response back cleanly.

            const responseBody = await response.text();
            const cleanResponseHeaders = new Headers();
            cleanResponseHeaders.set("Content-Type", "application/json");
            cleanResponseHeaders.set("Access-Control-Allow-Origin", "*"); // Allow CORS for local dev

            return new Response(responseBody, {
                status: response.status,
                headers: cleanResponseHeaders
            });

        } catch (e) {
            return new Response(JSON.stringify({ error: "Proxy Error", details: e.message }), { status: 502 });
        }
    }
};
