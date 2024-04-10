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

  static docContentToIpfsDto(content: string): IpfsDto {
    const ipfsDto = new IpfsDto();
    ipfsDto.content = content;
    return ipfsDto;
  }

  static ipfsDtoToDocResponse(ipfsDto: IpfsDto): DocResponse {
    const docResponse = new DocResponse();
    docResponse.content = ipfsDto.content;
    return docResponse;
  }

  static ipfsDtoToUploadResponse(ipfsDto: IpfsDto): UploadResponse {
    const uploadResponse = new UploadResponse();
    uploadResponse.cid = ipfsDto.cid;
    return uploadResponse;
  }
}
