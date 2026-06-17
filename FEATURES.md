# 📋 Chi tiết các tính năng BME Stationery Platform

## 1️⃣ HEADER & THANH TÌM KIẾM

### Design
- **Màu sắc**: Gradient xanh dương (`#003c71` → `#0052a3`)
- **Logo**: "⚕️ BME STATIONERY"
- **Layout**: Sticky header cố định ở top

### Thành phần
```
┌─────────────────────────────────────────────────────┐
│ ☰  ⚕️ BME STATIONERY  │  🔍 Tìm kiếm...  🎤 📷  │  🔔 🛒 │ Đăng nhập │
└─────────────────────────────────────────────────────┘
```

### Tính năng

#### A. Search Bar
- Placeholder: "Tìm kiếm linh kiện, máy móc, mã lỗi..."
- Support: Desktop & Mobile
- Autocomplete: Có (mock)

#### B. Microphone Icon (🎤)
- Click: Kích hoạt Voice Search
- Placeholder: "Nói ra lỗi của máy..."
- Mock: Simulate nhận dạng giọng nói

#### C. Camera Icon (📷)
- Click: Mở OcrSearchModal
- Tính năng: AI OCR search
- Output: Danh sách kết quả (bài viết, cửa hàng, linh kiện)

#### D. Notification Bell (🔔)
- Badge: Số thông báo chưa đọc
- Click: Xem thông báo
- Types: 
  - Order updates
  - Community messages
  - Ping khẩn cấp

#### E. Shopping Cart (🛒)
- Badge: Số sản phẩm
- Click: Xem giỏ hàng

#### F. Auth Button
- **Not logged in**: "Đăng nhập" button
- **Logged in**: Avatar + Dropdown menu
  - 👤 Hồ sơ
  - ⚙️ Cài đặt
  - 🚪 Đăng xuất

---

## 2️⃣ LOGIN/REGISTER MODAL

### Giao diện
- **Type**: Modal overlay
- **Animation**: Slide-in-down
- **Backdrop**: Black 60% transparency

### Bước 1: Chọn loại tài khoản
```
┌──────────────────────────┐
│  🏥 BME STATIONERY      │
├──────────────────────────┤
│ [Cá nhân] [Doanh nghiệp] [Chuyên gia] │
│                          │
│ Nhập số điện thoại       │
│ [                    ]   │
│                          │
│ [Tiếp tục] (xanh)       │
│   ─────────────────      │
│ [Đăng nhập VNeID] (đỏ)  │
│                          │
│ [G] [🍎] [f] [F]        │
└──────────────────────────┘
```

### Bước 2: Xác thực OTP
```
┌──────────────────────────┐
│ ✅ Xác nhận thành công!  │
│ Mã OTP đã gửi: 0987...  │
├──────────────────────────┤
│ Nhập mã OTP (6 chữ)     │
│ [______] (Monospace)    │
│                          │
│ [← Quay lại] [Xác nhận] │
└──────────────────────────┘
```

### Dữ liệu được thu thập

#### Role: User (Cá nhân)
```
- Số điện thoại (required)
- Mã OTP (required)
- CCCD (required)
→ Trạng thái: Active
```

#### Role: Business (Doanh nghiệp)
```
- Số điện thoại (required)
- Mã số thuế (required)
  • Auto-check: Hệ thống xác thực MST Quốc gia
  • Valid: ✅ Approved
  • Invalid: ❌ Rejected
- CCCD (required)
→ Trạng thái: "Chờ duyệt Store" (Admin review)
```

#### Role: Coordinator (Chuyên gia)
```
- Số điện thoại (required)
- CCCD (required)
- Checkbox: "Apply làm Quản trị viên cộng đồng"
  • Nếu check: Tạo request gửi Admin
  • Admin review & approve
→ Trạng thái: "Chờ duyệt Admin"
```

### Phương thức đăng nhập nhanh
- 🟦 Google OAuth
- 🟦 Apple Sign-in
- 🟦 Facebook
- 🟦 FPT ID

---

## 3️⃣ TRANG CHỦ & BẢNG TIN (HOME FEED)

### Layout
```
┌─────────────────────────────────────────────┐
│ 📋 Danh mục:                                │
│ [📋 Tất cả] [🔬 Chẩn đoán] [💨 Hồi sức]   │
│ [🔌 Linh kiện] [☢️ X-ray]                  │
├─────────────────────────────────────────────┤
│ [+] Bạn muốn chia sẻ gì? [Đăng bài]      │
├─────────────────────────────────────────────┤
│ 📝 POST #1                                  │
│ ┌─────────────────────────────────────────┐ │
│ │ [Avatar] Trần B (BME Store)  [Rao bán] │ │
│ │                                         │ │
│ │ "Cần thanh lý gấp 5 bo mạch..."        │ │
│ │ [Image]                                │ │
│ │                                         │ │
│ │ ❤️ 24  💬 5  ↗️ Share                  │ │
│ │ [❤️ Thích] [💬 Bình luận] [↗️ Chia sẻ] │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ 📝 POST #2, #3, ...                         │
└─────────────────────────────────────────────┘
```

### Danh mục bài viết
1. **📋 Tất cả** - Hiển thị tất cả bài
2. **🔬 Chẩn đoán** - Máy chẩn đoán hình ảnh
3. **💨 Hồi sức** - Thiết bị hồi sức
4. **🔌 Linh kiện** - Linh kiện & PCB
5. **☢️ X-ray** - Máy X-ray

### Loại bài viết (Category)
```
┌───────────────────────────┐
│ 🔴 Cần sửa chữa (Red)    │ Tìm thợ sửa
├───────────────────────────┤
│ 🔵 Rao bán (Blue)        │ Bán sản phẩm
├───────────────────────────┤
│ 🟠 Tìm mua (Orange)      │ Cần mua gì
├───────────────────────────┤
│ 🟢 Chia sẻ kiến thức     │ Hướng dẫn/Tips
└───────────────────────────┘
```

### Tương tác bài viết
- **❤️ Thích**: Lưu lại bài viết
- **💬 Bình luận**: Xem/viết bình luận
- **↗️ Chia sẻ**: Chia sẻ với bạn bè

### Bình luận
```
Post bình luận:
┌──────────────────────────┐
│ [Avatar] Người A         │
│ "Giá bao nhiêu bạn?"    │
│ 1 giờ trước              │
└──────────────────────────┘
```

### Tạo bài viết
```
┌──────────────────────────────────┐
│ [+] Bạn muốn chia sẻ gì?       │
│   [                        ]    │
│   [🎤] [📷] [📎] [😊]          │
│                                │
│ Phân loại: [Chọn...]           │
│ Hình ảnh: [+]                  │
│                                │
│          [← Hủy] [Đăng]        │
└──────────────────────────────────┘
```

**Validation**:
- ✅ Phải nhập nội dung
- ✅ Phải chọn danh mục
- ✅ Có thể thêm hình ảnh

---

## 4️⃣ MAP VIEW - TÌM KIẾM KHẨN CẤP

### Giao diện
```
┌──────────────────────────────────────┐
│ 🚨 TÌM KIẾM KHẨN CẤP                │
│ Hiển thị kỹ thuật viên & cửa hàng   │
├──────────────────────────────────────┤
│                                      │
│        [Simulated Map View]          │
│                                      │
│    [📍 = Your Location]              │
│    [👨‍🔧 = Technician]                 │
│                                      │
├──────────────────────────────────────┤
│ 👥 Kỹ thuật viên gần bạn:           │
│                                      │
│ 👨‍🔧 Kỹ sư Hùng                      │
│ Specialty: Máy X-Quang, ECG         │
│ Distance: 1.2 km                    │
│ Rating: ⭐ 4.9 | Response: 15 phút  │
│ Status: 🟢 Online                   │
│ [Ping] (Red button)                 │
│                                      │
│ 👨‍🔧 Kỹ sư Linh                      │
│ Specialty: Máy thở, Hồi sức         │
│ ...                                  │
└──────────────────────────────────────┘
```

### Kỹ thuật viên gần nhất
```
Dữ liệu:
- ID, Name, Specialty
- Distance, Rating
- Response time
- Online status (🟢 Online / 🟡 Busy)
- Coordinates (Lat, Lng)
```

### Nút Ping
- **Color**: Red (#FF6B35)
- **Action**: Gửi thông báo khẩn cấp
- **Notification**: "📲 Đã gửi thông báo khẩn cấp cho [Name]"
- **Duration**: Show 3 seconds

### Features
1. Mock Mapbox/Google Maps display
2. Technician location markers
3. Store markers
4. Search radius: 5km, 10km
5. Real-time status indicators

---

## 5️⃣ TINY COMMUNITY & FILE LIBRARY

### Tab Structure
```
┌──────────────────────────────┐
│ [👥 Cộng đồng (N)] [📄 Tài liệu (N)] │
├──────────────────────────────┤
│ (Content here)               │
└──────────────────────────────┘
```

### Tab 1: Cộng đồng (Communities)
```
Nhóm 1: Hội sửa chữa máy X-Quang
────────────────────────────────
🔬 Hội sửa chữa máy X-Quang
"Cộng đồng các kỹ thuật viên, chuyên gia..."
👥 234 thành viên
Thành viên: Kỹ sư A, Kỹ sư B, Bác sĩ C
Tags: [X-ray] [Bảo dưỡng] [Sửa chữa]
[Tham gia cộng đồng] (Blue button)

Nhóm 2: Kỹ sư máy thở & Hồi sức
────────────────────────────────
💨 Kỹ sư máy thở & Hồi sức
...
```

### Tab 2: Tài liệu (Files)
```
📄 Tài liệu (File Center)

1️⃣ Hướng dẫn sửa chữa X-Quang GE Discovery.pdf
   📤 Tải lên bởi: Kỹ sư A | 1 tuần trước
   📦 45 MB | ⬇️ 234 lần tải
   [Tải]

2️⃣ Service Manual - Siemens YSIO X-Ray.pdf
   📤 Tải lên bởi: Kỹ sư B | 2 tuần trước
   📦 82 MB | ⬇️ 456 lần tải
   [Tải]

3️⃣ Quy trình hiệu chuẩn máy thở Philips.docx
   📤 Tải lên bởi: BS Dũng | 3 ngày trước
   📦 2.3 MB | ⬇️ 123 lần tải
   [Tải]
```

### Features
- **Full-text search**: Tìm kiếm nội dung trong file
- **File types**: PDF, DOC, DOCX, TXT
- **Sorting**: By date, downloads, rating
- **Filtering**: By community, type

---

## 6️⃣ STORE PROFILE & FEEDBACK

### Layout
```
┌──────────────────────────────────────┐
│ Chọn cửa hàng:                       │
│ [BME Tech Service] [Medical Center]  │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │     [Header Image/Gradient]      │ │
│ ├──────────────────────────────────┤ │
│ │ 🏪 BME Tech Service              │ │
│ │ "Chuyên cung cấp linh kiện..."  │ │
│ │                                  │ │
│ │ [4.8] [156 bình luận] [🟢 Online] │
│ │                                  │ │
│ │ 📦 Sản phẩm/Dịch vụ:            │ │
│ │ [Bo mạch máy thở] [Linh kiện...] │ │
│ │                                  │ │
│ │ [💬 Liên hệ cửa hàng]           │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ ⭐ Đánh giá từ khách hàng:           │
│                                      │
│ [Avatar] Bệnh viện Chợ Rẫy          │
│ ⭐⭐⭐⭐⭐ (5 sao)                     │
│ "Dịch vụ xuất sắc, giao hàng nhanh" │
│ 2 ngày trước                         │
│                                      │
│ [Avatar] Kỹ sư Hà                    │
│ ⭐⭐⭐⭐☆ (4 sao)                     │
│ "Sửa chữa nhanh, nhưng giá hơi cao" │
│ 5 ngày trước                         │
└──────────────────────────────────────┘
```

### Store Details
- **Name**: Tên cửa hàng
- **Description**: Mô tả ngắn
- **Rating**: 1-5 sao
- **Feedback count**: Số bình luận
- **Status**: Online/Offline
- **Products/Services**: Danh sách dịch vụ
- **Location**: Khu vực kinh doanh

### Review System
- **Rating**: ⭐ 1-5 sao
- **Comment**: Văn bản đánh giá
- **Author**: Tên khách hàng
- **Date**: Ngày đánh giá
- **Avatar**: Ảnh đại diện

---

## 7️⃣ ADMIN DASHBOARD

### Layout
```
┌──────────────────────────────────┐
│ ⚙️ Dashboard quản trị            │
├──────────────────────────────────┤
│                                  │
│ [🚨 Alert 1] [⚠️ Alert 2] [ℹ️ Alert 3] │
│                                  │
│ [👥] [🏪] [💳] [⭐]              │
│ 12543  456   8932   4.7          │
│ Users  Stores Trans. Rating      │
│                                  │
│ [🗺️ Bản đồ nhiệt] [📈 Xu hướng] │
│                                  │
│ ┌────────────────────────────┐  │
│ │                            │  │
│ │    [Heatmap/Chart]         │  │
│ │                            │  │
│ └────────────────────────────┘  │
│                                  │
│ Từ khóa trending:               │
│ 1. 📈 Máy thở (1234 searches)   │
│ 2. 📈 Bo mạch ECG (892 searches)│
│ 3. 📉 X-ray điều trị (756)      │
│ ...                              │
└──────────────────────────────────┘
```

### Alert System
```
🚨 HIGH SEVERITY (Red)
"Lỗi 'Hỏng bo mạch máy thở' tăng 340% tuần này"

⚠️ MEDIUM SEVERITY (Amber)
"Khu vực Quận 1 thiếu kỹ thuật viên"

ℹ️ LOW SEVERITY (Blue)
"Cập nhật mới: Hướng dẫn E-405 X-Quang"
```

### Heatmap Features
```
Cường độ (Intensity):
- 🔴 Cao (Red): Nhu cầu cao, ít thợ
- 🟡 Trung bình (Yellow): Cân bằng
- 🟢 Thấp (Green): Nhiều store

Thao tác:
- Hover: Xem thông tin vùng
- Click "Điều phối": Gửi thợ tới vùng đỏ
```

### Analytics
```
Card Stats:
- 👥 Tổng người dùng: 12,543
- 🏪 Cửa hàng hoạt động: 456
- 💳 Giao dịch: 8,932
- ⭐ Đánh giá trung bình: 4.7
```

### Trending Keywords
```
Rank | Keyword              | Searches | Trend
────┼──────────────────────┼──────────┼──────
 1   | Máy thở            | 1,234    | 📈 Up
 2   | Bo mạch ECG        | 892      | 📈 Up
 3   | X-ray điều trị     | 756      | 📉 Down
 4   | Cảm biến SpO2      | 645      | 📈 Up
 5   | Hồi sức            | 543      | ➡️ Stable
```

---

## 🎨 COLOR PALETTE

```
Primary:    #003c71 (Xanh dương đậm)
Secondary:  #0052a3 (Xanh dương sáng)
Light:      #e3f2fd (Xanh dương nhạt)
Accent:     #ff6b35 (Đỏ cam)

Category Colors:
- Cần sửa chữa:  🔴 #EF4444 (Red)
- Rao bán:       🔵 #3B82F6 (Blue)
- Tìm mua:       🟠 #F97316 (Orange)
- Chia sẻ kiến:  🟢 #10B981 (Green)

Status:
- Online:   🟢 #10B981
- Offline:  🔴 #EF4444
- Busy:     🟡 #FBBF24
```

---

## 🔑 KEY INTERACTIONS

### User Flow
```
Landing → Đăng nhập/Đăng ký → Home Feed
↓
Tương tác bài viết / Tìm kiếm
↓
Store Profile / Cộng đồng / Map
↓
Admin Dashboard (if admin role)
```

### Search Flow
```
Click Search Bar → Type query → Hit Enter
↓
Results page (posts, stores, products)
↓
Click on result → Detail page
```

### OCR Search Flow
```
Click Camera → Upload Image
↓
AI processes (2s simulate)
↓
Show results:
- Articles (related posts)
- Stores (selling parts)
- Spare parts (pricing)
↓
Click to view details
```

### Emergency Flow
```
Emergency need?
↓
Go to "Khẩn cấp" tab
↓
View nearby technicians
↓
Click "Ping" → Send notification
↓
Technician responds
```

---

## 📊 DATABASE RELATIONSHIPS

```
Users ─────→ Posts
    ├────→ Stores
    ├────→ Feedback
    └────→ Files

Stores ─────→ Feedback
    ├────→ Products
    └────→ Reviews

Communities ─→ Files
    └────→ Members

Posts ──────→ Images
    └────→ Comments

File ──────→ VectorData
```

---

**Tất cả tính năng được thiết kế để dễ sử dụng, trực quan, và phục vụ ngành Y sinh một cách hiệu quả!** 🏥✨
