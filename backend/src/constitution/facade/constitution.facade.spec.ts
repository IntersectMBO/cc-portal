import { Test, TestingModule } from '@nestjs/testing';
import { ConstitutionFacade } from './constitution.facade';
import { ConstitutionService } from '../services/constitution.service';
import { ConstitutionRedisService } from '../../redis/service/constitution-redis.service';
import { IpfsService } from '../../ipfs/services/ipfs.service';
import { CompareConstitutionsRequest } from '../api/request/compare-constitution.request';
import { ConstitutionDiffResponse } from '../api/response/constitution-diff.response';
import { ConstitutionDiffDto } from '../../redis/dto/constitution-diff.dto';
import { ConstitutionDto } from '../../redis/dto/constitution.dto';
import { IpfsContentDto } from '../../ipfs/dto/ipfs-content.dto';
import { ConstitutionResponse } from '../api/response/constitution.response';
import { NotFoundException } from '@nestjs/common';

describe('ConstitutionFacade', () => {
  let facade: ConstitutionFacade;

  const mockCompareConstitutionsRequest: CompareConstitutionsRequest = {
    base: 'bafkreiduhtn6y2i2gljbrqsabglndc6w4o2d6kzkv2dkm3ojtvnh2lzyoy',
    target: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
  };

  const mockConstitutionDiffResponse: ConstitutionDiffResponse = {
    // The diff stored here is after JSON.stringify() is invoked
    diff: '[{"count":1,"removed":true,"value":"The morning sunlight cast a golden glow over the peaceful village, adorning the cobblestone streets with warmth."},{"count":1,"added":true,"value":"The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth."},{"count":1,"value":" "},{"count":1,"removed":true,"value":"Birds chirped melodiously, contributing to the tranquil atmosphere that enveloped the tiny community."},{"count":1,"added":true,"value":"Birds chi…":1,"value":" "},{"count":1,"removed":true,"value":"And as the sun dipped below the horizon, painting the sky with a kaleidoscope of colors, the village settled into a peaceful serenity once more, ready to embrace the promise of another day."},{"count":1,"added":true,"value":"And as the sun dipped below the horizon, casting a kaleidoscope of colors across the sky, the village settled into a peaceful tranquility once more, ready to embrace the promise of another day."},{"count":1,"value":"\\n"}]',
  };

  const mockConstitutionDiffDto: ConstitutionDiffDto = {
    base: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    target: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',

    // The diff stored here is after JSON.stringify() is invoked
    diff: '[{"count":1,"removed":true,"value":"The morning sunlight cast a golden glow over the peaceful village, adorning the cobblestone streets with warmth."},{"count":1,"added":true,"value":"The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth."},{"count":1,"value":" "},{"count":1,"removed":true,"value":"Birds chirped melodiously, contributing to the tranquil atmosphere that enveloped the tiny community."},{"count":1,"added":true,"value":"Birds chi…":1,"value":" "},{"count":1,"removed":true,"value":"And as the sun dipped below the horizon, painting the sky with a kaleidoscope of colors, the village settled into a peaceful serenity once more, ready to embrace the promise of another day."},{"count":1,"added":true,"value":"And as the sun dipped below the horizon, casting a kaleidoscope of colors across the sky, the village settled into a peaceful tranquility once more, ready to embrace the promise of another day."},{"count":1,"value":"\\n"}]',
  };

  const mockFirstConstitutionDto: ConstitutionDto = {
    cid: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    version: '1713769479',
    blake2b: '58cafedf496cf846268a681a797c8d0a2d324cb4344120132ff72cefc9ff0d1c',
    contents:
      "The morning sunlight cast a golden glow over the peaceful village, adorning the cobblestone streets with warmth. Birds chirped melodiously, contributing to the tranquil atmosphere that enveloped the tiny community. Life unfolded at a leisurely pace here, far from the hustle and bustle of city life. Residents greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tightly knit fabric of camaraderie.\n\nNestled in the heart of the village stood a charming café, its aroma of freshly brewed coffee mingling with the scent of just-baked pastries. It served as a sanctuary for locals and travelers alike, providing a cozy refuge where conversations flowed as freely as the steaming cups of joe. Inside, the air buzzed with the soft hum of chatter, punctuated by occasional bursts of laughter. The café's walls were adorned with local artwork, adding a splash of color to the rustic ambiance.\n\nAs the day progressed, the village teemed with activity. Children skipped along the cobblestones, their laughter echoing through the narrow lanes. Shopkeepers tended to their storefronts, arranging displays of goods with meticulous precision. And as the sun dipped below the horizon, painting the sky with a kaleidoscope of colors, the village settled into a peaceful serenity once more, ready to embrace the promise of another day.\n",
  };

  const mockSecondConstitutionDto: ConstitutionDto = {
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    contents:
      "The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n\nIn the heart of the village stood a quaint cafe, its aroma of freshly brewed coffee mingling with the scent of freshly baked pastries. It was a haven for locals and travelers alike, offering a cozy sanctuary where conversations flowed as freely as the steaming cups of java. Inside, the air buzzed with the gentle hum of chatter, punctuated by occasional bursts of laughter. The cafe's walls were adorned with local artwork, adding a splash of color to the rustic interior.\n\nAs the day unfolded, the village came alive with activity. Children skipped along the cobblestones, their laughter echoing through the narrow alleys. Shopkeepers tended to their storefronts, arranging displays of goods with meticulous care. And as the sun dipped below the horizon, casting a kaleidoscope of colors across the sky, the village settled into a peaceful tranquility once more, ready to embrace the promise of another day.\n",
  };

  const mockIpfsContentDto: IpfsContentDto = {
    title: 'Revision 1',
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: '1713769514',
    createdDate: '2024-04-21 11:21:59.334',
    contentType: 'text/markdown',
    blake2b: 'f6f811fbde53b09c1b653766f27578cc867e9b634b9142800f56e282b041de00',
    contents:
      "The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n\nIn the heart of the village stood a quaint cafe, its aroma of freshly brewed coffee mingling with the scent of freshly baked pastries. It was a haven for locals and travelers alike, offering a cozy sanctuary where conversations flowed as freely as the steaming cups of java. Inside, the air buzzed with the gentle hum of chatter, punctuated by occasional bursts of laughter. The cafe's walls were adorned with local artwork, adding a splash of color to the rustic interior.\n\nAs the day unfolded, the village came alive with activity. Children skipped along the cobblestones, their laughter echoing through the narrow alleys. Shopkeepers tended to their storefronts, arranging displays of goods with meticulous care. And as the sun dipped below the horizon, casting a kaleidoscope of colors across the sky, the village settled into a peaceful tranquility once more, ready to embrace the promise of another day.\n",
  };

  const mockFirstConstitutionResponse: ConstitutionResponse = {
    cid: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
    version: 'Revision 1',
    contents:
      "The morning sun cast a golden glow over the tranquil village, painting the cobblestone streets with warmth. Birds chirped melodiously, adding to the serene ambiance that enveloped the small community. Life moved at a leisurely pace here, far removed from the hustle and bustle of the city. Neighbors greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tight-knit tapestry of camaraderie.\n\nIn the heart of the village stood a quaint cafe, its aroma of freshly brewed coffee mingling with the scent of freshly baked pastries. It was a haven for locals and travelers alike, offering a cozy sanctuary where conversations flowed as freely as the steaming cups of java. Inside, the air buzzed with the gentle hum of chatter, punctuated by occasional bursts of laughter. The cafe's walls were adorned with local artwork, adding a splash of color to the rustic interior.\n\nAs the day unfolded, the village came alive with activity. Children skipped along the cobblestones, their laughter echoing through the narrow alleys. Shopkeepers tended to their storefronts, arranging displays of goods with meticulous care. And as the sun dipped below the horizon, casting a kaleidoscope of colors across the sky, the village settled into a peaceful tranquility once more, ready to embrace the promise of another day.\n",
  };

  const mockSecondConstitutionResponse: ConstitutionResponse = {
    cid: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    version: 'Revision 2',
    contents:
      "The morning sunlight cast a golden glow over the peaceful village, adorning the cobblestone streets with warmth. Birds chirped melodiously, contributing to the tranquil atmosphere that enveloped the tiny community. Life unfolded at a leisurely pace here, far from the hustle and bustle of city life. Residents greeted each other with smiles and friendly nods as they went about their daily routines, weaving a tightly knit fabric of camaraderie.\n\nNestled in the heart of the village stood a charming café, its aroma of freshly brewed coffee mingling with the scent of just-baked pastries. It served as a sanctuary for locals and travelers alike, providing a cozy refuge where conversations flowed as freely as the steaming cups of joe. Inside, the air buzzed with the soft hum of chatter, punctuated by occasional bursts of laughter. The café's walls were adorned with local artwork, adding a splash of color to the rustic ambiance.\n\nAs the day progressed, the village teemed with activity. Children skipped along the cobblestones, their laughter echoing through the narrow lanes. Shopkeepers tended to their storefronts, arranging displays of goods with meticulous precision. And as the sun dipped below the horizon, painting the sky with a kaleidoscope of colors, the village settled into a peaceful serenity once more, ready to embrace the promise of another day.\n",
  };

  const mockConstitutionService = {
    diffConstitutions: jest.fn(),
  };

  const mockConstitutionRedisService = {
    saveConstitutionDiff: jest.fn(async () => {}),
    saveConstitutionFile: jest.fn(async () => {}),
    getConstitutionFileByCid: jest.fn(),
    getConstitutionDiff: jest.fn(async (base: string, target: string) => {
      mockCompareConstitutionsRequest.base = base;
      mockCompareConstitutionsRequest.target = target;
      return mockConstitutionDiffDto;
    }),
  };

  const mockIpfsService = {
    addToIpfs: jest.fn(),
    getFromIpfs: jest.fn((cid) => {
      if (cid === undefined) {
        throw new NotFoundException();
      }
    }),
    findCurrentMetadata: jest.fn(),
    findAllMetadata: jest.fn(),
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

  it('compareTwoConstitutionVersions => should directly return diff if it is stored in Redis', async () => {
    const mockCompareConstitutionsRequest: CompareConstitutionsRequest = {
      base: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
      target: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    };
    const result = await facade.compareTwoConstitutionVersions(
      mockCompareConstitutionsRequest,
    );
    expect(result).toEqual(mockConstitutionDiffResponse);
    expect(mockConstitutionRedisService.getConstitutionDiff).toHaveBeenCalled();
  });
  it('compareTwoConstitutionVersions => should return diff by getting both files` CIDs stored in Redis and then creating the diff', async () => {
    const mockCompareConstitutionsRequest: CompareConstitutionsRequest = {
      base: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
      target: 'bafkreich5c3rbz4amwevqy676czysmr27ctby46zdhja7gnpzriyqwdv4i',
    };
    mockConstitutionRedisService.getConstitutionDiff.mockResolvedValue(
      undefined,
    );
    mockConstitutionRedisService.getConstitutionFileByCid
      .mockResolvedValueOnce(mockFirstConstitutionResponse)
      .mockResolvedValueOnce(mockSecondConstitutionResponse);

    // Mocking diffConstitutions to return diff value
    jest
      .spyOn(mockConstitutionService, 'diffConstitutions')
      .mockReturnValue(mockConstitutionDiffDto.diff);

    const result = await facade.compareTwoConstitutionVersions(
      mockCompareConstitutionsRequest,
    );
    expect(mockConstitutionService.diffConstitutions).toHaveBeenCalled();
    expect(mockConstitutionRedisService.getConstitutionDiff).toHaveBeenCalled();
    expect(
      mockConstitutionRedisService.saveConstitutionDiff,
    ).toHaveBeenCalled();
    // Expect diffConstitutions return value to have property 'diff'
    expect(result).toHaveProperty('diff');
  });
  //TODO finish creating this test case
  it('compareTwoConstitutionVersions => throws NotFoundException if file with particular CID is not found on IPFS', async () => {
    const mockCompareConstitutionsRequest: CompareConstitutionsRequest = {
      base: 'bafkreibxlpnlpsg6ewqzxhslwyhzl4p4vc6bifj3nb4k2lxhbnfaojbmwy',
      target: undefined,
    };
    mockConstitutionRedisService.getConstitutionDiff.mockResolvedValue(
      undefined,
    );
    mockConstitutionRedisService.getConstitutionFileByCid.mockResolvedValueOnce(
      mockCompareConstitutionsRequest.base,
    );
    mockConstitutionRedisService.getConstitutionFileByCid.mockResolvedValueOnce(
      mockCompareConstitutionsRequest.target,
    );
    const result = await facade.compareTwoConstitutionVersions(
      mockCompareConstitutionsRequest,
    );

    expect(() => {
      facade.compareTwoConstitutionVersions(mockCompareConstitutionsRequest);
    }).toThrow(NotFoundException);
  });
});
