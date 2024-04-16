import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Post,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConstitutionResponse } from './response/constitution.response';
import { ConstitutionFacade } from '../facade/constitution.facade';
import { CreateConstitutionRequest } from './request/create-constitution.request';
import { Permissions } from 'src/auth/guard/permission.decorator';
import { PermissionEnum } from 'src/users/enums/permission.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Contitution')
@Controller('constitution')
export class ConstitutionController {
  constructor(private readonly constitutionFacade: ConstitutionFacade) {}

  @ApiOperation({ summary: 'Get constitution file' })
  @ApiResponse({
    status: 200,
    description: 'Current constitution file',
    type: ConstitutionResponse,
  })
  @ApiResponse({ status: 404, description: 'Constitution not found' })
  @Get()
  async getConstitutionFile(): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.getCurrentConstitutionFile();
  }

  @ApiOperation({ summary: 'Find constitution file by cid' })
  @ApiResponse({
    status: 200,
    description: 'Constitution file by cid',
    type: ConstitutionResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Constitution file with {cid} not found',
  })
  @Get(':cid')
  async getDocFromIpfs(
    @Param('cid') cid: string,
  ): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.getConstitutionByCid(cid);
  }

  @ApiOperation({ summary: 'Store constitution file' })
  @ApiBody({ type: CreateConstitutionRequest })
  @ApiResponse({
    status: 200,
    description: 'Constitution file stored succesfully.',
    type: ConstitutionResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'File is already uploaded',
  })
  @Permissions(PermissionEnum.ADD_CONSTITUTION)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('to-ipfs')
  async storeConstitutionFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'text/markdown',
        })
        .addMaxSizeValidator({
          maxSize: 5242880, // 5MB
        })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.storeConstitutionFile(file);
  }
}
