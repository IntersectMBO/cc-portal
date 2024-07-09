import { Test, TestingModule } from '@nestjs/testing';
import { GovActionProposalService } from './gov-action-proposal.service';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GovActionProposalRequest } from '../dto/gov-action-proposal.request';
import { InternalServerErrorException } from '@nestjs/common';
import { SQL_FILE_PATH } from '../../common/constants/sql.constants';

const mockPerPage = 10;
const mockOffset = 0;

// 10 elements in this array
const mockFirstGapRequestArray: GovActionProposalRequest[] = [
  {
    id: '1',
    votingAnchorId: '1',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
    status: 'DROPPED',
    endTime: '2024-05-22T22:29:33.000Z',
    txHash: '69aa81f4aa0140e8d2ab2b6642c403611cd730fab42e6c9f9e3e15d6d90bd3e9',
    submitTime: '2024-05-17T10:56:00.000Z',
  },
  {
    id: '2',
    votingAnchorId: '2',
    govActionType: 'HardForkInitiation',
    govMetadataUrl:
      'https://github.com/carloslodelar/proposals/blob/main/why-hardfork-to-10.txt',
    status: 'DROPPED',
    endTime: '2024-05-22T22:29:33.000Z',
    txHash: 'edef927af962664ed7a02bedfa913c7f1cd271494871c25ee7de66e941d83c79',
    submitTime: '2024-05-17T14:15:34.000Z',
  },
  {
    id: '3',
    votingAnchorId: '4',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
    status: 'DROPPED',
    endTime: '2024-05-23T22:27:46.000Z',
    txHash: 'b9532421430f6611c0170993e88dfa29b6aa0d4cce024ad88346c59be2b65b41',
    submitTime: '2024-05-18T12:29:22.000Z',
  },
  {
    id: '4',
    votingAnchorId: '1',
    govActionType: 'ParameterChange',
    govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
    status: 'DROPPED',
    endTime: '2024-05-23T22:27:46.000Z',
    txHash: '6a3319f5ac57551c4cabf77d0603bd6c72f44e9d10830363d87eb34cb43afcb2',
    submitTime: '2024-05-18T18:25:26.000Z',
  },
  {
    id: '5',
    votingAnchorId: '62',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://bit.ly/3zCH2HL',
    status: 'DROPPED',
    endTime: '2024-05-25T22:29:48.000Z',
    txHash: 'cef93aface365b575e1f33987fad4093e2a8a06d31c01a260e0e7db325fc0b50',
    submitTime: '2024-05-20T04:39:16.000Z',
  },
  {
    id: '6',
    votingAnchorId: '168',
    govActionType: 'InfoAction',
    govMetadataUrl:
      'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    status: 'DROPPED',
    endTime: '2024-05-26T22:29:45.000Z',
    txHash: 'd775fbcb6006524abbffe6daf538e71941745b44a3a735852fbbd49fd7d59a95',
    submitTime: '2024-05-21T13:18:06.000Z',
  },
  {
    id: '7',
    votingAnchorId: '168',
    govActionType: 'InfoAction',
    govMetadataUrl:
      'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    status: 'DROPPED',
    endTime: '2024-05-26T22:29:45.000Z',
    txHash: 'db4dbeb5946e5d49778f457d9c5a460488c40af0b93d8b98111f5be11bf165a6',
    submitTime: '2024-05-21T15:08:38.000Z',
  },
  {
    id: '8',
    votingAnchorId: '216',
    govActionType: 'HardForkInitiation',
    govMetadataUrl:
      '1111111111111111111111111111111111111111111111111111111111111111',
    status: 'DROPPED',
    endTime: '2024-05-27T22:29:38.000Z',
    txHash: '67820c121787464a9b670cf4c648f67cabd9573eb71b220214971ce467d25027',
    submitTime: '2024-05-22T08:08:20.000Z',
  },
  {
    id: '9',
    votingAnchorId: '239',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
    status: 'DROPPED',
    endTime: '2024-05-27T22:29:38.000Z',
    txHash: '75d1c676f459f1192c7fd2c73423635a074c5e7b46497e00f44428861f460153',
    submitTime: '2024-05-22T10:24:59.000Z',
  },
  {
    id: '10',
    votingAnchorId: '168',
    govActionType: 'InfoAction',
    govMetadataUrl:
      'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    status: 'DROPPED',
    endTime: '2024-05-27T22:29:38.000Z',
    txHash: '9bd2b6547ab8e8ed5c34049d6b984772a8352ac70e92198e1a7f6cdbb12d6397',
    submitTime: '2024-05-22T17:47:27.000Z',
  },
];

// 10 elements in this array
const mockFirstGAPEntityArray: GovActionProposal[] = [
  {
    id: '6',
    votingAnchorId: '168',
    govActionType: 'InfoAction',
    govMetadataUrl:
      'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: 'D775FBCB6006524ABBFFE6DAF538E71941745B44A3A735852FBBD49FD7D59A95',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '7',
    votingAnchorId: '168',
    govActionType: 'InfoAction',
    govMetadataUrl:
      'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: 'DB4DBEB5946E5D49778F457D9C5A460488C40AF0B93D8B98111F5BE11BF165A6',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '8',
    votingAnchorId: '216',
    govActionType: 'InfoAction',
    govMetadataUrl:
      '1111111111111111111111111111111111111111111111111111111111111111',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: null,
    txHash: '67820C121787464A9B670CF4C648F67CABD9573EB71B220214971CE467D25027',
    title: null,
    abstract: null,
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '1',
    votingAnchorId: '1',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: '69AA81F4AA0140E8D2AB2B6642C403611CD730FAB42E6C9F9E3E15D6D90BD3E9',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '2',
    votingAnchorId: '2',
    govActionType: 'InfoAction',
    govMetadataUrl:
      'https://github.com/carloslodelar/proposals/blob/main/why-hardfork-to-10.txt',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: 'EDEF927AF962664ED7A02BEDFA913C7F1CD271494871C25EE7DE66E941D83C79',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '23',
    votingAnchorId: '517',
    govActionType: 'TreasuryWithdrawals',
    govMetadataUrl:
      'https://raw.githubusercontent.com/Sworzen1/Testing-Todo-app/main/Treasury.jsonld',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: '2C2F01F6818CEE5E2EC29EF965DF347099173707BAFCEFC7F6FE3D66CD5F66EC',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '24',
    votingAnchorId: '658',
    govActionType: 'NoConfidence',
    govMetadataUrl:
      'https://raw.githubusercontent.com/Ryun1/metadata/main/cip100/ga.jsonld',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: '3B15AC25580564C8C565121188B142BEE99F6AAD7D4130FFC6A5A764EBA1159A',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '4',
    votingAnchorId: '1',
    govActionType: 'ParameterChange',
    govMetadataUrl: 'https://my-ip.at/test/cip-0100.common.json',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: '6A3319F5AC57551C4CABF77D0603BD6C72F44E9D10830363D87EB34CB43AFCB2',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '3',
    votingAnchorId: '4',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
    txHash: 'B9532421430F6611C0170993E88DFA29B6AA0D4CCE024AD88346C59BE2B65B41',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '22',
    votingAnchorId: '239',
    govActionType: 'InfoAction',
    govMetadataUrl: 'https://metadata.cardanoapi.io/data/Info',
    status: 'DROPPED',
    submitTime: new Date('2024-05-21 15:18:06.000'),
    endTime: new Date('2024-05-26T22:29:45.000Z'),
    txHash: '2EC4AD524F0AF3EEB1F05C360BFDECF815936E7CBF8EAC9C07A4E0C7072D03D1',
    title: 'test',
    abstract: 'test',
    createdAt: null,
    updatedAt: null,
  },
];

// 10 elements in this array
const mockFirstGAPDbData: object[] = [
  {
    id: '1',
    type: 'InfoAction',
    end_time: '2024-05-22T22:29:33.000Z',
    voting_anchor_id: '1',
    url: 'https://my-ip.at/test/cip-0100.common.json',
    hash: new Uint8Array([
      105, 170, 129, 244, 170, 1, 64, 232, 210, 171, 43, 102, 66, 196, 3, 97,
      28, 215, 48, 250, 180, 46, 108, 159, 158, 62, 21, 214, 217, 11, 211, 233,
    ]),
    time: '2024-05-17T10:56:00.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '2',
    type: 'HardForkInitiation',
    end_time: '2024-05-22T22:29:33.000Z',
    voting_anchor_id: '2',
    url: 'https://github.com/carloslodelar/proposals/blob/main/why-hardfork-to-10.txt',
    hash: new Uint8Array([
      237, 239, 146, 122, 249, 98, 102, 78, 215, 160, 43, 237, 250, 145, 60,
      127, 28, 210, 113, 73, 72, 113, 194, 94, 231, 222, 102, 233, 65, 216, 60,
      121,
    ]),
    time: '2024-05-17T14:15:34.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '3',
    type: 'InfoAction',
    end_time: '2024-05-23T22:27:46.000Z',
    voting_anchor_id: '4',
    url: 'https://metadata.cardanoapi.io/data/Info',
    hash: new Uint8Array([
      185, 83, 36, 33, 67, 15, 102, 17, 192, 23, 9, 147, 232, 141, 250, 41, 182,
      170, 13, 76, 206, 2, 74, 216, 131, 70, 197, 155, 226, 182, 91, 65,
    ]),
    time: '2024-05-18T12:29:22.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '4',
    type: 'ParameterChange',
    end_time: '2024-05-23T22:27:46.000Z',
    voting_anchor_id: '1',
    url: 'https://my-ip.at/test/cip-0100.common.json',
    hash: new Uint8Array([
      106, 51, 25, 245, 172, 87, 85, 28, 76, 171, 247, 125, 6, 3, 189, 108, 114,
      244, 78, 157, 16, 131, 3, 99, 216, 126, 179, 76, 180, 58, 252, 178,
    ]),
    time: '2024-05-18T18:25:26.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '5',
    type: 'InfoAction',
    end_time: '2024-05-25T22:29:48.000Z',
    voting_anchor_id: '62',
    url: 'https://bit.ly/3zCH2HL',
    hash: new Uint8Array([
      206, 249, 58, 250, 206, 54, 91, 87, 94, 31, 51, 152, 127, 173, 64, 147,
      226, 168, 160, 109, 49, 192, 26, 38, 14, 14, 125, 179, 37, 252, 11, 80,
    ]),
    time: '2024-05-20T04:39:16.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '6',
    type: 'InfoAction',
    end_time: '2024-05-26T22:29:45.000Z',
    voting_anchor_id: '168',
    url: 'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    hash: new Uint8Array([
      215, 117, 251, 203, 96, 6, 82, 74, 187, 255, 230, 218, 245, 56, 231, 25,
      65, 116, 91, 68, 163, 167, 53, 133, 47, 187, 212, 159, 215, 213, 154, 149,
    ]),
    time: '2024-05-21T13:18:06.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '7',
    type: 'InfoAction',
    end_time: '2024-05-26T22:29:45.000Z',
    voting_anchor_id: '168',
    url: 'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    hash: new Uint8Array([
      219, 77, 190, 181, 148, 110, 93, 73, 119, 143, 69, 125, 156, 90, 70, 4,
      136, 196, 10, 240, 185, 61, 139, 152, 17, 31, 91, 225, 27, 241, 101, 166,
    ]),
    time: '2024-05-21T15:08:38.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '8',
    type: 'HardForkInitiation',
    end_time: '2024-05-27T22:29:38.000Z',
    voting_anchor_id: '216',
    url: '1111111111111111111111111111111111111111111111111111111111111111',
    hash: new Uint8Array([
      103, 130, 12, 18, 23, 135, 70, 74, 155, 103, 12, 244, 198, 72, 246, 124,
      171, 217, 87, 62, 183, 27, 34, 2, 20, 151, 28, 228, 103, 210, 80, 39,
    ]),
    time: '2024-05-22T08:08:20.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '9',
    type: 'InfoAction',
    end_time: '2024-05-27T22:29:38.000Z',
    voting_anchor_id: '239',
    url: 'https://metadata.cardanoapi.io/data/Info',
    hash: new Uint8Array([
      117, 209, 198, 118, 244, 89, 241, 25, 44, 127, 210, 199, 52, 35, 99, 90,
      7, 76, 94, 123, 70, 73, 126, 0, 244, 68, 40, 134, 31, 70, 1, 83,
    ]),
    time: '2024-05-22T10:24:59.000Z',
    epoch_status: 'DROPPED',
  },
  {
    id: '10',
    type: 'InfoAction',
    end_time: '2024-05-27T22:29:38.000Z',
    voting_anchor_id: '168',
    url: 'https://raw.githubusercontent.com/mpawel79/testrepo/master/Info.jsonld',
    hash: new Uint8Array([
      155, 210, 182, 84, 122, 184, 232, 237, 92, 52, 4, 157, 107, 152, 71, 114,
      168, 53, 42, 199, 14, 146, 25, 142, 26, 127, 108, 219, 177, 45, 99, 151,
    ]),
    time: '2024-05-22T17:47:27.000Z',
    epoch_status: 'DROPPED',
  },
];

const mockGAPRepository = {
  save: jest.fn((govActionProposals: GovActionProposal[]) => {
    if (govActionProposals === mockFirstGAPEntityArray) {
      return mockFirstGAPEntityArray;
    }
    throw new InternalServerErrorException('Transaction failed');
  }),
};
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
describe('GovActionProposalService', () => {
  let service: GovActionProposalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovActionProposalService,
        {
          provide: 'db-syncDataSource',
          useValue: {},
        },
        {
          provide: getRepositoryToken(GovActionProposal),
          useValue: mockGAPRepository,
        },
        { provide: EntityManager, useValue: mockEntityManager },
      ],
    }).compile();
    service = module.get<GovActionProposalService>(GovActionProposalService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('storeGovActionProposalData', () => {
    it('should store GAP data in database', async () => {
      /* The reason I stored service's prototype is to access prepareGovActionProposals private method
      in order to mock it. That way I can avoid calling axios (don't want the test to depend on Internet connection) */
      const proto = Object.getPrototypeOf(service);
      jest
        .spyOn(proto, 'prepareGovActionProposals')
        .mockResolvedValue(mockFirstGAPEntityArray);

      await service.storeGovActionProposalData(mockFirstGapRequestArray);

      expect(mockEntityManager.transaction).toHaveBeenCalled();
      expect(mockGAPRepository.save).toHaveBeenCalledWith(
        mockFirstGAPEntityArray,
      );
    });
    it('should not store invalid GAP data to database and it should throw an error', async () => {
      const invalidGapRequestArray: any[] = [
        {
          qwe: 'aaaaa',
        },
      ];
      /* The reason I stored service's prototype is to access prepareGovActionProposals private method
      in order to mock it. That way I can avoid calling axios (don't want the test to depend on Internet connection) */
      const proto = Object.getPrototypeOf(service);
      jest
        .spyOn(proto, 'prepareGovActionProposals')
        .mockResolvedValue(invalidGapRequestArray);

      try {
        await service.storeGovActionProposalData(mockFirstGapRequestArray);
      } catch (e) {
        expect(mockEntityManager.transaction).toHaveBeenCalled();
        expect(mockGAPRepository.save).toHaveBeenCalledWith(
          invalidGapRequestArray,
        );
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe('Transaction failed');
      }
    });
    it(`should throw an error if 'undefined' is passed to the save method`, async () => {
      /* The reason I stored service's prototype is to access prepareGovActionProposals private method
      in order to mock it. That way I can avoid calling axios (don't want the test to depend on Internet connection) */
      const proto = Object.getPrototypeOf(service);
      jest
        .spyOn(proto, 'prepareGovActionProposals')
        .mockResolvedValue(undefined);

      try {
        await service.storeGovActionProposalData(mockFirstGapRequestArray);
      } catch (e) {
        expect(mockEntityManager.transaction).toHaveBeenCalled();
        expect(mockGAPRepository.save).toHaveBeenCalledWith(undefined);
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e.message).toBe('Transaction failed');
      }
    });
  });

  describe('getGovActionProposalDataFromDbSync', () => {
    it('should return GAP data from remote DB if there is any', async () => {
      const mockGetPaginatedDataFromSqlFIle = jest
        .spyOn(service, 'getPaginatedDataFromSqlFile')
        .mockResolvedValue(mockFirstGAPDbData);

      const result = await service.getGovActionProposalDataFromDbSync(
        mockPerPage,
        mockOffset,
      );

      expect(mockGetPaginatedDataFromSqlFIle).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_DATA,
        mockPerPage,
        mockOffset,
      );
      expect(result).toEqual(mockFirstGapRequestArray);
    });
    it('should return an empty array if there is no GAP data in remote DB', async () => {
      const mockEmptyArray: object[] = [];
      const mockGetPaginatedDataFromSqlFIle = jest
        .spyOn(service, 'getPaginatedDataFromSqlFile')
        .mockResolvedValue(mockEmptyArray);

      const result = await service.getGovActionProposalDataFromDbSync(
        mockPerPage,
        mockOffset,
      );

      expect(mockGetPaginatedDataFromSqlFIle).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_DATA,
        mockPerPage,
        mockOffset,
      );
      expect(result).toEqual(mockEmptyArray);
    });
    it('should throw an error when mapping non-GAP data fetched from remote DB', async () => {
      const randomDataArray: object[] = [
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

      const mockGetPaginatedDataFromSqlFIle = jest
        .spyOn(service, 'getPaginatedDataFromSqlFile')
        .mockResolvedValue(randomDataArray);

      await expect(
        service.getGovActionProposalDataFromDbSync(mockPerPage, mockOffset),
      ).rejects.toThrow(
        new TypeError(
          'The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined',
        ),
      );
      expect(mockGetPaginatedDataFromSqlFIle).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_DATA,
        mockPerPage,
        mockOffset,
      );
    });
    it(`should throw an error when mapping 'undefined' value after trying to fetch data from remote DB `, async () => {
      const mockGetPaginatedDataFromSqlFIle = jest
        .spyOn(service, 'getPaginatedDataFromSqlFile')
        .mockResolvedValue(undefined);

      await expect(
        service.getGovActionProposalDataFromDbSync(mockPerPage, mockOffset),
      ).rejects.toThrow(
        new TypeError(
          `Cannot read properties of undefined (reading 'forEach')`,
        ),
      );

      expect(mockGetPaginatedDataFromSqlFIle).toHaveBeenCalledWith(
        SQL_FILE_PATH.GET_GOV_ACTION_PROPOSALS_DATA,
        mockPerPage,
        mockOffset,
      );
      // expect(result).toEqual(mockEmptyArray);
    });
  });
});
