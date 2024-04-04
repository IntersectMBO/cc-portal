export class EmailDto {
  to: string;
  subject: string;
  template?: string;
  context?: object;
}
