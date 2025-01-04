import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullmqModule } from './bullmq/bullmq.module.js';
import { ProvideToDHTProcessor } from './queues/processors/provide-to-dht.processor.js';
import { ProvideToDHTProducer } from './queues/producers/provide-to-dht.producer.js';
import {
  QUEUE_NAME_PROVIDE_ALL_CIDS,
  QUEUE_NAME_PROVIDE_TO_DHT,
  QUEUE_NAME_PRUNE_PEER_STORE,
} from './constants/bullmq.constants.js';
import { PrunePeerStoreProducer } from './queues/producers/prune-peer-store.producer.js';
import { PrunePeerStoreProcessor } from './queues/processors/prune-peer-store.processor.js';
import { PrunePeerStoreJob } from './jobs/impl/prune-peer-store.job.js';
import { Scheduler } from './jobs/scheduler.js';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ProvideAllCidsJob } from './jobs/impl/provide-all-cids.job.js';
import { ProvideAllCidsProducer } from './queues/producers/provide-all-cids.producer.js';
import { ProvideAllCidsProcessor } from './queues/processors/provide-all-cids.processor.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullmqModule,
    BullModule.registerQueue({
      name: QUEUE_NAME_PROVIDE_TO_DHT,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME_PRUNE_PEER_STORE,
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME_PROVIDE_ALL_CIDS,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ProvideToDHTProcessor,
    ProvideToDHTProducer,
    PrunePeerStoreProducer,
    PrunePeerStoreProcessor,
    ProvideAllCidsProducer,
    ProvideAllCidsProcessor,
    SchedulerRegistry,
    Scheduler,
    PrunePeerStoreJob,
    ProvideAllCidsJob,
  ],
})
export class AppModule {
  constructor(
    private readonly scheduler: Scheduler,
    private readonly prunePeerStoreJob: PrunePeerStoreJob,
    private readonly provideAllCidsJob: ProvideAllCidsJob,
  ) {}

  onModuleInit() {
    this.scheduler.registerJob(this.prunePeerStoreJob);
    this.scheduler.registerJob(this.provideAllCidsJob);
  }
}
