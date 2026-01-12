// Department Information Constants
// Tá»• HÄTN, HN & GDÄP - TrÆ°á»ng THPT BÃ¹i Thá»‹ XuÃ¢n - MÅ©i NÃ©

export const DEPT_INFO = {
  name: "Tá»• HÄTN, HN & GDÄP", // TÃªn tá»•
  school: "TrÆ°á»ng THPT BÃ¹i Thá»‹ XuÃ¢n - MÅ©i NÃ©",
  head: "Tráº§n HoÃ ng Tháº¡ch", // Tá»• trÆ°á»Ÿng
  secretary: "Mai VÄƒn PhÆ°á»›c", // ThÆ° kÃ½
  members: [
    // CÃ¡c thÃ nh viÃªn cÃ²n láº¡i
    "BÃ¹i Quang Máº«n",
    "Tráº§n VÄƒn Táº¡",
    "Nguyá»…n VÄƒn Linh",
  ],
  // Auto-fill values for meeting minutes
  autoFill: {
    chu_tri: "Tráº§n HoÃ ng Tháº¡ch",
    to_truong: "Tráº§n HoÃ ng Tháº¡ch",
    thu_ky: "Mai VÄƒn PhÆ°á»›c",
    thanh_vien: "BÃ¹i Quang Máº«n, Tráº§n VÄƒn Táº¡, Nguyá»…n VÄƒn Linh",
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
