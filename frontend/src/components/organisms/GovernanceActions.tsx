"use client";

import { getGovernanceActions } from "@/lib/api";
import { GovernanceActionTableI, PaginationMeta } from "@/lib/requests";
import {
  GOVERNANCE_ACTIONS_FILTERS,
  GOVERNANCE_ACTIONS_SORTING,
  MY_ACTIONS_TABS,
  PATHS
} from "@consts";
import { useManageQueryParams, usePagination } from "@hooks";
import { Box } from "@mui/material";
import { countSelectedFilters, isEmpty } from "@utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ShowMoreButton } from "../atoms";
import { DataActionsBar } from "../molecules";
import { GovActionTable } from "./GovActionTable";
import { NotFound } from "./NotFound";
import { PageTitleTabs } from "./PageTitleTabs";

export const GovernanceActions = ({
  actions,
  paginationMeta
}: {
  actions: GovernanceActionTableI[];
  paginationMeta: PaginationMeta;
}) => {
  const { updateQueryParams } = useManageQueryParams();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [chosenFilters, setChosenFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [sortOpen, setSortOpen] = useState(false);
  const [chosenSorting, setChosenSorting] = useState<string>("");
  const params: Record<string, string | null> = {
    search: searchText || null,
    govActionType:
      chosenFilters.govActionType?.length > 0
        ? chosenFilters.govActionType?.join(",")
        : null,
    status:
      chosenFilters.status?.length > 0 ? chosenFilters.status?.join(",") : null,
    sortBy: chosenSorting || null
  };

  const { data, pagination, isLoading, loadMore } = usePagination(
    actions,
    paginationMeta,
    (page) => getGovernanceActions({ page, ...params })
  );

  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
  }, []);

  const closeSorts = useCallback(() => {
    setSortOpen(false);
  }, []);

  useEffect(() => {
    updateQueryParams(params);
  }, [searchText, chosenFilters, chosenSorting, updateQueryParams]);

  return (
    <Box px={{ xxs: 3, md: 5 }} py={{ xxs: 3, md: 6 }}>
      <Box
        paddingBottom={4}
        display="flex"
        justifyContent={{ xxs: "flex-start", md: "space-between" }}
        flexDirection={{ xxs: "column", md: "column", lg: "row" }}
        alignItems={{ xxs: "left", md: "center" }}
      >
        <Box className="ttt" mb={{ xxs: 0, md: 2 }}>
          <PageTitleTabs
            tabs={MY_ACTIONS_TABS}
            onChange={(tab) => router.push(tab.value)}
            selectedValue={PATHS.governanceActions}
          />
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
      {isEmpty(data) ? (
        <NotFound
          height="50vh"
          title="governanceAction.title"
          description="governanceAction.description"
        />
      ) : (
        <>
          <GovActionTable govActions={data} />
          <ShowMoreButton
            isLoading={isLoading}
            hasNextPage={pagination.has_next_page}
            callBack={loadMore}
          />
        </>
      )}
    </Box>
  );
};
