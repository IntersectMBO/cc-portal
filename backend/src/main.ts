import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  LoggerService,
  ValidationPipe,
} from '@nestjs/common';
import { LoggerFactory } from './util/logger-factory';
import { CamelCasePipe } from './common/pipes/camel-case.pipe';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger: LoggerService = LoggerFactory('CC Portal API');
  const app = await NestFactory.create(AppModule, {
    logger: logger,
  });

  const morganFormat =
    ':method :url :status :res[content-length] - :response-time ms';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          logger.log(message);
        },
      },
    }),
  );

  app.useGlobalPipes(
    new CamelCasePipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('/api');
  //TODO add env variable related to current environment (DEV/STAGE/PROD) and only allow * origin for NON PROD environments
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle('CC Portal API')
    .setDescription('CC Portal API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const configService = app.get(ConfigService);
  const displaySwaggerApi = configService.get('DISPLAY_SWAGGER_API') === 'true';
  if (displaySwaggerApi) {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  app.use(cookieParser());
  await app.listen(1337);
}
bootstrap();
