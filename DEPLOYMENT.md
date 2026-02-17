# Angular App Deployment Guide

## Option 1: Build Locally + Deploy Static Files (Recommended)

### Step 1: Build for Production
```bash
# On your local machine
cd c:\Users\campo\Documents\projects\etl_dbf_interface
npm run build
```

This creates a `dist/` folder with optimized static files.

### Step 2: Copy to Server
```bash
# Copy the dist folder to your server
scp -r dist/etl_dbf_interface/* user@192.168.10.43:/var/www/etl-interface/
```

### Step 3: Serve with Nginx

**Install Nginx (if not already installed):**
```bash
sudo apt update
sudo apt install nginx
```

**Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/etl-interface
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name 192.168.10.43;  # or your domain

    root /var/www/etl-interface;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional - if you want to avoid CORS)
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/etl-interface /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Access:** `http://192.168.10.43`

---

## Option 2: Docker Deployment

### Create Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/etl_dbf_interface /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Build and Run
```bash
# Build image
docker build -t etl-interface .

# Run container
docker run -d -p 80:80 --name etl-interface etl-interface
```

---

## Option 3: Docker Compose (Frontend + Backend)

### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    image: your-backend-image
    ports:
      - "3001:3001"
    networks:
      - etl-network

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - etl-network

networks:
  etl-network:
    driver: bridge
```

```bash
docker-compose up -d
```

---

## Important Notes

### ✅ You DO NOT need:
- Node.js on the server (for static deployment)
- node_modules on the server
- Source code on the server

### ✅ You ONLY need:
- The `dist/` folder contents
- A web server (nginx, apache, or docker)

### 🔧 Before Building:
1. Update `src/environments/environment.prod.ts` with correct API URL
2. Run `npm run build` locally
3. Deploy only the `dist/` folder

### 🚀 Quick Deploy Commands:
```bash
# Local machine
npm run build

# Copy to server
scp -r dist/etl_dbf_interface/* user@192.168.10.43:/var/www/etl-interface/

# On server (if using nginx)
sudo systemctl restart nginx
```

### 📝 Current Configuration:
- **Development API:** http://192.168.10.43:3001
- **Production API:** http://192.168.10.43:3001
- **Backend Port:** 3001
- **Frontend Port:** 80 (nginx) or 4200 (dev)
