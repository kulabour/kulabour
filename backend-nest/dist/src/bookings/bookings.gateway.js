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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
let BookingsGateway = class BookingsGateway {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
        this.logger = new common_1.Logger('BookingsGateway');
        this.connectedUsers = new Map();
    }
    handleConnection(client) {
    }
    handleDisconnect(client) {
    }
    handleJoinRoom(roomId, client) {
        client.join(roomId);
        this.logger.log(`Client ${client.id} joined room ${roomId}`);
        return { event: 'joined_room', data: roomId };
    }
    async handleBookingRequest(data, client) {
        this.logger.log(`New booking request: ${JSON.stringify(data)}`);
        try {
            await this.bookingsService.create({
                _id: data.bookingId,
                ...data,
                status: 'requested',
                createdAt: new Date()
            }, { userId: 'mock_user', name: data.customerName });
        }
        catch (e) {
            this.logger.warn('Failed to persist booking from socket event', e);
        }
        this.server.emit('new_booking_request', data);
        return { status: 'requested', data };
    }
    handleAcceptBooking(data, client) {
        this.logger.log(`Booking accepted: ${JSON.stringify(data)}`);
        this.server.emit(`booking_status_${data.bookingId}`, {
            status: 'accepted',
            workerId: data.workerId
        });
        return { status: 'confirmed', data };
    }
    handleLocationUpdate(data, client) {
        this.server.emit(`worker_location_${data.bookingId}`, {
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: Date.now()
        });
    }
};
exports.BookingsGateway = BookingsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], BookingsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], BookingsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_booking'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], BookingsGateway.prototype, "handleBookingRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('accept_booking'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], BookingsGateway.prototype, "handleAcceptBooking", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update_location'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], BookingsGateway.prototype, "handleLocationUpdate", null);
exports.BookingsGateway = BookingsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'bookings',
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsGateway);
//# sourceMappingURL=bookings.gateway.js.map