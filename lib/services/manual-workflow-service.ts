
import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";

export interface PromptContext {
  topic: string;
  grade: string;
  fileSummary: string;
  optimizedFileSummary?: any;
  smartData: SmartPromptData;
}

/**
 * 🛠️ MANUAL WORKFLOW SERVICE v35.0 (ELITE ASSEMBLY)
 * Chuyên dụng cho môn HĐTN, HN với quy trình Mapping 1:1 vào Template Word 2 cột.
 */
export const ManualWorkflowService = {
  async analyzeStructure(text: string, analyzedJson?: string): Promise<ProcessingModule[]> {
    return [
      { id: "pillar_1", title: "Trụ cột 1: Khung & Vệ tinh (Metadata)", type: "setup", prompt: "", content: "", isCompleted: false },
      { id: "pillar_2", title: "Trụ cột 2: Kiến tạo Tri thức (HĐ 1+2)", type: "khac", prompt: "", content: "", isCompleted: false },
      { id: "pillar_3", title: "Trụ cột 3: Thực chiến (HĐ 3+4)", type: "khac", prompt: "", content: "", isCompleted: false },
    ];
  },

  /**
   * PROMPT 1: KHUNG & VỆ TINH (RAG: Audit & Upgrade - Database Standard)
   */
  async generatePillar1Prompt(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};
    const smartData = context.smartData;

    return `
# VAI TRÒ: Chuyên gia Thẩm định & Phát triển Chương trình HĐTN, HN 12 (Chuẩn 5512 - v35.0).

# DỮ LIỆU ĐẦU VÀO (INPUT):
1. **Nội dung từ KHBH cũ (PDF):**
"""
${context.fileSummary.substring(0, 10000)}
"""
- Nội dung SHDC cũ: """${data.noi_dung_shdc || "N/A"}"""
- Nội dung SHL cũ: """${data.noi_dung_shl || "N/A"}"""

2. **Dữ liệu Chuẩn từ Hệ thống (Database):**
- **Yêu cầu cần đạt (YCCĐ):** """${smartData.objectives}"""
- **Năng lực & Phẩm chất cốt lõi:** """${smartData.studentCharacteristics}"""
- **Danh mục Năng lực & Phẩm chất chuẩn (BẮT BUỘC SỬ DỤNG):**
  + **Năng lực chung:** Tự chủ và tự học, Giao tiếp và hợp tác, Giải quyết vấn đề và sáng tạo.
  + **Năng lực đặc thù (HĐTN):** Thích ứng với cuộc sống, Thiết kế và tổ chức hoạt động, Định hướng nghề nghiệp.
  + **Phẩm chất:** Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm.
- **Gợi ý SHDC & SHL (Chuẩn SGK):** """${smartData.shdc_shl_suggestions}"""

# NHIỆM VỤ (AUDIT & UPGRADE):
Hãy tái cấu trúc thông tin bài dạy.
1. **Mục tiêu (Audit):**
   - So sánh PDF cũ với YCCĐ chuẩn.
   - Viết lại toàn bộ mục tiêu bằng động từ hành động (Action Verbs) mạnh mẽ: "Phân tích", "Thiết kế", "Thực hiện", "Tuyên truyền". Tuyệt đối không dùng "Hiểu/Biết".
   - **Đặc biệt:** Phải khớp chính xác tên Năng lực & Phẩm chất từ danh mục chuẩn phía trên.
2. **Thiết bị (Digital Upgrade & Clean-up):**
   - Bổ sung các công cụ số: Padlet, Canva, Google Forms, Mentimeter.
   - **🛑 LỌC SẠCH THIẾT BỊ:** Rà soát danh sách thiết bị từ PDF cũ. Nếu thấy thiết bị nào KHÔNG PHÙ HỢP với chủ đề "${smartData.topicName}" (Ví dụ: Tranh ảnh động vật trong bài về Tình bạn), hãy MẠNH DẠN LOẠI BỎ.
3. **SHDC & SHL (Scripting):**
   - Viết thành kịch bản tổ chức chi tiết (có lời dẫn MC, phân công cụ thể).

🛑 **QUY TẮC XỬ LÝ MÂU THUẪN (LUẬT ƯU TIÊN):**
- ƯU TIÊN 100% DATABASE nếu chủ đề trong PDF khác với "${smartData.topicName}".

# YÊU CẦU OUTPUT JSON (Khớp Template Word):
- Trả về DUY NHẤT một khối JSON. Xuống dòng bằng \\n.

{
  "ten_bai": "${smartData.topicName}",
  "so_tiet": "03",
  "muc_tieu_kien_thuc": "- [Động từ hành động] ...\\n- [Động từ hành động] ...",
  "muc_tieu_nang_luc": "- **Năng lực Giao tiếp và hợp tác:** ...\\n- **Năng lực Thích ứng với cuộc sống:** ...",
  "muc_tieu_pham_chat": "- **Nhân ái:** ...\\n- **Trách nhiệm:** ...",
  "gv_chuan_bi": "- Máy tính, Tivi...\\n- [Danh sách thiết bị đã được lọc sạch và nâng cấp]...",
  "hs_chuan_bi": "- SGK, Smartphone...\\n- [Chuẩn bị nội dung phù hợp chủ đề]...",
  "shdc": "**Chủ đề:** ...\\n**Hình thức:** ...\\n**Tiến trình:**\\n1. Chào cờ.\\n2. Nhận xét.\\n3. **Hoạt động chủ điểm:** [Kịch bản chi tiết + Lời dẫn MC]...\\n4. Dặn dò.",
  "shl": "**Chủ đề:** ...\\n**Tiến trình:**\\n1. Sơ kết.\\n2. **Sinh hoạt theo chủ đề:** [Hoạt động thảo luận/trò chơi gắn với bài học]...\\n3. Nhận xét."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  /**
   * PROMPT 2: KIẾN TẠO TRI THỨC (RAG: Rewrite & Enrich - Digital Integration)
   */
  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};
    const smartData = context.smartData;

    return `
# VAI TRÒ: Kiến trúc sư Sư phạm (Phong cách: Deep Dive & Constructivism - v35.0).

# DỮ LIỆU ĐẦU VÀO:
1. **Nội dung PDF cũ (Tham khảo - Cảnh báo sai lệch):**
"""
${context.fileSummary.substring(0, 15000)}
"""
*(Lưu ý: Dữ liệu PDF này có thể thuộc chủ đề cũ. Chỉ tham khảo phong cách trình bày, KHÔNG lấy nội dung nếu sai chủ đề).*

2. **Dữ liệu CHUẨN từ Database (BẮT BUỘC TUÂN THỦ):**
- **Chủ đề bài học:** ${smartData.topicName}
- **Nghiệp vụ dạy học (Core Activities):** """
[HĐ Khởi động]: ${smartData.coreMissions.khoiDong}
[HĐ Khám phá]: ${smartData.coreMissions.khamPha}
"""
*(Đây là xương sống của HĐ Khám phá. Hãy dùng nội dung [HĐ Khám phá] trong này để thiết kế).*

- **Phương pháp chủ đạo:** """${smartData.pedagogicalNotes}"""
- **Năng lực số tích hợp:** """${smartData.digitalCompetency}""" (Ưu tiên: Padlet, Mentimeter, Canva).

# NHIỆM VỤ: Thiết kế Hoạt động 1 (Khởi động) & Hoạt động 2 (Khám phá).

🛑 **QUY TẮC XỬ LÝ MÂU THUẪN (QUAN TRỌNG NHẤT):**
Hãy so sánh chủ đề của "PDF cũ" và "Dữ liệu Chuẩn".
- Nếu PDF nói về chủ đề khác (VD: Môi trường) so với Database (VD: Quan hệ xã hội) -> **HÃY BỎ QUA PDF HOÀN TOÀN.**
- **Tuyệt đối không tìm cách gượng ép** kết hợp 2 chủ đề.
- Chỉ sử dụng "Dữ liệu Chuẩn" để sáng tạo nội dung mới.

# NGUYÊN TẮC "MAX CONTENT" (VIẾT DÀI & SÂU):
Để giáo án đạt chuẩn 5512 cao cấp, hãy tuân thủ công thức mở rộng sau:

### 1. HOẠT ĐỘNG KHỞI ĐỘNG (Warm-up):
- **Mục tiêu:** Tạo tâm thế hào hứng, kết nối vào chủ đề mới (theo Database).
- **Kỹ thuật:** Sử dụng Video/Trò chơi/Tình huống.
- **Yêu cầu:** Viết rõ lời dẫn (Script) của GV để dẫn dắt từ hoạt động khởi động vào bài học.

### 2. HOẠT ĐỘNG KHÁM PHÁ (Formation of Knowledge):
- **Nội dung:** Dựa trên nội dung **[HĐ Khám phá]** trong phần "Nghiệp vụ dạy học" của Database.
- **Triển khai Cột GV (3 lớp thông tin):**
  + **Lớp 1 (Chuyển giao):** Mô tả kỹ thuật cụ thể (VD: "Sử dụng kỹ thuật KWL..."). Viết câu hỏi thảo luận chi tiết.
  + **Lớp 2 (Tổ chức):** Quy định thời gian (phút), cách chia nhóm.
  + **Lớp 3 (Hỗ trợ & Xử lý - BẮT BUỘC):** Viết mục *"Dự kiến khó khăn"*: (VD: "Nếu HS bí ý tưởng, GV gợi ý bằng cách...").
- **Triển khai Cột HS (Sản phẩm đa chiều):**
  + Mô tả hành động cụ thể (Di chuyển, Quét mã QR, Thảo luận).
  + **Sản phẩm dự kiến:** Liệt kê **3 phương án trả lời** (Phương án đúng chuẩn, Phương án sáng tạo, và Phương án còn thiếu sót để GV chỉnh sửa).
- **Tích hợp Năng lực số:** Bắt buộc có bước HS dùng điện thoại/máy tính (Tra cứu, làm việc trên Padlet/Canva) như Database gợi ý.

# YÊU CẦU OUTPUT JSON (Strict Format):
- Trả về DUY NHẤT một khối JSON.
- Xuống dòng = \\n. Không dùng ngoặc kép " trong nội dung (dùng ' thay thế).

{
  "hoat_dong_khoi_dong_cot_1": "**1. Chuyển giao nhiệm vụ:**\\n- GV tổ chức trò chơi/chiếu video [Tên hoạt động phù hợp chủ đề]...\\n- **Lời dẫn:** '...'\\n\\n**2. Kết luận & Dẫn dắt:**\\n- GV nhận xét...\\n- Dẫn vào bài: '...'",
  "hoat_dong_khoi_dong_cot_2": "- HS tham gia...\\n- **Cảm nhận/Câu trả lời dự kiến:**\\n  + HS A: ...\\n  + HS B: ...",
  
  "hoat_dong_kham_pha_cot_1": "**HOẠT ĐỘNG: [Tên hoạt động trong Database]**\\n\\n**Bước 1: Chuyển giao (Kỹ thuật ...)**\\n- GV chia lớp thành... nhóm.\\n- Yêu cầu: [Nội dung yêu cầu]...\\n- **Công cụ hỗ trợ:** Yêu cầu HS truy cập Padlet qua mã QR...\\n\\n**Bước 2: Thực hiện & Hỗ trợ**\\n- GV quan sát...\\n- **Dự kiến tình huống:** Nếu lớp trầm, GV kích thích bằng câu hỏi: '...'\\n\\n**Bước 3: Báo cáo & Đánh giá**\\n- Mời đại diện nhóm...\\n- GV chốt kiến thức: ...",
  "hoat_dong_kham_pha_cot_2": "**1. Thực hiện:**\\n- Nhóm trưởng phân công...\\n- Các thành viên tìm kiếm thông tin trên mạng...\\n- Tổng hợp ý kiến lên Padlet/Giấy A0...\\n\\n**2. Sản phẩm dự kiến:**\\n- **Nhóm 1 (Trình bày):** Nêu được các ý...\\n- **Nhóm 2 (Sơ đồ tư duy):** Vẽ được...\\n- **Lưu ý:** HS sử dụng Canva để thiết kế slide..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  /**
   * PROMPT 3: THỰC CHIẾN (RAG: Optimize & Fill Gaps - Authentic Assessment)
   */
  async generatePillar3Prompt(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};
    const smartData = context.smartData;

    return `
# VAI TRÒ: Chuyên gia Đánh giá & Phục hình Giáo án (Strict Mode - v35.0).

# DỮ LIỆU ĐẦU VÀO:
1. **Nội dung PDF cũ (Tham khảo - Cảnh báo sai lệch):**
"""
${context.fileSummary.substring(0, 15000)}
"""
*(Lưu ý: Dữ liệu PDF này có thể thuộc chủ đề cũ. Chỉ tham khảo phong cách trình bày, KHÔNG lấy nội dung nếu sai chủ đề).*

2. **Dữ liệu CHUẨN từ Database (BẮT BUỘC TUÂN THỦ):**
- **Chủ đề chính:** ${smartData.topicName}
- **Nghiệp vụ dạy học (LT & VD):** """
[HĐ Luyện tập]: ${smartData.coreMissions.luyenTap}
[HĐ Vận dụng]: ${smartData.coreMissions.vanDung}
"""
- **Ngân hàng Rubric chuẩn (BẮT BUỘC SỬ DỤNG):** """${smartData.assessmentTools}""" 
*(Đặc biệt lưu ý Rubric Giao tiếp & Hợp tác RB-02 nếu có trong dữ liệu).*

# NHIỆM VỤ: Thiết kế Hoạt động 3 (Luyện tập) & Hoạt động 4 (Vận dụng).

🛑 **QUY TẮC XỬ LÝ MÂU THUẪN (FIREWALL):**
Hãy so sánh chủ đề của "PDF cũ" và "Dữ liệu Chuẩn".
- Nếu PDF nói về chủ đề khác (VD: Môi trường) so với Database (VD: Quan hệ thầy trò) -> **HÃY BỎ QUA PDF HOÀN TOÀN.**
- Gạt bỏ sự "lệch pha", chỉ dùng "Dữ liệu Chuẩn" để viết mới 100%.

# NGUYÊN TẮC "BƠM PHỒNG" (INFLATION - VIẾT DÀI & SÂU):

### 1. HOẠT ĐỘNG LUYỆN TẬP (Practice):
- **Cột GV (Lớp 3 - Tình huống giả định):** Bắt buộc sáng tác một **Tình huống giả định (Case Study)** chi tiết liên quan đến chủ đề bài học, dài ít nhất 150 chữ. Tình huống phải có nhân vật, có mâu thuẫn cần giải quyết.
- **Cột HS (Sản phẩm dự kiến):** Liệt kê ít nhất **3 phương án** giải quyết tình huống (Phương án tối ưu, Phương án sáng tạo, Phương án thiếu sót).

### 2. HOẠT ĐỘNG VẬN DỤNG (Application):
- **Cột GV (Phiếu giao dự án):** Thiết kế một **PHIẾU GIAO NHIỆM VỤ VỀ NHÀ** chuyên nghiệp. Gồm: Tên dự án, Mục tiêu, Các bước thực hiện chi tiết, Hạn nộp và Hình thức báo cáo.

### 3. HỒ SƠ DẠY HỌC (Assessment Tools):
- Tạo bảng **RUBRIC 4 MỨC ĐỘ** (Xuất sắc - Tốt - Đạt - Chưa đạt). Sử dụng dữ liệu từ "Ngân hàng Rubric chuẩn" để xây dựng các chỉ báo hành vi cụ thể cho hoạt động trên.

# YÊU CẦU OUTPUT JSON (Strict Format):
- Trả về DUY NHẤT một khối JSON.
- Xuống dòng = \\n. Không dùng ngoặc kép " trong nội dung.

{
  "luyen_tap": {
    "cot_gv": "**1. Chuyển giao nhiệm vụ (Kỹ thuật ...):**\\n- GV chia lớp...\\n- **TÌNH HUỐNG GIẢ ĐỊNH (150+ từ):** [Nội dung tình huống chi tiết...]...\\n\\n**2. Tổ chức thực hiện:**\\n- GV quan sát...\\n\\n**3. Dự kiến hỗ trợ:**\\n- Nếu HS bí, GV gợi ý: '...' ",
    "cot_hs": "**1. Thảo luận & Phân vai:**\\n- ...\\n\\n**2. Sản phẩm dự kiến:**\\n- Phương án 1 (Tối ưu): ...\\n- Phương án 2 (Sáng tạo): ...\\n- Phương án 3 (Hạn chế): ..."
  },
  "van_dung": {
    "cot_gv": "**GIAO DỰ ÁN VỀ NHÀ**\\n\\n**PHIẾU GIAO NHIỆM VỤ:**\\n---------------------------\\n**1. Tên dự án:** ...\\n**2. Mục tiêu:** ...\\n**3. Các bước thực hiện:**\\n- Bước 1: ...\\n- Bước 2: ...\\n**4. Hạn nộp:** Tiết Sinh hoạt lớp tuần sau.\\n---------------------------",
    "cot_hs": "- Nhóm trưởng...\\n- Phân công: ...\\n- Cam kết: ..."
  },
  "ho_so_day_hoc": "**RUBRIC ĐÁNH GIÁ NĂNG LỰC ... (Dựa trên Database chuẩn)**\\n\\n**Mức 4 (Xuất sắc):**\\n- ...\\n\\n**Mức 3 (Tốt):**\\n- ...\\n\\n**Mức 2 (Đạt):**\\n- ...\\n\\n**Mức 1 (Chưa đạt):**\\n- ..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  }
};
