import { Module } from '@nestjs/common';
import { MockController } from './mock.controller';
import { MockService } from './mock.service';
import { MockEnvConfig } from './mock.config';

@Module({
  controllers: [MockController],
  providers: [MockService, MockEnvConfig]
})
export class MockModule {}
