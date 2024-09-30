import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthFacade } from '../facade/auth.facade';
import { EmailDto } from 'src/email/dto/email.dto';
import { EmailMapper } from 'src/email/mapper/email.mapper';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(
  Strategy,
  'magic-login',
) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authFacade: AuthFacade,
  ) {
    super({
      secret: configService.getOrThrow('MAGIC_LOGIN_SECRET'),
      jwtOptions: {
        expiresIn: configService.getOrThrow('MAGIC_LOGIN_LINK_EXPIRES_IN'),
      },
      callbackUrl: configService.getOrThrow('FE_LOGIN_CALLBACK_URL'),
      sendMagicLink: async (destination: string, href: string) => {
        const emailDto: EmailDto = EmailMapper.loginEmail(destination, href);
        const localEnv = configService.get('ENVIRONMENT') === 'local';
        if (localEnv) {
          this.logger.log(`sending email to ${destination}, with link ${href}`);
          return;
        }
        await this.authFacade.sendEmail(emailDto);
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
