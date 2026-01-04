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
        
        // Force fallback to test OpenAI/Groq
        console.log(`[Tunnel] 🆘 Forcing fallback to test backup providers...`);
        
        const parts = body?.contents?.[0]?.parts || [];
        const prompt = parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean).join('\n');
        
        if (!prompt.trim()) {
            return NextResponse.json({ error: "No text content found" }, { status: 400 });
        }
        
        console.log(`[Tunnel] 📝 Prompt length: ${prompt.length}`);
        
        // Try OpenAI
        const openaiKey = process.env.OPENAI_API_KEY;
        if (openaiKey) {
            console.log(`[Tunnel] 🤖 Trying OpenAI...`);
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${openaiKey}` 
                    },
                    body: JSON.stringify({ 
                        model: 'gpt-4o-mini', 
                        messages: [{ role: 'user', content: prompt }], 
                        temperature: 0.4 
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const text = data?.choices?.[0]?.message?.content;
                    if (text) {
                        console.log(`[Tunnel] ✅ OpenAI SUCCESS!`);
                        return NextResponse.json({ 
                            candidates: [{ content: { parts: [{ text }] } }] 
                        });
                    }
                }
                console.log(`[Tunnel] ❌ OpenAI failed: ${response.status}`);
            } catch (e: any) {
                console.log(`[Tunnel] ❌ OpenAI error: ${e.message}`);
            }
        }
        
        // Try Groq
        const groqKey = process.env.GROQ_API_KEY;
        if (groqKey) {
            console.log(`[Tunnel] 🦊 Trying Groq...`);
            try {
                const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${groqKey}` 
                    },
                    body: JSON.stringify({ 
                        model: 'llama3-8b-8192', 
                        messages: [{ role: 'user', content: prompt }], 
                        temperature: 0.4 
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const text = data?.choices?.[0]?.message?.content;
                    if (text) {
                        console.log(`[Tunnel] ✅ Groq SUCCESS!`);
                        return NextResponse.json({ 
                            candidates: [{ content: { parts: [{ text }] } }] 
                        });
                    }
                }
                console.log(`[Tunnel] ❌ Groq failed: ${response.status}`);
            } catch (e: any) {
                console.log(`[Tunnel] ❌ Groq error: ${e.message}`);
            }
        }
        
        console.log(`[Tunnel] 💀 All providers failed`);
        return NextResponse.json({ 
            error: "All AI providers failed",
            hasGeminiKey: !!geminiKey,
            hasOpenAI: !!openaiKey,
            hasGroq: !!groqKey
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
