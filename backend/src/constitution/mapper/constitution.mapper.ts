import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';

export class ConstitutionMapper {
  static dtoToResponse(dto: ConstitutionDto): ConstitutionResponse {
    const response = new ConstitutionResponse();
    response.cid = dto.cid;
    response.version = dto.version;
    response.contents = dto.content;
    return response;
  }

  static createConstitutionRequestToDto(
    request: CreateConstitutionRequest,
  ): CreateConstitutionDto {
    const dto = new CreateConstitutionDto(request.contents);
    return dto;
  }
}
