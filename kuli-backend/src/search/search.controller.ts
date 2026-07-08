import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SmartSearchService, SearchQuery } from './smart-search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SmartSearchService) {}

  @Get()
  async searchWorkers(
    @Query('category') category: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('city') city: string,
    @Query('minRating') minRating?: string,
    @Query('verifiedOnly') verifiedOnly?: string,
    @Query('maxResults') maxResults?: string,
  ) {
    // Basic validation could be done via pipes, but parsing manually here
    const query: SearchQuery = {
      category,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city,
      minRating: minRating ? parseFloat(minRating) : undefined,
      verifiedOnly: verifiedOnly === 'true',
      maxResults: maxResults ? parseInt(maxResults, 10) : undefined,
    };

    // First, check if the area is in an active launch zone
    const zoneCheck = await this.searchService.isInActiveZone(query.city, query.lat, query.lng);
    if (!zoneCheck.inZone) {
      return {
        workers: [],
        searchRadius: 0,
        wasExpanded: false,
        totalOnline: 0,
        demandLevel: 'low',
        message: zoneCheck.message,
      };
    }

    return this.searchService.search(query);
  }

  @Get('demand-hotspots')
  @UseGuards(AuthGuard('jwt'))
  async getHotspots(
    @Query('city') city: string,
    @Query('category') category: string,
  ) {
    if (!city || !category) {
      return { error: 'city and category are required' };
    }
    return this.searchService.getDemandHotspots(city, category);
  }
}
