import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { SendEmailDTO } from '../dto/sendEmailDto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-test-email')
  async sendEmail(@Body() sendEmailDTO: SendEmailDTO): Promise<void> {
    await this.emailService.sendEmail(sendEmailDTO);
  }
}
