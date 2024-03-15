import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from '../sendgrid-client';
import { SendEmailDTO } from '../dto/sendEmailDto';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendGridClient: SendGridClient,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(sendEmailDTO: SendEmailDTO): Promise<void> {
    const mail: MailDataRequired = {
      to: sendEmailDTO.recipient,
      from: {
        email: this.configService.getOrThrow('EMAIL_ADDRESS'),
        name: this.configService.getOrThrow('EMAIL_NICKNAME'),
      },
      templateId: this.configService.getOrThrow('SENDGRID_TEMPLATE_ID'),
      dynamicTemplateData: {
        recipient: sendEmailDTO.recipient,
      },
    };
    await this.sendGridClient.send(mail);
  }
}
