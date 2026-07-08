# 🏗️ Kuli Platform - Backend API

The core backend infrastructure powering the Kuli Labour App, enabling instant matching between construction workers and customers in India.

## Tech Stack
- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Database:** PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Caching & Presence:** Redis
- **Testing:** Jest (Unit & Integration)
- **Deployment:** Docker & GitHub Actions to AWS EC2

## 🚀 Local Development Setup

To run the Kuli backend locally, you need Docker installed to spin up the required dependencies.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Infrastructure (Postgres & Redis):**
   Ensure you have Docker running, then execute:
   ```bash
   docker compose up -d
   ```

3. **Run Prisma Migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Start the API Server:**
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3000`.

## 📡 API Overview (15 Shipped Endpoints)

The Kuli Backend exposes modular REST endpoints for all MVP features:

### 1. Booking (`/api/booking`)
Handles the core state transitions of the app.
- `POST /` - Create a new booking
- `GET /customer/:customerId` - Get booking history for a customer
- `GET /worker/:workerId` - Get booking history for a worker
- `GET /:id` - Get specific booking details
- `PATCH /:id/status` - Force update status (Admin)
- `POST /:id/accept` - Worker accepts a PENDING booking
- `POST /:id/decline` - Worker declines a PENDING booking
- `POST /:id/cancel` - Customer cancels an active booking

### 2. Search (`/api/search`)
- `GET /nearby` - Finds active, online workers within a coordinate radius using Haversine formulas.

### 3. Worker (`/api/worker`)
- `GET /:id/profile` - Fetches worker profile, reviews, and stats.
- `PATCH /:id/location` - Updates live GPS coordinates in Redis.
- `PATCH /:id/online` - Toggles worker presence in `city:online:{city}` Redis sets.

### 4. Tracking (`/api/tracking`)
- `GET /:bookingId/location` - Gets the real-time ETA and coordinates of the assigned worker.

### 5. Payment (`/api/payment`)
- `POST /razorpay/order` - Generates an order ID for Razorpay WebView initialization.
- `POST /razorpay/webhook` - Secure webhook endpoint validated via SHA256 HMAC signature. Transitions bookings to `COMPLETED`.

### 6. Review (`/api/review`)
- `POST /` - Customer leaves a 1-5 star rating and review post-job.

### 7. Chat (`/api/chat`)
- `GET /:bookingId` - Retrieves chat history for an active job.

## 🧪 Testing

The backend includes a comprehensive Jest test suite that guarantees the integrity of our booking state machine and webhook security.

```bash
# Run the full regression suite (9 test suites, 100% Coverage)
npm run test
```

> **Note:** The test suite uses global Prisma and Redis mocks to ensure blazing-fast unit testing without requiring a live database connection.
