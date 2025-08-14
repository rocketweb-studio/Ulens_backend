import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { CoreModule } from '@/core/core.module';
import { UserController } from '@/modules/user/user.controller';
import { UserService } from '@/modules/user/user.service';
import { IUserCommandRepository } from './user.interfaces';
import { PrismaUserCommandRepository } from './repo/user.repository';


/**
 * { provide: IUserCommandRepository, useClass: PrismaUserCommandRepository}
 * Явно указываем что при передаче зависимости IUserCommandRepository 
 *    нужно использовать реализацию PrismaUserCommandRepository.
 *    Это необходимо, потому что интерфейсы TypeScript не существуют во время выполнения,
 *    и приложение не знает, какую реализацию подставить без явного связывания.
 */
@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: IUserCommandRepository, useClass: PrismaUserCommandRepository},
  ],
  exports: [UserService]
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
