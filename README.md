# Science Video Aggregator / Tập hợp dự án khoa học

This is a web platform designed to aggregate and share science project videos, providing detailed explanations of the principles behind each experiment.
Đây là một nền tảng web được thiết kế để tập hợp và chia sẻ các video về các dự án khoa học, cung cấp giải thích chi tiết về các nguyên lý hoạt động đằng sau mỗi thí nghiệm.

## 🌟 Key Features / Tính năng chính

- **Video Player / Trình phát Video**: Supports YouTube & Local files / Hỗ trợ YouTube & Video cục bộ.
- **LaTeX Explanations / Giải thích LaTeX**: Academic-standard rendering / Hiển thị theo tiêu chuẩn học thuật.
- **Split-Screen UI / Giao diện Chia đôi**: Video on left, explanation on right / Video bên trái, giải thích bên phải.
- **Bilingual / Đa ngôn ngữ**: English & Vietnamese support / Hỗ trợ Anh & Việt.
- **Affiliate & Ads / Tiếp thị & Quảng cáo**: Monetization ready / Sẵn sàng để kiếm tiền.

## 🛠️ Tech Stack / Công nghệ sử dụng
- **Frontend**: HTML5, CSS3, Vanilla JS, MathJax 3.
- **Backend**: Node.js, Express (Serverless via Vercel).
- **Database**: LibSQL (Turso) for Cloud, SQLite for Local.

## 📁 Project Structure / Cấu trúc thư mục

```text
web/
├── public/             # Frontend source
├── server/             # Backend source
├── docs/               # Documentation & Guides
├── vercel.json         # Deployment configuration
└── README.md           # This file
```

## 🚀 Installation & Deployment / Cài đặt & Triển khai

### Local Development / Chạy máy cục bộ:
1. **Install**: `npm install`
2. **Start**: `npm start` (Access: `http://localhost:3000`)

### Deployment (Internet):
Follow the [Deployment Guide](./docs/GUIDE_DEPLOYMENT.txt) to launch on **Vercel** using the CLI.
Làm theo [Hướng dẫn Triển khai](./docs/GUIDE_DEPLOYMENT.txt) để đưa web lên **Vercel** bằng CLI.

## 📄 License / Giấy phép
MIT
