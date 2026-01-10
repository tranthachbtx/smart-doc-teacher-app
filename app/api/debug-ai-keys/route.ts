
import { NextResponse } from "next/server";

export async function GET() {
    const diagnosis: any = {
        env: {
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "Set (Length " + process.env.GEMINI_API_KEY.length + ")" : "Missing",
            GEMINI_API_KEY_2: process.env.GEMINI_API_KEY_2 ? "Set" : "Missing",
            GEMINI_PROXY_URL: process.env.GEMINI_PROXY_URL || "Missing",
            OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set" : "Missing",
        },
        tests: []
    };

    // Test 1: Direct Fetch to Gemini (Bypass Relay)
    if (process.env.GEMINI_API_KEY) {
        try {
            diagnosis.tests.push("Attempting Direct Gemini Call...");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello from Deep Trace" }] }]
                })
            });
            const data = await response.json();
            diagnosis.tests.push({
                name: "Direct Gemini",
                status: response.ok ? "PASS" : "FAIL",
                error: data.error
            });
        } catch (e: any) {
            diagnosis.tests.push({ name: "Direct Gemini", status: "ERROR", message: e.message });
        }
    }

    return NextResponse.json(diagnosis);
}
