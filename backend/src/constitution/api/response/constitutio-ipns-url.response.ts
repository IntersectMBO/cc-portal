import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ConstitutionIpnsUrlResponse {
  @ApiProperty({
    description: 'IPNS URL related to a deployed Constitution',
    example:
      'https://ipfs.io/ipns/QmVcVq1zssBLdcuw8nM19VYiLWjt9cMQSUrHSwVd5oY4s2',
  })
  @Expose({ name: 'ipns_url' })
  ipnsUrl: string;
}
