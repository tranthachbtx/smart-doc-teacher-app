
import { type Document as DocxDocument } from "docx";

export const createMeetingTemplate = async (): Promise<Blob> => {
    const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
    } = await import("docx");

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Header - 2 columns layout simulation
                    new Table({
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
                                    new TableCell({
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "TRÆ¯á»œNG THPT",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{ten_truong}}",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Tá»” {{to_chuyen_mon}}",
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Cá»˜NG HÃ’A XÃƒ Há»˜I CHá»¦ NGHÄ¨A VIá»†T NAM",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Äá»™c láº­p - Tá»± do - Háº¡nh phÃºc",
                                                        bold: true,
                                                        size: 24,
                                                        underline: {},
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "BIÃŠN Báº¢N", bold: true, size: 32 }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Sinh hoáº¡t Ä‘á»‹nh ká»³ cá»§a tá»•/nhÃ³m chuyÃªn mÃ´n thÃ¡ng: {{thang}}/{{nam}}",
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Láº§n: {{lan_hop}}", size: 24 })],
                    }),
                    new Paragraph({
                        text: "----------",
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "" }),
                    // Section I
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "I. Thá»i gian vÃ  Ä‘á»‹a Ä‘iá»ƒm:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Thá»i gian: VÃ o lÃºc......giá»........ phÃºt, ngÃ y .......thÃ¡ng ...... nÄƒm {{nam}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Táº¡i trÆ°á»ng THPT {{ten_truong}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section II
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. ThÃ nh pháº§n:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Chá»§ trÃ¬: {{chu_tri}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "ThÆ° kÃ½: {{thu_ky}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "ThÃ nh viÃªn: {{thanh_vien}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Váº¯ng: ........ LÃ­ do...................................",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section III
                    new Paragraph({
                        children: [
                            new TextRun({ text: "III. Ná»™i dung:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tá»• trÆ°á»Ÿng thÃ´ng qua má»¥c Ä‘Ã­ch, yÃªu cáº§u vÃ  ná»™i dung cá»§a buá»•i há»p vÃ  tiáº¿n hÃ nh tá»«ng ná»™i dung cá»¥ thá»ƒ nhÆ° sau:",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. ÄÃ¡nh giÃ¡ hoáº¡t Ä‘á»™ng tuáº§n â€“ thÃ¡ng qua",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Ná»™i dung chÃ­nh: {{noi_dung_chinh}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "a) Æ¯u Ä‘iá»ƒm: {{uu_diem}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "b) Háº¡n cháº¿: {{han_che}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Triá»ƒn khai káº¿ hoáº¡ch tuáº§n â€“ thÃ¡ng tá»›i",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{ke_hoach_thang_toi}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Ã kiáº¿n tháº£o luáº­n",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{y_kien_dong_gop}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4. Káº¿t luáº­n cá»§a chá»§ trÃ¬ cuá»™c há»p",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "CÃ¡c thÃ nh viÃªn Ä‘á»“ng Ã½ hoÃ n toÃ n vá»›i Ã½ kiáº¿n tháº£o luáº­n vÃ  Ä‘Ã³ng gÃ³p trÃªn.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "BiÃªn báº£n káº¿t thÃºc lÃºc......giá»......phÃºt cÃ¹ng ngÃ y.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    // Signatures
                    new Table({
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
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "CHá»¦ TRÃŒ CUá»˜C Há»ŒP",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{chu_tri}}", size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "THÆ¯ KÃ",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{thu_ky}}", size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};

export const createLessonTemplate = async (): Promise<Blob> => {
    const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } =
        await import("docx");

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Káº¾ HOáº CH GIÃO Dá»¤C CHá»¦ Äá»€",
                                bold: true,
                                size: 32,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "TrÆ°á»ng: THPT {{ten_truong}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Tá»•: {{to_chuyen_mon}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Há» vÃ  tÃªn giÃ¡o viÃªn: {{ten_giao_vien}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "NgÃ y soáº¡n: {{ngay_soan}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Chá»§ Ä‘á» {{chu_de}}: {{ten_chu_de}}",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "MÃ´n há»c: Hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, hÆ°á»›ng nghiá»‡p; lá»›p: {{lop}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Thá»i gian thá»±c hiá»‡n: ({{so_tiet}})",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section I - Má»¥c tiÃªu
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. Má»¤C TIÃŠU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. YÃªu cáº§u cáº§n Ä‘áº¡t:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_tieu_kien_thuc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. NÄƒng lá»±c", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_tieu_nang_luc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "3. Pháº©m cháº¥t", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_tieu_pham_chat}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section II - Thiáº¿t bá»‹
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. THIáº¾T Bá»Š Dáº Y Há»ŒC",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Äá»‘i vá»›i giÃ¡o viÃªn",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{gv_chuan_bi}}", size: 24 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Äá»‘i vá»›i há»c sinh",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{hs_chuan_bi}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    // Section III - Hoáº¡t Ä‘á»™ng
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "III. TIáº¾N TRÃŒNH Dáº Y Há»ŒC",
                                bold: true,
                                size: 28,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "A. SINH HOáº T DÆ¯á»šI Cá»œ / SINH HOáº T Lá»šP",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{shdc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{shl}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "B. HOáº T Äá»˜NG GIÃO Dá»¤C THEO CHá»¦ Äá»€",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),

                    // Function to create an activity table in the template
                    ...(["khoi_dong", "kham_pha", "luyen_tap", "van_dung"].flatMap((actKey) => {
                        const actNames: Record<string, string> = {
                            khoi_dong: "KHá»žI Äá»˜NG",
                            kham_pha: "KHÃM PHÃ",
                            luyen_tap: "LUYá»†N Táº¬P",
                            van_dung: "Váº¬N Dá»¤NG"
                        };
                        return [
                            new Paragraph({
                                children: [new TextRun({ text: `HOáº T Äá»˜NG: ${actNames[actKey]}`, bold: true, size: 24 })]
                            }),
                            // Import Table related from docx dynamically or use existing imports
                            // (Assuming Table, TableRow, TableCell are available as per createMeetingTemplate)
                            new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                rows: [
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                width: { size: 40, type: WidthType.PERCENTAGE },
                                                children: [new Paragraph({ children: [new TextRun({ text: "THÃ”NG TIN HOáº T Äá»˜NG", bold: true, size: 24 })] })],
                                                shading: { fill: "F8F9FA" }
                                            }),
                                            new TableCell({
                                                width: { size: 60, type: WidthType.PERCENTAGE },
                                                children: [new Paragraph({ children: [new TextRun({ text: "Tá»” CHá»¨C THá»°C HIá»†N", bold: true, size: 24 })] })],
                                                shading: { fill: "F8F9FA" }
                                            }),
                                        ]
                                    }),
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [new Paragraph({ children: [new TextRun({ text: `{{hoat_dong_${actKey}_cot_1}}`, size: 24 })] })]
                                            }),
                                            new TableCell({
                                                children: [new Paragraph({ children: [new TextRun({ text: `{{hoat_dong_${actKey}_cot_2}}`, size: 24 })] })]
                                            }),
                                        ]
                                    })
                                ]
                            }),
                            new Paragraph({ text: "" })
                        ];
                    })),

                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "IV. Há»’ SÆ  Dáº Y Há»ŒC & PHá»¤ Lá»¤C",
                                bold: true,
                                size: 28,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ho_so_day_hoc}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "V. HÆ¯á»šNG DáºªN Vá»€ NHÃ€",
                                bold: true,
                                size: 28,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{huong_dan_ve_nha}}", size: 24 }),
                        ],
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};

export const createAssessmentTemplate = async (): Promise<Blob> => {
    const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
    } = await import("docx");

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Header
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Sá»ž GD&ÄT BÃŒNH THUáº¬N", size: 24, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "TRÆ¯á»œNG THPT {ten_truong}", bold: true, size: 24, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Tá»”: {to_chuyen_mon}", bold: true, size: 24, font: "Times New Roman" })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Cá»˜NG HÃ’A XÃƒ Há»˜I CHá»¦ NGHÄ¨A VIá»†T NAM", bold: true, size: 24, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Äá»™c láº­p - Tá»± do - Háº¡nh phÃºc", bold: true, size: 24, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€", size: 24, font: "Times New Roman" })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "" }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "Káº¾ HOáº CH KIá»‚M TRA ÄÃNH GIÃ Äá»ŠNH Ká»²", bold: true, size: 32, font: "Times New Roman" })],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "{ten_ke_hoach}", bold: true, size: 28, font: "Times New Roman" })],
                    }),
                    new Paragraph({ text: "" }),

                    // Info
                    new Paragraph({ children: [new TextRun({ text: "Há»c ká»³: {hoc_ky}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Khá»‘i lá»›p: {khoi}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // I. Objectives
                    new Paragraph({ children: [new TextRun({ text: "I. Má»¤C TIÃŠU ÄÃNH GIÃ", bold: true, size: 28, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{muc_tieu}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // II. Nhiá»‡m vá»¥
                    new Paragraph({ children: [new TextRun({ text: "II. Ná»˜I DUNG VÃ€ NHIá»†M Vá»¤ KIá»‚M TRA", bold: true, size: 28, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{noi_dung_nhiem_vu}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // III. HÃ¬nh thá»©c
                    new Paragraph({ children: [new TextRun({ text: "III. HÃŒNH THá»¨C Tá»” CHá»¨C", bold: true, size: 28, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{hinh_thuc_to_chuc}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // IV. Matrix
                    new Paragraph({ children: [new TextRun({ text: "IV. MA TRáº¬N Äáº¶C Táº¢", bold: true, size: 28, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{ma_tran_dac_ta}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // V. Rubric
                    new Paragraph({ children: [new TextRun({ text: "V. RUBRIC ÄÃNH GIÃ CHI TIáº¾T", bold: true, size: 28, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{bang_kiem_rubric}", size: 26, font: "Times New Roman" })] }),
                    new Paragraph({ text: "" }),

                    // VI. Lá»i khuyÃªn
                    new Paragraph({ children: [new TextRun({ text: "VI. GHI CHÃš VÃ€ Lá»œI KHUYÃŠN", bold: true, size: 28, font: "Times New Roman" })] }),
                    new Paragraph({ children: [new TextRun({ text: "{loi_khuyen}", size: 26, font: "Times New Roman" })] }),
                    // Footer/Signatures
                    new Table({
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
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Tá»” TRÆ¯á»žNG CHUYÃŠN MÃ”N", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(KÃ½ vÃ  ghi rÃµ há» tÃªn)", italics: true, size: 13, font: "Times New Roman" })],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "GIÃO VIÃŠN RA Äá»€", bold: true, size: 13, font: "Times New Roman" })],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(KÃ½ vÃ  ghi rÃµ há» tÃªn)", italics: true, size: 13, font: "Times New Roman" })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};

export const createEventTemplate = async (): Promise<Blob> => {
    const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
    } = await import("docx");

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Header
                    new Table({
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
                                    new TableCell({
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "TRÆ¯á»œNG THPT {{ten_truong}}",
                                                        bold: true,
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Tá»” {{to_chuyen_mon}}",
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Sá»‘: {{so_ke_hoach}}/KHNK-HÄTN-HN",
                                                        size: 20,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Cá»˜NG HÃ’A XÃƒ Há»˜I CHá»¦ NGHÄ¨A VIá»†T NAM",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Äá»™c láº­p â€“ Tá»± do â€“ Háº¡nh phÃºc",
                                                        bold: true,
                                                        size: 24,
                                                        underline: {},
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{dia_diem}}, ngÃ y ... thÃ¡ng {{thang}} nÄƒm {{nam}}",
                                                        italics: true,
                                                        size: 22,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Title
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Káº¾ HOáº CH", bold: true, size: 32 }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: 'Ngoáº¡i khoÃ¡ khá»‘i {{khoi_lop}} - Chá»§ Ä‘á» {{chu_de}} "{{ten_chu_de}}"',
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section I - Má»¥c tiÃªu
                    new Paragraph({
                        children: [
                            new TextRun({ text: "I. Má»¤C TIÃŠU", bold: true, size: 26 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. YÃªu cáº§u cáº§n Ä‘áº¡t:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{muc_dich_yeu_cau}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. NÄƒng lá»±c:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nang_luc}}", size: 24 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "3. Pháº©m cháº¥t:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{pham_chat}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    // Section II - Thá»i gian Ä‘á»‹a Ä‘iá»ƒm
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "II. THá»œI GIAN â€“ Äá»ŠA ÄIá»‚M",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. Thá»i gian: {{thoi_gian}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "2. Äá»‹a Ä‘iá»ƒm: {{dia_diem}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. YÃªu cáº§u: NghiÃªm tÃºc thá»±c hiá»‡n, giÃ¡o viÃªn Ä‘Ã¡nh giÃ¡ tiáº¿t dáº¡y theo quy Ä‘á»‹nh nhÃ  trÆ°á»ng.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Section III - Kinh phÃ­
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "III. KINH PHÃ THá»°C HIá»†N",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{kinh_phi}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    // ThÃ nh pháº§n tham dá»±
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "THÃ€NH PHáº¦N THAM Dá»°",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "1. ToÃ n thá»ƒ cÃ¡n bá»™, giÃ¡o viÃªn, nhÃ¢n viÃªn.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. GiÃ¡o viÃªn phá»¥ trÃ¡ch chÃ­nh (Giáº£ng dáº¡y mÃ´n HÄTN, HN): {{giao_vien_phu_trach}}",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "3. Há»c sinh: Há»c sinh khá»‘i {{khoi_lop}}.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "4. Trang phá»¥c: Äá»“ng phá»¥c trÆ°á»ng.",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // Tá»• chá»©c thá»±c hiá»‡n
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Tá»” CHá»¨C THá»°C HIá»†N:",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "1. Chuáº©n bá»‹:", bold: true, size: 24 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{chuan_bi}}", size: 24 })],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "2. Ná»™i dung, hÃ¬nh thá»©c thá»±c hiá»‡n:",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{kich_ban_chi_tiet}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "{{thong_diep_ket_thuc}}", size: 24 }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'TrÃªn Ä‘Ã¢y lÃ  Káº¿ hoáº¡ch tá»• chá»©c chÆ°Æ¡ng trÃ¬nh ngoáº¡i khÃ³a chá»§ Ä‘á» "{{ten_chu_de}}" cá»§a tá»• hoáº¡t Ä‘á»™ng tráº£i nghiá»‡m, hÆ°á»›ng nghiá»‡p. GiÃ¡o viÃªn vÃ  há»c sinh khá»‘i {{khoi_lop}} tham gia nghiÃªm tÃºc, nhiá»‡t tÃ¬nh Ä‘á»ƒ káº¿ hoáº¡ch Ä‘Æ°á»£c thá»±c hiá»‡n thÃ nh cÃ´ng tá»‘t Ä‘áº¹p./.',
                                italics: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "" }),
                    // Signatures
                    new Table({
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
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Tá»” TRÆ¯á»žNG CHUYÃŠN MÃ”N",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({ text: "{{to_truong}}", size: 24 }),
                                                ],
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "HIá»†U TRÆ¯á»žNG",
                                                        bold: true,
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({ text: "" }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "{{hieu_truong}}",
                                                        size: 24,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    // NÆ¡i nháº­n
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "* NÆ¡i nháº­n:",
                                bold: true,
                                italics: true,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "- BGH (Chá»‰ Ä‘áº¡o)", size: 22 })],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "- Tá»• HÄTN-HN (thá»±c hiá»‡n)", size: 22 }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "- Lá»›p ....... (Thá»±c hiá»‡n)", size: 22 }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "- LÆ°u", size: 22 })],
                    }),
                ],
            },
        ],
    });

    return await Packer.toBlob(doc);
};
export const createNCBHTemplate = async (): Promise<Blob> => {
    const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
    } = await import("docx");

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Times New Roman",
                        size: 26, // equivalent to 13pt
                    },
                    paragraph: {
                        spacing: {
                            line: 276, // equivalent to 1.15 line spacing (more compact and professional)
                            before: 60, // 3pt
                            after: 60, // 3pt
                        },
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 1134, // 2cm
                            right: 1134, // 2cm
                            bottom: 1134, // 2cm
                            left: 1701, // 3cm
                        },
                    },
                },
                children: [
                    // Header Section
                    new Table({
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
                                    new TableCell({
                                        width: { size: 40, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "{{ten_truong}}", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Tá»”: {{to_chuyen_mon}}", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "â€”â€”â€”", size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 60, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Cá»˜NG HÃ’A XÃƒ Há»˜I CHá»¦ NGHÄ¨A VIá»†T NAM", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Äá»™c láº­p - Tá»± do - Háº¡nh phÃºc", bold: true, size: 26 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "â€”â€”â€”â€”â€”â€”â€”â€”â€”", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "Há»’ SÆ  VÃ€ BIÃŠN Báº¢N", bold: true, size: 32 }),
                        ],
                        spacing: { before: 0, after: 0, line: 240 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "SINH HOáº T CHUYÃŠN MÃ”N THEO NGHIÃŠN Cá»¨U BÃ€I Há»ŒC", bold: true, size: 28 }),
                        ],
                        spacing: { before: 0, after: 120, line: 240 },
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "BÃ i dáº¡y nghiÃªn cá»©u: {{ten_bai}}", italics: true, size: 26, bold: true }),
                        ],
                        spacing: { before: 0, after: 360, line: 240 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "I. GIAI ÄOáº N 1: THIáº¾T Káº¾ BÃ€I Dáº Y (Táº¬P THá»‚ Tá»” XÃ‚Y Dá»°NG)", bold: true, size: 28 })],
                        spacing: { before: 240, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "1. LÃ½ do chá»n bÃ i dáº¡y nghiÃªn cá»©u:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{ly_do_chon}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "2. Má»¥c tiÃªu bÃ i há»c (YÃªu cáº§u cáº§n Ä‘áº¡t):", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{muc_tieu}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "3. Chuá»—i cÃ¡c hoáº¡t Ä‘á»™ng há»c dá»± kiáº¿n:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{chuoi_hoat_dong}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "4. CÃ¡c phÆ°Æ¡ng Ã¡n há»— trá»£ há»c sinh gáº·p khÃ³ khÄƒn:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{phuong_an_ho_tro}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({ text: "", spacing: { before: 240, after: 240 } }),
                    new Paragraph({
                        children: [new TextRun({ text: "II. GIAI ÄOáº N 2 & 3: Dáº Y MINH Há»ŒA - QUAN SÃT VÃ€ PHÃ‚N TÃCH BÃ€I Há»ŒC", bold: true, size: 28 })],
                        spacing: { before: 240, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "(Thá»i gian: {{ngay_thuc_hien}} - Khá»‘i: {{khoi}})", italics: true, size: 24 })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "1. Chia sáº» cá»§a giÃ¡o viÃªn dáº¡y minh há»a:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{chia_se_nguoi_day}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "2. Tháº£o luáº­n cá»§a Ä‘á»“ng nghiá»‡p (Táº­p trung minh chá»©ng vá» viá»‡c há»c cá»§a HS):", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nhan_xet_nguoi_du}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "3. PhÃ¢n tÃ­ch nguyÃªn nhÃ¢n vÃ  giáº£i phÃ¡p Ä‘iá»u chá»‰nh:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{nguyen_nhan_giai_phap}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({
                        children: [new TextRun({ text: "4. BÃ i há»c kinh nghiá»‡m rÃºt ra cho cÃ¡c bÃ i há»c sau:", bold: true, size: 26 })],
                        spacing: { before: 120, after: 60 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "{{bai_hoc_kinh_nghiem}}" })],
                        spacing: { before: 0, after: 120 },
                    }),

                    new Paragraph({ text: "", spacing: { before: 360, after: 360 } }),
                    new Table({
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
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "NGÆ¯á»œI GHI BIÃŠN Báº¢N", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 60, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(KÃ½ vÃ  ghi rÃµ há» tÃªn)", italics: true, size: 20 })],
                                                spacing: { before: 0, after: 840, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "................................", size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                        ],
                                    }),
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "Tá»” TRÆ¯á»žNG CHUYÃŠN MÃ”N", bold: true, size: 24 })],
                                                spacing: { before: 0, after: 60, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "(KÃ½ vÃ  ghi rÃµ há» tÃªn)", italics: true, size: 20 })],
                                                spacing: { before: 0, after: 840, line: 240 },
                                            }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [new TextRun({ text: "................................", size: 24 })],
                                                spacing: { before: 0, after: 0, line: 240 },
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });


    return await Packer.toBlob(doc);
};
