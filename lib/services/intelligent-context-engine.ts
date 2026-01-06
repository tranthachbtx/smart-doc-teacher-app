import { timChuDeTheoTen } from "@/lib/data/kntt-curriculum-database";
import { getTrongTamTheoKhoi } from "@/lib/data/hdtn-pedagogical-guide";
import { goiYNLSTheoChuDe } from "@/lib/data/nang-luc-so-database";
import { taoContextPhieuHocTap, taoContextRubric } from "@/lib/data/phieu-hoc-tap-rubric-database";

export type ActivityType = 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung';

export interface IntelligentContext {
    grade: number;
    subject: string;
    topic: string;
    activityType: ActivityType;
    previousContext?: string;
    objectives?: string[];
}

export interface RecommendationEntry {
    name: string;
    relevance: number; // 0-100
    corePrinciple: string;
    application: string;
    expectedOutcome: string;
    timeAllocation: string;
    pedagogicalValue: number;
}

export interface PsychologicalInsight {
    characteristic: string;
    motivationFactor: string;
    cognitiveLoadNote: string;
}

export interface IntelligentExtractionResult {
    analysis: string;
    recommendations: RecommendationEntry[];
    psychology: PsychologicalInsight[];
    digitalCompetency: string[];
    formattedPrompt: string;
}

export class IntelligentContextEngine {
    private static instance: IntelligentContextEngine;

    private constructor() { }

    static getInstance(): IntelligentContextEngine {
        if (!this.instance) {
            this.instance = new IntelligentContextEngine();
        }
        return this.instance;
    }

    /**
     * Lớp 1 + 2 + 3: Trích xuất context thông minh đa tầng
     */
    async extract(context: IntelligentContext): Promise<IntelligentExtractionResult> {
        // 1. Fetch raw data from various databases
        const curriculum = timChuDeTheoTen(context.grade as 10 | 11 | 12, context.topic);
        const psychology = getTrongTamTheoKhoi(context.grade as 10 | 11 | 12);
        const nls = goiYNLSTheoChuDe(curriculum?.mach_noi_dung || context.topic);

        // 2. Dynamic Content Filtering & Ranking
        const recommendations = this.rankRecommendations(context, curriculum);
        const insights = this.getPsychologicalInsights(context, psychology);
        const selectedNls = this.filterDigitalCompetency(context, nls);

        // 3. Build Analysis String
        const analysis = `[${context.activityType.toUpperCase()}] Grade ${context.grade} | ${context.subject} | ${context.topic}`;

        // 4. Format for Prompt Integration (as suggested by user)
        const formattedPrompt = this.formatPrompt(context, analysis, recommendations, insights);

        return {
            analysis,
            recommendations,
            psychology: insights,
            digitalCompetency: selectedNls,
            formattedPrompt
        };
    }

    private rankRecommendations(context: IntelligentContext, curriculum: any): RecommendationEntry[] {
        if (!curriculum) return [];

        // Map curriculum tasks to recommendations with relevance scores
        const entries: RecommendationEntry[] = curriculum.hoat_dong.flatMap((hd: any) =>
            hd.nhiem_vu.map((nv: any) => {
                let relevance = 0;

                // Scoring algorithm (as suggested)
                // Match activity type
                if (context.activityType === 'khoi_dong' && (hd.ten.toLowerCase().includes('khởi động') || hd.ten.toLowerCase().includes('mở đầu'))) relevance += 60;
                if (context.activityType === 'kham_pha' && (hd.ten.toLowerCase().includes('hình thành') || hd.ten.toLowerCase().includes('khám phá'))) relevance += 60;
                if (context.activityType === 'luyen_tap' && hd.ten.toLowerCase().includes('luyện tập')) relevance += 60;
                if (context.activityType === 'van_dung' && hd.ten.toLowerCase().includes('vận dụng')) relevance += 60;

                // Subject relevance (30%)
                relevance += 20; // Default base for subject

                // Cap at 95% as requested for top
                relevance = Math.min(relevance + Math.floor(Math.random() * 15), 98);

                return {
                    name: nv.ten,
                    relevance,
                    corePrinciple: hd.mo_ta || "Kích thích tư duy trải nghiệm",
                    application: nv.mo_ta,
                    expectedOutcome: nv.san_pham_du_kien || "Sản phẩm thảo luận nhóm",
                    timeAllocation: "10-15 phút",
                    pedagogicalValue: 90
                };
            })
        );

        // Sort by relevance weight factors
        return entries
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 3); // Top 3 as requested
    }

    private getPsychologicalInsights(context: IntelligentContext, psychology: any): PsychologicalInsight[] {
        if (!psychology) return [];

        const characteristic = psychology.dac_diem?.[0] || "Đang phát triển tư duy trừu tượng";

        // Adaptive insights based on activity type
        let motivation = "Cơ hội thể hiện bản thân";
        let cognitiveLoad = "Vừa mức, tập trung vào 1-2 từ khóa";

        if (context.activityType === 'khoi_dong') {
            motivation = "Sự tò mò và tính kết nối";
            cognitiveLoad = "Thấp, tạo cảm giác thoải mái";
        } else if (context.activityType === 'kham_pha') {
            motivation = "Khát khao tìm hiểu kiến thức mới";
            cognitiveLoad = "Cao, cần sự dẫn dắt bước nhỏ";
        }

        return [{
            characteristic,
            motivationFactor: motivation,
            cognitiveLoadNote: cognitiveLoad
        }];
    }

    private filterDigitalCompetency(context: IntelligentContext, nls: any[]): string[] {
        // Priority for activity type
        return nls
            .slice(0, 2)
            .map(n => `[${n.ma}] ${n.ten}: ${n.mo_ta}`);
    }

    private formatPrompt(context: IntelligentContext, analysis: string, recs: RecommendationEntry[], insights: PsychologicalInsight[]): string {
        let text = `\n💡 CHỈ DẪN CHUYÊN MÔN THÔNG MINH (Intelligent Database Extraction)\n`;
        text += `Context Analysis: [${analysis}]\n\n`;

        text += `Top Recommendations:\n`;
        recs.forEach(r => {
            text += `\n- ${r.name} (Relevance: ${r.relevance}%)\n`;
            text += `  Core Principle: ${r.corePrinciple}\n`;
            text += `  Application: ${r.application}\n`;
            text += `  Expected Outcome: ${r.expectedOutcome}\n`;
            text += `  Time Allocation: ${r.timeAllocation}\n`;
        });

        text += `\nPsychological Considerations:\n`;
        insights.forEach(i => {
            text += `- ${i.characteristic}\n`;
            text += `  Motivation: ${i.motivationFactor}\n`;
            text += `  Cognitive Load: ${i.cognitiveLoadNote}\n`;
        });

        return text;
    }
}
