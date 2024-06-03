import React from "react";
import { Grid } from "@mui/material";
import { VotesTableI } from "../types";
import { VotesTableRow } from "./VotesTableRow";

interface Props {
  votes: VotesTableI[];
  onActionClick: () => void;
  actionTitle: string;
}

export const VotesTable = ({ votes, onActionClick, actionTitle }: Props) => {
  return (
    <Grid container direction="column" gap={0}>
      {votes.map((data, index) => (
        <Grid key={index} item data-testid={`latest-updates-${data.id}-card`}>
          <VotesTableRow
            votes={data}
            disabled={data.governance_proposal_resolved}
            onActionClick={onActionClick}
            actionTitle={actionTitle}
          />
        </Grid>
      ))}
    </Grid>
  );
};
