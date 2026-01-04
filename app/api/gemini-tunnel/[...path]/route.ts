import { NextRequest, NextResponse } from 'next/server';

/**
 * ANTIGRAVITY INTERNAL TUNNEL (v6.13 - Disaster Recovery Edition)
 * Tự động xoay Key, sửa model và Fallback cực mạnh khi Google sập.
 */

const API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
]
    .filter((k): k is string => typeof k === 'string' && k.trim().length > 0)
    .map(k => k.trim());

const DISCOVERY_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash-8b", // Thêm 8b vì nó cực kỳ ổn định và ít bị 429
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp"
];

export async function POST(req: NextRequest, { params }: any) {
    try {
        let pathParam = params;
        if (pathParam instanceof Promise) pathParam = await pathParam;

        const pathArray = pathParam?.path || [];
        let subPath = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;

        if (!subPath) {
            const url = new URL(req.url);
            subPath = url.pathname.split('/api/gemini-tunnel/')[1] || "";
        }

        const fullPath = subPath.startsWith('/') ? subPath : `/${subPath}`;
        const body = await req.json();
        const proxyUrl = (process.env.GEMINI_PROXY_URL || "").trim();

        let lastError: any = null;

        // 1. Thử qua Cloudflare Proxy (Xử lý Junk Response)
        if (proxyUrl) {
            try {
                const targetUrl = `${proxyUrl.replace(/\/$/, "")}${fullPath}`;
                console.log(`[Tunnel] Proxy Call -> ${targetUrl}`);
                const response = await fetch(targetUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(9000)
                });

                const contentType = response.headers.get("content-type") || "";
                if (response.ok && contentType.includes("application/json")) {
                    const raw = await response.text();
                    try {
                        return NextResponse.json(raw ? JSON.parse(raw) : null);
                    } catch {
                        console.warn("[Tunnel] Proxy returned non-JSON. Skipping.");
                    }
                }
                console.warn("[Tunnel] Proxy Junk/Error. Skipping.");
            } catch (e) {
                console.warn("[Tunnel] Proxy Fail.");
            }
        }

        // 2. Thử xoay Key trực tiếp và tự tìm Model tương thích
        console.log(`[Tunnel] Google direct auth with ${API_KEYS.length} keys...`);
        for (const key of API_KEYS) {
            let result = await tryGeminiCall(fullPath, key, body);
            if (result.success) return NextResponse.json(result.data);

            // Phát hiện lỗi Resource Exhausted (429) hoặc Not Found (404)
            if (result.status === 404 || result.status === 429) {
                console.log(`[Discovery] Key ${key.slice(0, 5)} failed (${result.status}). Trying variants...`);
                for (const model of DISCOVERY_MODELS) {
                    const discoveryPath = fullPath.replace(/models\/[^:]+:/, `models/${model}:`);
                    if (discoveryPath === fullPath) continue;

                    const retry = await tryGeminiCall(discoveryPath, key, body);
                    if (retry.success) {
                        console.log(`[Discovery] Recovered with: ${model}`);
                        return NextResponse.json(retry.data);
                    }
                }
            }
            lastError = { provider: "gemini", status: result.status, detail: result.data };
        }

        // 3. CỐ CÁNH CUỐI CÙNG: Fallback tới OpenAI/Groq (Dùng mã của người dùng)
        console.log("[Tunnel] All Gemini gates failing. Trying Text-Only Fallback...");
        const fallback = await tryTextOnlyFallback(body);
        if (fallback) {
            console.log("[Tunnel] Fallback Recovery with OpenAI/Groq SUCCESS.");
            return NextResponse.json(fallback);
        }

        return NextResponse.json({ error: "Saga Halted: All AI Channels Failed", detail: lastError }, { status: 502 });

    } catch (error: any) {
        console.error("[Tunnel] Pipeline Crash:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function tryGeminiCall(fullPath: string, key: string, body: any) {
    const url = `https://generativelanguage.googleapis.com${fullPath}?key=${key}`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(9000)
        });
        const raw = await res.text();
        let data: any = null;
        try {
            data = raw ? JSON.parse(raw) : null;
        } catch {
            data = { error: "Upstream returned non-JSON", preview: raw.slice(0, 200) };
        }
        return { success: res.ok, data, status: res.status };
    } catch (e: any) {
        return { success: false, data: e.message, status: 500 };
    }
}

// Logic Fallback OpenAI/Groq từ USER
async function tryTextOnlyFallback(body: any): Promise<any | null> {
    const parts: any[] = body?.contents?.[0]?.parts || [];
    const hasInlineData = parts.some(p => !!p?.inlineData);
    if (hasInlineData) return null; // Không fallback được file PDF nặng

    const prompt = parts.map(p => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean).join('\n');
    if (!prompt.trim()) return null;

    const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
    if (openaiKey) {
        const r = await callOpenAICompatible({
            baseUrl: 'https://api.openai.com/v1',
            apiKey: openaiKey,
            model: 'gpt-4o-mini',
            prompt
        });
        if (r) return wrapAsGeminiCandidate(r);
    }

    const groqKey = (process.env.GROQ_API_KEY || '').trim();
    if (groqKey) {
        const r = await callOpenAICompatible({
            baseUrl: 'https://api.groq.com/openai/v1',
            apiKey: groqKey,
            model: 'llama3-8b-8192',
            prompt
        });
        if (r) return wrapAsGeminiCandidate(r);
    }
    return null;
}

function wrapAsGeminiCandidate(text: string) {
    return { candidates: [{ content: { parts: [{ text }] } }] };
}

async function callOpenAICompatible(args: { baseUrl: string; apiKey: string; model: string; prompt: string }): Promise<string | null> {
    try {
        const res = await fetch(`${args.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${args.apiKey}` },
            body: JSON.stringify({ model: args.model, messages: [{ role: 'user', content: args.prompt }], temperature: 0.4 }),
            signal: AbortSignal.timeout(9000)
        });
        if (!res.ok) return null;
        const raw = await res.text();
        let json: any = null;
        try {
            json = raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
        return json?.choices?.[0]?.message?.content || null;
    } catch { return null; }
}
