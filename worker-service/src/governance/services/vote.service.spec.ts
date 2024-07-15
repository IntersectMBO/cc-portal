import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { Vote } from '../entities/vote.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HotAddress } from '../entities/hotaddress.entity';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { VoteRequest } from '../dto/vote.request';
import { InternalServerErrorException } from '@nestjs/common';
import { SQL_FILE_PATH } from '../../common/constants/sql.constants';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { GovActionProposalService } from './gov-action-proposal.service';

describe('VoteService', () => {
  let service: VoteService;

  const mockUsers: User[] = [
    {
      id: '1',
      hotAddresses: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      hotAddresses: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      hotAddresses: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockGovActionProposal: GovActionProposal[] = [
    {
      id: 'gov-action-proposal-1',
      votingAnchorId: '5',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      title: 'test',
      abstract: 'test',
      submitTime: null,
      endTime: null,
      status: 'ACTIVE',
      txHash: 'hash-1',
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 'gov-action-proposal-2',
      votingAnchorId: '8',
      govActionType: 'TreasuryWithdrawals',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Treasury.jsonld',
      title: 'test',
      abstract: 'test',
      submitTime: null,
      endTime: null,
      status: 'ACTIVE',
      txHash: 'hash-1',
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockVotes: Vote[] = [
    {
      id: '1',
      title: 'test',
      comment: 'test',
      vote: 'Yes',
      govActionProposal: mockGovActionProposal[0],
      submitTime: null,
      hotAddress: 'e7f772',
      userId: mockUsers[0].id,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      title: 'test2',
      comment: 'test2',
      vote: 'Yes',
      govActionProposal: mockGovActionProposal[0],
      submitTime: null,
      hotAddress: '73eef5',
      userId: mockUsers[1].id,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      title: 'test3',
      comment: 'test3',
      vote: 'Yes',
      govActionProposal: mockGovActionProposal[1],
      submitTime: null,
      hotAddress: 'c9b871',
      userId: mockUsers[2].id,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockHotAddresses: HotAddress[] = [
    {
      id: 'hot-address-1',
      address: 'e7f772',
      user: mockUsers[0],
    },
    {
      id: 'hot-address-2',
      address: '73eef5',
      user: mockUsers[1],
    },
    {
      id: 'hot-address-3',
      address: 'c9b871',
      user: mockUsers[2],
    },
  ];

  const mockMapHotAddresses = new Map<string, string>([
    ['e7f772', '1'],
    ['73eef5', '2'],
    ['c9b871', '3'],
  ]);

  const mapValues = Array.from(mockMapHotAddresses.keys());

  for (let i = 0; i < mapValues.length; i++) {
    mapValues[i] = '\\x' + mapValues[i];
  }

  const mockDbSyncData: object[] = [
    {
      id: '1',
      committee_voter: '1',
      gov_action_proposal_id: mockGovActionProposal[0].id,
      vote: 'Yes',
      title: 'test',
      comment: 'test',
      time: null,
      gap_submit_time: null,
      raw: new Uint8Array([231, 247, 114]),
      voting_anchor_id: '5',
      type: 'InfoAction',
      url: 'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      epoch_status: 'ACTIVE',
      end_time: null,
      hash: '970e331a2e340597636b26bc8ab44c386cd687d57d86698b81ecce9d43010c0c',
    },
    {
      id: '2',
      committee_voter: '2',
      gov_action_proposal_id: mockGovActionProposal[0].id,
      vote: 'Yes',
      title: 'test2',
      comment: 'test2',
      time: null,
      gap_submit_time: null,
      raw: new Uint8Array([115, 238, 245]),
      voting_anchor_id: '5',
      type: 'InfoAction',
      url: 'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      epoch_status: 'ACTIVE',
      end_time: null,
      hash: '0c0e331a2e340597636b26bc8ab44c386cd687d57d86698b81ecce9d43010c97',
    },
    {
      id: '3',
      committee_voter: '1',
      gov_action_proposal_id: mockGovActionProposal[1].id,
      vote: 'Yes',
      title: 'test3',
      comment: 'test3',
      time: null,
      gap_submit_time: null,
      raw: new Uint8Array([201, 184, 113]),
      voting_anchor_id: '8',
      type: 'InfoAction',
      url: 'https://metadata.cardanoapi.io/data/Treasury.jsonld',
      epoch_status: 'ACTIVE',
      end_time: null,
      hash: '630c0e331a2e3405976b26bc8ab44c386cd687d57d86698b81ecce9d43010c97',
    },
  ];

  const mockVotesRequest: VoteRequest[] = [
    {
      id: '1',
      reasoningTitle: 'test',
      comment: 'test',
      vote: 'Yes',
      govActionProposalId: mockGovActionProposal[0].id,
      submitTime: null,
      hotAddress: 'e7f772',
      userId: mockUsers[0].id,
      govActionProposalSubmitTime: null,
      votingAnchorId: '5',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'ACTIVE',
      endTime: null,
      txHash:
        '970e331a2e340597636b26bc8ab44c386cd687d57d86698b81ecce9d43010c0c',
    },
    {
      id: '2',
      reasoningTitle: 'test2',
      comment: 'test2',
      vote: 'Yes',
      govActionProposalId: mockGovActionProposal[0].id,
      submitTime: null,
      hotAddress: '73eef5',
      userId: mockUsers[1].id,
      govActionProposalSubmitTime: null,
      votingAnchorId: '5',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'ACTIVE',
      endTime: null,
      txHash:
        '0c0e331a2e340597636b26bc8ab44c386cd687d57d86698b81ecce9d43010c97',
    },
    {
      id: '3',
      reasoningTitle: 'test3',
      comment: 'test3',
      vote: 'Yes',
      govActionProposalId: mockGovActionProposal[1].id,
      submitTime: null,
      hotAddress: 'c9b871',
      userId: mockUsers[2].id,
      govActionProposalSubmitTime: null,
      votingAnchorId: '8',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Treasury.jsonld',
      status: 'ACTIVE',
      endTime: null,
      txHash:
        '630c0e331a2e3405976b26bc8ab44c386cd687d57d86698b81ecce9d43010c97',
    },
  ];

  const mockVoteRepository = {
    save: jest.fn().mockImplementation((vote) => {
      if (vote === mockVotes) {
        return mockVotes;
      }
      throw new InternalServerErrorException('Transaction failed');
    }),
  };
  const mockHotAddressRepository = {
    find: jest.fn().mockImplementation(() => {
      if (mockHotAddresses.length === 0) {
        throw new TypeError('hotAddress.forEach is not a function');
      }
      return mockHotAddresses;
    }),
    count: jest.fn().mockResolvedValue(mockHotAddresses.length),
  };
  const mockGovActionProposalRepository = {
    find: jest.fn().mockImplementation((govActionProposalIds: string[]) => {
      const govActionProposals: GovActionProposal[] = [];
      mockGovActionProposal.forEach((govActionProposal) => {
        govActionProposalIds.forEach((id) => {
          if (govActionProposal.id === id) {
            govActionProposals.push(govActionProposal);
          }
        });
      });
      return govActionProposals;
    }),
    create: jest.fn().mockImplementation((govActionProposal) => {
      return govActionProposal;
    }),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'HOT_ADDRESSES_PER_PAGE':
          return 10;
      }
    }),
  };

  const mockDataSource = {};

  const mockEntityManager = {
    transaction: jest.fn().mockImplementation(async (callback) => {
      try {
        const result = await callback();
        return Promise.resolve(result);
      } catch (error) {
        return Promise.reject(error);
      }
    }),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        GovActionProposalService,
        { provide: getRepositoryToken(Vote), useValue: mockVoteRepository },
        {
          provide: getRepositoryToken(HotAddress),
          useValue: mockHotAddressRepository,
        },
        {
          provide: getRepositoryToken(GovActionProposal),
          useValue: mockGovActionProposalRepository,
        },
        {
          provide: 'db-syncDataSource',
          useValue: mockDataSource,
        },
        { provide: EntityManager, useValue: mockEntityManager },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Store vote data', () => {
    it('should store vote data in DB', async () => {
      const proto = Object.getPrototypeOf(service);
      jest.spyOn(proto, 'prepareVotes').mockResolvedValue(mockVotes);

      await service.storeVoteData(mockVotesRequest);

      expect(mockEntityManager.transaction).toHaveBeenCalled();

      expect(mockVoteRepository.save).toHaveBeenCalledWith(mockVotes);
    });
    it('should not store invalid vote data to database and it should throw an error', async () => {
      const invalidVotes: any[] = [
        {
          adadha: 'adhdadadad',
        },
      ];
      const proto = Object.getPrototypeOf(service);
      jest.spyOn(proto, 'prepareVotes').mockResolvedValue(invalidVotes);

      try {
        await service.storeVoteData(invalidVotes);
      } catch (e) {
        expect(mockEntityManager.transaction).toHaveBeenCalled();
        expect(mockVoteRepository.save).toHaveBeenCalledWith(invalidVotes);
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe('Transaction failed');
      }
    });
    it(`should throw an error if 'undefined' is passed to the save method`, async () => {
      const proto = Object.getPrototypeOf(service);
      jest.spyOn(proto, 'prepareVotes').mockResolvedValue(undefined);

      try {
        await service.storeVoteData(mockVotesRequest);
      } catch (e) {
        expect(mockEntityManager.transaction).toHaveBeenCalled();
        expect(mockVoteRepository.save).toHaveBeenCalledWith(undefined);
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe('Transaction failed');
      }
    });
  });

  describe('Get vote data from db-sync', () => {
    it('should return vote data from remote DB if there is any', async () => {
      const mockGetDataFromSqlFile = jest
        .spyOn(service, 'getDataFromSqlFile')
        .mockResolvedValue(mockDbSyncData);

      const result = await service.getVoteDataFromDbSync(mockMapHotAddresses);

      expect(mockGetDataFromSqlFile).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_VOTES,
        mapValues,
      );
      expect(result).toEqual(mockVotesRequest);
    });
    it('should return an empty array if there is no vote data in remote DB ', async () => {
      const mockEmptyArray: object[] = [];

      const mockGetDataFromSqlFile = jest
        .spyOn(service, 'getDataFromSqlFile')
        .mockResolvedValue(mockEmptyArray);

      const result = await service.getVoteDataFromDbSync(mockMapHotAddresses);

      expect(mockGetDataFromSqlFile).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_VOTES,
        mapValues,
      );
      expect(result).toEqual(mockEmptyArray);
    });

    it('should throw an error when mapping non-vote data fetched from remote DB', async () => {
      const mockDataArray: object[] = [
        {
          qwe: 'aaaa',
        },
        {
          rty: 'bbbb',
        },
        {
          aswd: 'cccc',
        },
      ];

      const mockGetDataFromSqlFile = jest
        .spyOn(service, 'getDataFromSqlFile')
        .mockResolvedValue(mockDataArray);

      await expect(
        service.getVoteDataFromDbSync(mockMapHotAddresses),
      ).rejects.toThrow(
        new TypeError(
          'The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined',
        ),
      );
      expect(mockGetDataFromSqlFile).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_VOTES,
        mapValues,
      );
    });
  });

  describe('Count hot address pages', () => {
    it('should return number of pages for hot addresses', async () => {
      const pages: number = 1;

      const result = await service.countHotAddressPages();
      expect(result).toEqual(pages);
    });
    it('should not return hot address pages if there are no hot addresses', async () => {
      const pages: number = 0;
      jest.spyOn(mockHotAddressRepository, 'count').mockResolvedValue(pages);
      const result = await service.countHotAddressPages();
      expect(result).toEqual(0);
    });
  });

  describe('Get map hot addresses', () => {
    it('should return hot addresses mapped', async () => {
      jest.spyOn(mockHotAddressRepository, 'find').mockReset();
      const page: number = 1;
      const hotAddressesResult = [
        {
          id: 'hot-address-1',
          address: 'e7f772',
          user: mockUsers[0],
        },
        {
          id: 'hot-address-2',
          address: '73eef5',
          user: mockUsers[1],
        },
      ];

      jest
        .spyOn(mockHotAddressRepository, 'find')
        .mockResolvedValueOnce(hotAddressesResult);

      const expectedMapHotAddresses = new Map<string, string>();

      const mapHotAddresses = await service.getMapHotAddresses(page);

      hotAddressesResult.forEach((x) => {
        expectedMapHotAddresses.set(x.address, x.user.id);
      });

      expect(mapHotAddresses).toEqual(expectedMapHotAddresses);
    });

    it('should return an empty array if there are no hot addresses in DB', async () => {
      jest.spyOn(mockHotAddressRepository, 'find').mockReset();
      const page: number = 1;
      const mockEmptyHotAddresses: HotAddress[] = [];
      jest
        .spyOn(mockHotAddressRepository, 'find')
        .mockResolvedValueOnce(mockEmptyHotAddresses);
      const result = await service.getMapHotAddresses(page);
      expect(mockHotAddressRepository.find).toHaveBeenCalled();
      expect(mockConfigService.getOrThrow).toHaveBeenCalledTimes(2);
      expect(result).toEqual(new Map());
    });

    it('should throw an error if `HOT_ADDRESSES_PER_PAGE` env variable is not defined', async () => {
      jest.spyOn(mockHotAddressRepository, 'find').mockReset();
      jest.spyOn(mockConfigService, 'getOrThrow').mockReset();
      const page: number = 1;
      const mockEmptyHotAddresses: HotAddress[] = [];
      jest
        .spyOn(mockHotAddressRepository, 'find')
        .mockResolvedValueOnce(mockEmptyHotAddresses);
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        switch (key) {
          case 'HOT_ADDRESSES_PER_PAGE':
            throw TypeError(
              'Configuration key "HOT_ADDRESSES_PER_PAGE" does not exist',
            );
          default:
            return 0;
        }
      });

      try {
        await service.getMapHotAddresses(page);
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe(
          'Configuration key "HOT_ADDRESSES_PER_PAGE" does not exist',
        );
        expect(mockHotAddressRepository.find).not.toHaveBeenCalled();
        expect(mockConfigService.getOrThrow).toHaveBeenCalledTimes(1);
      }
    });
  });
});
