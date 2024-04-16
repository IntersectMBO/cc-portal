import { DocResponse } from '../api/response/doc.response';
import { UploadResponse } from '../api/response/upload.response';
import { IpfsDto } from '../dto/ipfs.dto';
import { Ipfs } from '../entities/ipfs.entity';

export class IpfsMapper {
  static ipfsCidToIpfsDto(ipfs: Ipfs): IpfsDto {
    const ipfsDto = new IpfsDto();
    ipfsDto.cid = ipfs.cid;
    return ipfsDto;
  }

  static ipfsEntityToIpfsDto(ipfsEntity: Ipfs): IpfsDto {
    const ipfsDto = new IpfsDto();
    ipfsDto.cid = ipfsEntity.cid;
    ipfsDto.content = ipfsEntity.content;
    ipfsDto.version = ipfsEntity.version;
    return ipfsDto;
  }

  static ipfsServiceDtoToIpfsDto(ipfsServiceDto: any): IpfsDto {
    const ipfsDto = new IpfsDto();
    ipfsDto.cid = ipfsServiceDto.cid;
    ipfsDto.content = ipfsServiceDto.content;
    return ipfsDto;
  }

  static ipfsDtoToDocResponse(ipfsDto: IpfsDto): DocResponse {
    const docResponse = new DocResponse();
    docResponse.cid = ipfsDto.cid;
    docResponse.content = ipfsDto.content;
    docResponse.version = ipfsDto.version;
    return docResponse;
  }

  static ipfsDtoToUploadResponse(ipfsDto: IpfsDto): UploadResponse {
    const uploadResponse = new UploadResponse();
    uploadResponse.cid = ipfsDto.cid;
    return uploadResponse;
  }
}
