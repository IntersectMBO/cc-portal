import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { DB_SYNC_VOTES_TABLE_QUEUE } from '../common/constants.js';
import { Logger } from '@nestjs/common';

@QueueEventsListener(DB_SYNC_VOTES_TABLE_QUEUE)
export class VoteEventListener extends QueueEventsHost {
  private readonly logger = new Logger(VoteEventListener.name);

  @OnQueueEvent('active')
  onActive(args: { jobId: string; prev?: string }, id: string) {
    this.logger.debug(
      `Active event on ${DB_SYNC_VOTES_TABLE_QUEUE} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }
  @OnQueueEvent('completed')
  onCompleted(args: { jobId: string; returnValue: string }, id: string) {
    this.logger.log(
      `Completed event on ${DB_SYNC_VOTES_TABLE_QUEUE} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }

  @OnQueueEvent('stalled')
  onStalled(args: { jobId: string; prev?: string }, id: string) {
    this.logger.debug(
      `Stalled event on ${DB_SYNC_VOTES_TABLE_QUEUE} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }

  @OnQueueEvent('failed')
  onFailed(
    args: {
      jobId: string;
      failedReason: string;
      prev?: string;
    },
    id: string,
  ) {
    console.log(
      `Failed event on ${DB_SYNC_VOTES_TABLE_QUEUE} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }
}
