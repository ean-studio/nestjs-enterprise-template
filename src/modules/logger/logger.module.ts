import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { EnvironmentService } from '../environment';
import { PinoLoggerBuilder } from './pino-logger-builder';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [EnvironmentService],
      useFactory(env: EnvironmentService) {
        return {
          forRoutes: ['*path'],
          pinoHttp: {
            ...PinoLoggerBuilder.fastifyOptions,
            autoLogging: false,
            transport: env.isLocal() ? PinoLoggerBuilder.localTransport() : undefined,
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
