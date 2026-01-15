// Department Information Constants
// Tổ HĐTN, HN & GDĐP - Trường THPT Bùi Thị Xuân - Mũi Né

export const DEPT_INFO = {
  upperAgency: "SỞ GD&ĐT Lâm Đồng",
  name: "Tổ HĐTN, HN & GDĐP", // Tên tổ
  school: "Trường THPT Bùi Thị Xuân - Mũi Né",
  head: "Trần Hoàng Thạch (TTCM)", // Tổ trưởng
  secretary: "Mai Văn Phước", // Thư ký
  members: [
    "Bùi Quang Mẫn",
    "Nguyễn Văn Linh",
    "Mai Văn Phước",
    "Trần Văn Tạ",
  ],
  // Auto-fill values for meeting minutes
  autoFill: {
    chu_tri: "Trần Hoàng Thạch (TTCM)",
    to_truong: "Trần Hoàng Thạch (TTCM)",
    thu_ky: "Mai Văn Phước",
    thanh_vien: "Bùi Quang Mẫn, Nguyễn Văn Linh, Trần Văn Tạ",
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
