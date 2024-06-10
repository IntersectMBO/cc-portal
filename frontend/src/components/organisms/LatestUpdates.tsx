"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Typography } from "@atoms";
import { useTranslations } from "next-intl";
import { VotesTable } from "./VotesTable";
import { VotesTableI } from "./types";
import { NotFound } from "./NotFound";
import { countSelectedFilters, isEmpty, useManageQueryParams } from "@utils";
import { DataActionsBar } from "../molecules";
import { GOVERNANCE_ACTIONS_SORTING } from "@consts";

export const LatestUpdates = ({
  latestUpdates,
}: {
  latestUpdates: VotesTableI[];
}) => {
  const t = useTranslations("LatestUpdates");
  const { updateQueryParams } = useManageQueryParams();
  const [searchText, setSearchText] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [chosenFilters, setChosenFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [sortOpen, setSortOpen] = useState(false);
  const [chosenSorting, setChosenSorting] = useState<string>("");

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
  }, []);

  const closeSorts = useCallback(() => {
    setSortOpen(false);
  }, []);

  useEffect(() => {
    const params: Record<string, string | null> = {
      search: searchText || null,
      govActionType:
        chosenFilters.govActionType?.length > 0
          ? chosenFilters.govActionType?.join(",")
          : null,
      vote:
        chosenFilters.vote?.length > 0 ? chosenFilters.vote?.join(",") : null,
      sortBy: chosenSorting || null,
    };
    updateQueryParams(params);
  }, [searchText, chosenFilters, chosenSorting, updateQueryParams]);

  return (
    <Box px={{ xs: 3, md: 5 }} py={{ xs: 3, md: 6 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ paddingBottom: 4 }} variant="headline4">
          {t("title")}
        </Typography>
        <Box display="flex" sx={{ position: "relative" }}>
          <DataActionsBar
            chosenFilters={chosenFilters}
            chosenFiltersLength={countSelectedFilters(chosenFilters)}
            chosenSorting={chosenSorting}
            closeFilters={closeFilters}
            closeSorts={closeSorts}
            filtersOpen={filtersOpen}
            setChosenFilters={setChosenFilters}
            setChosenSorting={setChosenSorting}
            setFiltersOpen={setFiltersOpen}
            setSearchText={setSearchText}
            setSortOpen={setSortOpen}
            sortingActive={Boolean(chosenSorting)}
            sortOpen={sortOpen}
            sortOptions={GOVERNANCE_ACTIONS_SORTING}
          />
        </Box>
      </Box>
      {isEmpty(latestUpdates) ? (
        <NotFound
          height="55vh"
          title="latestUpdates.title"
          description="latestUpdates.description"
        />
      ) : (
        <VotesTable
          votes={latestUpdates}
          actionTitle={t("actionTitle")}
          onActionClick={() => console.log("Show Reasoning Modal")}
        />
      )}
    </Box>
  );
};
