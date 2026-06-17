# 🏥 BME Stationery Platform

Nền tảng mạng xã hội & thương mại điện tử cho ngành Y sinh - Cung cấp, sửa chữa và chia sẻ kiến thức về thiết bị y tế.

## ✨ Tính năng chính

### 1. **Header & Thanh tìm kiếm (Phong cách Long Châu)**
- Logo "BME STATIONERY" với thiết kế xanh dương chủ đạo
- Thanh tìm kiếm lớn ở trung tâm
- 2 biểu tượng: Microphone (Giọng nói) & Camera (Máy ảnh)
- Nút "Đăng nhập/Đăng ký" bên phải

### 2. **Đăng nhập/Đăng ký Modal**
- Hỗ trợ 3 loại tài khoản: Cá nhân, Doanh nghiệp, Chuyên gia
- Modal popup nhập SĐT + OTP
- Nút đăng nhập VNeID (red button)
- Icon đăng nhập nhanh: Google, Apple, Facebook, FPT ID
- Business: Kiểm tra Mã số thuế tự động
- Chuyên gia: Apply làm Quản trị viên cộng đồng

### 3. **Trang chủ & Bảng tin (Home Feed)**
- Menu danh mục: Chẩn đoán, Hồi sức, Linh kiện, X-ray, etc.
- Banner carousel (quảng cáo)
- Feed bài viết (kiểu Facebook/LinkedIn)
- Nút tạo bài viết (+)
- Phân loại: Cần sửa chữa, Rao bán, Tìm mua, Chia sẻ kiến thức
- Tương tác: Like, Comment, Share

### 4. **Tìm kiếm khẩn cấp & Bản đồ**
- Nút "TÌM KIẾM KHẨN CẤP" lớn
- Mock map với vị trí kỹ thuật viên & cửa hàng (5km, 10km)
- Giả lập Mapbox/Google Maps
- Nút "Ping thợ gần nhất" gửi thông báo khẩn cấp

### 5. **Cộng đồng nhỏ (Tiny Community)**
- Danh sách nhóm ngành: Hội sửa X-Quang, Hội máy thở, etc.
- Kho tài liệu (File Center) chia sẻ PDF, DOC
- Full-text search trong file
- Tải xuống tài liệu

### 6. **Gian hàng (Store Profile)**
- Trang cá nhân Business
- Danh sách sản phẩm/dịch vụ
- Hệ thống đánh giá sao (1-5)
- Bình luận từ khách hàng

### 7. **Dashboard Admin**
- Bản đồ nhiệt (Heatmap): Vùng đỏ (nhu cầu cao) vs vùng xanh (nhiều store)
- Biểu đồ thống kê: Trend Forecasting, từ khóa trending
- Cảnh báo nếu từ khóa tăng đột biến
- Quản lý tài nguyên (CDN, Backup DB)

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: Next.js 14+ (App Router)
- **UI Framework**: Tailwind CSS 3
- **Icons**: Lucide React
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS (Tone xanh dương chủ đạo)

## 📦 Cách cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

Server sẽ khởi chạy tại: **http://localhost:3000**

### 3. Build cho production
```bash
npm run build
npm start
```

## 📁 Cấu trúc dự án

```
bme-stationery/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main app page with state management
│   └── globals.css         # Global styles
├── components/
│   └── UIComponents.tsx    # All UI components
├── lib/
│   └── data.ts            # Mock data & database schema
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript config
├── next.config.js          # Next.js config
├── postcss.config.js       # PostCSS config
└── package.json            # Dependencies
```

## 🗂️ Database Schema (Mock)

```typescript
// Users
{ id, name, phone, role, cccd, taxId, status, avatar, location }

// Posts
{ id, authorId, author, category, content, images, likes, comments, time, replies }

// Stores
{ id, ownerId, name, lat, lng, distance, status, rating, products }

// Feedback
{ id, storeId, userId, author, rating, comment, date }

// Tiny_Communities
{ id, name, description, membersCount, tags, members }

// Files
{ id, communityId, title, type, size, url, uploadedBy, date }

// Images_Vector
{ id, entityId, vectorData, ocrText, tags, lat, lng }
```

## 🎨 Theme & Colors

- **Primary**: `#003c71` (Xanh dương đậm)
- **Secondary**: `#0052a3` (Xanh dương sáng)
- **Light**: `#e3f2fd` (Xanh dương nhạt)
- **Accent**: `#ff6b35` (Đỏ cam)

## 🚀 Tính năng OCR & Camera Search

Khi bấm biểu tượng Camera:
1. Tải ảnh mã lỗi hoặc linh kiện
2. AI giả lập xử lý OCR
3. Trả về danh sách:
   - **Bài viết**: Hướng dẫn sửa lỗi
   - **Cửa hàng**: Bán linh kiện
   - **Linh kiện**: Giá & nơi mua

## 📊 Admin Dashboard Features

1. **Heatmap**: Biểu diễn nhu cầu sửa chữa theo khu vực
2. **Trending Keywords**: Phát hiện lỗi phổ biến
3. **Alerts**: Cảnh báo khi lỗi tăng đột biến
4. **User Analytics**: Tổng người dùng, giao dịch, đánh giá

## 🔐 Loại tài khoản

### 1. **User (Cá nhân)**
- Cần: SĐT + OTP + CCCD
- Quyền: Tạo bài, tìm kiếm, mua sản phẩm

### 2. **Business (Doanh nghiệp)**
- Cần: SĐT + CCCD + MST
- Hệ thống tự check MST
- Trạng thái: "Chờ duyệt Store"
- Quyền: Mở gian hàng, bán sản phẩm

### 3. **Coordinator (Chuyên gia)**
- Cần: SĐT + CCCD + Apply làm Quản trị viên
- Admin duyệt tay
- Quyền: Chia sẻ kiến thức, quản lý cộng đồng

### 4. **Admin**
- Quyền: Quản lý toàn bộ nền tảng

## 🎯 Navigation & Views

| View | Icon | Mô tả |
|------|------|-------|
| Home | 📋 | Bảng tin & bài viết |
| Map | 🚨 | Tìm kiếm khẩn cấp (Kỹ thuật viên gần nhất) |
| Community | 👥 | Cộng đồng & Kho tài liệu |
| Store | 🏪 | Gian hàng & Sản phẩm |
| Admin | ⚙️ | Dashboard quản lý (Chỉ Admin) |

## 📱 Responsive Design

- ✅ Mobile First
- ✅ Sidebar tự động ẩn/hiện trên mobile
- ✅ Touch-friendly buttons
- ✅ Optimized cho mọi kích thước màn hình

## 🔍 Tìm kiếm & Lọc

- Thanh tìm kiếm chính: Tìm linh kiện, máy móc, mã lỗi
- Tìm bằng giọng nói (Microphone icon)
- Tìm bằng hình ảnh (Camera icon + OCR AI)
- Lọc theo danh mục

## 💡 Hướng dẫn sử dụng

### Tạo bài viết
1. Bấm nút `+` trên feed
2. Chọn phân loại (Rao bán, Cần sửa, Tìm mua, Chia sẻ)
3. Nhập nội dung + Hình ảnh
4. Bấm "Đăng"

### Tìm kỹ thuật viên khẩn cấp
1. Bấm tab "🚨 Khẩn cấp"
2. Xem bản đồ với vị trí kỹ thuật viên
3. Bấm "Ping" để gửi thông báo

### Chia sẻ tài liệu
1. Vào tab "Cộng đồng"
2. Chọn nhóm ngành
3. Tải file PDF/DOC
4. Cộng đồng có thể tìm kiếm & tải

## 🌐 Triển khai lên Production

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm run build
# Upload `out` folder to Netlify
```

### Option 3: Hosting tự quản
```bash
npm run build
npm start
```

## 📞 Liên hệ & Hỗ trợ

- Email: support@bme-stationery.vn
- Hotline: 1900 XXXX
- Website: www.bme-stationery.vn

## 📄 License

MIT License - Tự do sử dụng & phát triển

---

**Được phát triển bởi GitHub Copilot** ✨

Hành hạnh phục vụ ngành Y sinh! 🏥
