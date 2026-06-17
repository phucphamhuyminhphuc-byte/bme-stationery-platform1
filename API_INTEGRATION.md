# 🔌 API Integration Guide - BME Stationery Platform

## Overview

Hướng dẫn này giải thích cách kết nối ứng dụng Next.js frontend với backend API thực tế.

---

## 1. Backend Setup (Node.js + Express)

### Bước 1: Tạo thư mục backend

```bash
mkdir bme-stationery-backend
cd bme-stationery-backend
npm init -y
npm install express cors dotenv pg axios
npm install -D typescript ts-node @types/node @types/express
```

### Bước 2: Tạo file cấu trúc

```
backend/
├── server.ts
├── .env
├── config/
│   └── database.ts
├── routes/
│   ├── auth.ts
│   ├── posts.ts
│   ├── stores.ts
│   ├── feedback.ts
│   └── communities.ts
├── controllers/
│   ├── authController.ts
│   ├── postController.ts
│   └── storeController.ts
└── middleware/
    ├── auth.ts
    └── validation.ts
```

### Bước 3: Express Server (server.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// TODO: Import routes
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/stores', storeRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### Bước 4: Database Connection (config/database.ts)

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
```

### Backend .env

```
PORT=5000
NODE_ENV=development

# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bme_stationery

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_secret_key

# API Keys
OPENAI_API_KEY=your_key
```

---

## 2. API Endpoints

### Authentication

```
POST /api/auth/register
{
  "phone": "0987654321",
  "name": "Nguyễn Văn A",
  "role": "user",  // user, business, coordinator
  "cccd": "123456789"
}

POST /api/auth/login
{
  "phone": "0987654321",
  "otp": "123456"
}

POST /api/auth/verify-otp
{
  "phone": "0987654321",
  "otp": "123456"
}

POST /api/auth/logout
{
  "token": "jwt_token"
}

GET /api/auth/me
Response: Current user data
```

### Posts

```
GET /api/posts
Query params: ?category=rao-ban&limit=20&offset=0

GET /api/posts/:id

POST /api/posts
{
  "category": "rao-ban",
  "content": "Bài viết mới",
  "images": ["url1", "url2"]
}

PUT /api/posts/:id
DELETE /api/posts/:id

POST /api/posts/:id/like
DELETE /api/posts/:id/like

POST /api/posts/:id/comments
{
  "text": "Bình luận"
}
```

### Stores

```
GET /api/stores
Query params: ?lat=10.7&lng=106.6&radius=5

GET /api/stores/:id

POST /api/stores
{
  "name": "Cửa hàng A",
  "lat": 10.7,
  "lng": 106.6,
  "products": ["p1", "p2"]
}

GET /api/stores/:id/feedback
POST /api/stores/:id/feedback
{
  "rating": 5,
  "comment": "Dịch vụ tốt"
}
```

### Communities

```
GET /api/communities

GET /api/communities/:id

POST /api/communities/:id/join

GET /api/communities/:id/files

POST /api/files
{
  "communityId": "c1",
  "title": "Service Manual",
  "type": "pdf",
  "file": <binary>
}

GET /api/files/:id/download
```

### OCR Search

```
POST /api/search/ocr
{
  "image": <binary>,  // base64 or file
  "confidence_threshold": 0.8
}

Response: {
  "confidence": 95,
  "text": "E-405",
  "results": [
    { "type": "article", ... },
    { "type": "store", ... },
    { "type": "spare-part", ... }
  ]
}
```

### Admin

```
GET /api/admin/analytics
GET /api/admin/heatmap
GET /api/admin/trending-keywords
GET /api/admin/alerts
POST /api/admin/alerts/:id/resolve
```

---

## 3. Frontend Integration

### Setup API Client (lib/api.ts)

```typescript
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Auth
  register(data: any) {
    return this.client.post('/auth/register', data);
  }

  login(phone: string, otp: string) {
    return this.client.post('/auth/login', { phone, otp });
  }

  // Posts
  getPosts(query?: any) {
    return this.client.get('/posts', { params: query });
  }

  getPost(id: string) {
    return this.client.get(`/posts/${id}`);
  }

  createPost(data: any) {
    return this.client.post('/posts', data);
  }

  likePost(id: string) {
    return this.client.post(`/posts/${id}/like`);
  }

  // Stores
  getStores(query?: any) {
    return this.client.get('/stores', { params: query });
  }

  getStore(id: string) {
    return this.client.get(`/stores/${id}`);
  }

  getStoreFeedback(id: string) {
    return this.client.get(`/stores/${id}/feedback`);
  }

  addFeedback(storeId: string, data: any) {
    return this.client.post(`/stores/${storeId}/feedback`, data);
  }

  // Communities
  getCommunities() {
    return this.client.get('/communities');
  }

  joinCommunity(id: string) {
    return this.client.post(`/communities/${id}/join`);
  }

  getFiles(communityId: string) {
    return this.client.get(`/communities/${communityId}/files`);
  }

  // OCR Search
  ocrSearch(imageData: string) {
    return this.client.post('/search/ocr', { image: imageData });
  }

  // Admin
  getAnalytics() {
    return this.client.get('/admin/analytics');
  }

  getHeatmap() {
    return this.client.get('/admin/heatmap');
  }
}

export const apiClient = new ApiClient();
```

### Update Component (components/UIComponents.tsx)

```typescript
// Example: Fetch real posts
'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.getPosts({ limit: 20 });
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Fallback to mock data
        setPosts(mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Rest of component...
};
```

### Update Login Modal

```typescript
export const LoginModal = ({ isOpen, onClose }: any) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(phone, otp);
      apiClient.setToken(response.data.token);
      onClose();
      // Refresh page or update auth state
    } catch (error) {
      console.error('Login failed:', error);
      alert('Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of component...
};
```

---

## 4. Environment Setup

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)

```
PORT=5000
DB_URL=postgresql://user:pass@localhost:5432/bme_stationery
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

---

## 5. Running Together

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

---

## 6. Error Handling

### Frontend (lib/api.ts)

```typescript
export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    return 'Vui lòng đăng nhập lại';
  }
  if (error.response?.status === 403) {
    return 'Bạn không có quyền thực hiện hành động này';
  }
  if (error.response?.status === 404) {
    return 'Không tìm thấy';
  }
  if (error.response?.status === 500) {
    return 'Lỗi server. Vui lòng thử lại sau';
  }
  return error.message || 'Có lỗi xảy ra';
};
```

---

## 7. Testing API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0987654321",
    "name": "Test User",
    "role": "user"
  }'

# Get posts
curl http://localhost:5000/api/posts

# Create post (with token)
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "category": "rao-ban",
    "content": "Post content"
  }'
```

### Using Postman

1. Import collection
2. Set base URL: `http://localhost:5000/api`
3. Add auth token to Headers
4. Test endpoints

---

## 8. Production Deployment

### Backend Deployment (Heroku)

```bash
# Login
heroku login

# Create app
heroku create bme-stationery-api

# Set environment variables
heroku config:set DB_URL=postgresql://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment (Vercel)

```bash
# Environment variables
NEXT_PUBLIC_API_URL=https://bme-stationery-api.herokuapp.com/api

# Deploy
vercel
```

---

## 9. Database Migrations

### Using TypeORM or Knex

```typescript
// Example migration
export async function up(knex: any) {
  return knex.schema.createTable('posts', (table: any) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users');
    table.string('category');
    table.text('content');
    table.json('images');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: any) {
  return knex.schema.dropTable('posts');
}
```

Run migrations:
```bash
npx knex migrate:latest
```

---

## 10. Real-time Features (Socket.io)

### Backend

```typescript
import { Server as SocketIoServer } from 'socket.io';

const io = new SocketIoServer(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('ping-technician', (data) => {
    io.emit('ping-received', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
```

### Frontend

```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL);

socket.on('ping-received', (data) => {
  console.log('Received ping:', data);
  // Show notification
});

// Send ping
socket.emit('ping-technician', { technicianId, message: 'Need help!' });
```

---

## Summary

- 🔧 Setup backend with Express
- 🔗 Create API routes & controllers
- 📡 Integrate frontend with API client
- 🔐 Handle authentication
- 🚀 Deploy to production
- 📊 Real-time features with Socket.io

**Happy coding!** 🎉
