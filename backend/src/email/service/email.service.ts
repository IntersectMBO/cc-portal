import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailDto } from '../dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(emailDto: EmailDto): Promise<void> {
    await this.mailerService.sendMail(emailDto);
  }
}
