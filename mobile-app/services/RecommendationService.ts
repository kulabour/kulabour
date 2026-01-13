/**
 * KULABOUR - Smart Recommendation Engine
 * Provides personalized service recommendations based on:
 * 1. Time of day (Context)
 * 2. Season/Weather (Environment)
 * 3. User History (Personalization - Mocked for now)
 * 4. Popularity (Social Proof)
 */

import { ServiceItem, SERVICE_CATEGORIES } from '../data/serviceCatalog';

export interface RecommendedService extends ServiceItem {
    reason: string;
    relevanceScore: number;
}

class RecommendationService {
    // Current context
    private getContext() {
        const date = new Date();
        const hour = date.getHours();
        const month = date.getMonth(); // 0-11

        let timeOfDay = 'day';
        if (hour >= 5 && hour < 12) timeOfDay = 'morning';
        else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
        else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
        else timeOfDay = 'night';

        let season = 'neutral';
        if (month >= 3 && month <= 5) season = 'summer'; // April-June (India)
        else if (month >= 6 && month <= 8) season = 'monsoon'; // July-Sept
        else if (month >= 11 || month <= 1) season = 'winter'; // Dec-Feb

        return { timeOfDay, season };
    }

    /**
     * Get personalized recommendations
     */
    getRecommendations(limit: number = 5): RecommendedService[] {
        const { timeOfDay, season } = this.getContext();
        const allServices: ServiceItem[] = [];

        // Flatten services
        Object.values(SERVICE_CATEGORIES).forEach(cat => {
            allServices.push(...cat.services);
        });

        // Calculate scores
        const scoredServices = allServices.map(service => {
            let score = 0;
            let reason = 'Popular Choice';

            // 1. Time of Day Logic
            if (timeOfDay === 'morning') {
                if (service.id.includes('clean') || service.id.includes('maid')) {
                    score += 5;
                    reason = 'Morning Cleaning';
                }
                if (service.id.includes('plumber')) {
                    score += 3; // Urgent morning fixes
                    reason = 'Quick Fix';
                }
            } else if (timeOfDay === 'evening') {
                if (service.id.includes('cook')) {
                    score += 5;
                    reason = 'Dinner Prep';
                }
                if (service.id.includes('electrician')) {
                    score += 4; // Lights issues
                    reason = 'Evening Fix';
                }
            }

            // 2. Seasonal Logic (India Specific)
            if (season === 'summer') {
                if (service.id.includes('ac') || service.id.includes('cool')) {
                    score += 10;
                    reason = 'Beat the Heat';
                }
                if (service.id.includes('fan')) {
                    score += 8;
                    reason = 'Summer Essential';
                }
            } else if (season === 'monsoon') {
                if (service.id.includes('roof') || service.id.includes('leak')) {
                    score += 10;
                    reason = 'Monsoon Ready';
                }
                if (service.id.includes('pest')) {
                    score += 6;
                    reason = 'Monsoon Assessment';
                }
            } else if (season === 'winter') {
                if (service.id.includes('geyser') || service.id.includes('heater')) {
                    score += 10;
                    reason = 'Stay Warm';
                }
                if (service.id.includes('paint')) {
                    score += 4; // Good time for painting
                    reason = 'Festive Flex';
                }
            }

            // 3. User History (Mocked)
            // Simulating a user who books cleaning often
            if (service.id.includes('clean')) {
                score += 2;
                // reason = 'Based on history'; // Keep context reason if stronger
            }

            return {
                ...service,
                reason,
                relevanceScore: score + Math.random() // Add jitter to randomize ties
            };
        });

        // Sort and slice
        return scoredServices
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, limit);
    }

    /**
     * Get specific recommendations for "Urgent" situations
     */
    getUrgentServices(): RecommendedService[] {
        const allServices: ServiceItem[] = [];
        Object.values(SERVICE_CATEGORIES).forEach(cat => allServices.push(...cat.services));

        return allServices
            .filter(s =>
                s.id.includes('plumb') ||
                s.id.includes('electr') ||
                s.id.includes('lock')
            )
            .map(s => ({ ...s, reason: 'Emergency', relevanceScore: 10 }))
            .slice(0, 4);
    }
}

export const recommendationService = new RecommendationService();
export default recommendationService;
