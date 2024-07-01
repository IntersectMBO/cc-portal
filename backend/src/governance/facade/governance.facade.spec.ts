import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceFacade } from './governance.facade';
import { GovernanceService } from '../services/governance.service';
import { UsersService } from 'src/users/services/users.service';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { NotFoundException } from '@nestjs/common';
import { GovernanceActionMetadataResponse } from '../api/response/gov-action-metadata.response';
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
      hash: 'f13dbc835a0f82f25fae62e8fe716e4c6e46ed0ed28bddaea419e30aab24abe6',
      title: 'Title 1',
      abstract: 'Abstract 1',
      metadataUrl: 'metadataUrl1',
    },
    {
      id: '2',
      hash: 'f41007d4d46f5bfba56ce657fec68ba0ff42623559f71faada81718ccc89ae35',
      title: 'Title 2',
      abstract: 'Abstract 2',
      metadataUrl: 'metadataUrl2',
    },
  ];

  const mockGovActionProposalResponse: GovernanceActionMetadataResponse[] = [
    {
      id: '1',
      title: 'Title 1',
      abstract: 'Abstract 1',
      metadataUrl: 'metadataUrl1',
    },
    {
      id: '2',
      title: 'Title 2',
      abstract: 'Abstract 2',
      metadataUrl: 'metadataUrl2',
    },
  ];

  const mockReasoningRequest: ReasoningRequest = {
    govActionProposalId: mockGovActionProposalDtos[0].id,
    title: 'Reasoning title',
    content: 'Reasoning content',
  };

  const mockReasoningJson = {
    govActionProposalHash: mockGovActionProposalDtos[0].hash,
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
      votingAnchorId: 'votingAnchor_1',
      title: 'govActionProposal_Title',
      abstract: 'govActionProposal_Abstract_1',
      govMetadataUrl: 'govMetadataUrl_1',
      status: GovActionProposalStatus.ACTIVE,
      votes: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 'govActionProposal_2',
      votingAnchorId: 'votingAnchor_2',
      title: 'govActionProposal_Title_2',
      abstract: 'govActionProposal_Abstract_2',
      govMetadataUrl: 'govMetadataUrl_2',
      status: GovActionProposalStatus.ACTIVE,
      votes: null,
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
      govProposalId: mockGovActionProposals[0].id,
      govProposalTitle: mockGovActionProposals[0].title,
      govProposalType: 'govActionType_1',
      govProposalResolved: true,
      govProposalStatus: GovActionProposalStatus.ACTIVE,
      govProposalEndTime: null,
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
      govProposalId: mockGovActionProposals[1].id,
      govProposalTitle: mockGovActionProposals[1].title,
      govProposalType: 'govActionType_2',
      govProposalResolved: true,
      govProposalStatus: GovActionProposalStatus.ACTIVE,
      govProposalEndTime: null,
      voteSubmitTime: null,
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

  describe('Add / Update reasoning', () => {
    it('should add a reasoning', async () => {
      const userId = 'user_1';
      jest
        .spyOn<any, string>(facade, 'createReasoningJson')
        .mockResolvedValueOnce(mockReasoningJson);
      jest
        .spyOn<any, string>(facade, 'addReasoningToIpfs')
        .mockResolvedValueOnce(mockIpfsContentDto);

      const reasoningDto = GovernanceMapper.ipfsContentDtoToReasoningDto(
        mockIpfsContentDto,
        userId,
        mockReasoningRequest,
      );

      const expectedResult =
        GovernanceMapper.reasoningDtoToResponse(reasoningDto);

      mockGovernanceService.addReasoning.mockResolvedValueOnce(reasoningDto);
      const result = await facade.addReasoning(userId, mockReasoningRequest);

      expect(result).toEqual(expectedResult);
      expect(mockGovernanceService.addReasoning).toHaveBeenCalledWith(
        reasoningDto,
      );
    });

    it('should not add a reasoning - wrong GovActionProposalId', async () => {
      const userId = 'user_1';
      const reasoningRequest = {
        ...mockReasoningRequest,
        govActionProposalId: 'wrongId',
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
        mockReasoningRequest,
      );

      mockGovernanceService.addReasoning.mockResolvedValueOnce(reasoningDto);

      try {
        await facade.addReasoning(userId, reasoningRequest);
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
});
