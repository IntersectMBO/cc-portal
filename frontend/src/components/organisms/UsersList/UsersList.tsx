"use client";
import { useEffect } from "react";

import { useSnackbar } from "@/context/snackbar";
import { getUsersAdmin } from "@/lib/api";
import { PaginationMeta } from "@/lib/requests";
import { ShowMoreButton } from "@atoms";
import { usePagination } from "@hooks";
import { Grid } from "@mui/material";
import { isEmpty } from "@utils";
import { useSearchParams } from "next/navigation";
import { NotFound } from "../NotFound";
import { UserListItem } from "../types";
import { UsersListItem } from "./UsersListItem";

export function UsersList({
  usersList,
  paginationMeta,
  error
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
      px={{ xxs: 3, md: 5 }}
      py={{ xxs: 3, md: 6 }}
      container
      direction="column"
      gap={2}
    >
      {data &&
        data.map((users) => {
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
