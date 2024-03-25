import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Assuming you're using nestjs/config for configuration
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard], // Exporting guard so other modules can use it
})
export class JwtAuthModule {}
