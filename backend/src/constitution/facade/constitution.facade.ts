import { Injectable } from '@nestjs/common';
import { ConstitutionRedisService } from 'src/redis/service/constitution-redis.service';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { ConstitutionMapper } from '../mapper/constitution.mapper';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { Change } from 'diff';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
import { ConstitutionService } from '../services/constitution.service';
import { IpfsUploadService } from '../../ipfs-upload/services/ipfs-upload.service';

@Injectable()
export class ConstitutionFacade {
  constructor(
    private readonly constitutionRedisService: ConstitutionRedisService,
    private readonly constitutionService: ConstitutionService,
    private readonly ipfsUploadService: IpfsUploadService,
  ) {}

  async getCurrentConstitutionFile(): Promise<ConstitutionResponse> {
    let constitutionDto =
      await this.constitutionRedisService.getConstitutionFileCurrent();
    if (constitutionDto) {
      return ConstitutionMapper.dtoToResponse(constitutionDto);
    }
    constitutionDto = await this.retrieveFromIpfsService();
    await this.constitutionRedisService.saveConstitutionFile(constitutionDto);
    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  //TODO Import Ipfs Service and replace this
  private retrieveFromIpfsService():
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
  // TODO Inject constitution versions from Redis into "request" param and invoke findByCID from ipfs-service (microservice)
  async compareTwoConstitutionVersions(
    request: CompareConstitutionsRequest,
  ): Promise<Change[]> {
    const compareConstitutionDto =
      ConstitutionMapper.compareConstitutionsRequestToDto(request);

    for (const cid of Object.values(compareConstitutionDto)) {
      await this.ipfsUploadService.findByCID(cid);
    }
    try {
      const currentConstitutionVersionFile =
        await this.ipfsUploadService.getFileContentsFromCID(
          compareConstitutionDto.currentVersionCID,
        );
      const oldConstitutionVersionFile =
        await this.ipfsUploadService.getFileContentsFromCID(
          compareConstitutionDto.oldVersionCID,
        );
      return this.constitutionService.diffConstitutions(
        currentConstitutionVersionFile,
        oldConstitutionVersionFile,
      );
    } catch (error) {
      console.error('An error occurred while fetching file contents:', error);
    }
  }
}
