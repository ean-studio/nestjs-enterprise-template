// 1
import type { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// 2
beforeEach(() => {
  mockReset(mockPrismaClient);
});

// 3
const mockPrismaClient = mockDeep<PrismaClient>();
export default mockPrismaClient;
