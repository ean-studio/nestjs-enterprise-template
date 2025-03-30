import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Environment } from './environment.types';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService<Environment, true>) {}

  get<K extends keyof Environment>(key: K): Environment[K] {
    return this.configService.get<Environment[K]>(key);
  }

  getString<K extends keyof Environment>(key: K): Environment[K] extends string ? Environment[K] : never {
    return this.configService.get<Environment[K]>(key) as Environment[K] extends string ? Environment[K] : never;
  }

  getNumber<K extends keyof Environment>(key: K): Environment[K] extends number ? Environment[K] : never {
    return this.configService.get<Environment[K]>(key) as Environment[K] extends number ? Environment[K] : never;
  }

  getBoolean<K extends keyof Environment>(key: K): Environment[K] extends boolean ? Environment[K] : never {
    return this.configService.get<Environment[K]>(key) as Environment[K] extends boolean ? Environment[K] : never;
  }

  isDevelopment(): boolean {
    return this.getString('NODE_ENV') === 'development';
  }

  isProduction(): boolean {
    return this.getString('NODE_ENV') === 'production';
  }

  isLocal(): boolean {
    return this.getString('NODE_ENV') === 'local';
  }
}
