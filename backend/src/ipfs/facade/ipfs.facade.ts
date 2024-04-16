import { Injectable } from '@nestjs/common';
import { IpfsService } from '../services/ipfs.service';
import { IpfsMapper } from '../mapper/ipfs.mapper';
import { UploadResponse } from '../api/response/upload.response';
import { DocResponse } from '../api/response/doc.response';

@Injectable()
export class IpfsFacade {
  constructor(private readonly ipfsService: IpfsService) {}

  async addDocToIpfsService(
    file: Express.Multer.File,
  ): Promise<UploadResponse> {
    const cid = await this.ipfsService.addDocToIpfsService(file);
    return IpfsMapper.ipfsDtoToUploadResponse(cid);
  }

  async getDocFromIpfs(cid: string): Promise<DocResponse> {
    const content = await this.ipfsService.getDocFromIpfsService(cid);
    return IpfsMapper.ipfsDtoToDocResponse(content);
  }
}
