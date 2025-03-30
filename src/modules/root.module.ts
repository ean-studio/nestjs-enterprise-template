import { Module } from '@nestjs/common';

import { DatabaseModule } from './database';
import { EnvironmentModule } from './environment';
import { HealthModule } from './health';
import { LoggerModule } from './logger/logger.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [EnvironmentModule, DatabaseModule, LoggerModule, RedisModule],
})
class GlobalModule {}

@Module({
  imports: [GlobalModule, HealthModule],
})
export class RootModule {}
