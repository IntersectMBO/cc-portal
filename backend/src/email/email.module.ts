import { Module } from '@nestjs/common';
import { EmailService } from './service/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          SES: {
            sesClient: new SESv2Client({
              region: configService.getOrThrow('AWS_REGION'),
              credentials: {
                accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.getOrThrow(
                  'AWS_SECRET_ACCESS_KEY',
                ),
              },
            }),
            SendEmailCommand,
          },
        },
        defaults: {
          from: `${configService.getOrThrow('NAME_FROM')} <${configService.getOrThrow('EMAIL_FROM')}>`,
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
