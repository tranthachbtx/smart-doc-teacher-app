/**
 * 🏛️ EVENT DNA DATABASE
 * Định hình tâm lý, giọng văn và gợi ý thông minh cho từng khối lớp và chủ đề.
 */

export interface GradeDNA {
    psychology: string;
    tone_voice: string;
    preferred_formats: string[];
}

export const GRADE_DNA: Record<string, GradeDNA> = {
    "10": {
        psychology: "Thích ứng & Khám phá. Từ vị thế 'người lạ' sang thành viên tích cực. Nhấn mạnh vào Quan sát, Nhận diện bản thân (SWOT, Holland).",
        tone_voice: "Trẻ trung, thân thiện, chào đón (Tone: 'Người bạn đồng hành').",
        preferred_formats: ["Rung chuông vàng", "Flashmob", "Khảo sát thực địa (Field Survey)", "Hội trại vinh danh truyền thống", "Sân khấu hóa nhập môn"]
    },
    "11": {
        psychology: "Phát triển & Bản sắc. Độc lập, Khởi xướng. Quan tâm Bản sắc số (Digital Identity), Quản lý tài chính, Văn hóa mạng (Cyberbullying).",
        tone_voice: "Mạnh mẽ, sắc sảo, kích thích hành động (Tone: 'Thủ lĩnh tương lai').",
        preferred_formats: ["Tranh biện về văn hóa mạng", "Hội thảo Xây dựng thương hiệu cá nhân", "Mô phỏng ngân sách gia đình", "Dự án cộng đồng khởi xướng", "Shark Tank khởi nghiệp địa phương"]
    },
    "12": {
        psychology: "Trưởng thành & Quyết định. Coi trọng Trách nhiệm, Sự kiên cường (Resilience), Khả năng thích ứng nghề nghiệp (Career Adaptability).",
        tone_voice: "Sâu sắc, truyền cảm hứng, tin cậy (Tone: 'Người dẫn đường').",
        preferred_formats: ["Talkshow chuyên gia thực tế", "Phỏng vấn giả định (Mock Interview)", "Lễ tri ân & Ra quyết định", "Hồ sơ dự án (Project Charter)", "Tọa đàm về Tái đào tạo (Reskilling)"]
    }
};

export interface TopicSuggestion {
    id: string; // K[Grade]_CD[TopicNumber]
    grade: number;
    name: string;
    smart_suggestion: string;
}

export const TOPICS_LIBRARY: TopicSuggestion[] = [
    // Khối 10
    {
        id: "K10_CD1",
        grade: 10,
        name: "Phát huy truyền thống nhà trường",
        smart_suggestion: "Ngày hội 'Vinh danh Bùi Thị Xuân' - Thiết kế Infographic về lịch sử trường & Podcast kể chuyện truyền thống."
    },
    {
        id: "K10_CD7",
        grade: 10,
        name: "Bảo tồn cảnh quan thiên nhiên",
        smart_suggestion: "Chiến dịch 'Mũi Né Xanh' - Khảo sát thực địa mức độ ô nhiễm nhựa tại Làng chài & Đề xuất giải pháp bằng Poster AI."
    },
    {
        id: "K10_CD8",
        grade: 10,
        name: "Bảo vệ môi trường",
        smart_suggestion: "Eco-Challenge: Sáng tạo sản phẩm từ thanh long hoặc phế liệu biển. Triển lãm ảo (Virtual Exhibition)."
    },
    // Khối 11
    {
        id: "K11_CD1",
        grade: 11,
        name: "Xây dựng và phát triển nhà trường",
        smart_suggestion: "Diễn đàn 'Netiquette & Bản sắc số' - Xây dựng bộ quy tắc ứng xử văn minh trên Tiktok/Facebook cho học sinh."
    },
    {
        id: "K11_CD3",
        grade: 11,
        name: "Quản lý cảm xúc và tài chính",
        smart_suggestion: "Workshop 'Tài chính Gen Z' - Mô phỏng lập ngân sách cá nhân bằng Excel/AI và trò chơi quản lý rủi ro."
    },
    {
        id: "K11_CD5",
        grade: 11,
        name: "Phát triển cộng đồng",
        smart_suggestion: "Dự án 'Kết nối 8386' - Khởi xướng chiến dịch quyên góp sách/đồ chơi cho trẻ em nghèo vùng biển Phan Thiết."
    },
    {
        id: "K11_CD8",
        grade: 11,
        name: "Các nhóm nghề cơ bản và yêu cầu thị trường lao động",
        smart_suggestion: "Hành trình 'Job Shadowing' ảo - Tìm hiểu nghề quản trị resort/logistics qua video thực tế và phân tích xu hướng AI."
    },
    // Khối 12
    {
        id: "K12_CD1",
        grade: 12,
        name: "Phát triển các mối quan hệ với thầy cô và bạn bè",
        smart_suggestion: "Dự án 'Lời tri ân chưa kể' - Talkshow chia sẻ kỷ niệm và thực hành kỹ năng giải quyết xung đột trước khi ra trường."
    },
    {
        id: "K12_CD8",
        grade: 12,
        name: "Nghề nghiệp và những yêu cầu với người lao động hiện đại",
        smart_suggestion: "Mock Interview 2025 - Phỏng vấn giả định với các nhà tuyển dụng thực tế từ Hiệp hội du lịch Bình Thuận."
    },
    {
        id: "K12_CD2",
        grade: 12,
        name: "Tôi trưởng thành",
        smart_suggestion: "Night of Transition - Buổi lễ trưởng thành tập trung vào Ý chí & Sự kiên cường. Viết hồ sơ dự án cuộc đời."
    },
    {
        id: "K12_CD10",
        grade: 12,
        name: "Ra quyết định nghề nghiệp",
        smart_suggestion: "Career Adaptation Forum - Tọa đàm về việc 'Tái định hướng nghề nghiệp' trong kỷ nguyên AI và cách chọn trường thông minh."
    }
];

export function getGradeDNA(grade: string): GradeDNA | null {
    return GRADE_DNA[grade] || null;
}

export function getTopicSuggestion(grade: string, topicNumber: number): TopicSuggestion | null {
    const id = `K${grade}_CD${topicNumber}`;
    return TOPICS_LIBRARY.find(t => t.id === id) || null;
}
