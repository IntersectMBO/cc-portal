import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConstitutionRedisService } from 'src/redis/service/constitution-redis.service';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { ConstitutionMapper } from '../mapper/constitution.mapper';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
import { ConstitutionService } from '../services/constitution.service';
import { IpfsUploadService } from '../../ipfs-upload/services/ipfs-upload.service';
import { CompareConstitutionsDto } from '../dto/compare-constitutions.dto';
import { ConstitutionDiffDto } from 'src/redis/dto/constitution-diff.dto';
import { ConstitutionDiffResponse } from '../api/response/constitution-diff.response';

@Injectable()
export class ConstitutionFacade {
  private logger = new Logger(ConstitutionFacade.name);

  constructor(
    private readonly constitutionRedisService: ConstitutionRedisService,
    private readonly constitutionService: ConstitutionService,
    private readonly ipfsUploadService: IpfsUploadService,
  ) {}

  async getConstitutionFileCurrent(): Promise<ConstitutionResponse> {
    let constitutionDto =
      await this.constitutionRedisService.getConstitutionFileCurrent();
    if (constitutionDto) {
      return ConstitutionMapper.dtoToResponse(constitutionDto);
    }
    constitutionDto = await this.retrieveFromIpfsService(constitutionDto.cid);
    await this.constitutionRedisService.saveConstitutionFile(constitutionDto);
    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  async getConstitutionFileByCid(cid: string): Promise<ConstitutionResponse> {
    let constitutionDto =
      await this.constitutionRedisService.getConstitutionFileByCid(cid);
    if (constitutionDto) {
      return ConstitutionMapper.dtoToResponse(constitutionDto);
    }
    constitutionDto = await this.retrieveFromIpfsService(cid);
    await this.constitutionRedisService.saveConstitutionFile(
      constitutionDto,
      false,
    );
    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  //TODO Import Ipfs Service and replace this
  private retrieveFromIpfsService(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cid: string,
  ):
    | import('src/redis/dto/constitution.dto').ConstitutionDto
    | PromiseLike<import('src/redis/dto/constitution.dto').ConstitutionDto> {
    throw new Error('Function not implemented.');
  }

  async storeConstitutionFile(
    request: CreateConstitutionRequest,
  ): Promise<ConstitutionResponse> {
    const constitutionDto = await this.storeIntoIpfs(
      ConstitutionMapper.createConstitutionRequestToDto(request),
    );
    await this.constitutionRedisService.saveConstitutionFile(constitutionDto);

    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  //TODO Import Ipfs Service and replace this
  private async storeIntoIpfs(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dto: CreateConstitutionDto,
  ): Promise<ConstitutionDto> {
    throw new Error('Function not implemented.');
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
        currentFile.cid,
        oldFile.cid,
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
}
