select * from networks;

SELECT created_at, updated_at, id, user_id, hot_address, gov_action_proposal_id, vote, title, "comment", "type", end_time, "time"
FROM public.votes
WHERE id='46640bbe-d13a-4330-8b3e-3162ce5275e4'::uuid;
SELECT created_at, updated_at, id, user_id, hot_address, gov_action_proposal_id, vote, title, "comment", "type", end_time, "time"
FROM public.votes
WHERE id='d9825b11-dc73-4e28-a22e-687eadd11a4b'::uuid;
SELECT created_at, updated_at, id, user_id, hot_address, gov_action_proposal_id, vote, title, "comment", "type", end_time, "time"
FROM public.votes
WHERE id='9f0590b9-839e-4464-a971-d095d34fa32b'::uuid;