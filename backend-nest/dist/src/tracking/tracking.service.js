"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingService = void 0;
const common_1 = require("@nestjs/common");
let TrackingService = class TrackingService {
    constructor() {
        this.activeTracking = new Map();
    }
    setServer(server) {
        this.server = server;
    }
    startTracking(bookingId, workerId, customerId) {
        this.server.to(`booking_${bookingId}`).emit('tracking_started', {
            bookingId,
            workerId,
            timestamp: new Date(),
        });
        console.log(`Started tracking for booking ${bookingId}`);
    }
    updateLocation(bookingId, workerId, location) {
        const update = {
            workerId,
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            timestamp: new Date(),
        };
        this.activeTracking.set(bookingId, update);
        this.server.to(`booking_${bookingId}`).emit('location_update', {
            workerId,
            location: {
                latitude: update.latitude,
                longitude: update.longitude,
            },
            timestamp: update.timestamp,
        });
    }
    calculateETA(currentLocation, destination) {
        const R = 6371;
        const dLat = this.toRad(destination.latitude - currentLocation.latitude);
        const dLon = this.toRad(destination.longitude - currentLocation.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(currentLocation.latitude)) *
                Math.cos(this.toRad(destination.latitude)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        const avgSpeed = 30;
        const eta = (distance / avgSpeed) * 60;
        return Math.round(eta);
    }
    stopTracking(bookingId) {
        this.activeTracking.delete(bookingId);
        this.server.to(`booking_${bookingId}`).emit('tracking_stopped', {
            bookingId,
            timestamp: new Date(),
        });
        console.log(`Stopped tracking for booking ${bookingId}`);
    }
    getCurrentLocation(bookingId) {
        return this.activeTracking.get(bookingId) || null;
    }
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
};
exports.TrackingService = TrackingService;
exports.TrackingService = TrackingService = __decorate([
    (0, common_1.Injectable)()
], TrackingService);
//# sourceMappingURL=tracking.service.js.map