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
var VoiceAgentGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceAgentGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const advanced_voice_agent_service_1 = require("./advanced-voice-agent.service");
const workers_service_1 = require("../workers/workers.service");
const bookings_service_1 = require("../bookings/bookings.service");
let VoiceAgentGateway = VoiceAgentGateway_1 = class VoiceAgentGateway {
    constructor(voiceAgent, workersService, bookingsService) {
        this.voiceAgent = voiceAgent;
        this.workersService = workersService;
        this.bookingsService = bookingsService;
        this.logger = new common_1.Logger(VoiceAgentGateway_1.name);
    }
    handleConnection(client) {
        this.logger.log(`🎙️ Voice client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`🎙️ Voice client disconnected: ${client.id}`);
    }
    async handleVoiceInput(payload, client) {
        try {
            const userId = payload.userId || client.id;
            this.logger.log(`Voice input from ${userId}: "${payload.transcript}"`);
            const result = await this.voiceAgent.processVoiceInput(userId, payload.transcript, payload.metadata);
            const intent = this.detectIntent(payload.transcript);
            let actionData = null;
            switch (intent) {
                case 'search_workers':
                    actionData = await this.handleWorkerSearch(payload);
                    break;
                case 'create_booking':
                    actionData = await this.handleBookingCreation(payload, userId);
                    break;
                case 'price_inquiry':
                    actionData = this.handlePriceInquiry(payload);
                    break;
                default:
                    actionData = null;
            }
            client.emit('response', {
                type: 'response',
                response: result.response,
                language: result.language,
                emotion: this.detectEmotion(payload.transcript),
                suggestions: result.suggestions,
                action: actionData ? { type: intent, data: actionData } : null,
            });
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Voice processing error: ${error.message}`);
            client.emit('error', {
                type: 'processing_error',
                message: 'Sorry, I had trouble understanding that. Can you try again?',
            });
            return { success: false, error: error.message };
        }
    }
    detectIntent(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.match(/(plumber|electrician|carpenter|painter|worker|karigar|kuli|mazdoor|mistri)/i)) {
            return 'search_workers';
        }
        if (lowerTranscript.match(/(book|booking|fix|repair|chahiye|karwa|lagwa)/i)) {
            return 'create_booking';
        }
        if (lowerTranscript.match(/(price|cost|kitna|rate|charge|paisa)/i)) {
            return 'price_inquiry';
        }
        return 'general_chat';
    }
    async handleWorkerSearch(payload) {
        try {
            const lat = payload.location?.latitude || 28.6139;
            const lng = payload.location?.longitude || 77.2090;
            const workers = await this.workersService.findNearbyWorkers(lat, lng, 5000);
            this.logger.log(`Found ${workers.length} workers near (${lat}, ${lng})`);
            return {
                workers: workers.slice(0, 3).map((worker) => ({
                    id: worker._id || worker.id,
                    name: worker.name,
                    rating: worker.rating || 4.5,
                    price: worker.hourlyRate || 400,
                    availability: 'Available now',
                    distance: '2 km',
                })),
                total: workers.length,
            };
        }
        catch (error) {
            this.logger.error(`Worker search failed: ${error.message}`);
            return {
                workers: [],
                error: 'Could not find workers at this moment',
            };
        }
    }
    async handleBookingCreation(payload, userId) {
        try {
            const serviceType = this.extractServiceType(payload.transcript);
            const booking = await this.bookingsService.create({
                serviceId: '1',
                serviceName: serviceType,
                address: 'Voice booking - address pending',
                scheduledTime: new Date(Date.now() + 86400000).toISOString(),
                totalAmount: 500,
            }, { userId, name: 'Voice User' });
            this.logger.log(`Created booking ${booking._id || booking.id} via voice`);
            return {
                bookingId: booking._id || booking.id,
                service: serviceType,
                status: 'pending_confirmation',
                message: 'Booking created! Please confirm address and time.',
            };
        }
        catch (error) {
            this.logger.error(`Booking creation failed: ${error.message}`);
            return {
                error: 'Could not create booking. Please try manual booking.',
            };
        }
    }
    handlePriceInquiry(payload) {
        const serviceType = this.extractServiceType(payload.transcript);
        const pricing = {
            plumber: { min: 300, max: 600, average: 400 },
            electrician: { min: 350, max: 700, average: 450 },
            carpenter: { min: 400, max: 800, average: 500 },
            painter: { min: 250, max: 500, average: 350 },
        };
        const price = pricing[serviceType] || { min: 300, max: 600, average: 400 };
        return {
            service: serviceType,
            pricing: price,
            currency: 'INR',
            message: `${serviceType} costs ₹${price.average} on average`,
        };
    }
    extractServiceType(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes('plumber') || lowerTranscript.includes('paani') || lowerTranscript.includes('tap')) {
            return 'plumber';
        }
        if (lowerTranscript.includes('electrician') || lowerTranscript.includes('bijli') || lowerTranscript.includes('light')) {
            return 'electrician';
        }
        if (lowerTranscript.includes('carpenter') || lowerTranscript.includes('furniture') || lowerTranscript.includes('lakdi')) {
            return 'carpenter';
        }
        if (lowerTranscript.includes('painter') || lowerTranscript.includes('paint') || lowerTranscript.includes('rang')) {
            return 'painter';
        }
        return 'general service';
    }
    detectEmotion(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.match(/(urgent|jaldi|turant|abhi|emergency)/i)) {
            return 'urgent';
        }
        if (lowerTranscript.match(/(problem|issue|broke|leak|nahi chal raha)/i)) {
            return 'frustrated';
        }
        if (lowerTranscript.match(/(thank|shukriya|dhanyavad)/i)) {
            return 'happy';
        }
        return 'neutral';
    }
};
exports.VoiceAgentGateway = VoiceAgentGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], VoiceAgentGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('voice_input'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], VoiceAgentGateway.prototype, "handleVoiceInput", null);
exports.VoiceAgentGateway = VoiceAgentGateway = VoiceAgentGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: 'voice-agent',
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [advanced_voice_agent_service_1.AdvancedVoiceAgent,
        workers_service_1.WorkersService,
        bookings_service_1.BookingsService])
], VoiceAgentGateway);
//# sourceMappingURL=voice-agent.gateway.js.map