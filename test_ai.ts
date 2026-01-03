import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { checkApiKeyStatus, generateAIContent } from "./lib/actions/gemini";

async function test() {
    console.log("Checking API Key Status...");
    const status = await checkApiKeyStatus();
    console.log("Status:", status);

    console.log("\nTesting AI Call...");
    try {
        const res = await generateAIContent("Hello, are you working? Please respond with 'OK'.");
        console.log("Response:", res);
    } catch (e: any) {
        console.error("Test Failed:", e.message);
    }
}

test();
