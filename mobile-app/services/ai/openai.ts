/**
 * OpenAI Service
 * Real AI integration with GPT-4o for intelligent customer support
 */

import { SUPPORTED_LANGUAGES, FAQ_TRANSLATIONS, LanguageCode, Language } from '../../utils/languages';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
    usage?: {
        total_tokens: number;
    };
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
        // Build system prompt based on user type and language
        const systemPrompt = buildSystemPrompt(userType, language);

        // Prepare messages for OpenAI
        const messages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ];

        // Call OpenAI API
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o', // Latest GPT-4 optimized model
                messages,
                max_tokens: 300,
                temperature: 0.7,
                presence_penalty: 0.6,
                frequency_penalty: 0.3,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API Error:', error);
            // Fallback to FAQ
            return getFallbackResponse(userMessage, language);
        }

        const data: OpenAIResponse = await response.json();
        const aiMessage = data.choices[0]?.message?.content;

        if (!aiMessage) {
            return getFallbackResponse(userMessage, language);
        }

        return aiMessage.trim();

    } catch (error) {
        console.error('AI Service Error:', error);
        // Fallback to FAQ on any error
        return getFallbackResponse(userMessage, language);
    }
}

/**
 * Build system prompt based on context
 */
function buildSystemPrompt(userType: 'worker' | 'customer', language: LanguageCode): string {
    const languageName = SUPPORTED_LANGUAGES.find((l: Language) => l.code === language)?.name || 'English';

    const basePrompt = `You are an AI customer support assistant for KULABOUR, an instant labor marketplace app in India.

USER TYPE: ${userType === 'worker' ? 'Service Provider (Worker)' : 'Customer (Service Seeker)'}
LANGUAGE: ${languageName}

GUIDELINES:
1. Always respond in ${languageName} language
2. Be helpful, professional, and concise
3. Provide actionable solutions
4. Use culturally appropriate tone for Indian users
5. Keep responses under 100 words
6. For technical issues, provide step-by-step solutions
7. For payment/withdrawal issues, reassure and explain process

CONTEXT:
- KULABOUR connects customers with workers for instant services
- Services include: plumbing, electrical, carpentry, painting, cleaning, etc.
- Workers earn money by completing jobs
- Customers book services and track workers in real-time
- Payment is processed after job completion
- 24/7 support available

${userType === 'worker' ? WORKER_CONTEXT : CUSTOMER_CONTEXT}

Remember: Always be empathetic and solution-oriented!`;

    return basePrompt;
}

const WORKER_CONTEXT = `
WORKER-SPECIFIC HELP:
- Job Acceptance: Workers get 30 seconds to accept job requests
- Earnings: Withdraw to bank account (2-3 business days)
- Ratings: Maintain 4+ star rating for more jobs
- Documents: KYC required for payouts
- Support: Available 24/7 for any issues
`;

const CUSTOMER_CONTEXT = `
CUSTOMER-SPECIFIC HELP:
- Booking: Select service → Choose time → Make payment
- Tracking: Real-time worker location and ETA
- Payment: UPI/Card/Wallet/Cash after service
- Cancellation: Free within 5 minutes of booking
- Ratings: Rate workers after job completion
`;

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
