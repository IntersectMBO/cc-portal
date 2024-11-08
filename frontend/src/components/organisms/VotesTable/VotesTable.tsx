import { VotesTableI } from "@/lib/requests";
import { Grid } from "@mui/material";
import { VotesTableRow } from "./VotesTableRow";

interface Props {
  votes: VotesTableI[];
  onActionClick: (action: VotesTableI) => void;
  actionTitle: string;
  isDisabled?: (data: VotesTableI) => boolean;
}

export const VotesTable = ({
  votes,
  onActionClick,
  actionTitle,
  isDisabled
}: Props) => {
  return (
    <Grid container direction="column" gap={2}>
      {votes &&
        votes.map((data, index) => {
          const disabled = isDisabled && isDisabled(data);
          return (
            <VotesTableRow
              votes={data}
              disabled={disabled}
              onActionClick={onActionClick}
              actionTitle={actionTitle}
              data-testid={`latest-updates-${data.gov_action_proposal_id}-card`}
              key={index}
            />
          );
        })}
    </Grid>
  );
};
