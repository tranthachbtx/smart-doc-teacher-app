
"use server";

import { NeuralComplianceAuditor, ComplianceReport } from "@/lib/services/neural-compliance-auditor";

/**
 * 🔍 ADVANCED NEURAL AUDIT - SERVER ACTION
 * Provides high-fidelity pedagogical auditing using the advanced engine.
 */
export async function performAdvancedAudit(lessonResult: any): Promise<{ success: boolean; report?: ComplianceReport; error?: string }> {
    console.log("[AdvancedAudit] Initiating deep pedagogical audit...");

    try {
        const auditor = NeuralComplianceAuditor.getInstance();
        const report = await auditor.deepAudit(lessonResult);

        return {
            success: report.score > 0,
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
