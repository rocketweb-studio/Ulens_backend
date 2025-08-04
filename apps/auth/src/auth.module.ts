import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from '@/auth.controller';
import { AuthService } from '@/auth.service';
import { CoreEnvConfig } from '@/core/core-env.config';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [AuthController],
  providers: [AuthService]
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
