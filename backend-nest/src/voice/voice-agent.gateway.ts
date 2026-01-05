import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { AdvancedVoiceAgent } from './advanced-voice-agent.service';
import { WorkersService } from '../workers/workers.service';
import { BookingsService } from '../bookings/bookings.service';

interface VoiceInputPayload {
    type: 'voice_input';
    transcript: string;
    metadata?: {
        language?: string;
        emotion?: string;
        confidence?: number;
    };
    userId?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

@WebSocketGateway({
    cors: {
        origin: '*', // Construction sites need open access for testing
    },
    namespace: 'voice-agent',
})
@Injectable()
export class VoiceAgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(VoiceAgentGateway.name);

    constructor(
        private readonly voiceAgent: AdvancedVoiceAgent,
        private readonly workersService: WorkersService,
        private readonly bookingsService: BookingsService,
    ) { }

    handleConnection(client: Socket) {
        this.logger.log(`🎙️ Voice client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`🎙️ Voice client disconnected: ${client.id}`);
    }

    /**
     * Handle voice input from mobile app
     */
    @SubscribeMessage('voice_input')
    async handleVoiceInput(
        @MessageBody() payload: VoiceInputPayload,
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const userId = payload.userId || client.id;
            this.logger.log(`Voice input from ${userId}: "${payload.transcript}"`);

            // Process voice input through AI agent
            const result = await this.voiceAgent.processVoiceInput(
                userId,
                payload.transcript,
                payload.metadata,
            );

            // Detect intent and execute actions
            const intent = this.detectIntent(payload.transcript);
            let actionData: any = null;

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

            // Send response back to client
            client.emit('response', {
                type: 'response',
                response: result.response,
                language: result.language,
                emotion: this.detectEmotion(payload.transcript),
                suggestions: result.suggestions,
                action: actionData ? { type: intent, data: actionData } : null,
            });

            return { success: true };
        } catch (error) {
            this.logger.error(`Voice processing error: ${error.message}`);
            client.emit('error', {
                type: 'processing_error',
                message: 'Sorry, I had trouble understanding that. Can you try again?',
            });
            return { success: false, error: error.message };
        }
    }

    /**
     * Simple intent detection (keyword-based for now)
     * TODO: Replace with proper NLU model
     */
    private detectIntent(transcript: string): string {
        const lowerTranscript = transcript.toLowerCase();

        // Hindi + English keywords for common intents
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

    /**
     * Handle worker search requests
     */
    private async handleWorkerSearch(payload: VoiceInputPayload) {
        try {
            // Use location from payload or default to Delhi
            const lat = payload.location?.latitude || 28.6139;
            const lng = payload.location?.longitude || 77.2090;

            const workers = await this.workersService.findNearbyWorkers(lat, lng, 5000);

            this.logger.log(`Found ${workers.length} workers near (${lat}, ${lng})`);

            return {
                workers: workers.slice(0, 3).map((worker: any) => ({
                    id: worker._id || worker.id,
                    name: worker.name,
                    rating: worker.rating || 4.5,
                    price: worker.hourlyRate || 400,
                    availability: 'Available now', // TODO: Real availability
                    distance: '2 km', // TODO: Calculate actual distance
                })),
                total: workers.length,
            };
        } catch (error) {
            this.logger.error(`Worker search failed: ${error.message}`);
            return {
                workers: [],
                error: 'Could not find workers at this moment',
            };
        }
    }

    /**
     * Handle booking creation from voice
     */
    private async handleBookingCreation(payload: VoiceInputPayload, userId: string) {
        try {
            // Extract booking info from transcript (simplified)
            const serviceType = this.extractServiceType(payload.transcript);

            // Create booking
            const booking = await this.bookingsService.create(
                {
                    serviceId: '1',
                    serviceName: serviceType,
                    address: 'Voice booking - address pending',
                    scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                    totalAmount: 500, // Default amount
                },
                { userId, name: 'Voice User' },
            );

            this.logger.log(`Created booking ${(booking as any)._id || (booking as any).id} via voice`);

            return {
                bookingId: (booking as any)._id || (booking as any).id,
                service: serviceType,
                status: 'pending_confirmation',
                message: 'Booking created! Please confirm address and time.',
            };
        } catch (error) {
            this.logger.error(`Booking creation failed: ${error.message}`);
            return {
                error: 'Could not create booking. Please try manual booking.',
            };
        }
    }

    /**
     * Handle price inquiries
     */
    private handlePriceInquiry(payload: VoiceInputPayload) {
        const serviceType = this.extractServiceType(payload.transcript);

        // Mock pricing data (TODO: Real pricing from database)
        const pricing: Record<string, { min: number; max: number; average: number }> = {
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

    /**
     * Extract service type from transcript
     */
    private extractServiceType(transcript: string): string {
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

    /**
     * Detect emotion from transcript (simplified)
     */
    private detectEmotion(transcript: string): string {
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
}
