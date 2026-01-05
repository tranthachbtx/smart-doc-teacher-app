
// lib/workers/export-worker.ts
/// <reference lib="webworker" />

/**
 * Enterprise-grade Web Worker for DOCX export (Base64 Transport version).
 * This version uses Base64 for the final document to avoid Blob serialization issues.
 */

// Use absolute path for scripts
importScripts('/scripts/docx.iife.min.js');

// Access the library from global scope
const d = (self as any).docx;

if (!d) {
    self.postMessage({ type: 'error', error: 'Library "docx" failed to load in Worker context.' });
}

// --- Helper Functions ---

const createSectionTitle = (text: string) => {
    return new d.Paragraph({
        heading: d.HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [
            new d.TextRun({
                text: text,
                bold: true,
                size: 28,
                underline: { type: "single" },
                color: "1A365D"
            }),
        ],
    });
};

const parseMarkdownToRuns = (text: string) => {
    if (!text) return [new d.TextRun({ text: "", size: 24 })];
    const runs: any[] = [];
    let currentPos = 0;
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > currentPos) {
            runs.push(new d.TextRun({ text: text.substring(currentPos, match.index), size: 24 }));
        }
        const matchText = match[0];
        if (matchText.startsWith('**')) {
            runs.push(new d.TextRun({ text: matchText.substring(2, matchText.length - 2), bold: true, size: 24 }));
        } else {
            runs.push(new d.TextRun({ text: matchText.substring(1, matchText.length - 1), italics: true, size: 24 }));
        }
        currentPos = regex.lastIndex;
    }
    if (currentPos < text.length) {
        runs.push(new d.TextRun({ text: text.substring(currentPos), size: 24 }));
    }
    return runs.length > 0 ? runs : [new d.TextRun({ text: text, size: 24 })];
};

const renderFormattedText = (text: string) => {
    if (!text) return [new d.Paragraph({ text: "...", size: 24 })];

    const cleanedText = text
        .replace(/```(json|markdown|text|html)?/g, '')
        .replace(/```/g, '')
        .trim();

    const paragraphs: any[] = [];
    const lines = cleanedText.split('\n');

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Heading detection
        if (trimmedLine.startsWith('### ')) {
            paragraphs.push(new d.Paragraph({
                children: [new d.TextRun({ text: trimmedLine.substring(4), bold: true, size: 26, underline: {} })],
                spacing: { before: 120, after: 60 },
                alignment: d.AlignmentType.JUSTIFIED
            }));
            return;
        }

        // Explicit new line detection for list items or steps
        // Detects: -, +, *, •, ●, \d., or specific keywords like "Bước"
        const listMatch = trimmedLine.match(/^([-*•+●]|\d+\.|Bước\s+\d+:?)\s+(.*)/);

        if (listMatch) {
            // It's a list item or distinct step -> New Paragraph with formatting
            paragraphs.push(new d.Paragraph({
                children: parseMarkdownToRuns(trimmedLine),
                spacing: { after: 60, before: 60 },
                alignment: d.AlignmentType.JUSTIFIED,
                indent: { left: 360, hanging: 360 } // Hanging indent for nice list look
            }));
        } else {
            // Standard Paragraph
            paragraphs.push(new d.Paragraph({
                children: parseMarkdownToRuns(trimmedLine),
                spacing: { after: 60, before: 60 },
                alignment: d.AlignmentType.JUSTIFIED,
                indent: { firstLine: 720 }
            }));
        }
    });

    return paragraphs.length > 0 ? paragraphs : [new d.Paragraph({ text: cleanedText, size: 24 })];
};

const createField = (label: string, value: string | undefined) => {
    return new d.Paragraph({
        spacing: { after: 120 },
        children: [
            new d.TextRun({ text: label, bold: true, size: 24 }),
            new d.TextRun({ text: " ", size: 24 }),
            ...parseMarkdownToRuns(value || "...")
        ],
    });
};

const parseTwoColumnContent = (content: string) => {
    if (!content) return { gv: "...", hs: "..." };

    const cot1Match = /\{\{cot_1\}\}/i.exec(content);
    const cot2Match = /\{\{cot_2\}\}/i.exec(content);

    const cot1Index = cot1Match ? cot1Match.index : -1;
    const cot2Index = cot2Match ? cot2Match.index : -1;

    if (cot1Index === -1 && cot2Index === -1) {
        return { gv: content.trim(), hs: "..." };
    }

    let gvContent = "...";
    let hsContent = "...";

    if (cot1Index !== -1) {
        const startGv = cot1Index + 9;
        const endGv = (cot2Index !== -1 && cot2Index > cot1Index) ? cot2Index : content.length;
        gvContent = content.substring(startGv, endGv).trim();
    }

    if (cot2Index !== -1) {
        const startHs = cot2Index + 9;
        hsContent = content.substring(startHs).trim();
    }

    return { gv: gvContent, hs: hsContent };
};

const createTwoColumnTable = (gvContent: string, hsContent: string) => {
    return new d.Table({
        width: { size: 100, type: d.WidthType.PERCENTAGE },
        borders: {
            top: { style: d.BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            bottom: { style: d.BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            left: { style: d.BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            right: { style: d.BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            insideHorizontal: { style: d.BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
            insideVertical: { style: d.BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
        },
        rows: [
            new d.TableRow({
                tableHeader: true,
                cantSplit: true,
                height: { value: 300, rule: d.HeightRule.ATLEAST },
                children: [
                    new d.TableCell({
                        children: [new d.Paragraph({
                            alignment: d.AlignmentType.CENTER,
                            children: [new d.TextRun({ text: "Hoạt động của Giáo viên", bold: true, size: 22 })]
                        })],
                        shading: { fill: "F1F5F9" },
                        width: { size: 50, type: d.WidthType.PERCENTAGE },
                        verticalAlign: d.VerticalAlign.CENTER,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    }),
                    new d.TableCell({
                        children: [new d.Paragraph({
                            alignment: d.AlignmentType.CENTER,
                            children: [new d.TextRun({ text: "Hoạt động của Học sinh", bold: true, size: 22 })]
                        })],
                        shading: { fill: "F1F5F9" },
                        width: { size: 50, type: d.WidthType.PERCENTAGE },
                        verticalAlign: d.VerticalAlign.CENTER,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    }),
                ]
            }),
            new d.TableRow({
                cantSplit: false, // Allow extensive content to split pages
                height: { value: 300, rule: d.HeightRule.ATLEAST },
                children: [
                    new d.TableCell({
                        children: renderFormattedText(gvContent),
                        width: { size: 50, type: d.WidthType.PERCENTAGE },
                        verticalAlign: d.VerticalAlign.TOP,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    }),
                    new d.TableCell({
                        children: renderFormattedText(hsContent),
                        width: { size: 50, type: d.WidthType.PERCENTAGE },
                        verticalAlign: d.VerticalAlign.TOP,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    })
                ]
            })
        ]
    });
};

const createTwoColumnActivity = (title: string, fullContent: string | undefined) => {
    if (!fullContent) return [new d.Paragraph({ text: "...", indent: { left: 360 } })];
    const results: any[] = [
        new d.Paragraph({
            spacing: { before: 240, after: 120 },
            children: [new d.TextRun({ text: title, bold: true, size: 26, color: "2E59A7", underline: {} })]
        })
    ];

    // Robust splitting by steps a), b), c), d) - STRICT START OF LINE
    const steps = fullContent.split(/(?:\r?\n|^)(?=[a-d]\))/i);

    steps.forEach(step => {
        const trimmedStep = step.trim();
        if (!trimmedStep) return;

        if (trimmedStep.toLowerCase().startsWith('d)')) {
            const labelEnd = trimmedStep.indexOf(':');
            const label = labelEnd > -1 ? trimmedStep.substring(0, labelEnd) : "d) Tổ chức thực hiện";
            const body = labelEnd > -1 ? trimmedStep.substring(labelEnd + 1).trim() : trimmedStep.substring(2).trim();

            results.push(new d.Paragraph({
                spacing: { before: 120, after: 60 },
                children: [new d.TextRun({ text: label + ":", bold: true, size: 24, italics: true })]
            }));
            const { gv, hs } = parseTwoColumnContent(body);
            results.push(createTwoColumnTable(gv, hs));
        } else {
            const colonIndex = trimmedStep.indexOf(':');
            if (colonIndex !== -1) {
                const label = trimmedStep.substring(0, colonIndex + 1);
                const body = trimmedStep.substring(colonIndex + 1).trim();
                results.push(new d.Paragraph({
                    spacing: { before: 60, after: 60 },
                    alignment: d.AlignmentType.JUSTIFIED,
                    indent: { firstLine: 720 },
                    children: [
                        new d.TextRun({ text: label, bold: true, size: 24, italics: true }),
                        new d.TextRun({ text: " ", size: 24 }),
                        ...parseMarkdownToRuns(body)
                    ]
                }));
            } else {
                results.push(...renderFormattedText(trimmedStep));
            }
        }
    });

    return results;
};

// --- Main Message Listener ---

self.onmessage = async (event: any) => {
    const { content, fileName } = event.data;
    if (!content || !content.data) return;
    const { data } = content;

    try {
        self.postMessage({ type: 'progress', percent: 10 });

        const children: any[] = [
            new d.Paragraph({
                alignment: d.AlignmentType.CENTER,
                heading: d.HeadingLevel.HEADING_1,
                children: [
                    new d.TextRun({
                        text: "KẾ HOẠCH BÀI DẠY (CHƯƠNG TRÌNH GDPT 2018)",
                        bold: true,
                        size: 32,
                        color: "2E59A7"
                    }),
                ],
            }),
            new d.Paragraph({ text: "", spacing: { after: 200 } }),

            createSectionTitle("I. TÊN BÀI HỌC/CHỦ ĐỀ"),
            createField("", data.title || "..."),

            createSectionTitle("II. MỤC TIÊU"),
            createField("1. Kiến thức:", data.objectives.knowledge),
            createField("2. Năng lực:", data.objectives.skills),
            createField("3. Phẩm chất:", data.objectives.attitudes),
            createField("4. Tích hợp Năng lực số (TT 02/2025):", data.objectives.digital_competency),
            createField("5. Tích hợp Đạo đức/Giá trị:", data.objectives.ethics),

            createSectionTitle("III. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU"),
            createField("1. Đối với Giáo viên:", data.equipment.teacher),
            createField("2. Đối với Học sinh:", data.equipment.student),

            createSectionTitle("IV. TIẾN TRÌNH DẠY HỌC")
        ];

        self.postMessage({ type: 'progress', percent: 30 });

        if (data.activities && Array.isArray(data.activities)) {
            data.activities.forEach((act: any, idx: number) => {
                children.push(...createTwoColumnActivity(act.title, act.content));
                self.postMessage({ type: 'progress', percent: 30 + Math.round(((idx + 1) / data.activities.length) * 40) });
            });
        }

        children.push(
            createSectionTitle("V. HỒ SƠ DẠY HỌC (PHỤ LỤC)"),
            ...renderFormattedText(data.attachments || "..."),
            createSectionTitle("VI. HƯỚNG DẪN VỀ NHÀ"),
            ...renderFormattedText(data.homework || "...")
        );

        self.postMessage({ type: 'progress', percent: 80 });

        const doc = new d.Document({
            sections: [{ children }],
        });

        // ✅ ENHANCED: Try both Base64 and Blob for maximum compatibility
        let base64: string | undefined;
        let blob: Blob | undefined;

        try {
            // Primary: Base64 transport (more reliable for postMessage)
            base64 = await d.Packer.toBase64String(doc);
        } catch (error) {
            console.warn("[Worker] Base64 generation failed, trying Blob:", error);
        }

        try {
            // Fallback: Blob transport (if Base64 fails)
            blob = await d.Packer.toBlob(doc);
        } catch (error) {
            console.warn("[Worker] Blob generation failed:", error);
        }

        if (!base64 && !blob) {
            throw new Error("Both Base64 and Blob generation failed");
        }

        self.postMessage({
            type: 'complete',
            base64,
            blob,
            fileName,
            metrics: {
                workerProcessed: true,
                transport: base64 ? 'base64' : 'blob',
                timestamp: Date.now()
            }
        });

    } catch (error: any) {
        console.error("[Worker Error]", error);
        self.postMessage({ type: 'error', error: error.message });
    }
};
