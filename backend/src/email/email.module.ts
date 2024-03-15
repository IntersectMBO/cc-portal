import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { SendGridClient } from './sendgrid-client';
import { EmailController } from './api/email.controller';

@Module({
  providers: [EmailService, SendGridClient],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
