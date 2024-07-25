import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { UploadContext } from '../enums/upload-context';
@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private bucketName: string;

  constructor(
    private configService: ConfigService,
    @Inject('S3Client') private readonly client: Minio.Client,
  ) {
    this.bucketName = this.configService.get('MINIO_BUCKET');
  }

  async uploadFile(
    context: UploadContext,
    fileName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const bufferArray = Object.values(file.buffer);
    const buffer = Buffer.from(bufferArray);

    const fullName = this.getFullFileName(context, fileName);
    await this.client.putObject(this.bucketName, fullName, buffer, file.size);

    const fileUrl = await this.getFileUrl(context, fileName);
    return fileUrl;
  }

  private async getFileUrl(
    context: UploadContext,
    fileName: string,
  ): Promise<string> {
    const fullName = this.getFullFileName(context, fileName);
    return await this.client.presignedUrl('GET', this.bucketName, fullName);
  }

  async deleteFile(fileName: string) {
    await this.client.removeObject(this.bucketName, fileName);
  }

  private getFullFileName(context: UploadContext, fileName: string): string {
    return `${context}-${fileName}`;
  }

  static extractFileNameFromUrl(url) {
    const parts = url.split('/');
    const fileNameWithQueryParams = parts[parts.length - 1];
    const fileName = decodeURIComponent(fileNameWithQueryParams.split('?')[0]);
    return fileName;
  }
}
