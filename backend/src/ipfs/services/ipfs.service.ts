import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IpfsMetadata } from '../entities/ipfs-metadata.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { IpfsMapper } from '../mapper/ipfs.mapper';
import { IpfsMetadataDto } from '../dto/ipfs-metadata.dto';
import axios from 'axios';
import { Blob } from 'buffer';
import * as blake from 'blakejs';

@Injectable()
export class IpfsService {
  private logger = new Logger(IpfsService.name);
  private FILE_TITLE = 'Revision';

  constructor(
    @InjectRepository(IpfsMetadata)
    private readonly ipfsMetadataRepository: Repository<IpfsMetadata>,
    private readonly configService: ConfigService,
  ) {}

  async addFileToIpfsService(
    file: Express.Multer.File,
  ): Promise<IpfsMetadataDto> {
    const contentType = file.mimetype;
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
      const blake2b = await this.generateBlake2bHash(content);
      const title = await this.generateTitle();
      const newVersion = Math.floor(Date.now() / 1000).toString(); // timestamp
      const insertData: IpfsMetadataDto = {
        cid: cid,
        blake2b: blake2b,
        title: title,
        contentType: contentType,
        content: content,
        version: newVersion,
      };
      const result = await this.insertCid(insertData);
      return IpfsMapper.ipfsEntityToDto(result);
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error when add file to the IPSF service: ` + error);
    }
  }

  private async insertCid(ipfsDto: IpfsMetadataDto): Promise<IpfsMetadata> {
    const existing = await this.findByCid(ipfsDto.cid);
    if (existing) {
      throw new ConflictException(`Document already uploaded`);
    }
    const created = this.ipfsMetadataRepository.create(ipfsDto);
    return await this.ipfsMetadataRepository.save(created);
  }

  private async generateBlake2bHash(data: string): Promise<string> {
    const dataBytes = Buffer.from(data);
    const hashBytes = blake.blake2b(dataBytes, null, 32); // 32-byte output
    const hashHex = Buffer.from(hashBytes).toString('hex');
    return hashHex;
  }

  private async generateTitle(): Promise<string> {
    const countFiles = await this.ipfsMetadataRepository.count();
    const revisionNumber = countFiles + 1;
    const title = this.FILE_TITLE + ' ' + revisionNumber;
    return title.toString();
  }

  async findLastRecord(): Promise<IpfsMetadataDto> {
    const lastRecord = await this.ipfsMetadataRepository.findOne({
      where: { cid: Not(IsNull()) },
      order: { createdAt: 'DESC' },
    });
    return IpfsMapper.ipfsEntityToDto(lastRecord);
  }

  private async findByCid(cid: string): Promise<IpfsMetadata> {
    const existingDoc = await this.ipfsMetadataRepository.findOne({
      where: { cid: cid },
    });
    return existingDoc;
  }

  async getFileFromIpfsService(cid: string): Promise<IpfsMetadataDto> {
    const apiLink =
      this.configService.getOrThrow('IPFS_SERVICE_URL') + '/ipfs/' + cid;
    try {
      const response = await axios.get(apiLink);
      if (response.status == 404) {
        throw new NotFoundException(`Document with cid: ${cid} not found`);
      }
      return IpfsMapper.ipfsServiceDtoToIpfsMetadataDto(response.data);
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Error when get file from IPFS service: ` + error);
    }
  }

  async getAllFiles(): Promise<IpfsMetadataDto[]> {
    const allFiles = await this.ipfsMetadataRepository.find();
    const results: IpfsMetadataDto[] = allFiles.map((x) =>
      IpfsMapper.ipfsEntityToDto(x),
    );
    return results;
  }
}
