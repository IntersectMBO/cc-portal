import React from "react";

import { Grid } from "@mui/material";
import { UsersListItem } from "./UsersListItem";
import { UserListItem } from "../types";

export function UsersList({ usersList }: { usersList: UserListItem[] }) {
  return (
    <Grid
      px={{ xs: 3, md: 5 }}
      py={{ xs: 3, md: 6 }}
      container
      direction="column"
      gap={0}
    >
      {usersList.map((data, index) => {
        return <UsersListItem key={index} {...data} />;
      })}
    </Grid>
  );
}
