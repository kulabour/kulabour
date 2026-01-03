# Kulabur - Instant Labor Marketplace

A production-ready instant service marketplace connecting customers with workers in real-time.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (optional - works without it)
- Android Studio / Xcode (for mobile)

### Start Backend
```bash
# Windows
start-backend.bat

# macOS/Linux
cd backend && npm start
```

### Start Mobile App
```bash
# Windows
start-mobile.bat

# macOS/Linux
cd mobile-app && npx expo start
```

## ✨ Features

### Customer App
- 📱 OTP Authentication with JWT
- 🏠 Service browsing with real-time data
- 📅 Booking creation and management
- 🗺️ Live worker tracking with maps
- 💬 AI chatbot support
- 💳 Payment integration (mock)
- 🔔 Real-time status updates via WebSocket

### Worker App
- 🆔 KYC verification flow
- 💼 Job management
- 💰 Earnings tracking
- 📊 Performance analytics

### Backend
- 🔐 JWT authentication
- 🗄️ MongoDB persistence
- 🔌 WebSocket real-time updates
- 📡 RESTful API
- ☁️ Docker-ready

## 🏗️ Tech Stack

**Mobile**: React Native (Expo), TypeScript, TailwindCSS
**Backend**: Node.js, Express, MongoDB, Socket.IO
**Real-time**: WebSocket (Socket.IO)
**Auth**: JWT, OTP verification
**Maps**: React Native Maps

## 📚 Documentation

See `deployment_testing_guide.md` for complete setup and testing instructions.

## 🧪 Testing

1. Start backend: `npm start` in `/backend`
2. Start mobile: `npx expo start` in `/mobile-app`
3. Create booking → Track in real-time
4. Test API endpoints via curl (see guide)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & get JWT
- `POST /api/auth/refresh` - Refresh token

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking
- `PUT /api/bookings/:id/status` - Update status
- `GET /api/bookings/user/:userId` - User's bookings

### Services
- `GET /api/services` - List all services

### Verification
- `POST /api/verification/documents` - Submit worker docs
- `GET /api/verification/status/:workerId` - Check status

## 🔌 WebSocket Events

**Client → Server**:
- `join_booking` - Subscribe to booking updates
- `leave_booking` - Unsubscribe

**Server → Client**:
- `booking:status_changed` - Status update
- `booking:assigned` - Worker assigned
- `worker:location_update` - GPS update

## 📦 Project Structure

```
.
├── backend/
│   ├── config/          # Database, environment
│   ├── middleware/      # Auth, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── websocket.js     # Socket.IO server
│   └── server.js        # Main entry
│
├── mobile-app/
│   ├── app/             # Expo Router screens
│   ├── components/      # Reusable components
│   ├── services/        # API, WebSocket clients
│   └── global.css       # Tailwind styles
│
└── start-*.bat          # Startup scripts
```

## 🚢 Deployment

**Backend** (Railway/Render):
```bash
railway login
cd backend
railway up
```

**Mobile** (EAS Build):
```bash
eas build --platform android
eas build --platform ios
```

## 🤝 Contributing

This is a demonstration project showcasing:
- Real-time mobile app architecture
- Production-ready backend patterns
- Modern UI/UX best practices

## 📝 License

MIT

---

**Built with ❤️ using Expo, Express, and MongoDB**
