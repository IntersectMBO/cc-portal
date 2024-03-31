import { IsOptional } from 'class-validator';
import { CID } from 'multiformats/dist/src/basics';

export class HeliaDto {
  @IsOptional()
  fileContent: string;

  @IsOptional()
  cid: CID;
}
