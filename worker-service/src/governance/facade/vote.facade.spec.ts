import { Test, TestingModule } from '@nestjs/testing';
import { VoteFacade } from './vote.facade';
import { VoteService } from '../services/vote.service';
import { VoteRequest } from '../dto/vote.request';
import { NotFoundException } from '@nestjs/common';
import { HotAddress } from '../entities/hotaddress.entity';
import { User } from '../entities/user.entity';
import { VoteMapper } from '../mapper/vote.mapper';
import { Vote } from '../entities/vote.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { VoteProducer } from '../queues/producers/vote.producer';

describe('VoteFacade', () => {
  let facade: VoteFacade;

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
      govMetadataUrl: 'https://test.com',
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
      id: 'gov-action-proposal-1',
      votingAnchorId: '8',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://test.com',
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
      hotAddress: '\\xe7f772',
      userId: mockUsers[0].id,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '2',
      title: 'test',
      comment: 'test',
      vote: 'Yes',
      govActionProposal: mockGovActionProposal[0],
      submitTime: null,
      hotAddress: '\\x73eef5',
      userId: mockUsers[1].id,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: '3',
      title: 'test',
      comment: 'test',
      vote: 'Yes',
      govActionProposal: mockGovActionProposal[1],
      submitTime: null,
      hotAddress: '\\xc9b871',
      userId: mockUsers[2].id,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockGovActionProposal2: GovActionProposal[] = [
    {
      id: 'gov-action-proposal-1',
      votingAnchorId: '5',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://test.com',
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
      govMetadataUrl: 'https://test2.com',
      title: 'test2',
      abstract: 'test2',
      submitTime: null,
      endTime: null,
      status: 'ACTIVE',
      txHash: 'hash-1',
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockHotAddresses: HotAddress[] = [
    {
      id: 'hot-address-1',
      address: '\\xe7f772',
      user: mockUsers[0],
    },
    {
      id: 'hot-address-2',
      address: '\\x73eef5',
      user: mockUsers[1],
    },
    {
      id: 'hot-address-3',
      address: '\\xc9b871',
      user: mockUsers[2],
    },
  ];

  const mockDbSyncData: object[] = [
    {
      id: '1',
      committee_voter: '7',
      gov_action_proposal_id: mockGovActionProposal2[0].id,
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
      hash: '\\x970e331a2e340597636b26bc8ab44c386cd687d57d86698b81ecce9d43010c0c',
    },
    {
      id: '2',
      committee_voter: '7',
      gov_action_proposal_id: mockGovActionProposal2[0].id,
      vote: 'Yes',
      title: 'test',
      comment: 'test',
      time: null,
      gap_submit_time: null,
      raw: new Uint8Array([115, 238, 245]),
      voting_anchor_id: '5',
      type: 'InfoAction',
      url: 'https://metadata.cardanoapi.io/data/Treasury.jsonld',
      epoch_status: 'ACTIVE',
      end_time: null,
      hash: '\\x0c0e331a2e340597636b26bc8ab44c386cd687d57d86698b81ecce9d43010c97',
    },
    {
      id: '3',
      committee_voter: '7',
      gov_action_proposal_id: mockGovActionProposal2[1].id,
      vote: 'Yes',
      title: 'test',
      comment: 'test',
      time: null,
      gap_submit_time: null,
      raw: new Uint8Array([201, 184, 113]),
      voting_anchor_id: '8',
      type: 'InfoAction',
      url: 'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      epoch_status: 'ACTIVE',
      end_time: null,
      hash: '\\x630c0e331a2e3405976b26bc8ab44c386cd687d57d86698b81ecce9d43010c97',
    },
  ];

  const mockVoteService = {
    getVoteDataFromDbSync: jest
      .fn()
      .mockImplementation((mapHotAddresses: Map<string, string>) => {
        const results: VoteRequest[] = [];
        if (mockDbSyncData.length === 0) {
          throw new NotFoundException('There is no db-sync data');
        }
        mockDbSyncData.forEach((vote) => {
          results.push(VoteMapper.dbSyncToVoteRequest(vote, mapHotAddresses));
        });
        return results;
      }),
    countHotAddressPages: jest.fn().mockImplementation(() => {
      const perPage: number = 10;
      const pages: number = Math.ceil(mockHotAddresses.length / perPage);
      return pages;
    }),
    getMapHotAddresses: jest.fn().mockImplementation(() => {
      const mapHotAddresses = new Map<string, string>();
      mockHotAddresses.forEach((x) => {
        mapHotAddresses.set(x.address, x.user.id);
      });

      return mapHotAddresses;
    }),
    storeVoteData: jest.fn().mockImplementation(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'HOT_ADDRESSES_PER_PAGE':
          return 10;
      }
    }),
    get: jest.fn((key: string) => {
      switch (key) {
        case 'HOT_ADDRESSES_PER_PAGE':
          return 10;
      }
    }),
  };

  const mockVoteProducer = {
    addToVoteQueue: jest.fn(async () => {
      return {
        Queue: jest.fn().mockImplementation(() => {
          return {
            add: jest.fn(),
          };
        }),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteFacade,
        VoteProducer,
        SchedulerRegistry,
        {
          provide: VoteService,
          useValue: mockVoteService,
        },
        {
          provide: VoteProducer,
          useValue: mockVoteProducer,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    facade = module.get<VoteFacade>(VoteFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('Sync votes table', () => {
    it('should add a job to queue with vote data', async () => {
      const perPage = mockConfigService.getOrThrow('HOT_ADDRESSES_PER_PAGE');
      for (let i = 0; i <= mockVotes.length; i += perPage) {
        mockVoteService.getVoteDataFromDbSync.mockImplementationOnce(
          async () => {
            const votesPerPage = mockVotes.slice(i, i + perPage);
            return votesPerPage;
          },
        );
      }

      await facade.syncVotesTable();
      expect(mockConfigService.getOrThrow).toHaveBeenCalled();
      expect(mockVoteService.getVoteDataFromDbSync).toHaveBeenCalledTimes(1);
      expect(mockVoteProducer.addToVoteQueue).toHaveBeenCalledTimes(1);
    });

    it(`should not add a job to queue if no hot addresses exist in database`, async () => {
      jest
        .spyOn(mockVoteService, 'countHotAddressPages')
        .mockResolvedValue(undefined);

      await facade.syncVotesTable();

      expect(mockVoteService.countHotAddressPages).toHaveBeenCalledTimes(1);
      expect(mockVoteService.getVoteDataFromDbSync).not.toHaveBeenCalled();
      expect(mockVoteProducer.addToVoteQueue).not.toHaveBeenCalled();
    });

    it('should not add a job to queue if an error occurred when fetching data from remote DB', async () => {
      mockVoteService.getMapHotAddresses.mockImplementation(async () => {
        return undefined;
      });

      try {
        await facade.syncVotesTable();
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe(
          `Cannot read properties of undefined (reading 'forEach')`,
        );
        expect(mockVoteService.getMapHotAddresses).toHaveBeenCalledTimes(1);
        expect(mockVoteService.getVoteDataFromDbSync).toHaveBeenCalledTimes(1);
        expect(mockVoteProducer.addToVoteQueue).not.toHaveBeenCalled();
      }
    });
  });
});
