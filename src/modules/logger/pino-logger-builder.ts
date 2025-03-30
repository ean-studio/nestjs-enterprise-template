import { generateUuidV7 } from '@common/utils/uuid';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Options } from 'pino-http';

export namespace PinoLoggerBuilder {
  /**
   * pino-pretty를 위한 로컬 설정
   * 로컬 개발 중 로그의 가독성을 향상시킵니다.
   */
  export function localTransport(): Options['transport'] {
    return {
      target: 'pino-pretty',
      options: {
        levelFirst: true,
        ignore: 'pid,hostname,req,res,severity,environment,context',
        messageKey: 'message',
        customColors: 'error:red,warn:yellow,info:green',
        translateTime: 'SYS:standard',
        errorLikeObjectKeys: ['err', 'error'],
        errorProps: '*',
        multiline: true,
        singleLineError: false,
        minimumLevel: 'info',
        sync: true,
        colorize: true,
        mkdir: true,
        hideObject: false,
      },
    };
  }

  /**
   * 로그 레벨을 설정합니다.
   * level 이 숫자로 정의되어 있어 문자열로 변환합니다.
   */
  export const fastifyOptions: Options = {
    customLogLevel: (_: IncomingMessage, res: ServerResponse, error: Error) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      }
      if (res.statusCode >= 500 || error) {
        return 'error';
      }
      return 'info';
    },
    formatters: {
      level: (label: string, number: number) => ({
        level: number,
        severity: label,
      }),
    },
    messageKey: 'message',
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    genReqId: () => generateUuidV7(),
  };
}
