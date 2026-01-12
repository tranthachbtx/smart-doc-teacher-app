
import {
    generateLessonSection,
    generateLessonPlan
} from "../lib/actions/gemini";

const grade = "12";
const topic = "Chung tay gÃ¬n giá»¯, báº£o tá»“n cáº£nh quan thiÃªn nhiÃªn";
const duration = "2 tiáº¿t";
const month = 2; // Topic 6 is usually February

const steps = [
    "blueprint", "setup", "shdc_shl", "khá»Ÿi Ä‘á»™ng",
    "khÃ¡m_phÃ¡_1", "khÃ¡m_phÃ¡_2", "khÃ¡m_phÃ¡_3", "khÃ¡m_phÃ¡_4",
    "luyá»‡n_táº­p_1", "luyá»‡n_táº­p_2", "luyá»‡n_táº­p_3",
    "váº­n dá»¥ng", "final", "preparation"
];

async function run() {
    console.log(`[Master-Gen] Starting generation for ${grade} - ${topic}`);
    let context: any = {};

    for (const step of steps) {
        console.log(`[Master-Gen] Processing step: ${step}...`);
        try {
            const result = await generateLessonSection(
                grade,
                topic,
                step,
                JSON.stringify(context),
                duration,
                "",
                [],
                String(month),
                undefined,
                "gemini-1.5-flash-002"
            );

            if (result.success) {
                console.log(`[Master-Gen] Step ${step} SUCCESS.`);
                context = { ...context, ...result.data };
            } else {
                console.error(`[Master-Gen] Step ${step} FAILED: ${result.error}`);
                // If it failed because of Shadow Ban, the 30s gap is already happening in gemini.ts
            }
        } catch (e: any) {
            console.error(`[Master-Gen] Critical Error at ${step}: ${e.message}`);
        }
    }
    console.log("[Master-Gen] FINISHED all steps.");
}

run();
