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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedVoiceAgent = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const generative_ai_1 = require("@google/generative-ai");
const multi_language_utils_1 = require("./multi-language.utils");
let AdvancedVoiceAgent = class AdvancedVoiceAgent {
    constructor() {
        this.context = new Map();
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_init',
        });
        this.gemini = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    }
    async processVoiceInput(userId, transcription, audioMetadata) {
        const context = this.getContext(userId);
        const detectedLanguage = (0, multi_language_utils_1.detectLanguage)(transcription);
        context.userProfile.preferredLanguage = detectedLanguage;
        context.history.push({
            role: 'user',
            content: transcription,
        });
        const analysis = await this.analyzeInput(transcription, context);
        const response = await this.generateResponse(transcription, context, analysis, audioMetadata);
        const actions = await this.determineActions(analysis, context);
        const suggestions = this.generateSuggestions(analysis, context);
        context.history.push({
            role: 'assistant',
            content: response,
        });
        this.saveContext(userId, context);
        return {
            response,
            language: detectedLanguage,
            actions,
            suggestions
        };
    }
    async analyzeInput(input, context) {
        return {
            intent: 'general_chat',
            entities: {},
            sentiment: 'neutral',
            urgency: 'low',
        };
    }
    async generateResponse(input, context, analysis, audioMetadata) {
        const langName = multi_language_utils_1.SUPPORTED_LANGUAGES[context.userProfile.preferredLanguage].name;
        const systemPrompt = `You are KULABOUR's voice assistant.
    Language: Respond in ${langName}.
    User Input: "${input}"
    
    If the user speaks ${langName}, reply in ${langName}.
    Keep it short, helpful, and natural.`;
        if (!process.env.OPENAI_API_KEY) {
            return `[Simulated ${langName} Response] I understood: "${input}"`;
        }
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...context.history.slice(-3).map(m => ({ role: m.role, content: m.content }))
                ]
            });
            return completion.choices[0].message.content || 'I am listening.';
        }
        catch (e) {
            console.error("OpenAI Error:", e);
            return "Sorry, I am having trouble connecting to my brain right now.";
        }
    }
    async determineActions(analysis, context) {
        return [];
    }
    generateSuggestions(analysis, context) {
        return ["Help", "Book Service"];
    }
    getContext(userId) {
        if (!this.context.has(userId)) {
            this.context.set(userId, {
                userId,
                sessionId: Date.now().toString(),
                history: [],
                userProfile: {
                    name: 'User',
                    preferredLanguage: 'en',
                    location: { latitude: 0, longitude: 0 },
                },
                entities: new Map(),
            });
        }
        return this.context.get(userId);
    }
    saveContext(userId, context) {
        if (context.history.length > 20) {
            context.history = context.history.slice(-20);
        }
        this.context.set(userId, context);
    }
};
exports.AdvancedVoiceAgent = AdvancedVoiceAgent;
exports.AdvancedVoiceAgent = AdvancedVoiceAgent = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AdvancedVoiceAgent);
//# sourceMappingURL=advanced-voice-agent.service.js.map