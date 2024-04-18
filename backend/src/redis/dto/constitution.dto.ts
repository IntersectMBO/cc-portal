export class ConstitutionDto {
  cid: string;
  version: string;
  blake2b: string;
  contents: string;

  constructor(cid: string, version: string, blake2b: string, contents: string) {
    this.cid = cid;
    this.version = version;
    this.blake2b = blake2b;
    this.contents = contents;
  }
}
