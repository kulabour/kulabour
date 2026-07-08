import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('WorkerService - Redis Toggling', () => {
  let service: WorkerService;
  let prismaMock: any;
  let redisMock: any;

  beforeEach(async () => {
    prismaMock = {
      workerProfile: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    redisMock = {
      sadd: jest.fn(),
      srem: jest.fn(),
      expire: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
      ],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
  });

  describe('updateOnlineStatus', () => {
    it('should add worker to Redis set if online and city is provided', async () => {
      prismaMock.workerProfile.findUnique.mockResolvedValue({ id: 'worker123' });
      prismaMock.workerProfile.update.mockResolvedValue({});

      await service.updateOnlineStatus('user123', true, 'Mumbai');

      expect(redisMock.sadd).toHaveBeenCalledWith('city:online:mumbai', 'worker123');
      expect(redisMock.expire).toHaveBeenCalledWith('city:online:mumbai', 300);
      expect(redisMock.srem).not.toHaveBeenCalled();
    });

    it('should remove worker from Redis set if offline and city is provided', async () => {
      prismaMock.workerProfile.findUnique.mockResolvedValue({ id: 'worker123' });
      prismaMock.workerProfile.update.mockResolvedValue({});

      await service.updateOnlineStatus('user123', false, 'Mumbai');

      expect(redisMock.srem).toHaveBeenCalledWith('city:online:mumbai', 'worker123');
      expect(redisMock.sadd).not.toHaveBeenCalled();
    });
    
    it('should not call Redis if city is not provided', async () => {
      prismaMock.workerProfile.findUnique.mockResolvedValue({ id: 'worker123' });
      prismaMock.workerProfile.update.mockResolvedValue({});

      await service.updateOnlineStatus('user123', true);

      expect(redisMock.sadd).not.toHaveBeenCalled();
      expect(redisMock.srem).not.toHaveBeenCalled();
    });
  });
});
