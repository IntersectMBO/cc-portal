
import { IpfsDto } from '../dto/ipfs.dto.js';

export class IpfsMapper {

  static ipfsToIpfsDto(cid?: string, content?: string): IpfsDto {
    const ipfsDto = new IpfsDto();
    if(cid) ipfsDto.cid = cid;
    if(content) ipfsDto.content = content;
    return ipfsDto;
  }
}