import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  CONNECTION_NAME_DB_SYNC,
  JOB_NAME_FILTER_VOTE_DATA,
  JOB_NAME_QWERTY,
  JOB_NAME_VOTE_SYNC,
  QUEUE_NAME_VOTES_TABLE_SYNC,
} from '../../common/constants';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Processor(QUEUE_NAME_VOTES_TABLE_SYNC)
export class VotesTableSyncConsumer extends WorkerHost {
  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    private readonly dataSource: DataSource,
  ) {
    super();
  }
  private readonly logger = new Logger(VotesTableSyncConsumer.name);

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case JOB_NAME_VOTE_SYNC:
        {
          this.logger.debug('Parent job is getting executed');
          const qwe = await job.getChildrenValues();
          console.log(this.logger.verbose(qwe));
        }
        break;
      case JOB_NAME_FILTER_VOTE_DATA:
        {
          this.logger.debug('Second child job is getting executed');
          return job.data;
        }
        break;
      case JOB_NAME_QWERTY:
        {
          this.logger.debug('First child job is getting executed');
          return job.data;
        }
        break;
    }
  }

  private async executeSqlFile(): Promise<void> {
    const filePath = path.join(__dirname, '../sql', 'moj-get-votes-test.sql');
    const sql = fs.readFileSync(filePath, 'utf-8');
    const result = await this.dataSource.query(sql);
    return result;
  }
}
