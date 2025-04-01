import { PrismaClient } from '@prisma/client';
import { readReplicas } from '@prisma/extension-read-replicas';

export class MockDbClient extends createPrismaService() {
  private _operations: string[] = [];
  get operations() {
    return this._operations;
  }

  async query(query: string) {
    this._operations.push(query);
    return { query };
  }
}
function createPrismaClient(databaseUrl: string, replicaDatabaseUrl: string) {
  const prismaClient = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });
  const replicaClient = new PrismaClient({
    datasources: { db: { url: replicaDatabaseUrl } },
  });

  return prismaClient.$extends(readReplicas({ replicas: [replicaClient] }));
}

function createPrismaService() {
  return new Proxy(class {}, {
    construct: () => {
      return createPrismaClient('', '');
    },
  }) as new () => ReturnType<typeof createPrismaClient>;
}
