"use client";
import React from "react";

import { Grid } from "@mui/material";
import { UsersListItem } from "./UsersListItem";
import { UserListItem } from "../types";
import { NotFound } from "../NotFound";
import { getUsersAdmin } from "@/lib/api";
import { PaginationMeta } from "@/lib/requests";
import { isEmpty } from "@utils";
import { usePagination } from "@/lib/utils/usePagination";
import { ShowMoreButton } from "@atoms";

export function UsersList({
  usersList,
  paginationMeta,
}: {
  usersList: UserListItem[];
  paginationMeta: PaginationMeta;
}) {
  const { data, pagination, isLoading, loadMore } = usePagination(
    usersList,
    paginationMeta,
    getUsersAdmin
  );

  if (isEmpty(data)) {
    return <NotFound title="members.title" description="members.description" />;
  }
  return (
    <Grid
      px={{ xs: 3, md: 5 }}
      py={{ xs: 3, md: 6 }}
      container
      direction="column"
      gap={0}
    >
      {data.map((users, index) => {
        return <UsersListItem key={index} {...users} />;
      })}
      <ShowMoreButton
        isLoading={isLoading}
        hasNextPage={pagination.has_next_page}
        callBack={loadMore}
      />
    </Grid>
  );
}
