import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceService } from './governance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vote } from '../entities/vote.entity';
import { GovActionProposal } from '../entities/gov-action-proposal.entity';
import { Reasoning } from '../entities/reasoning.entity';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { Paginator } from 'src/util/pagination/paginator';
import { ReasoningDto } from '../dto/reasoning.dto';
import { NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { VoteDto } from '../dto/vote.dto';
import { PaginatedDto } from 'src/util/pagination/dto/paginated.dto';

const mockGovActProps: GovActionProposal[] = [
  {
    id: '1',
    votingAnchorId: '123',
    title: 'Test Proposal 1',
    abstract: 'Test Abstract 1',
    govMetadataUrl: 'http://example.com/1',
    status: 'Active',
    votes: [],
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '2',
    votingAnchorId: '124',
    title: 'Test Proposal 2',
    abstract: 'Test Abstract 2',
    govMetadataUrl: 'http://example.com/2',
    status: 'Inactive',
    votes: [],
    createdAt: null,
    updatedAt: null,
  },
];

const mockVotes: Vote[] = [
  {
    id: '1',
    userId: 'user1',
    hotAddress: 'address1',
    govActionProposal: mockGovActProps[0],
    vote: 'YES',
    title: 'Test Title 1',
    comment: 'Test Comment 1',
    govActionType: 'type1',
    endTime: new Date(),
    submitTime: new Date(),
    createdAt: null,
    updatedAt: null,
  },
  {
    id: '2',
    userId: 'user2',
    hotAddress: 'address2',
    govActionProposal: mockGovActProps[1],
    vote: 'NO',
    title: 'Test Title 2',
    comment: 'Test Comment 2',
    govActionType: 'type2',
    endTime: new Date(),
    submitTime: new Date(),
    createdAt: null,
    updatedAt: null,
  },
];

const paginatedValue: Paginated<Vote> = {
  data: mockVotes,
  meta: {
    totalItems: 2,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
    sortBy: [['createdAt', 'DESC']],
    searchBy: ['id', 'userId'],
    search: '',
    select: ['id', 'userId', 'vote'],
    filter: {},
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

const mockPaginator = {
  paginate: jest.fn().mockResolvedValue(paginatedValue),
};

const mockVoteRepository = {
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
  findOne: jest.fn().mockImplementation((id) => {
    const foundGovActProp = mockGovActProps.find(
      (govActProp) => govActProp.id === id.where.id,
    );
    if (!foundGovActProp) {
      return null;
    }
    return foundGovActProp;
  }),
};

const mockReasoningRepository = {
  create: jest.fn().mockImplementation((reasoning) => {
    return reasoning;
  }),
  save: jest.fn().mockImplementation((reasoning) => {
    return reasoning;
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('GovernanceService', () => {
  let service: GovernanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceService,
        { provide: Paginator, useValue: mockPaginator },
        { provide: getRepositoryToken(Vote), useValue: mockVoteRepository },
        {
          provide: getRepositoryToken(GovActionProposal),
          useValue: mockGovActionProposalRepository,
        },
        {
          provide: getRepositoryToken(Reasoning),
          useValue: mockReasoningRepository,
        },
        { provide: EntityManager, useValue: mockEntityManager },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GovernanceService>(GovernanceService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addReasoning, api/governance/reasoning/users/{{userId}}', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should add a new reasoning', async () => {
      const reasoningDto: ReasoningDto = {
        userId: 'user-uuid',
        govActionProposalId: '1',
        title: 'Test Title',
        content: 'Test Content',
        cid: 'test-cid',
        blake2b: 'test-blake2b',
        url: 'http://example.com',
        json: '{"key": "value"}',
      };

      const createdReasoning = await service.addReasoning(reasoningDto);

      expect(createdReasoning.title).toEqual(reasoningDto.title);
      expect(createdReasoning.content).toEqual(reasoningDto.content);
      expect(mockReasoningRepository.save).toHaveBeenCalled();

      expect(mockReasoningRepository.create).toHaveBeenCalledWith(reasoningDto);
      expect(mockReasoningRepository.save).toHaveBeenCalledWith(reasoningDto);
    });
  });

  describe('Find governance act prop by id', () => {
    it('should find a gov act prop by id', async () => {
      const mockId: string = '1';

      const govActProp = await service.findGovProposalById(mockId);

      expect(govActProp.id).toEqual(mockGovActProps[0].id);

      expect(mockGovActionProposalRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
    });

    it('should not find a gov act prop by id - wrong id', async () => {
      const mockId: string = 'wrongId';

      mockGovActionProposalRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findGovProposalById(mockId)).rejects.toThrow(
        new NotFoundException(
          `Gov action proposal with id ${mockId} not found`,
        ),
      );
    });
  });

  describe('Search gov votes', () => {
    it('should return paginated votes', async () => {
      const query: PaginateQuery = {
        page: 1,
        limit: 10,
        sortBy: [['id', 'ASC']],
        filter: {},
        path: '/votes',
      };

      const votePaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query);

      expect(votePaginatedDto.items[0].userId).toEqual(mockVotes[0].userId);
      expect(votePaginatedDto.items.length).toEqual(2);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });

    it('should return an empty array of votes', async () => {
      const query: PaginateQuery = {
        page: 0,
        limit: 10,
        search: 'NotExistingVote',
        path: 'randomPath',
      };

      const userId = 'user-uuid';

      mockPaginator.paginate.mockResolvedValueOnce(paginatedEmptyValue);

      const votesPaginatedDto: PaginatedDto<VoteDto> =
        await service.searchGovVotes(query, userId);

      expect(votesPaginatedDto.items).toEqual([]);
      expect(votesPaginatedDto.items.length).toEqual(0);
      expect(mockPaginator.paginate).toHaveBeenCalled();
    });
  });
});
