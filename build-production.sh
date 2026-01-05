#!/bin/bash
# KULABOUR Voice Assistant - Production Build Script

echo "🚀 Building KULABOUR Voice Assistant for Production"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Build Backend
echo "\n📦 Building Backend..."
cd backend-nest
npm run build

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Backend build successful${NC}"
else
    echo "${RED}❌ Backend build failed${NC}"
    exit 1
fi

# 2. Build Mobile App (EAS Build for production)
echo "\n📱 Building Mobile App..."
cd ../mobile-app

# Check if EAS is configured
if [ ! -f "eas.json" ]; then
    echo "⚠️  Warning: eas.json not found. Creating default configuration..."
    cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    }
  }
}
EOF
fi

echo "\n📋 Build Options:"
echo "1. Local Android APK (for testing)"
echo "2. EAS Production Build (for Play Store)"
echo "\nBuilding local APK for device testing..."

# Build local APK
npx expo export --platform android
npx eas build --platform android --profile preview --local

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Mobile build successful${NC}"
else
    echo "${RED}❌ Mobile build failed${NC}"
    exit 1
fi

echo "\n✅ All builds complete!"
echo "\n📄 Next steps:"
echo "1. Test APK on physical device (Redmi/Realme)"
echo "2. Deploy backend: npm run start:prod"
echo "3. Monitor voice analytics"
