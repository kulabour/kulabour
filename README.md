# Kulabur - Instant Labor Marketplace

A production-ready instant service marketplace connecting customers with workers in real-time.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (Recommended for persistence)
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

### Start Web App (Landing/Admin)
```bash
cd src && npm install && npm run dev
```

## ✨ Features

### Customer App
- 📱 **Secure Auth:** OTP Authentication with JWT & SecureStore
- 🏠 Service browsing with real-time data
- 📅 Booking creation and management
- 🗺️ Live worker tracking with maps
- 💬 **Secure AI Chatbot:** Backend-proxied OpenAI integration
- 🔔 Real-time status updates via WebSocket (Authenticated)

### Worker App
- 🆔 KYC verification flow (Secure Uploads)
- 💼 Job management
- 💰 Earnings tracking

### Backend
- 🔐 **Enhanced Security:** Rate limiting, Input Validation (Joi), Helmet, Secure Headers
- 🗄️ MongoDB persistence
- 🔌 **Secure WebSocket:** Authenticated real-time updates
- 📡 RESTful API

## 🏗️ Tech Stack

**Mobile**: React Native (Expo), TypeScript, TailwindCSS
**Web**: Next.js, React (located in `src/`)
**Backend**: Node.js, Express, MongoDB, Socket.IO
**Security**: Helmet, Joi, Rate-Limit, JWT
**Real-time**: WebSocket (Socket.IO)

## 📦 Project Structure

```
.
├── backend/             # Node.js/Express Backend
│   ├── config/          # Database, environment
│   ├── middleware/      # Auth, validation, rate-limiting
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── websocket.js     # Secure Socket.IO server
│   └── server.js        # Main entry
│
├── mobile-app/          # React Native Mobile App
│   ├── app/             # Expo Router screens
│   ├── components/      # Reusable components
│   ├── services/        # API, WebSocket clients
│   └── global.css       # Tailwind styles
│
├── src/                 # Next.js Web Application
│   ├── app/             # App Router
│   └── components/      # Web components
│
└── start-*.bat          # Startup scripts
```

## 🔒 Security Enhancements

This project has been hardened with the following security measures:
1.  **Rate Limiting:** Protects against brute-force attacks (100 req/15min).
2.  **Input Validation:** Strict request validation using `Joi` on all critical routes (Auth, Bookings, Verification, AI).
3.  **Secure OTP:** 6-digit random OTPs stored in memory with expiration (replaces hardcoded mocks).
4.  **WebSocket Auth:** Socket connections now require a valid JWT handshake.
5.  **Secure Storage:** Mobile app uses `expo-secure-store` for token storage.
6.  **Backend Proxy for AI:** OpenAI API keys are kept secure on the backend; mobile app communicates via a protected endpoint.

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send 6-digit OTP
- `POST /api/auth/verify-otp` - Verify OTP & get JWT
- `POST /api/auth/refresh` - Refresh token

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking
- `PUT /api/bookings/:id/status` - Update status

### AI Support
- `POST /api/ai/chat` - Secure AI chat interface

## 🤝 Contributing

This is a demonstration project showcasing:
- Real-time mobile app architecture
- Production-ready backend patterns
- Modern UI/UX best practices

## 📝 License

MIT

---

**Built with ❤️ using Expo, Express, Next.js, and MongoDB**
