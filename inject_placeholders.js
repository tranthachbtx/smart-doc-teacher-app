const fs = require('fs');
const PizZip = require('pizzip');
const path = require('path');

function injectTags(filePath, tagMap) {
    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath);
    const zip = new PizZip(content);
    let xml = zip.file("word/document.xml").asText();

    // Word splits text into many <w:t> tags. 
    // A simple replacement might fail if a word like "ThÃ¡ng" is split.
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
    "ThÃ¡ng:": "ThÃ¡ng: {{thang}}",
    "Láº§n thá»©:": "Láº§n thá»©: {{lan_hop}}",
    "Chá»§ trÃ¬:": "Chá»§ trÃ¬: {{chu_tri}}",
    "ThÆ° kÃ½:": "ThÆ° kÃ½: {{thu_ky}}",
    "ThÃ nh viÃªn tham gia:": "ThÃ nh viÃªn tham gia: {{thanh_vien}}",
    "SÄ© sá»‘:": "SÄ© sá»‘: {{si_so}}",
    "Váº¯ng:": "Váº¯ng: {{vang}}",
    "LÃ½ do:": "LÃ½ do: {{ly_do}}",
    "Ná»™i dung chÃ­nh:": "Ná»™i dung chÃ­nh: {{BR}}{{noi_dung_chinh}}",
    "Æ¯u Ä‘iá»ƒm:": "Æ¯u Ä‘iá»ƒm: {{BR}}{{uu_diem}}",
    "Háº¡n cháº¿:": "Háº¡n cháº¿: {{BR}}{{han_che}}",
    "Ã kiáº¿n Ä‘Ã³ng gÃ³p:": "Ã kiáº¿n Ä‘Ã³ng gÃ³p: {{BR}}{{y_kien_dong_gop}}",
    "Káº¿ hoáº¡ch thÃ¡ng tá»›i:": "Káº¿ hoáº¡ch thÃ¡ng tá»›i: {{BR}}{{ke_hoach_thang_toi}}",
    "Káº¿t luáº­n:": "Káº¿t luáº­n: {{BR}}{{ket_luan_cuoc_hop}}"
};

// Mapping for KHBD
const lessonMap = {
    "NgÃ y soáº¡n:": "NgÃ y soáº¡n: {{ngay_soan}}",
    "Chá»§ Ä‘á»:": "Chá»§ Ä‘á» {{chu_de}}: {{ten_chu_de}}",
    "TÃªn bÃ i:": "TÃªn bÃ i: {{ten_bai}}",
    "Khá»‘i lá»›p:": "Khá»‘i lá»›p: {{khoi}}",
    "Sá»‘ tiáº¿t:": "Sá»‘ tiáº¿t: {{so_tiet}}",
    "Má»¥c tiÃªu kiáº¿n thá»©c:": "Má»¥c tiÃªu kiáº¿n thá»©c: {{BR}}{{muc_tieu_kien_thuc}}",
    "Má»¥c tiÃªu nÄƒng lá»±c:": "Má»¥c tiÃªu nÄƒng lá»±c: {{BR}}{{muc_tieu_nang_luc}}",
    "Má»¥c tiÃªu pháº©m cháº¥t:": "Má»¥c tiÃªu pháº©m cháº¥t: {{BR}}{{muc_tieu_pham_chat}}",
    "Thiáº¿t bá»‹ dáº¡y há»c:": "Thiáº¿t bá»‹ dáº¡y há»c: {{BR}}{{thiet_bi_day_hoc}}",
    "Khá»Ÿi Ä‘á»™ng:": "Khá»Ÿi Ä‘á»™ng: {{BR}}{{hoat_dong_khoi_dong}}",
    "KhÃ¡m phÃ¡:": "KhÃ¡m phÃ¡: {{BR}}{{hoat_dong_kham_pha}}",
    "Luyá»‡n táº­p:": "Luyá»‡n táº­p: {{BR}}{{hoat_dong_luyen_tap}}",
    "Váº­n dá»¥ng:": "Váº­n dá»¥ng: {{BR}}{{hoat_dong_van_dung}}",
    "TÃ­ch há»£p NÄƒng lá»±c sá»‘:": "TÃ­ch há»£p NÄƒng lá»±c sá»‘: {{BR}}{{tich_hop_nls}}",
    "TÃ­ch há»£p Äáº¡o Ä‘á»©c:": "TÃ­ch há»£p Äáº¡o Ä‘á»©c: {{BR}}{{tich_hop_dao_duc}}"
};

// Mapping for Event
const eventMap = {
    "TÃªn chá»§ Ä‘á»:": "TÃªn chá»§ Ä‘á»: {{ten_chu_de}}",
    "ThÃ¡ng:": "ThÃ¡ng: {{thang}}",
    "Khá»‘i:": "Khá»‘i: {{khoi}}",
    "Má»¥c Ä‘Ã­ch, yÃªu cáº§u:": "Má»¥c Ä‘Ã­ch, yÃªu cáº§u: {{BR}}{{muc_dich_yeu_cau}}",
    "NÄƒng lá»±c:": "NÄƒng lá»±c: {{BR}}{{nang_luc}}",
    "Pháº©m cháº¥t:": "Pháº©m cháº¥t: {{BR}}{{pham_chat}}",
    "Ká»‹ch báº£n chi tiáº¿t:": "Ká»‹ch báº£n chi tiáº¿t: {{BR}}{{kich_ban_chi_tiet}}",
    "Dá»± toÃ¡n kinh phÃ­:": "Dá»± toÃ¡n kinh phÃ­: {{BR}}{{du_toan_kinh_phi}}",
    "Checklist chuáº©n bá»‹:": "Checklist chuáº©n bá»‹: {{BR}}{{checklist_chuan_bi}}",
    "ThÃ´ng Ä‘iá»‡p káº¿t thÃºc:": "ThÃ´ng Ä‘iá»‡p káº¿t thÃºc: {{BR}}{{thong_diep_ket_thuc}}",
    "ÄÃ¡nh giÃ¡ sau hoáº¡t Ä‘á»™ng:": "ÄÃ¡nh giÃ¡ sau hoáº¡t Ä‘á»™ng: {{BR}}{{danh_gia_sau_hoat_dong}}"
};

try {
    injectTags('MAUDOCX/Mau-Bien-ban-Hop-To.docx', meetingMap);
    injectTags('MAUDOCX/Mau-Ke-hoach-Bai-day.docx', lessonMap);
    injectTags('MAUDOCX/Mau-Ke-hoach-Ngoai-khoa.docx', eventMap);
    console.log("All tags injected successfully.");
} catch (e) {
    console.error("Error during injection:", e);
}
