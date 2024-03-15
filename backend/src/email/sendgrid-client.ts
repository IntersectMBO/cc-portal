import { Injectable, Logger } from '@nestjs/common';
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail';

@Injectable()
export class SendGridClient {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(SendGridClient.name);
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async send(mail: MailDataRequired): Promise<void> {
    try {
      await SendGrid.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
    } catch (error) {
      this.logger.error('Error while sending email', error);
      throw error;
    }
  }
}
