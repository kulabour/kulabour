import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UpdateWorkerProfileDto, UpdateLocationDto } from './dto/worker.dto';

@Injectable()
export class WorkerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getProfile(userId: string) {
    let profile = await this.prisma.workerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      profile = await this.prisma.workerProfile.create({
        data: {
          userId,
          skills: [],
          ratePerHour: 300,
          experienceYears: 0,
        },
        include: { user: true },
      });
    }

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateWorkerProfileDto) {
    const profile = await this.getProfile(userId);
    return this.prisma.workerProfile.update({
      where: { id: profile.id },
      data: { ...dto },
    });
  }

  async updateLocation(userId: string, dto: UpdateLocationDto) {
    const profile = await this.getProfile(userId);
    
    const updated = await this.prisma.workerProfile.update({
      where: { id: profile.id },
      data: {
        currentLat: dto.latitude,
        currentLng: dto.longitude,
      },
    });

    await this.redis.setWorkerLocation(profile.id, dto.latitude, dto.longitude);

    return updated;
  }
  
  async updateOnlineStatus(userId: string, isOnline: boolean, city?: string) {
    const profile = await this.getProfile(userId);
    const updated = await this.prisma.workerProfile.update({
      where: { id: profile.id },
      data: { isOnline },
    });

    if (city) {
      const cityKey = `city:online:${city.toLowerCase()}`;
      if (isOnline) {
        await this.redis.sadd(cityKey, profile.id);
        await this.redis.expire(cityKey, 300); // 5 mins
      } else {
        await this.redis.srem(cityKey, profile.id);
      }
    }

    return updated;
  }
  
  async getWorkerById(workerId: string) {
    const profile = await this.prisma.workerProfile.findUnique({
      where: { id: workerId },
      include: { user: true, reviews: true },
    });
    if (!profile) throw new NotFoundException('Worker not found');
    return profile;
  }

  async getWorkerReviews(workerId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    // Check if worker exists first
    await this.getWorkerById(workerId);
    
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { workerId },
        include: { customer: { select: { id: true, name: true } } },
        skip,
        take: limit,
        orderBy: { id: 'desc' }, // Assuming id is sequential or we'd use createdAt
      }),
      this.prisma.review.count({ where: { workerId } })
    ]);
    
    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
