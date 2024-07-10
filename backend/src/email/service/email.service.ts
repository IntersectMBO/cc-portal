import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EmailDto } from '../dto/email.dto';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(emailDto: EmailDto): Promise<void> {
    try {
      await this.mailerService.sendMail(emailDto);
    } catch (e) {
      this.logger.error(`There has been an error when sending email: ${e}`);
      throw new InternalServerErrorException(
        `There has been an error when sending email: ${e}`,
      );
    }
  }
}
