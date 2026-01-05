import { SmartPromptService } from '../lib/services/smart-prompt-service';

describe('SmartPromptService', () => {
    it('should format student characteristics based on grade', async () => {
        // This assumes the DB is available or mocked
        // Since it's a static service calling a local DB, we can test the logic
        const data10 = await SmartPromptService.lookupSmartData("10", "Chủ đề 1");
        expect(data10.studentCharacteristics).toContain("Khối 10");

        const data12 = await SmartPromptService.lookupSmartData("12", "Chủ đề 1");
        expect(data12.studentCharacteristics).toContain("Khối 12");
    });

    it('should build a final prompt containing key instructions', () => {
        const mockData = {
            grade: "11",
            topicName: "Test Topic",
            objectives: "CHỦ ĐỀ: Test Topic",
            studentCharacteristics: "Gen Z students",
            coreTasks: "Core tasks content",
            shdc_shl_suggestions: "SHDC suggestions",
            digitalCompetency: "Use AI tools",
            assessmentTools: "Rubrics",
            pedagogicalNotes: "Pedagogical notes"
        };

        const prompt = SmartPromptService.buildFinalSmartPrompt(mockData);
        expect(prompt).toContain("Khối lớp: 11");
        expect(prompt).toContain("CHỦ ĐỀ: Test Topic");
        expect(prompt).toContain("5512");
    });
});
