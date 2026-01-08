
"use client";

import React, { useState } from 'react';
import { DocumentExportSystem } from '@/lib/services/document-export-system';
import { LessonResult } from '@/lib/types';

export default function ReVerificationPage() {
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const runReTest = async () => {
        try {
            setStatus('running');
            setMessage('Đang xử lý xuất file chuẩn DOCX...');

            const testData: LessonResult = {
                ten_bai: "XÁC_NHẬN_CUỐI_CÙNG_HOÀN_HẢO",
                muc_tieu_kien_thuc: "1. Định dạng Word chuẩn.\n2. Icon hiển thị chính xác.",
                muc_tieu_nang_luc: "Năng lực tự kiểm tra.",
                muc_tieu_pham_chat: "Chăm chỉ.",
                tich_hop_nls: "Ứng dụng CNTT.",
                tich_hop_dao_duc: "Đạo đức nghề nghiệp.",
                thiet_bi_day_hoc: "Máy tính.",
                hoat_dong_khoi_dong: "d) Tổ chức thực hiện: {{cot_1}}\nGV Giao bài\n{{cot_2}}\nHS thực hiện",
                hoat_dong_kham_pha: "d) Tổ chức thực hiện: {{cot_1}}\nKhám phá\n{{cot_2}}\nHành động",
                hoat_dong_luyen_tap: "d) Tổ chức thực hiện: {{cot_1}}\nLuyện tập\n{{cot_2}}\nKết quả",
                hoat_dong_van_dung: "d) Tổ chức thực hiện: {{cot_1}}\nVận dụng\n{{cot_2}}\nThực tế",
                ho_so_day_hoc: "Phụ lục.",
                huong_dan_ve_nha: "Bài tập."
            };

            const result = await DocumentExportSystem.getInstance().exportLesson(
                testData
            );

            if (result) {
                setStatus('success');
                setMessage('✅ THÀNH CÔNG! File Word đã được tải xuống.');
            }

        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(`❌ Lỗi: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                <h1 className="text-xl font-bold text-slate-900 mb-6">Tự Kiểm Tra Lần Cuối (Final Self-Test)</h1>
                <button
                    id="test-button"
                    onClick={runReTest}
                    disabled={status === 'running'}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:grayscale transition-all"
                >
                    {status === 'running' ? '⏳ ĐANG XỬ LÝ...' : '📥 CLICK ĐỂ TẢI FILE WORD'}
                </button>
                {status === 'success' && (
                    <div id="success-msg" className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
