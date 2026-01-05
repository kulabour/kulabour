"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const admin = __importStar(require("firebase-admin"));
const users_service_1 = require("../users/users.service");
let PushNotificationService = class PushNotificationService {
    constructor(usersService) {
        this.usersService = usersService;
        this.isInitialized = false;
        this.initialize();
    }
    initialize() {
        if (this.isInitialized)
            return;
        if (process.env.USE_MOCKS === 'true') {
            console.log('⚠️  Mock Mode: Push Notifications will be logged to console only.');
            return;
        }
        try {
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                this.isInitialized = true;
                console.log('✅ Firebase Admin SDK initialized');
            }
            else {
                console.warn('⚠️  Firebase credentials not found. Push notifications disabled.');
            }
        }
        catch (error) {
            console.error('❌ Firebase initialization failed:', error);
        }
    }
    async sendToUser(fcmToken, notification) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`[MOCK NOTIFICATION] To: ${fcmToken.substring(0, 10)}... | Title: ${notification.title}`);
            return true;
        }
        if (!this.isInitialized) {
            console.warn('Push notification skipped: Firebase not initialized');
            return false;
        }
        try {
            const message = {
                token: fcmToken,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };
            const response = await admin.messaging().send(message);
            console.log(`✅ Push notification sent: ${response}`);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to send push notification:', error);
            return false;
        }
    }
    async sendToMultiple(fcmTokens, notification) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`[MOCK BATCH NOTIFICATION] To: ${fcmTokens.length} users | Title: ${notification.title}`);
            return fcmTokens.length;
        }
        if (!this.isInitialized || fcmTokens.length === 0) {
            return 0;
        }
        try {
            const message = {
                tokens: fcmTokens,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: { priority: 'high' },
            };
            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`✅ Sent ${response.successCount}/${fcmTokens.length} notifications`);
            return response.successCount;
        }
        catch (error) {
            console.error('❌ Failed to send batch notifications:', error);
            return 0;
        }
    }
    async notifyWorkerOfNewBooking(workerId, booking) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`📢 [MOCK] Notify Worker ${workerId}: New Booking ${booking._id}`);
            return;
        }
        const worker = await this.usersService.findById(workerId);
        if (worker && worker.fcmToken) {
            await this.sendToUser(worker.fcmToken, {
                title: 'New Booking Request! 🚨',
                body: `New job near you: ${booking.serviceName || 'Service'}. Tap to accept!`,
                data: { bookingId: booking._id.toString(), type: 'NEW_BOOKING' }
            });
        }
    }
    async notifyCustomerWorkerAssigned(customerId, worker) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`📢 [MOCK] Notify Customer ${customerId}: Worker ${worker.name} Assigned`);
            return;
        }
        const customer = await this.usersService.findById(customerId);
        if (customer && customer.fcmToken) {
            await this.sendToUser(customer.fcmToken, {
                title: 'Worker Assigned! 👷',
                body: `${worker.name} has accepted your request and is on the way.`,
                data: { workerId: worker._id.toString(), type: 'WORKER_ASSIGNED' }
            });
        }
    }
    async notifyCustomerBookingComplete(customerId, booking) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`📢 [MOCK] Notify Customer ${customerId}: Booking ${booking._id} Complete`);
            return;
        }
        const customer = await this.usersService.findById(customerId);
        if (customer && customer.fcmToken) {
            await this.sendToUser(customer.fcmToken, {
                title: 'Job Completed! ✅',
                body: 'Your service has been completed. Please rate your worker.',
                data: { bookingId: booking._id.toString(), type: 'BOOKING_COMPLETE' }
            });
        }
    }
};
exports.PushNotificationService = PushNotificationService;
exports.PushNotificationService = PushNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], PushNotificationService);
//# sourceMappingURL=push-notification.service.js.map