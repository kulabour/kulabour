export class AdvancedVoiceAgent {
    protected getSystemPrompt(): string {
        return "You are a helpful assistant.";
    }

    public async handleIntent(intent: string, entities: any): Promise<any> {
        return {
            type: 'unknown_intent',
            message: "I didn't understand that.",
        };
    }
}
