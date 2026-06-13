# Checklist Chuyển đổi Firebase

## ✅ Đã hoàn thành

### Files đã tạo/cập nhật:
- [x] `server/database/db-firestore.js` - Firestore database adapter
- [x] `server/routes/auth-firestore.js` - Auth routes cho Firestore
- [x] `server/routes/videos-firestore.js` - Videos routes cho Firestore
- [x] `scripts/seed-firestore.js` - Script migration dữ liệu
- [x] `server/database/firebase-service-account.json.example` - Sample service account
- [x] `docs/FIREBASE_MIGRATION.md` - Hướng dẫn chi tiết
- [x] `firestore.rules` - Firestore security rules
- [x] `firestore.indexes.json` - Firestore indexes
- [x] `firebase.json` - Cập nhật cấu hình Firebase
- [x] `package.json` - Thêm scripts mới
- [x] `.env.production` - Cập nhật environment variables
- [x] `.gitignore` - Thêm rules cho Firebase

### Scripts mới trong package.json:
- `npm run serve` - Chạy Firebase emulators local
- `npm run deploy` - Deploy hosting và functions
- `npm run deploy:all` - Deploy toàn bộ
- `npm run seed-firestore` - Migration dữ liệu sang Firestore

## 🔧 Cần thực hiện

### 1. Tạo Firebase Service Account
```bash
# 1. Truy cập Firebase Console
# 2. Project Settings > Service Accounts
# 3. Generate new private key
# 4. Lưu file vào server/database/firebase-service-account.json
```

⚠️ **QUAN TRỌNG**: Không commit file `firebase-service-account.json` lên Git!

### 2. Enable Firebase Services
Truy cập [Firebase Console](https://console.firebase.google.com/project/greennightzero):

- [ ] **Firestore Database**: Create database (Production mode)
- [ ] **Cloud Functions**: Enable (cần Blaze Plan)
- [ ] **Firebase Hosting**: Enable
- [ ] **Authentication**: (Tuỳ chọn, nếu cần)

### 3. Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase projects:list
firebase use greennightzero
```

### 4. Khởi tạo Firebase (nếu chưa)
```bash
firebase init
```
Chọn:
- ✅ Firestore
- ✅ Functions  
- ✅ Hosting

Sử dụng các file đã có sẵn:
- firestore.rules: `firestore.rules`
- firestore.indexes: `firestore.indexes.json`
- public directory: `public`
- functions directory: `.` (root)

### 5. Deploy Firestore Rules và Indexes
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 6. Migration dữ liệu (Tuỳ chọn)
```bash
# Đảm bảo đã tạo firebase-service-account.json
npm run seed-firestore
```

### 7. Deploy lên Firebase
```bash
# Build trước khi deploy
npm run build

# Deploy toàn bộ
npm run deploy:all
```

### 8. Set Environment Variables trên Firebase
```bash
firebase functions:secrets:set JWT_SECRET
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
firebase functions:secrets:set SMTP_HOST
firebase functions:secrets:set GOOGLE_API_KEY
firebase functions:secrets:set GROQ_API_KEY
```

### 9. Kiểm tra sau deploy
- [ ] Truy cập Firebase Hosting URL
- [ ] Test API endpoints: `/api/videos`, `/api/auth/login`, etc.
- [ ] Kiểm tra Firestore Console xem dữ liệu
- [ ] Check Functions logs: Firebase Console > Functions > Logs

## 📝 Notes

### Chi phí
- Firebase có free tier khá hào phóng
- Cloud Functions cần Blaze Plan (pay as you go)
- Theo dõi tại: Firebase Console > Usage and billing

### Cold Starts
- Functions có thể có cold start ~1-2s
- Consider `minInstances` nếu cần performance (có phí thêm)

### Local Development
```bash
# Option 1: Firebase Emulators (requires Java)
npm run serve

# Option 2: Local server với SQLite
npm run dev
```

### Backup
- Export Firestore data định kỳ
- Giữ SQLite local như backup

## 🔗 Tài liệu tham khảo

- [Hướng dẫn chi tiết](./docs/FIREBASE_MIGRATION.md)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)

---
**Ngày tạo:** $(date)
**Version:** 1.0
