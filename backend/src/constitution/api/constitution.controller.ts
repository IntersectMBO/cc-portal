import { Controller, Get, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstitutionResponse } from './response/constitution.response';
import { ConstitutionFacade } from '../facade/constitution.facade';
import { CreateConstitutionRequest } from './request/create-constitution.request';
import { Change } from 'diff';
import { CompareConstitutionsRequest } from './request/compare-constitution.request';

@ApiTags('Constitution')
@Controller('constitution')
export class ConstitutionController {
  constructor(private readonly constitutionFacade: ConstitutionFacade) {}

  @ApiOperation({ summary: 'Get constitution file' })
  @ApiResponse({
    status: 200,
    type: ConstitutionResponse,
  })
  @ApiResponse({ status: 404, description: 'Constitution not found' })
  @Get()
  async getConstitutionFile(): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.getCurrentConstitutionFile();
  }

  @ApiOperation({ summary: 'Store constitution file' })
  @ApiBody({ type: CreateConstitutionRequest })
  @ApiResponse({
    status: 200,
    description: 'Constitution file stored successfully.',
    type: ConstitutionResponse,
  })
  async storeConstitutionFile(
    @Body() createConstitutionRequest: CreateConstitutionRequest,
  ): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.storeConstitutionFile(
      createConstitutionRequest,
    );
  }
  @Get('diff-versions')
  @ApiOperation({
    summary: 'Compare two constitution versions in a git diff fashion',
  })
  @ApiResponse({ status: 200 })
  compareTwoConstitutionVersions(
    @Body()
    compareConstitutionsRequest: CompareConstitutionsRequest,
  ): Change[] {
    return this.constitutionFacade.compareTwoConstitutionVersions(
      compareConstitutionsRequest,
    );
  }
}
