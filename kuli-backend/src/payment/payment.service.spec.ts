import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('PaymentService - Webhooks', () => {
  let service: PaymentService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      payment: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      booking: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  describe('handleWebhook', () => {
    it('should throw BadRequestException if signature is invalid', async () => {
      const payload = { event: 'payment.captured' };
      const invalidSignature = 'invalid_hash';

      await expect(service.handleWebhook(invalidSignature, payload)).rejects.toThrow(BadRequestException);
    });

    it('should process webhook and update statuses if signature is valid', async () => {
      const payload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: { order_id: 'order_123' },
          },
        },
      };

      const secret = 'test_secret'; // Default from service
      const validSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

      prismaMock.payment.findFirst.mockResolvedValue({ id: 'pay_123', bookingId: 'booking_123' });
      prismaMock.payment.update.mockResolvedValue({});
      prismaMock.booking.update.mockResolvedValue({});

      const result = await service.handleWebhook(validSignature, payload);

      expect(result).toEqual({ status: 'ok' });
      expect(prismaMock.payment.update).toHaveBeenCalledWith({
        where: { id: 'pay_123' },
        data: { status: 'SUCCESS' },
      });
      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking_123' },
        data: { status: 'COMPLETED' },
      });
    });
  });
});
