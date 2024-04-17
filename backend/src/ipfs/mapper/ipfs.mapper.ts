import { IpfsMetadataDto } from '../dto/ipfs-metadata.dto';
import { IpfsMetadata } from '../entities/ipfs-metadata.entity';

export class IpfsMapper {
  // static ipfsCidDto(ipfs: IpfsMetada): IpfsMetadataDto {
  //   const ipfsMetadataDto = new IpfsMetadataDto();
  //   ipfsMetadataDto.cid = ipfs.cid;
  //   return ipfsMetadataDto;
  // }

  static ipfsEntityToDto(ipfsEntity: IpfsMetadata): IpfsMetadataDto {
    const ipfsMetadataDto = new IpfsMetadataDto();
    ipfsMetadataDto.cid = ipfsEntity.cid;
    ipfsMetadataDto.blake2b = ipfsEntity.blake2b;
    ipfsMetadataDto.title = ipfsEntity.title;
    ipfsMetadataDto.content = ipfsEntity.content;
    ipfsMetadataDto.version = ipfsEntity.version;
    return ipfsMetadataDto;
  }

  static ipfsServiceDtoToIpfsMetadataDto(ipfsServiceDto: any): IpfsMetadataDto {
    const ipfsMetadataDto = new IpfsMetadataDto();
    ipfsMetadataDto.cid = ipfsServiceDto.cid;
    ipfsMetadataDto.content = ipfsServiceDto.content;
    return ipfsMetadataDto;
  }
}
