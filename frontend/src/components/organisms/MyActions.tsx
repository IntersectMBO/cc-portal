"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { NotFound } from "./NotFound";
import { VotesTable } from "./VotesTable";
import { countSelectedFilters, isEmpty, useManageQueryParams } from "@utils";
import { DataActionsBar } from "../molecules";
import { LATEST_UPDATES_FILTERS, LATEST_UPDATES_SORTING, PATHS } from "@consts";
import { PageTitleTabs } from "./PageTitleTabs";
import { useModal } from "@/context";
import { PaginationMeta, VotesTableI } from "@/lib/requests";
import { OpenPreviewReasoningModal } from "./types";
import { getUserVotes } from "@/lib/api";
import { usePagination } from "@/lib/utils/usePagination";
import { ShowMoreButton } from "../atoms";

export const MyActions = ({
  actions,
  paginationMeta,
}: {
  actions: VotesTableI[];
  paginationMeta: PaginationMeta;
}) => {
  const t = useTranslations("MyActions");
  const { updateQueryParams } = useManageQueryParams();
  const [searchText, setSearchText] = useState<string>("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [chosenFilters, setChosenFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [sortOpen, setSortOpen] = useState(false);
  const [chosenSorting, setChosenSorting] = useState<string>("");
  const { openModal } = useModal<OpenPreviewReasoningModal>();

  const openReasoningModal = (action: VotesTableI) => {
    openModal({
      type: "previewReasoningModal",
      state: {
        govAction: {
          id: action.gov_action_proposal_id,
          tx_hash: action.gov_action_proposal_tx_hash,
          type: action.gov_action_proposal_type,
          submit_time: null, //todo, update BE response
          end_time: action.gov_action_proposal_end_time,
          vote_submit_time: action.vote_submit_time,
          vote: action.value,
        },
      },
    });
  };

  const params: Record<string, string | null> = {
    search: searchText || null,
    govActionType:
      chosenFilters.govActionType?.length > 0
        ? chosenFilters.govActionType?.join(",")
        : null,
    vote: chosenFilters.vote?.length > 0 ? chosenFilters.vote?.join(",") : null,
    sortBy: chosenSorting || null,
  };

  const { data, pagination, isLoading, loadMore } = usePagination(
    actions,
    paginationMeta,
    (page) => getUserVotes({ page, ...params })
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
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={{ xs: "left", md: "center" }}
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
            sortOptions={LATEST_UPDATES_SORTING}
            filterOptions={LATEST_UPDATES_FILTERS}
          />
        </Box>
      </Box>
      {isEmpty(data) ? (
        <NotFound
          height="55vh"
          title="myActions.title"
          description="myActions.description"
        />
      ) : (
        <>
          <VotesTable
            votes={data}
            actionTitle={t("actionTitle")}
            onActionClick={(action) => openReasoningModal(action)}
            //  isDisabled={(data) => data.gov_action_proposal_status !== "ACTIVE"}
          />
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
