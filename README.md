# 🚀 KULABOUR - Instant Service Platform

[![Production Ready](https://img.shields.io/badge/status-production--ready-green)]()
[![TypeScript](https://img.shields.io/badge/typescript-100%25-blue)]()
[![Security](https://img.shields.io/badge/security-0%20vulnerabilities-brightgreen)]()

On-demand service platform connecting customers with skilled workers in India. Built with React Native (Expo), NestJS, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

---

## ✨ Features

### Mobile App (Customer & Worker)
- 🔐 OTP-based authentication
- 📍 Real-time GPS tracking
- 💳 Multiple payment options
- ⭐ Rating & reviews system
- 🌐 Offline-first architecture (WatermelonDB)
- 🎨 3D UI elements with React Three Fiber
- 🌙 Dark mode support

### Admin Dashboard
- 📊 Real-time analytics
- 👥 User management
- 💰 Revenue tracking
- 🗺️ Live map view
- 📈 Interactive charts (Recharts)

### Backend API
- 🔒 JWT authentication
- 🚦 Rate limiting & caching
- 📝 Structured logging (Pino)
- 🔔 Push notifications (Firebase)
- 💾 MongoDB Atlas integration
- 🐂 Bull queues for background jobs

---

## 🛠️ Tech Stack

| Component | Technologies |
|-----------|-------------|
| **Mobile** | React Native, Expo 54, TypeScript, WatermelonDB, TailwindCSS (NativeWind) |
| **Admin** | Vite, React 19, TypeScript, TailwindCSS, Recharts, Leaflet |
| **Backend** | NestJS, MongoDB, Redis, Bull, Socket.IO |
| **DevOps** | GitHub Actions, Docker, Expo EAS |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Redis (optional, for caching)

### 1. Clone Repository
```bash
git clone https://github.com/your-org/kulabour.git
cd kulabour
```

### 2. Install Dependencies
```bash
# Root dependencies
npm install

# Mobile app
cd mobile-app && npm install

# Admin dashboard
cd ../admin-web && npm install

# Backend
cd ../backend-nest && npm install
```

### 3. Environment Setup

#### Mobile App (`.env`)
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_WS_URL=ws://localhost:3001
```

#### Admin Dashboard (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

#### Backend (`.env`)
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/kulabour
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend-nest
npm run start:dev

# Terminal 2 - Mobile App
cd mobile-app
npm start

# Terminal 3 - Admin Dashboard
cd admin-web
npm run dev
```

**Access:**
- Mobile: http://localhost:8081
- Admin: http://localhost:5173
- API: http://localhost:3001
- Health: http://localhost:3001/health

---

## 📁 Project Structure

```
kulabour/
├── mobile-app/          # Expo React Native app
│   ├── app/            # Expo Router pages
│   ├── components/     # Reusable components
│   ├── services/       # API & offline services
│   └── database/       # WatermelonDB models
├── admin-web/          # Vite admin dashboard
│   ├── src/
│   │   ├── pages/     # Dashboard pages
│   │   ├── components/
│   │   └── lib/       # Utilities
├── backend-nest/       # NestJS API
│   ├── src/
│   │   ├── auth/      # Authentication
│   │   ├── bookings/  # Booking management
│   │   ├── users/     # User management
│   │   └── sync/      # Offline sync
└── docs/              # Documentation
```

---

## 💻 Development

### Mobile App Commands
```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS  
npm run web        # Run in browser
npm test           # Run tests
```

### Admin Dashboard Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # Run ESLint
```

### Backend Commands
```bash
npm run start:dev  # Start with hot reload
npm run build      # Build for production
npm run start:prod # Start production
npm test           # Run unit tests
npm run test:e2e   # Run E2E tests
```

---

## 🚢 Deployment

### Mobile App (Expo EAS)
```bash
cd mobile-app
eas build --platform all --profile production
eas submit --platform all
```

### Admin Dashboard (Vercel)
```bash
cd admin-web
vercel --prod
```

### Backend (Render/Railway)
```bash
# Via Render Dashboard
1. Connect GitHub repo
2. Build: npm run build
3. Start: npm run start:prod
4. Add environment variables
```

See [STAGING_ENV.md](./STAGING_ENV.md) for full deployment guide.

---

## 📚 API Documentation

### Authentication
```http
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/refresh
```

### Bookings
```http
GET    /bookings
POST   /bookings
GET    /bookings/:id
PATCH  /bookings/:id
DELETE /bookings/:id
```

### Health Check
```http
GET /health           # Basic health
GET /health/detailed  # With service status
```

**Interactive API Docs**: http://localhost:3001/api (Swagger)

---

##Status

- ✅ **TypeScript**: 100% (0 errors)
- ✅ **Security**: 0 production vulnerabilities
- ✅ **Tests**: Comprehensive coverage
- ✅ **CI/CD**: Automated workflows
- ✅ **Documentation**: Complete

---

## 📄 License

Proprietary - All rights reserved

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

- Email: support@kulabour.com
- Issues: [GitHub Issues](https://github.com/your-org/kulabour/issues)

---

**Built with ❤️ in India**
