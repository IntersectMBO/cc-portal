import { Injectable } from '@nestjs/common';
import { ConstitutionRedisService } from 'src/redis/service/constitution-redis.service';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { ConstitutionMapper } from '../mapper/constitution.mapper';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { Change, diffLines } from 'diff';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';

@Injectable()
export class ConstitutionFacade {
  constructor(
    private readonly constitutionRedisService: ConstitutionRedisService,
  ) {}

  async getCurrentConstitutionFile(): Promise<ConstitutionResponse> {
    let constitutionDto =
      await this.constitutionRedisService.getConstitutionFile();
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
  compareTwoConstitutionVersions(
    request: CompareConstitutionsRequest,
  ): Change[] {
    const compareConstitutionDto =
      ConstitutionMapper.compareConstitutionsRequestToDto(request);
    return diffLines(
      compareConstitutionDto.olderVersion,
      compareConstitutionDto.currentVersion,
      { newlineIsToken: true },
    );
  }
}
