import { Controller, Get, Body, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstitutionResponse } from './response/constitution.response';
import { ConstitutionFacade } from '../facade/constitution.facade';
import { CreateConstitutionRequest } from './request/create-constitution.request';
import { CompareConstitutionsRequest } from './request/compare-constitution.request';
import { ConstitutionDiffResponse } from './response/constitution-diff.response';

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
    return await this.constitutionFacade.getConstitutionFileCurrent();
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
  async compareTwoConstitutionVersions(
    @Query('base') base: string,
    @Query('target') target: string,
  ): Promise<ConstitutionDiffResponse> {
    const compareConstitutionRequest = new CompareConstitutionsRequest();

    compareConstitutionRequest.base = base;
    compareConstitutionRequest.target = target;
    return this.constitutionFacade.compareTwoConstitutionVersions(
      compareConstitutionRequest,
    );
  }
}
