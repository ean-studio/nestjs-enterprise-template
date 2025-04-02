import { CACHE_MANAGER } from '@nestjs/cache-manager';
import mockPrismaClient from '@test/db/mock-prisma';
import { Testing } from '@test/testing.util';
import type { Cache } from 'cache-manager';
import typia from 'typia';
import type { Mocked } from 'vitest';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { DatabaseStatus, ServerStatus } from './constants';
import { HealthService } from './health.service';
import type { IHealthResult } from './interfaces/health.interface';

const mockCache = {
  del: vi.fn().mockResolvedValue(false),
} as unknown as Cache;

describe('HealthService', () => {
  let service: HealthService;
  let cacheManager: Mocked<Cache>;

  beforeAll(async () => {
    const module = await Testing.createTransactionTestingModule({
      providers: [
        HealthService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    });

    service = module.get(HealthService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('check', () => {
    it('should return OK status when all services are healthy', async () => {
      // Given
      const mockDate = new Date('2024-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const mockHealthResult = typia.random<IHealthResult>();
      console.log(mockHealthResult);

      // prisma mock
      mockPrismaClient.$executeRawUnsafe.mockResolvedValue(1);

      // When
      const result = await service.check();
      // Then
      expect(result).toEqual({
        status: ServerStatus.OK,
        timestamp: mockDate.toISOString(),
        database: DatabaseStatus.CONNECTED,
      });
      expect(mockCache.del).toHaveBeenCalledWith('test');
    });

    it('should return ERROR status when database connection fails', async () => {
      // Given
      const mockDate = new Date('2024-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
      const mockError = new Error('Database connection failed');
      mockPrismaClient.$executeRawUnsafe.mockRejectedValueOnce(mockError);
      // When
      const result = await service.check();
      // Then
      expect(result).toEqual({
        status: ServerStatus.ERROR,
        timestamp: mockDate.toISOString(),
        database: DatabaseStatus.DISCONNECTED,
        error: mockError.message,
      });
    });

    it('should return ERROR status when cache connection fails', async () => {
      // Given
      const mockDate = new Date('2024-01-01T00:00:00.000Z');
      vi.setSystemTime(mockDate);
      const mockError = new Error('Cache connection failed');
      cacheManager.del.mockRejectedValueOnce(mockError);
      // When
      const result = await service.check();
      // Then
      expect(result).toEqual({
        status: ServerStatus.ERROR,
        timestamp: mockDate.toISOString(),
        database: DatabaseStatus.DISCONNECTED,
        error: mockError.message,
      });
    });
  });
});
