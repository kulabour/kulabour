import { Module } from '@nestjs/common';
import { VoiceAgentGateway } from './voice-agent.gateway';
import { AdvancedVoiceAgent } from './advanced-voice-agent.service';
import { WorkersModule } from '../workers/workers.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
    imports: [WorkersModule, BookingsModule],
    providers: [VoiceAgentGateway, AdvancedVoiceAgent],
    exports: [AdvancedVoiceAgent],
})
export class VoiceModule { }
