import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAME_VOTES_TABLE_SYNC } from '../../common/constants';

@QueueEventsListener(QUEUE_NAME_VOTES_TABLE_SYNC)
export class VotesTableSyncListener extends QueueEventsHost {
  private readonly logger = new Logger(VotesTableSyncListener.name);

  @OnQueueEvent('active')
  onActive(args: { jobId: string; prev?: string }, id: string) {
    this.logger.log(
      `Active event on ${QUEUE_NAME_VOTES_TABLE_SYNC} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }
  @OnQueueEvent('completed')
  onCompleted(args: { jobId: string; returnValue: string }, id: string) {
    this.logger.debug(
      `Completed event on ${QUEUE_NAME_VOTES_TABLE_SYNC} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }

  @OnQueueEvent('stalled')
  onStalled(args: { jobId: string; prev?: string }, id: string) {
    this.logger.debug(
      `Stalled event on ${QUEUE_NAME_VOTES_TABLE_SYNC} with id: ${id} and args: ${JSON.stringify(args)}`,
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
    this.logger.error(
      `Failed event on ${QUEUE_NAME_VOTES_TABLE_SYNC} with id: ${id} and args: ${JSON.stringify(args)}`,
    );
  }
}
