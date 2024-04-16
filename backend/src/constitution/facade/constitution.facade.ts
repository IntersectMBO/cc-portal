import { Injectable } from '@nestjs/common';
import { ConstitutionRedisService } from 'src/redis/service/constitution-redis.service';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { ConstitutionMapper } from '../mapper/constitution.mapper';
import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { IpfsService } from 'src/ipfs/services/ipfs.service';

@Injectable()
export class ConstitutionFacade {
  constructor(
    private readonly constitutionRedisService: ConstitutionRedisService,
    private readonly ipfsService: IpfsService,
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

  async getConstitutionByCid(cid: string): Promise<ConstitutionResponse> {
    const ipfsDto = await this.ipfsService.getDocFromIpfsService(cid);
    const constitutionDto = new ConstitutionDto(
      ipfsDto.version,
      ipfsDto.cid,
      ipfsDto.content,
    );
    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  private async retrieveFromIpfsService(): Promise<ConstitutionDto> {
    const ipfsDto = await this.ipfsService.findLastRecord();
    return new ConstitutionDto(ipfsDto.version, ipfsDto.cid, ipfsDto.content);
  }

  async storeConstitutionFile(
    file: Express.Multer.File,
  ): Promise<ConstitutionResponse> {
    const constitutionDto = await this.storeIntoIpfs(file);
    await this.constitutionRedisService.saveConstitutionFile(constitutionDto);

    return ConstitutionMapper.dtoToResponse(constitutionDto);
  }

  private async storeIntoIpfs(
    file: Express.Multer.File,
  ): Promise<ConstitutionDto> {
    const ipfsDto = await this.ipfsService.addDocToIpfsService(file);
    const constitutionDto = new ConstitutionDto(
      ipfsDto.version,
      ipfsDto.cid,
      ipfsDto.content,
    );
    return constitutionDto;
  }
}
