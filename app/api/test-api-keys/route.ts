import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        console.log("[API-Test] 🚀 Starting API key test...");
        
        const results = {
            gemini: [] as any[],
            openai: null as any,
            groq: null as any,
            proxy: null as any
        };
        
        // Test Gemini Keys
        const geminiKeys = [
            process.env.GEMINI_API_KEY,
            process.env.GEMINI_API_KEY_2,
            process.env.GEMINI_API_KEY_3
        ].filter(k => k && k.trim());
        
        console.log(`[API-Test] 🔑 Testing ${geminiKeys.length} Gemini keys...`);
        
        for (let i = 0; i < geminiKeys.length; i++) {
            const key = geminiKeys[i];
            if (!key) continue;
            const keyNum = i + 1;
            
            // Test with different models
            const models = [
                "gemini-2.0-flash",
                "gemini-1.5-flash-8b", 
                "gemini-1.5-flash-latest",
                "gemini-1.5-pro"
            ];
            
            for (const model of models) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: "test" }] }]
                        }),
                        signal: AbortSignal.timeout(5000)
                    });
                    
                    const result: any = {
                        key: keyNum,
                        model: model,
                        status: response.status,
                        ok: response.ok,
                        keyPrefix: key.slice(0, 8) + "..."
                    };
                    
                    if (response.ok) {
                        const data = await response.json();
                        result.hasResponse = !!data.candidates?.[0]?.content?.parts?.[0]?.text;
                        console.log(`[API-Test] ✅ Gemini Key ${keyNum} - ${model}: SUCCESS`);
                    } else {
                        const error = await response.text();
                        result.error = error.slice(0, 100);
                        console.log(`[API-Test] ❌ Gemini Key ${keyNum} - ${model}: ${response.status}`);
                    }
                    
                    results.gemini.push(result);
                    
                } catch (e: any) {
                    results.gemini.push({
                        key: keyNum,
                        model: model,
                        status: "ERROR",
                        error: e.message,
                        keyPrefix: key.slice(0, 8) + "..."
                    });
                }
            }
        }
        
        // Test OpenAI
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey && openaiKey.trim()) {
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
                    signal: AbortSignal.timeout(5000)
                });
                
                results.openai = {
                    status: response.status,
                    ok: response.ok,
                    keyPrefix: openaiKey.slice(0, 8) + "..."
                };
                
                if (response.ok) {
                    const data = await response.json();
                    results.openai.hasResponse = !!data.choices?.[0]?.message?.content;
                    console.log(`[API-Test] ✅ OpenAI: SUCCESS`);
                } else {
                    const error = await response.text();
                    results.openai.error = error.slice(0, 100);
                    console.log(`[API-Test] ❌ OpenAI: ${response.status}`);
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
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey && groqKey.trim()) {
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${groqKey}`
                    },
                    body: JSON.stringify({
                        model: "llama3-8b-8192",
                        messages: [{ role: "user", content: "test" }],
                        max_tokens: 10
                    }),
                    signal: AbortSignal.timeout(5000)
                });
                
                results.groq = {
                    status: response.status,
                    ok: response.ok,
                    keyPrefix: groqKey.slice(0, 8) + "..."
                };
                
                if (response.ok) {
                    const data = await response.json();
                    results.groq.hasResponse = !!data.choices?.[0]?.message?.content;
                    console.log(`[API-Test] ✅ Groq: SUCCESS`);
                } else {
                    const error = await response.text();
                    results.groq.error = error.slice(0, 100);
                    console.log(`[API-Test] ❌ Groq: ${response.status}`);
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
                const response = await fetch(`${proxyUrl}/v1beta/models/gemini-2.0-flash:generateContent`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "test" }] }]
                    }),
                    signal: AbortSignal.timeout(5000)
                });
                
                results.proxy = {
                    url: proxyUrl,
                    status: response.status,
                    ok: response.ok
                };
                
                if (response.ok) {
                    console.log(`[API-Test] ✅ Proxy: SUCCESS`);
                } else {
                    const error = await response.text();
                    results.proxy.error = error.slice(0, 100);
                    console.log(`[API-Test] ❌ Proxy: ${response.status}`);
                }
                
            } catch (e: any) {
                results.proxy = {
                    url: proxyUrl,
                    status: "ERROR",
                    error: e.message
                };
            }
        }
        
        console.log(`[API-Test] 📊 Test completed`);
        return NextResponse.json(results);
        
    } catch (error: any) {
        console.error("[API-Test] 💥 Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
