
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

// === Recreating Logic from ExportService to ensure STRUCTURE correctness (ENHANCED) ===

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
        if (!trimmedLine) return; // Skip empty lines

        // Heading detection
        if (trimmedLine.startsWith('### ')) {
            paragraphs.push(new Paragraph({
                children: [new TextRun({ text: trimmedLine.substring(4), bold: true, size: 26, underline: {} })],
                spacing: { before: 120, after: 60 },
                alignment: AlignmentType.JUSTIFIED
            }));
            return;
        }

        // Explicit new line detection for list items or steps
        // Detects: -, +, *, •, ●, \d., or specific keywords like "Bước"
        const listMatch = trimmedLine.match(/^([-*•+●]|\d+\.|Bước\s+\d+:?)\s+(.*)/);

        if (listMatch) {
            // It's a list item or distinct step -> New Paragraph with formatting
            paragraphs.push(new Paragraph({
                children: parseMarkdownToRuns(lines.length > 1 ? trimmedLine : listMatch[2] || trimmedLine), // If part of large block, keep full line or just content
                // Simplified logic: If it looks like a list item, just treat entire line as content but force new paragraph
                children: parseMarkdownToRuns(trimmedLine),
                spacing: { after: 60, before: 60 },
                alignment: AlignmentType.JUSTIFIED,
                indent: { left: 360, hanging: 360 } // Hanging indent for nice list look
            }));
        } else {
            // Standard Paragraph
            paragraphs.push(new Paragraph({
                children: parseMarkdownToRuns(trimmedLine),
                spacing: { after: 60, before: 60 },
                alignment: AlignmentType.JUSTIFIED,
                indent: { firstLine: 720 } // 1.27cm
            }));
        }
    });

    return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: cleanedText, size: 24 })];
};

const createSectionTitle = (text: string) => {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
            new TextRun({
                text: text,
                bold: true,
                size: 28, // 14pt for Headers
                font: "Times New Roman",
                color: "000000" // Strict Black
            }),
        ],
    });
};

const createField = (label: string, value: string | undefined) => {
    return new Paragraph({
        spacing: { after: 60 },
        alignment: AlignmentType.JUSTIFIED,
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

    // Regex finding indices (Case Insensitive)
    const cot1Match = /\{\{cot_1\}\}/i.exec(content);
    const cot2Match = /\{\{cot_2\}\}/i.exec(content);

    const cot1Index = cot1Match ? cot1Match.index : -1;
    const cot2Index = cot2Match ? cot2Match.index : -1;

    if (cot1Index === -1 && cot2Index === -1) {
        // Fallback: If no markers, everything goes to Column 1 ? 
        // Or if it's "outside", maybe we should try to split by half?
        // For now, put everything in GV column as per original logic, but risk of "leaking".
        return { gv: content.trim(), hs: "..." };
    }

    let gvContent = "...";
    let hsContent = "...";

    if (cot1Index !== -1) {
        // GV Content starts after {{cot_1}} (length 9)
        const startGv = cot1Index + 9;
        const endGv = (cot2Index !== -1 && cot2Index > cot1Index) ? cot2Index : content.length;
        gvContent = content.substring(startGv, endGv).trim();
    }

    if (cot2Index !== -1) {
        // HS Content starts after {{cot_2}}
        const startHs = cot2Index + 9;
        hsContent = content.substring(startHs).trim();
    }

    return { gv: gvContent, hs: hsContent };
};

const createTwoColumnTable = (gvContent: string, hsContent: string) => {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        },
        rows: [
            new TableRow({
                tableHeader: true,
                cantSplit: true, // Header SHOULD stay together
                height: { value: 300, rule: HeightRule.ATLEAST },
                children: [
                    new TableCell({
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "Hoạt động của Giáo viên", bold: true, size: 22 })]
                        })],
                        // shading removed
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "Hoạt động của Học sinh", bold: true, size: 22 })]
                        })],
                        // shading removed for standard look
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    }),
                ]
            }),
            new TableRow({
                cantSplit: false, // CONTENT MUST BE ABLE TO SPLIT
                height: { value: 300, rule: HeightRule.ATLEAST },
                children: [
                    new TableCell({
                        children: renderFormattedText(gvContent),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
                    }),
                    new TableCell({
                        children: renderFormattedText(hsContent),
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        margins: { top: 120, bottom: 120, left: 120, right: 120 }
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

    // Split carefully by steps a), b), c), d) ENSURING they are at start of line
    // This prevents splitting on text like "(xem phụ lục)" where "c)" matches.
    const steps = fullContent.split(/(?:\r?\n|^)(?=[a-d]\))/i);

    steps.forEach((step, index) => {
        const trimmedStep = step.trim();
        if (!trimmedStep) return;

        // console.log(`DEBUG: Processing step ${index}, starts with: ${trimmedStep.substring(0, 10)}...`);

        if (trimmedStep.toLowerCase().startsWith('d)')) {
            console.log("DEBUG: Found Step D (2-Column)");
            const labelEnd = trimmedStep.indexOf(':');
            const label = labelEnd > -1 ? trimmedStep.substring(0, labelEnd) : "d) Tổ chức thực hiện";
            const body = labelEnd > -1 ? trimmedStep.substring(labelEnd + 1).trim() : trimmedStep.substring(2).trim();

            results.push(new Paragraph({
                spacing: { before: 120, after: 60 },
                children: [
                    new TextRun({ text: label + ":", bold: true, size: 24, italics: true }),
                    new TextRun({ text: " ", size: 24 })
                ]
            }));
            const { gv, hs } = parseTwoColumnContent(body);
            results.push(createTwoColumnTable(gv, hs));
        } else {
            // console.log("DEBUG: Standard step");
            const colonIndex = trimmedStep.indexOf(':');
            if (colonIndex !== -1) {
                const label = trimmedStep.substring(0, colonIndex + 1);
                const body = trimmedStep.substring(colonIndex + 1).trim();
                results.push(new Paragraph({
                    spacing: { before: 60, after: 60 },
                    alignment: AlignmentType.JUSTIFIED,
                    indent: { firstLine: 720 },
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

    // === STANDARD ADMINISTRATIVE HEADER (MÔ PHỎNG TEMPLATE 5512) ===
    const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
            new TableRow({
                children: [
                    // LEFT COLUMN: School & Dept
                    new TableCell({
                        width: { size: 40, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "TRƯỜNG THPT ....................", font: "Times New Roman", size: 22 }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "TỔ: ....................", font: "Times New Roman", size: 22, bold: true }),
                                ],
                            }),
                        ],
                    }),
                    // RIGHT COLUMN: Country Info
                    new TableCell({
                        width: { size: 60, type: WidthType.PERCENTAGE },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", font: "Times New Roman", size: 22, bold: true }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", font: "Times New Roman", size: 24, bold: true }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({ text: "-------------------", font: "Times New Roman", size: 22 }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
        ],
    });

    const children: any[] = [
        headerTable,
        new Paragraph({ text: "", spacing: { after: 200 } }), // Spacer

        new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
                new TextRun({
                    text: "KẾ HOẠCH BÀI DẠY",
                    bold: true,
                    size: 32,
                    font: "Times New Roman",
                    color: "000000"
                }),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: "(MÔ PHỎNG CHUẨN MẪU 5512)",
                    bold: true,
                    size: 28,
                    font: "Times New Roman",
                    color: "000000"
                }),
            ],
            spacing: { after: 240 }
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
        styles: {
            default: {
                document: {
                    run: {
                        font: "Times New Roman",
                        size: 26, // 13pt Standard
                        color: "000000"
                    },
                    paragraph: {
                        spacing: { after: 60, before: 60 }
                    }
                },
                heading1: {
                    run: {
                        font: "Times New Roman",
                        size: 32,
                        bold: true,
                        color: "000000"
                    },
                    paragraph: {
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 240 }
                    }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1134, // 2cm
                        bottom: 1134, // 2cm
                        left: 1701, // 3cm
                        right: 1134 // 2cm
                    }
                }
            },
            children
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync("d:/smart-doc-teacher-app/TEST_FINAL_VERIFICATION_V7.docx", buffer);
    console.log("File saved to d:/smart-doc-teacher-app/TEST_FINAL_VERIFICATION_V7.docx");
};

generateDoc().catch(err => console.error(err));
