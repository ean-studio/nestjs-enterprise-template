import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

import type { EnvironmentService } from '../environment';

function createPrismaClient(databaseUrl: string, replicaDatabaseUrl: string) {
  const prismaClient = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
  const replicaClient = new PrismaClient({
    datasources: { db: { url: replicaDatabaseUrl } },
  });

  return prismaClient.$extends(readReplicas({ replicas: [replicaClient] }));
}

export function createPrismaService() {
  return new Proxy(
    class {
      constructor(_: EnvironmentService) {}
    },
    {
      construct: (_, [env]: [EnvironmentService]) => {
        return createPrismaClient(env.get('DATABASE_URL'), env.get('READ_REPLICA_URL'));
      },
    },
  ) as new (env: EnvironmentService) => ReturnType<typeof createPrismaClient>;
}
