const fs = require('fs');
const PizZip = require('pizzip');
const path = require('path');

function injectTags(filePath, tagMap) {
    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath);
    const zip = new PizZip(content);
    let xml = zip.file("word/document.xml").asText();

    // Word splits text into many <w:t> tags. 
    // A simple replacement might fail if a word like "Tháng" is split.
    // However, for newly created templates, they are often in single tags.
    // We will try a simple string replacement first.

    for (const [finding, replacement] of Object.entries(tagMap)) {
        // We look for the text within <w:t> tags
        // This is a naive approach but works for simple templates
        const regex = new RegExp(finding, 'g');
        xml = xml.replace(regex, replacement);
    }

    zip.file("word/document.xml", xml);
    const out = zip.generate({ type: "nodebuffer" });
    fs.writeFileSync(filePath, out);
    console.log(`Saved ${filePath}`);
}

// Mapping for Bien ban hop
const meetingMap = {
    "Tháng:": "Tháng: {{thang}}",
    "Lần thứ:": "Lần thứ: {{lan_hop}}",
    "Chủ trì:": "Chủ trì: {{chu_tri}}",
    "Thư ký:": "Thư ký: {{thu_ky}}",
    "Thành viên tham gia:": "Thành viên tham gia: {{thanh_vien}}",
    "Sĩ số:": "Sĩ số: {{si_so}}",
    "Vắng:": "Vắng: {{vang}}",
    "Lý do:": "Lý do: {{ly_do}}",
    "Nội dung chính:": "Nội dung chính: {{BR}}{{noi_dung_chinh}}",
    "Ưu điểm:": "Ưu điểm: {{BR}}{{uu_diem}}",
    "Hạn chế:": "Hạn chế: {{BR}}{{han_che}}",
    "Ý kiến đóng góp:": "Ý kiến đóng góp: {{BR}}{{y_kien_dong_gop}}",
    "Kế hoạch tháng tới:": "Kế hoạch tháng tới: {{BR}}{{ke_hoach_thang_toi}}",
    "Kết luận:": "Kết luận: {{BR}}{{ket_luan_cuoc_hop}}"
};

// Mapping for KHBD
const lessonMap = {
    "Ngày soạn:": "Ngày soạn: {{ngay_soan}}",
    "Chủ đề:": "Chủ đề {{chu_de}}: {{ten_chu_de}}",
    "Tên bài:": "Tên bài: {{ten_bai}}",
    "Khối lớp:": "Khối lớp: {{khoi}}",
    "Số tiết:": "Số tiết: {{so_tiet}}",
    "Mục tiêu kiến thức:": "Mục tiêu kiến thức: {{BR}}{{muc_tieu_kien_thuc}}",
    "Mục tiêu năng lực:": "Mục tiêu năng lực: {{BR}}{{muc_tieu_nang_luc}}",
    "Mục tiêu phẩm chất:": "Mục tiêu phẩm chất: {{BR}}{{muc_tieu_pham_chat}}",
    "Thiết bị dạy học:": "Thiết bị dạy học: {{BR}}{{thiet_bi_day_hoc}}",
    "Khởi động:": "Khởi động: {{BR}}{{hoat_dong_khoi_dong}}",
    "Khám phá:": "Khám phá: {{BR}}{{hoat_dong_kham_pha}}",
    "Luyện tập:": "Luyện tập: {{BR}}{{hoat_dong_luyen_tap}}",
    "Vận dụng:": "Vận dụng: {{BR}}{{hoat_dong_van_dung}}",
    "Tích hợp Năng lực số:": "Tích hợp Năng lực số: {{BR}}{{tich_hop_nls}}",
    "Tích hợp Đạo đức:": "Tích hợp Đạo đức: {{BR}}{{tich_hop_dao_duc}}"
};

// Mapping for Event
const eventMap = {
    "Tên chủ đề:": "Tên chủ đề: {{ten_chu_de}}",
    "Tháng:": "Tháng: {{thang}}",
    "Khối:": "Khối: {{khoi}}",
    "Mục đích, yêu cầu:": "Mục đích, yêu cầu: {{BR}}{{muc_dich_yeu_cau}}",
    "Năng lực:": "Năng lực: {{BR}}{{nang_luc}}",
    "Phẩm chất:": "Phẩm chất: {{BR}}{{pham_chat}}",
    "Kịch bản chi tiết:": "Kịch bản chi tiết: {{BR}}{{kich_ban_chi_tiet}}",
    "Dự toán kinh phí:": "Dự toán kinh phí: {{BR}}{{du_toan_kinh_phi}}",
    "Checklist chuẩn bị:": "Checklist chuẩn bị: {{BR}}{{checklist_chuan_bi}}",
    "Thông điệp kết thúc:": "Thông điệp kết thúc: {{BR}}{{thong_diep_ket_thuc}}",
    "Đánh giá sau hoạt động:": "Đánh giá sau hoạt động: {{BR}}{{danh_gia_sau_hoat_dong}}"
};

try {
    injectTags('MAUDOCX/Mau-Bien-ban-Hop-To.docx', meetingMap);
    injectTags('MAUDOCX/Mau-Ke-hoach-Bai-day.docx', lessonMap);
    injectTags('MAUDOCX/Mau-Ke-hoach-Ngoai-khoa.docx', eventMap);
    console.log("All tags injected successfully.");
} catch (e) {
    console.error("Error during injection:", e);
}
