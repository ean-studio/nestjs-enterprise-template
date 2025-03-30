import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

import { EnvironmentService } from '../environment/environment.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (env: EnvironmentService) => ({
        store: redisStore,
        host: env.getString('REDIS_HOST'),
        port: env.getNumber('REDIS_PORT'),
        ttl: 60 * 60 * 24, // 24시간
      }),
      inject: [EnvironmentService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
