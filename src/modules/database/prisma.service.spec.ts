import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EnvironmentService } from '../environment/environment.service';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let envService: EnvironmentService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: EnvironmentService,
          useValue: {
            get: vi.fn().mockImplementation((key: string) => {
              if (key === 'DATABASE_URL') {
                return 'postgresql://test:test@localhost:5432/test';
              }
              if (key === 'READ_REPLICA_URL') {
                return 'postgresql://test:test@localhost:5432/test-replica';
              }
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    envService = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should call environment service with correct keys', () => {
    expect(envService.get).toHaveBeenCalledWith('DATABASE_URL');
    expect(envService.get).toHaveBeenCalledWith('READ_REPLICA_URL');
  });
});
