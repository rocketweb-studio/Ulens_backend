import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from './mail.config';
import { EmailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (mailerConfig: MailConfig) => ({
        transport: {
          host: mailerConfig.smtp_host,
          port: Number(mailerConfig.smtp_port),
          auth: {
            user: mailerConfig.smtp_user,
            pass: mailerConfig.smtp_password
          }
        },
        defaults: {
          from: mailerConfig.smtp_user
        }
      }),
      inject: [MailConfig],
      extraProviders: [MailConfig]
    })
  ],
  controllers: [MailController],
  exports: [EmailService],
  providers: [EmailService, MailConfig]
})
export class EmailModule {}
