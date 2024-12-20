export interface IJob {
  getJobName(): string;
  getInterval(): string;
  execute(): void;
}
