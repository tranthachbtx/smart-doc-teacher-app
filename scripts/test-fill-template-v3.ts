
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import * as fs from "fs";
import * as path from "path";

const cleanXML = (xml: string) => {
    // Basic Cleaner: Removes XML tags inside {{...}} placeholders
    // Example: {{<w:r>...</w:r>tag}} -> {{tag}}
    // It finds {{, then any characters (greedy), then }}
    // But safely, let's target known patterns. 
    // Word splits tags usually like: <w:t>{{</w:t> ... <w:t>key</w:t> ... <w:t>}}</w:t>
    // This simple regex removes ALL xml tags between {{ and }}

    return xml.replace(/(\{\{)([\s\S]*?)(\}\})/g, (match, open, content, close) => {
        // Remove all XML tags <...> from content
        const cleanedContent = content.replace(/<[^>]+>/g, "");
        return open + cleanedContent + close;
    });
};

const fillTemplateV3 = () => {
    console.log("Loading Template...");
    const content = fs.readFileSync(
        path.resolve("D:/smart-doc-teacher-app/public/templates/KHBD_Template_2Cot.docx"),
        "binary"
    );

    const zip = new PizZip(content);

    console.log("Cleaning XML...");
    const docXml = zip.file("word/document.xml")?.asText();
    if (docXml) {
        // console.log("Original XML Sample:", docXml.substring(0, 500));
        const cleanedXml = cleanXML(docXml);
        zip.file("word/document.xml", cleanedXml);
        // console.log("Cleaned XML Sample:", cleanedXml.substring(0, 500));
    }

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    console.log("Rendering...");

    // Content Simulation
    const longContentGV = Array(20).fill("- Bước 1: GV yêu cầu HS hoạt động nhóm.\n  + GV quan sát và hỗ trợ.\n  + GV ghi nhận kết quả.").join("\n");
    const longContentHS = Array(20).fill("- HS thực hiện nhiệm vụ.\n  + Thảo luận sôi nổi.\n  + Ghi chép vào phiếu.").join("\n");

    doc.render({
        ten_truong: "TRƯỜNG THPT CHUYÊN BẮC GIANG",
        to_chuyen_mon: "TỔ TOÁN - TIN",
        ten_chu_de: "BÀI KIỂM TRA MẪU CÓ SẴN (V3 CLEANED)",
        ten_giao_vien: "Nguyễn Văn A",
        lop: "12A1",
        so_tiet: "45",
        ngay_soan: "05/01/2026",
        muc_tieu_kien_thuc: "- Hiểu cách dùng Docxtemplater.\n- Biết cách fill dữ liệu vào mẫu có sẵn.",
        muc_tieu_nang_luc: "- Năng lực tự học.\n- Năng lực giải quyết vấn đề.",
        muc_tieu_pham_chat: "- Chăm chỉ, trung thực.",
        gv_chuan_bi: "Ti vi, máy chiếu.",
        hs_chuan_bi: "Sách vở, bút.",

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
        compression: "DEFLATE",
    });

    fs.writeFileSync(path.resolve("D:/smart-doc-teacher-app/TEST_USE_TEMPLATE_V3.docx"), buf);
    console.log("File saved to D:/smart-doc-teacher-app/TEST_USE_TEMPLATE_V3.docx");
};

fillTemplateV3();
