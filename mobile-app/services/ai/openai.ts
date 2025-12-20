/**
 * OpenAI Service
 * Real AI integration with GPT-4o for intelligent customer support
 */

import { FAQ_TRANSLATIONS, LanguageCode } from '../../utils/languages';
import { apiClient } from '../api/client';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/**
 * Generate AI response using GPT-4o
 */
export async function getAIResponse(
    userMessage: string,
    userType: 'worker' | 'customer',
    language: LanguageCode = 'en',
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    try {
        const response = await apiClient.post<{ message: string }>('/api/ai/chat', {
            message: userMessage,
            userType,
            language,
            conversationHistory
        });

        if (response.success && response.data?.message) {
            return response.data.message.trim();
        }

        return getFallbackResponse(userMessage, language);

    } catch (error) {
        console.error('AI Service Error:', error);
        // Fallback to FAQ on any error
        return getFallbackResponse(userMessage, language);
    }
}

/**
 * Fallback to FAQ-based responses
 */
function getFallbackResponse(userMessage: string, language: LanguageCode): string {
    const lowerMessage = userMessage.toLowerCase();
    const responses = FAQ_TRANSLATIONS[language];

    // Simple keyword matching for fallback
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') ||
        lowerMessage.includes('नमस्ते') || lowerMessage.includes('வணக்கம்')) {
        return responses.greeting;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('मदद')) {
        return responses.help;
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('भुगतान') ||
        lowerMessage.includes('pay')) {
        return responses.payment;
    }

    if (lowerMessage.includes('withdraw') || lowerMessage.includes('निकाल') ||
        lowerMessage.includes('payout')) {
        return responses.withdraw;
    }

    if (lowerMessage.includes('job') || lowerMessage.includes('नौकरी') ||
        lowerMessage.includes('work')) {
        return responses.job;
    }

    if (lowerMessage.includes('book') || lowerMessage.includes('बुक') ||
        lowerMessage.includes('service')) {
        return responses.book;
    }

    if (lowerMessage.includes('cancel') || lowerMessage.includes('रद्द')) {
        return responses.cancel;
    }

    if (lowerMessage.includes('track') || lowerMessage.includes('ट्रैक') ||
        lowerMessage.includes('location')) {
        return responses.track;
    }

    // Default fallback
    return responses.fallback;
}

/**
 * Check if OpenAI is available
 */
export function isAIEnabled(): boolean {
    return !!OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_key_here';
}

/**
 * Estimate cost of AI call (for monitoring)
 */
export function estimateCost(tokens: number): number {
    // GPT-4o pricing: ~$0.005 per 1K tokens (combined input+output)
    return (tokens / 1000) * 0.005;
}
