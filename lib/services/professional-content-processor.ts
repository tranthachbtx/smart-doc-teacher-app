/**
 * 🎯 PROFESSIONAL CONTENT PROCESSOR - ARCHITECTURE 19.0
 * Hệ thống tinh lọc và phân tích nội dung chuyên nghiệp
 */

import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";
import { QuantumNeuralFusionEngine } from "./quantum-neural-fusion-engine";
import { PedagogicalRelevanceEngine } from "./pedagogical-relevance-engine";
import { TextCleaningService } from "./text-cleaning-service";

export interface ActivityContent {
  khoi_dong: {
    mucTieu: string[];
    hoatDong: string[];
    thietBi: string[];
  };
  kham_pha: {
    mucTieu: string[];
    kiemThuc: string[];
    hoatDong: string[];
    thietBi: string[];
  };
  luyen_tap: {
    mucTieu: string[];
    baiTap: string[];
    hoatDong: string[];
  };
  van_dung: {
    mucTieu: string[];
    duAn: string[];
    hoatDong: string[];
  };
}

export const ACTIVITY_PATTERNS = {
  khoi_dong: [
    /hoạt động 1/i, /khởi động/i, /mở đầu/i, /giới thiệu/i, /đặt vấn đề/i,
    /trò chơi/i, /vấn đề/i, /khơi gợi/i, /warm[-]?up/i, /ice[-]?breaker/i
  ],
  kham_pha: [
    /hoạt động 2/i, /khám phá/i, /hình thành/i, /kiến thức mới/i, /xây dựng/i,
    /thuyết trình/i, /thảo luận/i, /phân tích/i, /nghiên cứu/i, /tìm hiểu/i
  ],
  luyen_tap: [
    /hoạt động 3/i, /luyện tập/i, /thực hành/i, /bài tập/i, /củng cố/i,
    /làm bài/i, /trắc nghiệm/i, /rèn luyện/i
  ],
  van_dung: [
    /hoạt động 4/i, /vận dụng/i, /mở rộng/i, /sáng tạo/i, /dự án/i,
    /thực tế/i, /liên hệ/i, /giải quyết/i, /ứng dụng/i
  ]
};

export const SECTION_PATTERNS = {
  mucTieu: [
    /MỤC TIÊU/i, /KIẾN THỨC/i, /NĂNG LỰC/i, /PHẨM CHẤT/i,
    /YÊU CẦU CẦN ĐẠT/i, /SAU BÀI HỌC NÀY/i
  ],
  thietBi: [
    /THIẾT BỊ/i, /CHUẨN BỊ/i, /HỌC LIỆU/i, /ĐỐI VỚI/i,
    /GV|GIÁO VIÊN/i, /HS|HỌC SINH/i
  ],
  hoatDong: [
    /HOẠT ĐỘNG/i, /GỢI Ý/i, /NỘI DUNG/i, /TỔ CHỨC/i,
    /THỰC HIỆN/i, /THỰC HÀNH/i
  ],
  kiemThuc: [
    /KIẾN THỨC/i, /NỘI DUNG/i, /CHỦ ĐỀ/i, /BÀI HỌC/i
  ],
  baiTap: [
    /BÀI TẬP/i, /THỰC HÀNH/i, /LUYỆN TẬP/i, /CỦNG CỐ/i
  ],
  duAn: [
    /DỰ ÁN/i, /VẬN DỤNG/i, /THỰC TIỄN/i, /LIÊN HỆ/i
  ]
};

export class ProfessionalContentProcessor {
  /**
   * Trích xuất và phân loại nội dung theo hoạt động
   */
  static extractActivityContent(rawContent: string): ActivityContent {
    const lines = rawContent.split('\n');
    const content: ActivityContent = {
      khoi_dong: { mucTieu: [], hoatDong: [], thietBi: [] },
      kham_pha: { mucTieu: [], kiemThuc: [], hoatDong: [], thietBi: [] },
      luyen_tap: { mucTieu: [], baiTap: [], hoatDong: [] },
      van_dung: { mucTieu: [], duAn: [], hoatDong: [] }
    };

    let currentSection = '';
    let currentActivity = '';

    const cleaner = TextCleaningService.getInstance();

    for (const line of lines) {
      const sanitized = cleaner.clean(line);
      const trimmedLine = sanitized.trim();

      if (!trimmedLine || trimmedLine.length < 5) continue;

      // Check for strong activity headers first (Isolation Guard)
      let foundNewActivity = false;
      for (const [activity, patterns] of Object.entries(ACTIVITY_PATTERNS)) {
        // IMPROVED HEADER DETECTION: Start of line matches "Hoạt động X" or strong markers
        const isStrongHeader = patterns.slice(0, 2).some(p => p.test(trimmedLine)) && trimmedLine.length < 60;

        if (isStrongHeader) {
          currentActivity = activity;
          currentSection = ''; // Reset section when moving to new activity
          foundNewActivity = true;
          break;
        }
      }

      // If not a new activity, check for section markers
      if (!foundNewActivity) {
        for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
          if (patterns.some(pattern => pattern.test(trimmedLine)) && trimmedLine.length < 100) {
            currentSection = section;
            break;
          }
        }
      }

      // Add content only if we are inside a tracked activity/section pair
      if (currentActivity && currentSection) {
        const activityKey = currentActivity as keyof ActivityContent;
        const sectionKey = currentSection as keyof typeof content.khoi_dong;

        // Prevent duplication: skip if this line is just a marker we've already matched
        const isMarker = Object.values(SECTION_PATTERNS).flat().some(p => p.test(trimmedLine)) ||
          Object.values(ACTIVITY_PATTERNS).flat().some(p => p.test(trimmedLine));

        if (!isMarker && trimmedLine.length > 3) {
          if (content[activityKey] && (content[activityKey] as any)[sectionKey]) {
            // Intelligent deduplication and line merging
            if (!(content[activityKey] as any)[sectionKey].includes(trimmedLine)) {
              (content[activityKey] as any)[sectionKey].push(trimmedLine);
            }
          }
        }
      }
    }

    return content;
  }

  /**
   * Tối ưu nội dung cho từng hoạt động
   */
  static optimizeForActivity(activity: string, content: ActivityContent): string {
    const optimized = [];

    switch (activity) {
      case 'khoi_dong':
        optimized.push('## 🎯 MỤC TIÊU KHỞI ĐỘNG');
        optimized.push(...this.extractKeyPoints(content.khoi_dong.mucTieu, 3));
        optimized.push('\n## 🎮 HOẠT ĐỘNG KHỞI ĐỘNG');
        optimized.push(...this.extractKeyPoints(content.khoi_dong.hoatDong, 2));
        if (content.khoi_dong.thietBi.length > 0) {
          optimized.push('\n## 🛠️ THIẾT BỊ');
          optimized.push(...this.extractKeyPoints(content.khoi_dong.thietBi, 2));
        }
        break;

      case 'kham_pha':
        optimized.push('## 🎯 MỤC TIÊU KHÁM PHÁ');
        optimized.push(...this.extractKeyPoints(content.kham_pha.mucTieu, 3));
        optimized.push('\n## 📚 KIẾN THỨC CẦN HÌNH THÀNH');
        optimized.push(...this.extractKeyPoints(content.kham_pha.kiemThuc, 4));
        optimized.push('\n## 🔬 HOẠT ĐỘNG KHÁM PHÁ');
        optimized.push(...this.extractKeyPoints(content.kham_pha.hoatDong, 3));
        if (content.kham_pha.thietBi.length > 0) {
          optimized.push('\n## 🛠️ THIẾT BỊ');
          optimized.push(...this.extractKeyPoints(content.kham_pha.thietBi, 2));
        }
        break;

      case 'luyen_tap':
        optimized.push('## 🎯 MỤC TIÊU LUYỆN TẬP');
        optimized.push(...this.extractKeyPoints(content.luyen_tap.mucTieu, 2));
        optimized.push('\n## 📝 BÀI TẬP LUYỆN TẬP');
        optimized.push(...this.extractKeyPoints(content.luyen_tap.baiTap, 3));
        optimized.push('\n## 🛠️ HOẠT ĐỘNG LUYỆN TẬP');
        optimized.push(...this.extractKeyPoints(content.luyen_tap.hoatDong, 2));
        break;

      case 'van_dung':
        optimized.push('## 🎯 MỤC TIÊU VẬN DỤNG');
        optimized.push(...this.extractKeyPoints(content.van_dung.mucTieu, 2));
        optimized.push('\n## 🚀 DỰ ÁN VẬN DỤNG');
        optimized.push(...this.extractKeyPoints(content.van_dung.duAn, 3));
        optimized.push('\n## 🌟 HOẠT ĐỘNG VẬN DỤNG');
        optimized.push(...this.extractKeyPoints(content.van_dung.hoatDong, 2));
        break;
    }

    return optimized.join('\n');
  }

  /**
   * Trích xuất ý chính từ nội dung
   */
  private static extractKeyPoints(content: string[], maxPoints: number): string[] {
    const cleaner = TextCleaningService.getInstance();
    // INCREASED DENSITY: Allow more points and more text if available to support 30-50 page goal
    return content
      .map(line => cleaner.clean(line))
      .filter(line => line.length > 15)
      .filter(line => !line.match(/^\s*[IVX]+\$|^\s*\d+\$|^\s*[A-Z]\$/)) // Slightly less restrictive numbering filter
      .map(line => line.replace(/^\s*[-*•]\s*/, '')) // Loại bỏ bullet
      .slice(0, Math.max(maxPoints, 8)) // Increased from maxPoints to support more detail
      .map(line => `• ${line}`);
  }

  /**
   * Tạo prompt tối ưu cho từng hoạt động sử dụng Quantum Neural Fusion
   */
  static async generateOptimizedPrompt(
    activity: string,
    optimizedContent: string,
    smartData?: SmartPromptData,
    currentPlan?: any
  ): Promise<string> {
    const fusionEngine = QuantumNeuralFusionEngine.getInstance();
    const relevanceEngine = PedagogicalRelevanceEngine.getInstance();

    // 1. Phân tích độ liên quan chuyên sâu MoET 5512
    const relevance = await relevanceEngine.calculateRelevanceScore(optimizedContent);

    // 2. Logic Quantum Reasoning
    let quantumInsight = "";
    if (currentPlan) {
      const fusion = await fusionEngine.quantumNeuralFusion(currentPlan, optimizedContent);
      quantumInsight = `\n## ⚛️ QUANTUM NEURAL REASONING (v23.0):\n${fusion.quantumReasoning}\n- Confidence: ${(fusion.confidence * 100).toFixed(1)}%\n- Fidelity: ${(fusion.metadata.fidelity * 100).toFixed(1)}%`;
    }

    const activityTitle = this.getActivityTitle(activity).toUpperCase();
    const basePrompt = `Bạn là SIÊU TRÍ TUỆ SƯ PHẠM & KIẾN TRÚC SƯ GIÁO DỤC CAO CẤP. 
Nhiệm vụ: Thiết kế ${activityTitle} theo triết lý "GIÁO ÁN LÀ LA BÀN" (Compass-Style Lesson Plan) chuẩn Công văn 5512.

## 🏮 TRIẾT LÝ THIẾT KẾ (COMPASS PHILOSOPHY):
- **Không kịch bản hóa**: Tránh sa đà vào lời thoại "GV nói - HS thưa" vụn vặt.
- **Tập trung định hướng**: Diễn giải chi tiết các "Nút thắt sư phạm", chiến lược tổ chức, cách thức xử lý tình huống và mạch kiến thức chuyên sâu.
- **Độ dày tri thức**: Để giáo án đạt 30-50 trang, bạn PHẢI đào sâu vào nội dung chuyên môn, các bước hướng dẫn tư duy và hệ thống câu hỏi gợi mở mang tính chiến lược.

## 🎯 DỮ LIỆU ĐÃ TỐI ƯU TỪ HỆ THỐNG:
${optimizedContent}

## 📊 PHÂN TÍCH PEDAGOGICAL (RELEVANCE):
${relevance.reasoning}

## 💡 HỆ THỐNG TRÍ THỨC (DATABASE CHIẾN LƯỢC):
${this.getSmartDataAdvice(activity, smartData)}
${quantumInsight}

## 🎮 YÊU CẦU NÂNG CAO (CRITICAL DIRECTIVES):
1. **Phân tích sâu nhiệm vụ**: Thay vì viết "GV giao nhiệm vụ", hãy diễn giải rõ: Nhiệm vụ đó là gì? Tại sao giao nhiệm vụ đó? HS sẽ gặp khó khăn gì và GV định hướng ra sao? (Viết thật dài phần này).
2. **Kỹ thuật sư phạm La bàn**: Sử dụng các phương pháp: ${activity === 'khoi_dong' ? 'Gamification/Kích hoạt tư duy' : activity === 'kham_pha' ? 'Nội soi kiến thức/Thảo luận đa chiều' : 'Ứng dụng thực tiễn/Tối ưu hóa năng lực'}.
3. **Mạch logic 5512**: Diễn giải cực kỳ chi tiết 4 bước: 
   - *Chuyển giao*: GV sử dụng học liệu gì? Cách đặt vấn đề mang tính chiến lược.
   - *Thực hiện*: HS cá nhân/nhóm làm gì? GV quan sát và hỗ trợ những "điểm nghẽn" nào? 
   - *Báo cáo*: Cách thức tổ chức trình bày và tranh biện.
   - *Kết luận*: Chốt kiến thức then chốt và mở rộng tầm nhìn cho HS.

## 📋 ĐỊNH DẠNG ĐẦU RA (JSON):
Trả về duy nhất JSON:
{
  "module_title": "${this.getActivityTitle(activity)} - [Tên hoạt động sáng tạo]",
  "duration": "${this.getActivityDuration(activity)}",
  "summary_for_next_step": "Tóm tắt chiến lược (5-6 câu) về mạch logic của hoạt động này.",
  "steps": [
    {
      "step_type": "transfer" | "perform" | "report" | "conclude", 
      "teacher_action": "Nội dung cột GV (Markdown). Viết chi tiết các chiến lược tổ chức và chỉ dẫn sư phạm chuyên sâu.",
      "student_action": "Nội dung cột HS. Mô tả kỹ các sản phẩm, cách thức tư duy và kết quả đầu ra của học sinh."
    }
  ]
}

⚠️ LƯU Ý: Tuyệt đối không viết lời thoại sáo rỗng. Hãy viết những hướng dẫn sư phạm "đắt giá" và giàu hàm lượng tri thức.`;

    return basePrompt;
  }

  /**
   * Lấy tiêu đề hoạt động
   */
  private static getActivityTitle(activity: string): string {
    const titles = {
      khoi_dong: 'HOẠT ĐỘNG 1: KHỞI ĐỘNG',
      kham_pha: 'HOẠT ĐỘNG 2: KHÁM PHÁ',
      luyen_tap: 'HOẠT ĐỘNG 3: LUYỆN TẬP',
      van_dung: 'HOẠT ĐỘNG 4: VẬN DỤNG'
    };
    return titles[activity as keyof typeof titles] || activity;
  }

  /**
   * Lấy thời lượng hoạt động
   */
  private static getActivityDuration(activity: string): string {
    const durations = {
      khoi_dong: '5-7 phút',
      kham_pha: '15-20 phút',
      luyen_tap: '10-15 phút',
      van_dung: '5-10 phút'
    };
    return durations[activity as keyof typeof durations] || '10 phút';
  }

  /**
   * Lấy yêu cầu đặc thù cho hoạt động
   */
  private static getActivityRequirements(activity: string): string {
    const requirements = {
      khoi_dong: `- Tạo tâm thế hứng thú, kích thích tò mò
- Dùng trò chơi/tình huống mở đầu gần gũi
- Kết nối với chủ đề "Bảo vệ thế giới tự nhiên"
- Thiết kế tương tác cao, tất cả HS tham gia`,

      kham_pha: `- Hình thành kiến thức mới về bảo vệ thế giới tự nhiên
- Thiết kế chuỗi hoạt động chuyển giao nhiệm vụ rõ ràng
- Tích hợp công cụ số (TT 02/2025)
- Sử dụng phương pháp dạy học tích cực`,

      luyen_tap: `- Củng cố kiến thức đã học
- Thiết kế hệ thống bài tập đa dạng
- Tích hợp công cụ đánh giá nhanh
- Giao tiếp và hợp tác nhóm`,

      van_dung: `- Giải quyết vấn đề thực tiễn
- Thiết kế dự án nhỏ liên hệ thực tế
- Tích hợp AI và công nghệ số
- Lan tỏa giá trị bảo vệ môi trường`
    };
    return requirements[activity as keyof typeof requirements] || '';
  }

  /**
   * Lấy gợi ý từ smart data
   */
  private static getSmartDataAdvice(activity: string, smartData?: SmartPromptData): string {
    if (!smartData) return 'Không có dữ liệu chuyên môn.';

    const advice = {
      khoi_dong: `- **Tâm lý lứa tuổi**: ${smartData.studentCharacteristics}
- **Nghiệm vụ cốt lõi**: ${smartData.coreMissions.khoiDong}
- **Chiến lược**: Hãy dùng đặc điểm tâm lý trên để thiết kế một trò chơi/tình huống mở đầu cực cuốn hút.`,

      kham_pha: `- **Nhiệm vụ TRỌNG TÂM (SGK)**: 
${smartData.coreMissions.khamPha}
- **Công cụ số (NLS)**: 
${smartData.digitalCompetency}
- **Chiến lược**: Hãy chuyển hóa các nhiệm vụ trọng tâm trên thành chuỗi hoạt động khám phá cụ thể. KHÔNG sáng tạo xa rời nhiệm vụ này.`,

      luyen_tap: `- **Mục tiêu cần đạt**: ${smartData.objectives}
- **Nhiệm vụ rèn luyện**: ${smartData.coreMissions.luyenTap}
- **Công cụ đánh giá**: ${smartData.assessmentTools}
- **Chiến lược**: Thiết kế hệ thống bài tập để củng cố các mục tiêu trên.`,

      van_dung: `- **Lưu ý thực tiễn**: ${smartData.pedagogicalNotes}
- **Nhiệm vụ thực tế**: ${smartData.coreMissions.vanDung}
- **Chiến lược**: Đưa ra bài toán thực tế/Dự án nhỏ kết nối với lưu ý trên.`
    };

    return advice[activity as keyof typeof advice] || '';
  }
}
