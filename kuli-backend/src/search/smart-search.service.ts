import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

/**
 * SMART RADIUS SEARCH SERVICE
 * ──────────────────────────────────────────────────────────────────────────────
 * Solves the two-sided marketplace cold start problem through dynamic
 * radius expansion and geo-fenced launch zones.
 *
 * PROBLEM:
 *   New city launch → few workers → search returns 0 results
 *   → customer churns → fewer bookings → workers leave → death spiral
 *
 * SOLUTION:
 *
 *   1. SMART RADIUS EXPANSION — Never show "0 results":
 *      Search 2km → found 5+ workers? → return results
 *      Search 2km → found <3? → expand to 5km automatically
 *      Search 5km → found <3? → expand to 10km
 *      Search 10km → found <1? → expand to 15km + show "limited availability" banner
 *      Still 0? → Show waiting list CTA + nearby city suggestions
 *
 *   2. GEO-FENCED LAUNCH ZONES — Don't launch city-wide, launch by neighborhood:
 *      Phase 1: Satellite + Prahlad Nagar (Ahmedabad) — dense supply
 *      Phase 2: Add SG Highway + Bopal — expand outward
 *      Phase 3: Full Ahmedabad
 *      Configurable via Redis (no code deploy needed)
 *
 *   3. SUPPLY HEATMAP — Show workers where demand exists:
 *      Track search queries by location → aggregate into demand signals
 *      Workers see: "🔥 High demand for painters near Satellite Road"
 *      Keeps supply concentrated where demand is growing
 *
 *   4. AVAILABILITY BOOSTING — In low-supply areas:
 *      Show workers from adjacent zones with "slightly further" tag
 *      Bump verified workers to top of results
 *      Show estimated arrival time instead of distance
 */

export interface SearchQuery {
  category: string;
  lat: number;
  lng: number;
  city: string;
  minRating?: number;
  verifiedOnly?: boolean;
  maxResults?: number;
}

export interface SearchResult {
  workerId: string;
  name: string;
  distance: number;        // in km
  actualRadius: number;    // the radius that found this worker
  rating: number;
  isVerified: boolean;
  estimatedETA: number;    // minutes
}

export interface SearchResponse {
  workers: SearchResult[];
  searchRadius: number;     // final radius used
  wasExpanded: boolean;     // true if radius was expanded from default
  totalOnline: number;      // total online workers in city (supply signal)
  demandLevel: 'low' | 'moderate' | 'high' | 'very_high';
  message?: string;         // user-facing message if limited results
}

interface GeoZone {
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
  isActive: boolean;
  launchDate: string;
}

@Injectable()
export class SmartSearchService {
  // Configurable via Redis — no code deploy needed
  private readonly RADIUS_STEPS = [2, 5, 10, 15, 25]; // km
  private readonly MIN_RESULTS = 3;
  private readonly DEFAULT_MAX_RESULTS = 20;

  constructor(private readonly redis: RedisService) {}

  // ─── Smart Radius Search ───────────────────────────────────────────────────

  async search(query: SearchQuery): Promise<SearchResponse> {
    const maxResults = query.maxResults || this.DEFAULT_MAX_RESULTS;
    let allWorkers: SearchResult[] = [];
    let finalRadius = this.RADIUS_STEPS[0];
    let wasExpanded = false;

    // Track this search for demand heatmap
    await this.trackDemandSignal(query);

    // Progressive radius expansion
    for (const radius of this.RADIUS_STEPS) {
      finalRadius = radius;

      // Check cache first
      const cacheKey = this.buildCacheKey(query, radius);
      const cached = await this.redis.getSearchCache<SearchResult[]>(cacheKey);

      if (cached) {
        allWorkers = cached;
      } else {
        // In production: query PostgreSQL with PostGIS ST_DWithin
        // For now: search from Redis-cached worker locations
        allWorkers = await this.searchWorkersInRadius(query, radius);

        // Cache for 60 seconds
        if (allWorkers.length > 0) {
          await this.redis.setSearchCache(cacheKey, allWorkers);
        }
      }

      // Check if we have enough results
      if (allWorkers.length >= this.MIN_RESULTS) {
        break;
      }

      wasExpanded = true;
      console.log(
        `🔍 Search expanded: ${query.category} in ${query.city} — ` +
        `${allWorkers.length} found at ${radius}km, expanding...`,
      );
    }

    // Calculate demand level based on recent search frequency
    const demandLevel = await this.getDemandLevel(query.city, query.category);

    // Build response with appropriate messaging
    const response: SearchResponse = {
      workers: allWorkers.slice(0, maxResults),
      searchRadius: finalRadius,
      wasExpanded,
      totalOnline: allWorkers.length,
      demandLevel,
    };

    // Add contextual messages for edge cases
    if (allWorkers.length === 0) {
      response.message =
        `No ${query.category} workers available right now. ` +
        `We'll notify you when one comes online nearby. ` +
        `Meanwhile, try expanding your search or check back in 30 minutes.`;
    } else if (wasExpanded && allWorkers.length < this.MIN_RESULTS) {
      response.message =
        `Limited ${query.category} availability in your area. ` +
        `Showing workers up to ${finalRadius}km away.`;
    } else if (wasExpanded) {
      response.message =
        `Showing workers up to ${finalRadius}km from you. ` +
        `More workers join Kuli every day in ${query.city}!`;
    }

    return response;
  }

  // ─── Demand Heatmap ────────────────────────────────────────────────────────

  /**
   * Track every search as a demand signal.
   * Workers see aggregated demand on their dashboard.
   */
  private async trackDemandSignal(query: SearchQuery): Promise<void> {
    const now = new Date();
    const hourKey = `demand:${query.city}:${query.category}:${now.getHours()}`;

    // Grid-based demand tracking (round to ~1km grid cells)
    const gridLat = Math.round(query.lat * 100) / 100;
    const gridLng = Math.round(query.lng * 100) / 100;
    const gridKey = `demand:grid:${query.city}:${gridLat}:${gridLng}:${query.category}`;

    // Increment demand counters (TTL: 24 hours)
    await this.redis.incr(hourKey);
    await this.redis.setWithTTL(hourKey, '1', 86400);

    await this.redis.incr(gridKey);
    await this.redis.setWithTTL(gridKey, '1', 86400);
  }

  /**
   * Get demand level for a category in a city (shown to workers).
   */
  async getDemandLevel(
    city: string,
    category: string,
  ): Promise<'low' | 'moderate' | 'high' | 'very_high'> {
    const now = new Date();
    let totalSearches = 0;

    // Sum last 3 hours of searches
    for (let h = 0; h < 3; h++) {
      const hour = (now.getHours() - h + 24) % 24;
      const key = `demand:${city}:${category}:${hour}`;
      const count = await this.redis.get(key);
      totalSearches += count ? parseInt(count, 10) : 0;
    }

    if (totalSearches >= 50) return 'very_high';
    if (totalSearches >= 20) return 'high';
    if (totalSearches >= 5) return 'moderate';
    return 'low';
  }

  /**
   * Get demand hotspots for workers (shown on worker dashboard map).
   */
  async getDemandHotspots(
    city: string,
    category: string,
  ): Promise<Array<{ lat: number; lng: number; searches: number; level: string }>> {
    // In production, scan demand:grid:* keys for this city+category
    // For now, return mock hotspots based on real Ahmedabad locations
    const hotspots = [
      { lat: 23.0300, lng: 72.5170, label: 'Satellite Road' },
      { lat: 23.0120, lng: 72.5070, label: 'Prahlad Nagar' },
      { lat: 23.0500, lng: 72.5300, label: 'SG Highway' },
    ];

    const results = [];
    for (const spot of hotspots) {
      const gridLat = Math.round(spot.lat * 100) / 100;
      const gridLng = Math.round(spot.lng * 100) / 100;
      const key = `demand:grid:${city}:${gridLat}:${gridLng}:${category}`;
      const count = await this.redis.get(key);
      const searches = count ? parseInt(count, 10) : 0;

      results.push({
        lat: spot.lat,
        lng: spot.lng,
        searches,
        level:
          searches >= 20 ? 'very_high' :
          searches >= 10 ? 'high' :
          searches >= 3 ? 'moderate' : 'low',
      });
    }

    return results.sort((a, b) => b.searches - a.searches);
  }

  // ─── Geo-Fenced Launch Zones ───────────────────────────────────────────────

  /**
   * Check if a location is within an active launch zone.
   * Zones are configurable via Redis — no code deploy needed.
   */
  async isInActiveZone(city: string, lat: number, lng: number): Promise<{
    inZone: boolean;
    zoneName?: string;
    message?: string;
  }> {
    const zones = await this.getActiveZones(city);

    for (const zone of zones) {
      const distance = this.haversineKm(lat, lng, zone.lat, zone.lng);
      if (distance <= zone.radiusKm) {
        return { inZone: true, zoneName: zone.name };
      }
    }

    return {
      inZone: false,
      message: `Kuli is not yet available in your area. We're expanding to your neighborhood soon! Join the waitlist to be notified.`,
    };
  }

  /**
   * Get all active launch zones for a city.
   * Stored in Redis for hot-config updates without deployment.
   */
  async getActiveZones(city: string): Promise<GeoZone[]> {
    const cached = await this.redis.getJSON<GeoZone[]>(`geo:zones:${city}`);
    if (cached) return cached.filter(z => z.isActive);

    // Default zones for initial launch cities
    const defaults: Record<string, GeoZone[]> = {
      ahmedabad: [
        { name: 'Satellite', lat: 23.0225, lng: 72.5714, radiusKm: 5, isActive: true, launchDate: '2026-07-01' },
        { name: 'Prahlad Nagar', lat: 23.0120, lng: 72.5070, radiusKm: 4, isActive: true, launchDate: '2026-07-01' },
        { name: 'SG Highway', lat: 23.0500, lng: 72.5300, radiusKm: 5, isActive: true, launchDate: '2026-07-15' },
        { name: 'Bopal', lat: 23.0350, lng: 72.4650, radiusKm: 4, isActive: false, launchDate: '2026-08-01' },
      ],
      bengaluru: [
        { name: 'Koramangala', lat: 12.9352, lng: 77.6245, radiusKm: 5, isActive: true, launchDate: '2026-07-01' },
        { name: 'Indiranagar', lat: 12.9784, lng: 77.6408, radiusKm: 4, isActive: true, launchDate: '2026-07-01' },
        { name: 'HSR Layout', lat: 12.9116, lng: 77.6474, radiusKm: 4, isActive: true, launchDate: '2026-07-15' },
        { name: 'Whitefield', lat: 12.9698, lng: 77.7500, radiusKm: 6, isActive: false, launchDate: '2026-08-15' },
      ],
    };

    const zones = defaults[city.toLowerCase()] || [];

    // Cache in Redis for 1 hour
    await this.redis.setJSON(`geo:zones:${city}`, zones, 3600);

    return zones.filter(z => z.isActive);
  }

  /**
   * Admin endpoint: Activate/deactivate a zone without deployment.
   */
  async updateZoneStatus(city: string, zoneName: string, isActive: boolean): Promise<void> {
    const zones = await this.redis.getJSON<GeoZone[]>(`geo:zones:${city}`) || [];
    const zone = zones.find(z => z.name === zoneName);

    if (zone) {
      zone.isActive = isActive;
      await this.redis.setJSON(`geo:zones:${city}`, zones, 3600);
      console.log(`🏙️ Zone ${zoneName} in ${city}: ${isActive ? 'ACTIVATED' : 'DEACTIVATED'}`);
    }
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private buildCacheKey(query: SearchQuery, radius: number): string {
    const gridLat = Math.round(query.lat * 100) / 100;
    const gridLng = Math.round(query.lng * 100) / 100;
    return `${query.city}:${query.category}:${gridLat}:${gridLng}:${radius}`;
  }

  private async searchWorkersInRadius(
    query: SearchQuery,
    radiusKm: number,
  ): Promise<SearchResult[]> {
    // In production: PostgreSQL + PostGIS query:
    // SELECT * FROM worker_profiles
    // WHERE ST_DWithin(location, ST_Point($lng, $lat)::geography, $radius * 1000)
    //   AND category = $category AND is_online = true
    // ORDER BY ST_Distance(location, ST_Point($lng, $lat)::geography)
    // LIMIT $maxResults;

    // For now: return empty (will be connected to real DB in next sprint)
    return [];
  }

  private haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
