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
    fontSize: 26, // 13pt
    fontSizeSmall: 24, // 12pt
    fontSizeLarge: 28, // 14pt
    fontSizeTitle: 32, // 16pt
    lineSpacing: 276, // 1.15 line spacing
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
                        // Đường kẻ dưới tiêu ngữ
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "—————————",
                                    size: WORD_STANDARDS.fontSize,
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }),
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
