import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Vote } from 'src/governance/entities/vote.entity';

export const VOTE_PAGINATION_CONFIG: PaginateConfig<Vote> = {
  loadEagerRelations: true,
  sortableColumns: ['submitTime', 'govActionProposal.title'],
  filterableColumns: {
    govActionType: [FilterOperator.EQ, FilterOperator.IN],
    voteValue: [FilterOperator.EQ, FilterOperator.IN],
    userId: [FilterOperator.EQ],
  },
  searchableColumns: ['govActionProposal.title'],
  defaultSortBy: [['submitTime', 'DESC']],
};
