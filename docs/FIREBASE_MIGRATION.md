# Hướng dẫn Chuyển đổi từ Vercel + Turso sang Firebase

## Tổng quan
Tài liệu này hướng dẫn chi tiết cách chuyển đổi dự án Green Night Zero từ Vercel + Turso sang Firebase (Hosting + Cloud Functions + Firestore).

## Các bước thực hiện

### 1. Chuẩn bị Firebase Project

#### a. Tạo Firebase Project
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có (`greennightzero`)
3. Bật các dịch vụ sau:
   - **Firestore Database** (chế độ Production)
   - **Authentication** (nếu cần)
   - **Cloud Functions** (cần nâng cấp lên Blaze Plan - trả phí theo mức sử dụng)
   - **Hosting**

#### b. Tạo Service Account Key
1. Vào **Project Settings** > **Service Accounts**
2. Click **Generate new private key**
3. Lưu file JSON với tên `firebase-service-account.json`
4. Copy file này vào thư mục `server/database/` (KHÔNG commit lên Git)

```bash
# Cấu trúc thư mục sau khi hoàn tất
server/database/
├── firebase-service-account.json  # File bí mật, không commit
├── firebase-service-account.json.example  # File mẫu để tham khảo
├── db.js                          # SQLite/Turso (giữ lại cho local)
├── db-firestore.js               # Firestore adapter (mới)
└── data.db                        # SQLite local
```

### 2. Cấu hình Environment Variables

Cập nhật file `.env` hoặc `.env.production`:

```env
# Firebase Configuration
GOOGLE_APPLICATION_CREDENTIALS=./server/database/firebase-service-account.json
FIRESTORE_EMULATOR_HOST=localhost:8080  # Chỉ dùng cho local testing

# JWT Secret (giữ nguyên hoặc tạo mới)
JWT_SECRET=your-secret-key-here

# Email Configuration (giữ nguyên)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
FEEDBACK_TO_EMAIL=you@example.com

# Node Environment
NODE_ENV=production
```

### 3. Cài đặt Dependencies

Đã có sẵn trong `package.json`:
- `firebase-admin`: Firebase Admin SDK
- `firebase-functions`: Cloud Functions framework

```bash
npm install
```

### 4. Migration Dữ liệu (Tuỳ chọn)

Nếu muốn chuyển dữ liệu từ SQLite sang Firestore:

```bash
# Chạy script migration
npm run seed-firestore
```

**Lưu ý:** Script này sẽ:
- Đọc dữ liệu từ SQLite (`data.db`)
- Ghi vào Firestore collections
- Chỉ chạy một lần khi deploy lần đầu

### 5. Deploy lên Firebase

#### a. Login Firebase CLI
```bash
npx firebase login
```

#### b. Khởi tạo Firebase (nếu chưa)
```bash
npx firebase init
```

Chọn các tính năng:
- ✅ Firestore
- ✅ Functions
- ✅ Hosting

#### c. Deploy
```bash
# Deploy toàn bộ
npm run deploy:all

# Hoặc deploy riêng lẻ
npm run deploy  # Chỉ hosting và functions
```

### 6. Kiểm tra sau Deploy

1. **Kiểm tra Hosting**: Truy cập URL Firebase Hosting
2. **Kiểm tra API**: Test các endpoint `/api/videos`, `/api/auth`, etc.
3. **Kiểm tra Firestore**: Vào Firebase Console > Firestore Database để xem dữ liệu

### 7. Cấu hình bổ sung (nếu cần)

#### a. Firestore Indexes
Một số query phức tạp cần index. Firebase sẽ tự động gợi ý tạo index khi cần.

#### b. CORS Configuration
Đã được cấu hình trong `index.js`:
```javascript
exports.api = onRequest({ cors: true }, app);
```

#### c. Environment Variables trên Firebase Console
Vào **Project Settings** > **Service Accounts** > **Manage service account permissions**

Hoặc set variables khi deploy:
```bash
firebase functions:secrets:set JWT_SECRET
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
```

## So sánh kiến trúc

### Trước (Vercel + Turso)
```
Frontend (Vercel Hosting)
    ↓
API Routes (Vercel Serverless Functions)
    ↓
Database (Turso/LibSQL)
```

### Sau (Firebase)
```
Frontend (Firebase Hosting)
    ↓
Cloud Functions (Firebase Functions)
    ↓
Database (Firestore)
```

## Lưu ý quan trọng

### 1. Chi phí
- Firebase có free tier hào phóng nhưng Cloud Functions cần Blaze Plan
- Theo dõi usage tại **Firebase Console** > **Usage and billing**

### 2. Cold Starts
- Cloud Functions có thể có cold start (~1-2 giây)
- Consider dùng `minInstances` cho functions quan trọng (có phí)

### 3. Firestore Query Limits
- Firestore không hỗ trợ `OFFSET` trực tiếp
- Đã implement pagination bằng `startAfter()` trong `db-firestore.js`

### 4. Local Development
```bash
# Chạy Firebase Emulators (requires Java)
npm run serve

# Hoặc chạy local server với SQLite
npm run dev
```

### 5. Backup dữ liệu
- Export Firestore data định kỳ
- Giữ SQLite local như backup

## Khắc phục sự cố

### Lỗi: "Failed to initialize Firebase"
- Kiểm tra file `firebase-service-account.json` tồn tại
- Verify service account có quyền Firestore Admin

### Lỗi: "Missing or insufficient permissions"
- Vào **Firestore Rules** và set rules phù hợp:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null || request.headers['X-App-ID'] == 'greennightzero';
    }
  }
}
```

### Lỗi: "Resource has been exhausted"
- Firestore có giới hạn rate limits
- Implement retry logic hoặc giảm frequency của queries

## Tài liệu tham khảo

- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [Cloud Functions Docs](https://firebase.google.com/docs/functions)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firebase Pricing](https://firebase.google.com/pricing)

---
**Liên hệ hỗ trợ:** Nếu gặp vấn đề, check logs tại:
- Firebase Console > Functions > Logs
- Local: `firebase-debug.log`
