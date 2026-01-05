
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    VerticalAlign,
    HeightRule
} from "docx";
import * as fs from "fs";

// === Recreating Logic from ExportService to ensure STRUCTURE correctness ===

const parseMarkdownToRuns = (text: string) => {
    if (!text) return [new TextRun({ text: "", size: 24 })];
    const runs: any[] = [];
    let currentPos = 0;
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > currentPos) {
            runs.push(new TextRun({ text: text.substring(currentPos, match.index), size: 24 }));
        }
        const matchText = match[0];
        if (matchText.startsWith('**')) {
            runs.push(new TextRun({ text: matchText.substring(2, matchText.length - 2), bold: true, size: 24 }));
        } else {
            runs.push(new TextRun({ text: matchText.substring(1, matchText.length - 1), italics: true, size: 24 }));
        }
        currentPos = regex.lastIndex;
    }
    if (currentPos < text.length) {
        runs.push(new TextRun({ text: text.substring(currentPos), size: 24 }));
    }
    return runs.length > 0 ? runs : [new TextRun({ text: text, size: 24 })];
};

const renderFormattedText = (text: string) => {
    if (!text) return [new Paragraph({ text: "...", size: 24 })];

    const cleanedText = text
        .replace(/```(json|markdown|text|html)?/g, '')
        .replace(/```/g, '')
        .trim();

    const paragraphs: any[] = [];
    const lines = cleanedText.split('\n');

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('### ')) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmedLine.substring(4), bold: true, size: 26, underline: {} })],
                spacing: { before: 100, after: 80 }
            }));
            return;
        }

        const listMatch = trimmedLine.match(/^([-*•]|\d+\.)\s+(.*)/);
        if (listMatch) {
            paragraphs.push(new Paragraph({
                children: parseMarkdownToRuns(listMatch[2]),
                bullet: { level: 0 },
                spacing: { after: 120 }
            }));
        } else {
            paragraphs.push(new Paragraph({
                children: parseMarkdownToRuns(line),
                spacing: { after: 120 }
            }));
        }
    });

    return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: cleanedText, size: 24 })];
};

const createSectionTitle = (text: string) => {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 28,
                underline: { type: "single" },
                color: "1A365D"
            }),
        ],
    });
};

const createField = (label: string, value: string | undefined) => {
    return new Paragraph({
        spacing: { after: 120 },
        children: [
            new TextRun({ text: label, bold: true, size: 24 }),
            new TextRun({ text: " ", size: 24 }),
            ...parseMarkdownToRuns(value || "...")
        ],
    });
};

// === CRITICAL TABLE LOGIC FROM EXPORT SERVICE ===
const parseTwoColumnContent = (content: string) => {
    if (!content) return { gv: "...", hs: "..." };
    const cot1Regex = /\{\{cot_1\}\}([\s\S]*?)(?=\{\{cot_2\}\}|$)/i;
    const cot2Regex = /\{\{cot_2\}\}([\s\S]*?)(?=\{\{cot_1\}\}|$)/i;
    const gvMatch = content.match(cot1Regex);
    const hsMatch = content.match(cot2Regex);
    return {
        gv: gvMatch ? gvMatch[1].trim() : content.split('{{')[0].trim() || "...",
        hs: hsMatch ? hsMatch[1].trim() : "..."
    };
};

const createTwoColumnTable = (gvContent: string, hsContent: string) => {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            left: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            right: { style: BorderStyle.SINGLE, size: 2, color: "E2E8F0" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "F1F5F9" },
        },
        rows: [
            new TableRow({
                tableHeader: true,
                cantSplit: true,
                height: { value: 300, rule: HeightRule.ATLEAST }, // FIXED LOGIC
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "Hoạt động của Giáo viên", bold: true, size: 22 })]
                        })],
                        shading: { fill: "F1F5F9" },
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "Hoạt động của Học sinh", bold: true, size: 22 })]
                        })],
                        shading: { fill: "F1F5F9" },
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                    }),
                ]
            }),
            new TableRow({
                cantSplit: true,
                height: { value: 300, rule: HeightRule.ATLEAST }, // FIXED LOGIC
                children: [
                    new TableCell({
                        children: renderFormattedText(gvContent),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP
                    }),
                    new TableCell({
                        children: renderFormattedText(hsContent),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP
                    })
                ]
            })
        ]
    });
};

const createTwoColumnActivity = (title: string, fullContent: string | undefined) => {
    if (!fullContent) return [new Paragraph({ text: "...", indent: { left: 360 } })];
    const results: any[] = [
        new Paragraph({
            spacing: { before: 240, after: 120 },
            children: [new TextRun({ text: title, bold: true, size: 26, color: "2E59A7", underline: {} })]
        })
    ];
    const steps = fullContent.split(/(?=[a-d]\))/i);
    steps.forEach(step => {
        const trimmedStep = step.trim();
        if (!trimmedStep) return;
        if (trimmedStep.toLowerCase().startsWith('d)')) {
            const label = trimmedStep.split(':')[0] || "d) Tổ chức thực hiện";
            const body = trimmedStep.substring(label.length + 1).trim();
            results.push(new Paragraph({
                spacing: { before: 120, after: 80 },
                children: [new TextRun({ text: label + ":", bold: true, size: 24, italics: true })]
            }));
            const { gv, hs } = parseTwoColumnContent(body);
            results.push(createTwoColumnTable(gv, hs));
        } else {
            const colonIndex = trimmedStep.indexOf(':');
            if (colonIndex !== -1) {
                const label = trimmedStep.substring(0, colonIndex + 1);
                const body = trimmedStep.substring(colonIndex + 1).trim();
                results.push(new Paragraph({
                    spacing: { before: 80, after: 40 },
                    children: [
                        new TextRun({ text: label, bold: true, size: 24, italics: true }),
                        new TextRun({ text: " ", size: 24 }),
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

// === GENERATE THE DOCUMENT ===
const generateDoc = async () => {
    console.log("Starting DOCX Generation Test...");

    const children: any[] = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
                new TextRun({
                    text: "KẾ HOẠCH BÀI DẠY (TEST LAYOUT 5512)",
                    bold: true,
                    size: 32,
                    color: "2E59A7"
                }),
            ],
        }),
        new Paragraph({ text: "", spacing: { after: 200 } }),

        createSectionTitle("I. TÊN BÀI HỌC/CHỦ ĐỀ"),
        createField("", "BÀI KIỂM TRA ĐỊNH DẠNG WORD TỰ ĐỘNG"),

        createSectionTitle("II. MỤC TIÊU"),
        createField("1. Kiến thức:", "Hiểu được cách bố trí layout 2 cột trong file Word."),
        createField("2. Năng lực:", "Năng lực tự chủ và tự học: Test hệ thống tự động."),
        createField("3. Phẩm chất:", "Trung thực, trách nhiệm trong việc kiểm tra phần mềm."),

        createSectionTitle("III. THIẾT BỊ DẠY HỌC"),
        createField("1. Giáo viên:", "Máy tính, phần mềm SmartDoc Teacher."),
        createField("2. Học sinh:", "Không cần chuẩn bị."),

        createSectionTitle("IV. TIẾN TRÌNH DẠY HỌC"),
    ];

    // === MASSIVE CONTENT GENERATION (50-60 PAGES SIMULATION) ===
    console.log("Generating massive content (~50-60 pages)...");

    // Create a very long detailed text block (approx 1 page of text)
    const longTextBlock = `
    - Bước 1: GV chuyển giao nhiệm vụ học tập:
      + GV yêu cầu HS đọc sách giáo khoa trang 10-15.
      + GV chia lớp thành 4 nhóm, mỗi nhóm 10 học sinh.
      + GV phát phiếu học tập số 1 (xem phụ lục).
      + GV đặt câu hỏi gợi mở: "Theo em, vì sao việc lập kế hoạch lại quan trọng trong đời sống?".
      + GV yêu cầu HS thảo luận trong 15 phút và trình bày trên giấy A0.
    
    - Bước 2: HS thực hiện nhiệm vụ học tập:
      + HS di chuyển về nhóm, cử nhóm trưởng và thư ký.
      + HS đọc tài liệu, thảo luận sôi nổi.
      + GV quan sát, hỗ trợ các nhóm gặp khó khăn (đặc biệt là nhóm 3 chưa tập trung).
      + HS ghi chép các ý chính vào vở nháp trước khi viết vào bảng nhóm.

    - Bước 3: Báo cáo kết quả hoạt động và thảo luận:
      + GV mời đại diện nhóm 1 và nhóm 2 lên trình bày.
      + Các nhóm khác lắng nghe, ghi chép và đặt câu hỏi phản biện.
      + GV ghi nhận các ý kiến hay lên bảng.
      + HS tranh luận về vấn đề: "Kế hoạch cứng nhắc hay linh hoạt tốt hơn?".

    - Bước 4: Đánh giá kết quả thực hiện nhiệm vụ học tập:
      + GV nhận xét thái độ làm việc của các nhóm.
      + GV chốt kiến thức: Lập kế hoạch là kỹ năng sống còn.
      + GV yêu cầu HS tự đánh giá mức độ tham gia của mình vào hoạt động nhóm.
      + GV tổng kết và chuyển sang hoạt động tiếp theo.
    `.repeat(5); // Repeat 5 times to make it substantial per activity part

    // Generate 20 Activities (simulating a full semester plan or very long topic)
    for (let i = 1; i <= 20; i++) {
        children.push(...createTwoColumnActivity(
            `HOẠT ĐỘNG ${i}: KHÁM PHÁ VÀ RÈN LUYỆN CHUYÊN SÂU (PHẦN ${i})`,
            `a) Mục tiêu: Rèn luyện kỹ năng bền bỉ và tập trung trong thời gian dài.\n` +
            `b) Nội dung: Phân tích chi tiết các khía cạnh của bài học (Phần ${i}).\n` +
            `c) Sản phẩm: Báo cáo chi tiết dài 10 trang của học sinh.\n` +
            `d) Tổ chức thực hiện: \n` +
            `{{cot_1}} GV tổ chức hoạt động chuyên sâu số ${i}. \n${longTextBlock} \n` +
            `{{cot_2}} HS tham gia tích cực vào hoạt động số ${i}. \n${longTextBlock}`
        ));
    }

    children.push(
        createSectionTitle("V. HỒ SƠ DẠY HỌC (PHỤ LỤC DÀI)"),
        new Paragraph({ text: "Phần phụ lục chi tiết bao gồm các phiếu học tập, thang đo rubric và tài liệu tham khảo..." }),
        ...renderFormattedText(longTextBlock.repeat(3)), // Long Appendix
        createSectionTitle("VI. HƯỚNG DẪN VỀ NHÀ"),
        new Paragraph({ text: "Ôn tập toàn bộ nội dung dài 50 trang vừa học." })
    );

    const doc = new Document({
        sections: [{ children }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("d:/smart-doc-teacher-app/TEST_MASSIVE_50_PAGES.docx", buffer);
    console.log("File saved to d:/smart-doc-teacher-app/TEST_MASSIVE_50_PAGES.docx");
};

generateDoc().catch(err => console.error(err));
