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
  shdc?: string[];
  shl?: string[];
  learningAssets: string[];
  legacyMappingNotes: string[];
  semanticTags: {
    instructions: string[];
    studentTasks: string[];
    knowledgeCores: string[];
  };
}

export const ASSET_PATTERNS = [
  /(?:Phiếu học tập|PHT|Giấy A4|Tranh ảnh|Video|Clip|Phim|PowerPoint|PPT|Sơ đồ tư duy|Mindmap|Bản đồ|Mô hình)/gi
];

export const LEGACY_PATTERNS = [
  { pattern: /Củng cố|Dặn dò|Kiểm tra bài cũ|Nhận xét|Đánh giá tiết học/i, note: "Dữ liệu kết thúc bài học truyền thống cần chuyển hóa sang Luyện tập/Vận dụng." },
  { pattern: /Kiểm tra miệng|Khởi động tiết học/i, note: "Dữ liệu kiểm tra đầu giờ cần chuyển hóa sang hoạt động Khởi động/Mở đầu." }
];

export const ACTIVITY_PATTERNS = {
  khoi_dong: [
    /hoạt động 1/i, /khởi động/i, /mở đầu/i, /giới thiệu/i, /đặt vấn đề/i,
    /trò chơi/i, /vấn đề/i, /khơi gợi/i, /warm[-]?up/i, /ice[-]?breaker/i,
    /A\. HOẠT ĐỘNG/i, /PHẦN MỞ ĐẦU/i
  ],
  kham_pha: [
    /hoạt động 2/i, /khám phá/i, /hình thành/i, /kiến thức mới/i, /xây dựng/i,
    /thuyết trình/i, /thảo luận/i, /phân tích/i, /nghiên cứu/i, /tìm hiểu/i,
    /B\. HOẠT ĐỘNG/i, /HÌNH THÀNH/i, /KIẾN THỨC/i
  ],
  luyen_tap: [
    /hoạt động 3/i, /luyện tập/i, /thực hành/i, /bài tập/i, /củng cố/i,
    /làm bài/i, /trắc nghiệm/i, /rèn luyện/i,
    /C\. HOẠT ĐỘNG/i, /BÀI TẬP/i
  ],
  van_dung: [
    /hoạt động 4/i, /vận dụng/i, /mở rộng/i, /sáng tạo/i, /dự án/i,
    /thực tế/i, /liên hệ/i, /giải quyết/i, /ứng dụng/i,
    /D\. HOẠT ĐỘNG/i, /TỔ CHỨC THỰC HIỆN/i
  ]
};

export const SECTION_PATTERNS = {
  mucTieu: [
    /MỤC TIÊU/i, /KIẾN THỨC/i, /NĂNG LỰC/i, /PHẨM CHẤT/i,
    /YÊU CẦU CẦN ĐẠT/i, /SAU BÀI HỌC/i, /^a\.\s*Mục tiêu/i
  ],
  thietBi: [
    /THIẾT BỊ/i, /CHUẨN BỊ/i, /HỌC LIỆU/i, /ĐỐI VỚI/i,
    /GV|GIÁO VIÊN/i, /HS|HỌC SINH/i
  ],
  hoatDong: [
    /HOẠT ĐỘNG/i, /GỢI Ý/i, /NỘI DUNG/i, /TỔ CHỨC/i,
    /THỰC HIỆN/i, /THỰC HÀNH/i, /^d\.\s*Tổ chức/i, /^b\.\s*Nội dung/i, /^c\.\s*Sản phẩm/i
  ],
  kiemThuc: [
    /KIẾN THỨC/i, /NỘI DUNG/i, /CHỦ ĐỀ/i, /BÀI HỌC/i, /TRỌNG TÂM/i
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
      van_dung: { mucTieu: [], duAn: [], hoatDong: [] },
      shdc: [],
      shl: [],
      learningAssets: [],
      legacyMappingNotes: [],
      semanticTags: { instructions: [], studentTasks: [], knowledgeCores: [] }
    };

    let currentSection = '';
    let currentActivity = '';

    const cleaner = TextCleaningService.getInstance();

    // PHASE 0: Pre-scan for common Grade/Topic headers to extract universal objectives
    const universalObjectives: string[] = [];
    for (const line of lines.slice(0, 50)) {
      if (line.includes('KIẾN THỨC') || line.includes('YÊU CẦU CẦN ĐẠT')) {
        universalObjectives.push(line);
      }
    }

    for (const line of lines) {
      const sanitized = cleaner.clean(line);
      const trimmedLine = sanitized.trim();

      if (!trimmedLine || trimmedLine.length < 5) continue;

      // --- DEEP SEMANTIC TAGGING ---
      const semanticType = this.categorizeSemanticLine(trimmedLine);
      if (semanticType === 'instruction') content.semanticTags.instructions.push(trimmedLine);
      else if (semanticType === 'task') content.semanticTags.studentTasks.push(trimmedLine);
      else if (semanticType === 'knowledge') content.semanticTags.knowledgeCores.push(trimmedLine);

      // --- ASSET & LEGACY EXTRACTION ---
      ASSET_PATTERNS.forEach(regex => {
        const matches = trimmedLine.match(regex);
        if (matches) {
          matches.forEach(m => {
            if (!content.learningAssets.includes(m)) content.learningAssets.push(m);
          });
        }
      });

      LEGACY_PATTERNS.forEach(lp => {
        if (lp.pattern.test(trimmedLine)) {
          const note = `[Lưu ý Sư phạm]: Dòng "${trimmedLine}" thuộc nhóm: ${lp.note}`;
          if (!content.legacyMappingNotes.includes(note)) content.legacyMappingNotes.push(note);
        }
      });

      // --- DETECTION: HĐTN Phase ---
      // PHASE 1: HĐTN Phase Detection (SHDC, SHL, HĐGD)
      if (/(Sinh hoạt dưới cờ|SHDC)/i.test(trimmedLine) && trimmedLine.length < 50) {
        currentActivity = 'shdc';
        currentSection = 'general';
        continue;
      }
      if (/(Sinh hoạt lớp|SHL)/i.test(trimmedLine) && trimmedLine.length < 50) {
        currentActivity = 'shl';
        currentSection = 'general';
        continue;
      }

      // Check for phase transitions (A, B, C, D headers)
      if (/^[A-D]\.\s*HOẠT ĐỘNG/i.test(trimmedLine) || /THÀNH KIẾN THỨC/i.test(trimmedLine) || /LUYỆN TẬP/i.test(trimmedLine) || /VẬN DỤNG/i.test(trimmedLine)) {
        if (/A\.|MỞ ĐẦU/i.test(trimmedLine)) currentActivity = 'khoi_dong';
        else if (/B\.|THÀNH KIẾN THỨC/i.test(trimmedLine)) currentActivity = 'kham_pha';
        else if (/C\.|LUYỆN TẬP|BÀI TẬP/i.test(trimmedLine)) currentActivity = 'luyen_tap';
        else if (/D\.|VẬN DỤNG/i.test(trimmedLine)) currentActivity = 'van_dung';
        currentSection = '';
        continue;
      }

      // Check for strong activity headers (Isolation Guard)
      let foundNewActivity = false;
      for (const [activity, patterns] of Object.entries(ACTIVITY_PATTERNS)) {
        // High-precision detection for numbered activities within a phase
        const isNumberedActivity = /^(Hoạt động|HĐ)\s*\d+[:.]/i.test(trimmedLine) || /^\d+\.\s*[A-Z]/.test(trimmedLine);

        if (isNumberedActivity && patterns.slice(1, 4).some(p => p.test(trimmedLine))) {
          currentActivity = activity;
          currentSection = '';
          foundNewActivity = true;
          break;
        }
      }

      // Section markers within an activity (Mục tiêu, Nội dung, etc.)
      for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
        if (patterns.some(pattern => pattern.test(trimmedLine)) && trimmedLine.length < 120) {
          currentSection = section;
          foundNewActivity = true; // Treating section change like a small transition
          break;
        }
      }

      // Content Accumulation
      if (currentActivity === 'shdc' || currentActivity === 'shl') {
        if (!Object.values(SECTION_PATTERNS).flat().some(p => p.test(trimmedLine))) {
          content[currentActivity]?.push(trimmedLine);
        }
        continue;
      }

      if (currentActivity && currentSection) {
        const activityKey = currentActivity as keyof ActivityContent;
        const sectionKey = currentSection as keyof typeof content.khoi_dong;

        // Intelligent filter to avoid adding headers as content
        const isHeader = Object.values(SECTION_PATTERNS).flat().some(p => p.test(trimmedLine)) ||
          Object.values(ACTIVITY_PATTERNS).flat().some(p => p.test(trimmedLine));

        if (!isHeader && trimmedLine.length > 5) {
          if (content[activityKey] && (content[activityKey] as any)[sectionKey]) {
            if (!(content[activityKey] as any)[sectionKey].includes(trimmedLine) && !trimmedLine.includes('--- Page')) {
              (content[activityKey] as any)[sectionKey].push(trimmedLine);
            }
          }
        }
      }
    }

    // HEALING: If any activity is completely empty, inject universal objectives as context
    const mainActivities = ['khoi_dong', 'kham_pha', 'luyen_tap', 'van_dung'] as const;
    mainActivities.forEach(act => {
      const data = content[act];
      if (data.mucTieu.length === 0 && universalObjectives.length > 0) {
        data.mucTieu = universalObjectives.slice(0, 5);
      }
    });

    return content;
  }

  /**
   * Tối ưu nội dung cho từng hoạt động
   */
  static optimizeForActivity(activity: string, content: ActivityContent): string {
    const optimized: string[] = [];

    // Handle HĐTN specific phases
    if (activity === 'shdc' || activity === 'shl') {
      const data = content[activity as 'shdc' | 'shl'];
      if (data && data.length > 0) {
        optimized.push(`## 🏛️ ${activity.toUpperCase()} (DỮ LIỆU TỪ PDF)`);
        optimized.push(...data.slice(0, 15));
        return optimized.join('\n');
      }
    }

    const actKey = activity as 'khoi_dong' | 'kham_pha' | 'luyen_tap' | 'van_dung';
    const actData = content[actKey];

    if (!actData || Array.isArray(actData)) {
      return "*(Hệ thống không tìm thấy nội dung cụ thể cho hoạt động này.)*";
    }

    // Helper to add section if content exists
    const addSection = (title: string, data: string[], limit: number = 8) => {
      const points = this.extractKeyPoints(data, limit);
      if (points.length > 0) {
        optimized.push(title);
        optimized.push(...points);
        optimized.push('');
      }
    };

    switch (activity) {
      case 'khoi_dong':
        addSection('## 🎯 MỤC TIÊU KHỞI ĐỘNG', actData.mucTieu);
        addSection('\n## 🎮 HOẠT ĐỘNG KHỞI ĐỘNG (DỰA TRÊN PDF)', actData.hoatDong);
        if ('thietBi' in actData && Array.isArray(actData.thietBi)) {
          addSection('\n## 🛠️ THIẾT BỊ', actData.thietBi);
        }
        break;

      case 'kham_pha':
        addSection('## 🎯 MỤC TIÊU KHÁM PHÁ', actData.mucTieu);
        if ('kiemThuc' in actData && Array.isArray(actData.kiemThuc)) {
          addSection('\n## 📚 KIẾN THỨC CẦN HÌNH THÀNH', actData.kiemThuc);
        }
        addSection('\n## 🔬 HOẠT ĐỘNG KHÁM PHÁ (DỰA TRÊN PDF)', actData.hoatDong);
        if ('thietBi' in actData && Array.isArray(actData.thietBi)) {
          addSection('\n## 🛠️ THIẾT BỊ', actData.thietBi);
        }
        break;

      case 'luyen_tap':
        addSection('## 🎯 MỤC TIÊU LUYỆN TẬP', actData.mucTieu);
        if ('baiTap' in actData && Array.isArray(actData.baiTap)) {
          addSection('\n## 📝 BÀI TẬP LUYỆN TẬP', actData.baiTap);
        }
        addSection('\n## 🛠️ HOẠT ĐỘNG LUYỆN TẬP (DỰA TRÊN PDF)', actData.hoatDong);
        break;

      case 'van_dung':
        addSection('## 🎯 MỤC TIÊU VẬN DỤNG', actData.mucTieu);
        if ('duAn' in actData && Array.isArray(actData.duAn)) {
          addSection('\n## 🚀 DỰ ÁN VẬN DỤNG', actData.duAn);
        }
        addSection('\n## 🌟 HOẠT ĐỘNG VẬN DỤNG (DỰA TRÊN PDF)', actData.hoatDong);
        break;
    }

    // Add Learning Assets & Legacy Mapping context if available
    if (content.learningAssets.length > 0 || content.legacyMappingNotes.length > 0) {
      optimized.push('## 📑 PHÂN TÍCH TÀI LIỆU GỐC (ASSETS & LEGACY)');
      if (content.learningAssets.length > 0) {
        optimized.push(`- Học liệu được nhận diện: ${content.learningAssets.join(', ')}`);
      }
      if (content.legacyMappingNotes.length > 0) {
        optimized.push(...content.legacyMappingNotes.map(n => `- ${n}`));
      }
      optimized.push('');
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
      .filter(line => line.length > 5)
      .filter(line => !line.match(/^Page\s+\d+/i)) // Remove PDF page markers
      .map(line => line.replace(/^\s*[-*•|]\s*/, '')) // Loại bỏ bullet và marker |
      .slice(0, Math.max(maxPoints, 15)) // Tăng lượng điểm trích xuất để giàu nội dung hơn
      .map(line => `• ${line}`);
  }

  /**
   * Helper: Phân loại bản chất sư phạm của dòng văn bản
   */
  private static categorizeSemanticLine(line: string): 'instruction' | 'task' | 'knowledge' | 'unknown' {
    if (/(yêu cầu|hướng dẫn|giúp|hỗ trợ|điều phối|tổ chức|mời|quan sát|lưu ý)/i.test(line)) return 'instruction';
    if (/(thực hiện|làm|viết|vẽ|trình bày|báo cáo|thảo luận|trả lời|hoàn thành|sản phẩm)/i.test(line)) return 'task';
    if (/(khái niệm|định nghĩa|quy tắc|nguyên tắc|kiến thức|nội dung chính|chốt)/i.test(line)) return 'knowledge';
    return 'unknown';
  }

  /**
   * Tạo prompt tối ưu cho từng hoạt động sử dụng Quantum Neural Fusion
   */
  static async generateOptimizedPrompt(
    activity: string,
    optimizedContent: string,
    smartData?: SmartPromptData,
    currentPlan?: any,
    skipNeural: boolean = false,
    semanticContext?: any
  ): Promise<string> {
    const fusionEngine = QuantumNeuralFusionEngine.getInstance();
    const relevanceEngine = PedagogicalRelevanceEngine.getInstance();

    // 1. Phân tích độ liên quan chuyên sâu MoET 5512 (Optional Neural Pass)
    const relevance = skipNeural
      ? await relevanceEngine.calculateBasicScore(optimizedContent)
      : await relevanceEngine.calculateRelevanceScore(optimizedContent);

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

${semanticContext ? `## 🧠 SEMANTIC PEDAGOGICAL MAP (CHIẾN LƯỢC):
- **Chỉ dẫn sư phạm**: ${semanticContext.instructions?.slice(0, 5).join('; ') || 'Tự đề xuất'}
- **Nhiệm vụ học sinh**: ${semanticContext.tasks?.slice(0, 5).join('; ') || 'Tự đề xuất'}
- **Trọng tâm kiến thức**: ${semanticContext.knowledge?.slice(0, 5).join('; ') || 'Bám sát PDF'}
` : ''}

## 📊 PHÂN TÍCH PEDAGOGICAL (RELEVANCE):
${relevance.reasoning}

## 💡 HỆ THỐNG TRÍ THỨC (DATABASE CHIẾN LƯỢC - THAM KHẢO):
${this.getSmartDataAdvice(activity, smartData)}
${quantumInsight}

## 🎮 YÊU CẦU NÂNG CAO (CRITICAL DIRECTIVES):
1. **TRUNG THỰC VỚI DỮ LIỆU PDF**: Đây là yêu cầu tiên quyết. Sử dụng 100% ngữ liệu từ PDF (mục 🎯) làm xương sống. 
2. **NHẬN DIỆN LAYOUT**: Nếu dữ liệu PDF có ký tự '|', hãy hiểu đó là phân tách giữa cột GV và HS. Hãy tái cấu trúc chúng thành các bước hành động logic.
3. **MỞ RỘNG DIỄN GIẢI (RICH NARRATIVE)**: Để đạt mục tiêu 30-50 trang, bạn PHẢI diễn giải mỗi bước cực kỳ chi tiết. Đừng chỉ viết "GV giao bài", hãy viết: "GV dẫn dắt bằng một câu chuyện... sau đó sử dụng kỹ thuật đặt câu hỏi Socratic để khơi gợi... quan sát và ghi chú các phản ứng của HS tại các vị trí...".
4. **SỰ KHÁC BIỆT GIỮA PDF VÀ DATABASE**: Ưu tiên 100% nội dung chủ đề từ PDF. DATABASE chỉ dùng để nâng cấp phương pháp tổ chức (ví dụ: dùng Kỹ thuật Mảnh ghép, Khăn trải bàn).
5. **Kỹ thuật sư phạm La bàn**: Sử dụng các phương pháp: ${activity === 'khoi_dong' ? 'Gamification/Kích hoạt tư duy' : activity === 'kham_pha' ? 'Nội soi kiến thức/Thảo luận đa chiều' : 'Ứng dụng thực tiễn/Tối ưu hóa năng lực'}.
6. **Mạch logic 5512**: Diễn giải cực kỳ chi tiết 4 bước (Chuyển giao, Thực hiện, Báo cáo, Kết luận).
7. **KẾT LUẬN "CHẠM TÂM HỒN"**: Phần Kết luận không được sơ sài. Hãy viết một thông điệp truyền cảm hứng mạnh mẽ, kết nối bài học với giá trị nhân văn và cam kết hành động thực tế.
8. **SOURCE ATTRIBUTION (QUAN TRỌNG - CHỐNG ẢO GIÁC)**:
   - TRONG MỖI BƯỚC HÀNH ĐỘNG (teacher_action & student_action):
   - Hãy đánh dấu **[PDF]** ở đầu câu/đoạn nếu nội dung đó được kế thừa trực tiếp hoặc phẫu thuật từ giáo án cũ.
   - Hãy đánh dấu **[AI-SUGGESTION]** nếu nội dung đó hoàn toàn là do AI đề xuất thêm để nâng cấp 5512.
   - Điều này giúp giáo viên biết chính xác đâu là "chất xám" của họ và đâu là sự hỗ trợ của AI.

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
      khoi_dong: '5-10 phút (Kích hoạt)',
      kham_pha: '20-25 phút (Đào sâu)',
      luyen_tap: '15-20 phút (Rèn luyện)',
      van_dung: 'Tùy chỉnh (Mở rộng thực tế)'
    };
    return durations[activity as keyof typeof durations] || '15 phút';
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
