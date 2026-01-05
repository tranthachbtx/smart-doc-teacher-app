
import { patchDocument, PatchType, TextRun } from "docx";
import * as fs from "fs";

const fillTemplate = async () => {
    console.log("Reading Template...");
    const templatePath = "D:/smart-doc-teacher-app/public/templates/KHBD_Template_2Cot.docx";
    const templateBuffer = fs.readFileSync(templatePath);
    const templateUint8Array = new Uint8Array(templateBuffer); // Explicit conversion ensuring Uint8Array type for docx


    // Create Massive Content for testing
    const longContentGV = `
    - Bước 1: Chuyển giao nhiệm vụ:
      + GV yêu cầu HS đọc sách.
      + GV chia nhóm.
      + GV phát phiếu học tập.
    `.repeat(50); // Massive content

    const longContentHS = `
    - HS thực hiện nhiệm vụ:
      + Đọc sách.
      + Thảo luận nhóm.
      + Ghi chép.
    `.repeat(50); // Massive content

    console.log("Patching Document...");
    const doc = await patchDocument(templateUint8Array, {
        patches: {
            ten_truong: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "TRƯỜNG THPT CHUYÊN BẮC GIANG", font: "Times New Roman" })],
            },
            to_chuyen_mon: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "TỔ TOÁN - TIN", font: "Times New Roman" })],
            },
            ten_chu_de: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "KIỂM THỬ TEMPLATE TỰ ĐỘNG", bold: true, font: "Times New Roman" })],
            },
            ten_giao_vien: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "Nguyễn Văn A", font: "Times New Roman" })],
            },
            lop: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "12A1", font: "Times New Roman" })],
            },
            so_tiet: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "45", font: "Times New Roman" })],
            },
            muc_tieu_kien_thuc: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "Hiểu rõ quy trình patch document.", font: "Times New Roman" })],
            },
            muc_tieu_nang_luc: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "Năng lực công nghệ thông tin.", font: "Times New Roman" })],
            },
            muc_tieu_pham_chat: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "Trung thực, chăm chỉ.", font: "Times New Roman" })],
            },
            gv_chuan_bi: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "Máy tính, Projector.", font: "Times New Roman" })],
            },
            hs_chuan_bi: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "Sách giáo khoa, vở ghi.", font: "Times New Roman" })],
            },
            // Filling SECTION 1: KHOI DONG
            hoat_dong_khoi_dong_cot_1: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "GV tổ chức trò chơi khởi động.", font: "Times New Roman" })],
            },
            hoat_dong_khoi_dong_cot_2: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "HS tham gia trò chơi.", font: "Times New Roman" })],
            },
            // Filling SECTION 2: KHAM PHA (MASSIVE CONTENT)
            hoat_dong_kham_pha_cot_1: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: longContentGV, font: "Times New Roman" })],
            },
            hoat_dong_kham_pha_cot_2: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: longContentHS, font: "Times New Roman" })],
            },
            // Filling SECTION 3: LUYEN TAP
            hoat_dong_luyen_tap_cot_1: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "GV giao bài tập về nhà.", font: "Times New Roman" })],
            },
            hoat_dong_luyen_tap_cot_2: {
                type: PatchType.PARAGRAPH,
                children: [new TextRun({ text: "HS ghi chép.", font: "Times New Roman" })],
            },
            // Filling other placeholders empty for cleaness
            hoat_dong_van_dung_cot_1: { type: PatchType.PARAGRAPH, children: [new TextRun("")] },
            hoat_dong_van_dung_cot_2: { type: PatchType.PARAGRAPH, children: [new TextRun("")] },
            shdc: { type: PatchType.PARAGRAPH, children: [new TextRun("")] },
            shl: { type: PatchType.PARAGRAPH, children: [new TextRun("")] },
            ho_so_day_hoc: { type: PatchType.PARAGRAPH, children: [new TextRun("")] },
            huong_dan_ve_nha: { type: PatchType.PARAGRAPH, children: [new TextRun("")] },
        }
    });

    fs.writeFileSync("D:/smart-doc-teacher-app/TEST_USE_TEMPLATE.docx", Buffer.from(doc));
    console.log("Saved patched document to D:/smart-doc-teacher-app/TEST_USE_TEMPLATE.docx");
};

fillTemplate().catch(err => console.error(err));
