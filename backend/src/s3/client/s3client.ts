import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

const configService = new ConfigService();
export const s3ClientFactory: FactoryProvider<Minio.Client> = {
  provide: 'S3Client',
  useFactory: async () => {
    const s3Client = new Minio.Client({
      endPoint: configService.get('MINIO_ENDPOINT'),
      port: Number(configService.get('MINIO_PORT')),
      useSSL: configService.get('MINIO_USE_SSL') === 'true',
      accessKey: configService.get('MINIO_ACCESS_KEY'),
      secretKey: configService.get('MINIO_SECRET_KEY'),
      ...(configService.get('ENVIRONMENT') !== 'dev'
        ? { region: configService.get('MINIO_REGION', 'us-east-1') }
        : {}),
    });

    const bucketName = configService.get('MINIO_BUCKET');
    const bucketExists = await s3Client.bucketExists(bucketName);
    if (!bucketExists) {
      await s3Client.makeBucket(bucketName, 'eu-west-1');
    }

    return s3Client;
  },
  inject: [],
};
