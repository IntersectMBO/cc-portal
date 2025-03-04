"use client";

import { useModal } from "@/context";
import { getVotingUpdates } from "@/lib/api";
import { PaginationMeta, VotesTableI } from "@/lib/requests";
import { ShowMoreButton, Typography } from "@atoms";
import { VOTING_UPDATES_FILTERS, VOTING_UPDATES_SORTING } from "@consts";
import { useManageQueryParams, usePagination } from "@hooks";
import { Box } from "@mui/material";
import { countSelectedFilters, isEmpty } from "@utils";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { DataActionsBar } from "../molecules";
import { NotFound } from "./NotFound";
import { OpenPreviewReasoningModal } from "./types";
import { VotesTable } from "./VotesTable";

export const VotingUpdates = ({
  votingUpdates,
  paginationMeta,
  error,
}: {
  votingUpdates: VotesTableI[];
  paginationMeta: PaginationMeta;
  error?: string;
}) => {
  const t = useTranslations("VotingUpdates");
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
          vote: action.value,
          reasoning_title: action.reasoning_title,
          rationale_url: action.rationale_url,
          status: action.gov_action_proposal_status,
          title: action.gov_action_proposal_title,
        },
      },
    });
  };
  const params: Record<string, string | null> = {
    search: searchText || null,
    govActionType:
      chosenFilters.govActionType?.length > 0
        ? chosenFilters.govActionType.join(",")
        : null,
    vote: chosenFilters.vote?.length > 0 ? chosenFilters.vote.join(",") : null,
    sortBy: chosenSorting || null,
    voteMetadataUrl:
      chosenFilters.voteMetadataUrl?.length === 1
        ? chosenFilters.voteMetadataUrl[0]
        : null,
  };
  
  const { data, pagination, isLoading, loadMore } = usePagination(
    votingUpdates,
    paginationMeta,
    (page) => getVotingUpdates({ page, ...params })
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
        justifyContent="space-between"
        flexDirection={{ xxs: "column", md: "row" }}
        alignItems={{ xxs: "left", md: "center" }}
      >
        <Typography variant="headline4">{t("title")}</Typography>
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
            sortOptions={VOTING_UPDATES_SORTING}
            filterOptions={VOTING_UPDATES_FILTERS}
          />
        </Box>
      </Box>
      {isEmpty(data) || error ? (
        <NotFound
          height="50vh"
          title="votingUpdates.title"
          description="votingUpdates.description"
        />
      ) : (
        <Box display="flex" flexDirection="column" gap={4}>
          <VotesTable
            votes={data}
            actionTitle={t("actionTitle")}
            onActionClick={(action) => openReasoningModal(action)}
          />
          <ShowMoreButton
            isLoading={isLoading}
            hasNextPage={pagination.has_next_page}
            callBack={loadMore}
          />
        </Box>
      )}
    </Box>
  );
};
