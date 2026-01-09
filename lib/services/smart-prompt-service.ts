import {
    getChuDeTheoThang,
    timChuDeTheoTen
} from "@/lib/data/kntt-curriculum-database";
import { getPPCTChuDe, taoContextPhanBoThoiGian } from "@/lib/data/ppct-database";
import {
    taoContextSHDC_SHL
} from "@/lib/data/shdc-shl-templates";
import {
    taoContextNLSChiTiet,
    goiYNLSTheoChuDe
} from "@/lib/data/nang-luc-so-database";
import {
    taoContextPhieuHocTap,
    taoContextRubric
} from "@/lib/data/phieu-hoc-tap-rubric-database";
import { getTrongTamTheoKhoi, taoContextKHBD_CV5512 } from "@/lib/data/hdtn-pedagogical-guide";

export interface SmartPromptData {
    grade: string;
    topicName: string;
    objectives: string;
    studentCharacteristics: string;
    coreMissions: {
        khoiDong: string;
        khamPha: string;
        luyenTap: string;
        vanDung: string;
    };
    shdc_shl_suggestions: string;
    digitalCompetency: string;
    assessmentTools: string;
    pedagogicalNotes: string;
}

/**
 * Service to handle intelligent lookups across multiple databases
 */
// --- PROMPT CACHE (Phase 2 Optimize) ---
const promptCache = new Map<string, SmartPromptData>();

export const SmartPromptService = {
    /**
     * Performs a comprehensive lookup based on grade and topic
     */
    async lookupSmartData(grade: string, topicName: string, chuDeSo?: string): Promise<SmartPromptData> {
        const cacheKey = `${grade}-${topicName}-${chuDeSo || ''}`;
        if (promptCache.has(cacheKey)) {
            console.log(`[SmartPrompt] Cache Hit for ${cacheKey}`);
            return promptCache.get(cacheKey)!;
        }

        const gradeInt = parseInt(grade) as 10 | 11 | 12;
        const chuDeSoNum = chuDeSo ? parseInt(chuDeSo) : undefined;

        // 1. Get Curriculum Data (Detailed)
        const chuDe = timChuDeTheoTen(gradeInt, topicName);
        let curriculumContext = "";
        const coreMissions = {
            khoiDong: "Chuẩn bị tâm thế, kết nối kiến thức cũ.",
            khamPha: "Hình thành kiến thức và kỹ năng mới.",
            luyenTap: "Củng cố và rèn luyện thông qua bài tập.",
            vanDung: "Ứng dụng vào thực tiễn cuộc sống."
        };

        if (chuDe) {
            curriculumContext = `
CHỦ ĐỀ: ${chuDe.ten}
MẠCH NỘI DUNG: ${chuDe.mach_noi_dung.toUpperCase()}
MỤC TIÊU TỔNG QUÁT: ${chuDe.muc_tieu.join("; ")}
KẾT QUẢ CẦN ĐẠT: ${chuDe.ket_qua_can_dat?.join("; ") || "Theo quy định chương trình GDPT 2018"}
`;

            // Map activities to specific 5512 stages
            chuDe.hoat_dong.forEach((hd, index) => {
                const tasksText = hd.nhiem_vu.map(n => `- ${n.ten}: ${n.mo_ta} (Sản phẩm: ${n.san_pham_du_kien || "Kết quả thảo luận/báo cáo"})`).join("\n");
                const fullContent = `[HĐ ${hd.so_thu_tu}: ${hd.ten}]\n${hd.mo_ta}\n${tasksText}\n* Lưu ý: ${hd.luu_y_su_pham || "Thúc đẩy học sinh tích cực trải nghiệm."}`;

                if (index === 0) coreMissions.khoiDong = fullContent;
                else if (index === 1) coreMissions.khamPha = fullContent;
                else if (index === 2) coreMissions.luyenTap = fullContent;
                else if (index === 3) coreMissions.vanDung = fullContent;
            });
        } else {
            curriculumContext = "Không tìm thấy dữ liệu chương trình cụ thể cho chủ đề: " + topicName;
        }

        // 2. Get Student Characteristics (Psychology)
        const trongTam = getTrongTamTheoKhoi(gradeInt);
        const studentCharacteristics = `Khối ${grade}: ${trongTam?.chu_de_chinh || "Thích ứng và Khám phá"}. 
Trọng tâm phát triển: ${trongTam?.trong_tam || "Phát triển bản thân"}.
Giai đoạn tâm lý: ${trongTam?.dac_diem?.join(", ") || "Học sinh đang trong giai đoạn phát triển tư duy phản biện và định hình bản sắc cá nhân."}
Gợi ý sư phạm: Tập trung vào các hoạt động thực hành, trải nghiệm nhóm, khuyến khích tự học và sáng tạo.`;

        // 3. Get PPCT Context
        const ppctContext = chuDeSoNum ? taoContextPhanBoThoiGian(gradeInt, chuDeSoNum) : "Dữ liệu phân phối chương trình.";

        // 4. Get SHDC/SHL Suggestions
        const shdcShlContext = chuDeSoNum ? taoContextSHDC_SHL(gradeInt, chuDeSoNum, chuDe?.mach_noi_dung) : "Gợi ý Sinh hoạt dưới cờ và Sinh hoạt lớp theo chủ đề.";

        // 5. Get Digital Competency (NLS) - Cleaned version focusing only on content
        const nlsSuggestions = goiYNLSTheoChuDe(chuDe?.mach_noi_dung || topicName);
        const nlsItems = nlsSuggestions.length > 0
            ? nlsSuggestions.map((n, i) => `${i + 1}. [${n.ma}] ${n.ten}: ${n.mo_ta}\n   - Ví dụ: ${n.vi_du_tich_hop[0] || ""}`).join("\n\n")
            : "Sử dụng công nghệ số để tìm kiếm thông tin và cộng tác.";

        const nlsContext = `GỢI Ý NĂNG LỰC SỐ (NLS) PHÙ HỢP:\n${nlsItems}\n\n* Lưu ý: Ghi mã năng lực thành phần tương ứng (VD: 1.1.NC1a) vào mục tiêu KHBD.`.trim();

        // 6. Get Assessment Tools (Rubrics & Worksheets)
        const phtContext = taoContextPhieuHocTap(topicName, chuDe?.hoat_dong[0]?.ten || topicName);
        const rubricContext = taoContextRubric(chuDe?.hoat_dong[0]?.ten || topicName);
        const assessmentContext = `${phtContext}\n\n${rubricContext}`;

        // 7. Get Pedagogical Notes
        const pedContext = taoContextKHBD_CV5512(gradeInt, topicName, chuDe?.mach_noi_dung || "ban_than");

        const result: SmartPromptData = {
            grade,
            topicName,
            objectives: curriculumContext,
            studentCharacteristics,
            coreMissions,
            shdc_shl_suggestions: shdcShlContext,
            digitalCompetency: nlsContext,
            assessmentTools: assessmentContext,
            pedagogicalNotes: pedContext
        };

        promptCache.set(cacheKey, result);
        return result;
    },

    /**
     * Builds the final structured prompt for Gemini Pro
     * Tối ưu hóa khoa học, chuyên nghiệp, loại bỏ rác dữ liệu.
     * Áp dụng chuẩn 5512 với cấu trúc 2 cột (GV - HS).
     */
    buildFinalSmartPrompt(data: SmartPromptData, fileSummary?: string): string {
        const clean = (text: string) => {
            if (!text) return "Không có dữ liệu bổ sung.";
            return text
                .replace(/[·•]/g, '')        // Xóa dấu chấm lửng/dấu điểm
                .replace(/\s+/g, ' ')       // Chuẩn hóa khoảng trắng
                .replace(/undefined/g, '')  // Xóa các lỗi undefined nếu có
                .trim();
        };

        const isHDTN = data.topicName.toLowerCase().includes("trải nghiệm") ||
            data.objectives.toLowerCase().includes("trải nghiệm") ||
            data.grade.includes("HĐTN");

        const hdtndir = isHDTN ? `
- ĐẶC THÙ HĐTN: Phải đảm bảo tính "Vertical Entanglement" (Sự thống nhất dọc) giữa Sinh hoạt dưới cờ (SHDC), Hoạt động giáo dục (HĐGD) và Sinh hoạt lớp (SHL) cho cùng một chủ đề. 
- Mạch logic: SHDC khơi gợi -> HĐGD thực hành chuyên sâu -> SHL tổng kết và cam kết rèn luyện.` : "";

        return `
# VAI TRÒ: CHUYÊN GIA THIẾT KẾ GIÁO DỤC & SOẠN THẢO KHBD CAO CẤP
# NHIỆM VỤ: KHỞI TẠO KẾ HOẠCH BÀI DẠY (KHBD) CHUẨN MOET 5512

## 1. CHỈ DẪN PHÂN TÍCH CHIẾN LƯỢC
- COI CÁC DỮ LIỆU DƯỚI ĐÂY LÀ "NỘI DUNG NGHIÊN CỨU TRỌNG TÂM" (Primordial Research Content). 
- ƯU TIÊN TUYỆT ĐỐI việc sử dụng các ngữ liệu, nhiệm vụ và gợi ý sư phạm đã được chuẩn bị sẵn.
- LUÔN PHÂN TÍCH file giáo án cũ tôi gửi kèm theo prompt này (nếu có).
- THỰC HIỆN "Surgical Upgrade": Giữ lại ngữ liệu hay từ bài cũ, nhưng cấu trúc lại 100% theo form 4 bước của Công văn 5512.
- TIÊM (INJECT) YẾU TỐ HIỆN ĐẠI: Năng lực số (TT 02/2025), Đạo đức và Kỹ thuật dạy học tích cực. ${hdtndir}

## 2. QUY TẮC CẤU TRÚC 2 CỘT (QUAN TRỌNG NHẤT)
Để xuất Word chuyên nghiệp, nội dung các hoạt động PHẢI sử dụng marker:
- {{cot_1}}: Dùng cho Hoạt động của Giáo viên.
- {{cot_2}}: Dùng cho Hoạt động của Học sinh.

## 3. CĂN CỨ DỮ LIỆU NGHIÊN CỨU SÂU (INPUT PRIMARY SOURCE)
- Khối lớp: ${data.grade}
- Đặc điểm học sinh: ${clean(data.studentCharacteristics)}
- Chủ đề: ${data.topicName}
- Mục tiêu đạt được (Chuyên môn): ${clean(data.objectives)}
- Nhiệm vụ chủ chốt: ${clean(Object.values(data.coreMissions).join("\n\n"))}
- Năng lực số & Công cụ (TT 02/2025): ${clean(data.digitalCompetency)}
- Gợi ý SHDC & SHL: ${clean(data.shdc_shl_suggestions)}
- Công cụ Đánh giá & Phụ lục: ${clean(data.assessmentTools)}
- Lưu ý sư phạm chuyên sâu: ${clean(data.pedagogicalNotes)}
- Tài liệu đính kèm (File Summary): ${fileSummary || "Xem trực tiếp tệp đính kèm."}

## 4. QUY CÁCH ĐẦU RA (JSON ĐƠN NHẤT)
Yêu cầu trả về duy nhất 01 khối JSON với các trường sau:

{
  "ten_bai": "Tên bài dạy chi tiết",
  "muc_tieu_kien_thuc": "Nội dung kiến thức...",
  "muc_tieu_nang_luc": "Nội dung năng lực...",
  "muc_tieu_pham_chat": "Nội dung phẩm chất...",
  "thiet_bi_day_hoc": "Giáo viên: ...; Học sinh: ...",
  "shdc": ${isHDTN ? `{ "chu_de": "...", "muc_tieu": "...", "to_chuc": "{{cot_1}} ... {{cot_2}} ..." }` : `"Nội dung sinh hoạt dưới cờ..."`},
  "shl": ${isHDTN ? `{ "chu_de": "...", "muc_tieu": "...", "to_chuc": "{{cot_1}} ... {{cot_2}} ..." }` : `"Nội dung sinh hoạt lớp..."`},
  "hoat_dong_khoi_dong": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV ... {{cot_2}} HS ...",
  "hoat_dong_kham_pha": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV ... {{cot_2}} HS ...",
  "hoat_dong_luyen_tap": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV ... {{cot_2}} HS ...",
  "hoat_dong_van_dung": "a) Mục tiêu: ...; b) Nội dung: ...; c) Sản phẩm: ...; d) Tổ chức thực hiện: {{cot_1}} GV ... {{cot_2}} HS ...",
  "ho_so_day_hoc": "Các phụ lục, phiếu học tập (trình bày chi tiết)...",
  "huong_dan_ve_nha": "Dặn dò cụ thể..."
}

LƯU Ý: 
- Mục d) "Tổ chức thực hiện" BẮT BUỘC phải dùng {{cot_1}} và {{cot_2}}.
- Ngôn ngữ sư phạm chuẩn MOET, chuyên nghiệp.
- CHỈ TRẢ VỀ JSON. KHÔNG GIẢI THÍCH THÊM.
`
            .trim();
    },

    /**
     * Phase 2: BUILD DEEP CONTENT PROMPT
     * Mở rộng toàn bộ giáo án thành nội dung chuyên sâu, khoa học và đầy đủ các mục.
     */
    buildDeepContentPrompt(currentResult: any, data: SmartPromptData): string {
        const isHDTN = data.topicName.toLowerCase().includes("trải nghiệm") ||
            data.grade.includes("HĐTN");

        return `
# VAI TRÒ: CHUYÊN GIA PHÁT TRIỂN NỘI DUNG GIÁO DỤC CHI TIẾT (LEVEL: SENIOR)
# NHIỆM VỤ: PHÁT TRIỂN HOÀN THIỆN KẾ HOẠCH BÀI DẠY (PHASE 2 - FULL DEEP EXPANSION)

Dựa trên khung giáo án hiện tại và dữ liệu nghiên cứu, hãy thực hiện "Nâng cấp toàn diện" để tạo ra một bản KHBD hoàn chỉnh, không bỏ sót bất kỳ mục nào.

## 1. DỮ LIỆU ĐẦU VÀO (CORE INPUT):
- Tên bài: ${currentResult.ten_bai || data.topicName}
- Khung 4 hoạt động hiện tại: ${JSON.stringify({
            kd: currentResult.hoat_dong_khoi_dong,
            kp: currentResult.hoat_dong_kham_pha,
            lt: currentResult.hoat_dong_luyen_tap,
            vd: currentResult.hoat_dong_van_dung
        })}
- Dữ liệu SHDC/SHL hiện tại (Cần giữ lại và mở rộng): ${JSON.stringify({
            shdc: currentResult.shdc,
            shl: currentResult.shl
        })}
- Gợi ý Năng lực số (TT 02/2025): ${data.digitalCompetency}

## 2. YÊU CẦU NÂNG CẤP CHI TIẾT:
1. **Mục II (Mục tiêu):** Trích xuất từ nội dung 4 hoạt động để viết chi tiết Kiến thức, Năng lực (chung & riêng), Phẩm chất. KHÔNG ghi "Xem chi tiết...". Phải ghi rõ học sinh đạt được gì.
2. **Mục III (Thiết bị):** Liệt kê cụ thể từng loại học liệu, link padlet, thẻ màu, video, hoặc dụng cụ thí nghiệm cần thiết cho GV và HS.
3. **Mục IV (Tiến trình - 4 Hoạt động):** 
   - Triển khai "Facilitation Guide" cực kỳ chi tiết cho GV (kỹ thuật đặt câu hỏi, tình huống sư phạm).
   - Chi tiết hành động HS (thao tác số, làm việc nhóm).
   - BẮT BUỘC dùng {{cot_1}} và {{cot_2}} cho phần "Tổ chức thực hiện".
4. **Mục V (Hồ sơ dạy học):** Thiết kế chi tiết ít nhất 01 Phiếu học tập và 01 Rubric đánh giá đa mức độ.
5. **Mục VI (Hướng dẫn về nhà):** Đưa ra các nhiệm vụ mở rộng, tìm hiểu thực tế hoặc chuẩn bị cho bài sau.
6. **Mục SHDC & SHL (Nếu là HĐTN):** Phải được phát triển chuyên sâu theo cấu trúc 2 cột, kết nối chặt chẽ với chủ đề bài học.

## 3. QUY CÁCH TRẢ VỀ (JSON DUY NHẤT):
{
  "ten_bai": "...",
  "muc_tieu_kien_thuc": "Chi tiết...",
  "muc_tieu_nang_luc": "Chi tiết...",
  "muc_tieu_pham_chat": "Chi tiết...",
  "tich_hop_nls": "Mã năng lực số và nội dung tích hợp...",
  "thiet_bi_day_hoc": "GV: ...; HS: ...",
  "shdc": "Phát triển chi tiết cấu trúc 2 cột...",
  "shl": "Phát triển chi tiết cấu trúc 2 cột...",
  "hoat_dong_khoi_dong": "Phát triển chi tiết...",
  "hoat_dong_kham_pha": "Phát triển chi tiết...",
  "hoat_dong_luyen_tap": "Phát triển chi tiết...",
  "hoat_dong_van_dung": "Phát triển chi tiết...",
  "ho_so_day_hoc": "Nội dung Phụ lục (PHT, Rubric) cực kỳ chi tiết...",
  "huong_dan_ve_nha": "Nhiệm vụ cụ thể..."
}

LƯU Ý: Tuyệt đối không dùng lại các marker [AI-SUGGESTION], [PDF]. Ngôn ngữ sư phạm chuyên sâu.
`.trim();
    }
};
