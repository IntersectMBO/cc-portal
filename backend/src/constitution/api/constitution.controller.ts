import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Post,
  Param,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConstitutionResponse } from './response/constitution.response';
import { ConstitutionFacade } from '../facade/constitution.facade';
import { Permissions } from 'src/auth/guard/permission.decorator';
import { PermissionEnum } from 'src/users/enums/permission.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConstitutionMetadataResponse } from './response/constitution-metadata.response';
import { getFileValidator } from '../pipe/fileValidatorPipe';

@ApiTags('Constitution')
@Controller('constitution')
export class ConstitutionController {
  constructor(private readonly constitutionFacade: ConstitutionFacade) {}

  @ApiOperation({ summary: 'Get current constitution file' })
  @ApiResponse({
    status: 200,
    description: 'Current constitution file',
    type: ConstitutionResponse,
  })
  @ApiResponse({ status: 404, description: 'Constitution not found' })
  @Get('current')
  async getCurrentConstitution(): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.getConstitutionFileCurrent();
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
  @Get('cid/:cid')
  async getSpecificConstitution(
    @Param('cid') cid: string,
  ): Promise<ConstitutionResponse> {
    return await this.constitutionFacade.getConstitutionFileByCid(cid);
  }

  @ApiOperation({ summary: 'Store constitution file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'file' },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Constitution file stored successfully.',
    type: ConstitutionResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource"',
  })
  @ApiResponse({
    status: 409,
    description: 'File is already uploaded',
  })
  @ApiResponse({
    status: 422,
    description: 'File is required',
  })
  @Permissions(PermissionEnum.ADD_CONSTITUTION)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async storeConstitutionFile(
    @UploadedFile(
      getFileValidator(),
      new ParseFilePipeBuilder()
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

  @Get()
  @ApiOperation({
    summary: 'Get metadata for all stored constitutions',
  })
  @ApiResponse({
    status: 200,
    isArray: true,
    description: 'Returns a list of all stored constitution metadata',
    type: ConstitutionMetadataResponse,
  })
  async getAllConstitutionMetadata(): Promise<ConstitutionMetadataResponse[]> {
    return this.constitutionFacade.getAllConstitutionMetadata();
  }
}
