import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsFacade } from '../facade/ipfs.facade';
import { UploadResponse } from './response/upload.response';
import { DocResponse } from './response/doc.response';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Permissions } from 'src/auth/guard/permission.decorator';
import { PermissionEnum } from 'src/users/enums/permission.enum';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guard/permission.guard';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsFacade: IpfsFacade) {}

  @ApiOperation({ summary: 'Upload CC document' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Document uploaded successfully.',
    type: UploadResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'Document already uploaded',
  })
  @Permissions(PermissionEnum.ADD_CONSTITUTION)
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('to-ipfs')
  async addDocToIpfs(
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
  ): Promise<UploadResponse> {
    return await this.ipfsFacade.addDocToIpfsService(file);
  }

  @ApiOperation({ summary: 'Find document by cid' })
  @ApiResponse({
    status: 200,
    description: 'The user details',
    type: DocResponse,
  })
  @ApiResponse({ status: 404, description: 'User with {id} not found' })
  @Get('from-ipfs/:cid')
  async getDocFromIpfs(@Param('cid') cid: string): Promise<DocResponse> {
    return await this.ipfsFacade.getDocFromIpfs(cid);
  }
}
