# 🏗️ Project Architecture - BME Stationery Platform

## 📂 Cấu trúc Folder

```
bme-stationery/
├── 📄 README.md                 # Hướng dẫn chính
├── 📄 QUICK_START.md           # Khởi động nhanh
├── 📄 FEATURES.md              # Chi tiết tính năng
├── 📄 DEPLOYMENT_GUIDE.md      # Hướng dẫn triển khai
├── 📄 ARCHITECTURE.md          # File này
├── 📄 package.json             # Dependencies
├── 📄 tsconfig.json            # TypeScript config
├── 📄 tailwind.config.js       # Tailwind CSS config
├── 📄 postcss.config.js        # PostCSS config
├── 📄 next.config.js           # Next.js config
├── 📄 .gitignore               # Git ignore
├── 📄 .env.example             # Environment template
│
├── 📁 app/                     # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main app page (STATE MANAGEMENT HUB)
│   └── globals.css             # Global styles
│
├── 📁 components/              # React Components
│   └── UIComponents.tsx        # All UI components
│       ├── LoginModal
│       ├── OcrSearchModal
│       ├── HomeFeed
│       ├── MapView
│       ├── TinyCommunity
│       ├── StoreProfile
│       └── AdminDashboard
│
├── 📁 lib/                     # Utilities & Data
│   └── data.ts                 # Mock data & DB schema
│
└── 📁 .next/                   # Build output (generated)
    └── [auto-generated files]
```

---

## 🏛️ Architecture Layers

### Layer 1: Presentation (UI)
```
app/page.tsx (Main Container)
    ├── Header Component
    ├── Sidebar Navigation
    └── Main Content Area
        ├── HomeFeed
        ├── MapView
        ├── TinyCommunity
        ├── StoreProfile
        └── AdminDashboard
```

### Layer 2: State Management
```
app/page.tsx
    ├── currentView (string) → Điều khiển view nào hiển thị
    ├── isLoginOpen (boolean) → Modal đăng nhập
    ├── isOcrOpen (boolean) → Modal OCR
    ├── isLoggedIn (boolean) → Auth state
    ├── userRole (string) → user/business/coordinator/admin
    └── searchQuery (string) → Thanh tìm kiếm
```

### Layer 3: Components
```
components/UIComponents.tsx
    ├── Modals
    │   ├── LoginModal → Xử lý đăng nhập
    │   └── OcrSearchModal → Xử lý tìm kiếm ảnh
    ├── Views
    │   ├── HomeFeed → Bảng tin
    │   ├── MapView → Bản đồ khẩn cấp
    │   ├── TinyCommunity → Cộng đồng
    │   ├── StoreProfile → Gian hàng
    │   └── AdminDashboard → Admin
    └── Sub-components → Button, Card, etc.
```

### Layer 4: Data & Logic
```
lib/data.ts
    ├── Mock Users
    ├── Mock Posts
    ├── Mock Stores
    ├── Mock Communities
    ├── Mock Files
    ├── Mock Analytics
    └── Mock Technicians
```

---

## 🔄 Data Flow

### 1. Initialization
```
User opens app
    ↓
app/page.tsx loads
    ├── Initialize state
    ├── Load mock data from lib/data.ts
    └── Render header + sidebar + main view
```

### 2. Navigation
```
User clicks nav item
    ↓
onClick handler in app/page.tsx
    ↓
setCurrentView(itemId)
    ↓
Main content re-renders with selected view
```

### 3. Login Flow
```
User clicks "Đăng nhập"
    ↓
setIsLoginOpen(true)
    ↓
LoginModal mounts
    ↓
User submits form
    ↓
onClose() callback
    ├── setIsLoginOpen(false)
    ├── setIsLoggedIn(true)
    ├── setUserRole('user')
    └── Modal closes
```

### 4. Search Flow
```
User clicks Camera icon
    ↓
setIsOcrOpen(true)
    ↓
OcrSearchModal mounts
    ↓
User uploads image
    ↓
Simulate OCR processing
    ↓
Show results from mockOcrResult
    ↓
User clicks result or closes modal
```

---

## 🎯 Component Responsibilities

### `app/page.tsx` (Main Hub)
- ✅ Global state management
- ✅ Navigation logic
- ✅ Auth state handling
- ✅ View routing
- ✅ Header/Sidebar rendering
- ✅ Modal trigger logic

### `components/UIComponents.tsx`
- ✅ Render all UI components
- ✅ Internal component state (like/comments)
- ✅ Component-specific interactions
- ✅ Pass props from parent

### `lib/data.ts`
- ✅ Mock data storage
- ✅ Database schema definitions (comments)
- ✅ API responses simulation
- ✅ Constants & enums

### `app/globals.css`
- ✅ Global styles
- ✅ Animations
- ✅ Custom scrollbar
- ✅ Base element styles

---

## 🔌 Component Props Interface

```typescript
// LoginModal
LoginModal {
  isOpen: boolean;
  onClose: () => void;
}

// OcrSearchModal
OcrSearchModal {
  isOpen: boolean;
  onClose: () => void;
}

// Other components don't take props (use global data)
// They read from mockPosts, mockStores, etc.
```

---

## 📡 Mock API Structure

### Current Implementation
- All data is hardcoded in `lib/data.ts`
- No actual API calls
- Components directly render mock data

### Future Integration
To connect real API:

```typescript
// Before (Current)
import { mockPosts } from '@/lib/data';
const posts = mockPosts;

// After (Real API)
const [posts, setPosts] = useState([]);
useEffect(() => {
  fetch('/api/posts')
    .then(r => r.json())
    .then(setPosts);
}, []);
```

---

## 🎨 Styling Architecture

### Tailwind CSS
```
tailwind.config.js
    ├── colors → BME theme colors
    ├── fonts → System fonts
    └── extensions → Custom utilities

app/globals.css
    ├── @tailwind directives
    ├── Base styles
    ├── Animations
    └── Component utilities

Components
    └── inline className Tailwind classes
```

### Color Scheme
```
Primary:    #003c71 (Xanh dương đậm)
Secondary:  #0052a3 (Xanh dương sáng)
Light:      #e3f2fd (Xanh dương nhạt)
Accent:     #ff6b35 (Đỏ cam)
```

### Animations
```
animate-slide-in-down  → Modal appear
animate-fade-in        → Content transition
animate-pulse-dot      → Technician online indicator
```

---

## 🚀 Build & Deploy Flow

### Development
```
npm run dev
    ↓
Next.js starts dev server (localhost:3000)
    ↓
Hot reload on file changes
    ↓
Browser DevTools: Debug, inspect
```

### Production Build
```
npm run build
    ├── Compile TypeScript
    ├── Bundle components
    ├── Optimize images
    ├── Tree-shake unused code
    └── Generate .next folder

npm start
    ↓
Next.js production server
    ↓
Ready for deployment
```

### Deployment Options
```
Vercel (Recommended)
    ↓ Auto CI/CD

Netlify
    ↓ Manual build → Deploy

Self-hosted (VPS)
    ↓ PM2 + Nginx

Docker
    ↓ Container orchestration

AWS/Azure/GCP
    ↓ Cloud infrastructure
```

---

## 🔐 Security Considerations

### Current (Mock)
- No real authentication
- No database security
- No API rate limiting
- Mock data only

### Production Checklist
```
☐ HTTPS/SSL enforcement
☐ JWT/OAuth authentication
☐ Password hashing (bcrypt)
☐ Environment variables (no hardcoded secrets)
☐ CORS configuration
☐ Rate limiting
☐ Input validation
☐ SQL injection prevention (use ORM)
☐ XSS protection
☐ CSRF tokens
☐ Secure headers (Helmet.js)
```

---

## 📊 State Management Strategy

### Currently: Local Component State
```typescript
const [currentView, setCurrentView] = useState('home');
const [isLoginOpen, setIsLoginOpen] = useState(false);
const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
```

### For Scaling: Consider
```typescript
// Option 1: Context API
const [state, dispatch] = useReducer(appReducer, initialState);
<AppContext.Provider value={{ state, dispatch }}>

// Option 2: Redux Toolkit
const state = useSelector(state => state.auth);
dispatch(setCurrentView('home'));

// Option 3: Zustand (Lightweight)
const useAppStore = create((set) => ({
  currentView: 'home',
  setCurrentView: (view) => set({ currentView: view }),
}));
```

---

## 🧪 Testing Structure (Future)

```
tests/
├── components/
│   ├── LoginModal.test.tsx
│   ├── HomeFeed.test.tsx
│   └── ...
├── lib/
│   └── data.test.ts
└── integration/
    └── user-flow.test.ts
```

### Testing Tools
- Jest (Unit tests)
- React Testing Library (Component tests)
- Playwright (E2E tests)

---

## 📈 Performance Optimization

### Current Optimizations
```
✅ Code splitting (Next.js automatic)
✅ CSS-in-JS (Tailwind)
✅ Component memoization (React)
✅ Image optimization ready
```

### Future Optimizations
```
☐ Image optimization: next/image
☐ Lazy loading: React.lazy()
☐ API caching: SWR/React Query
☐ Database indexing
☐ CDN for static files
☐ Server-side rendering (SSR)
```

---

## 🔄 CI/CD Pipeline (Recommended)

```
GitHub Push
    ↓
GitHub Actions trigger
    ├── npm install
    ├── npm run lint
    ├── npm run build
    ├── Run tests
    └── Upload to Vercel/Server
    ↓
Deployment
    └── Auto-rollback on failure
```

### GitHub Actions Workflow
```yaml
name: Deploy
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: npm run lint
      - run: npm test (if exists)
      - run: vercel --prod
```

---

## 📚 Technology Stack Summary

```
Frontend:
├── React 18+
├── Next.js 14+ (App Router)
├── TypeScript
└── Tailwind CSS 3

Icons:
└── Lucide React

State:
└── React Hooks (useState, useEffect)

Build:
├── Next.js Compiler
├── PostCSS
└── Tailwind CLI

Deployment:
├── Vercel (Recommended)
├── Netlify
├── Self-hosted
└── Docker
```

---

## 🎯 Project Milestones

### Phase 1: ✅ Core Features (Current)
- ✅ Header & Navigation
- ✅ Login/Register UI
- ✅ Home Feed
- ✅ Map View
- ✅ Community & Files
- ✅ Store Profile
- ✅ Admin Dashboard

### Phase 2: Backend Integration
- API endpoints development
- Database setup
- User authentication
- Real data storage

### Phase 3: Advanced Features
- Payment integration
- Real-time notifications
- File upload & storage
- Search optimization

### Phase 4: Scaling
- Load balancing
- Caching strategy
- Database optimization
- CDN integration

---

## 🤝 Contribution Guidelines

### Adding New Feature
1. Create branch: `git checkout -b feature/new-feature`
2. Implement in components
3. Update mock data if needed
4. Add to navigation
5. Test responsiveness
6. Create PR

### Code Style
- Use TypeScript types
- Tailwind CSS classes
- Functional components
- React hooks pattern

---

## 📞 Support & Resources

- **Docs**: README.md, QUICK_START.md, FEATURES.md
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Architecture designed for scalability, maintainability, and performance!** 🎯✨
