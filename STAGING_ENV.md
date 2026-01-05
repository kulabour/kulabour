# KULABOUR - Staging Environment Configuration

## Mobile App (.env)
Create `mobile-app/.env` with:
```bash
EXPO_PUBLIC_API_URL=https://staging-api.kulabour.com
EXPO_PUBLIC_WS_URL=wss://staging-api.kulabour.com
EXPO_PUBLIC_FIREBASE_API_KEY=your-staging-firebase-key
```

## Admin Dashboard (.env)
Create `admin-web/.env` with:
```bash
VITE_API_BASE_URL=https://staging-api.kulabour.com
VITE_WS_URL=wss://staging-api.kulabour.com
```

## Backend (.env)
Create `backend-nest/.env` with:
```bash
NODE_ENV=staging
PORT=3001
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/kulabour-staging
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=your-staging-jwt-secret
JWT_EXPIRATION=7d
```
