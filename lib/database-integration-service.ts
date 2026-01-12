
/**
 * 🎯 DATABASE INTEGRATION SERVICE - ARCHITECTURE 18.0
 * Tích hợp đầy đủ database hệ thống vào quy trình xử lý giáo án
 */

import { SmartPromptService, SmartPromptData } from './services/smart-prompt-service';
import { getPPCTTheoKhoi, type PPCTChuDe } from './data/ppct-database';
import { getChuDeTheoThang, timChuDeTheoTen } from './data/kntt-curriculum-database';

export interface LessonContext {
  grade: string;
  topic: string;
  chuDeSo?: string;
  ppctData: PPCTChuDe | null;
  curriculumData: any;
  smartPrompts: SmartPromptData;
  educationalContext: EducationalContext;
  referenceMaterials: ReferenceMaterial[];
}

export interface EducationalContext {
  trongTamPhatTrien: string;
  dacDiemTuongLai: string;
  gopYSuPham: string;
  nangLucSo: string;
  daoDucGiaoDuc: string;
  kyNangSong: string;
  oldLessonContext?: string;
}

export interface ReferenceMaterial {
  type: 'ppct' | 'curriculum' | 'nanglucso' | 'rubric' | 'phieuhoc';
  title: string;
  content: string;
  relevance: number;
}

export class DatabaseIntegrationService {
  /**
   * Lấy context đầy đủ cho giáo án từ tất cả database
   */
  async getContextForLesson(
    grade: string,
    topic: string,
    chuDeSo?: string,
    oldLessonSummary?: string
  ): Promise<LessonContext> {
    console.log(`[DatabaseService] Getting context for grade ${grade}, topic ${topic}`);

    // Step 1: Get basic data
    const gradeInt = parseInt(grade) as 10 | 11 | 12;
    const chuDeSoNum = chuDeSo ? parseInt(chuDeSo) : undefined;

    // Step 2: Get PPCT data
    const ppctData = chuDeSoNum ? await this.getPPCTData(gradeInt, chuDeSoNum) : null;

    // Step 3: Get curriculum data
    const curriculumData = await this.getCurriculumData(gradeInt, topic);

    // Step 4: Get smart prompts
    const smartPrompts = await SmartPromptService.lookupSmartData(grade, topic, chuDeSo);

    // Step 5: Get educational context
    const educationalContext = await this.getEducationalContext(gradeInt, topic);

    // Step 6: Get reference materials
    const referenceMaterials = await this.getReferenceMaterials(gradeInt, topic, chuDeSoNum);

    // Step 7: Enhance with old lesson data if available
    if (oldLessonSummary) {
      educationalContext.oldLessonContext = oldLessonSummary;
    }

    console.log(`[DatabaseService] Context retrieved successfully`);

    return {
      grade,
      topic,
      chuDeSo,
      ppctData,
      curriculumData,
      smartPrompts,
      educationalContext,
      referenceMaterials
    };
  }

  /**
   * Lấy dữ liệu PPCT
   */
  private async getPPCTData(grade: 10 | 11 | 12, chuDeSo: number): Promise<PPCTChuDe | null> {
    const ppctData = getPPCTTheoKhoi(grade);
    if (!ppctData) return null;

    const chuDe = ppctData.chu_de.find(cd => cd.chu_de_so === chuDeSo);

    if (chuDe) {
      console.log(`[DatabaseService] Found PPCT data for chuDe ${chuDeSo}`);
      return chuDe;
    }

    console.log(`[DatabaseService] No PPCT data found for chuDe ${chuDeSo}`);
    return null;
  }

  /**
   * Lấy dữ liệu chương trình giảng dạy
   */
  private async getCurriculumData(grade: 10 | 11 | 12, topic: string): Promise<any> {
    const chuDe = timChuDeTheoTen(grade, topic);

    if (chuDe) {
      console.log(`[DatabaseService] Found curriculum data for topic ${topic}`);
      return {
        machNoiDung: chuDe.mach_noi_dung,
        mucTieu: chuDe.muc_tieu,
        ketQuaCanDat: chuDe.ket_qua_can_dat,
        hoatDong: chuDe.hoat_dong,
        luyYSuPham: chuDe.luu_y_su_pham
      };
    }

    console.log(`[DatabaseService] No curriculum data found for topic ${topic}`);
    return null;
  }

  /**
   * Lấy context giáo dục chuyên sâu
   */
  private async getEducationalContext(grade: 10 | 11 | 12, topic: string): Promise<EducationalContext> {
    // Mock data - trong thực tế sẽ lấy từ database
    const contexts = {
      10: {
        trongTamPhatTrien: "Phát triển bản thân, thích ứng và khám phá",
        dacDiemTuongLai: "Học sinh đang trong giai đoạn định hình nhận thức, phát triển tư duy phản biện",
        gopYSuPham: "Tập trung vào hoạt động thực hành, trải nghiệm nhóm, khuyến khích tự học và sáng tạo",
        nangLucSo: "Sử dụng công nghệ tìm kiếm thông tin, cộng tác và trình bày",
        daoDucGiaoDuc: "Giáo dục lòng yêu nước, tinh thần trách nhiệm, ý thức công dân",
        kyNangSong: "Kỹ năng giao tiếp, làm việc nhóm, giải quyết vấn đề"
      },
      11: {
        trongTamPhatTrien: "Phát triển tư duy, định hình nghề nghiệp",
        dacDiemTuongLai: "Giai đoạn phát triển tư duy trừu tượng, định hình giá trị cá nhân",
        gopYSuPham: "Tăng cường hoạt động nghiên cứu, dự án, tư duy phản biện",
        nangLucSo: "Phân tích dữ liệu, lập trình cơ bản, thiết kế sáng tạo",
        daoDucGiaoDuc: "Giáo dục lý tưởng sống, trách nhiệm xã hội, đạo đức nghề nghiệp",
        kyNangSong: "Kỹ năng lãnh đạo, quản lý thời gian, ra quyết định"
      },
      12: {
        trongTamPhatTrien: "Hoàn thiện bản thân, sẵn sàng đại học",
        dacDiemTuongLai: "Giai đoạn hoàn thiện nhân cách, chuẩn bị cho bậc học cao hơn",
        gopYSuPham: "Tập trung vào hoạt động nghiên cứu khoa học, dự án thực tế",
        nangLucSo: "Phân tích thống kê, trí tuệ nhân tạo, thiết kế chuyên nghiệp",
        daoDucGiaoDuc: "Giáo dục lý tưởng cách mạng, trách nhiệm xây dựng đất nước",
        kyNangSong: "Kỹ năng tự học, quản lý tài chính, khởi nghiệp"
      }
    };

    return contexts[grade] || contexts[10];
  }

  /**
   * Lấy tài liệu tham khảo
   */
  private async getReferenceMaterials(
    grade: 10 | 11 | 12,
    topic: string,
    chuDeSo?: number
  ): Promise<ReferenceMaterial[]> {
    const materials: ReferenceMaterial[] = [];

    // PPCT reference
    if (chuDeSo) {
      const ppctData = await this.getPPCTData(grade, chuDeSo);
      if (ppctData) {
        materials.push({
          type: 'ppct',
          title: `PPCT - Chủ đề ${chuDeSo}: ${ppctData.ten}`,
          content: `Tổng thời gian: ${ppctData.tong_tiet} tiết\nSHDC: ${ppctData.shdc} tiết\nHĐGD: ${ppctData.hdgd} tiết\nSHL: ${ppctData.shl} tiết`,
          relevance: 0.9
        });
      }
    }

    // Curriculum reference
    const curriculumData = await this.getCurriculumData(grade, topic);
    if (curriculumData) {
      materials.push({
        type: 'curriculum',
        title: `Chương trình khối ${grade} - ${topic}`,
        content: `Mạch nội dung: ${curriculumData.machNoiDung}\nMục tiêu: ${curriculumData.mucTieu?.join('; ')}`,
        relevance: 0.95
      });
    }

    // Add more reference materials as needed
    materials.push({
      type: 'nanglucso',
      title: 'Năng lực số theo Thông tư 02/2025',
      content: 'Các năng lực số cần tích hợp: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2',
      relevance: 0.8
    });

    materials.push({
      type: 'rubric',
      title: 'Rubric đánh giá năng lực',
      content: 'Tiêu chí đánh giá theo 4 mức độ: Chưa đạt, Đạt, Tốt, Xuất sắc',
      relevance: 0.7
    });

    return materials.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Tạo prompt nâng cao với đầy đủ context
   */
  createEnhancedPrompt(
    context: LessonContext,
    oldLessonContent?: string
  ): string {
    // FIXED: Argument order
    const smartPrompt = SmartPromptService.buildFinalSmartPrompt(
      oldLessonContent || "",
      context.smartPrompts
    );

    // Add database context enhancement
    const databaseContext = `
## 5. DATABASE CONTEXT ENHANCEMENT
- PPCT Reference: ${context.ppctData ? `Chủ đề ${context.ppctData.chu_de_so}: ${context.ppctData.ten}` : 'Không có'}
- Curriculum Alignment: ${context.curriculumData ? context.curriculumData.machNoiDung : 'Không có'}
- Educational Focus: ${context.educationalContext.trongTamPhatTrien}
- Reference Materials: ${context.referenceMaterials.length} tài liệu tham khảo

## 6. OLD LESSON INTEGRATION
${oldLessonContent ? `Nội dung giáo án cũ để tham khảo:\n${oldLessonContent.substring(0, 1000)}...\n` : 'Không có giáo án cũ.'}
`;

    return smartPrompt.replace('## 4. QUY CÁCH ĐẦU RA', databaseContext + '\n\n## 6. QUY CÁCH ĐẦU RA');
  }
}

export const databaseIntegrationService = new DatabaseIntegrationService();
