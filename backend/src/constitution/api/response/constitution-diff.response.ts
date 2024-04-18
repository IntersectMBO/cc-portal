import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

//TODO See if we need to return contents here, is diff only enough? - Maybe FE could fetch constitutions through another API prior to calling Diff API
export class ConstitutionDiffResponse {
  // @ApiProperty({
  //   description: 'Current constitution version file content',
  //   example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  // })
  // @Expose({ name: 'base' })
  // base: string;

  // @ApiProperty({
  //   description: 'Old constitution version file content',
  //   example: 'Lorem ipsum consectetur elit',
  // })
  // @Expose({ name: 'target' })
  // target: string;

  @ApiProperty({ description: 'Contents of a diff' })
  @Expose({ name: 'diff' })
  diff: string;
}
