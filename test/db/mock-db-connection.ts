import { MockDbClient } from './mock-db-client';

export class MockDbConnection {
  clients: MockDbClient[] = [];

  getClient() {
    const client = new MockDbClient();
    this.clients.push(client);
    return client;
  }

  getClientsQueries() {
    return this.clients.map((c) => c.operations).filter((o) => o.length > 0);
  }

  get tx() {
    return this.getClient()['tx'];
  }
}
