import React from "react";
import { Grid } from "@mui/material";
import { VotesTableI } from "../types";
import { VotesTableRow } from "./VotesTableRow";

interface Props {
  votes: VotesTableI[];
  onActionClick: () => void;
  actionTitle: string;
  isDisabled?: (data: VotesTableI) => boolean;
}

export const VotesTable = ({
  votes,
  onActionClick,
  actionTitle,
  isDisabled,
}: Props) => {
  return (
    <Grid container direction="column" gap={0}>
      {votes.map((data, index) => {
        const disabled = isDisabled && isDisabled(data);
        return (
          <Grid
            key={index}
            item
            data-testid={`latest-updates-${data.gov_action_proposal_id}-card`}
          >
            <VotesTableRow
              votes={data}
              disabled={disabled}
              onActionClick={onActionClick}
              actionTitle={actionTitle}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
