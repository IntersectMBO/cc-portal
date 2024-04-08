import React from "react";

import { Grid } from "@mui/material";
import { UsersListItem } from "./UsersListItem";

export function UsersList({ usersList }) {
  return (
    <Grid px={5} py={6} container direction="column" gap={0}>
      {usersList.map((data) => {
        return <UsersListItem {...data} />;
      })}
    </Grid>
  );
}
