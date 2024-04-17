import { IpfsContentDto } from '../dto/ipfs-content.dto';
import { IpfsMetadataDto } from '../dto/ipfs-metadata.dto';
import { IpfsMetadata } from '../entities/ipfs-metadata.entity';

export class IpfsMapper {
  static ipfsMetadataToDto(ipfsEntity: IpfsMetadata): IpfsMetadataDto {
    const ipfsMetadataDto = new IpfsMetadataDto();
    ipfsMetadataDto.blake2b = ipfsEntity.blake2b;
    ipfsMetadataDto.contentType = ipfsEntity.contentType;
    ipfsMetadataDto.cid = ipfsEntity.cid;
    ipfsMetadataDto.title = ipfsEntity.title;
    ipfsMetadataDto.version = ipfsEntity.version;
    return ipfsMetadataDto;
  }

  static ipfsServiceDtoToIpfsContentDto(ipfsServiceDto: any): IpfsMetadataDto {
    const ipfsMetadataDto = new IpfsContentDto();
    ipfsMetadataDto.cid = ipfsServiceDto.cid;
    ipfsMetadataDto.contents = ipfsServiceDto.content;
    return ipfsMetadataDto;
  }

  static ipfsContentToMetadata(ipfsContent: IpfsContentDto): IpfsMetadata {
    const ipfsMetadata = new IpfsMetadata();
    ipfsMetadata.cid = ipfsContent.cid;
    ipfsMetadata.blake2b = ipfsContent.blake2b;
    ipfsMetadata.title = ipfsContent.title;
    ipfsMetadata.contentType = ipfsContent.contentType;
    ipfsMetadata.content = ipfsContent.contents;
    ipfsMetadata.version = ipfsContent.version;

    return ipfsMetadata;
  }

  static ipfsDataAndMetadataToContentDto(
    ipfsData: any,
    ipfsMetadata: IpfsMetadataDto,
  ): IpfsContentDto {
    const contentDto = new IpfsContentDto();
    contentDto.cid = ipfsMetadata.cid;
    contentDto.title = ipfsMetadata.title;
    contentDto.version = ipfsMetadata.version;
    contentDto.contentType = ipfsMetadata.contentType;
    contentDto.blake2b = ipfsMetadata.blake2b;

    contentDto.contents = ipfsData.content;

    return contentDto;
  }
}
