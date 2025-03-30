import { Injectable } from '@nestjs/common';

import { EnvironmentService } from '../environment/environment.service';
import { createPrismaService } from './create-prisma-client';

@Injectable()
export class PrismaService extends createPrismaService() {
  constructor(private readonly env: EnvironmentService) {
    super(env);
  }
}
