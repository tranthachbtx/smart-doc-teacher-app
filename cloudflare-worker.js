// CLOUDFLARE WORKER: ULTRA-CORR-RESILIENT PROXY (v6.4)
const API_KEYS = [
    "AIzaSyBIEEsEFN6brz4YF_J2CVUz3iHN0zspYtU",
    "AIzaSyCYsZZ9fL5K3FLTc0-ANq_RkCGbxHMrwg4",
    "AIzaSyAAnWX4b9_lxdZer45KZ_smyY4EWnLvR-A"
];

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-goog-api-key, x-antigravity-source, x-antigravity-strategy",
    "Access-Control-Max-Age": "86400",
};

export default {
    async fetch(request, env, ctx) {
        // 1. Handle Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const modelPath = url.pathname; // e.g. /v1beta/models/gemini-1.5-flash:generateContent

        // 2. Prepare request for Google
        const selectedKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
        const targetUrl = `https://generativelanguage.googleapis.com${modelPath}?key=${selectedKey}`;

        try {
            const body = await request.text();
            const response = await fetch(targetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body
            });

            // 3. Clone response and inject CORS headers
            const responseHeaders = new Headers(response.headers);
            Object.keys(corsHeaders).forEach(key => responseHeaders.set(key, corsHeaders[key]));

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders
            });

        } catch (e) {
            return new Response(JSON.stringify({ error: "Worker Proxy Error", detail: e.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }
    }
};
