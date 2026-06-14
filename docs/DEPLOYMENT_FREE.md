# Hướng dẫn Triển khai Miễn phí - Green Night Zero

## Tổng quan
Dự án sử dụng **Vercel (miễn phí) + Turso (miễn phí)** để triển khai hoàn toàn miễn phí.

---

## 1. Cơ sở dữ liệu: Turso (LibSQL)

Turso cung cấp gói miễn phí với:
- 9GB lưu trữ
- 1 tỷ dòng đọc/tháng
- 25 triệu dòng ghi/tháng
- Unlimited databases

### Thiết lập Turso:

```bash
# Cài đặt Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Đăng nhập
turso auth login

# Tạo database
turso db create greennightzero

# Lấy URL và Token
turso db show greennightzero
turso db tokens create greennightzero
```

### Cấu hình environment variables:

Trong Vercel Dashboard, thêm các biến sau:
```
TURSO_DATABASE_URL=libsql://your-db.your-org.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
```

---

## 2. Hosting & Serverless Functions: Vercel

Vercel gói Hobby (miễn phí):
- Unlimited deployments
- 100GB bandwidth/tháng
- Serverless functions (10GB-hours/tháng)
- Automatic HTTPS

### Deploy lên Vercel:

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login

# Deploy
vercel --prod
```

### Hoặc kết nối GitHub:
1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com)
3. Import repository
4. Thêm environment variables trong Vercel Dashboard
5. Deploy tự động khi push code

---

## 3. Environment Variables

Các biến môi trường cần thiết:

### Bắt buộc:
```bash
# Database
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# JWT Secret
JWT_SECRET=your-secret-key-here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FEEDBACK_TO_EMAIL=your-email@gmail.com

# AI APIs
GOOGLE_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
```

### Tùy chọn:
```bash
NODE_ENV=production
PORT=3000
```

---

## 4. Kiểm tra trước khi Deploy

```bash
# Chạy local với SQLite
npm run dev

# Build kiểm tra
npm run build

# Kiểm tra links
npm run check-links
```

---

## 5. Troubleshooting

### Lỗi thường gặp:

**1. Database connection failed:**
- Kiểm tra TURSO_DATABASE_URL và TURSO_AUTH_TOKEN
- Đảm bảo database đã được tạo trên Turso

**2. Serverless function timeout:**
- Tối ưu queries, thêm indexes
- Sử dụng compression middleware

**3. CORS errors:**
- Middleware cors() đã được cấu hình trong server.js

**4. Static files not loading:**
- Kiểm tra routes trong vercel.json
- Đảm bảo file tồn tại trong public/

**5. Database error / Không hiện video trên Vercel:**
- Nếu không dùng Turso, DB fallback tại `/tmp/data.db` (tự động).
- Seed data chạy lại mỗi cold start. Dữ liệu user KHÔNG persistent nếu thiếu Turso.
- Proxy route `/api/proxy-image` hoạt động độc lập với DB — logo vẫn hiển thị.
- Logo local tại `/assets/images/ui/gnz-logo.png`.

---

## 6. Chi phí

| Dịch vụ | Gói | Chi phí |
|---------|-----|---------|
| Vercel | Hobby | $0/tháng |
| Turso | Free | $0/tháng |
| **Tổng** | | **$0/tháng** |

### Giới hạn gói miễn phí:

**Vercel:**
- 100GB bandwidth/tháng
- 10GB-hours serverless functions
- Unlimited domains

**Turso:**
- 9GB storage
- 1B read rows/tháng
- 25M write rows/tháng

> 💡 Nếu vượt quá giới hạn, nâng cấp lên gói trả phí hoặc tối ưu hóa ứng dụng.

---

## 7. Sao lưu & Phục hồi

### Export dữ liệu từ Turso:
```bash
turso db shell greennightzero ".dump" > backup.sql
```

### Import dữ liệu:
```bash
turso db shell greennightzero < backup.sql
```

---

## 8. Monitoring

- **Vercel Analytics**: Theo dõi traffic, performance
- **Turso Dashboard**: Theo dõi database usage
- **Logs**: `vercel logs` để xem serverless function logs

---

## 9. Cập nhật Code

```bash
# Push lên Git
git add .
git commit -m "Update feature"
git push

# Vercel tự động deploy (nếu kết nối GitHub)
# Hoặc deploy thủ công:
vercel --prod
```

---

## 10. Tài liệu tham khảo

- [Vercel Docs](https://vercel.com/docs)
- [Turso Docs](https://docs.turso.tech)
- [Express.js Docs](https://expressjs.com)
- [LibSQL Client](https://github.com/tursodatabase/libsql-client-ts)
