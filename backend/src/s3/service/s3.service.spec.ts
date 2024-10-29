import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';
import { UploadContext } from '../enums/upload-context';
import { ConflictException } from '@nestjs/common';

const mockBucket = {
  'profile-photo-test-object-1.txt': 'Test content 1',
  'profile-photo-test-object-2.txt': 'Test content 2',
  'profile-photo-test-object-3.txt': 'Test content 3',
};

const mockConfigService = {
  get: jest.fn().mockImplementation((variable) => {
    if (variable === 'MINIO_BUCKET') {
      return 'cc-portal';
    }
    if (variable === 'S3_BASE_URL') {
      return 'https://cc-portal.s3.amazonaws.com';
    }
  }),
};

const mockMinioClient = {
  putObject: jest
    .fn()
    .mockImplementation((bucketName, objectName, buffer, size) => {
      if (Object.keys(mockBucket).includes(objectName)) {
        return Promise.reject(
          new ConflictException('Object with the same name already exists'),
        );
      }
      mockBucket[objectName] = buffer.toString('utf-8');
      return Promise.resolve({ bucketName, objectName, buffer, size });
    }),
  presignedUrl: jest
    .fn()
    .mockImplementation((method, bucketName, objectName) => {
      return Promise.resolve(
        `https://${bucketName}.s3.amazonaws.com/${objectName}`,
      );
    }),
  removeObject: jest.fn().mockImplementation((bucketName, objectName) => {
    if (mockBucket[objectName]) {
      delete mockBucket[objectName];
      return Promise.resolve({ bucketName, objectName });
    } else {
      return Promise.reject(new Error('Object not found.'));
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
          useValue: mockMinioClient,
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

  describe('uploadFile', () => {
    it('should upload file', async () => {
      const context: UploadContext = UploadContext.PROFILE_PHOTO;
      const fileName = 'test-upload.txt';
      const file = {
        buffer: Buffer.from('test file content'),
        size: 100,
      } as Express.Multer.File;

      const result = await service.uploadFile(context, fileName, file);

      expect(result).toBe(
        'https://cc-portal.s3.amazonaws.com/cc-portal/profile-photo-test-upload.txt',
      );
      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        'cc-portal',
        'profile-photo-test-upload.txt',
        expect.any(Buffer),
        100,
        { 'Content-Type': undefined },
      );
    });

    it('should throw error when uploading file with existing name', async () => {
      const context: UploadContext = UploadContext.PROFILE_PHOTO;
      const fileName = 'test-object-1.txt';
      const file = {
        buffer: Buffer.from('test file content'),
        size: 100,
      } as Express.Multer.File;

      await expect(service.uploadFile(context, fileName, file)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete existing file', async () => {
      const fileName = 'profile-photo-test-object-1.txt';

      await service.deleteFile(fileName);

      expect(mockMinioClient.removeObject).toHaveBeenCalledWith(
        'cc-portal',
        'profile-photo-test-object-1.txt',
      );
    });

    it('should throw error when deleting non-existing file', async () => {
      const nonExistingFileName = 'non-existing-file.txt';

      await expect(service.deleteFile(nonExistingFileName)).rejects.toThrow(
        'Object not found.',
      );
    });
  });

  describe('extractFileNameFromUrl', () => {
    it('should extract file name from URL', () => {
      const url = 'https://example.com/path/to/file.txt?query=123';
      const fileName = S3Service.extractFileNameFromUrl(url);
      expect(fileName).toBe('file.txt');
    });

    it('should handle URLs without query parameters', () => {
      const url = 'https://example.com/path/to/anotherfile.pdf';
      const fileName = S3Service.extractFileNameFromUrl(url);
      //console.log(fileName);

      expect(fileName).toBe('anotherfile.pdf');
    });

    it('should handle URLs with special characters in file name', () => {
      const url =
        'https://example.com/path/to/фајл%20са%20специјалним%20именом.jpg';
      const fileName = S3Service.extractFileNameFromUrl(url);
      //console.log(fileName);

      expect(fileName).toBe('фајл са специјалним именом.jpg');
    });
  });
});
