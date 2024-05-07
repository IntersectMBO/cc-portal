import { Injectable, Logger } from '@nestjs/common';
import { ConstitutionRedisService } from 'src/redis/service/constitution-redis.service';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { ConstitutionMapper } from '../mapper/constitution.mapper';
import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { ConstitutionService } from '../services/constitution.service';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { ConstitutionMetadataResponse } from '../api/response/constitution-metadata.response';

@Injectable()
export class ConstitutionFacade {
  private logger = new Logger(ConstitutionFacade.name);

  constructor(
    private readonly constitutionRedisService: ConstitutionRedisService,
    private readonly constitutionService: ConstitutionService,
    private readonly ipfsService: IpfsService,
  ) {}

  async storeConstitutionFile(
    file: Express.Multer.File,
  ): Promise<ConstitutionResponse> {
    const constitutionDto = await this.addConstitutionToIpfs(file);
    await this.constitutionRedisService.saveConstitutionFile(constitutionDto);

    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  private async addConstitutionToIpfs(
    file: Express.Multer.File,
  ): Promise<ConstitutionDto> {
    const ipfsContentDto = await this.ipfsService.addToIpfs(file);
    return ConstitutionMapper.ipfsContentDtoToConstitution(ipfsContentDto);
  }

  async getConstitutionFileCurrent(): Promise<ConstitutionResponse> {
    const currentConstitutionMetadata =
      await this.ipfsService.findCurrentMetadata();

    return await this.getConstitutionFileByCid(currentConstitutionMetadata.cid);
  }

  async getConstitutionFileByCid(cid: string): Promise<ConstitutionResponse> {
    let constitutionDto =
      await this.constitutionRedisService.getConstitutionFileByCid(cid);
    if (constitutionDto) {
      return ConstitutionMapper.dtoToResponse(constitutionDto);
    }
    constitutionDto = await this.getConstitutionFromIpfs(cid);
    await this.constitutionRedisService.saveConstitutionFile(constitutionDto);
    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  private async getConstitutionFromIpfs(cid: string): Promise<ConstitutionDto> {
    const ipfsContentDto = await this.ipfsService.getFromIpfs(cid);
    return ConstitutionMapper.ipfsContentDtoToConstitution(ipfsContentDto);
  }

  async getAllConstitutionMetadata(): Promise<ConstitutionMetadataResponse[]> {
    const constitutionMetadataArray = await this.ipfsService.findAllMetadata();

    return constitutionMetadataArray.map((metadataDto) =>
      ConstitutionMapper.ipfsMetadataDtoToConstitutionResponse(metadataDto),
    );
  }
}
