/**
 * SMART WORKER AUTO-MATCHING ENGINE — Type Definitions
 * ──────────────────────────────────────────────────────────────────────────────
 * Composite scoring model:
 *   Proximity  40% — closer workers rank higher (Haversine distance)
 *   Rating     25% — higher-rated workers preferred
 *   Response   20% — workers who respond faster get priority
 *   Available  15% — workers with fewer jobs today are boosted
 */

export interface MatchCandidate {
  workerId: string;
  distance: number;       // km from booking location
  rating: number;         // 0-5 stars
  responseRate: number;   // 0-100%
  isAvailable: boolean;
  completedToday: number; // jobs completed today
  score: number;          // composite score 0-100
}

export interface MatchConfig {
  maxRadiusSteps: number[];     // progressive radius expansion in km
  maxWorkersToContact: number;  // max workers to send job alert to per round
  responseTimeoutMs: number;    // how long to wait for worker response
  maxRetries: number;           // how many radius expansion rounds
  retryIntervalMs: number;      // pause between retry rounds
}

export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  maxRadiusSteps: [5, 10, 15],
  maxWorkersToContact: 3,
  responseTimeoutMs: 60_000,    // 60 seconds
  maxRetries: 3,
  retryIntervalMs: 120_000,     // 2 minutes
};

export interface MatchResult {
  matched: boolean;
  workerId?: string;
  score?: number;
  distance?: number;
  attempts: number;
}
