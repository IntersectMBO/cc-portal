import { IpfsMetadataDto } from './ipfs-metadata.dto';

/**
 * This DTO contains all IpfsMetadata + Contents that is being stored within IPFS
 * Therefore be mindful where this DTO is being passed as it is heavy
 */
export class IpfsContentDto extends IpfsMetadataDto {
  contents?: string;
}
