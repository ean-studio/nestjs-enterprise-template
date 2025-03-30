import { Module } from '@nestjs/common';

import { DatabaseModule } from './modules/database';
import { EnvironmentModule } from './modules/environment';
import { HealthModule } from './modules/health';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [EnvironmentModule, DatabaseModule, HealthModule, LoggerModule],
})
export class AppModule {}
