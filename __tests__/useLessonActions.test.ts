import { renderHook, act } from '@testing-library/react';
import { useLessonActions } from '../lib/hooks/use-lesson-actions';
import { useLessonStore } from '../lib/store/use-lesson-store';

// Mocking dependencies
jest.mock('../lib/services/export-service', () => ({
    ExportService: {
        exportLesson: jest.fn().mockResolvedValue({ success: true }),
    },
}));

describe('useLessonActions Hook', () => {
    beforeEach(() => {
        useLessonStore.getState().resetAll();
    });

    it('should prevent generation if theme is missing', async () => {
        const { result } = renderHook(() => useLessonActions());

        await act(async () => {
            await result.current.handleGenerateFullPlan();
        });

        expect(useLessonStore.getState().error).toContain("chủ đề");
    });

    it('should handle export flow correctly', async () => {
        // Set mock data
        act(() => {
            useLessonStore.getState().setLessonResult({ ten_bai: 'Test' } as any);
            useLessonStore.getState().setLessonTopic('Test Topic');
        });

        const { result } = renderHook(() => useLessonActions());

        await act(async () => {
            await result.current.handleExportDocx();
        });

        expect(useLessonStore.getState().isExporting).toBe(false);
    });
});
