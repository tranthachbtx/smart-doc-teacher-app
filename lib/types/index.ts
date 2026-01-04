export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  audit?: string; // For audit results
  content?: string; // For refined content
  score?: number; // For compliance scoring
}

export interface MeetingResult {
  noi_dung_chinh: string;
  uu_diem: string;
  han_che: string;
  y_kien_dong_gop: string;
  ke_hoach_thang_toi: string;
  ket_luan_cuoc_hop?: string;
}

export interface LessonTask {
  id: string;
  name: string;
  content: string;
  source?: "curriculum" | "ppct" | "user";
  kyNangCanDat?: string[];
  sanPhamDuKien?: string;
  thoiLuongDeXuat?: string;
  selected?: boolean;
  time?: number;
}

export interface LessonResult {
  ma_chu_de?: string;
  ten_bai?: string;
  muc_tieu_kien_thuc?: string;
  muc_tieu_nang_luc?: string;
  muc_tieu_pham_chat?: string;
  gv_chuan_bi?: string;
  hs_chuan_bi?: string;
  shdc?: string;
  shl?: string;
  hoat_dong_khoi_dong?: string;
  hoat_dong_kham_pha?: string;
  hoat_dong_kham_pha_1?: string;
  hoat_dong_kham_pha_2?: string;
  hoat_dong_kham_pha_3?: string;
  hoat_dong_kham_pha_4?: string;
  hoat_dong_luyen_tap?: string;
  hoat_dong_luyen_tap_1?: string;
  hoat_dong_luyen_tap_2?: string;
  hoat_dong_luyen_tap_3?: string;
  hoat_dong_van_dung?: string;
  ho_so_day_hoc?: string;
  tich_hop_nls?: string;
  tich_hop_dao_duc?: string;
  ky_thuat_day_hoc?: string;
  tich_hop_dao_duc_va_bai_hat?: string;
  huong_dan_ve_nha?: string;
  shdc_shl_combined?: string;
  noi_dung_chuan_bi?: string;
  thiet_bi_day_hoc?: string;
  shdc_gợi_ý?: string;
  hdgd_gợi_ý?: string;
  shl_gợi_ý?: string;
  hoat_dong_duoi_co?: string;
  // Task details
  nhiem_vu?: Array<{
    ten: string;
    noi_dung: string;
    ky_nang: string;
    san_pham: string;
    thoi_luong: string;
    to_chuc_thuc_hien: {
      chuyen_giao: string;
      thuc_hien: string;
      bao_cao: string;
      ket_luan: string;
    };
  }>;
  // Saga specific fields
  is_partial?: boolean;
  sections?: Record<string, string>;
  blueprint?: any;
  expertGuidance?: string; // Gemini Pro analysis
  expert_instructions?: string; // Legacy compatibility
}

export interface SagaTask {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  gist?: string;
  error?: string;
  retryCount: number;
  provider?: 'gemini' | 'openai';
}

export interface SagaJob {
  jobId: string;
  grade: string;
  topic: string;
  tasks: SagaTask[];
  status: 'idle' | 'architecting' | 'processing' | 'completed' | 'failed';
  startTime?: number;
  lastUpdateTime?: number;
  lessonFile?: { mimeType: string; data: string; name: string };
  lessonFileSummary?: string; // New: Stores the compressed reference document
  expertGuidance?: string; // New: Stores external analysis from Gemini Pro
}

export interface EventResult {
  ten_ke_hoach?: string; // Alias for ten_chu_de in display logic
  ten_chu_de?: string;
  thoi_gian?: string;
  dia_diem?: string;
  doi_tuong?: string;
  so_luong?: string;
  muc_tieu?: string | any;
  noi_dung?: string | string[];
  tien_trinh?: Array<{ thoi_gian: string; hoat_dong: string }>;
  nang_luc?: string;
  pham_chat?: string;
  muc_dich_yeu_cau?: string;
  kich_ban_chi_tiet?: string;
  thong_diep_ket_thuc?: string;
  du_toan_kinh_phi?: string[];
  checklist_chuan_bi?: string[];
  danh_gia_sau_hoat_dong?: string;
}

export interface NCBHResult {
  ten_bai?: string;
  ly_do_chon?: string;
  muc_tieu?: string;
  chuoi_hoat_dong?: string;
  phuong_an_ho_tro?: string;
  chia_se_nguoi_day?: string;
  nhan_xet_nguoi_du?: string;
  nguyen_nhan_giai_phap?: string;
  bai_hoc_kinh_nghiem?: string;
}

export interface AssessmentResult {
  ten_ke_hoach: string;
  muc_tieu?: string | string[];
  noi_dung_nhiem_vu?: string | object;
  nhiem_vu?: Array<{
    ten_nhiem_vu?: string;
    yeu_cau?: string;
    mo_ta?: string;
    tieu_chi_danh_gia?: string;
  }>;
  bang_kiem_rubric?: Array<{
    tieu_chi: string;
    trong_so?: string;
    muc_do?: {
      dat?: string;
      tot?: string;
      xuat_sac?: string;
      chua_dat?: string;
      muc_1?: string;
      muc_2?: string;
      muc_3?: string;
    };
  }>;
  cong_cu_danh_gia?: {
    rubric?: Array<any>;
  };
  loi_khuyen?: string | object;
}

export type TemplateData = {
  name: string;
  data: ArrayBuffer;
};
