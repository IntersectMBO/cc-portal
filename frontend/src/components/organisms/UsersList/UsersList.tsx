import React from "react";

import { Grid } from "@mui/material";
import { UsersListItem } from "./UsersListItem";
import { UsersListProps } from "../types";

export function UsersList({ usersList }: { usersList: UsersListProps[] }) {
  return (
    <Grid px={5} py={6} container direction="column" gap={0}>
      {usersList.map((data, index) => {
        return <UsersListItem key={index} {...data} />;
      })}
    </Grid>
  );
}
