"use client";
import { useEffect, useState } from "react";

import { useAppContext, useModal } from "@/context";
import { useSnackbar } from "@/context/snackbar";
import { getUsersAdmin } from "@/lib/api";
import { PaginationMeta } from "@/lib/requests";
import { Button, ShowMoreButton, Typography } from "@atoms";
import { useManageQueryParams, usePagination } from "@hooks";
import { Box, Grid } from "@mui/material";
import { isEmpty } from "@utils";
import { useTranslations } from "next-intl";
import { DataActionsContainer } from "../MembersCard/DataActionsContainer";
import { NotFound } from "../NotFound";
import PermissionChecker from "../PermissionChecker";
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
  const [searchText, setSearchText] = useState<string>("");
  const [chosenSorting, setChosenSorting] = useState<string>("");
  const { updateQueryParams } = useManageQueryParams();
  const { addErrorAlert } = useSnackbar();
  const params: Record<string, string | null> = {
    search: searchText || null,
    sortBy: chosenSorting || null
  };
  const { data, pagination, isLoading, loadMore } = usePagination(
    usersList,
    paginationMeta,
    (page) => getUsersAdmin({ ...params, page })
  );

  const t = useTranslations("Members");
  const { userSession } = useAppContext();
  const { openModal } = useModal();
  const addMember = () =>
    openModal({
      type: "addMember"
    });

  useEffect(() => {
    updateQueryParams(params);
  }, [searchText, chosenSorting, updateQueryParams]);

  useEffect(() => {
    if (error) {
      addErrorAlert(error);
    }
  }, [error]);

  return (
    <Grid
      px={{ xxs: 3, md: 5 }}
      py={{ xxs: 3, md: 6 }}
      container
      direction="column"
      gap={2}
    >
      <Box
        paddingBottom={4}
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xxs: "column", md: "row" }}
        alignItems={{ xxs: "left", md: "center" }}
        gap={3}
      >
        <Typography variant="headline4">{t("title")}</Typography>
        <Box
          display="flex"
          justifyContent={{ xxs: "left", md: "space-between" }}
          alignItems="center"
          gap={2}
          flexWrap={"wrap"}
        >
          <PermissionChecker
            permissions={userSession?.permissions}
            requiredPermission="manage_cc_members"
          >
            <Button
              size="extraLarge"
              onClick={addMember}
              variant="contained"
              data-testid="admin-top-nav-add-member-button"
            >
              {t("addNewMember")}
            </Button>
          </PermissionChecker>
          <DataActionsContainer
            setSearchText={setSearchText}
            setChosenSorting={setChosenSorting}
          />
        </Box>
      </Box>
      {isEmpty(data) || error ? (
        <NotFound
          title="adminMembers.title"
          description="adminMembers.description"
        />
      ) : (
        data.map((user) => <UsersListItem key={user.id} {...user} />)
      )}

      <ShowMoreButton
        isLoading={isLoading}
        hasNextPage={pagination.has_next_page}
        callBack={loadMore}
      />
    </Grid>
  );
}
