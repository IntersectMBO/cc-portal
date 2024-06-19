import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
import { IpfsContentDto } from '../dto/ipfs-content.dto';

@Injectable()
export class IpfsService {
  private logger = new Logger(IpfsService.name);
  private FILE_TITLE = 'Revision';

  constructor(
    @InjectRepository(IpfsMetadata)
    private readonly ipfsMetadataRepository: Repository<IpfsMetadata>,
    private readonly configService: ConfigService,
  ) {}

  async addToIpfs(file: Express.Multer.File): Promise<IpfsContentDto> {
    let ipfsContent: IpfsContentDto;
    try {
      ipfsContent = await this.sendFileToIpfsService(file);
    } catch (error) {
      this.logger.error(`Error when adding to IPFS: ${error}`);
      throw new InternalServerErrorException(
        `Error when add file to the IPFS service`,
      );
    }
    const metadata = IpfsMapper.ipfsContentToMetadata(ipfsContent);
    await this.saveMetadata(metadata);
    return ipfsContent;
  }

  private async sendFileToIpfsService(
    file: Express.Multer.File,
  ): Promise<IpfsContentDto> {
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
    const response = await axios.post(apiLink, formData, requestConfig);
    const cid = response.data.cid;
    const content = response.data.content;
    const blake2b = await this.generateBlake2bHash(content);
    const title = await this.generateTitle();
    const newVersion = Math.floor(Date.now() / 1000).toString(); // timestamp
    return {
      cid: cid,
      blake2b: blake2b,
      title: title,
      contentType: contentType,
      contents: content,
      version: newVersion,
    };
  }

  private async saveMetadata(metadata: IpfsMetadata): Promise<IpfsMetadata> {
    const existing = await this.findMetadataByCid(metadata.cid);
    if (existing) {
      throw new ConflictException(`Document already uploaded`);
    }
    return await this.ipfsMetadataRepository.save(metadata);
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

  async getFromIpfs(cid: string): Promise<IpfsContentDto> {
    const apiLink =
      this.configService.getOrThrow('IPFS_SERVICE_URL') + '/ipfs/' + cid;
    try {
      const response = await axios.get(apiLink);
      if (response.status == 404) {
        throw new NotFoundException(`Document with cid: ${cid} not found`);
      }
      const ipfsData = response.data;
      const ipfsMetadata = await this.findMetadataByCid(cid);
      return IpfsMapper.ipfsDataAndMetadataToContentDto(ipfsData, ipfsMetadata);
    } catch (error) {
      this.logger.error(`Error when getting data from IPFS: ${error}`);
      throw new InternalServerErrorException(
        `Error when getting file from IPFS service`,
      );
    }
  }

  private async findMetadataByCid(cid: string): Promise<IpfsMetadata> {
    const existingDoc = await this.ipfsMetadataRepository.findOne({
      where: { cid: cid },
    });
    return existingDoc;
  }

  async findCurrentMetadata(): Promise<IpfsMetadataDto> {
    const lastRecord = await this.ipfsMetadataRepository.findOne({
      where: { cid: Not(IsNull()) },
      order: { createdAt: 'DESC' },
    });
    if (!lastRecord) {
      throw new NotFoundException('Constitution not found');
    }
    return IpfsMapper.ipfsMetadataToDto(lastRecord);
  }

  async findAllMetadata(): Promise<IpfsMetadataDto[]> {
    const allFiles = await this.ipfsMetadataRepository.find();
    const results: IpfsMetadataDto[] = allFiles.map((x) =>
      IpfsMapper.ipfsMetadataToDto(x),
    );
    return results;
  }

  async addReasoningToIpfs(reasoningJson: any): Promise<IpfsContentDto> {
    let ipfsContentDto: IpfsContentDto;
    try {
      ipfsContentDto = await this.sendReasoningToIpfs(reasoningJson);
    } catch (error) {
      this.logger.error(`Error when adding to IPFS: ${error}`);
      throw new InternalServerErrorException(
        `Error when add reasoning to the IPFS service`,
      );
    }
    // const reasoning = IpfsMapper.ipfsContentToReasoning(ipfsContentDto);
    // await this.saveReasoning(reasoning);
    return ipfsContentDto;
  }

  async sendReasoningToIpfs(reasoningJson: any): Promise<IpfsContentDto> {
    const apiLink =
      this.configService.getOrThrow('IPFS_SERVICE_URL') + '/ipfs/reasoning';
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(apiLink, reasoningJson, requestConfig);
    const cid = response.data.cid;
    const url = response.data.url;
    const content = response.data.content;
    const blake2b = await this.generateBlake2bHash(content);
    return {
      cid: cid,
      url: url,
      blake2b: blake2b,
      contents: content,
    };
  }
}
