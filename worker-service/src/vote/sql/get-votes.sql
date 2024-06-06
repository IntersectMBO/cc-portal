select
vp.id,
vp.comitee_voter, -- Should be a hot address related to a vote
vp.gov_action_proposal_id, -- Should be Governance Action ID
vp.vote, -- The vote itself, should be Yes, No, Abstain
ocvd.title, -- Should be "Reasoning title"
ocvd.comment, -- Should be "Reasoning comment"
gap.type, -- Should be Governance Action Proposal category (ParameterChange, HardForkInitiation, TreasuryWithdrawals...)
gap_exp_epoch.end_time, -- Should be GAP "Expiry date" info when clicking on show more button
gap.voting_anchor_id, -- Should be anchor id for URL that contins JSON governance action metadata
vp_block.time, -- Should be Vote "Submit date" info when clicking on show more button
va.url, -- Should be a URL that contains JSON governance action metadata

case 
when gap.ratified_epoch is not null then 'RATIFIED'
when gap.enacted_epoch is not null then 'ENACTED'
when gap.dropped_epoch is not null then 'DROPPED'
when gap.expired_epoch is not null then 'EXPIRED'
else 'pending'
end as status

from voting_procedure vp
-- Vote Procedure related data
left join tx vp_tx on vp_tx.id = vp.tx_id
left join block vp_block on vp_block.id = vp_tx.block_id

-- Governance Action Proposal related data
left join gov_action_proposal gap on gap.id = vp.gov_action_proposal_id
left join epoch gap_exp_epoch on gap_exp_epoch.id = gap.expiration

-- Off chain vote data
left join off_chain_vote_data ocvd on ocvd.voting_anchor_id = vp.voting_anchor_id

-- There is also on chain author info if necessary, if we want to use on-chain author (cc-member) names instead of our db names
left join off_chain_vote_author ocva on ocva.off_chain_vote_data_id = ocvd.id

-- Relation for URL that contains governance action metadata
left join voting_anchor va on va.id = gap.voting_anchor_id
where vp.comitee_voter in (:whereInArray)