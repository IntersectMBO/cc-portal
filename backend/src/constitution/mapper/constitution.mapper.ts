import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
// import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
// import { CompareConstitutionsDto } from '../dto/compare-constitutions.dto';
// import { ConstitutionDiffDto } from 'src/redis/dto/constitution-diff.dto';
// import { ConstitutionDiffResponse } from '../api/response/constitution-diff.response';
import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { IpfsMetadataDto } from 'src/ipfs/dto/ipfs-metadata.dto';
import { ConstitutionMetadataResponse } from '../api/response/constitution-metadata.response';

export class ConstitutionMapper {
  static dtoToResponse(dto: ConstitutionDto): ConstitutionResponse {
    const response = new ConstitutionResponse();
    response.cid = dto.cid;
    response.version = dto.version;
    response.contents = dto.contents;
    return response;
  }

  static createConstitutionRequestToDto(
    request: CreateConstitutionRequest,
  ): CreateConstitutionDto {
    const dto = new CreateConstitutionDto(request.contents);
    return dto;
  }

  //Currently, the diff will be rendered by frontend, that's why this code is commented

  // static compareConstitutionsRequestToDto(
  //   request: CompareConstitutionsRequest,
  // ): CompareConstitutionsDto {
  //   const dto = new CompareConstitutionsDto(request.base, request.target);
  //   return dto;
  // }

  // static constitutionDiffDtoToResponse(
  //   dto: ConstitutionDiffDto,
  // ): ConstitutionDiffResponse {
  //   const response = new ConstitutionDiffResponse();
  //   response.diff = dto.diff;

  //   return response;
  // }

  static ipfsContentDtoToConstitution(
    ipfsContentDto: IpfsContentDto,
  ): ConstitutionDto {
    return new ConstitutionDto(
      ipfsContentDto.cid,
      ipfsContentDto.version,
      ipfsContentDto.blake2b,
      ipfsContentDto.contents,
    );
  }
  static ipfsMetadataDtoToConstitutionResponse(
    ipfsMetadataDto: IpfsMetadataDto,
  ): ConstitutionMetadataResponse {
    const constitutionResponse = new ConstitutionMetadataResponse();
    constitutionResponse.cid = ipfsMetadataDto.cid;
    constitutionResponse.title = ipfsMetadataDto.title;
    constitutionResponse.version = ipfsMetadataDto.version;
    constitutionResponse.createdDate = ipfsMetadataDto.createdDate;

    return constitutionResponse;
  }
}
