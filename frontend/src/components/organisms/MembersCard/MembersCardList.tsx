"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { NotFound } from "../NotFound";
import { MembersCard } from "./MembersCard";
import { UserListItem } from "../types";
import { ShowMoreButton, Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { isEmpty, useManageQueryParams } from "@utils";
import { DataActionsBar } from "@molecules";
import { CC_MEMBERS_SORTING } from "@consts";
import { PaginationMeta } from "@/lib/requests";
import { usePagination } from "@/lib/utils/usePagination";
import { getMembers } from "@/lib/api";

export function MembersCardList({
  members,
  paginationMeta,
}: {
  members: UserListItem[];
  paginationMeta: PaginationMeta;
}) {
  const t = useTranslations("Members");

  const { updateQueryParams } = useManageQueryParams();
  const [searchText, setSearchText] = useState<string>("");
  const [sortOpen, setSortOpen] = useState(false);
  const [chosenSorting, setChosenSorting] = useState<string>("");
  const { data, pagination, isLoading, loadMore } = usePagination(
    members,
    paginationMeta,
    getMembers
  );

  const closeSorts = useCallback(() => {
    setSortOpen(false);
  }, []);

  useEffect(() => {
    const params: Record<string, string | null> = {
      search: searchText || null,
      sortBy: chosenSorting || null,
    };
    updateQueryParams(params);
  }, [searchText, chosenSorting, updateQueryParams]);

  return (
    <Box px={{ xs: 3, md: 5 }} py={{ xs: 3, md: 6 }}>
      <Box
        paddingBottom={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="headline4">{t("title")}</Typography>
        <Box display="flex" sx={{ position: "relative" }}>
          <DataActionsBar
            isFiltering={false}
            chosenSorting={chosenSorting}
            closeSorts={closeSorts}
            setChosenSorting={setChosenSorting}
            setSearchText={setSearchText}
            setSortOpen={setSortOpen}
            sortingActive={Boolean(chosenSorting)}
            sortOpen={sortOpen}
            sortOptions={CC_MEMBERS_SORTING}
          />
        </Box>
      </Box>
      {isEmpty(data) ? (
        <NotFound
          height="55vh"
          title="members.title"
          description="members.description"
        />
      ) : (
        <>
          <Grid container>
            {data.map((members, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sm={6}
                lg={4}
                data-testid={`members-${members.id}-card`}
                sx={{
                  padding: 2,
                  paddingTop: 0,
                }}
              >
                <MembersCard {...members} />
              </Grid>
            ))}
          </Grid>
          <ShowMoreButton
            isLoading={isLoading}
            hasNextPage={pagination.has_next_page}
            callBack={loadMore}
          />
        </>
      )}
    </Box>
  );
}
