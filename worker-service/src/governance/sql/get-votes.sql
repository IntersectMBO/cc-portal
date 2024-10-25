select
vp.id,
vp.committee_voter, -- Should be a hot address related to a vote
vp.gov_action_proposal_id, -- Should be Governance Action ID
vp.vote, -- The vote itself, should be Yes, No, Abstain
vp_block.time, -- Should be Vote "Submit date" info when clicking on show more button
ch.raw,
gap.type, -- Should be Governance Action Proposal category (ParameterChange, HardForkInitiation, TreasuryWithdrawals...)
gap_exp_epoch.end_time, -- Should be GAP "Expiry date" info when clicking on show more button
gap.voting_anchor_id, -- Should be anchor id for URL that contins JSON governance action metadata
va.url gap_url, -- Should be a URL that contains JSON governance action metadata
va2.url vote_url, -- Should be a URL that contains Rationale JSON
vp_tx.hash, -- Should be transaction hash from tx table
gap_block.time gap_submit_time, -- Should be Governance Action Proposal "Submit time"
 case 
    when gap.ratified_epoch is not null then 'RATIFIED'
    when gap.enacted_epoch is not null then 'ENACTED'
    when gap.dropped_epoch is not null then 'DROPPED'
    when gap.expired_epoch is not null then 'EXPIRED'
    else 'ACTIVE'
  end as epoch_status
from voting_procedure vp

-- Vote Procedure related data
left join gov_action_proposal gap on gap.id = vp.gov_action_proposal_id
left join tx vp_tx on vp_tx.id = vp.tx_id
left join block vp_block on vp_block.id = vp_tx.block_id
left join epoch gap_exp_epoch on gap_exp_epoch.id = gap.expiration
left join voting_anchor va on va.id = gap.voting_anchor_id
left join voting_anchor va2 on va2.id = vp.voting_anchor_id

-- Relation for URL that contains governance action metadata
left join committee_hash ch on ch.id = vp.committee_voter
left join tx gap_tx on gap_tx.id = gap.tx_id
left join block gap_block on gap_block.id = gap_tx.block_id

where ch.raw in (:whereInArray) 