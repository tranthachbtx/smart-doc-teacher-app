export class WorkerManager {
    private static workerPool: Worker[] = [];
    private static maxWorkers = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
    private static queue: (() => void)[] = [];
    private static activeWorkers = 0;

    /**
     * Pool management: Get an available worker or spawn a new one
     */
    private static getWorker(): Worker {
        if (this.workerPool.length > 0) {
            return this.workerPool.pop()!;
        }

        try {
            // Attempt to use the actual worker file (Phase 2.1)
            // Note: In Next.js, this usually requires new Worker(new URL('../workers/export-worker.ts', import.meta.url))
            return new Worker(new URL('../workers/export-worker.ts', import.meta.url));
        } catch (e) {
            console.warn("Could not load worker file, falling back to Blob worker");
            // Fallback to Blob-based worker (Phase 2.1) if file-based fails
            const workerCode = `
                self.onmessage = function(e) {
                    const { content, fileName, options } = e.data;
                    self.postMessage({ type: 'progress', percent: 20 });
                    // Signal fallback required
                    self.postMessage({ type: 'error', error: 'Worker-side docx generation requires library bundling.' });
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            return new Worker(URL.createObjectURL(blob));
        }
    }

    private static releaseWorker(worker: Worker) {
        if (this.workerPool.length < this.maxWorkers) {
            this.workerPool.push(worker);
        } else {
            worker.terminate();
        }
    }

    /**
     * Executes the export process in a background worker with queue management (Phase 2.2)
     */
    static async executeExport(content: any, fileName: string, options: {
        timeout: number;
        chunkSize: number;
        onProgress?: (percent: number) => void
    }): Promise<{ blob: Blob; fileName: string; metrics: any }> {
        return new Promise((resolve, reject) => {
            const task = () => {
                this.activeWorkers++;
                this.runTask(content, fileName, options)
                    .then(resolve)
                    .catch(reject)
                    .finally(() => {
                        this.activeWorkers--;
                        this.processQueue();
                    });
            };

            this.queue.push(task);
            this.processQueue();
        });
    }

    private static processQueue() {
        while (this.activeWorkers < this.maxWorkers && this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) task();
        }
    }

    private static async runTask(content: any, fileName: string, options: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof Worker === 'undefined') {
                return reject(new Error("Worker not supported"));
            }

            const worker = this.getWorker();
            const timeoutId = setTimeout(() => {
                worker.terminate();
                reject(new Error("Worker timeout"));
            }, options.timeout);

            worker.onmessage = (e) => {
                const message = e.data;
                if (message.type === 'progress') {
                    if (options.onProgress) options.onProgress(message.percent);
                } else if (message.type === 'complete') {
                    clearTimeout(timeoutId);
                    this.releaseWorker(worker);
                    resolve(message);
                } else if (message.type === 'error') {
                    clearTimeout(timeoutId);
                    worker.terminate();
                    reject(new Error(message.error));
                }
            };

            worker.onerror = (err) => {
                clearTimeout(timeoutId);
                worker.terminate();
                reject(err);
            };

            worker.postMessage({ content, fileName, options });
        });
    }
}
