import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from '@/auth.controller';
import { AuthService } from '@/auth.service';
import { CoreEnvConfig } from '@/core/core-env.config';
import { CoreModule } from '@/core/core.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CoreModule, JwtModule.register({
    secret:'your_jwt_secret',
    signOptions:{
      expiresIn:"1h",
    },
  })],
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
