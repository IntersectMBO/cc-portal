import { Module } from '@nestjs/common';
import { EmailService } from './service/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow('SENDGRID_HOST'),
          port: configService.getOrThrow('SENDGRID_PORT'),
          auth: {
            user: configService.getOrThrow('SENDGRID_USER'),
            pass: configService.getOrThrow('SENDGRID_API_KEY'),
          },
        },
        defaults: {
          from: `${configService.getOrThrow('SENDGRID_EMAIL_NAME')} <${configService.getOrThrow('SENDGRID_EMAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, './templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService, ConfigService],
  exports: [EmailService],
})
export class EmailModule {}
