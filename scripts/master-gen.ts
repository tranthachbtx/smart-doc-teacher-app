
import {
    generateLessonSection,
    generateLessonPlan
} from "../lib/actions/gemini";

const grade = "12";
const topic = "Chung tay gìn giữ, bảo tồn cảnh quan thiên nhiên";
const duration = "2 tiết";
const month = 2; // Topic 6 is usually February

const steps = [
    "blueprint", "setup", "shdc_shl", "khởi động",
    "khám_phá_1", "khám_phá_2", "khám_phá_3", "khám_phá_4",
    "luyện_tập_1", "luyện_tập_2", "luyện_tập_3",
    "vận dụng", "final", "preparation"
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
                context,
                duration,
                "",
                [],
                month,
                {},
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
