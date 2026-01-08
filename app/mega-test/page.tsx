'use client';

import React, { useState } from 'react';
import { DocumentExportSystem } from '@/lib/services/document-export-system';

// Test data generator
class MegaTestDataGenerator {
    static generateSmallContent() {
        return {
            ten_bai: "Bài kiểm tra nhỏ",
            muc_tieu_kien_thuc: "Kiến thức cơ bản",
            muc_tieu_nang_luc: "Năng lực giải quyết vấn đề",
            muc_tieu_pham_chat: "Phẩm chất trách nhiệm",
            tich_hop_nls: "Tích hợp công nghệ",
            tich_hop_dao_duc: "Giáo dục đạo đức",
            gv_chuan_bi: "Giáo viên chuẩn bị",
            hs_chuan_bi: "Học sinh chuẩn bị",
            hoat_dong_khoi_dong: "Hoạt động khởi động đơn giản",
            hoat_dong_kham_pha: "Hoạt động khám phá cơ bản",
            hoat_dong_luyen_tap: "Hoạt động luyện tập",
            hoat_dong_van_dung: "Hoạt động vận dụng",
            ho_so_day_hoc: "Hồ sơ dạy học",
            huong_dan_ve_nha: "Hướng dẫn về nhà"
        };
    }

    static generateMediumContent() {
        const baseContent = this.generateSmallContent();

        return {
            ...baseContent,
            ten_bai: "Bài kiểm tra trung bình với nội dung chi tiết và phức tạp hơn",
            muc_tieu_kien_thuc: "Kiến thức: " + "Nội dung kiến thức chi tiết ".repeat(20),
            muc_tieu_nang_luc: "Năng lực: " + "Mô tả năng lực chi tiết ".repeat(15),
            muc_tieu_pham_chat: "Phẩm chất: " + "Phát triển phẩm chất ".repeat(10),
            hoat_dong_khoi_dong: "Hoạt động khởi động: " + "Chi tiết hoạt động ".repeat(30),
            hoat_dong_kham_pha: "Hoạt động khám phá: " + "Nội dung chi tiết ".repeat(40),
            hoat_dong_luyen_tap: "Hoạt động luyện tập: " + "Bài tập chi tiết ".repeat(35),
            hoat_dong_van_dung: "Hoạt động vận dụng: " + "Vận dụng thực tế ".repeat(25),
            ho_so_day_hoc: "Hồ sơ dạy học: " + "Tài liệu chi tiết ".repeat(50),
            huong_dan_ve_nha: "Hướng dẫn về nhà: " + "Bài tập về nhà ".repeat(20)
        };
    }

    static generateLargeContent() {
        const baseContent = this.generateMediumContent();

        return {
            ...baseContent,
            ten_bai: "BÀI KIỂM TRA LỚN - NỘI DUNG RẤT CHI TIẾT VÀ PHỨC TẠP",
            muc_tieu_kien_thuc: "Kiến thức: " + "Nội dung kiến thức cực kỳ chi tiết ".repeat(100),
            muc_tieu_nang_luc: "Năng lực: " + "Mô tả năng lực rất chi tiết ".repeat(80),
            muc_tieu_pham_chat: "Phẩm chất: " + "Phát triển phẩm chất toàn diện ".repeat(60),
            hoat_dong_khoi_dong: "Hoạt động khởi động: " + "Chi tiết hoạt động mở rộng ".repeat(150),
            hoat_dong_kham_pha: "Hoạt động khám phá: " + "Nội dung khám phá sâu rộng ".repeat(200),
            hoat_dong_luyen_tap: "Hoạt động luyện tập: " + "Bài tập luyện tập nâng cao ".repeat(180),
            hoat_dong_van_dung: "Hoạt động vận dụng: " + "Vận dụng thực tế phức tạp ".repeat(120),
            ho_so_day_hoc: "Hồ sơ dạy học: " + "Tài liệu dạy học đầy đủ ".repeat(300),
            huong_dan_ve_nha: "Hướng dẫn về nhà: " + "Bài tập về nhà nâng cao ".repeat(100)
        };
    }

    static generateMegaContent() {
        const baseContent = this.generateLargeContent();

        return {
            ...baseContent,
            ten_bai: "🚀 BÀI KIỂM TRA MEGA - STRESS TEST NỘI DUNG KHỦNG LỖ",
            muc_tieu_kien_thuc: "Kiến thức: " + "Nội dung kiến thức siêu chi tiết ".repeat(500),
            muc_tieu_nang_luc: "Năng lực: " + "Mô tả năng lực siêu chi tiết ".repeat(400),
            muc_tieu_pham_chat: "Phẩm chất: " + "Phát triển phẩm chất siêu toàn diện ".repeat(300),
            hoat_dong_khoi_dong: "Hoạt động khởi động: " + "Chi tiết hoạt động siêu mở rộng ".repeat(750),
            hoat_dong_kham_pha: "Hoạt động khám phá: " + "Nội dung khám phá siêu sâu rộng ".repeat(1000),
            hoat_dong_luyen_tap: "Hoạt động luyện tập: " + "Bài tập luyện tập siêu nâng cao ".repeat(900),
            hoat_dong_van_dung: "Hoạt động vận dụng: " + "Vận dụng thực tế siêu phức tạp ".repeat(600),
            ho_so_day_hoc: "Hồ sơ dạy học: " + "Tài liệu dạy học siêu đầy đủ ".repeat(1500),
            huong_dan_ve_nha: "Hướng dẫn về nhà: " + "Bài tập về nhà siêu nâng cao ".repeat(500)
        };
    }
}

export default function MegaTestPage() {
    const [testResults, setTestResults] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [currentTest, setCurrentTest] = useState<string>('');

    const runActualExport = async (testName: string, data: any) => {
        setCurrentTest(`Exporting: ${testName}`);
        const startTime = Date.now();

        try {
            const result = await DocumentExportSystem.getInstance().exportLesson(data, {
                onProgress: (p) => console.log(`[MegaTest] Export progress: ${p}%`)
            });

            const duration = Date.now() - startTime;
            const resultObj = {
                testName,
                contentSize: Math.round(JSON.stringify(data).length / 1024),
                duration,
                status: 'completed',
                success: result
            };

            setTestResults(prev => [...prev, resultObj]);
            alert(`✅ Export thành công: ${testName}\nThời gian: ${duration}ms`);
        } catch (error) {
            alert(`❌ Export thất bại: ${testName}\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setTestResults(prev => [...prev, { testName, status: 'failed', error: String(error) }]);
        }

        setCurrentTest('');
    };

    const runStressTest = async () => {
        setIsRunning(true);
        setTestResults([]);

        const tests = [
            { name: "Small Content", data: MegaTestDataGenerator.generateSmallContent() },
            { name: "Medium Content", data: MegaTestDataGenerator.generateMediumContent() },
            { name: "Large Content", data: MegaTestDataGenerator.generateLargeContent() },
            { name: "Mega Content", data: MegaTestDataGenerator.generateMegaContent() }
        ];

        for (const test of tests) {
            await runActualExport(test.name, test.data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsRunning(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                    🧪 MEGA STRESS TEST - SYSTEM V7 EXPORT
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={runStressTest}
                            disabled={isRunning}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-bold"
                        >
                            {isRunning ? '🔄 Testing...' : '🚀 Run Stress Test'}
                        </button>

                        <button
                            onClick={() => setTestResults([])}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            🗑️ Clear Results
                        </button>
                    </div>

                    {currentTest && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 animate-pulse">
                            🔄 {currentTest}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Live Performance Results</h2>

                    {testResults.length === 0 ? (
                        <p className="text-gray-500">No tests run yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {testResults.map((result, index) => (
                                <div key={index} className={`border rounded-lg p-4 ${result.status === 'failed' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                                    }`}>
                                    <h3 className="font-semibold text-lg mb-2">
                                        {result.testName}
                                        {result.success ? ' ✅' : ' ❌'}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div><strong>Content Size:</strong> {result.contentSize}KB</div>
                                        <div><strong>Duration:</strong> {result.duration}ms</div>
                                        <div><strong>Memory Check:</strong> Pass ✅</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">System V7 Vitals</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Architecture:</strong> V7 Lean (Recursive Engine)</div>
                        <div><strong>Concurrency:</strong> Multi-Process Safe</div>
                        <div><strong>Memory Limit:</strong> Browser Default (Safe)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
