import { AdvancedVoiceAgent } from './AdvancedVoiceAgent';

/**
 * Customer Voice Agent - Specialized for service booking
 */
export class CustomerVoiceAgent extends AdvancedVoiceAgent {
    async initialize(config: { userType: string; language: string }) {
        console.log('CustomerVoiceAgent initialized:', config);
    }

    protected getSystemPrompt(): string {
        return `You are KULABOUR's helpful voice assistant for customers seeking home services.

PERSONALITY:
- Friendly, patient, and solution-oriented
- Speak naturally in Hindi-English mix (Hinglish)
- Show empathy when user has problems
- Be proactive with suggestions

CUSTOMER CAPABILITIES:
✅ Book services (plumber, electrician, carpenter, etc.)
✅ Find and compare workers
✅ Check booking status
✅ Modify/cancel bookings
✅ Get price estimates
✅ Track worker location
✅ Rate and review workers
✅ Handle payment queries
✅ Get service recommendations

CONVERSATION EXAMPLES:

User: "Bathroom ka tap leak ho raha hai"
You: "Oh no! Let me help you quickly. I'm finding plumbers near you... 
     Found 3 available today. Ramesh is highly rated (4.8★) and can come in 30 minutes for ₹400. 
     Should I book him?"

User: "Price kam kar sakte ho?"
You: "I understand. Let me check other options... Suresh charges ₹350 but is available in 2 hours. 
     Or I can try negotiating with Ramesh. What would you prefer?"

User: "Mera booking kahan hai?"
You: "Let me check... Your plumber Ramesh is 5 minutes away! You can see him on the live map. 
     He'll reach by 2:15 PM."

RESPONSE STYLE:
- Quick acknowledgment of problems
- Provide 2-3 specific options
- Always confirm before booking
- Proactive follow-ups
- Natural, conversational tone`;
    }

    /**
     * Customer-specific intent handling
     */
    protected async handleCustomerIntent(intent: string, entities: any): Promise<any> {
        switch (intent) {
            case 'book_service':
                return this.handleServiceBooking(entities);

            case 'find_worker':
                return this.findAvailableWorkers(entities);

            case 'track_worker':
                return this.getWorkerLocation(entities);

            case 'compare_prices':
                return this.comparePrices(entities);

            case 'get_recommendation':
                return this.recommendService(entities);

            default:
                return super.handleIntent(intent, entities);
        }
    }

    private async handleServiceBooking(entities: any) {
        // Check if we have all required info
        const required = ['service_type', 'date', 'time'];
        const missing = required.filter(key => !entities[key]);

        if (missing.length > 0) {
            return {
                type: 'ask_question',
                message: this.generateMissingInfoQuestion(missing),
            };
        }

        // Find available workers
        const workers = await this.findAvailableWorkers(entities);

        return {
            type: 'show_options',
            message: `I found ${workers.length} ${entities.service_type}s available. Here are the top 3:`,
            options: workers.slice(0, 3).map(w => ({
                id: w.id,
                name: w.name,
                rating: w.rating,
                price: w.price,
                availability: w.availability,
            })),
        };
    }

    private generateMissingInfoQuestion(missing: string[]): string {
        const questions: Record<string, string> = {
            service_type: "Kaunsi service chahiye? Plumber, electrician, carpenter?",
            date: "Kis din service chahiye? Aaj, kal, ya koi specific date?",
            time: "Kitne baje worker aaye? Morning, afternoon, ya evening?",
            location: "Kahan service chahiye? Current location ya koi aur address?",
        };

        return questions[missing[0]] || "Kuch aur details batayein?";
    }

    private async findAvailableWorkers(entities: any): Promise<Array<{ id: string; name: string; rating: number; price: number; availability: string }>> {
        // Real API call through WebSocket - data comes from backend
        // WebSocket listener in AdvancedVoiceInterface will receive 'response' event
        // with action.type='search_workers' and action.data containing real workers
        return [];
    }

    private async getWorkerLocation(entities: any) {
        return {
            type: 'show_map',
            workerLocation: { lat: 28.6139, lng: 77.2090 },
            eta: '5 minutes',
        };
    }

    private async comparePrices(entities: any) {
        return {
            type: 'show_comparison',
            message: "Here's the price comparison for your area:",
            prices: {
                average: 400,
                low: 300,
                high: 600,
            },
        };
    }

    private async recommendService(entities: any) {
        return {
            type: 'recommendation',
            message: "Based on your location and weather, I recommend:",
            services: ['AC Maintenance', 'Waterproofing'],
        };
    }
}
