import { PPCT_KHOI_10, PPCT_KHOI_11, PPCT_KHOI_12 } from './lib/data/ppct-database';
import { CHUONG_TRINH_LOP_10, CHUONG_TRINH_LOP_11, CHUONG_TRINH_LOP_12 } from './lib/data/kntt-curriculum-database';

function auditGrade(gradeNum: number, ppctData: any, curriculumData: any) {
    console.log(`\n=== KIỂM TOÁN KHỐI ${gradeNum} ===`);
    const results: any[] = [];

    ppctData.chu_de.forEach((ppctCd: any) => {
        const ma = `${gradeNum}.${ppctCd.chu_de_so}`;
        const curriculumCd = curriculumData.chu_de.find((c: any) => c.ma === ma);

        if (!curriculumCd) {
            results.push({ ma, status: 'MISSING', error: 'Không tìm thấy trong curriculum database' });
            return;
        }

        const hdgdPeriods = ppctCd.hdgd; // Số tiết HĐGD theo PPCT
        const activities = curriculumCd.hoat_dong || [];
        const totalTasks = activities.reduce((acc: number, curr: any) => acc + (curr.nhiem_vu ? curr.nhiem_vu.length : 0), 0);

        // Ước tính thời gian: 1 tiết HĐGD = 45 phút. 
        // Nếu có 4 tiết HĐGD, cần ít nhất 180 phút nội dung (hoặc 4-6 nhiệm vụ lớn).
        const targetMinutes = hdgdPeriods * 45;
        let totalMinutes = 0;
        activities.forEach((hd: any) => {
            (hd.nhiem_vu || []).forEach((nv: any) => {
                const timeStr = nv.thoi_luong_de_xuat || "0";
                const mins = parseInt(timeStr.replace(/[^0-9]/g, '')) || 0;
                totalMinutes += mins;
            });
        });

        const gap = targetMinutes - totalMinutes;
        const taskRatio = totalTasks / hdgdPeriods;

        let status = 'OK';
        let remark = '';

        if (taskRatio < 1 || totalMinutes < targetMinutes * 0.7) {
            status = 'WARNING';
            remark = `Thiểu dữ liệu: Cần ${hdgdPeriods} tiết (${targetMinutes}p), hiện có ${totalTasks} NV (${totalMinutes}p).`;
        }

        results.push({
            ma,
            ten: ppctCd.ten,
            tietPPCT: hdgdPeriods,
            soNV: totalTasks,
            tongPhut: totalMinutes,
            status,
            remark
        });
    });

    return results;
}

const audit10 = auditGrade(10, PPCT_KHOI_10, CHUONG_TRINH_LOP_10);
const audit11 = auditGrade(11, PPCT_KHOI_11, CHUONG_TRINH_LOP_11);
const audit12 = auditGrade(12, PPCT_KHOI_12, CHUONG_TRINH_LOP_12);

console.log("\n--- KẾT QUẢ KIỂM TOÁN TỔNG THỂ ---");
[...audit10, ...audit11, ...audit12].forEach(r => {
    const icon = r.status === 'OK' ? '✅' : (r.status === 'WARNING' ? '⚠️' : '❌');
    console.log(`${icon} [${r.ma}] ${r.ten.padEnd(45)} | PPCT: ${r.tietPPCT}t | NV: ${r.soNV} | Phút: ${r.tongPhut} | ${r.remark}`);
});
