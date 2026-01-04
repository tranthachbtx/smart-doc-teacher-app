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
    "gemini-1.5-flash-8b",
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

        console.log(`[Tunnel] 🚀 Request: ${fullPath}`);
        console.log(`[Tunnel] 🔑 Available keys: ${API_KEYS.length}`);

        let lastError: any = null;

        // 1. Thử qua Cloudflare Proxy
        if (proxyUrl) {
            try {
                const targetUrl = `${proxyUrl.replace(/\/$/, "")}${fullPath}`;
                console.log(`[Tunnel] 🌩️ Proxy Attempt -> ${targetUrl}`);
                const response = await fetch(targetUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(9000)
                });

                if (response.ok) {
                    const raw = await response.text();
                    try {
                        const data = raw ? JSON.parse(raw) : null;
                        console.log(`[Tunnel] ✅ Proxy SUCCESS`);
                        return NextResponse.json(data);
                    } catch {
                        console.warn("[Tunnel] ⚠️ Proxy returned non-JSON");
                    }
                } else {
                    console.warn(`[Tunnel] ⚠️ Proxy failed: ${response.status}`);
                }
            } catch (e: any) {
                console.warn(`[Tunnel] ⚠️ Proxy error: ${e.message}`);
            }
        }

        // 2. Thử xoay Key trực tiếp
        console.log(`[Tunnel] 🔑 Trying direct Gemini with ${API_KEYS.length} keys...`);
        for (let i = 0; i < API_KEYS.length; i++) {
            const key = API_KEYS[i];
            console.log(`[Tunnel] 🔑 Key ${i + 1}/${API_KEYS.length}`);
            let result = await tryGeminiCall(fullPath, key, body);
            
            if (result.success) {
                console.log(`[Tunnel] ✅ Key ${i + 1} SUCCESS`);
                return NextResponse.json(result.data);
            }

            // Model discovery cho 404/429
            if (result.status === 404 || result.status === 429) {
                console.log(`[Tunnel] 🔍 Key ${i + 1} failed (${result.status}). Discovery...`);
                for (const model of DISCOVERY_MODELS) {
                    const discoveryPath = fullPath.replace(/models\/[^:]+:/, `models/${model}:`);
                    if (discoveryPath === fullPath) continue;

                    const retry = await tryGeminiCall(discoveryPath, key, body);
                    if (retry.success) {
                        console.log(`[Tunnel] ✅ Discovery SUCCESS: ${model}`);
                        return NextResponse.json(retry.data);
                    }
                }
            }
            lastError = { provider: "gemini", status: result.status, detail: result.data };
            console.log(`[Tunnel] ❌ Key ${i + 1} failed: ${result.status}`);
        }

        // 3. Fallback OpenAI/Groq
        console.log("[Tunnel] 🆘 Trying fallback...");
        const fallback = await tryTextOnlyFallback(body);
        if (fallback) {
            console.log("[Tunnel] ✅ Fallback SUCCESS");
            return NextResponse.json(fallback);
        }

        console.log("[Tunnel] 💀 All failed");
        return NextResponse.json({ 
            error: "Saga Halted: All AI Channels Failed", 
            detail: lastError 
        }, { status: 502 });

    } catch (error: any) {
        console.error("[Tunnel] 💥 Crash:", error.message);
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
            data = { error: "Non-JSON response", preview: raw.slice(0, 200) };
        }
        return { success: res.ok, data, status: res.status };
    } catch (e: any) {
        return { success: false, data: e.message, status: 500 };
    }
}

async function tryTextOnlyFallback(body: any): Promise<any | null> {
    const parts: any[] = body?.contents?.[0]?.parts || [];
    const hasInlineData = parts.some(p => !!p?.inlineData);
    if (hasInlineData) return null;

    const prompt = parts.map(p => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean).join('\n');
    if (!prompt.trim()) return null;

    // OpenAI
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

    // Groq
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
            body: JSON.stringify({ 
                model: args.model, 
                messages: [{ role: 'user', content: args.prompt }], 
                temperature: 0.4 
            }),
            signal: AbortSignal.timeout(9000)
        });
        if (!res.ok) return null;
        const raw = await res.text();
        const json = raw ? JSON.parse(raw) : null;
        return json?.choices?.[0]?.message?.content || null;
    } catch { 
        return null; 
    }
}
