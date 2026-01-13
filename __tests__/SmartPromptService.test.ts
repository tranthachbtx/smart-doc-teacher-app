import { SmartPromptService } from '../lib/services/smart-prompt-service';

describe('SmartPromptService', () => {
    it('should format student characteristics based on grade', async () => {
        // This assumes the DB is available or mocked
        // Since it's a static service calling a local DB, we can test the logic
        const data10 = await SmartPromptService.lookupSmartData("10", "Chá»§ Ä‘á» 1");
        expect(data10.studentCharacteristics).toContain("Khá»‘i 10");

        const data12 = await SmartPromptService.lookupSmartData("12", "Chá»§ Ä‘á» 1");
        expect(data12.studentCharacteristics).toContain("Khá»‘i 12");
    });

    it('should build a final prompt containing key instructions', () => {
        const mockData: any = {
            grade: "11",
            topicName: "Test Topic",
            objectives: "CHá»¦ Äá»€: Test Topic",
            studentCharacteristics: "Gen Z students",
            coreMissions: {
                khoiDong: "Task 1",
                khamPha: "Task 2",
                luyenTap: "Task 3",
                vanDung: "Task 4"
            },
            shdc_shl_suggestions: "SHDC suggestions",
            digitalCompetency: "Use AI tools",
            assessmentTools: "Rubrics",
            pedagogicalNotes: "Pedagogical notes"
        };

        const prompt = SmartPromptService.buildFinalSmartPrompt("Base Prompt", mockData);
        expect(prompt).toContain("Khá»‘i lá»›p: 11");
        expect(prompt).toContain("CHá»¦ Äá»€: Test Topic");
        expect(prompt).toContain("5512");
    });
});
