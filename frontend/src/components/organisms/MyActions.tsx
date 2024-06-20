"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { VotesTableI } from "./types";
import { NotFound } from "./NotFound";
import { VotesTable } from "./VotesTable";
import { countSelectedFilters, isEmpty, useManageQueryParams } from "@utils";
import { DataActionsBar } from "../molecules";
import {
  GOVERNANCE_ACTIONS_FILTERS,
  GOVERNANCE_ACTIONS_SORTING,
  PATHS,
} from "@consts";
import { PageTitleTabs } from "./PageTitleTabs";

export const MyActions = ({ actions }: { actions: VotesTableI[] }) => {
  const t = useTranslations("MyActions");
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

  const tabs = [
    {
      path: PATHS.governanceActions,
      title: t("gaTab"),
    },
    {
      path: PATHS.myActions,
      title: t("myVotesTab"),
    },
  ];

  return (
    <Box px={{ xs: 3, md: 5 }} py={{ xs: 3, md: 6 }}>
      <Box
        paddingBottom={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <PageTitleTabs tabs={tabs} />
        </Box>
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
            filterOptions={GOVERNANCE_ACTIONS_FILTERS}
          />
        </Box>
      </Box>
      {isEmpty(actions) ? (
        <NotFound
          height="55vh"
          title="myActions.title"
          description="myActions.description"
        />
      ) : (
        <VotesTable
          votes={actions}
          actionTitle={t("actionTitle")}
          onActionClick={() => console.log("Manage Actions Modal")}
          isDisabled={(data) => data.gov_action_proposal_status !== "ACTIVE"}
        />
      )}
    </Box>
  );
};
