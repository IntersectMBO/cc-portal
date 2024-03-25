import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './api/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MagicLoginStrategy } from './magiclogin/magiclogin.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthModule } from './jwt/jwt-auth.module';
import { AuthFacade } from './facade/auth.facade';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/service/email.service';

@Module({
  imports: [UsersModule, PassportModule, JwtAuthModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, MagicLoginStrategy, AuthFacade, EmailService],
})
export class AuthModule {}
