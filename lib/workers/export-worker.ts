
// lib/workers/export-worker.ts
/// <reference lib="webworker" />

// Use the local script we just downloaded
importScripts('/scripts/docx.iife.min.js');

// Helper to access docx from the global scope (IIFE)
const d = (self as any).docx || {};

self.onmessage = async (event: any) => {
    const { content, fileName, options } = event.data;

    try {
        console.log("[Worker] Starting background export for:", fileName);

        // This is where the logic from ExportService would go.
        // For efficiency, we recreate the essential structure here.

        const children: any[] = [
            new d.Paragraph({
                alignment: d.AlignmentType.CENTER,
                children: [
                    new d.TextRun({ text: "KẾ HOẠCH BÀI DẠY (Optimized)", bold: true, size: 28 })
                ]
            }),
            new d.Paragraph({ text: "", spacing: { after: 200 } }),
            // ... (Full implementation would mirror export-service.ts logic)
        ];

        const doc = new d.Document({
            sections: [{ properties: {}, children }],
        });

        const blob = await d.Packer.toBlob(doc);

        self.postMessage({
            type: 'complete',
            blob,
            fileName,
            metrics: {
                workerProcessed: true,
                timestamp: Date.now()
            }
        });

    } catch (error: any) {
        self.postMessage({ type: 'error', error: error.message });
    }
};
