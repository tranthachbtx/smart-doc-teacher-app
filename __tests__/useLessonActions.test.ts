import { renderHook, act } from '@testing-library/react';
import { useLessonActions } from '../lib/hooks/use-lesson-actions';
import { useLessonStore } from '../lib/store/use-lesson-store';

// ðŸ§ª MOCKING FOR V18.1 ACCURACY
jest.mock('../lib/services/document-export-system', () => ({
    DocumentExportSystem: {
        getInstance: () => ({
            exportLesson: jest.fn().mockResolvedValue(true),
        }),
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

        const error = useLessonStore.getState().error;
        expect(error).toContain("chá»§ Ä‘á»");
    });

    it('should handle export flow correctly', async () => {
        // Set mock data
        act(() => {
            useLessonStore.setState({ result: { ten_bai: 'Test' } as any });
        });

        const { result } = renderHook(() => useLessonActions());

        await act(async () => {
            await result.current.handleExportDocx();
        });

        expect(useLessonStore.getState().isExporting).toBe(false);
    });
});
