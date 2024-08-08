import { Test, TestingModule } from '@nestjs/testing';
import { IpfsService } from './ipfs.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IpfsMetadata } from '../entities/ipfs-metadata.entity';
import { IpfsContentDto } from '../dto/ipfs-content.dto';
import axios from 'axios';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IpfsMapper } from '../mapper/ipfs.mapper';
import { IpfsMetadataDto } from '../dto/ipfs-metadata.dto';
import { format } from 'date-fns';

describe('IpfsService', () => {
  let service: IpfsService;

  const mockFile = {
    fieldname: 'file',
    originalname: 'test.md',
    encoding: '7bit',
    mimetype: 'text/markdown',
    buffer: Buffer.from('one,two,three'),
  } as Express.Multer.File;

  const mockIpfsMetadata = {
    id: 'id-1',
    cid: 'bafkreia7jwjhpugfruuzj4i24vxkj4zeonhutkr6pwhvoiemehq3dvoua4',
    blake2b: 'e7d344de8ba91c84f90b05afa82aaa94fae39aa56dee147318a095dec08fa39e',
    title: 'Revision 1',
    contentType: 'text/markdown',
    version: '1714056415',
    createdAt: '2024-04-22 11:21:59.334',
    updatedAt: '2024-04-22 11:21:59.334',
  };

  const mockIpfsMetadataDto: IpfsMetadataDto = {
    cid: 'bafkreia7jwjhpugfruuzj4i24vxkj4zeonhutkr6pwhvoiemehq3dvoua4',
    blake2b: 'e7d344de8ba91c84f90b05afa82aaa94fae39aa56dee147318a095dec08fa39e',
    title: 'Revision 1',
    contentType: 'text/markdown',
    version: '1714056415',
    createdDate: format(mockIpfsMetadata.createdAt.toString(), 'dd.MM.yyyy'),
  };

  const mockIpfsContentDto: IpfsContentDto = {
    cid: 'bafkreia7jwjhpugfruuzj4i24vxkj4zeonhutkr6pwhvoiemehq3dvoua4',
    blake2b: 'e7d344de8ba91c84f90b05afa82aaa94fae39aa56dee147318a095dec08fa39e',
    title: 'Revision 1',
    contentType: 'text/markdown',
    contents:
      'The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community.',
    version: '1714056415',
    createdDate: format(mockIpfsMetadata.createdAt.toString(), 'dd.MM.yyyy'),
  };

  const mockIpfsJsonResponse = {
    cid: 'bafkreia7jwjhpugfruuzj4i24vxkj4zeonhutkr6pwhvoiemehq3dvoua4',
    url: 'https://ipfs.io/ipfs/bafkreia7jwjhpugfruuzj4i24vxkj4zeonhutkr6pwhvoiemehq3dvoua4',
    contents: 'Test content',
    blake2b: 'd3720cb57039221dd82204a482aec252dc9eb895d38a5a937bfb2a03aa0824ca',
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockImplementation((url) => {
      if (url === 'IPFS_SERVICE_URL') {
        return 'http://localhost:3001';
      }
    }),
  };

  const mockIpfsMetadataRepository = {
    save: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockJson = {
    govActionProposalHash: '14f114e22702213ba6421f80ad30b0c026fd58d27aa5e86326',
    title: 'Test title',
    content: 'Test content',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IpfsService,
        {
          provide: getRepositoryToken(IpfsMetadata),
          useValue: mockIpfsMetadataRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<IpfsService>(IpfsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Add file to IPFS', () => {
    it('should add a file to IPFS', async () => {
      const mockSendFileToIpfsService = jest
        .spyOn<any, any>(service, 'sendFileToIpfsService')
        .mockResolvedValueOnce(mockIpfsContentDto);

      const result = await service.addToIpfs(mockFile);

      expect(mockSendFileToIpfsService).toHaveBeenCalled();
      expect(result).toEqual(mockIpfsContentDto);
    });

    it('should throw an error when trying to add file to IPFS', async () => {
      const mockEmptyFile = {
        fieldname: 'file',
        originalname: 'constitution_001.txt.md',
        encoding: '7bit',
        mimetype: 'text/markdown',
        buffer: Buffer.from([]),
        // File size is zero
        size: 0,
      } as Express.Multer.File;
      const mockSendFileToIpfsService = jest
        .spyOn<any, any>(service, 'sendFileToIpfsService')
        .mockResolvedValueOnce(mockIpfsContentDto);

      try {
        await service.addToIpfs(mockEmptyFile);
      } catch (err) {
        expect(mockSendFileToIpfsService).toHaveBeenCalledWith(mockEmptyFile);
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe(`Error when add file to the IPFS service`);
      }
    });
  });

  describe('Get file from IPFS', () => {
    it('should return file from IPFS', async () => {
      const cid = mockIpfsContentDto.cid;
      // Mock the axios.get method
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: mockIpfsContentDto,
        status: 200,
      });

      const mockFindMetadataByCid = jest
        .spyOn<any, any>(service, 'findMetadataByCid')
        .mockResolvedValueOnce(mockIpfsMetadata);

      const result = await service.getFromIpfs(cid);

      expect(result).toEqual(
        IpfsMapper.ipfsDataAndMetadataToContentDto(result, mockIpfsMetadata),
      );
      expect(mockFindMetadataByCid).toHaveBeenCalledWith(cid);
    });

    it('should throw an error when getting file from IPFS', async () => {
      const cid = '';
      jest
        .spyOn<any, any>(service, 'findMetadataByCid')
        .mockResolvedValueOnce(() => undefined);

      // Mock the axios.get method
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: null,
      });

      try {
        await service.getFromIpfs(cid);
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('Get current verison', () => {
    it('should return the current version of the file from IPFS', async () => {
      jest
        .spyOn(mockIpfsMetadataRepository, 'findOne')
        .mockResolvedValue(mockIpfsMetadata);

      const result = await service.findCurrentMetadata();

      expect(result).toMatchObject(mockIpfsMetadataDto);
      expect(mockIpfsMetadataRepository.findOne).toHaveBeenCalled();
    });

    it('should return 404 when finding the current version of the file from IPFS', async () => {
      jest.spyOn(mockIpfsMetadataRepository, 'findOne').mockResolvedValue(null);
      try {
        await service.findCurrentMetadata();
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.status).toBe(404);
        expect(err.message).toBe('Constitution not found');
      }
    });
  });

  describe('Get all files from IPFS', () => {
    it('should return all files from IPFS', async () => {
      jest
        .spyOn(mockIpfsMetadataRepository, 'find')
        .mockResolvedValue([mockIpfsMetadata]);
      const result = await service.findAllMetadata();

      expect(result).toEqual([mockIpfsMetadataDto]);
    });
    it('should return an empty array of files from IPFS', async () => {
      jest.spyOn(mockIpfsMetadataRepository, 'find').mockResolvedValue([]);
      const result = await service.findAllMetadata();

      expect(result).toEqual([]);
    });
  });

  describe('Add JSON to IPFS', () => {
    it('should add JSON to IPFS', async () => {
      const mockSendRationaleToIpfsService = jest
        .spyOn<any, any>(service, 'sendRationaleToIpfs')
        .mockResolvedValueOnce(mockIpfsJsonResponse);

      const result = await service.addRationaleToIpfs(mockJson);

      expect(mockSendRationaleToIpfsService).toHaveBeenCalled();
      expect(result).toEqual(mockIpfsJsonResponse);
    });

    it('should throw an error when trying to add JSON to IPFS', async () => {
      const mockEmptyJson = {};
      const mockSendRationaleToIpfsService = jest
        .spyOn<any, any>(service, 'sendRationaleToIpfs')
        .mockResolvedValueOnce(mockIpfsJsonResponse);

      try {
        await service.addRationaleToIpfs(mockEmptyJson);
      } catch (err) {
        expect(mockSendRationaleToIpfsService).toHaveBeenCalledWith(
          mockEmptyJson,
        );
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.message).toBe(
          `Error when add rationale to the IPFS service`,
        );
      }
    });
  });
});
