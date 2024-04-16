import { ConstitutionDto } from 'src/redis/dto/constitution.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { CreateConstitutionRequest } from '../api/request/create-constitution.request';
import { CreateConstitutionDto } from '../dto/create-constitution.dto';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
import { CompareConstitutionsDto } from '../dto/compare-constitutions.dto';
import { ConstitutionDiffDto } from 'src/redis/dto/constitution-diff.dto';
import { ConstitutionDiffResponse } from '../api/response/constitution-diff.response';

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
    const dto = new CompareConstitutionsDto(request.base, request.target);
    return dto;
  }

  static constitutionDiffDtoToResponse(
    dto: ConstitutionDiffDto,
  ): ConstitutionDiffResponse {
    const response = new ConstitutionDiffResponse();
    response.base = dto.base;
    response.target = dto.target;
    response.diff = dto.diff;

    return response;
  }
}
