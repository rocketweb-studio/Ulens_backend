import { DynamicModule, Module } from '@nestjs/common';
import { CoreEnvConfig } from './core/core.config';
import { CoreModule } from './core/core.module';
import { EmailModule } from './modules/mail/mail.module';

@Module({
  imports: [CoreModule, EmailModule],
  controllers: [],
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
