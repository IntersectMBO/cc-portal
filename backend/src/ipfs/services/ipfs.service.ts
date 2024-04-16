import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ipfs } from '../entities/ipfs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpfsMapper } from '../mapper/ipfs.mapper';
import { IpfsDto } from '../dto/ipfs.dto';
import axios from 'axios';
import { Blob } from 'buffer';

@Injectable()
export class IpfsService {
  private logger = new Logger(IpfsService.name);

  private readonly MARKDOWN_CONTENT_TYPE = 'text/markdown';

  constructor(
    @InjectRepository(Ipfs)
    private readonly ipfsRepository: Repository<Ipfs>,
    private readonly configService: ConfigService,
  ) {}

  async addDocToIpfsService(file: Express.Multer.File): Promise<IpfsDto> {
    const contentType = file.mimetype;
    if (contentType != this.MARKDOWN_CONTENT_TYPE) {
      throw new ConflictException(`Content-type must be text/markdown`);
    }
    const fileObj = Object.values(file.buffer);
    const fileBuffer = Buffer.from(fileObj);
    const blob = new Blob([fileBuffer]);
    const formData = new FormData();
    formData.append('file', blob, file.originalname);

    const apiLink = this.configService.getOrThrow('IPFS_SERVICE_URL') + '/ipfs';
    const requestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    try {
      const response = await axios.post(apiLink, formData, requestConfig);
      const cid = response.data.cid;
      const content = response.data.content;
      const lastInsertedDoc = await this.findLastRecord();
      let newVersion = '1.0.0'; //default
      if (lastInsertedDoc) {
        newVersion = await this.generateNewVersion();
      }
      const insertData: IpfsDto = {
        cid: cid,
        contentType: contentType,
        content: content,
        version: newVersion,
      };
      const result = await this.insertCid(insertData);
      return IpfsMapper.ipfsCidToIpfsDto(result);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async insertCid(ipfsDto: IpfsDto): Promise<Ipfs> {
    const existing = await this.findByCid(ipfsDto.cid);
    if (existing) {
      throw new ConflictException(`Document already uploaded`);
    }
    const created = this.ipfsRepository.create(ipfsDto);
    return await this.ipfsRepository.save(created);
  }

  private async findLastRecord(): Promise<Ipfs> {
    const lastRecord = await this.ipfsRepository.find({
      order: { createdAt: 'DESC' },
    });
    return lastRecord[0];
  }

  private async generateNewVersion(): Promise<string> {
    const lastRecord = await this.findLastRecord();
    const lastVersionSplited = lastRecord.version.split('.');
    const newPatch = Number(lastVersionSplited[2]) + 1;
    const newVersion =
      lastVersionSplited[0] + '.' + lastVersionSplited[1] + '.' + newPatch;
    return newVersion.toString();
  }

  private async findByCid(cid: string): Promise<Ipfs> {
    const existingDoc = await this.ipfsRepository.findOne({
      where: { cid: cid },
    });
    return existingDoc;
  }

  async getDocFromIpfsService(cid: string): Promise<IpfsDto> {
    const apiLink =
      this.configService.getOrThrow('IPFS_SERVICE_URL') + '/ipfs/' + cid;
    try {
      const response = await axios.get(apiLink);
      if (!response.data) {
        throw new NotFoundException(`Document with cid: ${cid} not found`);
      }
      return IpfsMapper.ipfsServiceDtoToIpfsDto(response.data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
