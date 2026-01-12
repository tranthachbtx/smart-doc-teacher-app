import { NextRequest, NextResponse } from 'next/server';

// Helper to clean keys from potential quotes and spaces
const clean = (k: string | undefined) => k?.trim().replace(/^["']|["']$/g, '') || "";

export async function GET(req: NextRequest) {
    try {
        console.log("[API-Test] ðŸš€ Starting API key test...");

        const results = {
            gemini: [] as any[],
            openai: null as any,
            groq: null as any,
            proxy: null as any
        };

        const geminiKeys = [
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3
        ].filter(k => !!k).map(k => clean(k));

        console.log(`[API-Test] ðŸ”‘ Testing ${geminiKeys.length} Gemini keys...`);

        for (let i = 0; i < geminiKeys.length; i++) {
            const key = geminiKeys[i];
            if (!key) continue;
            const keyNum = i + 1;

            // ðŸ” MODEL DISCOVERY v43.0: Thay vÃ¬ Ä‘oÃ¡n, hÃ£y há»i Google Key nÃ y dÃ¹ng Ä‘Æ°á»£c gÃ¬
            try {
                const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
                const listResp = await fetch(listUrl);
                const listData = await listResp.json();

                const availableModels = (listData.models || []).map((m: any) => m.name.replace("models/", ""));

                // Thá»­ nghiá»‡m model Ä‘áº§u tiÃªn cÃ³ trong danh sÃ¡ch kháº£ dá»¥ng
                const modelToTest = availableModels.find((m: string) => m.includes("flash")) || availableModels[0] || "gemini-1.5-flash";

                const isExperimental = modelToTest.includes("2.0") || modelToTest.includes("exp");
                const version = isExperimental ? "v1beta" : "v1";
                const testUrl = `https://generativelanguage.googleapis.com/${version}/models/${modelToTest}:generateContent?key=${key}`;

                const testResp = await fetch(testUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: "test" }] }] }),
                    signal: AbortSignal.timeout(10000)
                });

                results.gemini.push({
                    key: keyNum,
                    primaryModel: modelToTest,
                    status: testResp.status,
                    ok: testResp.ok,
                    availableCount: availableModels.length,
                    capabilities: availableModels.slice(0, 5), // Hiá»‡n 5 model tiÃªu biá»ƒu
                    keyPrefix: key.slice(0, 8) + "...",
                    error: testResp.ok ? null : (await testResp.json().catch(() => ({}))).error?.message
                });

                console.log(`[API-Test] ðŸ”‘ Key ${keyNum} discovered ${availableModels.length} models. Tested: ${modelToTest}`);

            } catch (e: any) {
                results.gemini.push({
                    key: keyNum,
                    status: "ERROR",
                    error: e.message,
                    keyPrefix: key.slice(0, 8) + "..."
                });
            }
        }

        // Test OpenAI
        const openaiKey = clean(process.env.OPENAI_API_KEY);
        if (openaiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "test" }],
                        max_tokens: 10
                    }),
                    signal: AbortSignal.timeout(20000)
                });

                results.openai = {
                    status: response.status,
                    ok: response.ok,
                    keyPrefix: openaiKey.slice(0, 8) + "..."
                };

                if (response.ok) {
                    const data = await response.json();
                    results.openai.hasResponse = !!data.choices?.[0]?.message?.content;
                    console.log(`[API-Test] âœ… OpenAI: SUCCESS`);
                } else {
                    const errorData = await response.json().catch(() => ({ error: { message: "Lá»—i káº¿t ná»‘i hoáº·c háº¿t sá»‘ dÆ° OpenAI" } }));
                    results.openai.error = errorData.error?.message || "Lá»—i OpenAI khÃ´ng xÃ¡c Ä‘á»‹nh";
                    console.log(`[API-Test] âŒ OpenAI: ${response.status}`);
                }

            } catch (e: any) {
                results.openai = {
                    status: "ERROR",
                    error: e.message,
                    keyPrefix: openaiKey.slice(0, 8) + "..."
                };
            }
        }

        // Test Groq
        const groqKey = clean(process.env.GROQ_API_KEY);
        if (groqKey) {
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${groqKey}`
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [{ role: "user", content: "test" }],
                        max_tokens: 10
                    }),
                    signal: AbortSignal.timeout(20000)
                });

                results.groq = {
                    status: response.status,
                    ok: response.ok,
                    keyPrefix: groqKey.slice(0, 8) + "..."
                };

                if (response.ok) {
                    const data = await response.json();
                    results.groq.hasResponse = !!data.choices?.[0]?.message?.content;
                    console.log(`[API-Test] âœ… Groq: SUCCESS`);
                } else {
                    const errorData = await response.json().catch(() => ({ error: { message: "Lá»—i cáº¥u hÃ¬nh hoáº·c thÃ´ng sá»‘ Groq" } }));
                    results.groq.error = errorData.error?.message || "Lá»—i Groq khÃ´ng xÃ¡c Ä‘á»‹nh";
                    console.log(`[API-Test] âŒ Groq: ${response.status}`);
                }

            } catch (e: any) {
                results.groq = {
                    status: "ERROR",
                    error: e.message,
                    keyPrefix: groqKey.slice(0, 8) + "..."
                };
            }
        }

        // Test Proxy
        const proxyUrl = process.env.GEMINI_PROXY_URL;
        if (proxyUrl) {
            try {
                // ðŸ” ADAPTIVE PROXY TEST v44.0: DÃ¹ng model Ä‘Ã£ thÃ nh cÃ´ng á»Ÿ trÃªn Ä‘á»ƒ test proxy
                const keyToTest = geminiKeys[0] || "";
                const successfulGemini = results.gemini.find(r => r.ok);
                const modelToUse = successfulGemini?.primaryModel || "gemini-1.5-flash";

                const isExp = modelToUse.includes("2.0") || modelToUse.includes("exp");
                const ver = isExp ? "v1beta" : "v1";
                const mid = `models/${modelToUse}`;

                const url = `${proxyUrl.replace(/\/$/, '')}/${ver}/${mid}:generateContent?key=${keyToTest}`;

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: "test" }] }] }),
                    signal: AbortSignal.timeout(20000)
                });

                results.proxy = {
                    url: proxyUrl,
                    status: response.status,
                    ok: response.ok,
                    usingKey: keyToTest.slice(0, 8) + "..."
                };

                if (response.ok) {
                    console.log(`[API-Test] âœ… Proxy: SUCCESS`);
                } else {
                    const error = await response.text();
                    results.proxy.error = error.slice(0, 150);
                    console.log(`[API-Test] âŒ Proxy: ${response.status}`);
                }

            } catch (e: any) {
                results.proxy = {
                    url: proxyUrl,
                    status: "ERROR",
                    error: e.message
                };
            }
        }

        console.log(`[API-Test] ðŸ“Š Test completed`);
        return NextResponse.json(results);

    } catch (error: any) {
        console.error("[API-Test] ðŸ’¥ Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
