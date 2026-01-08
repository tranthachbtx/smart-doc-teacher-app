import { PedagogicalOrchestrator, PedagogicalAuditReport } from "@/lib/services/pedagogical-orchestrator";

/**
 * 🔍 ADVANCED PEDAGOGICAL AUDIT - SERVER ACTION (V7)
 * Provides high-fidelity pedagogical auditing using the V7 Orchestrator.
 */
export async function performAdvancedAudit(lessonResult: any): Promise<{ success: boolean; report?: PedagogicalAuditReport; error?: string }> {
    console.log("[AdvancedAudit] Initiating High-Fidelity Pedagogical Audit V7...");

    try {
        const orchestrator = PedagogicalOrchestrator.getInstance();
        const report = await orchestrator.auditLesson(lessonResult);

        return {
            success: (report?.overallScore || 0) > 0,
            report
        };
    } catch (error: any) {
        console.error("[AdvancedAudit] Failed:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
}
