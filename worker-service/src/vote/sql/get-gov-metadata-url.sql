select va.url
from gov_action_proposal gap
left join voting_anchor va on va.id = gap.voting_anchor_id
left join voting_procedure vp on vp.gov_action_proposal_id = gap.id
where vp.id = :id;