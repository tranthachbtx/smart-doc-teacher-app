import {
    getChuDeTheoThang,
    timChuDeTheoTen
} from "@/lib/data/kntt-curriculum-database";
import { getPPCTChuDe, taoContextPPCT } from "@/lib/data/ppct-database";
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
    coreTasks: string;
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
        let coreTasks = "";

        if (chuDe) {
            curriculumContext = `
CHỦ ĐỀ: ${chuDe.ten}
MẠCH NỘI DUNG: ${chuDe.mach_noi_dung.toUpperCase()}
MỤC TIÊU TỔNG QUÁT: ${chuDe.muc_tieu.join("; ")}
KẾT QUẢ CẦN ĐẠT: ${chuDe.ket_quả_can_dat?.join("; ") || "Theo quy định chương trình GDPT 2018"}
`;

            // Generate detailed tasks text
            coreTasks = chuDe.hoat_dong.map(hd => {
                const tasks = hd.nhiem_vu.map(n => `- ${n.ten}: ${n.mo_ta} (Sản phẩm: ${n.san_pham_du_kien || "Kết quả thảo luận/báo cáo"})`).join("\n");
                return `[HĐ ${hd.so_thu_tu}: ${hd.ten}]\n${hd.mo_ta}\n${tasks}\n* Lưu ý: ${hd.luu_y_su_pham || "Thúc đẩy học sinh tích cực trải nghiệm."}`;
            }).join("\n\n");
        } else {
            curriculumContext = "Không tìm thấy dữ liệu chương trình cụ thể cho chủ đề: " + topicName;
            coreTasks = "Phân bổ thời gian gợi ý: 10% Khởi động, 50% Khám phá, 25% Luyện tập, 15% Vận dụng.";
        }

        // 2. Get Student Characteristics (Psychology)
        const trongTam = getTrongTamTheoKhoi(gradeInt);
        const studentCharacteristics = `Khối ${grade}: ${trongTam?.chu_de_chinh || "Thích ứng và Khám phá"}. 
Trọng tâm phát triển: ${trongTam?.trong_tam || "Phát triển bản thân"}.
Giai đoạn tâm lý: ${trongTam?.dac_diem?.join(", ") || "Học sinh đang trong giai đoạn phát triển tư duy phản biện và định hình bản sắc cá nhân."}
Gợi ý sư phạm: Tập trung vào các hoạt động thực hành, trải nghiệm nhóm, khuyến khích tự học và sáng tạo.`;

        // 3. Get PPCT Context
        const ppctContext = chuDeSoNum ? taoContextPPCT(gradeInt, chuDeSoNum) : "Dữ liệu phân phối chương trình.";

        // 4. Get SHDC/SHL Suggestions
        const shdcShlContext = chuDeSoNum ? taoContextSHDC_SHL(gradeInt, chuDeSoNum) : "Gợi ý Sinh hoạt dưới cờ và Sinh hoạt lớp theo chủ đề.";

        // 5. Get Digital Competency (NLS)
        const nlsSuggestions = goiYNLSTheoChuDe(chuDe?.mach_noi_dung || topicName);
        const nlsText = nlsSuggestions.length > 0
            ? nlsSuggestions.map(n => `[${n.ma}] ${n.ten}: ${n.mo_ta}`).join("\n")
            : "Sử dụng công nghệ số để tìm kiếm thông tin và cộng tác.";
        const nlsContext = taoContextNLSChiTiet(gradeInt, chuDe?.mach_noi_dung || topicName) + "\n\nGỢI Ý CỤ THỂ CHO BÀI DẠY:\n" + nlsText;

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
            coreTasks,
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
     */
    buildFinalSmartPrompt(data: SmartPromptData, fileSummary?: string): string {
        return `
BẠN LÀ CHUYÊN GIA THIẾT KẾ GIÁO DỤC (INSTRUCTIONAL DESIGNER) CẤP CAO.
NHIỆM VỤ: SOẠN KẾ HOẠCH BÀI DẠY (KHBD) CHI TIẾT THEO CÔNG VĂN 5512.

--- CÔNG VIỆC CẦN THỰC HIỆN ---
1. Phân tích nội dung bài dạy cũ (nếu có) và dữ liệu chương trình chuẩn bên dưới.
2. Thực hiện "Surgical Upgrade" (Nâng cấp phẫu thuật): Giữ lại các ý tưởng tốt từ bài cũ, nhưng cấu trúc lại hoàn toàn theo form 5512.
3. Tiêm (Inject) các yếu tố hiện đại: Năng lực số (TT 02/2025), Đạo đức, Kỹ thuật dạy học tích cực.

--- CƠ SỞ DỮ LIỆU ĐÃ TRA CỨU ---

1. THÀNH PHẦN CHƯƠNG TRÌNH & MỤC TIÊU:
${data.objectives}

2. ĐẶC ĐIỂM TÂM LÝ HỌC SINH KHỐI ${data.grade}:
${data.studentCharacteristics}

3. NỘI DUNG CỐT LÕI & CÁC HOẠT ĐỘNG (SGK KẾT NỐI TRI THỨC):
${data.coreTasks}

4. NĂNG LỰC SỐ (THÔNG TƯ 02/2025):
${data.digitalCompetency}

5. GỢI Ý SINH HOẠT (SHDC & SHL):
${data.shdc_shl_suggestions}

6. CÔNG CỤ ĐÁNH GIÁ & GỢI Ý SƯ PHẠM:
${data.assessmentTools}
${data.pedagogicalNotes}

${fileSummary ? `
--- HƯỚNG DẪN PHÂN TÍCH GIÁO ÁN CŨ ---
Tôi đã gởi kèm nội dung/tóm tắt giáo án cũ của tôi. Hãy thực hiện:
- Đối chiếu mục tiêu cũ với mục tiêu chuẩn GDPT 2018 phía trên.
- Giữ lại các ngữ liệu thực tế, ví dụ hay trong bài cũ.
- Tái cấu trúc chuỗi hoạt động bài cũ sang 4 bước: Khởi động -> Khám phá -> Luyện tập -> Vận dụng.
- Bổ sung chi tiết Hoạt động của GV và Hoạt động của HS (dạng bảng 2 cột).
` : ""}

--- YÊU CẦU ĐẦU RA (JSON FORMAT) ---
Viết nội dung cực kỳ chi tiết, mạch lạc, ngôn ngữ chuyên nghiệp.
Cấu trúc JSON yêu cầu các trường:
- ten_bai, muc_tieu_kien_thuc, muc_tieu_nang_luc, muc_tieu_pham_chat
- gv_chuan_bi, hs_chuan_bi
- shdc (kịch bản chi tiết), shl (nội dung chi tiết)
- activities (mảng các hoạt động với name và content chi tiết)
- tich_hop_nls, tich_hop_dao_duc
- homework, assessment

TRẢ VỀ DUY NHẤT KHỐI JSON.
`.trim();
    }
};
