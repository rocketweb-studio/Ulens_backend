import { DynamicModule, Module } from '@nestjs/common';
import { MainController } from '@/main.controller';
import { MainService } from '@/main.service';
import { CoreEnvConfig } from '@/core/core-env.config';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [MainController],
  providers: [MainService]
})
export class MainModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {
    return {
      module: MainModule,
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}
