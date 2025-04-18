import { RootModule } from '@modules/root.module';
import type { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const app = await NestFactory.create<NestFastifyApplication>(RootModule, new FastifyAdapter());
    return app;
  },
  clone: true,
  distribute: 'sdk',
  output: 'sdk/src',
  e2e: 'test',
};
export default NESTIA_CONFIG;
