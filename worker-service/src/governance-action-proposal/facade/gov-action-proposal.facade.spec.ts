import { Test, TestingModule } from '@nestjs/testing';
import { GovActionProposalFacade } from './gov-action-proposal.facade';
import { GovActionProposalService } from '../services/gov-action-proposal.service';
import { GovActionProposalProducer } from '../gov-action-proposal.producer';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';

describe('GovActionProposalFacade', () => {
  let facade: GovActionProposalFacade;

  // 10 elements in this array
  const mockFirstGapRequestArray: GovActionProposalRequest[] = [
    {
      id: '6',
      votingAnchorId: '168',
      govActionType: 'InfoAction',
      govMetadataUrl:
        'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
      status: 'DROPPED',
      submitTime: '2024-05-21 15:18:06.000',
      endTime: '2024-05-26T22:29:45.000Z',
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
      submitTime: '2024-05-21 17:08:38.000',
      endTime: '2024-05-26T22:29:45.000Z',
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
      submitTime: '2024-05-22 10:08:20.000',
      endTime: '2024-05-27T22:29:38.000Z',
      txHash:
        '67820C121787464A9B670CF4C648F67CABD9573EB71B220214971CE467D25027',
    },
    {
      id: '1',
      votingAnchorId: '1',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
      status: 'DROPPED',
      submitTime: '2024-05-17 12:56:00.000',
      endTime: '2024-05-17 12:56:00.000',
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
      submitTime: '2024-05-17 16:15:34.000',
      endTime: '2024-05-22T22:29:33.000Z',
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
      submitTime: '2024-05-27 09:19:00.000',
      endTime: '2024-06-01T22:29:51.000Z',
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
      submitTime: '2024-05-27 20:34:28.000',
      endTime: '2024-06-01T22:29:51.000Z',
      txHash:
        '3B15AC25580564C8C565121188B142BEE99F6AAD7D4130FFC6A5A764EBA1159A',
    },
    {
      id: '4',
      votingAnchorId: '1',
      govActionType: 'ParameterChange',
      govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
      status: 'DROPPED',
      submitTime: '2024-05-18 20:25:26.000',
      endTime: '2024-05-23T22:27:46.000Z',
      txHash:
        '6A3319F5AC57551C4CABF77D0603BD6C72F44E9D10830363D87EB34CB43AFCB2',
    },
    {
      id: '3',
      votingAnchorId: '4',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
      status: 'DROPPED',
      submitTime: '2024-05-18 14:29:22.000',
      endTime: '2024-05-23T22:27:46.000Z',
      txHash:
        'B9532421430F6611C0170993E88DFA29B6AA0D4CCE024AD88346C59BE2B65B41',
    },
    {
      id: '22',
      votingAnchorId: '239',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
      status: 'DROPPED',
      submitTime: '2024-05-26 04:02:39.000',
      endTime: '2024-05-31T22:29:15.000Z',
      txHash:
        '2EC4AD524F0AF3EEB1F05C360BFDECF815936E7CBF8EAC9C07A4E0C7072D03D1',
    },
  ];

  // 4 elements in this array
  const mockSecondGapRequestArray: GovActionProposalRequest[] = [
    {
      id: '5',
      votingAnchorId: '62',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://bit.ly/3zCH2HL',
      status: 'DROPPED',
      submitTime: '2024-05-20 06:39:16.000',
      endTime: '2024-05-25T22:29:48.000Z',
      txHash:
        'cef93aface365b575e1f33987fad4093e2a8a06d31c01a260e0e7db325fc0b50',
    },
    {
      id: '9',
      votingAnchorId: '239',
      govActionType: 'InfoAction',
      govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
      status: 'DROPPED',
      submitTime: '2024-05-22 12:24:59.000',
      endTime: '2024-05-27T22:29:38.000Z',
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
      submitTime: '2024-05-22 19:47:27.000',
      endTime: '2024-05-27T22:29:38.000Z',
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
      submitTime: '2024-05-22 21:44:26.000',
      endTime: '2024-05-27T22:29:38.000Z',
      txHash:
        'f6ca72e9fe225c01e1a622d529ad807d668a786cb28d1eb352b8da58b66dd8c2',
    },
  ];

  const mockGovActionProposalService = {
    getGovActionProposalIds: jest.fn(async () => {
      return null;
    }),
    getGovActionProposalDataFromDbSync: jest.fn(async () => {
      return undefined;
    }),
  };

  const mockGovActionProposalProducer = {
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
      }
    }),
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'GOV_ACTION_PROPOSALS_PER_PAGE':
          return 10;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovActionProposalFacade,
        GovActionProposalProducer,
        SchedulerRegistry,
        {
          provide: GovActionProposalService,
          useValue: mockGovActionProposalService,
        },
        {
          provide: GovActionProposalProducer,
          useValue: mockGovActionProposalProducer,
        },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    facade = module.get<GovActionProposalFacade>(GovActionProposalFacade);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('syncGovActionProposalTable', () => {
    it('should add a job to queue with gov action proposal data', async () => {
      mockGovActionProposalService.getGovActionProposalDataFromDbSync
        .mockImplementationOnce(async () => {
          return mockFirstGapRequestArray;
        })
        .mockImplementationOnce(async () => {
          return mockSecondGapRequestArray;
        });

      await facade.syncGovActionProposalTable();

      expect(mockConfigService.getOrThrow).toHaveBeenCalled();
      expect(
        mockGovActionProposalService.getGovActionProposalDataFromDbSync,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockGovActionProposalProducer.addToGovActionQueue,
      ).toHaveBeenCalledTimes(2);
    });
    it(`should not add a job to queue if 'undefined' was returned when calling remote DB`, async () => {
      try {
        await facade.syncGovActionProposalTable();
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
        expect(e.message).toBe(
          `Cannot read properties of undefined (reading 'length')`,
        );
        expect(mockConfigService.getOrThrow).toHaveBeenCalled();
        expect(
          mockGovActionProposalService.getGovActionProposalDataFromDbSync,
        ).toHaveBeenCalledTimes(1);
        expect(
          mockGovActionProposalProducer.addToGovActionQueue,
        ).toHaveBeenCalledTimes(0);
      }
    });
    it('should not add a job to queue if an empty array was returned when fetching data from remote DB', async () => {
      mockGovActionProposalService.getGovActionProposalDataFromDbSync.mockImplementationOnce(
        async () => {
          return [];
        },
      );

      await facade.syncGovActionProposalTable();

      expect(mockConfigService.getOrThrow).toHaveBeenCalled();
      expect(
        mockGovActionProposalService.getGovActionProposalDataFromDbSync,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockGovActionProposalProducer.addToGovActionQueue,
      ).toHaveBeenCalledTimes(0);
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
          mockGovActionProposalService.getGovActionProposalDataFromDbSync,
        ).toHaveBeenCalledTimes(1);
        expect(
          mockGovActionProposalProducer.addToGovActionQueue,
        ).toHaveBeenCalledTimes(0);
      }
    });
  });
});
