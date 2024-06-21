select
vp.id,
vp.committee_voter, -- Should be a hot address related to a vote
vp.gov_action_proposal_id, -- Should be Governance Action ID
vp.vote, -- The vote itself, should be Yes, No, Abstain
ocvd.title, -- Should be "Reasoning title"
ocvd.comment, -- Should be "Reasoning comment"
vp_block.time, -- Should be Vote "Submit date" info when clicking on show more button
ch.raw
from voting_procedure vp

-- Vote Procedure related data
left join tx vp_tx on vp_tx.id = vp.tx_id
left join block vp_block on vp_block.id = vp_tx.block_id

-- Off chain vote data
left join off_chain_vote_data ocvd on ocvd.voting_anchor_id = vp.voting_anchor_id

-- Relation for URL that contains governance action metadata
left join committee_hash ch on ch.id = vp.committee_voter
where ch.raw in (:whereInArray)