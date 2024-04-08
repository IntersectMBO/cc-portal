import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthFacade } from '../facade/auth.facade';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailMapper } from 'src/email/mapper/email.mapper';

@Injectable()
export class MagicRegisterStrategy extends PassportStrategy(
  Strategy,
  'magic-register',
) {
  private readonly logger = new Logger(MagicRegisterStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authFacade: AuthFacade,
  ) {
    super({
      secret: configService.getOrThrow('MAGIC_REGISTER_SECRET'),
      jwtOptions: {
        expiresIn: configService.getOrThrow('MAGIC_REGISTER_LINK_EXPIRES_IN'),
      },
      callbackUrl:
        configService.getOrThrow('BASE_URL') + '/api/auth/register/callback',
      sendMagicLink: async (destination: string, href: string) => {
        const emailDto: EmailDto = EmailMapper.registrationEmail(
          destination,
          href,
        );
        this.authFacade.sendEmail(emailDto);
        this.logger.log(`sending email to ${destination}, with link ${href}`);
      },
      verify: async (payload, callback) =>
        callback(null, this.validate(payload)),
    });
  }

  validate(payload: { destination: string }) {
    const user = this.authFacade.validateUser(payload.destination);
    return user;
  }
}
