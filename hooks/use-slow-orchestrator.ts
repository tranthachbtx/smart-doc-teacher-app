
import { useState, useCallback, useEffect } from 'react';
import { SagaJob, getJob, saveJob, listJobs, ClientSagaOrchestrator } from '@/lib/orchestrator/client-saga';

export function useSlowOrchestrator() {
    const [currentJob, setCurrentJob] = useState<SagaJob | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<SagaJob[]>([]);

    const refreshHistory = useCallback(async () => {
        const jobs = await listJobs();
        setHistory(jobs.sort((a, b) => (b.lastUpdateTime || 0) - (a.lastUpdateTime || 0)));
    }, []);

    useEffect(() => {
        refreshHistory();
    }, [refreshHistory]);

    const startJob = useCallback(async (grade: string, topic: string, lessonFile?: { mimeType: string, data: string, name: string }, expertGuidance?: string) => {
        const jobId = `job_${Date.now()}`;
        const newJob: SagaJob = {
            jobId,
            grade,
            topic,
            tasks: [],
            status: 'idle',
            startTime: Date.now(),
            lastUpdateTime: Date.now(),
            lessonFile,
            expertGuidance,
        };

        await saveJob(newJob);
        setCurrentJob(newJob);
        setIsGenerating(true);

        const orchestrator = new ClientSagaOrchestrator(newJob, (updatedJob) => {
            setCurrentJob(updatedJob);
        });

        try {
            await orchestrator.run();
        } finally {
            setIsGenerating(false);
            refreshHistory();
        }
    }, [refreshHistory]);

    const resumeJob = useCallback(async (jobId: string) => {
        const job = await getJob(jobId);
        if (!job) return;

        setCurrentJob(job);
        setIsGenerating(true);

        const orchestrator = new ClientSagaOrchestrator(job, (updatedJob) => {
            setCurrentJob(updatedJob);
        });

        try {
            await orchestrator.run();
        } finally {
            setIsGenerating(false);
            refreshHistory();
        }
    }, [refreshHistory]);

    return {
        currentJob,
        isGenerating,
        history,
        startJob,
        resumeJob,
        refreshHistory,
    };
}
