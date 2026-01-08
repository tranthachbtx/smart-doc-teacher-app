
import {
    CHUONG_TRINH_LOP_10,
    ChuongTrinhKhoi,
    ChuDe,
    TRIET_LY_CHUONG_TRINH
} from '../data/kntt-curriculum-database';

// Note: In a real implementation we would import 11 and 12 too. 
// For now we'll focus on 10 as per the database file view.
// If 11 and 12 are exported in the same file, we add them.

export class CurriculumService {
    private static instance: CurriculumService;
    private curriculumData: Map<number, ChuongTrinhKhoi> = new Map();

    private constructor() {
        this.curriculumData.set(10, CHUONG_TRINH_LOP_10);
        // We will assume CHUONG_TRINH_LOP_11 and 12 exist based on outline logic
        // but for safety in this demo, let's try to dynamic import or check if they are defined
        try {
            const { CHUONG_TRINH_LOP_11 } = require('../data/kntt-curriculum-database');
            if (CHUONG_TRINH_LOP_11) this.curriculumData.set(11, CHUONG_TRINH_LOP_11);

            const { CHUONG_TRINH_LOP_12 } = require('../data/kntt-curriculum-database');
            if (CHUONG_TRINH_LOP_12) this.curriculumData.set(12, CHUONG_TRINH_LOP_12);
        } catch (e) {
            console.warn('[CurriculumService] Grade 11/12 not found in database file.');
        }
    }

    public static getInstance(): CurriculumService {
        if (!CurriculumService.instance) {
            CurriculumService.instance = new CurriculumService();
        }
        return CurriculumService.instance;
    }

    /**
     * Lấy toàn bộ chương trình của một khối
     */
    public getFullProgram(grade: number): ChuongTrinhKhoi | undefined {
        return this.curriculumData.get(grade);
    }

    /**
     * Tìm chủ đề theo tháng và khối lớp
     */
    public getThemesByMonth(grade: number, month: number): ChuDe[] {
        const program = this.curriculumData.get(grade);
        if (!program) return [];

        return program.chu_de.filter(cd =>
            cd.thang_thuc_hien?.includes(month)
        );
    }

    /**
     * Tìm chi tiết chủ đề theo mã hoặc tên
     */
    public getThemeDetail(grade: number, query: string): ChuDe | undefined {
        const program = this.curriculumData.get(grade);
        if (!program) return undefined;

        return program.chu_de.find(cd =>
            cd.ma === query || cd.ten.toLowerCase().includes(query.toLowerCase())
        );
    }

    /**
     * Lấy gợi ý tích hợp và lưu ý sư phạm cho một chủ đề
     */
    public getPedagogicalContext(grade: number, themeMa: string) {
        const theme = this.getThemeDetail(grade, themeMa);
        if (!theme) return null;

        return {
            luuY: theme.luu_y_su_pham,
            tichHop: theme.goi_y_tich_hop,
            trietLy: TRIET_LY_CHUONG_TRINH.triet_ly,
            dacDiemTamLy: this.curriculumData.get(grade)?.dac_diem_tam_ly_lua_tuoi
        };
    }

    /**
     * Phân tích text để tìm chủ đề tương ứng (Dùng cho quy trình nhập PDF)
     */
    public identifyThemeFromText(text: string, grade?: number): { theme: ChuDe, grade: number } | null {
        const searchGrades = grade ? [grade] : [10, 11, 12];

        for (const g of searchGrades) {
            const program = this.curriculumData.get(g);
            if (!program) continue;

            for (const theme of program.chu_de) {
                // Check if theme name or keywords exist in text
                if (text.toLowerCase().includes(theme.ten.toLowerCase())) {
                    return { theme, grade: g };
                }

                if (theme.tu_khoa_tim_kiem?.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
                    return { theme, grade: g };
                }
            }
        }

        return null;
    }
}
