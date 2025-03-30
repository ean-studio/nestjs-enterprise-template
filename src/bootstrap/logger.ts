import { EnvironmentService } from '@modules/environment/environment.service';
import { Logger as Log } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export namespace ApplicationLogger {
  /**
   * Setup the logger for the application.
   * @param app - The NestFastifyApplication instance.
   */
  export function setup(app: NestFastifyApplication) {
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
  }

  /**
   * Add a request logging hook to the application.
   * @param app - The NestFastifyApplication instance.
   */
  export function addRequestLoggingHook(app: NestFastifyApplication) {
    const swagger = app.get(EnvironmentService).getString('OPEN_API_PREFIX');
    app
      .getHttpAdapter()
      .getInstance()
      .addHook('preHandler', (request, _, next) => {
        if (request.url.startsWith(swagger)) {
          return next();
        }

        Log.log({
          message: `🚀 [REQUEST] ${request.method} ${request.url}`,
          parameters: {
            body: request.body ?? {},
            query: request.query ?? {},
            params: request.params ?? {},
          },
        });
        next();
      });
  }

  /**
   * Add a response logging hook to the application.
   * @param app - The NestFastifyApplication instance.
   */
  export function addResponseLoggingHook(app: NestFastifyApplication) {
    const swagger = app.get(EnvironmentService).getString('OPEN_API_PREFIX');
    app
      .getHttpAdapter()
      .getInstance()
      .addHook('onSend', (request, reply, payload, done) => {
        if (request.url.startsWith(swagger)) {
          return done();
        }

        Log.log({
          message: `✨ [RESPONSE] ${reply.statusCode}`,
          payload,
        });
        done();
      });
  }
}
