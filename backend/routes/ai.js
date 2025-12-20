const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Validation Schema
const chatSchema = Joi.object({
    message: Joi.string().required().max(500),
    userType: Joi.string().valid('worker', 'customer').required(),
    language: Joi.string().default('en'),
    conversationHistory: Joi.array().items(
        Joi.object({
            role: Joi.string().valid('system', 'user', 'assistant').required(),
            content: Joi.string().required()
        })
    ).default([])
});

// Build System Prompt (Moved from Mobile)
function buildSystemPrompt(userType, language) {
    const languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'bn': 'Bengali',
        'mr': 'Marathi',
        'gu': 'Gujarati'
    };

    const languageName = languageNames[language] || 'English';

    return `You are an AI customer support assistant for KULABOUR, an instant labor marketplace app in India.

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

router.post('/chat', authenticateToken, async (req, res, next) => {
    try {
        const { error } = chatSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { message, userType, language, conversationHistory } = req.body;

        const systemPrompt = buildSystemPrompt(userType, language);

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages,
            max_tokens: 300,
            temperature: 0.7,
            presence_penalty: 0.6,
            frequency_penalty: 0.3,
        });

        const aiMessage = completion.choices[0]?.message?.content;

        if (!aiMessage) {
            throw new Error('No response from AI');
        }

        res.json({
            success: true,
            data: { message: aiMessage }
        });

    } catch (error) {
        // Log detailed error but send generic message
        console.error('OpenAI Error:', error);
        res.status(500).json({ success: false, error: 'AI Service currently unavailable' });
    }
});

module.exports = router;
