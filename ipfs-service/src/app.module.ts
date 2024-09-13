import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullmqModule } from './bullmq/bullmq.module.js';
import { ProvideToDHTProcessor } from './queues/processors/provide-to-dht.processor.js';
import { ProvideToDHTProducer } from './queues/producers/provide-to-dht.producer.js';
import { QUEUE_NAME_PROVIDE_TO_DHT } from './constants/bullmq.constants.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullmqModule,
    BullModule.registerQueue({
    name: QUEUE_NAME_PROVIDE_TO_DHT,
  }),],
  controllers: [AppController],
  providers: [AppService, ProvideToDHTProcessor, ProvideToDHTProducer],
})
export class AppModule {}
