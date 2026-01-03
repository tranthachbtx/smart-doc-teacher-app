// CLOUDFLARE WORKER STEALTH PROXY FOR ANTIGRAVITY (v5.2)
// Mục đích: Vượt Shadow Ban của Vercel bằng cách định tuyến qua IP của Cloudflare

const API_KEYS = [
    "AIzaSyBIEEsEFN6brz4YF_J2CVUz3iHN0zspYtU",
    "AIzaSyCYsZZ9fL5K3FLTc0-ANq_RkCGbxHMrwg4",
    "AIzaSyAAnWX4b9_lxdZer45KZ_smyY4EWnLvR-A"
];

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
];

export default {
    async fetch(request, env, ctx) {
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, x-goog-api-key",
                }
            });
        }

        if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

        const url = new URL(request.url);
        const modelPath = url.pathname; // e.g. /v1beta/models/gemini-1.5-flash:generateContent

        // Lấy key từ URL hoặc xoay vòng ngẫu nhiên nếu không có
        const urlKey = url.searchParams.get("key");
        const selectedKey = urlKey || API_KEYS[Math.floor(Math.random() * API_KEYS.length)];

        const targetUrl = `https://generativelanguage.googleapis.com${modelPath}?key=${selectedKey}`;

        const newHeaders = new Headers();
        newHeaders.set("Content-Type", "application/json");

        // Xoay vòng User-Agent
        newHeaders.set("User-Agent", USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]);

        // Xóa các vết tích từ Vercel/Client
        const headersToOmit = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip", "forwarded"];
        request.headers.forEach((value, key) => {
            if (!headersToOmit.includes(key.toLowerCase())) {
                newHeaders.set(key, value);
            }
        });

        try {
            const body = await request.text();
            const response = await fetch(targetUrl, {
                method: "POST",
                headers: newHeaders,
                body: body
            });

            const responseHeaders = new Headers(response.headers);
            responseHeaders.set("Access-Control-Allow-Origin", "*");

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: "Saga Proxy Breach", detail: e.message }), {
                status: 502,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
    }
};
