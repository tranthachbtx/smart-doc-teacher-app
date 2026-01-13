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
        psychology: "Học sinh đầu cấp, thích khám phá, cần hòa nhập. Thích hoạt động bề nổi, sôi động.",
        tone_voice: "Trẻ trung, thân thiện, chào đón (Tone: 'Người bạn đồng hành').",
        preferred_formats: ["Rung chuông vàng", "Flashmob", "Hội trại", "Trò chơi Teambuilding", "Sân khấu hóa"]
    },
    "11": {
        psychology: "Học sinh sung sức nhất, muốn khẳng định bản lĩnh, quan tâm xã hội và kỹ năng.",
        tone_voice: "Mạnh mẽ, sắc sảo, kích thích hành động (Tone: 'Thủ lĩnh tương lai').",
        preferred_formats: ["Tranh biện (Debate)", "Sân khấu diễn đàn", "Dự án cộng đồng", "Shark Tank", "Thời trang tái chế"]
    },
    "12": {
        psychology: "Học sinh cuối cấp, chín chắn, tập trung vào nghề nghiệp và kỷ niệm.",
        tone_voice: "Sâu sắc, truyền cảm hứng, tin cậy (Tone: 'Người dẫn đường').",
        preferred_formats: ["Talkshow chuyên gia", "Ngày hội tư vấn tuyển sinh", "Lễ tri ân", "Viết thư gửi tương lai", "Phỏng vấn giả định"]
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
        smart_suggestion: "Cuộc thi tìm hiểu truyền thống trường hoặc Sáng tác câu hiệu (Slogan) về trường."
    },
    {
        id: "K10_CD7",
        grade: 10,
        name: "Bảo tồn cảnh quan thiên nhiên",
        smart_suggestion: "Tổ chức cuộc thi ảnh 'Vẻ đẹp Mũi Né' hoặc Chiến dịch nhặt rác bảo vệ bờ biển."
    },
    // Khối 11
    {
        id: "K11_CD1",
        grade: 11,
        name: "Xây dựng và phát triển nhà trường",
        smart_suggestion: "Diễn đàn 'Xây dựng văn hóa ứng xử văn minh trên không gian mạng' hoặc Talkshow về kỹ năng làm chủ các mối quan hệ."
    },
    {
        id: "K11_CD5",
        grade: 11,
        name: "Phát triển cộng đồng",
        smart_suggestion: "Chiến dịch truyền thông 'Mũi Né Xanh' hoặc Dự án tình nguyện vì cộng đồng địa phương."
    },
    {
        id: "K11_CD7",
        grade: 11,
        name: "Bảo vệ môi trường",
        smart_suggestion: "Hội thi 'Thời trang tái chế' từ phế liệu biển hoặc Diễn đàn công nghệ xanh."
    },
    {
        id: "K11_CD8",
        grade: 11,
        name: "Các nhóm nghề cơ bản và yêu cầu thị trường lao động",
        smart_suggestion: "Ngày hội 'Kết nối nghề nghiệp địa phương' hoặc Hội thảo xu hướng lao động 4.0."
    },
    // Khối 12
    {
        id: "K12_CD1",
        grade: 12,
        name: "Phát triển các mối quan hệ tốt đẹp với thầy cô và bạn bè",
        smart_suggestion: "Đêm nhạc tri ân 'Người đưa đò' hoặc Tọa đàm 'Kỹ năng hợp tác trong môi trường đại học'."
    },
    {
        id: "K12_CD8",
        grade: 12,
        name: "Nghề nghiệp và những yêu cầu với người lao động hiện đại",
        smart_suggestion: "Hội thi 'Phỏng vấn thử' (Mock Interview) hoặc Mời chuyên gia nhân sự về chia sẻ kinh nghiệm."
    },
    {
        id: "K12_CD2",
        grade: 12,
        name: "Tôi trưởng thành",
        smart_suggestion: "Đêm nhạc 'Lời tri ân' hoặc Diễn đàn 'Kỹ năng sinh tồn cho tân sinh viên xa nhà'."
    }
];

export function getGradeDNA(grade: string): GradeDNA | null {
    return GRADE_DNA[grade] || null;
}

export function getTopicSuggestion(grade: string, topicNumber: number): TopicSuggestion | null {
    const id = `K${grade}_CD${topicNumber}`;
    return TOPICS_LIBRARY.find(t => t.id === id) || null;
}
