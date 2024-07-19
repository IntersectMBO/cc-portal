import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceFacade } from './governance.facade';
import { GovernanceService } from '../services/governance.service';
import { UsersService } from 'src/users/services/users.service';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { NotFoundException } from '@nestjs/common';
import { GovernanceActionProposalResponse } from '../api/response/gov-action-proposal.response';
import { ReasoningRequest } from '../api/request/reasoning.request';
import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { GovernanceMapper } from '../mapper/governance-mapper';
import { PaginateQuery } from 'nestjs-paginate';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { VoteDto } from '../dto/vote.dto';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { VoteValue } from '../enums/vote-value.enum';
import { UserPhotoDto } from '../dto/user-photo.dto';
import { User } from 'src/users/entities/user.entity';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';
import { UserMapper } from 'src/users/mapper/userMapper.mapper';
import { VoteStatus } from '../enums/vote-status.enum';
import { ReasoningDto } from '../dto/reasoning.dto';

describe('GovernanceFacade', () => {
  let facade: GovernanceFacade;

  const mockUsers: User[] = [
    {
      id: 'mockedId',
      name: 'John Doe',
      email: 'mockedEmail',
      hotAddresses: [],
      description: 'mockedDescription',
      profilePhotoUrl: 'mockedProfilePhoto',
      status: UserStatusEnum.ACTIVE,
      role: null,
      permissions: [],
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 'mockedId2',
      name: 'Sofija',
      email: 'sofija@gmail.com',
      hotAddresses: [],
      description: 'mockedDescription2',
      profilePhotoUrl: 'mockedProfilePhoto2',
      status: UserStatusEnum.ACTIVE,
      role: null,
      permissions: [],
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockGovActionProposalDtos: GovActionProposalDto[] = [
    {
      id: '1',
      txHash: 'f13dbc835a0f82f25fae62e8fe716e4c6e46ed0ed28',
      title: 'Title 1',
      abstract: 'Abstract 1',
      metadataUrl: 'metadataUrl1',
      type: 'Type 1',
      status: GovActionProposalStatus.ACTIVE,
      voteStatus: VoteStatus.Voted,
      hasReasoning: null,
      submitTime: null,
      endTime: null,
    },
    {
      id: '2',
      txHash: 'f41007d4d46f5bfba56ce657fec68ba0ff42623559',
      title: 'Title 2',
      abstract: 'Abstract 2',
      metadataUrl: 'metadataUrl2',
      type: 'Type 1',
      status: GovActionProposalStatus.ACTIVE,
      voteStatus: VoteStatus.Pending,
      hasReasoning: null,
      submitTime: null,
      endTime: null,
    },
  ];

  const mockGovActionProposalResponse: GovernanceActionProposalResponse[] = [
    {
      id: '1',
      txHash: 'f13dbc835a0f82f25fae62e8fe716e4c6e46ed0ed28',
      title: 'Title 1',
      abstract: 'Abstract 1',
      metadataUrl: 'metadataUrl1',
      status: GovActionProposalStatus.ACTIVE,
      type: 'Type 1',
      submitTime: null,
      endTime: null,
    },
    {
      id: '2',
      txHash: 'f41007d4d46f5bfba56ce657fec68ba0ff42623559',
      title: 'Title 2',
      abstract: 'Abstract 2',
      metadataUrl: 'metadataUrl2',
      status: GovActionProposalStatus.ACTIVE,
      type: 'Type 1',
      submitTime: null,
      endTime: null,
    },
  ];

  const mockReasoningRequest: ReasoningRequest = {
    title: 'Reasoning title',
    content: 'Reasoning content',
  };

  const mockReasoningJson = {
    govActionProposalHash: mockGovActionProposalDtos[0].txHash,
    title: mockReasoningRequest.title,
    content: mockReasoningRequest.content,
  };

  const mockIpfsContentDto: IpfsContentDto = {
    blake2b: 'blake2b_example',
    cid: 'cid_example',
    url: 'ipfs_url_example',
    title: mockReasoningRequest.title,
    contents: mockReasoningRequest.content,
  };

  const mockGovActionProposals: GovActionProposal[] = [
    {
      id: 'govActionProposal_1',
      txHash: 'f13dbc835a0f82f25fae62e8fe716e4c6e46ed0ed28',
      govActionType: 'Type 1',
      votingAnchorId: 'votingAnchor_1',
      title: 'govActionProposal_Title',
      abstract: 'govActionProposal_Abstract_1',
      govMetadataUrl: 'govMetadataUrl_1',
      status: GovActionProposalStatus.ACTIVE,
      submitTime: null,
      endTime: null,
      votes: null,
      reasonings: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 'govActionProposal_2',
      txHash: 'f41007d4d46f5bfba56ce657fec68ba0ff42623559',
      govActionType: 'Type 1',
      votingAnchorId: 'votingAnchor_2',
      title: 'govActionProposal_Title_2',
      abstract: 'govActionProposal_Abstract_2',
      govMetadataUrl: 'govMetadataUrl_2',
      status: GovActionProposalStatus.ACTIVE,
      submitTime: null,
      endTime: null,
      votes: null,
      reasonings: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const mockVotes: VoteDto[] = [
    {
      id: 'Vote_1',
      userId: 'User_1',
      userName: 'Test user 1',
      userAddress: 'hotAddress_1',
      userPhotoUrl: 'photoUrl',
      voteValue: VoteValue.Yes,
      reasoningTitle: 'Title_1',
      reasoningComment: 'Comment_1',
      govActionProposalId: mockGovActionProposals[0].id,
      govActionProposalTxHash: mockGovActionProposals[0].txHash,
      govActionProposalTitle: mockGovActionProposals[0].title,
      govActionProposalType: 'govActionType_1',
      govActionProposalStatus: GovActionProposalStatus.ACTIVE,
      govActionProposalEndTime: null,
      voteSubmitTime: null,
    },
    {
      id: 'Vote_2',
      userId: 'User_1',
      userName: 'Test user 1',
      userAddress: 'hotAddress_1',
      userPhotoUrl: 'photoUrl',
      voteValue: VoteValue.Yes,
      reasoningTitle: 'Title_2',
      reasoningComment: 'Comment_2',
      govActionProposalId: mockGovActionProposals[1].id,
      govActionProposalTxHash: mockGovActionProposals[1].txHash,
      govActionProposalTitle: mockGovActionProposals[1].title,
      govActionProposalType: 'govActionType_2',
      govActionProposalStatus: GovActionProposalStatus.ACTIVE,
      govActionProposalEndTime: null,
      voteSubmitTime: null,
    },
  ];

  const mockReasoningDtos: ReasoningDto[] = [
    {
      userId: mockUsers[0].id,
      govActionProposalId: mockGovActionProposals[0].id,
      title: 'Reasoning title 1',
      content: 'Reasoning content 1',
      cid: 'cid1',
      blake2b: 'blake2b1',
      url: 'http://test.com',
      json: 'some json as string',
    },
    {
      userId: mockUsers[0].id,
      govActionProposalId: mockGovActionProposals[1].id,
      title: 'Reasoning title 2',
      content: 'Reasoning content 2',
      cid: 'cid2',
      blake2b: 'blake2b2',
      url: 'http://test.com',
      json: 'some json as string',
    },
  ];

  const mockUserDataMap = new Map() as jest.Mocked<Map<string, UserPhotoDto>>;
  mockUserDataMap.set('User_1', new UserPhotoDto('Test user 1', 'photoUrl'));

  const mockGovernanceService = {
    findGovProposalById: jest.fn().mockImplementation((id) => {
      let foundGovActionProposal: GovActionProposalDto;
      mockGovActionProposalDtos.forEach((item) => {
        if (id === item.id) {
          foundGovActionProposal = item;
        }
      });
      if (!foundGovActionProposal) {
        return new NotFoundException(
          `Gov action proposal with id ${id} not found`,
        );
      }
      return foundGovActionProposal;
    }),
    findReasoningForUserByProposalId: jest
      .fn()
      .mockImplementation((userId, proposalId) => {
        let foundReasoning: ReasoningDto;
        mockReasoningDtos.forEach((item) => {
          if (
            userId === item.userId &&
            proposalId === item.govActionProposalId
          ) {
            foundReasoning = item;
          }
        });
        if (!foundReasoning) {
          return new NotFoundException(`Reasoning not found`);
        }
        return foundReasoning;
      }),
    addReasoning: jest.fn(),
    searchGovVotes: jest
      .fn()
      .mockImplementation((query: PaginateQuery, userId?: string) => {
        let filteredVotes = mockVotes;

        if (query.search) {
          const searchTerm = query.search.toLowerCase();
          filteredVotes = filteredVotes.filter(
            (vote) =>
              vote.reasoningTitle.toLowerCase().includes(searchTerm) ||
              vote.reasoningComment.toLowerCase().includes(searchTerm),
          );
        }

        if (userId) {
          filteredVotes = filteredVotes.filter(
            (vote) => vote.userId === userId,
          );
        }
        const skip = query.page * query.limit;
        const startPosition = query.page * query.limit;
        const paginatedVotes = filteredVotes.slice(
          startPosition,
          startPosition + query.limit,
        );

        const votesPaginatedDto: PaginatedDto<VoteDto> = {
          items: paginatedVotes,
          itemCount: paginatedVotes.length,
          pageOptions: {
            page: query.page,
            perPage: query.limit,
            skip: skip,
          },
        };

        return votesPaginatedDto;
      }),
    searchGovActionProposals: jest
      .fn()
      .mockImplementation((query: PaginateQuery, userId?: string) => {
        let filteredGovActionProposals = mockGovActionProposalDtos;

        if (query.search) {
          const searchTerm = query.search.toLowerCase();
          filteredGovActionProposals = filteredGovActionProposals.filter(
            (gap) =>
              gap.title.toLowerCase().includes(searchTerm) ||
              gap.txHash.toLowerCase().includes(searchTerm),
          );
        }

        if (userId === 'NotExistingUser') {
          filteredGovActionProposals = [];
        }

        const skip = query.page * query.limit;
        const startPosition = query.page * query.limit;
        const paginatedGAPs = filteredGovActionProposals.slice(
          startPosition,
          startPosition + query.limit,
        );

        const votesPaginatedDto: PaginatedDto<GovActionProposalDto> = {
          items: paginatedGAPs,
          itemCount: paginatedGAPs.length,
          pageOptions: {
            page: query.page,
            perPage: query.limit,
            skip: skip,
          },
        };

        return votesPaginatedDto;
      }),
  };
  const mockUsersService = {
    findMultipleByIds: jest.fn().mockImplementation(async (ids: string[]) => {
      const users = mockUsers.filter((user) => ids.includes(user.id));
      return users.map((user) => UserMapper.userToDto(user));
    }),
  };
  const mockIpfsService = {
    addReasoningToIpfs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceFacade,
        {
          provide: GovernanceService,
          useValue: mockGovernanceService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: IpfsService,
          useValue: mockIpfsService,
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

  describe('Find a Governance Action Proposal', () => {
    it('should find a Governance Action Proposal by ID', async () => {
      const id = '1';
      const govActionProposal = await facade.findGovActionProposalById(id);
      expect(mockGovernanceService.findGovProposalById).toHaveBeenCalled();
      expect(govActionProposal).toEqual(mockGovActionProposalResponse[0]);
    });
    it('should not return a Governance Action Proposal by ID', async () => {
      const id = 'wrong-id';
      try {
        await facade.findGovActionProposalById(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Gov action proposal with id ${id} not found`);
      }
    });
  });

  describe('Get Reasoning by User ID and Governance Action Proposal ID', () => {
    it('should find a Reasoning by User ID and Governance Action Proposal by ID', async () => {
      const userId = mockReasoningDtos[0].userId;
      const proposalId = mockGovActionProposals[0].id;
      const reasoning = await facade.getReasoning(userId, proposalId);
      expect(
        mockGovernanceService.findReasoningForUserByProposalId,
      ).toHaveBeenCalledWith(userId, proposalId);
      expect(reasoning.cid).toEqual(mockReasoningDtos[0].cid);
      expect(reasoning.blake2b).toEqual(mockReasoningDtos[0].blake2b);
      expect(reasoning.url).toEqual(mockReasoningDtos[0].url);
    });
    it('should not return a Reasoning by User ID and Governance Action Proposal by ID', async () => {
      const userId = 'wrong-user-id';
      const proposalId = mockGovActionProposals[0].id;
      try {
        await facade.getReasoning(userId, proposalId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Reasoning not found`);
      }
    });
  });

  describe('Add / Update reasoning', () => {
    it('should add a reasoning', async () => {
      const userId = 'user_1';
      const proposalId = mockGovActionProposalDtos[0].id;
      jest
        .spyOn<any, string>(facade, 'createReasoningJson')
        .mockResolvedValueOnce(mockReasoningJson);
      jest
        .spyOn<any, string>(facade, 'addReasoningToIpfs')
        .mockResolvedValueOnce(mockIpfsContentDto);

      const reasoningDto = GovernanceMapper.ipfsContentDtoToReasoningDto(
        mockIpfsContentDto,
        userId,
        proposalId,
        mockReasoningRequest,
      );

      const expectedResult =
        GovernanceMapper.reasoningDtoToResponse(reasoningDto);

      mockGovernanceService.addReasoning.mockResolvedValueOnce(reasoningDto);
      const result = await facade.addReasoning(
        userId,
        proposalId,
        mockReasoningRequest,
      );

      expect(result).toEqual(expectedResult);
      expect(mockGovernanceService.addReasoning).toHaveBeenCalledWith(
        reasoningDto,
      );
    });

    it('should not add a reasoning - wrong GovActionProposalId', async () => {
      const userId = 'user_1';
      const proposalId = 'wrongId';
      const reasoningRequest = {
        ...mockReasoningRequest,
        govActionProposalId: proposalId,
      };
      jest
        .spyOn<any, string>(facade, 'createReasoningJson')
        .mockResolvedValueOnce(mockReasoningJson);
      jest
        .spyOn<any, string>(facade, 'addReasoningToIpfs')
        .mockResolvedValueOnce(mockIpfsContentDto);
      const reasoningDto = GovernanceMapper.ipfsContentDtoToReasoningDto(
        mockIpfsContentDto,
        userId,
        proposalId,
        mockReasoningRequest,
      );

      mockGovernanceService.addReasoning.mockResolvedValueOnce(reasoningDto);

      try {
        await facade.addReasoning(userId, proposalId, reasoningRequest);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(
          `Gov action proposal with id ${reasoningRequest.govActionProposalId} not found`,
        );
      }
      expect(mockGovernanceService.findGovProposalById).toHaveBeenCalledWith(
        reasoningRequest.govActionProposalId,
      );
    });
  });

  describe('Search Votes', () => {
    it('should return paginated votes for a specific user', async () => {
      const userId = 'User_1';
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'Title_1',
        path: 'randomPath',
      };

      await facade.searchGovVotes(query, userId);

      expect(mockGovernanceService.searchGovVotes).toHaveBeenCalledWith(
        query,
        userId,
      );
    });

    it('should return an empty array - not found by search parameter', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'NotExistingTitle',
        path: 'randomPath',
      };

      const result = await facade.searchGovVotes(query);

      expect(result.data).toEqual([]);
      expect(mockGovernanceService.searchGovVotes).toHaveBeenCalledWith(
        query,
        undefined,
      );
    });

    it('should return an empty array - not found by userId', async () => {
      const userId = 'NotExistingUser';
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };

      const result = await facade.searchGovVotes(query, userId);

      expect(result.data).toEqual([]);
      expect(mockGovernanceService.searchGovVotes).toHaveBeenCalledWith(
        query,
        userId,
      );
    });

    it('should return all paginated votes when user ID is not specified', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };

      const result = await facade.searchGovVotes(query);

      expect(result.data.length).toEqual(mockVotes.length);
      expect(mockGovernanceService.searchGovVotes).toHaveBeenCalledWith(
        query,
        undefined,
      );
    });
  });

  describe('Search GovActionProposals', () => {
    it('should return paginated GovActionProposals for a specific user', async () => {
      const userId = 'User_1';
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'Title_1',
        path: 'randomPath',
      };

      await facade.searchGovActionProposals(query, userId);

      expect(
        mockGovernanceService.searchGovActionProposals,
      ).toHaveBeenCalledWith(query, userId);
    });

    it('should return an empty array - not found by userId', async () => {
      const userId = 'NotExistingUser';
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };

      const result = await facade.searchGovActionProposals(query, userId);

      expect(result.data).toEqual([]);
      expect(
        mockGovernanceService.searchGovActionProposals,
      ).toHaveBeenCalledWith(query, userId);
    });

    it('should return an empty array - not found by search parameter', async () => {
      const userId = 'User_1';
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'NotExistingTitle',
        path: 'randomPath',
      };

      const result = await facade.searchGovActionProposals(query, userId);

      expect(result.data).toEqual([]);
      expect(
        mockGovernanceService.searchGovActionProposals,
      ).toHaveBeenCalledWith(query, userId);
    });
  });
});