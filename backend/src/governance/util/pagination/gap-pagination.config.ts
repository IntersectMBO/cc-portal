import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { GovActionProposal } from 'src/governance/entities/gov-action-proposal.entity';

export const GOVERNANCE_ACTION_PROPOSAL_CONFIG: PaginateConfig<GovActionProposal> =
  {
    sortableColumns: ['endTime', 'submitTime'],
    filterableColumns: {
      govActionType: [FilterOperator.EQ, FilterOperator.IN],
      status: [FilterOperator.EQ, FilterOperator.IN],
    },
    searchableColumns: ['title', 'txHash'],
    defaultSortBy: [['submitTime', 'DESC']],
  };
