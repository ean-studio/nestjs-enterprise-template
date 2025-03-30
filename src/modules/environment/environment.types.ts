export interface Environment {
  // Server
  NODE_ENV: 'development' | 'production' | 'local';
  PREFIX: string;
  PORT: number;

  // Database
  DATABASE_URL: string;
  READ_REPLICA_URL: string;

  // Open API
  OPEN_API_PREFIX: string;
}
