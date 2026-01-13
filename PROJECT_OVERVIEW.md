# KULABOUR Project - Components Overview

## 📦 Project Structure

This project consists of **4 main components**:

### 1. 📱 Mobile App (Expo/React Native)
- **Location**: `mobile-app/`
- **Start**: `npm run mobile` (from root)
- **Status**: ✅ **Configured** to connect to Backend on Port 3000
- **Features**: Chat, Live Tracking, Payments (Razorpay Flow)

### 2. 🌐 Admin Dashboard (Vite + React)
- **Location**: `admin-web/`
- **Start**: `cd admin-web && npm run dev`
- **Status**: ✅ **Functional** (Verified against Backend)
- **Purpose**: Super admin dashboard for managing users/bookings

### 3. 🔧 Backend (NestJS)
- **Location**: `backend-nest/`
- **Start**: `cd backend-nest && npm run start:dev`
- **Status**: ✅ **Running** on Port 3000
- **Purpose**: Main API server (REST + WebSockets)

### 4. 🖥️ Landing Page (Next.js)
- **Location**: Root directory (`app/`, `src/`)
- **Dev**: `npm run dev` (development mode)
- **Prod**: `npm run build` then `npm start` (production mode)
- **Purpose**: Marketing/landing website

## 🚀 Quick Start Commands

```bash
# 1. Start Backend (REQUIRED)
cd backend-nest
npm run start:dev

# 2. Start Admin Dashboard (New Terminal)
cd admin-web
npm run dev

# 3. Start Mobile App (New Terminal)
# Ensure you are in the root directory
npm run mobile

# Landing Page (Dev Mode)
npm run dev
```

## ⚠️ Current Issue
You tried to run `npm start` which requires a production build. For development, use `npm run dev` instead.
