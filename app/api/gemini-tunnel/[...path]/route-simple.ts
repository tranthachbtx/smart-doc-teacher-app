import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: any) {
    try {
        console.log("[Tunnel] 🚀 Starting simplified tunnel test...");
        
        let pathParam = params;
        if (pathParam instanceof Promise) pathParam = await pathParam;
        
        const pathArray = pathParam?.path || [];
        let subPath = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;
        
        if (!subPath) {
            const url = new URL(req.url);
            subPath = url.pathname.split('/api/gemini-tunnel/')[1] || "";
        }
        
        const fullPath = subPath.startsWith('/') ? subPath : `/${subPath}`;
        console.log(`[Tunnel] 📝 Path: ${fullPath}`);
        
        const body = await req.json();
        console.log(`[Tunnel] 📝 Body keys: ${Object.keys(body)}`);
        
        // Test environment variables
        const geminiKey = process.env.GEMINI_API_KEY;
        console.log(`[Tunnel] 🔑 Gemini key exists: ${!!geminiKey}`);
        console.log(`[Tunnel] 🔑 Gemini key length: ${geminiKey?.length || 0}`);
        
        return NextResponse.json({ 
            message: "Tunnel test successful",
            path: fullPath,
            hasGeminiKey: !!geminiKey,
            timestamp: new Date().toISOString()
        });
        
    } catch (error: any) {
        console.error("[Tunnel] 💥 Error:", error.message);
        return NextResponse.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
}
