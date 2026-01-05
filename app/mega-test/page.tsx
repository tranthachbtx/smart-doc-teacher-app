'use client';

import React, { useState } from 'react';
import { ExportService } from '@/lib/services/export-service';
import { ExportOptimizer } from '@/lib/services/export-optimizer';

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

    const runSingleTest = async (testName: string, data: any, expectedStrategy: string) => {
        setCurrentTest(testName);
        
        try {
            // Start monitoring
            ExportOptimizer.startMonitoring();
            
            // Predict risk
            const risk = ExportOptimizer.predictExportRisk(data);
            
            // Validate content
            const validation = ExportOptimizer.validateContent(data);
            
            // Calculate content size
            const contentSize = JSON.stringify(data).length;
            const useWorker = contentSize > 50000; // LARGE_CONTENT_THRESHOLD
            const actualStrategy = useWorker ? "worker" : "main-thread";
            
            // Get performance report
            const report = ExportOptimizer.getPerformanceReport();
            
            const result = {
                testName,
                riskLevel: risk.riskLevel,
                riskMessage: risk.message,
                validationValid: validation.valid,
                warnings: validation.warnings,
                contentSize: Math.round(contentSize / 1024),
                expectedStrategy,
                actualStrategy,
                strategyMatch: expectedStrategy === actualStrategy,
                duration: report.duration,
                memoryUsage: Math.round((report.memoryUsage || 0) / 1024),
                success: report.success,
                status: 'completed'
            };
            
            setTestResults(prev => [...prev, result]);
            
        } catch (error) {
            const result = {
                testName,
                error: error instanceof Error ? error.message : 'Unknown error',
                status: 'failed'
            };
            setTestResults(prev => [...prev, result]);
        }
    };

    const runAllTests = async () => {
        setIsRunning(true);
        setTestResults([]);
        
        const tests = [
            { name: "Small Content Test", data: MegaTestDataGenerator.generateSmallContent(), expectedStrategy: "main-thread" },
            { name: "Medium Content Test", data: MegaTestDataGenerator.generateMediumContent(), expectedStrategy: "main-thread" },
            { name: "Large Content Test", data: MegaTestDataGenerator.generateLargeContent(), expectedStrategy: "worker" },
            { name: "Mega Content Test", data: MegaTestDataGenerator.generateMegaContent(), expectedStrategy: "worker" }
        ];

        for (const test of tests) {
            await runSingleTest(test.name, test.data, test.expectedStrategy);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between tests
        }
        
        setCurrentTest('');
        setIsRunning(false);
    };

    const runActualExport = async (testName: string, data: any) => {
        setCurrentTest(`Exporting: ${testName}`);
        
        try {
            const fileName = `MegaTest_${testName.replace(/\s+/g, '_')}.docx`;
            const result = await ExportService.exportLessonToDocx(data, fileName, (percent) => {
                console.log(`Export progress: ${percent}%`);
            });
            
            alert(`✅ Export thành công: ${testName}\nFile: ${fileName}\nResult: ${result.success}`);
        } catch (error) {
            alert(`❌ Export thất bại: ${testName}\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        setCurrentTest('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
                    🧪 MEGA TEST SUITE - WORD EXPORT SYSTEM
                </h1>
                
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
                    
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={runAllTests}
                            disabled={isRunning}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
                        </button>
                        
                        <button
                            onClick={() => setTestResults([])}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        >
                            🗑️ Clear Results
                        </button>
                    </div>
                    
                    {currentTest && (
                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                            🔄 {currentTest}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
                    
                    {testResults.length === 0 ? (
                        <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
                    ) : (
                        <div className="space-y-4">
                            {testResults.map((result, index) => (
                                <div key={index} className={`border rounded-lg p-4 ${
                                    result.status === 'failed' ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                                }`}>
                                    <h3 className="font-semibold text-lg mb-2">
                                        {result.testName}
                                        {result.status === 'failed' ? ' ❌' : ' ✅'}
                                    </h3>
                                    
                                    {result.status === 'failed' ? (
                                        <p className="text-red-700">Error: {result.error}</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div><strong>Risk Level:</strong> {result.riskLevel}</div>
                                            <div><strong>Content Size:</strong> {result.contentSize}KB</div>
                                            <div><strong>Expected Strategy:</strong> {result.expectedStrategy}</div>
                                            <div><strong>Actual Strategy:</strong> {result.actualStrategy}</div>
                                            <div><strong>Strategy Match:</strong> {result.strategyMatch ? '✅ YES' : '❌ NO'}</div>
                                            <div><strong>Duration:</strong> {result.duration}ms</div>
                                            <div><strong>Memory Usage:</strong> {result.memoryUsage}KB</div>
                                            <div><strong>Validation:</strong> {result.validationValid ? '✅ Valid' : '❌ Invalid'}</div>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={() => {
                                            const testData = result.testName.includes('Small') ? MegaTestDataGenerator.generateSmallContent() :
                                                                  result.testName.includes('Medium') ? MegaTestDataGenerator.generateMediumContent() :
                                                                  result.testName.includes('Large') ? MegaTestDataGenerator.generateLargeContent() :
                                                                  MegaTestDataGenerator.generateMegaContent();
                                            runActualExport(result.testName, testData);
                                        }}
                                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                    >
                                        📄 Export Actual File
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">System Information</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Large Content Threshold:</strong> 50KB</div>
                        <div><strong>Worker Support:</strong> {typeof Worker !== 'undefined' ? '✅ Available' : '❌ Not Available'}</div>
                        <div><strong>Hardware Concurrency:</strong> {navigator.hardwareConcurrency || 'Unknown'} cores</div>
                        <div><strong>Memory API:</strong> {(performance as any).memory ? '✅ Available' : '❌ Not Available'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
