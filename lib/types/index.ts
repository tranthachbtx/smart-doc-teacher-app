export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  audit?: string; // For audit results
  content?: string; // For refined content
  score?: number; // For compliance scoring
}

export interface MeetingResult {
  title?: string;
  noi_dung_chinh?: string;
  uu_diem?: string;
  han_che?: string;
  y_kien_dong_gop?: string;
  ke_hoach_thang_toi?: string;
  ket_luan_cuoc_hop?: string;
  content?: string;
  summary?: string;
  conclusion?: string;
  metadata?: any;
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
  chuDeSo?: string;
  theme?: string;
  ten_bai?: string;
  title?: string; // Alias for ten_bai used in some services
  grade?: string;
  muc_tieu_kien_thuc?: string;
  muc_tieu_nang_luc?: string;
  muc_tieu_pham_chat?: string;
  gv_chuan_bi?: string;
  hs_chuan_bi?: string;
  shdc?: string;
  shl?: string;
  hoat_dong_khoi_dong?: string;
  hoat_dong_khoi_dong_cot_1?: string;
  hoat_dong_khoi_dong_cot_2?: string;
  hoat_dong_kham_pha?: string;
  hoat_dong_kham_pha_cot_1?: string;
  hoat_dong_kham_pha_cot_2?: string;
  hoat_dong_kham_pha_1?: string;
  hoat_dong_kham_pha_2?: string;
  hoat_dong_kham_pha_3?: string;
  hoat_dong_kham_pha_4?: string;
  hoat_dong_luyen_tap?: string;
  hoat_dong_luyen_tap_cot_1?: string;
  hoat_dong_luyen_tap_cot_2?: string;
  hoat_dong_luyen_tap_1?: string;
  hoat_dong_luyen_tap_2?: string;
  hoat_dong_luyen_tap_3?: string;
  hoat_dong_van_dung?: string;
  hoat_dong_van_dung_cot_1?: string;
  hoat_dong_van_dung_cot_2?: string;
  ho_so_day_hoc?: string;
  tich_hop_nls?: string;
  tich_hop_dao_duc?: string;
  ky_thuat_day_hoc?: string;
  tich_hop_dao_duc_va_bai_hat?: string;
  huong_dan_ve_nha?: string;
  homework?: string; // Alias for huong_dan_ve_nha
  duration?: string;
  materials?: string; // Alias for ho_so_day_hoc
  shdc_shl_combined?: string;
  shdc_gợi_ý?: string;
  hdgd_gợi_ý?: string;
  shl_gợi_ý?: string;
  hoat_dong_duoi_co?: string;
  summary?: string;
  introduction?: string;
  activities?: any[]; // For dynamic activities array
  noi_dung_chuan_bi?: string;
  thiet_bi_day_hoc?: string;
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
  ten_truong?: string;
  to_chuyen_mon?: string;
  ten_giao_vien?: string;
  so_tiet?: string;
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
  title?: string;
  ten_ke_hoach?: string; // Alias for ten_chu_de in display logic
  ten_chu_de?: string;
  thoi_gian?: string;
  dia_diem?: string;
  doi_tuong?: string;
  so_luong?: string;
  muc_tieu?: string | any;
  noi_dung?: string | string[];
  summary?: string;
  content?: string;
  conclusion?: string;
  tien_trinh?: Array<{ thoi_gian: string; hoat_dong: string }>;
  nang_luc?: string;
  pham_chat?: string;
  muc_dich_yeu_cau?: string;
  kich_ban_chi_tiet?: string;
  thong_diep_ket_thuc?: string;
  du_toan_kinh_phi?: string[];
  checklist_chuan_bi?: string[];
  danh_gia_sau_hoat_dong?: string;
  metadata?: any;
}

export interface NCBHResult {
  title?: string;
  ten_bai?: string;
  ly_do_chon?: string;
  muc_tieu?: string;
  chuoi_hoat_dong?: string;
  phuong_an_ho_tro?: string;
  chia_se_nguoi_day?: string;
  nhan_xet_nguoi_du?: string;
  nguyen_nhan_giai_phap?: string;
  bai_hoc_kinh_nghiem?: string;
  objectives?: string;
  methodology?: string;
  observationFocus?: string;
  analysisPoints?: string;
  metadata?: any;
}

export interface AssessmentResult {
  title?: string;
  ten_ke_hoach?: string;
  muc_tieu?: string | string[];
  noi_dung_nhiem_vu?: string | object;
  purpose?: string;
  matrix?: string;
  structure?: string;
  rubric_text?: string;
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
  metadata?: any;
}

export type TemplateData = {
  name: string;
  data: ArrayBuffer;
};

// UI & Engine Props
export interface LessonEngineProps {
  lessonGrade: string;
  setLessonGrade: (value: string) => void;
  selectedChuDeSo: string;
  setSelectedChuDeSo: (value: string) => void;
  lessonAutoFilledTheme: string;
  setLessonAutoFilledTheme: (value: string) => void;
  lessonDuration: string;
  setLessonDuration: (value: string) => void;
  selectedChuDe: any; // Type from ppct-database
  setSelectedChuDe: (value: any) => void;
  setLessonMonth: (value: string) => void;
  shdcSuggestion: string;
  setShdcSuggestion: (value: string) => void;
  hdgdSuggestion: string;
  setHdgdSuggestion: (value: string) => void;
  shlSuggestion: string;
  setShlSuggestion: (value: string) => void;
  curriculumTasks: LessonTask[];
  distributeTimeForTasks: () => void;
  showCurriculumTasks: boolean;
  setShowCurriculumTasks: (value: boolean) => void;
  lessonTasks: LessonTask[];
  updateLessonTask: (id: string, field: any, value: any) => void;
  removeLessonTask: (id: string) => void;
  addLessonTask: () => void;
  lessonCustomInstructions: string;
  setLessonCustomInstructions: (value: string) => void;
  lessonResult: LessonResult | null;
  setLessonResult: (result: LessonResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
  isAuditing: boolean;
  onAudit: () => void;
  auditResult: string | null;
  auditScore: number;
  setSuccess: (msg: string | null) => void;
  setError: (msg: string | null) => void;
  success: string | null;
  error: string | null;
  lessonTopic: string;
  setLessonTopic: (value: string) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  onRefineSection: (content: string, instruction: string, model?: string) => Promise<ActionResult>;
  onGenerateSection?: (section: any, context: any, stepInstruction?: string) => Promise<ActionResult>;
  lessonFullPlanMode: boolean;
  setLessonFullPlanMode: (value: boolean) => void;
  lessonFile: { mimeType: string; data: string; name: string } | null;
  setLessonFile: (file: { mimeType: string; data: string; name: string } | null) => void;
}

export interface MeetingTabProps {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedSession: string;
  setSelectedSession: (value: string) => void;
  meetingKeyContent: string;
  setMeetingKeyContent: (value: string) => void;
  meetingConclusion: string;
  setMeetingConclusion: (value: string) => void;
  meetingResult: MeetingResult | null;
  setMeetingResult: (result: MeetingResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
}

export interface EventTabProps {
  selectedGradeEvent: string;
  setSelectedGradeEvent: (value: string) => void;
  selectedEventMonth: string;
  setSelectedEventMonth: (value: string) => void;
  autoFilledTheme: string;
  setAutoFilledTheme: (value: string) => void;
  eventBudget: string;
  setEventBudget: (value: string) => void;
  eventChecklist: string;
  setEventChecklist: (value: string) => void;
  eventCustomInstructions: string;
  setEventCustomInstructions: (value: string) => void;
  eventResult: EventResult | null;
  setEventResult: (result: EventResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
}

export interface NCBHTabProps {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  ncbhGrade: string;
  setNcbhGrade: (value: string) => void;
  ncbhTopic: string;
  setNcbhTopic: (value: string) => void;
  ncbhCustomInstructions: string;
  setNcbhCustomInstructions: (value: string) => void;
  ncbhResult: NCBHResult | null;
  setNcbhResult: (result: NCBHResult | null) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
  copyToClipboard: (text: string) => void;
  ppctData: any[];
}

export interface AssessmentTabProps {
  assessmentGrade: string;
  setAssessmentGrade: (value: string) => void;
  assessmentTerm: string;
  setAssessmentTerm: (value: string) => void;
  assessmentProductType: string;
  setAssessmentProductType: (value: string) => void;
  assessmentTopic: string;
  setAssessmentTopic: (value: string) => void;
  assessmentTemplate: TemplateData | null;
  onTemplateUpload: (file: File) => void;
  assessmentResult: AssessmentResult | null;
  isGenerating: boolean;
  onGenerate: () => void;
  isExporting: boolean;
  onExport: () => void;
}
