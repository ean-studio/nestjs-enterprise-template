import { ApiStatusCode } from '@common/utils/api-status-code';
import api from 'sdk/src';
import { describe, expect, it } from 'vitest';

import { Testing } from '../testing.util';

describe('Health Check E2E', () => {
  it('should return health check result', async () => {
    const result = await api.functional.health.check({ host: Testing.getHost() });

    expect(result.status).toBe(ApiStatusCode.SUCCESS);
    expect(result.data.status).toBe('ok');
    expect(result.data.database).toBe('connected');
  });
});
