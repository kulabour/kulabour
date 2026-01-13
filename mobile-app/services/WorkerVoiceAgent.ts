import { AdvancedVoiceAgent } from './AdvancedVoiceAgent';

/**
 * Worker Voice Agent - Specialized for job management
 */
export class WorkerVoiceAgent extends AdvancedVoiceAgent {
    async initialize(config: { userType: string; language: string; handsFreeMode: boolean }) {
        console.log('WorkerVoiceAgent initialized:', config);
        // Additional setup if needed
    }

    protected getSystemPrompt(): string {
        return `You are KULABOUR's voice assistant for workers/service providers.

PERSONALITY:
- Professional yet friendly
- Quick and efficient (workers are busy)
- Speak in Hindi-English mix (Hinglish)
- Supportive and encouraging

WORKER CAPABILITIES:
✅ Accept/reject job requests
✅ Update job status (on way, started, completed)
✅ Navigate to customer location
✅ Report issues/delays
✅ Check earnings and payments
✅ View upcoming jobs
✅ Update availability
✅ Record work completion (photos, notes)
✅ Request support

CONVERSATION EXAMPLES:

User: "Naya job aaya kya?"
You: "Haan! Ek plumbing job hai Sector 15 mein. ₹500 payment, 4km door. 
     Customer rating 4.5 hai. Accept karein?"

User: "Haan, accept karo"
You: "Done! Job accepted. Customer: Ramesh Kumar, Phone: 98765xxxxx. 
     Map pe navigate karoon? ETA 15 minutes hai."

User: "Job complete ho gaya"
You: "Great! Photos upload karna hai? Aur payment ₹500 confirm karein. 
     Customer ko rating request bhej doon?"

User: "Aaj kitna kamaya?"
You: "Aaj tak ₹2,400 earnings! 6 jobs complete. Average ₹400 per job. 
     Agar 2 aur jobs complete karenge toh ₹3,200 ho jayega!"

RESPONSE STYLE:
- Direct and action-oriented
- Congratulate on completions
- Motivate with earnings stats
- Alert about urgent jobs
- Help with navigation`;
    }

    /**
     * Worker-specific intent handling
     */
    protected async handleWorkerIntent(intent: string, entities: any): Promise<any> {
        switch (intent) {
            case 'accept_job':
                return this.acceptJob(entities);

            case 'reject_job':
                return this.rejectJob(entities);

            case 'update_status':
                return this.updateJobStatus(entities);

            case 'navigate_to_customer':
                return this.startNavigation(entities);

            case 'complete_job':
                return this.completeJob(entities);

            case 'check_earnings':
                return this.getEarnings(entities);

            case 'report_issue':
                return this.reportIssue(entities);

            case 'toggle_availability':
                return this.toggleAvailability();

            default:
                return super.handleIntent(intent, entities);
        }
    }

    private async acceptJob(entities: any) {
        return {
            type: 'job_accepted',
            message: "Job accepted! Customer details bhej raha hoon...",
            actions: [
                { type: 'send_notification', to: 'customer' },
                { type: 'show_customer_details' },
                { type: 'start_navigation_prompt' },
            ],
        };
    }

    private async rejectJob(entities: any) {
        const reason = entities.reason || 'busy';
        return {
            type: 'job_rejected',
            message: "No problem! Main doosre worker ko assign kar dunga. Next job soon!",
            actions: [
                { type: 'reassign_job' },
            ],
        };
    }

    private async updateJobStatus(entities: any) {
        const status = entities.status; // 'on_way', 'started', 'completed'

        const messages: Record<string, string> = {
            on_way: "Great! Customer ko notify kar diya. ETA 15 minutes bata doon?",
            started: "Good! Timer start ho gaya. Best of luck!",
            completed: "Awesome! ₹500 payment confirm hai. Photos upload karein?",
        };

        return {
            type: 'status_updated',
            message: messages[status] || "Status updated!",
            actions: [
                { type: 'notify_customer', status },
                { type: 'update_timeline' },
            ],
        };
    }

    private async startNavigation(entities: any) {
        return {
            type: 'start_navigation',
            message: "Navigate kar raha hoon... 4.2 km, ETA 15 minutes.",
            destination: {
                lat: 28.6139,
                lng: 77.2090,
                address: 'Sector 15, Noida',
            },
            actions: [
                { type: 'open_maps' },
            ],
        };
    }

    private async completeJob(entities: any) {
        return {
            type: 'job_completion',
            message: "Bahut badhiya! Job complete. Photos upload karein aur customer se rating mangein?",
            actions: [
                { type: 'show_photo_upload' },
                { type: 'request_customer_rating' },
                { type: 'confirm_payment' },
            ],
        };
    }

    private async getEarnings(entities: any) {
        const period = (entities.period || 'today') as 'today' | 'week' | 'month'; // 'today', 'week', 'month'

        const earnings = {
            today: { amount: 2400, jobs: 6, average: 400 },
            week: { amount: 12000, jobs: 30, average: 400 },
            month: { amount: 45000, jobs: 112, average: 402 },
        };

        const data = earnings[period];

        return {
            type: 'earnings_report',
            message: `${period === 'today' ? 'Aaj' : period === 'week' ? 'Is hafte' : 'Is mahine'} ₹${data.amount.toLocaleString()} kamaye! ${data.jobs} jobs complete. Keep it up! 💪`,
            data,
        };
    }

    private async reportIssue(entities: any) {
        const issueType = entities.issue_type; // 'customer_not_reachable', 'wrong_address', 'payment_issue'

        return {
            type: 'issue_reported',
            message: "Main support team ko inform kar raha hoon. 2 minutes mein call ayega. Tab tak wait karein.",
            actions: [
                { type: 'notify_support', issue: issueType },
                { type: 'pause_timer' },
            ],
        };
    }

    private async toggleAvailability() {
        return {
            type: 'availability_toggled',
            message: "Availability toggle kar di. Naye jobs milna band/start ho jayengi.",
        };
    }

    /**
     * Proactive notifications for workers
     */
    async sendProactiveNotification(type: string, data: any): Promise<string> {
        const notifications: Record<string, (data: any) => string> = {
            new_job: (data) => `🔔 Naya job! ${data.service} in ${data.location}. ₹${data.payment}. Accept karein?`,
            earnings_milestone: (data) => `🎉 Congratulations! Aaj ₹${data.amount} complete! Target almost done!`,
            payment_received: (data) => `💰 Payment received! ₹${data.amount} aapke account mein add ho gaya.`,
            reminder: (data) => `⏰ Reminder: 30 minutes mein job hai ${data.location} pe.`,
            tip_received: (data) => `🌟 Customer ne ₹${data.amount} tip diya! Great service!`,
        };

        return notifications[type]?.(data) || 'You have a notification';
    }
}
