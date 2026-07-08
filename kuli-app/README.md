# 📱 Kuli Platform - Mobile App

The frontend client for the Kuli Platform. A unified Expo React Native application featuring distinct experiences for both **Customers** (hiring laborers) and **Workers** (finding jobs).

## Tech Stack
- **Framework:** React Native + [Expo](https://expo.dev/)
- **Navigation:** Expo Router (File-based routing)
- **Styling:** StyleSheet (Brutalist, high-contrast UI)
- **Maps:** React Native Maps (for live tracking)
- **API Client:** Fetch API (to Kuli Backend)

## 🎨 Design System

Kuli uses a bold, hyper-tactile design language optimized for speed and outdoor visibility.
- **Typography:** Inter (Bold headers, highly legible).
- **Colors:** Deep Black (#000000), Pure White (#FFFFFF), Action Green (#00C853), Alert Red (#D50000).
- **Components:** Large tap targets, hard shadows, explicit UI states.

## 🏗️ Project Structure

The app utilizes **Expo Router** and is broken down into tabbed interfaces:

```
app/
├── (tabs)/
│   ├── index.tsx     # Home Screen (Customer/Worker dashboard)
│   ├── search.tsx    # Customer Search / Nearby Workers
│   ├── bookings.tsx  # Booking History (Upcoming/Completed)
│   ├── chat.tsx      # In-app messaging interface
│   └── profile.tsx   # User Settings & Payment Methods
├── worker/
│   └── [id].tsx      # Detailed Worker Profile (Reviews, Rate card)
├── booking/
│   └── tracking.tsx  # Live GPS Tracking Map
├── payment/
│   └── checkout.tsx  # Razorpay WebView integration
└── _layout.tsx       # Root layout & Navigation setup
```

## 🚀 Local Development

To run the Kuli app locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the Metro Bundler:**
   ```bash
   npx expo start -c
   ```

3. **Run on a Device/Emulator:**
   - Press `a` to run on an Android Emulator.
   - Press `i` to run on an iOS Simulator.
   - Scan the QR code with the Expo Go app on a physical device.

## 📦 Production Builds (Android)

Kuli is distributed as an APK for Android users. A detailed step-by-step guide on how to sign and compile the production APK using `eas build` is available in the root documentation.

👉 **[See the Android Build & Deployment Guide](../07_ANDROID_BUILD_DEPLOYMENT_GUIDE.md)**
