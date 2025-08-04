import { Controller, Get } from '@nestjs/common';
import { MockService } from './mock.service';

@Controller()
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @Get()
  getHello(): { version: string; message: string } {
    return this.mockService.getHello();
  }
}
