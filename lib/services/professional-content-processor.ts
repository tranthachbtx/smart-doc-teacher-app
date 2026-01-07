/**
 * 🎯 PROFESSIONAL CONTENT PROCESSOR - ARCHITECTURE 19.0
 * Hệ thống tinh lọc và phân tích nội dung chuyên nghiệp
 */

import { ProcessingModule } from "@/lib/store/use-lesson-store";
import { SmartPromptData } from "./smart-prompt-service";
import { QuantumNeuralFusionEngine } from "./quantum-neural-fusion-engine";
import { PedagogicalRelevanceEngine } from "./pedagogical-relevance-engine";
import { TextCleaningService } from "./text-cleaning-service";

export interface ActivityContent {
  khoiDong: {
    mucTieu: string[];
    hoatDong: string[];
    thietBi: string[];
  };
  khamPha: {
    mucTieu: string[];
    kiemThuc: string[];
    hoatDong: string[];
    thietBi: string[];
  };
  luyenTap: {
    mucTieu: string[];
    baiTap: string[];
    hoatDong: string[];
  };
  vanDung: {
    mucTieu: string[];
    duAn: string[];
    hoatDong: string[];
  };
}

export const ACTIVITY_PATTERNS = {
  khoiDong: [
    /khởi động/i, /mở đầu/i, /giới thiệu/i, /đặt vấn đề/i,
    /trò chơi/i, /video/i, /tình huống/i, /khơi gợi/i,
    /warm[-]?up/i, /ice[-]?breaker/i, /mở đầu/i
  ],
  khamPha: [
    /khám phá/i, /hình thành/i, /kiến thức mới/i, /xây dựng/i,
    /thuyết trình/i, /thảo luận/i, /phân tích/i, /nghiên cứu/i,
    /tìm hiểu/i, /khám phá/i, /phát hiện/i
  ],
  luyenTap: [
    /luyện tập/i, /thực hành/i, /bài tập/i, /củng cố/i,
    /làm bài/i, /trắc nghiệm/i, /thực tế/i, /vận dụng/i,
    /thực hiện/i, /rèn luyện/i
  ],
  vanDung: [
    /vận dụng/i, /mở rộng/i, /sáng tạo/i, /dự án/i,
    /thực tế/i, /liên hệ/i, /giải quyết/i, /ứng dụng/i,
    /mở rộng/i, /sáng tạo/i
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
      khoiDong: { mucTieu: [], hoatDong: [], thietBi: [] },
      khamPha: { mucTieu: [], kiemThuc: [], hoatDong: [], thietBi: [] },
      luyenTap: { mucTieu: [], baiTap: [], hoatDong: [] },
      vanDung: { mucTieu: [], duAn: [], hoatDong: [] }
    };

    let currentSection = '';
    let currentActivity = '';

    const cleaner = TextCleaningService.getInstance();
    for (const line of lines) {
      const sanitized = cleaner.clean(line);
      const trimmedLine = sanitized.trim();

      if (!trimmedLine || trimmedLine.length < 5) continue;

      // Phân loại section
      for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
        if (patterns.some(pattern => pattern.test(trimmedLine))) {
          currentSection = section;
          break;
        }
      }

      // Phân loại hoạt động
      for (const [activity, patterns] of Object.entries(ACTIVITY_PATTERNS)) {
        if (patterns.some(pattern => pattern.test(trimmedLine))) {
          currentActivity = activity;
          break;
        }
      }

      // Thêm nội dung vào đúng category
      if (currentActivity && currentSection && trimmedLine.length > 10) {
        const activityKey = currentActivity as keyof ActivityContent;
        if (content[activityKey] &&
          content[activityKey][currentSection as keyof typeof content[typeof activityKey]]) {
          content[activityKey][currentSection as keyof typeof content[typeof activityKey]].push(trimmedLine);
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
      case 'khoiDong':
        optimized.push('## 🎯 MỤC TIÊU KHỞI ĐỘNG');
        optimized.push(...this.extractKeyPoints(content.khoiDong.mucTieu, 3));
        optimized.push('\n## 🎮 HOẠT ĐỘNG KHỞI ĐỘNG');
        optimized.push(...this.extractKeyPoints(content.khoiDong.hoatDong, 2));
        if (content.khoiDong.thietBi.length > 0) {
          optimized.push('\n## 🛠️ THIẾT BỊ');
          optimized.push(...this.extractKeyPoints(content.khoiDong.thietBi, 2));
        }
        break;

      case 'khamPha':
        optimized.push('## 🎯 MỤC TIÊU KHÁM PHÁ');
        optimized.push(...this.extractKeyPoints(content.khamPha.mucTieu, 3));
        optimized.push('\n## 📚 KIẾN THỨC CẦN HÌNH THÀNH');
        optimized.push(...this.extractKeyPoints(content.khamPha.kiemThuc, 4));
        optimized.push('\n## 🔬 HOẠT ĐỘNG KHÁM PHÁ');
        optimized.push(...this.extractKeyPoints(content.khamPha.hoatDong, 3));
        if (content.khamPha.thietBi.length > 0) {
          optimized.push('\n## 🛠️ THIẾT BỊ');
          optimized.push(...this.extractKeyPoints(content.khamPha.thietBi, 2));
        }
        break;

      case 'luyenTap':
        optimized.push('## 🎯 MỤC TIÊU LUYỆN TẬP');
        optimized.push(...this.extractKeyPoints(content.luyenTap.mucTieu, 2));
        optimized.push('\n## 📝 BÀI TẬP LUYỆN TẬP');
        optimized.push(...this.extractKeyPoints(content.luyenTap.baiTap, 3));
        optimized.push('\n## 🛠️ HOẠT ĐỘNG LUYỆN TẬP');
        optimized.push(...this.extractKeyPoints(content.luyenTap.hoatDong, 2));
        break;

      case 'vanDung':
        optimized.push('## 🎯 MỤC TIÊU VẬN DỤNG');
        optimized.push(...this.extractKeyPoints(content.vanDung.mucTieu, 2));
        optimized.push('\n## 🚀 DỰ ÁN VẬN DỤNG');
        optimized.push(...this.extractKeyPoints(content.vanDung.duAn, 3));
        optimized.push('\n## 🌟 HOẠT ĐỘNG VẬN DỤNG');
        optimized.push(...this.extractKeyPoints(content.vanDung.hoatDong, 2));
        break;
    }

    return optimized.join('\n');
  }

  /**
   * Trích xuất ý chính từ nội dung
   */
  private static extractKeyPoints(content: string[], maxPoints: number): string[] {
    const cleaner = TextCleaningService.getInstance();
    return content
      .map(line => cleaner.clean(line))
      .filter(line => line.length > 20)
      .filter(line => !line.match(/^\s*[IVX]+\.|^\s*\d+\.|^\s*[A-Z]\./)) // Loại bỏ số thứ tự
      .map(line => line.replace(/^\s*[-*•]\s*/, '')) // Loại bỏ bullet
      .slice(0, maxPoints)
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
      quantumInsight = `\n## ⚛️ QUANTUM REASONING (v11.0):\n${fusion.quantumReasoning}\n- Confidence: ${(fusion.confidence * 100).toFixed(1)}%\n- Fidelity: ${(fusion.metadata.fidelity * 100).toFixed(1)}%`;
    }

    const basePrompt = `Bạn là SIÊU TRÍ TUỆ SƯ PHẠM. Hãy thiết kế ${this.getActivityTitle(activity)} theo chuẩn 5512.

## 🎯 NỘI DUNG TỐI ƯU CHO ${this.getActivityTitle(activity).toUpperCase()}:
${optimizedContent}

## 📊 KẾT QUẢ PHÂN TÍCH PEDAGOGICAL (RELEVANCE):
${relevance.reasoning}

## 💡 CHỈ DẪN THÔNG MINH TỪ DATABASE:
${this.getSmartDataAdvice(activity, smartData)}
${quantumInsight}

## 🎮 YÊU CẦU ĐẶC THÙ:
${this.getActivityRequirements(activity)}
...

## 📋 ĐỊNH DẠNG ĐẦU RA:
Trả về duy nhất một chuỗi JSON hợp lệ với cấu trúc:
{
  "module_title": "${this.getActivityTitle(activity)} - [Tên hoạt động sáng tạo]",
  "duration": "${this.getActivityDuration(activity)}",
  "summary_for_next_step": "Tóm tắt ngắn gọn (2-3 câu) nội dung hoạt động này để làm ngữ cảnh cho bước sau.",
  "steps": [
    {
      "step_type": "transfer" | "perform" | "report" | "conclude", 
      "teacher_action": "Nội dung cột GV (Markdown). Chú ý Escape dấu ngoặc kép: \\"Lời thoại\\"",
      "student_action": "Nội dung cột HS"
    }
  ]
}

⚠️ LƯU Ý KỸ THUẬT:
1. **Valid JSON**: Không được thiếu dấu phẩy, không thừa dấu phẩy cuối mảng.
2. **Escape Characters**: Dấu ngoặc kép (") phải viết là \\", dấu gạch chéo (\\) phải viết là \\\\
3. **Markdown**: Có thể dùng in đậm (**text**), xuống dòng (\\n).
4. **2 Columns**: Phân tách rõ nội dung GV và HS.
5. **5512 Compliance**: Tuân thủ chuẩn giáo án Công văn 5512.`;

    return basePrompt;
  }

  /**
   * Lấy tiêu đề hoạt động
   */
  private static getActivityTitle(activity: string): string {
    const titles = {
      khoiDong: 'HOẠT ĐỘNG 1: KHỞI ĐỘNG',
      khamPha: 'HOẠT ĐỘNG 2: KHÁM PHÁ',
      luyenTap: 'HOẠT ĐỘNG 3: LUYỆN TẬP',
      vanDung: 'HOẠT ĐỘNG 4: VẬN DỤNG'
    };
    return titles[activity as keyof typeof titles] || activity;
  }

  /**
   * Lấy thời lượng hoạt động
   */
  private static getActivityDuration(activity: string): string {
    const durations = {
      khoiDong: '5-7 phút',
      khamPha: '15-20 phút',
      luyenTap: '10-15 phút',
      vanDung: '5-10 phút'
    };
    return durations[activity as keyof typeof durations] || '10 phút';
  }

  /**
   * Lấy yêu cầu đặc thù cho hoạt động
   */
  private static getActivityRequirements(activity: string): string {
    const requirements = {
      khoiDong: `- Tạo tâm thế hứng thú, kích thích tò mò
- Dùng trò chơi/tình huống mở đầu gần gũi
- Kết nối với chủ đề "Bảo vệ thế giới tự nhiên"
- Thiết kế tương tác cao, tất cả HS tham gia`,

      khamPha: `- Hình thành kiến thức mới về bảo vệ thế giới tự nhiên
- Thiết kế chuỗi hoạt động chuyển giao nhiệm vụ rõ ràng
- Tích hợp công cụ số (TT 02/2025)
- Sử dụng phương pháp dạy học tích cực`,

      luyenTap: `- Củng cố kiến thức đã học
- Thiết kế hệ thống bài tập đa dạng
- Tích hợp công cụ đánh giá nhanh
- Giao tiếp và hợp tác nhóm`,

      vanDung: `- Giải quyết vấn đề thực tiễn
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
      khoiDong: `- **Tâm lý lứa tuổi**: ${smartData.studentCharacteristics}
- **Chiến lược**: Hãy dùng đặc điểm tâm lý trên để thiết kế một trò chơi/tình huống mở đầu cực cuốn hút.`,

      khamPha: `- **Nhiệm vụ TRỌNG TÂM (SGK)**: 
${smartData.coreTasks}
- **Công cụ số (NLS)**: 
${smartData.digitalCompetency}
- **Chiến lược**: Hãy chuyển hóa các nhiệm vụ trọng tâm trên thành chuỗi hoạt động khám phá cụ thể.`,

      luyenTap: `- **Mục tiêu cần đạt**: ${smartData.objectives}
- **Công cụ đánh giá**: ${smartData.assessmentTools}
- **Chiến lược**: Thiết kế hệ thống bài tập để củng cố các mục tiêu trên.`,

      vanDung: `- **Lưu ý thực tiễn**: ${smartData.pedagogicalNotes}
- **Chiến lược**: Đưa ra bài toán thực tế/Dự án nhỏ kết nối với lưu ý trên.`
    };

    return advice[activity as keyof typeof advice] || '';
  }
}
