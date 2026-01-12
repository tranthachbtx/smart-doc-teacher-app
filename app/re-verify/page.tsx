
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
            setMessage('Äang xá»­ lÃ½ xuáº¥t file chuáº©n DOCX...');

            const testData: LessonResult = {
                ten_bai: "XÃC_NHáº¬N_CUá»I_CÃ™NG_HOÃ€N_Háº¢O",
                muc_tieu_kien_thuc: "1. Äá»‹nh dáº¡ng Word chuáº©n.\n2. Icon hiá»ƒn thá»‹ chÃ­nh xÃ¡c.",
                muc_tieu_nang_luc: "NÄƒng lá»±c tá»± kiá»ƒm tra.",
                muc_tieu_pham_chat: "ChÄƒm chá»‰.",
                tich_hop_nls: "á»¨ng dá»¥ng CNTT.",
                tich_hop_dao_duc: "Äáº¡o Ä‘á»©c nghá» nghiá»‡p.",
                thiet_bi_day_hoc: "MÃ¡y tÃ­nh.",
                hoat_dong_khoi_dong: "d) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}}\nGV Giao bÃ i\n{{cot_2}}\nHS thá»±c hiá»‡n",
                hoat_dong_kham_pha: "d) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}}\nKhÃ¡m phÃ¡\n{{cot_2}}\nHÃ nh Ä‘á»™ng",
                hoat_dong_luyen_tap: "d) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}}\nLuyá»‡n táº­p\n{{cot_2}}\nKáº¿t quáº£",
                hoat_dong_van_dung: "d) Tá»• chá»©c thá»±c hiá»‡n: {{cot_1}}\nVáº­n dá»¥ng\n{{cot_2}}\nThá»±c táº¿",
                ho_so_day_hoc: "Phá»¥ lá»¥c.",
                huong_dan_ve_nha: "BÃ i táº­p."
            };

            const result = await DocumentExportSystem.getInstance().exportLesson(
                testData
            );

            if (result) {
                setStatus('success');
                setMessage('âœ… THÃ€NH CÃ”NG! File Word Ä‘Ã£ Ä‘Æ°á»£c táº£i xuá»‘ng.');
            }

        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(`âŒ Lá»—i: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                <h1 className="text-xl font-bold text-slate-900 mb-6">Tá»± Kiá»ƒm Tra Láº§n Cuá»‘i (Final Self-Test)</h1>
                <button
                    id="test-button"
                    onClick={runReTest}
                    disabled={status === 'running'}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 disabled:grayscale transition-all"
                >
                    {status === 'running' ? 'â³ ÄANG Xá»¬ LÃ...' : 'ðŸ“¥ CLICK Äá»‚ Táº¢I FILE WORD'}
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
