import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceService } from './governance.service';
import { Vote } from '../entities/vote.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { Reasoning } from '../entities/reasoning.entity';
import { Paginator } from 'src/util/pagination/paginator';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { NotFoundException } from '@nestjs/common';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { VoteDto } from '../dto/vote.dto';

describe('IpfsService', () => {
  let service: GovernanceService;

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

  const mockReasoningDto = {
    userId: 'mockedId',
    govActionProposalId: '1',
    title: 'Reasoning title',
    content: 'Reasoning content',
    cid: 'reasoningcid',
    blake2b: 'reasoningblake2b',
    url: 'reasoningurl',
    json: 'reasoningjson',
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

  const vote: Vote = {
    id: '1',
    userId: 'userId',
    hotAddress: 'hotAddress_1',
    govActionProposal: mockGovActionProposals[0],
    vote: 'yes',
    title: 'Title_1',
    comment: 'Comment_1',
    govActionType: 'govActionType_1',
    endTime: null,
    submitTime: null,
    createdAt: null,
    updatedAt: null,
  };

  const mockVotes: Vote[] = [
    {
      id: 'Vote_1',
      userId: 'User_1',
      hotAddress: 'hotAddress_1',
      govActionProposal: mockGovActionProposals[0],
      vote: 'yes',
      title: 'Title_1',
      comment: 'Comment_1',
      govActionType: 'govActionType_1',
      endTime: null,
      submitTime: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 'Vote_2',
      userId: 'User_1',
      hotAddress: 'hotAddress_1',
      govActionProposal: mockGovActionProposals[1],
      vote: 'yes',
      title: 'Title_2',
      comment: 'Comment_2',
      govActionType: 'govActionType_2',
      endTime: null,
      submitTime: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const paginatedValue: Paginated<Vote> = {
    data: new Array<Vote>(vote),
    meta: {
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 1,
      search: null,
      totalPages: 3,
      sortBy: null,
      searchBy: null,
      select: null,
    },
    links: {
      current: null,
    },
  };

  const paginatedEmptyValue: Paginated<Vote> = {
    data: [],
    meta: {
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 0,
      search: null,
      totalPages: 0,
      sortBy: null,
      searchBy: null,
      select: null,
    },
    links: {
      current: null,
    },
  };

  const paginatedMultiValue: Paginated<Vote> = {
    data: mockVotes,
    meta: {
      currentPage: 0,
      itemsPerPage: 10,
      totalItems: 2,
      search: null,
      totalPages: 0,
      sortBy: null,
      searchBy: null,
      select: null,
    },
    links: {
      current: null,
    },
  };

  const mockVoteRepository = {
    find: jest.fn(),
    createQueryBuilder: jest.fn().mockImplementation(function () {
      return mockVoteRepository;
    }),
    leftJoinAndSelect: jest.fn().mockImplementation(function () {
      return mockVoteRepository;
    }),
    where: jest.fn().mockImplementation(function () {
      return mockVoteRepository;
    }),
  };

  const mockGovActionProposalRepository = {
    findOne: jest.fn(),
  };

  const mockReasoningRepository = {
    create: jest.fn().mockImplementation((reasoning) => {
      return reasoning;
    }),
    save: jest.fn().mockImplementation((reasoning) => {
      return reasoning;
    }),
  };

  const mockPaginator = {
    paginate: jest.fn().mockResolvedValue(paginatedValue),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
        {
          provide: getRepositoryToken(GovActionProposal),
          useValue: mockGovActionProposalRepository,
        },
        {
          provide: getRepositoryToken(Reasoning),
          useValue: mockReasoningRepository,
        },
        {
          provide: Paginator,
          useValue: mockPaginator,
        },
      ],
    }).compile();

    service = module.get<GovernanceService>(GovernanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find a Governance Action Proposal', () => {
    it('should find a Governance Action Proposal by ID', async () => {
      const id = mockGovActionProposalDtos[0].id;
      const mockFindGovProposalById = jest
        .spyOn<any, any>(service, 'findGovProposalById')
        .mockResolvedValueOnce(mockGovActionProposalDtos[0]);
      const result = await service.findGovProposalById(id);
      expect(result).toEqual(mockGovActionProposalDtos[0]);
      expect(mockFindGovProposalById).toHaveBeenCalledWith(id);
    });

    it('should not find a Governance Action Proposal by ID - Not Found', async () => {
      const id: string = 'IdNotExists';
      mockGovActionProposalRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findGovProposalById(id)).rejects.toThrow(
        new NotFoundException(`Gov action proposal with id ${id} not found`),
      );
    });
  });

  describe('Add Reasoning', () => {
    it('should create new reasoning', async () => {
      const result = await service.addReasoning(mockReasoningDto);
      expect(result).toEqual(mockReasoningDto);
    });

    it('should update reasoning', async () => {
      const reasoning = { ...mockReasoningDto, id: '1' };
      const result = await service.addReasoning(reasoning);
      expect(result).toEqual(mockReasoningDto);
    });
  });

  describe('Search votes', () => {
    it('should return an array of found Votes', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'Title_1',
        path: 'randomPath',
      };
      const votePaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query);
      expect(votePaginatedDto.items[0].reasoningTitle).toEqual(vote.title);
      expect(votePaginatedDto.items.length).toEqual(1);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an empty array of votes', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'NotExistingVote',
        path: 'randomPath',
      };
      jest
        .spyOn<any, any>(service, 'createAllVotesQuery')
        .mockResolvedValueOnce([]);
      mockPaginator.paginate.mockResolvedValueOnce(paginatedEmptyValue);
      const votesPaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query);
      expect(votesPaginatedDto.items).toEqual([]);
      expect(votesPaginatedDto.items.length).toEqual(0);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an array of votes', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };
      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValue);
      const votesPaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query);
      expect(votesPaginatedDto.items[0].reasoningTitle).toEqual(
        mockVotes[0].title,
      );
      expect(votesPaginatedDto.items[1].reasoningTitle).toEqual(
        mockVotes[1].title,
      );
      expect(votesPaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an array of votes for specific user', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };
      const userId = mockVotes[0].userId;
      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValue);
      const votesPaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query, userId);
      expect(votesPaginatedDto.items[0].reasoningTitle).toEqual(
        mockVotes[0].title,
      );
      expect(votesPaginatedDto.items[1].reasoningTitle).toEqual(
        mockVotes[1].title,
      );
      expect(votesPaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });
  });
});
