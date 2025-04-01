import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Mocked } from 'vitest';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { EnvironmentService } from './environment.service';
import type { Environment } from './environment.types';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  let configService: Mocked<ConfigService<Environment, true>>;

  const mockConfigService = {
    get: vi.fn(),
  } as unknown as Mocked<ConfigService<Environment, true>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
      exports: [EnvironmentService],
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
    configService = module.get(ConfigService);
  });

  describe('get', () => {
    it('should return config value', () => {
      const mockValue = 'test-value';
      configService.get.mockReturnValue(mockValue);

      const result = service.get('NODE_ENV');
      expect(result).toBe(mockValue);
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });
  });

  describe('getString', () => {
    it('should return string value', () => {
      const mockValue = 'test-string';
      configService.get.mockReturnValue(mockValue);

      const result = service.getString('NODE_ENV');
      expect(result).toBe(mockValue);
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });
  });

  describe('getNumber', () => {
    it('should return number value', () => {
      const mockValue = 123;
      configService.get.mockReturnValue(mockValue);

      const result = service.getNumber('PORT');
      expect(result).toBe(mockValue);
      expect(configService.get).toHaveBeenCalledWith('PORT');
    });
  });

  describe('getBoolean', () => {
    it('should return boolean value', () => {
      const mockValue = true;
      configService.get.mockReturnValue(mockValue);

      const result = service.getBoolean('NODE_ENV');
      expect(result).toBe(mockValue);
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });
  });

  describe('isDevelopment', () => {
    it('should return true when NODE_ENV is development', () => {
      configService.get.mockReturnValue('development');

      const result = service.isDevelopment();
      expect(result).toBe(true);
    });

    it('should return false when NODE_ENV is not development', () => {
      configService.get.mockReturnValue('production');

      const result = service.isDevelopment();
      expect(result).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('should return true when NODE_ENV is production', () => {
      configService.get.mockReturnValue('production');

      const result = service.isProduction();
      expect(result).toBe(true);
    });

    it('should return false when NODE_ENV is not production', () => {
      configService.get.mockReturnValue('development');

      const result = service.isProduction();
      expect(result).toBe(false);
    });
  });

  describe('isLocal', () => {
    it('should return true when NODE_ENV is local', () => {
      configService.get.mockReturnValue('local');

      const result = service.isLocal();
      expect(result).toBe(true);
    });

    it('should return false when NODE_ENV is not local', () => {
      configService.get.mockReturnValue('development');

      const result = service.isLocal();
      expect(result).toBe(false);
    });
  });
});
