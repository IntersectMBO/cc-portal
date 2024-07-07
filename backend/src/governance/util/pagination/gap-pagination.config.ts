import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { GovActionProposal } from 'src/governance/entities/gov-action-proposal.entity';

export const GOVERNANCE_ACTION_PROPOSAL_CONFIG: PaginateConfig<GovActionProposal> =
  {
    relations: ['votes', 'reasonings'],
    sortableColumns: ['endTime', 'submitTime'],
    filterableColumns: {
      'votes.userId': [FilterOperator.EQ],
      'reasonings.userId': [FilterOperator.EQ],
      govActionType: [FilterOperator.EQ, FilterOperator.IN],
      status: [FilterOperator.EQ, FilterOperator.IN],
    },
    searchableColumns: ['title', 'txHash'],
    defaultSortBy: [['submitTime', 'DESC']],
  };
