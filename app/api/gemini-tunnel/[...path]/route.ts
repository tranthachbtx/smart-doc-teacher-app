import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: any) {
    try {
        console.log("[Tunnel] 🚀 Starting request...");
        
        // Simple params handling
        const pathArray = params?.path || [];
        const fullPath = `/v1beta/models/gemini-2.0-flash:generateContent`;
        
        console.log(`[Tunnel] 📝 Path: ${fullPath}`);
        
        // Simple body parsing
        let body;
        try {
            body = await req.json();
            console.log(`[Tunnel] 📝 Body parsed successfully`);
        } catch (e) {
            console.error("[Tunnel] 💥 Body parse failed:", e);
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }
        
        // Test Gemini direct call
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            console.error("[Tunnel] 💥 No Gemini key");
            return NextResponse.json({ error: "No Gemini key" }, { status: 500 });
        }
        
        // Proxy-First Strategy - Proxy đang hoạt động tốt nhất
        const proxyUrl = process.env.GEMINI_PROXY_URL;
        if (proxyUrl) {
            console.log(`[Tunnel] 🌩️ Using WORKING proxy as primary...`);
            try {
                const targetUrl = `${proxyUrl.replace(/\/$/, "")}${fullPath}`;
                const response = await fetch(targetUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                    signal: AbortSignal.timeout(15000) // Tăng timeout cho proxy
                });

                if (response.ok) {
                    const raw = await response.text();
                    console.log(`[Tunnel] 📝 Proxy raw response: ${raw.slice(0, 100)}...`);
                    
                    // Try parse as JSON first
                    try {
                        const data = raw ? JSON.parse(raw) : null;
                        console.log(`[Tunnel] ✅ Proxy SUCCESS (JSON)!`);
                        return NextResponse.json(data);
                    } catch (e) {
                        // If not JSON, try to extract text from common formats
                        console.log(`[Tunnel] 🔄 Proxy returned non-JSON, attempting to parse...`);
                        
                        // Try to extract text from common response formats
                        let textContent = raw;
                        
                        // If it looks like a plain text response, wrap it
                        if (raw.trim() && !raw.startsWith('{') && !raw.startsWith('[')) {
                            textContent = raw.trim();
                            return NextResponse.json({
                                candidates: [{
                                    content: {
                                        parts: [{ text: textContent }]
                                    }
                                }]
                            });
                        }
                        
                        console.warn("[Tunnel] ⚠️ Could not parse proxy response");
                    }
                } else {
                    console.warn(`[Tunnel] ⚠️ Proxy failed: ${response.status}`);
                }
            } catch (e: any) {
                console.warn(`[Tunnel] ⚠️ Proxy error: ${e.message}`);
            }
        } else {
            console.log("[Tunnel] ℹ️ No proxy URL configured");
        }
        
        // Fallback chỉ khi proxy hoàn toàn fails
        console.log(`[Tunnel] 🆘 Proxy failed, trying fallback...`);
        
        const parts = body?.contents?.[0]?.parts || [];
        const prompt = parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean).join('\n');
        
        if (!prompt.trim()) {
            return NextResponse.json({ error: "No text content found" }, { status: 400 });
        }
        
        console.log(`[Tunnel] 📝 Fallback prompt length: ${prompt.length}`);
        
        // Thử OpenAI với retry
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey && openaiKey.trim()) {
            console.log(`[Tunnel] 🤖 Trying OpenAI with retry...`);
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    console.log(`[Tunnel] 🤖 OpenAI attempt ${attempt}/3`);
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': `Bearer ${openaiKey}` 
                        },
                        body: JSON.stringify({ 
                            model: 'gpt-4o-mini', 
                            messages: [{ role: 'user', content: prompt }], 
                            temperature: 0.4,
                            max_tokens: 1000
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const text = data?.choices?.[0]?.message?.content;
                        if (text) {
                            console.log(`[Tunnel] ✅ OpenAI SUCCESS on attempt ${attempt}!`);
                            return NextResponse.json({ 
                                candidates: [{ content: { parts: [{ text }] } }] 
                            });
                        }
                    } else if (response.status === 429) {
                        console.log(`[Tunnel] ⏰ OpenAI rate limited, waiting ${attempt * 2}s...`);
                        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
                        continue;
                    } else {
                        console.log(`[Tunnel] ❌ OpenAI failed: ${response.status}`);
                        break;
                    }
                } catch (e: any) {
                    console.log(`[Tunnel] ❌ OpenAI error: ${e.message}`);
                    break;
                }
            }
        }
        
        console.log(`[Tunnel] 💀 All providers failed`);
        return NextResponse.json({ 
            error: "All AI providers failed - please check API keys",
            hasProxy: !!proxyUrl,
            hasOpenAI: !!openaiKey,
            hasGroq: !!process.env.GROQ_API_KEY
        }, { status: 502 });
        
    } catch (error: any) {
        console.error("[Tunnel] 💥 Unhandled error:", error.message);
        console.error("[Tunnel] 💥 Stack:", error.stack);
        return NextResponse.json({ 
            error: "Internal server error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
