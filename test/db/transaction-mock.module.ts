import { Global, Module } from '@nestjs/common';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { ClsModule } from 'nestjs-cls';

import { MockDbConnection } from './mock-db-connection';
import { TransactionAdapterMock } from './transaction-adapter-mock';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          adapter: new TransactionAdapterMock({
            connectionToken: MockDbConnection,
          }),
        }),
      ],
    }),
  ],
  exports: [ClsModule],
})
export class TransactionMockModule {}
