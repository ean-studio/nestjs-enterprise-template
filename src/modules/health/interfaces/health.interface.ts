import type { tags } from 'typia';

import type { DatabaseStatus, ServerStatus } from '../constants';

export interface IHealthResult {
  /**
   * 상태
   * @enum ok, error
   */
  status: ServerStatus;
  timestamp: string & tags.Format<'date-time'>;
  database: DatabaseStatus;
  error?: string;
}
