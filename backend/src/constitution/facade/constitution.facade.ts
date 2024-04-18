import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConstitutionRedisService } from 'src/redis/service/constitution-redis.service';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { ConstitutionMapper } from '../mapper/constitution.mapper';
import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
import { ConstitutionService } from '../services/constitution.service';
import { CompareConstitutionsDto } from '../dto/compare-constitutions.dto';
import { ConstitutionDiffDto } from 'src/redis/dto/constitution-diff.dto';
import { ConstitutionDiffResponse } from '../api/response/constitution-diff.response';
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

  async compareTwoConstitutionVersions(
    request: CompareConstitutionsRequest,
  ): Promise<ConstitutionDiffResponse> {
    const compareConstitutionDto =
      ConstitutionMapper.compareConstitutionsRequestToDto(request);

    const constitutionDiffDto =
      await this.constitutionRedisService.getConstitutionDiff(
        request.base,
        request.target,
      );

    if (constitutionDiffDto) {
      return ConstitutionMapper.constitutionDiffDtoToResponse(
        constitutionDiffDto,
      );
    }
    const diffDto = await this.createDiff(compareConstitutionDto);
    await this.constitutionRedisService.saveConstitutionDiff(diffDto);

    return ConstitutionMapper.constitutionDiffDtoToResponse(diffDto);
  }

  private async createDiff(
    compareDto: CompareConstitutionsDto,
  ): Promise<ConstitutionDiffDto> {
    try {
      const currentFile = await this.getConstitutionFileByCid(compareDto.base);
      const oldFile = await this.getConstitutionFileByCid(compareDto.target);

      const diffChange = this.constitutionService.diffConstitutions(
        currentFile.contents,
        oldFile.contents,
      );
      const diffString = JSON.stringify(diffChange);

      return new ConstitutionDiffDto(
        compareDto.base,
        compareDto.target,
        diffString,
      );
    } catch (error) {
      this.logger.error(
        `An error occurred while fetching file contents:, ${error}`,
      );
      throw new InternalServerErrorException('Failed to generate diff');
    }
  }

  async getAllConstitutionMetadata(): Promise<ConstitutionMetadataResponse[]> {
    const constitutionMetadataArray = await this.ipfsService.findAllMetadata();

    return constitutionMetadataArray.map((metadataDto) =>
      ConstitutionMapper.ipfsMetadataDtoToConstitutionResponse(metadataDto),
    );
  }
}
