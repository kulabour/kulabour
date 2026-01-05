# Phase 1 Testing Guide

## Prerequisites
```bash
cd backend-nest
npm install
```

## 1. Test Geolocation

### Seed Test Data
```bash
npx ts-node scripts/seed-geo-data.ts
```

Expected output:
```
✅ Seeded 5 test workers with geolocation data
📍 Found 3 workers within 5km:
  1. Worker 1 - Connaught Place
  2. Worker 2 - India Gate  
  3. Worker 3 - Karol Bagh
```

### Test Booking with Geolocation
```bash
# Start backend
docker-compose up

# In another terminal, create a booking
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "test123",
    "serviceName": "Plumber",
    "address": "Connaught Place, Delhi",
    "scheduledTime": "2025-12-20T10:00:00Z",
    "totalAmount": 500
  }'
```

Check logs for: `✅ Found X nearby workers within 5km`

---

## 2. Test Rate Limiting

### Test Payment Endpoint
```bash
# Should succeed (< 5 requests/min)
for i in {1..3}; do
  curl -X POST http://localhost:3001/payment/verify \
    -H "Content-Type: application/json" \
    -d '{"orderId":"order1","paymentId":"pay1","signature":"sig1","bookingId":"123456789012345678901234"}'
  sleep 1
done

# This should fail with 429 (Too Many Requests)
for i in {1..10}; do
  curl -X POST http://localhost:3001/payment/verify \
    -H "Content-Type: application/json" \
    -d '{"orderId":"order1","paymentId":"pay1","signature":"sig1","bookingId":"123456789012345678901234"}'
done
```

---

## 3. Test Input Validation

### Invalid Booking (should fail)
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "",
    "address": "too short",
    "totalAmount": 0
  }'
```

Expected: `400 Bad Request` with validation errors

### Valid Booking (should succeed)
```bash
curl -X POST http://localhost:3001/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "service123",
    "serviceName": "Electrician",
    "address": "123 Main St, New Delhi, India",
    "scheduledTime": "2025-12-20T14:00:00Z",
    "totalAmount": 750
  }'
```

---

## 4. Test Redis Caching

### Check Cache Performance
```bash
# First call (Cache MISS)
time curl http://localhost:3001/services

# Second call (Cache HIT - should be ~10x faster)
time curl http://localhost:3001/services
```

### Check Logs
Look for:
- `💾 ServicesService.findAll: Cache MISS, fetching from DB`
- `📦 ServicesService.findAll: Cache HIT`

### Verify Redis
```bash
# Connect to Redis container
docker exec -it $(docker ps -q -f name=redis) redis-cli

# Check cached keys
KEYS *
GET services:all
```

---

## 5. Test Offline Sync (Mobile)

### Start Mobile App
```bash
cd mobile-app
npx expo start
```

### Check Logs
Look for:
```
🚀 Initializing app...
🔄 Starting database synchronization...
📥 Pulling changes since [timestamp]
✅ Pulled changes successfully
🔄 Starting auto-sync (every 60 seconds)
✅ App initialized
```

### Test Offline Mode
1. Turn off WiFi on device
2. Create a booking
3. Turn WiFi back on
4. Wait for auto-sync (60s)
5. Check backend for synced booking

---

## Expected Results

| Test | Pass Criteria |
|------|---------------|
| Geolocation | Logs show 3 workers found within 5km |
| Rate Limiting | 429 error after 5 payment requests |
| Validation | 400 error for invalid data |
| Caching | 2nd request ~10x faster, redis has keys |
| Offline Sync | App syncs every 60s, bookings appear in backend |

---

## Troubleshooting

### Redis not working
```bash
docker-compose down
docker-compose up --build
```

### Geolocation returns 0 workers
```bash
# Re-seed data
npx ts-node scripts/seed-geo-data.ts

# Check MongoDB index
docker exec -it $(docker ps -q -f name=mongo) mongosh
use instant-labor
db.users.getIndexes()
```

### Build errors
```bash
npm install
npm run build
```
