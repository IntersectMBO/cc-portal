import React from "react";
import { Grid } from "@mui/material";
import { VotesTableI } from "../types";
import { VotesTableRow } from "./VotesTableRow";

export const VotesTable = ({ votes }: { votes: VotesTableI[] }) => {
  return (
    <Grid container direction="column" gap={0}>
      {votes.map((data, index) => (
        <Grid key={index} item data-testid={`latest-updates-${data.id}-card`}>
          <VotesTableRow {...data} />
        </Grid>
      ))}
    </Grid>
  );
};
