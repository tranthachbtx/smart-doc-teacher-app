import {
    AlignmentType,
    BorderStyle,
    WidthType,
    TableRow,
    TableCell,
    Paragraph,
    TextRun,
} from "docx";

/**
 * CHUẨN ĐỊNH DẠNG VĂN BẢN HÀNH CHÍNH VIỆT NAM (NGHỊ ĐỊNH 30/2020/NĐ-CP)
 */

export const WORD_STANDARDS = {
    font: "Times New Roman",
    fontSize: 28, // 14pt (Chuẩn Nghị định 30)
    fontSizeSmall: 26, // 13pt
    fontSizeLarge: 32, // 16pt
    fontSizeTitle: 36, // 18pt
    lineSpacing: 300, // 1.25 line spacing
    indent: 709, // ~1.25cm (Thụt lề dòng đầu)
    margins: {
        top: 1134, // 2cm
        bottom: 1134, // 2cm
        left: 1701, // 3cm
        right: 850, // 1.5cm
    },
};

/**
 * Tạo Header chuẩn với tên cơ quan và quốc hiệu
 */
export const createStandardHeader = (
    agencyLeft: string[],
    mottoRight: string[] = ["CỘNG HÀA XÃ HỘI CHỦ NGHĨA VIỆT NAM", "Độc lập - Tự do - Hạnh phúc"],
    subLeft?: string
) => {
    return [
        new TableRow({
            children: [
                new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    children: [
                        ...agencyLeft.map((text, index) => new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: text.toUpperCase(),
                                    size: WORD_STANDARDS.fontSizeSmall,
                                    bold: index === agencyLeft.length - 1,
                                }),
                            ],
                            spacing: { after: 0 },
                        })),
                        // Đường kẻ dưới tên cơ quan (khoảng 1/3 độ dài)
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "—————",
                                    size: WORD_STANDARDS.fontSizeSmall,
                                    bold: true,
                                }),
                            ],
                            spacing: { after: 0 },
                        }),
                        ...(subLeft ? [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    new TextRun({
                                        text: subLeft,
                                        size: WORD_STANDARDS.fontSizeSmall,
                                    }),
                                ],
                            })
                        ] : []),
                    ],
                }),
                new TableCell({
                    width: { size: 55, type: WidthType.PERCENTAGE },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: mottoRight[0],
                                    bold: true,
                                    size: WORD_STANDARDS.fontSizeSmall,
                                }),
                            ],
                            spacing: { after: 0 },
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: mottoRight[1],
                                    bold: true,
                                    size: WORD_STANDARDS.fontSize,
                                }),
                            ],
                            spacing: { after: 0 },
                        }),
                        // Đường kẻ dưới tiêu ngữ (Solid line chuẩn)
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "━━━━━━━━━", // Dùng ký tự bold block
                                    size: 16, // Nhỏ lại để thanh mảnh
                                }),
                            ],
                            spacing: { after: 120 },
                        }),
                    ],
                }),
            ],
        }),
        // Dòng 2: Số hiệu và Ngày tháng
        new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: "Số: ..../KH-BTX", size: WORD_STANDARDS.fontSizeSmall })],
                        })
                    ]
                }),
                new TableCell({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({
                                text: `Mũi Né, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`,
                                italics: true,
                                size: WORD_STANDARDS.fontSizeSmall
                            })],
                        })
                    ]
                })
            ]
        })
    ];
};

/**
 * Cấu hình Border trống (để làm layout)
 */
export const NO_BORDER = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};
