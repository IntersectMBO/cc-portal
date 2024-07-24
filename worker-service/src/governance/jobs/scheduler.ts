import { SchedulerRegistry } from '@nestjs/schedule';
import { IJob } from './i-job';
import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class Scheduler {
  private readonly logger = new Logger(Scheduler.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  registerJob(job: IJob) {
    const jobName = job.getJobName();
    const interval = job.getInterval();

    const cronJob = new CronJob(interval, async () => {
      try {
        this.logger.log(`Executing job ${jobName}`);

        job.execute();
      } catch (error) {
        this.logger.error(
          `Error executing job ${jobName}: ${error.message}`,
          error.stack,
        );
      }
    });

    this.schedulerRegistry.addCronJob(jobName, cronJob);
    cronJob.start();
    this.logger.log(
      `Registered and started job '${jobName}' with frequency '${interval}'`,
    );
  }
}
