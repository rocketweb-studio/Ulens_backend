import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// класс для тестирования MockController
export class MockTestManager {
  constructor(private app: INestApplication) {}

  async getMock(): Promise<{ version: string; message: string }> {
    const response = await request(this.app.getHttpServer()).get(`/api/v1`).expect(200);

    return response.body;
  }
}
