import { IsOptional } from 'class-validator';
// import { CID } from 'multiformats/cid';

export class HeliaDto {
  @IsOptional()
  fileContent: string;

  // @IsOptional()
  // cid: CID;
}
