import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig, Environments } from '@auth/core/core.config';
import { CoreModule } from '@auth/core/core.module';
import { UserModule } from '@auth/modules/user/user.module';
import { UserController } from '@auth/modules/user/user.controller';
import { TestingModule } from '@auth/modules/testing/testing.module';

@Module({
  imports: [CoreModule, UserModule, TestingModule],
  controllers: [UserController],
  providers: []
})
export class AppModule {
  static forRoot(config: CoreEnvConfig): DynamicModule {
    // используем тестовый модуль только в тестовом окружении
    const testingModule: any[] = [];
    if (config.env === Environments.TESTING) {
      testingModule.push(TestingModule);
    }
    return {
      module: AppModule,
      imports: [CoreModule, UserModule, ...testingModule],
      controllers: [UserController],
      providers: [
        {
          provide: CoreEnvConfig,
          useValue: config
        }
      ]
    };
  }
}
