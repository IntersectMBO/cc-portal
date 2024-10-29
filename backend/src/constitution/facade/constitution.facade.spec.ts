import { Test, TestingModule } from '@nestjs/testing';
import { ConstitutionFacade } from './constitution.facade';
import { ConstitutionService } from '../services/constitution.service';
import { ConstitutionRedisService } from '../../redis/service/constitution-redis.service';
import { IpfsService } from '../../ipfs/services/ipfs.service';
import { ConstitutionDto } from '../../redis/dto/constitution.dto';
import { IpfsContentDto } from '../../ipfs/dto/ipfs-content.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IpfsMetadataDto } from '../../ipfs/dto/ipfs-metadata.dto';
import { ConstitutionMetadataResponse } from '../api/response/constitution-metadata.response';

describe('ConstitutionFacade', () => {
  let facade: ConstitutionFacade;

  const mockBadFormatCid = '123';
  const mockNonExistentValidCid =
    'bafkreif5qv3lf2qpisr2mad3t33eunm76slligitgr333uwfjw2c5leefi';

  const mockFile = {
    fieldname: 'file',
    originalname: 'constitution_001.txt.md',
    encoding: '7bit',
    mimetype: 'text/markdown',
    buffer: Buffer.from('one,two,three'),
  } as Express.Multer.File;

  const mockFirstConstitutionDto: ConstitutionDto = {
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    contents:
      'The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n',
  };

  const mockFirstIpfsContentDto: IpfsContentDto = {
    title: 'Revision 1',
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    createdDate: '2024-04-21 11:21:59.334',
    contentType: 'text/markdown',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    contents:
      'The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n',
  };

  const mockFirstIpfsMetadataDto: IpfsMetadataDto = {
    title: 'Revision 1',
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    createdDate: '2024-04-21 11:21:59.334',
    contentType: 'text/markdown',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
  };

  const mockFirstConstitutionMetadataResponse: ConstitutionMetadataResponse = {
    title: 'Revision 1',
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    url: 'https://ipfs.io/ipfs/bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    createdDate: '2024-04-21 11:21:59.334',
  };

  const mockFirstConstitutionResponse: ConstitutionResponse = {
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    url: 'https://ipfs.io/ipfs/bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    contents:
      'The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n',
  };

  const mockSecondIpfsContentDto: IpfsContentDto = {
    title: 'Revision 2',
    cid: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    version: '1713769479',
    createdDate: '2024-04-22 11:21:59.334',
    contentType: 'text/markdown',
    blake2b: '58cafedf496cf846268a681a797c8d0a2d324cb4344120132ff72cefc9ff0d1c',
    contents:
      'The morning sunlight cast a golden glow over the peaceful village, adorning the cobblestone streets with warmth. Birds chirped melodiously, contributing to the tranquil atmosphere that enveloped the tiny community. Life unfolded at a leisurely pace here, far from the hustle and bustle of city life. Residents greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tightly knit fabric of camaraderie.\n',
  };

  const mockSecondIpfsMetadataDto: IpfsMetadataDto = {
    title: 'Revision 2',
    cid: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    version: '1713769479',
    createdDate: '2024-04-22 11:21:59.334',
    contentType: 'text/markdown',
    blake2b: '58cafedf496cf846268a681a797c8d0a2d324cb4344120132ff72cefc9ff0d1c',
  };

  const mockSecondConstitutionMetadataResponse: ConstitutionMetadataResponse = {
    title: 'Revision 2',
    cid: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    url: 'https://ipfs.io/ipfs/bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    version: '1713769479',
    createdDate: '2024-04-22 11:21:59.334',
  };

  const mockConstitutionMetadataResponseArray: ConstitutionMetadataResponse[] =
    [
      mockFirstConstitutionMetadataResponse,
      mockSecondConstitutionMetadataResponse,
    ];

  const mockConstitutionService = {
    diffConstitutions: jest.fn(),
  };

  const mockConstitutionRedisService = {
    saveConstitutionFile: jest.fn(async () => {
      return mockFirstConstitutionDto;
    }),
    getConstitutionFileByCid: jest.fn(async (cid: string) => {
      if (cid === mockFirstConstitutionDto.cid) {
        return mockFirstConstitutionDto;
      }
      return null;
    }),
  };
  const mockIpfsService = {
    addToIpfs: jest.fn(async (file: Express.Multer.File) => {
      if (file.size === 0) {
        throw new InternalServerErrorException(
          `Error when add file to the IPFS service`,
        );
      }
      return null;
    }),
    getFromIpfs: jest.fn(async (cid: string) => {
      if (cid === mockFirstIpfsMetadataDto.cid) {
        return mockFirstIpfsContentDto;
      }
      if (cid === mockSecondIpfsMetadataDto.cid) {
        return mockSecondIpfsContentDto;
      }
      if (cid === mockBadFormatCid || cid.includes(' ') || cid.includes('')) {
        throw new InternalServerErrorException(
          'Error when getting file from IPFS service',
        );
      }
      if (
        cid != mockFirstIpfsMetadataDto.cid &&
        cid != mockSecondIpfsMetadataDto.cid
      ) {
        throw new NotFoundException(`Document with cid: ${cid} not found`);
      }
      return null;
    }),
    findCurrentMetadata: jest.fn(async () => {
      return mockFirstIpfsMetadataDto;
    }),
    findAllMetadata: jest.fn(async () => {
      return mockConstitutionMetadataResponseArray;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConstitutionFacade,
        { provide: ConstitutionService, useValue: mockConstitutionService },
        {
          provide: ConstitutionRedisService,
          useValue: mockConstitutionRedisService,
        },
        { provide: IpfsService, useValue: mockIpfsService },
      ],
    }).compile();

    facade = module.get<ConstitutionFacade>(ConstitutionFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('storeConstitutionFile', () => {
    it('should store uploaded constitution file to IPFS and in Redis', async () => {
      // Mock addToIpfs to return mockIpfsContentDto variable after being invoked with mockFile variable
      mockIpfsService.addToIpfs.mockResolvedValue(mockFirstIpfsContentDto);

      const result = await facade.storeConstitutionFile(mockFile);

      expect(mockIpfsService.addToIpfs).toHaveBeenCalledWith(mockFile);
      expect(
        mockConstitutionRedisService.saveConstitutionFile,
      ).toHaveBeenCalledWith(mockFirstConstitutionDto);
      expect(result.cid).toBe(mockFirstConstitutionResponse.cid);
      expect(result.contents).toBe(mockFirstConstitutionResponse.contents);
      expect(result.version).toBe(mockFirstConstitutionResponse.version);
    });

    it('should throw an error when trying to upload an empty constitution file to IPFS', async () => {
      const mockEmptyFile = {
        fieldname: 'file',
        originalname: 'constitution_001.txt.md',
        encoding: '7bit',
        mimetype: 'text/markdown',
        buffer: Buffer.from([]),
        // File size is zero
        size: 0,
      } as Express.Multer.File;

      try {
        await facade.storeConstitutionFile(mockEmptyFile);
      } catch (e) {
        expect(mockIpfsService.addToIpfs).toHaveBeenCalledWith(mockEmptyFile);
        // File size is zero, therefore, InternalServerErrorException is thrown
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe(`Error when add file to the IPFS service`);
      }
    });
  });
  describe('getConstitutionFileCurrent', () => {
    it('should return current version of constitution from Redis', async () => {
      const result = await facade.getConstitutionFileCurrent();

      expect(
        mockConstitutionRedisService.getConstitutionFileByCid,
      ).toHaveBeenCalledWith(mockFirstIpfsMetadataDto.cid);
      expect(result.cid).toBe(mockFirstConstitutionResponse.cid);
      expect(result.contents).toBe(mockFirstConstitutionResponse.contents);
      expect(result.version).toBe(mockFirstConstitutionResponse.version);
    });
    it('should return current version of constitution from IPFS if it is not found in Redis', async () => {
      // Mocked to undefined in order to search constitution file on IPFS
      mockConstitutionRedisService.getConstitutionFileByCid.mockImplementation(
        undefined,
      );

      const result = await facade.getConstitutionFileCurrent();

      expect(
        mockConstitutionRedisService.getConstitutionFileByCid,
      ).toHaveReturnedWith(undefined);
      expect(mockIpfsService.getFromIpfs).toHaveBeenCalledWith(
        mockFirstIpfsContentDto.cid,
      );
      expect(
        mockConstitutionRedisService.saveConstitutionFile,
      ).toHaveBeenCalled();
      expect(result.cid).toBe(mockFirstConstitutionResponse.cid);
      expect(result.contents).toBe(mockFirstConstitutionResponse.contents);
      expect(result.version).toBe(mockFirstConstitutionResponse.version);
    });
    it('should throw an error if current version of constitution is not found on IPFS and in Redis', async () => {
      // Mocked to undefined so that the constitution file cannot be found on IPFS or in Redis
      mockIpfsService.findCurrentMetadata.mockImplementationOnce(
        () => undefined,
      );

      try {
        await facade.getConstitutionFileCurrent();
      } catch (e) {
        expect(mockIpfsService.findCurrentMetadata).toHaveBeenCalled();
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(
          `Cannot read properties of undefined (reading 'cid')`,
        );
      }
    });
  });
  describe('getConstitutionFileByCid', () => {
    it('should return constitution version based on its CID value from Redis', async () => {
      const result = await facade.getConstitutionFileByCid(
        mockFirstIpfsMetadataDto.cid,
      );

      expect(
        mockConstitutionRedisService.getConstitutionFileByCid,
      ).toHaveBeenCalledWith(mockFirstIpfsMetadataDto.cid);
      expect(result.cid).toBe(mockFirstConstitutionResponse.cid);
      expect(result.contents).toBe(mockFirstConstitutionResponse.contents);
      expect(result.version).toBe(mockFirstConstitutionResponse.version);
    });
    it('should return constitution version based on its CID value from IPFS in case that version is not in Redis', async () => {
      // Mocked to undefined in order to search constitution file on IPFS
      mockConstitutionRedisService.getConstitutionFileByCid.mockImplementationOnce(
        () => undefined,
      );

      mockIpfsService.getFromIpfs.mockResolvedValue(mockFirstIpfsContentDto);

      const result = await facade.getConstitutionFileByCid(
        mockFirstIpfsMetadataDto.cid,
      );

      expect(mockIpfsService.getFromIpfs).toHaveBeenCalledWith(
        mockFirstIpfsMetadataDto.cid,
      );
      expect(
        mockConstitutionRedisService.saveConstitutionFile,
      ).toHaveBeenCalledWith(mockFirstConstitutionDto);
      expect(result.cid).toBe(mockFirstConstitutionResponse.cid);
      expect(result.contents).toBe(mockFirstConstitutionResponse.contents);
      expect(result.version).toBe(mockFirstConstitutionResponse.version);
    });
    it('should throw an error if constitution file with particular CID does not exist on IPFS', async () => {
      // Mocked to undefined in order to search constitution file on IPFS
      mockConstitutionRedisService.getConstitutionFileByCid.mockImplementationOnce(
        () => undefined,
      );
      const cid: string = mockNonExistentValidCid;

      try {
        await facade.getConstitutionFileByCid(cid);
      } catch (e) {
        expect(
          mockConstitutionRedisService.saveConstitutionFile,
        ).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Document with cid: ${cid} not found`);
      }
    });
    it('should throw an error if CID with invalid format is sent when attempting to find constitution file on IPFS', async () => {
      // Mocked to undefined in order to search constitution file on IPFS
      mockConstitutionRedisService.getConstitutionFileByCid.mockImplementationOnce(
        () => undefined,
      );
      const cid: string = mockBadFormatCid;

      try {
        await facade.getConstitutionFileByCid(cid);
      } catch (e) {
        expect(
          mockConstitutionRedisService.saveConstitutionFile,
        ).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe(`Error when getting file from IPFS service`);
      }
    });
    it('should throw an error if CID with whitespace is sent when attempting to find constitution file on IPFS', async () => {
      // Mocked to undefined in order to search constitution file on IPFS
      mockConstitutionRedisService.getConstitutionFileByCid.mockImplementationOnce(
        () => undefined,
      );
      const cid: string = mockFirstConstitutionDto.cid + ' ';

      try {
        await facade.getConstitutionFileByCid(cid);
      } catch (e) {
        expect(
          mockConstitutionRedisService.saveConstitutionFile,
        ).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe(`Error when getting file from IPFS service`);
      }
    });
    it('should throw an error if empty CID is sent when attempting to find constitution file on IPFS', async () => {
      // Mocked to undefined in order to search constitution file on IPFS
      mockConstitutionRedisService.getConstitutionFileByCid.mockImplementationOnce(
        () => undefined,
      );
      const cid: string = '';

      try {
        await facade.getConstitutionFileByCid(cid);
      } catch (e) {
        expect(
          mockConstitutionRedisService.saveConstitutionFile,
        ).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe(`Error when getting file from IPFS service`);
      }
    });
  });
  describe('getAllConstitutionMetadata', () => {
    it('should return an array of metadata for all existing constitution files stored on IPFS', async () => {
      const result: ConstitutionMetadataResponse[] =
        await facade.getAllConstitutionMetadata();

      expect(mockIpfsService.findAllMetadata).toHaveBeenCalled();
      expect(result).toEqual(mockConstitutionMetadataResponseArray);
    });
    it('should return an empty array in case no constitution files are stored on IPFS', async () => {
      const emptyArray: ConstitutionMetadataResponse[] = [];
      // Mock to return an empty array
      mockIpfsService.findAllMetadata.mockImplementation(
        async () => emptyArray,
      );

      const result: ConstitutionMetadataResponse[] =
        await facade.getAllConstitutionMetadata();

      expect(mockIpfsService.findAllMetadata).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
