import { Injectable } from '@nestjs/common';
import { IpfsService } from '../services/ipfs.service';
import { IpfsMapper } from '../mapper/ipfs.mapper';
import { UploadResponse } from '../api/response/upload.response';
import { DocResponse } from '../api/response/doc.response';

@Injectable()
export class IpfsFacade {
  constructor(private readonly ipfsService: IpfsService) {}

  async getHelia() {
    return this.ipfsService.getHelia();
  }

  async addDoc(file: Express.Multer.File): Promise<UploadResponse> {
    const cid = await this.ipfsService.addDoc(file);
    return IpfsMapper.ipfsDtoToUploadResponse(cid);
  }

  async findDoc(cid: string): Promise<DocResponse> {
    const content = await this.ipfsService.findDoc(cid);
    return IpfsMapper.ipfsDtoToDocResponse(content);
  }
}
