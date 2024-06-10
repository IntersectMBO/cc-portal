"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { NotFound } from "../NotFound";
import { MembersCard } from "./MembersCard";
import { UserListItem } from "../types";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { isEmpty, useManageQueryParams } from "@utils";
import { DataActionsBar } from "@molecules";
import { CC_MEMBERS_SORTING } from "@consts";

export function MembersCardList({ members }: { members: UserListItem[] }) {
  const t = useTranslations("Members");

  const { updateQueryParams } = useManageQueryParams();
  const [searchText, setSearchText] = useState<string>("");
  const [sortOpen, setSortOpen] = useState(false);
  const [chosenSorting, setChosenSorting] = useState<string>("");

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
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ paddingBottom: 4 }} variant="headline4">
          {t("title")}
        </Typography>
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
      {isEmpty(members) ? (
        <NotFound
          height="55vh"
          title="members.title"
          description="members.description"
        />
      ) : (
        <Grid container>
          {members.map((data, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              lg={4}
              data-testid={`members-${data.id}-card`}
              sx={{
                padding: 2,
                paddingTop: 0,
              }}
            >
              <MembersCard {...data} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
