import { Inject, Injectable, Logger } from '@nestjs/common';
/*import {} from //S3Client,
PutObjectCommand,
PutObjectCommandInput,
PutObjectCommandOutput,
'@aws-sdk/client-s3';
*/
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
  //if we migrate to aws
  /*
  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const bucket = this.configService.get<string>('aws_bucket');
    const bufferArray = Object.values(file.buffer);
    const buffer = Buffer.from(bufferArray);
    const input: PutObjectCommandInput = {
      Body: buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new Error('Image not saved in s3!');
    } catch (err) {
      this.logger.error('Cannot save file to s3,', err);
      throw err;
    }
  }
  */
}
