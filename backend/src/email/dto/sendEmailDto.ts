import { IsEmail, MaxLength } from 'class-validator';

export class SendEmailDTO {
  @MaxLength(80, { message: `Maximum character length is 80` })
  @IsEmail()
  recipient: string;
}
