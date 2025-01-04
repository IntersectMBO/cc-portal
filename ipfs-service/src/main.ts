import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import morgan from 'morgan';
import { LoggerFactory } from './util/logger-factory.js';
import { LoggerService } from '@nestjs/common';
import events from 'events';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger: LoggerService = LoggerFactory('IPFS Service');

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

  // Increase the limit globally for all event emitters
  events.EventEmitter.defaultMaxListeners = 50; // Set your desired limit

  await app.listen(3001);
}
bootstrap().catch((err) => {
  console.error(err); // eslint-disable-line no-console
  process.exit(1);
});
