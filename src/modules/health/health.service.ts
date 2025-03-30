import { Injectable } from '@nestjs/common';

import { TxPrismaClient } from '../database';
import { DatabaseStatus } from './constants';
import { ServerStatus } from './constants';
import { IHealthResult } from './interfaces/health.interface';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: TxPrismaClient) {}

  async check(): Promise<IHealthResult> {
    try {
      const sql = 'SELECT 1';
      await Promise.all([
        // 쓰기 연결 확인
        this.prisma.tx.$primary().$executeRawUnsafe(sql),
        // 읽기 복사본 연결 확인
        this.prisma.tx.$replica().$executeRawUnsafe(sql),
      ]);
      return {
        status: ServerStatus.OK,
        timestamp: new Date().toISOString(),
        database: DatabaseStatus.CONNECTED,
      };
    } catch (error) {
      return {
        status: ServerStatus.ERROR,
        timestamp: new Date().toISOString(),
        database: DatabaseStatus.DISCONNECTED,
        error: error.message,
      };
    }
  }
}
