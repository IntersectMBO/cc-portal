import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Vote } from 'src/governance/entities/vote.entity';

export const VOTE_PAGINATION_CONFIG: PaginateConfig<Vote> = {
  relations: ['govActionProposal'],
  sortableColumns: ['submitTime', 'govActionProposal.title'],
  filterableColumns: {
    'govActionProposal.govActionType': [FilterOperator.EQ, FilterOperator.IN],
    vote: [FilterOperator.EQ, FilterOperator.IN],
    userId: [FilterOperator.EQ],
  },
  searchableColumns: ['govActionProposal.title'],
  defaultSortBy: [['submitTime', 'DESC']],
};
