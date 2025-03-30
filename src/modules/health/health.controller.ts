import { ApiResponse } from '@common/utils/api-response';
import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';
import { IHealthResult } from './interfaces/health.interface';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * 서버 상태를 체크 합니다.
   */
  @TypedRoute.Get()
  async check(): Promise<ApiResponse<IHealthResult>> {
    return ApiResponse.success(await this.healthService.check());
  }
}
