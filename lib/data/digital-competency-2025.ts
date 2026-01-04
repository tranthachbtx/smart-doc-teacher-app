
/**
 * THÔNG TƯ 02/2025/TT-BGDĐT: KHUNG NĂNG LỰC SỐ CHO NGƯỜI HỌC
 * Hiệu lực từ: 11/03/2025
 * Tối ưu hóa cho cấp THPT (Lớp 10-12) - Mức độ 5
 */

export const DIGITAL_LITERACY_2025 = {
    version: "Circular 02/2025/TT-BGDĐT",
    levels: {
        thpt: "Mức độ 5 (Tự chủ trong bối cảnh phức tạp, mới lạ)",
    },
    domains: [
        {
            id: "D1",
            name: "Vận hành Thiết bị & Phần mềm",
            outcomes: [
                "Tự thiết lập môi trường số",
                "Xử lý sự cố phần cứng/phần mềm cơ bản"
            ],
            tools: ["VirtualBox", "Docker", "Arduino IDE"],
            kpi: "Số lượng sự cố tự giải quyết"
        },
        {
            id: "D2",
            name: "Thông tin & Dữ liệu",
            outcomes: [
                "Đánh giá độ tin cậy nguồn tin (Lateral Reading)",
                "Quản lý dữ liệu lớn",
                "Trực quan hóa dữ liệu phức tạp"
            ],
            tools: ["GeoGebra", "Desmos", "Excel/Google Sheets"],
            kpi: "Tỷ lệ trích dẫn nguồn học thuật uy tín"
        },
        {
            id: "D3",
            name: "Giao tiếp & Hợp tác",
            outcomes: [
                "Quản lý danh tính số chuyên nghiệp",
                "Hợp tác phi đồng bộ hiệu quả",
                "Tuân thủ Netiquette"
            ],
            tools: ["Padlet", "Trello", "ClassIn", "Microsoft Teams"],
            kpi: "Số lượng tương tác phản biện chất lượng cao"
        },
        {
            id: "D4",
            name: "Sáng tạo Nội dung Số",
            outcomes: [
                "Phát triển nội dung đa phương tiện phức tạp",
                "Lập trình giải quyết vấn đề",
                "Bảo quyền (Creative Commons)"
            ],
            tools: ["Canva", "Adobe Express", "Python", "C++"],
            kpi: "Mức độ tuân thủ bản quyền (0% vi phạm)"
        },
        {
            id: "D5",
            name: "An toàn Số (Cybersecurity)",
            outcomes: [
                "Bảo vệ dữ liệu cá nhân nâng cao",
                "Nhận diện/Phòng chống Phishing",
                "Cân bằng sức khỏe số (Digital Wellbeing)"
            ],
            tools: ["LastPass", "Bitwarden", "LMS Phishing Sim"],
            kpi: "Điểm số bài kiểm tra rủi ro thực tế"
        },
        {
            id: "D6",
            name: "Giải quyết Vấn đề",
            outcomes: [
                "Tư duy máy tính (Computational Thinking)",
                "Xác định và lựa chọn công nghệ cho vấn đề mới"
            ],
            tools: ["PhET Interactive Simulations", "Wolfram Alpha"],
            kpi: "Tần suất đề xuất giải pháp công nghệ mới"
        },
        {
            id: "D7",
            name: "Hướng nghiệp Số",
            outcomes: [
                "Sử dụng thành thạo phần mềm chuyên ngành",
                "Phân tích xu hướng công nghệ trong nghề nghiệp"
            ],
            tools: ["AutoCAD", "SPSS", "Mizou AI", "MagicSchool AI"],
            kpi: "Mức độ thành thạo công cụ chuyên ngành"
        }
    ],
    matrix_suggestions: {
        khoi_10: {
            focus: "D1, D2. TÌM HIỂU & NHẬN DIỆN. Nhấn mạnh việc thiết lập môi trường và đánh giá nguồn tin.",
            mapping: {
                ban_than: ["D2.1", "D5.3"],
                xa_hoi: ["D3.1", "D3.2"],
                tu_nhien: ["D2.2", "D1.1"],
                huong_nghiep: ["D7.2", "D1.2"]
            }
        },
        khoi_11: {
            focus: "D3, D4. KỸ NĂNG XÃ HỘI & SÁNG TẠO. Nhấn mạnh hợp tác dự án và sản xuất nội dung số.",
            mapping: {
                ban_than: ["D4.1", "D4.2"],
                xa_hoi: ["D3.3", "D3.4"],
                tu_nhien: ["D6.1", "D6.2"],
                huong_nghiep: ["D7.1", "D4.3"]
            }
        },
        khoi_12: {
            focus: "D5, D6, D7. TRƯỞNG THÀNH & QUYẾT ĐỊNH. Nhấn mạnh An toàn số, AI và Công cụ chuyên ngành.",
            mapping: {
                ban_than: ["D5.1", "D5.2"],
                xa_hoi: ["D3.5", "D3.6"],
                tu_nhien: ["D6.1", "D6.2"],
                huong_nghiep: ["D7.3", "D6.3"]
            }
        }
    }
};
