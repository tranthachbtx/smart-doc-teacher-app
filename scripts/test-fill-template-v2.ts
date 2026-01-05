
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import * as fs from "fs";
import * as path from "path";

const fillTemplateV2 = () => {
    // Load the docx file as binary content
    const content = fs.readFileSync(
        path.resolve("D:/smart-doc-teacher-app/public/templates/KHBD_Template_2Cot.docx"),
        "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    // Content Simulation
    const longContentGV = Array(20).fill("- Bước 1: GV yêu cầu HS hoạt động nhóm.\n  + GV quan sát và hỗ trợ.\n  + GV ghi nhận kết quả.").join("\n");
    const longContentHS = Array(20).fill("- HS thực hiện nhiệm vụ.\n  + Thảo luận sôi nổi.\n  + Ghi chép vào phiếu.").join("\n");

    // Render the document
    doc.render({
        ten_truong: "TRƯỜNG THPT CHUYÊN BẮC GIANG",
        to_chuyen_mon: "TỔ TOÁN - TIN",
        ten_chu_de: "BÀI KIỂM TRA MẪU CÓ SẴN (DOCXTEMPLATER)",
        ten_giao_vien: "Nguyễn Văn A",
        lop: "12A1",
        so_tiet: "45",
        ngay_soan: "05/01/2026",
        muc_tieu_kien_thuc: "- Hiểu cách dùng Docxtemplater.\n- Biết cách fill dữ liệu vào mẫu có sẵn.",
        muc_tieu_nang_luc: "- Năng lực tự học.\n- Năng lực giải quyết vấn đề.",
        muc_tieu_pham_chat: "- Chăm chỉ, trung thực.",
        gv_chuan_bi: "Ti vi, máy chiếu.",
        hs_chuan_bi: "Sách vở, bút.",

        // Progress Content
        hoat_dong_khoi_dong_cot_1: "GV tổ chức trò chơi khởi động.",
        hoat_dong_khoi_dong_cot_2: "HS tham gia trò chơi.",

        hoat_dong_kham_pha_cot_1: longContentGV,
        hoat_dong_kham_pha_cot_2: longContentHS,

        hoat_dong_luyen_tap_cot_1: "GV giao bài tập.",
        hoat_dong_luyen_tap_cot_2: "HS làm bài tập.",

        hoat_dong_van_dung_cot_1: "GV hướng dẫn về nhà.",
        hoat_dong_van_dung_cot_2: "HS ghi chép.",

        shdc: "",
        shl: "",
        ho_so_day_hoc: "",
        huong_dan_ve_nha: "Ôn tập bài cũ."
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 5-10MB compressed.
        compression: "DEFLATE",
    });

    fs.writeFileSync(path.resolve("D:/smart-doc-teacher-app/TEST_USE_TEMPLATE_V2.docx"), buf);
    console.log("File saved to D:/smart-doc-teacher-app/TEST_USE_TEMPLATE_V2.docx");
};

fillTemplateV2();
