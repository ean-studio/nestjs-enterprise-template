import { AppModule } from '@app.module';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { EnvironmentService } from '@modules/environment/environment.service';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { ApplicationLogger } from './logger';
import { ApplicationOpenApi } from './open-api';

export namespace Application {
  /**
   * Bootstrap the application.
   */
  export async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }));

    const env = app.get(EnvironmentService);
    const port = env.getNumber('PORT');

    await setup(app);

    await app.listen(port, '0.0.0.0');
  }

  /**
   * Setup the application.
   * @param app - The NestFastifyApplication instance.
   */
  async function setup(app: NestFastifyApplication) {
    const env = app.get(EnvironmentService);
    const prefix = env.getString('PREFIX');
    app.setGlobalPrefix(prefix);
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });

    await app.register(cors, {
      origin: '*',
      credentials: true,
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    await app.register(helmet, {
      global: true,
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    });

    ApplicationLogger.setup(app);
    ApplicationLogger.addRequestLoggingHook(app);
    ApplicationLogger.addResponseLoggingHook(app);
    await ApplicationOpenApi.setup(app);
  }
}
