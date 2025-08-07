import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { CoreModule } from '@/core/core.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {
    return {
      module: UserModule,
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}
