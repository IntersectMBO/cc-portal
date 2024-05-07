import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

class MockMinioClient {
  async putObject(): Promise<any> {
    return Promise.resolve({});
  }

  async getObject(): Promise<any> {
    return Promise.resolve({});
  }
}

const mockConfigService = {
  get: jest.fn().mockImplementation((minioBucked) => {
    if (minioBucked === 'MINIO_BUCKET') {
      return 'cc-portal';
    }
  }),
};

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'S3Client',
          useClass: MockMinioClient,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
