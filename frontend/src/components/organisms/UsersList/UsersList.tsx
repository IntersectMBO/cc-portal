"use client";
import React, { useEffect } from "react";

import { Grid } from "@mui/material";
import { UsersListItem } from "./UsersListItem";
import { UserListItem } from "../types";
import { NotFound } from "../NotFound";
import { getUsersAdmin } from "@/lib/api";
import { PaginationMeta } from "@/lib/requests";
import { isEmpty } from "@utils";
import { usePagination } from "@/lib/utils/usePagination";
import { ShowMoreButton } from "@atoms";
import { useSearchParams } from "next/navigation";
import { useSnackbar } from "@/context/snackbar";

export function UsersList({
  usersList,
  paginationMeta,
  error,
}: {
  usersList: UserListItem[];
  paginationMeta: PaginationMeta;
  error?: string;
}) {
  const searchParams = useSearchParams();
  const { addErrorAlert } = useSnackbar();
  const { data, pagination, isLoading, loadMore } = usePagination(
    usersList,
    paginationMeta,
    (page) => getUsersAdmin({ page, search: searchParams.get("search") })
  );

  useEffect(() => {
    if (error) {
      addErrorAlert(error);
    }
  }, [error]);

  if (isEmpty(data) || error) {
    return (
      <NotFound
        title="adminMembers.title"
        description="adminMembers.description"
      />
    );
  }
  return (
    <Grid
      px={{ xs: 3, md: 5 }}
      py={{ xs: 3, md: 6 }}
      container
      direction="column"
      gap={0}
    >
      {data.map((users) => {
        return <UsersListItem key={users.id} {...users} />;
      })}
      <ShowMoreButton
        isLoading={isLoading}
        hasNextPage={pagination.has_next_page}
        callBack={loadMore}
      />
    </Grid>
  );
}
