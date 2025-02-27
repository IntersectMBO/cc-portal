select
gap.id, -- Should be id value from Governance Action Proposal table
gap.type, -- Should be Governance Action Proposal category (ParameterChange, HardForkInitiation, TreasuryWithdrawals...)
gap_exp_epoch.end_time, -- Should be GAP "Expiry date" info when clicking on show more button
gap.voting_anchor_id, -- Should be anchor id for URL that contins JSon governance action metadata
va.url, -- Should be a URL that contains JSon governance action metadata
gap_tx.hash, -- Should be transaction hash from tx table
gap_block.time, -- Should be Governance Action Proposal "Submit time"
  case 
    when gap.enacted_epoch is not null then 'ENACTED'
    when gap.ratified_epoch is not null then 'RATIFIED'
    when gap.dropped_epoch is not null then 'DROPPED'
    when gap.expired_epoch is not null then 'EXPIRED'
    else 'ACTIVE'
  end as epoch_status
from gov_action_proposal gap
left join tx gap_tx on gap_tx.id = gap.tx_id
left join epoch gap_exp_epoch on gap_exp_epoch.id = gap.expiration
left join voting_anchor va on va.id = gap.voting_anchor_id
left join block gap_block on gap_block.id = gap_tx.block_id
limit :limit offset :offset;