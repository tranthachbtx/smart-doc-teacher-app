
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
    taoContextDanhGiaKHBD
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
    duration?: string;
}

// --- PROMPT CACHE ---
const promptCache = new Map<string, SmartPromptData>();

export const SmartPromptService = {
    async lookupSmartData(grade: string, topicName: string, chuDeSo?: string): Promise<SmartPromptData> {
        const cacheKey = `${grade}-${topicName}-${chuDeSo || ''}`;
        if (promptCache.has(cacheKey)) {
            return promptCache.get(cacheKey)!;
        }

        const gradeInt = parseInt(grade) as 10 | 11 | 12;
        const chuDeSoNum = chuDeSo ? parseInt(chuDeSo) : undefined;

        const chuDe = timChuDeTheoTen(gradeInt, topicName);
        console.log(`[SmartPrompt] Lookup for "${topicName}" (Grade ${grade}) -> Match: ${chuDe?.ten || 'NONE'}`);

        let finalChuDeSo = chuDeSoNum;
        if (!finalChuDeSo && chuDe?.ma) {
            const parts = chuDe.ma.split('.');
            if (parts.length > 1) {
                finalChuDeSo = parseInt(parts[1]);
            }
        }

        let curriculumContext = "";
        const coreMissions = {
            khoiDong: "Chuẩn bị tâm thế, kết nối kiến thức cũ.",
            khamPha: "Hình thành kiến thức và kỹ năng mới.",
            luyenTap: "Củng cố và rèn luyện thông qua bài tập.",
            vanDung: "Ứng dụng vào thực tiễn cuộc sống."
        };

        let duration = "3 tiết"; // Default

        if (chuDe) {
            curriculumContext = `
CHỦ ĐỀ: ${chuDe.ten}
MẠCH NỘI DUNG: ${chuDe.mach_noi_dung.toUpperCase()}
MỤC TIÊU TỔNG QUÁT: ${chuDe.muc_tieu.join("; ")}
KẾT QUẢ CẦN ĐẠT: ${chuDe.ket_qua_can_dat?.join("; ") || "Theo quy định chương trình GDPT 2018"}
`;
            if (chuDe.so_tiet_de_xuat) duration = `${chuDe.so_tiet_de_xuat} tiết`;

            // Reset core missions to accumulate
            coreMissions.khoiDong = "";
            coreMissions.khamPha = "";
            coreMissions.luyenTap = "";
            coreMissions.vanDung = "";

            const totalHD = chuDe.hoat_dong.length;
            chuDe.hoat_dong.forEach((hd, index) => {
                const tasksText = hd.nhiem_vu.map(n => `- ${n.ten}: ${n.mo_ta} (Sản phẩm: ${n.san_pham_du_kien || "Kết quả thảo luận/báo cáo"})`).join("\n");
                const fullContent = `[HĐ ${hd.so_thu_tu}: ${hd.ten}]\n${hd.mo_ta}\n${tasksText}\n* Lưu ý: ${hd.luu_y_su_pham || "Thúc đẩy học sinh tích cực trải nghiệm."}\n\n`;

                if (index === 0) {
                    coreMissions.khoiDong += fullContent;
                } else if (index === totalHD - 1) {
                    coreMissions.vanDung += fullContent;
                } else if (index < Math.ceil(totalHD / 2)) {
                    coreMissions.khamPha += fullContent;
                } else {
                    coreMissions.luyenTap += fullContent;
                }
            });
        }

        const trongTam = getTrongTamTheoKhoi(gradeInt);
        const studentCharacteristics = `Khối ${grade}: ${trongTam?.chu_de_chinh || "Thích ứng và Khám phá"}. 
Trọng tâm phát triển: ${trongTam?.trong_tam || "Phát triển bản thân"}.
Đặc điểm: ${trongTam?.dac_diem?.join(", ") || "Học sinh đang phát triển tư duy phản biện."}`;

        const shdc_shl = taoContextSHDC_SHL(gradeInt, finalChuDeSo || 1);
        const digital = goiYNLSTheoChuDe(topicName);
        const digitalContext = taoContextNLSChiTiet(gradeInt, topicName || "");

        const assessmentContext = taoContextDanhGiaKHBD(topicName, ["Khám phá", "Luyện tập", "Vận dụng"]);

        const data: SmartPromptData = {
            grade,
            topicName,
            objectives: curriculumContext,
            studentCharacteristics,
            coreMissions,
            shdc_shl_suggestions: shdc_shl,
            digitalCompetency: digitalContext,
            assessmentTools: assessmentContext,
            pedagogicalNotes: `Trọng tâm: ${trongTam?.trong_tam}. \nPhương pháp đề xuất: Dạy học dự án, Trải nghiệm thực tế, Thảo luận nhóm.`,
            duration
        };

        promptCache.set(cacheKey, data);
        return data;
    },

    buildFinalSmartPrompt(basePrompt: string, smartData: SmartPromptData): string {
        return `
${basePrompt}

=== DỮ LIỆU THÔNG MINH TỪ DATABASE (V39.2) ===
1. [MỤC TIÊU & YÊU CẦU CẦN ĐẠT]
${smartData.objectives}

2. [ĐẶC ĐIỂM HỌC SINH KHỐI ${smartData.grade}]
${smartData.studentCharacteristics}

3. [GỢI Ý NHIỆM VỤ CỐT LÕI 5512]
- Khởi động: ${smartData.coreMissions.khoiDong.substring(0, 500)}...
- Khám phá: ${smartData.coreMissions.khamPha.substring(0, 800)}...
- Luyện tập: ${smartData.coreMissions.luyenTap.substring(0, 500)}...
- Vận dụng: ${smartData.coreMissions.vanDung.substring(0, 500)}...

4. [CÔNG CỤ SỐ & RUBRIC]
${smartData.digitalCompetency}
${smartData.assessmentTools}

=== HẾT DỮ LIỆU ===
`;
    }
};
