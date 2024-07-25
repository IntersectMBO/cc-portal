import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { IpfsMetadataDto } from 'src/ipfs/dto/ipfs-metadata.dto';
import { ConstitutionMetadataResponse } from '../api/response/constitution-metadata.response';
import { IPFS_PUBLIC_URL } from 'src/common/constants/ipfs.constants';

export class ConstitutionMapper {
  static dtoToResponse(dto: ConstitutionDto): ConstitutionResponse {
    const response = new ConstitutionResponse();
    response.cid = dto.cid;
    response.blake2b = dto.blake2b;
    response.url = IPFS_PUBLIC_URL + dto.cid;
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
    constitutionResponse.blake2b = ipfsMetadataDto.blake2b;
    constitutionResponse.url = IPFS_PUBLIC_URL + ipfsMetadataDto.cid;
    constitutionResponse.title = ipfsMetadataDto.title;
    constitutionResponse.version = ipfsMetadataDto.version;
    constitutionResponse.createdDate = ipfsMetadataDto.createdDate;

    return constitutionResponse;
  }
}
