import { TxPrismaClient } from '@modules/database';
import { Module } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ClsModule } from 'nestjs-cls';
import { join } from 'path';
import { vi } from 'vitest';

import { MockDbConnection } from './db/mock-db-connection';
import mockPrismaClient from './db/mock-prisma';
import { TransactionAdapterMock } from './db/transaction-adapter-mock';

export namespace Testing {
  @Module({
    providers: [MockDbConnection],
    exports: [MockDbConnection],
  })
  class TestDbConnectionModule {}

  export function getHost(version = 'v1'): string {
    return join(`http://localhost:${process.env.PORT}`, (process.env.PREFIX as string) ?? '', version);
  }

  export async function createTransactionTestingModule({
    imports = [],
    ...options
  }: Parameters<typeof Test.createTestingModule>[0]): Promise<TestingModule> {
    const testModule = await Test.createTestingModule({
      imports: [
        ClsModule.forRoot({
          plugins: [
            new ClsPluginTransactional({
              imports: [TestDbConnectionModule],
              adapter: new TransactionAdapterMock({
                connectionToken: MockDbConnection,
              }),
            }),
          ],
        }),
        ...imports,
      ],
      ...options,
    })
      .overrideProvider(TxPrismaClient)
      .useValue({
        tx: {
          $primary: () => mockPrismaClient,
          $replica: () => mockPrismaClient,
        },
        withTransaction: vi.fn(),
      })
      .compile();
    await testModule.init();

    return testModule;
  }
}
