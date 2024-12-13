import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceFacade } from './governance.facade';
import { GovActionProposalService } from '../services/gov-action-proposal.service';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { GovActionProposalProducer } from '../queues/producers/gov-action-proposal.producer';
import { VoteProducer } from '../queues/producers/vote.producer';
import { VoteService } from '../services/vote.service';
import { NotFoundException } from '@nestjs/common';
import { VoteRequest } from '../dto/vote.request';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { HotAddress } from '../entities/hotaddress.entity';
import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';
import { VoteMapper } from '../mapper/vote.mapper';

describe('GovernanceFacade', () => {
  let facade: GovernanceFacade;

  const mockFirstGapRequestArray: GovActionProposalRequest[] = [
    {
      id: '6',
      votingAnchorId: '168',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'DROPPED',
      submitTime: new Date('2024-05-21 15:18:06.000'),
      endTime: new Date('2024-05-26T22:29:45.000Z'),
      txHash:
        'D775FBCB6006524ABBFFE6DAF538E71941745B44A3A735852FBBD49FD7D59A95',
    },
    {
      id: '7',
      votingAnchorId: '168',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'DROPPED',
      submitTime: new Date('2024-05-21 17:08:38.000'),
      endTime: new Date('2024-05-26T22:29:45.000Z'),
      txHash:
        'DB4DBEB5946E5D49778F457D9C5A460488C40AF0B93D8B98111F5BE11BF165A6',
    },
    {
      id: '8',
      votingAnchorId: '216',
      govActionType: 'HardForkInitiation',
      govMetadataUrl:
        '1111111111111111111111111111111111111111111111111111111111111111',
      status: 'DROPPED',
      submitTime: new Date('2024-05-22 10:08:20.000'),
      endTime: new Date('2024-05-27T22:29:38.000Z'),
      txHash:
        '67820C121787464A9B670CF4C648F67CABD9573EB71B220214971CE467D25027',
    },
    {
      id: '1',
      votingAnchorId: '1',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
      status: 'DROPPED',
      submitTime: new Date('2024-05-17 12:56:00.000'),
      endTime: new Date('2024-05-17 12:56:00.000'),
      txHash:
        '69AA81F4AA0140E8D2AB2B6642C403611CD730FAB42E6C9F9E3E15D6D90BD3E9',
    },
    {
      id: '2',
      votingAnchorId: '2',
      govActionType: 'HardForkInitiation',
      govMetadataUrl:
        'https://github.com/carloslodelar/proposals/blob/main/why-hardfork-to-10.txt',
      status: 'DROPPED',
      submitTime: new Date('2024-05-17 16:15:34.000'),
      endTime: new Date('2024-05-22T22:29:33.000Z'),
      txHash:
        'EDEF927AF962664ED7A02BEDFA913C7F1CD271494871C25EE7DE66E941D83C79',
    },
    {
      id: '23',
      votingAnchorId: '517',
      govActionType: 'TreasuryWithdrawals',
      govMetadataUrl:
        'https://raw.githubusercontent.com/Sworzen1/Testing-Todo-app/main/Treasury.jsonld',
      status: 'DROPPED',
      submitTime: new Date('2024-05-27 09:19:00.000'),
      endTime: new Date('2024-06-01T22:29:51.000Z'),
      txHash:
        '2C2F01F6818CEE5E2EC29EF965DF347099173707BAFCEFC7F6FE3D66CD5F66EC',
    },
    {
      id: '24',
      votingAnchorId: '658',
      govActionType: 'NoConfidence',
      govMetadataUrl:
        'https://raw.githubusercontent.com/Ryun1/metadata/main/cip100/ga.jsonld',
      status: 'DROPPED',
      submitTime: new Date('2024-05-27 20:34:28.000'),
      endTime: new Date('2024-06-01T22:29:51.000Z'),
      txHash:
        '3B15AC25580564C8C565121188B142BEE99F6AAD7D4130FFC6A5A764EBA1159A',
    },
    {
      id: '4',
      votingAnchorId: '1',
      govActionType: 'ParameterChange',
      govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
      status: 'DROPPED',
      submitTime: new Date('2024-05-18 20:25:26.000'),
      endTime: new Date('2024-05-23T22:27:46.000Z'),
      txHash:
        '6A3319F5AC57551C4CABF77D0603BD6C72F44E9D10830363D87EB34CB43AFCB2',
    },
    {
      id: '3',
      votingAnchorId: '4',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
      status: 'DROPPED',
      submitTime: new Date('2024-05-18 14:29:22.000'),
      endTime: new Date('2024-05-23T22:27:46.000Z'),
      txHash:
        'B9532421430F6611C0170993E88DFA29B6AA0D4CCE024AD88346C59BE2B65B41',
    },
    {
      id: '22',
      votingAnchorId: '239',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
      status: 'DROPPED',
      submitTime: new Date('2024-05-26 04:02:39.000'),
      endTime: new Date('2024-05-31T22:29:15.000Z'),
      txHash:
        '2EC4AD524F0AF3EEB1F05C360BFDECF815936E7CBF8EAC9C07A4E0C7072D03D1',
    },
  ];

  const mockSecondGapRequestArray: GovActionProposalRequest[] = [
    {
      id: '5',
      votingAnchorId: '62',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://bit.ly/3zCH2HL',
      status: 'DROPPED',
      submitTime: new Date('2024-05-20 06:39:16.000'),
      endTime: new Date('2024-05-25T22:29:48.000Z'),
      txHash:
        'cef93aface365b575e1f33987fad4093e2a8a06d31c01a260e0e7db325fc0b50',
    },
    {
      id: '9',
      votingAnchorId: '239',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
      status: 'DROPPED',
      submitTime: new Date('2024-05-22 12:24:59.000'),
      endTime: new Date('2024-05-27T22:29:38.000Z'),
      txHash:
        '75d1c676f459f1192c7fd2c73423635a074c5e7b46497e00f44428861f460153',
    },
    {
      id: '10',
      votingAnchorId: '168',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'DROPPED',
      submitTime: new Date('2024-05-22 19:47:27.000'),
      endTime: new Date('2024-05-27T22:29:38.000Z'),
      txHash:
        '9bd2b6547ab8e8ed5c34049d6b984772a8352ac70e92198e1a7f6cdbb12d6397',
    },
    {
      id: '11',
      votingAnchorId: '168',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'DROPPED',
      submitTime: new Date('2024-05-22 21:44:26.000'),
      endTime: new Date('2024-05-27T22:29:38.000Z'),
      txHash:
        'f6ca72e9fe225c01e1a622d529ad807d668a786cb28d1eb352b8da58b66dd8c2',
    },
  ];

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
      voteMetadataUrl: 'https://vote-url-1.jsonld',
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
      voteMetadataUrl: 'https://vote-url-2.jsonld',
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
      voteMetadataUrl: 'https://vote-url-3.jsonld',
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

  const mockGapService = {
    getGovActionProposalIds: jest.fn(async () => {
      return null;
    }),
    getGovActionProposalDataFromDbSync: jest.fn(async () => {
      return undefined;
    }),
    getCronExpression: jest.fn(() => {
      return '*/5 * * * * *';
    }),
  };

  const mockGapProducer = {
    addToGovActionQueue: jest.fn(async () => {
      return {
        Queue: jest.fn().mockImplementation(() => {
          return {
            add: jest.fn(),
          };
        }),
      };
    }),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'GOV_ACTION_PROPOSALS_PER_PAGE':
          return 10;
        case 'HOT_ADDRESSES_PER_PAGE':
          return 10;
      }
    }),
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'GOV_ACTION_PROPOSALS_PER_PAGE':
          return 10;
        case 'HOT_ADDRESSES_PER_PAGE':
          return 10;
      }
    }),
  };

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
    getCronExpression: jest.fn(() => {
      return '*/5 * * * * *';
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
        GovernanceFacade,
        GovActionProposalProducer,
        SchedulerRegistry,
        {
          provide: GovActionProposalService,
          useValue: mockGapService,
        },
        {
          provide: GovActionProposalProducer,
          useValue: mockGapProducer,
        },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: VoteService,
          useValue: mockVoteService,
        },
        {
          provide: VoteProducer,
          useValue: mockVoteProducer,
        },
      ],
    }).compile();

    facade = module.get<GovernanceFacade>(GovernanceFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('syncGovActionProposalTable', () => {
    it('should add a job to queue with gov action proposal data', async () => {
      mockGapService.getGovActionProposalDataFromDbSync
        .mockImplementationOnce(async () => {
          return mockFirstGapRequestArray;
        })
        .mockImplementationOnce(async () => {
          return mockSecondGapRequestArray;
        });

      await facade.syncGovActionProposalTable();

      expect(mockConfigService.getOrThrow).toHaveBeenCalled();
      expect(
        mockGapService.getGovActionProposalDataFromDbSync,
      ).toHaveBeenCalledTimes(2);
      expect(mockGapProducer.addToGovActionQueue).toHaveBeenCalledTimes(2);
    });
    it(`should not add a job to queue if undefined was returned when calling remote DB`, async () => {
      try {
        await facade.syncGovActionProposalTable();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(
          `Cannot read properties of undefined (reading 'length')`,
        );
        expect(mockConfigService.getOrThrow).toHaveBeenCalled();
        expect(
          mockGapService.getGovActionProposalDataFromDbSync,
        ).toHaveBeenCalledTimes(1);
        expect(mockGapProducer.addToGovActionQueue).toHaveBeenCalledTimes(0);
      }
    });
    it('should not add a job to queue if an empty array was returned when fetching data from remote DB', async () => {
      mockGapService.getGovActionProposalDataFromDbSync.mockImplementationOnce(
        async () => {
          return [];
        },
      );

      await facade.syncGovActionProposalTable();

      expect(mockConfigService.getOrThrow).toHaveBeenCalled();
      expect(
        mockGapService.getGovActionProposalDataFromDbSync,
      ).toHaveBeenCalledTimes(1);
      expect(mockGapProducer.addToGovActionQueue).toHaveBeenCalledTimes(0);
    });
    it('should not add a job to queue if perPage variable is undefined when fetching data from remote DB', async () => {
      mockConfigService.getOrThrow.mockReturnValueOnce(undefined);

      try {
        await facade.syncGovActionProposalTable();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(
          `Cannot read properties of undefined (reading 'length')`,
        );
        expect(mockConfigService.getOrThrow).toHaveBeenCalled();
        expect(
          mockGapService.getGovActionProposalDataFromDbSync,
        ).toHaveBeenCalledTimes(1);
        expect(mockGapProducer.addToGovActionQueue).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('syncVotesTable', () => {
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
      expect(mockVoteService.countHotAddressPages).toHaveBeenCalled();
      expect(mockVoteService.getMapHotAddresses).toHaveBeenCalledTimes(1);
      expect(mockVoteService.getVoteDataFromDbSync).toHaveBeenCalledTimes(1);
      expect(mockVoteProducer.addToVoteQueue).toHaveBeenCalledTimes(1);
    });

    it(`should not add a job to queue if no hot addresses exist in database`, async () => {
      jest
        .spyOn(mockVoteService, 'countHotAddressPages')
        .mockResolvedValue(undefined);

      await facade.syncVotesTable();

      expect(mockVoteService.countHotAddressPages).toHaveBeenCalledTimes(1);
      expect(mockVoteService.getMapHotAddresses).not.toHaveBeenCalled();
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
