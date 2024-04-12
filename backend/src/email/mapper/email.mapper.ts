import { EmailDto } from '../dto/email.dto';

export enum TemplateMapper {
  LOGIN = 'login.hbs',
  REGISTRATION = 'registration.hbs',
}

export class EmailMapper {
  static loginEmail(destination: string, link: string): EmailDto {
    const emailDto = new EmailDto();
    emailDto.to = destination;
    emailDto.subject = 'CC Portal login';
    emailDto.template = TemplateMapper.LOGIN;
    emailDto.context = {
      email: destination,
      link: link,
    };
    return emailDto;
  }

  static registrationEmail(destination: string, link: string): EmailDto {
    const emailDto = new EmailDto();
    emailDto.to = destination;
    emailDto.subject = 'CC Portal registration';
    emailDto.template = TemplateMapper.REGISTRATION;
    emailDto.context = {
      email: destination,
      link: link,
    };
    return emailDto;
  }
}
