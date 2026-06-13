/**
 * System Status & Automation Manifest
 * Liệt kê toàn bộ các tính năng tự động hóa đã cài đặt cho dự án.
 */
console.log('====================================================');
console.log('   SCIENCE VIDEO AGGREGATOR - AUTOMATION MANIFEST   ');
console.log('====================================================');

const automationFeatures = [
  { name: 'AI Translation Engine', cmd: 'npm run translate', desc: 'Dịch tự động Tiêu đề, Mô tả, Bản tin và Tự chèn Danh mục mới vào script.js' },
  { name: 'Self-Healing Watchdog', cmd: 'npm run watchdog', desc: 'Tự động kiểm tra và khởi động lại server nếu website localhost bị sập.' },
  { name: 'Video Link Validator', cmd: 'npm run check-links', desc: 'Quét toàn bộ video để tìm lỗi "Unavailable" hoặc bị chặn nhúng.' },
  { name: 'Auto-News Logging', cmd: 'Auto-triggered', desc: 'Tự động đăng bản tin khi có Video mới hoặc thay đổi nội dung (trong db.js).' },
  { name: 'Manual News Tool', cmd: 'node scripts/add-update.js "Title" "Body"', desc: 'Đăng bản tin tùy chỉnh (AI tự dịch sang tiếng Việt).' },
  { name: 'Bilingual Explanations', cmd: 'Dynamic', desc: 'Tự động tải nội dung LaTeX (JSON/DB) dựa trên ngôn ngữ EN/VI.' },
  { name: 'Image Management', cmd: 'Edit modal', desc: 'Thêm ảnh bằng URL trực tiếp trong Edit modal (không cần upload).' },
  { name: 'Build Pipeline', cmd: 'npm run build', desc: 'Minify JS/CSS và tối ưu hóa tài nguyên trước khi triển khai.' }
];

console.log('\n[!] LỆNH TỰ ĐỘNG HÓA CÓ SẴN:');
automationFeatures.forEach((f, i) => {
  console.log(`${i+1}. ${f.name.padEnd(25)} | Lệnh: ${f.cmd.padEnd(35)}`);
  console.log(`   >> ${f.desc}`);
});

console.log('\n[!] CẤU TRÚC DATABASE (23 CỘT):');
console.log('    title, description, embedUrl, category, explanation, imageUrls, referenceLinks,');
console.log('    affiliateLinks, seriesTitle, partNumber, titleVi, descriptionVi, explanationVi,');
console.log('    topic, topicVi, explanationRaw, explanationViRaw, submittedBy, categoryVi,');
console.log('    seriesTitleVi, avgRating, ratingCount');

console.log('\n[!] LƯU Ý CHO AI AGENT TIẾP THEO (ẢNH / SƠ ĐỒ):');
console.log('    - \\includegraphics[Nhãn mô tả]{URL/Path} — Nhãn chỉ dùng alt + khi ảnh lỗi.');
console.log('    - Ưu tiên .svg ASCII-safe hoặc Cloudinary URL; KHÔNG dùng .png tĩnh nếu có thể dùng SVG.');
console.log('    - Xác minh hình ảnh trực tiếp qua Edit modal gallery.');
console.log('    - Assets cục bộ: public/assets/images/projects/');
console.log('    - Chi tiết: docs/DEVELOPER_HANDOVER.md mục "Visual Assets"');
console.log('====================================================');
