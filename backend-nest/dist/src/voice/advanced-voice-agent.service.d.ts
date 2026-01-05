import { LanguageCode } from './multi-language.utils';
export declare class AdvancedVoiceAgent {
    private openai;
    private gemini;
    private context;
    constructor();
    processVoiceInput(userId: string, transcription: string, audioMetadata?: {
        emotion?: string;
        confidence?: number;
    }): Promise<{
        response: string;
        language: LanguageCode;
        actions?: Array<{
            type: string;
            data: any;
        }>;
        suggestions?: string[];
    }>;
    private analyzeInput;
    private generateResponse;
    private determineActions;
    private generateSuggestions;
    private getContext;
    private saveContext;
}
