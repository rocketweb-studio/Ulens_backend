import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { CoreModule } from '@/core/core.module';
import { UserModule } from '@/modules/user/user.module';
import { UserController } from '@/modules/user/user.controller';

@Module({
  imports: [CoreModule, UserModule],
  controllers: [UserController],
  providers: []
})
export class AppModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {
    return {
      module: AppModule,
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}
