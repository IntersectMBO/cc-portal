import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceService } from './governance.service';
import { Vote } from '../entities/vote.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { Rationale } from '../entities/rationale.entity';
import { Paginator } from 'src/util/pagination/paginator';
import { GovActionProposalDto } from '../dto/gov-action-proposal-dto';
import { NotFoundException } from '@nestjs/common';
import { GovActionProposalStatus } from '../enums/gov-action-proposal-status.enum';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';
import { VoteDto } from '../dto/vote.dto';
import { VoteStatus } from '../enums/vote-status.enum';
import { VoteValue } from '../enums/vote-value.enum';

describe('IpfsService', () => {
  let service: GovernanceService;

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
      hasRationale: null,
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
      hasRationale: null,
      submitTime: null,
      endTime: null,
    },
  ];

  const mockRationaleDto = {
    userId: 'mockedId',
    govActionProposalId: '1',
    title: 'Rationale title',
    content: 'Rationale content',
    cid: 'rationalecid',
    blake2b: 'rationaleblake2b',
    url: 'rationaleurl',
    json: 'rationalejson',
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
      rationales: null,
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
      rationales: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const vote: Vote = {
    id: '1',
    userId: 'userId',
    hotAddress: 'hotAddress_1',
    govActionProposal: mockGovActionProposals[0],
    vote: VoteValue.Yes,
    title: 'Title_1',
    comment: 'Comment_1',
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
      vote: VoteValue.Yes,
      title: 'Title_1',
      comment: 'Comment_1',
      submitTime: null,
      createdAt: null,
      updatedAt: null,
    },
    {
      id: 'Vote_2',
      userId: 'User_1',
      hotAddress: 'hotAddress_1',
      govActionProposal: mockGovActionProposals[1],
      vote: VoteValue.Yes,
      title: 'Title_2',
      comment: 'Comment_2',
      submitTime: null,
      createdAt: null,
      updatedAt: null,
    },
  ];

  const paginatedValueVote: Paginated<Vote> = {
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

  const paginatedEmptyValueVote: Paginated<Vote> = {
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

  const paginatedMultiValueVote: Paginated<Vote> = {
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

  const paginatedValueGap: Paginated<GovActionProposal> = {
    data: new Array<GovActionProposal>(mockGovActionProposals[0]),
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

  const paginatedMultiValueGap: Paginated<GovActionProposal> = {
    data: mockGovActionProposals,
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

  const paginatedEmptyValueGap: Paginated<GovActionProposal> = {
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
    createQueryBuilder: jest.fn().mockImplementation(function () {
      return mockGovActionProposalRepository;
    }),
    leftJoinAndSelect: jest.fn().mockImplementation(function () {
      return mockGovActionProposalRepository;
    }),
    where: jest.fn().mockImplementation(function () {
      return mockGovActionProposalRepository;
    }),
  };

  const mockRationaleRepository = {
    create: jest.fn().mockImplementation((rationale) => {
      return rationale;
    }),
    save: jest.fn().mockImplementation((rationale) => {
      return rationale;
    }),
    findOne: jest.fn(),
  };

  const mockPaginator = {
    paginate: jest.fn(),
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
          provide: getRepositoryToken(Rationale),
          useValue: mockRationaleRepository,
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

  describe('Find Rationale For User By ProposalId', () => {
    it('should find a Rationale for User by ProposalId', async () => {
      const userId = 'user1';
      const proposalId = mockGovActionProposals[0].id;
      const mockFindRationale = jest
        .spyOn<any, any>(service, 'findRationaleForUserByProposalId')
        .mockResolvedValueOnce(mockRationaleDto);
      const result = await service.findRationaleForUserByProposalId(
        userId,
        proposalId,
      );
      expect(result).toEqual(mockRationaleDto);
      expect(mockFindRationale).toHaveBeenCalledWith(userId, proposalId);
    });

    it('should not find a Rationale - Not Found', async () => {
      const userId: string = 'UserIdNotExists';
      const proposalId = mockGovActionProposals[0].id;
      mockRationaleRepository.findOne.mockResolvedValueOnce(null);
      await expect(
        service.findRationaleForUserByProposalId(userId, proposalId),
      ).rejects.toThrow(new NotFoundException(`Rationale not found`));
    });
  });

  describe('Add Rationale', () => {
    it('should create new rationale', async () => {
      const result = await service.addRationale(mockRationaleDto);
      expect(result).toEqual(mockRationaleDto);
    });

    it('should update rationale', async () => {
      const rationale = { ...mockRationaleDto, id: '1' };
      const result = await service.addRationale(rationale);
      expect(result).toEqual(mockRationaleDto);
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
      mockPaginator.paginate.mockResolvedValueOnce(paginatedValueVote);
      const votePaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query);
      expect(votePaginatedDto.items[0].rationaleTitle).toEqual(vote.title);
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
        .spyOn<any, any>(service, 'returnAllVotesQuery')
        .mockResolvedValueOnce([]);
      mockPaginator.paginate.mockResolvedValueOnce(paginatedEmptyValueVote);
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
      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValueVote);
      const votesPaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query);
      expect(votesPaginatedDto.items[0].rationaleTitle).toEqual(
        mockVotes[0].title,
      );
      expect(votesPaginatedDto.items[1].rationaleTitle).toEqual(
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
      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValueVote);
      const votesPaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query, userId);
      expect(votesPaginatedDto.items[0].rationaleTitle).toEqual(
        mockVotes[0].title,
      );
      expect(votesPaginatedDto.items[1].rationaleTitle).toEqual(
        mockVotes[1].title,
      );
      expect(votesPaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });
  });

  describe('Search Governance Action Proposals', () => {
    it('should return an array of found GAPs', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'govActionProposal_Title',
        path: 'randomPath',
      };
      jest
        .spyOn<any, any>(service, 'returnGapQuery')
        .mockResolvedValueOnce(mockGovActionProposals[0]);
      mockPaginator.paginate.mockResolvedValue(paginatedValueGap);
      const gapPaginatedDto: PaginatedDto<GovActionProposalDto> =
        await service.searchGovActionProposals(query);
      expect(gapPaginatedDto.items[0].title).toEqual(
        mockGovActionProposals[0].title,
      );
      expect(gapPaginatedDto.items.length).toEqual(1);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an empty array of GAPs', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'NotExisting',
        path: 'randomPath',
      };
      jest.spyOn<any, any>(service, 'returnGapQuery').mockResolvedValueOnce([]);
      mockPaginator.paginate.mockResolvedValueOnce(paginatedEmptyValueGap);
      const gapPaginatedDto: PaginatedDto<GovActionProposalDto> =
        await service.searchGovActionProposals(query);
      expect(gapPaginatedDto.items).toEqual([]);
      expect(gapPaginatedDto.items.length).toEqual(0);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an array of GAPs', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };
      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValueGap);
      const gapPaginatedDto: PaginatedDto<GovActionProposalDto> =
        await service.searchGovActionProposals(query);
      expect(gapPaginatedDto.items[0].title).toEqual(
        mockGovActionProposals[0].title,
      );
      expect(gapPaginatedDto.items[1].title).toEqual(
        mockGovActionProposals[1].title,
      );
      expect(gapPaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an array of GAPs for specific user', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        path: 'randomPath',
      };
      const userId = 'user1';
      mockPaginator.paginate.mockResolvedValueOnce(paginatedMultiValueGap);
      const gapPaginatedDto: PaginatedDto<GovActionProposalDto> =
        await service.searchGovActionProposals(query, userId);
      expect(gapPaginatedDto.items[0].title).toEqual(
        mockGovActionProposals[0].title,
      );
      expect(gapPaginatedDto.items[1].title).toEqual(
        mockGovActionProposals[1].title,
      );
      expect(gapPaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });
  });
});
