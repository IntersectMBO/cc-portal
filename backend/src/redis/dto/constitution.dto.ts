export class ConstitutionDto {
  cid: string;
  content: string;

  constructor(cid: string, content: string) {
    this.cid = cid;
    this.content = content;
  }
}
