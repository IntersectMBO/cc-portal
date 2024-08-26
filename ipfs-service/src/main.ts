import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { EventEmitter } from 'events';

async function bootstrap() {
  // Increase the max listeners for EventEmitters
  EventEmitter.defaultMaxListeners = 50; // Set this to the desired number
  
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap().catch((err) => {
  console.error(err); // eslint-disable-line no-console
  process.exit(1);
});
