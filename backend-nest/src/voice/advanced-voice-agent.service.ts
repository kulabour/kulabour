import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { detectLanguage, SUPPORTED_LANGUAGES, LanguageCode } from './multi-language.utils';

interface ConversationContext {
    userId: string;
    sessionId: string;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
    userProfile: {
        name: string;
        preferredLanguage: LanguageCode;
        location: { latitude: number; longitude: number };
        budget?: { min: number; max: number };
        preferences?: string[];
    };
    currentIntent?: string;
    entities: Map<string, any>;
}

@Injectable()
export class AdvancedVoiceAgent {
    private openai: OpenAI;
    private gemini: GoogleGenerativeAI;
    private context: Map<string, ConversationContext> = new Map();

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_init',
        });

        this.gemini = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY || ''
        );
    }

    /**
     * Process user speech and generate human-like response
     */
    async processVoiceInput(
        userId: string,
        transcription: string,
        audioMetadata?: { emotion?: string; confidence?: number }
    ): Promise<{
        response: string;
        language: LanguageCode;
        actions?: Array<{ type: string; data: any }>;
        suggestions?: string[];
    }> {
        // Get or create conversation context
        const context = this.getContext(userId);

        // Auto-detect language
        const detectedLanguage = detectLanguage(transcription);
        context.userProfile.preferredLanguage = detectedLanguage;

        // Add user message to history
        context.history.push({
            role: 'user',
            content: transcription,
        });

        // Detect intent (mocked for now)
        const analysis = await this.analyzeInput(transcription, context);

        // Generate response
        const response = await this.generateResponse(
            transcription,
            context,
            analysis,
            audioMetadata
        );

        // Determine actions
        const actions = await this.determineActions(analysis, context);

        // Generate suggestions
        const suggestions = this.generateSuggestions(analysis, context);

        // Save history
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

    // ... (keeping existing analyzeInput, determineActions, generateSuggestions, etc. but adding Injectable decorator if missing previously)

    private async analyzeInput(input: string, context: ConversationContext): Promise<any> {
        // Placeholder for actual AI analysis
        // In production, this calls OpenAI/Gemini
        return {
            intent: 'general_chat',
            entities: {},
            sentiment: 'neutral',
            urgency: 'low',
        };
    }

    private async generateResponse(
        input: string,
        context: ConversationContext,
        analysis: any,
        audioMetadata?: any
    ): Promise<string> {
        const langName = SUPPORTED_LANGUAGES[context.userProfile.preferredLanguage].name;

        const systemPrompt = `You are KULABOUR's voice assistant.
    Language: Respond in ${langName}.
    User Input: "${input}"
    
    If the user speaks ${langName}, reply in ${langName}.
    Keep it short, helpful, and natural.`;

        // Mock response for now to save tokens in this demo
        // In real app: return (await this.openai.chat.completions.create(...)).choices[0].message.content

        // Simple echo for demo purposes if API key not set
        if (!process.env.OPENAI_API_KEY) {
            return `[Simulated ${langName} Response] I understood: "${input}"`;
        }

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...context.history.slice(-3).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
                ]
            });
            return completion.choices[0].message.content || 'I am listening.';
        } catch (e) {
            console.error("OpenAI Error:", e);
            return "Sorry, I am having trouble connecting to my brain right now.";
        }
    }

    private async determineActions(analysis: any, context: ConversationContext): Promise<any[]> {
        return [];
    }

    private generateSuggestions(analysis: any, context: ConversationContext): string[] {
        return ["Help", "Book Service"];
    }

    private getContext(userId: string): ConversationContext {
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
        return this.context.get(userId)!;
    }

    private saveContext(userId: string, context: ConversationContext) {
        if (context.history.length > 20) {
            context.history = context.history.slice(-20);
        }
        this.context.set(userId, context);
    }
}
