import { BullBoardModule } from "@bull-board/nestjs";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QUEUE_NAME_PROVIDE_TO_DHT } from "../constants/bullmq.constants.js";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow("REDIS_HOST"),
          port: configService.getOrThrow("REDIS_PORT"),
          password: configService.getOrThrow("REDIS_PASSWORD"),
          connectTimeout: 20000,
          reconnectOnError: (err) => {
            const targetErrors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET'];
            return targetErrors.some(targetError => err.message.includes(targetError));
          },
          ...(configService.get('REDIS_TLS') === 'false' ? {} : { tls: {} }),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: "/bull-board",
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_NAME_PROVIDE_TO_DHT,
      adapter: BullMQAdapter,
    }),
  ],
})
export class BullmqModule {}
