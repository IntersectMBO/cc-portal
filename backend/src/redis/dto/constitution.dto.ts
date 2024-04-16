export class ConstitutionDto {
  version: string;
  cid: string;
  content: string;

  constructor(version: string, cid: string, content: string) {
    this.cid = cid;
    this.content = content;
  }
}
