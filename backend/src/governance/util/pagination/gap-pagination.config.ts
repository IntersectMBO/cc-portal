import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { GovActionProposal } from 'src/governance/entities/gov-action-proposal.entity';

export const GAP_PAGINATION_CONFIG: PaginateConfig<GovActionProposal> = {
  relations: ['reasonings', 'votes'],
  sortableColumns: ['endTime'],
  filterableColumns: {
    'reasonings.userId': [FilterOperator.NULL],
    'votes.id': [FilterOperator.NULL],
    govActionType: [FilterOperator.EQ, FilterOperator.IN],
  },
  searchableColumns: ['title'],
  defaultSortBy: [['endTime', 'DESC']],
};
