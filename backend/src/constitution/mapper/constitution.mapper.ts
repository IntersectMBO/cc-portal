import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
import { CompareConstitutionsDto } from '../dto/compare-constitutions.dto';

export class ConstitutionMapper {
  static dtoToResponse(dto: ConstitutionDto): ConstitutionResponse {
    const response = new ConstitutionResponse();
    response.cid = dto.cid;
    response.contents = dto.content;
    return response;
  }

  static createConstitutionRequestToDto(
    request: CreateConstitutionRequest,
  ): CreateConstitutionDto {
    const dto = new CreateConstitutionDto(request.contents);
    return dto;
  }
  static compareConstitutionsRequestToDto(
    request: CompareConstitutionsRequest,
  ): CompareConstitutionsDto {
    const dto = new CompareConstitutionsDto(
      request.currentVersionCID,
      request.oldVersionCID,
    );
    return dto;
  }
}
