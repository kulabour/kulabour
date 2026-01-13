# KULABOUR - Complete API Documentation

## 📋 Table of Contents
- [Base Configuration](#base-configuration)
- [REST APIs](#rest-apis)
  - [Authentication APIs](#authentication-apis)
  - [User APIs](#user-apis)
  - [Service APIs](#service-apis)
  - [Booking APIs](#booking-apis)
  - [Payment APIs](#payment-apis)
  - [Sync APIs](#sync-apis)
- [WebSocket APIs](#websocket-apis)
  - [Live Tracking Gateway](#live-tracking-gateway)
  - [Chat Gateway](#chat-gateway)
- [API Integration Guide](#api-integration-guide)

---

## Base Configuration

**Base URL**: Configured in `Config.API_URL`  
**Authentication**: JWT Bearer Token in Authorization header  
**Content-Type**: `application/json`

---

## REST APIs

### Authentication APIs

#### 1. Send OTP
**Endpoint**: `POST /auth/send-otp`  
**Description**: Send OTP to user's mobile number  
**Authentication**: Not required

**Request Body**:
```json
{
  "phone": "+919876543210"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

#### 2. Verify OTP
**Endpoint**: `POST /auth/verify-otp`  
**Description**: Verify OTP and get authentication token  
**Authentication**: Not required

**Request Body**:
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "phone": "+919876543210",
    "name": "John Doe",
    "role": "customer"
  }
}
```

---

#### 3. Login (Alternative)
**Endpoint**: `POST /auth/login`  
**Description**: Login with mobile and password  
**Authentication**: Not required

**Request Body**:
```json
{
  "mobile": "+919876543210",
  "password": "secure_password"
}
```

**Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

### User APIs

#### 1. Get User Profile
**Endpoint**: `GET /users/me`  
**Description**: Get current user's profile  
**Authentication**: Required

**Response**:
```json
{
  "id": "user123",
  "name": "John Doe",
  "phone": "+919876543210",
  "email": "john@example.com",
  "role": "customer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### 2. Update User Profile
**Endpoint**: `PUT /users/me`  
**Description**: Update current user's profile  
**Authentication**: Required

**Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

---

#### 3. Create User
**Endpoint**: `POST /users`  
**Description**: Create a new user  
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "Jane Doe",
  "phone": "+919876543211",
  "role": "worker"
}
```

---

#### 4. Get All Users
**Endpoint**: `GET /users`  
**Description**: Get all users (Admin only)  
**Authentication**: Required (Admin)

---

#### 5. Get User by Mobile
**Endpoint**: `GET /users/:mobile`  
**Description**: Get user details by mobile number  
**Authentication**: Required

---

### Service APIs

#### 1. Get All Services
**Endpoint**: `GET /services`  
**Description**: Get list of all available services  
**Authentication**: Not required

**Response**:
```json
[
  {
    "id": "service1",
    "name": "Plumber",
    "description": "Plumbing services",
    "category": "Home Repair",
    "basePrice": 500,
    "icon": "🔧"
  },
  {
    "id": "service2",
    "name": "Electrician",
    "description": "Electrical work",
    "category": "Home Repair",
    "basePrice": 600,
    "icon": "⚡"
  }
]
```

---

#### 2. Get Service by ID
**Endpoint**: `GET /services/:id`  
**Description**: Get specific service details  
**Authentication**: Not required

---

#### 3. Create Service
**Endpoint**: `POST /services`  
**Description**: Create a new service (Admin only)  
**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "Carpenter",
  "description": "Carpentry services",
  "category": "Home Repair",
  "basePrice": 550,
  "icon": "🪚"
}
```

---

### Booking APIs

#### 1. Create Booking
**Endpoint**: `POST /bookings`  
**Description**: Create a new service booking  
**Authentication**: Required

**Request Body**:
```json
{
  "serviceId": "service1",
  "customerId": "user123",
  "scheduledDate": "2024-12-25T10:00:00Z",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "description": "Kitchen sink repair needed",
  "estimatedHours": 2
}
```

**Response**:
```json
{
  "id": "booking123",
  "serviceId": "service1",
  "customerId": "user123",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### 2. Get All Bookings
**Endpoint**: `GET /bookings`  
**Description**: Get all bookings with optional filters  
**Authentication**: Required

**Query Parameters**:
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response**:
```json
{
  "bookings": [ ... ],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

---

#### 3. Get Booking by ID
**Endpoint**: `GET /bookings/:id`  
**Description**: Get specific booking details  
**Authentication**: Required

---

#### 4. Update Booking Status
**Endpoint**: `PUT /bookings/:id/status`  
**Description**: Update booking status  
**Authentication**: Required

**Request Body**:
```json
{
  "status": "confirmed",
  "workerId": "worker123",
  "workerName": "Ravi Kumar"
}
```

---

#### 5. Accept Booking
**Endpoint**: `PUT /bookings/:id/accept`  
**Description**: Worker accepts a booking  
**Authentication**: Required (Worker)

---

#### 6. Cancel Booking
**Endpoint**: `DELETE /bookings/:id`  
**Description**: Cancel a booking  
**Authentication**: Required

---

### Payment APIs

#### 1. Create Payment Order
**Endpoint**: `POST /payment/create-order`  
**Description**: Create a Razorpay payment order  
**Authentication**: Required  
**Rate Limit**: 10 requests per minute

**Request Body**:
```json
{
  "bookingId": "booking123",
  "amount": 1500
}
```

**Response**:
```json
{
  "orderId": "order_abc123",
  "amount": 1500,
  "currency": "INR",
  "receipt": "booking123"
}
```

---

#### 2. Verify Payment
**Endpoint**: `POST /payment/verify`  
**Description**: Verify Razorpay payment signature  
**Authentication**: Required  
**Rate Limit**: 5 requests per minute

**Request Body**:
```json
{
  "orderId": "order_abc123",
  "paymentId": "pay_xyz789",
  "signature": "signature_string",
  "bookingId": "booking123"
}
```

**Response**:
```json
{
  "verified": true,
  "bookingId": "booking123",
  "paymentStatus": "completed"
}
```

---

### Sync APIs

These APIs enable offline-first functionality using WatermelonDB sync.

#### 1. Pull Changes
**Endpoint**: `GET /sync?last_pulled_at=<timestamp>`  
**Description**: Get all changes since last sync  
**Authentication**: Required

**Query Parameters**:
- `last_pulled_at`: Unix timestamp of last sync (milliseconds)

**Response**:
```json
{
  "changes": {
    "bookings": {
      "created": [ ... ],
      "updated": [ ... ],
      "deleted": ["id1", "id2"]
    },
    "services": {
      "created": [ ... ],
      "updated": [ ... ]
    }
  },
  "timestamp": 1703980800000
}
```

---

#### 2. Push Changes
**Endpoint**: `POST /sync`  
**Description**: Push local changes to server  
**Authentication**: Required

**Request Body**:
```json
{
  "changes": {
    "bookings": {
      "created": [ ... ],
      "updated": [ ... ],
      "deleted": ["id1"]
    }
  }
}
```

**Response**:
```json
{
  "success": true
}
```

---

## WebSocket APIs

### Live Tracking Gateway

**Namespace**: `/live-tracking`  
**Purpose**: Real-time location tracking for workers

#### Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://your-api-url/live-tracking');

socket.on('connection_ack', (data) => {
  console.log('Connected:', data);
});
```

---

#### Events

##### 1. Subscribe to Booking
**Event**: `subscribe`  
**Description**: Subscribe to location updates for a booking

**Emit**:
```javascript
socket.emit('subscribe', {
  bookingId: 'booking123',
  userId: 'user123',
  role: 'customer' // or 'worker'
});
```

**Receive**:
```javascript
socket.on('location_update', (data) => {
  console.log('Worker location:', data);
  // {
  //   bookingId: 'booking123',
  //   workerId: 'worker123',
  //   latitude: 19.0760,
  //   longitude: 72.8777,
  //   heading: 45,
  //   speed: 20,
  //   timestamp: 1703980800000
  // }
});
```

---

##### 2. Worker Location Update
**Event**: `worker_location`  
**Description**: Worker sends location update

**Emit**:
```javascript
socket.emit('worker_location', {
  bookingId: 'booking123',
  workerId: 'worker123',
  latitude: 19.0760,
  longitude: 72.8777,
  heading: 45,
  speed: 20
});
```

---

##### 3. Worker ETA Update
**Event**: `worker_eta`  
**Description**: Update estimated time of arrival

**Emit**:
```javascript
socket.emit('worker_eta', {
  bookingId: 'booking123',
  etaMinutes: 15,
  distanceMeters: 3000,
  trafficCondition: 'moderate' // 'light', 'moderate', 'heavy'
});
```

**Receive**:
```javascript
socket.on('eta_update', (data) => {
  console.log('ETA updated:', data);
});
```

---

##### 4. Worker Arrived
**Event**: `worker_arrived`  
**Description**: Worker has arrived at location

**Emit**:
```javascript
socket.emit('worker_arrived', {
  bookingId: 'booking123',
  workerId: 'worker123'
});
```

**Receive**:
```javascript
socket.on('worker_arrived', (data) => {
  console.log('Worker arrived:', data);
});
```

---

##### 5. Unsubscribe
**Event**: `unsubscribe`  
**Description**: Stop receiving updates for a booking

**Emit**:
```javascript
socket.emit('unsubscribe', {
  bookingId: 'booking123'
});
```

---

##### 6. Ping/Pong
**Event**: `ping`  
**Description**: Check connection status

**Emit**:
```javascript
socket.emit('ping');
```

**Receive**:
```javascript
socket.on('pong', (data) => {
  console.log('Pong received:', data);
  // { pong: true, timestamp: 1703980800000 }
});
```

---

### Chat Gateway

**Namespace**: `/chat`  
**Purpose**: Real-time chat between customer and worker

#### Connection
```javascript
const chatSocket = io('http://your-api-url/chat');
```

---

#### Events

##### 1. Join Room
**Event**: `join_room`  
**Description**: Join a chat room for a booking

**Emit**:
```javascript
chatSocket.emit('join_room', 'booking123');
```

**Receive**:
```javascript
chatSocket.on('joined_room', (roomId) => {
  console.log('Joined room:', roomId);
});
```

---

##### 2. Send Message
**Event**: `send_message`  
**Description**: Send a chat message

**Emit**:
```javascript
chatSocket.emit('send_message', {
  roomId: 'booking123',
  message: 'Hello, I am on my way!',
  senderId: 'worker123'
});
```

**Receive**:
```javascript
chatSocket.on('receive_message', (data) => {
  console.log('New message:', data);
  // {
  //   roomId: 'booking123',
  //   message: 'Hello, I am on my way!',
  //   senderId: 'worker123'
  // }
});
```

---

##### 3. Typing Indicator
**Event**: `typing`  
**Description**: Show typing indicator

**Emit**:
```javascript
chatSocket.emit('typing', {
  roomId: 'booking123',
  isTyping: true,
  senderId: 'customer123'
});
```

**Receive**:
```javascript
chatSocket.on('user_typing', (data) => {
  console.log('User typing:', data);
});
```

---

## API Integration Guide

### Mobile App Setup

```typescript
import api, { authAPI, bookingsAPI } from './api/client';

// 1. Send OTP
const sendOTP = async (phone: string) => {
  try {
    await authAPI.sendOTP(phone);
  } catch (error) {
    console.error(error);
  }
};

// 2. Verify OTP and store token
const verifyOTP = async (phone: string, otp: string) => {
  try {
    const response = await authAPI.verifyOTP(phone, otp);
    await AsyncStorage.setItem('authToken', response.accessToken);
  } catch (error) {
    console.error(error);
  }
};

// 3. Create booking
const createBooking = async (bookingData: any) => {
  try {
    const booking = await bookingsAPI.create(bookingData);
    return booking;
  } catch (error) {
    console.error(error);
  }
};
```

### WebSocket Setup

```typescript
import io from 'socket.io-client';

// Initialize tracking socket
const trackingSocket = io(`${API_URL}/live-tracking`);

trackingSocket.on('connect', () => {
  // Subscribe to booking updates
  trackingSocket.emit('subscribe', {
    bookingId: 'booking123',
    userId: 'user123',
    role: 'customer'
  });
});

// Listen for location updates
trackingSocket.on('location_update', (location) => {
  updateMapMarker(location);
});
```

---

## Error Handling

All APIs return errors in the following format:

```json
{
  "message": "Error description",
  "status": 400,
  "details": { ... }
}
```

### Common HTTP Status Codes

- **200 OK**: Success
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or token expired
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

---

## Rate Limits

- **Payment Create Order**: 10 requests/minute
- **Payment Verify**: 5 requests/minute
- Other endpoints: No rate limit (development)

---

## Security

- All authenticated endpoints require `Authorization: Bearer <token>` header
- Tokens expire after configured period
- HTTPS recommended for production
- CORS configured for specific origins in production

---

## Next Steps

1. **Missing APIs to Implement**:
   - Worker availability management
   - Review and rating system
   - Notification preferences
   - Worker earnings/analytics
   - Admin dashboard analytics
   - Multi-language support
   - File upload (documents, photos)

2. **Enhancements**:
   - Add pagination to all list endpoints
   - Add search and filtering
   - Add sorting capabilities
   - Implement caching with Redis
   - Add API versioning

3. **Documentation**:
   - Add Swagger/OpenAPI documentation
   - Create Postman collection
   - Add code examples in multiple languages
