import { IsString } from 'class-validator';

export class CompareConstitutionsRequest {
  @IsString()
  olderVersion: string;
  @IsString()
  currentVersion: string;
}
