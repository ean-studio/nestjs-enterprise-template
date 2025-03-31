import { ApiStatusCode } from '@common/utils/api-status-code';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ApiResponse } from '../utils/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    // HttpException인 경우
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as { message: string | string[] };
      const message =
        typeof exceptionResponse.message === 'string' ? exceptionResponse.message : exceptionResponse.message[0];

      Logger.error({
        message: `❌ [CLIENT_ERROR] ${request.method} ${request.url}`,
        error: {
          message,
          stack: exception.stack,
        },
      });

      return response.status(status).send(ApiResponse.error(message, ApiStatusCode.CLIENT_ERROR));
    }

    // 그 외 예외 (500 에러)
    Logger.error({
      message: `❌ [SERVER_ERROR] ${request.method} ${request.url}`,
      error: {
        message: exception instanceof Error ? exception.message : '알 수 없는 에러',
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    });

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send(ApiResponse.error('서버 내부 오류가 발생했습니다.', ApiStatusCode.SERVER_ERROR));
  }
}
