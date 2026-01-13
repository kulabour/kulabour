"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceModule = void 0;
const common_1 = require("@nestjs/common");
const voice_agent_gateway_1 = require("./voice-agent.gateway");
const advanced_voice_agent_service_1 = require("./advanced-voice-agent.service");
const workers_module_1 = require("../workers/workers.module");
const bookings_module_1 = require("../bookings/bookings.module");
let VoiceModule = class VoiceModule {
};
exports.VoiceModule = VoiceModule;
exports.VoiceModule = VoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [workers_module_1.WorkersModule, bookings_module_1.BookingsModule],
        providers: [voice_agent_gateway_1.VoiceAgentGateway, advanced_voice_agent_service_1.AdvancedVoiceAgent],
        exports: [advanced_voice_agent_service_1.AdvancedVoiceAgent],
    })
], VoiceModule);
//# sourceMappingURL=voice.module.js.map