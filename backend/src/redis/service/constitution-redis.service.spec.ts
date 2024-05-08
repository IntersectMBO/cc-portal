import { Test } from '@nestjs/testing';
import { ConstitutionRedisService } from './constitution-redis.service';
import { ConstitutionDto } from '../dto/constitution.dto';
import { RedisRepository } from '../repository/redis.repo';
import { Constants } from '../util/constants';

describe('ConstitutionRedisService', () => {
  let service: ConstitutionRedisService;

  const mockFirstConstitutionDto: ConstitutionDto = {
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    contents:
      'The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n',
  };

  const mockRedisConstitutionFile: string =
    '{"cid":"bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy","version":"1713769514","blake2b":"f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00","contents":"The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\\\\n\\n"}';

  const mockParsedRedisConstitutionFile: ConstitutionDto = {
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    contents:
      'The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\\n\n',
  };

  const mockRedisRepository = {
    set: jest.fn(() => {}),
    get: jest.fn(async () => {
      return mockRedisConstitutionFile;
    }),
    onModuleDestroy: jest.fn(() => {}),
    setWithExpiry: jest.fn(() => {}),
    hsetMultiple: jest.fn(() => {}),
    delete: jest.fn(() => {}),
    dropIndex: jest.fn(() => {}),
    indexExists: jest.fn(() => {}),
    call: jest.fn(() => {}),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConstitutionRedisService,
        { provide: RedisRepository, useValue: mockRedisRepository },
      ],
    }).compile();

    service = module.get<ConstitutionRedisService>(ConstitutionRedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveConstitutionFile', () => {
    it('Should save constitution file inside Redis', async () => {
      const constitutionDto = mockFirstConstitutionDto;
      await service.saveConstitutionFile(constitutionDto);

      expect(mockRedisRepository.set).toHaveBeenCalledTimes(1);
      expect(mockRedisRepository.set).toHaveBeenCalledWith(
        Constants.PREFIX_CONSTITUTION,
        constitutionDto.cid,
        JSON.stringify(constitutionDto),
      );
    });
    it('Should throw Typerror if constitution object is null', async () => {
      const nullConstitution: ConstitutionDto = null;

      try {
        await service.saveConstitutionFile(nullConstitution);
      } catch (e) {
        expect(mockRedisRepository.set).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(
          `Cannot read properties of null (reading 'cid')`,
        );
      }
    });
    it('Should throw Typerror if constitution object is undefined', async () => {
      const nullConstitution: ConstitutionDto = undefined;

      try {
        await service.saveConstitutionFile(nullConstitution);
      } catch (e) {
        expect(mockRedisRepository.set).toHaveBeenCalledTimes(0);
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(
          `Cannot read properties of undefined (reading 'cid')`,
        );
      }
    });
  });

  describe('getConstitutionFileByCid', () => {
    it('Should return constitution file from Redis', async () => {
      const result = await service.getConstitutionFileByCid(
        mockFirstConstitutionDto.cid,
      );

      expect(result).toEqual(mockParsedRedisConstitutionFile);
      expect(mockRedisRepository.get).toHaveBeenCalledTimes(1);
      expect(mockRedisRepository.get).toHaveBeenCalledWith(
        Constants.PREFIX_CONSTITUTION,
        mockFirstConstitutionDto.cid,
      );
    });
    it('Should throw SyntaxError if the `get` method returns undefined', async () => {
      // Get method will return undefined
      mockRedisRepository.get.mockResolvedValueOnce(undefined);

      try {
        await service.getConstitutionFileByCid(mockFirstConstitutionDto.cid);
      } catch (e) {
        expect(mockRedisRepository.set).toHaveBeenCalledTimes(0);
        // JSON.parse function will throw an error
        expect(e).toBeInstanceOf(SyntaxError);
        expect(e.message).toBe(`"undefined" is not valid JSON`);
      }
    });
    it('Should throw SyntaxError if the `get` method returns an empty object', async () => {
      const nullCid: null = null;
      // Get method will return an empty object
      mockRedisRepository.get.mockImplementationOnce(async () => {
        return {} as null;
      });

      try {
        await service.getConstitutionFileByCid(nullCid);
      } catch (e) {
        expect(mockRedisRepository.set).toHaveBeenCalledTimes(0);
        // JSON.parse function will throw an error
        expect(e).toBeInstanceOf(SyntaxError);
        expect(e.message).toBe(`"[object Object]" is not valid JSON`);
      }
    });
  });
});
