import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceFacade } from './governance.facade';
import { GovernanceService } from '../services/governance.service';
import { UsersService } from 'src/users/services/users.service';
import { IpfsService } from 'src/ipfs/services/ipfs.service';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { NotFoundException } from '@nestjs/common';
import { GovernanceActionMetadataResponse } from '../api/response/gov-action-metadata.response';
import { IpfsContentDto } from 'src/ipfs/dto/ipfs-content.dto';
import { ReasoningDto } from '../dto/reasoning.dto';
import { ReasoningRequest } from '../api/request/reasoning.request';
import { ReasoningResponse } from '../api/response/reasoning.response';
import { PaginateQuery } from 'nestjs-paginate';
import { VoteDto } from '../dto/vote.dto';
import { VoteValue } from '../enums/vote-value.enum';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { UserMapper } from 'src/users/mapper/userMapper.mapper';
import { UserStatusEnum } from 'src/users/enums/user-status.enum';
import { User } from 'src/users/entities/user.entity';

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

  const mockReasoningDto: ReasoningDto = {
    userId: 'user123',
    govActionProposalId: '1',
    title: 'New Reasoning',
    content: 'This is the reasoning content.',
    cid: 'QmXwWZt2TbGZjDf3H2sS2epv3ZCHWwGGDbY5g6',
    blake2b: 'mocked-blake2b-hash',
    url: 'ipfs://QmXwWZt2TbGZjDf3H2sS2epv3ZCHWwGGDbY5g6',
    json: '{"govActionProposalHash":"abc123","title":"New Reasoning","content":"This is the reasoning content."}',
  };

  const mockGovActProps: GovActionProposalDto[] = [
    {
      id: '1',
      hash: 'abc123',
      title: 'Proposal 1',
      abstract: 'This is the abstract for proposal 1.',
      metadataUrl: 'http://example.com/proposal1',
    },
    {
      id: '2',
      hash: 'def456',
      title: 'Proposal 2',
      abstract: 'This is the abstract for proposal 2.',
      metadataUrl: 'http://example.com/proposal2',
    },
  ];

  const mockReasoningRequest: ReasoningRequest = {
    govActionProposalId: '1',
    title: 'New Reasoning',
    content: 'This is the reasoning content.',
  };

  const mockVotes: VoteDto[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'User One',
      userAddress: 'address1',
      userPhotoUrl: 'photoUrl1',
      voteValue: VoteValue.Yes,
      reasoningTitle: 'Title 1',
      reasoningComment: 'Comment 1',
      govProposalId: '1',
      govProposalTitle: 'Proposal 1',
      govProposalType: 'Type 1',
      govProposalResolved: false,
      govProposalStatus: GovActionProposalStatus.ACTIVE,
      govProposalEndTime: new Date(),
      voteSubmitTime: new Date(),
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'User Two',
      userAddress: 'address2',
      userPhotoUrl: 'photoUrl2',
      voteValue: VoteValue.No,
      reasoningTitle: 'Title 2',
      reasoningComment: 'Comment 2',
      govProposalId: '2',
      govProposalTitle: 'Proposal 2',
      govProposalType: 'Type 2',
      govProposalResolved: true,
      govProposalStatus: GovActionProposalStatus.DROPPED,
      govProposalEndTime: new Date(),
      voteSubmitTime: new Date(),
    },
  ];

  const mockUserService = {
    findMultipleByIds: jest.fn().mockImplementation(async (ids: string[]) => {
      const users = mockUsers.filter((user) => ids.includes(user.id));
      return users.map((user) => UserMapper.userToDto(user));
    }),
  };

  const mockIpfsService = {
    addReasoningToIpfs: jest.fn(async (reasoningJson: any) => {
      let ipfsContentDto: IpfsContentDto;
      try {
        const ipfsResponse = {
          cid: 'QmXwWZt2TbGZjDf3H2sS2epv3ZCHWwGGDbY5g6',
          url: 'ipfs://QmXwWZt2TbGZjDf3H2sS2epv3ZCHWwGGDbY5g6',
          contents: reasoningJson,
        };

        const blake2bHash = 'mocked-blake2b-hash';

        ipfsContentDto = {
          ...ipfsResponse,
          blake2b: blake2bHash,
        };
      } catch (error) {
        throw new Error(
          `Error when adding reasoning to IPFS: ${error.message}`,
        );
      }

      return ipfsContentDto;
    }),
  };

  const mockGovernanceService = {
    findGovProposalById: jest.fn().mockImplementation((id) => {
      let foundGovActProp: GovActionProposalDto;
      mockGovActProps.forEach((item) => {
        if (id === item.id) {
          foundGovActProp = item;
        }
      });
      if (!foundGovActProp) {
        return new NotFoundException(
          `Gov action proposal with id ${id} not found`,
        );
      }
      return foundGovActProp;
    }),
    addReasoning: jest
      .fn()
      .mockImplementation((reasoningDto: ReasoningDto) =>
        Promise.resolve(reasoningDto),
      ),
    searchGovVotes: jest
      .fn()
      .mockImplementation((query: PaginateQuery, userId?: string) => {
        let filteredVotes = mockVotes;

        if (userId) {
          filteredVotes = filteredVotes.filter(
            (vote) => vote.userId === userId,
          );
        }

        if (query.search) {
          const searchTerm = query.search.toLowerCase();
          filteredVotes = filteredVotes.filter(
            (vote) =>
              vote.reasoningTitle.toLowerCase().includes(searchTerm) ||
              vote.reasoningComment.toLowerCase().includes(searchTerm),
          );
        }
        const skip = (query.page - 1) * query.limit;

        const startPosition = (query.page - 1) * query.limit;
        const paginatedVotes = filteredVotes.slice(
          startPosition,
          startPosition + query.limit,
        );

        const paginatedDto: PaginatedDto<VoteDto> = {
          items: paginatedVotes,
          itemCount: filteredVotes.length,
          pageOptions: {
            page: query.page,
            perPage: query.limit,
            skip: skip,
          },
        };

        return paginatedDto;
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceFacade,
        { provide: UsersService, useValue: mockUserService },
        { provide: IpfsService, useValue: mockIpfsService },
        {
          provide: GovernanceService,
          useValue: mockGovernanceService,
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

  describe('Fetch a gov act prop by id', () => {
    it('should return a gov act prop by id', async () => {
      const id = mockGovActProps[0].id;
      const expectedResponse: GovernanceActionMetadataResponse = {
        id: mockGovActProps[0].id,
        title: mockGovActProps[0].title,
        abstract: mockGovActProps[0].abstract,
        metadataUrl: mockGovActProps[0].metadataUrl,
      };
      const govActProp = await facade.findGovActionProposalById(id);
      expect(mockGovernanceService.findGovProposalById).toHaveBeenCalled();
      expect(govActProp).toMatchObject(expectedResponse);
    });
    it('should not return a gov act prop by id', async () => {
      const id = 'wrong-govactprop-id';
      try {
        await facade.findGovActionProposalById(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Gov action proposal with id ${id} not found`);
      }
    });
  });

  describe('Add reasoning', () => {
    it('should add reasoning', async () => {
      const userId = 'user123';
      const expectedResponse: ReasoningResponse = {
        cid: mockReasoningDto.cid,
        url: mockReasoningDto.url,
        blake2b: mockReasoningDto.blake2b,
        contents: mockReasoningDto.json,
      };

      const reasoningResponse = await facade.addReasoning(
        userId,
        mockReasoningRequest,
      );

      expect(mockGovernanceService.findGovProposalById).toHaveBeenCalledWith(
        mockReasoningRequest.govActionProposalId,
      );
      expect(mockIpfsService.addReasoningToIpfs).toHaveBeenCalled();
      expect(mockGovernanceService.addReasoning).toHaveBeenCalledWith(
        mockReasoningDto,
      );
      expect(reasoningResponse).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when gov action proposal id is not found', async () => {
      const userId = 'user123';
      const invalidGovActionProposalId = 'invalid-id';

      try {
        await facade.addReasoning(userId, {
          ...mockReasoningRequest,
          govActionProposalId: invalidGovActionProposalId,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(
          `Gov action proposal with id ${invalidGovActionProposalId} not found`,
        );
      }
    });
  });

  describe('Search votes', () => {
    it('should return paginated votes for a specific user', async () => {
      const userId = 'user1';
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'Test',
        path: 'randomPath',
      };

      await facade.searchGovVotes(query, userId);

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

      await facade.searchGovVotes(query);

      expect(mockGovernanceService.searchGovVotes).toHaveBeenCalledWith(
        query,
        undefined,
      );
    });

    it('should return paginated votes from the second page', async () => {
      const query: PaginateQuery = {
        page: 2,
        limit: 10,
        path: 'randomPath',
      };

      await facade.searchGovVotes(query);

      expect(mockGovernanceService.searchGovVotes).toHaveBeenCalledWith(
        query,
        undefined,
      );
    });
  });
});
