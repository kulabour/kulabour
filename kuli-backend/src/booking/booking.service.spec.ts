import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingService - State Transitions', () => {
  let service: BookingService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      workerProfile: {
        findUnique: jest.fn(),
      },
      booking: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('acceptBooking', () => {
    it('should throw if booking is not PENDING', async () => {
      prismaMock.workerProfile.findUnique.mockResolvedValue({ id: 'worker123' });
      prismaMock.booking.findUnique.mockResolvedValue({ id: 'booking123', status: 'ACCEPTED' });

      await expect(service.acceptBooking('user123', 'booking123')).rejects.toThrow(BadRequestException);
      await expect(service.acceptBooking('user123', 'booking123')).rejects.toThrow('Booking is no longer available');
    });

    it('should update booking to ACCEPTED if PENDING', async () => {
      prismaMock.workerProfile.findUnique.mockResolvedValue({ id: 'worker123' });
      prismaMock.booking.findUnique.mockResolvedValue({ id: 'booking123', status: 'PENDING' });
      prismaMock.booking.update.mockResolvedValue({ id: 'booking123', status: 'ACCEPTED', workerId: 'worker123' });

      const result = await service.acceptBooking('user123', 'booking123');
      expect(result.status).toBe('ACCEPTED');
      expect(result.workerId).toBe('worker123');
      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking123' },
        data: { status: 'ACCEPTED', workerId: 'worker123' }
      });
    });
  });

  describe('cancelBooking', () => {
    it('should throw if booking is COMPLETED', async () => {
      prismaMock.booking.findUnique.mockResolvedValue({ id: 'booking123', status: 'COMPLETED' });
      await expect(service.cancelBooking('user123', 'booking123')).rejects.toThrow(BadRequestException);
    });
  });
});
