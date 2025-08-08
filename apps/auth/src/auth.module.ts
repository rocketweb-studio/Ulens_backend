import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { CoreModule } from '@/core/core.module';
import { UserModule } from './modules/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [CoreModule, UserModule],
  controllers: [AuthController],
  providers: []
})
export class AuthModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}
