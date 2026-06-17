# 🚀 Quick Start Guide - BME Stationery Platform

## Yêu cầu hệ thống
- **Node.js**: 18+ (Kiểm tra: `node --version`)
- **npm**: 9+ (Kiểm tra: `npm --version`)
- **Git**: Để clone repository

---

## ⚡ Khởi động trong 5 phút

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Chạy Development Server
```bash
npm run dev
```

### 3. Mở Browser
```
http://localhost:3000
```

✅ **Xong! Ứng dụng đã chạy!**

---

## 🎯 Tính năng để thử ngay

### 1. Đăng nhập
- Click nút "Đăng nhập" ở góc phải
- Chọn loại tài khoản: "Cá nhân" / "Doanh nghiệp" / "Chuyên gia"
- Nhập số điện thoại (bất kỳ)
- Nhập mã OTP: `123456`
- ✅ Đăng nhập thành công

### 2. Xem Feed Bài viết
- Click tab "📋 Bảng tin"
- Xem danh sách bài viết
- Like, comment, share bài viết

### 3. Tìm kiếm bằng Camera
- Click biểu tượng 📷 trong header
- Tải ảnh lên (hoặc click để chọn)
- Chờ xử lý (2 giây)
- Xem kết quả: Bài viết, cửa hàng, linh kiện

### 4. Tìm kiếm khẩn cấp
- Click tab "🚨 Khẩn cấp"
- Xem map với kỹ thuật viên gần nhất
- Click "Ping" để gửi thông báo

### 5. Cộng đồng & Tài liệu
- Click tab "👥 Cộng đồng"
- Xem danh sách nhóm (X-ray, Máy thở, etc.)
- Click "📄 Tài liệu" để xem file chia sẻ

### 6. Gian hàng
- Click tab "🏪 Gian hàng"
- Xem danh sách cửa hàng
- Click cửa hàng để xem chi tiết
- Xem đánh giá & bình luận

### 7. Dashboard Admin
- Đầu tiên, hãy tạo tài khoản Admin:
  1. Mở DevTools (F12)
  2. Chạy: `localStorage.setItem('isAdmin', 'true')`
  3. Refresh trang
- Click tab "⚙️ Admin"
- Xem heatmap, analytics, trending keywords

---

## 🛠️ Phát triển & Customization

### Sửa đổi Colors
File: `tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      'bme-primary': '#003c71',    // ← Sửa màu xanh dương
      'bme-secondary': '#0052a3',
      'bme-light': '#e3f2fd',
      'bme-accent': '#ff6b35',
    },
  },
},
```

### Thêm trang mới
1. Tạo component ở `components/UIComponents.tsx`
2. Thêm navigation ở `app/page.tsx`:
```typescript
const navItems = [
  // ... existing items
  { id: 'newpage', icon: <Icon size={20} />, label: 'New Page' },
];
```

### Sửa Mock Data
File: `lib/data.ts`
- Chỉnh sửa `mockPosts`, `mockStores`, `mockFiles`, etc.
- Component tự động render dữ liệu mới

### Thay đổi Layout
File: `app/page.tsx`
- Sidebar width: Tìm `w-56`
- Header height: Tìm `h-20`
- Max content width: Tìm `max-w-6xl`

---

## 📱 Testing Responsiveness

### Kiểm tra trên Mobile
1. Mở DevTools: `F12`
2. Click "Toggle device toolbar" (hoặc Ctrl+Shift+M)
3. Chọn device: iPhone 12, iPad, etc.

### Breakpoints (Tailwind)
- `sm`: 640px (Smartphone)
- `md`: 768px (Tablet)
- `lg`: 1024px (Desktop)

---

## 🔍 Debugging Tips

### View logs
```bash
# Terminal đang chạy npm run dev sẽ hiển thị logs
# Kiểm tra browser console (F12 → Console)
```

### Hot Reload
- Tự động reload khi sửa file
- Nếu không reload: Refresh browser (Ctrl+R)

### Component isolation
Kiểm tra component riêng:
```bash
# Thêm console.log
console.log('Component loaded', props);

# Xem trong DevTools Console
```

---

## 📊 Mock Data Structure

### Posts
```javascript
{
  id: 'p1',
  author: 'Trần B (BME Store)',
  category: 'Rao bán',  // hoặc 'Cần sửa chữa', 'Tìm mua', 'Chia sẻ kiến thức'
  content: 'Mô tả sản phẩm...',
  images: ['url1', 'url2'],
  likes: 24,
  comments: 5,
  time: '2 giờ trước',
  replies: [...]
}
```

### Stores
```javascript
{
  id: 's1',
  name: 'BME Tech Service',
  lat: 10.762622,
  lng: 106.660172,
  distance: '2.5 km',
  status: 'online',
  rating: 4.8,
  products: ['Bo mạch máy thở', '...']
}
```

### Communities
```javascript
{
  id: 'c1',
  name: 'Hội sửa chữa máy X-Quang',
  membersCount: 234,
  tags: ['X-ray', 'Bảo dưỡng'],
  members: ['Kỹ sư A', '...']
}
```

---

## 🎨 Customizing UI

### Thay đổi Logo
File: `app/page.tsx`
```typescript
<div className="text-white font-black text-2xl">
  ⚕️ BME <span className="text-red-400">STATIONERY</span>
</div>
// ↑ Sửa icon & text ở đây
```

### Thay đổi Header
- Màu nền: `bg-gradient-to-r from-bme-primary to-bme-secondary`
- Button: `.bg-white/20` → hover: `.hover:bg-white/30`

### Thay đổi Sidebar
- Width: `w-56` → `w-64` (để rộng hơn)
- Theme: Tìm `text-gray-700` → `text-bme-primary`

---

## 🚀 Build & Deploy Locally

### Build cho Production
```bash
npm run build
```

### Chạy Production Build
```bash
npm start
```

### Kiểm tra Build Size
```bash
npm run build
# Check `.next` folder size
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@/lib/data'"
**Solution**: Kiểm tra `tsconfig.json` có cấu hình `paths` không
```json
"paths": {
  "@/*": ["./*"]
}
```

### Issue: Tailwind CSS không áp dụng
**Solution**: Restart dev server
```bash
# Ctrl+C để dừng
# npm run dev để khởi động lại
```

### Issue: Port 3000 đã sử dụng
**Solution**: Dùng port khác
```bash
npm run dev -- -p 3001
```

### Issue: CSS không load trên production
**Solution**: Kiểm tra `tailwind.config.js` content:
```js
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

---

## 📚 Tài liệu liên quan

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 Tips & Tricks

### 1. Tắt React Strict Mode (Dev)
File: `app/layout.tsx`
```typescript
export const metadata = {
  ...
};
// React Strict Mode tự động bật ở dev, có thể tắt nếu cần
```

### 2. Optimize Images
```bash
npm install next-image-export-optimizer
# Sử dụng Image component từ next/image thay vì <img>
```

### 3. Add Environment Variables
Tạo `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Format Code
```bash
npm install -D prettier
npx prettier --write .
```

### 5. Lint Code
```bash
npm run lint
```

---

## 🎬 Next Steps

1. ✅ Chạy ứng dụng: `npm run dev`
2. ✅ Khám phá UI: Thử tất cả tính năng
3. ✅ Sửa Mock Data: Thay đổi `lib/data.ts`
4. ✅ Customize UI: Sửa colors, fonts, layout
5. ✅ Thêm tính năng: Backend integration
6. ✅ Deploy: Chọn hosting (Vercel, Netlify, AWS)

---

## ❓ FAQ

**Q: Làm sao để đăng nhập?**
A: Click nút "Đăng nhập" → Chọn loại tài khoản → Nhập SĐT (bất kỳ) → Nhập OTP: 123456

**Q: Làm sao để thêm sản phẩm mới?**
A: Sửa `lib/data.ts` → Thêm object vào `mockStores` hoặc `mockPosts`

**Q: Có API Backend không?**
A: Hiện tại là Mock Data. Để kết nối real API, sửa functions trong components và thêm API calls

**Q: Làm sao để deploy?**
A: Xem `DEPLOYMENT_GUIDE.md` cho hướng dẫn chi tiết

**Q: Có thể chạy offline không?**
A: Có! Tất cả data là local mock data, không cần internet

---

## 🆘 Cần giúp?

Nếu gặp lỗi:
1. Kiểm tra terminal logs
2. Mở DevTools (F12) → Console
3. Xem `README.md` & `FEATURES.md`
4. Restart dev server

---

**Selamat! Anda siap mengembangkan BME Stationery Platform!** 🎉✨

Happy coding! 💻🚀
