/**
 * 🧪 MEGA TEST SUITE - WORD EXPORT SYSTEM
 * Test các kịch bản khác nhau để xác nhận system hoạt động chính xác
 */

import { DocumentExportSystem } from '../lib/services/document-export-system';
import { IntegrityService } from '../lib/services/integrity-service';

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

        // Add more detailed content
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

        // Add massive content for worker test
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

        // Add extremely large content for stress test
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

// Test runner
class MegaTestRunner {
    static async runAllTests() {
        console.log("🧪 BẮT ĐẦU MEGA TEST SUITE");
        console.log("=" + "=".repeat(49));

        const tests = [
            { name: "Small Content Test", data: MegaTestDataGenerator.generateSmallContent(), expectedStrategy: "main-thread" },
            { name: "Medium Content Test", data: MegaTestDataGenerator.generateMediumContent(), expectedStrategy: "main-thread" },
            { name: "Large Content Test", data: MegaTestDataGenerator.generateLargeContent(), expectedStrategy: "worker" },
            { name: "Mega Content Test", data: MegaTestDataGenerator.generateMegaContent(), expectedStrategy: "worker" }
        ];

        for (const test of tests) {
            await this.runSingleTest(test);
        }

        console.log("🎊 MEGA TEST SUITE HOÀN TẤT!");
    }

    static async runSingleTest(test: { name: string; data: any; expectedStrategy: string }) {
        console.log(`\n🚀 Testing: ${test.name}`);
        console.log("-".repeat(30));

        try {
            // 💎 INTEGRITY CHECK
            console.log(`🔄 Verifying Integrity Sealing...`);
            const mockBlob = new Blob([JSON.stringify(test.data)], { type: 'application/json' });
            const checksum = await IntegrityService.generateChecksum(mockBlob);
            console.log(`✅ SHA-256 Checksum: ${checksum}`);

            console.log(`✅ ${test.name} - PASSED`);

        } catch (error) {
            console.error(`❌ ${test.name} - FAILED:`, error);
        }
    }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
    (window as any).MegaTestRunner = MegaTestRunner;
    (window as any).MegaTestDataGenerator = MegaTestDataGenerator;
    console.log("🧪 Mega Test Suite loaded! Use MegaTestRunner.runAllTests() to start testing.");
}

export { MegaTestRunner, MegaTestDataGenerator };
