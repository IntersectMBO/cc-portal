import React from "react";

import { Box, Grid } from "@mui/material";
import { UsersListItem } from "./UsersListItem";
import { UserListItem } from "../types";
import { Typography } from "@atoms";
import { NotFound } from "../NotFound";

export function UsersList({ usersList }: { usersList: UserListItem[] }) {
  if (usersList.length === 0) {
    return <NotFound title="noMembersFound" description="addNewMembers" />;
  }
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
