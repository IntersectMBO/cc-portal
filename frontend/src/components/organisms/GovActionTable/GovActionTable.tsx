import React from "react";
import { Grid } from "@mui/material";
import { GovernanceActionTableI } from "../types";
import { GovActionTableRow } from "./GovActionTableRow";

interface Props {
  govActions: GovernanceActionTableI[];
}

export const GovActionTable = ({ govActions }: Props) => {
  return (
    <Grid container direction="column" gap={0}>
      {govActions.map((data, index) => {
        return (
          <Grid
            key={index}
            item
            data-testid={`governance-actions-${data.gov_action_proposal_id}-card`}
          >
            <GovActionTableRow govActions={data} />
          </Grid>
        );
      })}
    </Grid>
  );
};
