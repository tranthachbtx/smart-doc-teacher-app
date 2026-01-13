// Department Information Constants
// Tổ HĐTN, HN & GDĐP - Trường THPT Bùi Thị Xuân - Mũi Né

export const DEPT_INFO = {
  upperAgency: "SỞ GD&ĐT Lâm Đồng",
  name: "Tổ HĐTN, HN & GDĐP", // Tên tổ
  school: "Trường THPT Bùi Thị Xuân - Mũi Né",
  head: "Trần Hoàng Thạch", // Tổ trưởng
  secretary: "Mai Văn Phước", // Thư ký
  members: [
    // Các thành viên còn lại
    "Bùi Quang Mẫn",
    "Trần Văn Tạ",
    "Nguyễn Văn Linh",
  ],
  // Auto-fill values for meeting minutes
  autoFill: {
    chu_tri: "Trần Hoàng Thạch",
    to_truong: "Trần Hoàng Thạch",
    thu_ky: "Mai Văn Phước",
    thanh_vien: "Bùi Quang Mẫn, Trần Văn Tạ, Nguyễn Văn Linh",
    si_so: "5",
    vang: "0",
    ly_do: "",
  },
}

// Get all members list (including head and secretary)
export function getAllMembers(): string[] {
  return [DEPT_INFO.head, DEPT_INFO.secretary, ...DEPT_INFO.members]
}

// Get formatted members list for display
export function getFormattedMembersList(): string {
  return getAllMembers().join(", ")
}
