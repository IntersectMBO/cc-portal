import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private region: string;
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.region = configService.get<string>('aws_region') || 'eu-central-1';
    const access_key = configService.get<string>('aws_access_key');
    const secret_key = configService.get<string>('aws_secret_access_key');
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        secretAccessKey: secret_key,
        accessKeyId: access_key,
      },
    });
  }
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
}
