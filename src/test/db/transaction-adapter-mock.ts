import type { TransactionalAdapter } from '@nestjs-cls/transactional';

import type { MockDbClient } from './mock-db-client';
import type { MockDbConnection } from './mock-db-connection';

interface MockTransactionOptions {
  serializable?: boolean;
  sayHello?: boolean;
}

export class TransactionAdapterMock
  implements TransactionalAdapter<MockDbConnection, MockDbClient, MockTransactionOptions>
{
  connectionToken: unknown;
  defaultTxOptions: Partial<MockTransactionOptions>;

  constructor(options: { connectionToken: unknown; defaultTxOptions?: MockTransactionOptions }) {
    this.connectionToken = options.connectionToken;
    this.defaultTxOptions = options.defaultTxOptions ?? {};
  }

  optionsFactory = (connection: MockDbConnection) => ({
    wrapWithTransaction: async (
      options: MockTransactionOptions | undefined,
      fn: (...args: unknown[]) => Promise<unknown>,
      setTxInstance: (client?: MockDbClient) => void,
    ) => {
      const client = connection.getClient();
      setTxInstance(client);
      let beginQuery = 'BEGIN TRANSACTION;';
      if (options?.serializable) {
        beginQuery = 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; ' + beginQuery;
      }
      if (options?.sayHello) {
        beginQuery = '/* Hello */ ' + beginQuery;
      }
      await client.query(beginQuery);
      try {
        const result = await fn();
        await client.query('COMMIT TRANSACTION;');
        return result;
      } catch (e) {
        await client.query('ROLLBACK TRANSACTION;');
        throw e;
      }
    },
    getFallbackInstance: () => {
      return connection.getClient();
    },
  });
}
