import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        console.log("[TEST] 🚀 Simple test endpoint");
        return NextResponse.json({ 
            message: "Simple test works",
            timestamp: new Date().toISOString(),
            env: {
                hasGeminiKey: !!process.env.GEMINI_API_KEY,
                hasOpenAIKey: !!process.env.OPENAI_API_KEY,
                hasGroqKey: !!process.env.GROQ_API_KEY,
                hasProxyUrl: !!process.env.GEMINI_PROXY_URL
            }
        });
    } catch (error: any) {
        console.error("[TEST] 💥 Error:", error.message);
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
}
