import { Injectable, Logger } from '@nestjs/common';
/*import {} from //S3Client,
PutObjectCommand,
PutObjectCommandInput,
PutObjectCommandOutput,
'@aws-sdk/client-s3';
*/
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET');
  }
  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }
  async uploadFileMinio(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const bufferArray = Object.values(file.buffer);
    const buffer = Buffer.from(bufferArray);
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      buffer,
      file.size,
    );
    return fileName;
  }

  async getFileUrl(fileName: string): Promise<string> {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName);
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
