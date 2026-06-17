# 🚀 Hướng dẫn triển khai BME Stationery Platform

## Phương án 1: Vercel (Được Khuyến Nghị) ⭐

Vercel là platform tối ưu cho Next.js apps.

### Bước 1: Chuẩn bị
```bash
# Đảm bảo tất cả code đã commit
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Bước 2: Triển khai lên Vercel
```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Đăng nhập
vercel login

# Deploy
vercel
```

### Bước 3: Cấu hình Environment
- Truy cập https://vercel.com/dashboard
- Chọn project của bạn
- Settings → Environment Variables
- Thêm các biến từ `.env.example`

### URL sau triển khai
```
https://your-project-name.vercel.app
```

---

## Phương án 2: Netlify

### Bước 1: Build locally
```bash
npm run build
```

### Bước 2: Cấu hình
Tạo file `netlify.toml` ở root:
```toml
[build]
  command = "npm run build"
  functions = "functions"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Bước 3: Deploy
- Đăng nhập https://netlify.com
- Kéo thả folder project
- Hoặc connect GitHub repo tự động

---

## Phương án 3: Self-Hosted (VPS/Dedicated Server)

### Yêu cầu Server
- Node.js 18+
- RAM: 2GB tối thiểu
- CPU: 2 cores
- Storage: 20GB SSD
- OS: Ubuntu 22.04 / CentOS 8

### Bước 1: SSH vào Server
```bash
ssh root@your_server_ip
```

### Bước 2: Cài đặt Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kiểm tra
node --version
npm --version
```

### Bước 3: Clone Repository
```bash
cd /var/www
git clone https://github.com/your-username/bme-stationery.git
cd bme-stationery
```

### Bước 4: Cài đặt Dependencies & Build
```bash
npm install
npm run build
```

### Bước 5: Cấu hình Environment
```bash
cp .env.example .env.local
# Chỉnh sửa .env.local với thông tin thực
nano .env.local
```

### Bước 6: Cài đặt PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Tạo ecosystem config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'bme-stationery',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/bme-stationery',
      env: {
        NODE_ENV: 'production'
      },
      instances: 'max',
      exec_mode: 'cluster'
    }
  ]
};
EOF

# Khởi động
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Bước 7: Cấu hình Nginx (Reverse Proxy)
```bash
sudo nano /etc/nginx/sites-available/default
```

Thêm config:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 8: SSL Certificate (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Bước 9: Auto Update
```bash
# Tạo script auto-pull
cat > /var/www/bme-stationery/deploy.sh << EOF
#!/bin/bash
cd /var/www/bme-stationery
git pull origin main
npm install
npm run build
pm2 restart bme-stationery
EOF

chmod +x /var/www/bme-stationery/deploy.sh

# Webhook để trigger khi push
# (Tùy từng platform Git)
```

---

## Phương án 4: Docker (Recommended cho DevOps)

### Bước 1: Tạo Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Bước 2: Tạo .dockerignore
```
node_modules
.next
.git
.env
.env.local
```

### Bước 3: Build & Run
```bash
# Build image
docker build -t bme-stationery:1.0 .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e DATABASE_URL=your_db_url \
  bme-stationery:1.0
```

### Bước 4: Docker Compose (Production)
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      NEXTAUTH_URL: https://your-domain.com
      DATABASE_URL: postgres://user:pass@db:5432/bme
    depends_on:
      - db
    restart: always

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: bme_stationery
      POSTGRES_USER: bme_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: always

volumes:
  db_data:
```

Run:
```bash
docker-compose up -d
```

---

## Phương án 5: AWS (EC2 + RDS + CloudFront)

### Bước 1: Launch EC2 Instance
- Type: t3.medium hoặc lớn hơn
- AMI: Ubuntu 22.04 LTS
- Security Group: Allow HTTP(80), HTTPS(443), SSH(22)

### Bước 2: RDS Database
- Engine: PostgreSQL 15
- Multi-AZ: Yes (Production)
- Backup retention: 30 days

### Bước 3: Setup EC2
```bash
# SSH vào instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow self-hosted steps (từ trên)
```

### Bước 4: CloudFront CDN
- Create distribution
- Origin: Your EC2 instance
- Caching: Optimize for Next.js

### Bước 5: Route53 DNS
- Create hosted zone
- Add A record → CloudFront

---

## Database Setup (PostgreSQL)

### Bước 1: Kết nối Database
```bash
# Install psql client
sudo apt-get install postgresql-client

# Connect
psql -h your-db-host -U your-user -d bme_stationery
```

### Bước 2: Create Tables
```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    category VARCHAR(100),
    content TEXT,
    images TEXT[],
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    name VARCHAR(255),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    rating DECIMAL(3, 1),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    store_id INT REFERENCES stores(id),
    user_id INT REFERENCES users(id),
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communities
CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    members_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    community_id INT REFERENCES communities(id),
    title VARCHAR(255),
    file_type VARCHAR(50),
    file_size INT,
    file_url TEXT,
    uploaded_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Monitoring & Maintenance

### Health Check
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs bme-stationery

# Monitor resources
pm2 monit
```

### Backups
```bash
# Database backup
pg_dump -h your-db-host -U your-user bme_stationery > backup.sql

# Auto backup script
0 2 * * * /path/to/backup.sh  # Run at 2 AM daily
```

### Updates
```bash
cd /var/www/bme-stationery
git pull origin main
npm install
npm run build
pm2 restart bme-stationery
```

---

## Performance Optimization

### 1. Image Optimization
```bash
# Install imagemin
npm install imagemin imagemin-mozjpeg imagemin-pngquant
```

### 2. Caching Strategy
- Static content: 1 year
- HTML pages: 1 day
- API: No cache

### 3. CDN
- Cloudflare (Free tier available)
- AWS CloudFront
- Fastly

### 4. Database Optimization
```sql
-- Index creation
CREATE INDEX idx_user_phone ON users(phone);
CREATE INDEX idx_post_user_id ON posts(user_id);
CREATE INDEX idx_post_created_at ON posts(created_at);
CREATE INDEX idx_store_location ON stores USING GIST (
    ll_to_earth(lat, lng)
);
```

---

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Environment variables secured
- [ ] Database password strong
- [ ] Firewall rules configured
- [ ] Regular backups
- [ ] Security patches updated
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] XSS/CSRF protection
- [ ] SQL injection prevention

---

## Troubleshooting

### App won't start
```bash
pm2 kill
pm2 start ecosystem.config.js
pm2 logs
```

### High memory usage
```bash
pm2 restart all
# Or add swap memory
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Database connection error
```bash
# Test connection
psql -h your-db-host -U your-user -d bme_stationery -c "SELECT 1"

# Check .env.local
cat .env.local | grep DATABASE_URL
```

---

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- PM2 Docs: https://pm2.keymetrics.io/

---

**Chúc bạn triển khai thành công!** 🚀
