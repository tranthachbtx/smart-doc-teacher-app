import { useLessonStore } from '../lib/store/use-lesson-store';
import { act } from 'react-dom/test-utils';

describe('useLessonStore', () => {
    beforeEach(() => {
        // Reset store before each test if needed
        act(() => {
            useLessonStore.getState().resetAll();
        });
    });

    it('should initialize with default values', () => {
        const state = useLessonStore.getState();
        expect(state.lessonGrade).toBe("10");
        expect(state.isGenerating).toBe(false);
        expect(state.lessonResult).toBeNull();
    });

    it('should update lesson grade', () => {
        act(() => {
            useLessonStore.getState().setLessonGrade("11");
        });
        expect(useLessonStore.getState().lessonGrade).toBe("11");
    });

    it('should set loading state correctly', () => {
        act(() => {
            useLessonStore.getState().setLoading('isGenerating', true);
        });
        expect(useLessonStore.getState().isGenerating).toBe(true);
    });

    it('should set success message and clear error', () => {
        act(() => {
            useLessonStore.getState().setStatus('success', "Success!");
        });
        expect(useLessonStore.getState().success).toBe("Success!");
        expect(useLessonStore.getState().error).toBeNull();
    });
});
