import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
export declare class VoiceAgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly voiceAgent;
    private readonly workersService;
    private readonly bookingsService;
    server: Server;
    private readonly logger;
    constructor(voiceAgent: AdvancedVoiceAgent, workersService: WorkersService, bookingsService: BookingsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleVoiceInput(payload: VoiceInputPayload, client: Socket): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    private detectIntent;
    private handleWorkerSearch;
    private handleBookingCreation;
    private handlePriceInquiry;
    private extractServiceType;
    private detectEmotion;
}
export {};
