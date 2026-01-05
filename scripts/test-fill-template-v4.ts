
import PizZip from "pizzip";
import * as fs from "fs";
import * as path from "path";

// Function to escape XML characters
const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

// Function to convert newlines to Word break tags
const formatContent = (text: string) => {
    if (!text) return "";
    // Escape XML first
    const escaped = escapeXml(text);
    // Replace newlines with <w:br/>
    return escaped.replace(/\n/g, '<w:br/>');
};

const fillTemplateV4 = () => {
    console.log("Loading Template V4 (Direct XML)...");
    const templatePath = path.resolve("D:/smart-doc-teacher-app/public/templates/KHBD_Template_2Cot.docx");

    try {
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);
        let docXml = zip.file("word/document.xml")?.asText();

        if (!docXml) {
            console.error("No document.xml found");
            return;
        }

        // 1. CLEAN PHANTOM TAGS inside {{...}}
        docXml = docXml.replace(/(\{\{)([\s\S]*?)(\}\})/g, (match, open, inner, close) => {
            const key = inner.replace(/<[^>]+>/g, "");
            return "{{" + key + "}}";
        });

        console.log("XML Cleaned. Generating Massive Content (Target: ~80 pages) with STRICT SEPARATION...");

        // Explicit GV Content
        const contentGV = `
    - Bước 1: GV chuyển giao nhiệm vụ:
      + GV yêu cầu HS đọc sách trang 10.
      + GV chia nhóm 4 người.
      + GV phát phiếu học tập.
    
    - Bước 2: GV quan sát và hỗ trợ:
      + GV đi vòng quanh lớp quan sát.
      + GV nhắc nhở nhóm 3 tập trung.
      + GV giải đáp thắc mắc cho nhóm 1.

    - Bước 3: GV tổ chức báo cáo:
      + GV mời nhóm 2 trình bày.
      + GV ghi bảng các ý chính.
      
    - Bước 4: GV kết luận:
      + GV chốt kiến thức bài học.
      + GV đánh giá tinh thần thái độ.
        `.trim();

        // Explicit HS Content
        const contentHS = `
    - Hoạt động của Học sinh (Tương ứng):
      + HS nhận nhiệm vụ từ GV.
      + HS về nhóm bầu nhóm trưởng.
      + HS nhận phiếu học tập.
    
    - HS thực hiện:
      + HS thảo luận sôi nổi.
      + HS ghi chép vào vở nháp.
      + HS đặt câu hỏi cho GV.

    - HS báo cáo:
      + Đại diện HS lên bảng trình bày.
      + Các nhóm khác nhận xét, bổ sung.
      
    - HS lắng nghe:
      + HS nghe GV chốt kiến thức.
      + HS ghi bài vào vở.
        `.trim();

        // Repeat 150 times for stress test
        const massiveContentGV = Array(150).fill(contentGV).join("\n\n");
        const massiveContentHS = Array(150).fill(contentHS).join("\n\n");

        const data: Record<string, string> = {
            ten_truong: "TRƯỜNG THPT CHUYÊN BẮC GIANG",
            to_chuyen_mon: "TỔ TOÁN - TIN",
            ten_chu_de: "BÀI KIỂM TRA TÁCH BIỆT DỮ LIỆU",
            ten_giao_vien: "Nguyễn Văn A",
            lop: "12A1",
            so_tiet: "90",
            ngay_soan: "05/01/2026",
            muc_tieu_kien_thuc: "- Dữ liệu GV nằm riêng cột GV.\n- Dữ liệu HS nằm riêng cột HS.",
            muc_tieu_nang_luc: "- Kiểm tra tính đúng đắn của việc map dữ liệu.",
            muc_tieu_pham_chat: "- Chính xác, rõ ràng.",
            gv_chuan_bi: "Ti vi, máy chiếu.",
            hs_chuan_bi: "Sách vở.",
            shdc: "SHDC Tuần 1",
            shl: "SHL Tuần 1",
            ho_so_day_hoc: "Phụ lục.",
            huong_dan_ve_nha: "Bài tập về nhà.",
            // Activities - Heavy Load Here
            hoat_dong_khoi_dong_cot_1: "GV tổ chức trò chơi.",
            hoat_dong_khoi_dong_cot_2: "HS tham gia chơi.",
            hoat_dong_kham_pha_cot_1: massiveContentGV, // ONLY GV CONTENT
            hoat_dong_kham_pha_cot_2: massiveContentHS, // ONLY HS CONTENT
            hoat_dong_luyen_tap_cot_1: "GV giao bài tập.",
            hoat_dong_luyen_tap_cot_2: "HS làm bài.",
            hoat_dong_van_dung_cot_1: "GV hướng dẫn.",
            hoat_dong_van_dung_cot_2: "HS thực hiện."
        };

        // 3. REPLACE
        Object.keys(data).forEach(key => {
            const placeholder = `{{${key}}}`;
            const value = formatContent(data[key]);
            docXml = docXml?.split(placeholder).join(value);
        });

        // Save back
        zip.file("word/document.xml", docXml);

        const buf = zip.generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        fs.writeFileSync(path.resolve("D:/smart-doc-teacher-app/TEST_USE_TEMPLATE_FIXED_CONTENT.docx"), buf);
        console.log("File saved to D:/smart-doc-teacher-app/TEST_USE_TEMPLATE_FIXED_CONTENT.docx");

    } catch (e) {
        console.error("Error:", e);
    }
};

fillTemplateV4();
