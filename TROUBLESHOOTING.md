# 🔧 Troubleshooting Guide - BME Stationery Platform

## Common Issues & Solutions

---

## 🌐 Installation Issues

### Issue: "npm install" fails

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Try with legacy dependency resolution
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
npm install
```

---

### Issue: Node version mismatch

**Error**: `Node version X is not compatible`

**Solution**:
```bash
# Check current version
node --version
npm --version

# Install Node.js 18 or higher from https://nodejs.org
# Then verify
node --version  # Should be v18.x or higher
```

---

### Issue: Port 3000 already in use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Option 2: Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 🏃 Runtime Issues

### Issue: App won't start

**Error**: `Error: ENOENT: no such file or directory`

**Solution**:
```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install

# Rebuild
npm run build

# Start dev server
npm run dev
```

---

### Issue: Tailwind CSS not loading

**Error**: Styles not applied, classes ignored

**Solution**:
1. Check `tailwind.config.js` content paths:
```javascript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './lib/**/*.{js,ts,jsx,tsx,mdx}',
],
```

2. Check `app/globals.css` imports:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. Restart dev server:
```bash
# Ctrl+C
npm run dev
```

---

### Issue: "Cannot find module '@/...'"

**Error**: `Module not found: Can't resolve '@/...'`

**Solution**:
1. Check `tsconfig.json` paths:
```json
"paths": {
  "@/*": ["./*"]
}
```

2. Restart dev server
3. Check file actually exists

---

### Issue: TypeScript errors

**Error**: Type errors in IDE or build

**Solution**:
```bash
# Check for errors
npm run build

# If issue persists, try
rm -rf .next
npm run build

# Check tsconfig.json
# Make sure it's valid JSON (no trailing commas)
```

---

## 🎨 UI/UX Issues

### Issue: Styles look broken on mobile

**Error**: Layout broken on small screens

**Solution**:
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Test on different devices
4. Check responsive classes:
   - `hidden md:block` (hide on mobile, show on desktop)
   - `w-full md:w-1/2` (full width on mobile, half on desktop)

---

### Issue: Images not loading

**Error**: Image 404 or broken

**Solution**:
1. Check image URL is valid
2. Use placeholder service for mock:
```javascript
const imageUrl = 'https://via.placeholder.com/300x200?text=Description';
```

3. For real images, use Cloudinary or Unsplash:
```javascript
const imageUrl = 'https://unsplash.com/photos/IMAGE_ID/download';
```

---

### Issue: Modal doesn't close

**Error**: Modal stays open after action

**Solution**:
1. Check onClose function called
2. Verify state update: `setIsLoginOpen(false)`
3. Look for error in console

```typescript
// Make sure this is called
onClose();
setIsLoggedIn(true);
```

---

## 🔐 Authentication Issues

### Issue: Login doesn't work

**Error**: Stays on login modal or error message

**Solution**:
1. Check form submission:
   ```typescript
   const handleLogin = async () => {
     // Make sure to call onClose()
     onClose();
   };
   ```

2. Check state updates:
   ```typescript
   setIsLoggedIn(true);
   setUserRole('user');
   ```

3. Try different OTP code (current: `123456`)

---

### Issue: Can't access admin panel

**Error**: "Truy cập bị từ chối" message

**Solution**:
1. Make sure logged in
2. Set admin role in DevTools:
   ```javascript
   // Open DevTools Console (F12)
   // Change user role
   localStorage.setItem('userRole', 'admin');
   location.reload();
   ```

3. Or modify in code (for testing):
   ```typescript
   const [userRole, setUserRole] = useState('admin'); // For testing
   ```

---

## 📊 Data Issues

### Issue: Mock data not showing

**Error**: Empty lists or no data displayed

**Solution**:
1. Check `lib/data.ts` has data exported
2. Verify import in component:
   ```typescript
   import { mockPosts, mockStores } from '@/lib/data';
   ```

3. Check component rendering the data:
   ```typescript
   {mockPosts.map(post => (
     <div key={post.id}>{post.content}</div>
   ))}
   ```

4. Open DevTools → Console, check for errors

---

### Issue: Data not updating

**Error**: State doesn't change when button clicked

**Solution**:
1. Check onClick handler:
   ```typescript
   <button onClick={() => setLikedPosts(new Set([...likedPosts, postId]))}>
     Like
   </button>
   ```

2. Verify state is being set:
   ```typescript
   console.log('Liked posts:', likedPosts); // Should see update
   ```

3. Make sure you're creating new Set/Array (immutability):
   ```typescript
   // ❌ Wrong
   likedPosts.add(postId);
   
   // ✅ Correct
   const newLikes = new Set(likedPosts);
   newLikes.add(postId);
   setLikedPosts(newLikes);
   ```

---

## 🚀 Build Issues

### Issue: Build fails

**Error**: `npm run build` fails with errors

**Solution**:
```bash
# Check for errors
npm run build

# Common fixes:
# 1. Clean cache
rm -rf .next

# 2. Reinstall
rm -rf node_modules
npm install

# 3. Check for TypeScript errors
npx tsc --noEmit

# Try again
npm run build
```

---

### Issue: Build slow

**Error**: Build takes > 1 minute

**Solution**:
1. Check file size:
   ```bash
   du -sh .next/
   ```

2. Optimize imports (tree-shake unused):
   ```typescript
   // ✅ Good
   import { useState } from 'react';
   
   // ❌ Bad (imports everything)
   import * as React from 'react';
   ```

3. Use dynamic imports:
   ```typescript
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./Heavy'));
   ```

---

## 🌐 Deployment Issues

### Issue: Vercel deployment fails

**Error**: Build fails on Vercel

**Solution**:
1. Check build log on Vercel dashboard
2. Ensure `package.json` has build script:
   ```json
   "scripts": {
     "build": "next build",
     "start": "next start"
   }
   ```

3. Check environment variables set in Vercel dashboard

4. Try building locally first:
   ```bash
   npm run build
   npm start
   # Visit http://localhost:3000
   ```

---

### Issue: Site works locally but not on production

**Error**: Features don't work after deployment

**Common causes**:
1. Missing environment variables:
   ```bash
   # Add to Vercel:
   NEXT_PUBLIC_API_URL=your_api_url
   ```

2. API calls failing:
   - Check backend is running
   - Check CORS configured
   - Check auth tokens

3. Image issues:
   - Add domain to `next.config.js`:
   ```javascript
   images: {
     domains: ['example.com'],
   }
   ```

---

## 📡 API Issues

### Issue: API calls failing

**Error**: `fetch failed` or `CORS error`

**Solution**:
1. Check API URL in `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

2. Verify backend is running on correct port
3. Check CORS headers in backend:
   ```typescript
   app.use(cors({
     origin: 'http://localhost:3000',
     credentials: true
   }));
   ```

---

### Issue: CORS error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution** (Backend):
```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🗄️ Database Issues

### Issue: Database connection fails

**Error**: `ECONNREFUSED` or timeout

**Solution**:
1. Check PostgreSQL is running:
   ```bash
   # Mac/Linux
   pg_isready -h localhost -p 5432
   
   # Windows - Check Services
   ```

2. Verify connection string in `.env`:
   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/bme
   ```

3. Test connection:
   ```bash
   psql postgresql://user:password@localhost:5432/bme
   ```

---

### Issue: Database empty after deployment

**Error**: No data in production database

**Solution**:
1. Run migrations:
   ```bash
   npx knex migrate:latest
   ```

2. Seed initial data:
   ```bash
   npx knex seed:run
   ```

3. Verify connection:
   ```bash
   SELECT * FROM users; -- Should see data
   ```

---

## 🔍 Performance Issues

### Issue: Page slow to load

**Error**: Site takes long to respond

**Solution**:
1. Check Lighthouse score:
   - DevTools → Lighthouse → Analyze
   - Target: > 80

2. Optimize images:
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={300}
     height={200}
   />
   ```

3. Enable compression:
   ```bash
   npm install compression
   ```

4. Use CDN for static files

---

### Issue: High memory usage

**Error**: Server crashes or very slow

**Solution**:
```bash
# Add swap memory (Linux)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Monitor
top
# or
htop
```

---

## 🐛 Browser Issues

### Issue: App works in Chrome but not Firefox

**Error**: Features missing or broken

**Solution**:
1. Check for browser-specific code
2. Test in different browsers:
   - Chrome
   - Firefox
   - Safari
   - Edge

3. Check console for errors (F12 → Console)

4. Use polyfills if needed:
   ```bash
   npm install core-js
   ```

---

### Issue: Mobile app broken

**Error**: Touch interactions don't work

**Solution**:
1. Use DevTools mobile mode (Ctrl+Shift+M)
2. Check for mouse-only events:
   ```typescript
   // ❌ Only works with mouse
   onMouseOver={() => {}}
   
   // ✅ Works with touch too
   onTouchStart={() => {}}
   onClick={() => {}}
   ```

3. Ensure buttons are large enough (48x48px minimum)

---

## 💾 File Issues

### Issue: Uploaded files not showing

**Error**: 404 or broken file link

**Solution**:
1. Check upload directory exists
2. Verify permissions
3. Check file path is correct
4. For production, use cloud storage:
   ```bash
   npm install aws-sdk
   # or
   npm install cloudinary
   ```

---

## 🔐 Security Issues

### Issue: Sensitive data in logs

**Error**: Passwords/tokens visible in console

**Solution**:
```typescript
// ❌ Don't log sensitive data
console.log(password);

// ✅ Log safely
console.log('Auth successful');

// Hide in production
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info', data);
}
```

---

### Issue: XSS vulnerability

**Error**: Malicious scripts run

**Solution**:
```typescript
// ✅ Safe (React escapes by default)
<div>{userInput}</div>

// ❌ Unsafe (only if necessary)
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## 🎯 When All Else Fails

### Nuclear Option (Fresh Start)
```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clean everything
rm -rf node_modules
rm package-lock.json
rm -rf .next

# 3. Reinstall
npm install

# 4. Try building
npm run build

# 5. Start fresh
npm run dev
```

### Check Logs
```bash
# Frontend logs: Terminal running npm run dev
# Browser logs: F12 → Console
# Network logs: F12 → Network tab
```

### Get Help
1. Check error message carefully
2. Search error on Google
3. Check README.md & FEATURES.md
4. Check GitHub issues
5. Ask in community forums

---

## 📞 Getting Help

### Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)
- [GitHub Issues](https://github.com/vercel/next.js/issues)
- [Discord Community](https://discord.com/invite/vercel)

### When Asking for Help
Provide:
1. Error message (exact)
2. Steps to reproduce
3. Your environment (Node version, OS)
4. What you already tried

---

**Happy debugging!** 🔧✨

If you can't find your issue here, check the full documentation:
- README.md
- QUICK_START.md
- FEATURES.md
- ARCHITECTURE.md
