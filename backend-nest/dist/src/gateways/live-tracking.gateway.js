"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LiveTrackingGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveTrackingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let LiveTrackingGateway = LiveTrackingGateway_1 = class LiveTrackingGateway {
    constructor() {
        this.logger = new common_1.Logger(LiveTrackingGateway_1.name);
        this.activeConnections = new Map();
        this.workerLocations = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.activeConnections.set(client.id, {
            userId: '',
            role: '',
            subscriptions: new Set(),
        });
        client.emit('connection_ack', {
            connected: true,
            timestamp: Date.now(),
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const connection = this.activeConnections.get(client.id);
        if (connection) {
            connection.subscriptions.forEach(bookingId => {
                client.leave(`booking:${bookingId}`);
            });
        }
        this.activeConnections.delete(client.id);
    }
    handleSubscribe(client, data) {
        const { bookingId, userId, role } = data;
        const connection = this.activeConnections.get(client.id);
        if (connection) {
            connection.userId = userId;
            connection.role = role;
            connection.subscriptions.add(bookingId);
        }
        client.join(`booking:${bookingId}`);
        this.logger.log(`User ${userId} (${role}) subscribed to booking ${bookingId}`);
        const currentLocation = this.workerLocations.get(bookingId);
        if (currentLocation) {
            client.emit('location_update', currentLocation);
        }
        return { success: true, bookingId };
    }
    handleUnsubscribe(client, data) {
        const { bookingId } = data;
        client.leave(`booking:${bookingId}`);
        const connection = this.activeConnections.get(client.id);
        if (connection) {
            connection.subscriptions.delete(bookingId);
        }
        this.logger.log(`Client ${client.id} unsubscribed from booking ${bookingId}`);
        return { success: true };
    }
    handleWorkerLocation(client, data) {
        const { bookingId } = data;
        this.workerLocations.set(bookingId, {
            ...data,
            timestamp: Date.now(),
        });
        this.server.to(`booking:${bookingId}`).emit('location_update', {
            ...data,
            timestamp: Date.now(),
        });
        this.logger.debug(`Worker location update for booking ${bookingId}`);
        return { success: true };
    }
    handleWorkerETA(client, data) {
        const { bookingId } = data;
        this.server.to(`booking:${bookingId}`).emit('eta_update', {
            ...data,
            timestamp: Date.now(),
        });
        return { success: true };
    }
    handleWorkerArrived(client, data) {
        const { bookingId, workerId } = data;
        this.server.to(`booking:${bookingId}`).emit('worker_arrived', {
            bookingId,
            workerId,
            arrivedAt: Date.now(),
        });
        this.logger.log(`Worker ${workerId} arrived for booking ${bookingId}`);
        this.workerLocations.delete(bookingId);
        return { success: true };
    }
    handlePing(client) {
        return { pong: true, timestamp: Date.now() };
    }
    emitLocationUpdate(bookingId, location) {
        this.workerLocations.set(bookingId, location);
        this.server.to(`booking:${bookingId}`).emit('location_update', location);
    }
    emitBookingStatus(bookingId, status, details) {
        this.server.to(`booking:${bookingId}`).emit('booking_status', {
            bookingId,
            status,
            details,
            timestamp: Date.now(),
        });
    }
    getListenerCount(bookingId) {
        const room = this.server.sockets.adapter.rooms.get(`booking:${bookingId}`);
        return room ? room.size : 0;
    }
};
exports.LiveTrackingGateway = LiveTrackingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LiveTrackingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LiveTrackingGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LiveTrackingGateway.prototype, "handleUnsubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('worker_location'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LiveTrackingGateway.prototype, "handleWorkerLocation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('worker_eta'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LiveTrackingGateway.prototype, "handleWorkerETA", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('worker_arrived'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], LiveTrackingGateway.prototype, "handleWorkerArrived", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], LiveTrackingGateway.prototype, "handlePing", null);
exports.LiveTrackingGateway = LiveTrackingGateway = LiveTrackingGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/live-tracking',
    })
], LiveTrackingGateway);
//# sourceMappingURL=live-tracking.gateway.js.map