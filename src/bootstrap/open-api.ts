import { EnvironmentService } from '@modules/environment';
import { NestiaSwaggerComposer } from '@nestia/sdk';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { OpenAPIObject } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';

export namespace ApplicationOpenApi {
  export async function setup(app: NestFastifyApplication) {
    const env = app.get(EnvironmentService);
    const port = env.getNumber('PORT');
    const prefix = env.getString('OPEN_API_PREFIX') || 'api-docs';

    const document = await NestiaSwaggerComposer.document(app, {
      openapi: '3.1',
      operationId: (props) => `${props.class}-${props.function}`,
      beautify: true,
      servers: [{ url: `http://localhost:${port}`, description: 'Local Server' }],
      security: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 토큰',
        },
      },
    });

    SwaggerModule.setup(prefix, app, document as OpenAPIObject);
  }
}
