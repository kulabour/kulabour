# KULABOUR - API Keys & Environment Variables Guide

## 📋 Overview

This document lists all the API keys, credentials, and environment variables needed to run the KULABOUR application in development and production.

---

## 🔐 Required API Keys & Services

### 1. **Payment Gateway - Razorpay** ⭐ CRITICAL
**Service**: Payment processing  
**Where to get**: https://razorpay.com/

**Environment Variables** (Backend):
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
```

**How to get**:
1. Sign up at https://razorpay.com/
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys (for development)
4. Generate Live Keys (for production)

**Pricing**: Free tier available, transaction fees apply

---

### 2. **Maps & Location - Google Maps API** ⭐ CRITICAL
**Service**: Maps, geocoding, directions, location services  
**Where to get**: https://console.cloud.google.com/

**Environment Variables** (Mobile App):
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**APIs to Enable**:
- Maps SDK for Android
- Maps SDK for iOS
- Places API
- Directions API
- Geocoding API
- Distance Matrix API

**How to get**:
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable billing
4. Go to APIs & Services → Library
5. Enable the above APIs
6. Go to Credentials → Create Credentials → API Key
7. Restrict the key to specific APIs and platforms

**Pricing**: $200/month free credit, pay-as-you-go after

---

### 3. **Error Monitoring - Sentry** ⭐ RECOMMENDED
**Service**: Error tracking, performance monitoring  
**Where to get**: https://sentry.io/

**Environment Variables**:

**Backend**:
```env
SENTRY_DSN_BACKEND=https://xxxxx@xxxxx.ingest.sentry.io/xxxxxx
```

**Mobile App**:
```env
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxxx
```

**How to get**:
1. Sign up at https://sentry.io/
2. Create a new project for "Node.js" (backend)
3. Create a new project for "React Native" (mobile)
4. Copy the DSN from project settings

**Pricing**: Free tier (5K errors/month), paid plans available

---

### 4. **Push Notifications - Firebase Cloud Messaging** ⭐ CRITICAL
**Service**: Push notifications, real-time messaging  
**Where to get**: https://console.firebase.google.com/

**Environment Variables** (Backend):
```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
# OR
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**How to get**:
1. Go to Firebase Console
2. Create a new project or select existing
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Either:
   - Save file and set path in env var, OR
   - Stringify JSON and set as env var

**Mobile App Setup**:
- Android: Download `google-services.json`
- iOS: Download `GoogleService-Info.plist`

**Pricing**: Free tier (unlimited messages), paid plans for advanced features

---

### 5. **AI/Chatbot - OpenAI API** (Optional)
**Service**: AI-powered chatbot, recommendations  
**Where to get**: https://platform.openai.com/

**Environment Variables** (Mobile App):
```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get**:
1. Sign up at https://platform.openai.com/
2. Go to API Keys
3. Create new secret key
4. Copy and store securely

**Pricing**: Pay-as-you-go, ~$0.002/1K tokens for GPT-3.5

---

### 6. **Database - MongoDB** ⭐ CRITICAL
**Service**: Primary database  
**Where to get**: https://www.mongodb.com/cloud/atlas

**Environment Variables** (Backend):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulabour?retryWrites=true&w=majority
```

**How to get**:
1. Sign up at MongoDB Atlas
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist IP address (or allow from anywhere for dev)
5. Get connection string from "Connect" → "Connect your application"

**Pricing**: Free tier (512MB storage), paid plans available

---

### 7. **Caching - Redis** (Optional but Recommended)
**Service**: Caching, session storage  
**Where to get**: Local or https://redis.com/cloud/

**Environment Variables** (Backend):
```env
REDIS_URL=redis://username:password@host:port
# OR for local
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Options**:
- **Local**: Install Redis locally (free)
- **Cloud**: Redis Cloud, AWS ElastiCache, DigitalOcean

**Pricing**: Free for local, cloud pricing varies

---

### 8. **SMS/OTP Service** ⭐ CRITICAL
**Service**: SMS verification for authentication  
**Options**: Twilio, MSG91, Firebase Auth

**Recommended**: **Twilio**  
**Where to get**: https://www.twilio.com/

**Environment Variables** (Backend):
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

**How to get**:
1. Sign up at Twilio
2. Get Account SID and Auth Token from console
3. Buy a phone number
4. Configure messaging service

**Alternative - MSG91** (Better for India):
```env
MSG91_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MSG91_SENDER_ID=KULABR
```

**Pricing**: 
- Twilio: $15 free credit, then ~$0.0075/SMS
- MSG91: Pay-as-you-go, cheaper for India

---

## 🔧 Backend Environment Variables

Create a `.env` file in `backend-nest/` directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kulabour

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Payment
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

# Firebase (for push notifications)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
# OR
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# SMS/OTP (choose one)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
# OR
MSG91_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Error Monitoring
SENTRY_DSN_BACKEND=https://xxxxx@xxxxx.ingest.sentry.io/xxxxxx

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Google Maps (for server-side geocoding)
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📱 Mobile App Environment Variables

Create a `.env` file in `mobile-app/` directory:

```env
# API
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_WS_URL=ws://localhost:5000
EXPO_PUBLIC_SOCKET_URL=http://localhost:5000

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxxx

# OpenAI (optional)
EXPO_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### For Expo:
Install env plugin:
```bash
npm install react-native-dotenv
```

Or use Expo's built-in env support (recommended):
```bash
# Variables starting with EXPO_PUBLIC_ are automatically available
```

---

## 🌐 Production Environment Variables

### Backend (Render/Heroku/AWS)
Set these in your hosting dashboard:
- All backend variables from above
- Change `NODE_ENV=production`
- Use production MongoDB cluster
- Use production Redis instance
- Use Razorpay **LIVE** keys (not test)

### Mobile App (Expo EAS)
Create `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.kulabour.com",
        "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY": "production-key"
      }
    }
  }
}
```

---

## 💰 Cost Estimate

### Minimal Setup (Development):
- ✅ MongoDB Atlas Free Tier: **$0/month**
- ✅ Redis Local: **$0/month**
- ✅ Razorpay Test: **$0/month**
- ✅ Firebase Free Tier: **$0/month**
- ✅ Google Maps (within free credit): **$0/month**
- ✅ Sentry Free Tier: **$0/month**
- **Total**: **$0/month**

### Production (Starter):
- MongoDB Atlas Shared: **$9/month**
- Redis Cloud: **$5/month** (or free for small cache)
- Razorpay: **Transaction fees only** (2-3%)
- Firebase: **$0-25/month** (depends on usage)
- Google Maps: **$50-200/month** (depends on API calls)
- Sentry: **$0-26/month** (depends on errors)
- SMS (Twilio/MSG91): **$20-100/month** (depends on volume)
- **Total**: **~$100-400/month**

---

## 📝 Setup Instructions

### 1. Clone and Install
```bash
# Backend
cd backend-nest
npm install
cp .env.example .env  # Copy and edit

# Mobile App
cd mobile-app
npm install
cp .env.example .env  # Copy and edit
```

### 2. Get Free API Keys First
1. ✅ MongoDB Atlas (5 minutes)
2. ✅ Razorpay Test Keys (2 minutes)
3. ✅ Google Cloud Console (15 minutes)
4. ✅ Firebase Console (10 minutes)
5. ✅ Sentry (5 minutes)

### 3. Run Locally
```bash
# Backend
cd backend-nest
npm run start:dev

# Mobile App
cd mobile-app
npm run dev
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. Add `.env` to `.gitignore`
3. Use different keys for development and production
4. Rotate keys regularly
5. Use environment-specific configs
6. Restrict API keys to specific domains/IPs
7. Enable MFA on all service accounts
8. Store production keys in secure vaults (AWS Secrets Manager, etc.)

---

## 🚀 Quick Start Checklist

- [ ] Create MongoDB Atlas account and cluster
- [ ] Get Razorpay test API keys
- [ ] Create Google Cloud project and enable Maps APIs
- [ ] Set up Firebase project for push notifications
- [ ] Get Sentry DSN for error tracking
- [ ] Choose SMS provider (Twilio or MSG91)
- [ ] Create `.env` files in both backend and mobile-app
- [ ] Test all integrations locally
- [ ] Set up production keys when ready to deploy

---

## 📞 Support

If you encounter issues with any service:
- Razorpay: https://razorpay.com/support/
- Google Maps: https://developers.google.com/maps/support
- Firebase: https://firebase.google.com/support
- Sentry: https://sentry.io/support/
- MongoDB: https://www.mongodb.com/support
- Twilio: https://www.twilio.com/help

---

## 🔄 Updates

Last updated: December 2024  
Next review: When adding new services or updating integrations
