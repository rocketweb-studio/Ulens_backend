import { Injectable } from '@nestjs/common';
import { MockEnvConfig } from './mock.config';

@Injectable()
export class MockService {
  // используем MockEnvConfig для получения данных из окружения через Dependency Injection
  constructor(private readonly mockEnvConfig: MockEnvConfig) {}

  getHello(): { version: string; message: string } {
    return { version: '1.0.0', message: `This is mock ${this.mockEnvConfig.mockEnv}` };
  }
}
